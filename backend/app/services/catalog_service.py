from typing import Optional

from sqlalchemy.orm import Session

from app.repositories import catalog_repository
from app.schemas.catalog import SelectOptionOut


def list_venues(db: Session, district: Optional[str]) -> list[SelectOptionOut]:
    """Powers the Add Training form's Venue picker, gated on District."""
    venues = catalog_repository.list_venues(db, district)
    return [SelectOptionOut(label=v.name, value=v.venueUid) for v in venues]


def list_checklist_items(db: Session) -> list[SelectOptionOut]:
    """Powers the Add Training form's Checklist picker. Values are
    `subCategoryUid`s - `conference.checklistUid` stores a comma-separated
    list of these (see that column's comment in the schema)."""
    items = catalog_repository.list_checklist_items(db)
    return [SelectOptionOut(label=i.subCategory, value=i.subCategoryUid) for i in items]
