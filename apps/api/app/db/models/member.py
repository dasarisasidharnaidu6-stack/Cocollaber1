"""
Account, Profile, Offer, Seek, and Member Interest Models.
Supports fluid multi-identity profiles.
"""

import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING

from apps.api.app.db.base import Base, IdMixin, SoftDeleteMixin, TimestampMixin
from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from apps.api.app.db.models.domain import Domain
    from apps.api.app.db.models.interest import Interest
    from apps.api.app.db.models.opportunity import Opportunity

# Join table: member_interests (Profile <-> Domain)
member_interests = Table(
    "member_interests",
    Base.metadata,
    Column("profile_id", Uuid, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("domain_id", Uuid, ForeignKey("domains.id", ondelete="CASCADE"), primary_key=True),
)


class Account(Base, IdMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "accounts"

    email: Mapped[str] = mapped_column(String(254), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    account_type: Mapped[str] = mapped_column(String(32), default="person", nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="member", nullable=False)
    status: Mapped[str] = mapped_column(
        String(32), default="unverified", index=True, nullable=False
    )
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=False)
    email_verified_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="account", uselist=False, cascade="all, delete-orphan"
    )
    opportunities: Mapped[list["Opportunity"]] = relationship(
        "Opportunity", back_populates="creator"
    )
    interests: Mapped[list["Interest"]] = relationship("Interest", back_populates="seeker")

    def __repr__(self) -> str:
        return f"<Account(id={self.id}, email={self.email}, status={self.status})>"


class Profile(Base, IdMixin, TimestampMixin):
    __tablename__ = "profiles"

    account_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("accounts.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )
    display_name: Mapped[str] = mapped_column(String(60), nullable=False)
    headline: Mapped[str | None] = mapped_column(String(120), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    location_text: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_location_public: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)

    account: Mapped["Account"] = relationship("Account", back_populates="profile")
    offers: Mapped[list["MemberOffer"]] = relationship(
        "MemberOffer", back_populates="profile", cascade="all, delete-orphan"
    )
    seeks: Mapped[list["MemberSeek"]] = relationship(
        "MemberSeek", back_populates="profile", cascade="all, delete-orphan"
    )
    domains: Mapped[list["Domain"]] = relationship("Domain", secondary=member_interests)

    def __repr__(self) -> str:
        return f"<Profile(display_name={self.display_name})>"


class MemberOffer(Base, IdMixin, TimestampMixin):
    __tablename__ = "member_offers"

    profile_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("profiles.id", ondelete="CASCADE"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(80), nullable=False)
    description: Mapped[str | None] = mapped_column(String(300), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    profile: Mapped["Profile"] = relationship("Profile", back_populates="offers")


class MemberSeek(Base, IdMixin, TimestampMixin):
    __tablename__ = "member_seeks"

    profile_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("profiles.id", ondelete="CASCADE"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(80), nullable=False)
    description: Mapped[str | None] = mapped_column(String(300), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    profile: Mapped["Profile"] = relationship("Profile", back_populates="seeks")
