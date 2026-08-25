import uuid

from sqlalchemy import BigInteger, Column, DateTime, Integer, String, Text, text
from sqlalchemy.sql import func

from app.database.database import Base


class Attendance(Base):
    """Mirrors the `attendance` table from the mmtbtwob_tops schema.
    Includes anti-fraud columns (theft lock, geofence bypass) and
    full session-meta fields added in the new schema."""

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

    # Check-in / check-out
    checkInPhoto = Column(String(300))
    checkOutPhoto = Column(String(300))
    checkOutTime = Column(DateTime)
    checkInDistance = Column(String(50))

    # Geofence bypass
    geofenceBypass = Column(Integer, server_default=text("0"))
    bypassRemark = Column(Text)

    # Attempt tracking
    attemptCount = Column(Integer, server_default=text("1"))

    # Theft / tab-switch detection
    isTheftLocked = Column(Integer, server_default=text("0"))
    theftAttemptsLeft = Column(Integer, server_default=text("3"))
    theftRemarks = Column(Text)

    # Session metadata (JSON blob)
    sessionMeta = Column(Text)

    # Upload tracking
    filePath = Column(String(100))
    logPath = Column(String(100))
    excelUploadedOn = Column(String(100))

    # Audit / meta
    updatedBy = Column(String(100))
    updationOn = Column(DateTime, onupdate=func.now())
    isRead = Column(String(50))
    token = Column(String(50))
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
    remarks = Column(Text)
    securityDetails = Column(Text)
    masterRemarks = Column(Text)
