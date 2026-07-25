from typing import List, Optional

from pydantic import BaseModel


class SessionModule(BaseModel):
    key: str
    name: str
    time: Optional[str] = None
    endTime: Optional[str] = None
    duration: Optional[str] = None
    isLive: bool
    isCompleted: bool
    isMissed: bool = False
    completedAt: Optional[str] = None
    score: Optional[str] = None
    assessmentSuiteUid: Optional[str] = None


class CurrentSession(BaseModel):
    conferenceUid: str
    title: str
    sessionType: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    trainerName: Optional[str] = None
    confirmationStatus: str
    started: bool = True
    startsAt: Optional[str] = None
    attendanceGeoFencing: bool = False
    modules: List[SessionModule]


class SessionHistoryItem(BaseModel):
    conferenceUid: str
    title: str
    date: Optional[str] = None
    trainerName: Optional[str] = None
    attendanceStatus: Optional[str] = None
    score: Optional[str] = None
    passed: Optional[bool] = None
