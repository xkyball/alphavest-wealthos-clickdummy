# AV-REF-002 Rebase / Characterization Report

Date: 2026-06-22
Mode: EXECUTION
Status: PASSED_WITH_DOCUMENTED_WARNINGS

## 1. Analyse

The rebase/characterization task targeted stale tests that no longer matched the current AlphaVest route, auth and UX contracts.

Confirmed drift:

- Authenticated UI specs still set the demo auth cookie with a port-bound URL fallback. This broke non-default `PLAYWRIGHT_PORT` runs and made valid app screens look absent.
- Foundation guardrails still characterized the old 5-file API universe while the current app exposes 15 route handlers.
- Committee review tests expected held routes without authenticated session setup and used broad selectors that now match both product guidance and page headers.
- Interaction lifecycle tests still used historic labels (`Create Role`, `Save Changes`, wealth-map drawer auto-open) instead of the current scoped labels and hub treatment.
- P07/P09 and UI state boundary tests still expected old projection/mobile copy on hub routes where the current contract is D1 hub safety copy plus detail-route trust panels.

No new product surface was generated. The changes only rebase existing tests to current implemented behavior and keep safety/no-overclaim assertions active.

## 2. Umsetzungsplan

1. Reproduce failing characterization tests and identify stale assumptions.
2. Stabilize demo-auth test setup across dynamic Playwright ports.
3. Update API universe characterization to the current route-handler set.
4. Rebase route/interaction/state assertions to current UX route policy:
   - held routes stay registered-only guarded surfaces,
   - portal/mobile stay D1 client-safe hubs,
   - decision trust proof is asserted on the decision detail route,
   - role actions use scoped labels,
   - wealth map remains hub-only.
5. Validate targeted Playwright coverage, route-smoke, typecheck, lint and Prisma schema.

## 3. Artefakt

Changed files in this task:

- `tests/foundation-guardrails.spec.ts`
- `tests/committee-review-routes.spec.ts`
- `tests/confirmation-lifecycle.spec.ts`
- `tests/interaction-lifecycle.spec.ts`
- `tests/ui-state-boundaries.spec.ts`
- `tests/scf-p07-p09-trust-ui.spec.ts`
- `tests/document-upload-flow.spec.ts`
- `tests/route-smoke.spec.ts`
- `docs/v3/AV_REF_002_REBASE_CHARACTERIZATION_REPORT.md`

Key implementation results:

- Demo-auth helpers now use `demoAuthSessionCookieName` and domain/path cookies, so tests remain valid across dynamic local ports.
- Foundation guardrail now locks the current 15 API route handlers.
- Committee review routes remain characterized as held/registered-only guard screens.
- Current role/confirmation lifecycle labels are asserted without weakening mutation/cancel checks.
- Portal and mobile tests assert current D1 hub safety copy instead of stale blocked-state copy.
- Decision trust projection is asserted on `/decisions/demo`, the current detail surface.

## 4. Validierung

Acceptance criteria:

- Targeted rebase/characterization tests pass.
- Route smoke remains green after auth helper changes.
- Static TypeScript and Prisma validation pass.
- Lint passes without new errors.
- Existing known lint warnings remain documented and were not expanded by this task.

Commands run:

- `PLAYWRIGHT_PORT=3053 pnpm exec playwright test tests/committee-review-routes.spec.ts tests/confirmation-lifecycle.spec.ts tests/foundation-guardrails.spec.ts tests/interaction-lifecycle.spec.ts --reporter=line` - passed, 14/14.
- `PLAYWRIGHT_PORT=3056 pnpm exec playwright test tests/committee-review-routes.spec.ts tests/confirmation-lifecycle.spec.ts tests/foundation-guardrails.spec.ts tests/interaction-lifecycle.spec.ts tests/ui-state-boundaries.spec.ts tests/scf-p07-p09-trust-ui.spec.ts tests/document-upload-flow.spec.ts --reporter=line` - passed, 33/33.
- `pnpm typecheck` - passed.
- `pnpm db:validate` - passed.
- `PLAYWRIGHT_PORT=3057 pnpm test:route-smoke` - passed, 294/294.
- `pnpm lint` - passed with 27 existing warnings.

Validation note:

- One parallel lint attempt failed with transient `ENOENT: scandir test-results` while Playwright was running. It passed when rerun after Playwright completed.

## 5. Offene Risiken

- The repository still has pre-existing lint warnings for unused legacy/demo components and data helpers.
- Full `pnpm test:playwright` was not rerun after this task because the focused rebase set plus route-smoke covered the affected contracts; broader suite runtime remains a separate verification budget item.
- Existing unrelated workspace changes were left untouched.
