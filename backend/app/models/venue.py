import uuid

from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Venue(Base):
    """Mirrors the real `venue` table (mmtbtwob_tops), trimmed to the
    columns the Add Training form's Venue picker needs."""

    __tablename__ = "venue"

    id = Column(Integer, primary_key=True, index=True)

    venueUid = Column(
        String(100), unique=True, nullable=True, default=lambda: uuid.uuid4().hex
    )

    name = Column(String(100))
    zone = Column(String(50))
    region = Column(String(50))
    company = Column(String(100))
    city = Column(String(100))
    district = Column(String(100))
    state = Column(String(100))
    venueType = Column(String(100))
    status = Column(String(50), nullable=False, default="Pending")
