import uuid

from sqlalchemy import BigInteger, Column, Integer, String, Text
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.database.database import Base


class Admin(Base):
    """Mirrors the `admin` table from the mmtbtwob_tops schema.
    Shared by admin and trainer accounts, distinguished by `role`
    — only `role='trainer'` accounts can sign into the trainer dashboard
    today; `role='admin'` rows are stored for a future admin panel."""

    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, index=True)

    adminUid = Column(
        String(100), unique=True, nullable=False, default=lambda: uuid.uuid4().hex
    )

    # Core identity
    name = Column(String(100))
    email = Column(String(255))
    phone = Column(BigInteger)
    altPhone = Column(BigInteger)
    gender = Column(String(50))
    dob = Column(String(50))

    # Family
    fatherName = Column(String(180))
    motherName = Column(String(180))

    # Local address
    localCity = Column(String(180))
    localDistrict = Column(String(180))
    localState = Column(String(180))
    localPinCode = Column(String(180))
    localLandmark = Column(String(180))

    # Permanent address
    permanentCity = Column(String(180))
    permanentDistrict = Column(String(180))
    permanentState = Column(String(180))
    permanentPinCode = Column(String(180))
    permanentLandmark = Column(String(180))

    # Identity docs & media
    aadharNo = Column(String(100))
    aadharImage = Column(String(300))
    profilePhoto = Column(String(100))
    about = Column(Text)
    resume = Column(String(300))
    otherDocument = Column(String(300))

    # Auth
    username = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)

    # Social links
    facebook = Column(String(300), nullable=False, default="https://facebook.com/")
    twitter = Column(String(300), nullable=False, default="https://twitter.com/")
    instagram = Column(String(300), nullable=False, default="https://instagram.com/")
    linkedin = Column(String(300), nullable=False, default="https://www.linkedin.com/company/")
    youtube = Column(String(300), nullable=False, default="https://www.youtube.com/")
    github = Column(String(100))

    # Employment
    jobStatus = Column(String(100), nullable=False, default="Pending")
    joinedOn = Column(String(100))
    company = Column(String(100))
    band = Column(String(50))
    reportingManager = Column(String(100))
    postedIn = Column(String(100))
    role = Column(String(100), nullable=False, default="NA")
    access = Column(Text)
    designation = Column(String(100))
    salary = Column(String(100))
    companyEmail = Column(String(100))

    # Issued items
    visitingCard = Column(String(100), nullable=False, default="No")
    idCard = Column(String(100), nullable=False, default="No")
    offerLetter = Column(String(100), nullable=False, default="No")
    letterHead = Column(String(100), nullable=False, default="No")
    promoCode = Column(String(100), nullable=False, default="No")

    # Audit / meta
    updatedBy = Column(String(100))
    updationOn = Column(DateTime, onupdate=func.now())
    isRead = Column(String(50), nullable=False, default="No")
    token = Column(String(100))
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
    status = Column(String(100), nullable=False, default="Pending")
    remarks = Column(Text)
    securityDetails = Column(Text)
    masterRemarks = Column(Text)
