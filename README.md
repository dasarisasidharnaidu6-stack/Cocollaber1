# CoCollaber

> *"What opportunity are you looking for, and what opportunity can you offer?"*

CoCollaber is an open, global, domain-agnostic opportunity and collaboration ecosystem connecting people, opportunities, and projects across technology, arts, sports, business, research, and grassroots initiatives.

---

## Architecture Overview

- **Core Model:** People &harr; Opportunities &harr; People
- **Core Loop:** Express &rarr; Discover &rarr; Connect &rarr; Collaborate &rarr; Grow &rarr; Create
- **Backend:** FastAPI (Python 3.12) with modular REST architecture
- **Frontend:** Next.js (v14 App Router) with strict TypeScript
- **Database:** PostgreSQL (with full-text search)
- **Brand Palette:** Cream (`#F8EFE3`), Dark Cocoa (`#3B1E08`), Medium Mocha (`#8B5A36`), Warm Sand (`#DDAA66`), Soft Caramel (`#F1C888`)

---

## Repository Structure

```text
cocollaber/
├── README.md                   # Project overview & local setup guide
├── PROJECT_RULES.md            # Repository governance & phase rules
├── Makefile                    # Developer workflow commands
├── docker-compose.yml          # Container configuration (API, Web, DB)
├── .env.example                # Safe environment variable template
├── prompts/                    # Phase playbooks (Phase 00 - 06)
├── docs/                       # Project specifications & architecture
│   ├── PROGRESS.md             # Authoritative phase progress tracker
│   ├── 00-idea/                # Product requirements & open decisions
│   ├── 01-architecture/        # System design & database schemas (Phase 1)
│   ├── 02-api/                 # API contracts & authentication specs (Phase 2)
│   ├── 03-design-system/       # Design tokens & UI component specs (Phase 3)
│   ├── 04-integration/         # Integration specs & motion (Phase 4)
│   ├── 05-quality/             # Test plans & quality gates (Phase 5)
│   ├── 06-cloud/               # Cloud infrastructure & deployment (Phase 6)
│   └── decisions/              # Architecture Decision Records (ADRs)
├── apps/
│   ├── api/                    # FastAPI backend service
│   │   ├── app/                # Application core, schemas, modules
│   │   ├── tests/              # Pytest unit & integration suites
│   │   └── pyproject.toml      # Python dependencies
│   └── web/                    # Next.js App Router frontend
│       ├── src/                # Layouts, pages, design system
│       ├── public/             # Static brand assets
│       └── package.json        # Frontend dependencies
├── packages/
│   └── api-client/             # Shared TypeScript API client (Phase 3)
├── infra/                      # Docker, IaC, and monitoring manifests
└── scripts/                    # Maintenance & seed scripts
```

---

## Local Development Setup

### Prerequisites
- Python 3.12+
- Node.js 20+ & npm 10+
- (Optional) Docker & Docker Compose

### Native Execution (Lightweight / Low RAM)

1. **Configure Environment:**
   ```bash
   cp .env.example .env
   ```

2. **Backend API:**
   ```bash
   # Run directly with uvicorn
   python -m uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   - Health Check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
   - Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

3. **Frontend Web:**
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```
   - Web App: [http://localhost:3000](http://localhost:3000)

4. **Run Verification Tests:**
   ```bash
   # Backend tests
   python -m pytest apps/api/tests/unit -v

   # Frontend type check
   cd apps/web && npm run typecheck
   ```

### Containerized Execution (Docker)

```bash
docker compose up -d
```

---

## Development Principles & Guidelines

Read `PROJECT_RULES.md` for operational standards, write boundary limitations, and empirical verification procedures.
