# AlphaVest UXP2 Fake Affordance Register

## Status

| Field | Value |
| --- | --- |
| Register status | `PHASE_2_REGISTER_INITIALIZED_UXP2_001` |
| Phase | Phase 2 - Fake Affordance Pruning |
| Last updated | 2026-06-22 by `UXP2-001` |
| Product authority | None |
| Route scope authority | None |

## Purpose

This register records visible affordances touched by Phase 2 and the action taken: kept with lifecycle proof, disabled with reason, made non-interactive, removed, or deferred to a later Phase 2 task.

## Entries

| Task | Target | Affordance | Evidence checked | Action taken | Rationale | Validation |
| --- | --- | --- | --- | --- | --- | --- |
| `UXP2-001` | Global topbar search on MVP/MVP_SUPPORT shells | Tenant-scoped global search input and result links | `components/global-search-box.tsx`, `app/api/global-search/route.ts`, `lib/global-search-service.ts`, `tests/dbtf-tables-api.spec.ts` | Kept interactive with explicit scoped DB lifecycle, registered-route result links and accessibility metadata | Existing lifecycle has query state, loading, empty, error, scoped API, role/tenant parameters, no hidden-row disclosure and no placeholder result URLs. | `tests/global-search-affordance.spec.ts`, `tests/dbtf-tables-api.spec.ts` |
| `UXP2-001` | Global topbar search on P1/HOLD/REFERENCE route shells | Tenant-scoped global search input | `components/top-bar.tsx`, `components/route-skeleton-page.tsx`, `lib/route-registry.ts` | Disabled with visible reason | Registered-only routes must not gain product interactions through global chrome. | `tests/global-search-affordance.spec.ts` |
| `UXP2-001` | Static `SearchShell` controls in admin template/role areas | Non-input search-looking static shell | `components/admin-tenant-setup-screen.tsx` | Left non-interactive | It is rendered as text inside a non-focusable static container, so it is not a fake clickable search control. Local list filtering is handled by later UXP2 tasks. | Source inspection |
| `UXP2-001` | Screen-level queue/list search inputs | Local search inputs | Source inventory across `components/*` | Deferred | These are local list/table/filter affordances owned by `UXP2-002` and `UXP2-003`, not global search. | Inventory only |

## Acceptance Notes

- No new API, schema, route or product scope was added.
- P1, HOLD and reference route shells keep global search disabled.
- The retained global search is explicitly tenant/role scoped and fail-closed.
- Full route-smoke is deferred to the UXP2-010 phase gate per execution instruction.
