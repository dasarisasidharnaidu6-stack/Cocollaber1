"""
Database Model Registry.
Exports and registers all CoCollaber domain entities with Base.metadata.
"""

from apps.api.app.db.base import Base, IdMixin, SoftDeleteMixin, TimestampMixin
from apps.api.app.db.models.audit import AuditLog
from apps.api.app.db.models.auth import SessionRecord, VerificationToken
from apps.api.app.db.models.connection import Connection
from apps.api.app.db.models.domain import Domain, Tag
from apps.api.app.db.models.interest import Interest
from apps.api.app.db.models.member import (
    Account,
    MemberOffer,
    MemberSeek,
    Profile,
    member_interests,
)
from apps.api.app.db.models.message import Message
from apps.api.app.db.models.moderation import Block, ModerationAction, Report
from apps.api.app.db.models.notification import Notification
from apps.api.app.db.models.opportunity import Opportunity, opportunity_domains, opportunity_tags
from apps.api.app.db.models.participation import Participation

__all__ = [
    "Account",
    "AuditLog",
    "Base",
    "Block",
    "Connection",
    "Domain",
    "IdMixin",
    "Interest",
    "MemberOffer",
    "MemberSeek",
    "Message",
    "ModerationAction",
    "Notification",
    "Opportunity",
    "Participation",
    "Profile",
    "Report",
    "SessionRecord",
    "SoftDeleteMixin",
    "Tag",
    "TimestampMixin",
    "VerificationToken",
    "member_interests",
    "opportunity_domains",
    "opportunity_tags",
]
