# Phase 7.5 QA Report

Date: 2026-06-14

## Scope

Run scope: Phase 7.5 - Shared Demo Workflow Runtime.

This pass addresses the gap that Phase 4-7 screens had state chips, workflow labels and local interactions, but no shared runtime state connecting the clickflows.

## Implemented

| Area | Files |
|---|---|
| Demo runtime and seed state | `lib/demo-runtime.ts` |
| Demo store with Postgres/In-memory fallback | `lib/demo-store.ts` |
| Demo API | `app/api/demo/session/route.ts`, `app/api/demo/transition/route.ts` |
| Client hook | `components/use-demo-session.ts` |
| Seed script | `scripts/seed-demo-runtime.mjs` |
| Runtime documentation | `docs/v2/PHASE_7_5_WORKFLOW_RUNTIME_PLAN.md` |

## Routes Connected

| Route | Runtime behavior |
|---|---|
| `/presentation` | Uses the shared runtime as an app command center instead of rendering a visual-board shell. |
| `/workbench` | Reads the shared recommendation/document workflow state and can reset the demo session. |
| `/advisor-approval` | `Approve for compliance` advances the recommendation and decision workflows. |
| `/compliance` | `Release to client` or `Block / request evidence` updates the shared recommendation gate and emits runtime audit/evidence. |
| `/mobile` | Reads client visibility from the shared recommendation runtime state. |
| `/mobile/upload` | Confirm extraction advances the document workflow. |
| `/actions` | Shows the shared recommendation workflow state in the action drawer. |
| `/decisions` | Client decision submission is blocked until the shared advice gate passes; successful submission emits evidence/audit. |
| `/evidence` | Shows runtime-created evidence records before static demo records. |
| `/governance` | Second confirmation advances the access request workflow and emits evidence/audit. |
| `/communication` | Send message advances the communication workflow and emits evidence/audit. |

## Tests Added

`tests/phase75-demo-runtime.test.mjs` verifies:

- advisor approval alone does not unlock client visibility;
- compliance release unlocks the decision pack;
- client decision submission creates evidence/audit;
- decision submission before compliance release is blocked;
- sensitive access confirmation creates access-change evidence/audit;
- the Phase 7.5 runtime plan exists for future tasks.

`tests/phase75-visual-rules.test.mjs` verifies:

- `/presentation` and `/workbench` are wired to dedicated runtime app surfaces;
- those routes no longer import the old Phase 3 or Phase 4 visual-board components;
- the runtime command screens do not render board chrome, reference metadata, visual IDs, annotation panels or page-spec headers.

## Visual Rule Correction

After the first Phase 7.5 pass, `/presentation` and `/workbench` still inherited board/spec chrome from older components. This was corrected by introducing `components/runtime-command-screens.tsx` and routing both pages to app-screen surfaces that use the shared demo runtime directly.

Future tasks should treat the old board shell components as legacy reference scaffolding unless a route explicitly needs an internal reference surface. Product routes should use dedicated app components and shared helpers rather than `Phase3Board`, `V2ScreenShell`, `PageHeader`, visual ID chips or annotation panels.

## Command Results

| Command | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm test` | Passed: 31 tests |
| `npm run lint` | Passed |
| `npm run build` | Passed |
| `npm run test:e2e` | Passed: 5 route/source smoke tests |
| `docker compose up -d postgres && npm run demo:seed` | Passed after waiting for Postgres health; seed script now retries startup connection errors. |

## Browser Smoke

Using a local dev server on `http://localhost:3000`, the following visible path was checked:

1. Reset demo session through `POST /api/demo/session`.
2. `/advisor-approval`: clicked `Approve for compliance`; screen showed `advisor_approved`.
3. `/compliance`: clicked `Release to client`; screen showed released runtime state.
4. `/decisions`: verified `Released decision pack`, clicked `Accept`, and saw `Decision submitted: accepted`.
5. `/evidence`: verified runtime `decision.submitted` evidence appears.

The temporary dev server and Compose Postgres container were stopped after verification.

## Known Limitations

- Browser e2e remains source/smoke based; full Playwright click-throughs are still not implemented.
- Postgres persistence is JSONB snapshot based for demo speed, not a normalized production schema.
- The runtime is still a click-dummy service; it does not integrate real identity, policy, documents, CRM or WORM audit storage.
