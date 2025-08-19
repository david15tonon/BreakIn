# missions

from fastapi import APIRouter

router = APIRouter(
    prefix="/sprints",
    tags=["sprints"]
)

@router.get("/")
async def get_sprints():
    return {"message": "Sprints list retrieved successfully"}
