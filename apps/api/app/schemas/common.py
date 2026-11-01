"""
Common Pydantic Schemas.
Pagination, standard responses, and error contract.
"""

from typing import Any

from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1, description="Page number starting at 1")
    per_page: int = Field(default=20, ge=1, le=100, description="Items per page (max 100)")


class PaginatedResponse[T](BaseModel):
    items: list[T]
    total: int
    page: int
    per_page: int
    pages: int


class MessageResponse(BaseModel):
    message: str
    status: str = "success"


class ErrorDetail(BaseModel):
    error_code: str
    message: str
    details: Any | None = None
    request_id: str | None = None
