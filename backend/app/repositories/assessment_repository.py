from typing import Optional

from sqlalchemy.orm import Session

from app.models.quiz import Assessment, AssessmentResult, AssessmentSuite, Question


def commit(db: Session) -> None:
    db.commit()


# --- AssessmentSuite -------------------------------------------------------

def list_approved_suites(db: Session) -> list[AssessmentSuite]:
    return (
        db.query(AssessmentSuite)
        .filter(AssessmentSuite.status == "Approved")
        .order_by(AssessmentSuite.assessment_type, AssessmentSuite.courseName)
        .all()
    )


def get_suite_by_uid(db: Session, suite_uid: str) -> Optional[AssessmentSuite]:
    return db.query(AssessmentSuite).filter(AssessmentSuite.assessmentSuiteUid == suite_uid).first()


def create_suite(db: Session, suite: AssessmentSuite) -> AssessmentSuite:
    db.add(suite)
    db.commit()
    db.refresh(suite)
    return suite


def save_suite(db: Session) -> None:
    db.commit()


# --- Question ----------------------------------------------------------------

def list_questions_for_suite(db: Session, suite_uid: str) -> list[Question]:
    return db.query(Question).filter(Question.assessmentSuiteUid == suite_uid).order_by(Question.sort_order).all()


def count_questions_for_suite(db: Session, suite_uid: str) -> int:
    return db.query(Question).filter(Question.assessmentSuiteUid == suite_uid).count()


def add_question(db: Session, question: Question) -> None:
    db.add(question)


def delete_question(db: Session, question_id: int, suite_uid: str) -> None:
    db.query(Question).filter(Question.id == question_id, Question.assessmentSuiteUid == suite_uid).delete()


# --- Assessment (submitted answers) ------------------------------------------

def add_answer(db: Session, answer: Assessment) -> None:
    db.add(answer)


# --- AssessmentResult ----------------------------------------------------------

def count_attempts(db: Session, trainee_uid: str, suite_uid: str) -> int:
    return (
        db.query(AssessmentResult)
        .filter(AssessmentResult.traineeUid == trainee_uid, AssessmentResult.assessmentSuiteUid == suite_uid)
        .count()
    )


def add_result(db: Session, result: AssessmentResult) -> None:
    db.add(result)


def get_latest_result(
    db: Session, conference_uid: str, trainee_uid: str, suite_uid: str
) -> Optional[AssessmentResult]:
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


def list_results_for_conference_suite(db: Session, conference_uid: str, suite_uid: str) -> list[AssessmentResult]:
    return (
        db.query(AssessmentResult)
        .filter(
            AssessmentResult.conferenceUid == conference_uid,
            AssessmentResult.assessmentSuiteUid == suite_uid,
            AssessmentResult.status == "Submitted",
        )
        .order_by(AssessmentResult.attemptNumber.desc())
        .all()
    )


def list_results_for_conferences(db: Session, conference_uids: list[str]) -> list[AssessmentResult]:
    if not conference_uids:
        return []
    return (
        db.query(AssessmentResult)
        .filter(AssessmentResult.conferenceUid.in_(conference_uids), AssessmentResult.status == "Submitted")
        .order_by(AssessmentResult.attemptNumber.desc())
        .all()
    )


def list_submitted_pairs(db: Session, conference_uids: list[str]) -> list[tuple[str, str]]:
    """(conferenceUid, traineeUid) pairs for Submitted results - used to
    compute real headcounts alongside attendance_repository.list_present_pairs."""
    if not conference_uids:
        return []
    rows = (
        db.query(AssessmentResult.conferenceUid, AssessmentResult.traineeUid)
        .filter(AssessmentResult.conferenceUid.in_(conference_uids), AssessmentResult.status == "Submitted")
        .all()
    )
    return [(row.conferenceUid, row.traineeUid) for row in rows]


def list_results_for_trainee(db: Session, trainee_uid: str) -> list[AssessmentResult]:
    return (
        db.query(AssessmentResult)
        .filter(AssessmentResult.traineeUid == trainee_uid)
        .order_by(AssessmentResult.submittedAt.desc())
        .all()
    )
