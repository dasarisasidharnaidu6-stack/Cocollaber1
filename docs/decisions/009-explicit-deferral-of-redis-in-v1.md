# ADR-009: Explicit Deferral of Redis in v1

## Status
Accepted

## Context
Redis is frequently introduced for session storage, caching, and rate limiting. However, in Phase 1 and MVP, introducing Redis adds background process overhead, RAM consumption, and deployment complexity that is not strictly required by early load.

## Decision
Explicitly **defer Redis adoption in v1**.
- Session records reside in PostgreSQL.
- Rate limiting is handled in-memory using token-bucket algorithms.
- Caching is deferred until real performance bottlenecks emerge.

## Alternatives Considered
- **Immediate Redis Adoption:** Rejected per user requirement to conserve system RAM and keep the initial stack lightweight.

## Benefits
- Minimal developer machine memory footprint.
- Single database engine (PostgreSQL) to manage, backup, and operate.

## Trade-offs
- In-memory rate limits do not synchronize across horizontally scaled multi-node clusters (acceptable for single-node early stage).

## Security Implications
- Rate limits remain strictly enforced per application process.

## Migration Implications
- Redis can be introduced behind the `CacheService` and `RateLimitService` interfaces in Phase 4/6 with zero breaking changes.

## Open Questions
None.\n