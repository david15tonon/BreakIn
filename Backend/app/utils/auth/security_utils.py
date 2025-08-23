"""Security utilities for authentication and authorization."""

import hashlib
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

import jwt
import bcrypt
from passlib.context import CryptContext
import pyotp

from app.config import settings
from app.utils.auth.constants import (
    JWT_ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    PASSWORD_SPECIAL_CHARS,
    MIN_PASSWORD_LENGTH
)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash."""
    return pwd_context.hash(password)


def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password meets minimum requirements.
    Returns (is_valid, error_message).
    """
    if len(password) < MIN_PASSWORD_LENGTH:
        return False, f"Password must be at least {MIN_PASSWORD_LENGTH} characters"
    
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
        
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
        
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number"
        
    if not any(c in PASSWORD_SPECIAL_CHARS for c in password):
        return False, "Password must contain at least one special character"
    
    return True, ""


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a new JWT access token."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify and decode a JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.InvalidTokenError:
        return None


def generate_password_reset_token() -> str:
    """Generate a secure token for password reset."""
    return secrets.token_urlsafe(32)


def generate_random_password(length: int = 12) -> str:
    """Generate a secure random password."""
    alphabet = string.ascii_letters + string.digits + PASSWORD_SPECIAL_CHARS
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def generate_totp_secret() -> str:
    """Generate a new TOTP secret for 2FA."""
    return pyotp.random_base32()


def verify_totp(secret: str, code: str) -> bool:
    """Verify a TOTP code."""
    totp = pyotp.TOTP(secret)
    return totp.verify(code)
