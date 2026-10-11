"""
Check B — Authorization and Ownership Verification Tests.
Verifies multi-user role boundaries, object-level authorization (ABAC),
ownership invariants, IDOR prevention, impersonation blocking, and public read.
"""
import uuid
from datetime import datetime, timezone
import pytest
from sqlalchemy import select

from apps.api.app.db.models import (
    Account, Profile, Opportunity, Connection, Interest, Message, MemberOffer, MemberSeek
)
from apps.api.tests.integration.conftest import TestingSessionLocal

@pytest.fixture
async def setup_users_and_resources():
    """Sets up User A, User B, User C, Opp A, and Conn A."""
    async with TestingSessionLocal() as session:
        # User A (Creator)
        user_a = Account(
            email=f"user_a_{uuid.uuid4().hex[:8]}@example.com",
            hashed_password="hashed_pwd_a",
            status="active",
            role="member",
            date_of_birth=datetime(1990, 1, 1).date(),
        )
        session.add(user_a)
        await session.flush()

        profile_a = Profile(
            account_id=user_a.id,
            display_name="Alice Creator",
            location_text="Confidential Address 456",
            is_location_public=False,  # Private location
        )
        session.add(profile_a)
        await session.flush()

        offer_a = MemberOffer(
            profile_id=profile_a.id,
            title="Alice's Offer",
            description="Alice provides backend design",
            display_order=0,
        )
        seek_a = MemberSeek(
            profile_id=profile_a.id,
            title="Alice's Seek",
            description="Alice seeks frontend design",
            display_order=0,
        )
        session.add_all([offer_a, seek_a])

        # User B (Attacker / Unrelated Member)
        user_b = Account(
            email=f"user_b_{uuid.uuid4().hex[:8]}@example.com",
            hashed_password="hashed_pwd_b",
            status="active",
            role="member",
            date_of_birth=datetime(1992, 2, 2).date(),
        )
        session.add(user_b)
        await session.flush()

        profile_b = Profile(
            account_id=user_b.id,
            display_name="Bob Unauthorized",
            location_text="Public Street 789",
            is_location_public=True,
        )
        session.add(profile_b)

        # User C (Legitimate Partner of Alice)
        user_c = Account(
            email=f"user_c_{uuid.uuid4().hex[:8]}@example.com",
            hashed_password="hashed_pwd_c",
            status="active",
            role="member",
            date_of_birth=datetime(1993, 3, 3).date(),
        )
        session.add(user_c)
        await session.flush()

        # Opp A (owned by Alice)
        opp_a = Opportunity(
            creator_id=user_a.id,
            title="Original Title by Alice",
            description="Detailed opportunity description that meets the length requirements.",
            opportunity_type="collaboration",
            status="open",
            compensation_type="paid",
            compensation_details="$5000 project grant",
            is_remote=True,
        )
        session.add(opp_a)
        await session.flush()

        # Interest & Connection between Alice and User C
        interest_c = Interest(
            opportunity_id=opp_a.id,
            seeker_id=user_c.id,
            message="User C expressed interest",
            status="accepted",
        )
        session.add(interest_c)
        await session.flush()

        conn_a = Connection(
            opportunity_id=opp_a.id,
            interest_id=interest_c.id,
            creator_id=user_a.id,
            seeker_id=user_c.id,
            status="active",
        )
        session.add(conn_a)
        await session.flush()

        msg_c = Message(
            connection_id=conn_a.id,
            sender_id=user_a.id,
            content="Private message between Alice and Charlie",
            is_read=False,
        )
        session.add(msg_c)

        await session.commit()

        # Issue JWT tokens for A and B
        from apps.api.app.core.security import create_access_token
        token_a = create_access_token({"sub": str(user_a.id), "role": user_a.role})
        token_b = create_access_token({"sub": str(user_b.id), "role": user_b.role})

        return {
            "user_a_id": user_a.id,
            "user_b_id": user_b.id,
            "user_c_id": user_c.id,
            "token_a": token_a,
            "token_b": token_b,
            "opp_a_id": opp_a.id,
            "conn_a_id": conn_a.id,
            "offer_a_id": offer_a.id,
            "seek_a_id": seek_a.id,
            "interest_c_id": interest_c.id,
        }

@pytest.mark.anyio
async def test_user_b_cannot_read_user_a_private_data(client, setup_users_and_resources):
    """Verifies User B cannot access User A's private profile location or connection thread."""
    data = setup_users_and_resources
    token_b = data["token_b"]

    # 1. Profile location redaction
    prof_res = client.get(f"/api/v1/members/{data['user_a_id']}/profile")
    assert prof_res.status_code == 200
    assert prof_res.json()["location_text"] is None, "Private location must be redacted to null"

    # 2. Private connection access
    conn_res = client.get(
        f"/api/v1/connections/{data['conn_a_id']}",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert conn_res.status_code == 403
    assert conn_res.json()["error_code"] == "E-FORB"

    # 3. Private messages access
    msg_res = client.get(
        f"/api/v1/connections/{data['conn_a_id']}/messages",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert msg_res.status_code == 403
    assert msg_res.json()["error_code"] == "E-FORB"

@pytest.mark.anyio
async def test_user_b_cannot_update_user_a_opportunity(client, setup_users_and_resources):
    """Verifies User B cannot update User A's opportunity and DB state remains unchanged."""
    data = setup_users_and_resources
    token_b = data["token_b"]
    opp_a_id = data["opp_a_id"]

    # User B attempts update
    update_res = client.put(
        f"/api/v1/opportunities/{opp_a_id}",
        json={"title": "Hacked Title by User B"},
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert update_res.status_code == 403
    assert update_res.json()["error_code"] == "E-FORB"

    # Verify Database state remains pristine
    async with TestingSessionLocal() as session:
        stmt = select(Opportunity).where(Opportunity.id == opp_a_id)
        opp = (await session.execute(stmt)).scalar_one()
        assert opp.title == "Original Title by Alice"
        assert opp.creator_id == data["user_a_id"]

@pytest.mark.anyio
async def test_user_b_cannot_delete_user_a_opportunity(client, setup_users_and_resources):
    """Verifies User B cannot delete User A's opportunity and DB state remains open."""
    data = setup_users_and_resources
    token_b = data["token_b"]
    opp_a_id = data["opp_a_id"]

    delete_res = client.delete(
        f"/api/v1/opportunities/{opp_a_id}",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert delete_res.status_code == 403
    assert delete_res.json()["error_code"] == "E-FORB"

    # Verify Database state is not deleted
    async with TestingSessionLocal() as session:
        stmt = select(Opportunity).where(Opportunity.id == opp_a_id)
        opp = (await session.execute(stmt)).scalar_one()
        assert opp.deleted_at is None
        assert opp.status == "open"

@pytest.mark.anyio
async def test_user_b_cannot_change_opportunity_owner_or_impersonate(client, setup_users_and_resources):
    """Verifies creator_id cannot be overwritten or impersonated via request payload."""
    data = setup_users_and_resources
    token_b = data["token_b"]

    # 1. Attempt to inject creator_id when creating opportunity as User B
    create_res = client.post(
        "/api/v1/opportunities",
        json={
            "title": "Opportunity Attempting Impersonation",
            "description": "This opportunity attempts to set creator_id to User A.",
            "compensation_type": "paid",
            "creator_id": str(data["user_a_id"]),  # Impersonation attempt
        },
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert create_res.status_code == 201
    created_opp_id = uuid.UUID(create_res.json()["id"])

    # Verify in DB: creator_id MUST be User B, NOT User A
    async with TestingSessionLocal() as session:
        stmt = select(Opportunity).where(Opportunity.id == created_opp_id)
        opp = (await session.execute(stmt)).scalar_one()
        assert opp.creator_id == data["user_b_id"]
        assert opp.creator_id != data["user_a_id"]

@pytest.mark.anyio
async def test_user_b_cannot_access_user_a_connections_or_cross_resources(client, setup_users_and_resources):
    """Verifies User B cannot list User A's private connections or mutate User A's profile items."""
    data = setup_users_and_resources
    token_b = data["token_b"]

    # 1. List connections as User B -> User A's connection is NOT returned
    list_conn_res = client.get("/api/v1/connections", headers={"Authorization": f"Bearer {token_b}"})
    assert list_conn_res.status_code == 200
    conn_ids = [c["id"] for c in list_conn_res.json()]
    assert str(data["conn_a_id"]) not in conn_ids

    # 2. User B attempts to delete User A's offer -> 404 / denied
    del_offer_res = client.delete(
        f"/api/v1/members/me/offers/{data['offer_a_id']}",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert del_offer_res.status_code == 404

    # 3. User B attempts to delete User A's seek -> 404 / denied
    del_seek_res = client.delete(
        f"/api/v1/members/me/seeks/{data['seek_a_id']}",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert del_seek_res.status_code == 404

    # 4. User B attempts to view User A's opportunity interests -> 403 Forbidden
    opp_interests_res = client.get(
        f"/api/v1/opportunities/{data['opp_a_id']}/interests",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert opp_interests_res.status_code == 403

    # 5. User B attempts to respond to interest on User A's opportunity -> 403 Forbidden
    respond_res = client.post(
        f"/api/v1/interests/{data['interest_c_id']}/respond",
        json={"action": "accept"},
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert respond_res.status_code == 403

@pytest.mark.anyio
async def test_legitimate_owner_and_public_read_operations(client, setup_users_and_resources):
    """Verifies authorized owner operations succeed and public read is permitted."""
    data = setup_users_and_resources
    token_a = data["token_a"]
    opp_a_id = data["opp_a_id"]

    # 1. Anonymous visitor can read public opportunity
    anon_res = client.get(f"/api/v1/opportunities/{opp_a_id}")
    assert anon_res.status_code == 200
    assert anon_res.json()["title"] == "Original Title by Alice"

    # 2. User A (Owner) can update opportunity
    update_res = client.put(
        f"/api/v1/opportunities/{opp_a_id}",
        json={"title": "Legitimately Updated Title by Alice"},
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Legitimately Updated Title by Alice"

    # 3. User A can delete (close) own opportunity
    delete_res = client.delete(
        f"/api/v1/opportunities/{opp_a_id}",
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert delete_res.status_code == 200

    # Verify DB state
    async with TestingSessionLocal() as session:
        stmt = select(Opportunity).where(Opportunity.id == opp_a_id)
        opp = (await session.execute(stmt)).scalar_one()
        assert opp.deleted_at is not None
        assert opp.status == "closed"
