from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_trainee
from app.dependencies.database import get_db
from app.models.trainee import Trainee
from app.schemas.session import (
    CurrentSession,
    LiveAnswerRequest,
    LiveAnswerResult,
    LiveQuizView,
    SessionHistoryItem,
    SessionJoinInfo,
)
from app.services import live_quiz_service, session_service

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("/join/{code}", response_model=SessionJoinInfo)
def get_session_join_info(code: str, db: Session = Depends(get_db)):
    return session_service.get_join_info(db, code)


@router.post("/join/{code}", response_model=SessionJoinInfo)
def join_session(
    code: str,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    return session_service.join_session(db, trainee, code)


@router.get("/current", response_model=CurrentSession)
def get_current_session(
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    return session_service.get_current_session(db, trainee)


@router.get("/live-quiz", response_model=LiveQuizView)
def get_live_quiz(
    conferenceUid: str,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    return live_quiz_service.get_live_quiz_view(db, trainee, conferenceUid)


@router.post("/live-quiz/answer", response_model=LiveAnswerResult)
def submit_live_quiz_answer(
    payload: LiveAnswerRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    return live_quiz_service.submit_live_answer(db, trainee, payload, background_tasks)


@router.get("/history", response_model=list[SessionHistoryItem])
def get_session_history(
    limit: int = 10,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    return session_service.get_session_history(db, trainee, limit)
