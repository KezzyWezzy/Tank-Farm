from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.modbus_service import get_tank_data, get_modbus_settings, get_modbus_settings_by_tank, save_modbus_settings
from utils.database import get_db_connection
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ModbusSettings(BaseModel):
    tank_id: str
    ip_address: str
    port: int
    unit_id: int
    level_register: int
    temperature_register: int
    pressure_register: int
    status_register: int

@router.get("/tank-data/{tank_id}")
async def get_tank_data_route(tank_id: str):
    if tank_id == "all":
        with get_db_connection() as conn:
            tanks = conn.execute(text("SELECT tank_id FROM modbus_settings")).fetchall()
            result = []
            for tank in tanks:
                data = await get_tank_data(tank['tank_id'])
                if data:
                    result.append(data)
            return result
    else:
        data = await get_tank_data(tank_id)
        if not data:
            logger.warning(f"No data found for tank_id: {tank_id}")
            raise HTTPException(status_code=404, detail="No data found for tank")
        return data

@router.get("/tank-data/all")
async def get_all_tank_data():
    with get_db_connection() as conn:
        settings_list = conn.execute("SELECT tank_id FROM modbus_settings").fetchall()
        if not settings_list:
            return []
        tank_data = []
        for settings in settings_list:
            tank_id = settings['tank_id']
            data = await get_tank_data(tank_id)
            if data:
                tank_data.append(data)
        return tank_data

@router.get("/settings", response_model=List[ModbusSettings])
async def get_modbus_settings_route():
    settings = await get_modbus_settings()
    if not settings:
        return []
    return settings

@router.get("/settings/{tank_id}", response_model=ModbusSettings)
async def get_modbus_settings_by_tank_route(tank_id: str):
    settings = await get_modbus_settings_by_tank(tank_id)
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found for tank")
    return settings

@router.post("/settings")
async def save_modbus_settings_route(settings: ModbusSettings):
    return await save_modbus_settings(settings)