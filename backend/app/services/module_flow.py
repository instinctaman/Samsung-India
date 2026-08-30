import json
from datetime import datetime

from sqlalchemy.orm import Session

from app.core.constants import AUTO_ADVANCE_PERFORMER, MODULE_CONFIG_KEY, MODULE_LABELS
from app.models.conference import Conference
from app.models.conference_activity_log import ConferenceActivityLog
from app.repositories import activity_log_repository
from app.utils.date_utils import parse_module_start

__all__ = ["MODULE_LABELS", "configured_modules", "log_module_action", "auto_advance_if_due"]


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


def _module_end(conference: Conference, config: dict, module_key: str) -> datetime | None:
    """The active module's own configured closing time, if it has one.
    ATTENDANCE stores it as `checkOutCloses` (it isn't in MODULE_CONFIG_KEY
    since it has no `unlockCondition` of its own); the others use their
    module config's `endTime`."""
    if module_key == "ATTENDANCE":
        attendance_cfg = config.get("attendance", {})
        return parse_module_start(conference.conferenceDate, attendance_cfg.get("checkOutCloses"))

    config_key = MODULE_CONFIG_KEY.get(module_key)
    module_cfg = config.get(config_key, {}) if config_key else {}
    return parse_module_start(conference.conferenceDate, module_cfg.get("endTime"))


def auto_advance_if_due(db: Session, conference: Conference) -> bool:
    """Modules only ever unlock two ways: the trainer's manual "Next
    Module" action (`advance-module`), or - for a module whose Session
    Flow config has `unlockCondition: "Automatic"` - its own configured
    start time arriving. Nothing runs on a schedule in this app, so this
    is called opportunistically whenever a trainee or trainer fetches
    session state, and walks forward through as many due modules as have
    already passed their start time (in case nobody checked in a while).

    Once the *last* configured module's own window closes, there's nothing
    left to advance to - at that point the session auto-completes exactly
    as if the trainer had pressed "End Session" themselves (only applies to
    a session that was actually started - conferenceStatus is only ever
    "Ongoing" via the trainer's own manual Start action in the first place,
    there's no automatic start).

    Returns True if it changed `conference.activeModuleId` and/or
    `conference.conferenceStatus` (caller should treat `conference` as
    freshly refreshed from the DB either way).
    """
    if conference.conferenceStatus != "Ongoing" or not conference.activeModuleId:
        return False

    modules = configured_modules(conference)
    if conference.activeModuleId not in modules:
        return False

    config = json.loads(conference.sessionConfig) if conference.sessionConfig else {}
    now = datetime.now()
    changed = False

    while True:
        current_index = modules.index(conference.activeModuleId)

        # Don't race ahead of the module that's actually live just because
        # the next one's start time has arrived - e.g. Standard Test opening
        # at the same clock time Attendance does shouldn't skip Attendance
        # before anyone's had a chance to check in. Only advance once the
        # current module's own window (its configured end time) has closed.
        current_ends_at = _module_end(conference, config, conference.activeModuleId)

        if current_index + 1 >= len(modules):
            if current_ends_at and now >= current_ends_at:
                log_module_action(db, conference.conferenceUid, conference.activeModuleId, "STOPPED", AUTO_ADVANCE_PERFORMER)
                conference.activeModuleId = None
                conference.conferenceEndsOn = now.strftime("%Y-%m-%d %H:%M:%S")
                conference.conferenceStatus = "Completed"
                conference.actualEndedAt = now
                changed = True
            break

        if current_ends_at and now < current_ends_at:
            break

        next_module = modules[current_index + 1]
        config_key = MODULE_CONFIG_KEY.get(next_module)
        module_cfg = config.get(config_key, {}) if config_key else {}
        if module_cfg.get("unlockCondition") != "Automatic":
            break

        starts_at = parse_module_start(conference.conferenceDate, module_cfg.get("startTime"))
        if not starts_at or now < starts_at:
            break

        log_module_action(db, conference.conferenceUid, conference.activeModuleId, "STOPPED", AUTO_ADVANCE_PERFORMER)
        log_module_action(db, conference.conferenceUid, next_module, "STARTED", AUTO_ADVANCE_PERFORMER)
        conference.activeModuleId = next_module
        changed = True

    if changed:
        db.commit()
        db.refresh(conference)

    return changed
