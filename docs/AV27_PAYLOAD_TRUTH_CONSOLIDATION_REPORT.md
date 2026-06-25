# AV27 Payload Truth Consolidation Report

Date: 2026-06-25

## Goal

Consolidate old scattered safety, redaction and no-overclaim test duplicates so payload truth is owned by:

- `lib/av27-phase6-payload-contract.ts`
- existing gate services: `lib/visibility-engine.ts`, `lib/export-service.ts`, `lib/workflow-gate.ts`
- canonical no-overclaim copy: `lib/no-overclaim-copy.ts`

## Baseline

- Branch: `full-workflow`
- Baseline commit before this consolidation: `4ce423f feat: close av27 phase 6 payload safety`
- `pnpm guard:source`: PASS
- Scope: no route changes, no schema changes, no screen/image/state-screen generation.

## Consolidated Sources

### Payload contract

`lib/av27-phase6-payload-contract.ts` now owns:

- AV27 Phase 6 ticket order
- allowed client payload fields
- allowed export payload fields
- source-upload metadata exception fields
- forbidden payload fields
- payload classifications
- field classification helper
- payload classification type guard
- forbidden-field presence helper
- API/UI/export payload inspection
- cross-surface payload sweep

### Existing gate services

- `lib/visibility-engine.ts` remains the projection gate.
- `lib/export-service.ts` remains the export gate and uses the AV27 contract for field inspection.
- `lib/export-workflow-command-service.ts` now parses payload classifications through `isAv27Phase6PayloadClassification`.
- `lib/ui-clickflow-guards.ts` now uses the AV27 contract for forbidden client fields and `evaluateExportSafety` output for forbidden export classifications.

### No-overclaim copy

`lib/no-overclaim-copy.ts` now also owns `noOverclaimForbiddenSuccessPattern`, so canonical no-overclaim tests do not carry their own forbidden-success regex.

## Removed Altlasten

- Removed local forbidden client field list from `tests/helpers/e2e-redaction.ts`.
- Removed local forbidden client field list from `tests/client-visibility-proof.spec.ts`.
- Removed local payload classification allowlist from `lib/export-workflow-command-service.ts`.
- Removed local forbidden export classification filter from `lib/ui-clickflow-guards.ts`.
- Removed duplicated no-overclaim forbidden-success regex from `tests/true-ux-no-overclaim-copy.spec.ts` and `tests/ui-state-boundaries.spec.ts`.

## Deliberately Kept

Some tests still contain literal payload classifications such as `AI_DRAFT` or `CLIENT_SAFE_SUMMARY` as input fixtures or expected output examples. These are not operative truth lists; they are scenario data used to exercise the central contract and gate services.

## Validation

Run and passing:

- `pnpm guard:source`
- `pnpm typecheck`
- `pnpm playwright test tests/client-visibility-proof.spec.ts tests/true-ux-no-overclaim-copy.spec.ts tests/ui-state-boundaries.spec.ts tests/av27-phase6-payload-sweep.spec.ts --workers=1`
- `pnpm playwright test tests/ui-clickflow-phase06-10.spec.ts tests/export-workflow-api.spec.ts tests/file-export-realism.spec.ts tests/p0-acceptance.spec.ts --workers=1`
- `pnpm playwright test tests/e2e/e2e-journey-proof-ws00-ws05.spec.ts --workers=1`

## Safety Result

- No client projection truth remains in local helper lists.
- No export classification allowlist remains in the export command parser.
- No UI clickflow export forbidden-classification logic remains detached from the export gate.
- No-overclaim forbidden-success wording is centralized.
- No safety gate was weakened.
