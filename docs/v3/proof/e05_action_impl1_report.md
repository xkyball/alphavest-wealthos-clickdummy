# E05 IMPL-E05-1 Action Hierarchy Primitive Report

## Ticket

`IMPL-E05-1: Implement shared action hierarchy primitives`

## Approval

`APPROVE_E05_CANONICAL_ACTION_HIERARCHY_CONTRACT`

## Implementation

- Added `lib/ux-action-hierarchy-contract.ts` as the canonical E05 action hierarchy contract.
- Defined typed action priorities, meanings, placements and availability states.
- Added no-overclaim and downstream-separation rules for approval, release, block, evidence request, export, download, share and client acceptance meanings.
- Centralized action class families and runtime `data-ux-*` projection in the contract.
- Rewired `components/page-header.tsx`, `components/ux-cta-cluster.tsx` and `components/ui/guarded-action-button.tsx` to project from the canonical contract.
- Added `tests/ux-action-hierarchy-contract.spec.ts` for contract coverage and primitive adoption proof.
- Migrated stale runtime assertions that still expected the retired default `ProductGuidancePanel` or old advisor CTA label. The updated tests now assert current operational action surfaces and the E05 projection path.

## Acceptance

Positive:

- Shared primitives now emit canonical action priority, meaning, placement, availability, disabled reason, confirmation, audit and no-overclaim metadata.
- Action meanings distinguish approval, release, block, request evidence, export approval/generation, download, share and client acceptance.
- Existing compatibility attributes such as `data-ux-primary-cta` remain projected for current tests.
- Disabled-control messaging remains accessible.

Negative:

- No route reclassification was introduced.
- No new route, schema, API, permission, audit persistence, release, export or client visibility behavior was introduced.
- No screen/image/state-screen artifact was generated.
- No visible UI redesign was made; current action visuals were preserved while metadata/class projection moved to the canonical contract.

## Validation

- `PLAYWRIGHT_SKIP_WEB_SERVER=1 ./node_modules/.bin/playwright test tests/ux-action-hierarchy-contract.spec.ts` — PASS, 5 passed.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3020 ./node_modules/.bin/playwright test tests/true-ux-cta-state.spec.ts tests/button-cta-lifecycle-pruning.spec.ts tests/disabled-control-a11y-messaging.spec.ts` — PASS, 15 passed.
- `./node_modules/.bin/tsc --noEmit` — PASS.
- `./node_modules/.bin/tsx scripts/source-target-guard.ts` — PASS.

## Screenshot

No screenshot was warranted for this ticket because the implementation preserved visible action styling and changed contract projection, metadata and tests only.

## Completion

`IMPL-E05-1` is complete.
