# Demo Workflow Boundary Split Execution Report

Date: 2026-06-26  
Branch: `full-workflow`  
Baseline commits: `5a866be`, then `3531bc6` for the capability report drift gate  
Status: `DONE_WITH_EXPLICIT_DEMO_BOUNDARY`

## Scope

This run executed two follow-up tickets:

1. Add a generator gate that checks capability reports against the route/model/capability context used by normal screen capture.
2. Split `/api/demo-workflow` into an explicit demo-only compatibility lane versus typed product command lanes.

No product UI, route registry, Prisma schema, migration, safety policy, image, screen asset or state-screen asset was changed.

## Implemented

### Ticket 1 - Capability Report Drift Gate

- Added `lib/capability-report-drift-gate.ts`.
- Added `scripts/capability-report-drift-gate.ts`.
- Added `pnpm gate:capability-report`.
- Added `tests/capability-report-drift-gate.spec.ts`.
- Gate uses the capture model context baseline: 71 registered routes, 53 Prisma models, 31 enums and conservative capability statuses.
- Gate fails generated report text that promotes stale 49-model claims or `COMPLETE_VERTICAL_SLICE` status rows without proof-guard language.

### Ticket 2 - Demo Workflow Boundary Split

- Added `lib/demo-workflow-action-registry.ts`.
- `/api/demo-workflow` now checks every `actionId` against the registry before executing.
- Only actions classified as `DEMO_ONLY_COMPATIBILITY` can execute on `/api/demo-workflow`.
- Legacy export actions are blocked with canonical route `/api/export-workflow`.
- Review monitoring actions are blocked with canonical route `/api/review-monitoring/actions`.
- Typed advisor approval payloads remain blocked with canonical route `/api/recommendation-review-workflow`.
- Unknown demo-shaped actions are blocked with canonical route `/api/journeys/[id]/commands`.
- Successful demo action responses now include `demoWorkflowBoundary`, `demoOnly: true` and `productCommandAllowed: false`.

## Validation

Passed:

- `pnpm guard:source`
- `pnpm gate:capability-report`
- `pnpm typecheck`
- `pnpm exec eslint lib/capability-report-drift-gate.ts scripts/capability-report-drift-gate.ts tests/capability-report-drift-gate.spec.ts lib/capture-screen-model-context.ts scripts/strict-visual-capture.ts tests/capture-screen-model-context.spec.ts`
- `pnpm exec eslint lib/demo-workflow-action-registry.ts app/api/demo-workflow/route.ts tests/demo-workflow-action-registry.spec.ts tests/demo-workflow-api.spec.ts`
- `pnpm playwright test tests/capability-report-drift-gate.spec.ts tests/capture-screen-model-context.spec.ts`
- `pnpm playwright test tests/demo-workflow-action-registry.spec.ts tests/demo-workflow-validation.spec.ts`
- `pnpm playwright test tests/demo-workflow-action-registry.spec.ts tests/demo-workflow-api.spec.ts tests/review-monitoring-service.spec.ts tests/phase8-export-workflow-api.spec.ts`

## Negative Proof

- A synthetic generated report containing `49 models` and `COMPLETE_VERTICAL_SLICE` fails the drift gate.
- Legacy J08 export demo actions return 410 and do not execute export approval/download on `/api/demo-workflow`.
- Review monitoring action IDs return 410 on `/api/demo-workflow` and point to `/api/review-monitoring/actions`.
- Typed advisor approval payloads return 410 on `/api/demo-workflow` and point to `/api/recommendation-review-workflow`.
- Unknown `j99.fakeAction` returns 410 and does not write fake audit state.

## Remaining Boundary

The split is now enforced at the `/api/demo-workflow` boundary. A deeper future cleanup can migrate remaining demo-only compatibility actions into their typed domain APIs and then remove the compatibility actions from the screencast client. That larger migration should be done family by family: documents/profile/entities/governance/decision, with focused UI/API/service/DB/audit proof for each.

## Recommendation

Next bold move: delete broad `runScreencastDemoAction` use from product-like screens after each corresponding typed command client exists. Keep `/api/demo-workflow` only as a screencast choreography endpoint, not as product proof.

