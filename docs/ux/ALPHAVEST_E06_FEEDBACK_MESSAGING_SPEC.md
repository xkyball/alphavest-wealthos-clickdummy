# AlphaVest E06 Feedback, Validation And No-Overclaim Messaging Specification

Date: 2026-06-27

## Status

| Field | Value |
| --- | --- |
| Ticket | `SPEC-E06-1` |
| Parent epic | `E06 Feedback, Validation and No-Overclaim Messaging System` |
| Source analysis | `docs/v3/proof/e06_feedback_messaging_analysis.md` |
| Spec status | `DECISION_READY` |
| Implementation status | `BLOCKED_PENDING_HUMAN_APPROVAL` |
| Recommended approval | `APPROVE_E06_CANONICAL_FEEDBACK_MESSAGE_CONTRACT` |

This specification defines the target rules and acceptance criteria for E06. It does not authorize implementation until the human approval gate is cleared.

## Target State

AlphaVest must have one canonical typed feedback-message contract that governs visible and accessible feedback across upload, evidence, approval, release, export, download, share, validation, retry and fail-closed states.

The contract must answer these questions for every governed message:

1. What is the message intent: pending, validation, blocked, denied, fail-closed, retry, success or informational status?
2. Which no-overclaim boundary applies?
3. Which lifecycle state and action meaning does the message belong to?
4. Where is the message rendered: page state, modal body, modal footer/status, field-level feedback, action rail, inline CTA cluster or screen-reader-only announcement?
5. Which audience is allowed to see it: operational internal, reviewer/proof, client-safe or audience-neutral?
6. Which downstream claims are explicitly forbidden?
7. Which runtime attributes prove that the message is contract-backed?

## Canonical Source Decision

Recommended decision: add a narrow code-backed canonical contract in `lib/ux-feedback-message-contract.ts`, then make `StatePanel`, validation-summary helpers, field-level feedback helpers and representative high-risk workflow success states project from it.

Allowed fallback if the user rejects a new file: extend `lib/no-overclaim-copy.ts` with message metadata. This is acceptable but less clean because `no-overclaim-copy` currently owns phrases, not rendered message placement, lifecycle state or validation shape.

Rejected approach: continue patching local strings inside large route components. That preserves the old overlapping vocabulary and makes success/validation/retry claims depend on local author discipline.

## Required Message Intents

Implementation must support intents equivalent to:

```ts
export type UxFeedbackIntent =
  | "status"
  | "pending"
  | "validation"
  | "blocked"
  | "denied"
  | "fail_closed"
  | "retry"
  | "success";
```

Required semantics:

- `status`: informational state only; not a workflow completion gate.
- `pending`: work is underway or awaiting a required actor/gate.
- `validation`: user input or acknowledgement is incomplete; submission stays blocked.
- `blocked`: owner gate, policy gate, evidence gate, audit gate or scope gate prevents completion.
- `denied`: permission/scope/audience guard refused the action fail-closed.
- `fail_closed`: a required dependency such as audit persistence, permission, scope or payload visibility is unavailable.
- `retry`: the user may attempt a safe recovery action; retry does not imply the previous action completed.
- `success`: the named action completed only; downstream gates remain separate unless the same contract explicitly names them as completed.

## Required Message Subjects

Implementation must support subjects equivalent to:

```ts
export type UxFeedbackSubject =
  | "upload"
  | "evidence_review"
  | "evidence_sufficiency"
  | "advisor_approval"
  | "compliance_release"
  | "client_visibility"
  | "client_acceptance"
  | "audit_persistence"
  | "permission_scope"
  | "export_scope"
  | "export_redaction"
  | "export_approval"
  | "export_generation"
  | "download"
  | "share"
  | "generic_action";
```

Subject separation:

- Upload is not evidence sufficiency.
- Evidence review is not release.
- Advisor approval is not compliance release.
- Compliance release is not export, download, share or client acceptance.
- Export approval is not generation, download, share or client acceptance.
- Download is not share or client acceptance.
- Client-safe visibility is not client acceptance.
- Audit display is not audit persistence proof.
- Permission visibility is not authorization bypass.

## Required Placements

Implementation must support placements equivalent to:

```ts
export type UxFeedbackPlacement =
  | "page_state"
  | "modal_body"
  | "modal_status"
  | "field"
  | "inline_cluster"
  | "action_rail"
  | "screen_reader";
```

Placement rules:

- `page_state`: may summarize current state and next safe step; must not claim hidden downstream completion.
- `modal_body`: may explain preconditions and confirmation consequences before submit.
- `modal_status`: may expose validation, loading, success and error status for the modal lifecycle only.
- `field`: must name the specific missing or invalid input, not downstream workflow status.
- `inline_cluster`: may explain CTA availability or blocked reason.
- `action_rail`: may explain next action, blocked reason and safety boundary.
- `screen_reader`: must mirror essential status and validation changes without adding visible-only claims.

## Required Audience Model

Implementation must support audience values equivalent to:

```ts
export type UxFeedbackAudience =
  | "operational_internal"
  | "reviewer_proof"
  | "client_safe"
  | "audience_neutral";
```

Audience rules:

- `operational_internal` may mention internal review, audit requirements and unreleased gates.
- `reviewer_proof` may mention proof posture and test/capture boundaries when it is not shown in normal task UI.
- `client_safe` must not mention internal drafts, compliance notes, proof metadata, audit internals or unreleased gates except as client-safe availability language.
- `audience_neutral` may be reused for generic field validation and basic availability messages.

## Required Runtime Attributes

Every contract-projected message should be able to emit attributes equivalent to:

- `data-ux-feedback-intent`
- `data-ux-feedback-subject`
- `data-ux-feedback-placement`
- `data-ux-feedback-audience`
- `data-ux-feedback-boundary`
- `data-ux-feedback-downstream-forbidden`
- `data-ux-feedback-action-meaning`
- `data-ux-feedback-state-family`
- `data-ux-no-overclaim`

These attributes are proof metadata for QA. They must not become visible product copy.

## Message Copy Rules

- Success copy must name the completed action and no more.
- Medium/high-risk success copy must explicitly preserve downstream separations.
- Validation copy must state the missing requirement and the safe next step.
- Blocked copy must state the blocking gate and must not style the gate as completion.
- Retry copy must explain safe retry conditions and must not imply mutation occurred.
- Fail-closed copy must name the unavailable dependency, such as audit, permission, scope or payload visibility.
- Client-safe copy must say `client-safe`, `released`, `redacted`, `unavailable` or equivalent safe terms; it must not say `client accepted` unless client acceptance is the explicit action subject.
- Generic copy such as `Action persisted.` may exist only as a low-risk fallback and must not be used for release, export, evidence, audit, permission or client-visible actions.

## Relationship To Existing Contracts

- E01 `ux-operating-model` remains the source for audience and productive eligibility.
- E02 `ux-page-template-system` remains the source for page template zones and long-page behavior.
- E03 `ux-proof-reviewer-mode` remains the source for operational/reviewer/client-mode visibility.
- E04 `ux-lifecycle-state-contract` remains the source for lifecycle kind, state family and capture state.
- E05 `ux-action-hierarchy-contract` remains the source for action meaning, placement and action availability.
- E06 owns feedback-message intent, message subject, no-overclaim copy projection, validation summaries, field-level feedback and action-specific success wording.

## Implementation Boundaries

Allowed after approval:

- Add `lib/ux-feedback-message-contract.ts`.
- Make `components/ui/state-panel.tsx` optionally accept a contract-backed message projection while preserving existing public props for migration.
- Add a small reusable validation summary or field-feedback helper if implementation proves it reduces route-local duplication.
- Update `components/ui/guarded-action-button.tsx` shared defaults so success/error/loading messages use E06 contract language.
- Replace representative high-risk local success/validation strings in upload, evidence, advisor/compliance release, export approval/download and decision-success surfaces where the spec authorizes it.
- Add focused tests that prove the contract and representative runtime adoption.

Forbidden:

- Do not add routes.
- Do not generate screen, state-screen, image or screenshot assets as product UI.
- Do not add backend validation behavior, API commands, schemas, migrations, permission changes or audit persistence.
- Do not weaken no-overclaim wording.
- Do not move proof/reviewer language into operational default UI.
- Do not convert this into a route-by-route copy rewrite.
- Do not claim WCAG completion; only prove the touched feedback/status patterns.

## Acceptance Criteria

- A canonical typed E06 feedback-message contract exists or the user-approved fallback is implemented.
- Message intent, subject, placement, audience and no-overclaim boundary resolve to runtime attributes.
- `StatePanel` can project E06 feedback metadata without losing E04 lifecycle state metadata.
- Shared validation/field feedback surfaces expose accessible requirements and do not imply downstream completion.
- Shared guarded-action defaults no longer rely on ambiguous high-risk success/failure wording.
- Representative success messages for release/export/download/advisor/evidence/upload/decision surfaces are action-specific.
- Upload success does not imply evidence sufficiency.
- Evidence review does not imply release.
- Advisor approval does not imply compliance release.
- Compliance release does not imply client acceptance.
- Export approval does not imply generation/download/share/client acceptance.
- Download does not imply share or client acceptance.
- Client-safe visibility does not imply client acceptance.
- No route, schema, API, permission, audit persistence, release, export or client visibility policy is changed.

## Review And Test Design

Minimum validation after implementation:

- `./node_modules/.bin/tsx scripts/source-target-guard.ts`
- `./node_modules/.bin/tsc --noEmit`
- Focused E06 contract test, recommended: `tests/ux-feedback-message-contract.spec.ts`
- Source/adoption proof for `StatePanel`, validation helper and `GuardedActionButton`
- Representative runtime checks:
  - `tests/true-ux-no-overclaim-copy.spec.ts`
  - `tests/ui-state-boundaries.spec.ts`
  - `tests/document-upload-flow.spec.ts`
  - `tests/evidence-drawer-lifecycle.spec.ts`
  - `tests/export-approval-lifecycle.spec.ts`
  - `tests/export-download-confirmation-lifecycle.spec.ts`

Screenshots are required only for visible UI layout or styling changes. Metadata-only, copy-only or test-only changes may report that no screenshot was warranted.

## Downstream Implementation Tasks

| Ticket | Status | Required Scope |
| --- | --- | --- |
| `IMPL-E06-1` | Blocked pending approval | Add the canonical feedback-message contract and make shared no-overclaim feedback components project message metadata. |
| `IMPL-E06-2` | Blocked pending approval and `IMPL-E06-1` | Normalize validation summaries and field-level feedback patterns for representative modal/form flows. |
| `IMPL-E06-3` | Blocked pending approval and `IMPL-E06-1` | Replace ambiguous success wording with action-specific contract-backed messages in shared defaults and representative high-risk surfaces. |
| `QA-E06-1` | Blocked pending implementation | Validate E06 contract adoption, no-overclaim copy boundaries, validation metadata and representative runtime behavior. |

## Post-Spec Approval Gate

Implementation must not start until the user approves one of these choices:

| Approval Choice | Recommendation | Consequence |
| --- | --- | --- |
| `APPROVE_E06_CANONICAL_FEEDBACK_MESSAGE_CONTRACT` | Recommended | Add a typed feedback-message contract and make shared feedback/status/validation/success messaging project from it. Best path to retire scattered route-local message semantics. |
| `APPROVE_E06_NO_OVERCLAIM_COPY_EXTENSION_ONLY` | Acceptable fallback | Extend `lib/no-overclaim-copy.ts` with more copy entries and tests, but message placement, lifecycle, audience and validation metadata remain less explicit. |
| `REJECT_E06_IMPLEMENTATION` | Not recommended | Leaves E06 as analysis/spec only and preserves duplicated feedback/validation vocabulary. |

## Ticket Result

`SPEC-E06-1` is complete and decision-ready. `IMPL-E06-1`, `IMPL-E06-2`, `IMPL-E06-3` and `QA-E06-1` remain blocked until the post-spec approval gate is cleared.
