"""Interactions Module Schemas."""
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class InterestCreate(BaseModel):
    message: str = Field(min_length=10, max_length=1000)

class InterestRespondRequest(BaseModel):
    action: str = Field(description="Must be 'accept' or 'decline'")

class InterestResponse(BaseModel):
    id: uuid.UUID
    opportunity_id: uuid.UUID
    seeker_id: uuid.UUID
    message: str
    status: str
    responded_at: Optional[datetime] = None
    created_at: datetime
    class Config:
        from_attributes = True
