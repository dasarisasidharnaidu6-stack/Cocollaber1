"""
Domain and Tag Taxonomy Models.
Supports domain-agnostic, open-ended categorization.
"""
from typing import List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean
from apps.api.app.db.base import Base, IdMixin, TimestampMixin

class Domain(Base, IdMixin, TimestampMixin):
    __tablename__ = "domains"

    name: Mapped[str] = mapped_column(String(60), unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    def __repr__(self) -> str:
        return f"<Domain(name={self.name})>"

class Tag(Base, IdMixin, TimestampMixin):
    __tablename__ = "tags"

    name: Mapped[str] = mapped_column(String(40), unique=True, index=True, nullable=False)

    def __repr__(self) -> str:
        return f"<Tag(name={self.name})>"
