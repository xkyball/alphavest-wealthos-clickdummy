# AlphaVest V1.0 API Contract Rebase

Generated: 2026-06-23
Authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
Companion task source: `/Users/chris/Downloads/ALPHAVEST_V1_0_DETAILED_IMPLEMENTATION_TASK_DESCRIPTIONS.md`

## Scope

This rebase replaces the stale four-API assumption in `API_CONTRACT_MATRIX.md` with the current 15-route API surface observed in the repository. It is a contract/proof artefact only: no new API routes were created, no P1 route was promoted to V1 core, and support APIs remain guarded or read-only unless their existing handler already owns a scoped mutation.

## API Contract Map

| API | Methods | Actor / Scope | Request Contract | Response Contract | Validation / RBAC / Redaction / Audit | Error Envelope Status |
|---|---|---|---|---|---|---|
| `/api/admin-tenants` | `GET`, `POST` | Admin tenant setup support; invite action only | `POST action=invite_user` payload | Snapshot or invite result; no production-auth claim | Demo-auth service validates invite/MFA semantics; no client release | `PARTIAL_SAFE`; ad-hoc envelope, no release claim |
| `/api/audit-events` | `GET` | Tenant + role scoped audit read | `tenantSlug`, `roleKey`, optional `q`, `result` | Scoped audit rows | Invalid scope returns empty rows; read-only audit display is not proof of persistence | `PARTIAL_SAFE`; ad-hoc empty fail-closed payload |
| `/api/auth/dummy` | `POST` | Demo auth only | `start_login`, `verify_mfa`, `accept_invite` | Demo session/auth result and cookie when valid | Explicit `productionAuthClaim:false`; no real auth claim | `PARTIAL_SAFE`; ad-hoc provider-safe envelope |
| `/api/dashboard-metrics` | `GET` | Tenant + role scoped support read | `tenantSlug`, `roleKey` | Metrics snapshot | Invalid scope blocks; no client release | `PARTIAL_SAFE`; ad-hoc null metrics payload |
| `/api/demo-workflow` | `POST` | MVP/support action transport | JSON action body parsed by `parseDemoWorkflowRequestBody` | Action result or fail-closed error | Permission, audit, evidence, export and workflow gates are action-family specific | `HARDENED`; uses `failClosedJson` |
| `/api/documents` | `GET` | Tenant + role scoped document read | `tenantSlug`, `roleKey`, optional filters | Scoped document rows | Invalid scope returns empty list; upload/list does not prove sufficiency or release | `PARTIAL_SAFE`; explicit no-release/no-advice fail-closed flags |
| `/api/documents/review` | `POST` | Evidence review actor | JSON `documentId`, `action`, `tenantSlug`, `roleKey`, evidence acknowledgements | Review result and service safety | Review service enforces validation, permission, sufficiency and denied audit cases | `PARTIAL_SAFE`; ad-hoc no-release fail-closed flags |
| `/api/documents/upload` | `POST` | Authorized uploader | Multipart `file`, tenant/role/document metadata | Upload result with upload-only safety | Validates multipart/file/role/tenant; denied/audit-unavailable paths fail closed | `HARDENED`; uses `failClosedJson` |
| `/api/entities` | `GET`, `POST` | Tenant + role scoped support entity workflow | Query filters or entity wizard body | Entity rows or wizard result | Validation/permission service guards mutation; no client release | `PARTIAL_SAFE`; ad-hoc mutation fail-closed flags |
| `/api/export-workflow` | `GET` | Tenant + role scoped export read model | `tenantSlug`, `roleKey` | Export workflow snapshot | Read-only; no generation/download/share from GET | `PARTIAL_SAFE`; ad-hoc snapshot-null fail-closed payload |
| `/api/family-members` | `GET`, `PATCH` | Tenant + role scoped family workflow | Query filters or patch body | Family rows or update result | Validation/permission service guards mutation; no client release | `PARTIAL_SAFE`; ad-hoc mutation fail-closed flags |
| `/api/global-search` | `GET` | Tenant + role scoped support search | `tenantSlug`, `roleKey`, `q` | Empty or scoped search results | Short query returns empty; no hidden rows disclosed | `PARTIAL_SAFE`; ad-hoc empty fail-closed payload |
| `/api/ops-sla` | `GET` | Tenant + role scoped ops support | `tenantSlug`, `roleKey`, optional `asOf` | Ops/SLA snapshot | Invalid scope/date blocks; no advice execution or client release | `PARTIAL_SAFE`; ad-hoc snapshot-null fail-closed payload |
| `/api/profile` | `GET`, `PATCH` | Tenant + role scoped client profile workflow | Query context or profile patch body | Profile or update result | Validation/permission/not-found service guards mutation; no client release | `PARTIAL_SAFE`; ad-hoc mutation fail-closed flags |
| `/api/review-monitoring` | `GET` | Internal monitoring support | Optional `asOf` | Monitoring snapshot with guard | Invalid date/DB missing fail closed; no automatic advice trigger | `HARDENED`; uses `failClosedJson` |

## WP-10 Findings

- `ALREADY_PRESENT`: Current repository has 15 API route files, not the stale four-route contract baseline.
- `ALREADY_PRESENT`: MVP core APIs have targeted positive/negative tests for workflow, upload, evidence review, audit, export and monitoring fail-closed behavior.
- `HARDENED`: `failClosedJson` now prevents caller-supplied extras from overriding safety-critical envelope fields.
- `PARTIAL`: Several support APIs still use ad-hoc safe payloads rather than the shared fail-closed helper; they are scoped/read-only or service-guarded and do not currently promote P1 work to V1 core.
- `DEFERRED`: Full migration of all support APIs to the shared envelope should be a later mechanical cleanup after WP-12 acceptance proof, not a broad handler rewrite inside WP-10.

## No-New-API Decision

WP-10 did not create new API routes. The existing 15 handlers are sufficient for the V1.0 task surface after current hardening and proof.
