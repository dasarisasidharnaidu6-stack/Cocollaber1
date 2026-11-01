"""
Connection Model.
Establishes the communication boundary upon mutual acceptance.
"""

import uuid
from typing import TYPE_CHECKING

from apps.api.app.db.base import Base, IdMixin, TimestampMixin
from sqlalchemy import ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from apps.api.app.db.models.interest import Interest
    from apps.api.app.db.models.message import Message


class Connection(Base, IdMixin, TimestampMixin):
    __tablename__ = "connections"

    interest_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("interests.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    opportunity_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("opportunities.id", ondelete="CASCADE"), index=True, nullable=False
    )
    creator_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="RESTRICT"), nullable=False
    )
    seeker_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="RESTRICT"), nullable=False
    )
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)

    interest: Mapped["Interest"] = relationship("Interest", back_populates="connection")
    messages: Mapped[list["Message"]] = relationship(
        "Message", back_populates="connection", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Connection(id={self.id}, opp={self.opportunity_id})>"
