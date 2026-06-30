# Route Evolution Record: Rebalance Monitoring Internal Review

Date: 2026-06-30

## Decision

Page `069` is route-evolved from `HOLD_PENDING_DECISION` to `MVP_SUPPORT`.

Current implementation path: `/reviews/rebalance-review`

Registry route: `/reviews/:id`

Smoke-path parameter: `rebalance-review`

## Scope

This unlock is limited to internal rebalance trigger monitoring and review routing. It is a support-lane operations surface, not a client advice, recommendation execution, compliance release, export, or client-visible projection surface.

## Required Safety Boundaries

- No automatic advice execution.
- No rebalance execution from the route.
- No client visibility or released-client content from the route.
- Actions may only write internal review, workflow and audit state through `/api/review-monitoring/actions`.
- Read state must come from `/api/review-monitoring?surface=rebalance`.
- The route remains `clientVisibilitySensitive: true`.

## Backing

- Read API: `app/api/review-monitoring/route.ts`
- Command API: `app/api/review-monitoring/actions/route.ts`
- Read service: `lib/review-monitoring-service.ts`
- Command service: `lib/review-monitoring-workflow-actions.ts`
- Product surface: `components/review-monitoring-screen.tsx`
- DB models: `Trigger`, `ActionItem`, `QueueItem`, `Recommendation`, `AuditEvent`

## Acceptance Evidence

- `/reviews/rebalance-review` renders `ReviewMonitoringScreen`, not the held `RouteSkeletonPage`.
- Trigger list is DB/service/API-query-backed and visibly paginated.
- `Execute rebalance` remains disabled.
- J17 actions preserve `noAdviceExecution`, `noClientRelease` and `clientVisible: false`.
- Domain-16 route differentiation recognizes `068` and `069` as service-backed productive monitoring surfaces while all other held routes remain blocked.
