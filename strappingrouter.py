from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
import logging
import pandas as pd
import numpy as np
from sqlalchemy import text
from utils.database import get_db_connection
from datetime import datetime

strapping_router = APIRouter()
logger = logging.getLogger(__name__)

class StrappingChartRetrieve(BaseModel):
    tank_id: str

class InfraredScanCreate(BaseModel):
    tank_id: str
    scan_datetime: str
    liquid_height_m: float
    ambient_temp_c: float = 0.0
    technician: str = "Unknown"
    conditions: str = "Unknown"
    notes: str = ""

class ReportRequest(BaseModel):
    tank_id: str
    start_date: str
    end_date: str

@strapping_router.post("/strapping-charts/retrieve")
async def retrieve_strapping_chart(request: StrappingChartRetrieve):
    with get_db_connection() as session:
        result = session.execute(
            text("SELECT liquid_height_m, volume_barrels FROM strapping_charts WHERE LOWER(tank_id) = :tank_id ORDER BY liquid_height_m"),
            {"tank_id": request.tank_id.lower()}
        ).mappings().all()
        if not result:
            raise HTTPException(status_code=404, detail="No strapping chart found for this tank")
        return list(result)

@strapping_router.post("/infrared-scans")
async def create_infrared_scan(request: InfraredScanCreate):
    with get_db_connection() as session:
        prev_scan = session.execute(
            text("SELECT volume_barrels FROM infrared_scans WHERE LOWER(tank_id) = :tank_id ORDER BY scan_datetime DESC LIMIT 1"),
            {"tank_id": request.tank_id.lower()}
        ).fetchone()
        prev_volume = float(prev_scan[0]) if prev_scan else 0.0

        strapping = session.execute(
            text("SELECT liquid_height_m, volume_barrels FROM strapping_charts WHERE LOWER(tank_id) = :tank_id ORDER BY liquid_height_m"),
            {"tank_id": request.tank_id.lower()}
        ).fetchall()

        df = pd.DataFrame(strapping, columns=['liquid_height_m', 'volume_barrels'])
        df = df.apply(pd.to_numeric, errors='coerce')
        df.dropna(inplace=True)
        df = df.drop_duplicates(subset='liquid_height_m')
        df = df.sort_values('liquid_height_m')

        if df.empty or len(df) < 2:
            raise HTTPException(status_code=400, detail="No valid numeric strapping data found after cleanup")

        volume = float(np.interp(request.liquid_height_m, df['liquid_height_m'], df['volume_barrels']))
        volume_pulled = float(prev_volume - volume if prev_volume > volume else 0.0)

        session.execute(
            text("""
                INSERT INTO infrared_scans (
                    tank_id, scan_datetime, liquid_height_m, volume_barrels,
                    ambient_temp_c, technician, conditions, notes,
                    previous_volume_barrels, volume_pulled_barrels
                )
                VALUES (
                    :tank_id, :scan_datetime, :liquid_height_m, :volume,
                    :ambient_temp_c, :technician, :conditions, :notes,
                    :prev_volume, :volume_pulled
                )
            """),
            {
                "tank_id": request.tank_id,
                "scan_datetime": request.scan_datetime,
                "liquid_height_m": float(request.liquid_height_m),
                "volume": volume,
                "ambient_temp_c": float(request.ambient_temp_c),
                "technician": request.technician,
                "conditions": request.conditions,
                "notes": request.notes,
                "prev_volume": prev_volume,
                "volume_pulled": volume_pulled
            }
        )
        session.commit()
        return {"message": "Scan added!", "volume_barrels": volume}

@strapping_router.post("/infrared-scans/report")
async def get_scan_report(request: ReportRequest):
    try:
        start = datetime.fromisoformat(request.start_date)
        if start.time() == datetime.min.time():
            start = start.replace(hour=0, minute=0, second=0)
        end = datetime.fromisoformat(request.end_date)
        if end.time() == datetime.min.time():
            end = end.replace(hour=23, minute=59, second=59)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid start or end date format")

    with get_db_connection() as session:
        result = session.execute(
            text("""
                SELECT * FROM infrared_scans
                WHERE LOWER(tank_id) = :tank_id
                AND scan_datetime BETWEEN :start_date AND :end_date
                ORDER BY scan_datetime
            """),
            {
                "tank_id": request.tank_id.lower().lower(),
                "start_date": start.isoformat(),
                "end_date": end.isoformat()
            }
        ).mappings().all()

        if not result:
            logger.warning(f"No scans found for {request.tank_id.lower()} from {start} to {end}")
            raise HTTPException(status_code=404, detail="No scans found for this tank and date range")

        rows = list(result)
        header = "id,tank_id,scan_datetime,liquid_height_m,volume_barrels,ambient_temp_c,technician,conditions,notes,previous_volume_barrels,volume_pulled_barrels"
        return '\n'.join([header] + [','.join(str(v) for v in row.values()) for row in rows])
@strapping_router.post("/strapping-charts/upload")
async def upload_strapping_chart(tank_id: str = Form(...), file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(pd.compat.StringIO(contents.decode("utf-8")))
        if 'liquid_height_m' not in df.columns or 'volume_barrels' not in df.columns:
            raise HTTPException(status_code=400, detail="CSV must have 'liquid_height_m' and 'volume_barrels' columns")

        df = df[['liquid_height_m', 'volume_barrels']].dropna()
        with get_db_connection() as session:
            for _, row in df.iterrows():
                session.execute(
                    text("""
                        INSERT INTO strapping_charts (tank_id, liquid_height_m, volume_barrels)
                        VALUES (:tank_id, :liquid_height_m, :volume_barrels)
                        ON CONFLICT DO NOTHING
                    """),
                    {
                        "tank_id": tank_id,
                        "liquid_height_m": float(row['liquid_height_m']),
                        "volume_barrels": float(row['volume_barrels'])
                    }
                )
            session.commit()
        return {"message": "Strapping chart uploaded", "count": len(df)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CSV: {str(e)}")