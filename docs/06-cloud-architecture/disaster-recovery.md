# CoCollaber Cloud Architecture: Disaster Recovery & Business Continuity

## 1. RPO & RTO Objectives

| Traffic Milestone | Target RPO (Recovery Point Objective) | Target RTO (Recovery Time Objective) | Financial & Operational Implication |
| :--- | :--- | :--- | :--- |
| **Pilot (100 MAU)** | **24 hours** (Daily snapshots) | **4 hours** (Manual redeploy) | Minimum cost (\$20/mo); acceptable data risk during alpha trials. |
| **Early Growth (1,000 MAU)**| **1 hour** (Automated daily snapshots + WAL archiving) | **1 hour** (Automated IaC re-provisioning) | Balances moderate cost (\$130/mo) with reliable recovery. |
| **Growing Product (10,000+ MAU)**| **5 minutes** (Point-in-Time Recovery via Continuous WAL) | **15 minutes** (Multi-AZ Standby Automatic Failover) | Enterprise resiliency (\$470/mo); automated RDS failover in < 60s. |

---

## 2. Backup Schedules, Encryption & Retention

### Relational Database (Amazon RDS PostgreSQL 16)
- **Continuous Backups**: Continuous transaction log (WAL) archiving to encrypted S3 with Point-in-Time Recovery (PITR) up to 14 days.
- **Daily Automated Snapshots**: Executed at 03:00 UTC daily; retained for 30 days.
- **Encryption**: Backups are encrypted at rest using AES-256 via AWS KMS customer-managed key.
- **Cross-Region Replication**: For Topology C, daily snapshots are automatically copied to secondary region (`us-west-2`) to protect against catastrophic regional outages.

---

## 3. Disaster Scenarios & Recovery Runbooks

### Scenario A: Database Data Corruption or Accidental Deletion
1. **Assessment**: Identify corruption timestamp $T_c$.
2. **Restoration Command**: Restore RDS instance to point in time $T_{target} = T_c - 5\text{ minutes}$:
   ```bash
   aws rds restore-db-instance-to-point-in-time \
     --source-db-instance-identifier cocollaber-production-pg \
     --target-db-instance-identifier cocollaber-production-pg-recovered \
     --restore-time 2026-10-28T12:00:00Z \
     --db-subnet-group-name cocollaber-production-db-subnets
   ```
3. **Validation**: Run read-only integrity checks against `cocollaber-production-pg-recovered`.
4. **Traffic Cutover**: Update Secrets Manager database connection string to point to the recovered instance and trigger ECS rolling restart.

### Scenario B: Cloud Provider Outage (Regional Failure)
1. **DNS Cutover**: Update CloudFront / Route 53 DNS records to failover to secondary region standby or maintenance page.
2. **IaC Deployment**: Apply Terraform manifest in backup region:
   ```bash
   terraform apply -var="aws_region=us-west-2" -var-file="production.tfvars"
   ```
3. **Snapshot Restore**: Restore the latest cross-region replicated snapshot.

### Scenario C: Failed Application Release
1. **Zero-Downtime Rollback**:
   Next.js and FastAPI run as versioned tasks on ECS / Cloud Run. Roll back to the preceding task definition or Docker image digest:
   ```bash
   aws ecs update-service \
     --cluster cocollaber-production-cluster \
     --service cocollaber-production-api \
     --task-definition cocollaber-api:PREVIOUS_REVISION
   ```
2. Database schema backwards-compatibility is maintained per ADR-002 (expand/contract schema evolution).

---

## 4. Safe Disaster Recovery Simulation Drill

A quarterly drill should be executed in an isolated non-production staging environment:
1. Trigger automated snapshot on `cocollaber-staging-pg`.
2. Delete sample staging opportunity record.
3. Perform Point-in-Time Recovery to a temporary database instance `cocollaber-staging-drill`.
4. Verify the deleted record is fully restored.
5. Destroy `cocollaber-staging-drill` with zero data impact to production.
