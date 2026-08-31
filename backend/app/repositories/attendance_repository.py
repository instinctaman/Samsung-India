from typing import Optional

from sqlalchemy.orm import Session

from app.models.attendance import Attendance


def get_for_conference_and_trainee(db: Session, conference_uid: str, trainee_uid: str) -> Optional[Attendance]:
    return (
        db.query(Attendance)
        .filter(Attendance.conferenceUid == conference_uid, Attendance.traineeUid == trainee_uid)
        .first()
    )


def list_for_conference(db: Session, conference_uid: str) -> list[Attendance]:
    return db.query(Attendance).filter(Attendance.conferenceUid == conference_uid).all()


def list_for_conferences(db: Session, conference_uids: list[str]) -> list[Attendance]:
    if not conference_uids:
        return []
    return (
        db.query(Attendance)
        .filter(Attendance.conferenceUid.in_(conference_uids))
        .order_by(Attendance.timestamp.desc())
        .all()
    )


def list_present_pairs(db: Session, conference_uids: list[str]) -> list[tuple[str, str]]:
    """(conferenceUid, traineeUid) pairs for trainees marked Present - used to
    compute real headcounts, as opposed to the planned `batchSize`."""
    if not conference_uids:
        return []
    rows = (
        db.query(Attendance.conferenceUid, Attendance.traineeUid)
        .filter(Attendance.conferenceUid.in_(conference_uids), Attendance.status == "Present")
        .all()
    )
    return [(row.conferenceUid, row.traineeUid) for row in rows]


def list_for_trainee(db: Session, trainee_uid: str) -> list[Attendance]:
    return db.query(Attendance).filter(Attendance.traineeUid == trainee_uid).all()


def create(db: Session, attendance: Attendance) -> Attendance:
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


def delete(db: Session, attendance: Attendance) -> None:
    db.delete(attendance)
    db.commit()


def delete_for_conference_and_trainee(db: Session, conference_uid: str, trainee_uid: str) -> None:
    db.query(Attendance).filter(
        Attendance.conferenceUid == conference_uid, Attendance.traineeUid == trainee_uid
    ).delete()
    db.commit()


def save(db: Session) -> None:
    db.commit()
