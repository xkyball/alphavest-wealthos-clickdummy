# AlphaVest UXP0-004 Interaction Reality Register

> Phase 0 validation artefact for interaction pruning. This register separates visible UI affordances from proven behaviour before later UI copy removal, control pruning, disabling or hardening.

## Status

| Field | Value |
| --- | --- |
| Artefact status | `UXP0_004_INITIALIZED` |
| Task | `UXP0-004 Existing Interaction Reality Check` |
| Branch inspected | `full-workflow` |
| Baseline commit | `7c3be96 chore(true-ux): add remaining remediation artifacts` |
| Created | 2026-06-22 |
| Implementation changes | None |
| Product authority | None |

## Source Treatment

| Source | Use | Current Treatment |
| --- | --- | --- |
| `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Operative authority and safety boundary | Binding |
| `ALPHAVEST_UX_REFACTOR_INTERACTION_PRUNING_DETAILED_CODEX_TASKS.md` | UXP0-004 task definition | Binding for this validation artefact |
| `ALPHAVEST_UX_REFACTOR_INTERACTION_CONTENT_FUNCTIONALITY_CLEANUP_AUDIT.md` | Current UX cleanup baseline | Binding for pruning direction |
| `ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md` | Historical interaction-reality layer | Reference only; do not treat stale labels as current implementation truth |
| Current live repo code | Actual control, handler, API and test reality | Primary reality for this register |

## UXP0-004 Acceptance Criteria

| Criterion | Result |
| --- | --- |
| Baseline separates visible affordance from behaviour proof. | `PASS` |
| Safety actions are flagged for later safety implementation or proof. | `PASS` |
| Reference/P1/HOLD controls are separated from MVP/MVP_SUPPORT controls. | `PASS` |
| No lifecycle implementation, removal or hardening was performed. | `PASS` |

## Current Delta From v0.6

| Area | v0.6 Direction | Current Live-Code Reality |
| --- | --- | --- |
| Modal and drawer primitives | Partial; no Escape or focus trap proof. | Improved: `components/ui/modal.tsx` and `components/ui/drawer.tsx` now include focus trap, Escape handling, labelled dialog/panel semantics, live status text and focus return attributes. |
| Data table | Visual support only. | Improved: `components/ui/data-table.tsx` now has sortable headers, disabled/enabled row action wiring and responsive card/table modes. It remains not a persistence proof by itself. |
| Auth/MFA/onboarding | Mostly static/deterministic. | Improved: login, MFA and invite acceptance call `/api/auth/dummy`, hold local status and route forward; still demo-auth only, not production auth. |
| Document upload | Implemented upload mechanics only. | Still implemented and stronger: multipart upload, persistence, evidence/audit creation, tenant reload, fail-closed negative paths and browser flow tests are present. Upload still does not prove evidence sufficiency, release, export or client visibility. |
| Compliance release/block/request evidence | Previously partial/demo. | Improved: typed confirmations, validation-disabled submit, cancel-without-mutation paths, API mutation, audit feedback and tests exist for selected compliance actions. Still safety-gated demo workflow, not blanket release authority. |
| Export workflow | Partial/demo. | Still partial: demo workflow and export safety tests exist, but final real binary/share delivery is not fully proven for every route control. |
| KYC, source-of-wealth, suitability, IPS, review monitoring | Partial demo actions. | Still partial and now out of MVP scope where applicable: route shells and demo actions exist, but workset status controls execution. |
| Committee review | Static route state. | Still static/guarded: route tests assert no release bypass and incomplete gate messaging; vote/dissent/evidence mutations are not implemented. |

## Interaction Classification Register

| Control Family | Current Label | Evidence | Phase 1 Pruning Implication |
| --- | --- | --- | --- |
| Product links and route navigation | `IMPLEMENTED_NAVIGATION` | Route registry, navigation definitions and route-smoke coverage exist. | Keep functional navigation; hide or separate reference/P1/HOLD surfaces according to workset policy. |
| Demo session role/tenant controls | `IMPLEMENTED_DEMO_STATE_ONLY` | Demo session provider and topbar/session selectors persist demo session state. | Keep only as demo/dev control; remove explanatory demo text from product UI where not action-critical. |
| Modal primitive | `IMPLEMENTED_PRIMITIVE_LIFECYCLE` | `components/ui/modal.tsx`; `tests/true-ux-a11y.spec.ts`; `tests/interaction-lifecycle.spec.ts`. | Keep primitive; route-level submit semantics still require per-action proof. |
| Drawer primitive | `IMPLEMENTED_PRIMITIVE_LIFECYCLE` | `components/ui/drawer.tsx`; `tests/true-ux-a11y.spec.ts`; `tests/interaction-lifecycle.spec.ts`. | Keep primitive; drawer-only context must not mutate release, export or client visibility. |
| Wizard steppers | `VISUAL_STATE_SUPPORT_ONLY` | `components/ui/wizard-stepper.tsx` renders step state only. | Keep as progress indicator only; do not imply save/submit lifecycle unless route handler exists. |
| State panels, badges and workflow chips | `VISUAL_STATE_SUPPORT_ONLY` | `components/ui/state-panel.tsx`, `status-chip.tsx`, `workflow-badge.tsx`. | Keep compact state and blocker copy; move methodology/proof explanation to manual. |
| Data tables | `PARTIAL_INTERACTION_SUPPORT` | Sort and optional row action exist; no generic persistence or row-level RBAC proof in primitive. | Keep real sort/row action where wired; mark unconnected row actions disabled or non-interactive. |
| Search, filter and segmented controls | `MIXED_PARTIAL_OR_STATIC` | Some route-local search state exists; many filters are static or disabled. | Keep only wired controls as interactive; make static filters visually non-interactive or remove. |
| Document upload | `IMPLEMENTED_INTERACTION_WITH_SAFETY_LIMIT` | `/api/documents/upload`, `document-upload-*` tests, upload UI and persistence. | Keep upload; keep short microcopy that upload is not sufficiency/release/client visibility. |
| Document extraction review | `PARTIALLY_IMPLEMENTED_INTERACTION` | `/api/documents/review`, review controls and document flow tests. | Keep scoped review actions; do not overclaim final evidence sufficiency. |
| Recommendation review actions | `PARTIALLY_IMPLEMENTED_TO_IMPLEMENTED_DEMO_WORKFLOW` | `runRecommendationReviewWorkflowAction`, `/api/demo-workflow`, `tests/demo-workflow-api.spec.ts`, `tests/confirmation-lifecycle.spec.ts`. | Keep only current-gate actions; prune proof narrative and keep blocked reasons/typed confirmation. |
| Compliance release | `IMPLEMENTED_DEMO_WORKFLOW_WITH_STRONG_GATES` | Release modal validates checkbox/phrase, API call, audit feedback and negative tests. | Keep fail-closed release flow; do not phrase as general client acceptance. |
| Compliance block/request evidence | `IMPLEMENTED_DEMO_WORKFLOW_WITH_STRONG_GATES` | Typed sensitive confirmation modal, API mutation, audit feedback and tests. | Keep as current safety actions; relocate explanatory proof text. |
| Export approval/download/share | `PARTIALLY_IMPLEMENTED_INTERACTION` | Demo workflow actions, export safety logic and tests; real share/binary delivery remains limited. | Keep preview/approval state; avoid claiming final share/download readiness unless proven by route/API. |
| RBAC/access governance drawers | `PARTIALLY_IMPLEMENTED_INTERACTION` | Drawer/modal lifecycle, role/access demo actions, permission tests. | Keep role diff and affected object; route detailed RBAC rationale to manual. |
| KYC/source-of-wealth/suitability/IPS/review monitoring | `PARTIALLY_IMPLEMENTED_HELD_OR_P1` | Demo actions and state panels exist; workset status is P1/HOLD for affected routes. | Do not unlock MVP behaviour; show held/P1 blocked state only unless later approved. |
| Committee review controls | `STATIC_OR_DISABLED_GUARD_STATE` | Route tests prove labels and no-release-bypass; buttons mostly static/disabled. | Keep guard copy; do not treat committee UI as executable workflow. |
| Reference pages and component library previews | `REFERENCE_ONLY_VISUAL_SUPPORT` | Routes `061-063` and component preview controls. | Remove from product navigation or clearly separate as internal reference. |

## Safety Verb Register

| Verb / Action Family | Current Reality | Required Handling Before Phase 1 UI Pruning |
| --- | --- | --- |
| Approve advisor recommendation | Demo workflow action persists advisor approval and keeps client visibility blocked. | Keep only where gate state is explicit; never imply compliance release. |
| Release to client | Demo workflow supports typed confirmation, gate checks, audit and client-safe projection when preconditions pass. | Keep as safety-critical decision room action only; preserve negative copy that advisor approval is not enough. |
| Block release | Demo workflow persists block and audit. | Keep concise blocked reason and confirmation; relocate proof explanation. |
| Request evidence | Demo workflow persists request/evidence state for selected paths. | Keep as recovery action; avoid sufficiency overclaim. |
| Grant/change access | Partial governance workflow with role/access modal/drawer support and permission tests. | Keep affected role/object and confirmation; do not imply admin bypass authority. |
| Export/download/share | Partial export workflow with safety checks; final real file/share semantics remain limited. | Keep export lifecycle steps separate; do not merge approval, generation, download and share. |
| KYC/suitability/IPS/rebalance/committee actions | Partial or static and currently outside MVP where workset says P1/HOLD. | Keep disabled/held state; do not promote route scope. |

## Workset Separation Check

| Workset | Interaction Treatment |
| --- | --- |
| `MVP` | Interaction pruning may keep only proven action handlers, current-gate state, short safety microcopy and route-level proof backed by tests. |
| `MVP_SUPPORT` | Support surfaces may keep context and direct workflow controls, but long manual/proof explanation should move to the relocation register. |
| `P1_AFTER_MVP` | Routes `052`, `053`, `059`, `060`, `068` must stay deferred; visible controls cannot activate MVP release/advice/export scope. |
| `REFERENCE_ONLY` | Routes `061`, `062`, `063` are reference/manual surfaces, not product workflow proof. |
| `HOLD_PENDING_DECISION` | Routes `064`, `065`, `066`, `067`, `069`, `070`, `071` must stay blocked from implementation unlock until explicit decision. |

## Test Inventory Used

| Test Area | Files |
| --- | --- |
| Upload and evidence | `tests/document-upload-api.spec.ts`, `tests/document-upload-flow.spec.ts`, `tests/evidence-review-api.spec.ts` |
| Demo workflow and recommendation gates | `tests/demo-workflow-api.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/p0-acceptance.spec.ts` |
| Confirmation and overlay lifecycle | `tests/confirmation-lifecycle.spec.ts`, `tests/interaction-lifecycle.spec.ts`, `tests/true-ux-a11y.spec.ts` |
| RBAC/client visibility/export safety | `tests/permission-engine.spec.ts`, `tests/client-visibility-projection.spec.ts`, `tests/client-visibility-proof.spec.ts`, `tests/export-safety.spec.ts`, `tests/file-export-realism.spec.ts` |
| Route/workset/scope guardrails | `tests/foundation-guardrails.spec.ts`, `tests/route-smoke.spec.ts`, `tests/committee-review-routes.spec.ts`, `tests/review-monitoring-service.spec.ts` |

## Phase 1 Validation Rule

Before removing, disabling or hardening a visible control, Phase 1 tasks must classify it as one of:

- `IMPLEMENTED_INTERACTION`
- `IMPLEMENTED_DEMO_STATE_ONLY`
- `IMPLEMENTED_PRIMITIVE_LIFECYCLE`
- `PARTIALLY_IMPLEMENTED_INTERACTION`
- `VISUAL_STATE_SUPPORT_ONLY`
- `STATIC_OR_DISABLED_GUARD_STATE`
- `REFERENCE_ONLY_VISUAL_SUPPORT`
- `HELD_OR_P1_BLOCKED`

If the target control has a safety verb and lacks route/API/test proof, it must remain disabled, hidden, converted to compact state copy, or routed to a later safety task. It must not be silently promoted.
