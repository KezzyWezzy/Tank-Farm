import logging
from utils.database import get_db_connection

logger = logging.getLogger(__name__)

async def calculate_barrel_count(tank_id: str, level: float, density: float):
    with get_db_connection() as conn:
        strapping = conn.execute(
            """
            SELECT volume FROM strapping_tables 
            WHERE tank_id = %s AND level <= %s 
            ORDER BY level DESC LIMIT 1
            """, (tank_id, level)
        ).fetchone()
        if not strapping:
            logger.warning(f"No strapping table entry found for tank_id: {tank_id}, level: {level}")
            return 0.0
        volume_m3 = strapping['volume']
        barrels = volume_m3 * 6.28981 * (density / 850.0)  # Normalize density relative to standard (850 kg/m³)
        return round(barrels, 2)