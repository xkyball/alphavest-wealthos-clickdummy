# IMPL-2 - Evidence Review / Link / Relevance / Scope Sufficiency Logic & Tests

Generated: 2026-06-26

Task: `IMPL-2 Evidence Review / Link / Relevance / Scope Sufficiency Logic & Tests`

Status: `COMPLETE_TEST_IMPLEMENTATION`

## Parent Task Result

The approved first-wave canonical path is now explicitly protected by a dedicated PP-002 regression suite:

- `tests/pp002-evidence-sufficiency-canonical.spec.ts`

This keeps PP-002 from depending on broad journey tests whose names do not communicate the evidence sufficiency contract.

## Subtask 1.5.1 - Evidence Review And Sufficiency-State Alignment

Status: `COMPLETE`

Proof:

- The new test requires explicit evidence link plus compliance decision before `evidenceSufficient` becomes true.
- Missing review fails closed with `evidence_review_preconditions_failed` and no persisted `EvidenceSufficiencyDecision`.

## Subtask 1.5.2 - Evidence Link / Relevance / Object-Scope Validation

Status: `COMPLETE`

Proof:

- The new test requires `LINK_EVIDENCE` before sufficiency.
- The new test requires `scopeMatches`, `relevanceConfirmed` and `currentnessConfirmed`.
- Restricted evidence remains blocked even when a caller attempts to attest review/relevance/scope/currentness.

## Subtask 1.5.3 - Unreviewed / Stale / Wrong-Scope Evidence Negative Tests

Status: `COMPLETE_FOR_FIRST_WAVE`

Proof:

- Unreviewed evidence fails closed.
- Missing currentness is treated as the first-wave stale-evidence negative.
- Missing scope is treated as the first-wave wrong-scope negative.
- `EvidenceStatus.RESTRICTED` plus `VisibilityStatus.RESTRICTED` fails closed through `evidence_status` and `client_safe_visibility`.

## Product Code Delta

No production code delta was required. Current canonical services already enforced the first-wave contract:

- `lib/journeys/journey-api-service.ts`
- `lib/evidence-service.ts`
- `app/api/journeys/[id]/evidence-sufficiency/route.ts`

## Validation

```text
pnpm playwright test tests/pp002-evidence-sufficiency-canonical.spec.ts --workers=1
4 passed
```

## Ticket Result

`IMPL-2` is finished.

