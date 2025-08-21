from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, EmailStr
from app.config import db
from typing import Optional
import uuid
import bcrypt

router = APIRouter()

# 📦 Modèles Pydantic
class UserSignup(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8, max_length=128)

class UserOut(BaseModel):
    username: str
    email: EmailStr
    pseudonym: str# app/routes/auth.py
class UserSignin(BaseModel):
    # Changer username -> email
    email: EmailStr  # ou str si vous préférez
    password: str



# 🔐 Signup avec hash du mot de passe
@router.post("/signup", response_model=UserOut)
def signup(user: UserSignup):
    if db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_pw = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    pseudonym = f"user-{uuid.uuid4().hex[:6]}"
    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_pw,
        "pseudonym": pseudonym
    }
    db.users.insert_one(new_user)
    return UserOut(**new_user)

@router.post("/signin")
def signin(credentials: UserSignin):
    # Chercher par email au lieu de username
    user = db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Vérification du mot de passe hashé
    if not bcrypt.checkpw(credentials.password.encode(), user["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return JSONResponse(content={"message": "Signed in successfully", "token": "jwt_token"})

# 🔍 Lecture d’un utilisateur par pseudonyme
@router.get("/user/{pseudonym}", response_model=UserOut)
def get_user(pseudonym: str):
    user = db.users.find_one({"pseudonym": pseudonym})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(**user)

# ✏️ Mise à jour dynamique
@router.put("/user/{pseudonym}")
def update_user(pseudonym: str, update: UserUpdate):
    update_data = {k: v for k, v in update.dict().items() if v is not None}

    if "password" in update_data:
        update_data["password"] = bcrypt.hashpw(update_data["password"].encode(), bcrypt.gensalt()).decode()

    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    result = db.users.update_one({"pseudonym": pseudonym}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User updated"}

# 🗑️ Suppression
@router.delete("/user/{pseudonym}")
def delete_user(pseudonym: str):
    result = db.users.delete_one({"pseudonym": pseudonym})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

# 📋 Liste des utilisateurs
@router.get("/users", response_model=list[UserOut])
def list_users():
    users = list(db.users.find())
    return [UserOut(**user) for user in users]
