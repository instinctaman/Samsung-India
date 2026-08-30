from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_trainee
from app.dependencies.database import get_db
from app.models.trainee import Trainee
from app.schemas.attendance import (
    AttendanceOut,
    CheckInRequest,
    VerifyLocationOut,
    VerifyLocationRequest,
)
from app.services import attendance_service

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("/check-in", response_model=AttendanceOut)
def check_in(
    payload: CheckInRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    return attendance_service.check_in(db, trainee, payload, background_tasks)


@router.post("/verify-location", response_model=VerifyLocationOut)
def verify_location(
    payload: VerifyLocationRequest,
    db: Session = Depends(get_db),
    _trainee: Trainee = Depends(get_current_trainee),
):
    return attendance_service.verify_location(db, payload)


@router.post("/check-in/secure", response_model=AttendanceOut)
async def check_in_secure(
    background_tasks: BackgroundTasks,
    conferenceUid: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    return await attendance_service.check_in_secure(
        db, trainee, background_tasks, conferenceUid, latitude, longitude, photo
    )
