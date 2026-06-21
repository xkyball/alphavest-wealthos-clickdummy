# AlphaVest WealthOS

AlphaVest WealthOS is being built as a demo-data-first web application for wealth governance workflows. The planned stack is Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Docker Compose, Playwright, and Vitest or an equivalent unit-test runner.

## Current Status

This repository is at Phase 19: Hardening and Final Handoff. The handoff pack and visual references are present, the application shell renders at `/`, the local PostgreSQL database can be migrated and seeded with deterministic AlphaVest demo data, the shell exposes demo role and tenant context switching without real authentication, every catalogue route renders through the central route registry, and all 63 catalogue pages render through normalized AlphaVest UI groups.

Phases 14-18 added stateful demo workflow coverage for J02-J09, a shared audited mutation wrapper, role-aware demo permission denials, API request validation, data-quality service checks, deterministic file metadata and metadata-only export package manifests. Phase 19 adds hardened loading, error and unknown-route states plus final handoff documentation.

The app still intentionally avoids real authentication, real client data, final financial/legal/tax advice, real object storage, binary upload/download streaming and production identity-provider authorization. Compliance release remains the guard for client visibility, and no unapproved advice should reach the client.

## Package Manager

Use pnpm. The repository pins the package manager through `package.json`:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test:playwright
pnpm phase:check
```

## Local Database

Create a local environment file from the committed example, then start Postgres and apply migrations:

```bash
cp .env.example .env
docker compose up -d postgres
pnpm db:migrate
pnpm db:seed
```

Useful database commands:

```bash
pnpm db:validate
pnpm db:generate
pnpm db:migrate
pnpm db:reset
pnpm db:studio
```

The Phase 03 seed is deterministic and reset-safe. It creates the required demo tenants:

- Bennett Family Office
- Morgan Family Office
- Northbridge Family Office
- Summit Ridge Capital

It also creates all major roles, tenant-scoped demo users, family members, entities, assets, documents, workflow records, recommendations, approvals, compliance reviews, decisions, evidence, access requests, communication, exports, ops queues, policies and audit events.

The seed includes the no-unapproved-advice invariant: only recommendations that are released to client are marked client-visible.

## Demo Session And Service Stubs

The Phase 04 shell uses a browser-local demo session provider for early testability:

- Tenant switcher: Bennett Family Office, Morgan Family Office, Northbridge Family Office and Summit Ridge Capital.
- Role switcher: Principal, Family CFO, Trustee, Next Gen, External Advisor, Analyst, Senior Wealth Advisor, Compliance Officer, Client Success, Admin and Security Officer.
- Session helpers: `currentActor()` and `currentTenant()` resolve deterministic seeded demo IDs.
- Stub services: `permissionEngine`, `visibilityEngine`, `workflowGate`, `auditService`, `evidenceService` and `exportService`.

The permission engine is deliberately permissive in Phase 04. Client visibility is still guarded by `workflowGate.canBecomeClientVisible()`, which requires recommendation release, advisor approval, compliance release, releasable evidence and an allowed permission decision. Advisor approval alone is not enough.

## Route Skeletons

Phase 05 registers all 63 catalogue pages in `lib/route-registry.ts` and exposes `routeSmokeList` for later Playwright coverage. The `app/[...segments]/page.tsx` catch-all route matches only registered catalogue paths and renders them with `RouteSkeletonPage`.

The route skeletons use the shared `AppShell`, `PageHeader`, demo session context and the no-unapproved-advice guard. They are intentionally placeholders; detailed page controls and visual implementation begin in the later page-group phases.

## Shared UI Library

Phase 06 adds reusable primitives under `components/ui/`:

- Cards and metric cards.
- Badge, status chip and workflow badge variants.
- Filter bar and dense data table.
- Modal and drawer frames.
- Wizard stepper and kanban board.
- Evidence list and audit timeline.
- Loading, empty, error, blocked and restricted state panels.

The `/` route now renders a Phase 06 component preview using demo data. Route skeletons remain registered and can consume these components in later page phases.

## Auth And Onboarding UI

Phase 07 implements the first page-specific screen group:

- `/login` renders the demo login surface with security/privacy context.
- `/mfa` renders a modal-capable MFA challenge over a protected workspace preview.
- `/onboarding/invite` renders invitation acceptance with tenant, role and expiry details.
- `/onboarding/identity` renders identity setup and data-minimisation messaging.
- `/onboarding/consent` renders consent acknowledgement with an interactive privacy notice modal.
- `/onboarding/role-confirmation` renders scoped role confirmation with allowed and blocked actions.

The routes use `components/auth-onboarding-screen.tsx` and centralized demo data in `lib/auth-onboarding-demo-data.ts`. They remain demo-only and do not create sessions, submit credentials, persist consent, or activate real permissions.

Run the Phase 07 route smoke script against a running local dev server:

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
pnpm smoke:phase07
```

## Admin And Platform UI

Phase 08 implements the second page-specific screen group:

- `/admin/platform` renders global platform settings with critical-change confirmation.
- `/admin/policies/advice-boundary` renders the advice-boundary policy matrix and release controls.
- `/admin/roles` renders role templates and a permission-change confirmation modal.
- `/admin/security` renders security configuration with critical security confirmation.
- `/admin/evidence-templates` renders evidence template management.
- `/admin/export-templates` renders export template and redaction controls.
- `/admin/tenants` renders the tenant list and onboarding readiness surface.
- `/tenants/new` renders a create-tenant wizard.
- `/tenants/demo/setup`, `/tenants/demo/team`, `/tenants/demo/policies` and `/tenants/demo/users` render the tenant setup, team, policy and user administration surfaces.

The routes use `components/admin-tenant-setup-screen.tsx` and centralized demo data in `lib/admin-tenant-setup-demo-data.ts`. They remain demo-only and do not persist settings, permissions, security configuration, tenant records or user invitations.

Run the Phase 08 route smoke script against a running local dev server:

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
pnpm smoke:phase08
```

## Client, Family, Entity And Document Intake UI

Phase 09 implements the third page-specific screen group:

- `/portal` renders a client wealth-governance dashboard with readiness, actions, pending decisions, missing documents, advisor messages and evidence/governance status.
- `/mobile` renders a mobile-first next-step surface with blocked recommendation status and priority actions.
- `/client/profile`, `/client/family-members` and `/relationships` render family profile, member governance and relationship-map intake surfaces.
- `/entities`, `/entities/new` and `/entities/demo` render entity list, entity wizard and entity detail surfaces.
- `/documents`, `/documents/upload`, `/documents/extraction-review` and `/documents/verification-pending` render document list, upload, AI extraction review and human-verification status surfaces.

The routes use `components/client-intake-screen.tsx` and centralized demo data in `lib/client-intake-demo-data.ts`. They remain demo-only and do not persist profile edits, entity creation, uploads, extraction edits or final verification decisions.

Run the Phase 09 route smoke script against a running local dev server:

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
pnpm smoke:phase09
```

## Wealth Map And Action Board

Phase 10 implements the fourth page-specific screen group:

- `/wealth-map` renders a live wealth-structure map with filters, legend, graph nodes, object-level restricted nodes, conflict/gap markers and a right-side detail drawer.
- `/actions` renders a workflow action board with metrics, grouped kanban columns, priority and evidence states, a blocked missing-evidence example and a right-side action detail drawer.

The routes use `components/wealth-actions-screen.tsx` and centralized demo data in `lib/wealth-actions-demo-data.ts`. They remain demo-only and do not persist graph edits, action state changes, evidence uploads, due-date changes or workflow transitions.

Run the Phase 10 route smoke script against a running local dev server:

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
pnpm smoke:phase10
```

## Internal Workflow And Compliance UI

Phase 11 implements the fifth page-specific screen group:

- `/signals` renders signal review and routing with low-confidence and missing-data states.
- `/workbench` renders the consultant workbench with client queue, trigger queue, draft recommendations, data quality and a household drawer.
- `/workbench/triggers/demo` renders trigger detail with restricted entity access, analyst notes, gaps, escalation and audit status.
- `/advisor-approval` renders the advisor approval queue with filters, metrics, table and selected-review panel.
- `/advisor-approval/demo` renders the advisor approval detail with recommendation review, documents, risk, alternatives and decision controls.
- `/compliance` renders the compliance queue with release-sensitive review states.
- `/compliance/demo/review` renders compliance review detail with classification, evidence completeness, policy checks, notes, audit references and blocked release gates.
- `/compliance/demo/release` renders the release-to-client confirmation modal state over an approved compliance review.

The routes use `components/internal-workflow-screen.tsx` and centralized demo data in `lib/internal-workflow-demo-data.ts`. They remain demo-only and do not persist signal routing, workbench edits, advisor decisions, compliance outcomes, release confirmations or audit events.

Run the Phase 11 route smoke script against a running local dev server:

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
pnpm smoke:phase11
```

## Decisions, Evidence And Governance UI

Phase 12 implements the sixth page-specific screen group:

- `/compliance/demo/block` renders the compliance block and request-evidence modal state.
- `/compliance/demo/audit` renders the audit and exception log with metrics, filters, table and controlled export state.
- `/decisions` renders the released decision list with client-facing status, filters and restricted/empty/loading states.
- `/decisions/demo` renders the digital decision room with release guardrail, options, risks, approvals and decision actions.
- `/decisions/demo/success` renders the immutable decision-submitted success state and evidence package creation summary.
- `/evidence` renders the evidence vault with filters, table and preview drawer.
- `/evidence/demo` renders evidence record detail with provenance, access, audit timeline and preview.
- `/governance/users` renders governance users with invite drawer.
- `/governance/roles` renders role management with permissions drawer and sensitive-change confirmation modal.
- `/governance/access-requests` renders access request review with approval drawer and policy checks.

The routes use `components/decisions-governance-screen.tsx` and centralized demo data in `lib/decisions-governance-demo-data.ts`. They remain demo-only and do not persist compliance blocks, decision actions, evidence access, role changes, user invitations or access-request approvals.

Run the Phase 12 route smoke script against a running local dev server:

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
pnpm smoke:phase12
```

## Communication, Export, Ops And Reference UI

Phase 13 implements the final page-specific screen group:

- `/governance/audit-history` renders immutable access audit history with filters, table states and event detail drawer.
- `/communication` renders the communication centre with decision tree, message builder, preview and release gate.
- `/communication/call-trigger` renders the call-trigger matrix with scenario factors, recommended path and escalation states.
- `/export/new` renders export creation with wizard steps, permission-blocked state and summary panel.
- `/export/demo/scope` renders export scope selection with object-level access states.
- `/export/demo/redaction` renders export redaction with preview, mandatory redaction warning and external/internal visibility split.
- `/export/demo/preview` renders export preview with policy checks and approval confirmation modal.
- `/export/demo/download` renders export download/share completion with audit timeline and secure-share confirmation modal.
- `/ops/queues` renders operations queues with backlog, capacity, SLA and overload/error states.
- `/ops/sla` renders SLA and escalation monitoring with breaches, escalation summary and business-unit health.
- `/service-blueprint` renders the internal service blueprint swimlane reference.
- `/roadmap` renders roadmap and scope control with dependency, blocked-feature and no-unapproved-advice guardrails.
- `/states` renders the state and badge reference catalogue.

The routes use `components/communication-export-ops-screen.tsx` and centralized demo data in `lib/communication-export-ops-demo-data.ts`. They remain demo-only and do not send communications, generate exports, download files, create share links, reassign ops queues, persist escalations or mutate reference data.

Run the Phase 13 route smoke script against a running local dev server:

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
pnpm smoke:phase13
```

## Source Of Truth

Before implementation, read `AGENTS.md` first. It routes work to the active
source package for the selected workstream.

Current active workstream sources:

- UX refactoring: `ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md` and `ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md`. Repository override `UX_IMPLEMENTATION_HANDOFF_MISSING_POLICY_OVERRIDDEN` makes the imported UX matrix and task master sufficient for scoped UX execution; `ALPHAVEST_UX_REFACTORING_IMPLEMENTATION_HANDOFF.md` is optional convenience output, not a blocker.
- DB-backed tables/forms: `ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md` plus `ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md`.
- E2E Journey Proof 25: `ALPHAVEST_E2E_JOURNEY_PROOF_25_CODEX_TASK_PACK.md`.
- Broad SCF work outside focused workstreams: `ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md`, bounded by `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md` and `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`.

Older First-Build, BP/AV-FB, MVP, minimum-path, V3 and previous handoff/task
files are supporting references only unless `AGENTS.md` or an active workstream
source explicitly elevates them.

## Product Guardrails

- Digital first.
- Human reviewed.
- Evidence backed.
- No unapproved advice reaches the client.
- Advisor approval alone is not enough.
- Compliance release controls client visibility.
- Evidence is created by default for important actions.
- Sensitive actions create audit events.

## First Build Phase Reports

After each phase, update:

- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

The final Phase 19 handoff is documented in `docs/v3/FINAL_HANDOFF_REPORT.md`.
