from sqlalchemy import Column, DateTime, Integer, Numeric, String, Text
from sqlalchemy.sql import func

from app.database.database import Base


class ConferenceActivityLog(Base):
    """Mirrors the `conference_activity_log` table from the legacy
    tecsoui_tops_aman schema - one row per module STARTED/STOPPED event,
    the source for the trainer's Execution Flow timeline."""

    __tablename__ = "conference_activity_log"

    id = Column(Integer, primary_key=True, index=True)
    conferenceUid = Column(String(100), index=True)
    moduleId = Column(String(255))
    action = Column(String(20), nullable=False)  # 'STARTED' | 'STOPPED'
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
    performedBy = Column(String(100))
    trainerLat = Column(Numeric(10, 8))
    trainerLng = Column(Numeric(11, 8))
    locationRemark = Column(Text)
