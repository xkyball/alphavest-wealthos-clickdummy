# Codex Tasks Detailed V3

These tasks are designed for phased execution. Use `PHASE_TO_RUN` in the master prompt.

## Phase P0 — Operationalization Foundations / Guardrails

### Goal

Create the project contract that prevents later work from overclaiming static UI, metadata-only behavior or `actionId`-only demo journeys as operational capability.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/CAPABILITY_TRUTH_AUDIT_V3.md`
- `docs/v3/CAPABILITY_GAP_BACKLOG_V3.md`
- `docs/v3/INPUT_MASK_REQUIREMENTS_V3.md`
- `docs/v3/INPUT_MASK_AND_DATA_MAINTENANCE_REQUIREMENTS_V3.md`
- `docs/v3/WORKFLOW_EXECUTION_REALITY_MATRIX_V3.md`
- Human Visual Implementation Standard

### Tasks

1. Define the Operationalization task structure.
2. Define Capability Levels E0-E7 as the mandatory reporting vocabulary.
3. Define project-wide Definition of Done for future operational tasks.
4. Define the QA/proof matrix for visual, workflow, payload, file, export, evidence, audit, gate and client-visibility claims.
5. Define Human Visual Acceptance Gates and separate them from DOM/test success.
6. Anchor the contract in master task and quality gates.
7. Update phase and QA reports.

### Quality gates

- No product feature, UI route, API, schema change or workflow mutation is implemented.
- Later tasks must state current and target E-level before operational claims.
- Static UI, read-only fields, metadata-only export/upload and `actionId`-only demo actions are explicitly disallowed as operational claims.
- P0 reports list changed files, checks run and residual risks.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` and `docs/v3/IMPLEMENTATION_QA_REPORT.md` with P0 completion, changed files, commands run, known gaps and next-phase recommendation.


## Phase 00 — Repository and Project Setup

### Goal
Manual/repo baseline and project scaffolding only. No feature build yet.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Inspect repository root and report current state before changing files.
2. Confirm or create package manager decision. Prefer pnpm unless existing repo uses another tool.
3. Create `.env.example`, `.gitignore`, `README.md` baseline if missing.
4. Create folder structure: `app`, `components`, `features`, `lib`, `docs/v3`, `public/reference` as needed.
5. Copy this handoff structure into the repository without overwriting existing important project files unless explicitly instructed.
6. Produce `docs/v3/REPO_INTAKE_REPORT.md`.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 01 — Next.js / React / Tailwind Foundation

### Goal
Initialize application shell and AlphaVest design tokens.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Initialize or verify Next.js App Router with TypeScript.
2. Install and configure Tailwind CSS.
3. Create global CSS variables and Tailwind tokens for AlphaVest navy, midnight, charcoal, ivory and champagne-gold.
4. Implement `AppShell`, `Sidebar`, `TopBar`, `PageHeader`.
5. Create a demo landing page that proves the design system renders.
6. Do not implement real auth yet.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 02 — Docker Compose + PostgreSQL + Prisma

### Goal
Database and ORM foundation.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Create Docker Compose with PostgreSQL and a healthcheck.
2. Configure Prisma with PostgreSQL DATABASE_URL.
3. Create initial Prisma schema file from `prisma_reference/schema.prisma` as a guide.
4. Add scripts for `db:migrate`, `db:seed`, `db:studio`, `db:reset`.
5. Ensure local database can be started and migrated.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 03 — Data Model and Demo Seed System

### Goal
Implement Prisma schema and reproducible dummy data.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Implement core data model in Prisma. Do not overcomplicate relations if MVP needs simplification; document simplifications.
2. Implement deterministic seed system for demo tenants, roles, users, families, entities, documents, workflows, compliance and evidence.
3. Seed at least four tenants and all major roles.
4. Seed every page group with realistic data and states.
5. No real client data.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 04 — Demo Session, Role/Tenant Switcher and Service Stubs

### Goal
Enable fast testing without real auth.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Create `demoSession` with current actor, role and tenant.
2. Implement role switcher and tenant switcher in TopBar.
3. Create permissive `permissionEngine.can()` but keep signature future-proof.
4. Create `visibilityEngine`, `workflowGate`, `auditService`, `evidenceService`, `exportService` stubs.
5. Implement No-Unapproved-Advice gate as workflow logic even while auth remains demo-only.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 05 — Route Skeleton for All 63 Pages

### Goal
Every route renders using AppShell and placeholders.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Create all 63 routes listed in `SCREEN_CATALOGUE_V3.md`.
2. Each route must render AppShell, PageHeader, placeholder main area and demo context.
3. No route should 404.
4. Create central route registry with route, page ID, role family and navigation grouping.
5. Add a route smoke list for later Playwright tests.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 06 — Shared UI Component Library

### Goal
Build normalized design system components.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Implement normalized components used by all pages: Card, MetricCard, Badge, StatusChip, WorkflowBadge, Table, FilterBar, Modal, Drawer, WizardStepper, Kanban, EvidenceList, AuditTimeline.
2. Normalize dimensions and spacing against visual references, but do not pixel-copy each generated screen.
3. Ensure all components support dark AlphaVest theme and accessible contrast.
4. Create demo state variants: loading, empty, error, blocked, restricted.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 07 — Auth and Onboarding UI Pages

### Goal
Implement pages 001–006.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Screens to implement in this phase

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 001 | /login | Authentication login | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-001-login.png |
| 002 | /mfa | Multi-factor authentication | MODAL_CAPABLE_AUTH_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-002-mfa.png |
| 003 | /onboarding/invite | Invitation acceptance | WIZARD_OR_STEP_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-003-onboarding-invite.png |
| 004 | /onboarding/identity | Identity setup | WIZARD_OR_STEP_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-004-onboarding-identity.png |
| 005 | /onboarding/consent | Consent and privacy acknowledgement | PAGE_WITH_POLICY_MODAL_AVAILABLE | public/reference/page_ui_v3/clean_pages/PAGE-005-onboarding-consent.png |
| 006 | /onboarding/role-confirmation | Role confirmation | WIZARD_OR_STEP_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-006-onboarding-role-confirmation.png |

### Tasks

1. For every screen listed, inspect its image in `public/reference/page_ui_v3/clean_pages/` before coding.
2. Implement route UI using shared components only unless a new reusable component is required.
3. Respect modal/drawer/overlay visual mode exactly at the interaction-pattern level.
4. Do not render metadata/spec text from prompts; only implement actual UI.
5. Use seeded data; do not hardcode one-off dummy text inside components unless it belongs to seed data.
6. Implement default state and at least one specified non-default state where feasible.
7. Update navigation and route registry.
8. Add or update smoke tests for every route in this phase.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 08 — Admin, Platform and Tenant Setup Pages

### Goal
Implement pages 007–018.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Screens to implement in this phase

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 007 | /admin/platform | Platform settings | PAGE_WITH_SECOND_CONFIRMATION_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-007-admin-platform.png |
| 008 | /admin/policies/advice-boundary | Advice boundary policy | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-008-admin-policies-advice-boundary.png |
| 009 | /admin/roles | Global role templates | PAGE_WITH_PERMISSION_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-009-admin-roles.png |
| 010 | /admin/security | Security configuration | PAGE_WITH_SECOND_CONFIRMATION_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-010-admin-security.png |
| 011 | /admin/evidence-templates | Evidence templates | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-011-admin-evidence-templates.png |
| 012 | /admin/export-templates | Export templates and redaction | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-012-admin-export-templates.png |
| 013 | /admin/tenants | Tenant list | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-013-admin-tenants.png |
| 014 | /tenants/new | Create client tenant | WIZARD_OR_STEP_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-014-tenants-new.png |
| 015 | /tenants/:id/setup | Tenant setup dashboard | WIZARD_OR_STEP_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-015-tenants-id-setup.png |
| 016 | /tenants/:id/team | Assign AlphaVest team | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-016-tenants-id-team.png |
| 017 | /tenants/:id/policies | Tenant policies | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-017-tenants-id-policies.png |
| 018 | /tenants/:id/users | Tenant users | PAGE_WITH_INVITE_ROLE_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-018-tenants-id-users.png |

### Tasks

1. For every screen listed, inspect its image in `public/reference/page_ui_v3/clean_pages/` before coding.
2. Implement route UI using shared components only unless a new reusable component is required.
3. Respect modal/drawer/overlay visual mode exactly at the interaction-pattern level.
4. Do not render metadata/spec text from prompts; only implement actual UI.
5. Use seeded data; do not hardcode one-off dummy text inside components unless it belongs to seed data.
6. Implement default state and at least one specified non-default state where feasible.
7. Update navigation and route registry.
8. Add or update smoke tests for every route in this phase.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 09 — Client, Family, Entity and Document Intake Pages

### Goal
Implement pages 019–030.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Screens to implement in this phase

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 019 | /portal | Client web dashboard | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-019-portal.png |
| 020 | /mobile | Mobile home / next step today | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-020-mobile.png |
| 021 | /client/profile | Client profile | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-021-client-profile.png |
| 022 | /client/family-members | Family members | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-022-client-family-members.png |
| 023 | /relationships | Relationship map | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-023-relationships.png |
| 024 | /entities | Entity list | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-024-entities.png |
| 025 | /entities/new | Create entity | WIZARD_OR_STEP_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-025-entities-new.png |
| 026 | /entities/:id | Entity detail | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-026-entities-id.png |
| 027 | /documents | Documents list | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-027-documents.png |
| 028 | /documents/upload | Document upload | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-028-documents-upload.png |
| 029 | /documents/extraction-review | Extraction review | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-029-documents-extraction-review.png |
| 030 | /documents/verification-pending | Verification pending | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-030-documents-verification-pending.png |

### Tasks

1. For every screen listed, inspect its image in `public/reference/page_ui_v3/clean_pages/` before coding.
2. Implement route UI using shared components only unless a new reusable component is required.
3. Respect modal/drawer/overlay visual mode exactly at the interaction-pattern level.
4. Do not render metadata/spec text from prompts; only implement actual UI.
5. Use seeded data; do not hardcode one-off dummy text inside components unless it belongs to seed data.
6. Implement default state and at least one specified non-default state where feasible.
7. Update navigation and route registry.
8. Add or update smoke tests for every route in this phase.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 10 — Wealth Map and Action Board

### Goal
Implement pages 031–032.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Screens to implement in this phase

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 031 | /wealth-map | Live wealth map | PAGE_WITH_SIDE_DRAWER | public/reference/page_ui_v3/clean_pages/PAGE-031-wealth-map.png |
| 032 | /actions | Action board | PAGE_WITH_SIDE_DRAWER | public/reference/page_ui_v3/clean_pages/PAGE-032-actions.png |

### Tasks

1. For every screen listed, inspect its image in `public/reference/page_ui_v3/clean_pages/` before coding.
2. Implement route UI using shared components only unless a new reusable component is required.
3. Respect modal/drawer/overlay visual mode exactly at the interaction-pattern level.
4. Do not render metadata/spec text from prompts; only implement actual UI.
5. Use seeded data; do not hardcode one-off dummy text inside components unless it belongs to seed data.
6. Implement default state and at least one specified non-default state where feasible.
7. Update navigation and route registry.
8. Add or update smoke tests for every route in this phase.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 11 — Internal Workflow and Compliance Pages

### Goal
Implement pages 033–040.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Screens to implement in this phase

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 033 | /signals | Signal / trigger review | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-033-signals.png |
| 034 | /workbench | Consultant workbench | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-034-workbench.png |
| 035 | /workbench/triggers/:id | Trigger detail / analyst notes | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-035-workbench-triggers-id.png |
| 036 | /advisor-approval | Advisor approval queue | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-036-advisor-approval.png |
| 037 | /advisor-approval/:id | Advisor approval detail | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-037-advisor-approval-id.png |
| 038 | /compliance | Compliance queue | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-038-compliance.png |
| 039 | /compliance/:id/review | Compliance review detail | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-039-compliance-id-review.png |
| 040 | /compliance/:id/release | Release to client | RELEASE_CONFIRMATION_MODAL_STATE | public/reference/page_ui_v3/clean_pages/PAGE-040-compliance-id-release.png |

### Tasks

1. For every screen listed, inspect its image in `public/reference/page_ui_v3/clean_pages/` before coding.
2. Implement route UI using shared components only unless a new reusable component is required.
3. Respect modal/drawer/overlay visual mode exactly at the interaction-pattern level.
4. Do not render metadata/spec text from prompts; only implement actual UI.
5. Use seeded data; do not hardcode one-off dummy text inside components unless it belongs to seed data.
6. Implement default state and at least one specified non-default state where feasible.
7. Update navigation and route registry.
8. Add or update smoke tests for every route in this phase.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 12 — Decisions, Evidence and Governance Pages

### Goal
Implement pages 041–050.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Screens to implement in this phase

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 041 | /compliance/:id/block | Block / request evidence | BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE | public/reference/page_ui_v3/clean_pages/PAGE-041-compliance-id-block.png |
| 042 | /compliance/:id/audit | Audit / exception log | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-042-compliance-id-audit.png |
| 043 | /decisions | Decision list | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-043-decisions.png |
| 044 | /decisions/:id | Digital decision room | PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION | public/reference/page_ui_v3/clean_pages/PAGE-044-decisions-id.png |
| 045 | /decisions/:id/success | Decision submitted | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-045-decisions-id-success.png |
| 046 | /evidence | Evidence vault | PAGE_WITH_SIDE_DRAWER | public/reference/page_ui_v3/clean_pages/PAGE-046-evidence.png |
| 047 | /evidence/:id | Evidence record detail | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-047-evidence-id.png |
| 048 | /governance/users | Governance users | PAGE_WITH_USER_DRAWER_OR_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-048-governance-users.png |
| 049 | /governance/roles | Role management | PAGE_WITH_ROLE_DRAWER_AND_SECOND_CONFIRMATION_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-049-governance-roles.png |
| 050 | /governance/access-requests | Access requests | PAGE_WITH_APPROVAL_DRAWER | public/reference/page_ui_v3/clean_pages/PAGE-050-governance-access-requests.png |

### Tasks

1. For every screen listed, inspect its image in `public/reference/page_ui_v3/clean_pages/` before coding.
2. Implement route UI using shared components only unless a new reusable component is required.
3. Respect modal/drawer/overlay visual mode exactly at the interaction-pattern level.
4. Do not render metadata/spec text from prompts; only implement actual UI.
5. Use seeded data; do not hardcode one-off dummy text inside components unless it belongs to seed data.
6. Implement default state and at least one specified non-default state where feasible.
7. Update navigation and route registry.
8. Add or update smoke tests for every route in this phase.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 13 — Communication, Export, Ops and Reference Pages

### Goal
Implement pages 051–063.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Screens to implement in this phase

| Page | Route | Purpose | Visual mode | Visual |
| --- | --- | --- | --- | --- |
| 051 | /governance/audit-history | Access audit history | PAGE_WITH_SIDE_DRAWER | public/reference/page_ui_v3/clean_pages/PAGE-051-governance-audit-history.png |
| 052 | /communication | Communication centre | PREVIEW_PAGE_OR_PANEL | public/reference/page_ui_v3/clean_pages/PAGE-052-communication.png |
| 053 | /communication/call-trigger | Call trigger matrix | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-053-communication-call-trigger.png |
| 054 | /export/new | Create export | WIZARD_OR_STEP_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-054-export-new.png |
| 055 | /export/:id/scope | Export scope selection | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-055-export-id-scope.png |
| 056 | /export/:id/redaction | Export redaction | PREVIEW_PAGE_OR_PANEL | public/reference/page_ui_v3/clean_pages/PAGE-056-export-id-redaction.png |
| 057 | /export/:id/preview | Export preview | PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL | public/reference/page_ui_v3/clean_pages/PAGE-057-export-id-preview.png |
| 058 | /export/:id/download | Export download/share | DOWNLOAD_CONFIRMATION_STATE | public/reference/page_ui_v3/clean_pages/PAGE-058-export-id-download.png |
| 059 | /ops/queues | Ops queues | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-059-ops-queues.png |
| 060 | /ops/sla | SLA and escalation | NORMAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-060-ops-sla.png |
| 061 | /service-blueprint | Service blueprint | REFERENCE_ONLY_INTERNAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-061-service-blueprint.png |
| 062 | /roadmap | MVP vs future scope | REFERENCE_ONLY_INTERNAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-062-roadmap.png |
| 063 | /states | State and badge reference | REFERENCE_ONLY_INTERNAL_PAGE | public/reference/page_ui_v3/clean_pages/PAGE-063-states.png |

### Tasks

1. For every screen listed, inspect its image in `public/reference/page_ui_v3/clean_pages/` before coding.
2. Implement route UI using shared components only unless a new reusable component is required.
3. Respect modal/drawer/overlay visual mode exactly at the interaction-pattern level.
4. Do not render metadata/spec text from prompts; only implement actual UI.
5. Use seeded data; do not hardcode one-off dummy text inside components unless it belongs to seed data.
6. Implement default state and at least one specified non-default state where feasible.
7. Update navigation and route registry.
8. Add or update smoke tests for every route in this phase.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 14 — Workflow Lifecycle Integration

### Goal
Connect document, trigger, recommendation, approval, compliance, decision, evidence, export and access request states.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Integrate previously built pages with actual workflow/data/service logic.
2. Centralize state transitions, avoid scattered conditional rendering.
3. Update tests and docs.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 15 — Testing Baseline

### Goal
Unit, route smoke and core Playwright flows.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Integrate previously built pages with actual workflow/data/service logic.
2. Centralize state transitions, avoid scattered conditional rendering.
3. Update tests and docs.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 16 — Role-Aware Permissions and Tenant Isolation

### Goal
Turn permissive security stubs into demo role-aware checks.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Integrate previously built pages with actual workflow/data/service logic.
2. Centralize state transitions, avoid scattered conditional rendering.
3. Update tests and docs.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 17 — API/Data Quality and Validation

### Goal
Introduce repository layer, service functions and validation schemas.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Integrate previously built pages with actual workflow/data/service logic.
2. Centralize state transitions, avoid scattered conditional rendering.
3. Update tests and docs.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 18 — File/Export Realism

### Goal
Move from mocked file/export metadata toward implementable upload/export architecture.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Integrate previously built pages with actual workflow/data/service logic.
2. Centralize state transitions, avoid scattered conditional rendering.
3. Update tests and docs.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.

## Phase 19 — Hardening and Final Handoff

### Goal
Accessibility, errors, loading, docs, QA and final report.

### Required inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/VISUAL_ASSET_MANIFEST_V3.md`

### Tasks

1. Integrate previously built pages with actual workflow/data/service logic.
2. Centralize state transitions, avoid scattered conditional rendering.
3. Update tests and docs.

### Quality gates

- Build must pass or failures must be documented.
- Design must remain visually homogeneous.
- No old spec annotations appear in UI.
- Demo data must be sufficient to view the phase output.
- Phase report must be updated.

### Required phase report

Update `docs/v3/PHASE_EXECUTION_REPORT.md` with completed tasks, changed files, tests run, known gaps and next-phase recommendation.
