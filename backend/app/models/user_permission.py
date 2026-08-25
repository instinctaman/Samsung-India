from sqlalchemy import Column, Enum, ForeignKey, Integer, text
from sqlalchemy.orm import relationship

from app.database.database import Base


class UserPermission(Base):
    """Mirrors the `user_permissions` table from mmtbtwob_tops — module-level
    read/write access control per user. Each row grants (or denies) one module
    to one user. References `system_modules.id` via FK with CASCADE delete."""

    __tablename__ = "user_permissions"

    id = Column(Integer, primary_key=True, index=True)

    # Points to the `id` of the row in the table named by `table_type`
    user_id = Column(Integer)
    table_type = Column(
        Enum("admin", "agencyteam", "trainee", name="user_permissions_table_type")
    )
    module_id = Column(
        Integer,
        ForeignKey("system_modules.id", ondelete="CASCADE"),
        index=True,
    )

    can_read = Column(Integer, server_default=text("0"))
    can_write = Column(Integer, server_default=text("0"))

    module = relationship("SystemModule", back_populates="permissions")
