# CoCollaber Cloud Architecture: Operations & Observability

## 1. Operational Telemetry Model

CoCollaber’s operational observability is built around three pillars: Structured Logs, Metrics & Health Probes, and Actionable Alarms.

```
[ Application Containers (Stdout/Stderr) ]
                    │
                    ▼
[ Structured JSON Log Streams (CloudWatch / Cloud Logging) ]
  - Timestamp, Level, Path, StatusCode, LatencyMs, TraceId, ClientIp
                    │
                    ▼
[ Metric Filters & Alarms ] ───► [ PagerDuty / Slack / Email Escalation ]
```

---

## 2. Health Endpoints & Synthetic Probes

| Component | Target URL | Expected Response | Probe Frequency | Action on Failure |
| :--- | :--- | :--- | :--- | :--- |
| **Backend API Health** | `GET /api/v1/health` | `200 OK` (`{"status": "healthy", ...}`) | Every 30 seconds | Restart container task after 3 failures |
| **Frontend Web Health** | `GET /` | `200 OK` (Landing HTML) | Every 30 seconds | Remove unhealthy container from ALB pool |
| **Database Connectivity**| Integrated in `/api/v1/health` | Status check on connection pool | Continuous | Route alarms to On-Call engineer |

---

## 3. Core Monitoring Metrics & Alerting Thresholds

| Metric | Target / SLA | Warning Threshold | Critical Alarm (P1) | Escalation |
| :--- | :--- | :--- | :--- | :--- |
| **API Availability** | 99.9% Uptime | < 99.5% over 5m | < 99.0% over 2m | Automated PagerDuty alert |
| **HTTP 5xx Error Rate** | < 0.1% of requests | > 1.0% of requests | > 5.0% over 3m | On-call notification |
| **P95 Latency (API)** | < 150 ms | > 300 ms over 5m | > 800 ms over 3m | Check DB connection pool & CPU |
| **P95 Latency (SSR)** | < 250 ms | > 500 ms over 5m | > 1,200 ms over 3m | Scale Next.js task count |
| **Database CPU Usage** | < 50% baseline | > 70% over 10m | > 85% over 5m | Scale RDS instance or add replica |
| **DB Storage Remaining**| > 40% free | < 25% free | < 10% free | Auto-expand storage (gp3) |
| **Rate Limit Triggers** | Normal user behavior | > 50 triggers / min | > 200 triggers / min | Investigate credential stuffing |

---

## 4. Incident Severity Classification & On-Call Playbook

### Severity Levels
- **P0 (Critical Emergency)**: Complete platform outage; database data loss; verified credential compromise.
  - *Response Time*: < 15 minutes.
  - *Action*: Immediate incident commander assignment, status page communication, rollback or disaster recovery execution.
- **P1 (Major Impairment)**: Discovery search offline; login failing for a subset of users; elevated 5xx errors.
  - *Response Time*: < 30 minutes.
- **P2 (Minor Impairment)**: Intermittent UI visual bugs; non-critical API slowdown.
  - *Response Time*: Next business day.
