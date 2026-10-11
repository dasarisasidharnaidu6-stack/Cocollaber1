"""
Database Model Registry.
Exports and registers all CoCollaber domain entities with Base.metadata.
"""
from apps.api.app.db.base import Base, IdMixin, TimestampMixin, SoftDeleteMixin
from apps.api.app.db.models.domain import Domain, Tag
from apps.api.app.db.models.member import Account, Profile, MemberOffer, MemberSeek, member_interests
from apps.api.app.db.models.opportunity import Opportunity, opportunity_domains, opportunity_tags
from apps.api.app.db.models.interest import Interest
from apps.api.app.db.models.connection import Connection
from apps.api.app.db.models.message import Message
from apps.api.app.db.models.participation import Participation
from apps.api.app.db.models.moderation import Report, Block, ModerationAction
from apps.api.app.db.models.notification import Notification
from apps.api.app.db.models.audit import AuditLog
from apps.api.app.db.models.auth import SessionRecord, VerificationToken

__all__ = [
    "Base",
    "IdMixin",
    "TimestampMixin",
    "SoftDeleteMixin",
    "Domain",
    "Tag",
    "Account",
    "Profile",
    "MemberOffer",
    "MemberSeek",
    "member_interests",
    "Opportunity",
    "opportunity_domains",
    "opportunity_tags",
    "Interest",
    "Connection",
    "Message",
    "Participation",
    "Report",
    "Block",
    "ModerationAction",
    "Notification",
    "AuditLog",
    "SessionRecord",
    "VerificationToken",
]
