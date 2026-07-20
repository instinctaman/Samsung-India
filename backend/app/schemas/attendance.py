from typing import Optional

from pydantic import BaseModel


class CheckInRequest(BaseModel):
    conferenceUid: str


class AttendanceOut(BaseModel):
    status: str
    markedOn: Optional[str] = None
