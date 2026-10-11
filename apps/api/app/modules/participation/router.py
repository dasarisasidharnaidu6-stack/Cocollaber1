"""Participation Module Router."""
import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from apps.api.app.core.dependencies import get_db, get_current_active_member
from apps.api.app.core.exceptions import NotFoundError, ForbiddenError
from apps.api.app.db.models import Opportunity, Participation, Account
from apps.api.app.modules.participation.schemas import ParticipationResponse

router = APIRouter(tags=["Participation & Track Record"])

@router.post("/opportunities/{id}/participations/confirm", response_model=ParticipationResponse)
async def confirm_participation(
    id: uuid.UUID,
    seeker_id: uuid.UUID,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Opportunity).where(Opportunity.id == id, Opportunity.deleted_at.is_(None))
    opp = (await db.execute(stmt)).scalar_one_or_none()
    if not opp:
        raise NotFoundError("Opportunity not found.")

    if account.id != opp.creator_id and account.id != seeker_id:
        raise ForbiddenError("Only participants in this opportunity can confirm participation.")

    stmt_part = select(Participation).where(
        Participation.opportunity_id == id,
        Participation.seeker_id == seeker_id
    )
    part = (await db.execute(stmt_part)).scalar_one_or_none()

    if not part:
        part = Participation(
            opportunity_id=id,
            creator_id=opp.creator_id,
            seeker_id=seeker_id,
            status="proposed"
        )
        db.add(part)

    if account.id == opp.creator_id:
        part.creator_confirmed = True
    if account.id == seeker_id:
        part.seeker_confirmed = True

    if part.creator_confirmed and part.seeker_confirmed:
        part.status = "confirmed"
        part.confirmed_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(part)
    return part

@router.get("/participations/me", response_model=List[ParticipationResponse])
async def list_my_participations(
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Participation).where(
        or_(
            Participation.creator_id == account.id,
            Participation.seeker_id == account.id
        ),
        Participation.status == "confirmed"
    ).order_by(Participation.confirmed_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()
