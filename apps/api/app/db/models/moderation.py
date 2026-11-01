"""
Moderation Models: Reports, Blocks, and Moderation Actions.
Foundational trust and safety architecture.
"""

import uuid

from apps.api.app.db.base import Base, IdMixin, TimestampMixin
from sqlalchemy import ForeignKey, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column


class Report(Base, IdMixin, TimestampMixin):
    __tablename__ = "reports"

    reporter_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="SET NULL"), nullable=True
    )
    target_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    target_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True, nullable=False)
    reason_code: Mapped[str] = mapped_column(String(50), nullable=False)
    details: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="pending", index=True, nullable=False)


class Block(Base, IdMixin, TimestampMixin):
    __tablename__ = "blocks"

    blocker_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False
    )
    blocked_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("blocker_id", "blocked_id", name="uq_blocks_blocker_blocked"),
    )


class ModerationAction(Base, IdMixin, TimestampMixin):
    __tablename__ = "moderation_actions"

    report_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("reports.id", ondelete="SET NULL"), nullable=True
    )
    moderator_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="RESTRICT"), nullable=False
    )
    action_type: Mapped[str] = mapped_column(String(32), nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=False)
