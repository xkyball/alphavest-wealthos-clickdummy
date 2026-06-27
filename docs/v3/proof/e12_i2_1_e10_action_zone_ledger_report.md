# E12 I2.1 E10 Action-Zone Ledger Mapping Report

Ticket: E12-I2.1 - Map E10 Action / Hierarchy Contracts into Ledger
Status: `complete_with_known_downstream_filter_blocker`
Date: 2026-06-27

## Implemented

- Added `E10-AZ-001` through `E10-AZ-011` as row-level ledger entries in `lib/ux-contract-ledger.ts`.
- Added stable `sourceRegisterId`, `registerDecision` and `expiresOrFollowUp` metadata for every E10 action-zone row.
- Exported `e10ActionZoneLedgerEntries`, `e10RegisteredActionFiles` and `e10FirstSliceActionFiles` from the ledger.
- Updated `tests/e10-register-reconciliation.spec.ts` so the action-zone gate consumes ledger exports instead of owning a duplicate file list.
- Updated `tests/ux-contract-ledger.spec.ts` so ledger grouping accounts for row-level E10 entries.

## Validation

| Command | Result |
| --- | --- |
| `pnpm typecheck` | PASS |
| `pnpm playwright test tests/ux-contract-ledger.spec.ts` | PASS, 6 tests |
| `pnpm playwright test tests/e10-register-reconciliation.spec.ts -g "action-class|action-zone|approved E10"` | PASS, 3 tests |
| `pnpm guard:source` | PASS, 0 violations |

## Known Downstream Blocker

Full `tests/e10-register-reconciliation.spec.ts` still fails in the disabled-filter lane:

`DSF-002` is expected in `registeredFilterExceptionIds`, but the scanned source only exposes `DSF-001`, `DSF-003`, `DSF-004`, `DSF-007` and `DSF-008`.

This belongs to the later E10 data-surface filter mapping/cleanup lane, not to E12-I2.1 action-zone mapping.

## Boundaries

- No E10 data-surface filter mapping was implemented in this ticket.
- No E11 mapping was implemented in this ticket.
- No global gate or package script was added.
- No UI changed; no screenshot was warranted.
