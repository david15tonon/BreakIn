"""User service implementation."""
from datetime import datetime
from typing import Optional, List, Dict
from bson import ObjectId
from fastapi import HTTPException, status

from app.services.db import get_db
from app.utils.auth.security_utils import hash_password, verify_password
from app.schemas.users.user_schema import UserCreate, UserUpdate
from app.models.users.user_model import UserModel

class UserService:
    """Service for user-related operations."""
    
    def __init__(self):
        """Initialize the service."""
        self.db = get_db()
        
    async def create_user(self, user_data: UserCreate) -> UserModel:
        """Create a new user."""
        # Check if user exists
        if await self.db.users.find_one({"email": user_data.email}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
            
        if await self.db.users.find_one({"handle": user_data.handle}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Handle already taken"
            )
        
        # Create user dict
        user_dict = user_data.dict()
        user_dict["hashed_password"] = hash_password(user_dict.pop("password"))
        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = user_dict["created_at"]
        
        # Insert user
        result = await self.db.users.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        
        return UserModel(**user_dict)
    
    async def get_user(self, user_id: str) -> Optional[UserModel]:
        """Get user by ID."""
        user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            return UserModel(**user)
        return None
    
    async def get_user_by_email(self, email: str) -> Optional[UserModel]:
        """Get user by email."""
        user = await self.db.users.find_one({"email": email})
        if user:
            return UserModel(**user)
        return None
    
    async def get_user_by_handle(self, handle: str) -> Optional[UserModel]:
        """Get user by handle."""
        user = await self.db.users.find_one({"handle": handle})
        if user:
            return UserModel(**user)
        return None
    
    async def update_user(self, user_id: str, update_data: UserUpdate) -> UserModel:
        """Update user data."""
        # Check user exists
        user = await self.get_user(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Prepare update data
        update_dict = update_data.dict(exclude_unset=True)
        update_dict["updated_at"] = datetime.utcnow()
        
        # Check unique constraints if updating email/handle
        if "email" in update_dict:
            existing = await self.get_user_by_email(update_dict["email"])
            if existing and str(existing.id) != user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
                
        if "handle" in update_dict:
            existing = await self.get_user_by_handle(update_dict["handle"])
            if existing and str(existing.id) != user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Handle already taken"
                )
        
        # Update user
        result = await self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_dict}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Update failed"
            )
        
        return await self.get_user(user_id)
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete a user."""
        result = await self.db.users.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0
    
    async def verify_user(self, user_id: str) -> UserModel:
        """Mark user as verified."""
        result = await self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "is_verified": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification failed"
            )
            
        return await self.get_user(user_id)
    
    async def search_users(
        self,
        query: str,
        skip: int = 0,
        limit: int = 10
    ) -> List[UserModel]:
        """Search users by name or handle."""
        cursor = self.db.users.find(
            {
                "$or": [
                    {"full_name": {"$regex": query, "$options": "i"}},
                    {"handle": {"$regex": query, "$options": "i"}}
                ]
            }
        ).skip(skip).limit(limit)
        
        users = []
        async for user in cursor:
            users.append(UserModel(**user))
            
        return users
    
    async def update_last_login(self, user_id: str) -> None:
        """Update user's last login timestamp."""
        await self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "last_login": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
    async def increment_failed_login(self, user_id: str) -> Dict:
        """Increment failed login attempts."""
        result = await self.db.users.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {
                "$inc": {"failed_login_attempts": 1},
                "$set": {
                    "last_failed_login": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            },
            return_document=True
        )
        return result
    
    async def reset_failed_login(self, user_id: str) -> None:
        """Reset failed login attempts."""
        await self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "failed_login_attempts": 0,
                    "last_failed_login": None,
                    "account_locked_until": None,
                    "updated_at": datetime.utcnow()
                }
            }
        )
