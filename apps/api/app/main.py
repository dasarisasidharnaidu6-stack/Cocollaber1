from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.api.app.core.config import settings
from apps.api.app.schemas.health import HealthResponse

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="CoCollaber Backend API Service - Phase 0 Foundation",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
