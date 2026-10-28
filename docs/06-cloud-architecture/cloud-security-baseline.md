# CoCollaber Cloud Architecture: Security Baseline & Compliance

## 1. Cloud Security Architecture Overview

This baseline establishes the defense-in-depth security model across network, compute, data, identity, and application tiers.

```
[ Layer 1: Edge & Perimeter ]   --> CloudFront / WAF / TLS 1.3 / Automated DDoS Shield
[ Layer 2: Network Isolation ]  --> Multi-tier VPC / Public vs. Private vs. Isolated Subnets
[ Layer 3: Identity & Access ]  --> IAM Roles / Least-Privilege Task Execution / Zero Long-Lived Keys
[ Layer 4: Data Protection ]    --> Encryption in Transit (TLS) & at Rest (AES-256 / AWS KMS)
[ Layer 5: Application Gateway]--> Double-Submit CSRF / HttpOnly Cookies / In-Memory Throttling
```

---

## 2. Tiered Security Controls

### A. Network & Edge Controls
1. **TLS Enforcement**: All HTTP traffic arriving at port 80 is redirected to HTTPS (Port 443) with HSTS (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`).
2. **Database Network Isolation**: RDS PostgreSQL has `publicly_accessible = false` and resides in dedicated non-routable subnets. Direct public internet access is physically prohibited at the route table level.
3. **Egress Restrictions**: Container workloads only access the external internet through NAT Gateways for outbound HTTPS dependencies (e.g. transactional email APIs).

### B. Identity, Access & Secret Management (IAM)
1. **Zero Long-Lived Credentials**: ECS tasks assume fine-grained IAM Execution Roles with temporary STS credentials. No static access keys (`AKIA...`) are injected into containers.
2. **Secret Encryption**: `SECRET_KEY`, database passwords, and JWT signing keys are stored in AWS Secrets Manager or Systems Manager Parameter Store with KMS customer-managed keys.
3. **Principle of Least Privilege**: The API execution role is strictly constrained to read designated parameter paths (`/cocollaber/production/*`).

### C. Application Security Integration
1. **Cookie Configuration**:
   - `cocol_session`: `HttpOnly=True`, `Secure=True`, `SameSite=Lax`. Prevents cross-site script theft.
   - `cocol_csrf_token`: Paired with mandatory `X-CSRF-Token` header on mutating methods.
2. **Strict CORS Policy**: Disallowed origins attempting credentialed access are rejected. In production, origins are pinned to the verified domain (`https://app.cocollaber.com`).
3. **Rate Limiting & Abuse Defense**: Login routes are throttled to 5 requests/minute (`429 E-RATE-001`).

### D. Incident Response Protocol
- **Tier 1 (P0 - Data Breach / Compromise)**: Rotate database master credentials in Secrets Manager; invalidate all active sessions in `sessions` table (`DELETE FROM sessions`); isolate affected container tasks.
- **Tier 2 (P1 - Service Outage / Crash Loop)**: Check ALB health check logs; inspect CloudWatch container crash traces; initiate zero-downtime rollback to previous known good image digest.
