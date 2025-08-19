from fastapi import APIRouter
from app.config import db
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class FeedbackSubmit(BaseModel):
    sprint_id: str
    user_id: str
    score: int
    comment: str

@router.post("/submit")
def submit_feedback(data: FeedbackSubmit):
    feedback_entry = {
        "sprint_id": data.sprint_id,
        "user_id": data.user_id,
        "score": data.score,
        "comment": data.comment,
        "submitted_at": datetime.utcnow()
    }
    db.feedback.insert_one(feedback_entry)
    return {"message": "Feedback submitted", "feedback": feedback_entry}
