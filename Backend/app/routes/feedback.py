# feedback & scoring

from fastapi import APIRouter

router = APIRouter(
    prefix="/feedbacks",
    tags=["feedbacks"]
)

@router.get("/")
async def get_feedbacks():
    return {"message": "Feedbacks list retrieved successfully"}
