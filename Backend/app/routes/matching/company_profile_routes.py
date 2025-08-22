"""Routes for managing company match profiles."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.matching.company_schema import (
    CompanyPreferences,
    CompanyMatchSettings,
    CultureTag
)
from app.dependencies import get_db, get_current_user

router = APIRouter()

@router.get("/company/{company_id}/preferences")
async def get_company_preferences(
    company_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get matching preferences for a company.
    
    Args:
        company_id: Company ID
        db: Database connection
        current_user: Authenticated user
        
    Returns:
        Company preferences
    """
    # Verify company access
    if current_user["company_id"] != company_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view preferences for this company"
        )
        
    # Get preferences
    prefs = await db.company_preferences.find_one({"company_id": company_id})
    if not prefs:
        return CompanyPreferences()  # Return defaults
        
    return CompanyPreferences(**prefs)
    
@router.put("/company/{company_id}/preferences")
async def update_company_preferences(
    company_id: str,
    preferences: CompanyPreferences,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update matching preferences for a company.
    
    Args:
        company_id: Company ID
        preferences: New preferences
        db: Database connection
        current_user: Authenticated user
        
    Returns:
        Updated preferences
    """
    # Verify company access
    if current_user["company_id"] != company_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update preferences for this company"
        )
        
    # Update preferences
    await db.company_preferences.update_one(
        {"company_id": company_id},
        {"$set": preferences.dict()},
        upsert=True
    )
    
    return preferences
    
@router.get("/company/{company_id}/culture-tags")
async def get_company_culture_tags(
    company_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get culture tags for a company.
    
    Args:
        company_id: Company ID
        db: Database connection
        
    Returns:
        List of culture tags
    """
    # Get tags
    doc = await db.company_preferences.find_one(
        {"company_id": company_id},
        {"culture_tags": 1}
    )
    
    if not doc or "culture_tags" not in doc:
        return []
        
    return [CultureTag(**tag) for tag in doc["culture_tags"]]
    
@router.put("/company/{company_id}/culture-tags")
async def update_company_culture_tags(
    company_id: str,
    tags: List[CultureTag],
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update culture tags for a company.
    
    Args:
        company_id: Company ID
        tags: New culture tags
        db: Database connection
        current_user: Authenticated user
        
    Returns:
        Updated tags
    """
    # Verify company access
    if current_user["company_id"] != company_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update culture tags for this company"
        )
        
    # Update tags
    await db.company_preferences.update_one(
        {"company_id": company_id},
        {"$set": {"culture_tags": [t.dict() for t in tags]}},
        upsert=True
    )
    
    return tags
    
@router.get("/company/{company_id}/match-settings")
async def get_company_match_settings(
    company_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get match settings for a company.
    
    Args:
        company_id: Company ID
        db: Database connection
        current_user: Authenticated user
        
    Returns:
        Company match settings
    """
    # Verify company access
    if current_user["company_id"] != company_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view settings for this company"
        )
        
    # Get settings
    settings = await db.company_settings.find_one({"company_id": company_id})
    if not settings:
        return CompanyMatchSettings(preferences=CompanyPreferences())
        
    return CompanyMatchSettings(**settings)
    
@router.put("/company/{company_id}/match-settings")
async def update_company_match_settings(
    company_id: str,
    settings: CompanyMatchSettings,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update match settings for a company.
    
    Args:
        company_id: Company ID
        settings: New settings
        db: Database connection
        current_user: Authenticated user
        
    Returns:
        Updated settings
    """
    # Verify company access
    if current_user["company_id"] != company_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update settings for this company"
        )
        
    # Update settings
    await db.company_settings.update_one(
        {"company_id": company_id},
        {"$set": settings.dict()},
        upsert=True
    )
    
    return settings
