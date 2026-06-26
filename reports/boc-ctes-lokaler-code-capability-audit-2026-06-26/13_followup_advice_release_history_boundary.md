# Follow-Up J02/J03 Advice/Release-History Boundary

Ticket: `FOLLOWUP-3`  
Status: `DONE`  
Decision basis: `DECISION-1` accepted with limitations and authorized the Advice/Release-History typed boundary for J02/J03.  
Chosen path: typed advice/release-history command boundary proof plus stale lifecycle-test cleanup.

## Verified Boundary

| Area | Result |
| --- | --- |
| Product screen client | `DecisionsGovernanceScreen` uses `runAdviceReleaseHistoryCommand` for J02/J03 controls. |
| Canonical API | `runAdviceReleaseHistoryCommand` posts to `/api/advice-release-history/actions`. |
| Workflow service | `/api/advice-release-history/actions` dispatches allow-listed J02/J03 actions through `runAdviceReleaseHistoryWorkflowAction`. |
| Legacy demo route | J02/J03 calls against `/api/demo-workflow` return fail-closed typed-route guidance instead of executing product-like mutations. |
| Lifecycle proof | The J03 confirmation lifecycle test now waits for `/api/advice-release-history/actions`, removing a stale `/api/demo-workflow` expectation from the product-like proof path. |

## Files Changed

| File | Purpose |
| --- | --- |
| `tests/decision-confirmation-lifecycle.spec.ts` | Migrated the positive J03 decision mutation wait from `/api/demo-workflow` to `/api/advice-release-history/actions`. |
| `reports/boc-ctes-lokaler-code-capability-audit-2026-06-26/10_current_ordered_execution_report.md` | Marks `FOLLOWUP-3` complete and records the focused proof pack. |
| `reports/boc-ctes-lokaler-code-capability-audit-2026-06-26/05_capability_reality_report.md` | Updates the J02/J03 current-run proof note without overpromoting the conservative `TYPED_COMMAND_BACKED_PARTIAL` classification. |

## Validation

```bash
pnpm exec playwright test tests/decision-confirmation-lifecycle.spec.ts --workers=1
pnpm exec playwright test tests/advice-release-history-command-client-source.spec.ts tests/demo-workflow-api.spec.ts tests/decision-confirmation-lifecycle.spec.ts tests/client-visibility-projection.spec.ts tests/workflow-gate.spec.ts tests/demo-workflow-action-registry.spec.ts --workers=1
```

Results:

- J03 confirmation lifecycle rerun: `2 passed`.
- Focused J02/J03 typed-boundary proof pack: `46 passed`.

## Claim Boundary

- This proves the product-like J02/J03 controls are typed-command backed and no longer use `runScreencastDemoAction` or `/api/demo-workflow` for execution.
- This does not claim a complete Advice/Release-History vertical slice certification; the report classification remains `TYPED_COMMAND_BACKED_PARTIAL` until a full positive/negative journey proof is run.
- No UI implementation changed in this ticket; no screenshot proof is required.
