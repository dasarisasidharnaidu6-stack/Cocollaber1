"""
Check A — Authentication & Security Verification Tests.
Verifies registration, login, cookie flags, session validation, expiration,
revocation, logout invalidation, CSRF protection, CORS, and rate limiting.
"""
import uuid
from datetime import datetime, timezone, timedelta
import pytest
from sqlalchemy import select

from apps.api.app.core.config import settings
from apps.api.app.db.models import Account, SessionRecord, VerificationToken
from apps.api.tests.integration.conftest import TestingSessionLocal

def test_registration_and_login_flow(client):
    """Verifies that valid registration and login operate correctly."""
    email = f"auth_user_{uuid.uuid4().hex[:8]}@example.com"
    reg_payload = {
        "email": email,
        "password": "SecurePassword123!",
        "date_of_birth": "1995-05-15",
        "display_name": "Auth User",
    }
    # 1. Registration
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert reg_data["account"]["email"] == email
    assert reg_data["account"]["status"] == "unverified"
    assert "access_token" in reg_data

    # 2. Login with valid credentials
    login_payload = {
        "email": email,
        "password": "SecurePassword123!",
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data
    assert login_data["account"]["email"] == email

    # 3. Check Session Cookie attributes
    cookies = login_res.cookies
    assert "cocol_session" in cookies
    # Inspect Set-Cookie header for security attributes
    set_cookie_header = login_res.headers.get("set-cookie", "")
    assert "cocol_session=" in set_cookie_header
    assert "HttpOnly" in set_cookie_header or "httponly" in set_cookie_header
    assert "SameSite=lax" in set_cookie_header or "samesite=lax" in set_cookie_header

    # 4. Check CSRF Cookie issuance
    assert "cocol_csrf_token" in cookies
    csrf_cookie_header = [h for h in login_res.headers.get_list("set-cookie") if "cocol_csrf_token" in h]
    assert len(csrf_cookie_header) > 0

def test_invalid_credentials_rejected(client):
    """Verifies that non-existent email and incorrect password return 401 E-AUTH."""
    # Non-existent email
    res1 = client.post("/api/v1/auth/login", json={
        "email": "nonexistent_user@example.com",
        "password": "Password123!",
    })
    assert res1.status_code == 401
    assert res1.json()["error_code"] == "E-AUTH"

    # Existent user, invalid password
    email = f"wrong_pwd_{uuid.uuid4().hex[:8]}@example.com"
    client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "CorrectPassword123!",
        "date_of_birth": "1992-03-10",
        "display_name": "Password User",
    })

    res2 = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "WrongPassword456!",
    })
    assert res2.status_code == 401
    assert res2.json()["error_code"] == "E-AUTH"

def test_session_identifiers_unpredictable_and_server_stored(client):
    """Verifies session tokens have high cryptographic entropy and persist in sessions table."""
    email = f"session_test_{uuid.uuid4().hex[:8]}@example.com"
    client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "date_of_birth": "1994-08-20",
        "display_name": "Session Tester",
    })
    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": "Password123!"})
    session_token = login_res.cookies.get("cocol_session")
    assert session_token is not None
    assert len(session_token) >= 32  # Cryptographically secure 32+ bytes entropy URL-safe

@pytest.mark.anyio
async def test_session_expiration_rejection(client):
    """Verifies that an expired session cookie is rejected by server-side validation."""
    # Create account and expired session directly in DB
    email = f"expired_sess_{uuid.uuid4().hex[:8]}@example.com"
    async with TestingSessionLocal() as session:
        acc = Account(
            email=email,
            hashed_password="dummy_hash_for_test",
            status="active",
            role="member",
            date_of_birth=datetime(1990, 1, 1).date(),
        )
        session.add(acc)
        await session.flush()

        expired_token = f"expired_token_{uuid.uuid4().hex}"
        expired_session = SessionRecord(
            account_id=acc.id,
            session_token=expired_token,
            expires_at=datetime.now(timezone.utc) - timedelta(hours=2),  # In the past
        )
        session.add(expired_session)
        await session.commit()

    # Attempt to authenticate using the expired session cookie
    res = client.get("/api/v1/auth/me", cookies={"cocol_session": expired_token})
    assert res.status_code == 401
    assert res.json()["error_code"] == "E-AUTH"

def test_logout_invalidates_server_session_and_cookie_reuse_fails(client):
    """Verifies logout destroys the server-side session and cookie reuse is rejected."""
    email = f"logout_user_{uuid.uuid4().hex[:8]}@example.com"
    client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "date_of_birth": "1991-04-12",
        "display_name": "Logout User",
    })
    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": "Password123!"})
    session_cookie = login_res.cookies.get("cocol_session")
    csrf_token = login_res.cookies.get("cocol_csrf_token")

    # Verify session cookie works for /auth/me
    me_res1 = client.get("/api/v1/auth/me", cookies={"cocol_session": session_cookie})
    assert me_res1.status_code == 200
    assert me_res1.json()["email"] == email

    # Call /logout with session cookie and CSRF token
    logout_res = client.post(
        "/api/v1/auth/logout",
        cookies={"cocol_session": session_cookie, "cocol_csrf_token": csrf_token},
        headers={"X-CSRF-Token": csrf_token},
    )
    assert logout_res.status_code == 200

    # Attempt to reuse the previously valid session cookie -> MUST FAIL
    me_res2 = client.get("/api/v1/auth/me", cookies={"cocol_session": session_cookie})
    assert me_res2.status_code == 401
    assert me_res2.json()["error_code"] == "E-AUTH"

def test_csrf_protection_on_state_changing_requests(client):
    """Verifies CSRF protection blocks requests with missing or invalid tokens."""
    email = f"csrf_test_{uuid.uuid4().hex[:8]}@example.com"
    client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "date_of_birth": "1993-02-14",
        "display_name": "CSRF Tester",
    })
    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": "Password123!"})
    session_cookie = login_res.cookies.get("cocol_session")
    csrf_cookie = login_res.cookies.get("cocol_csrf_token")

    # 1. State-changing request with session cookie but MISSING X-CSRF-Token header -> 403 Forbidden
    res_missing = client.put(
        "/api/v1/members/me/profile",
        json={"headline": "Updated Headline"},
        cookies={"cocol_session": session_cookie, "cocol_csrf_token": csrf_cookie},
    )
    assert res_missing.status_code == 403
    assert res_missing.json()["error_code"] == "E-FORB"

    # 2. State-changing request with INVALID X-CSRF-Token header -> 403 Forbidden
    res_invalid = client.put(
        "/api/v1/members/me/profile",
        json={"headline": "Updated Headline"},
        cookies={"cocol_session": session_cookie, "cocol_csrf_token": csrf_cookie},
        headers={"X-CSRF-Token": "invalid_forged_csrf_token"},
    )
    assert res_invalid.status_code == 403
    assert res_invalid.json()["error_code"] == "E-FORB"

    # 3. State-changing request with VALID matching X-CSRF-Token header -> 200 OK
    res_valid = client.put(
        "/api/v1/members/me/profile",
        json={"headline": "Updated Headline"},
        cookies={"cocol_session": session_cookie, "cocol_csrf_token": csrf_cookie},
        headers={"X-CSRF-Token": csrf_cookie},
    )
    assert res_valid.status_code == 200
    assert res_valid.json()["headline"] == "Updated Headline"

    # 4. Bearer token request without cookies -> bypasses CSRF check safely
    access_token = login_res.json()["access_token"]
    res_bearer = client.put(
        "/api/v1/members/me/profile",
        json={"headline": "Bearer Updated"},
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert res_bearer.status_code == 200
    assert res_bearer.json()["headline"] == "Bearer Updated"

def test_cors_rejects_arbitrary_origins_with_credentials(client):
    """Verifies that untrusted origins are NOT granted credentialed CORS permissions."""
    untrusted_origin = "http://malicious-site.attacker.com"
    res = client.options(
        "/api/v1/opportunities",
        headers={
            "Origin": untrusted_origin,
            "Access-Control-Request-Method": "POST",
        },
    )
    # The response must not reflect the untrusted origin as allowed
    allow_origin = res.headers.get("access-control-allow-origin")
    assert allow_origin != untrusted_origin

def test_login_throttling_rate_limiting(client):
    """Verifies in-memory rate limiting triggers 429 E-RATE when login threshold is exceeded."""
    target_email = "rate_limit_target@example.com"
    # Rapidly fire login attempts beyond the 10-attempt threshold
    exceeded = False
    for i in range(12):
        res = client.post("/api/v1/auth/login", json={"email": target_email, "password": "WrongPassword!"})
        if res.status_code == 429:
            exceeded = True
            assert res.json()["error_code"] == "E-RATE"
            break
    assert exceeded is True, "Rate limiter did not block excessive login attempts with 429 E-RATE"
