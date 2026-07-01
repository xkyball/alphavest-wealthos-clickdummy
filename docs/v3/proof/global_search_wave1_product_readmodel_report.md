# Global Search Wave 1 Product Readmodel Report

Date: 2026-07-01
Branch: full-workflow
Baseline commit: 1fc0dbe test: add process universe capture model

## Scope

Wave 1 moved global workspace search from in-process demo-row filtering toward a product readmodel surface:

- UI entry: global search in the top bar.
- API: `GET /api/global-search`.
- Service: PostgreSQL full-text query across tenant-scoped product objects.
- DB/readmodel: tenant, document, family member, entity, export, queue, data-quality and audit rows.
- History/audit: each executed search records `global_search.executed` in `AuditEvent`.

No route was created. No Prisma schema or migration was changed. No screen, image or state-screen asset was generated.

## Changed Files

- `app/api/global-search/route.ts`
- `components/global-search-box.tsx`
- `lib/global-search-service.ts`
- `lib/process-universe-capture-model.ts`
- `tests/dbtf-tables-api.spec.ts`
- `tests/global-search-affordance.spec.ts`

## Acceptance Result

Positive:

- Global search now uses PostgreSQL full-text search via `websearch_to_tsquery` and `to_tsvector`.
- Search remains tenant/role scoped and returns product object links only.
- Search response reports `searchMode: "postgres_full_text"`.
- Search writes a scoped `AuditEvent` and exposes the `auditEventId` in the safety envelope.
- UI no longer says "demo DB rows" or "demo database rows".
- The missing Process-Universe UI/IO audit import was removed; capture-model summary now derives from the existing coverage matrix instead of a missing report artifact.

Negative:

- Search result descriptions can still surface enum-style statuses such as `ANALYST_REVIEW_PENDING`. This is product copy debt, not a safety failure. Next wave should add shared product label mapping for search result statuses.

## Validation

Passed:

- `pnpm guard:source`
- `pnpm typecheck`
- `pnpm build`
- `pnpm exec eslint app/api/global-search/route.ts components/global-search-box.tsx lib/global-search-service.ts lib/process-universe-capture-model.ts tests/dbtf-tables-api.spec.ts tests/global-search-affordance.spec.ts`
- `pnpm playwright test tests/dbtf-tables-api.spec.ts --workers=1`
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm playwright test tests/process-universe-capture-model.spec.ts --workers=1`
- `pnpm playwright test tests/global-search-affordance.spec.ts --workers=1`

Blocked / pre-existing:

- `pnpm lint` still fails on unrelated repo-wide lint debt in existing route components, including synchronous `setState` in effects and raw `<a>` navigation to app routes. The touched files pass targeted ESLint.

## Visual Proof

Local screenshots:

- `artifacts/screenshots/global-search-wave1/global-search-bennett-results-desktop-1400x900.png`
- `artifacts/screenshots/global-search-wave1/client-home-mobile-390x844.png`

Viewport audit:

- Desktop 1400x900: no horizontal overflow, 12 result links visible, no demo DB copy, no storage key/path leak, API returned `searchMode: postgres_full_text` and an `auditEventId`.
- Mobile 390x844: no horizontal overflow and no demo DB copy.

## Safety Notes

- No client release, advice, export approval or evidence sufficiency state is created by search.
- Search writes audit history but does not create client visibility.
- Search result links remain app-relative paths; no public URLs, storage keys, buckets or local paths are rendered.
