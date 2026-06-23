# AlphaVest V1.0 WP-05 Advisor Compliance Release Report

Generated: 2026-06-23
Authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
Companion task source: `/Users/chris/Downloads/ALPHAVEST_V1_0_DETAILED_IMPLEMENTATION_TASK_DESCRIPTIONS.md`

## Scope

WP-05 proves that advisor approval, compliance release, compliance block and evidence request are separate audited workflow states. No route scope changed, no screen was generated, no manual client visibility override was introduced, and status chips are not used as gate logic.

## Task Status

| Task | Status | Notes |
|---|---|---|
| `V10-WP05-T01` Workflow status normalization | `HARDENED` | Added `recommendationReviewWorkflowStateMachine` as the explicit transition contract for role, permission action, next recommendation status, audit result and client visibility effect. Runtime mutation helpers now read this contract. |
| `V10-WP05-T02` Advisor approval action | `ALREADY_PRESENT_VERIFIED` | Existing API mutation sets advisor approval and `ADVISOR_APPROVED`, keeps `clientVisible=false`, moves compliance to pending and writes audit. |
| `V10-WP05-T03` Compliance release action | `ALREADY_PRESENT_VERIFIED` | Existing release checks advisor approval, accepted scoped evidence, client-safe payload, permission and audit readiness before `RELEASED_TO_CLIENT`. |
| `V10-WP05-T04` Compliance block / request evidence | `ALREADY_PRESENT_VERIFIED` | Existing block/request-evidence paths write audit, keep client fail-closed and prevent release/export overclaim. |

## Changed Files

- `lib/demo-workflow-validation.ts`
- `lib/demo-workflow-mutation.ts`
- `tests/demo-workflow-validation.spec.ts`
- `V1_0_WP05_ADVISOR_COMPLIANCE_RELEASE_REPORT.md`

## Inspected Files

- `app/api/demo-workflow/route.ts`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `lib/control-layer/client-visibility.ts`
- `lib/demo-workflow-mutation.ts`
- `lib/demo-workflow-validation.ts`
- `lib/workflow-gate.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/ui-clickflow-phase01-05.spec.ts`
- `tests/scf-p04-p06-flow-ui.spec.ts`

## Validation

| Command | Result |
|---|---|
| `pnpm playwright test tests/demo-workflow-validation.spec.ts tests/demo-workflow-api.spec.ts tests/workflow-gate.spec.ts tests/ui-clickflow-phase01-05.spec.ts tests/scf-p04-p06-flow-ui.spec.ts` | PASS, 37 passed |
| `pnpm phase:check` | PASS with existing warnings |

## Known Warnings

- Existing lint warnings remain for unused UI helpers and capture helpers.
- Existing build warnings remain for custom Babel config and broad `document-storage-adapter` tracing.

## Method Artifacts

- V2 Discover: Existing workflow gate, mutation, UI and API tests were inspected before editing.
- V2 Define: The acceptance boundary is deterministic advisor/compliance transition control, not client-visible release by advisor approval.
- V2 Develop: The smallest hardening was an explicit state-machine contract consumed by mutation helpers plus a fast unit proof.
- V2 Deliver: WP-05 remains phase-scoped and commit-ready after validation.
- V3 proof path: Positive release branch requires advisor, evidence, payload, permission and audit; killed branches include advisor-only release, missing evidence, internal draft marker, invalid confirmation, audit failure, block and request-evidence.
- Ethics and fairness: Human advisor review is preserved, but compliance release remains the only client-visibility control for advice-like content.

## Verdict

`WP05_READY`.

Advisor approval and compliance release are now represented by an explicit workflow transition contract, with existing API and UI proofs covering the downstream safety behavior. Next package after green validation: `WP-06`.
