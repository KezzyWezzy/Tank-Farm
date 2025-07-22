# routes/logistics_action.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from database import get_db
from auth import require_role
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import json
from datetime import datetime

logistics_router = APIRouter()

class LogisticsActionPayload(BaseModel):
    action: str
    shipment_id: Optional[int] = None
    data: Optional[Dict] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

@logistics_router.post("/logistics_action", dependencies=[Depends(require_role("operator"))])
async def handle_logistics_action(
    payload: LogisticsActionPayload,
    db: AsyncSession = Depends(get_db)
):
    try:
        if payload.action == "create_bol_message":
            if not payload.data:
                raise HTTPException(status_code=422, detail="data is required")
            created_at = payload.data.get("created_at", datetime.utcnow().isoformat() + "Z")
            await db.execute(
                text("INSERT INTO bol_messages (shipment_id, details, status, created_at) VALUES (:shipment_id, :details, :status, :created_at)"),
                {"shipment_id": payload.data["shipment_id"], "details": json.dumps(payload.data.get("details", {})), "status": payload.data.get("status", "pending"), "created_at": created_at}
            )
            await db.commit()
            return {"message": f"BOL created for shipment {payload.data['shipment_id']}"}
        elif payload.action == "get_bol_messages":
            result = await db.execute(text("SELECT * FROM bol_messages"))
            return [dict(row) for row in result.fetchall()] if result.rowcount else []
        elif payload.action == "update_bol_message":
            if not payload.shipment_id or not payload.data:
                raise HTTPException(status_code=422, detail="shipment_id and data are required")
            existing_bol = await db.execute(text("SELECT * FROM bol_messages WHERE shipment_id = :shipment_id"), {"shipment_id": payload.shipment_id})
            if not existing_bol.fetchone():
                raise HTTPException(status_code=404, detail=f"BOL not found for shipment {payload.shipment_id}")
            updated_details = json.dumps(payload.data.get("details", {}))
            updated_status = payload.data.get("status", "pending")
            updated_created_at = payload.data.get("created_at", datetime.utcnow().isoformat() + "Z")
            await db.execute(
                text("""
                    UPDATE bol_messages 
                    SET details = :details, status = :status, created_at = :created_at 
                    WHERE shipment_id = :shipment_id
                """),
                {"details": updated_details, "status": updated_status, "created_at": updated_created_at, "shipment_id": payload.shipment_id}
            )
            await db.commit()
            return {"message": f"BOL updated for shipment {payload.shipment_id}"}
        elif payload.action == "delete_bol_message":
            if not payload.shipment_id:
                raise HTTPException(status_code=422, detail="shipment_id is required")
            existing_bol = await db.execute(text("SELECT * FROM bol_messages WHERE shipment_id = :shipment_id"), {"shipment_id": payload.shipment_id})
            if not existing_bol.fetchone():
                raise HTTPException(status_code=404, detail=f"BOL not found for shipment {payload.shipment_id}")
            await db.execute(text("DELETE FROM bol_messages WHERE shipment_id = :shipment_id"), {"shipment_id": payload.shipment_id})
            await db.commit()
            return {"message": f"BOL deleted for shipment {payload.shipment_id}"}
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))