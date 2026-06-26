# Follow-Up J01 Typed Boundary

Ticket: `FOLLOWUP-2`  
Status: `DONE`  
Decision basis: `DECISION-1` accepted with limitations and authorized J01 typed boundary/quarantine.  
Chosen path: typed intake/advisor-review command boundary.

## Implemented Boundary

| Area | Result |
| --- | --- |
| `j01.requestData` | Moved from executable `/api/demo-workflow` mutation into `/api/advisor-review/actions`. |
| `j01.routeToAdvisor` | Remains on `/api/advisor-review/actions`. |
| `j01.escalateAdvisor` | Remains on `/api/advisor-review/actions`. |
| `/api/demo-workflow` | Reduced to fail-closed legacy boundary. It now returns `410` typed-route guidance for moved or unsupported actions and has no direct executable demo-only mutation path. |
| Capture/report terminology | Updated from legacy demo-only compatibility language to typed advisor-review and `LEGACY_DEMO_410_BOUNDARY`. |

## Files Changed

| File | Purpose |
| --- | --- |
| `lib/advisor-review-action-contract.ts` | Added `j01.requestData` to the typed advisor-review action contract and command map. |
| `lib/advisor-review-workflow-actions.ts` | Added typed request-data mutation path with audit, trigger and action-item updates. |
| `app/api/advisor-review/actions/route.ts` | Updated allow-list error language for request-data, route and escalation commands. |
| `app/api/demo-workflow/route.ts` | Removed executable demo mutation implementation; route now only fail-closes legacy calls. |
| `lib/demo-workflow-action-registry.ts` | Emptied executable demo-only action list; `j01.requestData` now resolves to the advisor-review typed boundary. |
| `lib/capture-screen-model-context.ts` | Updated capture model context to remove stale J01 demo-only compatibility language. |
| `lib/capability-report-drift-gate.ts` | Tightened report truth marker to `LEGACY_DEMO_410_BOUNDARY`. |
| `tests/advisor-review-command-api.spec.ts` | Proves typed execution of `j01.requestData`, route and escalation. |
| `tests/demo-workflow-api.spec.ts` | Proves legacy J01 calls now return `410` and point to typed APIs. |
| `tests/demo-workflow-action-registry.spec.ts` | Proves no executable demo-only action IDs remain. |
| `docs/v3/**` and `reports/**` source layers | Updated J01 terminology away from legacy compatibility bridge language. |

## Validation

```bash
pnpm typecheck
pnpm exec playwright test tests/advisor-review-command-api.spec.ts tests/demo-workflow-api.spec.ts tests/demo-workflow-action-registry.spec.ts tests/capture-screen-model-context.spec.ts tests/capability-report-drift-gate.spec.ts tests/platform-admin-actions-api.spec.ts tests/tenant-governance-actions-api.spec.ts --workers=1
```

Results:

- `pnpm typecheck`: `PASS`.
- Focused J01/demo/capture proof pack: `43 passed`.

## Claim Boundary

- This completes the J01 typed-boundary cleanup for request-data, route and escalation.
- This does not claim full signal governance, full recommendation lifecycle certification or client release completeness.
- `/api/demo-workflow` remains present only as a fail-closed legacy compatibility route until the screencast client path can be deleted or isolated.
- No UI implementation changed in this ticket; no screenshot proof is required.
