"""
Integration and Regression Tests for CoCollaber Domain APIs.
Covers Opportunity CRUD & Compensation Transparency, Member Profiles (Offers/Seeks),
Discovery & Search Filters, and Moderation Actions.
"""
import uuid
from datetime import datetime, timezone
import pytest
from sqlalchemy import select

from apps.api.app.db.models import (
    Account, Profile, Opportunity, Domain, Tag, Report, Block, MemberOffer, MemberSeek
)
from apps.api.app.core.security import create_access_token
from apps.api.tests.integration.conftest import TestingSessionLocal


@pytest.fixture
async def regression_test_data():
    """Sets up a test domain, tags, standard member, and staff moderator."""
    async with TestingSessionLocal() as session:
        # Standard Member
        member = Account(
            email=f"reg_member_{uuid.uuid4().hex[:8]}@example.com",
            hashed_password="hashed_reg_pwd",
            status="active",
            role="member",
            date_of_birth=datetime(1995, 5, 15).date(),
        )
        session.add(member)
        await session.flush()

        member_profile = Profile(
            account_id=member.id,
            display_name="Dev Tester",
            headline="Full Stack Engineer",
            bio="Building collaborative systems",
            location_text="Secret Lab 101",
            is_location_public=False,
        )
        session.add(member_profile)

        # Staff Moderator
        staff = Account(
            email=f"reg_moderator_{uuid.uuid4().hex[:8]}@example.com",
            hashed_password="hashed_staff_pwd",
            status="active",
            role="moderator",
            date_of_birth=datetime(1988, 8, 20).date(),
        )
        session.add(staff)
        await session.flush()

        staff_profile = Profile(
            account_id=staff.id,
            display_name="Staff Moderator",
            location_text="Moderation HQ",
            is_location_public=True,
        )
        session.add(staff_profile)

        # Domain and Tag
        domain_unique_suffix = uuid.uuid4().hex[:6]
        domain = Domain(
            id=uuid.uuid4(),
            name=f"Engineering {domain_unique_suffix}",
            slug=f"engineering-{domain_unique_suffix}",
            is_active=True,
        )
        session.add(domain)

        tag = Tag(
            id=uuid.uuid4(),
            name=f"tag_{uuid.uuid4().hex[:6]}",
        )
        session.add(tag)

        await session.commit()

        token_member = create_access_token({"sub": str(member.id), "role": member.role})
        token_staff = create_access_token({"sub": str(staff.id), "role": staff.role})

        return {
            "member_id": member.id,
            "staff_id": staff.id,
            "token_member": token_member,
            "token_staff": token_staff,
            "domain_id": domain.id,
            "domain_name": domain.name,
            "tag_id": tag.id,
            "tag_name": tag.name,
        }


@pytest.mark.anyio
async def test_opportunity_validation_and_lifecycle(client, regression_test_data):
    """Verifies opportunity compensation validation, creation, listing, updating, and closure."""
    data = regression_test_data
    auth_headers = {"Authorization": f"Bearer {data['token_member']}"}

    # 1. Invalid compensation type should be rejected
    invalid_comp_payload = {
        "title": "Invalid Compensation Opportunity",
        "description": "This opportunity has an illegal compensation type value.",
        "opportunity_type": "collaboration",
        "compensation_type": "equity_only",  # Not in CompensationType enum
        "compensation_details": "Shares in startup",
        "is_remote": True,
    }
    inv_res = client.post("/api/v1/opportunities", json=invalid_comp_payload, headers=auth_headers)
    assert inv_res.status_code == 400
    assert inv_res.json()["error_code"] == "E-VAL"

    # 2. Valid opportunity creation
    valid_payload = {
        "title": "Build Distributed Consensus Engine",
        "description": "High performance Raft consensus protocol in Python and Rust with async I/O.",
        "opportunity_type": "collaboration",
        "compensation_type": "paid",
        "compensation_details": "$4,000 Milestone Grant",
        "is_remote": True,
        "location_text": "Remote worldwide",
    }
    create_res = client.post("/api/v1/opportunities", json=valid_payload, headers=auth_headers)
    assert create_res.status_code == 201
    created_opp = create_res.json()
    opp_id = created_opp["id"]
    assert created_opp["title"] == valid_payload["title"]
    assert created_opp["status"] == "open"
    assert created_opp["compensation_type"] == "paid"

    # 3. Read single opportunity
    get_res = client.get(f"/api/v1/opportunities/{opp_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == opp_id

    # 4. List opportunities with filter
    list_res = client.get("/api/v1/opportunities?compensation_type=paid&is_remote=true")
    assert list_res.status_code == 200
    list_body = list_res.json()
    assert "items" in list_body
    assert list_body["total"] >= 1
    assert any(item["id"] == opp_id for item in list_body["items"])

    # 5. Update opportunity
    update_payload = {"title": "Build Distributed Consensus Engine (Updated)"}
    update_res = client.put(f"/api/v1/opportunities/{opp_id}", json=update_payload, headers=auth_headers)
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Build Distributed Consensus Engine (Updated)"

    # 6. Delete opportunity (soft-delete / close)
    del_res = client.delete(f"/api/v1/opportunities/{opp_id}", headers=auth_headers)
    assert del_res.status_code == 200

    # 7. Subsequent retrieval should return 404
    get_after_del = client.get(f"/api/v1/opportunities/{opp_id}")
    assert get_after_del.status_code == 404


@pytest.mark.anyio
async def test_member_profile_and_fluid_identities(client, regression_test_data):
    """Verifies profile update, multiple offers/seeks management, and public visibility rules."""
    data = regression_test_data
    auth_headers = {"Authorization": f"Bearer {data['token_member']}"}

    # 1. Fetch own profile
    me_res = client.get("/api/v1/members/me/profile", headers=auth_headers)
    assert me_res.status_code == 200
    assert me_res.json()["display_name"] == "Dev Tester"

    # 2. Add an Offer
    offer_payload = {
        "title": "Async Python Architecture",
        "description": "Design high concurrency asyncio and FastAPI systems",
    }
    offer_res = client.post("/api/v1/members/me/offers", json=offer_payload, headers=auth_headers)
    assert offer_res.status_code == 201
    offer_id = offer_res.json()["id"]

    # 3. Add a Seek
    seek_payload = {
        "title": "Distributed Consensus Reviewer",
        "description": "Looking for peer reviews of Raft protocol implementation",
    }
    seek_res = client.post("/api/v1/members/me/seeks", json=seek_payload, headers=auth_headers)
    assert seek_res.status_code == 201
    seek_id = seek_res.json()["id"]

    # 4. Check profile now reflects added offer and seek
    updated_me = client.get("/api/v1/members/me/profile", headers=auth_headers)
    assert updated_me.status_code == 200
    body = updated_me.json()
    assert len(body["offers"]) >= 1
    assert len(body["seeks"]) >= 1

    # 5. Public profile access: verify location_text is redacted when private
    pub_res = client.get(f"/api/v1/members/{data['member_id']}/profile")
    assert pub_res.status_code == 200
    assert pub_res.json()["location_text"] is None

    # 6. Delete Offer and Seek
    del_offer_res = client.delete(f"/api/v1/members/me/offers/{offer_id}", headers=auth_headers)
    assert del_offer_res.status_code == 200
    del_seek_res = client.delete(f"/api/v1/members/me/seeks/{seek_id}", headers=auth_headers)
    assert del_seek_res.status_code == 200

    # 7. Re-deleting already deleted offer returns 404
    del_again = client.delete(f"/api/v1/members/me/offers/{offer_id}", headers=auth_headers)
    assert del_again.status_code == 404


@pytest.mark.anyio
async def test_discovery_search_and_taxonomies(client, regression_test_data):
    """Verifies taxonomy exploration and keyword search matching."""
    data = regression_test_data

    # 1. Domains list
    domains_res = client.get("/api/v1/discovery/domains")
    assert domains_res.status_code == 200
    domains = domains_res.json()
    assert any(d["name"] == data["domain_name"] for d in domains)

    # 2. Tags list
    tags_res = client.get("/api/v1/discovery/tags")
    assert tags_res.status_code == 200
    tags = tags_res.json()
    assert any(t["name"] == data["tag_name"] for t in tags)

    # 3. Search opportunities endpoint with query
    search_res = client.get("/api/v1/discovery/search?q=consensus&page=1&per_page=10")
    assert search_res.status_code == 200
    assert "items" in search_res.json()

    # 4. Boundary query parameters
    bad_page = client.get("/api/v1/discovery/search?page=0")
    assert bad_page.status_code == 422


@pytest.mark.anyio
async def test_moderation_reporting_and_staff_actions(client, regression_test_data):
    """Verifies report creation, staff-only RBAC protection, and moderation action execution."""
    data = regression_test_data
    member_headers = {"Authorization": f"Bearer {data['token_member']}"}
    staff_headers = {"Authorization": f"Bearer {data['token_staff']}"}

    # 1. Standard member creates an opportunity to report
    opp_payload = {
        "title": "Suspicious Opportunity",
        "description": "Contains spammy promotional links violating guidelines.",
        "opportunity_type": "mentorship",
        "compensation_type": "unpaid",
        "is_remote": True,
    }
    create_res = client.post("/api/v1/opportunities", json=opp_payload, headers=member_headers)
    opp_id = create_res.json()["id"]

    # 2. Member submits a moderation report
    report_payload = {
        "target_type": "opportunity",
        "target_id": opp_id,
        "reason_code": "spam",
        "details": "Spam promotional text",
    }
    rep_res = client.post("/api/v1/moderation/reports", json=report_payload, headers=member_headers)
    assert rep_res.status_code == 201
    report_id = rep_res.json()["id"]
    assert rep_res.json()["status"] == "pending"

    # 3. Standard member tries to list reports -> 403 Forbidden
    unauth_list = client.get("/api/v1/moderation/reports", headers=member_headers)
    assert unauth_list.status_code == 403

    # 4. Staff moderator lists pending reports -> 200 OK
    staff_list = client.get("/api/v1/moderation/reports", headers=staff_headers)
    assert staff_list.status_code == 200
    reports = staff_list.json()
    assert any(r["id"] == report_id for r in reports)

    # 5. Staff moderator takes action to remove content
    action_payload = {
        "action_type": "remove_content",
        "notes": "Verified spam; content removed per community guidelines.",
    }
    action_res = client.post(f"/api/v1/moderation/reports/{report_id}/act", json=action_payload, headers=staff_headers)
    assert action_res.status_code == 200
    assert "recorded successfully" in action_res.json()["message"]

    # 6. Verify target opportunity status changed to "removed"
    async with TestingSessionLocal() as session:
        stmt = select(Opportunity).where(Opportunity.id == uuid.UUID(opp_id))
        opp = (await session.execute(stmt)).scalar_one_or_none()
        assert opp is not None
        assert opp.status == "removed"

    # 7. Self-blocking prohibition
    block_self = client.post(f"/api/v1/moderation/blocks/{data['member_id']}", headers=member_headers)
    assert block_self.status_code == 400
    assert block_self.json()["error_code"] == "E-VAL"
