# IMPL-1.4 - Export Scope Selection Guard & Tests

Generated: 2026-06-26

Status: `COMPLETE_ZERO_DELTA_PRODUCT_CODE`

Source ticket: `IMPL-1.4`

## Approved Boundary

Human-approved Option A applies:

- canonical export command authority: `/api/export-workflow`;
- canonical command service: `lib/export-workflow-command-service.ts`;
- MVP export routes 054-058 only;
- no new API;
- no schema migration;
- no real binary export;
- zero-delta-first revalidation, patching only proven gaps.

## Task

Harden export scope selection so only actor-authorized, tenant-scoped, object-scoped and client-safe content can enter export preview/package candidates.

## Execution Result

No product-code change was needed.

The current repository already satisfies the first-wave IMPL-1.4 contract through:

- `parseExportWorkflowCommandRequest` requiring scope items for `SET_SCOPE`;
- `requireDemoTenant` and `loadExportRequest` enforcing tenant-scoped export request access;
- `requireExportWorkflowRole` restricting export commands to export-operational roles;
- `exportService.evaluateExportScope` blocking invalid/forbidden selected objects before request creation;
- `permissionGate` applying export permission/payload checks before state progression;
- `/api/export-workflow` returning fail-closed envelopes on invalid request, permission denial or scope denial.

## Subtasks

| Subtask | Status | Evidence |
| --- | --- | --- |
| 1.4.1 Scope request contract and object allowlist enforcement | `ALREADY_PRESENT_VERIFIED` | `lib/export-workflow-command-service.ts` scope parsing, tenant loading, role gate, scope evaluation and audit-backed creation. |
| 1.4.2 Wrong-tenant / wrong-object export denial tests | `ALREADY_PRESENT_VERIFIED` | `tests/export-workflow-api.spec.ts` includes conditional external advisor/object-scoped denial and blocked scope/generation paths. |

## Tests Run

```bash
pnpm playwright test tests/export-command-spine-contract.spec.ts tests/export-workflow-api.spec.ts --workers=1
```

Result:

- PASS, 7 passed.

Covered proof:

- single canonical export command authority;
- legacy proof families retired behind `/api/export-workflow`;
- command/audit stage alignment;
- scope, redaction, preview, approval, generation, download and share separation;
- forbidden internal payload blocking before preview/approval;
- data-quality blocker before approval;
- conditional external advisor export scope inactive and object-scoped.

## Acceptance Check

| Acceptance | Result |
| --- | --- |
| Export scope checks align with PP-001 and PP-004 | PASS |
| Wrong tenant/object/role/payload attempts are denied | PASS |
| Denied scope attempts return no hidden payload | PASS |
| Audit behaviour implemented or routed to audit ticket | PASS - scope creation and lifecycle audit events are already command-spine backed; deeper audit failure proof continues in IMPL-1.7. |

## Residual Risk

Route 057 still has path `/export/:id/approval` with title/purpose copy using preview language. This is not an IMPL-1.4 scope defect; it remains tracked for wording/lifecycle review in IMPL-1.6 and IMPL-1.8.

## Result

`IMPL-1.4_COMPLETE`

Next ticket in uploaded order: `IMPL-1.5`.
