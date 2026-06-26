# ALPHAVEST V0.96 — WP-11 Shared Interaction Primitives: Modal / Drawer / Table / Form / CTA / A11y — Deep Task Description

**Artefact status:** `WP11_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_CODEX_HANDOFF_INPUT`  
**Work Package:** `WP-11 — Shared Interaction Primitives: Modal / Drawer / Table / Form / CTA / A11y`  
**Mode:** Task description only. No implementation. No code changes. No screenshots. No generated screens. No visual assets.  
**Target implementation baseline:** `full-workflow` only.  
**Primary successor use:** Codex implementation after `WP-00` moving-baseline rebase confirms current files, usage sites, tests and contradictions.

---

## 1. Executive Task Decision

`WP-11` turns AlphaVest’s shared UI primitives from mostly visual or partially proven components into **reliable, accessible, stateful interaction infrastructure** for the V0.96 Core Journey.

The current V0.96 journey touches many surfaces where modals, drawers, tables, forms, CTAs, state panels, status chips and async feedback are used to express safety-relevant work: Evidence review, Analyst review, Advisor approval, Compliance release/block/request-evidence, Decision record, Client-safe projection, Audit, Governance, Admin non-bypass and Export redaction/approval.

This WP must not create a broad design-system rewrite. It must harden the **existing primitives and their V0.96 usage contracts** so that visible UI elements no longer pretend to prove behaviour. The outcome must be:

- Modal/drawer lifecycle is explicit: trigger, open, focus, labelled semantics, cancel, close, submit, loading, validation, error, success and permission-denied handling.
- Guarded actions are explicit: hidden, disabled, denied, loading, success and error states cannot accidentally execute denied actions.
- Tables/lists/forms provide truthful loading, empty, error, permission and filtered-empty states.
- Status chips and badges are visual summaries only and are backed by actual route/service/schema state where the route is V0.96-relevant.
- CTA hierarchy enforces one primary action per state and demotes secondary actions.
- Accessibility is treated as part of interaction proof, not polish.

**Implementation authorization:** Not in this artefact. Codex may implement later only after `WP-00` confirms current repo reality and after preceding surface WPs preserve their route-specific requirements.

---

## 2. Source-of-Truth Lock

| Rank | Source | Use in this WP | Forbidden Use |
|---:|---|---|---|
| 1 | Current `full-workflow` repo / snapshot | Only target code reality for components, usages, tests and APIs. | Do not derive target tasks from `main`. |
| 2 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | KB-based UX/IA evidence register and WP mapping. | Do not invent UX problems outside evidence. |
| 3 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary WP-11 scope, goal, target files and stop rules. | Do not expand scope beyond V0.96 surfaces. |
| 4 | `DRAWER_MODAL_INTERACTION_CONTRACT.md` | Binding modal/drawer lifecycle deficiencies and contracts. | Do not treat primitive presence as lifecycle proof. |
| 5 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | No-overclaim feedback and validation behaviour. | Do not claim success for downstream gates. |
| 6 | `STATE_SCREEN_SPEC.md` | Route state vocabulary and fail-closed UI state requirements. | Do not generate state-screen images. |
| 7 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Route/action/object/payload separation and admin non-bypass. | Do not let UI route access imply action or payload rights. |
| 8 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence, audit and export safety consequences. | Do not use modal/export/audit display as safety proof. |
| 9 | `P0_TEST_ACCEPTANCE_MATRIX.md` | Existing tests are partial proof; add missing P0/True-UX tests. | Do not claim P0 is complete from current tests. |
| 10 | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` | Codex may implement constrained locked tasks only. | Do not create new product scope, screens or schema replacements. |

Non-negotiable: `full-workflow` is the only implementation target. `main` remains false-gap/legacy only. Markdown is control evidence, not code truth. Visual assets and visible components are not behaviour proof.

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | Task Implication | Must Refactor Now? |
|---|---|---|---|---|---|---|
| Modals and drawers are partial: open prop, overlay/X close exist, but Escape, focus trap, aria labelling, validation and route-level mutation proof are incomplete/unproven. | Interaction Reality Audit; Drawer/Modal Contract | `components/ui/modal.tsx`, `components/ui/drawer.tsx`; WP-11 | Interaction lifecycle / accessibility | High | Harden lifecycle and require route-specific bindings before safety actions. | Yes, shared primitive layer. |
| Tables, filters and kanban primitives can render UI without real sort/filter/row-action/drag/persistence proof. | Interaction Reality Audit; UX/IA Evidence Index | `data-table`, `filter-bar`, `kanban`; WP-11 + surface WPs | Visual-only interaction | Medium/High | Provide truthful state support; do not invent behaviour not required by V0.96. | Yes for table/filter states; no broad kanban build unless used. |
| Many screens expose too many equal CTAs and unclear action priority. | UX/IA Evidence Index; V0.96 source | Shared CTAs; `ux-cta-cluster`; all surface WPs | CTA hierarchy | High | One primary CTA per page/state; secondary/destructive actions demoted/confirmed. | Yes. |
| Status chips/buttons are not gates. | Feedback Contract; Safety contracts | `status-chip`, `workflow-badge`, guarded buttons | UI truth / safety | Critical | Bind chips/actions to actual state or mark visual-only; denied actions cannot execute. | Yes. |
| No-overclaim feedback is required across upload, advisor approval, compliance release and export. | Feedback Contract | Shared state/feedback components | Microcopy / safety | Critical | Components must support copy variants and state feedback without implying downstream gate completion. | Yes with WP-12 coordination. |
| A11y helpers and true-UX tests exist in current snapshot. | Current full-workflow snapshot; WP-00 evidence | `a11y-status`, true-UX specs | Reuse-first | High | Reuse existing helpers/tests; extend, do not duplicate abstractions. | Yes after recheck. |
| Drawers can carry sensitive evidence, role or client data. | Drawer/Modal Contract; RBAC/Evidence contracts | Evidence drawer, access request drawer, audit drawer | Payload visibility / redaction | Critical | Drawer content must be object-scoped, redacted and denied when permission proof is incomplete. | Yes where V0.96 surfaces use drawers. |
| Safety-critical confirmations include release, block/request evidence, role changes, export approval/download. | Drawer/Modal Contract; Evidence/Audit/Export Contract | Compliance, Governance, Export | Confirmation lifecycle | Critical | Confirmations require precondition, validation, audit and fail-closed behaviour. | Yes where shared primitives support them. |

---

## 4. Current Code / Route / Component Reality to Recheck

Before any implementation, Codex must run a read-only recheck and record exact current state in `WP-00` outputs. The current uploaded `full-workflow` snapshot indicates these files exist, but this WP must verify them in the actual repo/pull before editing:

| Area | Files / Modules to inspect | Recheck Goal |
|---|---|---|
| Modal primitive | `components/ui/modal.tsx` | Current props, aria support, close policy, focus/Escape support, usage compatibility. |
| Drawer primitive | `components/ui/drawer.tsx` | Current open/close semantics, aria labelling, Escape/focus handling, content scoping expectations. |
| Tables / lists | `components/ui/data-table.tsx`, `components/ui/filter-bar.tsx`, `components/ui/evidence-list.tsx`, `components/ui/audit-timeline.tsx` | Loading/empty/error/permission states; row-action semantics; visual-only limits. |
| Guarded actions / CTAs | `components/ui/guarded-action-button.tsx`, `components/ux-cta-cluster.tsx` | Hidden/disabled/denied/loading/success/error states; one-primary CTA support. |
| State feedback / chips | `components/ui/state-panel.tsx`, `components/ui/status-chip.tsx`, `components/ui/workflow-badge.tsx`, `components/ui/a11y-status.tsx` | No-overclaim state display; screen-reader announcements. |
| Usage sites | `components/client-intake-screen.tsx`, `internal-workflow-screen.tsx`, `decisions-governance-screen.tsx`, `communication-export-ops-screen.tsx`, `admin-tenant-setup-screen.tsx` | Where shared primitives are used in V0.96 routes. |
| Tests | `tests/interaction-lifecycle.spec.ts`, `tests/confirmation-lifecycle.spec.ts`, `tests/true-ux-a11y.spec.ts`, `tests/true-ux-cta-state.spec.ts`, `tests/route-smoke.spec.ts` | Current assertion scope and missing cases. |

Reality labels to assign before edits: `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `BLOCKED`, `REQUIRES_REBASE`.

---

## 5. WP Problem Statement

The V0.96 UI cannot be trusted if its shared primitives remain merely visual. Current evidence repeatedly warns that:

- A visible modal is not proof of a complete confirmation lifecycle.
- A visible drawer is not proof of object-scoped, redacted, permission-aware content.
- A button is not proof that an action is allowed or safely persisted.
- A status chip is not proof that a workflow gate passed.
- A table row is not proof of row-level visibility or safe action permission.
- A success message is not proof of downstream release, evidence sufficiency, export approval or client acceptance.

This WP solves the cross-cutting primitive layer so the surface WPs can express truthful states without duplicating inconsistent interaction logic.

---

## 6. V0.96 Journey Role

`WP-11` supports every major V0.96 journey stage:

| Journey Stage | Shared Primitive Dependency |
|---|---|
| Evidence Workbench | Upload feedback, evidence table states, evidence drawer, review/insufficient/sufficient CTAs. |
| Analyst Workbench | Internal draft review actions, unsupported claim states, evidence-needed states, no-client-leak labels. |
| Advisor Approval | Queue table, approval detail actions, reject/request changes modal, advisor-not-release feedback. |
| Compliance Decision Room | Release/block/request-evidence confirmations, precondition blockers, audit-required state, permission-denied states. |
| Decision Record / Client-safe Projection | Client-safe state panels, hidden/redacted states, no released content states. |
| Audit Surface | Audit timeline states, audit unavailable, persisted audit reference display. |
| Governance / Admin Non-Bypass | Access request drawers, second confirmation, denied admin bypass feedback. |
| Export UX | Scope selection states, redaction preview, export approval/download confirmations, forbidden payload blocked states. |

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | How WP-11 Addresses It | Boundary |
|---|---|---|
| Route-catalog feel | Shared CTA/page-state primitives support journey-first actions and route-relevant next steps. | WP-01 owns navigation/app shell. WP-11 supports interaction components only. |
| Long-page sprawl | Secondary contextual content can live in drawers/tabs only when it is not the core decision. | WP-02 owns layout/density; WP-11 must not hide core decision actions inside drawers. |
| Too many equal CTAs | `ux-cta-cluster`/guarded button patterns enforce one primary CTA per state. | Do not decide business priority outside route-specific WPs. |
| Visual-only modals/drawers | Add lifecycle contracts and tests. | Do not implement route actions without route/service/API contracts. |
| Status chips pretending to be gates | Chips become state labels only; they must reference actual status source or be clearly visual-only. | WP-13/WP-14 align API/schema state sources. |
| Tables without real behaviour | Tables expose state slots and safe row action semantics. | Do not add sorting/filtering globally unless used by V0.96. |
| No-overclaim copy | Components support truthful copy and disabled/blocked explanation. | WP-12 owns copy registry and route-level wording. |
| A11y gaps | Modal/drawer/focus/status announcements are hardened. | Avoid large design-system rewrite; improve current primitives incrementally. |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### Changes Now

- Modal lifecycle baseline: labelled dialog, `aria-modal`, focus entry/return, Escape policy, backdrop policy, cancel/submit separation, loading/error/validation states.
- Drawer lifecycle baseline: labelled complementary/dialog-like panel as appropriate, Escape/close policy, focus management, object-scoped content contract, safe cancellation.
- Guarded action behaviour: `hidden`, `disabled`, `denied`, `loading`, `success`, `error`, `requiresConfirmation`, `requiresAudit`, `requiresPermission` states.
- CTA cluster rules: one primary CTA, clear secondary/destructive treatment, disabled explanation.
- Table/list states: loading, empty, filtered-empty, error, permission denied, row-action disabled/denied.
- A11y status announcements for async state changes where practical.
- Tests for modal/drawer/confirmation/guarded-action lifecycle and a11y basics.

### Stays Out

- Broad redesign or new visual language.
- Screen/image/state-screen generation.
- New 064–071 visual assets.
- Full data-table product suite: global sort/filter/pagination/drag-drop unless V0.96 usage requires it.
- New route/product scope decisions.
- Blind Prisma/schema replacement.
- New APIs unless a locked downstream task explicitly proves necessity.
- Turning P1/HOLD routes into MVP implementation scope.

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| WP11-T01 | Recheck shared primitive reality | Current snapshot suggests primitives/tests exist, but implementation must reflect live repo. | `components/ui/*`, `components/ux-cta-cluster.tsx`, test files | Inventory props/usages/tests; classify each primitive as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`; document incompatible usages. | Rebase note identifies current primitive capabilities and gaps before edits. | No code tests yet; optionally static grep/log evidence. | Yes, evidence-driven only. | Do not edit before rebase; do not trust old counts. |
| WP11-T02 | Harden modal primitive lifecycle | Modal currently proves only partial lifecycle in KB. | `components/ui/modal.tsx`; all modal usages | Add/preserve title/id labelling; aria relationships; Escape support where safe; focus entry and focus return; cancel vs submit semantics; loading/error/validation render slots; backdrop policy. | Modal usage can express blocked/denied/loading/error/success without silent close or overclaim. | `tests/interaction-lifecycle.spec.ts`, `tests/confirmation-lifecycle.spec.ts`, `tests/true-ux-a11y.spec.ts` | Yes. | Do not break existing modal API without updating usages and smoke tests. |
| WP11-T03 | Harden drawer primitive lifecycle | Drawers can carry sensitive evidence/client/governance data. | `components/ui/drawer.tsx`; evidence/audit/access drawers | Add labelled panel semantics; Escape/close policy; focus management; content scoping contract docs/comments; safe close/cancel; optional footer/action slots. | Drawer can be opened/closed predictably, does not trap user, and supports denied/redacted states. | `tests/interaction-lifecycle.spec.ts`, route-specific evidence/governance tests | Yes. | Do not use drawer as substitute for Compliance Decision Room core action. |
| WP11-T04 | Standardize guarded action button | Route access must not imply action permission. | `components/ui/guarded-action-button.tsx`; CTA usages | Ensure states for hidden/disabled/denied/loading/success/error; require disabled reason; prevent click execution when denied/disabled/loading; support destructive/confirmation metadata. | Denied/disabled/loading actions cannot execute handlers; reason visible or accessible. | `tests/true-ux-cta-state.spec.ts`, P0 safety tests | Yes. | Never implement manual client visibility override. |
| WP11-T05 | Enforce CTA cluster semantics | Many screens expose too many equal actions. | `components/ux-cta-cluster.tsx`, route headers/details | Ensure one primary action per state; group secondary; mark destructive; expose blocked reason; allow route WPs to pass action priority. | V0.96 surfaces can render a single clear primary CTA per state. | `tests/true-ux-cta-state.spec.ts` | Yes. | Do not decide route-specific CTA priority here when source WP has not defined it. |
| WP11-T06 | Add truthful table/list states | Tables/filters can be visual-only. | `components/ui/data-table.tsx`, `filter-bar.tsx`, `evidence-list.tsx`, `audit-timeline.tsx` | Add/verify loading, empty, filtered-empty, error, permission-denied state slots; row actions use guarded actions; no row action fires when denied. | Lists/tables no longer show blank space or unsafe actions when data unavailable/denied. | `tests/interaction-lifecycle.spec.ts`, route-specific true-UX tests | Yes. | Do not build global sort/filter/pagination if not required. |
| WP11-T07 | Align status chips and state panels with truth | Status chips are not gates. | `status-chip.tsx`, `workflow-badge.tsx`, `state-panel.tsx` | Add optional source/description/blocked reason; ensure chips label state only; avoid gate-complete wording unless API/service state proves it. | Chips cannot be mistaken for proof of release/evidence/audit/export completion. | `tests/true-ux-p0-safety.spec.ts`, `tests/true-ux-cta-state.spec.ts` | Yes. | Do not mark evidence sufficient/released/export approved from visual state alone. |
| WP11-T08 | Add async a11y status support | Async interactions need screen-reader feedback. | `a11y-status.tsx`, modal/drawer/CTA/table usages | Reuse existing a11y status helper; announce upload, validation, denied, blocked, success/error states; keep copy no-overclaim. | Async state changes are available to assistive technology. | `tests/true-ux-a11y.spec.ts` | Yes. | Do not spam announcements or reveal sensitive/internal content to client context. |
| WP11-T09 | Create primitive usage migration checklist | Shared changes can regress routes. | Components listed above; route screens | For each changed primitive, list usage sites and required migration steps; update only touched V0.96 surfaces; defer P1/HOLD. | No broken props/usages; route-smoke passes. | `tests/route-smoke.spec.ts` | Yes, controlled. | Do not refactor entire app if outside V0.96 journey. |
| WP11-T10 | Add primitive lifecycle regression tests | Existing tests are proof slices, not complete P0. | `tests/interaction-lifecycle.spec.ts`, `confirmation-lifecycle.spec.ts`, `true-ux-a11y.spec.ts`, `true-ux-cta-state.spec.ts` | Add tests for modal Escape/focus/cancel/submit; drawer close/focus; denied guarded action; table empty/error/permission state; CTA one-primary rule. | Tests fail if visual-only interactions regress or denied actions execute. | Listed tests plus route smoke. | Yes, test UX behaviour. | Do not assert screenshots/image assets. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### Components

- `components/ui/modal.tsx`
- `components/ui/drawer.tsx`
- `components/ui/data-table.tsx`
- `components/ui/filter-bar.tsx`
- `components/ui/guarded-action-button.tsx`
- `components/ui/a11y-status.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/status-chip.tsx`
- `components/ui/workflow-badge.tsx`
- `components/ui/evidence-list.tsx`
- `components/ui/audit-timeline.tsx`
- `components/ux-cta-cluster.tsx`

### Main Usage Screens to Recheck

- `components/client-intake-screen.tsx`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/admin-tenant-setup-screen.tsx`
- `components/demo-session-panel.tsx`

### Route Families Most Impacted

- Evidence: `027–030`, `046–047`
- Analyst / Advisor / Compliance: `033–045`
- Governance / Admin: `008–010`, `048–051`
- Export: `054–058`
- Client-safe projection: `019–020`

### APIs / Services / Schema

WP-11 should not implement API/schema changes directly. It must expose UI contract hooks for later/parallel WPs to bind truth from:

- Permission engine / visibility engine
- Evidence service / audit service / export service
- `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, relevant current APIs after WP-00 rebase
- Prisma models: `AuditEvent`, `EvidenceRecord`, `Document`, `Recommendation`, `Approval`, `ComplianceReview`, `Decision`, `ExportRequest`, `Role`, `Permission`, `UserRole`

---

## 11. Interaction Lifecycle Requirements

### Modal Lifecycle

| Stage | Requirement |
|---|---|
| Trigger | Opens from explicit user action or documented deterministic state. Must not imply mutation. |
| Open | Receives title/id, context, actor/role where relevant, preconditions and blocked state. |
| Focus | Initial focus set safely; focus returns to trigger on close where practical. |
| Close | X/backdrop/Escape/cancel behaviour explicit; unsafe close preserves state where needed. |
| Submit | Submit disabled until validation/preconditions pass; submits through route/API contract. |
| Loading | Submit shows pending; prevents duplicate execution. |
| Validation | Field/form/confirmation phrase errors visible and announced. |
| Error | Error keeps context and allows retry/cancel safely. |
| Success | Names only completed action; no downstream overclaim. |
| Denied | Permission denied cannot execute submit. |

### Drawer Lifecycle

| Stage | Requirement |
|---|---|
| Trigger | Opens from row/detail/secondary context action; core decisions stay on main route. |
| Content | Object-scoped and redacted according to permission/visibility/evidence contracts. |
| Close | X/backdrop/Escape/route-back behaviours specified. |
| Submit | Any mutation routed through guarded action/API safety; no demo POST as final proof. |
| Error/Denied | Shows safe state; no hidden internal payload leak. |

### Table / Form / CTA Lifecycle

- Tables expose loading, empty, filtered-empty, error and permission-denied states.
- Row actions use guarded actions.
- Forms validate before submit, preserve input on recoverable errors and do not silently advance state.
- CTAs express one primary action per state and never execute when disabled/denied/loading.
- Destructive/safety actions require confirmation and consequence copy.

---

## 12. State / Feedback / Microcopy Requirements

WP-11 provides component support. Route-specific wording remains with WP-12 and surface WPs.

Required generic copy patterns:

| State | Allowed Copy Pattern | Forbidden Copy Pattern |
|---|---|---|
| Upload success | “Upload complete. Evidence requires review.” | “Evidence complete.” |
| Advisor approval | “Advisor approved. Waiting for compliance release.” | “Released to client.” |
| Compliance release | “Released client-safe summary is available.” | “Client accepted decision.” |
| Export preview | “Preview ready. Approval still required.” | “Export ready.” |
| Denied action | “You do not have permission to perform this action.” | Silent disabled button with no reason. |
| Audit unavailable | “Audit confirmation unavailable; action remains blocked/pending.” | “Action completed.” |

Shared primitives must accept `description`, `reason`, `helpText`, `error`, `status`, `ariaLiveMessage` or equivalent props where appropriate to support this without hardcoding route-specific product decisions.

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-11 Obligation |
|---|---|
| RBAC | Guarded actions cannot execute denied actions. Route access does not grant action rights. |
| Payload visibility | Drawers/tables must support hidden/redacted states before rendering sensitive content. |
| Advice boundary | Advisor/analyst actions cannot visually imply release. |
| Evidence | Upload/evidence states must distinguish upload, review, sufficiency and linked evidence. |
| Audit | Audit-required actions must support blocked/unavailable states. |
| Export | Export preview/approval/download must be separate UI states. |
| Admin non-bypass | Admin actions can be denied/second-confirmed/audited; no superuser release illusion. |
| Client-safe visibility | Client-side components default to hidden/redacted/no-content when release proof missing. |

---

## 14. Positive Acceptance Criteria

- Modal opens with correct label, traps/manages focus sufficiently, closes via configured mechanisms and returns focus where practical.
- Drawer opens from a defined trigger, shows scoped/redacted/denied content state and closes predictably.
- Guarded action button refuses execution when denied, disabled or loading.
- CTA cluster supports exactly one primary CTA per state and separates secondary/destructive actions.
- Data table/list components render loading, empty, filtered-empty, error and permission-denied states.
- Status chip/state panel copy cannot imply gate completion without supplied actual state.
- Async state changes can be announced through existing a11y status helper.
- Route smoke passes after primitive changes.

---

## 15. Negative Acceptance Criteria

- Denied guarded action handler is not called.
- Disabled/loading guarded action handler is not called.
- Modal confirm cannot submit with missing validation/precondition.
- Modal/drawer close does not silently mark safety action successful.
- Drawer does not expose restricted evidence/client/internal payload in denied state.
- Status chip alone cannot mark `released`, `evidence sufficient`, `export approved` or `audit persisted` without real input state.
- Export approval/download confirmation cannot be represented by the same generic “done” state.
- A11y status messages do not reveal internal-only content in client context.

---

## 16. Required Tests and Test Names

Codex must first inspect existing test names and extend rather than duplicate where possible.

| Test File | Required Coverage |
|---|---|
| `tests/interaction-lifecycle.spec.ts` | Modal open/close/Escape/focus basics; drawer open/close; denied action does not execute. |
| `tests/confirmation-lifecycle.spec.ts` | Confirm/cancel/validation/loading/error/success paths for safety confirmation. |
| `tests/true-ux-a11y.spec.ts` | Labelled dialogs/drawers, focus behaviour, a11y status announcements. |
| `tests/true-ux-cta-state.spec.ts` | One primary CTA per route/state; disabled/denied/loading action behaviour. |
| `tests/route-smoke.spec.ts` | No route regression across registered routes after primitive changes. |
| Route-specific tests from WP-03–WP-10 | Evidence, analyst, advisor, compliance, client projection, audit, governance and export usage proof. |

Suggested new/updated test titles:

- `modal lifecycle preserves context and does not submit while invalid`
- `drawer lifecycle closes predictably and preserves safe state`
- `guarded action refuses denied and loading execution`
- `cta cluster exposes one primary action for each workflow state`
- `table renders empty error loading and permission states without fake actions`
- `a11y status announces async feedback without leaking internal content`

---

## 17. Validation Commands

Run after implementation, adjusted to current package scripts discovered in WP-00:

```bash
pnpm lint
pnpm test
pnpm playwright test tests/interaction-lifecycle.spec.ts
pnpm playwright test tests/confirmation-lifecycle.spec.ts
pnpm playwright test tests/true-ux-a11y.spec.ts
pnpm playwright test tests/true-ux-cta-state.spec.ts
pnpm playwright test tests/route-smoke.spec.ts
```

If scripts differ, Codex must document the current command mapping in the WP-00 moving-baseline output.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| No broad design-system rewrite | Improve existing primitives incrementally; do not rebuild the UI kit. |
| No visual generation | Do not create screens, images, state-screen assets or 064–071 visuals. |
| No route-scope expansion | Do not promote P1/HOLD/reference-only routes. |
| No schema replacement | Do not replace Prisma or create patch-only models here. |
| No fake interaction proof | Do not mark modal/drawer/table/chip as complete without lifecycle/test evidence. |
| No denied action execution | Denied/disabled/loading actions must not call handlers. |
| No silent safety completion | Cancel/close/error cannot complete release/export/evidence/admin actions. |
| No client-visible internal content | A11y messages, drawer content and state panels must not leak internal notes, AI Draft, compliance notes or raw evidence. |
| No API invention | Do not add new API routes from WP-11 alone. |
| No regressions | Shared primitive changes must not break route-smoke without fixing usages. |

---

## 19. Open Questions / Blockers

| Question / Blocker | Required Resolution |
|---|---|
| Current primitive APIs may already include some lifecycle features. | WP-00 must classify before implementation. Avoid duplicate props. |
| Full focus trap may require dependency or larger design-system change. | Prefer minimal accessible focus management. If dependency needed, create explicit decision request. |
| Some route usages may depend on deterministic visual states for demo. | Preserve only when explicitly required; do not treat as real interaction. |
| Table/filter behaviour may be broad. | Implement only state support and row-action safety unless V0.96 route requires deeper behaviour. |
| A11y tests may need selectors/roles aligned to current markup. | Update tests to user-facing roles/names, not implementation details. |

---

## 20. Codex Execution Notes

1. Start with read-only inventory of all primitives and usages.
2. Make the smallest compatible primitive API changes.
3. Update all V0.96 touched usages when prop contracts change.
4. Keep route-specific business logic out of generic primitives; pass state and permission truth in from route/service layers.
5. Prefer composition over hardcoded product copy inside generic components.
6. Tests must prove denied actions cannot execute and visual-only states do not imply gates.
7. Record any non-trivial compatibility decision in the release evidence/handoff output.

---

## 21. QA Matrix

| QA Check | Expected Result |
|---|---|
| Source hierarchy preserved | `full-workflow` only; `main` blocked. |
| KB evidence used | Modal/drawer/table/CTA/a11y problems mapped. |
| UI/UX/IA integrated | Lifecycle, CTA, table states, a11y and microcopy support included. |
| No implementation in artefact | This document only describes tasks. |
| No broad redesign | Only shared primitive hardening where V0.96 needs it. |
| No visual generation | Explicitly blocked. |
| Safety rules preserved | No AI Draft leak, admin bypass, upload-to-release, manual visibility override. |
| Positive acceptance included | Yes. |
| Negative acceptance included | Yes. |
| Tests specified | Yes. |
| Stop rules included | Yes. |
| ENGINE proof included | Yes. |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Role | ENGINE_v2 Role | Codex-Spark-like Convergence |
|---|---|---|---|
| KB/UI discovery | Identified modal/drawer/table/CTA/a11y problem families and contradictions: visual presence is not lifecycle proof. | Structured evidence into WP-specific task implications. | Reduced broad UX topic into shared primitive hardening scope. |
| Source control | Detected risk of stale artefacts versus current repo. | Locked `full-workflow` as implementation baseline and `main` as false-gap only. | Required WP-00 rebase before edits. |
| UX/IA integration | Mapped long-page/CTA/visual-only issues to primitive support layer. | Converted into task IDs, files, acceptance, tests and stop rules. | Avoided broad redesign and produced concrete implementation guidance. |
| Safety discipline | Preserved no-overclaim, no unapproved advice, no admin bypass and no upload-to-release rules. | Added negative acceptance and P0 tests. | Made denied-action and silent-success failures explicit blockers. |
| Final task decomposition | Validated that WP-11 is shared/cross-cutting rather than route-specific. | Produced a detailed Codex-ready task description. | Output is directly usable after WP-00 moving-baseline recheck. |
