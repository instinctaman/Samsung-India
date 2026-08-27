from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.rate_limit import rate_limit
from app.core.security import create_access_token, verify_password
from app.database.database import get_db
from app.models.admin import Admin
from app.models.agency_team import AgencyTeam
from app.schemas.admin import AdminAuthSession, AdminLoginRequest, AdminOut

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post(
    "/login",
    response_model=AdminAuthSession,
    dependencies=[Depends(rate_limit(max_attempts=5, window_seconds=300))],
)
def login(payload: AdminLoginRequest, db: Session = Depends(get_db)):
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password",
    )

    admin = db.query(Admin).filter(Admin.username == payload.username).first()
    if admin and admin.password and verify_password(payload.password, admin.password):
        token = create_access_token(subject=f"admin:{admin.username}")
        return AdminAuthSession(
            access_token=token,
            admin=AdminOut(username=admin.username, name=admin.name, role=admin.role),
        )

    # Real trainers live in `agencyteam`, not `admin` - fall back to it so
    # they can sign in the same way once they're not seeded into `admin`.
    # The login field doubles as "Company ID / Phone No", so match either
    # `username` (phone) or `offerId` (employee ID).
    agent = (
        db.query(AgencyTeam)
        .filter(
            or_(
                AgencyTeam.username == payload.username,
                AgencyTeam.offerId == payload.username,
            )
        )
        .first()
    )
    if agent and agent.password and verify_password(payload.password, agent.password):
        token = create_access_token(subject=f"agencyteam:{agent.username}")
        return AdminAuthSession(
            access_token=token,
            admin=AdminOut(
                username=agent.username,
                name=agent.name or agent.username,
                role=agent.role or "trainer",
                offerId=agent.offerId,
            ),
        )

    raise unauthorized
