# Filter Copy Wave 3 Queue Harmonization Report

## Scope

- Wave focus: remove demo/backend-oriented filter summaries from Advisor and Compliance queue surfaces.
- Product boundary: keep the existing queue search, sort, row action and detail-route behavior intact while making the visible state product-native.
- Additional source-visible cleanup: replace held-route guidance that exposed workflow/audit/proof wording with user-facing release boundaries.

## Changed Files

- `components/ui/filter-bar.tsx`
- `components/internal-workflow-screen.tsx`
- `lib/operational-route-guidance.ts`
- `tests/route-smoke.spec.ts`

## Implementation

- Changed the shared `FilterBar` default disabled-static summary to product language: optional filters unavailable, search and row sorting remain available.
- Updated Advisor and Compliance queue summaries so active searches read as queue search state, not demo/static-filter scaffolding.
- Removed forced table-only rendering from the two queue tables so mobile uses the shared card projection and no longer creates horizontal overflow.
- Added a stable desktop minimum width and wrapping behavior for `FilterBar` search inputs so long filter sets do not squeeze the search field.
- Rewrote five held-route safety hints in `lib/operational-route-guidance.ts` to describe release availability and user consequences without exposing workflow/audit/proof contracts.

## Acceptance

- Advisor queue search still filters to `Michael Wong` and row action opens advisor detail.
- Compliance queue search still filters to `CMP-2025-0134` and row action opens the selected decision room.
- Visible Advisor and Compliance queue copy no longer contains `disabled demo controls`, `backend filtering is implied` or `Static filters remain visible`.
- Desktop 1400x900 screenshots have no horizontal overflow and keep the primary task in view.
- Mobile 390x844 screenshots have no horizontal overflow and use responsive queue cards.
- `source-visible-non-negotiable` passes after route-guidance copy cleanup.

## Validation

- `pnpm guard:source` - PASS
- `pnpm typecheck` - PASS
- `pnpm exec eslint components/ui/filter-bar.tsx components/internal-workflow-screen.tsx lib/operational-route-guidance.ts tests/route-smoke.spec.ts` - PASS with pre-existing warnings in large files
- `pnpm playwright test tests/route-smoke.spec.ts -g "UX-INTERACTION table search sort row-action semantics" --workers=1` - PASS, 3/3
- `pnpm playwright test tests/source-visible-non-negotiable.spec.ts --workers=1` - PASS, 3/3
- `pnpm build` - PASS with pre-existing Turbopack warnings in `lib/document-storage-adapter.ts`
- `pnpm lint` - FAIL on pre-existing unrelated lint debt outside this wave
- `pnpm playwright test tests/filter-affordance-pruning.spec.ts --workers=1` - PARTIAL/STALE, 1/3 pass; failing expectations reference older `/tenants/demo/users` pagination and `/evidence` placeholder behavior, not this wave's Advisor/Compliance queue changes

## Screenshot Proof

- `artifacts/screenshots/filter-copy-wave3/advisor-queue-filter-copy-desktop-1400x900.png`
- `artifacts/screenshots/filter-copy-wave3/advisor-queue-filter-copy-mobile-390x844.png`
- `artifacts/screenshots/filter-copy-wave3/compliance-queue-filter-copy-desktop-1400x900.png`
- `artifacts/screenshots/filter-copy-wave3/compliance-queue-filter-copy-mobile-390x844.png`

Screenshot audit result:

- Forbidden legacy copy visible: false
- Horizontal overflow: false
- Filtered row visible: true
- Expected product summary visible: true
- Desktop search input minimum width: pass
- Mobile card projection: pass

## Negative Result

- This wave does not solve the repository-wide lint errors in `client-intake`, `communication-export`, `decisions-governance` or `wealth-actions`.
- This wave does not update the stale `filter-affordance-pruning` expectations for `/tenants/demo/users` and `/evidence`.
- This wave does not convert disabled optional filters into fully wired backend filters; it only makes the current user-facing boundary accurate and product-native.

## Next Recommended Wave

Pick the next highest visible blocker in operational surfaces: replace repeated `Blocked until a typed workflow command is implemented` affordances with real product-native disabled reasons or, where a command path already exists, wire the control through service, DB state, audit/evidence and tests.
