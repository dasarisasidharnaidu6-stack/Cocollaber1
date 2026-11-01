"""Opportunities Module Schemas."""

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class OpportunityCreate(BaseModel):
    title: str = Field(min_length=5, max_length=120)
    description: str = Field(min_length=20, max_length=5000)
    opportunity_type: str = Field(default="collaboration")
    compensation_type: str = Field(
        description="Must be paid, unpaid, stipend, credit_recognition, or unspecified"
    )
    compensation_details: str | None = Field(None, max_length=300)
    is_remote: bool = True
    location_text: str | None = Field(None, max_length=100)
    deadline: datetime | None = None
    attributes: dict[str, Any] = Field(default_factory=dict)
    domain_ids: list[uuid.UUID] = Field(default_factory=list)


class OpportunityUpdate(BaseModel):
    title: str | None = Field(None, min_length=5, max_length=120)
    description: str | None = Field(None, min_length=20, max_length=5000)
    opportunity_type: str | None = None
    status: str | None = None
    compensation_type: str | None = None
    compensation_details: str | None = None
    is_remote: bool | None = None
    location_text: str | None = None
    deadline: datetime | None = None
    attributes: dict[str, Any] | None = None


class OpportunityResponse(BaseModel):
    id: uuid.UUID
    creator_id: uuid.UUID
    title: str
    description: str
    opportunity_type: str
    status: str
    compensation_type: str
    compensation_details: str | None = None
    is_remote: bool
    location_text: str | None = None
    deadline: datetime | None = None
    attributes: dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
