# PP-001 Implementation - Payload Visibility / Redaction Proof

Generated: 2026-06-26

Tasks:

- `IMPL-3` Payload Visibility / Redaction Proof Surface & Tests
- `IMPL-3.1` Payload Visibility Matrix Implementation / Alignment
- `IMPL-3.2` Client/Internal/Admin Payload Negative Tests

Status: `COMPLETE`

## Active Ticket Order

Execution remained one ticket at a time:

1. `IMPL-3.1` created the PP-001 payload visibility matrix.
2. `IMPL-3.2` added client/admin negative payload tests against that matrix and current projection behavior.
3. Parent `IMPL-3` closed after both subtasks passed.

## Change Summary

Added `lib/pp001-payload-visibility-contract.ts`:

- Reuses the existing AV27 payload allow/forbid field contracts.
- Classifies fields into PP-001 classes:
  - `client_safe_released_only`
  - `hidden`
  - `internal_only`
  - `redacted`
  - `visible`
- Exposes `inspectPp001ClientPayload` so tests can prove no forbidden field reaches a client payload.

Added tests:

- `tests/pp001-payload-visibility-contract.spec.ts`
- `tests/pp001-payload-negative.spec.ts`

## Residual From IMPL-2 Resolved

`IMPL-2` found that a route-boundary payload decision could remain allowed while action authority was denied. `IMPL-3` resolves the acceptance risk at the actual payload-output layer:

- Principal reaches the Advisor Approval Detail shell.
- Principal action authority is denied with `DEMO_DENY_ADVISOR_APPROVAL_REQUIRED`.
- The recommendation projection is still fail-closed for the client.
- The returned payload is `{}`.
- The PP-001 client payload inspection is clean.

This keeps route/action/object checks and field-level payload projection separated while proving the output boundary.

## Proof Added

| Proof | Expected result |
| --- | --- |
| PP-001 matrix binds existing AV27 fields | All allowed/forbidden fields mapped into PP-001 classes. |
| Forbidden field inspection | `complianceNotes` and `storageKey` are flagged as forbidden in client payloads. |
| Route shell + denied action + client projection | Shell may be visible, action is denied, payload output is empty. |
| Admin payload expansion | Admin gets `DEMO_DENY_ADMIN_ADVICE_PAYLOAD_NON_BYPASS` and empty payload. |

## Validation

```bash
PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/pp001-payload-visibility-contract.spec.ts tests/pp001-payload-negative.spec.ts --workers=1
```

Result: PASS, 4/4 tests.

## Acceptance Check

| Criterion | Result |
| --- | --- |
| Payload classes are centralized for PP-001 | Pass |
| Existing AV27 allowed/forbidden fields reused, not duplicated by guesswork | Pass |
| Client route/action residual produces no payload output | Pass |
| Admin cannot expand internal advice payload | Pass |
| Product routes/API/schema untouched | Pass |
| UI untouched | Pass |

## Ticket Completion

`IMPL-3.1`, `IMPL-3.2` and parent `IMPL-3` are finished.
