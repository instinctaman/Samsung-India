from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.rate_limit import rate_limit
from app.dependencies.database import get_db
from app.schemas.admin import AdminAuthSession, AdminLoginRequest
from app.services import admin_service

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post(
    "/login",
    response_model=AdminAuthSession,
    dependencies=[Depends(rate_limit(max_attempts=5, window_seconds=300))],
)
def login(payload: AdminLoginRequest, db: Session = Depends(get_db)):
    return admin_service.login(db, payload)
