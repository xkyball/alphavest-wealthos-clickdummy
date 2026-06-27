# E12 Capture QA Quarantine And Long-Screen Burndown Report

Ticket: E12-CAPTURE-QA-QUARANTINE-AND-LONG-SCREEN-BURNDOWN
Approval: `APPROVE_E12_CAPTURE_QA_QUARANTINE_AND_LONG_SCREEN_BURNDOWN`
Status: `implemented_release_blocked_until_fresh_capture`
Date: 2026-06-27

## Implemented

| Area | Result |
| --- | --- |
| Legacy capture handling | Historical audit only through `pnpm visual:capture-qa` |
| Release capture input | `artifacts/release-candidate/current` |
| Release capture output | `artifacts/capture-qa/release-current` |
| Release capture generator | `pnpm visual:capture-routes:release-candidate` |
| Fresh capture requirement | `CAPTURE_QA_REQUIRE_CAPTURES=1` |
| Warning behavior | `CAPTURE_QA_FAIL_ON_WARNINGS=1` |
| Burndown register | `docs/ux/ALPHAVEST_E12_LONG_SCREEN_BURNDOWN_REGISTER.md` |
| Ledger entry | `E12-CAPTURE-QA-QUARANTINE-001` |

## Result

The release gate no longer scans the whole legacy `artifacts/` tree as release truth. It now requires a fresh release-candidate capture folder. Until that folder exists and passes without warnings, `pnpm release:contract-check` remains blocked by design.

## Validation

| Command | Result |
| --- | --- |
| `pnpm test:contract-fulfillment` | PASS, 46 entries, 0 violations |
| `pnpm playwright test tests/capture-qa-contract.spec.ts tests/e09-capture-release-policy.spec.ts tests/contract-fulfillment-gate.spec.ts tests/ux-contract-ledger.spec.ts --workers=1` | PASS, 20 tests |
| `pnpm release:contract-check` | FAIL by design at `pnpm visual:capture-qa:release` because `artifacts/release-candidate/current` has no fresh E09 capture manifest yet |

## Release Gate Result

| Capture QA Metric | Result |
| --- | ---: |
| Input | `artifacts/release-candidate/current` |
| Captures checked | 0 |
| Failures | 1 |
| Warnings | 0 |
| Long-screen risks | 0 |
| Status | FAIL |

The active blocker is now absence of fresh release-candidate capture proof, not historical legacy-capture warning volume.

## Screenshot

No UI changed. No screenshot was warranted.
