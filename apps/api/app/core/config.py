import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "CoCollaber API"
    APP_VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "t")

settings = Settings()
