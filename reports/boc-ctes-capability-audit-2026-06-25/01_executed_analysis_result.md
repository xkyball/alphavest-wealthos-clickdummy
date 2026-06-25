# Executed Analysis Result

Generated: 2026-06-25

Task status:
- ANALYSIS-1: FINISHED
- ANALYSIS-2: FINISHED

## Source and Baseline Evidence

| Check | Result |
| --- | --- |
| Working directory | `/Users/chris/projects/alphavest-wealthos-clickdummy` |
| Branch | `full-workflow` |
| Latest commit at analysis start | `c24972d docs: rerun wp05 advisory workflow proof` |
| Existing dirty files before this audit | `tests/interaction-lifecycle.spec.ts`, `tests/ui-state-boundaries.spec.ts` |
| Diff stat before audit | 2 test files, 5 insertions, 3 deletions |
| Package manager | `pnpm@9.15.9` |
| Framework/runtime | Next.js 16, React 19, TypeScript, Prisma 7, PostgreSQL |
| Source guard | `pnpm guard:source` passed |

The two dirty test files pre-existed this audit. They were not used as accepted specification overrides and were not edited by this process chain.

## Repository Inventory

| Surface | Evidence | Finding |
| --- | --- | --- |
| App route tree | `app/[...segments]/page.tsx`, `app/journeys/page.tsx`, `app/journeys/[id]/page.tsx`, `app/api/**/route.ts` | Catch-all page resolves routes from the route registry and renders implementation screens or skeletons. Journey pages are dedicated pages. |
| Route registry | `lib/route-registry.ts` | 71 registered product/reference routes were counted from `screenRoutes`. Navigation groups include access, platform, tenant setup, client workspace, wealth actions, advisory workflow, decisions/evidence, communication, export and operations. |
| API routes | `app/api/**/route.ts` | 26 API route files expose GET, POST and PATCH handlers across auth, documents, DBTF tables/forms, journeys, export workflow, monitoring, profile, audit and search. |
| Prisma schema | `prisma/schema.prisma` | 49 models and 27 enums are present. Core models include tenant/user/RBAC, family/entity/document/evidence/audit/recommendation/decision/export/journey/queue/data-quality entities. |
| Services | `lib/*.ts`, `lib/control-layer/*.ts`, `lib/journeys/*.ts` | Services cover document upload/review, DBTF forms/tables, demo workflow mutation, journey orchestration, export workflow commands/read model, permission/scope/visibility/audit guards and search/metrics. |
| Tests | `tests/**/*.spec.ts` | 98 Playwright specs are present. Coverage includes route smoke, source reality, document upload/review, demo workflow, journey API/UI, export workflow, permission, client projection, governance, P0 safety and UI state boundaries. |
| Seed/demo data | `prisma/seed.ts`, `lib/*demo-data.ts` | The app is demo-data-first. Several UI screens still use demo-data modules, while selected flows persist or read through Prisma. |

## UI and Editable Surface Findings

| Area | Evidence | Status |
| --- | --- | --- |
| Catch-all screen rendering | `app/[...segments]/page.tsx` imports and dispatches 11 screen families by page ID. | Implemented route-to-screen shell. |
| DBTF profile/family/entity forms | `components/client-intake-screen.tsx` fetches `/api/profile`, `/api/family-members`, `/api/entities` and has form fields/save actions. | Real editable UI surface for selected DBTF data. |
| Document upload/review UI | `components/client-intake-screen.tsx` posts multipart data to `/api/documents/upload` and review actions to `/api/documents/review`. | Real upload/review UI surface. |
| Journey UI | `components/journeys/journey-dashboard.tsx`, `components/journeys/journey-detail.tsx` call `/api/journeys` and journey command/projection/audit endpoints. | Real journey interaction surface. |
| Internal/review monitoring demo actions | `components/internal-workflow-screen.tsx`, `components/review-monitoring-screen.tsx` call `/api/demo-workflow`. | Real API interaction for demo workflow commands, with deterministic/demo boundaries. |
| Export UI | `components/communication-export-ops-screen.tsx` fetches `/api/export-workflow` for read model; code also renders staged controls/modals. | Partly integrated; export API has command execution, UI evidence is stronger for read-model and staged lifecycle than for every command path. |
| Static/demonstration controls | Multiple components include state panels, drawer boundaries, static notes and held controls. | Must not be counted as complete vertical slices unless paired with API/service/DB/test evidence. |

## DB, Persistence and Editability Findings

| Capability | Evidence | Classification |
| --- | --- | --- |
| Client profile edit | `lib/dbtf-form-service.ts` updates `UserProfile` in a transaction and writes `AuditEvent`; `/api/profile` exposes GET/PATCH. | Complete selected vertical slice. |
| Family member edit | `lib/dbtf-form-service.ts` updates `FamilyMember` and writes `AuditEvent`; `/api/family-members` exposes GET/PATCH. | Complete selected vertical slice. |
| Entity wizard create | `lib/dbtf-form-service.ts` creates `Entity` and writes `AuditEvent`; `/api/entities` exposes GET/POST. | Complete selected vertical slice. |
| Document upload | `lib/document-upload-service.ts` validates file, stores local object, creates `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent` in a transaction. | Complete upload vertical slice, bounded to demo/local storage. |
| Document review/evidence sufficiency | `lib/evidence-review-service.ts` and `/api/documents/review` mutate document/evidence/review state with audit safety. | Complete selected review/evidence slice. |
| Journey commands | `lib/journeys/journey-api-service.ts` executes command-specific handlers for evidence, draft, advisor approval, compliance block/release and generic commands. | Complete selected journey vertical slice. |
| Export workflow | `lib/export-workflow-command-service.ts` creates/updates `ExportRequest` and audit events across scope/redaction/preview/approval/generation/download/share. | Complete API/service/DB slice; UI command coverage is partial from inspected evidence. |
| Read models/search/metrics | `lib/dbtf-table-service.ts`, `lib/global-search-service.ts`, `lib/*readmodel-service.ts` query tenant-scoped Prisma rows. | Backend/read model implemented; editability varies by object. |

## Workflow, Inputs and Outputs Findings

| Workflow | Inputs | Processing | Outputs | Finding |
| --- | --- | --- | --- | --- |
| DBTF profile | Tenant/role, profile fields, mode | Validation, role allowlist, transaction, audit write | Updated `UserProfile`, audit event, no-client-release response | Complete for profile fields. |
| DBTF family member | Tenant/role, member id, relationship/tax fields | Validation, tenant scope, permission, transaction, audit write | Updated `FamilyMember`, audit event | Complete for selected member fields. |
| DBTF entity wizard | Tenant/role, entity fields, save/submit mode | Validation, role allowlist, transaction, audit write | Created `Entity`, audit event | Complete for entity create, not general entity lifecycle. |
| Document upload | File, document type, tenant/role, metadata | Mime/size/name validation, permission/scope, audit-writable check, local storage, transaction | Document/version/extraction/evidence/audit rows | Complete upload slice; no evidence sufficiency or client release overclaim. |
| Evidence review | Review action, document/evidence context, role | Validation, scoped evidence handling, audit required checks | Document/evidence status changes, audit event | Complete selected review/sufficiency slice. |
| Journey orchestration | JWT/current user, journey id, command payload | Role/permission checks, scoped instance load, command-specific handlers, state machine | Journey state/detail, audit/run records, client projection after release | Complete for tested journey gates. |
| Export workflow | Tenant/role, command, scope/redaction/approval payload | Role/scope/quality checks, export state machine, audit writes | ExportRequest status changes, metadata-only package state, audit trail | Complete API workflow; final binary export is explicitly not real binary storage. |

## Security, Guards, Roles, Validation and Auditability

| Assurance area | Evidence | Finding |
| --- | --- | --- |
| Permission and object scope | `lib/permission-engine.ts`, `lib/control-layer/permission-decision.ts`, `lib/control-layer/scope-resolver.ts` | Centralized permission/scope checks exist and are used by critical services. |
| Audit persistence | `lib/audit-service.ts`, document upload/review, journey and demo workflow services | Critical mutations require or write audit events; failure paths return fail-closed responses in inspected flows. |
| Client visibility and redaction | `lib/visibility-engine.ts`, `lib/control-layer/client-visibility.ts`, journey client projection, document projection | Client projection is separated from internal payloads for inspected flows. |
| Validation | API routes and services validate role/tenant, payload shape, file type/size, command and workflow preconditions. | Validation is present in core flows. |
| No-overclaim copy/tests | `lib/no-overclaim-copy.ts`, `tests/ui-state-boundaries.spec.ts`, safety specs | Safety language separates upload, evidence, advisor approval, compliance release, export approval/download and client acceptance. |

## Test and Proof Coverage Findings

Strong current proof areas:
- `tests/document-upload-api.spec.ts`: upload creates document/version/extraction/evidence/audit rows; negative tests for audit unavailable, invalid tenant/role, unsupported file, missing type and role denial.
- `tests/evidence-review-api.spec.ts`: review/sufficiency paths and fail-closed audit/role/scope behavior.
- `tests/dbtf-tables-api.spec.ts`: DB-backed table/form APIs, profile save/reload, family edit, entity wizard, tenant scoping and dashboard/search proof.
- `tests/journey-api.spec.ts`: journey start/commands/audit/projection/evidence sufficiency and negative gate paths.
- `tests/export-workflow-api.spec.ts`: export lifecycle separation, forbidden payload blocking, data-quality blocking and role denial.
- `tests/permission-engine.spec.ts`, `tests/governance-non-bypass.spec.ts`, `tests/client-visibility-projection.spec.ts`: guardrail proof.
- `tests/route-smoke.spec.ts`: route registry/smoke proof.

Residual proof gaps:
- Not every one of 71 registered routes has a complete vertical slice; some are implementation shells or skeleton/reference/support surfaces.
- Some UI controls remain demo/static/held by design and must not be counted as full functionality.
- Full binary export storage is not proven and is explicitly represented as metadata-only/no-real-binary in export tests.
- This analysis did not execute every one of 98 specs; QA used focused validation.

## Analysis Conclusion

The repository is not merely a static clickdummy. Several capability families have real vertical slices through UI/API/service/Prisma/audit/tests, especially DBTF profile/family/entity, document upload/review, journey commands and export workflow API. The app is still demo-data-first and contains many static or guarded UI surfaces. Therefore the correct report stance is mixed: selected complete vertical slices exist, broad app-wide completeness does not.
