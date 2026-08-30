from typing import Optional

from pydantic import BaseModel, Field


class ModuleConfig(BaseModel):
    """One block of `conference.sessionConfig` - shared shape for the
    Standard Test, Live Quiz and Survey modules of the session flow."""

    category: Optional[str] = None
    assessmentSuiteUid: Optional[str] = None
    questionCount: Optional[int] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    checkIn: bool = False
    unlockCondition: Optional[str] = None


class AssessmentSuiteOut(BaseModel):
    """One row of `assessmentsuite`, as offered to the trainer's Category /
    Select Question Set pickers when building a session flow."""

    assessmentSuiteUid: str
    category: str
    name: str
    noOfQuestion: int


class QuestionOptionIn(BaseModel):
    id: str
    text: str


class QuestionCreate(BaseModel):
    question: str
    questionType: str = "multiple_choice"
    options: list[QuestionOptionIn] = []
    correctAnswer: Optional[str] = None
    points: int = 1
    timerSeconds: Optional[int] = None
    explanation: Optional[str] = None


class QuestionOut(BaseModel):
    id: int
    question: str
    questionType: str
    options: list[QuestionOptionIn]
    correctAnswer: Optional[str] = None
    points: int
    timerSeconds: Optional[int] = None
    explanation: Optional[str] = None
    sortOrder: int


class AssessmentSuiteCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    testTime: Optional[str] = None
    type: str = "Quiz"


class AssessmentSuiteDetail(BaseModel):
    assessmentSuiteUid: str
    title: str
    description: Optional[str] = None
    category: str
    testTime: Optional[str] = None
    type: str
    noOfQuestion: int
    questions: list[QuestionOut] = []


class PendingSessionItem(BaseModel):
    conferenceUid: str
    title: str
    trainerName: Optional[str] = None
    conferenceDate: Optional[str] = None
    conferenceTime: Optional[str] = None
    status: str


class AttendanceConfig(BaseModel):
    checkInOpens: Optional[str] = None
    checkOutCloses: Optional[str] = None
    geoFencing: bool = False


class SessionFlowConfig(BaseModel):
    attendance: Optional[AttendanceConfig] = None
    standardTest: Optional[ModuleConfig] = None
    liveQuiz: Optional[ModuleConfig] = None
    survey: Optional[ModuleConfig] = None


class TrainingCreate(BaseModel):
    zone: Optional[str] = None
    region: Optional[str] = None
    company: Optional[str] = None
    requestedBy: Optional[str] = None

    trainerEmployeeId: Optional[str] = None
    trainerName: Optional[str] = None

    state: Optional[str] = None
    district: Optional[str] = None
    venue: Optional[str] = None

    isResidential: bool = False
    conferenceDate: str
    conferenceTime: str
    # Only meaningful when isResidential is set - the program's last day.
    # No dedicated conference column for this yet, so it's folded into
    # sessionConfig (see create_training) rather than conferenceEndsOn,
    # which already means something else (the session's actual end
    # timestamp, set by /trainings/{uid}/end).
    trainingEndDate: Optional[str] = None
    trainingHub: Optional[str] = None
    audience: Optional[str] = None
    sessionType: Optional[str] = None
    trainingType: Optional[str] = None
    batchSize: Optional[str] = None

    sessionFlow: Optional[SessionFlowConfig] = None
    checklist: Optional[list[str]] = None


class TrainingOut(BaseModel):
    conferenceUid: str
    conferenceStatus: str
    status: str


class AttendanceMarkRequest(BaseModel):
    status: str  # "Present" | "Absent"


class AttendanceListItemOut(BaseModel):
    """Powers the trainer's Attendance List / Pending Attendance / Confirmed
    Attendance screens - one row per attendance record across every
    conference this trainer owns. `marked`/`Present` vs not is how the
    Pending/Confirmed screens split the same list client-side."""

    attendanceId: str
    region: Optional[str] = None
    product: Optional[str] = None
    session: Optional[str] = None
    audienceType: Optional[str] = None
    conferenceDate: Optional[str] = None
    trainerName: Optional[str] = None
    trainerHoId: Optional[str] = None
    participantHoId: Optional[str] = None
    participantName: str
    phone: Optional[str] = None
    state: Optional[str] = None
    location: Optional[str] = None
    reportingManagerOfPromoter: Optional[str] = None
    attendanceStatus: str
    checkIn: Optional[str] = None
    checkOut: Optional[str] = None
    postTestScore: Optional[str] = None
    postTestScoreSummary: Optional[str] = None
    sessionTypeMethod: Optional[str] = None
    conferenceId: Optional[str] = None
    lastUpdates: Optional[str] = None
    marked: bool


class TrainingAgendaItem(BaseModel):
    conferenceUid: str
    title: str
    trainerName: Optional[str] = None
    hoid: Optional[str] = None
    conferenceDate: Optional[str] = None
    conferenceTime: Optional[str] = None
    conferenceStatus: str
    approvalStatus: str
    location: Optional[str] = None
    batchSize: Optional[str] = None
    trainingType: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    trainingHub: Optional[str] = None
    venueName: Optional[str] = None
    updatedBy: Optional[str] = None
    updationOn: Optional[str] = None
    timestamp: Optional[str] = None
    traineeCount: int = 0


class TrainerAgendaResponse(BaseModel):
    """GET /admin/trainings - the session list plus the dashboard's summary
    stats, all computed server-side so the frontend just displays them
    rather than re-deriving them from the raw list itself. `totalTrainees`
    is a de-duplicated headcount (see the router for how it's built from
    `attendance`/`assessment_results`); `totalSessions`/`completed`/`pending`
    are counted straight off the filtered `conference` rows. `recentCompleted`
    is always the trainer's most recently completed sessions all-time,
    regardless of `start`/`end` - the Recent Sessions card ignores whatever
    date scope the rest of this response uses."""

    trainings: list[TrainingAgendaItem]
    totalTrainees: int
    totalSessions: int
    completed: int
    pending: int
    executedPercentage: int
    pendingPercentage: int
    recentCompleted: list[TrainingAgendaItem] = []


class AudienceBreakdown(BaseModel):
    total: int
    present: int


class AssessmentSummary(BaseModel):
    pass_: int = Field(0, alias="pass")
    fail: int
    totalAttempts: int

    model_config = {"populate_by_name": True}


class TopPerformer(BaseModel):
    traineeUid: str
    name: str
    percentage: float


class TraineeRow(BaseModel):
    traineeUid: str
    name: str
    phone: Optional[int] = None
    status: str
    markedOn: Optional[str] = None
    checkOutTime: Optional[str] = None
    score: Optional[str] = None
    profilePhoto: Optional[str] = None


class ExecutionFlowItem(BaseModel):
    moduleKey: str
    label: str
    status: str  # "Pending" | "Running" | "Completed"
    startedAt: Optional[str] = None
    endedAt: Optional[str] = None
    elapsedSeconds: Optional[int] = None


class AuditLogEntry(BaseModel):
    """One STARTED/STOPPED pair for a module - a module can run more than
    once (e.g. if `advance-module` cycles back around), so unlike
    `ExecutionFlowItem` this is per-run, not per-module."""

    moduleKey: str
    label: str
    runNumber: int
    startedAt: Optional[str] = None
    endedAt: Optional[str] = None
    elapsedSeconds: Optional[int] = None
    isRunning: bool = False
    startedBy: Optional[str] = None


class SessionDashboardOut(BaseModel):
    conferenceUid: str
    title: str
    trainingType: Optional[str] = None
    conferenceDate: Optional[str] = None
    conferenceTime: Optional[str] = None
    trainerName: Optional[str] = None
    location: Optional[str] = None
    conferenceStatus: str
    approvalStatus: str
    activeModuleId: Optional[str] = None

    actualStartedAt: Optional[str] = None
    actualEndedAt: Optional[str] = None
    runtimeSeconds: Optional[int] = None

    audience: AudienceBreakdown
    assessment: AssessmentSummary
    topPerformers: list[TopPerformer]
    trainees: list[TraineeRow]
    executionFlow: list[ExecutionFlowItem] = []
    auditLog: list[AuditLogEntry] = []
