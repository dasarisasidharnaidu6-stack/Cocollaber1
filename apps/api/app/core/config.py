import os

from pydantic import BaseModel, model_validator


class Settings(BaseModel):
    APP_NAME: str = "CoCollaber API"
    APP_VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "t")

    # Security & Tokens
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "insecure_development_secret_key_change_in_production"
    )
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    SESSION_EXPIRE_DAYS: int = int(os.getenv("SESSION_EXPIRE_DAYS", "30"))
    EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS: int = int(
        os.getenv("EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS", "24")
    )

    # CORS
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
        ).split(",")
        if origin.strip()
    ]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.strip().lower() in ("production", "prod", "staging")

    @model_validator(mode="after")
    def validate_production_security(self) -> "Settings":
        if self.is_production:
            if self.DEBUG:
                raise ValueError(
                    "DEBUG must be set to False in production, prod, and staging environments."
                )
            clean_secret = self.SECRET_KEY.strip() if self.SECRET_KEY else ""
            if not clean_secret:
                raise ValueError(
                    "SECRET_KEY must not be empty or whitespace in production, prod, and staging environments."
                )
            if clean_secret == "insecure_development_secret_key_change_in_production":
                raise ValueError(
                    "SECRET_KEY must not use the insecure development placeholder in production, prod, and staging environments."
                )
            if len(clean_secret) < 32:
                raise ValueError(
                    "SECRET_KEY must contain at least 32 characters in production, prod, and staging environments."
                )
        return self


settings = Settings()
