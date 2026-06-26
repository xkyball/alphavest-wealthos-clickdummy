# PP-001 Implementation - Current User / Tenant / Role Proof Harness

Generated: 2026-06-26

Tasks:

- `IMPL-1` Current User / Tenant / Role Proof Harness
- `IMPL-1.1` Current User Mapping and Session Context Proof
- `IMPL-1.2` Tenant Membership and Cross-Tenant Denial Proof

Status: `COMPLETE`

## Active Ticket Order

Execution remained one ticket at a time:

1. `IMPL-1.1` executed and validated first.
2. `IMPL-1.2` executed and validated second.
3. Parent `IMPL-1` closed after both subtasks passed.

## Change Summary

Updated `tests/auth-spine.spec.ts` with a consolidation-first bridge proof:

- DB-user JWT login resolves `/api/current-user`.
- The returned current-user role and tenant are mapped into the strict demo-session/permission context with `tryCreateDemoSession`.
- The bridge asserts actor id, actor email, tenant id and tenant membership alignment.
- The bridge then evaluates a permitted document view through `permissionEngine.can`.
- A cross-tenant Morgan-context check using the same Bennett current-user actor is denied and audit-required.

No product auth implementation, route, schema, API or UI changes were made.

## Proof Added

| Proof | Expected result |
| --- | --- |
| DB JWT current-user -> strict demo-session bridge | `tryCreateDemoSession` succeeds without fallback. |
| Actor identity alignment | Demo actor id/email match current-user actor id/email. |
| Tenant membership alignment | Demo tenant id and membership match current-user tenant id. |
| Permission bridge | Scoped client-visible document view allows with `DEMO_ROLE_AWARE_ALLOW`. |
| Cross-tenant denial | Bennett actor against Morgan context denies with `DEMO_DENY_ACTOR_TENANT_CONTEXT_MISMATCH`. |
| Denial audit requirement | Cross-tenant denial sets `requiresAudit: true`. |

## Validation

```bash
pnpm exec playwright test tests/auth-spine.spec.ts --workers=1
```

Result: PASS, 4/4 tests.

## Acceptance Check

| Criterion | Result |
| --- | --- |
| Known DB-user JWT resolves to current user, active role, tenant membership and memberships list | Pass |
| Known current-user maps into strict demo-session context without fallback | Pass |
| Known actor/tenant/action combination passes with expected reason code | Pass |
| Cross-tenant context fails closed | Pass |
| Cross-tenant denial requires audit | Pass |
| Product code untouched | Pass |
| UI untouched | Pass |

## Residual Risk

This slice proves the current-user bridge for one representative client actor: Bennett Family CFO. Broader role coverage remains in downstream PP-001 tasks and should be handled through matrix-driven tests instead of expanding this auth-spine test into a giant role suite.

## Ticket Completion

`IMPL-1.1`, `IMPL-1.2` and parent `IMPL-1` are finished.
