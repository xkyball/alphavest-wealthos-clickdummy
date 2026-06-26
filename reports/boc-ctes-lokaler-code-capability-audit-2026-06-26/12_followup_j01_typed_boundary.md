# Follow-Up J01 Typed Boundary

Ticket: `FOLLOWUP-2`  
Status: `DONE`  
Decision basis: `DECISION-1` accepted with limitations and authorized J01 typed boundary/quarantine.  
Chosen path: typed intake/advisor-review command boundary.

## Implemented Boundary

| Area | Result |
| --- | --- |
| `j01.requestData` | Moved from the former generic workflow mutation path into `/api/advisor-review/actions`. |
| `j01.routeToAdvisor` | Remains on `/api/advisor-review/actions`. |
| `j01.escalateAdvisor` | Remains on `/api/advisor-review/actions`. |
| Generic workflow route | Deleted in `FOLLOWUP-5`; typed advisor-review and recommendation-review routes are the only remaining supported boundaries. |
| Capture/report terminology | Updated from retired generic-only compatibility language to typed advisor-review and `DEMO_WORKFLOW_ROUTE_DELETED`. |

## Files Changed

| File | Purpose |
| --- | --- |
| `lib/advisor-review-action-contract.ts` | Added `j01.requestData` to the typed advisor-review action contract and command map. |
| `lib/advisor-review-workflow-actions.ts` | Added typed request-data mutation path with audit, trigger and action-item updates. |
| `app/api/advisor-review/actions/route.ts` | Updated allow-list error language for request-data, route and escalation commands. |
| `app/api/recommendation-review-workflow/route.ts` | Handles typed advisor approval workflow payloads only. |
| `deleted typed-boundary action registry` | Emptied executable demo-only action list; `j01.requestData` now resolves to the advisor-review typed boundary. |
| `lib/capture-screen-model-context.ts` | Updated capture model context to remove stale J01 demo-only compatibility language. |
| `lib/capability-report-drift-gate.ts` | Tightened report truth marker to `DEMO_WORKFLOW_ROUTE_DELETED`. |
| `tests/advisor-review-command-api.spec.ts` | Proves typed execution of `j01.requestData`, route and escalation. |
| `tests/recommendation-review-workflow-api.spec.ts` | Proves the typed recommendation-review workflow boundary. |
| `tests/screencast-new-system-contract.spec.ts` | Proves no executable demo-only action IDs remain. |
| `docs/v3/**` and `reports/**` source layers | Updated J01 terminology away from legacy compatibility bridge language. |

## Validation

```bash
pnpm typecheck
pnpm exec playwright test tests/advisor-review-command-api.spec.ts tests/recommendation-review-workflow-api.spec.ts tests/screencast-new-system-contract.spec.ts tests/capture-screen-model-context.spec.ts tests/capability-report-drift-gate.spec.ts tests/platform-admin-actions-api.spec.ts tests/tenant-governance-actions-api.spec.ts --workers=1
```

Results:

- `pnpm typecheck`: `PASS`.
- Focused J01/demo/capture proof pack: `43 passed`.

## Claim Boundary

- This completes the J01 typed-boundary cleanup for request-data, route and escalation.
- This does not claim full signal governance, full recommendation lifecycle certification or client release completeness.
- `/api/recommendation-review-workflow` remains present only as a fail-closed legacy compatibility route until the screencast client path can be deleted or isolated.
- No UI implementation changed in this ticket; no screenshot proof is required.
