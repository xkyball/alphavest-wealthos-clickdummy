# AlphaVest E06 Data Surface And Master-Detail Audit

Date: 2026-06-27

## Reconciliation Status

This file is the pre-implementation audit snapshot for the current uploaded E06 data-surface/master-detail epic. The implementation gaps below were closed for E06 by `docs/ux/ALPHAVEST_E06_DATA_SURFACE_MASTER_DETAIL_SPEC.md`, commit `c41f518`, focused E06 tests and route-smoke/density/browser validation.

Backend filtering, pagination, sorting and URL state remain explicitly out of scope; disabled/static filters must continue to say they are not wired.

## Source

Upload epic: `E06 - Data Surface and Master-Detail Pattern Implementation`

Ticket order:

1. `E06-A1` analyse current data-surface patterns.
2. `E06-S1` specify data surface and master-detail pattern rules.
3. `E06-I1` implement table/list density presets and row action hierarchy.
4. `E06-I2` implement controlled filter/search active state patterns.
5. `E06-I3` implement master-detail layout primitive and family adoption.
6. `E06-Q1` validate data surface implementation.

## Current Code Reality

Existing useful primitives:

- `lib/ux-data-surface-contract.ts` defines data-surface families, density values, field priorities, row-action policies, filter states and master-detail modes.
- `components/ui/data-table.tsx` already projects density, field priority, row-action and mobile-card metadata.
- `components/ui/filter-bar.tsx` already projects inactive, active and disabled-static filter state metadata.
- `components/ui/master-detail-surface.tsx` already projects master-detail metadata.
- Representative adoption exists in advisor/compliance queues and the wealth-action board.

Remaining implementation gap:

- The existing spec and tests still refer to `E07` for data surfaces, but the uploaded architecture defines this epic as `E06`.
- Density values are domain-specific (`compact_operations`, `standard_review`, `spacious_detail_support`, `mobile_card_projection`) but the uploaded E06 task explicitly requires compact/default/comfortable table/list density presets.
- `MasterDetailSurface` is currently a metadata wrapper only; it does not provide named master/detail/empty/selected slots as requested by E06-I3.
- Route-family adoption is present, but proof should be moved to E06 naming and strengthened around selected/empty state.

## Decision

Canonical cleanup path:

- Keep the existing domain-specific density names because they carry real product semantics.
- Add explicit E06 density preset aliases: `compact`, `default`, `comfortable`.
- Add a resolver that maps simple aliases and legacy `compact` props to the canonical density contract.
- Extend `MasterDetailSurface` with optional named slots: `master`, `detail`, `empty`, `selectedSummary`.
- Rename/replace E07 data-surface proof language with E06 proof language in docs and tests.

Rejected path:

- Do not keep E07 as a compatibility story while implementing E06. That would preserve a false source-of-truth name and make later E07 client-safe work collide with the actual uploaded E07.

## Out Of Scope Confirmed

- No backend filtering, pagination, sorting or URL state changes.
- No route creation.
- No per-screen column redesign backlog.
- No business navigation changes.
- No schema, permission, audit, release or client-visibility changes.
