"""Health check endpoints and Prometheus metrics."""

import time
from datetime import datetime
import psutil
from fastapi import APIRouter, Depends
from prometheus_client import (
    generate_latest,
    CONTENT_TYPE_LATEST,
    Counter, Gauge, Histogram
)
from fastapi.responses import Response
from pymongo.database import Database

from app.dependencies import get_db
from app.config import settings

router = APIRouter()

# Prometheus metrics
REQUESTS = Counter('breakin_http_requests_total', 'Total HTTP requests')
DB_LATENCY = Histogram('breakin_db_latency_seconds', 'MongoDB operation latency')
MEMORY_USAGE = Gauge('breakin_memory_usage_bytes', 'Memory usage in bytes')
CPU_USAGE = Gauge('breakin_cpu_usage_percent', 'CPU usage percentage')

# Track application start time
START_TIME = datetime.now()


@router.get("/healthz")
async def health_check(db: Database = Depends(get_db)):
    """Basic health check endpoint."""
    REQUESTS.inc()

    # Check DB connection
    db_status = "up"
    db_latency = 0
    try:
        start = time.time()
        db.command("ping")
        db_latency = time.time() - start
        DB_LATENCY.observe(db_latency)
    except Exception:
        db_status = "down"

    # System metrics
    memory = psutil.Process().memory_info()
    MEMORY_USAGE.set(memory.rss)
    CPU_USAGE.set(psutil.cpu_percent())

    return {
        "status": "healthy" if db_status == "up" else "unhealthy",
        "timestamp": datetime.now().isoformat(),
        "uptime_seconds": (datetime.now() - START_TIME).total_seconds(),
        "version": "1.0.0",  # TODO: derive from package version
        "services": {
            "database": {
                "status": db_status,
                "latency_ms": round(db_latency * 1000, 2)
            }
        },
        "system": {
            "memory_used_mb": round(memory.rss / 1024 / 1024, 2),
            "cpu_percent": psutil.cpu_percent()
        }
    }


@router.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint."""
    REQUESTS.inc()
    return Response(
        generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )
