import uuid

from sqlalchemy import BigInteger, Column, Date, DateTime, Integer, String, Text, text
from sqlalchemy.sql import func

from app.database.database import Base


class Trainee(Base):
    """Mirrors the `trainee` table from the mmtbtwob_tops schema.
    Includes full workforce management fields: zone/region, company link,
    supervisor details, employment dates, job status, and login credentials."""

    __tablename__ = "trainee"

    id = Column(Integer, primary_key=True, index=True)

    traineeUid = Column(
        String(100), unique=True, nullable=False, default=lambda: uuid.uuid4().hex
    )

    # Organisational context
    zone = Column(String(100))
    region = Column(String(100))
    company = Column(String(100))
    requestedBy = Column(String(100))

    # Trainer link
    trainerEmployeeId = Column(String(100))
    trainerName = Column(String(100))

    # Supervisor
    supervisorUid = Column(String(100), index=True)
    supervisorName = Column(String(100))
    supervisorDesignation = Column(String(150))

    # Identifiers
    uid = Column(String(100))           # Employee / corporate UID
    agencyId = Column(String(150))

    # Core identity
    name = Column(String(100), nullable=False)
    designation = Column(String(150))
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(BigInteger, unique=True, nullable=False)
    dob = Column(Date)
    gender = Column(String(50))

    # Location
    district = Column(String(100))
    state = Column(String(100))
    address = Column(Text)
    altPhone = Column(String(20))
    altEmail = Column(String(100))

    # Employment dates & status
    joinedOn = Column(Date)
    jobCity = Column(String(100))
    jobState = Column(String(100))
    jobPincode = Column(String(10))
    resignedOn = Column(Date)
    jobStatus = Column(String(50), server_default=text("'Active'"))

    # Media
    profilePhoto = Column(String(255), server_default=text("'default.png'"))

    # Auth
    username = Column(String(100), unique=True)
    password = Column(String(255))

    # Not present in the org's original dump - added via migration because the
    # registration form collects it and no dump column maps to a trainee's own
    # employee ID (`trainerEmployeeId` is the trainer's, not the trainee's).
    employee_id = Column(String(100))

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
    status = Column(String(100), nullable=False, server_default=text("'Pending'"))
    remarks = Column(Text)
    securityDetails = Column(Text)
    masterRemarks = Column(Text)
