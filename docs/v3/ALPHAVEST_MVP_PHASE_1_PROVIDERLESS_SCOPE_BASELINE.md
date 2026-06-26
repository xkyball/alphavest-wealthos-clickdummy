# AlphaVest MVP Phase 1 Providerless Scope Baseline

Date: 2026-06-20

Phase source: `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN.md`

Phase: `1 - Providerless Real User / Tenant / Role Foundation`

Execution status: `PHASE_1_COMPLETED_DOCS_ONLY`

## Scope

This baseline executes Phase 1 from the journey-first MVP implementation plan as a source-grounded contract. The controlling phase plan keeps providerless auth allowed but requires deterministic mapped actor, tenant, role, object and payload semantics before later MVP acceptance.

Phase 1 did not change product code, UI routes, API routes, Prisma schema, migrations, tests, generated visuals, screen states or ImageGen assets. Tests were not executed because the Phase 1 stop rules explicitly say no test execution.

## Source Files Read

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `mega_journeys_1/ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`
- `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md`
- `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN.md`
- `docs/v3/ALPHAVEST_MVP_PHASE_0_SOURCE_REALITY_BASELINE.md`
- `docs/v3/CODEX_TASKS_DETAILED_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
- `docs/v3/DATA_MODEL_V3.md`
- `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
- `docs/v3/OPERATIONALIZATION_PROJECT_CONTRACT_V3.md`
- `docs/v3/CAPABILITY_TRUTH_AUDIT_V3.md`
- `docs/v3/WORKFLOW_EXECUTION_REALITY_MATRIX_V3.md`
- `docs/v3/INPUT_MASK_AND_DATA_MAINTENANCE_REQUIREMENTS_V3.md`
- `lib/demo-session.ts`
- `components/demo-session-provider.tsx`
- `components/demo-session-panel.tsx`
- `lib/permission-engine.ts`
- `lib/visibility-engine.ts`
- `lib/route-registry.ts`
- `app/[...segments]/page.tsx`
- `app/api/documents/route.ts`
- `app/api/documents/upload/route.ts`
- `lib/document-upload-service.ts`
- `lib/export-service.ts`
- `tests/permission-engine.spec.ts`
- `tests/client-visibility-proof.spec.ts`

## Phase 1 Stop Rules

| Rule | Phase 1 Result |
| --- | --- |
| No code change | Passed. No product source file changed. |
| No test execution | Passed. Tests were inventoried only. |
| No schema migration | Passed. Prisma schema and migrations were not changed. |
| No screen/state/image generation | Passed. No UI, screenshot, ImageGen or state-screen artifact was created. |
| No `main` target truth | Passed. Current `full-workflow` checkout remains target truth. |

## Current Source Reality

| Surface | Current Reality | Phase 1 Interpretation |
| --- | --- | --- |
| Demo session | `lib/demo-session.ts` defines deterministic demo roles, four demo tenants, seeded actor IDs, `createDemoSession`, `currentActor` and `currentTenant`. Invalid or missing role/tenant inputs currently fall back to defaults. | Providerless identity has deterministic demo mapping, but unknown actor fail-closed is not complete because resolver fallbacks still exist. |
| Session UI state | `components/demo-session-provider.tsx` stores selected role and tenant in local storage and recreates a demo session. | Useful for demo context switching; not proof of real session binding or route authorization. |
| Permission engine | `lib/permission-engine.ts` centralizes cross-tenant denial, compliance release denial, advisor approval separation, admin non-bypass, export-role denial and internal-object access denial. | Strong demo RBAC proof surface; still demo-mode and must not be reported as production auth. |
| Visibility engine | `lib/visibility-engine.ts` separates internal recommendation payloads from released client-safe projection. | Route/action/payload separation exists as a service proof surface; route-level enforcement remains a later proof obligation. |
| Route registry/shell | `lib/route-registry.ts` and `app/[...segments]/page.tsx` route through workset and shell access checks. | Route workset gates exist, but route shell access is not enough to claim payload authorization. |
| Documents API | `/api/documents` requires a valid demo tenant slug and lists documents by mapped tenant ID. | Tenant-scoped list path exists; role-aware list and unknown-actor negative proof remain later obligations. |
| Upload API | `/api/documents/upload` parses multipart form data and validates demo role and tenant metadata before calling `document-upload-service`. | Current source is stronger than older audit wording; Phase 1 records the surface only and does not rerun upload proof. |
| Document upload service | `uploadDocument` maps role/tenant to a demo session, checks upload permission, writes denied audit rows, and persists uploaded document/evidence/audit rows for allowed demo roles. | Bounded demo operational surface exists for upload; Phase 1 does not expand it and does not claim full identity/object-scope readiness. |
| Export service | `exportService.canGenerateExport` calls permission checks and blocks forbidden payload classifications. | Supports payload-separation proof; generated binary export is not claimed. |
| Tests | Permission and client-visibility proof specs include cross-tenant, internal-payload, admin non-bypass and client-safe projection assertions. | Historical/current test surfaces are proof candidates only. They were not executed in Phase 1. |

## Capability Position

| Phase 1 Concern | Current Level | Target For Later Implementation | Non-Claim Boundary |
| --- | --- | --- | --- |
| Providerless current-user mapping | E4-E6 demo surface | E6/E7 demo proof with unknown/unmapped actor fail-closed and no anonymous payload expansion. | Current fallback resolution is not unknown-actor fail-closed. |
| Tenant membership in routes/actions | E4-E6 demo surface | E6 route/action proof and E7 only where payload persistence/reload is claimed. | Role/tenant switcher is not security proof by itself. |
| Route/action/payload separation | E6 service proof surface | E6/E7 proof across route, API and payload boundaries. | Route 200 or route shell rendering is not payload authorization. |
| Object scope for documents/evidence/decisions/exports | E5-E6 partial demo surface | E6/E7 object-scope proof with wrong-object no-payload and audit/denial where required. | Raw IDs or tenant slugs are not sufficient authorization. |
| Current-user and wrong-tenant acceptance tests | Proof candidate only | Later P0 suite must run positive and negative tests. | Phase 1 wrote no tests and ran no tests. |

## Phase 1 Contract

### AV-MVP-P1-T001 - Providerless Current-User Resolution

Providerless auth may continue to use a demo provider/stub, but every later MVP path must resolve an explicit actor, role, tenant and object context before it can read, mutate or project payload. The current `createDemoSession` contract is the source of deterministic demo actor context. Later implementation must replace fallback behavior with fail-closed handling where the caller is unknown, unmapped or tenantless.

Acceptance to prove later:

- mapped demo actor resolves to one role, one tenant and one actor ID;
- provider success alone does not create anonymous access;
- unknown or unmapped actor returns a denied/hidden state and no payload.

### AV-MVP-P1-T002 - Tenant Membership In Route Shell And Action Context

Every route and action touching tenant data must carry tenant context through route metadata, session/demo context and service/API context. Current source shows tenant IDs are used by the permission engine and document list/upload services. Later proof must cover route shell, API response and action mutation boundaries together.

Acceptance to prove later:

- scoped actor sees only scoped tenant data;
- wrong tenant is hidden or denied;
- denial creates audit proof where safety relevant;
- local role/tenant switcher state is never cited as security proof.

### AV-MVP-P1-T003 - Route / Action / Payload Visibility Separation

Route access, action permission and payload visibility are separate gates. Current source has route workset checks, role-aware permission decisions and recommendation payload projection. Later implementation must prove that a route shell does not expose fields or actions, and that admin/client-success route authority does not become internal advice payload access.

Acceptance to prove later:

- allowed route access can still return hidden/redacted/denied payload;
- allowed action requires role/action/object permission;
- client payload contains only released safe fields;
- admin and security roles remain governance roles, not advice payload bypass roles.

### AV-MVP-P1-T004 - Object-Scope Lookup

Document, evidence, decision and export lookups must be scoped by actor, tenant, object type, object ID, workflow state and visibility state. Current document list and upload services use tenant-scoped document/evidence queries. Later phases must extend that into a reusable object-scope matrix across documents, evidence, decisions and exports.

Acceptance to prove later:

- document/evidence/decision/export lookup requires actor tenant and object scope;
- wrong object returns no payload;
- denied object access is audited where sensitive;
- raw route params, raw object IDs or tenant slugs are not accepted as authorization.

### AV-MVP-P1-T005 - Acceptance Test Obligations

Phase 1 maps the later proof obligations but does not add tests. The future P0 suite must include both positive and negative proof for current-user mapping, unknown/unmapped actor, wrong tenant, route-shell-only access, wrong object, admin non-bypass and client payload redaction.

Minimum later test targets:

- `permission-engine.spec.ts` or successor: unknown/unmapped actor and wrong-tenant denial.
- Route/API tests: route shell does not expose denied payload.
- `/api/documents` and `/api/documents/upload`: actor/tenant/object precondition negatives.
- Visibility/export tests: no internal draft, compliance note or unreleased evidence in client/export payloads.

## Impact Matrix

| Area | Phase 1 Impact |
| --- | --- |
| Routes | 001-006, 013-018, 019-020, 027-030, 048-051 are mapped as affected; 008-010 and 054-058 remain relevant for route/action/payload separation. No route changed. |
| APIs | `/api/recommendation-review-workflow`, `/api/documents`, `/api/documents/upload` are affected surfaces; candidate current-user/access API remains unauthorized until later handoff. No API changed. |
| Models | `User`, `UserProfile`, `ClientTenant`, `Role`, `Permission`, `UserRole`, `RolePermission`, plus object-scope models `Document`, `EvidenceRecord`, `Decision`, `ExportRequest`, `AuditEvent`. No schema changed. |
| Services | `demo-session-provider`, `permission-engine`, `visibility-engine`, route guards/session context, document upload/list and export projection surfaces. No service changed. |
| Tests | Existing permission/client-visibility/upload/export specs are proof candidates. No tests were added or run. |

## Task Closure

| Task | Result |
| --- | --- |
| AV-MVP-P1-T001 | Completed as docs-only contract. Providerless current-user semantics and unknown-actor fail-closed obligation are defined. |
| AV-MVP-P1-T002 | Completed as docs-only contract. Tenant membership propagation and wrong-tenant proof obligations are defined. |
| AV-MVP-P1-T003 | Completed as docs-only contract. Route/action/payload separation and admin non-bypass boundaries are defined. |
| AV-MVP-P1-T004 | Completed as docs-only contract. Object-scope lookup obligations for documents/evidence/decisions/exports are defined. |
| AV-MVP-P1-T005 | Completed as docs-only contract. Later P0 positive/negative acceptance test obligations are mapped; no tests were written. |

## Commands Run

Read-only commands were used for source verification and inventory:

- `git status --short --branch`
- `git rev-parse HEAD`
- `rg ...`
- `sed ...`

Tests, build, lint, Prisma validation, seed, and migration commands were not run in this Phase 1 execution because the controlling phase plan says no test execution, no code change, no schema migration, and no downstream implementation.

## Exit Gate

`PHASE_1_EXIT_PASSED_WITH_DOCUMENTED_LIMITATIONS`

Providerless actor/tenant/role/object semantics are now defined for later MVP delivery, route/action/payload separation is explicit, and all Phase 1 P1-T001..T005 obligations are mapped without overclaiming implementation or test proof.
