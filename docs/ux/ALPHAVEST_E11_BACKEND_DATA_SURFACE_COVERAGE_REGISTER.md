# AlphaVest E11 Backend Data Surface Coverage Register

Epic: E11 - Backend-backed data surface truth pass
Decision: `approved`
Baseline: `f536198 feat: implement e10 register reconciliation cleanup`

## Register Rule

A data surface may call itself DB-backed only when its visible query, filter, sort and pagination state is backed by an API/readmodel contract or is explicitly marked as static, disabled or local-snapshot-only.

## Coverage Classes

| Class | Meaning | Allowed UI Claim |
| --- | --- | --- |
| `backend_query_backed` | API accepts query/filter/sort/page parameters and returns result metadata. | DB-backed, paginated, filtered. |
| `backend_snapshot_only` | API returns a DB snapshot but the UI filters/sorts locally or lacks page metadata. | DB snapshot loaded; not backend-filtered. |
| `backend_partial_no_pagination` | API filters some parameters but lacks `pageSize`, cursor/offset and total metadata. | Backend filtered, not paginated. |
| `static_demo_surface` | UI uses demo/static arrays without a productive readmodel. | Static demo only. |
| `disabled_static` | Control is intentionally not wired and says so. | Disabled/static only. |

## Inventory

| ID | Surface | Files | Current Class | Gap | Target Class | First Fix Ticket |
| --- | --- | --- | --- | --- | --- | --- |
| E11-DS-001 | Client Intake - family members | `components/client-intake-screen.tsx`, `app/api/family-members/route.ts`, `lib/dbtf-table-service.ts` | `backend_snapshot_only` | UI fetches all scoped rows and applies search/sort locally; API lacks page metadata. | `backend_query_backed` | E11-I2 |
| E11-DS-002 | Client Intake - entities | `components/client-intake-screen.tsx`, `app/api/entities/route.ts`, `lib/dbtf-table-service.ts` | `backend_snapshot_only` | API can filter, but UI does not pass filters and applies local search/sort; API lacks page metadata. | `backend_query_backed` | E11-I2 |
| E11-DS-003 | Client Intake - documents | `components/client-intake-screen.tsx`, `app/api/documents/route.ts`, `lib/document-upload-service.ts` | `backend_partial_no_pagination` | API accepts document filters but UI fetches `source=all` and filters locally; service hard-caps with `take: 12` and no result metadata. | `backend_query_backed` | E11-I2 |
| E11-DS-004 | Admin Tenant Directory | `components/admin-tenant-setup-screen.tsx`, `app/api/admin-tenants/route.ts`, `lib/admin-tenant-readmodel-service.ts` | `backend_snapshot_only` | GET returns one full snapshot; UI filters locally and falls back to demo rows when snapshot is empty. | `backend_query_backed` | E11-I3 |
| E11-DS-005 | Admin Tenant Users | `components/admin-tenant-setup-screen.tsx`, `app/api/admin-tenants/route.ts`, `lib/admin-tenant-readmodel-service.ts` | `backend_snapshot_only` | User rows are sliced out of a snapshot for one tenant and lack filter/page metadata. | `backend_query_backed` | E11-I3 |
| E11-DS-006 | Review Monitoring - due reviews | `components/review-monitoring-screen.tsx`, `app/api/review-monitoring/route.ts`, `lib/review-monitoring-service.ts` | `static_demo_surface` | UI imports demo rows even though an API snapshot exists; disabled filters are not wired to the readmodel. | `backend_query_backed` | E11-I4 |
| E11-DS-007 | Review Monitoring - rebalance triggers | `components/review-monitoring-screen.tsx`, `app/api/review-monitoring/route.ts`, `lib/review-monitoring-service.ts` | `static_demo_surface` | UI imports demo rows and does not consume API rebalance rows. | `backend_query_backed` | E11-I4 |
| E11-DS-008 | Shared DataTable | `components/ui/data-table.tsx` | `client_only_component` | Internal sort runs on provided rows; no pagination props, result metadata or source-truth marker. | `backend_query_capable_component` | E11-I5 |

## Hard Findings

- E06 explicitly kept backend filtering, pagination, sorting and URL state out of scope.
- E10 registered fake/static filter exceptions but did not implement productive query contracts.
- E11 must not close by adding more disabled labels. It must make high-value surfaces either productively backend-query-backed or visibly local/static.

## Acceptance Notes

- No schema migration is authorized by this register.
- Existing safety boundaries remain intact: no client release, advice execution, export approval or cross-tenant visibility change is authorized by E11.
- Demo/static fallback removal is required where the UI currently labels a surface as DB-backed.
