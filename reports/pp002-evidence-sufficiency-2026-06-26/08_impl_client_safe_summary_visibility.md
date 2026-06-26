# IMPL-4 - Client-safe Evidence Summary & Visibility Projection Tests

Generated: 2026-06-26

Task: `IMPL-4 Client-safe Evidence Summary & Visibility Projection Tests`

Status: `COMPLETE_CODE_AND_TEST_IMPLEMENTATION`

## Parent Task Result

The canonical journey evidence-sufficiency read model now separates client-safe status from internal evidence decision detail.

## Subtask 1.7.1 - Client-safe Evidence Summary Allowlist Alignment

Status: `COMPLETE`

Implementation:

- `lib/journeys/journey-api-service.ts` now detects client-role callers for the evidence sufficiency response.
- Client-role callers receive decision status and timestamp only.
- Internal callers still receive evidence record ID and decision reason.

## Subtask 1.7.2 - Internal / Raw / Unreleased Evidence Leakage Negative Tests

Status: `COMPLETE`

Proof:

- `tests/pp002-evidence-sufficiency-canonical.spec.ts` asserts client-role responses do not expose `evidenceRecordId`.
- The same suite asserts client-role responses do not expose internal decision `reason`.
- The suite also proves compliance/internal callers can still inspect the full internal decision detail.

## Product Code Delta

Changed:

- `lib/journeys/journey-api-service.ts`
- `tests/pp002-evidence-sufficiency-canonical.spec.ts`

## Validation

```text
pnpm playwright test tests/pp002-evidence-sufficiency-canonical.spec.ts --workers=1
6 passed
```

## Ticket Result

`IMPL-4` is finished.

