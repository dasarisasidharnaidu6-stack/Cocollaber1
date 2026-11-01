"""Participation Module Schemas."""

import uuid
from datetime import datetime

from pydantic import BaseModel


class ParticipationResponse(BaseModel):
    id: uuid.UUID
    opportunity_id: uuid.UUID
    creator_id: uuid.UUID
    seeker_id: uuid.UUID
    creator_confirmed: bool
    seeker_confirmed: bool
    status: str
    confirmed_at: datetime | None = None
    created_at: datetime

    class Config:
        from_attributes = True
