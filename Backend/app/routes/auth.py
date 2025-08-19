from fastapi import APIRouter
from app.config import db
from pydantic import BaseModel
import uuid

router = APIRouter()

class UserSignup(BaseModel):
    username: str

@router.post("/signup")
def signup(user: UserSignup):
    pseudonym = f"user-{uuid.uuid4().hex[:6]}"
    new_user = {"username": user.username, "pseudonym": pseudonym}
    db.users.insert_one(new_user)
    return {"message": "User created", "pseudonym": pseudonym}
