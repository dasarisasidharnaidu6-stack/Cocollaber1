"""
Database engine configuration and async session factory.
"""
import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://cocollaber_user:cocollaber_dev_password@localhost:5432/cocollaber_db"
)

# Async engine configured for non-blocking I/O
engine = create_async_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db_session():
    """Dependency yielding an async database session."""
    async with AsyncSessionLocal() as session:
        yield session
