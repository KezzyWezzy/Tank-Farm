from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, JSON, PrimaryKeyConstraint
from sqlalchemy.orm import declarative_base, sessionmaker
from contextlib import contextmanager
from typing import Generator

DATABASE_URL = "postgresql://postgres:P%40ssw0rd%21@localhost:5432/tank_gauge"

engine = create_engine(DATABASE_URL, echo=True)
Session = sessionmaker(bind=engine)

Base = declarative_base()

@contextmanager
def get_db_connection() -> Generator:
    """Provide a database session as a context manager."""
    session = Session()
    try:
        yield session
    finally:
        session.close()

def init_db():
    with engine.begin() as conn:
        Base.metadata.create_all(conn)
        # Insert sample data
        conn.execute(
            """
            INSERT INTO tanks (tank_id, name, liquid_type, diameter, height, capacity_barrels)
            VALUES ('Tank_001', 'Tank 1', 'Crude Oil', 10.0, 15.0, 29562.0)
            ON CONFLICT (tank_id) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO modbus_settings (tank_id, ip_address, port, unit_id, level_register, temperature_register, pressure_register, status_register)
            VALUES ('Tank_001', '192.168.1.100', 502, 1, 40001, 40002, 40003, 40004)
            ON CONFLICT (tank_id) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO allocations (tanker_id, tank_id, quantity, oil_type)
            VALUES ('Tanker_001', 'Tank_001', 1000.0, 'Crude Oil')
            ON CONFLICT (tanker_id) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO additives (name, description, concentration)
            VALUES ('Additive_A', 'Boosts viscosity', 0.5)
            ON CONFLICT (name) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO analysis_profiles (name, oil_type, properties)
            VALUES ('Profile_001', 'Crude Oil', '{"viscosity": 10.5, "density": 850.0}'::json)
            ON CONFLICT (name) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO carriers (name, type, contact_info)
            VALUES ('Carrier_X', 'Truck', '{"phone": "555-0101", "email": "contact@carrierx.com"}'::json)
            ON CONFLICT (name) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO crude_oil_leases (lease_name, location, start_date, end_date)
            VALUES ('Lease_A', 'Texas', '2025-01-01', '2025-12-31')
            ON CONFLICT (lease_name) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO customers (name, contact_info, delivery_address)
            VALUES ('Customer_Y', '{"phone": "555-0202"}'::json, '123 Oil St')
            ON CONFLICT (name) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO destinations_origins (name, type, address)
            VALUES ('Origin_A', 'Field', 'Field Rd, Texas')
            ON CONFLICT (name) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO drivers (name, license_number, carrier_id)
            VALUES ('John Doe', 'DL12345', 1)
            ON CONFLICT (license_number) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO exstars_products (code, description)
            VALUES ('EX001', 'Crude Oil Product')
            ON CONFLICT (code) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO facility_ids (id_code, name, address)
            VALUES ('FAC001', 'Facility X', '456 Oil Ave')
            ON CONFLICT (id_code) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO products (name, type, properties)
            VALUES ('Crude Oil', 'Oil', '{"density": 850.0}'::json)
            ON CONFLICT (name) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO rail_cars (car_number, capacity, carrier_id)
            VALUES ('RC001', 1000.0, 1)
            ON CONFLICT (car_number) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO shippers (name, contact_info)
            VALUES ('Shipper_Z', '{"phone": "555-0303"}'::json)
            ON CONFLICT (name) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO tank_products (tank_id, product_id, quantity)
            VALUES ('Tank_001', 1, 1000.0)
            ON CONFLICT ON CONSTRAINT tank_products_tank_id_product_id_key DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO tracking_codes (code, shipment_id)
            VALUES ('TRK001', 1)
            ON CONFLICT (code) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO transports (vehicle_type, vehicle_number, carrier_id)
            VALUES ('Truck', 'TRK001', 1)
            ON CONFLICT (vehicle_number) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO bol_messages (shipment_id, details)
            VALUES (1, '{"status": "delivered"}'::json)
            ON CONFLICT (shipment_id) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO dot_messages (transport_id, message)
            VALUES (1, 'DOT Compliance Check')
            ON CONFLICT (transport_id) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO footnote_messages (message, exstars_product_id)
            VALUES ('Note 1', 1)
            ON CONFLICT (message) DO NOTHING;
            """
        )
        conn.execute(
            """
            INSERT INTO manual_inputs (tank_id, level, temperature, pressure, timestamp)
            VALUES ('Tank_001', 10.0, 25.0, 6.0, '2025-06-30 10:00:00')
            ON CONFLICT (id) DO NOTHING;
            """
        )
        conn.commit()

# Define all table classes (as provided earlier)
class Tank(Base):
    __tablename__ = "tanks"
    tank_id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    liquid_type = Column(String)
    diameter = Column(Float)
    height = Column(Float)
    capacity_barrels = Column(Float)

class ModbusSettings(Base):
    __tablename__ = "modbus_settings"
    tank_id = Column(String, primary_key=True, index=True)
    ip_address = Column(String)
    port = Column(Integer)
    unit_id = Column(Integer)
    level_register = Column(Integer)
    temperature_register = Column(Integer)
    pressure_register = Column(Integer)
    status_register = Column(Integer)

class Allocation(Base):
    __tablename__ = "allocations"
    tanker_id = Column(String, primary_key=True, index=True)
    tank_id = Column(String)
    quantity = Column(Float)
    oil_type = Column(String)

class Additive(Base):
    __tablename__ = "additives"
    name = Column(String, primary_key=True, index=True)
    description = Column(String)
    concentration = Column(Float)

class AnalysisProfile(Base):
    __tablename__ = "analysis_profiles"
    name = Column(String, primary_key=True, index=True)
    oil_type = Column(String)
    properties = Column(JSON)

class Carrier(Base):
    __tablename__ = "carriers"
    name = Column(String, primary_key=True, index=True)
    type = Column(String)
    contact_info = Column(JSON)

class CrudeOilLease(Base):
    __tablename__ = "crude_oil_leases"
    lease_name = Column(String, primary_key=True, index=True)
    location = Column(String)
    start_date = Column(String)
    end_date = Column(String)

class Customer(Base):
    __tablename__ = "customers"
    name = Column(String, primary_key=True, index=True)
    contact_info = Column(JSON)
    delivery_address = Column(String)

class DestinationOrigin(Base):
    __tablename__ = "destinations_origins"
    name = Column(String, primary_key=True, index=True)
    type = Column(String)
    address = Column(String)

class Driver(Base):
    __tablename__ = "drivers"
    name = Column(String)
    license_number = Column(String, primary_key=True, index=True)
    carrier_id = Column(Integer)

class ExstarsProduct(Base):
    __tablename__ = "exstars_products"
    code = Column(String, primary_key=True, index=True)
    description = Column(String)

class FacilityId(Base):
    __tablename__ = "facility_ids"
    id_code = Column(String, primary_key=True, index=True)
    name = Column(String)
    address = Column(String)

class Product(Base):
    __tablename__ = "products"
    name = Column(String, primary_key=True, index=True)
    type = Column(String)
    properties = Column(JSON)

class RailCar(Base):
    __tablename__ = "rail_cars"
    car_number = Column(String, primary_key=True, index=True)
    capacity = Column(Float)
    carrier_id = Column(Integer)

class Shipper(Base):
    __tablename__ = "shippers"
    name = Column(String, primary_key=True, index=True)
    contact_info = Column(JSON)

class TankProduct(Base):
    __tablename__ = "tank_products"
    tank_id = Column(String)
    product_id = Column(Integer)
    quantity = Column(Float)
    __table_args__ = (PrimaryKeyConstraint('tank_id', 'product_id'),)

class TrackingCode(Base):
    __tablename__ = "tracking_codes"
    code = Column(String, primary_key=True, index=True)
    shipment_id = Column(Integer)

class Transport(Base):
    __tablename__ = "transports"
    vehicle_type = Column(String)
    vehicle_number = Column(String, primary_key=True, index=True)
    carrier_id = Column(Integer)

class BOLMessage(Base):
    __tablename__ = "bol_messages"
    shipment_id = Column(Integer, primary_key=True, index=True)
    details = Column(JSON)

class DOTMessage(Base):
    __tablename__ = "dot_messages"
    transport_id = Column(Integer, primary_key=True, index=True)
    message = Column(String)

class FootnoteMessage(Base):
    __tablename__ = "footnote_messages"
    message = Column(String, primary_key=True, index=True)
    exstars_product_id = Column(Integer)

class ManualInput(Base):
    __tablename__ = "manual_inputs"
    id = Column(Integer, primary_key=True, index=True)
    tank_id = Column(String)
    level = Column(Float)
    temperature = Column(Float)
    pressure = Column(Float)
    timestamp = Column(DateTime)