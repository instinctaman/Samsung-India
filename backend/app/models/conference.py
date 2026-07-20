from sqlalchemy import Column, DateTime, Integer, String, Text, text
from sqlalchemy.sql import func

from app.database.database import Base


class Conference(Base):
    """Mirrors the `conference` table from the legacy tecsoui_tops_aman schema,
    trimmed to the columns the trainee-facing session flow currently uses."""

    __tablename__ = "conference"

    id = Column(Integer, primary_key=True, index=True)
    conferenceUid = Column(String(100), unique=True)

    trainerEmployeeId = Column(String(100))
    trainerName = Column(String(100))

    conferenceDate = Column(String(100))
    conferenceTime = Column(String(100))
    conferenceStatus = Column(String(100), nullable=False, server_default=text("'Scheduled'"))
    activeModuleId = Column(String(50))

    trainingHub = Column(String(100))
    sessionType = Column(String(150))
    suiteTitle = Column(Text)

    state = Column(String(150))
    district = Column(String(150))

    preAssessmentUid = Column(String(100))
    postAssessmentUid = Column(String(100))
    surveyUid = Column(String(100))

    sessionConfig = Column(Text)

    status = Column(String(100), nullable=False, server_default=text("'Pending'"))
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
