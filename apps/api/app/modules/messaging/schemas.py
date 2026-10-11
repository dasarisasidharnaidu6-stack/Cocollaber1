"""Messaging Module Schemas."""
import uuid
from datetime import datetime
from pydantic import BaseModel, Field

class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000)

class MessageResponse(BaseModel):
    id: uuid.UUID
    connection_id: uuid.UUID
    sender_id: uuid.UUID
    content: str
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True

class ConnectionResponse(BaseModel):
    id: uuid.UUID
    opportunity_id: uuid.UUID
    creator_id: uuid.UUID
    seeker_id: uuid.UUID
    status: str
    created_at: datetime
    class Config:
        from_attributes = True
