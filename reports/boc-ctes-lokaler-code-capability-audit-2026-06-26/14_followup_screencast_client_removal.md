# Follow-Up Screencast Client Removal

Ticket: `FOLLOWUP-4`  
Status: `DONE`  
Decision basis: `DECISION-1` authorized removal of product-like `runScreencastDemoAction` usage.  
Chosen path: delete the dead legacy client instead of keeping a quarantined helper.

## Implemented Boundary

| Area | Result |
| --- | --- |
| Product imports | Current scan found no product-screen imports of `runScreencastDemoAction`. |
| Legacy client | Deleted `lib/screencast-demo-client.ts`, which posted raw `actionId` payloads to `/api/recommendation-review-workflow`. |
| Screencast guard | Added the deleted client to `tests/screencast-new-system-contract.spec.ts` retired-source assertions. |
| Source terminology | Updated active audit/source text that still cited the deleted client as evidence. |
| Typed workflow API | Kept `/api/recommendation-review-workflow` as a deleted generic route boundary for moved/unsupported action IDs; no product-like client path points to it. |

## Files Changed

| File | Purpose |
| --- | --- |
| `lib/screencast-demo-client.ts` | Deleted obsolete client helper. |
| `tests/screencast-new-system-contract.spec.ts` | Guards against restoring the deleted client path. |
| `docs/v3/capability-truth-audit.v3.json` | Removes stale evidence language that treated the deleted client as current truth. |
| `reports/boc-ctes-lokaler-code-capability-audit-2026-06-26/03_capability_analysis.md` | Updates analysis language from quarantined client to deleted legacy path. |
| `reports/boc-ctes-lokaler-code-capability-audit-2026-06-26/05_capability_reality_report.md` | Records the completed deletion audit. |
| `reports/boc-ctes-lokaler-code-capability-audit-2026-06-26/10_current_ordered_execution_report.md` | Marks `FOLLOWUP-4` done and sets the next cleanup recommendation. |

## Validation

```bash
rg -n "runScreencastDemoAction" app components lib tests --glob '!test-results/**'
pnpm exec playwright test tests/screencast-new-system-contract.spec.ts tests/screencast-new-system-contract.spec.ts tests/data-maintenance-command-client-source.spec.ts tests/advice-release-history-command-client-source.spec.ts tests/platform-admin-command-client-source.spec.ts --workers=1
pnpm typecheck
pnpm gate:capability-report
git diff --check
```

Results:

- `runScreencastDemoAction` scan: only source-guard test references remain; no app/component/lib implementation remains.
- Screencast-client deletion proof pack: `9 passed`.
- `pnpm typecheck`: `PASS`.

## Claim Boundary

- This removes the legacy `runScreencastDemoAction` implementation path from product code.
- This does not delete `/api/recommendation-review-workflow`; that route remains as a fail-closed compatibility boundary with typed-route guidance.
- No UI implementation changed in this ticket; no screenshot proof is required.
