# IMPL-1.7 Advisor Candidate Boundary and No-Release State Guard

Status: Complete

Source ticket: `IMPL-1.7`

## Implementation

Updated `lib/typed-workflow-command-bus.ts` so the internal draft transition to `ADVISOR_READY` is no longer controlled by a local status/open-claims check only.

The transition now evaluates `evaluatePp003DraftLifecycleGate` with `promotionTarget: "advisor_candidate"` and requires:

- classified draft;
- `REBUILT_WITH_EVIDENCE` status;
- no open or waived unsupported claims;
- PP002 canonical scoped evidence;
- canonical evidence sufficiency;
- canonical evidence audit readiness.

Advisor approval can still persist as an internal workflow state, but it does not create client visibility, compliance release, decision release, or a client projection.

## Tests Added

Added `tests/pp003-advisor-candidate-boundary.spec.ts`.

The tests verify:

- advisor approval without canonical evidence-backed rebuild does not create an `ADVISOR_READY` draft;
- advisor candidate after canonical rebuild may become `ADVISOR_READY` but still stays `COMPLIANCE_PENDING`, `clientVisible: false`, no client projection, no decision release and no `releasedToClientAt`.

## Bold Cleanup Decision Embedded

Removed the older local mini-guard as the effective authority for advisor-ready promotion. PP003 now uses one central lifecycle gate instead of allowing parallel state logic to drift.

## Validation

```text
pnpm playwright test tests/pp003-advisor-candidate-boundary.spec.ts --workers=1
Result: PASS, 2/2

pnpm playwright test tests/pp003-advice-boundary-contract.spec.ts tests/pp003-advisor-candidate-boundary.spec.ts tests/demo-workflow-api.spec.ts --workers=1
Result: PASS, 29/29

pnpm typecheck
Result: PASS

pnpm guard:source
Result: PASS, violations 0

pnpm db:validate
Result: PASS
```

## Acceptance

Positive acceptance:

- Advisor candidate state remains internal and controlled.
- Advisor approval alone does not imply compliance release, client visibility, decision release or client acceptance.
- Canonical rebuild can prepare an advisor-ready internal draft without releasing it.

Negative acceptance:

- This does not implement full PP-004 compliance release lifecycle.
- UX wording remains for `IMPL-1.9`; this ticket verifies state/API boundaries.
- No UI changed; no screenshot required.
