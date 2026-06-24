# AlphaVest V0.96 P0 + True-UX Acceptance Evidence

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`  
WP: `WP-15 — P0 + True-UX Acceptance Suite`  
Date: 2026-06-23  
Status: `ACCEPTED_WITH_COVERAGE_MATRIX_AND_TARGETED_AGGREGATION_PROOF`

## Evidence Decision

WP-15 does not add product scope. It aggregates and tests the V0.96 proof surface created through WP01-WP14.

Current matrix result:

| Status | Count |
| --- | ---: |
| `COVERED` | 27 |
| `PARTIAL` | 0 |
| `MISSING` | 0 |
| `CONFLICTING` | 0 |
| `BLOCKED` | 0 |

Expected out-of-scope route/product blockers remain explicit and non-acceptance-expanding:

| Blocker | Reason |
| --- | --- |
| `WP15-B01-EXTERNAL-ADVISOR-GUEST-FULL-WORKFLOW` | External advisor guest workflow remains conditional/P1 and must not be unlocked by acceptance tests. |
| `WP15-B02-KYC-IPS-COMMITTEE-HELD-ROUTES` | KYC, IPS, high-risk committee and selected monitoring routes remain HOLD/P1 guarded. |

These blockers do not block V0.96 acceptance because WP15 asserts scope control, not route promotion.

## P0 Safety Coverage

| Gate | Status | Primary proof |
| --- | --- | --- |
| Mapped user / tenant / role context | `COVERED` | `tests/providerless-scope.spec.ts`, `tests/e2e/e2e-journey-proof-ws00-ws05.spec.ts` |
| Cross-tenant denial | `COVERED` | `tests/permission-engine.spec.ts`, `tests/providerless-scope.spec.ts` |
| Role/action/payload separation | `COVERED` | `tests/providerless-scope.spec.ts`, `tests/permission-engine.spec.ts` |
| Client visibility fail-closed | `COVERED` | `tests/client-visibility-projection.spec.ts`, `tests/true-ux-client-projection.spec.ts` |
| AI Draft internal-only | `COVERED` | `tests/p0-acceptance.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/export-safety.spec.ts` |
| No unapproved advice | `COVERED` | `tests/workflow-gate.spec.ts`, `tests/true-ux-p0-safety.spec.ts` |
| Advisor approval is not release | `COVERED` | `tests/p0-acceptance.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/ui-state-boundaries.spec.ts` |
| Compliance release gate | `COVERED` | `tests/workflow-gate.spec.ts`, `tests/confirmation-lifecycle.spec.ts` |
| Upload is not sufficiency | `COVERED` | `tests/document-upload-flow.spec.ts`, `tests/p0-acceptance.spec.ts`, `tests/true-ux-p0-safety.spec.ts` |
| Evidence sufficiency requires review/linking | `COVERED` | `tests/evidence-review-api.spec.ts`, `tests/e2e/e2e-journey-proof-ws00-ws05.spec.ts` |
| Audit persistence | `COVERED` | `tests/phase6-audit-persistence.spec.ts`, `tests/true-ux-audit-surface.spec.ts` |
| Audit fail-closed | `COVERED` | `tests/audit-fail-closed.spec.ts`, `tests/phase8-export-workflow-api.spec.ts` |
| Export redaction | `COVERED` | `tests/export-safety.spec.ts`, `tests/file-export-realism.spec.ts` |
| Export lifecycle separation | `COVERED` | `tests/phase8-export-workflow-api.spec.ts`, `tests/true-ux-export-scope-redaction-approval.spec.ts` |
| Admin non-bypass | `COVERED` | `tests/governance-non-bypass.spec.ts`, `tests/true-ux-governance-non-bypass.spec.ts` |
| API validation and safe error behavior | `COVERED` | `tests/p0-api-contract.spec.ts`, `tests/fail-closed-error-envelope.spec.ts` |

## True-UX Coverage

| Gate | Status | Primary proof |
| --- | --- | --- |
| Journey-first IA | `COVERED` | `tests/navigation-shell.spec.ts` |
| Page job and header guidance | `COVERED` | `tests/product-guidance-shell.spec.ts`, `tests/route-smoke.spec.ts` |
| Density and page-type contract | `COVERED` | `tests/true-ux-density.spec.ts` |
| One primary CTA and state feedback | `COVERED` | `tests/true-ux-cta-state.spec.ts`, `tests/ui-state-boundaries.spec.ts` |
| Shared primitive lifecycle | `COVERED` | `tests/interaction-lifecycle.spec.ts`, `tests/confirmation-lifecycle.spec.ts`, `tests/true-ux-shared-primitives.spec.ts` |
| A11y focus, keyboard and status basics | `COVERED` | `tests/true-ux-a11y.spec.ts`, `tests/disabled-control-a11y-messaging.spec.ts` |
| No-overclaim microcopy | `COVERED` | `tests/true-ux-no-overclaim-copy.spec.ts`, `tests/ui-state-boundaries.spec.ts` |
| Status chips are not gate proof | `COVERED` | `tests/true-ux-no-overclaim-copy.spec.ts`, `tests/status-badge-affordance-pruning.spec.ts` |
| P1/HOLD/reference routes not elevated | `COVERED` | `tests/p0-acceptance.spec.ts`, `tests/p1-hold-defensive-noninteractive.spec.ts`, `tests/navigation-shell.spec.ts` |
| Positive V0.96 journey spine | `COVERED` | `tests/e2e/e2e-journey-proof-ws00-ws05.spec.ts`, `tests/p0-acceptance.spec.ts` |
| WP15 evidence handoff | `COVERED` | `tests/v0-96-p0-true-ux-acceptance.spec.ts`, this file, `V0_96_WP15_P0_TRUE_UX_ACCEPTANCE_SUITE_REPORT.md` |

## Non-Claims

- Passing WP15 proves V0.96 demo-data P0 + True-UX acceptance, not GA production readiness.
- Demo session proof is not production authentication.
- Metadata-only export package proof is not production binary export delivery.
- Compliance release does not imply client acceptance.
- Status chips, route smoke and visual rows are proof slices only, never gate proof by themselves.
- P1/HOLD/reference routes are not promoted.

## Validation Commands

| Command | Result |
| --- | --- |
| `pnpm typecheck` | `PASS` |
| `PLAYWRIGHT_PORT=3078 pnpm playwright test tests/v0-96-p0-true-ux-acceptance.spec.ts --workers=1` | `PASS` — 5 passed |
| `PLAYWRIGHT_PORT=3079 pnpm playwright test tests/p0-acceptance.spec.ts tests/true-ux-p0-safety.spec.ts --workers=1` | `PASS` — 24 passed |
| `PLAYWRIGHT_PORT=3080 pnpm playwright test tests/navigation-shell.spec.ts tests/true-ux-cta-state.spec.ts tests/true-ux-density.spec.ts --workers=1` | `PASS` — 26 passed |
| `PLAYWRIGHT_PORT=3081 pnpm playwright test tests/true-ux-a11y.spec.ts tests/interaction-lifecycle.spec.ts tests/confirmation-lifecycle.spec.ts --workers=1` | `PASS` — 14 passed |
| `PLAYWRIGHT_PORT=3082 pnpm playwright test tests/governance-non-bypass.spec.ts tests/export-safety.spec.ts tests/audit-fail-closed.spec.ts --workers=1` | `PASS` — 9 passed |
| `PLAYWRIGHT_PORT=3083 pnpm playwright test tests/p0-api-contract.spec.ts tests/true-ux-client-projection.spec.ts tests/true-ux-api-service-ui-truth.spec.ts --workers=1` | `PASS` — 19 passed |
| `PLAYWRIGHT_PORT=3084 pnpm playwright test tests/v0-96-ux-ia-delta-register.spec.ts --workers=1` | `PASS` — 3 passed |
| `pnpm db:validate` | `PASS` |
| `git diff --check` | `PASS` |
| `mkdir -p test-results && pnpm lint` | `PASS_WITH_EXISTING_WARNINGS` — 0 errors, 29 existing unused-symbol warnings |

Validation note: an initial parallel Playwright run hit Next dev-server port contention. The affected suites were rerun sequentially. WP15 also exposed and fixed a real modal/drawer focus lifecycle issue, then reran the lifecycle/a11y suite successfully.
