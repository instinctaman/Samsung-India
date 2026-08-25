import uuid

from sqlalchemy import Column, Integer, String

from app.database.database import Base


class AgencyTeam(Base):
    """Mirrors the real `agencyteam` table (mmtbtwob_tops), trimmed to
    the columns this app currently uses. This is the
    org-authoritative table for real trainers (as opposed to `admin`,
    which is only meant for the internal admin panel) - trainer login
    checks `admin` first, then falls back here."""

    __tablename__ = "agencyteam"

    id = Column(Integer, primary_key=True, index=True)

    agencyTeamUid = Column(
        String(100), unique=True, nullable=True, default=lambda: uuid.uuid4().hex
    )

    name = Column(String(100))
    username = Column(String(100), unique=True, nullable=True, index=True)
    password = Column(String(100), nullable=False)
    role = Column(String(100))
    status = Column(String(50), nullable=False, default="Pending")
