from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import modbus, logistics, strappingrouter  # Ensure strappingrouter is importable

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(modbus.router, prefix="/modbus")
app.include_router(logistics.router, prefix="/logistics")
app.include_router(strappingrouter.strapping_router, prefix="/strapping")  # Confirm this line

@app.get("/")
async def root():
    return {"message": "Tank Gauge System API"}