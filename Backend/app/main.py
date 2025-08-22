# Entry point for the FastAPI application

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.routes import auth, sprint, feedback
from app.routes.auth import router as auth_router

### for gpt5-evaluator
from app.evaluator import evaluate_team_llm
from app.sample_data import example_team  # optional test data

##$$#$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

app = FastAPI(title="BreakIn Backend", version="1.0")

# Load allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://breakin-demo.vercel.app",  # vercel demo
        "http://localhost:3000",            # local dev
        "http://localhost:3001",           
    ],
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


###******************************************************************************
@app.get("/gpt5")
def root():
    return {"message": "Welcome to AI Team Evaluator API"}

@app.post("/evaluate")
def evaluate_team(team_data: dict):
    """Accept JSON input and return LLM evaluation."""
    return evaluate_team_llm(team_data)

@app.get("/test")
def test_eval():
    return evaluate_team_llm(example_team)
#######**************************************************************************8

#test for logging
from pydantic import BaseModel, EmailStr
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str


@app.post("/auth/signup")
async def signup(user: UserSignup):
    print(user.dict())

