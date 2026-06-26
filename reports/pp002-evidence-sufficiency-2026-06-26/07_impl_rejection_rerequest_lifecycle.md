# IMPL-3 - Evidence Rejection / Re-request Lifecycle

Generated: 2026-06-26

Task: `IMPL-3 Evidence Rejection / Re-request Lifecycle`

Status: `COMPLETE_TEST_IMPLEMENTATION`

## Parent Task Result

The approved first-wave canonical lifecycle uses:

- `DECIDE_EVIDENCE_SUFFICIENCY` with `decision: INSUFFICIENT` as the canonical evidence rejection/insufficiency decision.
- `COMPLIANCE_REQUEST_EVIDENCE` as the internal audited re-request action.

No client notification flow was added. That remains out of scope for PP-002 first wave.

## Subtask 1.6.1 - Evidence Rejection State And Reason Handling

Status: `COMPLETE`

Proof:

- `tests/pp002-evidence-sufficiency-canonical.spec.ts` now records an `INSUFFICIENT` decision with a reason.
- The evidence requirement remains unmet.
- The decision does not release client visibility.

## Subtask 1.6.2 - Re-request Evidence Action And Audit Proof

Status: `COMPLETE`

Proof:

- `tests/pp002-evidence-sufficiency-canonical.spec.ts` now executes `COMPLIANCE_REQUEST_EVIDENCE`.
- The journey becomes `BLOCKED` with `COMPLIANCE_EVIDENCE_REQUESTED`.
- An audit event `journey.compliance.evidence_requested` is written with `BLOCKED` result.
- The response keeps `noClientRelease: true`.

## Product Code Delta

No production code delta was required for IMPL-3. The canonical journey command path already supported the approved first-wave lifecycle; this ticket added explicit PP-002 regression proof.

## Validation

```text
pnpm playwright test tests/pp002-evidence-sufficiency-canonical.spec.ts --workers=1
6 passed
```

## Ticket Result

`IMPL-3` is finished.

