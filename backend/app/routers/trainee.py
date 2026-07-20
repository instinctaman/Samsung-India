from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.database.database import get_db
from app.models.trainee import Trainee
from app.schemas.trainee import (
    TokenResponse,
    TraineeLogin,
    TraineeOut,
    TraineeRegister,
)

router = APIRouter(prefix="/trainees", tags=["trainees"])


@router.post(
    "/register",
    response_model=TraineeOut,
    status_code=status.HTTP_201_CREATED,
)
def register_trainee(payload: TraineeRegister, db: Session = Depends(get_db)):
    existing = (
        db.query(Trainee)
        .filter((Trainee.phone == payload.phone) | (Trainee.email == payload.email))
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trainee with this phone or email already exists",
        )

    trainee = Trainee(**payload.model_dump())
    db.add(trainee)
    db.commit()
    db.refresh(trainee)
    return trainee


@router.post("/login", response_model=TokenResponse)
def login_trainee(payload: TraineeLogin, db: Session = Depends(get_db)):
    trainee = db.query(Trainee).filter(Trainee.phone == payload.phone).first()
    if not trainee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No trainee found with this phone number",
        )

    access_token = create_access_token(subject=str(trainee.phone))
    return TokenResponse(access_token=access_token, trainee=trainee)
