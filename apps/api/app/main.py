from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from apps.api.app.core.config import settings
from apps.api.app.schemas.health import HealthResponse
from apps.api.app.middleware.csrf import csrf_protection_middleware
from apps.api.app.middleware.rate_limit import rate_limit_middleware
from apps.api.app.middleware.error_handler import register_exception_handlers

# Routers
from apps.api.app.modules.auth.router import router as auth_router
from apps.api.app.modules.members.router import router as members_router
from apps.api.app.modules.opportunities.router import router as opportunities_router
from apps.api.app.modules.discovery.router import router as discovery_router
from apps.api.app.modules.interactions.router import router as interactions_router
from apps.api.app.modules.messaging.router import router as messaging_router
from apps.api.app.modules.participation.router import router as participation_router
from apps.api.app.modules.moderation.router import router as moderation_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="CoCollaber Backend API Service — Global Opportunity & Collaboration Platform",
    docs_url="/docs",
    redoc_url="/redoc",
)

# 1. Global Exception Handlers
register_exception_handlers(app)

# 2. Security Middlewares (evaluated in reverse order of addition in Starlette)
app.add_middleware(BaseHTTPMiddleware, dispatch=csrf_protection_middleware)
app.add_middleware(BaseHTTPMiddleware, dispatch=rate_limit_middleware)

# 3. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Include Domain Routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(members_router, prefix=settings.API_V1_PREFIX)
app.include_router(opportunities_router, prefix=settings.API_V1_PREFIX)
app.include_router(discovery_router, prefix=settings.API_V1_PREFIX)
app.include_router(interactions_router, prefix=settings.API_V1_PREFIX)
app.include_router(messaging_router, prefix=settings.API_V1_PREFIX)
app.include_router(participation_router, prefix=settings.API_V1_PREFIX)
app.include_router(moderation_router, prefix=settings.API_V1_PREFIX)

@app.get(
    f"{settings.API_V1_PREFIX}/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns service health status and environment details.",
    tags=["System"],
)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="healthy",
        service="cocollaber-api",
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
    )

@app.get("/", tags=["System"])
async def root():
    return {
        "message": "CoCollaber API Foundation",
        "health": f"{settings.API_V1_PREFIX}/health",
        "docs": "/docs",
    }
