# E07 IMPL-E07-3 Filter/Search And Sticky Convention Report

## Ticket

`IMPL-E07-3` - Normalize filter/search active state and sticky header conventions.

## Source

- Spec: `docs/ux/ALPHAVEST_E07_DATA_SURFACE_MASTER_DETAIL_SPEC.md`
- Depends on: `IMPL-E07-1`, `IMPL-E07-2`
- Approval: `APPROVE_E07_CANONICAL_DATA_SURFACE_CONTRACT`

## Implementation Summary

- Updated `components/ui/filter-bar.tsx` so the shared filter primitive projects E07 filter-state metadata.
- Added automatic shared filter-state defaults: disabled static when static filters exist, active filter when tabs exist, inactive otherwise.
- Added explicit filter-state metadata to search inputs, active tab groups and disabled static filter controls.
- Added a `stickyHeader` convention prop to `components/ui/data-table.tsx`, preserving the current default of non-sticky table headers.
- Kept representative consumer metadata from `IMPL-E07-2`: internal workflow queues expose active/inactive query state; wealth action board exposes disabled-static filter state.

## Files Changed

- `components/ui/filter-bar.tsx`
- `components/ui/data-table.tsx`
- `tests/ux-filter-sticky-surface.spec.ts`
- `docs/v3/proof/e07_filter_sticky_impl3_report.md`

## Acceptance Mapping

| Acceptance item | Result |
| --- | --- |
| Filter/search active-state metadata exists | Complete via `FilterBar` and representative `DataTable`/board consumers. |
| Disabled static filters are explicit | Complete via `FilterBar` disabled filter metadata and wealth board metadata. |
| Sticky header convention exists | Complete via `DataTable.stickyHeader`, defaulting to non-sticky. |
| No forced route-wide visual redesign | Complete; no representative consumer was changed to sticky by default. |
| Runtime metadata remains proof-only | Complete; no visible product copy was added. |

## Validation

- `./node_modules/.bin/tsx scripts/source-target-guard.ts` - PASS.
- `./node_modules/.bin/tsc --noEmit` - PASS.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 ./node_modules/.bin/playwright test tests/ux-filter-sticky-surface.spec.ts tests/ux-data-surface-contract.spec.ts tests/ux-master-detail-surface.spec.ts` - PASS, 10 passed.
- `./node_modules/.bin/eslint components/ui/filter-bar.tsx components/ui/data-table.tsx tests/ux-filter-sticky-surface.spec.ts` - PASS.

## Screenshot

No screenshot was warranted for `IMPL-E07-3`: this ticket only adds metadata and keeps sticky headers opt-in. Screenshot proof is required if a future ticket turns sticky headers/rails on for visible route surfaces.

## Ticket Result

`IMPL-E07-3` is complete.
