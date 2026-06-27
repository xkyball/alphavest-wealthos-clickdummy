# AlphaVest E03 Operational UI Vs Proof / Debug / Reviewer Separation Specification

Date: 2026-06-27

## Status

| Field | Value |
| --- | --- |
| Ticket | `SPEC-E03-1` |
| Parent epic | `E03 Operational UI vs Proof / Reviewer Mode Separation` |
| Source analysis | `docs/v3/proof/e03_operational_proof_separation_analysis.md` |
| Spec status | `IMPLEMENTED_CURRENT_REPO_TRUTH` |
| Implementation status | `E03_IMPLEMENTED_AND_VALIDATED` |
| Existing implementation path | `CANONICAL_REVIEW_MODE_CONTRACT` |

This specification defines the implemented proof/reviewer separation system for E03. The canonical review-mode path is current repo truth through `lib/ux-proof-reviewer-mode.ts`, a reusable `ProofReviewerPanel` secondary surface, operational-default hooks, client-mode suppression metadata and focused E03 tests.

## Target State

AlphaVest must have one canonical proof/reviewer visibility contract that decides where proof, debug, reviewer, route-context, audit/history and safety-boundary content belongs.

The contract must answer these questions for every relevant content class:

1. Is this required for normal task completion?
2. Is this safety-blocker or recovery guidance that must remain visible?
3. Is this reviewer/proof/debug metadata that belongs in a secondary surface?
4. Is this capture-only metadata?
5. Is this forbidden in client mode?
6. Which E01 operating mode and E02 page-template proof/audit placement does it project from?
7. Which tests prove the decision?

## Canonical Source Decision

Implemented decision: use a narrow code-backed canonical contract in `lib/ux-proof-reviewer-mode.ts`, then make proof/reviewer components, app-shell/topbar/page-header metadata, capture review outputs and client-suppression tests project from it.

Rejected fallback for current repo truth: extending only `lib/ux-operating-model.ts` and `lib/ux-page-template-system.ts` with proof/reviewer visibility fields. This is less clean because E03 needs to classify content, not routes alone.

Rejected approach: restore `ProductGuidancePanel` as visible default UI. That would bring proof/reviewer scaffolding back into operational workflows and preserve old debt.

## Visibility Modes

| Mode | Purpose | Default UI | Reviewer Surface | Client Mode |
| --- | --- | --- | --- | --- |
| `operational_default` | Normal task execution. | Shows task context, blockers, recovery and safe next action only. | Optional. | Only if client-safe. |
| `reviewer_secondary` | Human reviewer/proof traceability. | Hidden or collapsed by default. | Shows route IDs, proof tags, warnings, traceability, capture posture. | Forbidden. |
| `capture_only` | Screenshot/contact-sheet/capture metadata. | Not rendered as product UI. | May be exported in reports. | Forbidden. |
| `client_mode` | Client-safe released/redacted experience. | Shows released/redacted client-safe structural signals only. | Forbidden. | Required. |

Exact export names may change during implementation, but the semantics must not weaken.

## Content Classes

Implementation must classify content equivalent to:

```ts
export type UxProofReviewerContentClass =
  | "task_context"
  | "safety_blocker"
  | "recovery_guidance"
  | "route_context"
  | "route_id"
  | "ux_proof_tag"
  | "capture_warning"
  | "debug_metadata"
  | "audit_history_summary"
  | "internal_rationale"
  | "compliance_note"
  | "client_safe_signal";
```

Required classification:

- `task_context`, `safety_blocker` and `recovery_guidance` may appear in operational default when needed to complete the task safely.
- `route_context` may appear in operational default only as human-readable workspace/object/visibility context.
- `route_id`, `ux_proof_tag`, `capture_warning` and `debug_metadata` belong in reviewer secondary or capture-only mode.
- `audit_history_summary` may appear in operational default only when it is part of the current decision/audit task; otherwise it belongs in reviewer secondary.
- `internal_rationale` and `compliance_note` are internal/reviewer content and forbidden in client mode.
- `client_safe_signal` may appear in client mode only when released/redacted and no-overclaim safe.

## Operational Default Rules

- Default workflows must not require proof/debug scaffolding to complete normal tasks.
- Default workflows may show current task context, status, blockers, safety obligations and recovery actions.
- Default workflows must not show route IDs, proof tags, capture warnings, implementation trace paths or debug metadata as visible app content.
- Default workflows must not use proof/reviewer panels as the primary page content.
- If a safety statement affects the user's next action, keep it visible; if it exists only to prove implementation/capture posture, move it to reviewer secondary or capture output.

## Reviewer Secondary-Surface Rules

- Reviewer/proof metadata must have a canonical secondary surface, panel, drawer or mode container.
- The reusable panel must have explicit proof/reviewer mode input, a title, metadata slots and close/collapse affordances.
- The secondary surface may include route IDs, UX proof tags, E01 operating mode, E02 template family, proof posture, capture capability, warnings, model families, source trace links and audit/report pointers.
- The secondary surface must not expose product mutation controls.
- The secondary surface must not be required to complete normal operational workflows.
- The secondary surface must carry no-overclaim copy: reviewer proof is traceability, not automatic product completion.

## Capture-Only Rules

- Capture metadata and screenshot/contact-sheet outputs remain proof artifacts, not implementation authority.
- Capture-only content may include route IDs, proof posture, capability status, model context and warnings.
- Capture-only content must not be rendered in client mode.
- Capture output must not claim complete product capability unless current UI/API/service/DB/guard evidence exists.

## Client-Mode Suppression Rules

- Client mode must suppress proof/debug/reviewer scaffolding by construction.
- Client mode must suppress internal drafts, internal rationale, compliance notes, route proof tags, capture warnings, debug metadata, route IDs and unreleased audit detail.
- Client mode may show only client-safe released/redacted signals and task context appropriate for the client role.
- Client mode suppression must be tested at the UI/component layer and must remain compatible with existing visibility-engine no-leakage tests.

## Implementation Boundaries

Implemented scope:

- Add `lib/ux-proof-reviewer-mode.ts` or use the approved fallback.
- Add a reusable `ProofReviewerPanel` / proof-reviewer secondary-surface component with explicit mode, metadata slots and close/collapse behaviour.
- Add data attributes or hooks that classify content visibility mode.
- Move proof/debug metadata out of default operational surfaces where the spec classifies it as reviewer secondary or capture-only.
- Add client-mode suppression hooks for proof/reviewer/internal metadata.
- Update or retire stale tests that require visible `ProductGuidancePanel` proof scaffolding in default UI.
- Add focused tests for contract coverage, renderer adoption, client suppression and representative runtime behavior.

Forbidden:

- No route reclassification.
- No new routes.
- No screen-specific copy-edit backlog.
- No screen/image/state-screen generation.
- No schema or migration work.
- No API creation or backend audit-persistence implementation.
- No RBAC or permission-engine change.
- No hiding of operational safety blockers that affect task completion.
- No restoration of default proof scaffolding just for compatibility with stale tests.

## Relationship To Existing Contracts

- E01 `ux-operating-model` remains the source for operating mode, audience and proof posture.
- E02 `ux-page-template-system` remains the source for template family and proof/audit placement.
- E03 classifies proof/reviewer content visibility and display target.
- `capture-screen-model-context` remains the capture/reviewer metadata source and should project E03 classification where relevant.
- `ProductGuidancePanel` must not become the default operational proof surface again.

## Acceptance Criteria

- Every approved content class resolves to a visibility target.
- A route or template can derive whether proof/debug metadata is operational-default, reviewer-secondary, capture-only or client-forbidden.
- Default operational surfaces do not visibly require route IDs, proof tags, capture warnings or debug metadata to complete normal tasks.
- Safety blockers and recovery guidance remain visible when they affect task completion.
- Reviewer/proof metadata has one reusable secondary-surface pattern or adapter.
- Client mode suppresses internal proof/debug/reviewer scaffolding by construction.
- Existing visibility-engine no-leakage behavior remains intact.
- Capture metadata remains conservative and cannot overclaim screenshot proof.
- Stale `ProductGuidancePanel` default-UI expectations are retired or rewritten against the canonical E03 contract.
- No route, schema, API, permission, audit persistence, release, export or client visibility policy is changed by E03 unless a later approved ticket explicitly authorizes it.

## Review And Test Design

Minimum validation after implementation:

- `pnpm guard:source` or the repo-local guard script if the pnpm wrapper blocks before script execution
- `pnpm typecheck`
- Focused proof/reviewer contract test, recommended: `tests/ux-proof-reviewer-mode.spec.ts`
- E01 proof: `tests/ux-operating-model.spec.ts`
- E02 proof: `tests/ux-page-template-system.spec.ts`
- Capture proof: `tests/capture-screen-model-context.spec.ts`
- Client suppression proof: `tests/client-visibility-proof.spec.ts` and a UI/component suppression test
- Representative runtime check for operational default and reviewer secondary behavior if visible UI changes occur

Screenshots are required only if implementation changes visible UI. Contract, metadata, test-only or suppression-hook work should report that no screenshot was warranted.

## Downstream Implementation Tasks

| Ticket | Status | Required Scope |
| --- | --- | --- |
| `E03-I1` / `IMPL-E03-1` | Complete | Canonical proof/reviewer visibility contract and reusable `ProofReviewerPanel` secondary-surface pattern exist. |
| `E03-I2` / `IMPL-E03-2` | Complete | Proof/debug metadata is removed from default operational views by projecting through the contract and operational surfaces no longer import legacy ProductGuidance naming. |
| `E03-I3` / `IMPL-E03-3` | Complete | Client-mode suppression hooks for internal proof/reviewer/debug content exist on client hub surfaces. |
| `E03-Q1` / `QA-E03-1` | Complete | Operational, reviewer and client modes are validated against this specification. |

## Implementation Path / Cleanup Note

The existing implemented path is the canonical review-mode contract. Do not restore `ProductGuidancePanel` as default operational proof scaffolding, and do not move E03 visibility decisions back into scattered route, template, topbar or test expectations.

## Ticket Result

`E03-S1` / `SPEC-E03-1` is complete as current repo truth. `E03-I1`, `E03-I2`, `E03-I3` and `E03-Q1` are executable as validation/closure against the implemented canonical review-mode path.
