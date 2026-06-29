# EPIC-10-ANALYSIS-01 Domain Gap Report

Generated: 2026-06-29

Source: `reports/process-first-refactoring-masterplan-2026-06-28/ALPHAVEST_PROCESS_FIRST_REFACTORING_MASTERPLAN_BOC_CTES.json`

Ticket: `EPIC-10-ANALYSIS-01` - Step coverage and current implementation audit for Advisor Review and Approval

## Definition Re-Read

- Task: Audit all mapped processes and steps for Advisor Review and Approval against current routes, components, services and tests.
- Goal: Separate implemented behavior from visual-only or specified-only claims.
- Scope: `BP-050`, `BP-051`, `BP-052`, `BP-053`, `BP-054`, `BP-055`.
- Expected output: EPIC-10 domain gap report.
- Definition of done: Each mapped process has implementation status and missing step list.

## Current Evidence

### Source and Guard

- Branch: `full-workflow`.
- Baseline commit before this ticket: `5254833 docs: close epic 09 matrix qa slice`.
- `pnpm guard:source`: PASS, 0 violations.
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` read before execution.

### Current Route and Surface Evidence

- `lib/route-registry.ts` defines:
  - `036` `/advisor/reviews` - Advisor Approval Queue.
  - `037` `/advisor/reviews/:id` - Advisor Approval Detail.
- `components/internal-workflow-screen.tsx` contains the advisor queue/detail branches:
  - `AdvisorQueuePage`.
  - `AdvisorDetailPage`.
  - route dispatch for page IDs `036` and `037`.
  - advisor action wiring through `runAdvisorApprovalWorkflowAction`.
- Existing UI copy already separates advisor review from release in multiple places, for example advisor action text and route-to-advisor guidance state that advisor review does not create client-visible advice.

### Current Service and API Evidence

- `lib/p44-phase6-advisor-review-closure.ts` is the strongest DOMAIN-F service seam. It implements:
  - advisor queue triage.
  - advisor queue scope checks.
  - option comparison.
  - advisor evidence request.
  - advisor return to analyst.
  - advisor approval without release.
  - advisor-not-release negative sweep and exit certification.
- `lib/typed-workflow-command-bus.ts` contains the canonical typed advisor approval mutation path and links advisor approval to process runtime step `BP-054-S03`.
- `lib/recommendation-review-workflow-validation.ts` defines the advisor approval workflow state machine and request parser.
- `lib/recommendation-review-workflow-api.ts` routes typed advisor approval workflow requests through `runAdvisorApprovalWorkflowMutation` and returns fail-closed JSON on invalid or unsafe requests.
- `reports/process-runtime-backbone-2026-06-28/PROCESS_RUNTIME_RELEASE_PRECONDITIONS_REPORT.md` records the backend shift from typed compatibility proof to canonical process runtime proof for advisor approval and compliance release.

### Current Test Evidence

- `tests/p44-phase6-certification.spec.ts` covers the deepest DOMAIN-F service proof:
  - queue triage and no release.
  - queue scope allow/deny.
  - option comparison and client-safe projection.
  - evidence decision guard.
  - more evidence request.
  - advisor approval without release.
  - return to analyst.
  - negative matrix for return/release/client projection.
  - phase exit certification.
- `tests/recommendation-review-workflow-api.spec.ts` covers advisor approval API/runtime behavior.
- `tests/recommendation-review-workflow-validation.spec.ts` covers typed action validation and transitions.
- `tests/route-smoke.spec.ts` includes route smoke and visible behavior for advisor routes.
- `tests/ux-status-command-hierarchy.spec.ts` locks typed status and command hierarchy, but this is a shared primitive dependency, not a complete DOMAIN-F implementation proof.

## Coverage Matrix Snapshot

DOMAIN-F currently has 24 P0 steps.

- `partially_implemented`: 16
- `specified_only`: 8
- `implemented`: 0

Missing layers currently recorded:

- `negative_test`: 24
- `step_level_gate_proof`: 18
- `audit_or_evidence_failure_proof`: 18
- `implementation_touchpoint_proof`: 8

AREA-05 is therefore partially implemented and not closable. This is correct: route and service presence must not be upgraded to completion without direct step-level positive and negative proof refs.

## Process-Level Findings

### BP-050 - Advisor Approval Queue Triage

Current status: `partially_implemented`.

Evidence:

- S036/S037 routes exist.
- Advisor queue page exists.
- P44 Phase 6 service creates queue state and assigns work to `senior_wealth_advisor`.
- Scope checks can allow the intended advisor and deny wrong object scope.

Missing step list:

- `BP-050-S01`: negative proof missing.
- `BP-050-S02`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-050-S03`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-050-S04`: step-level gate, audit/evidence failure and negative proof missing.

Interpretation:

The behavior is real enough for partial coverage, but the matrix has not yet attached proof refs to the current P44/API/UI tests. It must not be marked implemented.

### BP-051 - Recommendation Detail Review

Current status: `partially_implemented`.

Evidence:

- S037 detail route exists.
- Advisor detail page exists.
- Service layer supports internal recommendation detail, option and evidence context.
- Validation and API layers keep advisor role and action types explicit.

Missing step list:

- `BP-051-S01`: negative proof missing.
- `BP-051-S02`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-051-S03`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-051-S04`: step-level gate, audit/evidence failure and negative proof missing.

Interpretation:

Detail review exists, but process-specific proof is still scattered across P44 Phase 6 and typed workflow tests. EPIC-10 should consolidate these refs into a canonical advisor review contract.

### BP-052 - Option Comparison

Current status: `partially_implemented`.

Evidence:

- `createP44OptionComparison` persists option rows and evidence rows.
- Tests prove scoped evidence and client-safe projection behavior.
- UI has advisor detail decision context.

Missing step list:

- `BP-052-S01`: negative proof missing.
- `BP-052-S02`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-052-S03`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-052-S04`: step-level gate, audit/evidence failure and negative proof missing.

Interpretation:

Option comparison is domain-backed, but not yet expressed as an EPIC-10 route/service/test boundary contract.

### BP-053 - Advisor Requests More Evidence

Current status: `specified_only`.

Evidence:

- `requestP44AdvisorMoreEvidence` exists in the P44 Phase 6 service seam.
- UI-sensitive action confirmation exists for `request_evidence`.
- Compliance screen also contains request-evidence action wiring, but DOMAIN-F advisor-specific route proof is not yet canonical in the matrix.

Missing step list:

- `BP-053-S01`: negative and implementation-touchpoint proof missing.
- `BP-053-S02`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-053-S03`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-053-S04`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.

Interpretation:

This should be promoted from stale `specified_only` only after EPIC-10 contract/proof explicitly links the P44 advisor evidence-request path, UI confirmation and negative no-release proof to `BP-053`.

### BP-054 - Advisor Approves To Compliance

Current status: `partially_implemented`.

Evidence:

- `recordP44AdvisorApprovalWithoutRelease` exists and is tested.
- `typed-workflow-command-bus` links advisor approval to `BP-054-S03`.
- Runtime release preconditions require advisor approval process step before compliance release can proceed.
- Tests validate advisor approval without client release.

Missing step list:

- `BP-054-S01`: negative proof missing.
- `BP-054-S02`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-054-S03`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-054-S04`: step-level gate, audit/evidence failure and negative proof missing.

Interpretation:

This is the strongest implemented seam, but still should remain partial until matrix proof refs are added and the UI/route proof is explicitly locked.

### BP-055 - Advisor Rejects / Returns To Analyst

Current status: `specified_only`.

Evidence:

- `returnP44AdvisorReviewToAnalyst` exists in the P44 Phase 6 service seam.
- Tests cover return-to-analyst and negative no-release/client-projection outcomes.
- Current matrix has not recognized this as implementation touchpoint proof.

Missing step list:

- `BP-055-S01`: negative and implementation-touchpoint proof missing.
- `BP-055-S02`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-055-S03`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-055-S04`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.

Interpretation:

This is a stale matrix gap. The bold cleanup path is to stop treating return/reject as only specified and connect it to the already-existing P44 Phase 6 service/test seam.

## Contradictions To Resolve

1. Advisor approval must be powerful enough to move work forward, but must not release content to clients.
2. The queue/detail UI should be compact, but it must still show blocker, reason, evidence and next action.
3. Existing services are strong, but the matrix still says many steps are unproven.
4. Typed command proof exists, but route-level proof and process-step proof are not yet unified.
5. More-evidence and return-to-analyst behavior exists in service tests, but the coverage matrix still treats those processes as specified-only.
6. Advisor review depends on analyst-draft inputs, but must not leak internal AI/rules draft payloads.
7. Compliance release needs advisor approval as prerequisite, but advisor approval must not masquerade as compliance release.
8. UI copy should be product-native, but internal proof markers must stay out of default operational UI.
9. Screenshots can prove layout density, but cannot prove process completion.
10. Route smoke can prove route existence, but not role/object/audit safety.
11. P44 Phase 6 tests prove a service slice, but EPIC-10 needs a current process-first contract.
12. Area acceptance can pass while domain closure stays blocked.
13. Stale `specified_only` states should be removed where proof exists, but not replaced with `implemented`.
14. Audit failure proof is necessary, but must not force fake UI panels.
15. The fastest path is proof consolidation, but the durable path is a canonical DOMAIN-F contract.

## Recommended Next Move

Proceed to `EPIC-10-SPEC-01`.

Bold cleanup recommendation:

- Create a first-class EPIC-10 advisor review contract instead of adding another compatibility layer around scattered WP05/P44 names.
- Treat `BP-053` and `BP-055` as stale matrix gaps after proof consolidation, not as absent behavior.
- Keep all 24 steps below `implemented` until direct positive and negative proof refs exist in the coverage matrix.

## Acceptance for This Ticket

- Every mapped process has implementation status.
- Every mapped process has a missing step list.
- The audit separates real service/route/test behavior from matrix closure claims.
- No UI changed; no screenshot warranted.
