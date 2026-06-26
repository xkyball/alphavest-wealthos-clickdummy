# IMPL-1.5 AI Draft Classification / Unsupported Claim Lifecycle & Tests

Status: Complete

Source ticket: `IMPL-1.5`

Subtasks covered:

- `IMPL-1.5.1` Draft classification and internal-only state guard.
- `IMPL-1.5.2` Unsupported claim rejection and evidence-backed rebuild lifecycle.
- `IMPL-1.5.3` Evidence-backed rebuild negative/positive tests.

## Implementation

Added `evaluatePp003DraftLifecycleGate` to `lib/pp003-advice-boundary-contract.ts`.

The gate permits internal review while the draft remains internal-only. Promotion to advisor/client-safe candidate requires all of the following:

- draft is classified;
- draft status is `REBUILT_WITH_EVIDENCE` or `ADVISOR_READY`;
- no open `NEEDS_EVIDENCE` unsupported claims;
- no `WAIVED` unsupported claims;
- evidence path is `PP002_CANONICAL_JOURNEY`;
- canonical evidence is sufficient;
- canonical evidence was audited.

The gate blocks PP003 client-visible release entirely. PP003 may prepare an advisor/client-safe candidate, but it does not authorize release to a client surface.

## Bold Cleanup Decision Embedded

Legacy/P44 evidence and unsupported-claim waivers are rejected as PP003 proof. This intentionally removes the older accommodation path instead of wrapping it in another exception layer.

## Tests Added

`tests/pp003-advice-boundary-contract.spec.ts` now verifies:

- internal review is allowed only while the draft stays internal-only;
- advisor candidate promotion is blocked until classification, canonical evidence rebuild and unsupported-claim resolution are complete;
- unsupported-claim waivers, legacy evidence and PP003 client-visible release are rejected.

## Validation

```text
pnpm playwright test tests/pp003-advice-boundary-contract.spec.ts --workers=1
Result: PASS, 9/9

pnpm typecheck
Result: PASS

pnpm playwright test tests/pp001-payload-visibility-contract.spec.ts tests/internal-draft-governance-spine.spec.ts tests/pp003-advice-boundary-contract.spec.ts --workers=1
Result: PASS, 10/10

pnpm playwright test tests/pp002-evidence-sufficiency-canonical.spec.ts tests/pp003-advice-boundary-contract.spec.ts --workers=1
Result: PASS, 15/15

pnpm guard:source
Result: PASS, violations 0

pnpm db:validate
Result: PASS
```

## Acceptance

Positive acceptance:

- Classification, unsupported-claim status, canonical evidence path, sufficiency and audit status now have one central PP003 gate.
- Legacy/P44 evidence cannot satisfy PP003 promotion.
- Waiving unsupported claims cannot satisfy PP003 promotion.
- PP003 cannot release content to client-visible state.

Negative acceptance:

- This ticket does not wire the lifecycle gate into every route/API mutation. That belongs to `IMPL-1.6` and `IMPL-1.7`.
- No UI changed; no screenshot required.
