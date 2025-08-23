def root():
"""FastAPI application entrypoint for BreakIn backend.

This file creates and configures the FastAPI app, registers routers, and
manages lifecycle events (startup/shutdown).
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from app.routes import auth, sprint, feedback,evaluation  # Ajoutez evaluation

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
app.include_router(evaluation.router, prefix="/evaluation", tags=["Evaluation"])

@app.get("/")
def root():
    return {"message": "Backend BreakIn API running 🚀"}
=======
from fastapi.responses import JSONResponse
import logging

from app.config import settings, connect_to_mongodb, close_mongodb_connection 
from app.routes import auth, sprint, feedback, health
from app.logging_config import configure_logging
from fastapi.exceptions import HTTPException as StarletteHTTPException
from fastapi import HTTPException
from app.exceptions import ServiceUnavailable

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(title="BreakIn Backend", version="1.0")

    # CORS
    origins = [str(o) for o in settings.ALLOWED_ORIGINS]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routers
    app.include_router(auth.router, prefix="/auth", tags=["Auth"])
    app.include_router(sprint.router, prefix="/sprint", tags=["Sprint"])
    app.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])
    app.include_router(health.router, prefix="/health", tags=["Health"])

    # Generic exception handler
    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.exception("Unhandled exception: %s", exc)
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        # Re-raise known HTTP exceptions with JSON response
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.get("/")
    async def root():
        return {"message": "Backend BreakIn API running 🚀"}

    return app


app = create_app()


@app.on_event("startup")
async def on_startup():
    configure_logging(settings.LOG_LEVEL)
    logger.info("Starting BreakIn backend — connecting to services")
    ok = connect_to_mongodb()
    if not ok:
        logger.error("MongoDB connection failed during startup")
        # If DB is required for startup, raise a 503 to fail fast
        raise ServiceUnavailable("MongoDB not reachable")

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

@app.on_event("shutdown")
async def on_shutdown():
    logger.info("Shutting down — closing DB connections")
    close_mongodb_connection()


