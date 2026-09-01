from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin, require_admin_role
from app.dependencies.database import get_db
from app.models.admin import Admin
from app.schemas.trainee_admin import TraineeAdminIn, TraineeAdminOut
from app.schemas.training import (
    AssessmentSuiteCreate,
    AssessmentSuiteDetail,
    AssessmentSuiteOut,
    AttendanceListItemOut,
    AttendanceMarkRequest,
    LiveBroadcastRequest,
    PendingSessionItem,
    QuestionCreate,
    SessionDashboardOut,
    TrainerAgendaResponse,
    TrainingCreate,
    TrainingOut,
)
from app.services import (
    assessment_builder_service,
    live_quiz_service,
    trainee_admin_service,
    training_service,
)

router = APIRouter(prefix="/admin", tags=["training"])


@router.get("/assessment-suites", response_model=list[AssessmentSuiteOut])
def list_assessment_suites(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    return assessment_builder_service.list_assessment_suites(db)


@router.post("/assessment-suites", response_model=AssessmentSuiteDetail)
def create_assessment_suite(
    payload: AssessmentSuiteCreate,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(require_admin_role),
):
    return assessment_builder_service.create_assessment_suite(db, payload)


@router.get("/assessment-suites/{suite_uid}", response_model=AssessmentSuiteDetail)
def get_assessment_suite(
    suite_uid: str,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(require_admin_role),
):
    return assessment_builder_service.get_assessment_suite(db, suite_uid)


@router.post("/assessment-suites/{suite_uid}/questions", response_model=AssessmentSuiteDetail)
def add_question(
    suite_uid: str,
    payload: QuestionCreate,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(require_admin_role),
):
    return assessment_builder_service.add_question(db, suite_uid, payload)


@router.delete("/assessment-suites/{suite_uid}/questions/{question_id}", response_model=AssessmentSuiteDetail)
def delete_question(
    suite_uid: str,
    question_id: int,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(require_admin_role),
):
    return assessment_builder_service.delete_question(db, suite_uid, question_id)


@router.post("/trainings", response_model=TrainingOut)
def create_training(
    payload: TrainingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return training_service.create_training(db, payload, background_tasks, admin)


@router.get("/trainings", response_model=TrainerAgendaResponse)
def list_trainer_trainings(
    start: Optional[str] = None,
    end: Optional[str] = None,
    all_sessions: bool = False,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return training_service.list_trainer_trainings(db, admin, start, end, all_sessions)


@router.get("/trainings/pending", response_model=list[PendingSessionItem])
def list_pending_trainings(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(require_admin_role),
):
    return training_service.list_pending_trainings(db)


@router.post("/trainings/{conference_uid}/approve", response_model=TrainingOut)
def approve_training(
    conference_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(require_admin_role),
):
    return training_service.approve_training(db, admin, conference_uid)


@router.post("/trainings/{conference_uid}/reject", response_model=TrainingOut)
def reject_training(
    conference_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(require_admin_role),
):
    return training_service.reject_training(db, admin, conference_uid)


@router.get("/trainings/{conference_uid}", response_model=SessionDashboardOut)
def get_session_dashboard(
    conference_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return training_service.get_session_dashboard(db, admin, conference_uid)


@router.post("/trainings/{conference_uid}/start", response_model=TrainingOut)
async def start_training(
    conference_uid: str,
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return await training_service.start_training(db, admin, conference_uid, photo)


@router.post("/trainings/{conference_uid}/advance-module", response_model=TrainingOut)
def advance_module(
    conference_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return training_service.advance_module(db, admin, conference_uid)


@router.post("/trainings/{conference_uid}/live-quiz/broadcast", response_model=SessionDashboardOut)
def live_quiz_broadcast(
    conference_uid: str,
    payload: LiveBroadcastRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return live_quiz_service.broadcast_question(db, admin, conference_uid, payload.questionId, background_tasks)


@router.post("/trainings/{conference_uid}/live-quiz/stop-timer", response_model=SessionDashboardOut)
def live_quiz_stop_timer(
    conference_uid: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return live_quiz_service.stop_timer(db, admin, conference_uid, background_tasks)


@router.post("/trainings/{conference_uid}/live-quiz/leaderboard", response_model=SessionDashboardOut)
def live_quiz_leaderboard(
    conference_uid: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return live_quiz_service.show_leaderboard(db, admin, conference_uid, background_tasks)


@router.post("/trainings/{conference_uid}/live-quiz/lobby", response_model=SessionDashboardOut)
def live_quiz_lobby(
    conference_uid: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return live_quiz_service.show_lobby(db, admin, conference_uid, background_tasks)


@router.post("/trainings/{conference_uid}/live-quiz/finish", response_model=SessionDashboardOut)
def live_quiz_finish(
    conference_uid: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return live_quiz_service.finish(db, admin, conference_uid, background_tasks)


@router.post("/trainings/{conference_uid}/end", response_model=TrainingOut)
def end_training(
    conference_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return training_service.end_training(db, admin, conference_uid)


@router.post("/trainings/{conference_uid}/attendance/{trainee_uid}", response_model=SessionDashboardOut)
def mark_attendance(
    conference_uid: str,
    trainee_uid: str,
    payload: AttendanceMarkRequest,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return training_service.mark_attendance(db, admin, conference_uid, trainee_uid, payload)


@router.delete("/trainings/{conference_uid}/attendance/{trainee_uid}", response_model=SessionDashboardOut)
def reset_attendance(
    conference_uid: str,
    trainee_uid: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return training_service.reset_attendance(db, admin, conference_uid, trainee_uid)


@router.get("/attendance", response_model=list[AttendanceListItemOut])
def list_attendance(
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return training_service.list_attendance(db, admin)


@router.post("/trainees", response_model=TraineeAdminOut, status_code=status.HTTP_201_CREATED)
def register_trainee_admin(
    payload: TraineeAdminIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return trainee_admin_service.register_trainee_admin(db, payload, background_tasks, admin)


@router.get("/trainees", response_model=list[TraineeAdminOut])
def list_trainees_admin(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    return trainee_admin_service.list_trainees_admin(db)

