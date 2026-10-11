"""
Opportunity Entity Model.
Unified opportunity concept with mandatory compensation disclosure
and flexible JSONB attributes.
"""
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, Table, Column, Uuid, Index, JSON
from sqlalchemy.dialects.postgresql import JSONB
from apps.api.app.db.base import Base, IdMixin, TimestampMixin, SoftDeleteMixin

# Join tables
opportunity_domains = Table(
    "opportunity_domains",
    Base.metadata,
    Column("opportunity_id", Uuid, ForeignKey("opportunities.id", ondelete="CASCADE"), primary_key=True),
    Column("domain_id", Uuid, ForeignKey("domains.id", ondelete="CASCADE"), primary_key=True),
)

opportunity_tags = Table(
    "opportunity_tags",
    Base.metadata,
    Column("opportunity_id", Uuid, ForeignKey("opportunities.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Uuid, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)

class Opportunity(Base, IdMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "opportunities"

    creator_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("accounts.id", ondelete="RESTRICT"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    opportunity_type: Mapped[str] = mapped_column(String(40), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="open", index=True, nullable=False)
    compensation_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    compensation_details: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    is_remote: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    location_text: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    deadline: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    attributes: Mapped[Dict[str, Any]] = mapped_column(JSON().with_variant(JSONB, "postgresql"), default=dict, nullable=False)

    creator: Mapped["Account"] = relationship("Account", back_populates="opportunities")
    domains: Mapped[List["Domain"]] = relationship("Domain", secondary=opportunity_domains)
    tags: Mapped[List["Tag"]] = relationship("Tag", secondary=opportunity_tags)
    interests: Mapped[List["Interest"]] = relationship("Interest", back_populates="opportunity", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_opportunities_status_created_at", "status", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Opportunity(id={self.id}, title={self.title}, comp={self.compensation_type})>"
