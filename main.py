# main.py
from fastapi import FastAPI
from routes.action import router
from routes.strapping_action import strapping_router
from routes.modbus_action import modbus_router
from routes.logistics_action import logistics_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/core")  # Changed to /api/core
app.include_router(strapping_router, prefix="/api/strapping")
app.include_router(modbus_router, prefix="/api/modbus")
app.include_router(logistics_router, prefix="/api/logistics")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)