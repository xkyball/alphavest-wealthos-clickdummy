# AlphaVest V1.0 WP-10 API Hardening Report

Generated: 2026-06-23
Authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
Companion task source: `/Users/chris/Downloads/ALPHAVEST_V1_0_DETAILED_IMPLEMENTATION_TASK_DESCRIPTIONS.md`

## Scope

WP-10 rebases the API contract to the current 15-route repository reality and hardens the shared fail-closed error envelope. No new API route was created, no P1/support API was promoted to V1 core, no schema migration was added, and no support API gained release/advice/export authority.

## Task Status

| Task | Status | Notes |
|---|---|---|
| `V10-WP10-T01` API contract map | `HARDENED` | Added `V1_0_API_CONTRACT_REBASE.md` covering all 15 current API route files with method, actor/scope, request/response, validation/RBAC/redaction/audit and envelope status. |
| `V10-WP10-T02` MVP core APIs | `HARDENED` | Existing core tests cover workflow, documents, upload, evidence review, audit and export paths; shared `failClosedJson` now prevents caller extras from overriding safety-critical envelope fields. |
| `V10-WP10-T03` Support/P1 APIs | `ALREADY_PRESENT_VERIFIED` | Admin/profile/entities/family/search/dashboard/ops/review-monitoring handlers are scoped, read-only or service-guarded and do not undercut V1 core gates. |
| `V10-WP10-T04` Safe error envelope | `HARDENED` | Added a negative envelope test proving `ok`, `mutated`, `noAdviceExecution`, `noClientRelease`, `failClosed` and `silentStateAdvance` cannot be relaxed by extras. |

## Changed Files

- `lib/control-layer/error-envelope.ts`
- `tests/fail-closed-error-envelope.spec.ts`
- `V1_0_API_CONTRACT_REBASE.md`
- `V1_0_WP10_API_HARDENING_REPORT.md`

## Inspected Files

- `API_CONTRACT_MATRIX.md`
- `app/api/admin-tenants/route.ts`
- `app/api/audit-events/route.ts`
- `app/api/auth/dummy/route.ts`
- `app/api/dashboard-metrics/route.ts`
- `app/api/demo-workflow/route.ts`
- `app/api/documents/route.ts`
- `app/api/documents/review/route.ts`
- `app/api/documents/upload/route.ts`
- `app/api/entities/route.ts`
- `app/api/export-workflow/route.ts`
- `app/api/family-members/route.ts`
- `app/api/global-search/route.ts`
- `app/api/ops-sla/route.ts`
- `app/api/profile/route.ts`
- `app/api/review-monitoring/route.ts`
- `lib/control-layer/error-envelope.ts`
- `tests/fail-closed-error-envelope.spec.ts`
- `tests/p0-api-contract.spec.ts`

## Validation

| Command | Result |
|---|---|
| `pnpm playwright test tests/fail-closed-error-envelope.spec.ts tests/p0-api-contract.spec.ts tests/demo-workflow-api.spec.ts tests/document-upload-api.spec.ts tests/evidence-review-api.spec.ts tests/phase8-export-workflow-api.spec.ts tests/phase9-support-hardening.spec.ts tests/review-monitoring-service.spec.ts tests/global-search-affordance.spec.ts tests/dbtf-tables-api.spec.ts` | PASS, 64 passed |
| `pnpm phase:check` | PASS with existing warnings |

## Known Warnings

- Existing lint warnings remain for unused UI helpers and capture helpers.
- Existing build warnings remain for custom Babel config and broad `document-storage-adapter` tracing.

## Method Artifacts

- V2 Discover: All 15 API route handlers, the stale API matrix, fail-closed helper and API contract tests were inspected before editing.
- V2 Define: The boundary is existing API hardening, not new route creation or P1 promotion.
- V2 Develop: The hardening protects the shared fail-closed helper from unsafe override fields and adds a current 15-API contract rebase.
- V2 Deliver: WP-10 remains phase-scoped and commit-ready after validation.
- V3 proof path: Allowed branch preserves extra context fields; killed branch proves unsafe extras cannot relax fail-closed envelope fields.
- Ethics and fairness: API errors cannot silently imply mutation, advice execution, client release or relaxed safety state.

## Verdict

`WP10_READY`.

API contract truth now reflects the current 15-route surface, and the shared fail-closed envelope is stricter after targeted API validation and `phase:check`.
