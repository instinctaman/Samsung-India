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


def _select_current_conference(
    db: Session, trainee: Trainee | None = None
) -> tuple[Conference | None, bool, datetime | None]:
    """Picks which conference is "current" for the trainee app.

    Priority:
      1. A live (`Ongoing`/`Live`) conference - the trainee's own trainer
         first (set when they join a session by QR), then the demo trainer,
         then any live one.
      2. Otherwise an Approved (or, failing that, any) scheduled conference -
         the trainee's trainer first, then the soonest upcoming one (or the
         most recently due if all are overdue).
      3. Otherwise the newest conference on record (keeps seed data with no
         dates working).

    Returns (conference, started, start_at). `started` mirrors whether the
    chosen conference is actually live.
    """
    ongoing_query = db.query(Conference).filter(
        Conference.conferenceStatus.in_(_LIVE_STATUSES)
    )

    if trainee and trainee.trainerEmployeeId:
        trainer_ongoing = ongoing_query.filter(
            Conference.trainerEmployeeId == trainee.trainerEmployeeId
        ).all()
        if trainer_ongoing:
            conf = max(trainer_ongoing, key=lambda c: c.id)
            return conf, True, _conference_start(conf)

    all_ongoing = ongoing_query.all()
    if all_ongoing:
        demo_ongoing = [c for c in all_ongoing if c.trainerEmployeeId == DEMO_TRAINER_EMPLOYEE_ID]
        conf = max(demo_ongoing or all_ongoing, key=lambda c: c.id)
        return conf, True, _conference_start(conf)

    conferences = db.query(Conference).filter(Conference.status == "Approved").all()
    if not conferences:
        conferences = db.query(Conference).all()
    if not conferences:
        return None, False, None

    if trainee and trainee.trainerEmployeeId:
        trainer_confs = [c for c in conferences if c.trainerEmployeeId == trainee.trainerEmployeeId]
        if trainer_confs:
            conferences = trainer_confs

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
        start_at, conference = (
            min(upcoming, key=lambda item: item[0])
            if upcoming
            else max(timed, key=lambda item: item[0])
        )
        return conference, conference.conferenceStatus in _LIVE_STATUSES, start_at

    if undated:
        conf = max(undated, key=lambda c: c.id)
        return conf, conf.conferenceStatus in _LIVE_STATUSES, None

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
    conference, started, start_at = _select_current_conference(db, trainee=trainee)
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

    # A module counts as "missed" once the flow has moved past it (or its own
    # window / the whole session has closed) without the trainee completing
    # it - as opposed to just not-yet-live, which still shows "please wait".
    module_order = configured_modules(conference)
    active_index = module_order.index(conference.activeModuleId) if conference.activeModuleId in module_order else None

    def _time_passed(end_time_str: str | None) -> bool:
        if not end_time_str:
            return False
        try:
            now = datetime.now()
            if conference.conferenceDate:
                end_dt = datetime.strptime(
                    f"{conference.conferenceDate} {end_time_str}", "%Y-%m-%d %I:%M %p"
                )
                return now > end_dt
            return now.time() > datetime.strptime(end_time_str, "%I:%M %p").time()
        except ValueError:
            return False

    def is_missed(key: str, completed: bool, live: bool, end_time_str: str | None = None) -> bool:
        if completed:
            return False
        if conference.conferenceStatus == "Completed":
            return True
        now_date_str = datetime.now().strftime("%Y-%m-%d")
        if conference.conferenceEndsOn and str(conference.conferenceEndsOn) < now_date_str:
            return True
        if _time_passed(end_time_str):
            return True
        if live:
            return False
        if key not in module_order or active_index is None:
            return False
        return module_order.index(key) < active_index

    attendance = attendance_repository.get_for_conference_and_trainee(
        db, conference.conferenceUid, trainee.traineeUid
    )
    # A row alone isn't "checked in" - joining by QR seeds a "Joined" row and
    # the roster seeds "Pending" ones. Attendance only counts as done once
    # it's resolved to Present/Absent (the trainee's Secure Check-In or the
    # trainer marking them on the Participant Master List).
    attendance_completed = attendance is not None and attendance.status in ("Present", "Absent")
    attendance_live = not attendance_completed and conference.activeModuleId == "ATTENDANCE"

    attendance_cfg = config.get("attendance", {})
    # Sessions imported without a Session Flow config have no per-module
    # times - fall back to the conference's own start time so the trainee
    # sees a real value instead of a hardcoded placeholder.
    attendance_open = attendance_cfg.get("checkInOpens") or conference.conferenceTime
    attendance_close = attendance_cfg.get("checkOutCloses")
    modules.append(
        SessionModule(
            key="ATTENDANCE",
            name=MODULE_NAMES["ATTENDANCE"],
            time=attendance_open,
            endTime=attendance_close,
            duration=duration(attendance_open, attendance_close),
            isLive=attendance_live,
            isCompleted=attendance_completed,
            isMissed=is_missed("ATTENDANCE", attendance_completed, attendance_live, attendance_close),
            completedAt=attendance.markedOn.split(" ")[-1][:5] if attendance and attendance.markedOn else None,
        )
    )

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
        start_time_str = module_cfg.get("startTime") or conference.conferenceTime
        end_time_str = module_cfg.get("endTime")
        result = assessment_repository.get_latest_result(db, conference.conferenceUid, trainee.traineeUid, suite_uid)
        completed = result is not None
        live = not completed and conference.activeModuleId == key

        modules.append(
            SessionModule(
                key=key,
                name=MODULE_NAMES[key],
                time=start_time_str,
                endTime=end_time_str,
                duration=duration(start_time_str, end_time_str),
                isLive=live,
                isCompleted=completed,
                isMissed=is_missed(key, completed, live, end_time_str),
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
