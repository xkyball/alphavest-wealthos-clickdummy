# Advisor And Compliance Wedge Implementation Proof

Date: 2026-06-28
Continuation trigger: `Mach weiter`

## Scope Executed

- Continued after `APPROVE_FOUNDATION_THEN_EXPORT_WEDGE`.
- Implemented the next process-first wedge across:
  - `IMPL-B1` Advisor Detail Is Not Release for route `037`.
  - `IMPL-B2` Compliance Detail Decision Room for route `039`.

## Changed Files

- `components/internal-workflow-screen.tsx`
- `tests/process-first-ux-contract.spec.ts`
- `tests/p0-process-first-ux-burndown.spec.ts`
- `reports/process-first-ux-layout-implementation-plan-2026-06-28/ADVISOR_COMPLIANCE_WEDGE_IMPLEMENTATION_PROOF.md`

## Inspected Inputs

- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- `reports/process-first-ux-layout-implementation-plan-2026-06-28/ALPHAVEST_PROCESS_FIRST_UX_LAYOUT_IMPLEMENTATION_PLAN.md`
- `lib/process-first-ux-contract.ts`
- `components/internal-workflow-screen.tsx`
- `tests/workflow-gate.spec.ts`
- `tests/client-visibility-projection.spec.ts`

## Positive Acceptance

- Advisor gate `037` now consumes `processFirstUxContractForPageId("037")`.
- Compliance gate `039` now consumes `processFirstUxContractForPageId("039")`.
- Advisor gate now emits explicit process metadata for:
  - `ACC-004`
  - `P0_ADVISOR_APPROVAL_NOT_RELEASE_GATE`
  - `currentStep="advisor_review"`
  - `blockedReason="advisor_approval_not_release"`
- Compliance gate now emits explicit process metadata for:
  - `ACC-005`, `ACC-006`, `ACC-007`
  - `P0_COMPLIANCE_RELEASE_GATE`, `P0_CLIENT_VISIBILITY_GATE`, `P0_AUDIT_PERSISTENCE_GATE`
  - `currentStep="compliance_release_decision"`
  - `blockedReason="evidence_policy_audit_preconditions_not_satisfied"`

## Negative Acceptance

- Advisor approval still cannot release content, export content, unlock client visibility or create client acceptance.
- Compliance release remains blocked while evidence, policy, permission and audit preconditions are unsatisfied.
- Client visibility projection remains fail-closed for submitted but unreleased decision payloads.

## Validation

- `pnpm guard:source` - PASS
- `pnpm typecheck` - PASS
- `pnpm playwright test tests/process-first-ux-contract.spec.ts tests/p0-process-first-ux-burndown.spec.ts --workers=1` - PASS, 8/8
- `pnpm playwright test tests/workflow-gate.spec.ts tests/client-visibility-projection.spec.ts --workers=1` - PASS, 17/17

## Deviations

- This wedge did not yet attempt a visual height recapture for S037/S039. It establishes process-first contract traceability and safety metadata first.
- Existing dirty worktree changes outside this wedge were preserved and not reverted.

## Next Recommended Phase

Run a fresh screens-only capture after the remaining route-family structure work, or continue with evidence/document sufficiency (`IMPL-D`) before capture if the goal is to reduce long-page risk across the next highest P0 route family.
