from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.database import get_db
from app.models.admin import Admin
from app.models.agency_team import AgencyTeam
from app.models.trainee import Trainee

bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def get_current_trainee(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Trainee:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired session",
    )

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except JWTError:
        raise unauthorized

    try:
        phone = int(payload.get("sub"))
    except (TypeError, ValueError):
        raise unauthorized

    trainee = db.query(Trainee).filter(Trainee.phone == phone).first()
    if not trainee:
        raise unauthorized

    return trainee


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Admin | AgencyTeam:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired session",
    )

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except JWTError:
        raise unauthorized

    subject = payload.get("sub") or ""

    if subject.startswith("admin:"):
        admin = db.query(Admin).filter(Admin.username == subject.removeprefix("admin:")).first()
        if not admin:
            raise unauthorized
        return admin

    if subject.startswith("agencyteam:"):
        agent = (
            db.query(AgencyTeam)
            .filter(AgencyTeam.username == subject.removeprefix("agencyteam:"))
            .first()
        )
        if not agent:
            raise unauthorized
        return agent

    raise unauthorized


def require_admin_role(admin: Admin | AgencyTeam = Depends(get_current_admin)) -> Admin:
    """Same auth as get_current_admin, but only lets role="admin" accounts
    through - for the admin-only review/assessment-builder endpoints that
    a trainer account must not be able to reach."""
    if getattr(admin, "role", None) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This action requires an admin account",
        )
    return admin
