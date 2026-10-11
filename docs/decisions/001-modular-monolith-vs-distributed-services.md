# ADR-001: Modular Monolith vs Distributed Microservices

## Status
Accepted

## Context
CoCollaber is an early-stage product designed to evolve into a global collaboration ecosystem. Building distributed microservices at inception introduces severe network latency overhead, complex distributed transactions, deployment fragility, and significant RAM/CPU resource consumption during local development.

## Decision
Adopt a **Modular Monolith** architecture for the backend API (`apps/api`). Domain features (Auth, Members, Opportunities, Discovery, Interactions, Messaging, Moderation, Admin) are organized into isolated modules with explicit service interfaces, sharing a single FastAPI runtime and relational database.

## Alternatives Considered
- **Microservices Architecture:** Rejected due to premature operational complexity, distributed transaction costs, and heavy memory footprint.
- **Unstructured Monolith:** Rejected because tight coupling would prevent independent domain evolution and future service extraction.

## Benefits
- Simple single-process deployment and local execution with minimal RAM.
- ACID transactions across related operations (e.g., accepting an interest and unlocking a connection thread).
- Clear module boundaries allow future extraction into independent microservices if scale demands it.

## Trade-offs
- All modules share the same Python runtime and database instance.

## Security Implications
- Strong in-process module boundaries prevent unauthorized cross-domain data mutations.

## Migration Implications
- High reversibility. Modules are cleanly isolated and can be split into separate services later.

## Open Questions
None.\n