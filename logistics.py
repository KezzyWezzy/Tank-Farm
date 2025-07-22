from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, validator
from typing import Dict, Optional, List
from utils.database import get_db_connection
from services.strapping_service import calculate_barrel_count
import logging
from datetime import datetime
from sqlalchemy import text
import json

logger = logging.getLogger(__name__)

router = APIRouter()

class BOLMessage(BaseModel):
    shipment_id: int
    details: Dict
    status: Optional[str] = "pending"
    created_at: Optional[str] = None

    @validator('shipment_id')
    def shipment_id_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('shipment_id must be a positive integer')
        return v

# ... (other models remain unchanged)

@router.post("/bol-messages")
async def create_bol_message(bol_message: BOLMessage):
    with get_db_connection() as conn:
        try:
            created_at = bol_message.created_at or datetime.utcnow().isoformat() + "Z"
            conn.execute(
                text("INSERT INTO bol_messages (shipment_id, details, status, created_at) VALUES (:shipment_id, :details, :status, :created_at)"),
                {"shipment_id": bol_message.shipment_id, "details": json.dumps(bol_message.details), "status": bol_message.status, "created_at": created_at}
            )
            conn.commit()
            return {"message": f"BOL created for shipment {bol_message.shipment_id}"}
        except Exception as e:
            logger.error(f"Error creating BOL message: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to create BOL message")
        finally:
            conn.close()

@router.get("/bol-messages")
async def get_bol_messages():
    with get_db_connection() as conn:
        try:
            bol_messages = conn.execute(text("SELECT * FROM bol_messages")).fetchall()
            return [dict(bol_message) for bol_message in bol_messages] if bol_messages else []
        except Exception as e:
            logger.error(f"Error fetching BOL messages: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to fetch BOL messages")
        finally:
            conn.close()

@router.put("/bol-messages/{shipment_id}")
async def update_bol_message(shipment_id: int, bol_message: BOLMessage):
    with get_db_connection() as conn:
        try:
            existing_bol = conn.execute(text("SELECT * FROM bol_messages WHERE shipment_id = :shipment_id"), {"shipment_id": shipment_id}).fetchone()
            if not existing_bol:
                raise HTTPException(status_code=404, detail=f"BOL not found for shipment {shipment_id}")

            updated_details = json.dumps(bol_message.details) if bol_message.details else existing_bol['details']
            updated_status = bol_message.status or existing_bol['status']
            updated_created_at = bol_message.created_at or existing_bol['created_at']

            conn.execute(
                text("""
                UPDATE bol_messages 
                SET details = :details, status = :status, created_at = :created_at 
                WHERE shipment_id = :shipment_id
                """),
                {"details": updated_details, "status": updated_status, "created_at": updated_created_at, "shipment_id": shipment_id}
            )
            conn.commit()
            return {"message": f"BOL updated for shipment {shipment_id}"}
        except HTTPException as he:
            raise he
        except Exception as e:
            logger.error(f"Error updating BOL for shipment {shipment_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to update BOL")
        finally:
            conn.close()

@router.delete("/bol-messages/{shipment_id}")
async def delete_bol_message(shipment_id: int):
    with get_db_connection() as conn:
        try:
            existing_bol = conn.execute(text("SELECT * FROM bol_messages WHERE shipment_id = :shipment_id"), {"shipment_id": shipment_id}).fetchone()
            if not existing_bol:
                raise HTTPException(status_code=404, detail=f"BOL not found for shipment {shipment_id}")
            conn.execute(text("DELETE FROM bol_messages WHERE shipment_id = :shipment_id"), {"shipment_id": shipment_id})
            conn.commit()
            return {"message": f"BOL deleted for shipment {shipment_id}"}
        except HTTPException as he:
            raise he
        except Exception as e:
            logger.error(f"Error deleting BOL for shipment {shipment_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to delete BOL")
        finally:
            conn.close()

# ... (other endpoints remain unchanged)