from typing import Optional

from pydantic import BaseModel


class CheckInRequest(BaseModel):
    conferenceUid: str


class AttendanceOut(BaseModel):
    status: str
    markedOn: Optional[str] = None
    distanceMeters: Optional[float] = None


class VerifyLocationRequest(BaseModel):
    conferenceUid: str
    latitude: float
    longitude: float


class VerifyLocationOut(BaseModel):
    distanceMeters: Optional[float] = None
    withinRadius: Optional[bool] = None
    venueLabel: Optional[str] = None
