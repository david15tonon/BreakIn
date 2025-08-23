"""Base authentication schemas."""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator
from app.utils.auth.constants import MIN_PASSWORD_LENGTH


class UserBase(BaseModel):
    """Base user attributes."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    

class UserCreate(UserBase):
    """User creation schema."""
    password: str = Field(..., min_length=MIN_PASSWORD_LENGTH)
    confirm_password: str
    
    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v


class UserLogin(BaseModel):
    """Login credentials schema."""
    email: EmailStr
    password: str
    remember_me: bool = False


class UserUpdate(BaseModel):
    """User update schema."""
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    password: Optional[str] = Field(None, min_length=MIN_PASSWORD_LENGTH)


class TokenPayload(BaseModel):
    """JWT token payload schema."""
    sub: str  # user id
    exp: int
    iat: int
    type: str


class Token(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class RefreshToken(BaseModel):
    """Refresh token schema."""
    refresh_token: str
