from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_current_trainee
from app.database.database import get_db
from app.models.attendance import Attendance
from app.models.conference import Conference
from app.models.trainee import Trainee
from app.schemas.attendance import AttendanceOut, CheckInRequest

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("/check-in", response_model=AttendanceOut)
def check_in(
    payload: CheckInRequest,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    existing = (
        db.query(Attendance)
        .filter(
            Attendance.conferenceUid == payload.conferenceUid,
            Attendance.traineeUid == trainee.traineeUid,
        )
        .first()
    )
    if existing:
        if not settings.ALLOW_ATTENDANCE_RETEST:
            return AttendanceOut(status=existing.status, markedOn=existing.markedOn)
        db.delete(existing)
        db.commit()

    conference = (
        db.query(Conference)
        .filter(Conference.conferenceUid == payload.conferenceUid)
        .first()
    )

    attendance = Attendance(
        conferenceUid=payload.conferenceUid,
        trainerUid=conference.trainerEmployeeId if conference else None,
        traineeUid=trainee.traineeUid,
        phone=trainee.phone,
        markedOn=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        status="Present",
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return AttendanceOut(status=attendance.status, markedOn=attendance.markedOn)
