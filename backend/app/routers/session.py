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
from app.schemas.session import CurrentSession, SessionModule

router = APIRouter(prefix="/sessions", tags=["sessions"])

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


def _select_current_conference(db: Session) -> tuple[Conference | None, bool, datetime | None]:
    """Picks which conference is "current" purely from its own scheduled
    start time - no separate config to edit. To point the app at a
    different session for testing, just edit that row's `conferenceDate` /
    `conferenceTime` (or `status`) in the database.

    Returns (conference, started, start_at):
      - Among Approved conferences whose start time has already passed,
        picks the most recently started one and reports started=True.
      - If none have started yet, picks the soonest upcoming one and
        reports started=False (so the caller can show "starts at ...").
      - If no Approved conference has a parseable date/time at all, falls
        back to the most recently created Approved conference, started=True
        (keeps existing seed data working without dates).
    """
    conferences = db.query(Conference).filter(Conference.status == "Approved").all()
    if not conferences:
        return None, False, None

    now = datetime.now()
    started: list[tuple[datetime, Conference]] = []
    upcoming: list[tuple[datetime, Conference]] = []
    undated: list[Conference] = []

    for conference in conferences:
        start_at = _conference_start(conference)
        if start_at is None:
            undated.append(conference)
        elif start_at <= now:
            started.append((start_at, conference))
        else:
            upcoming.append((start_at, conference))

    if started:
        start_at, conference = max(started, key=lambda item: item[0])
        return conference, True, start_at

    if upcoming:
        start_at, conference = min(upcoming, key=lambda item: item[0])
        return conference, False, start_at

    if undated:
        return max(undated, key=lambda c: c.id), True, None

    return None, False, None


@router.get("/current", response_model=CurrentSession)
def get_current_session(
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    conference, started, start_at = _select_current_conference(db)
    if not conference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active training session found",
        )

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

    attendance = (
        db.query(Attendance)
        .filter(
            Attendance.conferenceUid == conference.conferenceUid,
            Attendance.traineeUid == trainee.traineeUid,
        )
        .first()
    )
    attendance_completed = attendance is not None

    attendance_cfg = config.get("attendance", {})
    modules.append(
        SessionModule(
            key="ATTENDANCE",
            name=MODULE_NAMES["ATTENDANCE"],
            time=attendance_cfg.get("checkInOpens"),
            endTime=attendance_cfg.get("checkOutCloses"),
            duration=_duration(
                attendance_cfg.get("checkInOpens"), attendance_cfg.get("checkOutCloses")
            ),
            isLive=not attendance_completed and conference.activeModuleId == "ATTENDANCE",
            isCompleted=attendance_completed,
            completedAt=attendance.markedOn.split(" ")[-1][:5] if attendance and attendance.markedOn else None,
        )
    )

    for key, suite_uid, config_key in (
        ("STANDARD_TEST", conference.postAssessmentUid, "standardTest"),
        ("SURVEY", conference.surveyUid, "survey"),
    ):
        if not suite_uid:
            continue

        module_cfg = config.get(config_key, {})
        result = _find_assessment_result(db, conference.conferenceUid, trainee.traineeUid, suite_uid)
        completed = result is not None

        modules.append(
            SessionModule(
                key=key,
                name=MODULE_NAMES[key],
                time=module_cfg.get("startTime"),
                endTime=module_cfg.get("endTime"),
                duration=_duration(module_cfg.get("startTime"), module_cfg.get("endTime")),
                isLive=not completed and conference.activeModuleId == key,
                isCompleted=completed,
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
        modules=modules,
    )
