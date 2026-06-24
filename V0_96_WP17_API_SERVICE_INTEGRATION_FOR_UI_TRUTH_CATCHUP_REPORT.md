# V0.96 Deep-Codex WP-17 API / Service Integration for UI Truth Catch-up Report

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`  
Prompt source: `docs/v0-96/uploads/ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DEEP_CODEX_TASK_DESCRIPTIONS.md`  
WP: `WP-17 - API / Service Integration for UI Truth`  
Date: 2026-06-23  
Status: `ACCEPTED_WITH_FAIL_CLOSED_API_ENVELOPE_CATCHUP`

## Scope Decision

The repo already executed the single-file V0.96 API/service truth work as `WP-13`. The combined Deep-Codex prompt pack also contains a later-numbered `WP-17` with the same title and a broader target API list.

WP-17 is therefore treated as a compatibility catch-up, not as permission to create new APIs or expand product scope. The implementation inspects the listed API routes and hardens the remaining UI-facing safe-error responses to the shared fail-closed envelope.

## Classification

| Area | Classification | Evidence |
| --- | --- | --- |
| Existing API/service truth slice | `ALREADY_PRESENT_WITH_WP13_EXPORT_PROOF` | `V0_96_WP13_API_SERVICE_INTEGRATION_FOR_UI_TRUTH_REPORT.md`, `tests/true-ux-api-service-ui-truth.spec.ts` |
| Core API error-envelope consistency | `PARTIAL_BEFORE_WP17`, now `ACCEPTED_WITH_TARGETED_REFACTOR` | `app/api/documents/route.ts`, `app/api/documents/review/route.ts`, `app/api/audit-events/route.ts` now use `failClosedJson` for safe failures. |
| New API creation | `NOT_AUTHORIZED_NOT_DONE` | No new route or endpoint was created. |
| Client/internal payload safety | `PRESERVED` | Existing payload redaction tests remain in place; WP-17 adds fail-closed guard assertions without widening payloads. |
| UI state truth | `PRESERVED_WITH_API_CATCHUP` | Export UI truth from WP-13 remains the concrete service/UI chain; documents/review/audit safe errors now share the same no-advance contract. |

## Implementation

Changed API routes:

- `app/api/documents/route.ts`
  - Invalid tenant/role scope and list failures now return `failClosedJson`.
  - Existing `documents: []`, no-release and hidden-row safety fields are preserved.

- `app/api/documents/review/route.ts`
  - Invalid JSON, invalid metadata, validation errors, not-found/scope failures, permission denial, insufficiency and unknown errors now return `failClosedJson`.
  - `auditEventId`, `reason` and insufficiency `decision` details remain available where they were already safe and test-backed.

- `app/api/audit-events/route.ts`
  - Missing scope and list failures now return `failClosedJson`.
  - Audit rows remain empty on failure and internal metadata is not exposed.

Changed tests:

- `tests/p0-api-contract.spec.ts`
- `tests/document-upload-api.spec.ts`
- `tests/evidence-review-api.spec.ts`
- `tests/true-ux-audit-surface.spec.ts`
- `tests/true-ux-api-service-ui-truth.spec.ts`

Changed scripts:

- `package.json` adds `test:v0-96-wp17-api-truth`.

## Acceptance

| Criterion | Result |
| --- | --- |
| Touched APIs validate request and actor/scope context | `PASS` |
| Safe errors do not advance workflow | `PASS` |
| Shared fail-closed envelope used on touched API failures | `PASS` |
| Internal data not leaked in audit/document/review failures | `PASS` |
| No new API created without WP-00 justification | `PASS` |
| No route, schema, production-auth or product-scope expansion | `PASS` |

## Validation

| Command | Result |
| --- | --- |
| `pnpm typecheck` | `PASS` |
| `PLAYWRIGHT_PORT=3090 pnpm playwright test tests/true-ux-api-service-ui-truth.spec.ts tests/p0-api-contract.spec.ts --workers=1` | `PASS` - 8 passed |
| `PLAYWRIGHT_PORT=3091 pnpm playwright test tests/document-upload-api.spec.ts tests/evidence-review-api.spec.ts tests/true-ux-audit-surface.spec.ts --workers=1` | `PORT_CONTENTION_RERUN_REQUIRED` - parallel run found port 3090 already occupied |
| `PLAYWRIGHT_PORT=3092 pnpm playwright test tests/document-upload-api.spec.ts tests/evidence-review-api.spec.ts tests/true-ux-audit-surface.spec.ts --workers=1` | `PASS` - 18 passed |
| `pnpm db:validate` | `PASS` |
| `mkdir -p test-results && pnpm lint` | `PASS_WITH_EXISTING_WARNINGS` - 0 errors, 29 unused-symbol warnings |
| `git diff --check` | `PASS` |

## Non-Claims

- WP-17 does not claim every API in the application now has a complete production-grade contract.
- WP-17 does not create new endpoints, schema fields or production authentication.
- WP-17 does not promote P1/HOLD/reference routes.
- WP-17 does not change export delivery from metadata/service proof to production binary delivery.
