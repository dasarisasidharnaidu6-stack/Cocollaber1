"""Auth Module Router."""
import uuid
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from apps.api.app.core.dependencies import get_db, get_current_account
from apps.api.app.core.security import (
    hash_password, verify_password, create_access_token,
    generate_session_token, generate_verification_token
)
from apps.api.app.core.exceptions import (
    ValidationError, AuthenticationError, ConflictError, NotFoundError
)
from apps.api.app.core.config import settings
from apps.api.app.db.models import Account, Profile, SessionRecord, VerificationToken
from apps.api.app.modules.auth.schemas import (
    RegisterRequest, LoginRequest, VerifyEmailRequest, AuthResponse, AccountResponse
)
from apps.api.app.schemas.common import MessageResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check minimum age >= 18
    today = date_today = datetime.now(timezone.utc).date()
    age = today.year - payload.date_of_birth.year - (
        (today.month, today.day) < (payload.date_of_birth.month, payload.date_of_birth.day)
    )
    if age < 18:
        raise ValidationError("Account registration requires age 18 or older.")

    # Check email duplicate
    stmt = select(Account).where(Account.email == payload.email.lower())
    res = await db.execute(stmt)
    if res.scalar_one_or_none():
        raise ConflictError("An account with this email address already exists.")

    # Create account
    account = Account(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        date_of_birth=payload.date_of_birth,
        status="unverified",
        role="member",
        account_type="person",
    )
    db.add(account)
    await db.flush()

    # Create initial profile
    profile = Profile(
        account_id=account.id,
        display_name=payload.display_name,
    )
    db.add(profile)

    # Create verification token (24h lifespan)
    v_token_str = generate_verification_token()
    v_token = VerificationToken(
        account_id=account.id,
        token=v_token_str,
        token_type="email_verification",
        expires_at=datetime.now(timezone.utc) + timedelta(hours=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS),
    )
    db.add(v_token)

    # Issue access token
    access_token = create_access_token({"sub": str(account.id), "role": account.role})

    await db.commit()
    await db.refresh(account)

    return AuthResponse(
        account=AccountResponse.model_validate(account),
        access_token=access_token,
        verification_token=v_token_str if settings.DEBUG else None
    )

@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    stmt = select(Account).where(Account.email == payload.email.lower(), Account.deleted_at.is_(None))
    res = await db.execute(stmt)
    account = res.scalar_one_or_none()

    if not account or not verify_password(account.hashed_password, payload.password):
        raise AuthenticationError("Invalid email or password.")

    # Create server-side session
    session_token = generate_session_token()
    session_rec = SessionRecord(
        account_id=account.id,
        session_token=session_token,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.SESSION_EXPIRE_DAYS),
    )
    db.add(session_rec)

    # Issue JWT access token
    access_token = create_access_token({"sub": str(account.id), "role": account.role})

    # Set secure HttpOnly session cookie
    response.set_cookie(
        key="cocol_session",
        value=session_token,
        httponly=True,
        samesite="lax",
        secure=not settings.DEBUG,
        max_age=settings.SESSION_EXPIRE_DAYS * 86400,
        path="/",
    )

    # Issue CSRF double-submit token for cookie sessions
    csrf_token = generate_session_token()
    response.set_cookie(
        key="cocol_csrf_token",
        value=csrf_token,
        httponly=False,
        samesite="lax",
        secure=not settings.DEBUG,
        max_age=settings.SESSION_EXPIRE_DAYS * 86400,
        path="/",
    )

    await db.commit()
    await db.refresh(account)

    return AuthResponse(
        account=AccountResponse.model_validate(account),
        access_token=access_token,
    )

@router.post("/logout", response_model=MessageResponse)
async def logout(response: Response, account: Account = Depends(get_current_account), db: AsyncSession = Depends(get_db)):
    # Invalidate session records for account
    stmt = select(SessionRecord).where(SessionRecord.account_id == account.id)
    res = await db.execute(stmt)
    sessions = res.scalars().all()
    for s in sessions:
        await db.delete(s)

    response.delete_cookie(key="cocol_session", path="/")
    response.delete_cookie(key="cocol_csrf_token", path="/")
    await db.commit()
    return MessageResponse(message="Successfully logged out.")

@router.get("/me", response_model=AccountResponse)
async def get_me(account: Account = Depends(get_current_account)):
    return AccountResponse.model_validate(account)

@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(payload: VerifyEmailRequest, db: AsyncSession = Depends(get_db)):
    stmt = select(VerificationToken).where(
        VerificationToken.token == payload.token,
        VerificationToken.token_type == "email_verification",
        VerificationToken.used_at.is_(None)
    )
    res = await db.execute(stmt)
    v_token = res.scalar_one_or_none()

    if not v_token:
        raise NotFoundError("Verification token invalid or already used.")

    if v_token.expires_at < datetime.now(timezone.utc):
        raise ValidationError("Verification token has expired. Please request a new one.")

    v_token.used_at = datetime.now(timezone.utc)

    # Activate account
    stmt_acc = select(Account).where(Account.id == v_token.account_id)
    res_acc = await db.execute(stmt_acc)
    account = res_acc.scalar_one_or_none()
    if account:
        account.status = "active"
        account.email_verified_at = datetime.now(timezone.utc)

    await db.commit()
    return MessageResponse(message="Email verified successfully. Account is now active.")
