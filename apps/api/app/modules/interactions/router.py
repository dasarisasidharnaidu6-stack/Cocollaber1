"""Interactions Module Router."""
import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from apps.api.app.core.dependencies import (
    get_db, get_current_active_member, assert_opportunity_creator
)
from apps.api.app.core.exceptions import (
    NotFoundError, ValidationError, ForbiddenError, ConflictError
)
from apps.api.app.db.models import Opportunity, Interest, Connection, Account
from apps.api.app.modules.interactions.schemas import (
    InterestCreate, InterestResponse, InterestRespondRequest
)
from apps.api.app.schemas.common import MessageResponse

router = APIRouter(tags=["Interactions & Connections"])

@router.post("/opportunities/{id}/interests", response_model=InterestResponse, status_code=status.HTTP_201_CREATED)
async def express_interest(
    id: uuid.UUID,
    payload: InterestCreate,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Opportunity).where(Opportunity.id == id, Opportunity.deleted_at.is_(None))
    res = await db.execute(stmt)
    opp = res.scalar_one_or_none()
    if not opp:
        raise NotFoundError("Opportunity not found.")

    if opp.creator_id == account.id:
        raise ForbiddenError("You cannot express interest in your own opportunity.")

    # Check duplicate
    stmt_dup = select(Interest).where(
        Interest.opportunity_id == id,
        Interest.seeker_id == account.id
    )
    res_dup = await db.execute(stmt_dup)
    if res_dup.scalar_one_or_none():
        raise ConflictError("You have already expressed interest in this opportunity.")

    interest = Interest(
        opportunity_id=id,
        seeker_id=account.id,
        message=payload.message,
        status="pending"
    )
    db.add(interest)
    await db.commit()
    await db.refresh(interest)
    return interest

@router.get("/opportunities/{id}/interests", response_model=List[InterestResponse])
async def list_opportunity_interests(
    id: uuid.UUID,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Opportunity).where(Opportunity.id == id, Opportunity.deleted_at.is_(None))
    res = await db.execute(stmt)
    opp = res.scalar_one_or_none()
    if not opp:
        raise NotFoundError("Opportunity not found.")

    assert_opportunity_creator(account.id, opp)

    stmt_int = select(Interest).where(Interest.opportunity_id == id).order_by(Interest.created_at.desc())
    res_int = await db.execute(stmt_int)
    return res_int.scalars().all()

@router.post("/interests/{id}/respond", response_model=InterestResponse)
async def respond_to_interest(
    id: uuid.UUID,
    payload: InterestRespondRequest,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    if payload.action not in ("accept", "decline"):
        raise ValidationError("Action must be 'accept' or 'decline'.")

    stmt = select(Interest).join(Opportunity).where(Interest.id == id)
    res = await db.execute(stmt)
    interest = res.scalar_one_or_none()
    if not interest:
        raise NotFoundError("Interest record not found.")

    stmt_opp = select(Opportunity).where(Opportunity.id == interest.opportunity_id)
    opp = (await db.execute(stmt_opp)).scalar_one_or_none()
    if not opp or opp.creator_id != account.id:
        raise ForbiddenError("Only the opportunity creator can respond to this interest.")

    if interest.status != "pending":
        raise ValidationError(f"Interest is already in '{interest.status}' status.")

    interest.status = "accepted" if payload.action == "accept" else "declined"
    interest.responded_at = datetime.now(timezone.utc)

    # Unlock connection & messaging if accepted
    if payload.action == "accept":
        connection = Connection(
            interest_id=interest.id,
            opportunity_id=opp.id,
            creator_id=opp.creator_id,
            seeker_id=interest.seeker_id,
            status="active"
        )
        db.add(connection)

    await db.commit()
    await db.refresh(interest)
    return interest

@router.post("/interests/{id}/withdraw", response_model=MessageResponse)
async def withdraw_interest(
    id: uuid.UUID,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Interest).where(Interest.id == id, Interest.seeker_id == account.id)
    res = await db.execute(stmt)
    interest = res.scalar_one_or_none()
    if not interest:
        raise NotFoundError("Interest record not found or not owned by you.")

    if interest.status != "pending":
        raise ValidationError("Only pending interests can be withdrawn.")

    interest.status = "withdrawn"
    await db.commit()
    return MessageResponse(message="Expression of interest withdrawn successfully.")
