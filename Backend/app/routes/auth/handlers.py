"""Authentication route handlers."""

from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional

from app.schemas.auth.schemas import (
    Token, UserLogin, UserSignup, PasswordReset,
    PasswordResetConfirm, PasswordChange
)
from app.services.auth.jwt_service import (
    create_access_token, blacklist_token
)
from app.utils.auth.security_utils import (
    hash_password, verify_password,
    generate_password_reset_token, verify_password_reset_token
)
from app.utils.auth.middleware import jwt_bearer
from app.models import User
from app.services.db import get_db

router = APIRouter()
db = get_db()

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    """Handle user login."""
    user = await db.users.find_one({"email": form_data.username})
    
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
        
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "email": user["email"]}
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer"
    )

@router.post("/signup")
async def signup(user_data: UserSignup) -> dict:
    """Handle user registration."""
    # Check if user already exists
    if await db.users.find_one({"email": user_data.email}):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    user_dict = user_data.dict()
    user_dict["password"] = hashed_password
    
    result = await db.users.insert_one(user_dict)
    
    return {
        "message": "User created successfully",
        "user_id": str(result.inserted_id)
    }

@router.post("/logout")
async def logout(
    token: str = Depends(jwt_bearer),
    session_id: Optional[str] = Cookie(None)
) -> dict:
    """Handle user logout."""
    blacklist_token(token)
    
    response = Response(content={"message": "Logged out successfully"})
    response.delete_cookie("session_id")
    
    return response

@router.post("/password-reset")
async def request_password_reset(reset_data: PasswordReset) -> dict:
    """Request password reset."""
    user = await db.users.find_one({"email": reset_data.email})
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    reset_token = generate_password_reset_token(reset_data.email)
    
    # TODO: Send reset token via email
    
    return {"message": "Password reset instructions sent"}

@router.post("/password-reset/confirm")
async def confirm_password_reset(reset_data: PasswordResetConfirm) -> dict:
    """Confirm password reset."""
    email = verify_password_reset_token(reset_data.token)
    
    if not email:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token"
        )
    
    hashed_password = hash_password(reset_data.new_password)
    
    await db.users.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}}
    )
    
    return {"message": "Password updated successfully"}

@router.post("/password-change")
async def change_password(
    password_data: PasswordChange,
    token: str = Depends(jwt_bearer)
) -> dict:
    """Change user password."""
    # Verify current password
    user = await db.users.find_one({"_id": token["sub"]})
    
    if not user or not verify_password(
        password_data.current_password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Current password is incorrect"
        )
    
    # Update password
    hashed_password = hash_password(password_data.new_password)
    
    await db.users.update_one(
        {"_id": token["sub"]},
        {"$set": {"password": hashed_password}}
    )
    
    return {"message": "Password changed successfully"}
