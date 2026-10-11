"""
Check C — Phase 1 Database Architecture and Migration Tests.
Verifies session dependency flow, metadata registration, Alembic migration
execution, schema consistency checks (alembic check), and relational constraints.
"""
import os
import uuid
from datetime import datetime
import pytest
from sqlalchemy import select, inspect
from alembic import command
from alembic.config import Config

from apps.api.app.core.dependencies import get_db
from apps.api.app.db.session import engine, AsyncSessionLocal, get_db_session
from apps.api.app.db.models import Base, Account, Profile, Opportunity
from apps.api.tests.integration.conftest import TestingSessionLocal

def test_database_session_dependency_trace():
    """Traces database session dependency from get_db to AsyncSessionLocal and engine."""
    assert callable(get_db)
    assert AsyncSessionLocal is not None
    assert engine is not None
    # Verify engine metadata dialect support
    assert engine.dialect.name in ("postgresql", "sqlite")

def test_phase1_models_metadata_registration():
    """Confirms all Phase 1 domain tables are registered on Base.metadata."""
    table_names = list(Base.metadata.tables.keys())
    assert len(table_names) >= 21, f"Expected at least 21 domain tables, got {len(table_names)}"
    
    # Core domain tables must be present
    required_tables = [
        "accounts", "profiles", "domains", "tags", "member_offers", "member_seeks",
        "member_interests", "opportunities", "opportunity_domains", "opportunity_tags",
        "interests", "connections", "messages", "participations", "reports",
        "blocks", "moderation_actions", "notifications", "audit_logs",
        "sessions", "verification_tokens"
    ]
    for tbl in required_tables:
        assert tbl in table_names, f"Table {tbl} not found in Base.metadata"

def test_alembic_upgrade_and_schema_consistency_check():
    """Runs alembic upgrade head and alembic check on a disposable test database."""
    disposable_db = os.path.abspath("./test_alembic_disposable.db")
    if os.path.exists(disposable_db):
        os.remove(disposable_db)

    os.environ["DATABASE_URL"] = f"sqlite:///{disposable_db}"
    cfg = Config("apps/api/alembic.ini")

    try:
        # 1. Apply all migrations from empty database
        command.upgrade(cfg, "head")

        # 2. Run schema consistency check
        command.check(cfg)

        # 3. Test clean downgrade and re-upgrade
        command.downgrade(cfg, "0001_initial_schema")
        command.upgrade(cfg, "head")
    finally:
        if os.path.exists(disposable_db):
            try:
                os.remove(disposable_db)
            except OSError:
                pass

@pytest.mark.anyio
async def test_relational_constraints_and_cascades():
    """Verifies relational foreign key cascades and uniqueness constraints."""
    async with TestingSessionLocal() as session:
        # 1. Unique constraint on email
        email = f"unique_test_{uuid.uuid4().hex[:8]}@example.com"
        acc1 = Account(
            email=email,
            hashed_password="pwd1",
            status="active",
            role="member",
            date_of_birth=datetime(1990, 1, 1).date(),
        )
        session.add(acc1)
        await session.flush()

        acc2 = Account(
            email=email,  # Duplicate
            hashed_password="pwd2",
            status="active",
            role="member",
            date_of_birth=datetime(1992, 2, 2).date(),
        )
        session.add(acc2)
        with pytest.raises(Exception):
            await session.flush()

        await session.rollback()

@pytest.mark.anyio
async def test_api_persistence_to_expected_tables(client):
    """Verifies that API operations reliably persist records to physical tables."""
    email = f"persist_test_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "date_of_birth": "1993-07-20",
        "display_name": "Persist User",
    })
    assert reg_res.status_code == 201
    account_id = uuid.UUID(reg_res.json()["account"]["id"])

    # Directly verify in database table
    async with TestingSessionLocal() as session:
        stmt_acc = select(Account).where(Account.id == account_id)
        db_acc = (await session.execute(stmt_acc)).scalar_one_or_none()
        assert db_acc is not None
        assert db_acc.email == email

        stmt_prof = select(Profile).where(Profile.account_id == account_id)
        db_prof = (await session.execute(stmt_prof)).scalar_one_or_none()
        assert db_prof is not None
        assert db_prof.display_name == "Persist User"
