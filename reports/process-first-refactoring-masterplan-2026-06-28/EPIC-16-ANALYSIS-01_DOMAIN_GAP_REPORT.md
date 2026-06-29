# EPIC-16-ANALYSIS-01 Domain Gap Report

Ticket: `EPIC-16-ANALYSIS-01`  
Epic: `EPIC-16 Deferred, Elevated and Reference Route Differentiation`  
Status: `completed_analysis`  
Date: 2026-06-29

## Source Re-Read

Masterplan source:
`reports/process-first-refactoring-masterplan-2026-06-28/ALPHAVEST_PROCESS_FIRST_REFACTORING_MASTERPLAN_BOC_CTES.json`

Task definition:
Audit all mapped processes and steps for Deferred, Elevated and Reference Route Differentiation against current routes, components, services and tests.

Goal:
Separate implemented behavior from visual-only or specified-only claims.

Scope:
`P1/HOLD reference routes only - not P0 completion proof`

Expected output:
`EPIC-16 domain gap report`

Definition of done:
Each mapped process has implementation status and missing step list.

## Current Repo Truth

EPIC-16 is a protected-scope domain, not a normal implementation domain. Its current contract is encoded in:

- `lib/route-registry.ts`
- `lib/ux-operating-model.ts`
- `lib/ux-route-policy.ts`
- `components/route-skeleton-page.tsx`
- `tests/route-smoke.spec.ts`
- `tests/p1-hold-defensive-noninteractive.spec.ts`
- `tests/reference-product-control-pruning.spec.ts`
- `tests/p0-acceptance.spec.ts`
- `tests/ui-clickflow-phase06-10.spec.ts`

The current route workset truth is:

| Scope | Page ids | Implementation shell |
| --- | --- | --- |
| `P1_AFTER_MVP` | `052`, `053` | blocked / registered-only |
| `REFERENCE_ONLY` | `061`, `062`, `063` | blocked / registered-only |
| `HOLD_PENDING_DECISION` | `064`, `065`, `066`, `067`, `069`, `070`, `071` | blocked / registered-only |
| `MVP` operations exception | `068` | implemented / operational |

Important drift:
The masterplan still lists `S068` inside EPIC-16 target screens, but the current repository deliberately moved `S068 Review Calendar` to productive `MVP` operations scope. It is now covered by the operations visual audit and must not be reabsorbed into HOLD/REFERENCE.

## Route/Screen Coverage Matrix

| Screen | Route | Current scope | Current implementation truth | Missing step list |
| --- | --- | --- | --- | --- |
| `S061` | `/service-blueprint` | `REFERENCE_ONLY` | Registered-only reference route. `RouteSkeletonPage` renders `Reference Workspace`; no product controls; no productive navigation/audit. | No product implementation missing. Missing only a spec note that this is non-productive reference/debug context, not operations surface. |
| `S062` | `/roadmap` | `REFERENCE_ONLY` | Registered-only reference route. Product controls are pruned and route is not implementation-shell accessible. | No product implementation missing. Missing only explicit EPIC-16 spec wording that roadmap remains reference-only. |
| `S063` | `/states` | `REFERENCE_ONLY` | Registered-only reference route. Product controls are pruned and route is not implementation-shell accessible. | No product implementation missing. Missing only explicit EPIC-16 spec wording that state catalogue remains reference/debug context. |
| `S064` | `/kyc/reviews` | `HOLD_PENDING_DECISION` | Registered-only held route. Route is smoke-registered but not implementation-shell accessible. | Missing implementation by design until scope unlock. Missing route-specific differentiated hold copy if this ever becomes a productive KYC/suitability surface. |
| `S065` | `/kyc/source-of-wealth` | `HOLD_PENDING_DECISION` | Registered-only held route. Route is blocked by `HOLD_PENDING_SCOPE_UNLOCK`. | Missing implementation by design until scope unlock. Needs explicit Product Owner/safety unlock before any UI/service work. |
| `S066` | `/suitability/profile` | `HOLD_PENDING_DECISION` | Registered-only held route. Route is blocked by `HOLD_PENDING_SCOPE_UNLOCK`. | Missing implementation by design until scope unlock. Needs suitability-specific contract before build. |
| `S067` | `/ips/demo/decision-room` | `HOLD_PENDING_DECISION` | Registered-only held route. Route is blocked by `HOLD_PENDING_SCOPE_UNLOCK`. | Missing implementation by design until scope unlock. Needs IPS/mandate decision-room safety contract before build. |
| `S068` | `/reviews` | `MVP` | Implemented operational Review Calendar. Not EPIC-16 protected scope anymore. Full operational audit includes it and fails if it regresses to skeleton. | No EPIC-16 missing step. Must be removed from EPIC-16 implementation scope and kept in Domain-K/Operations. |
| `S069` | `/reviews/demo` | `HOLD_PENDING_DECISION` | Registered-only held route. Route is blocked by `HOLD_PENDING_SCOPE_UNLOCK`. | Missing implementation by design until scope unlock. If unlocked, it belongs to review/rebalance monitoring safety, not generic hold/reference UI. |
| `S070` | `/committee/reviews` | `HOLD_PENDING_DECISION` | Registered-only held route. Route is blocked by `HOLD_PENDING_SCOPE_UNLOCK`. | Missing implementation by design until scope unlock. Needs committee review queue contract before build. |
| `S071` | `/committee/reviews/demo/decision-room` | `HOLD_PENDING_DECISION` | Registered-only held route. Route is blocked by `HOLD_PENDING_SCOPE_UNLOCK`. | Missing implementation by design until scope unlock. Needs committee decision-room proof/audit contract before build. |

## Service and Test Coverage

Current positive coverage:

- `tests/route-smoke.spec.ts` locks route workset counts, registered-only behavior and no productive UX-PAGE surfaces for protected routes.
- `tests/p1-hold-defensive-noninteractive.spec.ts` locks `P1_AFTER_MVP` and `HOLD_PENDING_DECISION` page IDs as registered-only and non-interactive.
- `tests/reference-product-control-pruning.spec.ts` verifies reference routes expose reference status without product controls.
- `tests/p0-acceptance.spec.ts` verifies route-scope and access-decision truth for P1, reference, hold, MVP and support scopes.
- `tests/ui-clickflow-phase06-10.spec.ts` verifies deferred, held and reference UI states at guard level.
- `tests/operational-visual-audit.spec.ts` now covers only implemented shell-accessible routes and fails if such a route renders `RouteSkeletonPage`.

Current negative coverage:

- Protected routes are excluded from `groupedImplementationScreenRoutes`.
- Protected routes cannot render primary productive CTA buttons.
- Reference routes have `data-ux-reference-product-controls="removed"`.
- Held/deferred routes have `data-ux-deferred-hold-product-controls="non-interactive"`.
- Implemented routes are rejected by the operational visual audit if `route-skeleton-page` appears.

## Main Findings

1. EPIC-16 is not an implementation-greenlight for S064-S067 or S069-S071. Those screens are intentionally held and need explicit unlock decisions before product work.
2. S061-S063 should be treated as reference/debug catalogue routes, not operations work surfaces. Their current `reference` navigation group and registered-only access are correct.
3. S068 is stale in the EPIC-16 target list. It is currently an implemented `MVP` operations route and should remain outside EPIC-16 protected-scope implementation.
4. There is no explicit `ELEVATED` route-scope enum in the current code. The actual implemented distinction is `P1_AFTER_MVP`, `REFERENCE_ONLY`, and `HOLD_PENDING_DECISION`.
5. The biggest residual gap is not missing UI; it is missing wording in the EPIC-16 spec/contract that freezes the above classification and prevents future reintroduction of Deferred Workspace explainer surfaces as operational screens.

## Recommendation

Do not implement more visible panels for EPIC-16.

Bold path:

- Treat EPIC-16 primarily as a protected-scope contract and proof-hardening epic.
- Remove `S068` from EPIC-16 implementation scope in the derived spec and bind it to Domain-K Operations instead.
- Keep `S061-S063` as reference/debug screens outside productive navigation and outside operational visual audit.
- Keep `S064-S067` and `S069-S071` as held routes until Product Owner and safety unlock decisions exist.
- Add/keep tests that make regression impossible: implemented routes cannot render `RouteSkeletonPage`, reference routes cannot expose product controls, and held routes cannot surface productive CTAs.

## Ticket Result

`EPIC-16-ANALYSIS-01` is complete.

Next enabled ticket:
`EPIC-16-SPEC-01`
