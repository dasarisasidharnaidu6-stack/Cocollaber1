"""Members Module Schemas."""
import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class OfferCreate(BaseModel):
    title: str = Field(min_length=3, max_length=80)
    description: Optional[str] = Field(None, max_length=300)

class OfferResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    display_order: int
    created_at: datetime
    class Config:
        from_attributes = True

class SeekCreate(BaseModel):
    title: str = Field(min_length=3, max_length=80)
    description: Optional[str] = Field(None, max_length=300)

class SeekResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    display_order: int
    created_at: datetime
    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=2, max_length=60)
    headline: Optional[str] = Field(None, max_length=120)
    bio: Optional[str] = Field(None, max_length=500)
    location_text: Optional[str] = Field(None, max_length=100)
    is_location_public: Optional[bool] = None
    avatar_url: Optional[str] = Field(None, max_length=2048)

class ProfileResponse(BaseModel):
    id: uuid.UUID
    account_id: uuid.UUID
    display_name: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    location_text: Optional[str] = None
    is_location_public: bool
    avatar_url: Optional[str] = None
    offers: List[OfferResponse] = []
    seeks: List[SeekResponse] = []
    created_at: datetime
    class Config:
        from_attributes = True
