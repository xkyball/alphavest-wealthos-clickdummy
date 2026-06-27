# E06 Feedback, Validation And No-Overclaim Messaging Analysis

## Ticket

`ANALYSIS-E06-1` - Analyse current app-wide pattern reality.

## Source

- Upload: `/Users/chris/Downloads/alphavest/ALPHAVEST_OVERARCHING_UX_BOC_TICKET_ARCHITECTURE_CTES.md`
- Epic: `E06 - Feedback, Validation and No-Overclaim Messaging System`
- Current branch: `full-workflow`
- Baseline commit: `c68b2f4 test: validate e05 action hierarchy normalization`

## Preflight

- Working tree was clean before analysis.
- `./node_modules/.bin/tsx scripts/source-target-guard.ts` - PASS.
- Target branch is `full-workflow`.
- Package scripts are available for `guard:source`, `typecheck`, `test:route-smoke`, `test:workflow-gate`, `test:v1-p0` and `phase:check`.

## Current Pattern Reality

E06 is not a greenfield messaging problem. The repo already has several strong but overlapping foundations:

- `lib/no-overclaim-copy.ts` defines canonical no-overclaim copy boundaries for upload-only, evidence review, advisor approval, compliance release, client visibility, audit, export approval, download and generic downstream gates.
- `lib/ux-lifecycle-state-contract.ts` defines canonical lifecycle and state families, including success, validation, blocked, restricted, hidden, export pending and audit unavailable states.
- `lib/ux-action-hierarchy-contract.ts` now defines action meanings and downstream separations for approve, release, block, request evidence, export approval, export generation, download, share and client acceptance.
- `components/ui/state-panel.tsx` projects lifecycle state metadata, but message text is still passed as local strings.
- `components/ui/guarded-action-button.tsx` has default loading/success/error labels, but those defaults are not connected to the no-overclaim copy matrix.
- `components/ux-cta-cluster.tsx` centralizes disabled reasons for CTA clusters, but validation/recovery summaries still live outside a feedback-message contract.
- `tests/true-ux-no-overclaim-copy.spec.ts`, `tests/ui-state-boundaries.spec.ts`, `tests/document-upload-flow.spec.ts`, `tests/evidence-drawer-lifecycle.spec.ts`, `tests/export-approval-lifecycle.spec.ts`, `tests/export-download-confirmation-lifecycle.spec.ts`, `tests/role-drawer-confirmation-lifecycle.spec.ts` and route-smoke checks already prove important messaging boundaries.

## Findings

1. The no-overclaim vocabulary exists, but it is currently a copy dictionary, not a typed feedback-message operating contract.
2. Success messages are often action-specific and safe, but the safety comes from local discipline in screen components rather than a reusable projection API.
3. Validation states expose lifecycle attributes such as `blocked-acknowledgement-required`, `blocked-exact-phrase-required` and `blocked-validation-required`, but there is no common validation summary model that ties a summary, field reason and recovery affordance together.
4. Upload success, evidence review, advisor approval, compliance release, export approval, download/share and client visibility are already tested as separate boundaries. E06 should consolidate those boundaries instead of rewriting them route by route.
5. `StatePanel` is the most important reusable visible feedback component, but it accepts free-text `title` and `detail`. That keeps app-wide message semantics outside the typed E01-E05 contract stack.
6. Disabled-control messaging is better centralized than general validation messaging. `DisabledControlReason` and E05 action attributes already handle blocked/unavailable controls, while form validation and success/retry messages remain scattered.
7. The riskiest local strings found in current surfaces are generic fallback messages like `Action persisted.`, `Action failed closed. Review the blocker before retry.`, and status setters embedded directly in large route components. Some are acceptable fallback copy, but they are not governed by an E06-level message taxonomy.
8. The strongest cleanup path is to make a canonical typed feedback-message contract that composes existing no-overclaim boundaries, lifecycle states and action meanings. This removes ambiguity without adding another screen-specific overlay layer.

## Systemic Pattern Families

- No-overclaim boundary copy: upload-only, evidence pending/insufficient/sufficient-after-review, advisor approval not release, compliance release not client acceptance, client visibility hidden/released, export approval not download, download not client acceptance.
- Validation summaries: acknowledgement missing, exact phrase missing, reason missing, invalid form field, retry after error, blocked while submitting.
- Field-level feedback: file type, tenant/role validity, phrase confirmation, acknowledgement checkbox, reason text.
- Success messages: action-specific completion only, with downstream gates explicitly still separate.
- Recovery messaging: retry, request evidence, close/cancel after failed state, blocked static controls with clear reason.
- Audience-sensitive states: internal-only, client-safe released/redacted, reference-only, P1/HOLD blocked.

## Recommended Specification Need

The spec should define one E06 typed feedback-message contract, not a route-by-route copy list.

The contract should answer:

1. Which message intent is being rendered: success, validation, blocked, pending, denied, retry or fail-closed?
2. Which no-overclaim boundary applies?
3. Which lifecycle state and action meaning does the message belong to?
4. Is the message page-level, field-level, modal-level, rail-level or screen-reader-only?
5. Is the message internal-only, client-safe, reviewer/proof-only or audience-neutral?
6. Which downstream completion claim is explicitly forbidden?
7. Which runtime attributes/tests prove the message is governed by the contract?

## Recommended Task Split

| Ticket | Proposed CTES | Scope |
| --- | ---: | --- |
| `IMPL-E06-1` | 10 | Add a typed feedback/no-overclaim message contract and make `StatePanel` plus representative feedback surfaces project message metadata from it. |
| `IMPL-E06-2` | 11 | Normalize validation summaries and field-level feedback helpers for modal/form flows without changing backend validation behavior. |
| `IMPL-E06-3` | 9 | Replace ambiguous success/fallback wording in shared defaults and representative workflow success states with action-specific contract-backed messages. |
| `QA-E06-1` | 8 | Validate copy boundaries, validation metadata, success wording and no-overclaim adoption against the spec. |

## Risks

- A shallow copy cleanup would preserve the current debt: route components would still own message semantics.
- A route-by-route rewrite would be too broad and would likely create inconsistent local variants.
- Treating E06 as backend validation work would exceed the epic scope. E06 can describe UX-visible validation state; it must not invent API behavior.
- Generic success wording can become dangerous when paired with release/export/client visibility actions.
- Client-safe surfaces must not inherit internal proof/audit/validation copy by accident.

## Open Decisions For Specification

- Whether to approve a new canonical `lib/ux-feedback-message-contract.ts` as the system source of truth.
- Whether the first implementation should project metadata from `StatePanel` only or also from `GuardedActionButton` default labels.
- How aggressively to retire local fallback copy in large route components during E06 versus leaving deeper route cleanup to later epics.

## Acceptance Inputs For `SPEC-E06-1`

- E06 should build on E01 operating model, E03 audience/proof mode, E04 lifecycle state and E05 action hierarchy.
- E06 should not add routes, backend commands, schema, permissions, audit persistence or product scope.
- Every approved feedback message category should have a no-overclaim boundary and forbidden downstream claim.
- Validation summaries should expose runtime metadata and accessible reasons.
- Success messages should name only the completed action and state which downstream gates remain separate when risk is medium/high.
- QA should include source-level contract tests plus representative runtime checks for upload, evidence, release, export/download and generic decision success.

## Ticket Result

`ANALYSIS-E06-1` is complete. `SPEC-E06-1` is enabled.
