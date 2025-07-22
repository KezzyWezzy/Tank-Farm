# routes/action.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_, func
from typing import Optional, Dict, Type
from pydantic import BaseModel, Field, validator
from database import get_db
from auth import require_role
from dateutil.parser import parse as parse_date
import importlib

# Dynamically import resource_mapping
resource_module = importlib.import_module("resource_mapping")
resource_map = resource_module.resource_map
VALID_RESOURCES = resource_module.VALID_RESOURCES
custom_handlers = getattr(resource_module, "custom_handlers", {})

router = APIRouter()

class ActionPayload(BaseModel):
    resource: str  # No Literal constraint here
    action: str
    skip: Optional[int] = 0
    limit: Optional[int] = Field(default=100, le=1000)
    id: Optional[int] = None
    data: Optional[Dict] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

    @validator("resource")
    def validate_resource(cls, v):
        if v not in VALID_RESOURCES:
            raise ValueError(f"Resource must be one of {VALID_RESOURCES}")
        return v

@router.post("/action", dependencies=[Depends(require_role("operator"))])
async def handle_action(
    payload: ActionPayload,
    db: AsyncSession = Depends(get_db)
):
    def apply_date_filter(query, model: Type):
        conditions = []
        if payload.start_date:
            try:
                start_dt = parse_date(payload.start_date)
                conditions.append(model.timestamp >= start_dt)
            except:
                raise HTTPException(status_code=400, detail="Invalid start_date")
        if payload.end_date:
            try:
                end_dt = parse_date(payload.end_date)
                conditions.append(model.timestamp <= end_dt)
            except:
                raise HTTPException(status_code=400, detail="Invalid end_date")
        if conditions:
            query = query.where(and_(*conditions))
        return query

    try:
        # Dynamically get the model from resource_map
        model = resource_map.get(payload.resource)
        if not model:
            raise HTTPException(status_code=400, detail="Invalid resource")

        if payload.action == "get":
            stmt = apply_date_filter(select(model).order_by(model.timestamp.desc()), model)
            stmt = stmt.offset(payload.skip or 0).limit(payload.limit or 100)
            result = await db.execute(stmt)
            return result.scalars().all()
        elif payload.action == "count":
            stmt = apply_date_filter(select(func.count()).select_from(model), model)
            result = await db.execute(stmt)
            return {"count": result.scalar()}
        elif payload.action == "post":
            if not payload.data:
                raise HTTPException(status_code=422, detail="Missing data")
            entry = model(**payload.data)
            db.add(entry)
            await db.commit()
            print(f"[AUDIT] {payload.action.upper()} {payload.resource} id={getattr(entry, 'id', '?')}")
            await db.refresh(entry)
            return entry
        elif payload.action == "update":
            if not payload.id or not payload.data:
                raise HTTPException(status_code=422, detail="Missing id or data")
            result = await db.execute(select(model).where(model.id == payload.id))
            entry = result.scalar_one_or_none()
            if not entry:
                raise HTTPException(status_code=404, detail="Entry not found")
            for k, v in payload.data.items():
                setattr(entry, k, v)
            await db.commit()
            await db.refresh(entry)
            return entry
        elif payload.action == "delete":
            if not payload.id:
                raise HTTPException(status_code=422, detail="Missing id")
            result = await db.execute(select(model).where(model.id == payload.id))
            entry = result.scalar_one_or_none()
            if not entry:
                raise HTTPException(status_code=404, detail="Entry not found")
            await db.delete(entry)
            await db.commit()
            return {"detail": "Deleted"}
        else:
            raise HTTPException(status_code=400, detail="Invalid action")

    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))