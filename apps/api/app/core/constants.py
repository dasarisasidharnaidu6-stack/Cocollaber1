"""
Domain constants, enum values, and validation boundaries.
Directly traceable to SRS v1.0 Global Validation Rules (GV-1..13).
"""
from enum import Enum

class OpportunityType(str, Enum):
    COLLABORATION = "collaboration"
    TEAM_MEMBERSHIP = "team_membership"
    EVENT_COMPETITION = "event_competition"
    VOLUNTEERING = "volunteering"
    LEARNING_RESEARCH = "learning_research"
    PAID_WORK = "paid_work"
    OTHER = "other"

class CompensationType(str, Enum):
    PAID = "paid"
    UNPAID = "unpaid"
    STIPEND = "stipend"
    CREDIT_RECOGNITION = "credit_recognition"
    UNSPECIFIED = "unspecified"

class OpportunityStatus(str, Enum):
    DRAFT = "draft"
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    FILLED = "filled"
    CLOSED = "closed"
    REMOVED = "removed"

class InterestStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    WITHDRAWN = "withdrawn"

class ParticipationStatus(str, Enum):
    PROPOSED = "proposed"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"

# Validation limits per SRS Global Validation Rules
MAX_DISPLAY_NAME_LENGTH = 60
MAX_BIO_LENGTH = 500
MAX_OPPORTUNITY_TITLE_LENGTH = 120
MAX_OPPORTUNITY_DESC_LENGTH = 5000
MAX_INTEREST_MESSAGE_LENGTH = 1000
MAX_CHAT_MESSAGE_LENGTH = 2000
MAX_OFFERS_COUNT = 10
MAX_SEEKS_COUNT = 10
MIN_MEMBER_AGE = 18
