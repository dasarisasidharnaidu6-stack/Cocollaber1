from apps.api.app.core.config import Settings, settings
from apps.api.app.middleware.csrf import csrf_protection_middleware
from apps.api.app.middleware.error_handler import register_exception_handlers
from apps.api.app.middleware.rate_limit import rate_limit_middleware

# Routers
from apps.api.app.modules.auth.router import router as auth_router
from apps.api.app.modules.discovery.router import router as discovery_router
from apps.api.app.modules.interactions.router import router as interactions_router
from apps.api.app.modules.members.router import router as members_router
from apps.api.app.modules.messaging.router import router as messaging_router
from apps.api.app.modules.moderation.router import router as moderation_router
from apps.api.app.modules.opportunities.router import router as opportunities_router
from apps.api.app.modules.participation.router import router as participation_router
from apps.api.app.schemas.health import HealthResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware


def create_app(custom_settings: Settings | None = None) -> FastAPI:
    """Application factory for CoCollaber API.

    Initializes routers, middlewares, exception handlers, and environment-dependent docs.
    """
    cfg = custom_settings or settings
    is_production = cfg.ENVIRONMENT.strip().lower() in ("production", "prod", "staging")

    application = FastAPI(
        title=cfg.APP_NAME,
        version=cfg.APP_VERSION,
        description="CoCollaber Backend API Service — Global Opportunity & Collaboration Platform",
        docs_url=None if is_production else "/docs",
        redoc_url=None if is_production else "/redoc",
        openapi_url=None if is_production else "/openapi.json",
    )

    # 1. Global Exception Handlers
    register_exception_handlers(application)

    # 2. Security Middlewares (evaluated in reverse order of addition in Starlette)
    application.add_middleware(BaseHTTPMiddleware, dispatch=csrf_protection_middleware)
    application.add_middleware(BaseHTTPMiddleware, dispatch=rate_limit_middleware)

    # 3. CORS Middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=cfg.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 4. Include Domain Routers
    application.include_router(auth_router, prefix=cfg.API_V1_PREFIX)
    application.include_router(members_router, prefix=cfg.API_V1_PREFIX)
    application.include_router(opportunities_router, prefix=cfg.API_V1_PREFIX)
    application.include_router(discovery_router, prefix=cfg.API_V1_PREFIX)
    application.include_router(interactions_router, prefix=cfg.API_V1_PREFIX)
    application.include_router(messaging_router, prefix=cfg.API_V1_PREFIX)
    application.include_router(participation_router, prefix=cfg.API_V1_PREFIX)
    application.include_router(moderation_router, prefix=cfg.API_V1_PREFIX)

    @application.get(
        f"{cfg.API_V1_PREFIX}/health",
        response_model=HealthResponse,
        summary="Health check",
        description="Returns service health status and environment details.",
        tags=["System"],
    )
    async def health_check() -> HealthResponse:
        return HealthResponse(
            status="healthy",
            service="cocollaber-api",
            version=cfg.APP_VERSION,
            environment=cfg.ENVIRONMENT,
        )

    @application.get("/", tags=["System"])
    async def root():
        return {
            "message": "CoCollaber API Foundation",
            "health": f"{cfg.API_V1_PREFIX}/health",
            "docs": None if is_production else "/docs",
        }

    return application


app = create_app()
