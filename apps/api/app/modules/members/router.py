"""Members Module Router."""
import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from apps.api.app.core.dependencies import get_db, get_current_account, get_current_active_member
from apps.api.app.core.exceptions import NotFoundError, ValidationError
from apps.api.app.core.constants import MAX_OFFERS_COUNT, MAX_SEEKS_COUNT
from apps.api.app.db.models import Profile, MemberOffer, MemberSeek, Account
from apps.api.app.modules.members.schemas import (
    ProfileUpdate, ProfileResponse, OfferCreate, OfferResponse, SeekCreate, SeekResponse
)
from apps.api.app.schemas.common import MessageResponse

router = APIRouter(prefix="/members", tags=["Members & Profiles"])

@router.get("/me/profile", response_model=ProfileResponse)
async def get_my_profile(account: Account = Depends(get_current_account), db: AsyncSession = Depends(get_db)):
    stmt = select(Profile).where(Profile.account_id == account.id).options(
        selectinload(Profile.offers),
        selectinload(Profile.seeks),
    )
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    if not profile:
        raise NotFoundError("Profile not found.")
    return profile

@router.put("/me/profile", response_model=ProfileResponse)
async def update_my_profile(payload: ProfileUpdate, account: Account = Depends(get_current_account), db: AsyncSession = Depends(get_db)):
    stmt = select(Profile).where(Profile.account_id == account.id).options(
        selectinload(Profile.offers),
        selectinload(Profile.seeks),
    )
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    if not profile:
        raise NotFoundError("Profile not found.")

    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, val)

    await db.commit()
    await db.refresh(profile)
    return profile

@router.post("/me/offers", response_model=OfferResponse, status_code=status.HTTP_201_CREATED)
async def add_offer(payload: OfferCreate, account: Account = Depends(get_current_active_member), db: AsyncSession = Depends(get_db)):
    stmt = select(Profile).where(Profile.account_id == account.id).options(selectinload(Profile.offers))
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    if not profile:
        raise NotFoundError("Profile not found.")

    if len(profile.offers) >= MAX_OFFERS_COUNT:
        raise ValidationError(f"Maximum limit of {MAX_OFFERS_COUNT} offers reached.")

    offer = MemberOffer(
        profile_id=profile.id,
        title=payload.title,
        description=payload.description,
        display_order=len(profile.offers)
    )
    db.add(offer)
    await db.commit()
    await db.refresh(offer)
    return offer

@router.delete("/me/offers/{offer_id}", response_model=MessageResponse)
async def delete_offer(offer_id: uuid.UUID, account: Account = Depends(get_current_account), db: AsyncSession = Depends(get_db)):
    stmt = select(MemberOffer).join(Profile).where(
        MemberOffer.id == offer_id,
        Profile.account_id == account.id
    )
    res = await db.execute(stmt)
    offer = res.scalar_one_or_none()
    if not offer:
        raise NotFoundError("Offer not found or not owned by you.")
    await db.delete(offer)
    await db.commit()
    return MessageResponse(message="Offer deleted successfully.")

@router.post("/me/seeks", response_model=SeekResponse, status_code=status.HTTP_201_CREATED)
async def add_seek(payload: SeekCreate, account: Account = Depends(get_current_active_member), db: AsyncSession = Depends(get_db)):
    stmt = select(Profile).where(Profile.account_id == account.id).options(selectinload(Profile.seeks))
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    if not profile:
        raise NotFoundError("Profile not found.")

    if len(profile.seeks) >= MAX_SEEKS_COUNT:
        raise ValidationError(f"Maximum limit of {MAX_SEEKS_COUNT} seeks reached.")

    seek = MemberSeek(
        profile_id=profile.id,
        title=payload.title,
        description=payload.description,
        display_order=len(profile.seeks)
    )
    db.add(seek)
    await db.commit()
    await db.refresh(seek)
    return seek

@router.delete("/me/seeks/{seek_id}", response_model=MessageResponse)
async def delete_seek(seek_id: uuid.UUID, account: Account = Depends(get_current_account), db: AsyncSession = Depends(get_db)):
    stmt = select(MemberSeek).join(Profile).where(
        MemberSeek.id == seek_id,
        Profile.account_id == account.id
    )
    res = await db.execute(stmt)
    seek = res.scalar_one_or_none()
    if not seek:
        raise NotFoundError("Seek not found or not owned by you.")
    await db.delete(seek)
    await db.commit()
    return MessageResponse(message="Seek deleted successfully.")

@router.get("/{account_id}/profile", response_model=ProfileResponse)
async def get_public_profile(account_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Profile).join(Account).where(
        Profile.account_id == account_id,
        Account.deleted_at.is_(None),
        Account.status != "deleted"
    ).options(
        selectinload(Profile.offers),
        selectinload(Profile.seeks),
    )
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    if not profile:
        raise NotFoundError("Profile not found.")

    # Redact location if private
    if not profile.is_location_public:
        profile.location_text = None
    return profile
