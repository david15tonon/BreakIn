from fastapi import APIRouter, HTTPException
from app.config import db
from pydantic import BaseModel
import uuid
from datetime import datetime
from typing import List, Optional

router = APIRouter()

# 📦 Modèles Pydantic
class SprintStart(BaseModel):
    user_id: str
    theme: str
    duration_minutes: int = 60  # Durée par défaut

class TaskSubmit(BaseModel):
    sprint_id: str
    user_id: str
    task: str
    solution: str

class Task(BaseModel):
    task: str
    solution: str
    submitted_at: datetime

class Sprint(BaseModel):
    _id: str
    user_id: str
    theme: str
    tasks: List[Task] = []
    created_at: datetime
    duration_minutes: int
    status: str  # "active", "completed", "cancelled"

# 🚀 Démarrer un nouveau sprint
@router.post("/start")
def start_sprint(data: SprintStart):
    sprint_id = str(uuid.uuid4())
    new_sprint = {
        "_id": sprint_id,
        "user_id": data.user_id,
        "theme": data.theme,
        "tasks": [],
        "created_at": datetime.now(),  # ⚠️ Corrigé: datetime.now() au lieu de datetime
        "duration_minutes": data.duration_minutes,
        "status": "active"
    }
    
    try:
        result = db.sprints.insert_one(new_sprint)
        if result.inserted_id:
            return {
                "message": "Sprint started successfully", 
                "sprint_id": sprint_id,
                "theme": data.theme,
                "duration": data.duration_minutes
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to create sprint")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# ✅ Soumettre une tâche
@router.post("/submit-task")
def submit_task(data: TaskSubmit):
    # Vérifier si le sprint existe et appartient à l'utilisateur
    sprint = db.sprints.find_one({"_id": data.sprint_id, "user_id": data.user_id})
    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found or access denied")
    
    # Vérifier si le sprint est actif
    if sprint.get("status") != "active":
        raise HTTPException(status_code=400, detail="Sprint is not active")
    
    task_entry = {
        "task": data.task,
        "solution": data.solution,
        "submitted_at": datetime.now()  # ⚠️ Corrigé: datetime.now()
    }
    
    try:
        result = db.sprints.update_one(
            {"_id": data.sprint_id, "user_id": data.user_id},
            {"$push": {"tasks": task_entry}}
        )
        
        if result.modified_count == 1:
            return {
                "message": "Task submitted successfully", 
                "task": data.task,
                "sprint_id": data.sprint_id
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to submit task")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# 📋 Récupérer un sprint
@router.get("/{sprint_id}")
def get_sprint(sprint_id: str, user_id: str):
    sprint = db.sprints.find_one({"_id": sprint_id, "user_id": user_id})
    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")
    
    return sprint

# 📝 Lister tous les sprints d'un utilisateur
@router.get("/user/{user_id}")
def list_user_sprints(user_id: str, status: Optional[str] = None):
    query = {"user_id": user_id}
    if status:
        query["status"] = status
    
    sprints = list(db.sprints.find(query).sort("created_at", -1))
    
    # Convertir ObjectId en string pour la sérialisation JSON
    for sprint in sprints:
        sprint["_id"] = str(sprint["_id"])
    
    return {"sprints": sprints, "count": len(sprints)}

# ⏹️ Terminer un sprint
@router.post("/{sprint_id}/complete")
def complete_sprint(sprint_id: str, user_id: str):
    result = db.sprints.update_one(
        {"_id": sprint_id, "user_id": user_id},
        {"$set": {"status": "completed", "completed_at": datetime.now()}}
    )
    
    if result.modified_count == 1:
        return {"message": "Sprint completed successfully"}
    else:
        raise HTTPException(status_code=404, detail="Sprint not found or already completed")

# ❌ Annuler un sprint
@router.post("/{sprint_id}/cancel")
def cancel_sprint(sprint_id: str, user_id: str):
    result = db.sprints.update_one(
        {"_id": sprint_id, "user_id": user_id},
        {"$set": {"status": "cancelled", "cancelled_at": datetime.now()}}
    )
    
    if result.modified_count == 1:
        return {"message": "Sprint cancelled successfully"}
    else:
        raise HTTPException(status_code=404, detail="Sprint not found or already cancelled")