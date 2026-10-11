"""Opportunities Module Router."""
import uuid
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload

from apps.api.app.core.dependencies import (
    get_db, get_current_active_member, assert_opportunity_creator
)
from apps.api.app.core.exceptions import NotFoundError, ValidationError
from apps.api.app.core.constants import CompensationType, OpportunityStatus
from apps.api.app.db.models import Opportunity, Account, Domain
from apps.api.app.modules.opportunities.schemas import (
    OpportunityCreate, OpportunityUpdate, OpportunityResponse
)
from apps.api.app.schemas.common import PaginatedResponse, MessageResponse

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])

@router.post("", response_model=OpportunityResponse, status_code=status.HTTP_201_CREATED)
async def create_opportunity(
    payload: OpportunityCreate,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    # Validate compensation type enum
    valid_comps = [e.value for e in CompensationType]
    if payload.compensation_type not in valid_comps:
        raise ValidationError(f"Invalid compensation_type. Must be one of: {', '.join(valid_comps)}")

    opportunity = Opportunity(
        creator_id=account.id,
        title=payload.title,
        description=payload.description,
        opportunity_type=payload.opportunity_type,
        status="open",
        compensation_type=payload.compensation_type,
        compensation_details=payload.compensation_details,
        is_remote=payload.is_remote,
        location_text=payload.location_text,
        deadline=payload.deadline,
        attributes=payload.attributes,
    )
    db.add(opportunity)
    await db.commit()
    await db.refresh(opportunity)
    return opportunity

@router.get("", response_model=PaginatedResponse[OpportunityResponse])
async def list_opportunities(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    opportunity_type: Optional[str] = None,
    compensation_type: Optional[str] = None,
    is_remote: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    filters = [
        Opportunity.status == "open",
        Opportunity.deleted_at.is_(None)
    ]
    if opportunity_type:
        filters.append(Opportunity.opportunity_type == opportunity_type)
    if compensation_type:
        filters.append(Opportunity.compensation_type == compensation_type)
    if is_remote is not None:
        filters.append(Opportunity.is_remote == is_remote)

    # Count query
    count_stmt = select(func.count(Opportunity.id)).where(and_(*filters))
    total = (await db.execute(count_stmt)).scalar() or 0

    # Data query
    stmt = (
        select(Opportunity)
        .where(and_(*filters))
        .order_by(Opportunity.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    res = await db.execute(stmt)
    items = res.scalars().all()

    pages = (total + per_page - 1) // per_page if total > 0 else 1

    return PaginatedResponse(
        items=[OpportunityResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=pages,
    )

@router.get("/{id}", response_model=OpportunityResponse)
async def get_opportunity(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Opportunity).where(
        Opportunity.id == id,
        Opportunity.deleted_at.is_(None)
    )
    res = await db.execute(stmt)
    opp = res.scalar_one_or_none()
    if not opp:
        raise NotFoundError("Opportunity not found.")
    return opp

@router.put("/{id}", response_model=OpportunityResponse)
async def update_opportunity(
    id: uuid.UUID,
    payload: OpportunityUpdate,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Opportunity).where(Opportunity.id == id, Opportunity.deleted_at.is_(None))
    res = await db.execute(stmt)
    opp = res.scalar_one_or_none()
    if not opp:
        raise NotFoundError("Opportunity not found.")

    assert_opportunity_creator(account.id, opp)

    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(opp, field, val)

    await db.commit()
    await db.refresh(opp)
    return opp

@router.delete("/{id}", response_model=MessageResponse)
async def delete_opportunity(
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

    opp.deleted_at = datetime.now(timezone.utc)
    opp.status = "closed"
    await db.commit()
    return MessageResponse(message="Opportunity closed and archived successfully.")
