from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.admin import Admin
from app.schemas.catalog import SelectOptionOut
from app.services import catalog_service

router = APIRouter(prefix="/admin", tags=["catalog"])


@router.get("/venues", response_model=list[SelectOptionOut])
def list_venues(
    district: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    return catalog_service.list_venues(db, district)


@router.get("/checklist-items", response_model=list[SelectOptionOut])
def list_checklist_items(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    return catalog_service.list_checklist_items(db)
