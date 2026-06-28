# Process Runtime Backbone Execution Report

Date: 2026-06-28
Branch: full-workflow
Slice: Process Runtime Backbone

## Decision

Process Runtime Backbone replaces the Journey/Mega-Journey runtime path.

The active codebase now uses DB-backed `BP-*` process definitions, process instances, process step instances, object links and command history as the canonical workflow spine. Journey API routes, Journey UI routes, Journey service modules, Journey screencast scripts and Journey-focused tests were removed from the active codebase.

## Implemented

- Added Prisma Process Runtime models, enums and migration:
  - `ProcessDefinition`
  - `ProcessStepDefinition`
  - `ProcessInstance`
  - `ProcessStepInstance`
  - `ProcessObjectLink`
  - `ProcessCommandRun`
- Added process-backed evidence sufficiency linkage via `EvidenceSufficiencyDecision.processInstanceId`.
- Added `ObjectType.PROCESS` and `ObjectType.PROCESS_STEP`.
- Added `lib/process-runtime/*` registry, state machine and service.
- Added `/api/processes`, `/api/processes/[id]` and `/api/processes/[id]/commands`.
- Replaced demo seed Journey runtime creation with Process runtime creation from `ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json`.
- Replaced `journeys.*` RBAC seed permissions with `process.*`.
- Rewired Phase B/C UI command client to Process Runtime commands.
- Removed Journey/Mega-Journey routes, services, screencast stack and Journey acceptance tests.
- Updated P0 proof, source lock, WP05 advisory contract, GTM proof and navigation to process-first language and route truth.

## DB Proof

`pnpm db:seed` produced:

- `processDefinitions`: 84
- `processInstances`: 84
- seed summary no longer includes Journey runtime counts

`tests/process-runtime-db-api.spec.ts` additionally proves:

- 84 process definitions
- 438 process step definitions
- 84 process instances
- 438 process step instances
- 84 process command runs
- 0 journey definitions
- 0 journey instances
- 6 process-backed evidence sufficiency decisions
- `/api/processes` fails closed without JWT
- `/api/processes` lists scoped process instances
- `/api/processes/:id/commands` writes blocked command history with audit id

## Validation

- `pnpm guard:source` - PASS
- `pnpm db:validate` - PASS
- `pnpm typecheck` - PASS
- `pnpm playwright test tests/process-runtime-backbone.spec.ts tests/process-runtime-db-api.spec.ts tests/schema-alignment.spec.ts tests/foundation-guardrails.spec.ts tests/p0-acceptance.spec.ts tests/navigation-shell.spec.ts tests/wp05-advisory-workflow-contract.spec.ts tests/pilot-gtm-proof.spec.ts --workers=1` - PASS, 50/50
- Journey/Mega-Journey active-code scan - PASS, no matches for `MJ-`, `/api/journeys`, `lib/journeys`, `journeys.screencast`, `Mega-Journey`

## Screenshot

`artifacts/process-runtime-backbone/process-runtime-navigation.png`

## Known Boundaries

- This slice intentionally does not add a new process dashboard UI. Process Runtime is DB/service/API backed first.
- Existing Prisma Journey tables remain in schema only as historical database structures; active routes, services, seed runtime and tests no longer use them.
- Full production-grade command coverage currently includes process creation/list/detail and fail-closed `BLOCK`; future process command expansion should add `COMPLETE_STEP`, release-specific commands and richer audit semantics on this backbone.
