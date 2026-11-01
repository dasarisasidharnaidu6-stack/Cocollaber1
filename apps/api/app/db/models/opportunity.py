"""
Opportunity Entity Model.
Unified opportunity concept with mandatory compensation disclosure
and flexible JSONB attributes.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from apps.api.app.db.base import Base, IdMixin, SoftDeleteMixin, TimestampMixin
from sqlalchemy import JSON, Boolean, Column, DateTime, ForeignKey, Index, String, Table, Text, Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from apps.api.app.db.models.domain import Domain, Tag
    from apps.api.app.db.models.interest import Interest
    from apps.api.app.db.models.member import Account

# Join tables
opportunity_domains = Table(
    "opportunity_domains",
    Base.metadata,
    Column(
        "opportunity_id", Uuid, ForeignKey("opportunities.id", ondelete="CASCADE"), primary_key=True
    ),
    Column("domain_id", Uuid, ForeignKey("domains.id", ondelete="CASCADE"), primary_key=True),
)

opportunity_tags = Table(
    "opportunity_tags",
    Base.metadata,
    Column(
        "opportunity_id", Uuid, ForeignKey("opportunities.id", ondelete="CASCADE"), primary_key=True
    ),
    Column("tag_id", Uuid, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)


class Opportunity(Base, IdMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "opportunities"

    creator_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="RESTRICT"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    opportunity_type: Mapped[str] = mapped_column(String(40), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="open", index=True, nullable=False)
    compensation_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    compensation_details: Mapped[str | None] = mapped_column(String(300), nullable=True)
    is_remote: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    location_text: Mapped[str | None] = mapped_column(String(100), nullable=True)
    deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    attributes: Mapped[dict[str, Any]] = mapped_column(
        JSON().with_variant(JSONB, "postgresql"), default=dict, nullable=False
    )

    creator: Mapped["Account"] = relationship("Account", back_populates="opportunities")
    domains: Mapped[list["Domain"]] = relationship("Domain", secondary=opportunity_domains)
    tags: Mapped[list["Tag"]] = relationship("Tag", secondary=opportunity_tags)
    interests: Mapped[list["Interest"]] = relationship(
        "Interest", back_populates="opportunity", cascade="all, delete-orphan"
    )

    __table_args__ = (Index("ix_opportunities_status_created_at", "status", "created_at"),)

    def __repr__(self) -> str:
        return f"<Opportunity(id={self.id}, title={self.title}, comp={self.compensation_type})>"
