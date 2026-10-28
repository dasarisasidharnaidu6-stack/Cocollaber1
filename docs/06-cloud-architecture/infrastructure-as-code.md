# CoCollaber Cloud Architecture: Infrastructure as Code (IaC)

## 1. Tool Selection & Architecture Rationale

To maintain cloud portability, multi-provider support, and transparent peer review, **Terraform / OpenTofu** is selected as the primary Infrastructure-as-Code engine for CoCollaber Topology B (Managed Production).

### Key Architectural Decisions
- **Modularity**: Network, Security Groups, Database, and Compute are decoupled into distinct resource blocks.
- **Strict Least-Privilege Network Isolation**: The PostgreSQL database resides in private isolated subnets and only accepts connections from the backend ECS task security group on port 5432.
- **Zero Hardcoded Secrets**: All passwords and API keys are parameterized (`sensitive = true`) and resolved via environment variables (`TF_VAR_db_password`) or AWS Secrets Manager.
- **State Management**: Remote state is stored in an encrypted S3 bucket (`sse_algorithm = "aws:kms"`) with state locking via DynamoDB.

---

## 2. Directory & Manifest Layout

The blueprint resides under [`infra/iac/terraform/`](file:///c:/Users/SASIDHAR%20NAIDU/OneDrive/Desktop/cocollabers1/infra/iac/terraform/):

```
infra/iac/terraform/
├── main.tf                    # Core VPC, Subnets, Security Groups, RDS & ALB definitions
├── variables.tf               # Parameter schemas, constraints, and default values
├── outputs.tf                 # Exported VPC IDs, DB endpoints, and ALB DNS names
└── terraform.tfvars.example   # Sanitized configuration template
```

---

## 3. Remote State & CI/CD Validation Protocol

In CI/CD environments, static validation is executed without cloud credentials:

```bash
# 1. Format check
terraform fmt -check -recursive infra/iac/terraform/

# 2. Syntax validation (without initializing remote backend)
terraform init -backend=false infra/iac/terraform/
terraform validate infra/iac/terraform/

# 3. Security linting via tfsec or checkov
tfsec infra/iac/terraform/
```
