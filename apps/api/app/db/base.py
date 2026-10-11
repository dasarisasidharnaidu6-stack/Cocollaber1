"""
CoCollaber Database Declarative Base & Standard Mixins.
SQLAlchemy 2.0 Conventions with native UUID, Timestamps, and Soft-Deletion.
"""
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import DateTime, Uuid, func

class Base(DeclarativeBase):
    """Base declarative class for all CoCollaber models."""
    pass

class IdMixin:
    """Standard primary key mixin providing UUID primary keys."""
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
        nullable=False,
    )

class TimestampMixin:
    """Standard audit timestamps (UTC)."""
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

class SoftDeleteMixin:
    """Soft deletion timestamp mixin for recoverable and audit-safe entities."""
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
    )

    @property
    def is_deleted(self) -> bool:
        return self.deleted_at is not None
