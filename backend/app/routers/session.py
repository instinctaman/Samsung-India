import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_trainee
from app.database.database import get_db
from app.models.attendance import Attendance
from app.models.conference import Conference
from app.models.quiz import AssessmentResult
from app.models.trainee import Trainee
from app.schemas.session import CurrentSession, SessionHistoryItem, SessionModule
from app.services.module_flow import auto_advance_if_due, configured_modules

router = APIRouter(prefix="/sessions", tags=["sessions"])

MODULE_NAMES = {
    "ATTENDANCE": "Attendance",
    "STANDARD_TEST": "Standard Test",
    "LIVE_QUIZ": "Live Quiz",
    "SURVEY": "Survey",
}

# Matches PASS_THRESHOLD_PERCENT in routers/training.py - kept as a
# separate constant since this router doesn't otherwise depend on that one.
PASS_THRESHOLD_PERCENT = 50


def _parse_session_config(raw: str | None) -> dict:
    if not raw:
        return {}
    try:
        return json.loads(raw)
    except ValueError:
        return {}


def _duration(start: str | None, end: str | None) -> str | None:
    if not start or not end:
        return None
    try:
        started = datetime.strptime(start, "%I:%M %p")
        ended = datetime.strptime(end, "%I:%M %p")
    except ValueError:
        return None

    minutes = int((ended - started).total_seconds() // 60)
    if minutes <= 0:
        return None

    hours, mins = divmod(minutes, 60)
    if hours and mins:
        return f"{hours}h {mins}m"
    if hours:
        return f"{hours}h"
    return f"{mins}m"


def _find_assessment_result(
    db: Session, conference_uid: str, trainee_uid: str, suite_uid: str
) -> AssessmentResult | None:
    return (
        db.query(AssessmentResult)
        .filter(
            AssessmentResult.conferenceUid == conference_uid,
            AssessmentResult.traineeUid == trainee_uid,
            AssessmentResult.assessmentSuiteUid == suite_uid,
            AssessmentResult.status == "Submitted",
        )
        .order_by(AssessmentResult.attemptNumber.desc())
        .first()
    )


def _conference_start(conference: Conference) -> datetime | None:
    """`conferenceDate`/`conferenceTime` are free-text columns filled in by
    whoever schedules the training (e.g. "2026-07-25" / "10:00 AM"). This is
    the one place that combines and parses them - change the format strings
    here if the admin panel that writes those columns ever changes its
    format."""
    if not conference.conferenceDate or not conference.conferenceTime:
        return None
    try:
        return datetime.strptime(
            f"{conference.conferenceDate} {conference.conferenceTime}",
            "%Y-%m-%d %I:%M %p",
        )
    except ValueError:
        return None


DEMO_TRAINER_EMPLOYEE_ID = "demotrainer"


def _select_current_conference(
    db: Session, trainee: Trainee | None = None
) -> tuple[Conference | None, bool, datetime | None]:
    """Picks which conference is "current" for the trainee app.

    Priority:
      1. Any conference with conferenceStatus in ("Ongoing", "Live") (matching trainee's trainer/demo trainer first, or any active one).
      2. Approved scheduled conferences (matching trainee trainer or demo trainer, then any approved).
      3. Fallback to the latest available conference in the database.
    """
    # 1. Look for actively Ongoing / Live conferences
    ongoing_query = db.query(Conference).filter(
        Conference.conferenceStatus.in_(["Ongoing", "Live"])
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
        # Prefer demo trainer or highest id
        demo_ongoing = [c for c in all_ongoing if c.trainerEmployeeId == DEMO_TRAINER_EMPLOYEE_ID]
        conf = max(demo_ongoing or all_ongoing, key=lambda c: c.id)
        return conf, True, _conference_start(conf)

    # 2. Look for Approved conferences (or any valid conferences)
    conferences = (
        db.query(Conference)
        .filter(Conference.status == "Approved")
        .all()
    )
    if not conferences:
        # Fallback to any conferences if none are explicitly approved
        conferences = db.query(Conference).all()

    if not conferences:
        return None, False, None

    # Check for trainer-specific upcoming conferences
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
        start_at, conference = min(upcoming, key=lambda item: item[0]) if upcoming else max(timed, key=lambda item: item[0])
        is_live = conference.conferenceStatus in ["Ongoing", "Live"]
        return conference, is_live, start_at

    if undated:
        conf = max(undated, key=lambda c: c.id)
        is_live = conf.conferenceStatus in ["Ongoing", "Live"]
        return conf, is_live, None

    return None, False, None


@router.get("/current", response_model=CurrentSession)
def get_current_session(
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    conference, started, start_at = _select_current_conference(db, trainee=trainee)
    if not conference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active training session found",
        )

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

    def _is_time_passed(end_time_str: str | None) -> bool:
        if not end_time_str:
            return False
        try:
            now = datetime.now()
            if conference.conferenceDate:
                end_dt = datetime.strptime(f"{conference.conferenceDate} {end_time_str}", "%Y-%m-%d %I:%M %p")
                return now > end_dt
            else:
                end_time = datetime.strptime(end_time_str, "%I:%M %p").time()
                return now.time() > end_time
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
        if _is_time_passed(end_time_str):
            return True
        if live:
            return False
        if key not in module_order or active_index is None:
            return False
        return module_order.index(key) < active_index

    attendance = (
        db.query(Attendance)
        .filter(
            Attendance.conferenceUid == conference.conferenceUid,
            Attendance.traineeUid == trainee.traineeUid,
        )
        .first()
    )
    attendance_completed = attendance is not None
    attendance_live = not attendance_completed and conference.activeModuleId == "ATTENDANCE"

    attendance_cfg = config.get("attendance", {})
    attendance_close = attendance_cfg.get("checkOutCloses")
    modules.append(
        SessionModule(
            key="ATTENDANCE",
            name=MODULE_NAMES["ATTENDANCE"],
            time=attendance_cfg.get("checkInOpens"),
            endTime=attendance_close,
            duration=_duration(
                attendance_cfg.get("checkInOpens"), attendance_close
            ),
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
        end_time_str = module_cfg.get("endTime")
        result = _find_assessment_result(db, conference.conferenceUid, trainee.traineeUid, suite_uid)
        completed = result is not None
        live = not completed and conference.activeModuleId == key

        modules.append(
            SessionModule(
                key=key,
                name=MODULE_NAMES[key],
                time=module_cfg.get("startTime"),
                endTime=end_time_str,
                duration=_duration(module_cfg.get("startTime"), end_time_str),
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


@router.get("/history", response_model=list[SessionHistoryItem])
def get_session_history(
    limit: int = 10,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    """The trainee's past sessions with their attendance/result, for the
    "Recent Sessions" popup on the session detail screen."""
    attendance_rows = db.query(Attendance).filter(Attendance.traineeUid == trainee.traineeUid).all()
    result_rows = (
        db.query(AssessmentResult)
        .filter(AssessmentResult.traineeUid == trainee.traineeUid)
        .order_by(AssessmentResult.submittedAt.desc())
        .all()
    )

    conference_uids = {a.conferenceUid for a in attendance_rows} | {r.conferenceUid for r in result_rows}
    if not conference_uids:
        return []

    conferences = (
        db.query(Conference)
        .filter(Conference.conferenceUid.in_(conference_uids))
        .order_by(Conference.timestamp.desc())
        .limit(limit)
        .all()
    )

    attendance_by_conference = {a.conferenceUid: a for a in attendance_rows}
    # Rows are already ordered by submittedAt desc, so the first one seen
    # per conference is that trainee's most recent result there.
    latest_result_by_conference: dict[str, AssessmentResult] = {}
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
