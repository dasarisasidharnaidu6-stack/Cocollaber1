"""Opportunities Module Schemas."""
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class OpportunityCreate(BaseModel):
    title: str = Field(min_length=5, max_length=120)
    description: str = Field(min_length=20, max_length=5000)
    opportunity_type: str = Field(default="collaboration")
    compensation_type: str = Field(description="Must be paid, unpaid, stipend, credit_recognition, or unspecified")
    compensation_details: Optional[str] = Field(None, max_length=300)
    is_remote: bool = True
    location_text: Optional[str] = Field(None, max_length=100)
    deadline: Optional[datetime] = None
    attributes: Dict[str, Any] = Field(default_factory=dict)
    domain_ids: List[uuid.UUID] = Field(default_factory=list)

class OpportunityUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=120)
    description: Optional[str] = Field(None, min_length=20, max_length=5000)
    opportunity_type: Optional[str] = None
    status: Optional[str] = None
    compensation_type: Optional[str] = None
    compensation_details: Optional[str] = None
    is_remote: Optional[bool] = None
    location_text: Optional[str] = None
    deadline: Optional[datetime] = None
    attributes: Optional[Dict[str, Any]] = None

class OpportunityResponse(BaseModel):
    id: uuid.UUID
    creator_id: uuid.UUID
    title: str
    description: str
    opportunity_type: str
    status: str
    compensation_type: str
    compensation_details: Optional[str] = None
    is_remote: bool
    location_text: Optional[str] = None
    deadline: Optional[datetime] = None
    attributes: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
