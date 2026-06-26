# IMPL-1.8 Audit Proof for Draft Rejection/Rebuild/Boundary Decisions

Status: Complete

Source ticket: `IMPL-1.8`

## Implementation

Added `tests/pp003-boundary-audit-proof.spec.ts`.

The test suite verifies persisted audit/trace proof for:

- unsupported-claim rejection boundary;
- evidence-backed internal draft rebuild;
- denied unauthorized boundary mutation.

## Audit Semantics

The existing canonical command contract intentionally classifies `reject_unsupported_claim` and `rebuild_with_evidence` under `AI_DRAFT_INTERNAL`. The action-specific proof is carried by:

- `audit.eventType`;
- `audit.result`;
- `audit.previousState` / `audit.nextState`;
- `audit.reason`;
- `audit.metadataJson.action`;
- `audit.metadataJson.canonicalState`;
- `audit.metadataJson.evidenceIds`;
- `DraftTrace` for the internal draft rebuild.

## Bold Cleanup Decision Embedded

This does not introduce a second audit vocabulary. It tests the persisted audit model that already powers the typed workflow, preventing a new parallel “PP003-only audit log” from becoming another drift source.

## Validation

```text
pnpm playwright test tests/pp003-boundary-audit-proof.spec.ts --workers=1
Result: PASS, 3/3

pnpm playwright test tests/pp003-boundary-audit-proof.spec.ts tests/pp003-advisor-candidate-boundary.spec.ts tests/demo-workflow-api.spec.ts --workers=1
Result: PASS, 23/23

pnpm typecheck
Result: PASS

pnpm guard:source
Result: PASS, violations 0

pnpm db:validate
Result: PASS
```

## Acceptance

Positive acceptance:

- Unsupported-claim rejection writes a blocked audit event with actor, role, tenant, target, reason, state and evidence context.
- Evidence-backed rebuild writes success audit proof plus internal `DraftTrace`.
- Unauthorized advisor approval writes a denied audit event and does not mutate/release.

Negative acceptance:

- This does not build full audit immutability or audit UI.
- PP-004 compliance-release audit remains outside PP003 except where existing regression tests cover it.
- No UI changed; no screenshot required.
