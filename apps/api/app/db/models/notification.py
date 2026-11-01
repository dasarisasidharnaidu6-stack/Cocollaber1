"""
In-app Notification Model.
"""

import uuid
from typing import Any

from apps.api.app.db.base import Base, IdMixin, TimestampMixin
from sqlalchemy import JSON, Boolean, ForeignKey, Index, String, Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column


class Notification(Base, IdMixin, TimestampMixin):
    __tablename__ = "notifications"

    recipient_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="CASCADE"), index=True, nullable=False
    )
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    message: Mapped[str] = mapped_column(String(500), nullable=False)
    payload: Mapped[dict[str, Any]] = mapped_column(
        JSON().with_variant(JSONB, "postgresql"), default=dict, nullable=False
    )
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)

    __table_args__ = (Index("ix_notifications_recipient_created", "recipient_id", "created_at"),)
