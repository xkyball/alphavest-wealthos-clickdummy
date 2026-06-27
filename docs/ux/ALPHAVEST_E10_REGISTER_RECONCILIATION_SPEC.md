# AlphaVest E10 Register Reconciliation And Legacy UX Debt Burn-Down Specification

Epic: E10 - Register Reconciliation and Legacy UX Debt Burn-Down
Ticket: E10-S1 - Hard rules/spec
Decision: `APPROVE_E10_HARD_RETIRE_AND_MIGRATE_REGISTERS`

## Purpose

E10 prevents the E03/E05/E06/E07/E09 cleanup work from stopping at partial shared primitives while legacy local implementations continue as equal truth.

## Operative Registers

- `docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md`
- `docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md`
- `docs/ux/ALPHAVEST_E10_RETIRED_PROOF_UI_REGISTER.md`

## Hard Rules

1. A local action class vocabulary is not canonical.
   - New `primaryButtonClass`, `secondaryButtonClass`, `staticButtonClass` and `destructiveButtonClass` definitions are blocked unless the file is already listed in the E10 action-zone register.
   - Existing registered local class aliases must project from `ux-action-hierarchy-contract` when touched.
   - Productive workflow action groups should migrate to `ActionZone` / `StickyActionZone` / `ActionButton`.

2. A local static filter is not canonical.
   - New route-local disabled filter/search controls are blocked unless listed in the E10 data-surface filter exception register.
   - Existing disabled filters must expose `data-ux-data-surface-filter-state="disabled_static"` and accessible disabled reason metadata when touched.
   - Backend-backed filters remain valid only when they visibly affect rows or are explicitly scoped as backend-backed exceptions.

3. Retired proof UI is not a compatibility target.
   - `ProductGuidancePanel` must not become visible again.
   - Active operational code should not import `components/product-guidance-panel.tsx`.
   - Active code should migrate away from `ProductGuidance*` naming toward operational route/context naming or canonical page/route contracts.
   - Historical docs may keep historical mentions.

4. Exceptions are temporary and test-visible.
   - Every exception must name a follow-up.
   - Exceptions do not authorize new usage.
   - Follow-ups should remove, migrate or rename the exception rather than expand it.

## Migration Order

1. Inventory and register current debt.
2. Add source gates that prevent new unregistered debt.
3. Migrate first-slice action-zone surfaces where canonical primitives already exist.
4. Migrate first-slice data-surface filter exceptions where `FilterBar` can express the state.
5. Retire or quarantine active proof UI naming.
6. Validate with source gates, focused tests, TypeScript and lint.

## Screenshot Rule

Screenshots are required only for visible layout/control changes. Source-gate, register, naming, metadata or non-visible adapter changes must explicitly report that no screenshot was warranted.

## Acceptance Criteria

- The three registers exist and are populated.
- A source test blocks unregistered local action class growth.
- A source test blocks unregistered local disabled filter/search growth.
- A source test blocks active `ProductGuidancePanel` imports and visible proof-panel resurrection.
- First migration slices reduce or canonicalize at least one registered item in each implementation area.
- No route, schema, API, permission, release, export or client visibility policy changes.

## Bold Cleanup Policy

Do not soften E10 into a documentation-only audit. If a legacy path is still needed, quarantine it with an explicit adapter and a follow-up. If it is not needed, delete or rename it now.
