from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.media import ALLOWED_IMAGE_CONTENT_TYPES, MAX_UPLOAD_BYTES, media_subdir
from app.core.rate_limit import rate_limit
from app.core.security import create_access_token, get_current_trainee
from app.database.database import get_db
from app.models.trainee import Trainee
from app.schemas.trainee import (
    TokenResponse,
    TraineeLogin,
    TraineeOut,
    TraineeRegister,
    TraineeUpdate,
)

router = APIRouter(prefix="/trainees", tags=["trainees"])


@router.post(
    "/register",
    response_model=TraineeOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit(max_attempts=5, window_seconds=300))],
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


@router.post(
    "/login",
    response_model=TokenResponse,
    dependencies=[Depends(rate_limit(max_attempts=5, window_seconds=300))],
)
def login_trainee(payload: TraineeLogin, db: Session = Depends(get_db)):
    trainee = db.query(Trainee).filter(Trainee.phone == payload.phone).first()
    if not trainee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No trainee found with this phone number",
        )

    access_token = create_access_token(subject=str(trainee.phone))
    return TokenResponse(access_token=access_token, trainee=trainee)


@router.patch("/me", response_model=TokenResponse)
def update_trainee(
    payload: TraineeUpdate,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    updates = payload.model_dump(exclude_unset=True, exclude_none=True)

    if "phone" in updates or "email" in updates:
        conflict = (
            db.query(Trainee)
            .filter(
                Trainee.id != trainee.id,
                (Trainee.phone == updates.get("phone", trainee.phone))
                | (Trainee.email == updates.get("email", trainee.email)),
            )
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Another trainee already uses this phone or email",
            )

    for field, value in updates.items():
        setattr(trainee, field, value)

    db.commit()
    db.refresh(trainee)

    # `get_current_trainee` looks a trainee up by phone (it's the JWT
    # subject), so a changed phone number invalidates the token that was
    # just used to make this request - issue a fresh one so the trainee
    # doesn't get silently logged out by their own edit.
    access_token = create_access_token(subject=str(trainee.phone))
    return TokenResponse(access_token=access_token, trainee=trainee)


@router.post("/me/photo", response_model=TraineeOut)
async def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    extension = ALLOWED_IMAGE_CONTENT_TYPES.get(file.content_type or "")
    if not extension:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPEG, PNG or WEBP images are allowed",
        )

    contents = await file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must be 5MB or smaller",
        )

    # Named after the trainee (not the upload), so re-uploading replaces
    # the old file instead of littering the disk with orphans.
    photo_dir = media_subdir("trainee_photos")
    filename = f"{trainee.traineeUid}.{extension}"
    (photo_dir / filename).write_bytes(contents)

    trainee.profilePhoto = f"trainee_photos/{filename}"
    db.commit()
    db.refresh(trainee)
    return trainee
