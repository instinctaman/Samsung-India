import json
import uuid
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_trainee
from app.database.database import get_db
from app.models.quiz import Assessment, AssessmentResult, Question
from app.models.trainee import Trainee
from app.schemas.assessment import QuestionOut, SubmitRequest, SubmitResult

router = APIRouter(prefix="/assessments", tags=["assessments"])


@router.get("/{suite_uid}/questions", response_model=List[QuestionOut])
def get_questions(
    suite_uid: str,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    questions = (
        db.query(Question)
        .filter(Question.assessmentSuiteUid == suite_uid)
        .order_by(Question.sort_order)
        .all()
    )
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No questions found for this assessment",
        )

    return [
        QuestionOut(
            id=q.id,
            question=q.question or "",
            question_type=q.question_type,
            sort_order=q.sort_order or 0,
            options=json.loads(q.options) if q.options else [],
        )
        for q in questions
    ]


@router.post("/{suite_uid}/submit", response_model=SubmitResult)
def submit_assessment(
    suite_uid: str,
    payload: SubmitRequest,
    db: Session = Depends(get_db),
    trainee: Trainee = Depends(get_current_trainee),
):
    questions = db.query(Question).filter(Question.assessmentSuiteUid == suite_uid).all()
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No questions found for this assessment",
        )

    points_by_id = {q.id: (q.points or 0) for q in questions}
    correct_by_id = {q.id: q.correct_answer for q in questions}
    max_score = sum(points_by_id.values())

    total_score = 0
    correct_count = 0
    now = datetime.now()

    for answer in payload.answers:
        is_correct = (
            answer.selectedOption is not None
            and answer.selectedOption == correct_by_id.get(answer.questionId)
        )
        if is_correct:
            total_score += points_by_id.get(answer.questionId, 0)
            correct_count += 1

        db.add(
            Assessment(
                assessmentUid=uuid.uuid4().hex,
                assessmentSuiteUid=suite_uid,
                conferenceUid=payload.conferenceUid,
                traineeUid=trainee.traineeUid,
                questionId=str(answer.questionId),
                selectedOption=answer.selectedOption,
            )
        )

    previous_attempts = (
        db.query(AssessmentResult)
        .filter(
            AssessmentResult.traineeUid == trainee.traineeUid,
            AssessmentResult.assessmentSuiteUid == suite_uid,
        )
        .count()
    )

    percentage = round((total_score / max_score) * 100, 2) if max_score else 0.0

    db.add(
        AssessmentResult(
            resultUid=uuid.uuid4().hex,
            conferenceUid=payload.conferenceUid,
            traineeUid=trainee.traineeUid,
            assessmentSuiteUid=suite_uid,
            attemptNumber=previous_attempts + 1,
            totalScore=total_score,
            maxScore=max_score,
            percentage=percentage,
            startedAt=now,
            submittedAt=now,
            status="Submitted",
        )
    )
    db.commit()

    return SubmitResult(
        totalScore=total_score,
        maxScore=max_score,
        percentage=percentage,
        correctCount=correct_count,
        totalQuestions=len(payload.answers),
    )
