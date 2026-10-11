# ADR-004: Unified Opportunity Entity Design

## Status
Accepted

## Context
CoCollaber supports opportunities across technology, sports, arts, music, research, and volunteering. Creating separate database tables for every domain (e.g., `SportsOpportunity`, `TechOpportunity`) would lead to severe architectural fragmentation.

## Decision
Model all opportunities using a single unified `Opportunity` entity with:
- Standardized core columns: `title`, `description`, `opportunity_type`, `status`, `compensation_type`, `location_text`, `is_remote`.
- Extensible `attributes` column using PostgreSQL `JSONB` for domain-specific details without schema alterations.

## Alternatives Considered
- **Table-Per-Domain:** Rejected due to schema bloat, difficult cross-domain search, and maintenance overhead.
- **Entity-Attribute-Value (EAV):** Rejected due to query complexity and poor indexing efficiency.

## Benefits
- Uniform discovery and faceted search across all domains.
- Extremely high extensibility without database migrations.

## Trade-offs
- JSONB fields require application-level validation via Pydantic schemas.

## Security Implications
- Input sanitization must be enforced on JSONB payloads to prevent script injection.

## Migration Implications
- High reversibility. JSONB keys can be promoted to first-class table columns if usage patterns warrant it.

## Open Questions
None.\n