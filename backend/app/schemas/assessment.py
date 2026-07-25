from typing import List, Optional

from pydantic import BaseModel


class QuestionOption(BaseModel):
    id: str
    text: str


class QuestionOut(BaseModel):
    id: int
    question: str
    question_type: str
    sort_order: int
    options: List[QuestionOption]


class AssessmentQuestionsOut(BaseModel):
    title: Optional[str] = None
    testTime: Optional[str] = None
    questions: List[QuestionOut]


class AnswerIn(BaseModel):
    questionId: int
    selectedOption: Optional[str] = None


class SubmitRequest(BaseModel):
    conferenceUid: str
    answers: List[AnswerIn]


class SubmitResult(BaseModel):
    totalScore: float
    maxScore: float
    percentage: float
    correctCount: int
    totalQuestions: int
