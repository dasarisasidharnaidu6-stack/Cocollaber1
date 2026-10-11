# ADR-007: Discovery and Search Strategy

## Status
Accepted

## Context
Seekers need to discover opportunities matching keywords, domains, compensation, and location. Setting up Elasticsearch or OpenSearch introduces heavy JVM memory footprint and operational complexity.

## Decision
Utilize **PostgreSQL Full-Text Search (FTS)** using native `tsvector` columns with GIN indexes combined with structured B-tree relational filters for v1. Search operations are encapsulated behind `DiscoveryService`.

## Alternatives Considered
- **Elasticsearch / Opensearch:** Rejected due to extreme RAM requirements (>2GB) and dual-write synchronization complexity.
- **External Managed SaaS (Algolia):** Rejected due to external cloud dependency and vendor cost in v1.

## Benefits
- Zero additional infrastructure or memory overhead.
- Atomic updates: search vectors are updated synchronously with opportunity edits.

## Trade-offs
- PostgreSQL FTS has fewer natural-language ranking knobs than dedicated search engines.

## Security Implications
- Parameterized search queries prevent SQL injection.

## Migration Implications
- The `DiscoveryService` interface allows swapping the search backend to Meilisearch or Elasticsearch in later phases without altering frontend contracts.

## Open Questions
None.\n