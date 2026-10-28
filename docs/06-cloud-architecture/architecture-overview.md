# CoCollaber Cloud Architecture: System Discovery & Runtime Requirements

## 1. Verified Architecture & Runtime Inventory

CoCollaber is an opportunity-centric, domain-agnostic collaboration platform built on the core principle:
**People ↔ Opportunities ↔ People**
and structured around the product loop:
**Express → Discover → Connect → Collaborate → Grow → Create**

This document establishes the verified runtime requirements, operational dependencies, and service boundaries discovered directly from the codebase.

---

## 2. Component Runtime Specifications

| Component | Technology | Runtime / Port | Execution Model | Memory / CPU Profile | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Frontend Web** | Next.js 14 App Router | Node.js 20+ (Port 3000) | Standalone Server (`node server.js`) | ~128–256 MB RAM, 0.25–0.5 vCPU | FastAPI backend via REST |
| **Backend API** | FastAPI (Python 3.12) | Uvicorn ASGI (Port 8000) | Async Process Pool (single/multi worker) | ~150–300 MB RAM, 0.5–1.0 vCPU | PostgreSQL database |
| **Database** | PostgreSQL 16 | Standard Port 5432 | Transactional Relational Engine | ~512 MB–2 GB RAM, 0.5–2.0 vCPU | Block storage (SSD) |
| **Cache (Optional)** | Redis 7 | In-Memory (Port 6379) | Key-Value Store / Sliding Window | ~128–256 MB RAM | None (Compute buffer) |

---

## 3. Communication & Data Protocols

```
[ User Browser / Client ]
            │
            │ HTTPS / TLS 1.3 (Port 443)
            ▼
[ Edge CDN / Reverse Proxy ]
            │
     ┌──────┴──────────────────────────────────┐
     │ Route: /*                               │ Route: /api/*
     ▼                                         ▼
[ Next.js Standalone Frontend ]       [ FastAPI Backend Cluster ]
  (Port 3000)                           (Port 8000)
     │                                         │
     │ Client-side Fetch / API Client          │ SQLAlchemy 2.0 (asyncpg)
     └────────────────────────────────────────►│
                                               ▼
                                      [ PostgreSQL 16 Database ]
                                        (Port 5432 - Private VPC)
```

### Protocol Characteristics:
1. **Frontend-to-Backend Transport**: Standard HTTP/2 and HTTP/1.1 REST over TLS.
2. **Session Identification**: State is maintained via opaque 256-bit server-stored session tokens delivered in an `HttpOnly`, `SameSite=Lax` cookie (`cocol_session`).
3. **Cross-Site Request Forgery (CSRF)**: State-changing requests (`POST`, `PUT`, `DELETE`) require the double-submit `cocol_csrf_token` cookie paired with the `X-CSRF-Token` request header.
4. **Backend-to-Database Transport**: Asynchronous TCP connections via `postgresql+asyncpg://` with connection pooling (pool size 10–20 per worker).

---

## 4. Confirmed Facts vs. Documented Assumptions

### Confirmed Architectural Facts
- Zero reliance on external message queues (e.g. RabbitMQ, Kafka) or microservices in v1.
- No object storage dependencies for file uploads in v1 (all profiles, opportunities, and messages store structured text, URLs, and JSON attributes).
- In-memory sliding-window throttling is currently implemented in `RateLimitMiddleware` (5 attempts/min for `/login`); growth will require Redis when scaled horizontally across multiple instances.
- Health checks are natively supported: `/api/v1/health` returns `200 OK` (`{"status": "healthy", "service": "cocollaber-api"}`).

### Assumptions & Open Operational Choices
- **Email Delivery**: Currently configured as `console` backend for development. Production requires selecting a transactional email provider (AWS SES, SendGrid, or Postmark) for email verification and notifications.
- **WebSocket Scaling**: Direct messaging currently polls REST endpoints `/api/v1/messages/connections/{id}/messages`. Real-time WebSockets can be introduced when user volume justifies persistent duplex connections.
