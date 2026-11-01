"""Moderation Module Schemas."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class ReportCreate(BaseModel):
    target_type: str = Field(description="Must be 'opportunity', 'profile', or 'message'")
    target_id: uuid.UUID
    reason_code: str = Field(min_length=2, max_length=50)
    details: str | None = Field(None, max_length=1000)


class ReportResponse(BaseModel):
    id: uuid.UUID
    reporter_id: uuid.UUID | None
    target_type: str
    target_id: uuid.UUID
    reason_code: str
    details: str | None = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ModerationActionCreate(BaseModel):
    action_type: str = Field(
        description="Must be 'warn', 'remove_content', 'suspend_account', or 'dismiss'"
    )
    notes: str = Field(min_length=5)
