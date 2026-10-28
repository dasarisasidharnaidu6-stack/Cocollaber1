# CoCollaber Continuous Integration Pipeline

## 1. Overview & Triggers

The CoCollaber CI pipeline is automated via GitHub Actions in [`.github/workflows/ci.yml`](file:///c:/Users/SASIDHAR%20NAIDU/OneDrive/Desktop/cocollabers1/.github/workflows/ci.yml).
It triggers on:
- All pushes to the `main` branch.
- All pull requests targeting the `main` branch.

**Security Constraints**:
- **Permissions**: Hardened to minimum required access (`permissions: contents: read`).
- **Secrets**: No production secrets or credentials are required or exposed.
- **Concurrency**: Cancels redundant in-progress pipeline runs on push (`cancel-in-progress: true`).

---

## 2. Pipeline Jobs

```
┌─────────────────────────────────┐   ┌───────────────────────────────────┐
│ Job: backend-quality            │   │ Job: frontend-quality             │
│ - Set up Python 3.12 (pip cache)│   │ - Set up Node 20 (npm cache)      │
│ - Ruff linting                  │   │ - npm ci                          │
│ - Pytest suite (25 tests)       │   │ - next lint & tsc --noEmit        │
│                                 │   │ - next build                      │
└────────────────┬────────────────┘   └─────────────────┬─────────────────┘
                 │                                      │
                 └───────────────────┬──────────────────┘
                                     │ (needs both)
                                     ▼
                      ┌───────────────────────────────┐
                      │ Job: e2e-playwright           │
                      │ - Install Playwright Chromium │
                      │ - Boot standalone Next server │
                      │ - Run 14 E2E journeys         │
                      │ - Artifact upload on failure  │
                      └──────────────┬────────────────┘
                                     │
                                     ▼
                      ┌───────────────────────────────┐
                      │ Job: dependency-security      │
                      │ - npm audit (high / critical) │
                      │ - Pre-commit secret checks    │
                      └───────────────────────────────┘
```

### Job 1: `backend-quality`
- **Environment**: `ubuntu-latest`, Python 3.12.
- **Execution**: Installs dependencies via `pip install -e "apps/api[dev]"`, verifies linting with Ruff, and runs all 25 unit and integration tests via `pytest`.

### Job 2: `frontend-quality`
- **Environment**: `ubuntu-latest`, Node.js 20.
- **Execution**: Lockfile-based install (`npm ci`), Next.js ESLint verification (`npm run lint`), TypeScript type verification (`npm run typecheck`), and production compilation (`npm run build`).

### Job 3: `e2e-playwright`
- **Prerequisites**: Requires successful completion of both `backend-quality` and `frontend-quality`.
- **Execution**: Installs headless Chromium binary (`npx playwright install --with-deps chromium`), executes all 14 end-to-end browser tests, and preserves HTML traces on unexpected failures.

### Job 4: `dependency-security`
- **Execution**: Runs automated dependency checks against the npm advisory database (`npm audit`) and pre-commit secret leak scanners (`detect-private-key`).
