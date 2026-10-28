# CoCollaber Cloud Architecture: Assumptions & Open Decisions

This document formally records all operational assumptions, architectural boundaries, and business decisions requiring stakeholder signoff before production provisioning.

---

## 1. Confirmed Architectural Decisions (ADR Summary)

1. **Standalone Next.js Frontend**: Next.js is configured for `output: "standalone"`, generating self-contained lightweight Node.js output running on port 3000.
2. **FastAPI Asynchronous Gateway**: Single unified backend exposing REST endpoints under `/api/v1/*`.
3. **PostgreSQL Relational Core**: 22 relational tables managed by Alembic, enforcing strict foreign key constraints and transactional integrity.
4. **Zero Hardcoded Secrets**: All cryptographic secrets, database credentials, and signing parameters are read from environment variables.
5. **Double-Submit CSRF & HttpOnly Sessions**: Security tokens are managed across cookie pairs (`cocol_session` and `cocol_csrf_token`).

---

## 2. Open Decisions Awaiting Stakeholder Sign-Off

### Decision 1: Initial Deployment Target (Topology A vs. Topology B)
- **Option A (Topology A - PaaS)**: Deploy pilot on Render / Fly.io for ~\$25/month. Minimizes DevOps time and complexity during early user alpha.
- **Option B (Topology B - AWS Fargate)**: Provision complete VPC, ALB, and RDS on AWS for ~\$130/month. Higher initial configuration investment, but establishes a production-grade enterprise foundation.
- *Recommendation*: Launch alpha pilot on **Topology A**, and transition to **Topology B** once active user metrics surpass 300 MAU.

### Decision 2: Transactional Email Service Provider
- **Current State**: Configured as `console` mock backend.
- **Options**:
  - *AWS SES*: Lowest unit cost (\$0.10 per 1,000 emails), native integration if AWS is chosen.
  - *Resend / Postmark*: Premium developer experience, high deliverability, simpler templating, free tier (3,000 emails/month).
- *Recommendation*: Adopt **Resend** or **Postmark** during early stages for superior out-of-the-box deliverability.

### Decision 3: Custom Domain & DNS Management
- **Domain Registrations**: Determine authoritative nameserver provider (Cloudflare vs. AWS Route 53 vs. Google Cloud Domains).
- *Recommendation*: Use **Cloudflare** for DNS and DDoS protection with origin pointing to the primary Application Load Balancer.

### Decision 4: Long-Term Media & File Storage
- **Current State**: CoCollaber v1 relies on text, metadata, and external URL references.
- **Future Need**: If user profile avatars, document portfolios, or research attachments are supported in v2, an S3-compatible object bucket with private IAM access and pre-signed upload URLs will be required.
