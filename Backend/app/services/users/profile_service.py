"""Profile service implementation."""
from datetime import datetime
from typing import Optional, List, Dict
from bson import ObjectId
from fastapi import HTTPException, status

from app.services.db import get_db
from app.schemas.users.profile_schema import ProfileCreate, ProfileUpdate, SocialLinkCreate
from app.models.users.profile_model import ProfileModel

class ProfileService:
    """Service for profile-related operations."""
    
    def __init__(self):
        """Initialize the service."""
        self.db = get_db()
    
    async def create_profile(self, user_id: str, profile_data: ProfileCreate) -> ProfileModel:
        """Create a new profile."""
        # Check if profile exists
        if await self.db.profiles.find_one({"user_id": ObjectId(user_id)}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Profile already exists"
            )
        
        # Create profile dict
        profile_dict = profile_data.dict()
        profile_dict["user_id"] = ObjectId(user_id)
        profile_dict["created_at"] = datetime.utcnow()
        profile_dict["updated_at"] = profile_dict["created_at"]
        profile_dict["completion_score"] = await self._calculate_completion_score(profile_dict)
        
        # Insert profile
        result = await self.db.profiles.insert_one(profile_dict)
        profile_dict["_id"] = result.inserted_id
        
        return ProfileModel(**profile_dict)
    
    async def get_profile(self, user_id: str) -> Optional[ProfileModel]:
        """Get profile by user ID."""
        profile = await self.db.profiles.find_one({"user_id": ObjectId(user_id)})
        if profile:
            return ProfileModel(**profile)
        return None
    
    async def update_profile(
        self,
        user_id: str,
        update_data: ProfileUpdate
    ) -> ProfileModel:
        """Update profile data."""
        # Check profile exists
        profile = await self.get_profile(user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        # Prepare update data
        update_dict = update_data.dict(exclude_unset=True)
        update_dict["updated_at"] = datetime.utcnow()
        
        if "social_links" in update_dict:
            update_dict["social_links"] = [
                link.dict() for link in update_data.social_links
            ]
        
        # Calculate new completion score
        current_data = profile.dict()
        current_data.update(update_dict)
        update_dict["completion_score"] = await self._calculate_completion_score(current_data)
        
        # Update profile
        result = await self.db.profiles.update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": update_dict}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Update failed"
            )
        
        return await self.get_profile(user_id)
    
    async def add_social_link(
        self,
        user_id: str,
        link_data: SocialLinkCreate
    ) -> ProfileModel:
        """Add a social link to profile."""
        profile = await self.get_profile(user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        # Check if platform already exists
        for link in profile.social_links:
            if link.platform == link_data.platform:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Platform {link_data.platform} already exists"
                )
        
        # Add link
        result = await self.db.profiles.update_one(
            {"user_id": ObjectId(user_id)},
            {
                "$push": {"social_links": link_data.dict()},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to add social link"
            )
        
        return await self.get_profile(user_id)
    
    async def remove_social_link(self, user_id: str, platform: str) -> ProfileModel:
        """Remove a social link from profile."""
        result = await self.db.profiles.update_one(
            {"user_id": ObjectId(user_id)},
            {
                "$pull": {"social_links": {"platform": platform}},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to remove social link"
            )
        
        return await self.get_profile(user_id)
    
    async def update_avatar(self, user_id: str, avatar_url: str) -> ProfileModel:
        """Update profile avatar URL."""
        result = await self.db.profiles.update_one(
            {"user_id": ObjectId(user_id)},
            {
                "$set": {
                    "avatar_url": avatar_url,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update avatar"
            )
        
        return await self.get_profile(user_id)
    
    async def _calculate_completion_score(self, profile_data: Dict) -> int:
        """Calculate profile completion score."""
        score = 0
        completed_sections = []
        
        # Basic info (30%)
        if profile_data.get("bio"):
            score += 15
            completed_sections.append("bio")
        if profile_data.get("tagline"):
            score += 5
            completed_sections.append("tagline")
        if profile_data.get("location"):
            score += 5
            completed_sections.append("location")
        if profile_data.get("avatar_url"):
            score += 5
            completed_sections.append("avatar")
            
        # Professional info (40%)
        if profile_data.get("company"):
            score += 10
            completed_sections.append("company")
        if profile_data.get("title"):
            score += 10
            completed_sections.append("title")
        if profile_data.get("years_of_experience"):
            score += 10
            completed_sections.append("experience")
        if profile_data.get("website"):
            score += 10
            completed_sections.append("website")
            
        # Social links (30%)
        social_links = profile_data.get("social_links", [])
        if social_links:
            score += min(len(social_links) * 10, 30)
            completed_sections.append("social")
            
        # Update completed sections
        await self.db.profiles.update_one(
            {"user_id": profile_data.get("user_id")},
            {"$set": {"completed_sections": completed_sections}}
        )
        
        return score
