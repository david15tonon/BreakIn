"""Routes for candidate match visibility and preferences."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/candidate/{candidate_id}/visibility/{company_id}")
async def update_visibility(
    candidate_id: str,
    company_id: str,
    visible: bool,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update candidate visibility for a company.
    
    Args:
        candidate_id: Candidate ID
        company_id: Company ID
        visible: Whether to allow matching
        db: Database connection
        current_user: Authenticated user
    """
    # Verify candidate access
    if current_user["id"] != candidate_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update visibility for this candidate"
        )
        
    # Update visibility
    await db.candidate_privacy.update_one(
        {
            "candidate_id": candidate_id,
            "company_id": company_id
        },
        {
            "$set": {
                "visible": visible,
                "updated_at": datetime.utcnow()
            }
        },
        upsert=True
    )
    
    return {"status": "success"}
    
@router.get("/candidate/{candidate_id}/matched-companies")
async def get_matched_companies(
    candidate_id: str,
    status: Optional[str] = None,
    limit: int = 20,
    skip: int = 0,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get companies matched with a candidate.
    
    Args:
        candidate_id: Candidate ID
        status: Filter by match status
        limit: Page size
        skip: Offset
        db: Database connection
        current_user: Authenticated user
        
    Returns:
        List of matched companies
    """
    # Verify candidate access
    if current_user["id"] != candidate_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view matches for this candidate"
        )
        
    # Build query
    query = {"candidate_id": candidate_id}
    if status:
        query["status"] = status
        
    # Get recommendations
    cursor = db.recommendations.find(query)
    cursor = cursor.sort("created_at", -1).skip(skip).limit(limit)
    matches = await cursor.to_list(length=limit)
    
    # Get company details
    company_ids = [m["company_id"] for m in matches]
    companies = await db.companies.find(
        {"_id": {"$in": company_ids}},
        {"name": 1, "logo_url": 1}
    ).to_list(length=len(company_ids))
    
    company_map = {c["_id"]: c for c in companies}
    
    # Combine data
    results = []
    for match in matches:
        company = company_map.get(match["company_id"], {})
        results.append({
            "company_id": match["company_id"],
            "company_name": company.get("name"),
            "company_logo": company.get("logo_url"),
            "match_score": match["scores"]["final_score"],
            "match_status": match["status"],
            "matched_at": match["created_at"]
        })
        
    return results
    
@router.post("/candidate/{candidate_id}/opt-out/{company_id}")
async def opt_out_from_company(
    candidate_id: str,
    company_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Opt-out from matching with a company.
    
    Args:
        candidate_id: Candidate ID
        company_id: Company ID
        db: Database connection
        current_user: Authenticated user
    """
    # Verify candidate access
    if current_user["id"] != candidate_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update preferences for this candidate"
        )
        
    # Add to blocked list
    await db.candidates.update_one(
        {"_id": candidate_id},
        {"$addToSet": {"blocked_companies": company_id}}
    )
    
    # Update any active recommendations
    await db.recommendations.update_many(
        {
            "candidate_id": candidate_id,
            "company_id": company_id,
            "status": {"$in": ["pending", "viewed"]}
        },
        {"$set": {"status": "opted_out"}}
    )
    
    return {"status": "success"}
    
@router.delete("/candidate/{candidate_id}/opt-out/{company_id}")
async def remove_opt_out(
    candidate_id: str,
    company_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Remove company opt-out.
    
    Args:
        candidate_id: Candidate ID
        company_id: Company ID
        db: Database connection
        current_user: Authenticated user
    """
    # Verify candidate access
    if current_user["id"] != candidate_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update preferences for this candidate"
        )
        
    # Remove from blocked list
    await db.candidates.update_one(
        {"_id": candidate_id},
        {"$pull": {"blocked_companies": company_id}}
    )
    
    return {"status": "success"}
