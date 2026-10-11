"""
Participation Model.
Represents verified collaboration outcomes confirmed by both parties.
"""
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Uuid, UniqueConstraint
from apps.api.app.db.base import Base, IdMixin, TimestampMixin

class Participation(Base, IdMixin, TimestampMixin):
    __tablename__ = "participations"

    opportunity_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False)
    creator_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("accounts.id", ondelete="RESTRICT"), nullable=False)
    seeker_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("accounts.id", ondelete="RESTRICT"), nullable=False)
    creator_confirmed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    seeker_confirmed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="proposed", nullable=False)
    confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint("opportunity_id", "seeker_id", name="uq_participations_opp_seeker"),
    )

    def __repr__(self) -> str:
        return f"<Participation(opp={self.opportunity_id}, status={self.status})>"
