# Route Evolution Record: Committee Review Detail

Date: 2026-06-30

## Route

- Page ID: `071`
- Route: `/committee/reviews/:id/decision-room`
- Previous scope: `HOLD_PENDING_DECISION`
- New scope: `MVP_SUPPORT`
- Route kept out of client-facing flows.

## Decision

The Committee Review Detail route is unlocked as an internal support decision room. It may read a workflow-backed recommendation package, record a peer vote, request evidence and resolve dissent through audited workflow commands.

It does not approve advice for release, bypass compliance, create client acceptance or expose client-visible content.

## Backing

- Read API: `app/api/committee-reviews/route.ts?targetId=:id`
- Command API: `app/api/committee-reviews/actions/route.ts`
- Service: `lib/committee-review-service.ts`
- DB models: `Recommendation`, `QueueItem`, `ProcessInstance`, `ProcessCommandRun`, `AuditEvent`, `EvidenceRecord`
- UI: `components/committee-review-screen.tsx`

## Safety Boundaries

- No client release.
- No advice execution.
- No compliance bypass.
- Vote and dissent commands require typed confirmation.
- Evidence request requires a concrete reason.
- Unsupported or malformed actions fail closed.
- Workflow command history and audit rows are required for mutation proof.

## Tests

- `tests/committee-review-routes.spec.ts`
- `tests/route-differentiation-contract.spec.ts`
- `tests/p1-hold-defensive-noninteractive.spec.ts`
- `tests/hold-route-copy-cleanup.spec.ts`
- `tests/route-smoke.spec.ts`
- `tests/foundation-guardrails.spec.ts`
