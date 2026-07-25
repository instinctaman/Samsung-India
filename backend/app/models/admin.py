import uuid

from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Admin(Base):
    """Mirrors the `admin` table from the legacy tecsoui_tops_aman schema,
    trimmed to the columns this app currently uses. Shared by admin and
    trainer accounts, distinguished by `role` - only `role="trainer"`
    accounts can sign into the trainer dashboard today; `role="admin"`
    rows are stored for a future admin panel."""

    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, index=True)

    adminUid = Column(
        String(100), unique=True, nullable=False, default=lambda: uuid.uuid4().hex
    )

    name = Column(String(100))
    username = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(100), nullable=False)
