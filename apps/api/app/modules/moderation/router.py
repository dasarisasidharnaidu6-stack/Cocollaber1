"""Moderation Module Router."""
import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from apps.api.app.core.dependencies import (
    get_db, get_current_active_member, require_roles
)
from apps.api.app.core.exceptions import NotFoundError, ValidationError, ConflictError
from apps.api.app.db.models import Report, Block, ModerationAction, Account, Opportunity
from apps.api.app.modules.moderation.schemas import (
    ReportCreate, ReportResponse, ModerationActionCreate
)
from apps.api.app.schemas.common import MessageResponse

router = APIRouter(prefix="/moderation", tags=["Trust, Safety & Moderation"])

@router.post("/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def submit_report(
    payload: ReportCreate,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    if payload.target_type not in ("opportunity", "profile", "message"):
        raise ValidationError("Invalid target_type. Must be 'opportunity', 'profile', or 'message'.")

    report = Report(
        reporter_id=account.id,
        target_type=payload.target_type,
        target_id=payload.target_id,
        reason_code=payload.reason_code,
        details=payload.details,
        status="pending"
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report

@router.post("/blocks/{account_id}", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def block_member(
    account_id: uuid.UUID,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    if account.id == account_id:
        raise ValidationError("You cannot block yourself.")

    stmt = select(Block).where(
        Block.blocker_id == account.id,
        Block.blocked_id == account_id
    )
    if (await db.execute(stmt)).scalar_one_or_none():
        raise ConflictError("Member is already blocked.")

    block = Block(blocker_id=account.id, blocked_id=account_id)
    db.add(block)
    await db.commit()
    return MessageResponse(message="Member blocked successfully.")

@router.delete("/blocks/{account_id}", response_model=MessageResponse)
async def unblock_member(
    account_id: uuid.UUID,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Block).where(
        Block.blocker_id == account.id,
        Block.blocked_id == account_id
    )
    block = (await db.execute(stmt)).scalar_one_or_none()
    if not block:
        raise NotFoundError("Block relationship not found.")

    await db.delete(block)
    await db.commit()
    return MessageResponse(message="Member unblocked successfully.")

@router.get("/reports", response_model=List[ReportResponse])
async def list_reports(
    staff: Account = Depends(require_roles("moderator", "admin")),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Report).where(Report.status == "pending").order_by(Report.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("/reports/{id}/act", response_model=MessageResponse)
async def act_on_report(
    id: uuid.UUID,
    payload: ModerationActionCreate,
    staff: Account = Depends(require_roles("moderator", "admin")),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Report).where(Report.id == id)
    report = (await db.execute(stmt)).scalar_one_or_none()
    if not report:
        raise NotFoundError("Report not found.")

    action = ModerationAction(
        report_id=report.id,
        moderator_id=staff.id,
        action_type=payload.action_type,
        notes=payload.notes
    )
    db.add(action)

    report.status = "resolved"

    # Execute action effects
    if payload.action_type == "remove_content" and report.target_type == "opportunity":
        stmt_opp = select(Opportunity).where(Opportunity.id == report.target_id)
        opp = (await db.execute(stmt_opp)).scalar_one_or_none()
        if opp:
            opp.status = "removed"
    elif payload.action_type == "suspend_account":
        stmt_target_acc = select(Account).where(Account.id == report.target_id)
        target_acc = (await db.execute(stmt_target_acc)).scalar_one_or_none()
        if target_acc:
            target_acc.status = "suspended"

    await db.commit()
    return MessageResponse(message=f"Moderation action '{payload.action_type}' recorded successfully.")
