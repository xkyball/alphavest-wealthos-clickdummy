# AlphaVest V1.0 WP-01 Providerless Scope Report

Generated: 2026-06-23
Authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
Companion task source: `/Users/chris/Downloads/ALPHAVEST_V1_0_DETAILED_IMPLEMENTATION_TASK_DESCRIPTIONS.md`

## Scope

WP-01 hardens providerless demo auth into a deterministic actor, tenant, role and object-scope foundation. No route scope was reclassified, no schema was changed, and no new role was introduced.

## Task Status

| Task | Status | Notes |
|---|---|---|
| `V10-WP01-T01` Actor Context Readmodel | `IMPLEMENTED` | `ActorContext` now exposes `userId`, `actorUserId`, `platformTenantId`, `clientTenantId`, `roleKey`, `roleKeys`, `scopes`, `demoMode`, `pilotMode`, `correlationId`, tenant slug and the mapped demo session. |
| `V10-WP01-T02` Tenant Membership / Role Resolution | `ALREADY_PRESENT_VERIFIED` | `tryCreateDemoSession`, tenant membership resolution and role mapping already fail closed for unknown role, unknown tenant and actor/tenant mismatch. |
| `V10-WP01-T03` Unknown / Wrong Tenant Fail-Closed | `ALREADY_PRESENT_VERIFIED` | `resolveActorContext`, `resolveTenantObjectScope` and `permissionEngine` deny unknown actor, missing tenant, wrong tenant and wrong object scope with audited denial semantics. |
| `V10-WP01-T04` Providerless Scope Tests | `UPDATED` | `tests/control-layer-actor-scope.spec.ts` now asserts the V1.0 ActorContext fields plus existing negative paths. |

## Changed Files

- `lib/control-layer/actor-context.ts`
- `tests/control-layer-actor-scope.spec.ts`
- `V1_0_WP01_PROVIDERLESS_SCOPE_REPORT.md`

## Validation

| Command | Result |
|---|---|
| `pnpm playwright test tests/control-layer-actor-scope.spec.ts` | PASS, 5 passed |
| `pnpm test:providerless-scope` | PASS, 9 passed |
| `pnpm phase:check` | PASS with existing lint/build warnings |

## Known Warnings

- `pnpm phase:check` still reports existing lint warnings for unused UI helpers and capture helpers.
- Build still reports the existing custom Babel config warning and Turbopack/NFT warnings around `lib/document-storage-adapter.ts`.

## Verdict

`WP01_READY`.

The providerless actor/tenant/role foundation is deterministic, tenant-scoped, role-scoped, fail-closed for unknown contexts, and covered by positive and negative tests. Next package: `WP-02` route/action/object/payload guard spine.
