# AlphaVest E06 Data Surface And Master-Detail Implementation Spec

Date: 2026-06-27

## Status

| Field | Value |
| --- | --- |
| Epic | `E06 Data Surface and Master-Detail Pattern Implementation` |
| Source | Uploaded overarching UX BOC implementation architecture |
| Implementation status | `AUTHORIZED_BY_USER_FOR_THIS_RUN` |
| Dependencies | `E01 tokens`, `E02 templates` |
| Audit | `docs/ux/ALPHAVEST_E06_DATA_SURFACE_MASTER_DETAIL_AUDIT.md` |

## Required Rules

Data surface density:

- Tables/lists must support compact, default and comfortable presets.
- Domain-specific density values may remain when they encode stronger product meaning.
- Legacy boolean `compact` may remain only as a compatibility input that resolves to the canonical density contract.
- Density must not hide identity, status, risk/due or evidence-gate fields.

Row action hierarchy:

- Row actions are contextual and must not compete with page primary actions.
- Row action policies must state whether they open detail, preview, route handoff, command handoff, blocked status or no action.
- Row actions must never imply approval, release, evidence sufficiency, export, download, share or client acceptance.

Filter/search state:

- Search/filter inactive, active query, active filter, combined active state, disabled-static and unsupported-hidden states must be distinguishable.
- Disabled-static filters must expose why they are not wired.
- Visual filter affordances must not imply backend filtering when no backend filtering exists.

Master-detail:

- A reusable master-detail primitive must support list/master, detail, empty and selected-state slots.
- Master-detail mode must identify inline detail rail, drawer detail, route detail or none.
- Selected object metadata must preserve object identity, object state and blocked/safe-next-step context.
- Family adoption must be real UI adoption, not only a contract file.

## Implementation Plan

1. Add E06 density aliases and resolver to `lib/ux-data-surface-contract.ts`.
2. Wire `DataTable` through the resolver so `compact/default/comfortable` are explicit supported presets.
3. Extend `FilterBar` with visible active state labels/count metadata without backend implication.
4. Extend `MasterDetailSurface` with named master/detail/empty/selected slots.
5. Apply or strengthen route-family adoption in advisor/compliance queues and one board/detail surface.
6. Rename E07 data-surface tests/docs to E06 semantics.

## Acceptance Criteria

- Data table supports compact/default/comfortable presets and existing domain presets.
- Row action hierarchy remains contract-backed.
- Filter/search active states are visible and testable.
- Master-detail primitive exposes selected and empty states.
- At least one queue family and one board/detail family use the primitive.
- Route smoke, density and focused data-surface tests pass.
