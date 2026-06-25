# Code-Level Capability Reality Report

Generated: 2026-06-25

Task status:
- IMPL-1: FINISHED
- IMPL-1.1 Capability Matrix: FINISHED
- IMPL-1.2 Vertical-Slice Matrix: FINISHED
- IMPL-1.3 Input/Output/Process-Step Matrix: FINISHED
- IMPL-1.4 Security/Assurance Matrix: FINISHED
- IMPL-1.5 Executive Report and Technical Appendix: FINISHED

## Executive Summary

AlphaVest WealthOS is materially beyond a static clickdummy in several core areas. Current repo evidence shows real vertical slices for DB-backed profile/family/entity edits, document upload and review, journey commands/projections, and export workflow API state transitions. These slices include Prisma persistence, validation, role/scope checks, audit events and focused Playwright proof.

The app is still demo-data-first and not every visible screen is a complete capability. The route registry has 71 routes and several screens contain static, held or demonstration controls. Those are valid demo surfaces, but they must not be counted as fully implemented workflows unless they connect to API/service/DB/workflow/test evidence.

Overall status:
- Complete selected vertical slices: present.
- Full app-wide functional completeness: not proven.
- Main risk: overclaiming UI breadth as backend/workflow completeness.
- Clean next move: accept this report as the current capability-reality baseline, then derive implementation tickets only for the partial/UI-only surfaces the user wants to convert into full vertical slices.

## Capability Matrix

| Capability | Status | Evidence | Residual risk |
| --- | --- | --- | --- |
| Route/app shell registry | PARTIAL_VERTICAL_SLICE | `lib/route-registry.ts` has 71 `screenRoutes`; `app/[...segments]/page.tsx` renders implementation screens by page ID and falls back to skeleton pages. | Route presence is not function completeness. |
| DBTF client profile edit | COMPLETE_VERTICAL_SLICE | `components/client-intake-screen.tsx` calls `/api/profile`; `app/api/profile/route.ts` exposes GET/PATCH; `lib/dbtf-form-service.ts` updates `UserProfile` and writes audit; `tests/dbtf-tables-api.spec.ts` saves/reloads profile. | Scope is selected profile fields, not full CRM profile lifecycle. |
| DBTF family member edit | COMPLETE_VERTICAL_SLICE | UI calls `/api/family-members`; API exposes GET/PATCH; service validates tenant/object scope, updates `FamilyMember`, writes audit; tests prove save/reload and denial. | Only selected family fields are editable. |
| DBTF entity wizard | COMPLETE_VERTICAL_SLICE | UI posts `/api/entities`; API exposes GET/POST; service validates fields, creates `Entity`, writes audit; tests validate persistence and reload. | Entity lifecycle after creation is not fully audited here. |
| Document upload | COMPLETE_VERTICAL_SLICE | UI posts `/api/documents/upload`; service validates file, stores local object, creates document/version/extraction/evidence/audit rows; tests prove rows and negative cases. | Local demo storage, not production object-storage certification. |
| Document review/evidence sufficiency | COMPLETE_VERTICAL_SLICE | UI posts `/api/documents/review`; service mutates document/evidence status and audit; tests prove review, sufficiency, role denial, wrong scope and audit-unavailable failure. | Review is bounded to deterministic demo evidence flows. |
| Journey dashboard/detail/commands | COMPLETE_VERTICAL_SLICE | Journey UI calls `/api/journeys`, `/commands`, `/audit`, `/client-projection`, `/evidence-sufficiency`; service enforces role/permission/scope and command handlers; `tests/journey-api.spec.ts` proves gate flow and negative cases. | JWT/demo auth setup remains demo-oriented. |
| Export workflow API | BACKEND_VERTICAL_SLICE | `/api/export-workflow` and `lib/export-workflow-command-service.ts` create/update `ExportRequest` through scope/redaction/preview/approval/generate/download/share with audit; tests prove lifecycle separation and denials. | UI evidence is partial for all command stages; binary export is metadata-only by design. |
| Demo workflow / recommendation review | PARTIAL_VERTICAL_SLICE | Internal/review screens call `/api/demo-workflow`; `runRecommendationReviewWorkflowMutation` mutates recommendation/compliance/audit state with guards. Tests cover deep API behavior. | Some UI actions are screencast/demo action wrappers rather than full user workflows. |
| Read models/search/metrics | BACKEND_ONLY_READMODEL | Services query tenant-scoped Prisma rows for documents, family members, entities, audit events, search, dashboard and ops SLA. Tests cover DB-backed tables/search/metrics. | Read models do not imply editability. |
| Permissions, visibility, audit safety | TESTED_GUARD | Permission, scope, visibility, audit and no-overclaim modules plus safety specs. | Guard coverage is strong for audited paths, not a proof for every UI control. |

## Vertical-Slice Matrix

| Slice | UI/action | API/service | DB/state | Workflow/output | Guard/audit | Test proof | Classification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Client profile save | Profile form in `ClientIntakeScreen` | `/api/profile` -> `saveDbtfClientProfile` | `UserProfile.update` | Reloaded profile response | Role allowlist and audit event | `dbtf-tables-api.spec.ts` | COMPLETE_VERTICAL_SLICE |
| Family member save | Family form in `ClientIntakeScreen` | `/api/family-members` -> `updateDbtfFamilyMember` | `FamilyMember.update` | Updated row response | Permission engine, object scope, audit | `dbtf-tables-api.spec.ts` | COMPLETE_VERTICAL_SLICE |
| Entity wizard submit | Entity wizard in `ClientIntakeScreen` | `/api/entities` -> `saveDbtfEntityWizard` | `Entity.create` | Saved draft/submitted entity | Role allowlist and audit | `dbtf-tables-api.spec.ts` | COMPLETE_VERTICAL_SLICE |
| Document upload | Upload form in `ClientIntakeScreen` | `/api/documents/upload` -> `uploadDocument` | Document/version/extraction/evidence/audit rows | Upload accepted; review pending | File validation, permission/scope, audit writable | `document-upload-api.spec.ts` | COMPLETE_VERTICAL_SLICE |
| Evidence review | Review UI in document screen | `/api/documents/review` -> `reviewDocumentEvidence` | Document/evidence/review/audit updates | Review/sufficiency state | Role/scope/audit fail-closed checks | `evidence-review-api.spec.ts` | COMPLETE_VERTICAL_SLICE |
| Journey release path | Journey dashboard/detail command UI | `/api/journeys/**` -> journey service | Journey command/run/evidence/review state | Client-safe projection after release | JWT role/permission/scope, admin non-bypass, audit | `journey-api.spec.ts` | COMPLETE_VERTICAL_SLICE |
| Export lifecycle | Export screen/read model; API command path | `/api/export-workflow` -> export command service | `ExportRequest` and `AuditEvent` updates | Scope/redaction/preview/approval/generate/download/share states | Role gate, data quality block, forbidden payload validation | `export-workflow-api.spec.ts` | BACKEND_VERTICAL_SLICE |
| Route shell coverage | Navigation and catch-all app shell | Route registry and shell functions | No direct DB mutation | Screen rendering/skeleton fallback | Route implementation access decision | `route-smoke.spec.ts` | PARTIAL_VERTICAL_SLICE |

## Input / Output / Process-Step Matrix

| Process | Required inputs | Processing steps | Outputs |
| --- | --- | --- | --- |
| Profile save | `tenantSlug`, `roleKey`, first name, last name, country, relationship, optional phone, mode | Validate required fields; require role; find principal profile; transaction updates `UserProfile`; write audit | Mutated profile payload; audit row; no client release |
| Family member update | `tenantSlug`, `roleKey`, member id, display name, relationship, tax residency | Validate fields; load member in tenant; evaluate permission/object scope; transaction updates `FamilyMember`; write audit | Updated family row; audit row; denial audit for unauthorized edits |
| Entity wizard | `tenantSlug`, `roleKey`, entity type/name/jurisdiction and optional registration/risk/owner summary | Validate fields and submit requirements; require role; transaction creates `Entity`; write audit | New entity row; audit row; no client release |
| Document upload | File, document type, tenant/role and metadata | Validate file name/type/size; resolve scope; evaluate permission; assert audit writable; write local object; transaction creates document, version, extraction, evidence and audit | Upload result with IDs; evidence created; internal-only visibility; no export/release |
| Evidence review | Document/evidence id, action, role/scope and notes | Validate action; enforce role/scope; require audit availability; update document/evidence state; create evidence item/link/audit as needed | Review/sufficiency result; client visibility remains controlled |
| Journey command | JWT current user, journey instance id, command payload | Load role permissions; load scoped journey; route to command handler; enforce gates; transition state and audit/run records | Journey detail, command result, audit/projection evidence |
| Export command | Tenant/role, export command, scope/payload/approval inputs | Require export role; validate scope/redaction/payload; data-quality checks; update export request; write audit | ExportRequest lifecycle status; metadata-only package state; no client acceptance overclaim |

## Security / Assurance Matrix

| Control | Evidence | Result |
| --- | --- | --- |
| Tenant/role parsing | API routes parse and reject invalid `tenantSlug`/`roleKey` or invalid current-user JWT. | Present in inspected APIs. |
| Permission and object scope | Permission engine/control-layer checks in DBTF, document upload, journeys and demo workflow. | Present for critical mutations. |
| Audit persistence | `auditService.assertCriticalAuditWritable` and transaction audit writes in critical flows. | Present; fail-closed behavior is tested. |
| Client visibility / no leakage | Visibility engine and journey/document projections hide internal fields. | Present in inspected projections and tests. |
| Export redaction / forbidden payload | Export service blocks internal payload fields and high-severity data-quality blockers. | Present in export tests. |
| No-overclaim state copy | UI/test coverage separates upload, sufficiency, advisor approval, compliance release, export approval, download/share and client acceptance. | Present, but current two dirty test files mean final suite state should be rechecked before release certification. |

## ZERO-DELTA IMPLEMENTATION

Product-code delta for this task is zero.

Reason:
- The uploaded blueprint defines an audit/report delivery chain.
- The derived implementation task is report assembly, not application feature implementation.
- Current repo already contains the audited code paths; this run did not need to add or change product code to truthfully classify them.
- Generated artefacts are limited to `reports/boc-ctes-capability-audit-2026-06-25/`.

This zero-delta statement is not a claim that the app is fully implemented. It only means no product-code change was required to execute the report task.

## Follow-Up Backlog Candidates

These are not approved implementation tasks yet. They should be activated only after DECISION-2.

1. Convert export UI command stages into fully evidenced UI-to-API-to-DB flows, or explicitly mark command-only stages in UI.
2. Produce a route-by-route completeness matrix for all 71 registered routes.
3. Separate static/demo controls from mutating controls with machine-readable `data-capability-status` attributes.
4. Add a generated vertical-slice index that maps every tested API spec to capability rows.
5. Run full `pnpm phase:check` plus complete Playwright suite before any release-level claim.

## Honest Limitations

- This report is based on static repo analysis plus focused validation, not every possible runtime flow.
- Screenshots were not produced because this run did not make UI changes and the strongest proof for this blueprint is code/test/DB evidence.
- Full app-wide completeness is not proven.
- Existing dirty test-file changes predate this audit and should be reconciled by their owner before a release-certification pass.
