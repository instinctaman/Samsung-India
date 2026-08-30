from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_trainee
from app.dependencies.database import get_db
from app.models.trainee import Trainee
from app.schemas.assessment import AssessmentQuestionsOut, SubmitRequest, SubmitResult
from app.services import assessment_service

router = APIRouter(prefix="/assessments", tags=["assessments"])


@router.get("/{suite_uid}/questions", response_model=AssessmentQuestionsOut)
def get_questions(
    suite_uid: str,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    return assessment_service.get_questions(db, suite_uid)


@router.post("/{suite_uid}/submit", response_model=SubmitResult)
def submit_assessment(
    suite_uid: str,
    payload: SubmitRequest,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    return assessment_service.submit_assessment(db, trainee, suite_uid, payload)
