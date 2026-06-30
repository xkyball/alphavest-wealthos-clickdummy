# Route Evolution Record: Committee Review Queue

Date: 2026-06-30

## Route

- Page ID: `070`
- Route: `/committee/reviews`
- Previous scope: `HOLD_PENDING_DECISION`
- New scope: `MVP_SUPPORT`
- Route kept out of client-facing flows.

## Decision

The Committee Review Queue is unlocked as an internal support workbench only. It may list high-risk internal recommendation packages and record peer-review handoff state, but it does not approve advice, resolve dissent, release to compliance, or create client visibility.

`071` (`/committee/reviews/:id/decision-room`) was unlocked later through `ALPHAVEST_ROUTE_EVOLUTION_RECORD_2026-06-30_COMMITTEE_DETAIL.md` after vote, dissent and evidence commands became workflow-backed.

## Backing

- Read API: `app/api/committee-reviews/route.ts`
- Command API: `app/api/committee-reviews/actions/route.ts`
- Service: `lib/committee-review-service.ts`
- DB models: `Recommendation`, `QueueItem`, `ProcessInstance`, `ProcessCommandRun`, `AuditEvent`
- UI: `components/committee-review-screen.tsx`

## Safety Boundaries

- No client release.
- No advice execution.
- No compliance bypass.
- No committee decision-room unlock.
- Unsupported actions fail closed.
- Workflow command history and audit rows are required for queue mutation proof.

## Tests

- `tests/committee-review-routes.spec.ts`
- `tests/route-differentiation-contract.spec.ts`
- `tests/p1-hold-defensive-noninteractive.spec.ts`
- `tests/foundation-guardrails.spec.ts`
- `tests/p0-acceptance.spec.ts`
