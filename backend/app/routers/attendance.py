import math
import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.media import ALLOWED_IMAGE_CONTENT_TYPES, MAX_UPLOAD_BYTES, media_subdir
from app.core.security import get_current_trainee
from app.database.database import get_db
from app.models.attendance import Attendance
from app.models.conference import Conference
from app.models.trainee import Trainee
from app.schemas.attendance import (
    AttendanceOut,
    CheckInRequest,
    VerifyLocationOut,
    VerifyLocationRequest,
)

router = APIRouter(prefix="/attendance", tags=["attendance"])


def _distance_meters(
    lat1: Optional[float], lng1: Optional[float], lat2: Optional[float], lng2: Optional[float]
) -> Optional[float]:
    """Great-circle distance between two lat/lng points, in meters."""
    if lat1 is None or lng1 is None or lat2 is None or lng2 is None:
        return None

    earth_radius_m = 6_371_000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lng2 - lng1)

    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return earth_radius_m * c


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


@router.post("/verify-location", response_model=VerifyLocationOut)
def verify_location(
    payload: VerifyLocationRequest,
    db: Session = Depends(get_db),
    _trainee: Trainee = Depends(get_current_trainee),
):
    """First step of the geofenced check-in flow (see check_in_secure) - lets
    the "Location Verified" screen show the trainee's distance from the venue
    before they move on to the face-capture step. Informational only: it
    never blocks the flow, it just reports the distance."""
    conference = (
        db.query(Conference)
        .filter(Conference.conferenceUid == payload.conferenceUid)
        .first()
    )
    if not conference:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    venue_lat = float(conference.geoLatitude) if conference.geoLatitude is not None else None
    venue_lng = float(conference.geoLongitude) if conference.geoLongitude is not None else None
    distance = _distance_meters(payload.latitude, payload.longitude, venue_lat, venue_lng)

    return VerifyLocationOut(
        distanceMeters=distance,
        withinRadius=(distance <= conference.geoRadius) if distance is not None and conference.geoRadius else None,
        venueLabel=", ".join(filter(None, [conference.district, conference.state])) or None,
    )


@router.post("/check-in/secure", response_model=AttendanceOut)
async def check_in_secure(
    conferenceUid: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    """Geofenced check-in: captures the trainee's location and a face photo
    alongside the usual attendance row. Used instead of `check_in` when the
    session's attendance module has `geoFencing` enabled."""
    extension = ALLOWED_IMAGE_CONTENT_TYPES.get(photo.content_type or "")
    if not extension:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPEG, PNG or WEBP images are allowed",
        )

    contents = await photo.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Photo must be 5MB or smaller",
        )

    existing = (
        db.query(Attendance)
        .filter(
            Attendance.conferenceUid == conferenceUid,
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
        .filter(Conference.conferenceUid == conferenceUid)
        .first()
    )

    venue_lat = float(conference.geoLatitude) if conference and conference.geoLatitude is not None else None
    venue_lng = float(conference.geoLongitude) if conference and conference.geoLongitude is not None else None
    distance = _distance_meters(latitude, longitude, venue_lat, venue_lng)

    photo_dir = media_subdir("attendance_photos")
    filename = f"{uuid.uuid4().hex}.{extension}"
    (photo_dir / filename).write_bytes(contents)

    attendance = Attendance(
        conferenceUid=conferenceUid,
        trainerUid=conference.trainerEmployeeId if conference else None,
        traineeUid=trainee.traineeUid,
        phone=trainee.phone,
        markedOn=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        status="Present",
        checkInDistance=f"{distance:.0f}" if distance is not None else None,
        checkInPhoto=f"attendance_photos/{filename}",
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return AttendanceOut(status=attendance.status, markedOn=attendance.markedOn, distanceMeters=distance)
