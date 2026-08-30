import json
import uuid
from collections import defaultdict
from datetime import date, datetime
from typing import Optional

from fastapi import BackgroundTasks, UploadFile
from sqlalchemy.orm import Session

from app.core.constants import MODULE_LABELS, PASS_THRESHOLD_PERCENT
from app.core.exceptions import conflict, forbidden, not_found
from app.core.media import media_subdir
from app.models.admin import Admin
from app.models.attendance import Attendance
from app.models.conference import Conference
from app.models.conference_activity_log import ConferenceActivityLog
from app.repositories import (
    activity_log_repository,
    admin_repository,
    assessment_repository,
    attendance_repository,
    catalog_repository,
    conference_repository,
    trainee_repository,
)
from app.routers.ws import manager as ws_manager
from app.utils.validators import validate_image_upload
from app.schemas.training import (
    AssessmentSummary,
    AttendanceListItemOut,
    AttendanceMarkRequest,
    AudienceBreakdown,
    AuditLogEntry,
    ExecutionFlowItem,
    PendingSessionItem,
    SessionDashboardOut,
    TopPerformer,
    TraineeRow,
    TrainerAgendaResponse,
    TrainingAgendaItem,
    TrainingCreate,
    TrainingOut,
)
from app.services.module_flow import auto_advance_if_due, configured_modules, log_module_action


def _execution_flow(db: Session, conference: Conference) -> list[ExecutionFlowItem]:
    modules = configured_modules(conference)
    if not modules:
        return []

    logs = activity_log_list(db, conference.conferenceUid)
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


def activity_log_list(db: Session, conference_uid: str) -> list[ConferenceActivityLog]:
    return activity_log_repository.list_for_conference(db, conference_uid)


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
    for admin in admin_repository.get_admins_by_usernames(db, usernames):
        names[admin.username] = admin.name or admin.username
    remaining = usernames - names.keys()
    if remaining:
        for agent in admin_repository.get_agents_by_usernames(db, remaining):
            names[agent.username] = agent.name or agent.username
    return names


def _audit_log(db: Session, conference: Conference) -> list[AuditLogEntry]:
    modules = configured_modules(conference)
    if not modules:
        return []

    logs = activity_log_list(db, conference.conferenceUid)
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


def create_training(db: Session, payload: TrainingCreate, background_tasks: BackgroundTasks, admin: Admin) -> TrainingOut:
    session_config = {}
    if payload.isResidential and payload.trainingEndDate:
        session_config["trainingEndDate"] = payload.trainingEndDate
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
        # The trainee session flow (see session_service._select_current_conference
        # / get_current_session) only knows a Standard Test or Survey module
        # exists via these two columns - it doesn't read `sessionConfig` for
        # that, so the chosen question set has to be copied out here too,
        # not just stored in the JSON blob above.
        postAssessmentUid=payload.sessionFlow.standardTest.assessmentSuiteUid
        if payload.sessionFlow and payload.sessionFlow.standardTest
        else None,
        surveyUid=payload.sessionFlow.survey.assessmentSuiteUid
        if payload.sessionFlow and payload.sessionFlow.survey
        else None,
        updatedBy=admin.username,
        # Every new training needs an admin to review and approve it (see
        # list_pending_trainings + approve_training) before the trainer can
        # start it - see the check in start_training.
        status="Pending",
    )
    conference = conference_repository.create(db, conference)

    background_tasks.add_task(
        ws_manager.send_to,
        conference.trainerEmployeeId,
        {"type": "training_created", "conferenceUid": conference.conferenceUid},
    )

    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


def _get_owned_conference(db: Session, admin: Admin, conference_uid: str) -> Conference:
    conference = conference_repository.get_owned_by_trainer(db, admin.username, conference_uid)
    if not conference:
        raise not_found("Training not found")
    return conference


def _real_trainee_uids_by_conference(db: Session, conference_uids: list[str]) -> dict[str, set[str]]:
    """Real headcount per conference - the same "who actually showed up or
    attempted the test" definition used by the single-session dashboard
    (see `_build_dashboard`) - rather than the planned `batchSize` field,
    which is just whatever capacity number the trainer typed in at
    creation time and never reflects who was actually trained."""
    by_conference: dict[str, set[str]] = defaultdict(set)
    if not conference_uids:
        return by_conference

    for conference_uid, trainee_uid in attendance_repository.list_present_pairs(db, conference_uids):
        by_conference[conference_uid].add(trainee_uid)

    for conference_uid, trainee_uid in assessment_repository.list_submitted_pairs(db, conference_uids):
        by_conference[conference_uid].add(trainee_uid)

    return by_conference


def _venue_names_for(db: Session, conferences: list[Conference]) -> dict[str, str]:
    venue_uids = {c.venueUid for c in conferences if c.venueUid}
    if not venue_uids:
        return {}
    return {v.venueUid: v.name for v in catalog_repository.get_venues_by_uids(db, venue_uids) if v.name}


def _to_agenda_item(
    conference: Conference, trainee_count: int, venue_name_by_uid: dict[str, str]
) -> TrainingAgendaItem:
    return TrainingAgendaItem(
        conferenceUid=conference.conferenceUid,
        title=conference.suiteTitle or conference.trainingType or "Training Session",
        trainerName=conference.trainerName,
        hoid=conference.trainerEmployeeId,
        conferenceDate=conference.conferenceDate,
        conferenceTime=conference.conferenceTime,
        conferenceStatus=conference.conferenceStatus,
        approvalStatus=conference.status,
        location=", ".join(filter(None, [conference.district, conference.state])) or None,
        batchSize=conference.batchSize,
        trainingType=conference.trainingType,
        state=conference.state,
        district=conference.district,
        trainingHub=conference.trainingHub,
        venueName=venue_name_by_uid.get(conference.venueUid),
        updatedBy=conference.updatedBy,
        updationOn=conference.updationOn.strftime("%Y-%m-%d %H:%M:%S") if conference.updationOn else None,
        timestamp=conference.timestamp.strftime("%Y-%m-%d %H:%M:%S") if conference.timestamp else None,
        traineeCount=trainee_count,
    )


def list_trainer_trainings(
    db: Session, admin: Admin, start: Optional[str], end: Optional[str], all_sessions: bool
) -> TrainerAgendaResponse:
    """Powers the trainer's Home agenda, and (with `all_sessions=true`) the
    Training List / Pending Training List / Sessions screens that need this
    trainer's complete history rather than just today. `start`/`end` are
    `YYYY-MM-DD` strings (matching how `conferenceDate` is stored) and are
    compared lexicographically, which sorts correctly for that format.

    With neither `start`/`end` nor `all_sessions` given - the dashboard's
    initial, unfiltered landing view - this deliberately mixes scopes:
    totalSessions/completed/pending only cover TODAY, while totalTrainees is
    an all-time cumulative headcount across every session this trainer has
    ever run ("who have I trained so far" isn't naturally a single-day
    question). As soon as the trainer applies an explicit start/end (or a
    caller asks for `all_sessions`), every number (including totalTrainees)
    is scoped to that range/scope instead."""
    is_default_view = start is None and end is None and not all_sessions

    if all_sessions:
        conferences = conference_repository.list_all_for_trainer(db, admin.username)
    elif is_default_view:
        conferences = conference_repository.list_for_trainer(db, admin.username, exact_date=date.today().isoformat())
    else:
        conferences = conference_repository.list_for_trainer(db, admin.username, start=start, end=end)

    conference_uids = [c.conferenceUid for c in conferences]
    trainee_uids_by_conference = _real_trainee_uids_by_conference(db, conference_uids)
    venue_name_by_uid = _venue_names_for(db, conferences)

    result = [
        _to_agenda_item(
            conference,
            len(trainee_uids_by_conference.get(conference.conferenceUid, set())),
            venue_name_by_uid,
        )
        for conference in conferences
    ]

    if is_default_view:
        # All-time headcount across every session this trainer has ever run,
        # not just today's - a trainee trained last month still counts.
        all_conference_uids = [c.conferenceUid for c in conference_repository.list_all_for_trainer(db, admin.username)]
        trainee_source = _real_trainee_uids_by_conference(db, all_conference_uids)
    else:
        # De-duplicated across every session in the filtered range - a
        # trainee trained in more than one of these sessions still counts once.
        trainee_source = trainee_uids_by_conference

    all_trainee_uids: set[str] = set()
    for uids in trainee_source.values():
        all_trainee_uids |= uids

    total_sessions = len(conferences)
    completed = sum(1 for c in conferences if c.conferenceStatus == "Completed")
    pending = total_sessions - completed
    executed_percentage = round((completed / total_sessions) * 100) if total_sessions else 0
    pending_percentage = round((pending / total_sessions) * 100) if total_sessions else 0

    # Always all-time, regardless of `start`/`end` - the Recent Sessions card
    # wants "what did I most recently complete", not "what completed within
    # whatever range is currently filtered".
    recent_completed_conferences = conference_repository.list_recent_completed_for_trainer(db, admin.username, 2)
    recent_completed_uids = _real_trainee_uids_by_conference(
        db, [c.conferenceUid for c in recent_completed_conferences]
    )
    recent_venue_name_by_uid = _venue_names_for(db, recent_completed_conferences)
    recent_completed = [
        _to_agenda_item(
            conference,
            len(recent_completed_uids.get(conference.conferenceUid, set())),
            recent_venue_name_by_uid,
        )
        for conference in recent_completed_conferences
    ]

    return TrainerAgendaResponse(
        trainings=result,
        totalTrainees=len(all_trainee_uids),
        totalSessions=total_sessions,
        completed=completed,
        pending=pending,
        executedPercentage=executed_percentage,
        pendingPercentage=pending_percentage,
        recentCompleted=recent_completed,
    )


def list_pending_trainings(db: Session) -> list[PendingSessionItem]:
    """Every trainer's not-yet-reviewed sessions, across all trainers -
    powers the admin dashboard's Pending Approvals list."""
    conferences = conference_repository.list_pending(db)
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
    conference = conference_repository.get_by_uid(db, conference_uid)
    if not conference:
        raise not_found("Training not found")
    return conference


def approve_training(db: Session, admin: Admin, conference_uid: str) -> TrainingOut:
    conference = _find_any_conference(db, conference_uid)
    conference.status = "Approved"
    conference.updatedBy = admin.username
    conference_repository.save(db, conference)
    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


def reject_training(db: Session, admin: Admin, conference_uid: str) -> TrainingOut:
    conference = _find_any_conference(db, conference_uid)
    conference.status = "Rejected"
    conference.updatedBy = admin.username
    conference_repository.save(db, conference)
    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


def _build_dashboard(db: Session, conference: Conference) -> SessionDashboardOut:
    auto_advance_if_due(db, conference)
    conference_uid = conference.conferenceUid

    attendance_rows = attendance_repository.list_for_conference(db, conference_uid)
    present_trainee_uids = {a.traineeUid for a in attendance_rows if a.status == "Present"}

    result_rows: list = []
    if conference.postAssessmentUid:
        result_rows = assessment_repository.list_results_for_conference_suite(
            db, conference_uid, conference.postAssessmentUid
        )
    # Keep only the latest attempt per trainee (rows are already ordered by
    # attemptNumber desc, so the first one seen per trainee wins).
    latest_result_by_trainee: dict[str, object] = {}
    for result in result_rows:
        latest_result_by_trainee.setdefault(result.traineeUid, result)

    participant_uids = present_trainee_uids | set(latest_result_by_trainee.keys())
    trainees_by_uid = {t.traineeUid: t for t in trainee_repository.get_by_uids(db, participant_uids)}

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
        trainingType=conference.trainingType,
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


def get_session_dashboard(db: Session, admin: Admin, conference_uid: str) -> SessionDashboardOut:
    conference = _get_owned_conference(db, admin, conference_uid)
    return _build_dashboard(db, conference)


async def start_training(db: Session, admin: Admin, conference_uid: str, photo: UploadFile) -> TrainingOut:
    conference = _get_owned_conference(db, admin, conference_uid)
    if conference.conferenceEndsOn is not None:
        raise conflict("This session has already ended")
    if conference.status != "Approved":
        raise forbidden("This session hasn't been approved by an admin yet")

    # The trainer must capture a check-in photo to start the session - same
    # identity-verification idea as the trainee's secure attendance check-in.
    contents = await photo.read()
    extension = validate_image_upload(photo.content_type, contents, size_error_detail="Photo must be 5MB or smaller")
    photo_dir = media_subdir("trainer_checkin_photos")
    filename = f"{conference.conferenceUid}.{extension}"
    (photo_dir / filename).write_bytes(contents)
    conference.startConferenceImage = f"trainer_checkin_photos/{filename}"

    conference.conferenceStatus = "Ongoing"
    if conference.actualStartedAt is None:
        conference.actualStartedAt = datetime.now()

    # Nothing else ever sets activeModuleId, so without this every module
    # stays stuck on "Please wait" for trainees even once the session is
    # Ongoing. Activate the first module the session flow actually leads
    # with (attendance if configured - the common case - otherwise the
    # session's own primary module, e.g. a standalone post-test session).
    modules = configured_modules(conference)
    first_module = modules[0] if modules else "ATTENDANCE"
    conference.activeModuleId = first_module
    log_module_action(db, conference.conferenceUid, first_module, "STARTED", admin.username)

    conference_repository.save(db, conference)

    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


def advance_module(db: Session, admin: Admin, conference_uid: str) -> TrainingOut:
    """Hands the session off from its current live module to the next one
    in the configured flow (e.g. Attendance -> Survey), closing out the
    current module's Execution Flow entry and opening the next. Powers the
    trainer's "Next Module" control on the Session Dashboard."""
    conference = _get_owned_conference(db, admin, conference_uid)
    if conference.conferenceStatus != "Ongoing":
        raise conflict("Session is not currently running")

    modules = configured_modules(conference)
    current = conference.activeModuleId
    if current:
        log_module_action(db, conference.conferenceUid, current, "STOPPED", admin.username)

    next_module = None
    if current in modules:
        next_index = modules.index(current) + 1
        if next_index < len(modules):
            next_module = modules[next_index]

    conference.activeModuleId = next_module
    if next_module:
        log_module_action(db, conference.conferenceUid, next_module, "STARTED", admin.username)

    conference_repository.save(db, conference)

    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


def end_training(db: Session, admin: Admin, conference_uid: str) -> TrainingOut:
    conference = _get_owned_conference(db, admin, conference_uid)
    if conference.conferenceEndsOn is not None:
        raise conflict("This session has already ended")

    if conference.activeModuleId:
        log_module_action(db, conference.conferenceUid, conference.activeModuleId, "STOPPED", admin.username)
        conference.activeModuleId = None

    conference.conferenceEndsOn = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conference.conferenceStatus = "Completed"
    conference.actualEndedAt = datetime.now()
    conference_repository.save(db, conference)

    return TrainingOut(
        conferenceUid=conference.conferenceUid,
        conferenceStatus=conference.conferenceStatus,
        status=conference.status,
    )


def mark_attendance(
    db: Session, admin: Admin, conference_uid: str, trainee_uid: str, payload: AttendanceMarkRequest
) -> SessionDashboardOut:
    """Manual override for the Trainee Master List's IN/OUT controls -
    lets the trainer correct a trainee's attendance status by hand."""
    conference = _get_owned_conference(db, admin, conference_uid)

    record = attendance_repository.get_for_conference_and_trainee(db, conference_uid, trainee_uid)
    if record:
        record.status = payload.status
        attendance_repository.save(db)
    else:
        attendance_repository.create(
            db,
            Attendance(
                conferenceUid=conference_uid,
                trainerUid=admin.username,
                traineeUid=trainee_uid,
                markedOn=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                status=payload.status,
            ),
        )

    return _build_dashboard(db, conference)


def reset_attendance(db: Session, admin: Admin, conference_uid: str, trainee_uid: str) -> SessionDashboardOut:
    """Clears a trainee's attendance record entirely - the "..." control
    on the Trainee Master List."""
    conference = _get_owned_conference(db, admin, conference_uid)
    attendance_repository.delete_for_conference_and_trainee(db, conference_uid, trainee_uid)
    return _build_dashboard(db, conference)


def list_attendance(db: Session, admin: Admin) -> list[AttendanceListItemOut]:
    """Powers the trainer's Attendance List / Pending Attendance / Confirmed
    Attendance screens (all three fetch this same list and split it
    client-side by `marked`). Scoped to this trainer's own conferences,
    same as list_trainer_trainings - this lives in the trainer's own More
    menu, not a cross-trainer admin view."""
    conferences = conference_repository.list_all_for_trainer(db, admin.username)
    conference_by_uid = {c.conferenceUid: c for c in conferences}
    conference_uids = list(conference_by_uid.keys())
    if not conference_uids:
        return []

    attendance_rows = attendance_repository.list_for_conferences(db, conference_uids)

    trainee_uids = {a.traineeUid for a in attendance_rows}
    trainees_by_uid = {t.traineeUid: t for t in trainee_repository.get_by_uids(db, trainee_uids)}

    result_rows = assessment_repository.list_results_for_conferences(db, conference_uids)
    # Keep only the latest attempt per (conference, trainee), matching a
    # conference's own post-test suite - the same "latest attempt wins"
    # rule _build_dashboard uses for the single-session dashboard.
    latest_result: dict[tuple[str, str], object] = {}
    for r in result_rows:
        conference = conference_by_uid.get(r.conferenceUid)
        if not conference or r.assessmentSuiteUid != conference.postAssessmentUid:
            continue
        key = (r.conferenceUid, r.traineeUid)
        latest_result.setdefault(key, r)

    items: list[AttendanceListItemOut] = []
    for a in attendance_rows:
        conference = conference_by_uid.get(a.conferenceUid)
        trainee = trainees_by_uid.get(a.traineeUid)
        result = latest_result.get((a.conferenceUid, a.traineeUid))

        post_test_score = None
        post_test_summary = None
        if result:
            total = float(result.maxScore)
            correct = float(result.totalScore)
            post_test_score = f"{correct:g} / {total:g} ({float(result.percentage):g}%)"
            post_test_summary = f"Total: {total:g}, Correct: {correct:g}, Wrong: {total - correct:g}"

        items.append(
            AttendanceListItemOut(
                attendanceId=a.attendanceUid or str(a.id),
                region=conference.region if conference else None,
                product=conference.trainingType if conference else None,
                session=conference.sessionType if conference else None,
                audienceType=conference.audience if conference else None,
                conferenceDate=conference.conferenceDate if conference else None,
                trainerName=conference.trainerName if conference else None,
                trainerHoId=conference.trainerEmployeeId if conference else None,
                participantHoId=trainee.employee_id if trainee else None,
                participantName=trainee.name if trainee else "Unknown Trainee",
                phone=str(a.phone) if a.phone else (str(trainee.phone) if trainee else None),
                state=conference.state if conference else None,
                location=", ".join(filter(None, [conference.district, conference.state])) if conference else None,
                reportingManagerOfPromoter=trainee.supervisorName if trainee else None,
                attendanceStatus=a.status,
                checkIn=a.markedOn,
                checkOut=a.checkOutTime.strftime("%Y-%m-%d %H:%M:%S") if a.checkOutTime else None,
                postTestScore=post_test_score,
                postTestScoreSummary=post_test_summary,
                sessionTypeMethod=conference.sessionType if conference else None,
                conferenceId=a.conferenceUid,
                lastUpdates=a.timestamp.strftime("%Y-%m-%d %H:%M:%S") if a.timestamp else None,
                marked=a.status == "Present",
            )
        )

    return items
