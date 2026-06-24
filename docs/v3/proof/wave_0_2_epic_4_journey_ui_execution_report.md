# Wave 0-2 Epic 4 Journey UI Execution Report

## Source

- Upload: `/Users/chris/Downloads/ALPHAVEST_JOURNEY_FIRST_BOC_CTES_TICKET_ARCHITECT_OUTPUT_WAVE_0_2.md`
- Extracted epic: `EPIC: Journey-first UI / UX / IA Refactor`
- Operative repo source: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

## Extracted Detailed Description

Purpose: expose the Journey-first model to users with clear orientation, states, next actions, feedback and client-safe projections.

Goal: users can navigate by Journey, understand current stage/step/blockers, execute allowed commands, and see safe feedback without overclaiming gates.

Scope:

- Journey Dashboard
- Journey Detail
- Step Panel
- Evidence Requirement Panel
- Client Projection Preview
- Audit Spine
- Hold placeholders
- No-overclaim microcopy

Out of scope:

- New screen/image generation
- Committee/KYC UI implementation
- Production mobile redesign

Delivery chain:

1. Analysis map screens/recommendations to journey surfaces.
2. Specification Journey-first UI/UX contract.
3. Implementation dashboard/detail/states/feedback.
4. QA UI state and feedback validation.

Detailed implementation task: implement Journey Dashboard and Detail UI in `components/journeys/*`, route/surface, detail panel, stage/step rail, next action/blocker display, tests and manual screenshots where visible UI changes.

## Task Execution

### EXTRACT-4.0

Status: complete.

Output: extracted Epic 4 scope, out-of-scope rules, delivery chain, child tasks and detailed implementation steps from the upload.

### PREFLIGHT-4.0

Status: complete.

Output: confirmed `full-workflow` branch and clean preflight state before edits. Read the True-UX handoff and kept implementation within the Wave 0-2 boundaries.

### ANALYSIS-4.1

Status: complete.

Output: mapped existing Journey APIs, auth bridge, seeded journey instances, source-locked hold journeys and shell guidance behavior. Chosen route: `/journeys` and `/journeys/[id]`, protected by the existing dummy app-session proxy and backed by Journey APIs.

### SPEC-4.2

Status: complete.

Contract:

- Dashboard lists scoped Journey API instances.
- Dashboard shows Wave 0-2 active definitions as startable only through API-backed creation.
- Dashboard shows `MJ-004` and `MJ-007` as hold placeholders, not executable journeys.
- Detail shows stage/step rail, actor role, blockers, evidence requirements, audit preview and client-safe projection preview.
- Command guard exposes only supported API commands and leaves permission denial as explicit feedback.
- Copy keeps status/orientation separate from proof, release, advice and evidence sufficiency.

### IMPL-4.3

Status: complete.

Output:

- Added `/journeys` dashboard route.
- Added `components/journeys/journey-dashboard.tsx`.
- Added API client/auth helper in `components/journeys/journey-api-client.ts`.
- Added Journey-first sidebar entry.

### IMPL-4.4

Status: complete.

Output:

- Added `/journeys/[id]` detail route.
- Added `components/journeys/journey-detail.tsx`.
- Added stage/step rail, evidence panel, audit spine, client projection preview and command guard.
- Added local product-guidance profile for `/journeys` surfaces so route shell copy matches Journey-first context without route registry reclassification.

### QA-4.5

Status: complete.

Positive acceptance:

- Dashboard and detail routes exist and build.
- Dashboard shows 7 scoped seeded journeys.
- Hold placeholders show `MJ-004`, `MJ-007` and `HOLD_LOCKED`.
- Detail shows stage/step rail, evidence requirements, audit spine and client projection preview.
- Feedback covers loading, API error, permission/blocked guard and command success/error paths in UI state.
- Copy states that journey/status/projection are not release proof and do not execute advice.

Negative acceptance:

- No new screen/image generation.
- No Committee/KYC route implementation.
- No proxy weakening for unauthenticated app access.
- No route registry count churn or old-navigation reintroduction.
- No direct state mutation bypassing the Journey APIs.

Validation:

- `pnpm typecheck` passed.
- `pnpm lint` passed with 29 pre-existing warnings and 0 errors.
- `PLAYWRIGHT_PORT=3027 pnpm exec playwright test tests/journey-ui.spec.ts` passed, 2 tests.
- `pnpm build` passed with existing Turbopack/NFT warnings around `lib/document-storage-adapter.ts`.

Screenshots:

- `/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/screenshots/wave02-journey-dashboard.png`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/screenshots/wave02-journey-detail.png`

## Changed Files

- `app/journeys/page.tsx`
- `app/journeys/[id]/page.tsx`
- `components/journeys/journey-api-client.ts`
- `components/journeys/journey-dashboard.tsx`
- `components/journeys/journey-detail.tsx`
- `components/sidebar.tsx`
- `lib/product-guidance.ts`
- `tests/journey-ui.spec.ts`
- `docs/v3/proof/wave_0_2_epic_4_journey_ui_execution_report.md`

## Remaining Risks

- Lint warning noise remains in unrelated legacy files.
- Build warning noise remains in the existing document storage adapter trace.
- Journey command authorization depends on seeded permissions and current demo role; the UI intentionally shows permission-blocked states instead of bypassing them.
