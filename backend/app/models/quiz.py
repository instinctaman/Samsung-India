import uuid

from sqlalchemy import Column, DateTime, Integer, Numeric, String, Text, text
from sqlalchemy.sql import func

from app.database.database import Base


class AssessmentSuite(Base):
    """Mirrors the `assessmentsuite` table - a quiz/test/survey container."""

    __tablename__ = "assessmentsuite"

    id = Column(Integer, primary_key=True, index=True)
    assessmentSuiteUid = Column(String(100), unique=True)
    courseName = Column(String(100))
    examTitle = Column(Text)
    assessment_type = Column(String(50), server_default=text("'Quiz'"))
    noOfQuestion = Column(Integer, server_default=text("0"))
    testTime = Column(String(50))
    status = Column(String(50), nullable=False, server_default=text("'Pending'"))


class Question(Base):
    """Mirrors the `questions` table - the question bank, linked to a suite
    via `assessmentSuiteUid`."""

    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    assessmentSuiteUid = Column(String(100), index=True)
    question = Column(Text)
    question_type = Column(String(50), nullable=False, server_default=text("'multiple_choice'"))
    sort_order = Column(Integer, server_default=text("0"))
    options = Column(Text)
    correct_answer = Column(Text)
    points = Column(Integer, server_default=text("0"))
    descriptions = Column(Text)
    status = Column(String(50), nullable=False, server_default=text("'Approved'"))


class Assessment(Base):
    """Mirrors the `assessment` table - a trainee's single answer submission
    for one question."""

    __tablename__ = "assessment"

    id = Column(Integer, primary_key=True, index=True)
    assessmentUid = Column(String(100), default=lambda: uuid.uuid4().hex)
    assessmentSuiteUid = Column(String(100), index=True)
    conferenceUid = Column(String(100), index=True)
    traineeUid = Column(String(100), index=True)
    questionId = Column(String(100))
    selectedOption = Column(Text)
    status = Column(String(50), nullable=False, server_default=text("'Approved'"))
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)


class AssessmentResult(Base):
    """Mirrors the `assessment_results` table - per-attempt scoring summary,
    the source table for leaderboards."""

    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    resultUid = Column(String(50), default=lambda: uuid.uuid4().hex)
    conferenceUid = Column(String(50), index=True)
    traineeUid = Column(String(50), index=True)
    assessmentSuiteUid = Column(String(50), index=True)
    attemptNumber = Column(Integer, server_default=text("1"))
    totalScore = Column(Numeric(10, 2), server_default=text("0.00"))
    maxScore = Column(Numeric(10, 2), server_default=text("0.00"))
    percentage = Column(Numeric(5, 2), server_default=text("0.00"))
    startedAt = Column(DateTime)
    submittedAt = Column(DateTime)
    durationSeconds = Column(Integer, server_default=text("0"))
    status = Column(String(20), server_default=text("'Started'"))
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
