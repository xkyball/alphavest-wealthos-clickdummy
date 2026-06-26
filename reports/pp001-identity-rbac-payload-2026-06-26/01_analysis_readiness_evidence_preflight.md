# PP-001 Analysis - Readiness & Evidence Preflight

Generated: 2026-06-26

Task: `ANALYSIS-1 PP-001 Readiness & Evidence Preflight`

Status: `COMPLETE`

## Active Ticket Notice

I worked on exactly one operative ticket in this slice: `ANALYSIS-1`. No product-code implementation was performed.

## Preflight Evidence

Moving baseline preflight from the True-UX handoff:

| Check | Result |
| --- | --- |
| Branch | `full-workflow` |
| Latest commit | `20fea5c split demo workflow action APIs` |
| Working tree before edits | Clean |
| `git diff --stat` before edits | Empty |
| Package manager | `pnpm@9.15.9` |
| Source guard | `pnpm guard:source` passed, `violations: 0` |
| Route registry | Present: `lib/route-registry.ts` |
| Test inventory | Present under `tests/*`, including auth, providerless scope, permission, visibility, governance, audit and P0 API suites |
| Focused proof validation | `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/providerless-scope.spec.ts tests/control-layer-p0-fixtures.spec.ts tests/client-visibility-projection.spec.ts --workers=1` passed, 14/14 tests |

## Sources Inspected

Primary source:

- `/Users/chris/Downloads/alphavest/ALPHAVEST_PP001_IDENTITY_RBAC_PAYLOAD_BOC_CTES_TICKET_ARCHITECTURE.md`

Repo authority and support chain:

- `AGENTS.md`
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md`
- `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md`
- `ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md`
- `ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE_AND_ROUTE_EVOLUTION_POLICY.md`
- `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN.md`

Code/test evidence:

- `app/api/current-user/route.ts`
- `app/api/auth/provider-login/route.ts`
- `lib/auth/current-user.ts`
- `lib/demo-session.ts`
- `lib/permission-engine.ts`
- `lib/visibility-engine.ts`
- `lib/audit-service.ts`
- `lib/control-layer/permission-decision.ts`
- `lib/control-layer/scope-resolver.ts`
- `lib/control-layer/visibility-projection.ts`
- `lib/control-layer/client-visibility.ts`
- `lib/control-layer/audit-guard.ts`
- `tests/auth-spine.spec.ts`
- `tests/providerless-scope.spec.ts`
- `tests/control-layer-p0-fixtures.spec.ts`
- `tests/governance-non-bypass.spec.ts`
- `tests/client-visibility-projection.spec.ts`
- `tests/p0-api-contract.spec.ts`

Prior report patterns:

- `reports/wp10-p0-positive-negative-tests-boc-rerun-2026-06-26/01_executed_analysis_result.md`
- `reports/wp10-p0-positive-negative-tests-boc-rerun-2026-06-26/02_refined_specification_and_decision.md`
- `reports/boc-ctes-lokaler-code-capability-audit-2026-06-26/00_extracted_ticket_register.md`

## Executive Finding

PP-001 is not blocked because the repo lacks identity/RBAC/payload foundations. It is blocked because the existing evidence is distributed across several surfaces and is not yet bound into a single PP-001 proof contract.

The strongest implementation path is therefore not a broad new auth/RBAC rewrite. The strongest path is a consolidation-first proof pack:

1. Treat existing demo-session, DB-user JWT current-user, control-layer scope, permission, visibility and audit helpers as closed-world resources.
2. Bind them through a PP-001 contract that defines which proof layer is authoritative for each acceptance criterion.
3. Add only missing bridge tests or harden only real gaps after `DECISION-1`.

## Existing Proof Slice Map

| PP-001 area | Current evidence | Readiness |
| --- | --- | --- |
| Current-user JWT mapping | `lib/auth/current-user.ts`, `app/api/current-user/route.ts`, `tests/auth-spine.spec.ts` | Strong API proof exists for DB-user JWT current-user resolution and fail-closed missing/invalid JWT. |
| Providerless/demo actor context | `lib/demo-session.ts`, `tests/providerless-scope.spec.ts` | Strong demo proof exists for mapped actor, role and tenant; strict paths reject unknown role/tenant. |
| Tenant membership | `resolveDemoTenantMembership` in `lib/demo-session.ts`, `tests/providerless-scope.spec.ts` | Strong demo proof exists; DB current-user membership exists, but PP-001 should explicitly connect DB-user and demo-context expectations. |
| Cross-tenant denial | `permissionEngine.can`, `tests/providerless-scope.spec.ts` | Strong demo/service proof exists for tenant mismatch and cross-tenant denial. |
| Route/action/object separation | `permissionEngine.evaluateRouteBoundary`, `tests/providerless-scope.spec.ts` | Strong service proof exists that route shell, action authority and payload/object scope are separate. |
| Object-scope denial | `lib/control-layer/scope-resolver.ts`, `permissionEngine.can`, `tests/providerless-scope.spec.ts` | Strong proof exists for wrong object and missing object scope. |
| Payload visibility/projection | `lib/visibility-engine.ts`, `lib/control-layer/visibility-projection.ts`, `lib/control-layer/client-visibility.ts`, `tests/client-visibility-projection.spec.ts` | Strong projection proof exists for recommendation, decision and document payloads; field matrix still needs PP-001-specific contract ownership. |
| Admin non-bypass | `lib/permission-engine.ts`, `tests/governance-non-bypass.spec.ts` | Strong service and DB-backed denied-audit proof exists for admin evidence sufficiency attempt and admin payload non-bypass. |
| Denied/sensitive audit | `lib/audit-service.ts`, `lib/control-layer/audit-guard.ts`, `tests/governance-non-bypass.spec.ts`, `tests/p0-api-contract.spec.ts` | Strong proof exists, but PP-001 needs a unified minimum field list and action family mapping. |
| API fail-closed envelope | `app/api/current-user/route.ts`, `tests/auth-spine.spec.ts`, `tests/p0-api-contract.spec.ts` | Strong proof exists for no mutation, no client release, no advice execution and hidden/internal payload flags. |
| UX safety clarity | True-UX handoff, `tests/true-ux-no-overclaim-copy.spec.ts` and UI copy families are present, but not fully inspected in this ticket | Needs PP-001-specific review scope after technical contract is approved. |

## Current Architecture Observations

### Identity and Session

There are two current identity tracks:

- DB-user JWT track: `lib/auth/current-user.ts` resolves a JWT into a Prisma user with role assignments, memberships and object scopes.
- Demo-session track: `lib/demo-session.ts` provides role/tenant switcher-compatible actors and strict resolution helpers.

This is acceptable for the current demo-first product state, but PP-001 must make the split explicit. Otherwise later implementation may accidentally treat demo-session fallback as equivalent to authenticated current-user authority.

### Tenant, Role and Object Scope

The repo already has deterministic tenants and roles in `lib/demo-session.ts`, seeded DB roles in `prisma/seed.ts`, and object-scope enforcement in `permissionEngine.can` and `lib/control-layer/scope-resolver.ts`.

Important positive finding: `tests/providerless-scope.spec.ts` already proves that visible route context, action authority and payload/object scope are evaluated independently.

### Payload Visibility

The repo has two complementary projection mechanisms:

- Product/demo visibility engine in `lib/visibility-engine.ts`.
- Control-layer generic projection in `lib/control-layer/visibility-projection.ts` and client-specific helpers in `lib/control-layer/client-visibility.ts`.

Important positive finding: `tests/client-visibility-projection.spec.ts` proves that released client-safe recommendations/documents/decisions can be projected without internal fields, and unreleased content fails closed.

Main gap: PP-001 does not yet name a single payload dictionary as acceptance authority. Existing field sets are strong, but distributed.

### Admin Non-Bypass and Audit

`lib/permission-engine.ts` already encodes admin/security non-bypass outcomes for evidence sufficiency, release/visibility/export and internal advice payloads. `tests/governance-non-bypass.spec.ts` proves both permission denial and persisted audit for an admin evidence-sufficiency attempt.

Important positive finding: this is a real proof slice, not merely a disabled-button UI assertion.

### API and Fail-Closed Contracts

`app/api/current-user/route.ts` returns a safe fail-closed envelope for missing/invalid JWT. `tests/p0-api-contract.spec.ts` covers invalid workflow, documents, upload, review monitoring and export workflow fail-closed cases.

Main gap: PP-001 should define which API endpoints are in-scope for PP-001 acceptance rather than assuming every P0 API test belongs to identity/RBAC/payload.

## Missing Positive/Negative Test Map

| Gap | Current status | Recommended action after `DECISION-1` |
| --- | --- | --- |
| DB current-user to permission-engine bridge | Current-user API resolves DB memberships; permission engine is demo-session based | Add a bridge proof or explicit adapter contract only if PP-001 accepts DB-user JWT as part of runtime proof. |
| Single PP-001 actor/role/tenant matrix | Roles exist in demo and seed data, but PP-001 has no accepted final matrix | Approve a compact matrix instead of allowing every seeded role to become PP-001 scope. |
| Payload dictionary ownership | Existing forbidden/allowed fields exist in multiple files | Create one PP-001 payload visibility matrix that references existing constants where possible. |
| Admin action list | Admin non-bypass has strong examples, but PP-001 needs an approved action list | Approve evidence sufficiency, release/visibility, export approval/download and internal advice payload as minimum forbidden admin bypasses. |
| Denied audit minimum fields | Audit service has minimum fields; PP-001 needs acceptance mapping | Use `auditService.criticalAuditMetadata` as baseline and require actor, role, tenant, target, action, result, reason and correlation where available. |
| UX safety-clarity route scope | Existing copy tests are broad True-UX tests, not PP-001-specific | Limit PP-001 UX review to context labels and denied/hidden/redacted/no-overclaim states on routes covered by accepted technical tests. |

## Initial CTES Rerating After Repo Audit

| Item | Upload CTES | Repo-audited decision |
| --- | ---:| --- |
| `IMPL-1` Current User / Tenant / Role parent | 14 | Still split. Do not implement parent directly. |
| `IMPL-1.1` Current User Mapping | 10 | Bounded. Likely bridge-test/report-hardening first, not new auth feature. |
| `IMPL-1.2` Tenant Membership | 11 | Bounded. Existing tests reduce uncertainty. |
| `IMPL-2` Route/Action/Object | 12 | Bounded. Existing providerless proof likely enough for zero- or low-delta if contract accepts it. |
| `IMPL-3` Payload parent | 17 | Still no direct parent implementation. Split remains mandatory. |
| `IMPL-3.1` Payload Matrix | 13 | Strong candidate for report/spec artifact first, then small constant/test alignment. |
| `IMPL-3.2` Payload Negative Tests | 13 | Existing tests cover much of it; likely targeted additions only. |
| `IMPL-4` Admin Non-Bypass parent | 13 | Still split; existing tests reduce implementation risk. |
| `IMPL-4.1` Admin Non-Bypass Tests | 12 | Likely already partially satisfied; add only missing forbidden-action cases. |
| `IMPL-4.2` Denied Audit Proof | 11 | Existing DB-backed audit proof exists; PP-001 should align minimum-field acceptance. |
| `IMPL-5` UX Safety-Clarity | 10 | Still plan-first; should avoid broad redesign. |

## V3 Evidence Branches

Kept:

- Branch A: PP-001 contract consolidation plus targeted bridge tests after approval. Strongest branch because current repo already has meaningful proof and the main risk is fragmented authority.
- Branch B: Minimal zero-delta proof if the accepted contract decides existing tests fully cover PP-001. Plausible, but only after the payload dictionary and actor matrix are accepted.

Killed:

- Branch C: Broad auth/RBAC rewrite. Killed because the repo is demo-data-first and True-UX explicitly forbids starting with real authentication.
- Branch D: UI overlay-only safety clarity. Killed because PP-001 is foundational backend/runtime proof, and UI copy cannot replace guard, payload or audit proof.
- Branch E: Add duplicate umbrella tests for every existing safety test. Killed unless a real gap is found, because duplicate tests add maintenance noise without stronger proof.

## Recommendation

Stop after `SPEC-1` and require `DECISION-1`. My recommended decision is bold but controlled:

`APPROVE_PP001_EXECUTION_SCOPE_WITH_CONSOLIDATION_FIRST_BOUNDARY`

That means: retire the ambiguity between scattered legacy proof slices by making PP-001 the single acceptance contract for identity/RBAC/payload. Do not hide the old proof sprawl behind more local patches. Consolidate it, then delete or demote redundant assumptions in later cleanup only after PP-001 passes.

## ANALYSIS-1 Definition of Done Check

| Criterion | Result |
| --- | --- |
| Relevant files/flows/artifacts identified | Pass |
| Existing proof slice map produced | Pass |
| Missing positive/negative test map produced | Pass |
| Specification need identified | Pass |
| Implementation split recommended | Pass |
| Risks and open decisions named | Pass |
| Product code untouched | Pass |

## Ticket Completion

`ANALYSIS-1 PP-001 Readiness & Evidence Preflight` is finished.
