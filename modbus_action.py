# routes/modbus_action.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.modbus_service import get_tank_data, get_modbus_settings, get_modbus_settings_by_tank, save_modbus_settings
from database import get_db
from auth import require_role
from sqlalchemy.ext.asyncio import AsyncSession

modbus_router = APIRouter()  # Renamed from router to modbus_router

class ModbusActionPayload(BaseModel):
    action: str
    tank_id: Optional[str] = None
    data: Optional[dict] = None

@modbus_router.post("/modbus_action", dependencies=[Depends(require_role("operator"))])
async def handle_modbus_action(
    payload: ModbusActionPayload,
    db: AsyncSession = Depends(get_db)
):
    try:
        if payload.action == "get_tank_data":
            if not payload.tank_id:
                raise HTTPException(status_code=422, detail="tank_id is required")
            return await get_tank_data(payload.tank_id)
        elif payload.action == "get_all_tank_data":
            settings = await db.execute("SELECT tank_id FROM modbus_settings")
            tank_data = []
            for setting in settings.fetchall():
                data = await get_tank_data(setting[0])
                if data:
                    tank_data.append(data)
            return tank_data
        elif payload.action == "get_modbus_settings":
            return await get_modbus_settings()
        elif payload.action == "get_modbus_settings_by_tank":
            if not payload.tank_id:
                raise HTTPException(status_code=422, detail="tank_id is required")
            return await get_modbus_settings_by_tank(payload.tank_id)
        elif payload.action == "save_modbus_settings":
            if not payload.data:
                raise HTTPException(status_code=422, detail="data is required")
            return await save_modbus_settings(payload.data)
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))