"""Authentication-related models and schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, constr

class TokenData(BaseModel):
    """Token data schema."""
    username: Optional[str] = None
    exp: Optional[datetime] = None

class Token(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"
    expires_at: datetime

class UserLogin(BaseModel):
    """User login request schema."""
    email: EmailStr
    password: constr(min_length=8, max_length=100)

class UserSignup(BaseModel):
    """User signup request schema."""
    email: EmailStr
    password: constr(min_length=8, max_length=100)
    full_name: str = Field(..., min_length=1, max_length=100)
    company_name: Optional[str] = Field(None, max_length=100)
    is_developer: bool = False

class PasswordReset(BaseModel):
    """Password reset request schema."""
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    """Password reset confirmation schema."""
    token: str
    new_password: constr(min_length=8, max_length=100)

class PasswordChange(BaseModel):
    """Password change request schema."""
    current_password: str
    new_password: constr(min_length=8, max_length=100)
