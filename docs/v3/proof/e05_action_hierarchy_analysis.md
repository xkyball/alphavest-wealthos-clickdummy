# E05 Action Hierarchy And Workflow Control Analysis

## Ticket

`ANALYSIS-E05-1: Analyse current app-wide pattern reality`

## Source

- Upload: `/Users/chris/Downloads/alphavest/ALPHAVEST_OVERARCHING_UX_BOC_TICKET_ARCHITECTURE_CTES.md`
- Extracted E05 chain: `ANALYSIS-E05-1` -> `SPEC-E05-1` -> human approval -> `IMPL-E05-1` -> `IMPL-E05-2` -> `IMPL-E05-3` -> `QA-E05-1`
- Operative repo authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

## Current Reality

AlphaVest already has strong foundations from E01-E04:

- E01 owns route operating model, audience and no-overclaim posture.
- E02 owns page template zones, including `action_zone`, `longPageBehavior` and `actionZoneBehavior`.
- E03 owns operational-default versus reviewer/capture/client visibility.
- E04 owns lifecycle, state and capture variants.

Action hierarchy itself is not yet canonical. The current app mixes at least four action vocabularies:

- `components/page-header.tsx` defines local header action behavior and primary/recovery/secondary data attributes.
- `components/ux-cta-cluster.tsx` defines another local primary/recovery/secondary model.
- `components/ui/guarded-action-button.tsx` defines guard/lifecycle/audit metadata but is not adopted by workflow screens.
- Large workflow screens define local `primaryButtonClass`, `secondaryButtonClass` and `staticButtonClass` constants and repeat blocked-control metadata inline.

The scan found 145 action-related matches across components/tests for local button classes, primary CTA markers, disabled reasons, blocked static controls and sticky rails. Local class constants appear in 11 screen components:

- `components/admin-tenant-setup-screen.tsx`
- `components/auth-onboarding-screen.tsx`
- `components/client-intake-screen.tsx`
- `components/committee-review-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/internal-workflow-screen.tsx`
- `components/kyc-aml-workflow-screen.tsx`
- `components/review-monitoring-screen.tsx`
- `components/suitability-ips-screen.tsx`
- `components/wealth-actions-screen.tsx`

## Main Findings

### 1. The app has CTA tests, but no action taxonomy

Existing tests prove useful constraints:

- `tests/true-ux-cta-state.spec.ts` enforces one-primary CTA behavior for selected Phase 8 routes.
- `tests/button-cta-lifecycle-pruning.spec.ts` prevents enabled buttons without a lifecycle.
- `tests/disabled-control-a11y-messaging.spec.ts` requires accessible disabled-control messaging.
- Route smoke tests assert primary CTA count and specific recovery labels for representative routes.

These tests check symptoms. They do not define the app-wide action contract that every surface must project from.

### 2. Sticky action behavior exists, but is split between template and screen code

`lib/ux-page-template-system.ts` already knows `actionZoneBehavior` and long-page behavior such as `adjacent_action_rail` and `sticky_action_zone`. `components/worksurface-shell.tsx` renders a sticky rail based on that template signal.

At the same time, workflow screens still hand-roll sticky `aside` blocks and visible "Action rail" sections. That creates two authorities for rail placement: the canonical template system and local screen structure.

### 3. Disabled, blocked and held actions are accessible but verbose and duplicated

The repo correctly avoids many fake enabled controls by using disabled buttons, status spans and explicit `data-ux-disabled-reason` attributes. The repeated inline pattern is now itself debt:

- Many surfaces repeat `data-ux-affordance="blocked-static-control"`.
- Many repeat the same reason text: "Blocked until a typed workflow command is implemented."
- Some blocked actions still use primary visual treatment, which risks implying an executable next step.

This should be projected from a shared action contract instead of copied locally.

### 4. Approval, release, export and download are mostly semantically separated, but by copy and local tests

The app has strong local safety copy around release and export:

- Compliance release states say release does not imply export, download, share or client acceptance.
- Export approval/download states say approval, generation, download, share and acceptance are separate events.
- State panels from E04 encode export and blocked-state no-overclaim rules.

The missing piece is a canonical action semantics layer that names these as distinct action meanings instead of leaving them as route-specific prose.

### 5. GuardedActionButton is useful but not the canonical action hierarchy

`GuardedActionButton` already projects guard status, disabled reason, audit/confirmation/permission requirements and lifecycle status. It is only present as a standalone primitive and is not used by the major workflow screens.

The E05 implementation should not simply "use GuardedActionButton everywhere." The stronger cleanup path is to add a canonical typed action hierarchy contract, then let `GuardedActionButton`, `PageHeader`, `UxCtaCluster`, rails and selected workflow surfaces project from it.

## Pattern Families Affected

- Action hierarchy: primary, secondary, tertiary, recovery, destructive and blocked/static actions.
- Action semantics: approve, release, block, request evidence, export approve, export generate, download, share, client acceptance, navigation and draft/save.
- Placement: page header action cluster, in-flow CTA cluster, adjacent action rail, sticky action rail and modal confirmation footer.
- Disabled reason: hidden, denied, blocked, lifecycle pending, missing prerequisite, static demo scope and route-scope hold.
- Safety metadata: confirmation required, audit required, permission required and no-overclaim boundary.

## Systemic Versus Screen-Specific

Systemic and in scope for E05:

- Typed action hierarchy and semantics.
- One primary executable next action per action group unless the group is explicitly non-productive.
- Destructive/blocking actions separated from release/approval/download actions.
- Sticky action rail behavior projected from template/action contracts.
- Disabled/blocked reason attributes emitted by primitives rather than repeated inline.
- Tests proving representative adoption and source-level drift prevention.

Screen-specific and out of scope:

- Route-by-route redesign.
- New screen creation or route reclassification.
- Copy churn where existing copy is already no-overclaim safe.
- Backend command, schema, permission, audit persistence or API changes.
- Full replacement of every local button in one unbounded pass.

## Recommended Specification Cut

Specify one canonical action hierarchy contract in a new `lib/ux-action-hierarchy-contract.ts`.

The contract should define:

- `UxActionPriority`: `primary`, `secondary`, `tertiary`, `recovery`, `destructive`, `blocked`.
- `UxActionMeaning`: `navigate`, `save_draft`, `submit_review`, `approve`, `release`, `block`, `request_evidence`, `export_scope`, `export_redaction`, `export_approval`, `export_generate`, `download`, `share`, `client_acceptance`.
- `UxActionPlacement`: `page_header`, `inline_cluster`, `adjacent_rail`, `sticky_rail`, `modal_footer`, `table_row`.
- `UxActionAvailability`: `enabled`, `disabled`, `hidden`, `blocked_static`, `loading`, `success`, `error`.
- Safety booleans or equivalent flags for permission, confirmation, audit and downstream no-overclaim.

This contract should project runtime attributes and CSS class families for the existing primitives. It should become the source of truth for action semantics, while E01-E04 remain the source of truth for operating mode, template placement, reviewer visibility and lifecycle/state.

## Recommended Implementation Task Cut

### `IMPL-E05-1`

Add `lib/ux-action-hierarchy-contract.ts` and update `components/ux-cta-cluster.tsx`, `components/page-header.tsx` and `components/ui/guarded-action-button.tsx` to project action attributes and class families from it.

Initial CTES: 9/20.

### `IMPL-E05-2`

Add a shared action rail primitive or contract-backed rail adapter, then migrate representative long/high-risk workflow rails through it. Start with surfaces already using `WorksurfaceShell` or explicit action rails; do not route-by-route redesign.

Initial CTES: 12/20.

### `IMPL-E05-3`

Encode separate action meanings for approve, release, block, request evidence, export approval, export generation, download, share and client acceptance. Migrate representative release/export/compliance action groups so tests can prove downstream gates are not collapsed.

Initial CTES: 12/20.

## Risks

- A wrapper-only implementation would preserve local semantic drift behind a nicer component name.
- A route-by-route migration would exceed E05 scope and reintroduce screen-specific backlog work.
- A too-broad migration could churn many high-risk workflow screens at once.
- Treating copy as the contract would preserve the current problem: safety semantics would remain distributed in prose.
- Treating `GuardedActionButton` as the whole solution would miss header clusters, CTA clusters, rails and static blocked actions.

## Open Decisions For Specification

- Whether to approve the bold cleanup path: canonical typed action hierarchy contract plus primitive projection.
- Whether static blocked controls should keep primary visual treatment when unavailable. Recommendation: no; unavailable blocked controls should project `blocked` or `secondary/recovery` treatment unless the spec explicitly marks them as the only safe next status.
- Whether E05 implementation should migrate every local screen constant immediately. Recommendation: no; lock the contract and migrate representative primitives/surfaces first, then use source tests to prevent new local vocabulary.

## Acceptance Criteria Inputs For `SPEC-E05-1`

- One canonical action contract exists or is explicitly rejected.
- Existing primitives project action priority, meaning, placement, availability and disabled reason from the contract.
- The contract distinguishes approval, release, block, evidence request, export approval, export generation, download, share and client acceptance.
- Sticky/adjacent rail behavior is tied to E02 page-template action-zone behavior.
- Disabled/blocked controls expose accessible reasons and no-overclaim metadata.
- Destructive/blocking actions are visually and semantically separated from approval/release/download actions.
- Tests prove representative adoption and prevent new local action vocabulary drift.

## Completion

`ANALYSIS-E05-1` is complete. `SPEC-E05-1` can start.
