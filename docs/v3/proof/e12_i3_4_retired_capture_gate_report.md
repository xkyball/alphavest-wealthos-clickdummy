# E12 I3.4 Retired Pattern And Capture QA Gate Report

Ticket: E12-I3.4 - Retired Pattern and Release Capture QA Rule Checks
Status: `complete`
Date: 2026-06-27

## Implemented

- Added active-code checks that fail if retired ProductGuidance implementation paths re-enter:
  - `components/product-guidance-panel.tsx`
  - `lib/product-guidance.ts`
  - active imports of retired ProductGuidance modules
- Added release capture QA script check requiring:
  - `CAPTURE_QA_FAIL_ON_WARNINGS=1`
  - `scripts/capture-qa-contract.ts`
- Scoped action/filter debt scanning to component source so the gate does not self-match its own regex definitions.
- Added negative tests for retired ProductGuidance imports and soft release capture scripts.

## Validation

| Command | Result |
| --- | --- |
| `pnpm exec tsx scripts/contract-fulfillment-gate.ts` | PASS, 44 entries, 0 violations |
| `pnpm typecheck` | PASS |
| `pnpm playwright test tests/contract-fulfillment-gate.spec.ts tests/e10-register-reconciliation.spec.ts tests/e09-capture-release-policy.spec.ts` | PASS, 15 tests |
| `pnpm guard:source` | PASS, 0 violations |

## Boundaries

- Final consolidated gate test suite remains for E12-I3.5.
- No package script or `phase:check` integration was added.
- No UI changed; no screenshot was warranted.
