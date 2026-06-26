# AV27 Phase 7 - Test Execution Report

Date: 2026-06-25
Ticket chain: `AV27-P7-T04-A`, `AV27-P7-T04-S`, `AV27-P7-T04-I`, `AV27-P7-T04-Q`

## Ticket Status

| Ticket | Status | Result |
| --- | --- | --- |
| `AV27-P7-T04-A` | Done | Identified the executable command set and the difference between no-server unit/service suites and API suites that require a Playwright web server. |
| `AV27-P7-T04-S` | Done | Locked target suite to source guard, typecheck, lint, DB validate, Phase 7 certification, AV27 regressions and `phase:check`. |
| `AV27-P7-T04-I` | Done | Declared the command set in `av27Phase7FullTestCommandSet` and began execution. |
| `AV27-P7-T04-Q` | Done | Initial no-server API failure was rerun correctly with Playwright web server; final command set passed. |

## Command Results

| Command | Result | Classification |
| --- | --- | --- |
| `pnpm guard:source` | PASS | Source hierarchy guard passed with 0 violations. |
| `pnpm test:av27:claims` | PASS | Canonical claim gate passed from `lib/av27-phase7-certification.ts`; `I-001` remains locked behind real `DecisionCreationService` proof. |
| `pnpm typecheck` | PASS | Passed after tightening one test union type. |
| `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm playwright test tests/av27-phase7-certification.spec.ts --workers=1` | PASS, 5/5 | Focused Phase 7 certification suite passed. |
| `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm playwright test tests/av27-phase7-certification.spec.ts tests/av27-safety-foundation.spec.ts tests/av27-phase6-payload-sweep.spec.ts --workers=1` | PASS, 15/15 | Cross-process certification, Phase 1 safety and Phase 6 payload regression passed. |
| `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm playwright test tests/workflow-gate.spec.ts tests/recommendation-review-workflow-api.spec.ts tests/client-visibility-projection.spec.ts tests/file-export-realism.spec.ts --workers=1` | FAIL, 31 passed, 7 failed, 8 skipped | Orchestration failure: API tests attempted `127.0.0.1:3020` while web server was deliberately skipped. Non-API suites in the same run passed. Requires rerun without `PLAYWRIGHT_SKIP_WEB_SERVER=1`. |
| `PLAYWRIGHT_PORT=3047 pnpm playwright test tests/recommendation-review-workflow-api.spec.ts --workers=1` | PASS, 15/15 | Correct server-backed API rerun passed. |
| `pnpm test:av27:no-server` | PASS | Canonical no-server contract suite passed without API web-server dependency after moving API-route suites out. |
| `PLAYWRIGHT_PORT=3048 pnpm test:av27:server` | PASS | Canonical server-required API suite passed with `av27-client-context-closure` and `typed-workflow-api` under Playwright web server. |
| `pnpm lint` | PASS | First lint attempt hit the known transient `test-results` ENOENT race while Playwright was cleaning artefacts; rerun passed with 22 pre-existing warnings and 0 errors. |
| `pnpm db:validate` | PASS | Prisma schema valid. |
| `pnpm phase:check` | PASS | Typecheck, lint, DB validate and build passed. Build retained existing Turbopack/NFT warnings around `lib/document-storage-adapter.ts`. |

## Failure Classification

The red API result is not accepted as product failure and not accepted as pass. It was classified as `TEST_ORCHESTRATION_RERUN_REQUIRED` because every failing assertion was `ECONNREFUSED 127.0.0.1:3020` from `tests/recommendation-review-workflow-api.spec.ts`, caused by running API tests while skipping the Playwright web server.

The required rerun passed with the Playwright web server enabled on port `3047`.

## Required Rerun

Completed API/browser-dependent proof with Playwright's web server enabled on a fresh port:

```bash
PLAYWRIGHT_PORT=3047 pnpm playwright test tests/recommendation-review-workflow-api.spec.ts --workers=1
```

Retired the mixed command shape by introducing canonical split suites. API-route tests stay in the server-required command:

```bash
pnpm test:av27:no-server
PLAYWRIGHT_PORT=3048 pnpm test:av27:server
```

Completed final gates:

```bash
pnpm test:av27:claims
pnpm lint
pnpm db:validate
pnpm phase:check
```
