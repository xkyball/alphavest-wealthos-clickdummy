# IMPL-1.5 - Compliance Preconditions / Release / Block / Request Evidence Guard & Tests

Source: `/Users/chris/Downloads/alphavest/ALPHAVEST_PP004_ADVISOR_COMPLIANCE_RELEASE_BOC_CTES_TICKET_ARCHITECTURE.md`

Status: COMPLETE

Decision prerequisite: `APPROVE_TYPED_JOURNEY_CANONICAL_PP004`

## Ticket Scope

Implemented this ticket only:

- `IMPL-1.5` Compliance Preconditions / Release / Block / Request Evidence Guard & Tests.
- `SUBTASK-1.5.1` Release Precondition Evaluator.
- `SUBTASK-1.5.2` Block And Request-Evidence State Guard.
- `SUBTASK-1.5.3` Missing-Precondition Negative Tests.

No `IMPL-1.6` released-decision/client-projection implementation was started.

## Implementation Result

The approved canonical route remains the typed Journey Command API:

- `POST /api/journeys/:id/commands`
- `COMPLIANCE_RELEASE`
- `COMPLIANCE_BLOCK`
- `COMPLIANCE_REQUEST_EVIDENCE`

The central release evaluator already exists in `workflowGate.canPassComplianceReleaseGate` and is consumed by the Journey API release handler.

This ticket hardened regression proof on the canonical API rather than creating a parallel evaluator.

## Test Proof Added

`tests/journey-api.spec.ts` now proves release denial for:

- missing advisor approval,
- missing client-safe payload,
- wrong confirmation phrase,
- audit persistence outage,
- missing evidence sufficiency,
- advisor role attempting compliance release,
- admin role attempting compliance release.

The same test file now proves `COMPLIANCE_REQUEST_EVIDENCE`:

- returns `noClientRelease=true`,
- keeps the journey blocked/internal,
- returns no client projection,
- sets recommendation `clientVisible=false`,
- sets recommendation status `MORE_DATA_REQUESTED`,
- sets compliance review status `NEEDS_EVIDENCE`,
- keeps evidence incomplete,
- persists a `journey.compliance.evidence_requested` audit event with blocked result and `clientVisible=false` metadata.

The same test file now proves `COMPLIANCE_BLOCK`:

- returns `noClientRelease=true`,
- keeps the journey blocked/internal,
- returns no client projection,
- sets recommendation `clientVisible=false`,
- sets recommendation status `BLOCKED`,
- sets compliance review status `BLOCKED`,
- keeps evidence incomplete,
- persists a `journey.compliance.blocked` audit event with blocked result and `clientVisible=false` metadata.

## Guard Behaviour

Positive release path still passes after all preconditions are satisfied.

Negative release attempts stay fail-closed:

- release before advisor approval returns `release_preconditions_failed` and `advisor_approval`,
- release without payload returns `release_preconditions_failed` and `payload_ready`,
- release with audit outage returns `409` and `AUDIT_PERSISTENCE_UNAVAILABLE`,
- audit outage does not create a successful release command run,
- audit outage does not set recommendation `clientVisible=true`,
- audit outage does not set decision status `RELEASED_TO_CLIENT`.

## Validation

Commands run:

- `pnpm guard:source` - PASS before implementation.
- `pnpm exec tsc --noEmit` - PASS.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/journey-api.spec.ts --workers=1` - PASS, 8/8.

Validation context:

- A manual dev server was already running at `http://127.0.0.1:3020` from the IMPL-1.4 validation workaround.
- No UI changed.

## Acceptance Result

Positive acceptance: PASS

Negative acceptance: PASS

Screenshot: Not applicable. No UI changed.

## Next Ticket

Next source-ordered ticket after this commit:

`IMPL-1.6` Released Decision Record and Client Visibility Projection Guard & Tests.
