# E07 IMPL-E07-1 Data Surface Contract And Row Action Report

## Ticket

`IMPL-E07-1` - Implement table/list density presets and row action hierarchy.

## Source

- Spec: `docs/ux/ALPHAVEST_E07_DATA_SURFACE_MASTER_DETAIL_SPEC.md`
- Analysis: `docs/v3/proof/e07_data_surface_master_detail_analysis.md`
- Approval: `APPROVE_E07_CANONICAL_DATA_SURFACE_CONTRACT`

## Implementation Summary

- Added `lib/ux-data-surface-contract.ts` as the canonical E07 source for data-surface family, density, field priority, row/card action policy, filter state and master-detail mode vocabulary.
- Updated `components/ui/data-table.tsx` so shared tables project E07 density, field-priority and row-action metadata.
- Preserved current visual table classes and existing row sorting/mobile card behavior.
- Added `tests/ux-data-surface-contract.spec.ts` to prove the canonical vocabulary, attribute projection and no-overclaim row-action boundaries.
- Updated `tests/true-ux-shared-primitives.spec.ts` so existing shared-primitive proof recognizes E07 data-surface projection.

## Files Changed

- `lib/ux-data-surface-contract.ts`
- `components/ui/data-table.tsx`
- `tests/ux-data-surface-contract.spec.ts`
- `tests/true-ux-shared-primitives.spec.ts`
- `docs/v3/proof/e07_data_surface_impl1_report.md`

## Acceptance Mapping

| Acceptance item | Result |
| --- | --- |
| Canonical typed E07 contract exists | Complete via `lib/ux-data-surface-contract.ts`. |
| Density resolves to runtime attributes | Complete via `uxDataSurfaceAttributesFor` and `DataTable` projection. |
| Field priority resolves to runtime attributes | Complete via `DataTableColumn.priority` and fallback priority mapping. |
| Row action policy resolves to runtime attributes | Complete via `uxDataSurfaceActionAttributesFor`. |
| Existing `DataTable` sorting/mobile/state behavior preserved | Complete; classes and state handling were retained. |
| Row action no-overclaim boundary is explicit | Complete; `open_detail` remains navigation/detail context only, not release/export/advice/client acceptance. |

## Validation

- `./node_modules/.bin/tsx scripts/source-target-guard.ts` - PASS.
- `./node_modules/.bin/tsc --noEmit` - PASS.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 ./node_modules/.bin/playwright test tests/ux-data-surface-contract.spec.ts tests/true-ux-shared-primitives.spec.ts` - PASS, 8 passed.

## Screenshot

No screenshot was warranted for `IMPL-E07-1`: the ticket intentionally preserved visual classes and added contract/runtime metadata plus tests. Screenshots become necessary in later E07 tickets if visible density, sticky rail, table, filter or board layout changes are made.

## Risks And Follow-Up

- `FilterBar`, `Kanban` and master-detail mode adoption are intentionally left for `IMPL-E07-2` and `IMPL-E07-3`.
- Existing route-local manual tables are not yet retired by this ticket; `QA-E07-1` must verify migration or exception markers after all implementation tickets complete.

## Ticket Result

`IMPL-E07-1` is complete.
