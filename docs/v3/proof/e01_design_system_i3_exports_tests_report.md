# E01-I3 Export And Test Normalization Report

Date: 2026-06-27

## Ticket

`E01-I3` - Normalize component exports and design-system usage points.

## Scope Implemented

- Added `a11y-status` and `disabled-control-reason` to `components/ui/index.ts`.
- Added focused E01 source/contract coverage in `tests/ux-design-system-foundation.spec.ts`.
- Rebased stale `tests/true-ux-density.spec.ts` expectations away from visible `product-guidance` proof panels and onto real density runtime metadata.
- Rebased the stale D4 representative route from `/ips/demo/decision-room` to `/evidence/demo/review`, because IPS route `067` is currently `HOLD_PENDING_DECISION` in route registry truth.

## Files Changed

- `components/ui/index.ts`
- `tests/ux-design-system-foundation.spec.ts`
- `tests/true-ux-density.spec.ts`

## Acceptance Review

| Requirement | Result |
| --- | --- |
| Shared components have stable exports | PASS |
| New E01 contract has focused test coverage | PASS |
| Stale proof-panel test expectation retired instead of restoring legacy UI | PASS |
| No duplicate primitive pattern introduced | PASS |
| Route scope preserved | PASS |

## Validation

Covered by:

- `pnpm typecheck` - PASS
- `pnpm playwright test tests/ux-design-system-foundation.spec.ts tests/true-ux-shared-primitives.spec.ts tests/ux-lifecycle-state-contract.spec.ts --workers=1` - PASS, 17 passed
- `pnpm test:route-smoke` - PASS, 192 passed
- `pnpm playwright test tests/true-ux-density.spec.ts tests/true-ux-a11y.spec.ts --workers=1` - PASS, 13 passed

## Ticket Result

`E01-I3` is complete. `E01-Q1` is enabled.
