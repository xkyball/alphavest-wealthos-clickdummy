# ALPHAVEST_V0_96_WP01_JOURNEY_FIRST_IA_APP_SHELL_SIDEBAR_TOPBAR_PAGE_HEADER_DEEP_TASK_DESCRIPTION.md

**Generated:** 2026-06-23  
**Mode:** Prompt 02 execution. Deep Codex-ready task description only.  
**Work Package:** `WP-01 — Journey-first IA / App Shell / Sidebar / Topbar / Page Header`  
**Release Target:** `V0.96 Core Journey Release + UX/IA Refactor`  
**Implementation status:** Not implemented here.  
**Screen/image generation:** Not authorized.  

---

## 1. Executive Task Decision

**Decision:** `WP01_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_JOURNEY_FIRST_IA_IMPLEMENTATION_AFTER_WP00_REBASE`

`WP-01` converts the AlphaVest shell from a route catalogue into a guided, role-aware operating system for the V0.96 core journey. The target user should not have to hunt through many registered routes. The shell, sidebar, topbar and page header must orient the actor around the current **workspace**, **tenant/role/object context**, **page job**, **current gate**, **blocker** and **one next step**.

This task is implementation-ready only after `WP-00` has confirmed the current repo reality and emitted the moving baseline / UX-IA delta register. The current local `full-workflow` snapshot already shows that several WP-01 building blocks exist: `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx`, `components/page-header.tsx`, `components/route-context-chip.tsx`, `components/product-guidance-panel.tsx`, `components/global-search-box.tsx`, `lib/navigation.ts`, `lib/ux-route-policy.ts`, `lib/ux-page-contract.ts` and `tests/navigation-shell.spec.ts`. These are **current snapshot evidence**, not permission to skip verification in the live repo.

**Codex result expected from this WP:**

```text
A journey-first, role-aware AlphaVest app shell where primary navigation, topbar context and page headers guide the V0.96 proof spine without promoting P1/HOLD/reference routes or exposing unauthorized payload.
```

**Core implementation decision:**

```text
Use existing navigation and UX policy modules first. Harden, reconcile and complete them. Do not create a parallel navigation system unless WP-00 proves the current one is unusable.
```

---

## 2. Source-of-Truth Lock

| Rank | Source / Artefact | Role in WP-01 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current live `full-workflow` repo checkout, if available | Highest implementation reality | Current files, route registry, navigation modules, tests | Assuming older KB or ZIP counts are current code truth |
| 2 | Current `alphavest-wealthos-clickdummy-full-workflow.zip` snapshot | Snapshot implementation evidence | Identify existing shell/nav/page-header modules and tests | Treating snapshot as newer than live repo without inspection |
| 3 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | Prompt 00 evidence register | UI/UX/IA problem families and WP-to-problem mapping | Treating UX evidence as implementation proof |
| 4 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary WP source | WP-01 goal, target files, acceptance criteria, stop rules | Skipping WP-00 rebase or inventing extra scope |
| 5 | `WP-00` output / moving baseline register | Mandatory predecessor | Current repo deltas and ALREADY/PARTIAL/MISSING classification | Implementing WP-01 before rebase is available |
| 6 | `MVP_SCOPE_LOCK.md`, `ROUTE_SCOPE_LOCK.md`, `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md`, `STATE_SCREEN_SPEC.md` | Scope/route/state controls | Route worksets, MVP/P1/HOLD/reference constraints | Reclassifying route scope or pulling HOLD routes into core nav |
| 7 | `DRAWER_MODAL_INTERACTION_CONTRACT.md`, `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Interaction and feedback controls | One primary CTA, no-overclaim state/copy, lifecycle guardrails | Treating route/context chips or buttons as gate proof |
| 8 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Client visibility and advice safety | Fail-closed route/action/payload boundaries | Letting nav labels/counts leak internal state to clients |
| 9 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence/audit/export safety | Upload-not-sufficiency, audit/export stage separation | Presenting export/release stages as complete before proof |
| 10 | `API_CONTRACT_MATRIX.md`, `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`, `P0_TEST_ACCEPTANCE_MATRIX.md` | API/schema/test contracts | Test obligations for nav/visibility/safety | Claiming tests pass without running/updating them |
| 11 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`, `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey logic | MJ-001, MJ-002, MJ-003, MJ-005, MJ-006, MJ-010 proof spine | Pulling P1/HOLD journeys into V0.96 primary navigation |
| 12 | `main` branch / old main ZIP | False-gap warning only | Contamination detection | Any target implementation task or absence claim |

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | WP-01 Task Implication |
|---|---|---|---|---|---|
| The application must stop feeling like a route catalogue and become a journey-first operating system. | Prompt 00 evidence register; V0.96 UX/IA task source | App shell, sidebar, topbar, page header | IA / navigation | High | Implement primary navigation by workspace/journey, not by all route IDs or screen catalogue sequence. |
| `HYBRID_JOURNEY_FIRST_IA` is the selected IA model: journey-first primary navigation, role-aware filtering, object context inside workspaces/details. | Prompt 00 evidence register; V0.96 source | WP-01 | IA / product framing | High | Sidebar must expose core V0.96 workspaces; details should rely on page-header/topbar/object chips, not more global nav clutter. |
| Page headers must state page job, current gate/status, blocker and next action. | State spec; Feedback contract; Prompt 00 register | `components/page-header.tsx`, all V0.96 routes | Page semantics | High | Harden `PageHeader` and page contracts so every V0.96 surface has job + gate + blocker + one primary next step. |
| Many surfaces have too many action candidates and weak primary-action hierarchy. | Prompt 00 evidence register; Feedback contract | Page header, product guidance, CTA clusters | CTA hierarchy | High | Ensure exactly one primary CTA per state; demote secondary actions and block unsafe actions with clear disabled reasons. |
| P1/HOLD/reference routes must not be promoted because route entries or visual refs exist. | Route Scope Lock; Screen Generation Brief | Sidebar/nav groups | Scope control | Critical | Keep P1/HOLD/reference workspaces de-emphasized, locked or registered-only; do not promote 064-071 or P1 routes into V0.96 primary path. |
| Client-facing surfaces must fail closed and not reveal internal workflow labels, counts or previews. | RBAC/Client Visibility contract | Client portal/mobile topbar/sidebar | Client visibility | Critical | Client role navigation must hide or neutralize internal workspaces and avoid internal count/queue leakage. |
| Advisor Approval and Compliance Release can be confused if IA/copy is weak. | Feedback contract; RBAC/advice-boundary contract | Advisor/compliance nav and headers | Gate semantics | Critical | Keep Advisor Review and Compliance Release visually and semantically separate; page headers must not imply release after advisor approval. |
| Upload success is not evidence sufficiency. | Evidence/Audit/Export contract | Evidence nav/header/guidance | No-overclaim | Critical | Evidence nav/page header copy must keep upload, review, sufficiency and release as separate stages. |
| Export preview, approval and download/share are distinct. | Evidence/Audit/Export contract | Export nav/header/guidance | Export semantics | Critical | Export workspace must represent scope → redaction → preview → approval → download/share without collapsing stages. |
| Audit display is not audit persistence. | Interaction audit; Evidence/Audit/Export contract | Audit nav/header/guidance | Audit proof | High | Audit links/page headers should indicate evidence/audit proof surfaces without claiming persistence unless source is verified. |
| Modal/drawer/table/filter/kanban primitives can be visual-only. | Interaction Reality Audit | Sidebar/open navigation, header CTAs, guidance panels | Interaction proof | High | Navigation shell interactions need lifecycle tests; do not infer behavioural proof from visual shell alone. |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must verify current repo reality before edits. The local ZIP snapshot suggests the following assets already exist, but the live repo is authoritative when available.

### 4.1 Existing files to verify first

| Area | Files / Modules to Inspect | Current Snapshot Signal | WP-01 Recheck Purpose |
|---|---|---|---|
| App shell | `components/app-shell.tsx` | Wraps app in `DemoSessionProvider`, renders `Sidebar`, `TopBar`, `ProductGuidanceContent` and main content | Confirm shell layout is reusable and no parallel shell is needed. |
| Sidebar | `components/sidebar.tsx` | Uses `navigationGroupsForRole(session.role)` and active state from pathname | Confirm role-aware grouping, locked group handling, mobile open/close lifecycle and aria landmarks. |
| Topbar | `components/top-bar.tsx` | Uses session role/tenant, route policy, route scope and `RouteContextChip` / search | Confirm topbar context does not leak client-sensitive internals and communicates role/tenant/object scope. |
| Page header | `components/page-header.tsx` | Supports `primaryAction`, `secondaryActions`, `blockedReason`, status, route policy and flow steps | Confirm every V0.96 route uses or can adopt this contract; avoid duplicate local header patterns. |
| Context chips | `components/route-context-chip.tsx` | Displays route product guidance short title | Confirm chips clarify context without becoming decorative clutter or leakage. |
| Guidance panel | `components/product-guidance-panel.tsx` | Provides primary/secondary next-step links and UX proof metadata | Confirm it supports one-primary-CTA policy without duplicating page header actions. |
| Global search | `components/global-search-box.tsx`, `app/api/global-search/route.ts` | Role/tenant-aware query parameters in snapshot | Confirm search respects role/tenant/object visibility and does not reveal internal labels to client roles. |
| Navigation model | `lib/navigation.ts` | Contains navigation definitions grouped by `UxWorkspaceKey`, role filtering and item tiers | Confirm journey workspaces align with V0.96 proof spine and locked scope. |
| UX route policy | `lib/ux-route-policy.ts` | Defines workspace labels/descriptions, density tiers, page types, flow steps | Confirm policies match route scope and page contracts. |
| Page contracts | `lib/ux-page-contract.ts` | Provides page job, density, page type, primary CTA rules and route policy labels | Confirm page-header semantics can be derived from contracts where possible. |
| Route registry | `lib/route-registry.ts` | Must be parsed from current repo | Confirm actual route IDs, paths, scope labels and workspaces. |
| Tests | `tests/navigation-shell.spec.ts`, `tests/true-ux-flow-navigation.spec.ts`, `tests/ui-clickflow-phase01-05.spec.ts` | Navigation tests exist in snapshot | Confirm assertions reflect desired V0.96 IA and update/add tests. |

### 4.2 Current snapshot details to preserve as hypotheses

| Observation | Meaning | Codex Treatment |
|---|---|---|
| `lib/navigation.ts` already has `NavigationGroup` and `NavigationItem` tiers. | WP-01 may be partially implemented. | Classify as `PARTIAL` or `ALREADY_PRESENT` after code/test verification. |
| `uxWorkspaceLabels` includes `setup`, `client_workspace`, `evidence`, `advisory_workbench`, `compliance`, `decisions`, `governance`, `export`, `elevated_workflows`, `communication`, `ops`, `registered_only`. | The desired workspace vocabulary likely already exists. | Reuse and harden; do not invent competing workspace terms. |
| `navigation-shell.spec.ts` asserts workflow sections replace route-catalogue groups. | Some IA test coverage exists. | Extend assertions for role-aware filtering, client-safe nav and P1/HOLD de-emphasis. |
| `PageHeader` has primary/secondary/recovery action concepts and route-policy context. | Page job/CTA infrastructure exists. | Enforce adoption on V0.96 routes instead of adding separate headers. |
| `ProductGuidanceContent` supplies next-step guidance and CTA metadata. | Existing guidance may already solve parts of WP-01. | Avoid duplication; decide whether page header or guidance owns the primary CTA per surface. |

---

## 5. WP Problem Statement

AlphaVest has 71+ registered routes and many surfaces. Without a journey-first shell, the app risks feeling like a catalogue of screens rather than a controlled Family Office workflow. This creates practical and safety problems:

- users cannot easily understand the next work context;
- internal workspaces may visually compete with client-safe surfaces;
- Advisor Approval, Compliance Release, Evidence Sufficiency and Export Approval can be conflated;
- P1/HOLD/reference routes may appear more mature than they are;
- buttons, chips or navigation counts can accidentally imply permission, payload visibility or gate completion;
- page headers may be decorative rather than operational;
- Codex may refactor each screen locally and fragment the IA further.

`WP-01` fixes the shell and header layer so all downstream V0.96 UI work has a shared navigation and page-job model.

---

## 6. V0.96 Journey Role

`WP-01` is the IA spine for the complete V0.96 core journey:

| Journey / Workstream | WP-01 Role |
|---|---|
| `MJ-001` first client-safe decision | Guides actor from setup/client context to evidence, advisory, compliance, decisions and client-safe projection. |
| `MJ-002` evidence to release | Makes Evidence workspace distinct from Compliance Release; prevents upload-sufficiency overclaim. |
| `MJ-003` AI draft rejected/rebuilt | Keeps AI/rules draft inside Advisory Workbench and labels it as internal. |
| `MJ-010` admin role change cannot bypass | Separates Governance/Admin from release authority and marks admin non-bypass semantics. |
| `MJ-006` cross-tenant denial with audit | Ensures topbar/session/context shows scoped tenant/role/object, not global omniscience. |
| `MJ-005` export/redaction | Presents Export as a staged, post-release trust output, not raw data download. |
| UX/IA refactor | Establishes shared page job, density and CTA expectations for all surface WPs. |

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | Required WP-01 Design Decision | Concrete Task Implication |
|---|---|---|
| Route catalogue navigation | Replace flat or legacy groups with role-aware V0.96 workspaces. | Use `lib/navigation.ts` + `lib/ux-route-policy.ts`; group nav by Setup, Client Workspace, Evidence, Advisory Workbench, Compliance, Decisions, Governance, Export; keep P1/HOLD/reference de-emphasized. |
| Weak page job | Page header must state what the page does. | Use or extend `PageHeader` / `ux-page-contract.ts` so V0.96 pages show page job and route policy labels. |
| Missing current gate | Header/topbar must make gate/state visible without overclaim. | Display gate/status/blocker only from route policy/state sources, not static fake claims. |
| CTA ambiguity | One primary CTA per state. | Ensure `PageHeader.primaryAction` or guidance primary next step is the single primary; secondary actions are demoted. |
| Internal/client leakage | Client nav and topbar must not reveal internal workspaces/counts/previews. | Role-aware filtering must hide or lock internal workspaces for client roles; global search must respect tenant/role visibility. |
| P1/HOLD over-promotion | P1/HOLD/reference routes must not be primary V0.96 path. | Use `registered_only`, locked/deferred group states and no primary CTA for held routes. |
| Decorative guidance clutter | Guidance must support action, not duplicate route catalogue. | Harmonize `ProductGuidanceContent`, `RouteContextChip` and `PageHeader` responsibilities. |
| Mobile navigation lifecycle | Mobile shell open/close must be reliable and accessible. | Verify overlay, close button, focus/aria, active route after navigation and no scroll trap. |
| Density inconsistency | Shell and page header must not add bulky chrome to workbench pages. | Preserve compact internal workspace density and calm client page presentation; coordinate with WP-02. |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### 8.1 Changes included in WP-01

- Reconcile `navigationDefinitions`, workspace labels, page IDs and route scope labels against current route registry.
- Harden journey-first navigation groups for V0.96 core workspaces.
- Apply role-aware visibility/locking in sidebar navigation using current session/role context.
- Ensure P1/HOLD/reference routes are visible only as de-emphasized, locked, deferred or registered-only context where appropriate.
- Normalize route labels and descriptions so workflow terms are not ambiguous.
- Harden topbar context: tenant, role, workspace, object/gate context and client-visibility sensitivity.
- Harden page headers: page job, status/gate, blocker, one primary next step, recovery action where relevant.
- Reconcile `ProductGuidanceContent` and `PageHeader` so primary CTA logic is not duplicated.
- Add/update navigation and page-header tests.

### 8.2 Changes not included in WP-01

- No screen/image generation.
- No broad visual redesign or new design direction.
- No route-scope reclassification.
- No P1/HOLD route elevation.
- No schema replacement.
- No new product modules beyond shell/header/navigation support.
- No detailed layout refactor of individual Evidence/Advisor/Compliance/Export pages; those belong to WP-03 through WP-10 and WP-02.
- No new authentication provider; current providerless/mapped-user logic belongs to foundation tasks and existing auth/session modules.
- No client-visible AI Draft or manual client-visibility override.

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| WP01-T01 | Verify current IA baseline after WP-00 | WP-01 must not overwrite already-good shell work. | `V0_96_UX_IA_DELTA_REGISTER.md`, `lib/navigation.ts`, `lib/ux-route-policy.ts`, `components/sidebar.tsx`, `tests/navigation-shell.spec.ts` | Read WP-00 output; classify shell/nav/page-header status as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`; list exact gaps before edits. | A short implementation note or commit summary identifies current nav state and changes needed. | Existing navigation tests still pass before modification or are updated with justified deltas. | Yes — controls whether refactor is minimal or larger. | Stop if WP-00 output is absent or route registry cannot be parsed. |
| WP01-T02 | Reconcile workspace model with V0.96 proof spine | Existing `UxWorkspaceKey` may already match desired workspaces. | `lib/ux-route-policy.ts`, `lib/navigation.ts`, `lib/route-registry.ts`, `ROUTE_SCOPE_LOCK.md` | Map route IDs to workspaces; ensure Evidence, Advisory Workbench, Compliance, Decisions, Governance and Export are primary V0.96 workspaces; keep Communication/Ops/P1 and Elevated/HOLD separate. | All V0.96 MVP/MVP_SUPPORT routes have exactly one workspace; P1/HOLD/reference routes are not primary. | Unit or Playwright assertion for visible groups. | Yes — IA grouping. | Do not invent new route scope or promote held routes. |
| WP01-T03 | Harden sidebar role-aware navigation | Navigation must reflect actor role and not leak internal payload. | `components/sidebar.tsx`, `lib/navigation.ts`, `lib/demo-session.ts`, `lib/ux-route-policy.ts` | Verify `navigationGroupsForRole`; add/adjust locked reasons; hide/de-emphasize groups for client roles; preserve necessary setup/support routes; add `aria-current`, region labels and tier metadata. | Client role does not see internal workflow/export/governance previews unless explicitly safe; internal roles see core workspaces. | `tests/navigation-shell.spec.ts`; add role-specific navigation tests. | Yes — navigation and role-aware IA. | Do not hide safety-critical internal routes for internal roles. |
| WP01-T04 | Normalize navigation labels and descriptions | Ambiguous labels cause gate confusion. | `lib/navigation.ts`, `lib/ux-route-policy.ts`, `lib/product-guidance.ts` if present | Rename labels/descriptions to distinguish Evidence Intake vs Evidence Sufficiency, Advisor Approval vs Compliance Release, Export Preview vs Export Approval, Client Workspace vs internal Decisions. | Nav labels are clear, short and gate-safe; no label claims release/approval/sufficiency before gate proof. | Snapshot/Playwright nav text assertions. | Yes — microcopy/IA. | Do not introduce marketing copy or new product claims. |
| WP01-T05 | Harden topbar context without leakage | Topbar should orient actor/tenant/workspace but not leak data. | `components/top-bar.tsx`, `components/route-context-chip.tsx`, `components/global-search-box.tsx`, `lib/ux-route-policy.ts`, `app/api/global-search/route.ts` | Verify role/tenant selectors; ensure route context uses safe labels; ensure client-sensitive routes use fail-closed wording; ensure search API respects role/tenant and no internal results for client roles. | Topbar always shows safe role/tenant/workspace context; clients do not see internal route counts/previews. | Add/update topbar/search visibility tests. | Yes — context/navigation and information scent. | Stop if global search returns unscoped payload. Route to WP-13 if API hardening is required. |
| WP01-T06 | Page header operational contract | Headers must communicate page job/gate/blocker/next step. | `components/page-header.tsx`, `lib/ux-page-contract.ts`, `components/product-guidance-panel.tsx`, all V0.96 screen components that render headers | Identify pages using local/custom headers; route them through `PageHeader` or compatible contract; ensure title/description/page job/status/blocker/primary action exist for V0.96 route surfaces. | Each V0.96 route page has a header with page job and at most one primary next step. | `tests/true-ux-flow-navigation.spec.ts`; add page-header assertions for representative pages. | Yes — page job and CTA hierarchy. | Do not rewrite all page content; individual layout refactors belong to later WPs. |
| WP01-T07 | Resolve PageHeader vs ProductGuidance primary CTA ownership | Duplicate primary CTAs create action ambiguity. | `components/page-header.tsx`, `components/product-guidance-panel.tsx`, `components/ux-cta-cluster.tsx` if present | Decide per page whether header or guidance owns primary CTA; if both render, ensure one is marked primary and the other secondary/contextual; add `data-ux-primary-cta` assertion. | No V0.96 page renders two competing primary CTAs in the same state. | True-UX CTA tests; Playwright locator `[data-ux-primary-cta='true']`. | Yes — CTA system. | Do not remove required recovery actions; demote instead. |
| WP01-T08 | P1/HOLD/reference de-emphasis and lock states | Registered routes remain but must not imply V0.96 maturity. | `lib/navigation.ts`, `lib/ux-route-policy.ts`, `lib/route-registry.ts`, `components/sidebar.tsx` | For P1/HOLD/reference routes, ensure locked/deferred description, no primary CTA, no core-nav priority; keep route smoke accessibility if registered. | Routes 064-067 and 069-071 are not presented as V0.96 primary work; route 068 remains P1; routes 061-063 remain reference-only. | Navigation tests for absence/de-emphasis of HOLD/P1 routes in core nav. | Yes — scope-safe IA. | Do not remove registered route support if route-smoke requires it. |
| WP01-T09 | Mobile nav accessibility and lifecycle | App shell must work on mobile without broken overlay. | `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx` | Verify menu button opens nav; close button works; navigating closes mobile nav; role groups are still accessible; aria labels/landmarks correct; no focus trap regression. | Mobile viewport can open/close/use nav and marks active route. | Add Playwright mobile viewport test if missing. | Yes — interaction lifecycle/a11y. | Do not introduce visual-only drawer without lifecycle proof. |
| WP01-T10 | Update tests and evidence | WP-01 must prove the IA change. | `tests/navigation-shell.spec.ts`, `tests/true-ux-flow-navigation.spec.ts`, `tests/ui-clickflow-phase01-05.spec.ts`, package scripts | Add/update assertions for journey groups, role-aware nav, page headers, one primary CTA, P1/HOLD de-emphasis and no client leakage. | Tests fail before fix where issue existed and pass after implementation. | Required validation commands below. | Yes — True-UX acceptance. | Do not mark WP complete without tests or a documented `not present in repo` rationale. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### 10.1 Route families affected

| Route Family | Representative Routes | WP-01 Treatment |
|---|---|---|
| Setup / onboarding | `001-018` | Support navigation and role/session context; not the main V0.96 proof path but necessary for mapped-user/tenant context. |
| Client Workspace | `019-026`, `031-032` | Client-safe / context workspace; client roles see only safe surfaces. |
| Evidence | `027-030`, `046-047` | Core V0.96 workspace; distinguish upload, review, sufficiency and evidence vault. |
| Advisory Workbench | `033-037` | Core internal workspace; distinguish analyst/internal AI draft from advisor approval. |
| Compliance | `038-042` | Core release workspace; separate compliance release/block/evidence request from advisor approval. |
| Decisions | `043-045` | Decision record and released/client-safe projection context. |
| Governance | `048-051` | Admin/governance without bypass semantics. |
| Export | `054-058` | Staged export/redaction/approval/download workflow. |
| P1 / deferred | `052`, `053`, `059`, `060`, `068` | De-emphasize/defer; no V0.96 primary CTA. |
| Reference-only | `061-063` | Keep internal reference only; not product workflow. |
| HOLD | `064-067`, `069-071` | Do not promote; locked/registered-only context if visible at all. |

### 10.2 Components / modules affected

| Category | Files / Modules |
|---|---|
| Shell | `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx` |
| Header / context | `components/page-header.tsx`, `components/route-context-chip.tsx`, `components/product-guidance-panel.tsx` |
| Search | `components/global-search-box.tsx`, `app/api/global-search/route.ts` |
| Navigation policy | `lib/navigation.ts`, `lib/ux-route-policy.ts`, `lib/ux-page-contract.ts`, `lib/route-registry.ts` |
| Session / role context | `components/demo-session-provider.tsx`, `lib/demo-session.ts`, dummy auth/session modules if used by shell |
| Tests | `tests/navigation-shell.spec.ts`, `tests/true-ux-flow-navigation.spec.ts`, `tests/ui-clickflow-phase01-05.spec.ts`, `tests/route-smoke.spec.ts` |

### 10.3 APIs / services / schema

WP-01 should not create new APIs or schema. It may require API hardening only if topbar/search currently leaks visibility. If so, route service/API work to WP-13 while still documenting the issue in WP-01.

| Area | Treatment |
|---|---|
| `app/api/global-search/route.ts` | Must enforce role/tenant visibility if used in topbar. Do not leak internal labels/results to client role. |
| Session / actor context | Use current mapped/providerless context. Do not create a new auth model here. |
| Schema | No Prisma change. If navigation needs persistent preferences, defer unless already present and approved by WP-00. |

---

## 11. Interaction Lifecycle Requirements

| Interaction | Required Behaviour | Proof Requirement |
|---|---|---|
| Desktop sidebar navigation | One primary navigation landmark; active route marked with `aria-current`; groups labeled as regions. | Playwright navigation-shell test. |
| Mobile navigation | Menu opens nav; close button closes; navigation closes or leaves no unusable overlay; keyboard and aria labels usable. | Mobile viewport Playwright test. |
| Role switch / tenant switch in topbar | Changes visible context only according to session/role rules; no unauthorized data preview. | Role-specific nav/search tests. |
| Global search | Loading/ready/error states; scoped by role/tenant; no internal results for client role. | API/UI test or route to WP-13 if not implementable here. |
| Page header CTA | Exactly one primary CTA per route state; disabled state has explicit reason; recovery action separate. | True-UX CTA assertion. |
| Route context chip | Clarifies workspace/object/gate; does not show internal client-sensitive payload. | Text/content visibility assertion for client role. |

---

## 12. State / Feedback / Microcopy Requirements

| Surface | Required State / Copy Rule |
|---|---|
| Sidebar group labels | Use workspace names: Setup, Client Workspace, Evidence, Advisory Workbench, Compliance, Decisions, Governance, Export. Avoid legacy broad categories that feel like route lists. |
| P1 / HOLD nav | Use `Deferred`, `Held`, `Registered only`, or locked description. No primary V0.96 CTA. |
| Evidence workspace | Copy separates `Evidence intake`, `Review`, `Sufficiency`, `Evidence vault`. Never imply upload is sufficient. |
| Advisor workspace | Copy says Advisor Approval / Advisor Review; must not imply client release. |
| Compliance workspace | Copy says Compliance Release / Block / Request Evidence; this is the release gate. |
| Client workspace | Copy says client-safe / released content only. No internal workflow terms for client role. |
| Export workspace | Copy separates Scope, Redaction, Preview, Approval, Download/Share. |
| Page header | Must include page job, current gate/status, blocker/disabled reason where relevant, and one next step. |
| Error / denied | Navigation or search denied states must fail closed without disclosing hidden targets. |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-01 Implication |
|---|---|
| RBAC | Navigation access does not equal action permission. Nav must not imply users can perform actions. |
| Payload visibility | Nav/search labels, counts and previews are payload surfaces. They must respect actor/tenant/object scope. |
| Client visibility | Client role must see only client-safe workspaces and released/safe context. Internal workflow labels must not leak. |
| Advice boundary | Advisory Workbench is internal; no nav/header copy should imply autonomous advice or client-visible draft. |
| Evidence | Evidence nav/header must separate upload from sufficiency and release. |
| Audit | Audit nav/header must not imply persistence unless source is proven by audit services/tests. |
| Export | Export nav/header must separate preview, approval and download/share; no raw-data-export framing. |
| Admin non-bypass | Governance/Admin nav must indicate governance and access management, not release power. |

---

## 14. Positive Acceptance Criteria

| ID | Acceptance Criterion |
|---|---|
| WP01-POS-001 | Primary navigation is grouped by journey/workspace, not by a flat catalogue of route IDs or legacy screen batches. |
| WP01-POS-002 | V0.96 core workspaces are visible to appropriate internal roles: Evidence, Advisory Workbench, Compliance, Decisions, Governance and Export. |
| WP01-POS-003 | Client role receives a client-safe navigation experience and does not see internal workflow previews/counts. |
| WP01-POS-004 | Every representative V0.96 route has a page header that communicates page job, status/gate and next step. |
| WP01-POS-005 | Each representative page renders at most one primary CTA in the current state. |
| WP01-POS-006 | Advisor and Compliance labels are visibly distinct; Advisor Approval is not described as Release. |
| WP01-POS-007 | Evidence labels distinguish upload/intake from review/sufficiency. |
| WP01-POS-008 | Export labels distinguish scope, redaction, preview, approval and download/share. |
| WP01-POS-009 | P1/HOLD/reference routes are not promoted to V0.96 primary navigation. |
| WP01-POS-010 | Mobile nav opens/closes and active route marking works in a mobile viewport. |

---

## 15. Negative Acceptance Criteria

| ID | Negative Criterion |
|---|---|
| WP01-NEG-001 | A client user must not see internal Advisory, Compliance, Governance or Export payload previews through sidebar, topbar, route context chip or search. |
| WP01-NEG-002 | A visible nav item must not grant or imply action permission. |
| WP01-NEG-003 | Advisor Approval copy must not say or imply released/client-visible. |
| WP01-NEG-004 | Upload/Evidence navigation must not claim evidence is sufficient after upload alone. |
| WP01-NEG-005 | Export preview must not be labeled as approval/download/share complete. |
| WP01-NEG-006 | P1/HOLD/reference routes must not appear as primary V0.96 next steps. |
| WP01-NEG-007 | Global search must not reveal hidden routes, client-invisible results or internal-only labels to unauthorized roles. |
| WP01-NEG-008 | Multiple competing primary CTAs must not appear on the same representative V0.96 page state. |
| WP01-NEG-009 | Removing or hiding nav groups must not make required safety routes inaccessible to authorized internal roles. |
| WP01-NEG-010 | The implementation must not create a parallel navigation model that conflicts with `lib/navigation.ts` and `lib/ux-route-policy.ts`. |

---

## 16. Required Tests and Test Names

Codex must inspect current tests and add/update only as needed.

| Test Name / File | Required Coverage |
|---|---|
| `tests/navigation-shell.spec.ts` | Primary nav landmark, workspace groups, active route, route-catalogue replacement, P1/HOLD/reference de-emphasis. |
| `tests/true-ux-flow-navigation.spec.ts` | User can follow V0.96 journey path: Evidence → Advisory → Advisor/Compliance → Decisions/Client Projection → Export. |
| `tests/ui-clickflow-phase01-05.spec.ts` | Clickflow proof for setup/evidence/advisory navigation surfaces where applicable. |
| `tests/ui-clickflow-phase06-10.spec.ts` if present | Clickflow proof for compliance/decision/export navigation surfaces. |
| `tests/navigation-role-visibility.spec.ts` or equivalent new test | Role-aware nav: internal vs client vs admin; no client leakage. |
| `tests/page-header-contract.spec.ts` or equivalent new test | Representative pages have page job, gate/status, blocker/next action and one primary CTA. |
| `tests/global-search-visibility.spec.ts` if search is touched | Search results scoped by role/tenant and do not leak internal results. |
| `tests/route-smoke.spec.ts` | Registered routes still render as expected after nav/header changes. |

---

## 17. Validation Commands

Codex must adapt commands to current `package.json`, but start with:

```bash
pnpm lint
pnpm test
pnpm playwright test tests/navigation-shell.spec.ts
pnpm playwright test tests/true-ux-flow-navigation.spec.ts
pnpm playwright test tests/ui-clickflow-phase01-05.spec.ts
pnpm playwright test tests/route-smoke.spec.ts
```

If files do not exist in the current repo, Codex must:

1. record that in the implementation evidence;
2. run the nearest equivalent tests;
3. create/update tests only if allowed by the WP scope;
4. never mark the WP complete without some navigation/header proof.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| `NO_WP00_NO_WP01` | Do not implement WP-01 until WP-00 moving-baseline output exists. |
| `NO_MAIN_TARGET` | Do not use `main` as target truth. |
| `NO_ROUTE_RECLASSIFICATION` | Do not change MVP/P1/HOLD/reference route scope. |
| `NO_HOLD_ELEVATION` | Do not promote routes `064-067` or `069-071` into primary nav. |
| `NO_P1_PROMOTION` | Do not promote P1 routes, including route `068`, to V0.96 primary flow. |
| `NO_CLIENT_LEAKAGE` | Do not show internal labels/counts/previews to client roles. |
| `NO_ACTION_PERMISSION_BY_NAV` | Do not treat route/nav visibility as action permission. |
| `NO_DOUBLE_PRIMARY_CTA` | Do not render multiple competing primary CTAs in one page state. |
| `NO_SCREEN_GENERATION` | Do not generate or replace screens/images/assets. |
| `NO_BROAD_REDESIGN` | Do not redesign the full shell visually beyond V0.96 IA needs. |
| `NO_PARALLEL_NAV_SYSTEM` | Do not create a second navigation policy model unless current one is proven unusable. |
| `NO_SCHEMA_REPLACEMENT` | No Prisma/schema changes in this WP. |
| `NO_FAKE_GATE_COPY` | Do not use copy that implies release, sufficiency, approval, audit persistence or export approval unless the gate is actually proven. |

---

## 19. Open Questions / Blockers

| Question / Blocker | Decision Handling |
|---|---|
| Does current live repo already satisfy WP-01? | Classify as `ALREADY_PRESENT` only if tests and role/client safety assertions pass. Otherwise `PARTIAL`. |
| Which current session roles are authoritative for navigation filtering? | Use existing `DemoRole`/providerless actor mapping; do not invent new auth provider. Route missing auth foundations to relevant foundation WP. |
| Should P1/HOLD routes appear at all? | Use existing route smoke/registry constraints; if visible, show as locked/deferred/registered-only, never primary. |
| Should topbar search be in scope? | Yes only if already part of shell and used for navigation. If API/service leakage is found, route deeper hardening to WP-13. |
| Page header not used by all screen components | Refactor representative V0.96 route surfaces into shared header pattern; deeper page layout restructuring belongs to downstream surface WPs. |
| Product guidance duplicates page header CTA | Harmonize ownership; prefer single primary CTA source per page state. |

---

## 20. Codex Execution Notes

1. Start by reading WP-00 output and current repo state.
2. Prefer reuse of existing `lib/navigation.ts`, `lib/ux-route-policy.ts`, `lib/ux-page-contract.ts`, `PageHeader`, `ProductGuidanceContent` and `RouteContextChip`.
3. Make minimal, targeted IA changes that directly support V0.96.
4. Treat `navigation-shell.spec.ts` as the first proof file, but do not overclaim if it only proves visual nav.
5. For any role/client visibility issue, write or update negative tests.
6. Record every P1/HOLD/reference route handling decision in the task evidence.
7. Keep implementation evidence concise: changed files, changed route/workspace mapping, tests run, remaining blockers.

---

## 21. QA Matrix

| QA Check | Required Result |
|---|---|
| WP-00 predecessor checked | PASS before implementation |
| `full-workflow` live repo or snapshot identified | PASS |
| Existing nav/page-header modules reused where viable | PASS |
| Journey-first groups visible | PASS |
| Route catalogue feel reduced | PASS |
| Page job/gate/next-step header semantics present | PASS for representative V0.96 routes |
| One primary CTA per representative state | PASS |
| Role-aware nav filtering / locking | PASS |
| Client role avoids internal leakage | PASS |
| P1/HOLD/reference not elevated | PASS |
| Advisor/compliance copy not conflated | PASS |
| Upload/sufficiency copy not conflated | PASS |
| Export stage copy not conflated | PASS |
| Mobile nav lifecycle tested | PASS |
| No screen generation | PASS |
| No schema replacement | PASS |
| No broad redesign | PASS |
| Tests updated and validation commands run | PASS or documented blocker |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Contribution | ENGINE_v2 Contribution | Codex-Spark-like Convergence |
|---|---|---|---|
| KB/UI Discovery | Extracted route-catalogue, page-job, CTA, client-leakage, P1/HOLD, no-overclaim and visual-only problem families. | Converted evidence into source-locked WP-01 task requirements. | Selected a clear implementation target: harden existing journey-first shell, do not build parallel IA. |
| Source Contradiction Control | Recognized that current snapshot already contains nav/UX modules, so WP-01 may be partial or already present. | Required WP-00 rebase before implementation and live repo verification. | Forced classify-first behaviour before edits. |
| IA Strategy | Applied hybrid journey-first IA with role-aware filtering and object context inside details. | Mapped workspaces, route families, files and tests into concrete tasks. | Reduced broad UX ambition to shell/sidebar/topbar/page-header changes only. |
| Safety Integration | Preserved client-safe visibility, no unapproved advice, upload-not-sufficiency, advisor-not-release and export stage separation. | Added positive/negative acceptance criteria and stop rules. | Made tests mandatory for client leakage, P1/HOLD promotion and CTA overclaim risks. |
| Operationalization | Identified impacted components/modules and user-visible surfaces. | Produced task table with files, steps, acceptance, tests, stop rules and validation commands. | Delivered a Codex-ready task description without implementation or visual generation. |
