# EPIC-16-SPEC-01 Implementation Contract

Ticket: `EPIC-16-SPEC-01`  
Epic: `EPIC-16 Deferred, Elevated and Reference Route Differentiation`  
Status: `completed_spec`  
Date: 2026-06-29

## Source Re-Read

Masterplan source:
`reports/process-first-refactoring-masterplan-2026-06-28/ALPHAVEST_PROCESS_FIRST_REFACTORING_MASTERPLAN_BOC_CTES.json`

Task definition:
Define target surfaces, state machine, role guards, payload visibility, audit/evidence requirements and acceptance criteria for Deferred, Elevated and Reference Route Differentiation.

Goal:
Make implementation decision-complete for this domain.

Dependency:
`EPIC-16-ANALYSIS-01`

Expected output:
`EPIC-16 implementation contract`

Definition of done:

- Acceptance criteria cover positive and negative paths.
- UI, service and test boundaries are named.

## Binding Classification

EPIC-16 is a protected-scope differentiation contract. It is not a blanket implementation approval for all listed screens.

Current binding route classification:

| Class | Page ids | Product UI status | Service/DB/workflow rule |
| --- | --- | --- | --- |
| `REFERENCE_ONLY` | `061`, `062`, `063` | registered-only reference/debug route | Must not expose product workflow controls. No DB mutation or workflow action is allowed. |
| `HOLD_PENDING_DECISION` | `064`, `065`, `066`, `067`, `069`, `070`, `071` | registered-only held route | No product UI may be exposed until a domain-specific backend/workflow contract exists. |
| `MVP` operations exception | `068` | implemented operational route | Must remain service/API/DB/workflow backed through review monitoring services and audits. |

`S068 Review Calendar` is explicitly removed from EPIC-16 protected implementation scope. It belongs to the productive Operations/Domain-K surface and must not be reclassified as deferred, held or reference.

## Non-Negotiable UI Backing Rule

Any route that renders a productive operational UI must be backed by all applicable layers before it can be treated as implemented:

- a named read model or service,
- a named API or server-side read path where browser data is loaded,
- Prisma/database-backed records when the UI presents operational objects,
- workflow command handling for mutations,
- audit/evidence persistence for sensitive or state-changing actions,
- route-level tests and negative safety tests.

If any of these are missing, the route must stay `HOLD_PENDING_DECISION` or `REFERENCE_ONLY`. The missing backend/workflow layer must be built before the UI is unlocked, not hidden behind explanatory panels, demo data or permissive copy.

Current application of this rule:

- `S068 /reviews` passes the rule: it uses `app/api/review-monitoring`, `lib/review-monitoring-service.ts`, `lib/review-monitoring-workflow-actions.ts`, Prisma review/queue/trigger/action/audit records and operational visual audit coverage.
- `S064-S067` and `S069-S071` do not have approval to expose their legacy demo components as product UI. They remain blocked until KYC, suitability, IPS, monitoring or committee-specific service/workflow/audit contracts are approved and implemented.
- `S061-S063` are reference/debug routes. They are allowed only as non-productive registered-only references and must not become operational navigation surfaces.

## Target Surfaces

### S061-S063 Reference Routes

Routes:

- `S061 /service-blueprint`
- `S062 /roadmap`
- `S063 /states`

Target contract:

- Render only a registered reference status shell.
- No primary product CTA.
- No workflow command.
- No client-visible payload.
- No operational visual-audit inclusion.
- No productive navigation promotion.

These routes may exist as direct debug/reference surfaces, but they must not masquerade as Operations workspaces.

### S064-S067 and S069-S071 Held Routes

Routes:

- `S064 /kyc/reviews`
- `S065 /kyc/source-of-wealth`
- `S066 /suitability/profile`
- `S067 /ips/:tenantId/decision-room`
- `S069 /reviews/:id`
- `S070 /committee/reviews`
- `S071 /committee/reviews/:id/decision-room`

Target contract:

- Route remains smoke-registered.
- Product implementation shell is inaccessible.
- No primary product CTA, no enabled form, no mutation, no release/export/advice path.
- No client-visible content is created or exposed.
- No generic "Deferred Workspace" or process explainer may be used as a substitute for real workflow state.
- Product implementation requires an explicit scope-unlock decision plus a route-specific service/DB/workflow/audit implementation plan.

### S068 Operations Route

Route:

- `S068 /reviews`

Target contract:

- Remains `MVP`.
- Must be rendered by `ReviewMonitoringScreen`, not `RouteSkeletonPage`.
- Must load browser-visible operational data from `/api/review-monitoring`.
- Mutating actions must go through `/api/review-monitoring/actions`.
- Mutations must persist internal workflow/audit state and must not create client release.
- Operational visual audit must include it and fail if it regresses to a skeleton/held page.

## State Machine

Allowed states:

| State | Applies to | Entry condition | Exit condition |
| --- | --- | --- | --- |
| `REFERENCE_ONLY_REGISTERED` | `061`, `062`, `063` | route is reference/debug catalogue | explicit route-evolution approval plus new backend/workflow contract |
| `HOLD_PENDING_DECISION_REGISTERED` | `064`, `065`, `066`, `067`, `069`, `070`, `071` | route is known but not unlocked for product implementation | Product Owner/safety approval plus service/DB/workflow/audit implementation |
| `PRODUCTIVE_OPERATIONAL` | `068` | route has implemented operations backing | may not exit to protected scope without explicit deprecation decision |

Forbidden transitions:

- `REFERENCE_ONLY_REGISTERED` -> `PRODUCTIVE_OPERATIONAL` via UI-only component enablement.
- `HOLD_PENDING_DECISION_REGISTERED` -> `PRODUCTIVE_OPERATIONAL` via route-workset edit only.
- `PRODUCTIVE_OPERATIONAL` -> `HOLD_PENDING_DECISION_REGISTERED` to satisfy stale EPIC-16 target wording.

## Role Guards

Protected EPIC-16 routes use `REGISTERED_ONLY` access. Demo authentication may show that the route exists, but no actor, admin or support role may bypass the protection into productive controls.

Role-specific implementation belongs to the future domain route contract after scope unlock. It must not be simulated through static demo components.

## Payload Visibility

Reference and held routes expose no client-visible payload and perform no state-changing action.

`S068` may show internal operations data, but any workflow action must remain internal and must persist `noClientRelease` semantics through the review-monitoring command path.

## Audit and Evidence

Reference and held routes should not create audit events merely for being viewed, because they perform no operational mutation. Their proof is negative route/access regression coverage.

`S068` must maintain audit persistence for workflow actions through `lib/review-monitoring-workflow-actions.ts`.

## Acceptance Criteria

Positive criteria:

- Route workset contains `P1_AFTER_MVP = 052,053`.
- Route workset contains `REFERENCE_ONLY = 061,062,063`.
- Route workset contains `HOLD_PENDING_DECISION = 064,065,066,067,069,070,071`.
- `S068` is `MVP` and implementation-shell accessible.
- Reference routes render no product controls.
- Held routes render no product controls.
- `S068` renders operational review monitoring UI with service-backed data.
- Operational visual audit covers every implementation-shell-accessible route.

Negative criteria:

- No implemented route may render `RouteSkeletonPage`.
- No reference or held route may render an enabled primary product CTA.
- No reference route may be counted as productive operational navigation.
- No held route may be unlocked by registry/workset change alone.
- No EPIC-16 route may render process/proof/scope explainer panels as product UI.
- `S068` must not be reabsorbed into EPIC-16 protected scope.

## Test Boundaries

Required technical checks for this contract:

- `./node_modules/.bin/tsx scripts/source-target-guard.ts`
- `./node_modules/.bin/tsc --noEmit`
- `./node_modules/.bin/playwright test tests/p1-hold-defensive-noninteractive.spec.ts --workers=1`
- `./node_modules/.bin/playwright test tests/reference-product-control-pruning.spec.ts --workers=1`
- `./node_modules/.bin/playwright test tests/operational-visual-audit.spec.ts --grep "covers every implemented route" --workers=1`
- `./node_modules/.bin/playwright test tests/operational-visual-audit.spec.ts --grep "068-operations" --workers=1`
- `./node_modules/.bin/playwright test tests/review-monitoring-service.spec.ts --workers=1`

## Implementation Decision

`EPIC-16-IMPL-01` may not unlock `S064-S067` or `S069-S071` as product UI inside this ticket.

Allowed next implementation is proof-hardening only:

- keep `S068` outside EPIC-16 protected scope,
- keep `061-063` reference-only,
- keep `064-067` and `069-071` held,
- add tests if any of those rules are not yet executable,
- remove stale tests that force deferred behavior for productive `S068`.

Disallowed implementation:

- generic held-workspace pages as product substitute,
- reusing static demo KYC/suitability/committee components as operational UI,
- adding visible process explanation to satisfy acceptance,
- unlocking any held route without service/DB/workflow/audit backing.

## Decision Gate

Before any productive UI for `S064-S067` or `S069-S071`, the user must approve a route-specific scope unlock.

Recommended approval path:
`APPROVE_EPIC16_PROOF_HARDENING_ONLY`

Rejected-by-default path:
`UNLOCK_HELD_ROUTES_WITHOUT_BACKEND_CONTRACT`

Bold recommendation:
Do not unlock held routes in EPIC-16. Split KYC, suitability, IPS, rebalance detail and committee review into separate backend-lifecycle epics, each with service/DB/workflow/audit proof before UI exposure.

## Ticket Result

`EPIC-16-SPEC-01` is complete.

