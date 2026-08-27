from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.database.database import get_db
from app.models.admin import Admin
from app.models.agency_team import AgencyTeam
from app.schemas.catalog import SelectOptionOut

router = APIRouter(prefix="/admin", tags=["trainer"])


def _find_trainer(db: Session, username: str) -> Admin | AgencyTeam | None:
    """Real trainers live in `agencyteam`, not `admin` (same fallback the
    login endpoint uses) - check both so this doesn't 404 for accounts
    only seeded into `agencyteam`."""
    trainer = (
        db.query(Admin)
        .filter(Admin.username == username, Admin.role == "trainer")
        .first()
    )
    if trainer:
        return trainer
    return (
        db.query(AgencyTeam)
        .filter(AgencyTeam.username == username, AgencyTeam.role == "trainer")
        .first()
    )


@router.get("/trainers", response_model=list[SelectOptionOut])
def list_trainers(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    """Powers the Add Training form's Trainer ID picker."""
    admins = db.query(Admin).filter(Admin.role == "trainer").all()
    agents = db.query(AgencyTeam).filter(AgencyTeam.role == "trainer").all()

    seen: set[str] = set()
    options: list[SelectOptionOut] = []
    for trainer in [*admins, *agents]:
        if not trainer.username or trainer.username in seen:
            continue
        seen.add(trainer.username)
        options.append(SelectOptionOut(label=trainer.name or trainer.username, value=trainer.username))
    return sorted(options, key=lambda o: o.label)


@router.get("/trainers/{username}")
def get_trainer_name(
    username: str,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    trainer = _find_trainer(db, username)
    if not trainer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainer not found")

    return {"username": trainer.username, "name": trainer.name}
