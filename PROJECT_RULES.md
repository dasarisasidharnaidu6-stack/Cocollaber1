# CoCollaber — Project Rules & Engineering Standards

The repository is the authoritative single source of truth for implementation decisions, requirements, architecture, and progress.

## Fundamental Operating Rules

1. **Mandatory Preflight Check**: Read `PROJECT_RULES.md`, `docs/PROGRESS.md`, relevant requirements, and the current file tree before beginning any phase.
2. **Strict Scope & Write Boundaries**: Every phase has a defined scope and permitted write locations. Do not execute work belonging to subsequent phases prematurely.
3. **Preserve Unrelated Files**: Do not modify unrelated files, and never delete or overwrite existing approved documentation without explicit instructions.
4. **No Invention or Hallucination**: Do not invent product functionality, performance metrics, testimonials, integrations, test results, mock data that masquerades as real, or completed deployments.
5. **Contract Consistency**: Maintain consistent naming conventions, interfaces, imports, data schemas, and API contracts across both frontend and backend.
6. **Architecture Decision Records**: Record important technical decisions, rationale, trade-offs, and reversibility in `docs/decisions/` or relevant phase docs.
7. **Explicit Status Tags**: Mark unresolved requirements as `OPEN` and unapproved working defaults as `ASSUMPTION`. Distinguish `CONFIRMED` and `OUT OF V1`.
8. **Document Deferred Work**: Record deferred work, architectural compromises, and technical debt under `Known limitations` in `docs/PROGRESS.md`.
9. **Empirical Verification Only**: Never claim a command, test, build, migration, or security check passed unless it actually ran and succeeded in the terminal. If a check cannot be executed due to tooling or environment constraints, explicitly record it as `NOT VERIFIED`.
10. **Resumable State**: If work is interrupted, resume execution precisely from the last verified checkpoint recorded in `docs/PROGRESS.md`.
11. **Secret & Credential Safety**: Never include real credentials, API keys, passwords, private tokens, or production secrets in committed files. Use environment variables and `.env.example` templates with safe dummy values only.
12. **Cloud & Cost Restraint**: Never provision cloud resources, enable billing, or trigger paid services without explicit authorization.

---

## Phase Permitted Write Locations

| Phase | Scope | Primary Permitted Write Locations |
|---|---|---|
| **Phase 0** | Repository Foundation & Bootstrap | `docs/00-idea/`, `docs/PROGRESS.md`, `PROJECT_RULES.md`, `README.md`, `prompts/`, `apps/api/` (skeleton only), `apps/web/` (skeleton only), Docker, config files |
| **Phase 1** | Architecture, Data Models, Security | `docs/01-architecture/`, `docs/decisions/`, `apps/api/app/db/`, `apps/api/alembic/`, `apps/api/app/core/` |
| **Phase 2** | Backend APIs & Authentication | `apps/api/app/modules/`, `apps/api/app/schemas/`, `apps/api/app/middleware/`, `apps/api/tests/`, `docs/02-api/` |
| **Phase 3** | Frontend & Design System | `apps/web/src/`, `apps/web/public/`, `docs/03-design-system/`, `packages/api-client/` |
| **Phase 4** | Integration, Motion & Hardening | `apps/web/src/motion/`, `apps/web/src/hooks/`, `apps/api/app/`, `docs/04-integration/` |
| **Phase 5** | Quality, Testing & CI/CD | `apps/*/tests/`, `.github/workflows/`, `scripts/`, `docs/05-quality/` |
| **Phase 6** | Cloud Architecture & Cost Control | `infra/`, `docs/06-cloud/` |

---

## Code Quality and Git Hygiene Rules

- **Zero Untracked Destructive Actions**: Never run destructive Git commands (`git reset --hard`, `git clean -fd`, `git push --force`).
- **Standard Code Formats**: Python code must follow PEP 8 standards (formatted with `ruff` or `black`). TypeScript code must adhere to strict type checking (`tsc --noEmit`) and ESLint.
- **Commit Granularity**: Commit messages must be structured, clear, and accurately reflect verified deliverables.
