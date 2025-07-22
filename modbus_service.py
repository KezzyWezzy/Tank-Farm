from pymodbus.client import AsyncModbusTcpClient
from utils.database import get_db_connection
from datetime import datetime
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)

async def get_tank_data(tank_id: str):
    with get_db_connection() as conn:
        settings = conn.execute(
            "SELECT * FROM modbus_settings WHERE tank_id = %s", (tank_id,)
        ).fetchone()
        if not settings:
            logger.warning(f"No Modbus settings found for tank_id: {tank_id}")
            return {
                "tank_id": tank_id,
                "registers": {"level": 50.0, "temperature": 25.0, "pressure": 6.0, "status": 0},
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        # ... (rest of the function remains the same, assuming Modbus logic is correct)
        client = AsyncModbusTcpClient(settings['ip_address'], port=settings['port'], timeout=3)
        try:
            logger.info(f"Connecting to Modbus server for {tank_id} at {settings['ip_address']}:{settings['port']}...")
            if not await client.connect():
                logger.error("Modbus connection failed")
                return {
                    "tank_id": tank_id,
                    "registers": {"level": 50.0, "temperature": 25.0, "pressure": 6.0, "status": 0},
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "error": "Modbus connection failed"
                }
            level = await client.read_holding_registers(address=settings['level_register'], count=1, unit=settings['unit_id'])
            temperature = await client.read_holding_registers(address=settings['temperature_register'], count=1, unit=settings['unit_id'])
            pressure = await client.read_holding_registers(address=settings['pressure_register'], count=1, unit=settings['unit_id'])
            status = await client.read_holding_registers(address=settings['status_register'], count=1, unit=settings['unit_id'])
            if any(r.isError() for r in [level, temperature, pressure, status]):
                logger.error(f"Modbus read error for {tank_id}")
                return {
                    "tank_id": tank_id,
                    "registers": {"level": 50.0, "temperature": 25.0, "pressure": 6.0, "status": 0},
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "error": "Modbus read error"
                }
            logger.info("Modbus data read successfully")
            return {
                "tank_id": tank_id,
                "registers": {
                    "level": level.registers[0] / 100.0,
                    "temperature": temperature.registers[0] / 10.0,
                    "pressure": pressure.registers[0] / 100.0,
                    "status": status.registers[0]
                },
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        except Exception as e:
            logger.error(f"Error fetching tank data for {tank_id}: {str(e)}")
            return {
                "tank_id": tank_id,
                "registers": {"level": 50.0, "temperature": 25.0, "pressure": 6.0, "status": 0},
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "error": str(e)
            }
        finally:
            if client.connected:
                await client.close()

async def get_modbus_settings():
    with get_db_connection() as conn:
        settings = conn.execute("SELECT * FROM modbus_settings").fetchall()
        return [dict(zip(['tank_id', 'ip_address', 'port', 'unit_id', 'level_register', 'temperature_register', 'pressure_register', 'status_register'], row)) for row in settings]

async def get_modbus_settings_by_tank(tank_id: str):
    with get_db_connection() as conn:
        settings = conn.execute("SELECT * FROM modbus_settings WHERE tank_id = %s", (tank_id,)).fetchone()
        if not settings:
            logger.warning(f"No Modbus settings found for tank_id: {tank_id}")
            raise HTTPException(status_code=404, detail=f"No settings found for tank {tank_id}")
        # Convert tuple to dict using column names
        column_names = ['tank_id', 'ip_address', 'port', 'unit_id', 'level_register', 'temperature_register', 'pressure_register', 'status_register']
        return dict(zip(column_names, settings))

async def save_modbus_settings(settings):
    with get_db_connection() as conn:
        conn.execute(
            text("""
            INSERT INTO modbus_settings (tank_id, ip_address, port, unit_id, level_register, temperature_register, pressure_register, status_register)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (tank_id) DO UPDATE
            SET ip_address = EXCLUDED.ip_address,
                port = EXCLUDED.port,
                unit_id = EXCLUDED.unit_id,
                level_register = EXCLUDED.level_register,
                temperature_register = EXCLUDED.temperature_register,
                pressure_register = EXCLUDED.pressure_register,
                status_register = EXCLUDED.status_register
            """),
            (settings.tank_id, settings.ip_address, settings.port, settings.unit_id,
             settings.level_register, settings.temperature_register, settings.pressure_register,
             settings.status_register)
        )
        conn.commit()
        return {"message": f"Settings saved for tank {settings.tank_id}"}