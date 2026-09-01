import json

from sqlalchemy.orm import Session

from app.core.constants import MODULE_LABELS
from app.models.conference import Conference
from app.models.conference_activity_log import ConferenceActivityLog
from app.repositories import activity_log_repository

__all__ = [
    "MODULE_LABELS",
    "configured_modules",
    "log_module_action",
    "auto_advance_if_due",
    "live_quiz_suite_uid",
]


def live_quiz_suite_uid(conference: Conference) -> str | None:
    """The assessment suite the Live Quiz module runs against. Unlike the
    other modules it has no dedicated Conference column - it only ever lives
    in `sessionConfig.liveQuiz.assessmentSuiteUid`."""
    if not conference.sessionConfig:
        return None
    try:
        return json.loads(conference.sessionConfig).get("liveQuiz", {}).get("assessmentSuiteUid")
    except (ValueError, AttributeError):
        return None


def configured_modules(conference: Conference) -> list[str]:
    """Which modules this session's flow actually includes, in run order."""
    modules = []
    if conference.enableCheckIn:
        modules.append("ATTENDANCE")
    if conference.postAssessmentUid:
        modules.append("STANDARD_TEST")
    if conference.sessionConfig and json.loads(conference.sessionConfig).get("liveQuiz"):
        modules.append("LIVE_QUIZ")
    if conference.surveyUid:
        modules.append("SURVEY")
    return modules


def log_module_action(db: Session, conference_uid: str, module_id: str, action: str, performed_by: str) -> None:
    activity_log_repository.add(
        db,
        ConferenceActivityLog(
            conferenceUid=conference_uid,
            moduleId=module_id,
            action=action,
            performedBy=performed_by,
        ),
    )


def auto_advance_if_due(db: Session, conference: Conference) -> bool:
    """No-op. Module flow is now fully manual: the trainer starts and stops
    every module by hand (`start_module` / `stop_active_module`), and the
    session only ends via the trainer's "End Session" action
    (`end_training`). Nothing advances on the clock any more.

    Kept as a call-site shim - trainee/trainer state fetches still call it -
    so removing the time-based advancing didn't need edits at every caller.
    Always returns False (never mutates `conference`).
    """
    return False
