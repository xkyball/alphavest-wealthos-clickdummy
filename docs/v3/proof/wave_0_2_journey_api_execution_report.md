# Wave 0-2 Journey APIs and Command Execution Report

Date: 2026-06-24
Branch: full-workflow
Source upload: ALPHAVEST_JOURNEY_FIRST_BOC_CTES_TICKET_ARCHITECT_OUTPUT_WAVE_0_2.md
Epic: Journey APIs and Command Execution

## Implemented Tasks

- SPEC-3.1 Journey API and command lifecycle contracts: completed. Command taxonomy finalized as START, COMPLETE_STEP, BLOCK, RESUME and CANCEL.
- IMPL-3.2 Journey list/detail/create APIs: completed. Added scoped GET/POST /api/journeys and GET /api/journeys/[id].
- IMPL-3.3 Command API with permission/gate/audit checks: completed through split subtasks.
- SUBTASK-3.3A Command request validation and typed command registry: completed.
- SUBTASK-3.3B Permission and object-scope enforcement: completed with current-user tenant scope and DB role-permission lookup.
- SUBTASK-3.3C State transition execution with audit: completed. Successful commands persist JourneyInstance, JourneyStepInstance, JourneyCommandRun and AuditEvent changes.
- SUBTASK-3.3D Fail-closed error handling and no-overclaim responses: completed. Invalid, unauthorized and skipped-gate commands return no-mutation envelopes.
- IMPL-3.4 Client projection, audit and evidence-sufficiency endpoints: completed. Added client-projection, audit and evidence-sufficiency routes.
- QA-3.5 API behaviour validation: completed with positive and negative Playwright API tests.

## Changed Files

- app/api/journeys/route.ts
- app/api/journeys/[id]/route.ts
- app/api/journeys/[id]/commands/route.ts
- app/api/journeys/[id]/client-projection/route.ts
- app/api/journeys/[id]/audit/route.ts
- app/api/journeys/[id]/evidence-sufficiency/route.ts
- lib/journeys/journey-api-service.ts
- lib/journeys/journey-command-registry.ts
- lib/source-reality-gate.ts
- lib/p0-acceptance-proof.ts
- tests/journey-api.spec.ts
- tests/foundation-guardrails.spec.ts
- docs/v3/proof/wave_0_2_journey_api_execution_report.md

## Validation

- pnpm typecheck: passed.
- pnpm playwright test tests/journey-api.spec.ts --workers=1: passed, 6/6.
- pnpm playwright test tests/journey-api.spec.ts tests/journey-spine.spec.ts tests/source-reality-gate.spec.ts tests/foundation-guardrails.spec.ts tests/p0-acceptance.spec.ts --workers=1: passed, 37/37.
- pnpm db:validate: passed.
- pnpm lint: passed with pre-existing warnings only.
- pnpm build: passed. Build output lists /api/journeys, /api/journeys/[id], /commands, /client-projection, /audit and /evidence-sufficiency.

## Proofs

- Scope proof: Bennett CFO sees Bennett journeys; Morgan CFO sees no Bennett JourneyInstances.
- Hold proof: MJ-004 create request is denied as non-executable.
- Command validation proof: unknown command is rejected before mutation.
- Permission proof: CFO cannot complete a command without the required command permission.
- State proof: admin no-skip command is rejected before mutation.
- Audit proof: successful START command writes a JourneyCommandRun and AuditEvent reference.
- Client projection proof: client-projection endpoint omits internal blockers, object links and evidence requirements.
- Evidence proof: evidence-sufficiency endpoint reports sufficiency without implying client release.
- No-generation proof: no images, screenshots, state-screen assets or visual media were generated.
- UI screenshot proof: not applicable; no UI files or visible surfaces changed in this Epic.

## Deviations And Blockers

- Deviation: command names were finalized locally from the existing Journey state machine because the upload marked exact command names as missing information.
- Blockers: none.
- Safety status: no committee/KYC APIs, real IdP APIs, external integrations, client-visible advice release, gate skip or UI shortcut was introduced.
