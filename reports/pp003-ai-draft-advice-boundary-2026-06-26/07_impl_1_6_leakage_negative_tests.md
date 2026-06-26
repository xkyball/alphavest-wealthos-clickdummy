# IMPL-1.6 API / Client / Decision Projection Leakage Negative Tests

Status: Complete

Source ticket: `IMPL-1.6`

Subtasks covered:

- `IMPL-1.6.1` Client portal/mobile no-AI-draft leakage tests.
- `IMPL-1.6.2` API response redaction/no-internal-payload tests.
- `IMPL-1.6.3` Decision projection no-unapproved-advice tests.

## Implementation

Added `tests/pp003-leakage-negative.spec.ts`.

The tests bind existing projection code to the PP003 surface matrix from `lib/pp003-advice-boundary-contract.ts`:

- client portal/mobile projections are inspected with `client_portal_mobile`;
- typed workflow API `clientProjection.payload` is inspected with `client_api`;
- unreleased decision projection fail-closed output is inspected with `decision_projection`.

## Boundary Choice

For `IMPL-1.6.2`, the test checks the client/export-adjacent `result.clientProjection.payload` inside `/api/recommendation-review-workflow`. It does not assert that the entire internal workflow response is free of internal operational fields, because that endpoint remains an internal workflow API and may include reload-state/control data. The contract is that any payload promoted toward client/API/export-adjacent visibility is PP003-clean.

## Bold Cleanup Decision Embedded

The new tests reject “clean UI only” as sufficient proof. Every client-safe-looking payload must pass field-level PP003 inspection so future work cannot hide internal AI content in JSON while keeping the visible wording clean.

## Validation

```text
pnpm playwright test tests/pp003-leakage-negative.spec.ts --workers=1
Result: PASS, 3/3

pnpm playwright test tests/pp003-advice-boundary-contract.spec.ts tests/pp003-leakage-negative.spec.ts tests/client-visibility-projection.spec.ts --workers=1
Result: PASS, 16/16

pnpm typecheck
Result: PASS

pnpm guard:source
Result: PASS, violations 0

pnpm db:validate
Result: PASS
```

## Acceptance

Positive acceptance:

- Client portal/mobile projections exclude AI draft, internal rationale, internal assumptions and unsupported-claim text while preserving released client-safe summary fields.
- Typed workflow API `clientProjection.payload` is clean under the PP003 `client_api` surface.
- Unreleased/submitted decisions fail closed before they can become client-facing decision projections.

Negative acceptance:

- This ticket does not implement full PP-005 export redaction. It only creates the PP003 export-adjacent hook through the same surface matrix.
- This ticket does not assert that internal workflow API control envelopes contain no internal fields; only client/export-adjacent payload branches are in scope.
- No UI changed; no screenshot required.
