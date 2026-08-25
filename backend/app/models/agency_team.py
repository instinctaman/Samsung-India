import uuid

from sqlalchemy import BigInteger, Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.database.database import Base


class AgencyTeam(Base):
    """Mirrors the `agencyteam` table from the mmtbtwob_tops schema.
    This is the org-authoritative table for real trainers — trainer login
    checks `admin` first, then falls back here."""

    __tablename__ = "agencyteam"

    id = Column(Integer, primary_key=True, index=True)

    agencyTeamUid = Column(
        String(100), unique=True, nullable=True, default=lambda: uuid.uuid4().hex
    )

    # Company link
    companyUid = Column(String(100))
    company = Column(String(150))

    # Core identity
    name = Column(String(100))
    email = Column(String(100))
    phone = Column(BigInteger)
    altPhone = Column(BigInteger)
    officialEmail = Column(String(100))
    dob = Column(String(50))
    gender = Column(String(50))

    # Employment
    offerId = Column(String(100))
    designation = Column(String(100))
    role = Column(String(100))
    jobCity = Column(String(100))
    jobState = Column(String(100))
    jobPincode = Column(String(50))

    # Media
    profilePhoto = Column(String(250), nullable=False, default="defaultfile.png")

    # Auth
    username = Column(String(100), unique=True, nullable=True, index=True)
    password = Column(String(100), nullable=False,
                      default="$2y$10$qDSaaJA.3/PPItCLB2xdt.xFZaGa7IfHLhCq.EQGILTEZzaj3wRju")

    # Upload tracking
    filePath = Column(String(100))
    logPath = Column(String(100))
    excelUploadedOn = Column(String(100))

    # Audit / meta
    updatedBy = Column(String(100))
    updationOn = Column(DateTime, onupdate=func.now())
    isRead = Column(String(50), nullable=False, default="No")
    token = Column(String(50))
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
    status = Column(String(50), nullable=False, default="Pending")
    remarks = Column(Text)
    securityDetails = Column(Text)
    masterRemarks = Column(Text)
