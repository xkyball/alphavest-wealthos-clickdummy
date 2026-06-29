# EPIC-16-IMPL-01D Coverage Matrix

Ticket: `EPIC-16-IMPL-01D`  
Epic: `EPIC-16 Deferred, Elevated and Reference Route Differentiation`  
Status: `completed_proof_hardening_matrix`  
Date: 2026-06-29  
Approval boundary: `APPROVE_EPIC16_PROOF_HARDENING_ONLY`

## Source Re-Read

Task definition:
Update matrix. Mark implemented, partial and missing states for completed domain steps.

Validation:
Matrix integrity check passes.

## Coverage States

| Status | Meaning |
| --- | --- |
| `implemented_service_backed` | Product UI is allowed because route, component, API/read service, DB-backed operational records, workflow command and audit/no-client-release proof exist. |
| `protected_reference_only` | Route exists only as registered reference/debug surface. No product controls, mutation, release, export, advice or client-visible payload may be exposed. |
| `protected_hold_pending_backend_lifecycle` | Route is smoke-registered but held until a route-specific backend lifecycle slice exists. Demo components are not accepted as unlock proof. |

## Route Matrix

| Screen | Route | Scope | Status | Backing / blocker |
| --- | --- | --- | --- | --- |
| `S061` | `/service-blueprint` | `REFERENCE_ONLY` | `protected_reference_only` | Direct reference/debug context only; no workflow command or productive navigation. |
| `S062` | `/roadmap` | `REFERENCE_ONLY` | `protected_reference_only` | Direct reference/debug context only; no workflow command or productive navigation. |
| `S063` | `/states` | `REFERENCE_ONLY` | `protected_reference_only` | Direct reference/debug context only; no workflow command or productive navigation. |
| `S064` | `/kyc/reviews` | `HOLD_PENDING_DECISION` | `protected_hold_pending_backend_lifecycle` | Needs KYC read model, command model, audit/event proof and client-safe negative tests before UI unlock. |
| `S065` | `/kyc/source-of-wealth` | `HOLD_PENDING_DECISION` | `protected_hold_pending_backend_lifecycle` | Needs source-of-wealth evidence lifecycle, command model and audit proof before UI unlock. |
| `S066` | `/suitability/profile` | `HOLD_PENDING_DECISION` | `protected_hold_pending_backend_lifecycle` | Needs suitability profile lifecycle, advice-readiness gate, persistence and audit proof before UI unlock. |
| `S067` | `/ips/:tenantId/decision-room` | `HOLD_PENDING_DECISION` | `protected_hold_pending_backend_lifecycle` | Needs IPS/mandate decision-room lifecycle, persistence and client-safe release boundary before UI unlock. |
| `S068` | `/reviews` | `MVP` | `implemented_service_backed` | Backed by `ReviewMonitoringScreen`, `/api/review-monitoring`, `/api/review-monitoring/actions`, `review-monitoring-service`, `review-monitoring-workflow-actions`, Prisma review/queue/trigger/action/recommendation/audit records and no-client-release proof. |
| `S069` | `/reviews/:id` | `HOLD_PENDING_DECISION` | `protected_hold_pending_backend_lifecycle` | Needs rebalance detail lifecycle, command/audit persistence and no-client-release tests before UI unlock. |
| `S070` | `/committee/reviews` | `HOLD_PENDING_DECISION` | `protected_hold_pending_backend_lifecycle` | Needs committee queue lifecycle, vote/dissent commands, audit persistence and safety tests before UI unlock. |
| `S071` | `/committee/reviews/:id/decision-room` | `HOLD_PENDING_DECISION` | `protected_hold_pending_backend_lifecycle` | Needs committee decision-room lifecycle, dissent resolution, audit proof and no-release boundary before UI unlock. |

## Proof-Hardening Changes

- Added `lib/epic16-route-differentiation-contract.ts` as canonical EPIC-16 route differentiation contract.
- Added `tests/epic16-route-differentiation-contract.spec.ts` to prove:
  - `S068` is the only productive EPIC-16 route.
  - `S061-S063` remain reference-only.
  - `S064-S067` and `S069-S071` remain held until backend lifecycle unlock.
  - implemented EPIC-16 routes cannot regress to skeleton without test failure.
  - catch-all routing blocks legacy demo components before they can render for held routes.
  - operational guidance and hub definitions cannot route into protected EPIC-16 details.
  - `S068` proof/audit/client-safe behavior is service-backed, not UI-explained.
- Updated guidance/hub contracts:
  - `S068` no longer routes to held `S069`.
  - `S064`, `S067`, `S069`, `S070`, `S071` no longer carry stale product-like next-step links in operational guidance.
  - held `S064` and `S070` no longer expose productive hub definitions.

## Matrix Integrity

The executable matrix is `evaluateEpic16RouteDifferentiation()` in `lib/epic16-route-differentiation-contract.ts`.

Expected integrity result:
`epic16ContractViolations() === []`

Validated by:
`PLAYWRIGHT_SKIP_WEB_SERVER=1 ./node_modules/.bin/playwright test tests/epic16-route-differentiation-contract.spec.ts --workers=1`

## Ticket Result

`EPIC-16-IMPL-01D` is complete.

