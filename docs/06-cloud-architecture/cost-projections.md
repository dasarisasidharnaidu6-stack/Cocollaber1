# CoCollaber Cloud Architecture: Multi-Tier Cost Projections & Sensitivity Models

> [!NOTE]
> All figures in this document represent planning estimates based on published cloud provider unit pricing as of October 2026. They are budgeting models, not guaranteed invoices.

---

## 1. Traffic Scenario Modeling Assumptions

| Variable | Pilot (100 MAU) | Early Growth (1,000 MAU) | Growing Product (10,000 MAU) | Sensitivity Impact |
| :--- | :--- | :--- | :--- | :--- |
| **Sessions / User / Month** | 4 sessions | 8 sessions | 12 sessions | Increases API and session query volume |
| **API Requests / Active User / Month** | 30 requests | 60 requests | 100 requests | Drives compute vCPU and connection load |
| **Total Monthly API Requests** | 3,000 requests | 60,000 requests | 1,000,000 requests | Direct compute and logging driver |
| **Average Response Payload** | 4 KB | 4 KB | 6 KB | Determines network egress transfer |
| **Total Monthly Egress** | ~12 MB (< 1 GB) | ~240 MB (< 1 GB) | ~6 GB | Remains low cost due to text/JSON format |
| **Database Storage Growth** | 50 MB / month | 200 MB / month | 2 GB / month | Drives EBS / persistent disk allocation |
| **Backup Retention** | 7 days daily | 14 days daily + PITR | 30 days daily + PITR | Drives backup storage pricing |

---

## 2. Monthly Cost Modeling by Milestone

### A. Scenario 1: Pilot Deployment (100 MAU) — Topology A (PaaS)
*Target: Minimal operational complexity and lowest baseline expense.*

| Expense Category | Component Specification | Low Est. | Expected | High Est. |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Web** | PaaS Starter Container (512MB RAM) | \$5.00 | \$7.00 | \$10.00 |
| **Backend API** | PaaS Starter Container (512MB RAM) | \$5.00 | \$7.00 | \$10.00 |
| **Database** | Managed PostgreSQL Starter (1GB RAM, 10GB SSD) | \$7.00 | \$10.00 | \$15.00 |
| **Network Egress** | Included free quota (< 100 GB) | \$0.00 | \$0.00 | \$0.00 |
| **Domain & TLS** | Automated Let's Encrypt + Registrar domain fee | \$1.25 | \$1.25 | \$2.00 |
| **Transactional Email** | Free tier (e.g. SendGrid/Resend 100 emails/day) | \$0.00 | \$0.00 | \$0.00 |
| **Contingency (10%)**| Unexpected spikes or build minutes | \$1.80 | \$2.50 | \$3.70 |
| **Monthly Total** | — | **\$20.05** | **\$27.75** | **\$40.70** |
| **Annualized Total**| — | **\$240.60** | **\$333.00** | **\$488.40** |

---

### B. Scenario 2: Early Growth (1,000 MAU) — Topology B (AWS / GCP Managed)
*Target: Multi-AZ reliability, automated point-in-time recovery, zero-downtime rolling deploys.*

| Expense Category | Component Specification (AWS Baseline) | Low Est. | Expected | High Est. |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Compute** | ECS Fargate: 2 tasks x 0.25 vCPU, 0.5 GB RAM | \$12.00 | \$15.00 | \$20.00 |
| **Backend Compute** | ECS Fargate: 2 tasks x 0.5 vCPU, 1 GB RAM | \$24.00 | \$30.00 | \$40.00 |
| **Database** | Amazon RDS PostgreSQL `db.t4g.small` (Single-AZ + Snapshots) | \$30.00 | \$35.00 | \$45.00 |
| **Networking & ALB** | AWS Application Load Balancer + NAT Gateway | \$25.00 | \$32.00 | \$42.00 |
| **CDN & DNS** | CloudFront (within 1TB free tier) + Route 53 hosted zone | \$1.00 | \$2.00 | \$3.00 |
| **Secrets & Config** | AWS Systems Manager Parameter Store + Secrets Manager | \$1.00 | \$2.00 | \$4.00 |
| **Logs & Monitoring** | CloudWatch Logs (2 GB ingestion + 5 metrics/alarms) | \$3.00 | \$5.00 | \$8.00 |
| **Contingency (10%)**| Network or snapshot buffer | \$9.60 | \$12.10 | \$16.20 |
| **Monthly Total** | — | **\$105.60** | **\$133.10** | **\$178.20** |
| **Annualized Total**| — | **\$1,267.20** | **\$1,597.20** | **\$2,138.40** |

---

### C. Scenario 3: Growing Product (10,000 MAU) — Topology C (High Availability Scale)
*Target: Horizontal task autoscaling, RDS Proxy connection pooling, Redis caching, WAF DDoS shield.*

| Expense Category | Component Specification | Low Est. | Expected | High Est. |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Compute** | Autoscaling ECS Fargate (2–6 tasks) | \$40.00 | \$60.00 | \$90.00 |
| **Backend Compute** | Autoscaling ECS Fargate (2–8 tasks) | \$70.00 | \$110.00 | \$160.00 |
| **Database (Multi-AZ)**| Amazon RDS PostgreSQL `db.t4g.medium` (Multi-AZ Standby) | \$110.00 | \$135.00 | \$170.00 |
| **Connection Proxy** | Amazon RDS Proxy | \$15.00 | \$22.00 | \$30.00 |
| **In-Memory Cache** | ElastiCache Redis `cache.t4g.micro` | \$14.00 | \$18.00 | \$25.00 |
| **ALB & WAF** | Application Load Balancer + AWS WAF ruleset | \$35.00 | \$50.00 | \$75.00 |
| **Logs, Traces & Sentry**| CloudWatch Logs + Sentry Team Plan | \$15.00 | \$26.00 | \$40.00 |
| **Transactional Email** | AWS SES (60,000 emails @ \$0.10/1,000) | \$6.00 | \$8.00 | \$12.00 |
| **Contingency (10%)**| Surge buffer | \$30.50 | \$43.90 | \$60.20 |
| **Monthly Total** | — | **\$335.50** | **\$472.90** | **\$662.20** |
| **Annualized Total**| — | **\$4,026.00** | **\$5,674.80** | **\$7,946.40** |

---

## 3. Practical Cost-Control Strategies

1. **VPC Endpoint Elimination in Dev/Pilot**: Use public endpoints or single NAT Gateway during non-critical phases to save ~\$32/month per unnecessary NAT Gateway.
2. **Compute Right-Sizing & Savings Plans**: Committing to 1-year Compute Savings Plans on AWS Fargate delivers up to 28% discounts when baseline compute requirements stabilize.
3. **Log Retention Policies**: Restrict CloudWatch log retention to 14 days in dev/staging and 30 days in production to prevent unbounded ingestion and storage costs.
4. **Automated Billing Alerts**: Configure multi-threshold budget alerts (\$50, \$100, \$250) in AWS Budgets or GCP Billing with automated email notifications.
