import uuid

from sqlalchemy import BigInteger, Column, DateTime, Integer, String, text
from sqlalchemy.sql import func

from app.database.database import Base


class Attendance(Base):
    """Mirrors the `attendance` table from the legacy tecsoui_tops_aman schema,
    trimmed to the columns the trainee check-in flow currently uses."""

    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    attendanceUid = Column(
        String(100), unique=True, default=lambda: uuid.uuid4().hex
    )
    conferenceUid = Column(String(100), nullable=False, index=True)
    trainerUid = Column(String(100))
    traineeUid = Column(String(100), nullable=False, index=True)
    phone = Column(BigInteger)

    markedOn = Column(String(50))
    status = Column(String(100), nullable=False, server_default=text("'Pending'"))
    checkInDistance = Column(String(50))
    checkInPhoto = Column(String(255))
    checkOutTime = Column(DateTime)

    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
