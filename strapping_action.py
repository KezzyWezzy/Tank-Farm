# routes/strapping_action.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional
import logging
import pandas as pd
import numpy as np
from database import get_db
from auth import require_role
from services.strapping_service import calculate_barrel_count
from datetime import datetime

strapping_router = APIRouter()  # Renamed from router to strapping_router
logger = logging.getLogger(__name__)

class StrappingActionPayload(BaseModel):
    action: str
    tank_id: Optional[str] = None
    level: Optional[float] = None
    density: Optional[float] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    file: Optional[UploadFile] = None

@strapping_router.post("/strapping_action", dependencies=[Depends(require_role("operator"))])
async def handle_strapping_action(
    payload: StrappingActionPayload,
    db: AsyncSession = Depends(get_db)
):
    try:
        if payload.action == "calculate_barrel_count":
            if not payload.tank_id or payload.level is None or payload.density is None:
                raise HTTPException(status_code=422, detail="tank_id, level, and density are required")
            barrels = await calculate_barrel_count(payload.tank_id, payload.level, payload.density)
            return {"barrels": barrels}
        elif payload.action == "retrieve":
            if not payload.tank_id:
                raise HTTPException(status_code=422, detail="tank_id is required")
            result = await db.execute(
                text("SELECT liquid_height_m, volume_barrels FROM strapping_charts WHERE LOWER(tank_id) = :tank_id ORDER BY liquid_height_m"),
                {"tank_id": payload.tank_id.lower()}
            )
            return list(result.mappings().all())
        elif payload.action == "upload":
            if not payload.file:
                raise HTTPException(status_code=422, detail="file is required")
            contents = await payload.file.read()
            df = pd.read_csv(pd.compat.StringIO(contents.decode("utf-8")))
            if 'liquid_height_m' not in df.columns or 'volume_barrels' not in df.columns:
                raise HTTPException(status_code=400, detail="CSV must have 'liquid_height_m' and 'volume_barrels' columns")
            df = df[['liquid_height_m', 'volume_barrels']].dropna()
            for _, row in df.iterrows():
                await db.execute(
                    text("""
                        INSERT INTO strapping_charts (tank_id, liquid_height_m, volume_barrels)
                        VALUES (:tank_id, :liquid_height_m, :volume_barrels)
                        ON CONFLICT DO NOTHING
                    """),
                    {"tank_id": payload.tank_id, "liquid_height_m": float(row['liquid_height_m']), "volume_barrels": float(row['volume_barrels'])}
                )
            await db.commit()
            return {"message": "Strapping chart uploaded", "count": len(df)}
        elif payload.action == "report":
            if not payload.tank_id or not payload.start_date or not payload.end_date:
                raise HTTPException(status_code=422, detail="tank_id, start_date, and end_date are required")
            start = datetime.fromisoformat(payload.start_date.replace('Z', '+00:00'))
            end = datetime.fromisoformat(payload.end_date.replace('Z', '+00:00'))
            result = await db.execute(
                text("""
                    SELECT * FROM infrared_scans
                    WHERE LOWER(tank_id) = :tank_id
                    AND scan_datetime BETWEEN :start_date AND :end_date
                    ORDER BY scan_datetime
                """),
                {"tank_id": payload.tank_id.lower(), "start_date": start, "end_date": end}
            )
            rows = list(result.mappings().all())
            if not rows:
                raise HTTPException(status_code=404, detail="No scans found")
            header = "id,tank_id,scan_datetime,liquid_height_m,volume_barrels,ambient_temp_c,technician,conditions,notes,previous_volume_barrels,volume_pulled_barrels"
            return '\n'.join([header] + [','.join(str(v) for v in row.values()) for row in rows])
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
    except Exception as e:
        logger.error(f"Strapping action error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))