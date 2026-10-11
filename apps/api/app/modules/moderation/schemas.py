"""Moderation Module Schemas."""
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class ReportCreate(BaseModel):
    target_type: str = Field(description="Must be 'opportunity', 'profile', or 'message'")
    target_id: uuid.UUID
    reason_code: str = Field(min_length=2, max_length=50)
    details: Optional[str] = Field(None, max_length=1000)

class ReportResponse(BaseModel):
    id: uuid.UUID
    reporter_id: Optional[uuid.UUID]
    target_type: str
    target_id: uuid.UUID
    reason_code: str
    details: Optional[str] = None
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class ModerationActionCreate(BaseModel):
    action_type: str = Field(description="Must be 'warn', 'remove_content', 'suspend_account', or 'dismiss'")
    notes: str = Field(min_length=5)
