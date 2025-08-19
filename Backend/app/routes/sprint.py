from fastapi import APIRouter
from app.config import db
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()

class SprintStart(BaseModel):
    user_id: str
    theme: str

class TaskSubmit(BaseModel):
    sprint_id: str
    user_id: str
    task: str
    solution: str

@router.post("/start")
def start_sprint(data: SprintStart):
    sprint_id = str(uuid.uuid4())
    new_sprint = {
        "_id": sprint_id,
        "user_id": data.user_id,
        "theme": data.theme,
        "tasks": [],
        "created_at": datetime.utcnow()
    }
    db.sprints.insert_one(new_sprint)
    return {"message": "Sprint started", "sprint_id": sprint_id}

@router.post("/submit-task")
def submit_task(data: TaskSubmit):
    task_entry = {
        "task": data.task,
        "solution": data.solution,
        "submitted_at": datetime.utcnow()
    }
    db.sprints.update_one(
        {"_id": data.sprint_id, "user_id": data.user_id},
        {"$push": {"tasks": task_entry}}
    )
    return {"message": "Task submitted", "task": task_entry}
