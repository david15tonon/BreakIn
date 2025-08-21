# Entry point for the FastAPI application

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.routes import auth, sprint, feedback
from app.routes.auth import router as auth_router

app = FastAPI(title="BreakIn Backend", version="1.0")

# Load allowed origins from .env
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Inclure les routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(sprint.router, prefix="/sprint", tags=["Sprint"])
app.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])

@app.get("/")
def root():
    return {"message": "Backend BreakIn API running 🚀"}


#test for logging
from pydantic import BaseModel, EmailStr
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str


@app.post("/auth/signup")
async def signup(user: UserSignup):
    print(user.dict())

