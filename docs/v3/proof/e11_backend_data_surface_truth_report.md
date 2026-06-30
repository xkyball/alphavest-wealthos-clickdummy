# E11 Backend Data Surface Truth Report

Date: 2026-06-27
Baseline: `f536198 feat: implement e10 register reconciliation cleanup`
Decision: `approved`

## Scope

E11 reconciles the known E06/E10 gap where UI filters, sorting and table labels could imply backend-backed behavior while the implementation still used local snapshots, demo rows or disabled-static controls.

## Ticket Results

| Ticket | Result | Evidence |
| --- | --- | --- |
| E11-A1 Backend coverage register | Complete | `docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md` |
| E11-S1 Canonical query spec | Complete | `docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_QUERY_SPEC.md` |
| E11-I1 Shared backend table contract | Complete | `lib/data-surface-query-contract.ts` |
| E11-I2 DBTF backend query surfaces | Complete | `/api/family-members`, `/api/entities`, `/api/documents` now return `meta.sourceTruth="backend_query_backed"` and visible Client Intake controls query those APIs. |
| E11-I3 Admin tenant readmodel split | Complete | `/api/admin-tenants?surface=tenants|users` returns paginated backend records; `/admin/tenants` now renders the real Tenant Directory work surface instead of the old hub-only placeholder; DB-labelled UI no longer falls back to demo tenant/user arrays. |
| E11-I4 Review monitoring API-backed UI | Complete | `components/review-monitoring-screen.tsx` consumes `/api/review-monitoring` and no longer imports demo row arrays as product row truth. |
| E11-I5 DataTable pagination/source truth UI | Complete | `components/ui/data-table.tsx` supports `serverSort`, backend pagination metadata and source-truth attributes. |
| E11-Q1 Gates/tests | Complete | `tests/e11-backend-data-surface-truth.spec.ts` |

## Acceptance Notes

- No schema migration was introduced.
- Existing safety boundaries remain intact: no client release, advice execution, export approval, rebalance execution or permission broadening was authorized or implemented.
- Static/demo surfaces that were not in the E11 first slice remain future debt; they are not counted as backend-backed.
- Page `013` was reconciled from hub-only runtime treatment to an active `tenant-list` work surface because the route registry, visual catalogue and worksurface metadata already identify `/admin/tenants` as a Tenant List surface.
- Screenshots are required because `DataTable` pagination and admin/user filters changed visible UI.

## Validation Plan

Executed:

```bash
./node_modules/.bin/tsx scripts/source-target-guard.ts
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/playwright test tests/e11-backend-data-surface-truth.spec.ts tests/dbtf-tables-api.spec.ts tests/review-monitoring-service.spec.ts --workers=1
./node_modules/.bin/playwright test tests/e11-backend-data-surface-truth.spec.ts tests/filter-affordance-pruning.spec.ts tests/scf-p10-p14-closure.spec.ts --workers=1
./node_modules/.bin/playwright test tests/route-smoke.spec.ts --workers=1
./node_modules/.bin/eslint .
```

## Validation Results

| Command | Result | Notes |
| --- | --- | --- |
| `./node_modules/.bin/tsx scripts/source-target-guard.ts` | PASS | 0 violations |
| `./node_modules/.bin/tsc --noEmit` | PASS | TypeScript clean |
| `./node_modules/.bin/playwright test tests/e11-backend-data-surface-truth.spec.ts --workers=1` | PASS | 5 passed |
| `./node_modules/.bin/playwright test tests/e11-backend-data-surface-truth.spec.ts tests/filter-affordance-pruning.spec.ts tests/scf-p10-p14-closure.spec.ts --workers=1` | PASS | 12 passed; legacy filter tests now assert backend metadata and API-matched rows/empty states instead of local demo rows. |
| `./node_modules/.bin/playwright test tests/e11-backend-data-surface-truth.spec.ts tests/filter-affordance-pruning.spec.ts --workers=1` | PASS | 8 passed after final Tenant Directory table visual adjustments. |
| `./node_modules/.bin/playwright test tests/dbtf-tables-api.spec.ts tests/review-monitoring-service.spec.ts --workers=1` | BLOCKED_BY_ENV | Both suites fail in `beforeAll` at `pnpm db:seed` because `pnpm approve-builds` has not approved Prisma/build scripts in this environment. E11 assertions were not the failing point. |
| `./node_modules/.bin/playwright test tests/route-smoke.spec.ts --workers=1` | PASS | 192 passed |
| `./node_modules/.bin/eslint .` | PASS_WITH_WARNINGS | 0 errors; 21 pre-existing warnings remain. |

## Screenshot Proof

- `artifacts/screenshots/e11-admin-tenants-backend-pagination.png`
- Visible marker: `Showing 4 of 4 records · Page 1 of 1`
