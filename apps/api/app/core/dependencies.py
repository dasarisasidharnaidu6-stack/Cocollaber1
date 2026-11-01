"""
FastAPI dependency injection providers: DB session, authenticated member,
permission checker, and resource authorization assertions.
"""

import uuid
from collections.abc import AsyncGenerator
from datetime import UTC, datetime
from typing import Any

from apps.api.app.core.exceptions import AuthenticationError, ForbiddenError
from apps.api.app.core.security import decode_access_token
from apps.api.app.db.models import Account, SessionRecord
from apps.api.app.db.session import get_db_session
from fastapi import Cookie, Depends, Header, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency yielding an async database session."""
    async for session in get_db_session():
        yield session


async def get_current_account(
    request: Request,
    authorization: str | None = Header(None),
    cocol_session: str | None = Cookie(None),
    db: AsyncSession = Depends(get_db),
) -> Account:
    """
    Extracts and authenticates user from Bearer JWT in Authorization header or
    server-side session token in cocol_session cookie.
    """
    account_id: uuid.UUID | None = None

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
        payload = decode_access_token(token)
        if not payload or not payload.get("sub"):
            raise AuthenticationError("Invalid or expired authentication token.")
        try:
            account_id = uuid.UUID(str(payload.get("sub")))
        except (ValueError, TypeError):
            raise AuthenticationError("Malformed token subject.")

    elif cocol_session:
        stmt = select(SessionRecord).where(
            SessionRecord.session_token == cocol_session,
            SessionRecord.expires_at > datetime.now(UTC),
        )
        res = await db.execute(stmt)
        session_rec = res.scalar_one_or_none()
        if not session_rec:
            raise AuthenticationError("Session expired or invalid.")
        account_id = session_rec.account_id

    else:
        raise AuthenticationError("Authentication credentials required.")

    stmt = select(Account).where(Account.id == account_id, Account.deleted_at.is_(None))
    res = await db.execute(stmt)
    account = res.scalar_one_or_none()

    if not account:
        raise AuthenticationError("Account not found or deleted.")

    return account


async def get_current_active_member(
    account: Account = Depends(get_current_account),
) -> Account:
    """Verifies that the authenticated account is active and permitted to transact."""
    if account.status not in ("active", "unverified"):
        raise ForbiddenError("Account is suspended or inactive.")
    return account


def require_roles(*allowed_roles: str):
    """Dependency enforcing role-based access control (RBAC)."""

    async def role_checker(account: Account = Depends(get_current_active_member)) -> Account:
        if account.role not in allowed_roles:
            raise ForbiddenError("Insufficient role permissions.")
        return account

    return role_checker


def assert_opportunity_creator(account_id: uuid.UUID, opp: Any) -> None:
    """Enforces that the current account is the creator of the given opportunity."""
    if opp.creator_id != account_id:
        raise ForbiddenError("You are not the creator of this opportunity.")


def assert_connection_participant(account_id: uuid.UUID, conn: Any) -> None:
    """Enforces that the current account is a verified participant of the connection."""
    if account_id not in (conn.creator_id, conn.seeker_id):
        raise ForbiddenError("You are not a participant in this connection.")
