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


class SessionJoinInfo(BaseModel):
    """Summary of the training behind a shared QR code - shown on the
    "You're joining …" preview before/after the scanner sends the trainee
    through login."""

    conferenceUid: str
    title: str
    sessionType: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    trainerName: Optional[str] = None
    started: bool
    startsAt: Optional[str] = None


class SessionHistoryItem(BaseModel):
    conferenceUid: str
    title: str
    date: Optional[str] = None
    trainerName: Optional[str] = None
    attendanceStatus: Optional[str] = None
    score: Optional[str] = None
    passed: Optional[bool] = None


class QuestionOption(BaseModel):
    id: str
    text: str


class LiveQuestionOut(BaseModel):
    """The active Live Quiz question as seen by a trainee - deliberately has
    no correct-answer field."""

    id: int
    text: str
    options: List[QuestionOption]


class LiveQuizView(BaseModel):
    """Trainee's authoritative view of the Live Quiz, polled by the Live Quiz
    screen and refreshed on each `/ws/live/{conferenceUid}` nudge. `state`
    mirrors `conference.liveQuizState`; `timerEndsAt` is epoch milliseconds."""

    state: str
    conferenceUid: str
    suiteUid: Optional[str] = None
    question: Optional[LiveQuestionOut] = None
    timerEndsAt: Optional[int] = None
    alreadyAnswered: bool = False


class LiveAnswerRequest(BaseModel):
    conferenceUid: str
    questionId: int
    selectedOption: Optional[str] = None


class LiveAnswerResult(BaseModel):
    accepted: bool
