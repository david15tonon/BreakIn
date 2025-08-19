# Entry point for the FastAPI application

from fastapi import FastAPI
from app.routes import auth, sprint, feedback

app = FastAPI(title="BreakIn Backend", version="1.0")

# Inclure les routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(sprint.router, prefix="/sprint", tags=["Sprint"])
app.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])

@app.get("/")
def root():
    return {"message": "Backend BreakIn API running 🚀"}
