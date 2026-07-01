# Global Search Wave 2 Product Labels Report

## Scope

- Wave focus: close the Wave 1 visible-copy gap where global search results could show enum-style product statuses such as `ANALYST_REVIEW_PENDING`.
- Product boundary: search remains tenant/role scoped, DB-backed and audit-backed. The wave changes only product result labeling and viewport-safe result panel behavior.
- No route evolution, schema change, migration, client release behavior or permission broadening was introduced.

## Changed Files

- `lib/global-search-service.ts`
- `components/global-search-box.tsx`
- `tests/dbtf-tables-api.spec.ts`
- `tests/global-search-affordance.spec.ts`

## Implementation

- Added shared result-label normalization for global search status and description segments.
- Converted enum-like document, export, audit, queue, role and acronym values into product-native labels before the API response reaches UI components.
- Preserved PostgreSQL full-text search, tenant scoping, role scoping, app-relative links and search audit creation from Wave 1.
- Bounded the global search result panel with a viewport-aware max height and scrolling, so mobile result lists do not extend past the viewport.

## Acceptance

- Search API returns product-native labels for visible `status` and `description` fields.
- Search UI no longer renders raw enum-style values or internal role keys for the checked Bennett result set.
- Search result links remain app-relative and do not expose storage keys, buckets, local paths or public URLs.
- Search execution still creates a scoped `AuditEvent` with `searchMode: "postgres_full_text"`.
- Desktop 1400x900 proof has no horizontal overflow and keeps the search result panel within the viewport.
- Mobile 390x844 proof has no horizontal overflow and keeps the search result panel within the viewport.

## Validation

- `pnpm guard:source` - PASS
- `pnpm typecheck` - PASS
- `pnpm exec eslint lib/global-search-service.ts components/global-search-box.tsx tests/dbtf-tables-api.spec.ts tests/global-search-affordance.spec.ts` - PASS
- `pnpm build` - PASS with pre-existing Turbopack warnings in `lib/document-storage-adapter.ts`
- `pnpm playwright test tests/dbtf-tables-api.spec.ts --workers=1` - PASS, 15/15
- `pnpm playwright test tests/global-search-affordance.spec.ts --workers=1` - PASS, 2/2
- `pnpm lint` - FAIL on pre-existing unrelated lint debt outside this wave:
  - React `set-state-in-effect` errors in `components/client-intake-screen.tsx` and `components/decisions-governance-screen.tsx`
  - Next `<a>` route navigation errors in `components/communication-export-ops-screen.tsx`, `components/decisions-governance-screen.tsx` and `components/wealth-actions-screen.tsx`

## Screenshot Proof

- `artifacts/screenshots/global-search-wave2/global-search-bennett-product-labels-desktop-1400x900.png`
- `artifacts/screenshots/global-search-wave2/global-search-bennett-product-labels-mobile-390x844.png`

Screenshot audit result:

- Forbidden raw status text visible: false
- Horizontal overflow: false
- Search panel bottom within viewport: true
- Visible product labels include `Analyst review pending`, `Needs clarification`, `Extraction review`, `Awaiting document`, `Active`, `Linked to evidence`, `Family CFO` and `IPS risk addendum`.

## Negative Result

- This wave does not address the repository-wide lint debt listed above.
- This wave does not broaden global search into a universal command palette or add new searchable object classes.
- This wave does not create client-visible release behavior; global search remains an internal workspace search with audit evidence only.

## Next Recommended Wave

Use the same product-first selection rule on the next highest E2E gap: choose a visible workflow where a page still exposes internal process wording, route/demo semantics or UI-only success state, then close it through service/readmodel/audit proof rather than copy-only cleanup.
