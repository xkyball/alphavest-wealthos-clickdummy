# E12 I3.2 Action And Filter Debt Gate Report

Ticket: E12-I3.2 - Action / Filter / Proof UI Debt Rule Checks
Status: `complete`
Date: 2026-06-27

## Implemented

- Extended `evaluateContractFulfillmentGate` with source-file scanning.
- Added failure for unregistered local action-class vocabulary:
  - `primaryButtonClass`
  - `secondaryButtonClass`
  - `staticButtonClass`
  - `destructiveButtonClass`
- Added failure for unregistered `data-ux-e10-filter-exception-id` values.
- Added fixture tests proving new unregistered action/filter debt fails.
- Added fixture tests proving registered E10 debt remains allowed during the approved warn-existing transition.

## Validation

| Command | Result |
| --- | --- |
| `pnpm exec tsx scripts/contract-fulfillment-gate.ts` | PASS, 44 entries, 0 violations |
| `pnpm typecheck` | PASS |
| `pnpm playwright test tests/contract-fulfillment-gate.spec.ts tests/e10-register-reconciliation.spec.ts` | PASS, 12 tests |
| `pnpm guard:source` | PASS, 0 violations |

## Boundaries

- Backend query correlation checks remain for E12-I3.3.
- Retired proof UI and capture release-warning checks remain for E12-I3.4.
- No package script or `phase:check` integration was added.
- No UI changed; no screenshot was warranted.
