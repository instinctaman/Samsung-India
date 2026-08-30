from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class SystemModule(Base):
    """Mirrors the `system_modules` table from mmtbtwob_tops — the permission
    module registry. Each row represents a named feature/section of the system
    that can be individually granted or denied via `user_permissions`."""

    __tablename__ = "system_modules"

    id = Column(Integer, primary_key=True, index=True)
    module_key = Column(String(50), unique=True)
    module_name = Column(String(100))
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    permissions = relationship(
        "UserPermission",
        back_populates="module",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
