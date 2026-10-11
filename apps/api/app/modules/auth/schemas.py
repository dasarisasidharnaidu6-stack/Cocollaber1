"""Auth Module Schemas."""
import uuid
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=10, max_length=128)
    display_name: str = Field(min_length=2, max_length=60)
    date_of_birth: date
    terms_accepted: bool = Field(default=True)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyEmailRequest(BaseModel):
    token: str = Field(min_length=10, max_length=128)

class AccountResponse(BaseModel):
    id: uuid.UUID
    email: str
    account_type: str
    role: str
    status: str
    date_of_birth: date
    email_verified_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    account: AccountResponse
    access_token: str
    token_type: str = "bearer"
    verification_token: Optional[str] = None  # Returned in development mode for easy verification
