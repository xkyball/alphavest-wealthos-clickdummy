# AlphaVest UXP2 Fake Affordance Register

## Status

| Field | Value |
| --- | --- |
| Register status | `PHASE_2_REGISTER_UPDATED_UXP2_008` |
| Phase | Phase 2 - Fake Affordance Pruning |
| Last updated | 2026-06-22 by `UXP2-008` |
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
| `UXP2-003` | Shared data-table sort headers | Sort buttons on sortable table columns | `components/ui/data-table.tsx` | Kept interactive with ARIA state and visible row reordering proof | Sort headers are authorized only through the shared table lifecycle: click toggles row order locally, marks the active header with `aria-sort`, and leaves row actions disabled where no action lifecycle exists. | `tests/sort-affordance-pruning.spec.ts` |
| `UXP2-004` | Shared status chips, badges and workflow badges | Status/badge indicators across global route workset | `components/ui/badge.tsx`, `components/ui/status-chip.tsx`, `components/ui/workflow-badge.tsx`, `components/admin-tenant-setup-screen.tsx` | Kept as static indicators with explicit non-interactive metadata | Badge-like elements are informational state labels only; they must not expose button/link/focus affordances or imply direct lifecycle transitions. | `tests/status-badge-affordance-pruning.spec.ts` |
| `UXP2-005` | Shared cards, KPI cards and dashboard summary cards | Card and metric-card containers across global route workset | `components/ui/card.tsx`, `components/ui/metric-card.tsx` | Kept as static informational regions with explicit non-interactive metadata | Cards/KPIs summarize state only; real actions must remain separate buttons/links with their own lifecycle, audit and safety boundaries. | `tests/card-kpi-affordance-pruning.spec.ts` |
| `UXP2-006` | Row actions, audit timelines and evidence/timeline list actions | Shared DataTable row actions, audit timeline items, shared evidence list items, ActionDrawer view-all controls, role matrix row/sort actions | `components/ui/data-table.tsx`, `components/ui/audit-timeline.tsx`, `components/ui/evidence-list.tsx`, `components/wealth-actions-screen.tsx`, `components/decisions-governance-screen.tsx` | Real row actions kept with explicit lifecycle state; no-lifecycle row/timeline/evidence actions disabled or marked static | Row, timeline and evidence affordances are safety-sensitive and must not imply navigation, audit, evidence expansion, role governance or release action unless an existing lifecycle is wired. | `tests/row-timeline-affordance-pruning.spec.ts` |
| `UXP2-007` | Buttons and CTAs across MVP/MVP_SUPPORT screen components | Header CTAs, topbar notification buttons, board add/new actions, auth alternate actions, admin setup CTAs, advisor/compliance secondary CTAs, communication/export operation CTAs | `components/ux-cta-cluster.tsx`, `components/page-header.tsx`, `components/top-bar.tsx`, `components/auth-onboarding-screen.tsx`, `components/wealth-actions-screen.tsx`, `components/admin-tenant-setup-screen.tsx`, `components/internal-workflow-screen.tsx`, `components/client-intake-screen.tsx`, `components/decisions-governance-screen.tsx`, `components/communication-export-ops-screen.tsx`, `components/committee-review-screen.tsx`, `components/ui/filter-bar.tsx`, `components/ui/kanban.tsx` | Dummy buttons removed or rendered as static non-interactive labels; handler-backed buttons and links kept | Buttons must only appear where a real lifecycle exists. Held or unavailable actions may remain visible as text/status, not as fake product controls. | `tests/button-cta-lifecycle-pruning.spec.ts` |
| `UXP2-008` | Reference routes `061-063` (`/service-blueprint`, `/roadmap`, `/states`) | Reference page primary CTA/status, product-guidance next-step links and reference skeleton controls | `components/route-skeleton-page.tsx`, `components/page-header.tsx`, `components/product-guidance-panel.tsx`, `lib/route-registry.ts`, `lib/product-guidance.ts` | Product controls removed from reference shells; remaining `Reference only` affordance is static non-interactive status with explicit reference-scope proof attributes | Reference-only routes are registered context, not product task surfaces. They must expose no primary button/link, mutation, export, release, next-step or workflow-unlocking control. | `tests/reference-product-control-pruning.spec.ts`, `tests/reference-only-copy-cleanup.spec.ts`, `tests/state-copy-cleanup.spec.ts`; route-smoke source updated, execution deferred |

## Acceptance Notes

- No new API, schema, route or product scope was added.
- P1, HOLD and reference route shells keep global search disabled.
- The retained global search is explicitly tenant/role scoped and fail-closed.
- Generic filter controls touched in UXP2-002 are either real, disabled with reason, or non-interactive.
- Sort controls touched in UXP2-003 remain only where the shared table visibly reorders rows and exposes active sort state.
- Status and workflow badge controls touched in UXP2-004 remain static state indicators with no focusable control affordance.
- Card and KPI surfaces touched in UXP2-005 remain static state summaries; actionable flows stay on explicit controls.
- Row, timeline and evidence affordances touched in UXP2-006 are either wired to an existing lifecycle, disabled with a visible reason, or marked static/non-interactive.
- Button and CTA affordances touched in UXP2-007 are either lifecycle-backed controls or static text/status; dummy buttons were removed.
- Reference route product controls touched in UXP2-008 are absent as buttons/links; only static locked status and blocked guidance remain.
- Full route-smoke is deferred until after UXP3-015 per execution instruction.
