"""Service for handling privacy and anonymization in matching."""
from typing import Dict, Optional
from datetime import datetime
import hashlib
import base64
from motor.motor_asyncio import AsyncIOMotorDatabase

class PrivacyService:
    """Service for managing privacy and reveal rules."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        """Initialize privacy service.
        
        Args:
            db: Database connection
        """
        self.db = db
        self._anon_cache = {}  # Cache for anonymous handles
        
    async def get_anonymous_handle(self,
                                 candidate_id: str,
                                 company_id: str) -> str:
        """Get anonymous handle for a candidate.
        
        Args:
            candidate_id: Candidate ID
            company_id: Company ID
            
        Returns:
            Anonymous handle (e.g., "anon_X9")
        """
        cache_key = f"{candidate_id}:{company_id}"
        if cache_key in self._anon_cache:
            return self._anon_cache[cache_key]
            
        # Generate deterministic but random-looking handle
        seed = f"{candidate_id}:{company_id}:{datetime.utcnow().date()}"
        hash_val = hashlib.sha256(seed.encode()).digest()
        b64 = base64.b32encode(hash_val[:3]).decode()
        handle = f"anon_{b64[:2]}"
        
        self._anon_cache[cache_key] = handle
        return handle
        
    async def can_reveal_details(self,
                               candidate_id: str,
                               company_id: str) -> bool:
        """Check if candidate details can be revealed.
        
        Args:
            candidate_id: Candidate ID
            company_id: Company ID
            
        Returns:
            Whether details can be revealed
        """
        # Check opt-in status
        opt_in = await self.db.candidate_privacy.find_one({
            "candidate_id": candidate_id,
            "company_id": company_id,
            "opted_in": True
        })
        if opt_in:
            return True
            
        # Check if interview flow started
        interview = await self.db.interviews.find_one({
            "candidate_id": candidate_id,
            "company_id": company_id,
            "status": {"$in": ["scheduled", "completed"]}
        })
        if interview:
            return True
            
        return False
        
    async def get_revealed_profile(self,
                                 candidate_id: str,
                                 company_id: str) -> Optional[Dict]:
        """Get revealed candidate profile if allowed.
        
        Args:
            candidate_id: Candidate ID
            company_id: Company ID
            
        Returns:
            Revealed profile or None if not allowed
        """
        if not await self.can_reveal_details(candidate_id, company_id):
            return None
            
        # Get full profile
        profile = await self.db.candidates.find_one({"_id": candidate_id})
        if not profile:
            return None
            
        # Remove sensitive fields
        revealed = {
            "id": profile["_id"],
            "name": profile.get("name"),
            "email": profile.get("email"),
            "location": profile.get("location"),
            "timezone": profile.get("timezone"),
            "skills": profile.get("skills", []),
            "experience": profile.get("experience", []),
            "bio": profile.get("bio"),
            "avatar_url": profile.get("avatar_url"),
            "github_url": profile.get("github_url"),
            "linkedin_url": profile.get("linkedin_url")
        }
        
        return revealed
        
    async def opt_in_to_company(self,
                              candidate_id: str,
                              company_id: str) -> None:
        """Opt-in to reveal details to a company.
        
        Args:
            candidate_id: Candidate ID
            company_id: Company ID
        """
        await self.db.candidate_privacy.update_one(
            {
                "candidate_id": candidate_id,
                "company_id": company_id
            },
            {
                "$set": {
                    "opted_in": True,
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
    async def opt_out_from_company(self,
                                 candidate_id: str,
                                 company_id: str) -> None:
        """Opt-out from revealing details to a company.
        
        Args:
            candidate_id: Candidate ID
            company_id: Company ID
        """
        await self.db.candidate_privacy.update_one(
            {
                "candidate_id": candidate_id,
                "company_id": company_id
            },
            {
                "$set": {
                    "opted_in": False,
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
    async def get_company_reveal_history(self,
                                       company_id: str) -> Dict[str, datetime]:
        """Get history of candidate reveals for a company.
        
        Args:
            company_id: Company ID
            
        Returns:
            Dict mapping candidate IDs to reveal timestamps
        """
        cursor = self.db.candidate_privacy.find({
            "company_id": company_id,
            "opted_in": True
        })
        
        reveals = {}
        async for doc in cursor:
            reveals[doc["candidate_id"]] = doc["updated_at"]
            
        return reveals
        
    async def get_candidate_reveal_history(self,
                                         candidate_id: str) -> Dict[str, datetime]:
        """Get history of company reveals for a candidate.
        
        Args:
            candidate_id: Candidate ID
            
        Returns:
            Dict mapping company IDs to reveal timestamps
        """
        cursor = self.db.candidate_privacy.find({
            "candidate_id": candidate_id,
            "opted_in": True
        })
        
        reveals = {}
        async for doc in cursor:
            reveals[doc["company_id"]] = doc["updated_at"]
            
        return reveals
