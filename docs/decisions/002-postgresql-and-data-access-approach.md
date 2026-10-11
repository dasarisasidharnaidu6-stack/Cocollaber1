# ADR-002: PostgreSQL and Async Data Access Approach

## Status
Accepted

## Context
CoCollaber requires relational integrity, complex multi-faceted filtering, JSON document support for extensible attributes, and full-text search across opportunities and member skills.

## Decision
Select **PostgreSQL 16** as the authoritative primary relational database, accessed asynchronously using **SQLAlchemy 2.0** with the `asyncpg` driver and managed via **Alembic** migrations.

## Alternatives Considered
- **MongoDB / NoSQL:** Rejected due to lack of declarative foreign key integrity and complex cross-entity joining requirements.
- **MySQL:** Rejected due to inferior full-text search ranking and less powerful JSONB indexing compared to PostgreSQL.

## Benefits
- Native ACID compliance and foreign key cascade controls.
- High-performance non-blocking I/O using SQLAlchemy 2.0 async engine.
- PostgreSQL `tsvector` and `JSONB` capabilities eliminate the immediate need for separate search or document databases.

## Trade-offs
- Async SQLAlchemy requires strict async/await conventions across all service calls.

## Security Implications
- Automated query parameterization eliminates SQL injection vulnerabilities (OWASP A03).

## Migration Implications
- Dialect-aware schemas ensure local testability across environments.

## Open Questions
None.\n