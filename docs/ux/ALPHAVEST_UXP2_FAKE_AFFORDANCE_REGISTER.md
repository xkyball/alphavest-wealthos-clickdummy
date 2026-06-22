# AlphaVest UXP2 Fake Affordance Register

## Status

| Field | Value |
| --- | --- |
| Register status | `PHASE_2_REGISTER_UPDATED_UXP2_002` |
| Phase | Phase 2 - Fake Affordance Pruning |
| Last updated | 2026-06-22 by `UXP2-002` |
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
| `UXP2-002` | Actions board `/actions` | Board filter chips, grouping control and secondary filter CTA | `components/wealth-actions-screen.tsx` | Disabled with visible/accessible reasons | The board is static in this release; filters/grouping would imply data mutation without lifecycle proof. | `tests/filter-affordance-pruning.spec.ts` |
| `UXP2-002` | Tenant and user list pages | Additional filter buttons around real search/status controls | `components/admin-tenant-setup-screen.tsx` | Disabled with visible/accessible reasons | Existing search/status controls are real where wired; generic filter drawer buttons are not wired. | `tests/filter-affordance-pruning.spec.ts` |
| `UXP2-002` | Evidence and document list controls | Static evidence filters plus document scope chips | `components/decisions-governance-screen.tsx`, `components/client-intake-screen.tsx` | Disabled with reasons; real document selects remain active | Evidence list filters/search had no visible row lifecycle; document type/status/sensitivity selects remain real. | `tests/filter-affordance-pruning.spec.ts`, `tests/scf-p10-p14-closure.spec.ts` |
| `UXP2-002` | Held/deferred support components | Review, ops and committee filter controls in non-MVP/HOLD support components | `components/review-monitoring-screen.tsx`, `components/communication-export-ops-screen.tsx`, `components/committee-review-screen.tsx` | Disabled with reasons | Protected scopes must not gain productive list filtering before scope unlock. | Source inspection; full route-smoke deferred to UXP2-010 |

## Acceptance Notes

- No new API, schema, route or product scope was added.
- P1, HOLD and reference route shells keep global search disabled.
- The retained global search is explicitly tenant/role scoped and fail-closed.
- Generic filter controls touched in UXP2-002 are either real, disabled with reason, or non-interactive.
- Full route-smoke is deferred to the UXP2-010 phase gate per execution instruction.
