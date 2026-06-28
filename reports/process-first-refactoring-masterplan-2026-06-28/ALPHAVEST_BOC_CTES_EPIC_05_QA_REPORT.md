# AlphaVest BOC/CTES EPIC-05 QA Report

Date: 2026-06-28

## Scope

EPIC-05: Status, Action, Blocker and Confirmation Primitives.

Executed tickets in order:

1. `EPIC-05-SPEC-01`
2. `EPIC-05-IMPL-01A`
3. `EPIC-05-IMPL-01B`
4. `EPIC-05-IMPL-01C`
5. `EPIC-05-QA-01`

## Implemented Contract

- Added `docs/00-current/ALPHAVEST_STATUS_ACTION_BLOCKER_CONFIRMATION_PRIMITIVES_CONTRACT.json`.
- Linked the EPIC-05 contract from `docs/00-current/ALPHAVEST_PROCESS_FIRST_UX_LAYOUT_CONTRACT.md`.
- Extended `lib/ux-status-command-hierarchy.ts` with:
  - `epic_05_status_action_blocker_confirmation`
  - primitive families: `status`, `action`, `blocker`, `confirmation`
  - typed confirmation scopes and states
  - `uxConfirmationAttributesFor`
- Extended `components/ui/status-chip.tsx` so status chips project the shared status-command contract instead of remaining only decorative status UI.
- Migrated representative screen S039 `/compliance/reviews/:id/decision-room` to declare EPIC-05 blocker/action/confirmation semantics.

## Validation

Commands run:

- `pnpm guard:source` - passed.
- `pnpm typecheck` - passed.
- `pnpm playwright test tests/ux-status-command-hierarchy.spec.ts tests/true-ux-shared-primitives.spec.ts tests/confirmation-lifecycle.spec.ts --workers=1` - passed, 15 tests.

Focused prior validations:

- `pnpm playwright test tests/ux-status-command-hierarchy.spec.ts tests/true-ux-shared-primitives.spec.ts --workers=1` - passed, 9 tests after `EPIC-05-IMPL-01A`.
- `pnpm playwright test tests/ux-status-command-hierarchy.spec.ts tests/true-ux-shared-primitives.spec.ts --workers=1` - passed, 10 tests after `EPIC-05-IMPL-01B`.
- `pnpm playwright test tests/ux-status-command-hierarchy.spec.ts tests/true-ux-shared-primitives.spec.ts --workers=1` - passed, 11 tests after `EPIC-05-IMPL-01C`.

QA discovered one stale expectation:

- `tests/confirmation-lifecycle.spec.ts` expected a valid release phrase to produce successful release feedback.
- Current product truth correctly fails closed when release preconditions still miss `payload_ready` and `decision_rationale`.
- The test was rebased to require fail-closed UI/API proof: no mutation, no client release, `SAFE_ERROR`, error state and no success/export/download/share/client-acceptance copy.

## Screenshot Proof

Screenshots:

- `artifacts/screenshots/epic-05/s039-compliance-decision-room-primitives.png`
- `artifacts/screenshots/epic-05/s039-sensitive-confirmation-modal-primitives.png`

Live DOM proof for `/compliance/reviews/demo/decision-room`:

```json
{
  "roomAttrs": {
    "target": "S039",
    "contract": "epic_05_status_action_blocker_confirmation",
    "family": "blocker",
    "hierarchy": "blocking",
    "command": "blocked_command",
    "reason": "Release remains blocked because evidence, policy, reviewer and approver gates are not all satisfied.",
    "recovery": "review_policy"
  },
  "modalAttrs": {
    "contract": "epic_05_status_action_blocker_confirmation",
    "family": "confirmation",
    "confirmationScope": "compliance_release",
    "confirmationState": "validation_failed",
    "requiresAudit": "true",
    "confirmationNoOverclaim": "true",
    "sensitiveAction": "request_evidence"
  }
}
```

## Acceptance Result

Positive:

- Shared status/action/blocker/confirmation semantics are now typed and runtime-testable.
- S039 uses the contract as a severe representative consumer.
- Blocking and attention states require reason and recovery action.
- Confirmation attributes are scoped to the named action and require audit by default.
- Existing confirmation lifecycle now proves fail-closed release behavior when release preconditions remain missing.

Negative:

- Confirmation validity is not accepted as release, export, download, share, permission mutation, client visibility or client acceptance.
- Screenshot proof is visual/context proof only; the executable proof is the focused source and lifecycle tests.
- No schema, API contract, route split, production IdP or new product authority was introduced.

## Deviations And Decisions

No user decision was required.

The cleanup decision inside scope was to retire the stale success expectation in `tests/confirmation-lifecycle.spec.ts`. Keeping it would have normalized a dangerous overclaim: "valid typed phrase equals release success." The corrected test now matches the safer current product behavior.

## Recommended Next Ticket

Proceed to `EPIC-06` only after treating EPIC-05 as a hard gate for all future P0 action, blocker and confirmation UI. Any local button, badge, modal or blocked-state copy that cannot project this contract should be migrated or explicitly recorded as debt.
