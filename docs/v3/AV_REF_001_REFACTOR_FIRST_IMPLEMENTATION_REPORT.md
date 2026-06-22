# AV-REF-001 Refactor-First Implementation Report

Generated: 2026-06-22
Mode: EXECUTION
Task: AV-REF-001 - Refactor AlphaVest codebase structure and naming before feature work
Target branch/codebase: full-workflow only

## 1. Analysis

The prompt asked for behaviour-preserving refactor work before further feature work. Repo reality required a source-drift adjustment before editing:

- `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` and `FINAL_CODEX_TASK_MASTER.md` exist, but both mark themselves as superseded and redirect away from old final-task authority.
- `ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md` also marks First Build task/phase authority as superseded by `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`.
- The prompt baseline says 4 API routes and 10 test specs; current full-workflow reality is 71 registered routes, 15 API route files, 42 Prisma models, 22 Prisma enums, 43 test specs and 63 clean PNGs.
- Because this was refactor-only work, no feature, route, API, schema, migration, screen, state-screen, image or visual asset change was made.

Implementation therefore focused on a low-risk demo/product boundary cleanup and one safe screen helper extraction.

## 2. Implementation Plan

| Phase | Decision | Result |
| --- | --- | --- |
| R0 Baseline | Run typecheck, lint, db validate, build and targeted Playwright proof. | Completed; full Playwright command was attempted and documented as red/aborted due existing non-refactor failures. |
| R1 Inventory | Identify largest files, naming smells, generic/demo-confusing modules and test coverage. | Completed. Largest screens and existing lint warnings are registered below. |
| R2 Plan | Prefer few high-value changes over broad churn. | Chosen slice: demo auth module boundary, internal demo naming, auth-onboarding helper extraction. |
| R3 Safe Rename | Rename internal files/symbols only. | Completed. Public route `/api/auth/dummy`, persisted cookie string and audit/reason-code strings remain stable. |
| R4 Safe Extraction | Extract presentational-adjacent/client helper logic from a large screen. | Completed. Auth local-storage/response typing moved to `lib/demo/demo-auth-client.ts`. |
| R5 Demo/Product Boundary | Quarantine DB-backed demo auth under explicit `lib/demo/`. | Completed. Dummy wording remains only where it is part of a public legacy/demo contract or visible existing copy. |
| R6 Test Update | Update imports in targeted tests. | Completed. No new product tests added. |
| R7 Proof | Produce concrete report and validation evidence. | This report. |

## 3. Artifact

### Changed Files Table

| File | Change Type | Reason |
| --- | --- | --- |
| `lib/dummy-auth-service.ts` -> `lib/demo/demo-auth-provider-service.ts` | Safe move/rename | Put DB-backed demo auth provider behind explicit demo boundary. |
| `lib/dummy-auth-session.ts` -> `lib/demo/demo-auth-session.ts` | Safe move/rename | Put demo session cookie helpers behind explicit demo boundary. |
| `lib/demo/demo-auth-client.ts` | Safe extraction | Move auth-onboarding local-storage and response typing out of the large screen. |
| `components/auth-onboarding-screen.tsx` | Safe extraction/import cleanup | Consume extracted demo auth client helpers; no UI text or route change. |
| `app/api/auth/dummy/route.ts` | Import/internal symbol rename | Keep public API path stable while using demo-named internals. |
| `app/api/admin-tenants/route.ts` | Import/internal symbol rename | Keep invitation behaviour stable while using demo-named provider service. |
| `proxy.ts` | Import/internal symbol rename | Keep auth gating behaviour stable while using demo-named session helpers. |
| `tests/dummy-auth-provider.spec.ts` | Import/internal symbol rename | Preserve DB-backed dummy auth behaviour assertions. |
| `tests/route-smoke.spec.ts` | Import/internal symbol rename | Preserve route smoke cookie setup after module move. |
| `tests/document-upload-flow.spec.ts` | Import/internal symbol rename | Preserve authenticated upload browser flow setup. |

Unrelated worktree changes were left untouched: `docs/v3/journeys.screencast.p2.v3.json` and `prompts/UX_PAGE_TO_POLICY_SEQUENTIAL_EXECUTION_ENGINE_MIX.md`.

### Rename Map

| Old | New |
| --- | --- |
| `lib/dummy-auth-service.ts` | `lib/demo/demo-auth-provider-service.ts` |
| `lib/dummy-auth-session.ts` | `lib/demo/demo-auth-session.ts` |
| `DummyAuthError` | `DemoAuthProviderError` |
| `DummyAuthUserContext` | `DemoAuthUserContext` |
| `DummyAuthStartResult` | `DemoAuthStartResult` |
| `DummyInviteResult` | `DemoAuthInviteResult` |
| `DummyAcceptInviteResult` | `DemoAuthInviteAcceptResult` |
| `DummyMfaResult` | `DemoAuthMfaResult` |
| `dummyAuthProviderId` | `demoAuthProviderId` |
| `dummyAuthMfaCode` | `demoAuthMfaCode` |
| `startDummyProviderLogin` | `startDemoProviderLogin` |
| `verifyDummyMfa` | `verifyDemoMfa` |
| `inviteDummyAuthUser` | `inviteDemoAuthUser` |
| `acceptDummyInvite` | `acceptDemoInvite` |
| `dummyAuthSessionCookieName` | `demoAuthSessionCookieName` |
| `dummyAuthSessionMaxAgeSeconds` | `demoAuthSessionMaxAgeSeconds` |
| `isDummyAuthSessionToken` | `isDemoAuthSessionToken` |
| `DummyAuthStorage` | `DemoAuthStorage` |
| `DummyAuthResponse` | `DemoAuthResponse` |
| `readDummyAuthStorage` | `readDemoAuthStorage(defaultEmail)` |
| `writeDummyAuthStorage` | `writeDemoAuthStorage` |

### Behaviour-Preserved Names

| Name | Reason Kept |
| --- | --- |
| `/api/auth/dummy` | Public existing API route path; changing it would be an API route behaviour change. |
| `alphavest_dummy_auth_session` | Existing cookie contract used by browser flows. |
| `alphavest.dummyAuth.v1` | Existing local-storage compatibility key. |
| `auth.dummy.*`, `DUMMY_*`, `dummy-auth:*` | Persisted audit/reason/stable-id strings; renaming would alter DB/test semantics. |
| Visible "Dummy provider" copy | Existing UI copy, not changed in a behaviour-preserving refactor pass. |

### Module Boundary Map

| Before | After | Ownership |
| --- | --- | --- |
| `lib/dummy-auth-service.ts` in generic lib root | `lib/demo/demo-auth-provider-service.ts` | Demo-only DB auth provider, invite, MFA and audit boundary. |
| `lib/dummy-auth-session.ts` in generic lib root | `lib/demo/demo-auth-session.ts` | Demo-only session cookie helper boundary. |
| Auth local-storage helpers embedded in `components/auth-onboarding-screen.tsx` | `lib/demo/demo-auth-client.ts` | Demo-auth client helper and response types; screen consumes it. |
| API/proxy/tests importing generic dummy modules | API/proxy/tests import explicit demo modules | Public behaviour preserved, ownership clearer. |

### REFACTOR_TARGET_REGISTER

| Candidate | Classification | Decision |
| --- | --- | --- |
| `lib/dummy-auth-service.ts` | SAFE_MOVE | Moved to `lib/demo/demo-auth-provider-service.ts`. |
| `lib/dummy-auth-session.ts` | SAFE_MOVE | Moved to `lib/demo/demo-auth-session.ts`. |
| Internal `DummyAuth*` / `dummyAuth*` exports | SAFE_RENAME | Renamed to `DemoAuth*` / `demoAuth*`. |
| Auth local-storage/response typing inside `components/auth-onboarding-screen.tsx` | SAFE_EXTRACTION | Extracted to `lib/demo/demo-auth-client.ts`. |
| Persisted cookie/localStorage/audit/reason/stable-id strings | DO_NOT_TOUCH | They are behaviour or compatibility contracts. |
| `/api/auth/dummy` path | DO_NOT_TOUCH | Public existing API route path. |
| `components/client-intake-screen.tsx` unused mobile helpers/content | NEEDS_CHARACTERIZATION_TEST | Large screen with user-visible route behaviour. |
| `components/internal-workflow-screen.tsx` unused cards/drawer helpers | NEEDS_CHARACTERIZATION_TEST | Large workflow screen; remove only with targeted UI characterization. |
| `components/communication-export-ops-screen.tsx` unused imports/export wizard data | NEEDS_CHARACTERIZATION_TEST | Export lifecycle is safety-sensitive. |
| `components/wealth-actions-screen.tsx` unused wealth-map helpers | NEEDS_CHARACTERIZATION_TEST | Interaction tests mention fake/drawer behaviour; keep for later focused pass. |
| Prompt baseline "4 API routes" | BLOCKED_PRODUCT_DECISION | Current repo has 15 API route files; old test/source contract must be rebased separately. |

## 4. Validation

### Baseline / Final Commands

| Command | Result |
| --- | --- |
| `pnpm typecheck` | PASS before and after refactor. |
| `pnpm lint` | PASS with existing warnings only: 27 `no-unused-vars` warnings in large screens. |
| `pnpm db:validate` | PASS. Prisma schema valid. |
| `pnpm build` | PASS. Turbopack emitted existing broad dynamic file tracing warnings in `lib/document-storage-adapter.ts`. |
| `PLAYWRIGHT_PORT=3037 pnpm test:dummy-auth` | PASS, 5/5. |
| `PLAYWRIGHT_PORT=3046 pnpm test:dummy-auth` | PASS, 5/5 after extraction. |
| `pnpm test:route-smoke` | PASS, 294/294 on first run. |
| `PLAYWRIGHT_PORT=3042 pnpm test:route-smoke` | 293/294 with one `/mobile` timeout. |
| `PLAYWRIGHT_PORT=3044 pnpm exec playwright test tests/route-smoke.spec.ts -g "020 /mobile shows job"` | PASS, 1/1 rerun. |
| `PLAYWRIGHT_PORT=3047 pnpm test:playwright` | RED/aborted after 3.7m: 111 passed, 8 failed, 1 interrupted, 421 not run. Failures listed below. |

### Full Playwright Failures Observed Before Abort

| Test | Failure Summary |
| --- | --- |
| `tests/committee-review-routes.spec.ts` queue/detail | Expected old Committee Review headings; current held-route guard did not render those headings. |
| `tests/confirmation-lifecycle.spec.ts` release/request-evidence cases | Expected dialogs/buttons such as `Release to client` and `Manage Block`; elements not found or timed out. |
| `tests/foundation-guardrails.spec.ts:53` | Expected old 5-route API universe; current repo reality has 15 API route files. |
| `tests/interaction-lifecycle.spec.ts` release/block/role cases | Expected old dialogs/buttons; elements not found or timed out. |

### Behaviour Preservation Proof

- No route files were added or removed.
- No Prisma schema or migration files were changed.
- No screen/state/image/visual assets were generated.
- Public `/api/auth/dummy` path is unchanged.
- Cookie/localStorage/audit/reason/stable-id strings remain unchanged.
- TypeScript import graph compiles after module move.
- Auth browser/API test proves existing login, MFA, invite, denial and non-admin denial behaviour still works.
- Route smoke first full run proved all 71 registered routes and policy checks passed after the move.

## 5. Open Risks

1. Source-of-truth drift remains: old final files and some tests still encode obsolete API-universe expectations while the actual repo has 15 API routes.
2. Full Playwright is not green because of existing non-refactor UI expectation drift in committee, confirmation and interaction lifecycle tests.
3. Large screen cleanup remains intentionally limited. Removing unused components in large workflow screens needs targeted characterization tests first.
4. Build passes but Turbopack warns about broad dynamic file tracing in `lib/document-storage-adapter.ts`; this is outside AV-REF-001 scope.
5. Visible "Dummy provider" copy remains. Renaming visible UI copy should be a dedicated UX/content-safe task, not bundled into this behaviour-preserving refactor.

## Engine Method Artifacts

### V3 Evidence / Proof Wrapper

- Facts: current repo has 71 routes, 15 API route files, 42 models, 22 enums, 43 specs and 63 clean PNGs.
- Assumptions: DB-backed dummy auth public wording is compatibility-sensitive until a UX/content task authorizes visible copy changes.
- Killed weak branch: broad cleanup of all lint warnings was rejected because large screens need characterization tests.
- Proof path: typecheck, lint, db validate, build, auth test, route smoke and targeted rerun.

### V2 Method Artifacts

- Double Diamond: Discover source drift and naming smells; Define low-risk demo-boundary refactor; Develop move/rename/extract slice; Deliver module move plus report.
- Psycho-Logic + Map/Model: the dangerous map trap is treating "dummy" as production-ready or treating old source counts as current truth. The design move is explicit demo ownership without public behaviour churn.
- Reframing Matrix: "cosmetic rename" reframed as "demo/product boundary safety"; "big cleanup" reframed as "small reversible proof slice"; "test failure" reframed as "source drift signal"; "large screen cleanup" reframed as "needs characterization".
- TRIZ: improve naming clarity without worsening route/API stability by separating internal symbol names from public persisted strings.
- SIT Closed World: reused existing `lib/`, `components/`, API routes, tests and Playwright scripts; no new framework or feature surface.
- Morphological/CCA: considered path move, symbol rename, visible copy change, API rename, large screen deletion and helper extraction. Kept path move, symbol rename and helper extraction; rejected API/path/copy/schema changes.
- SCAMPER: substitute dummy internal names with demo names; combine demo auth helpers under `lib/demo`; adapt tests to new imports; modify screen ownership; put local-storage logic into a module; eliminate root-level dummy modules; rearrange imports only.
- Harvard/BATNA: objective criterion was behaviour-preserving validation. BATNA for risky candidates is leave registered and document instead of forcing broad churn.
- MESOs: selected Offer A, smallest safe internal demo-boundary refactor. Larger Offer B/C screen cleanup variants are deferred until characterization tests exist.
- Measurement Plan: compile/import safety, auth behaviour proof, route smoke proof and full-suite drift report.
- Ethics/Fairness: no deception, no production-auth overclaim, no safety gate weakening, no hidden feature work.

## Method Compliance Checklist

- Facts, assumptions and interpretations separated: PASS.
- Repository source drift documented: PASS.
- Behaviour-preserving refactor only: PASS.
- No new route/API/schema/migration/screen/asset: PASS.
- Engine V2/V3 artifacts visible: PASS.
- Weak branches killed with reasons: PASS.
- Honest validation limitations included: PASS.
