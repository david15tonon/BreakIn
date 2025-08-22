"""Authentication middleware."""

from typing import Optional
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.auth.security_utils import verify_token
from app.services.auth.jwt_service import is_token_blacklisted


class JWTBearer(HTTPBearer):
    """JWT bearer token authentication."""
    
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[HTTPAuthorizationCredentials]:
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        
        if not credentials:
            raise HTTPException(status_code=403, detail="Invalid authorization code")
            
        if credentials.scheme != "Bearer":
            raise HTTPException(status_code=403, detail="Invalid authentication scheme")
            
        if not self.verify_jwt(credentials.credentials):
            raise HTTPException(status_code=403, detail="Invalid or expired token")
            
        return credentials.credentials

    def verify_jwt(self, token: str) -> bool:
        """Verify JWT token validity."""
        try:
            # Check if token is blacklisted
            if is_token_blacklisted(token):
                return False
                
            # Verify and decode token
            payload = verify_token(token)
            return payload is not None
            
        except Exception:
            return False


# Create reusable bearer instance
jwt_bearer = JWTBearer()
