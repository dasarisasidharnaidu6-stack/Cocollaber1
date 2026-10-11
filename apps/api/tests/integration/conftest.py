"""
Shared Integration Test Fixtures for Phase 2 Verification Gate.
Sets up an isolated database and configured TestClient.
"""
import os
import asyncio
import pytest
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from fastapi.testclient import TestClient

from apps.api.app.main import app
from apps.api.app.db.base import Base
from apps.api.app.core.dependencies import get_db

TEST_DB_PATH = os.path.abspath("./test_integration_gate.db")
TEST_DB_URL = f"sqlite+aiosqlite:///{TEST_DB_PATH}"

test_engine = create_async_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
    echo=False,
)
TestingSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

@pytest.fixture
def anyio_backend():
    return "asyncio"

@pytest.fixture(scope="session", autouse=True)
def initialize_database():
    """Initializes the isolated test database schema before all integration tests."""
    async def init_models():
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)

    asyncio.run(init_models())
    yield
    async def cleanup_models():
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
        await test_engine.dispose()

    asyncio.run(cleanup_models())
    if os.path.exists(TEST_DB_PATH):
        try:
            os.remove(TEST_DB_PATH)
        except OSError:
            pass

@pytest.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Yields an isolated async session for database verifications."""
    async with TestingSessionLocal() as session:
        yield session

@pytest.fixture
def client():
    """Provides a TestClient with overridden get_db dependency."""
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        async with TestingSessionLocal() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
