"""Discovery Module Schemas."""
import uuid
from typing import List
from pydantic import BaseModel
from apps.api.app.modules.opportunities.schemas import OpportunityResponse

class DomainResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    is_active: bool
    class Config:
        from_attributes = True

class TagResponse(BaseModel):
    id: uuid.UUID
    name: str
    class Config:
        from_attributes = True
