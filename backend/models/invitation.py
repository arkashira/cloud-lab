import uuid
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Index,
    Enum,
)
from sqlalchemy.orm import relationship

from .base import Base
from .lab import Lab   # existing model
from .user import User  # existing model


class Invitation(Base):
    """
    Persistent invitation record.

    * `id`          – UUID primary key (human‑readable if you need it)
    * `lab_id`      – FK to the Lab being invited to
    * `inviter_id`  – FK to the User who created the invitation
    * `token`       – Secure random string used in URLs
    * `expires_at`  – UTC timestamp after which the invite is invalid
    * `used`        – Boolean flag set after a successful acceptance
    * `role`        – Optional role the invitee will receive (owner/member)
    """
    __tablename__ = "invitations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    lab_id = Column(String, ForeignKey("labs.id", ondelete="CASCADE"), nullable=False)
    inviter_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"))
    token = Column(String, unique=True, nullable=False, default=lambda: uuid.uuid4().hex)
    expires_at = Column(DateTime, nullable=False, default=lambda: datetime.utcnow() + timedelta(days=7))
    used = Column(Boolean, default=False, nullable=False)
    role = Column(Enum("owner", "member", name="invitation_role"), nullable=False, default="member")

    # Relationships – useful for eager loading in the API
    lab = relationship("Lab", back_populates="invitations")
    inviter = relationship("User")

    __table_args__ = (Index("ix_invitation_token", "token"),)

    # ------------------------------------------------------------------ #
    # Business helpers
    # ------------------------------------------------------------------ #
    def is_valid(self) -> bool:
        """True if the invitation has not expired and has not been used."""
        return not self.used and datetime.utcnow() < self.expires_at

    def mark_used(self) -> None:
        """Mark the invitation as used – caller must commit the session."""
        self.used = True