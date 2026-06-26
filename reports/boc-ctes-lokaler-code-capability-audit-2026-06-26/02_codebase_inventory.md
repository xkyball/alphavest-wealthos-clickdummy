# Codebase Inventory

Ticket: `ANALYSIS-1.1.2`  
Status: `DONE`  
Scope: structural repo inventory without capability-completeness claims.

## Repository Shape

| Area | Local path(s) | Evidence class | Observed role |
| --- | --- | --- | --- |
| Next.js app routes | `app/**` | Code Fact | Catch-all screen renderer, static app shell pages, API routes, journey pages and framework files. |
| API handlers | `app/api/**/route.ts` | Code Fact | Local HTTP/API surfaces for auth demo, tenant/profile/family/entity/document/review/export/journey/search/ops workflows. |
| Screen components | `components/**` | Code Fact | Primary UI surfaces and shared UI primitives. |
| Service/domain layer | `lib/**` | Code Fact | Route registry, permissions, visibility, workflow gates, audit service, demo data, Prisma services and command buses. |
| DB schema/migrations/seed | `prisma/schema.prisma`, `prisma/migrations/**`, `prisma/seed.ts` | Schema Fact | PostgreSQL/Prisma data model and migration history. |
| Tests | `tests/**` | Test Fact | Playwright/test suite with route, API, workflow, safety, visibility, lifecycle and acceptance specs. |
| Scripts | `scripts/**`, `package.json` scripts | Code Fact / Runtime candidate | Build/test/guard/capture/screencast/report helper commands. |
| Docs/reports | `docs/**`, root `*.md`, `reports/**` | Documentation Claim unless generated in this run | Prior specs, manuals, proof reports and older audit packages. |
| Public/reference assets | `public/reference/page_ui_v3/clean_pages/**` | Visual reference | Page-level UI design reference, not pixel-perfect contract. |
| Generated/build output | `.next/**`, `test-results/**`, `artifacts/**`, `tmp/**` | Generated artifact | Only current-run outputs or intentionally cited artifacts count as proof. |

## Route Registry Inventory

Command used: `pnpm exec tsx -e "import { screenRoutes } from './lib/route-registry'; ..."`  
Evidence: `lib/route-registry.ts`

| Metric | Current local result |
| --- | --- |
| Registered routes | 71 |
| Route metadata includes | page ID, route, title, purpose, visual mode, visual asset, navigation group, pageflow, user workflow, role family, object type, permission action and optional client-visibility sensitivity |
| Route scope field in exported route objects | Not present on `screenRoutes`; route scope is managed by separate access logic or policy docs, not by the base `ScreenRoute` object. |

Route count by navigation group:

| Navigation group | Count |
| --- | ---: |
| `access` | 6 |
| `platform` | 6 |
| `tenant_setup` | 6 |
| `client_workspace` | 12 |
| `wealth_actions` | 2 |
| `advisory_workflow` | 17 |
| `decisions_evidence` | 9 |
| `communication` | 2 |
| `export` | 5 |
| `operations` | 6 |

## App And API Inventory

Top-level app pages:

| Path | Role |
| --- | --- |
| `app/[...segments]/page.tsx` | Catch-all route renderer for registered screen routes. |
| `app/page.tsx` | Root page. |
| `app/journeys/page.tsx`, `app/journeys/[id]/page.tsx` | Journey UI pages. |
| `app/layout.tsx`, `app/error.tsx`, `app/loading.tsx`, `app/not-found.tsx`, `app/globals.css` | Framework shell and styling. |

API route files found: `30`

| API file | Methods observed |
| --- | --- |
| `app/api/admin-tenants/route.ts` | `GET`, `POST` |
| `app/api/audit-events/route.ts` | `GET` |
| `app/api/auth/dummy/route.ts` | `POST` |
| `app/api/auth/logout/route.ts` | `POST` |
| `app/api/auth/mfa/verify/route.ts` | `POST` |
| `app/api/auth/provider-login/route.ts` | `POST` |
| `app/api/auth/providers/route.ts` | `GET` |
| `app/api/current-user/route.ts` | `GET` |
| `app/api/dashboard-metrics/route.ts` | `GET` |
| `app/api/demo-workflow/route.ts` | `POST` |
| `app/api/documents/review/route.ts` | `POST` |
| `app/api/documents/route.ts` | `GET` |
| `app/api/documents/upload/route.ts` | `POST` |
| `app/api/entities/route.ts` | `GET`, `POST` |
| `app/api/export-workflow/route.ts` | `GET`, `POST` |
| `app/api/family-members/route.ts` | `GET`, `PATCH` |
| `app/api/global-search/route.ts` | `GET` |
| `app/api/journeys/[id]/audit/route.ts` | `GET` |
| `app/api/journeys/[id]/client-projection/route.ts` | `GET` |
| `app/api/journeys/[id]/commands/route.ts` | `POST` |
| `app/api/journeys/[id]/evidence-sufficiency/route.ts` | `GET` |
| `app/api/journeys/[id]/route.ts` | `GET` |
| `app/api/journeys/route.ts` | `GET`, `POST` |
| `app/api/ops-sla/route.ts` | `GET` |
| `app/api/platform-admin/actions/route.ts` | `POST` |
| `app/api/profile/route.ts` | `GET`, `PATCH` |
| `app/api/recommendation-review-workflow/route.ts` | `POST` |
| `app/api/review-monitoring/actions/route.ts` | `POST` |
| `app/api/review-monitoring/route.ts` | `GET` |
| `app/api/tenant-governance/actions/route.ts` | `POST` |

Structural interpretation: the repo has real API handler surfaces beyond a static clickdummy. This does not by itself prove complete vertical slices; capability claims require UI-to-handler-to-service-to-DB/workflow proof.

## Component Inventory

Primary screen components found:

| Component | Likely area |
| --- | --- |
| `components/auth-onboarding-screen.tsx` | Auth/onboarding |
| `components/admin-tenant-setup-screen.tsx` | Platform/admin/tenant setup |
| `components/client-intake-screen.tsx` | Client workspace, profile, family, entities, documents |
| `components/internal-workflow-screen.tsx` | Advisory/compliance/internal workflow |
| `components/decisions-governance-screen.tsx` | Decisions, evidence, governance |
| `components/communication-export-ops-screen.tsx` | Communication, export, operations |
| `components/kyc-aml-workflow-screen.tsx` | KYC/AML |
| `components/suitability-ips-screen.tsx` | Suitability/IPS |
| `components/committee-review-screen.tsx` | Committee review |
| `components/review-monitoring-screen.tsx` | Review monitoring |
| `components/wealth-actions-screen.tsx` | Wealth/actions |
| `components/journeys/*` | Journey dashboard/detail/API client |

Shared UI/control components include `components/ui/*`, `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx`, `components/page-header.tsx`, `components/worksurface-shell.tsx`, `components/ux-*`.

## Service And Domain Inventory

DB-backed or Prisma-touching code files found by static search:

| Area | Files |
| --- | --- |
| API DB transaction hub | `app/api/demo-workflow/route.ts`, `app/api/platform-admin/actions/route.ts`, `app/api/tenant-governance/actions/route.ts` |
| Tenant/profile/family/entity/data services | `lib/admin-tenant-readmodel-service.ts`, `lib/data-quality-repository.ts`, `lib/data-quality-service.ts`, `lib/dbtf-form-service.ts`, `lib/dbtf-table-service.ts` |
| Auth/current user | `lib/auth/current-user.ts`, `lib/demo/demo-auth-provider-service.ts` |
| Documents/evidence | `lib/document-upload-service.ts`, `lib/evidence-review-service.ts` |
| Export | `lib/export-workflow-command-service.ts`, `lib/export-workflow-readmodel-service.ts` |
| Search/ops/review | `lib/global-search-service.ts`, `lib/ops-sla-readmodel-service.ts`, `lib/review-monitoring-service.ts` |
| Journey spine | `lib/journeys/journey-api-service.ts` |
| Governance/release command surfaces | `lib/internal-draft-governance-spine.ts`, `lib/platform-admin-workflow-actions.ts`, `lib/typed-workflow-command-bus.ts`, `lib/tenant-governance-workflow-actions.ts` |
| Certification/phase services | `lib/p44-phase2-admin-foundation.ts`, `lib/p44-phase3-evidence-lifecycle.ts`, `lib/p44-phase4-signal-workbench.ts`, `lib/p44-phase6-advisor-review-closure.ts`, `lib/p44-phase7-compliance-rationale-closure.ts` |

Core safety/control modules observed:

| Module | Evidence role |
| --- | --- |
| `lib/permission-engine.ts` | Permission and RBAC decisions. |
| `lib/visibility-engine.ts` | Client-safe projection/visibility filtering. |
| `lib/workflow-gate.ts` | Workflow release/visibility gate logic. |
| `lib/audit-service.ts` | Audit persistence guard and metadata. |
| `lib/control-layer/*` | Actor scope, audit guard, visibility projection, fail-closed envelope, export safety, monitoring guard, permission decision, scope resolver. |
| `lib/release-spine-command-surface.ts` | Release/export/redaction precondition logic. |
| `lib/typed-workflow-command-bus.ts` | Typed command bus for advisor/compliance/release state changes. |
| `lib/no-overclaim-copy.ts` | Copy/status guard against forbidden success overclaims. |

## Prisma / DB Inventory

Evidence: `prisma/schema.prisma`, `prisma/migrations/**`, `prisma/seed.ts`.

| Metric | Current local result |
| --- | ---: |
| Enums | 31 |
| Models | 53 |
| Migrations | 5 migration directories plus lock |
| Latest migration directory observed | `20260625143000_internal_draft_governance_spine` |

Key model families observed from schema names:

| Family | Models/examples |
| --- | --- |
| Tenant/user/RBAC | `PlatformTenant`, `ClientTenant`, `User`, `UserProfile`, `Role`, `Permission`, `UserRole`, `RolePermission`, `AccessRequest`, `SecondConfirmation` |
| Client/wealth objects | `Engagement`, `FamilyMember`, `Relationship`, `ClientObjective`, `Entity`, `EntityParticipant`, `Asset` |
| Documents/evidence | `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceRecord`, `EvidenceItem`, `EvidenceSufficiencyDecision` |
| Advisory/recommendation/draft | `Trigger`, `ActionItem`, `Recommendation`, `InternalDraft`, `DraftClassification`, `UnsupportedClaim`, `DraftTrace`, `RecommendationOption`, `Approval`, `ComplianceReview`, `Decision`, `DecisionParticipant` |
| Journey spine | `JourneyDefinition`, `JourneyInstance`, `JourneyStepInstance`, `JourneyObjectLink`, `JourneyEvidenceRequirement`, `JourneyCommandRun` |
| Audit/monitoring/communication/export | `AuditEvent`, `ReviewSchedule`, `MessageThread`, `Message`, `CallEvent`, `ExportRequest`, `PolicyDefinition`, `QueueItem`, `DataQualityIssue` |

Inventory boundary: schema breadth proves a broad data model exists. It does not prove all fields are user-editable or processed by workflows.

## Script And Validation Inventory

Important package scripts from `package.json`:

| Script | Purpose | Risk/notes |
| --- | --- | --- |
| `dev`, `build`, `start` | Next.js local runtime/build/start | Build can be slow and may emit framework warnings unrelated to this audit. |
| `lint`, `typecheck`, `db:validate` | Static validation | Safe local checks. |
| `guard:source` | AlphaVest source hierarchy guard | Already run in this audit and passed. |
| `phase:check` | `typecheck && lint && db:validate && build` | Strong gate but heavier than needed for pure report changes. |
| `test:route-smoke`, `test:workflow-gate`, `test:permissions`, `test:document-upload-api`, `test:document-upload-flow`, `test:file-export`, `test:client-visibility`, `test:v1-p0` | Focused Playwright/safety/API suites | Runtime proof only if executed during this run. |
| `screencast:*`, `visual:*` | Screenshot/screencast/visual proof helpers | Use only if UI changes or screenshot proof is required. No UI changes in this audit so far. |

## Test Inventory

The repo contains a broad Playwright/test suite. Relevant proof families include:

| Family | Examples |
| --- | --- |
| Route/navigation/UI shell | `route-smoke.spec.ts`, `navigation-shell.spec.ts`, `journey-ui.spec.ts` |
| API/service contracts | `demo-workflow-api.spec.ts`, `document-upload-api.spec.ts`, `evidence-review-api.spec.ts`, `export-workflow-api.spec.ts`, `journey-api.spec.ts`, `data-quality-service.spec.ts` |
| Safety/RBAC/no leakage | `permission-engine.spec.ts`, `governance-non-bypass.spec.ts`, `workflow-gate.spec.ts`, `client-visibility-projection.spec.ts`, `true-ux-p0-safety.spec.ts` |
| Interaction lifecycle | `modal-lifecycle-hardening.spec.ts`, `drawer-lifecycle-hardening.spec.ts`, `confirmation-lifecycle.spec.ts`, `document-upload-lifecycle-hardening.spec.ts` |
| Schema/alignment | `schema-alignment.spec.ts`, `source-reality-gate.spec.ts` |
| Acceptance/certification | `p0-acceptance.spec.ts`, `p0-api-contract.spec.ts`, `p44-phase*-certification.spec.ts`, `av27-*` |

Inventory boundary: test existence supports proof planning and static claim checks. Only `pnpm guard:source` has been executed in this run so far.

## Runtime Assumptions

| Assumption | Status |
| --- | --- |
| Local project path | Confirmed: `/Users/chris/projects/alphavest-wealthos-clickdummy`. |
| Target branch | Confirmed: `full-workflow`. |
| Package manager | Confirmed: `pnpm@9.15.9`. |
| DB backend | PostgreSQL via Prisma; runtime DB availability not yet tested in this audit. |
| Demo session/auth posture | Repo contains demo auth/session/provider modules and auth API routes; real-auth hardening is not assumed. |
| Browser screenshots | Not required yet because no product UI changes were made. |
| Product code changes | Out of scope for this audit unless the user later authorizes gap-fix implementation. |

## ANALYSIS-1.1.2 Validation

| Validation item | Result |
| --- | --- |
| Central project areas documented | Yes. |
| Local scripts/tests documented | Yes. |
| Schema/DB sources documented | Yes. |
| Concrete start points for `ANALYSIS-2` | Yes: route registry, primary screen components, API routes, Prisma-touching services, safety/control modules and focused test families. |
