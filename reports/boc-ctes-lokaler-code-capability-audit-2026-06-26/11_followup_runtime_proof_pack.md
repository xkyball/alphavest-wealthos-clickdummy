# Follow-Up Runtime Proof Pack

Ticket: `FOLLOWUP-1`  
Status: `DONE`  
Decision basis: `DECISION-1` accepted with limitations and cleanup authorization.  
Proof result: `PASS_WITH_LIMITATIONS`

## Scope

This proof pack validates the currently typed command surfaces authorized after the baseline decision:

- Export workflow API, approval lifecycle and download lifecycle.
- Tenant-governance typed command API for J06/J07 tenant, user, role and governance actions.
- Platform-admin typed command API for J10 platform/security actions.
- Platform-admin browser runtime path from UI control to typed command API.
- Source-level command-client guards that keep these families away from `runScreencastDemoAction`.

## Command Run

```bash
pnpm exec playwright test tests/export-workflow-api.spec.ts tests/phase8-export-workflow-api.spec.ts tests/export-approval-lifecycle.spec.ts tests/export-download-confirmation-lifecycle.spec.ts tests/tenant-governance-actions-api.spec.ts tests/platform-admin-actions-api.spec.ts tests/platform-admin-browser-runtime.spec.ts tests/platform-admin-command-client-source.spec.ts tests/export-command-spine-contract.spec.ts --workers=1
```

Result: `26 passed`.

## Evidence Summary

| Surface | Evidence | Result |
| --- | --- | --- |
| Export workflow | `tests/export-workflow-api.spec.ts`, `tests/phase8-export-workflow-api.spec.ts`, `tests/export-approval-lifecycle.spec.ts`, `tests/export-download-confirmation-lifecycle.spec.ts`, `tests/export-command-spine-contract.spec.ts` | `PASS` |
| Tenant governance J06/J07 | `tests/tenant-governance-actions-api.spec.ts` | `PASS` |
| Platform admin J10 API | `tests/platform-admin-actions-api.spec.ts` | `PASS` |
| Platform admin J10 browser runtime | `tests/platform-admin-browser-runtime.spec.ts` | `PASS` |
| Platform admin source wiring | `tests/platform-admin-command-client-source.spec.ts` | `PASS` |

## Claim Boundary

- This upgrades the listed typed command surfaces from static/source evidence to focused runtime proof for this run.
- This does not certify every product route, every role, every tenant, every DB transition or every visual state.
- This does not authorize `/api/recommendation-review-workflow` as a product-like command API.
- This does not complete J01 or J02/J03 cleanup; those remain separate authorized follow-up tickets.

## Screenshot Note

No UI implementation changed in this ticket. The browser runtime tests exercised existing UI paths, but no new screenshot proof is required for this non-UI-change validation slice.
