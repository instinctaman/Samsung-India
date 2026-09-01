"""Live Quiz (FFF) real-time broadcast.

The trainer drives a synchronised quiz from the Session Dashboard's Live Studio
card; every joined trainee's phone follows. State is authoritative on the
`conference` row (`liveQuizState` / `liveQuestionId` / `liveTimerEndsAt`); each
mutation nudges the `/ws/live/{conferenceUid}` room with a thin
`{"type": "live_quiz"}` event so both sides refetch their REST view. Trainee
scores are computed once, when the quiz finishes.
"""

import json
import time
from datetime import datetime
from typing import Optional

from fastapi import BackgroundTasks
from sqlalchemy.orm import Session

from app.core.constants import (
    LIVE_QUIZ_DEFAULT_TIMER_SECONDS,
    LIVE_QUIZ_STATE_FINISHED,
    LIVE_QUIZ_STATE_IDLE,
    LIVE_QUIZ_STATE_LEADERBOARD,
    LIVE_QUIZ_STATE_QUESTION_LIVE,
)
from app.core.exceptions import bad_request, conflict, not_found
from app.models.admin import Admin
from app.models.conference import Conference
from app.models.quiz import AssessmentResult, Question
from app.models.trainee import Trainee
from app.repositories import assessment_repository, attendance_repository, conference_repository
from app.routers.ws import manager as ws_manager
from app.schemas.session import LiveAnswerRequest, LiveAnswerResult, LiveQuestionOut, LiveQuizView, QuestionOption
from app.schemas.training import LiveStudioOut, LiveStudioQuestionOut
from app.services.assessment_service import score_answers
from app.services.module_flow import live_quiz_suite_uid

_LOBBY_STATES = (LIVE_QUIZ_STATE_IDLE, "WAITING", "")


def _now_ms() -> int:
    return int(time.time() * 1000)


def _question_timer_seconds(question: Question) -> int:
    try:
        settings = json.loads(question.settings) if question.settings else {}
        return int(settings.get("timerSeconds") or LIVE_QUIZ_DEFAULT_TIMER_SECONDS)
    except (ValueError, TypeError):
        return LIVE_QUIZ_DEFAULT_TIMER_SECONDS


def _question_options(question: Question) -> list[dict]:
    try:
        return json.loads(question.options) if question.options else []
    except ValueError:
        return []


# --- Trainer: Live Studio view (folded into SessionDashboardOut) -------------

def build_live_studio(db: Session, conference: Conference) -> Optional[LiveStudioOut]:
    """Only meaningful while LIVE_QUIZ is the active module - callers gate on
    that. Returns None if no Live Quiz suite is configured."""
    suite_uid = live_quiz_suite_uid(conference)
    if not suite_uid:
        return None

    suite = assessment_repository.get_suite_by_uid(db, suite_uid)
    questions = assessment_repository.list_questions_for_suite(db, suite_uid)
    responders = assessment_repository.responders_by_question(db, conference.conferenceUid, suite_uid)
    participants = sum(
        1 for a in attendance_repository.list_for_conference(db, conference.conferenceUid) if a.status == "Present"
    )
    active_qid = int(conference.liveQuestionId) if conference.liveQuestionId else None

    return LiveStudioOut(
        suiteUid=suite_uid,
        suiteTitle=(suite.examTitle or suite.courseName or "Live Quiz") if suite else "Live Quiz",
        state=conference.liveQuizState or LIVE_QUIZ_STATE_IDLE,
        activeQuestionId=active_qid,
        timerEndsAt=conference.liveTimerEndsAt or None,
        participants=participants,
        totalResponses=responders.get(conference.liveQuestionId or "", 0),
        questions=[
            LiveStudioQuestionOut(
                id=q.id,
                order=q.sort_order or 0,
                text=q.question or "",
                timerSeconds=_question_timer_seconds(q),
                points=q.points or 0,
                responseCount=responders.get(str(q.id), 0),
                isActive=q.id == active_qid,
            )
            for q in questions
        ],
    )


# --- Trainer: broadcast console actions -------------------------------------

def _owned_live_conference(db: Session, admin: Admin, conference_uid: str) -> Conference:
    conference = conference_repository.get_owned_by_trainer(db, admin.username, conference_uid)
    if not conference:
        raise not_found("Training not found")
    if conference.conferenceStatus != "Ongoing":
        raise conflict("Session is not currently running")
    if conference.activeModuleId != "LIVE_QUIZ":
        raise conflict("Live Quiz isn't the active module")
    return conference


def _nudge(background_tasks: BackgroundTasks, conference_uid: str) -> None:
    background_tasks.add_task(ws_manager.send_to_room, conference_uid, {"type": "live_quiz"})


def _dashboard(db: Session, admin: Admin, conference_uid: str):
    # Lazy import - training_service imports this module at load time.
    from app.services import training_service

    return training_service.get_session_dashboard(db, admin, conference_uid)


def broadcast_question(
    db: Session, admin: Admin, conference_uid: str, question_id: int, background_tasks: BackgroundTasks
):
    conference = _owned_live_conference(db, admin, conference_uid)
    suite_uid = live_quiz_suite_uid(conference)
    question = assessment_repository.get_question(db, question_id)
    if not question or question.assessmentSuiteUid != suite_uid:
        raise bad_request("That question isn't part of this session's Live Quiz")

    conference.liveQuizState = LIVE_QUIZ_STATE_QUESTION_LIVE
    conference.liveQuestionId = str(question_id)
    conference.liveTimerEndsAt = _now_ms() + _question_timer_seconds(question) * 1000
    conference_repository.save(db, conference)
    _nudge(background_tasks, conference_uid)
    return _dashboard(db, admin, conference_uid)


def stop_timer(db: Session, admin: Admin, conference_uid: str, background_tasks: BackgroundTasks):
    conference = _owned_live_conference(db, admin, conference_uid)
    conference.liveTimerEndsAt = _now_ms()
    conference_repository.save(db, conference)
    _nudge(background_tasks, conference_uid)
    return _dashboard(db, admin, conference_uid)


def show_leaderboard(db: Session, admin: Admin, conference_uid: str, background_tasks: BackgroundTasks):
    conference = _owned_live_conference(db, admin, conference_uid)
    conference.liveQuizState = LIVE_QUIZ_STATE_LEADERBOARD
    conference.liveQuestionId = None
    conference_repository.save(db, conference)
    _nudge(background_tasks, conference_uid)
    return _dashboard(db, admin, conference_uid)


def show_lobby(db: Session, admin: Admin, conference_uid: str, background_tasks: BackgroundTasks):
    conference = _owned_live_conference(db, admin, conference_uid)
    conference.liveQuizState = LIVE_QUIZ_STATE_IDLE
    conference.liveQuestionId = None
    conference_repository.save(db, conference)
    _nudge(background_tasks, conference_uid)
    return _dashboard(db, admin, conference_uid)


def finish(db: Session, admin: Admin, conference_uid: str, background_tasks: BackgroundTasks):
    conference = conference_repository.get_owned_by_trainer(db, admin.username, conference_uid)
    if not conference:
        raise not_found("Training not found")
    finish_quiz(db, conference)
    _nudge(background_tasks, conference_uid)
    return _dashboard(db, admin, conference_uid)


# --- Finish: one-shot scoring pass -----------------------------------------

def finish_quiz(db: Session, conference: Conference) -> None:
    """Score every participant from their per-question `assessment` rows and
    write one `AssessmentResult` each. Idempotent - safe to call from the
    trainer's Finish action, `advance_module` past LIVE_QUIZ, and
    `end_training`."""
    if conference.liveQuizState == LIVE_QUIZ_STATE_FINISHED:
        return

    suite_uid = live_quiz_suite_uid(conference)
    if suite_uid:
        questions = assessment_repository.list_questions_for_suite(db, suite_uid)
        rows = assessment_repository.list_answers_for_conference_suite(db, conference.conferenceUid, suite_uid)

        picks_by_trainee: dict[str, dict[int, Optional[str]]] = {}
        for row in rows:
            try:
                picks_by_trainee.setdefault(row.traineeUid, {})[int(row.questionId)] = row.selectedOption
            except (TypeError, ValueError):
                continue

        now = datetime.now()
        for trainee_uid, picks in picks_by_trainee.items():
            # Idempotent per conference - a trainee's prior attempts on this
            # suite in *other* sessions don't count.
            if assessment_repository.get_latest_result(db, conference.conferenceUid, trainee_uid, suite_uid):
                continue
            total, max_score, percentage, _ = score_answers(questions, picks)
            assessment_repository.add_result(
                db,
                AssessmentResult(
                    conferenceUid=conference.conferenceUid,
                    traineeUid=trainee_uid,
                    assessmentSuiteUid=suite_uid,
                    attemptNumber=assessment_repository.count_attempts(db, trainee_uid, suite_uid) + 1,
                    totalScore=total,
                    maxScore=max_score,
                    percentage=percentage,
                    startedAt=now,
                    submittedAt=now,
                    status="Submitted",
                ),
            )

    conference.liveQuizState = LIVE_QUIZ_STATE_FINISHED
    db.commit()


# --- Trainee: live view + per-question answer ------------------------------

def get_live_quiz_view(db: Session, trainee: Trainee, conference_uid: str) -> LiveQuizView:
    conference = conference_repository.get_by_uid(db, conference_uid)
    if not conference:
        raise not_found("Training not found")

    state = conference.liveQuizState or LIVE_QUIZ_STATE_IDLE
    suite_uid = live_quiz_suite_uid(conference)

    question_out: Optional[LiveQuestionOut] = None
    already_answered = False
    if state == LIVE_QUIZ_STATE_QUESTION_LIVE and conference.liveQuestionId:
        question = assessment_repository.get_question(db, int(conference.liveQuestionId))
        if question:
            question_out = LiveQuestionOut(
                id=question.id,
                text=question.question or "",
                options=[QuestionOption(id=o.get("id", ""), text=o.get("text", "")) for o in _question_options(question)],
            )
            already_answered = (
                assessment_repository.get_answer(db, conference_uid, trainee.traineeUid, question.id) is not None
            )

    timer_ends_at = None
    if state == LIVE_QUIZ_STATE_QUESTION_LIVE:
        timer_ends_at = conference.liveTimerEndsAt or None

    return LiveQuizView(
        state=state,
        conferenceUid=conference_uid,
        suiteUid=suite_uid,
        question=question_out,
        timerEndsAt=timer_ends_at,
        alreadyAnswered=already_answered,
    )


def submit_live_answer(
    db: Session, trainee: Trainee, payload: LiveAnswerRequest, background_tasks: BackgroundTasks
) -> LiveAnswerResult:
    conference = conference_repository.get_by_uid(db, payload.conferenceUid)
    if not conference:
        raise not_found("Training not found")

    live = (
        conference.liveQuizState == LIVE_QUIZ_STATE_QUESTION_LIVE
        and conference.liveQuestionId == str(payload.questionId)
        and conference.liveTimerEndsAt
        and _now_ms() < conference.liveTimerEndsAt
    )
    if not live:
        return LiveAnswerResult(accepted=False)

    assessment_repository.upsert_answer(
        db,
        conference_uid=payload.conferenceUid,
        trainee_uid=trainee.traineeUid,
        suite_uid=live_quiz_suite_uid(conference) or "",
        question_id=payload.questionId,
        selected_option=payload.selectedOption,
    )
    _nudge(background_tasks, payload.conferenceUid)
    return LiveAnswerResult(accepted=True)
