from typing import Optional

from pydantic import BaseModel, Field

from app.schemas._common import IdStr


class CheckInRequest(BaseModel):
    conferenceUid: IdStr


class AttendanceOut(BaseModel):
    status: str
    markedOn: Optional[str] = None
    distanceMeters: Optional[float] = None


class VerifyLocationRequest(BaseModel):
    conferenceUid: IdStr
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class VerifyLocationOut(BaseModel):
    distanceMeters: Optional[float] = None
    withinRadius: Optional[bool] = None
    venueLabel: Optional[str] = None
