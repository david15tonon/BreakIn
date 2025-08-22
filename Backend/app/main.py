def root():
"""FastAPI application entrypoint for BreakIn backend.

This file creates and configures the FastAPI app, registers routers, and
manages lifecycle events (startup/shutdown).
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
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


@app.on_event("shutdown")
async def on_shutdown():
    logger.info("Shutting down — closing DB connections")
    close_mongodb_connection()


