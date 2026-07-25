import json
import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_admin, require_admin_role
from app.database.database import get_db
from app.models.admin import Admin
from app.models.agency_team import AgencyTeam
from app.models.attendance import Attendance
from app.models.conference import Conference
from app.models.conference_activity_log import ConferenceActivityLog
from app.models.quiz import AssessmentResult, AssessmentSuite, Question
from app.models.trainee import Trainee
from app.schemas.training import (
    AssessmentSuiteCreate,
    AssessmentSuiteDetail,
    AssessmentSuiteOut,
    AssessmentSummary,
    AttendanceMarkRequest,
    AudienceBreakdown,
    AuditLogEntry,
    ExecutionFlowItem,
    PendingSessionItem,
    QuestionCreate,
    QuestionOptionIn,
    QuestionOut,
    SessionDashboardOut,
    TopPerformer,
    TraineeRow,
    TrainingAgendaItem,
    TrainingCreate,
    TrainingOut,
)
from app.services.module_flow import (
    MODULE_LABELS,
    auto_advance_if_due,
    configured_modules as _configured_modules,
    log_module_action as _log_module_action,
)

router = APIRouter(prefix="/admin", tags=["training"])

# A result at or above this percentage counts as a pass on the trainer's
# session dashboard. There's no per-suite passing-score column yet, so this
# is a single global threshold.
PASS_THRESHOLD_PERCENT = 50


def _execution_flow(db: Session, conference: Conference) -> list[ExecutionFlowItem]:
    modules = _configured_modules(conference)
    if not modules:
        return []

    logs = (
        db.query(ConferenceActivityLog)
        .filter(ConferenceActivityLog.conferenceUid == conference.conferenceUid)
        .order_by(ConferenceActivityLog.timestamp)
        .all()
    )
    logs_by_module: dict[str, list[ConferenceActivityLog]] = {}
    for log in logs:
        logs_by_module.setdefault(log.moduleId, []).append(log)

    now = datetime.now()
    items: list[ExecutionFlowItem] = []
    for module_key in modules:
        module_logs = logs_by_module.get(module_key, [])
        started = next((entry for entry in module_logs if entry.action == "STARTED"), None)
        stopped = next((entry for entry in module_logs if entry.action == "STOPPED"), None)

        if started and stopped:
            item_status = "Completed"
            elapsed = int((stopped.timestamp - started.timestamp).total_seconds())
        elif started:
            item_status = "Running"
            elapsed = int((now - started.timestamp).total_seconds())
        else:
            item_status = "Pending"
            elapsed = None

        items.append(
            ExecutionFlowItem(
                moduleKey=module_key,
                label=MODULE_LABELS.get(module_key, module_key.title()),
                status=item_status,
                startedAt=started.timestamp.isoformat() if started else None,
                endedAt=stopped.timestamp.isoformat() if stopped else None,
                elapsedSeconds=elapsed,
            )
        )
    return items


def _pair_runs(
    module_logs: list[ConferenceActivityLog],
) -> list[tuple[ConferenceActivityLog, Optional[ConferenceActivityLog]]]:
    """Turns a module's chronological STARTED/STOPPED events into
    (started, stopped) run pairs - a module can run more than once if
    `advance-module` ever cycles back around to it."""
    runs: list[tuple[ConferenceActivityLog, Optional[ConferenceActivityLog]]] = []
    open_start: Optional[ConferenceActivityLog] = None
    for log in module_logs:
        if log.action == "STARTED":
            if open_start is not None:
                runs.append((open_start, None))
            open_start = log
        elif log.action == "STOPPED" and open_start is not None:
            runs.append((open_start, log))
            open_start = None
    if open_start is not None:
        runs.append((open_start, None))
    return runs


def _resolve_performer_names(db: Session, usernames: set[str]) -> dict[str, str]:
    if not usernames:
        return {}
    names: dict[str, str] = {}
    for admin in db.query(Admin).filter(Admin.username.in_(usernames)).all():
        names[admin.username] = admin.name or admin.username
    remaining = usernames - names.keys()
    if remaining:
        for agent in db.query(AgencyTeam).filter(AgencyTeam.username.in_(remaining)).all():
            names[agent.username] = agent.name or agent.username
    return names


def _audit_log(db: Session, conference: Conference) -> list[AuditLogEntry]:
    modules = _configured_modules(conference)
    if not modules:
        return []

    logs = (
        db.query(ConferenceActivityLog)
        .filter(ConferenceActivityLog.conferenceUid == conference.conferenceUid)
        .order_by(ConferenceActivityLog.timestamp)
        .all()
    )
    logs_by_module: dict[str, list[ConferenceActivityLog]] = {}
    for log in logs:
        logs_by_module.setdefault(log.moduleId, []).append(log)

    performer_names = _resolve_performer_names(db, {log.performedBy for log in logs if log.performedBy})

    now = datetime.now()
    entries: list[AuditLogEntry] = []
    for module_key in modules:
        runs = _pair_runs(logs_by_module.get(module_key, []))
        for run_number, (started, stopped) in enumerate(runs, start=1):
            end_point = stopped.timestamp if stopped else now
            elapsed = int((end_point - started.timestamp).total_seconds())
            entries.append(
                AuditLogEntry(
                    moduleKey=module_key,
                    label=MODULE_LABELS.get(module_key, module_key.title()),
                    runNumber=run_number,
                    startedAt=started.timestamp.isoformat(),
                    endedAt=stopped.timestamp.isoformat() if stopped else None,
                    elapsedSeconds=elapsed,
                    isRunning=stopped is None,
                    startedBy=performer_names.get(started.performedBy, started.performedBy) if started.performedBy else None,
                )
            )
    return entries


@router.get("/trainers/{username}")
def get_trainer_name(
    username: str,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    trainer = (
        db.query(Admin)
        .filter(Admin.username == username, Admin.role == "trainer")
        .first()
    )
    if not trainer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainer not found")

    return {"username": trainer.username, "name": trainer.name}


@router.get("/assessment-suites", response_model=list[AssessmentSuiteOut])
def list_assessment_suites(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    """Powers the Category / Select Question Set pickers in the trainer's
    session-flow builder. `assessment_type` doubles as the category
    grouping (e.g. "Quiz", "Survey", "Post Test")."""
    suites = (
        db.query(AssessmentSuite)
        .filter(AssessmentSuite.status == "Approved")
        .order_by(AssessmentSuite.assessment_type, AssessmentSuite.courseName)
        .all()
    )
    return [
        AssessmentSuiteOut(
            assessmentSuiteUid=suite.assessmentSuiteUid,
            category=suite.assessment_type or "Uncategorised",
            name=suite.examTitle or suite.courseName or "Untitled",
            noOfQuestion=suite.noOfQuestion or 0,
        )
        for suite in suites
    ]


def _question_to_out(q: Question) -> QuestionOut:
    settings = json.loads(q.settings) if q.settings else {}
    return QuestionOut(
        id=q.id,
        question=q.question or "",
        questionType=q.question_type,
        options=[QuestionOptionIn(**o) for o in (json.loads(q.options) if q.options else [])],
        correctAnswer=q.correct_answer,
        points=q.points or 0,
        timerSeconds=settings.get("timerSeconds"),
        explanation=settings.get("explanation"),
        sortOrder=q.sort_order or 0,
    )


def _suite_to_detail(db: Session, suite: AssessmentSuite) -> AssessmentSuiteDetail:
    settings = json.loads(suite.settings) if suite.settings else {}
    questions = (
        db.query(Question)
        .filter(Question.assessmentSuiteUid == suite.assessmentSuiteUid)
        .order_by(Question.sort_order)
        .all()
    )
    return AssessmentSuiteDetail(
        assessmentSuiteUid=suite.assessmentSuiteUid,
        title=suite.examTitle or suite.courseName or "Untitled Assessment",
        description=suite.description,
        category=suite.assessment_type or "",
        testTime=suite.testTime,
        type=settings.get("type", "Quiz"),
        noOfQuestion=len(questions),
        questions=[_question_to_out(q) for q in questions],
    )


@router.post("/assessment-suites", response_model=AssessmentSuiteDetail)
def create_assessment_suite(
    payload: AssessmentSuiteCreate,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(require_admin_role),
):
    suite = AssessmentSuite(
        assessmentSuiteUid=uuid.uuid4().hex,
        courseName=payload.title,
        examTitle=payload.title,
        description=payload.description,
        assessment_type=payload.category,
        settings=json.dumps({"type": payload.type}),
        testTime=payload.testTime,
        noOfQuestion=0,
        status="Approved",
    )
    db.add(suite)
    db.commit()
    db.refresh(suite)
    return _suite_to_detail(db, suite)


@router.get("/assessment-suites/{suite_uid}", response_model=AssessmentSuiteDetail)
def get_assessment_suite(
    suite_uid: str,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(require_admin_role),
):
    suite = db.query(AssessmentSuite).filter(AssessmentSuite.assessmentSuiteUid == suite_uid).first()
    if not suite:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment suite not found")
    return _suite_to_detail(db, suite)


@router.post("/assessment-suites/{suite_uid}/questions", response_model=AssessmentSuiteDetail)
def add_question(
    suite_uid: str,
    payload: QuestionCreate,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(require_admin_role),
):
    suite = db.query(AssessmentSuite).filter(AssessmentSuite.assessmentSuiteUid == suite_uid).first()
    if not suite:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment suite not found")

    next_order = (
        db.query(Question)
        .filter(Question.assessmentSuiteUid == suite_uid)
        .count()
    ) + 1

    db.add(
        Question(
            assessmentSuiteUid=suite_uid,
            question=payload.question,
            question_type=payload.questionType,
            sort_order=next_order,
            options=json.dumps([o.model_dump() for o in payload.options]) if payload.options else None,
            correct_answer=payload.correctAnswer,
            points=payload.points,
            settings=json.dumps({"timerSeconds": payload.timerSeconds, "explanation": payload.explanation}),
            status="Approved",
        )
    )
    suite.noOfQuestion = next_order
    db.commit()
    return _suite_to_detail(db, suite)


@router.delete("/assessment-suites/{suite_uid}/questions/{question_id}", response_model=AssessmentSuiteDetail)
def delete_question(
    suite_uid: str,
    question_id: int,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(require_admin_role),
):
    suite = db.query(AssessmentSuite).filter(AssessmentSuite.assessmentSuiteUid == suite_uid).first()
    if not suite:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment suite not found")

    db.query(Question).filter(Question.id == question_id, Question.assessmentSuiteUid == suite_uid).delete()
    suite.noOfQuestion = db.query(Question).filter(Question.assessmentSuiteUid == suite_uid).count()
    db.commit()
    return _suite_to_detail(db, suite)


@router.post("/trainings", response_model=TrainingOut)
def create_training(
    payload: TrainingCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    session_config = {}
    if payload.sessionFlow:
        if payload.sessionFlow.attendance:
            session_config["attendance"] = payload.sessionFlow.attendance.model_dump(exclude_none=True)
        if payload.sessionFlow.standardTest:
            session_config["standardTest"] = payload.sessionFlow.standardTest.model_dump(exclude_none=True)
        if payload.sessionFlow.liveQuiz:
            session_config["liveQuiz"] = payload.sessionFlow.liveQuiz.model_dump(exclude_none=True)
        if payload.sessionFlow.survey:
            session_config["survey"] = payload.sessionFlow.survey.model_dump(exclude_none=True)

    conference = Conference(
        conferenceUid=uuid.uuid4().hex,
        zone=payload.zone,
        region=payload.region,
        company=payload.company,
        requestedBy=payload.requestedBy,
        trainerEmployeeId=payload.trainerEmployeeId,
        trainerName=payload.trainerName,
        conferenceType="Residential Conference" if payload.isResidential else "Non Residential Conference",
        conferenceDate=payload.conferenceDate,
        conferenceTime=payload.conferenceTime,
        conferenceStatus="Scheduled",
        enableCheckIn=1 if session_config.get("attendance") else 0,
        trainingHub=payload.trainingHub,
        audience=payload.audience,
        sessionType=payload.sessionType,
        trainingType=payload.trainingType,
        batchSize=payload.batchSize,
        state=payload.state,
        district=payload.district,
        venueUid=payload.venue,
        checklistUid=",".join(payload.checklist) if payload.checklist else None,
        sessionConfig=json.dumps(session_config) if session_config else None,
        # The trainee session flow (see `_select_current_conference` /
        # `get_current_session`) only knows a Standard Test or Survey
        # module exists via these two columns - it doesn't read
        # `sessionConfig` for that, so the chosen question set has to be
        # copied out here too, not just stored in the JSON blob above.
        postAssessmentUid=payload.sessionFlow.standardTest.assessmentSuiteUid
        if payload.sessionFlow and payload.sessionFlow.standardTest
        else None,
        surveyUid=payload.sessionFlow.survey.assessmentSuiteUid
        if payload.sessionFlow and payload.sessionFlow.survey
        else None,
        updatedBy=admin.username,
        # Every new training needs an admin to review and approve it (see
        # /admin/trainings/pending + /approve) before the trainer can start
        # it - see the check in start_training.
        status="Pending",
    )
    db.add(conference)
    db.commit()
    db.refresh(conference)

    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


def _get_owned_conference(db: Session, admin: Admin, conference_uid: str) -> Conference:
    conference = (
        db.query(Conference)
        .filter(
            Conference.conferenceUid == conference_uid,
            Conference.trainerEmployeeId == admin.username,
        )
        .first()
    )
    if not conference:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Training not found")
    return conference


@router.get("/trainings", response_model=list[TrainingAgendaItem])
def list_trainer_trainings(
    start: Optional[str] = None,
    end: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    """Powers the trainer's Home agenda. `start`/`end` are `YYYY-MM-DD`
    strings (matching how `conferenceDate` is stored) and are compared
    lexicographically, which sorts correctly for that format."""
    query = db.query(Conference).filter(Conference.trainerEmployeeId == admin.username)
    if start:
        query = query.filter(Conference.conferenceDate >= start)
    if end:
        query = query.filter(Conference.conferenceDate <= end)

    conferences = query.order_by(Conference.timestamp.desc()).all()

    return [
        TrainingAgendaItem(
            conferenceUid=conference.conferenceUid,
            title=conference.suiteTitle or conference.trainingType or "Training Session",
            conferenceDate=conference.conferenceDate,
            conferenceTime=conference.conferenceTime,
            conferenceStatus=conference.conferenceStatus,
            approvalStatus=conference.status,
            location=", ".join(filter(None, [conference.district, conference.state])) or None,
            batchSize=conference.batchSize,
            trainingType=conference.trainingType,
            state=conference.state,
            trainingHub=conference.trainingHub,
        )
        for conference in conferences
    ]


@router.get("/trainings/pending", response_model=list[PendingSessionItem])
def list_pending_trainings(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(require_admin_role),
):
    """Every trainer's not-yet-reviewed sessions, across all trainers -
    powers the admin dashboard's Pending Approvals list."""
    conferences = (
        db.query(Conference)
        .filter(Conference.status == "Pending")
        .order_by(Conference.timestamp.desc())
        .all()
    )
    return [
        PendingSessionItem(
            conferenceUid=c.conferenceUid,
            title=c.suiteTitle or c.trainingType or "Training Session",
            trainerName=c.trainerName,
            conferenceDate=c.conferenceDate,
            conferenceTime=c.conferenceTime,
            status=c.status,
        )
        for c in conferences
    ]


def _find_any_conference(db: Session, conference_uid: str) -> Conference:
    conference = db.query(Conference).filter(Conference.conferenceUid == conference_uid).first()
    if not conference:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Training not found")
    return conference


@router.post("/trainings/{conference_uid}/approve", response_model=TrainingOut)
def approve_training(
    conference_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(require_admin_role),
):
    conference = _find_any_conference(db, conference_uid)
    conference.status = "Approved"
    conference.updatedBy = admin.username
    db.commit()
    db.refresh(conference)
    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


@router.post("/trainings/{conference_uid}/reject", response_model=TrainingOut)
def reject_training(
    conference_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(require_admin_role),
):
    conference = _find_any_conference(db, conference_uid)
    conference.status = "Rejected"
    conference.updatedBy = admin.username
    db.commit()
    db.refresh(conference)
    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


def _build_dashboard(db: Session, conference: Conference) -> SessionDashboardOut:
    auto_advance_if_due(db, conference)
    conference_uid = conference.conferenceUid

    attendance_rows = (
        db.query(Attendance)
        .filter(Attendance.conferenceUid == conference_uid)
        .all()
    )
    present_trainee_uids = {a.traineeUid for a in attendance_rows if a.status == "Present"}

    result_rows: list[AssessmentResult] = []
    if conference.postAssessmentUid:
        result_rows = (
            db.query(AssessmentResult)
            .filter(
                AssessmentResult.conferenceUid == conference_uid,
                AssessmentResult.assessmentSuiteUid == conference.postAssessmentUid,
                AssessmentResult.status == "Submitted",
            )
            .order_by(AssessmentResult.attemptNumber.desc())
            .all()
        )
    # Keep only the latest attempt per trainee (rows are already ordered by
    # attemptNumber desc, so the first one seen per trainee wins).
    latest_result_by_trainee: dict[str, AssessmentResult] = {}
    for result in result_rows:
        latest_result_by_trainee.setdefault(result.traineeUid, result)

    participant_uids = present_trainee_uids | set(latest_result_by_trainee.keys())
    trainees_by_uid = {
        t.traineeUid: t
        for t in db.query(Trainee).filter(Trainee.traineeUid.in_(participant_uids)).all()
    } if participant_uids else {}

    attendance_by_trainee = {a.traineeUid: a for a in attendance_rows}

    trainee_rows = [
        TraineeRow(
            traineeUid=uid,
            name=trainees_by_uid[uid].name if uid in trainees_by_uid else "Unknown Trainee",
            phone=trainees_by_uid[uid].phone if uid in trainees_by_uid else None,
            profilePhoto=trainees_by_uid[uid].profilePhoto if uid in trainees_by_uid else None,
            status="Present" if uid in present_trainee_uids else "Attempted",
            markedOn=attendance_by_trainee[uid].markedOn if uid in attendance_by_trainee else None,
            checkOutTime=(
                attendance_by_trainee[uid].checkOutTime.strftime("%Y-%m-%d %H:%M:%S")
                if uid in attendance_by_trainee and attendance_by_trainee[uid].checkOutTime
                else None
            ),
            score=(
                f"{float(latest_result_by_trainee[uid].percentage):g}%"
                if uid in latest_result_by_trainee
                else None
            ),
        )
        for uid in participant_uids
    ]

    pass_count = sum(
        1 for r in latest_result_by_trainee.values() if float(r.percentage) >= PASS_THRESHOLD_PERCENT
    )
    fail_count = len(latest_result_by_trainee) - pass_count

    top_performers = sorted(
        latest_result_by_trainee.values(), key=lambda r: float(r.percentage), reverse=True
    )[:5]

    runtime_seconds = None
    if conference.actualStartedAt:
        end_point = conference.actualEndedAt or datetime.now()
        runtime_seconds = int((end_point - conference.actualStartedAt).total_seconds())

    return SessionDashboardOut(
        conferenceUid=conference.conferenceUid,
        title=conference.suiteTitle or conference.trainingType or "Training Session",
        conferenceDate=conference.conferenceDate,
        conferenceTime=conference.conferenceTime,
        trainerName=conference.trainerName,
        location=", ".join(filter(None, [conference.district, conference.state])) or None,
        conferenceStatus=conference.conferenceStatus,
        approvalStatus=conference.status,
        activeModuleId=conference.activeModuleId,
        actualStartedAt=conference.actualStartedAt.isoformat() if conference.actualStartedAt else None,
        actualEndedAt=conference.actualEndedAt.isoformat() if conference.actualEndedAt else None,
        runtimeSeconds=runtime_seconds,
        audience=AudienceBreakdown(total=len(participant_uids), present=len(present_trainee_uids)),
        assessment=AssessmentSummary(
            **{"pass": pass_count}, fail=fail_count, totalAttempts=len(latest_result_by_trainee)
        ),
        topPerformers=[
            TopPerformer(
                traineeUid=r.traineeUid,
                name=trainees_by_uid[r.traineeUid].name if r.traineeUid in trainees_by_uid else "Unknown Trainee",
                percentage=float(r.percentage),
            )
            for r in top_performers
        ],
        trainees=trainee_rows,
        executionFlow=_execution_flow(db, conference),
        auditLog=_audit_log(db, conference),
    )


@router.get("/trainings/{conference_uid}", response_model=SessionDashboardOut)
def get_session_dashboard(
    conference_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    conference = _get_owned_conference(db, admin, conference_uid)
    return _build_dashboard(db, conference)


@router.post("/trainings/{conference_uid}/start", response_model=TrainingOut)
def start_training(
    conference_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    conference = _get_owned_conference(db, admin, conference_uid)
    if conference.conferenceEndsOn is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This session has already ended")
    if conference.status != "Approved":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This session hasn't been approved by an admin yet",
        )

    conference.conferenceStatus = "Ongoing"
    if conference.actualStartedAt is None:
        conference.actualStartedAt = datetime.now()

    # Nothing else ever sets activeModuleId, so without this every module
    # stays stuck on "Please wait" for trainees even once the session is
    # Ongoing. Activate the first module the session flow actually leads
    # with (attendance if configured - the common case - otherwise the
    # session's own primary module, e.g. a standalone post-test session).
    modules = _configured_modules(conference)
    first_module = modules[0] if modules else "ATTENDANCE"
    conference.activeModuleId = first_module
    _log_module_action(db, conference.conferenceUid, first_module, "STARTED", admin.username)

    db.commit()
    db.refresh(conference)

    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


@router.post("/trainings/{conference_uid}/advance-module", response_model=TrainingOut)
def advance_module(
    conference_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    """Hands the session off from its current live module to the next one
    in the configured flow (e.g. Attendance -> Survey), closing out the
    current module's Execution Flow entry and opening the next. Powers the
    trainer's "Next Module" control on the Session Dashboard."""
    conference = _get_owned_conference(db, admin, conference_uid)
    if conference.conferenceStatus != "Ongoing":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Session is not currently running")

    modules = _configured_modules(conference)
    current = conference.activeModuleId
    if current:
        _log_module_action(db, conference.conferenceUid, current, "STOPPED", admin.username)

    next_module = None
    if current in modules:
        next_index = modules.index(current) + 1
        if next_index < len(modules):
            next_module = modules[next_index]

    conference.activeModuleId = next_module
    if next_module:
        _log_module_action(db, conference.conferenceUid, next_module, "STARTED", admin.username)

    db.commit()
    db.refresh(conference)

    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


@router.post("/trainings/{conference_uid}/end", response_model=TrainingOut)
def end_training(
    conference_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    conference = _get_owned_conference(db, admin, conference_uid)
    if conference.conferenceEndsOn is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This session has already ended")

    if conference.activeModuleId:
        _log_module_action(db, conference.conferenceUid, conference.activeModuleId, "STOPPED", admin.username)
        conference.activeModuleId = None

    conference.conferenceEndsOn = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conference.conferenceStatus = "Completed"
    conference.actualEndedAt = datetime.now()
    db.commit()
    db.refresh(conference)

    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


@router.post("/trainings/{conference_uid}/attendance/{trainee_uid}", response_model=SessionDashboardOut)
def mark_attendance(
    conference_uid: str,
    trainee_uid: str,
    payload: AttendanceMarkRequest,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    """Manual override for the Trainee Master List's IN/OUT controls -
    lets the trainer correct a trainee's attendance status by hand."""
    conference = _get_owned_conference(db, admin, conference_uid)

    record = (
        db.query(Attendance)
        .filter(Attendance.conferenceUid == conference_uid, Attendance.traineeUid == trainee_uid)
        .first()
    )
    if record:
        record.status = payload.status
    else:
        db.add(
            Attendance(
                conferenceUid=conference_uid,
                trainerUid=admin.username,
                traineeUid=trainee_uid,
                markedOn=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                status=payload.status,
            )
        )
    db.commit()

    return _build_dashboard(db, conference)


@router.delete("/trainings/{conference_uid}/attendance/{trainee_uid}", response_model=SessionDashboardOut)
def reset_attendance(
    conference_uid: str,
    trainee_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    """Clears a trainee's attendance record entirely - the "..." control
    on the Trainee Master List."""
    conference = _get_owned_conference(db, admin, conference_uid)

    db.query(Attendance).filter(
        Attendance.conferenceUid == conference_uid, Attendance.traineeUid == trainee_uid
    ).delete()
    db.commit()

    return _build_dashboard(db, conference)
