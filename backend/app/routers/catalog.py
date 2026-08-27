from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.database.database import get_db
from app.models.admin import Admin
from app.models.category import SubCategory
from app.models.venue import Venue
from app.schemas.catalog import SelectOptionOut

router = APIRouter(prefix="/admin", tags=["catalog"])


@router.get("/venues", response_model=list[SelectOptionOut])
def list_venues(
    district: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    """Powers the Add Training form's Venue picker, gated on District."""
    query = db.query(Venue).filter(Venue.status == "Approved")
    if district:
        query = query.filter(Venue.district == district)
    venues = query.order_by(Venue.name).all()
    return [SelectOptionOut(label=v.name, value=v.venueUid) for v in venues]


@router.get("/checklist-items", response_model=list[SelectOptionOut])
def list_checklist_items(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    """Powers the Add Training form's Checklist picker. Values are
    `subCategoryUid`s - `conference.checklistUid` stores a comma-separated
    list of these (see that column's comment in the schema)."""
    items = (
        db.query(SubCategory)
        .filter(SubCategory.status == "Approved")
        .order_by(SubCategory.subCategory)
        .all()
    )
    return [SelectOptionOut(label=i.subCategory, value=i.subCategoryUid) for i in items]
