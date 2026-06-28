# AlphaVest BOC/CTES EPIC-04 QA Report

Date: 2026-06-28

## Scope

EPIC-04: Master-Detail, Data Surface and Long-Screen Governance.

Executed tickets in order:

1. `EPIC-04-SPEC-01`
2. `EPIC-04-IMPL-01A`
3. `EPIC-04-IMPL-01B`
4. `EPIC-04-IMPL-01C`
5. `EPIC-04-QA-01`

## Implemented Contract

- Added `docs/00-current/ALPHAVEST_MASTER_DETAIL_DATA_SURFACE_LONG_SCREEN_GOVERNANCE_CONTRACT.json`.
- Linked the EPIC-04 contract from `docs/00-current/ALPHAVEST_PROCESS_FIRST_UX_LAYOUT_CONTRACT.md`.
- Extended `lib/ux-data-surface-contract.ts` with EPIC-04 surface governance patterns, long-screen governance policy and runtime attributes.
- Extended `components/ui/master-detail-surface.tsx` so the existing shared primitive projects the governance contract instead of introducing a parallel adapter.
- Migrated representative screen S038 `/compliance/reviews` to declare:
  - `governancePattern="queue_workbench"`
  - `longScreenGovernance="resolved_by_shared_surface"`
  - `targetScreenId="S038"`

## Validation

Commands run:

- `pnpm guard:source` - passed.
- `pnpm playwright test tests/ux-data-surface-contract.spec.ts tests/ux-master-detail-surface.spec.ts tests/ux-page-template-long-page.spec.ts --workers=1` - passed, 15 tests.

Focused prior validations:

- `pnpm playwright test tests/ux-data-surface-contract.spec.ts tests/ux-master-detail-surface.spec.ts --workers=1` - passed, 12 tests.
- `pnpm playwright test tests/ux-master-detail-surface.spec.ts --workers=1` - passed, 6 tests.

## Screenshot Proof

Screenshot:

- `artifacts/screenshots/epic-04/s038-compliance-queue-governance.png`

Live DOM proof for `/compliance/reviews`:

```json
{
  "contract": "epic_04_master_detail_data_surface_long_screen",
  "pattern": "queue_workbench",
  "target": "S038",
  "longScreen": "resolved_by_shared_surface",
  "noOverclaim": "true"
}
```

## Acceptance Result

Positive:

- The shared data-surface contract now exposes canonical EPIC-04 governance attributes.
- `MasterDetailSurface` projects the EPIC-04 attributes without a second UI primitive.
- S038 is a representative release-adjacent consumer and carries the governance contract in source and live DOM.
- Regression tests lock no-overclaim rules, required runtime attributes and required master-detail slots.
- Existing long-screen exception tests remain green.

Negative:

- The S038 queue still has long-page visual height in the full-page screenshot; EPIC-04 records it as governed by a shared workbench, not as fully eliminated layout debt.
- Screenshot proof is visual/context proof only. It does not prove release, export, evidence sufficiency, permission mutation, client visibility or client acceptance.
- No new schema, API, IdP, route split or client-visible advice claim was made.

## Deviations And Decisions

No user decision was required.

The bold cleanup decision taken inside scope was to extend the existing canonical `ux-data-surface-contract.ts` and `MasterDetailSurface` rather than creating an EPIC-04-specific duplicate primitive. This removes future compatibility debt instead of hiding it behind a new adapter name.

## Recommended Next Ticket

Proceed to `EPIC-06` only after using the EPIC-04 contract as a hard gate for any further queue, governance, evidence, compliance or long-screen migration. Do not accept local screen-specific list/detail/audit stacking as equivalent to a governed workbench.
