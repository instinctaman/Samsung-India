import uuid

from sqlalchemy import BigInteger, Column, DateTime, Integer, String, text
from sqlalchemy.sql import func

from app.database.database import Base


class Trainee(Base):
    """Mirrors the `trainee` table from the legacy tecsoui_tops_aman schema,
    trimmed to the columns this app currently uses."""

    __tablename__ = "trainee"

    id = Column(Integer, primary_key=True, index=True)

    traineeUid = Column(
        String(100), unique=True, nullable=False, default=lambda: uuid.uuid4().hex
    )

    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(BigInteger, unique=True, nullable=False)

    gender = Column(String(50))
    designation = Column(String(150))
    supervisorName = Column(String(100))

    district = Column(String(100))
    state = Column(String(100))

    # Not present in the org's original dump - added via migration because the
    # registration form collects it and no dump column maps to a trainee's own
    # employee ID (`trainerEmployeeId` is the trainer's, not the trainee's).
    employee_id = Column(String(100))

    status = Column(String(100), nullable=False, server_default=text("'Pending'"))
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
