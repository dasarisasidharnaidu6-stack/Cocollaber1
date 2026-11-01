"""Discovery Module Router."""

from apps.api.app.core.dependencies import get_db
from apps.api.app.db.models import Domain, Opportunity, Tag
from apps.api.app.modules.discovery.schemas import DomainResponse, TagResponse
from apps.api.app.modules.opportunities.schemas import OpportunityResponse
from apps.api.app.schemas.common import PaginatedResponse
from fastapi import APIRouter, Depends, Query
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/discovery", tags=["Discovery & Search"])


@router.get("/domains", response_model=list[DomainResponse])
async def list_domains(db: AsyncSession = Depends(get_db)):
    stmt = select(Domain).where(Domain.is_active == True).order_by(Domain.name.asc())
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/tags", response_model=list[TagResponse])
async def list_tags(db: AsyncSession = Depends(get_db)):
    stmt = select(Tag).order_by(Tag.name.asc()).limit(100)
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/search", response_model=PaginatedResponse[OpportunityResponse])
async def search_opportunities(
    q: str | None = Query(None, min_length=1, max_length=100),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    compensation_type: str | None = None,
    is_remote: bool | None = None,
    db: AsyncSession = Depends(get_db),
):
    filters = [Opportunity.status == "open", Opportunity.deleted_at.is_(None)]
    if q:
        search_pattern = f"%{q.lower()}%"
        filters.append(
            or_(
                func.lower(Opportunity.title).like(search_pattern),
                func.lower(Opportunity.description).like(search_pattern),
            )
        )
    if compensation_type:
        filters.append(Opportunity.compensation_type == compensation_type)
    if is_remote is not None:
        filters.append(Opportunity.is_remote == is_remote)

    count_stmt = select(func.count(Opportunity.id)).where(and_(*filters))
    total = (await db.execute(count_stmt)).scalar() or 0

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
