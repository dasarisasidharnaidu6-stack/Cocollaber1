"""
Interest Entity Model.
Represents a seeker expressing interest in an opportunity.
"""
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, String, DateTime, ForeignKey, Uuid, UniqueConstraint, Index
from apps.api.app.db.base import Base, IdMixin, TimestampMixin

class Interest(Base, IdMixin, TimestampMixin):
    __tablename__ = "interests"

    opportunity_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("opportunities.id", ondelete="CASCADE"), index=True, nullable=False)
    seeker_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("accounts.id", ondelete="CASCADE"), index=True, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="pending", index=True, nullable=False)
    responded_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    opportunity: Mapped["Opportunity"] = relationship("Opportunity", back_populates="interests")
    seeker: Mapped["Account"] = relationship("Account", back_populates="interests")
    connection: Mapped[Optional["Connection"]] = relationship("Connection", back_populates="interest", uselist=False, cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("opportunity_id", "seeker_id", name="uq_interests_opp_seeker"),
        Index("ix_interests_status_created_at", "status", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Interest(opp={self.opportunity_id}, seeker={self.seeker_id}, status={self.status})>"
