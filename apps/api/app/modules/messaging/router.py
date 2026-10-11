"""Messaging Module Router."""
import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from apps.api.app.core.dependencies import (
    get_db, get_current_active_member, assert_connection_participant
)
from apps.api.app.core.exceptions import NotFoundError
from apps.api.app.db.models import Connection, Message, Account
from apps.api.app.modules.messaging.schemas import (
    ConnectionResponse, MessageCreate, MessageResponse
)

router = APIRouter(prefix="/connections", tags=["Messaging & Connections"])

@router.get("", response_model=List[ConnectionResponse])
async def list_my_connections(
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Connection).where(
        or_(
            Connection.creator_id == account.id,
            Connection.seeker_id == account.id
        )
    ).order_by(Connection.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/{id}", response_model=ConnectionResponse)
async def get_connection(
    id: uuid.UUID,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Connection).where(Connection.id == id)
    res = await db.execute(stmt)
    conn = res.scalar_one_or_none()
    if not conn:
        raise NotFoundError("Connection not found.")

    assert_connection_participant(account.id, conn)
    return conn

@router.get("/{id}/messages", response_model=List[MessageResponse])
async def list_messages(
    id: uuid.UUID,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Connection).where(Connection.id == id)
    conn = (await db.execute(stmt)).scalar_one_or_none()
    if not conn:
        raise NotFoundError("Connection not found.")

    assert_connection_participant(account.id, conn)

    stmt_msgs = select(Message).where(Message.connection_id == id).order_by(Message.created_at.asc())
    res_msgs = await db.execute(stmt_msgs)
    return res_msgs.scalars().all()

@router.post("/{id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    id: uuid.UUID,
    payload: MessageCreate,
    account: Account = Depends(get_current_active_member),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Connection).where(Connection.id == id)
    conn = (await db.execute(stmt)).scalar_one_or_none()
    if not conn:
        raise NotFoundError("Connection not found.")

    assert_connection_participant(account.id, conn)

    message = Message(
        connection_id=id,
        sender_id=account.id,
        content=payload.content,
        is_read=False
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message
