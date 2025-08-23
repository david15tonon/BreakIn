"""Router aggregator for matching routes."""
from fastapi import APIRouter

from app.routes.matching.matching_routes import router as match_router
from app.routes.matching.company_profile_routes import router as company_profile_router
from app.routes.matching.candidate_routes import router as candidate_router
from app.routes.matching.watchlist_routes import router as watchlist_router
from app.routes.matching.shortlist_routes import router as shortlist_router
from app.routes.matching.feedback_routes import router as feedback_router
from app.routes.matching.policy_routes import router as policy_router
from app.routes.matching.admin_matching_routes import router as admin_router
from app.routes.matching.analytics_routes import router as analytics_router
from app.routes.matching.events_routes import router as events_router
from app.routes.matching.compatibility_routes import router as compatibility_router

router = APIRouter(prefix="/matching", tags=["matching"])

# Core matching routes
router.include_router(match_router)

# Company profile management
router.include_router(company_profile_router)

# Candidate controls
router.include_router(candidate_router)

# Watchlists and shortlists
router.include_router(watchlist_router)
router.include_router(shortlist_router)

# Feedback and compatibility
router.include_router(feedback_router)
router.include_router(compatibility_router)

# Policy and admin
router.include_router(policy_router)
router.include_router(admin_router)

# Analytics and events
router.include_router(analytics_router)
router.include_router(events_router)
