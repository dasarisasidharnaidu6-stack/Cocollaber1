"""
Database engine configuration and async session factory.
Supports SQLite (aiosqlite) for lightweight local tests and PostgreSQL (asyncpg) for production.
"""
import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import NullPool, StaticPool

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./cocollaber.db"
)

# Connect arguments and pooling
engine_kwargs = {"echo": False}
if "sqlite" in DATABASE_URL:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
    if ":memory:" in DATABASE_URL:
        engine_kwargs["poolclass"] = StaticPool
else:
    engine_kwargs["pool_pre_ping"] = True

engine = create_async_engine(DATABASE_URL, **engine_kwargs)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db_session():
    """Dependency yielding an async database session."""
    async with AsyncSessionLocal() as session:
        yield session
