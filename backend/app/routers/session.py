from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_trainee
from app.dependencies.database import get_db
from app.models.trainee import Trainee
from app.schemas.session import CurrentSession, SessionHistoryItem
from app.services import session_service

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("/current", response_model=CurrentSession)
def get_current_session(
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    return session_service.get_current_session(db, trainee)


@router.get("/history", response_model=list[SessionHistoryItem])
def get_session_history(
    limit: int = 10,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    return session_service.get_session_history(db, trainee, limit)
