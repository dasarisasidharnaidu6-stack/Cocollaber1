"""
Audit Log Model.
Non-repudiable system event auditing.
"""
import uuid
from typing import Optional, Dict, Any
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey, Uuid, Index
from sqlalchemy.dialects.postgresql import JSONB
from apps.api.app.db.base import Base, IdMixin, TimestampMixin

class AuditLog(Base, IdMixin, TimestampMixin):
    __tablename__ = "audit_logs"

    actor_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid, ForeignKey("accounts.id", ondelete="SET NULL"), index=True, nullable=True)
    action: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    entity_type: Mapped[str] = mapped_column(String(32), nullable=False)
    entity_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)

    __table_args__ = (
        Index("ix_audit_logs_action_created", "action", "created_at"),
    )
