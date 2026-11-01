"""
Session & Verification Token Models.
Session tracking and single-use verification links.
"""

import uuid
from datetime import datetime

from apps.api.app.db.base import Base, IdMixin, TimestampMixin
from sqlalchemy import DateTime, ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column


class SessionRecord(Base, IdMixin, TimestampMixin):
    __tablename__ = "sessions"

    account_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="CASCADE"), index=True, nullable=False
    )
    session_token: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), index=True, nullable=False
    )
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(500), nullable=True)


class VerificationToken(Base, IdMixin, TimestampMixin):
    __tablename__ = "verification_tokens"

    account_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="CASCADE"), index=True, nullable=False
    )
    token: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    token_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
