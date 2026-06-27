# AlphaVest E10 Data Surface Filter Exception Register

Epic: E10 - Register Reconciliation and Legacy UX Debt Burn-Down
Ticket: E10-A1 - Register inventory
Decision: `APPROVE_E10_HARD_RETIRE_AND_MIGRATE_REGISTERS`
Baseline: `c50ba31 chore: enforce e09 capture release policy`

## Register Rule

Route-local search/filter controls must either use `FilterBar` / `DataTable` / the canonical data-surface contract or carry an explicit temporary exception. Fake live-filter affordances are not allowed.

## Inventory

| ID | File | Current Finding | Decision | Target | Follow-up |
| --- | --- | --- | --- | --- | --- |
| DSF-001 | `components/admin-tenant-setup-screen.tsx` | Tenant directory has local search input and local disabled additional-filter button. | migrate_first_slice | Move to `FilterBar` or add explicit `data-ux-data-surface-filter-state`/exception marker. | E10-I2 |
| DSF-002 | `components/admin-tenant-setup-screen.tsx` | Tenant users no longer has a disabled filter button; E11 backend-query metadata owns the users filter truth. | retired_by_backend_query_contract | Keep retired unless a new disabled/static filter is introduced with a new ledger ID. | E12-I2.3 |
| DSF-003 | `components/communication-export-ops-screen.tsx` | Export/communication queue has disabled queue filters. | migrate_first_slice | Convert to `FilterBar` disabled-static or exception marker. | E10-I2 |
| DSF-004 | `components/decisions-governance-screen.tsx` | Evidence list has local disabled search input and disabled category/source/more filters. | migrate_first_slice | Move to `FilterBar` disabled-static. | E10-I2 |
| DSF-005 | `components/internal-workflow-screen.tsx` | Advisor/compliance queues already use `FilterBar` with disabled-static state when static filters are visible. | keep_canonical | No migration needed; keep as proof exemplar. | none |
| DSF-006 | `components/review-monitoring-screen.tsx` | Review schedule has local disabled filter button. | migrate_later | Convert after first-slice data-surface gate is stable. | E10-I2-followup |
| DSF-007 | `components/wealth-actions-screen.tsx` | Action board disabled filters and board filter summary are custom local controls. | migrate_first_slice | Convert board filters to shared disabled-static pattern or explicit board adapter. | E10-I2 |
| DSF-008 | `components/client-intake-screen.tsx` | Documents page has real DB-backed search/filter selects plus disabled access filter. | keep_backend_backed_with_exception | Keep real filters; mark access filter as disabled-static boundary. | E10-I2 |
| DSF-009 | `components/kyc-aml-workflow-screen.tsx` | Search input appears in KYC flow. | temporary_exception | Audit before migration; KYC safety wording and route state need separate check. | E10-I2-followup-kyc |

## Acceptance Notes

- `FilterBar` and `DataTable` are the canonical target.
- Backend-backed filters should not be downgraded to static controls.
- Disabled-static controls must expose accessible reason metadata.
