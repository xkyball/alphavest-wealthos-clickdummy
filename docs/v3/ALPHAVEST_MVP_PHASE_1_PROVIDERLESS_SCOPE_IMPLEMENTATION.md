# AlphaVest MVP Phase 1 Providerless Scope Implementation

Date: 2026-06-20
Phase source: `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN.md`
Phase: `1 - Providerless Real User / Tenant / Role Foundation`
Execution status: `PHASE_1_IMPLEMENTED_WITH_TEST_PROOF`

## 1. Scope

Phase 1 was executed as an implementation phase. The implementation keeps the providerless demo-session model, but adds strict mapped actor/tenant/role semantics for acceptance and service/API boundaries.

No production authentication, provider integration, new API route, Prisma schema change, migration, screen state, route promotion or visual asset was added.

## 2. Implemented Behavior

- Added strict providerless session resolution via `tryCreateDemoSession` and `requireDemoSession`.
- Preserved `createDemoSession` fallback behavior for demo UI convenience while preventing unknown actor/tenant/role fallback in strict paths.
- Added permission fail-closed handling when a subject has tenant-scoped payload but the action context lacks tenant scope.
- Added mapped client actor tenant-context mismatch denial.
- Removed document upload service defaults for `tenantSlug` and `roleKey`; upload persistence now requires validated actor/tenant/role context from the API boundary.
- Added a focused Phase 1 test script: `pnpm test:providerless-scope`.

## 3. Capability Level

| Capability | Current / target level | Result |
| --- | ---: | --- |
| Providerless mapped actor/tenant/role scope | E6 demo security proof | Strict session and permission tests prove mapped context, missing-context denial and tenant mismatch denial. |
| Route/action/payload separation | E6 demo security proof | Route-level view can remain separate from tenant-scoped payload/action access. |
| Document upload context propagation | E6/E7 bounded existing path | Existing multipart upload keeps persistence/reload proof while now requiring validated role/tenant context. |
| Production authentication | Not claimed | Demo providerless context only; no real auth or provider integration added. |

## 4. Task Closure

| Task | Implementation result |
| --- | --- |
| `AV-MVP-P1-T001` | Implemented strict mapped demo-session resolution for actor, tenant and role. Unknown role/tenant fails closed in strict paths. |
| `AV-MVP-P1-T002` | Implemented/verified tenant context propagation into permission checks and document upload/list API paths. |
| `AV-MVP-P1-T003` | Implemented tenant-context-required denial so route access alone cannot become payload/action authorization. |
| `AV-MVP-P1-T004` | Implemented/verified object-scope behavior through tenant-scoped permission and document reload tests. |
| `AV-MVP-P1-T005` | Added focused providerless-scope acceptance tests and ran relevant P0/API/permission suites. |

## 5. Tests Run

- `pnpm typecheck` - passed after fixing upload API narrowing.
- `pnpm lint` - passed.
- `pnpm test:providerless-scope` - passed, 5 tests.
- `pnpm test:permissions` - initially blocked by local DB `ECONNREFUSED`; after `docker compose up -d postgres`, passed, 7 tests.
- `pnpm test:workflow-api` - passed, 11 tests.
- `pnpm exec playwright test tests/document-upload-api.spec.ts` - first parallel run hit `EADDRINUSE`; focused rerun passed, 6 tests.
- `pnpm exec playwright test tests/p0-acceptance.spec.ts` - passed, 9 tests.

## 6. Non-Claims

- No production auth, MFA, invite token or external provider behavior is claimed.
- No new current-user API route was created.
- No generalized user/tenant CRUD or role-management persistence was added.
- No E7 production security claim is made.
- No UI or visual acceptance is claimed.

## 7. Exit Gate Decision

`PHASE_1_IMPLEMENTATION_EXIT_PASSED_WITH_DOCUMENTED_LIMITATIONS`

The exit gate passes for providerless demo-scope enforcement: unknown/unmapped strict context fails closed, wrong/missing tenant context is denied, and route/action/payload checks are independently testable. Remaining production identity and generalized governance/data-maintenance work stays outside Phase 1.

