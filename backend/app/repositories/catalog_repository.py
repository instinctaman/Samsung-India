from typing import Optional

from sqlalchemy.orm import Session

from app.models.category import SubCategory
from app.models.venue import Venue


def list_venues(db: Session, district: Optional[str] = None) -> list[Venue]:
    query = db.query(Venue).filter(Venue.status == "Approved")
    if district:
        query = query.filter(Venue.district == district)
    return query.order_by(Venue.name).all()


def get_venues_by_uids(db: Session, venue_uids: set[str]) -> list[Venue]:
    if not venue_uids:
        return []
    return db.query(Venue).filter(Venue.venueUid.in_(venue_uids)).all()


def get_venue_by_uid(db: Session, venue_uid: str) -> Optional[Venue]:
    return db.query(Venue).filter(Venue.venueUid == venue_uid).first()


def list_checklist_items(db: Session) -> list[SubCategory]:
    return (
        db.query(SubCategory)
        .filter(SubCategory.status == "Approved")
        .order_by(SubCategory.subCategory)
        .all()
    )
