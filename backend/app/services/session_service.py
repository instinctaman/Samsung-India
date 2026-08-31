import json
from datetime import datetime

from sqlalchemy.orm import Session

from app.core.constants import DEMO_TRAINER_EMPLOYEE_ID, PASS_THRESHOLD_PERCENT
from app.core.exceptions import bad_request, not_found
from app.models.attendance import Attendance
from app.models.conference import Conference
from app.models.trainee import Trainee
from app.repositories import (
    assessment_repository,
    attendance_repository,
    conference_repository,
    trainee_repository,
)
from app.schemas.session import CurrentSession, SessionHistoryItem, SessionJoinInfo, SessionModule
from app.services.module_flow import auto_advance_if_due, configured_modules
from app.utils.date_utils import duration, parse_module_start
from app.utils.status import title_status

_LIVE_STATUSES = ("Ongoing", "Live")

MODULE_NAMES = {
    "ATTENDANCE": "Attendance",
    "STANDARD_TEST": "Standard Test",
    "LIVE_QUIZ": "Live Quiz",
    "SURVEY": "Survey",
}


def _parse_session_config(raw: str | None) -> dict:
    if not raw:
        return {}
    try:
        return json.loads(raw)
    except ValueError:
        return {}


def _conference_start(conference: Conference) -> datetime | None:
    return parse_module_start(conference.conferenceDate, conference.conferenceTime)


def _select_current_conference(db: Session) -> tuple[Conference | None, bool, datetime | None]:
    """Picks which conference is "current" for the trainee app. To point the
    app at a different session for testing, just edit that row's
    `conferenceDate` / `conferenceTime` (or `status`) in the database.

    Trainees can't yet pick which trainer's session to join - that'll come
    from scanning a QR code or entering a trainer ID. Until then, the app
    only ever shows the demo trainer's session, so this is hardcoded to
    `DEMO_TRAINER_EMPLOYEE_ID`.

    Returns (conference, started, start_at):
      - A conference the trainer has explicitly started (`conferenceStatus
        == "Ongoing"`, set by POST /admin/trainings/{uid}/start) is
        "current" and reports started=True - going live is a trainer
        action, not something derived from the clock - **but only if
        today is actually the training's assigned `conferenceDate`**. A
        trainer can still press Start on the wrong day (nothing on the
        trainer side blocks that), but it won't show as a live, joinable
        session to trainees until the right day - it's excluded from every
        bucket below, same as if it didn't exist yet.
      - Otherwise, among the remaining (still-`Scheduled`) conferences,
        picks the soonest upcoming one (or the most recently-due one if all
        of them are overdue) and reports started=False, so the caller can
        show "starts at ...".
      - If none of those has a parseable date/time at all, falls back to
        the most recently created one, started=True (keeps existing seed
        data working without dates).
    """
    conferences = conference_repository.list_approved_active_for_trainer(db, DEMO_TRAINER_EMPLOYEE_ID)
    if not conferences:
        return None, False, None

    today_str = date.today().isoformat()
    conferences = [
        c for c in conferences
        if c.conferenceStatus != "Ongoing" or c.conferenceDate == today_str
    ]
    if not conferences:
        return None, False, None

    ongoing = [c for c in conferences if c.conferenceStatus == "Ongoing"]
    if ongoing:
        conference = max(ongoing, key=lambda c: c.id)
        return conference, True, _conference_start(conference)

    now = datetime.now()
    timed: list[tuple[datetime, Conference]] = []
    undated: list[Conference] = []

    for conference in conferences:
        start_at = _conference_start(conference)
        if start_at is None:
            undated.append(conference)
        else:
            timed.append((start_at, conference))

    if timed:
        upcoming = [item for item in timed if item[0] > now]
        start_at, conference = min(upcoming, key=lambda item: item[0]) if upcoming else max(timed, key=lambda item: item[0])
        return conference, False, start_at

    if undated:
        return max(undated, key=lambda c: c.id), True, None

    return None, False, None


def _join_info(conference: Conference) -> SessionJoinInfo:
    start_at = _conference_start(conference)
    return SessionJoinInfo(
        conferenceUid=conference.conferenceUid,
        title=conference.suiteTitle or conference.trainingType or "Training Session",
        sessionType=conference.sessionType,
        date=conference.conferenceDate,
        location=", ".join(filter(None, [conference.district, conference.state])) or None,
        trainerName=conference.trainerName,
        started=conference.conferenceStatus in _LIVE_STATUSES,
        startsAt=start_at.strftime("%d %b %Y, %I:%M %p") if start_at else None,
    )


def _conference_for_code(db: Session, code: str) -> Conference:
    conference = conference_repository.get_by_uid(db, code)
    if not conference:
        raise not_found("That training session code isn't valid")
    approved = title_status(conference.status) == "Approved"
    if not approved and conference.conferenceStatus not in (*_LIVE_STATUSES, "Completed"):
        raise bad_request("This training isn't open to join yet")
    return conference


def get_join_info(db: Session, code: str) -> SessionJoinInfo:
    """Public preview of the training behind a scanned QR code."""
    return _join_info(_conference_for_code(db, code))


def join_session(db: Session, trainee: Trainee, code: str) -> SessionJoinInfo:
    """Binds the (already-authenticated) trainee to the scanned training so
    `GET /sessions/current` resolves to it, and auto-approves a trainee who
    reached the app through a trainer-shared QR."""
    conference = _conference_for_code(db, code)
    trainee.trainerEmployeeId = conference.trainerEmployeeId
    if title_status(trainee.status) != "Approved":
        trainee.status = "Approved"
    trainee_repository.save(db, trainee)

    # Register the trainee as a participant of this specific conference so
    # they show on the trainer's live Participant Master List right away.
    # Status "Joined" distinguishes a QR/link participant from the pre-seeded
    # roster "Pending" rows (which the dashboard deliberately hides); check-in
    # later promotes it to "Present".
    if not attendance_repository.get_for_conference_and_trainee(
        db, conference.conferenceUid, trainee.traineeUid
    ):
        attendance_repository.create(
            db,
            Attendance(
                conferenceUid=conference.conferenceUid,
                trainerUid=conference.trainerEmployeeId,
                traineeUid=trainee.traineeUid,
                phone=trainee.phone,
                status="Joined",
            ),
        )
    return _join_info(conference)


def get_current_session(db: Session, trainee: Trainee) -> CurrentSession:
    conference, started, start_at = _select_current_conference(db)
    if not conference:
        raise not_found("No active training session found")

    auto_advance_if_due(db, conference)

    location = ", ".join(filter(None, [conference.district, conference.state])) or None

    if not started:
        return CurrentSession(
            conferenceUid=conference.conferenceUid,
            title=conference.suiteTitle or "Training Session",
            sessionType=conference.sessionType,
            date=conference.conferenceDate,
            location=location,
            trainerName=conference.trainerName,
            confirmationStatus="Not Confirmed",
            started=False,
            startsAt=start_at.strftime("%d %b %Y, %I:%M %p") if start_at else None,
            modules=[],
        )

    config = _parse_session_config(conference.sessionConfig)
    modules: list[SessionModule] = []

    # A module counts as "missed" once the flow has moved past it (or the
    # session's fully over) without the trainee ever completing it - as
    # opposed to just not-yet-live, which still shows "please wait".
    module_order = configured_modules(conference)
    active_index = module_order.index(conference.activeModuleId) if conference.activeModuleId in module_order else None

    def is_missed(key: str, completed: bool, live: bool) -> bool:
        if completed or live:
            return False
        if conference.conferenceEndsOn is not None:
            return True
        if key not in module_order or active_index is None:
            return False
        return module_order.index(key) < active_index

    # Only include Attendance if the trainer actually enabled it in the
    # Session Flow builder - matches how STANDARD_TEST/LIVE_QUIZ/SURVEY
    # below are only included when a question set was configured for them,
    # so the trainee only ever sees the modules this training was built with.
    if conference.enableCheckIn:
        attendance = attendance_repository.get_for_conference_and_trainee(
            db, conference.conferenceUid, trainee.traineeUid
        )
        attendance_completed = attendance is not None
        attendance_live = not attendance_completed and conference.activeModuleId == "ATTENDANCE"

        attendance_cfg = config.get("attendance", {})
        modules.append(
            SessionModule(
                key="ATTENDANCE",
                name=MODULE_NAMES["ATTENDANCE"],
                time=attendance_cfg.get("checkInOpens"),
                endTime=attendance_cfg.get("checkOutCloses"),
                duration=duration(attendance_cfg.get("checkInOpens"), attendance_cfg.get("checkOutCloses")),
                isLive=attendance_live,
                isCompleted=attendance_completed,
                isMissed=is_missed("ATTENDANCE", attendance_completed, attendance_live),
                completedAt=attendance.markedOn.split(" ")[-1][:5] if attendance and attendance.markedOn else None,
            )
        )
    else:
        attendance_cfg = config.get("attendance", {})
        attendance_completed = False

    for key, suite_uid, config_key in (
        ("STANDARD_TEST", conference.postAssessmentUid, "standardTest"),
        # Unlike Standard Test/Survey, Live Quiz has no dedicated Conference
        # column yet - its assessmentSuiteUid only ever lives in
        # sessionConfig. For now it's answered the same way a Standard Test
        # is (fetch questions, submit answers) - the trainer picking a
        # question live for trainees to answer is a future iteration.
        ("LIVE_QUIZ", config.get("liveQuiz", {}).get("assessmentSuiteUid"), "liveQuiz"),
        ("SURVEY", conference.surveyUid, "survey"),
    ):
        if not suite_uid:
            continue

        module_cfg = config.get(config_key, {})
        result = assessment_repository.get_latest_result(db, conference.conferenceUid, trainee.traineeUid, suite_uid)
        completed = result is not None
        live = not completed and conference.activeModuleId == key

        modules.append(
            SessionModule(
                key=key,
                name=MODULE_NAMES[key],
                time=module_cfg.get("startTime"),
                endTime=module_cfg.get("endTime"),
                duration=duration(module_cfg.get("startTime"), module_cfg.get("endTime")),
                isLive=live,
                isCompleted=completed,
                isMissed=is_missed(key, completed, live),
                completedAt=result.submittedAt.strftime("%H:%M") if result and result.submittedAt else None,
                score=f"{float(result.totalScore):g}/{float(result.maxScore):g}" if result else None,
                assessmentSuiteUid=suite_uid,
            )
        )

    return CurrentSession(
        conferenceUid=conference.conferenceUid,
        title=conference.suiteTitle or "Training Session",
        sessionType=conference.sessionType,
        date=conference.conferenceDate,
        location=location,
        trainerName=conference.trainerName,
        confirmationStatus="Confirmed" if attendance_completed else "Not Confirmed",
        started=True,
        attendanceGeoFencing=bool(attendance_cfg.get("geoFencing")),
        modules=modules,
    )


def get_session_history(db: Session, trainee: Trainee, limit: int) -> list[SessionHistoryItem]:
    """The trainee's past sessions with their attendance/result, for the
    "Recent Sessions" popup on the session detail screen."""
    attendance_rows = attendance_repository.list_for_trainee(db, trainee.traineeUid)
    result_rows = assessment_repository.list_results_for_trainee(db, trainee.traineeUid)

    conference_uids = {a.conferenceUid for a in attendance_rows} | {r.conferenceUid for r in result_rows}
    if not conference_uids:
        return []

    conferences = conference_repository.list_by_uids(db, conference_uids, limit=limit)

    attendance_by_conference = {a.conferenceUid: a for a in attendance_rows}
    # Rows are already ordered by submittedAt desc, so the first one seen
    # per conference is that trainee's most recent result there.
    latest_result_by_conference = {}
    for result in result_rows:
        latest_result_by_conference.setdefault(result.conferenceUid, result)

    items: list[SessionHistoryItem] = []
    for conference in conferences:
        attendance = attendance_by_conference.get(conference.conferenceUid)
        result = latest_result_by_conference.get(conference.conferenceUid)
        items.append(
            SessionHistoryItem(
                conferenceUid=conference.conferenceUid,
                title=conference.suiteTitle or conference.trainingType or "Training Session",
                date=conference.conferenceDate,
                trainerName=conference.trainerName,
                attendanceStatus=attendance.status if attendance else None,
                score=f"{float(result.percentage):g}%" if result else None,
                passed=(float(result.percentage) >= PASS_THRESHOLD_PERCENT) if result else None,
            )
        )
    return items
