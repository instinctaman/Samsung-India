from sqlalchemy import Column, DateTime, Integer, Numeric, String, Text, text
from sqlalchemy.sql import func

from app.database.database import Base


class Conference(Base):
    """Mirrors the real `conference` table (mmtbtwob_tops), trimmed to
    the columns the trainee-facing session flow and the trainer's
    "Add New Training" registration form currently use."""

    __tablename__ = "conference"

    id = Column(Integer, primary_key=True, index=True)
    conferenceUid = Column(String(100), unique=True)

    zone = Column(String(120))
    region = Column(String(150))
    company = Column(String(100))
    requestedBy = Column(String(100))

    trainerEmployeeId = Column(String(100))
    trainerName = Column(String(100))

    conferenceType = Column(String(100), nullable=False, server_default=text("'Non Residential Conference'"))
    conferenceDate = Column(String(100))
    conferenceEndsOn = Column(String(100))
    conferenceTime = Column(String(100))
    conferenceStatus = Column(String(100), nullable=False, server_default=text("'Scheduled'"))
    activeModuleId = Column(String(50))
    actualStartedAt = Column(DateTime)
    actualEndedAt = Column(DateTime)
    enableCheckIn = Column(Integer, server_default=text("0"))

    trainingHub = Column(String(100))
    audience = Column(String(150))
    sessionType = Column(String(150))
    trainingType = Column(String(100))
    batchSize = Column(String(150))
    confirmedPax = Column(String(150), server_default=text("'0'"))
    attendanceSheetPax = Column(String(100), nullable=False, server_default=text("'0'"))
    suiteTitle = Column(Text)

    state = Column(String(150))
    district = Column(String(150))
    venueUid = Column(String(150))
    geoLatitude = Column(Numeric(10, 8))
    geoLongitude = Column(Numeric(11, 8))
    geoRadius = Column(Integer, server_default=text("100"))

    assessmentFor = Column(String(100))
    preAssessmentUid = Column(String(100))
    postAssessmentUid = Column(String(100))
    surveyUid = Column(String(100))
    noOfQuestion = Column(String(100), nullable=False, server_default=text("'1'"))

    sessionConfig = Column(Text)
    checklistUid = Column(String(255))

    updatedBy = Column(String(100))
    status = Column(String(100), nullable=False, server_default=text("'Pending'"))
    auditStatus = Column(String(50), server_default=text("'Pending'"))
    remarks = Column(Text)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
