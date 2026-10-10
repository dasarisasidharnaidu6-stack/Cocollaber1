# PHASE 0 — CO-COLLABER REPOSITORY FOUNDATION & PROJECT BOOTSTRAP

## 1. Your Role

Act as a **Principal Software Architect, Staff Engineer, DevOps Engineer, and Technical Documentation Lead**.

You are working on CoCollaber, a real product intended to evolve into a production-grade, global opportunity and collaboration platform.

Your job in Phase 0 is to establish the project's verified foundation. Do not start implementing the actual product features yet.

Work directly inside the currently opened CoCollaber GitHub-connected repository using the existing Antigravity workspace.

**Priority order:**
1. Preserve existing work.
2. Understand the product requirements.
3. Establish a consistent repository structure.
4. Create documented, minimal runnable application skeletons.
5. Verify everything possible using actual commands.
6. Record the precise completion status and next steps.

Do not generate a separate imaginary project, duplicate the repository, or assume files exist without inspecting them.

---

## 2. Mandatory Preflight — Inspect Before Editing

Before creating, moving, deleting, or modifying anything:

1. Print the current working directory and inspect the entire repository file tree.
2. Inspect Git status, current branch, latest commits, and configured remotes.
3. Identify all existing documentation, including:
   - Idea Document.
   - Product Requirements Document (PRD).
   - Software Requirements Specification (SRS).
   - Ultimate Master Prompt.
   - Existing README and project instructions.
   - Existing architecture, API, frontend, backend, and deployment files.
4. Read all available project-defining documents relevant to Phase 0.
5. Determine whether the repository is empty, partially initialized, or already contains a working application.
6. Identify the framework, language, package manager, and application entry points already in use.
7. Check whether `Idea_Document_v1.pdf` exists. If it does not, search the repository for an equivalent source document. Do not fabricate or reconstruct missing documents.
8. Compare the existing repository with the target structure specified below.

### Preservation rules

- Do not delete existing files simply because they are not part of the proposed structure.
- Do not overwrite the existing PRD, SRS, Idea Document, or other approved documentation.
- Do not replace a working frontend with a generic placeholder.
- Do not replace existing backend functionality with a new skeleton.
- If the existing stack differs from the proposed stack, document the difference and recommend the smallest safe path forward.
- If the repository contains conflicting requirements, identify them and record the conflict.
- If a required input is genuinely missing and blocks implementation, ask a concise question rather than inventing content.
- Never run destructive Git commands, reset user changes, force-push, or discard uncommitted work.

---

## 3. Product Definition — Preserve Exactly

**Product name:** CoCollaber

**Central question:**
"What opportunity are you looking for, and what opportunity can you offer?"

### Confirmed product concepts
- CoCollaber is a global, domain-agnostic opportunity and collaboration platform.
- Its foundational model is People ↔ Opportunities ↔ People.
- Its core loop is Express → Discover → Connect → Collaborate → Grow → Create.
- People can seek opportunities and create opportunities.
- One person can have multiple identities, interests, and capabilities.
- Opportunities can be paid or unpaid. Compensation is never mandatory.
- The platform is not merely a professional networking site, job portal, freelance marketplace, social feed, or forum.
- The product must be open and inclusive, opportunity-first, simple, transparent, and designed around fluid roles.
- Trust and safety must be foundational.
- Compensation and the nature of an opportunity must be transparent.

### Features outside the confirmed v1 scope
- Reputation scoring.
- AI-based or smart matching.
- Organization and community hubs.
- Event and competition management.
- Mentorship features.
- On-platform payments.
- Portfolios.
- Regional expansion features.

---

## 4. Repository Is the Single Source of Truth
Follow the 12 rules codified in `PROJECT_RULES.md`.

---

## 5. Phase 0 Deliverables
- Task A: Analyze product documentation (`docs/00-idea/requirements.md`)
- Task B: Document open decisions (`docs/00-idea/open-decisions.md`)
- Task C: Create repository structure
- Task D: Establish technology skeleton (FastAPI backend + Next.js App Router frontend)
- Task E: Enforce official brand (Cream, Dark Cocoa, Medium Mocha, Warm Sand, Soft Caramel)
- Task F: Configure local development (Docker Compose, Makefile, `.env.example`, linters)
- Task G: Create progress tracking (`docs/PROGRESS.md`)
- Task H: Prepare next-phase prompts (`prompts/phase-00.md` through `prompts/phase-06.md`)

---

## 6. Strict Scope Boundaries
No business logic, no authentication flows, no mock database migrations, no cloud provisioning.

---

## 7. Acceptance Gate
All checks verified and documented before Phase 1 begins.
