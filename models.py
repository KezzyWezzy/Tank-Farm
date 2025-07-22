from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class BOLLog(Base):
    __tablename__ = "bol_logs"
    id = Column(Integer, primary_key=True, index=True)
    product = Column(String)
    quantity = Column(Float)
    destination = Column(String)
    timestamp = Column(DateTime)

class TankData(Base):
    __tablename__ = "tank_data"
    id = Column(Integer, primary_key=True, index=True)
    tank_id = Column(Integer)
    level = Column(Float)
    temperature = Column(Float)
    pressure = Column(Float)
    timestamp = Column(DateTime)

class StrappingTable(Base):
    __tablename__ = "strapping_tables"
    id = Column(Integer, primary_key=True, index=True)
    tank_id = Column(Integer)
    level = Column(Float)
    volume = Column(Float)
    timestamp = Column(DateTime)

class WeightScaleData(Base):
    __tablename__ = "weight_scale_data"
    id = Column(Integer, primary_key=True, index=True)
    scale_id = Column(Integer)
    weight = Column(Float)
    timestamp = Column(DateTime)

class BlendingLog(Base):
    __tablename__ = "blending_logs"
    id = Column(Integer, primary_key=True, index=True)
    blend_id = Column(Integer)
    product_type = Column(String)
    ratio = Column(Float)
    result_density = Column(Float)
    timestamp = Column(DateTime)

class BargeLoadingLog(Base):
    __tablename__ = "barge_loading_logs"
    id = Column(Integer, primary_key=True, index=True)
    barge_id = Column(Integer)
    volume = Column(Float)
    flow_rate = Column(Float)
    timestamp = Column(DateTime)

class TankTransferLog(Base):
    __tablename__ = "tank_transfer_logs"
    id = Column(Integer, primary_key=True, index=True)
    source_tank_id = Column(Integer)
    dest_tank_id = Column(Integer)
    volume = Column(Float)
    timestamp = Column(DateTime)