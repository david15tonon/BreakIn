"""JWT token service."""

from datetime import datetime, timedelta
from typing import Dict, Optional
import jwt
from fastapi import HTTPException
from app.config import get_settings

settings = get_settings()

# JWT configuration
JWT_SECRET = settings.JWT_SECRET_KEY
JWT_ALGORITHM = settings.JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# In-memory token blacklist (replace with Redis in production)
_token_blacklist = set()

def create_access_token(data: dict) -> str:
    """Create a new JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    try:
        encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return encoded_jwt
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not create access token: {str(e)}")

def decode_token(token: str) -> Dict:
    """Decode and validate a JWT token."""
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if is_token_blacklisted(token):
            raise HTTPException(status_code=401, detail="Token has been blacklisted")
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate token")

def blacklist_token(token: str) -> None:
    """Add a token to the blacklist."""
    _token_blacklist.add(token)

def is_token_blacklisted(token: str) -> bool:
    """Check if a token is blacklisted."""
    return token in _token_blacklist

def get_token_expiration(token: str) -> Optional[datetime]:
    """Get token expiration datetime."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        exp_timestamp = payload.get("exp")
        if exp_timestamp:
            return datetime.fromtimestamp(exp_timestamp)
        return None
    except Exception:
        return None
