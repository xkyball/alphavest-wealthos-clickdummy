# PP005 IMPL-1.9 — Demo / API Directness

Status: COMPLETE_ZERO_DELTA_PRODUCT_CODE

## Ticket

Verify that PP005 export commands use the canonical `/api/export-workflow` command spine and that `/api/demo-workflow` cannot act as export approval, package generation, download or share proof.

## Detailed Description

PP005 Option A approves the existing `/api/export-workflow` route as the only canonical export command authority for this wave. Demo workflow export actions may remain only as retired/compatibility surfaces and must point to the canonical API instead of mutating export state or creating fake proof.

## Execution

- Inspected `app/api/export-workflow/route.ts`.
- Inspected `app/api/demo-workflow/route.ts`.
- Inspected `lib/export-workflow-command-service.ts`.
- Inspected `lib/export-workflow-readmodel-service.ts`.
- Inspected export approval UI tests and API truth tests.
- No product-code change was required.

## Validation

Command:

```bash
pnpm playwright test tests/export-command-spine-contract.spec.ts tests/phase8-export-workflow-api.spec.ts tests/true-ux-api-service-ui-truth.spec.ts tests/export-approval-lifecycle.spec.ts --workers=1
```

Result:

- PASS: 13 passed.

Positive acceptance:

- The canonical export API route is `/api/export-workflow`.
- The canonical command service is `lib/export-workflow-command-service.ts`.
- Export command IDs are aligned as `SET_SCOPE`, `VALIDATE_REDACTION`, `PREVIEW`, `APPROVE`, `GENERATE`, `DOWNLOAD`, `SHARE`.
- Export approval UI submits only the typed approval event through `/api/export-workflow`.
- Export workflow snapshot declares DB read-model truth and no demo fallback proof.

Negative acceptance:

- Legacy `/api/demo-workflow` export approval simulation returns `410`.
- Legacy demo export action reports `LEGACY_EXPORT_DEMO_ACTION_RETIRED`.
- Legacy demo export action points to `/api/export-workflow`.
- Invalid export workflow scope fails closed.
- Export approval fail-closed UI feedback does not imply downstream delivery.

## Proof

- `tests/export-command-spine-contract.spec.ts`
- `tests/phase8-export-workflow-api.spec.ts`
- `tests/true-ux-api-service-ui-truth.spec.ts`
- `tests/export-approval-lifecycle.spec.ts`

## Deviations / Blockers

- No blocker.
- Strategic cleanup remains recommended after PP005: remove or fully adapter-route retired export branches in `/api/demo-workflow` so demo compatibility cannot accumulate as a second workflow language.

## Next Ticket

Proceed to PP005 QA-1.10 integrated validation.
