"""
Interest Entity Model.
Represents a seeker expressing interest in an opportunity.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from apps.api.app.db.base import Base, IdMixin, TimestampMixin
from sqlalchemy import DateTime, ForeignKey, Index, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from apps.api.app.db.models.connection import Connection
    from apps.api.app.db.models.member import Account
    from apps.api.app.db.models.opportunity import Opportunity


class Interest(Base, IdMixin, TimestampMixin):
    __tablename__ = "interests"

    opportunity_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("opportunities.id", ondelete="CASCADE"), index=True, nullable=False
    )
    seeker_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="CASCADE"), index=True, nullable=False
    )
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="pending", index=True, nullable=False)
    responded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    opportunity: Mapped["Opportunity"] = relationship("Opportunity", back_populates="interests")
    seeker: Mapped["Account"] = relationship("Account", back_populates="interests")
    connection: Mapped[Optional["Connection"]] = relationship(
        "Connection", back_populates="interest", uselist=False, cascade="all, delete-orphan"
    )

    __table_args__ = (
        UniqueConstraint("opportunity_id", "seeker_id", name="uq_interests_opp_seeker"),
        Index("ix_interests_status_created_at", "status", "created_at"),
    )

    def __repr__(self) -> str:
        return (
            f"<Interest(opp={self.opportunity_id}, seeker={self.seeker_id}, status={self.status})>"
        )
