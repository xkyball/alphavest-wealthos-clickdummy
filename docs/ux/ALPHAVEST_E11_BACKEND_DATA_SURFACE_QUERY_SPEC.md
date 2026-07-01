# AlphaVest E11 Backend Data Surface Query Specification

Epic: E11 - Backend-backed data surface truth pass
Ticket: E11-S1 - Canonical query spec
Decision: `approved`

## Purpose

E11 closes the truth gap left by E06/E10: shared tables and filters must no longer imply backend-backed filtering, sorting or pagination unless the API contract proves it.

## Canonical Request Contract

Backend-backed data surfaces should accept this normalized query shape:

| Parameter | Meaning | Rule |
| --- | --- | --- |
| `q` | Full-text search term | Trimmed, capped, optional. |
| `sortKey` | Allowed field key | Must be in the surface allow-list. |
| `sortDirection` | `asc` or `desc` | Defaults per surface. |
| `pageSize` | Requested page size | Clamped to the surface max. |
| `page` | 1-based page number | Defaults to `1`; invalid values fail closed or normalize to default by explicit parser rule. |
| typed filters | Surface-specific filters | Must be allow-listed; unsupported filters must not silently broaden access. |

Legacy `sort` parameters may remain as aliases only where existing tests depend on them, but new UI should use `sortKey` and `sortDirection`.

## Canonical Response Contract

Every backend-query-backed list response must return:

```ts
{
  rows: T[];
  meta: {
    page: number;
    pageSize: number;
    returnedRows: number;
    totalRows: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    sortKey: string;
    sortDirection: "asc" | "desc";
    query: string;
    sourceTruth: "backend_query_backed";
  };
  safety: {
    hiddenRowsDisclosed: false;
    scoped: true;
  };
}
```

Existing top-level array names may stay during migration (`familyMembers`, `entities`, `documents`) if the matching `meta` object is added.

## UI Claim Rules

1. A label may say `DB-backed` only if data came from an API/readmodel response.
2. A label may say `filtered`, `showing X of Y` or `paginated` only if backend metadata includes `totalRows` and page state.
3. A local in-memory filter on an already-loaded snapshot must say `local snapshot filter` or be migrated.
4. A static/demo table must not expose productive filter/search/pagination controls.
5. Demo fallback arrays are forbidden for surfaces labelled DB-backed. On API failure, render a fail-closed state.

## Component Rules

- `DataTable` may keep local sorting for static/demo surfaces.
- `DataTable` must support an explicit server mode where sort clicks delegate through `onSortChange` and do not re-sort rows locally.
- Pagination controls must be disabled only when backend `meta` says there is no previous/next page.
- Pagination controls must expose accessible labels and stable data attributes for QA.

## Safety Rules

- E11 does not authorize schema changes, route creation, advice release, export approval, trade/rebalance execution or client visibility changes.
- Query parsing must never turn an invalid tenant, actor, role or filter into a broader result.
- Cross-tenant and hidden rows must remain undisclosed in both result rows and metadata.
- Full-text search must be ACL-native: the query sent to the full-text index must already include the actor's tenant, role, visibility scope, object-type allow-list and object-grant constraints. Product code must not query a broad full-text result set and then hide unauthorized rows in application/UI code.
- Backend list search that uses the global full-text index must first ask the index for accessible object IDs in the active actor scope, then query the domain readmodel by those IDs. If the index returns no accessible IDs, the list returns no rows.

## Acceptance Criteria

- E11 coverage register and spec exist.
- Shared parser/helper validates page, page size, sort and filter allow-lists.
- DBTF family/entity/document endpoints return query metadata.
- Admin tenant directory/user endpoints return query metadata and remove DB-labelled demo fallback.
- Review monitoring UI consumes `/api/review-monitoring` instead of demo rows.
- `DataTable` can render server-backed pagination/source-truth UI.
- Source and API tests prove the above and prevent regression to fake backend claims.
