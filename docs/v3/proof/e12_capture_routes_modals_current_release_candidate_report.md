# E12 Capture Routes And Modals Current Release-Candidate Report

Ticket: E12-CAPTURE-ROUTES-MODALS-CURRENT-RELEASE-CANDIDATE
Status: `implemented`
Date: 2026-06-27

## Implemented

| Area | Result |
| --- | --- |
| Script | `scripts/capture-routes-and-modals.ts` |
| Release-candidate flag | `--release-candidate` |
| Release-candidate env | `AVS_CAPTURE_RELEASE_CANDIDATE=1` |
| Output root | `artifacts/release-candidate/current` |
| Package script | `pnpm visual:capture-routes:release-candidate` |
| Capture QA behavior | `requireCaptures` and `failOnWarnings` are enabled for release-candidate captures |
| Ledger/Gate behavior | `visual:capture-routes:release-candidate` is now part of the E12 capture release contract |

## Notes

The normal audit capture path still writes timestamped output under `artifacts/routes-and-modals/<run>`. The release-candidate path writes directly to `artifacts/release-candidate/current` so `pnpm visual:capture-qa:release` can validate the exact folder used by `pnpm release:contract-check`.

## Validation

| Command | Result |
| --- | --- |
| `pnpm guard:source` | PASS, 0 violations |
| `pnpm test:contract-fulfillment` | PASS, 46 entries, 0 violations |
| `pnpm playwright test tests/capture-routes-and-modals-contract.spec.ts tests/capture-qa-contract.spec.ts tests/e09-capture-release-policy.spec.ts tests/contract-fulfillment-gate.spec.ts tests/ux-contract-ledger.spec.ts --workers=1` | PASS, 27 tests |
| `pnpm typecheck` | PASS |

## Screenshot

No product UI changed. No screenshot was warranted.
