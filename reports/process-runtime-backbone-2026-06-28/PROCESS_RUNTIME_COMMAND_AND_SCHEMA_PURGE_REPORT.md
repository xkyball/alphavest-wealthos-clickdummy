# Process Runtime Command Coverage + Legacy Schema Purge

Generated: 2026-06-28T16:19:48Z

## Scope

Approved Option A: close the hard Process Runtime slice before further UI cosmetics.

## Tickets Executed

### A-SCHEMA-001

Journey runtime schema was purged from the active Prisma schema:

- removed Journey models, enums and `journeyInstanceId`;
- made `EvidenceSufficiencyDecision.processInstanceId` required;
- added migration `20260628203000_purge_legacy_journey_runtime`;
- updated source reality model/enum counts to 53 models and 31 enums;
- updated schema tests to assert Journey schema is absent.

Historical migration filenames still contain Journey terms because they are migration chronology, not active runtime authority.

### A-COMMAND-001

Process commands now run through one persisted runtime command path:

- `START`
- `COMPLETE_STEP`
- `BLOCK`
- `CANCEL`

The command API writes `AuditEvent` and `ProcessCommandRun` rows, updates instance/step state from the Process state machine, and fails closed when audit persistence is unavailable.

### A-LEGACY-001

Active compatibility aliases and UI/service proof language were moved from Journey language to Process language:

- removed WP05 Journey command aliases in favor of Process command route constants;
- renamed Wave 0-2 source lock exports from Journey IDs to Process IDs;
- removed P0 proof `journeyId` / `journeyName` compatibility fields;
- moved PP003 canonical evidence path from `PP002_CANONICAL_JOURNEY` to `PP002_CANONICAL_PROCESS`;
- changed visible release dialog to `Release client-safe process`;
- restored `Command Center` as a real process navigation group and removed the separate sidebar special-case link.

### A-PROOF-001

Validation was run after schema, command and legacy cleanup.

## Validation

PASS:

- `pnpm db:generate`
- `pnpm db:validate`
- `pnpm exec prisma migrate deploy`
- `pnpm db:seed`
- `pnpm typecheck`
- `pnpm guard:source`
- `git diff --check`
- `pnpm exec playwright test tests/route-smoke.spec.ts -g "uses the approved final app area labels|role-aware navigation filtering|process rails" --workers=1`
- `pnpm exec playwright test tests/schema-alignment.spec.ts tests/process-runtime-backbone.spec.ts --workers=1`
- `pnpm exec playwright test tests/process-runtime-db-api.spec.ts tests/foundation-guardrails.spec.ts tests/pp003-advice-boundary-contract.spec.ts tests/recommendation-review-workflow-validation.spec.ts tests/pilot-gtm-proof.spec.ts tests/v0-96-p0-true-ux-acceptance.spec.ts tests/e05-action-separation.spec.ts tests/interaction-lifecycle.spec.ts tests/confirmation-lifecycle.spec.ts tests/providerless-scope.spec.ts --workers=1`

Broad route-smoke exploratory run:

- `pnpm exec playwright test tests/process-runtime-db-api.spec.ts tests/schema-alignment.spec.ts tests/foundation-guardrails.spec.ts tests/pp003-advice-boundary-contract.spec.ts tests/recommendation-review-workflow-validation.spec.ts tests/pilot-gtm-proof.spec.ts tests/v0-96-p0-true-ux-acceptance.spec.ts tests/e05-action-separation.spec.ts tests/ui-state-boundaries.spec.ts tests/interaction-lifecycle.spec.ts tests/confirmation-lifecycle.spec.ts tests/providerless-scope.spec.ts tests/route-smoke.spec.ts --workers=1`
- Result: 230 passed, 39 failed.
- Relevant navigation failures were fixed and rerun green.
- Remaining failures are pre-existing/broad UI surface expectations and timeout/selector gaps outside this backend/runtime slice.

## Migration Note

The first local migration attempt failed because the ObjectType enum migration referenced a non-existent `export_requests.targetType` column. The migration file was corrected to cover the real ObjectType columns, and the local partial enum state was repaired to the same target state before marking the migration applied.

## Screenshots

- `artifacts/process-runtime-backbone/process-runtime-command-center-after-purge.png`
- `artifacts/process-runtime-backbone/release-client-safe-process-after-purge.png`

## Acceptance

Positive:

- Process Runtime is now the only active workflow schema authority.
- Process command API covers all state-machine commands.
- Step-level command history and audit proof are persisted.
- Journey compatibility aliases are removed from active service/proof surfaces.

Negative:

- Historical migration names still mention Journey by design.
- Broad UI route-smoke still contains unrelated UX surface failures; not promoted to this slice.

## Recommendation

Next hard slice should be `Process Runtime Release Preconditions`: connect recommendation/advisor/compliance release proof directly to ProcessInstance step state instead of typed workflow compatibility fields.
