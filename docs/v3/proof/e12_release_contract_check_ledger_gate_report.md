# E12 Release Contract Check Ledger Gate Report

Ticket: E12-RELEASE-CONTRACT-CHECK-LEDGER-GATE
Approval: `APPROVE_E12_RELEASE_CONTRACT_CHECK_LEDGER_GATE`
Status: `implemented_release_blocking_existing_capture_debt`
Date: 2026-06-27

## Scope

The release contract check is now part of the E12 ledger as `E12-RELEASE-GATE-001`.

## Implemented Contract

| Area | Result |
| --- | --- |
| Package script | `pnpm release:contract-check` |
| Ledger entry | `E12-RELEASE-GATE-001` |
| Contract gate rule | `E12-GATE-RELEASE-CONTRACT-CHECK` |
| Long-screen / overflow release behavior | Release-blocking through `pnpm visual:capture-qa:release` with `CAPTURE_QA_FAIL_ON_WARNINGS=1` |

## Required Gate Fragments

- `pnpm guard:source`
- `pnpm test:contract-fulfillment`
- `tests/e10-register-reconciliation.spec.ts`
- `tests/e11-backend-data-surface-truth.spec.ts`
- `tests/e09-capture-release-policy.spec.ts`
- `pnpm test:route-smoke`
- `pnpm visual:capture-qa:release`

## Rationale

This keeps `phase:check` as the normal code/build gate and makes release certification a stricter product-truth gate. Capture QA remains artefact-dependent, but it is no longer optional for a release contract claim.

## Validation

| Command | Result |
| --- | --- |
| `pnpm test:contract-fulfillment` | PASS, 45 entries, 0 violations |
| `pnpm playwright test tests/contract-fulfillment-gate.spec.ts tests/ux-contract-ledger.spec.ts tests/e09-capture-release-policy.spec.ts --workers=1` | PASS, 17 tests |
| `pnpm release:contract-check` | FAIL at `pnpm visual:capture-qa:release` after source guard, ledger gate, E10/E11 truth and route smoke passed |

## Release Blocker Found

| Capture QA Metric | Result |
| --- | ---: |
| Captures checked | 815 |
| Duplicate clusters | 0 |
| Metadata / QA warnings | 3020 |
| Long-screen risks | 558 |
| Status | FAIL |

The failure is intentional release behavior: `visual:capture-qa:release` treats warnings as blockers through `CAPTURE_QA_FAIL_ON_WARNINGS=1`.

## Screenshot

No UI changed. No screenshot was warranted.
