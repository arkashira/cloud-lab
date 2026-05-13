from sqlalchemy.orm import relationship
from .invitation import Invitation

if not hasattr(Lab, "invitations"):
    Lab.invitations = relationship(
        "Invitation",
        back_populates="lab",
        cascade="all, delete-orphan",
        lazy="selectin",
    )