"""Members Module Schemas."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class OfferCreate(BaseModel):
    title: str = Field(min_length=3, max_length=80)
    description: str | None = Field(None, max_length=300)


class OfferResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None = None
    display_order: int
    created_at: datetime

    class Config:
        from_attributes = True


class SeekCreate(BaseModel):
    title: str = Field(min_length=3, max_length=80)
    description: str | None = Field(None, max_length=300)


class SeekResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None = None
    display_order: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    display_name: str | None = Field(None, min_length=2, max_length=60)
    headline: str | None = Field(None, max_length=120)
    bio: str | None = Field(None, max_length=500)
    location_text: str | None = Field(None, max_length=100)
    is_location_public: bool | None = None
    avatar_url: str | None = Field(None, max_length=2048)


class ProfileResponse(BaseModel):
    id: uuid.UUID
    account_id: uuid.UUID
    display_name: str
    headline: str | None = None
    bio: str | None = None
    location_text: str | None = None
    is_location_public: bool
    avatar_url: str | None = None
    offers: list[OfferResponse] = []
    seeks: list[SeekResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True
