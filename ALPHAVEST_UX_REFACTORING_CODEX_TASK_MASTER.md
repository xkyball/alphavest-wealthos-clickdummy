# ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


**Generated:** 2026-06-21  
**Mode:** UX Codex Task Master only. Keine Implementierung. Keine Codeänderung. Keine Codex-Ausführung. Kein finaler Implementation Handoff. Keine Screen-/State-Screen-/Image-Generation.  
**Target project:** AlphaVest WealthOS  
**Target branch:** `full-workflow`  
**Required predecessor:** `ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md`  
**Next required artefact:** `ALPHAVEST_UX_REFACTORING_IMPLEMENTATION_HANDOFF.md`

## 1. Executive Decision

| Decision Area | Decision |
|---|---|
| Task Master Status | `UX_CODEX_TASK_MASTER_READY_FOR_HANDOFF_DERIVATION` |
| Codex Execution Status | `NOT_AUTHORIZED_IN_THIS_ARTEFACT` |
| Route Policy Matrix Status | `ROUTE_POLICY_MATRIX_REQUIRED_AND_CREATED` |
| Scope Status | `ROUTE_SCOPE_LOCK_PRESERVED` |
| Generation Status | `NO_SCREEN_GENERATION_NO_STATE_SCREEN_GENERATION_NO_IMAGE_GENERATION` |
| Final Handoff Status | `REQUIRED_NEXT` |

This task master translates the UX Decision Brief and Route Policy Matrix into implementation-ready-after-final-handoff work packages. It is detailed enough to support the next artefact, `ALPHAVEST_UX_REFACTORING_IMPLEMENTATION_HANDOFF.md`, but it does not authorize Codex execution by itself.

## 2. Source-of-Truth Applied

| Rank | Source | Use in This Task Master | Limit |
|---:|---|---|---|
| 1 | `ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md` | Binding route/task eligibility and safety policy. | Created as companion artefact; no implementation. |
| 2 | `ALPHAVEST_UX_NAVIGATION_PAGE_DENSITY_CTA_DECISION_BRIEF.md` | UX decisions for navigation, page type, density and CTA flows. | Do not re-decide. |
| 3 | UX evidence videos / ZIP | Evidence of current UX friction and state coverage. | Does not override scope/safety. |
| 4 | `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` and `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md` | Priority journeys and first product proof path. | Do not convert all journeys to MVP. |
| 5 | Route/screen/state/interaction/safety/API/schema/P0 artefacts | Guardrails and acceptance obligations. | Presence is not proof; tests required. |
| 6 | `local repository checkout / pull of target branch full-workflow` | Target code reality, package scripts and target files. | No `main` target usage. |

## 3. Input Decision Summary

| Decision | Value | Implementation Meaning |
|---|---|---|
| Navigation model | `HYBRID_JOURNEY_FIRST_ROLE_AWARE_OBJECT_CONTEXT` | Sidebar/App Shell should guide by journey/workspace; topbar/header carry role/tenant/object context. |
| Density target | `CONTROLLED_PREMIUM_WORKBENCH_HYBRID` | D1 client/executive calm, D2 workbench productivity, D3 dense operations, D4 focused detail. |
| Page type model | Hub / Workbench / Detail / Drawer / Modal / Reference / P1 / Hold | Route policy controls allowed UX treatment. |
| CTA model | One primary CTA per state; blocked CTAs explain reason/recovery | No success overclaim; no safety boundary crossing. |
| Priority flows | MJ-001, MJ-002, MJ-003, MJ-010, MJ-006, MJ-005, optional MJ-012/MJ-011 | CTA and navigation tasks focus here first. |

## 4. Route Policy Matrix Dependency

Every task below must cite and obey `ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md`.

| Dependency | Required Behaviour |
|---|---|
| Route scope | Preserve MVP/MVP_SUPPORT/P1/Reference/Hold exactly. |
| Page type | Hubs orient; Workbenches process; Details decide; Drawers contextualize; Reference/P1/Hold stay protected. |
| Density tier | Use D1-D4 route/page type density rules. |
| CTA policy | One primary CTA per state, safe secondary actions, blocked reason and recovery. |
| Safety policy | Client-safe only where client-facing; AI Draft internal-only; no unapproved advice; no admin bypass; upload/export overclaim blocked. |
| Codex eligibility | Only tasks marked `IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF` may be executed later, and only through the final handoff. |

## 5. Task Creation Rules

| Rule ID | Rule |
|---|---|
| UX-TM-RULE-001 | Every task must cite a source decision and route policy. |
| UX-TM-RULE-002 | Every task must name target files/components or explicitly state why target files need final confirmation. |
| UX-TM-RULE-003 | Every task must list allowed and forbidden changes. |
| UX-TM-RULE-004 | Safety-critical tasks require P0 positive and negative tests. |
| UX-TM-RULE-005 | No task may change route scope or elevate P1/Hold/Reference routes. |
| UX-TM-RULE-006 | No task may generate screens, state-screens or images. |
| UX-TM-RULE-007 | No task may weaken RBAC, client visibility, advice boundary, evidence/audit/export safety. |
| UX-TM-RULE-008 | Final implementation order is delegated to the next handoff artefact only. |

## 6. Task Classification Vocabulary

| Label | Meaning |
|---|---|
| `IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF` | Task is sufficiently specified for later handoff execution. |
| `BLOCKED` | Task lacks required scope/safety/file proof. |
| `DEFERRED_P1` | Task belongs to P1 route/capability and not MVP. |
| `REFERENCE_ONLY_NO_TASK` | Route/page remains reference-only. |
| `HOLD_BLOCKED` | Route/domain remains hold-blocked. |
| `SAFETY_CRITICAL_TASK` | Task touches RBAC, visibility, advice, evidence, audit or export. |
| `P0_TEST_REQUIRED_TASK` | Task must add/update positive/negative P0 tests. |
| `NO_GENERATION_TASK` | Task must not generate/replace visuals. |
| `POLICY_ENFORCEMENT_TASK` | Task materializes/guards the route policy in code/tests/reporting. |

## 7. Workstream Overview

| Workstream | Task Count | Status | Guardrail |
| --- | --- | --- | --- |
| UX-NAV | 5 | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF | Must preserve Route Policy Matrix and P0 obligations. |
| UX-HUB | 4 | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF | Must preserve Route Policy Matrix and P0 obligations. |
| UX-PAGE | 4 | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF | Must preserve Route Policy Matrix and P0 obligations. |
| UX-COMPLEXITY | 5 | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF | Must preserve Route Policy Matrix and P0 obligations. |
| UX-DENSITY | 6 | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF | Must preserve Route Policy Matrix and P0 obligations. |
| UX-CTA | 7 | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF | Must preserve Route Policy Matrix and P0 obligations. |
| UX-INTERACTION | 7 | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF | Must preserve Route Policy Matrix and P0 obligations. |
| UX-SAFETY | 7 | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF | Must preserve Route Policy Matrix and P0 obligations. |
| UX-POLICY | 5 | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF | Must preserve Route Policy Matrix and P0 obligations. |

## 8. UX-NAV — App Shell / Sidebar / Topbar / Page Header Tasks

### UX-NAV-001 — Convert sidebar from route list into journey-first workspace navigation

| Field | Value |
| --- | --- |
| Task ID | UX-NAV-001 |
| Workstream | UX-NAV |
| Source Decision | Decision Brief §5 Navigation Model; Route Policy Matrix §§5,10 |
| Related Routes | All MVP/MVP_SUPPORT routes; exclude 052–071 from productive MVP main flow except guarded references. |
| Route Policy | NO_ROUTE_RECLASSIFICATION; UX_TASK_ELIGIBLE_WITH_SAFETY_TESTS; UX_SUPPORT_ONLY; UX_P1_DEFERRED; UX_REFERENCE_ONLY_NO_PRODUCT_TASK; UX_HOLD_BLOCKED_NO_TASK |
| Problem | Navigation exposes too many routes and does not clearly guide users through evidence, advisory, approval, compliance, decision and export work. |
| User Impact | Users must infer where to go next, which increases cognitive load and reinforces clickdummy behaviour. |
| Refactoring Intent | Group sidebar into stable workspaces: Setup, Client Workspace, Evidence, Advisory Workbench, Approvals, Compliance, Decisions, Governance, Export. Show pending counts/gate hints only when policy-safe. |
| Target Files | components/app-shell.tsx; components/sidebar.tsx; lib/route-registry.ts; route-demo context components if used. |
| Allowed Changes | Change labels, grouping, nav order, active-state behaviour and visibility of P1/reference/hold links; add route metadata if using existing registry pattern. |
| Forbidden Changes | No route creation, no route reclassification, no P1/Hold elevation, no client payload expansion. |
| Implementation Steps | 1. Read route registry and scope labels. 2. Create workspace group definition. 3. Assign routes to workspace groups without changing scope. 4. Hide/deprioritize P1/reference/hold from primary nav. 5. Add active group highlighting and pending-safe badges. 6. Add route-smoke proof for all registered routes. |
| Acceptance Criteria | Sidebar is workspace/journey-first; all 71 routes still resolve; P1/reference/hold routes are not promoted into productive MVP nav; active route maps to exactly one workspace group. |
| P0 / Safety Tests | Route visibility must not imply payload/action permission; add/extend route-smoke and permission checks if nav visibility changes by role. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; pnpm test:permissions |
| Proof Required | Before/after screenshots of sidebar groups; route-smoke output; no route count change proof. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-NAV-002 — Add role-aware but non-bypass navigation filtering

| Field | Value |
| --- | --- |
| Task ID | UX-NAV-002 |
| Workstream | UX-NAV |
| Source Decision | Decision Brief §§5–6; RBAC Client Visibility Advice Boundary Contract |
| Related Routes | 001–058 eligible sets; especially 007–018, 048–051, 019–020. |
| Route Policy | RBAC_PAYLOAD_CRITICAL; CLIENT_SAFE_ONLY; INTERNAL_ONLY; NO_ROUTE_RECLASSIFICATION |
| Problem | Role differences are visible but not clearly translated into navigation expectations; users may assume a visible route grants action authority. |
| User Impact | Admins, advisors, analysts and clients can misunderstand responsibility, control and boundaries. |
| Refactoring Intent | Make navigation role-aware as a view filter only. Each role sees relevant workspace entry points, while actions and payloads remain separately gated. |
| Target Files | components/sidebar.tsx; components/top-bar.tsx; components/demo-session-provider.tsx; lib/permission-engine.ts only for read-only integration; tests/permission-engine.spec.ts. |
| Allowed Changes | Use existing role/session context to filter nav groups; add disabled/locked nav hints; add explanatory labels. |
| Forbidden Changes | No admin bypass; no implicit release/export/visibility rights from nav filtering; no new auth model. |
| Implementation Steps | 1. Map roles to nav groups. 2. Keep hidden/disabled treatment explicit. 3. Keep client nav client-safe. 4. Add negative tests for route access not implying action/payload. |
| Acceptance Criteria | Role-specific nav reduces noise while route/action/payload rules remain unchanged; blocked nav explains why a workspace is unavailable. |
| P0 / Safety Tests | Permission-engine negative tests for route access != payload visibility; client cannot see internal nav/payload. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:permissions; pnpm test:route-smoke |
| Proof Required | Role-switch screenshots and negative test proof. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-NAV-003 — Standardize topbar tenant/role/object context

| Field | Value |
| --- | --- |
| Task ID | UX-NAV-003 |
| Workstream | UX-NAV |
| Source Decision | Decision Brief §§5–7; Route Policy Matrix §5 |
| Related Routes | All MVP/MVP_SUPPORT workspaces; strongest on 019–020, 027–030, 033–047, 054–058. |
| Route Policy | RBAC_PAYLOAD_CRITICAL; CLIENT_SAFE_ONLY; INTERNAL_ONLY |
| Problem | Tenant, role and object context are not consistently prominent enough for high-trust Family Office workflows. |
| User Impact | Users may act in the wrong tenant/object context or misunderstand visibility boundaries. |
| Refactoring Intent | Topbar shows active tenant, active role, actor type, environment, and optional current object crumb. It stays contextual and never becomes a menu replacement. |
| Target Files | components/top-bar.tsx; components/demo-session-panel.tsx; components/demo-session-provider.tsx; lib/route-registry.ts |
| Allowed Changes | Add context chips/selectors, safe role indicator, tenant/object crumb, and environment label. |
| Forbidden Changes | No manual client visibility override; no role switch that changes permissions without policy; no payload display in topbar. |
| Implementation Steps | 1. Identify existing session context. 2. Render tenant/role/object labels. 3. Add fail-closed copy for unknown context. 4. Keep sensitive data out of topbar. 5. Add screenshot/route-smoke proof. |
| Acceptance Criteria | Every major workspace displays tenant and role context; unknown/unmapped context is explicit and fails closed. |
| P0 / Safety Tests | Negative: unknown actor/wrong tenant cannot reveal payload via topbar. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:permissions; pnpm test:route-smoke |
| Proof Required | Screenshots for admin, analyst, advisor, compliance, client roles. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-NAV-004 — Upgrade Page Header into page-job, status and next-step control surface

| Field | Value |
| --- | --- |
| Task ID | UX-NAV-004 |
| Workstream | UX-NAV |
| Source Decision | Decision Brief §§5,8,13; Feedback/Validation/Error Contract |
| Related Routes | All MVP routes and flow-relevant MVP_SUPPORT routes. |
| Route Policy | One primary CTA; STATUS_CHIP_NOT_GATE_PROOF; VISUAL_NOT_BEHAVIOUR_PROOF |
| Problem | Page headers are not consistently doing the job of explaining where the user is, what matters and what comes next. |
| User Impact | Users scan many panels/cards before understanding the primary page purpose. |
| Refactoring Intent | Standardize Page Header with page job, current state/gate, primary CTA, secondary actions and object/journey breadcrumb. |
| Target Files | components/page-header.tsx; page screen components; components/ui/status-chip.tsx; components/ui/workflow-badge.tsx |
| Allowed Changes | Add props/metadata for page job, state, next step, disabled reason and secondary actions; refactor route components to use standard header. |
| Forbidden Changes | No success overclaim; no gate proof from status chip alone; no P1/Hold promotion in header CTAs. |
| Implementation Steps | 1. Extend header contract. 2. Map route page jobs from Route Policy Matrix. 3. Implement primary/secondary CTA slot rules. 4. Add blocked reason field. 5. Apply to priority route groups. |
| Acceptance Criteria | MVP routes show page job/status/primary CTA above the fold; blocked actions show reason and recovery; no more than one primary CTA per state. |
| P0 / Safety Tests | P0 feedback tests for upload/release/export/advice wording where touched. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; targeted workflow/upload/export tests |
| Proof Required | Screenshots for representative Hub, Workbench, Detail, Client, Export pages. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-NAV-005 — Add journey breadcrumbs and in-flow navigation rails

| Field | Value |
| --- | --- |
| Task ID | UX-NAV-005 |
| Workstream | UX-NAV |
| Source Decision | Decision Brief §§5,12,13 |
| Related Routes | 027–030, 033–045, 054–058, plus setup 013–018. |
| Route Policy | NO_ROUTE_RECLASSIFICATION; ADVICE_BOUNDARY_CRITICAL; UPLOAD_ONLY_NOT_SUFFICIENCY; EXPORT_PREVIEW_NOT_APPROVAL |
| Problem | Users lack a visible step path through multi-route flows. |
| User Impact | Users lose orientation across upload/review/approval/compliance/export gates. |
| Refactoring Intent | Add in-flow rails for Evidence Lifecycle, Advisory Review, Compliance Release and Export Package lifecycle. |
| Target Files | components/page-header.tsx; components/ui/wizard-stepper.tsx; relevant screen components; lib/route-registry.ts |
| Allowed Changes | Use existing routes as steps; show current, completed, blocked and next states; link only to allowed routes. |
| Forbidden Changes | No automatic gate advancement; no treating visual stepper as workflow proof. |
| Implementation Steps | 1. Define flow step configs. 2. Render per route when route belongs to a priority flow. 3. Disable future/blocked steps with reason. 4. Add tests/screenshot proof. |
| Acceptance Criteria | Priority flows show start/current/next/gate status; blocked steps explain prerequisites; stepper does not imply completed gates without data/state proof. |
| P0 / Safety Tests | Advisor approval != release; upload != sufficiency; export preview != approval negative tests if step states are connected. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:workflow-gate; pnpm test:workflow-api |
| Proof Required | Flow screenshots for evidence, advisory, compliance and export. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |


## 9. UX-HUB — Bereichs-Hub Tasks

### UX-HUB-001 — Create MVP journey hub model for Client / Evidence / Advisory / Compliance / Governance / Export

| Field | Value |
| --- | --- |
| Task ID | UX-HUB-001 |
| Workstream | UX-HUB |
| Source Decision | Decision Brief §§8–9; Route Policy Matrix §§6,10 |
| Related Routes | 013,015,019,020,024,031,034,043,054 |
| Route Policy | Hub orient/prioritize only; no final gate actions on hubs |
| Problem | Some pages mix overview, detail and action, making the user work too hard to identify the next priority. |
| User Impact | Users waste time scanning large pages and may click into wrong routes. |
| Refactoring Intent | Define hub pattern: status strip + prioritized work cards + next work queue + safe navigation into workbench/detail. |
| Target Files | components/admin-tenant-setup-screen.tsx; components/client-intake-screen.tsx; components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; components/communication-export-ops-screen.tsx; components/ui/card.tsx; components/ui/metric-card.tsx |
| Allowed Changes | Rearrange hub content, reduce deep details, add next-work summary and route links. |
| Forbidden Changes | No final release/export/approval CTAs on hubs; no reference/P1/Hold route promotion. |
| Implementation Steps | 1. Identify hub routes. 2. Apply hub layout pattern. 3. Move detail/deep tables to detail/workbench/drawer. 4. Add one primary next-work CTA. 5. Preserve route scope. |
| Acceptance Criteria | Hub routes orient in under one viewport; no hub contains complete workflow; primary CTA points to next eligible work surface. |
| P0 / Safety Tests | Client-facing hub 019/020 fails closed; governance/export hubs cannot bypass gates. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; pnpm test:permissions |
| Proof Required | Screenshots of representative hubs and route policy conformance notes. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-HUB-002 — Build client-facing hub treatment for portal/mobile without internal leakage

| Field | Value |
| --- | --- |
| Task ID | UX-HUB-002 |
| Workstream | UX-HUB |
| Source Decision | Decision Brief §10 D1; RBAC/Visibility contract |
| Related Routes | 019 /portal; 020 /mobile |
| Route Policy | CLIENT_SAFE_ONLY; UX_TASK_ELIGIBLE_WITH_SAFETY_TESTS |
| Problem | Client-facing surfaces need calm executive clarity but must not leak internal workflow details. |
| User Impact | Clients need trust and orientation, not internal operational noise. |
| Refactoring Intent | Use D1 Calm Executive layout: released/hidden state, next safe action, evidence/request summary, no internal rationale. |
| Target Files | components/client-intake-screen.tsx; components/page-header.tsx; components/ui/state-panel.tsx; lib/visibility-engine.ts (read-only integration if needed); tests/permission-engine.spec.ts |
| Allowed Changes | Refactor layout and feedback copy; add fail-closed empty/hidden state. |
| Forbidden Changes | No AI Draft, internal notes, compliance notes, unreleased evidence, manual visibility override. |
| Implementation Steps | 1. Identify client-safe fields. 2. Render released/hidden state. 3. Use D1 cards and next action. 4. Add negative leakage test if payload rendering changes. |
| Acceptance Criteria | Client sees only released/redacted/client-safe information; hidden state is clear and helpful; no internal-only labels/content appear. |
| P0 / Safety Tests | No leakage; client visibility fail-closed; wrong-role route access denied/hidden. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:permissions; pnpm test:route-smoke |
| Proof Required | Client role screenshots and negative test output. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-HUB-003 — Refactor Advisory Workbench hub around next review priority

| Field | Value |
| --- | --- |
| Task ID | UX-HUB-003 |
| Workstream | UX-HUB |
| Source Decision | Decision Brief route 034 Hub; CTA flow UX-FLOW-003 |
| Related Routes | 033,034,035,036,037 |
| Route Policy | ADVICE_BOUNDARY_CRITICAL; AI_DRAFT_INTERNAL_ONLY; UX_TASK_ELIGIBLE_WITH_SAFETY_TESTS |
| Problem | Advisory routes risk feeling like static boards rather than guided work. |
| User Impact | Analysts/advisors may not understand which signal/draft needs review first. |
| Refactoring Intent | Use route 034 as Advisory Hub: triaged queue, next review card, evidence-gap indicators and safe handoff to detail/advisor routes. |
| Target Files | components/internal-workflow-screen.tsx; components/page-header.tsx; components/ui/data-table.tsx; components/ui/state-panel.tsx |
| Allowed Changes | Reorder sections, add queue prioritization UI, surface next-step CTA. |
| Forbidden Changes | No client-visible draft; no advisor approval as release; no fake gate completion. |
| Implementation Steps | 1. Make 034 hub orient. 2. Keep 033 as signal queue/workbench and 035 as detail. 3. Add safe next-review CTA. 4. Add disabled/recovery copy for missing evidence. |
| Acceptance Criteria | Advisory hub shows next review and evidence/advice-boundary status; draft/internal fields remain internal-only. |
| P0 / Safety Tests | AI Draft internal-only and no-unapproved-advice negative tests where rendering changes. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:workflow-gate; pnpm test:workflow-api |
| Proof Required | Analyst/advisor flow screenshots and no-client-release proof. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-HUB-004 — Refactor Decision and Export entry hubs into safe handoff points

| Field | Value |
| --- | --- |
| Task ID | UX-HUB-004 |
| Workstream | UX-HUB |
| Source Decision | Decision Brief routes 043 and 054; Export safety contract |
| Related Routes | 043–045,054–058 |
| Route Policy | CLIENT_SAFE_ONLY; EXPORT_PREVIEW_NOT_APPROVAL; ADVICE_BOUNDARY_CRITICAL |
| Problem | Decision/export pages can blur list, detail, preview and approval responsibilities. |
| User Impact | Users may misunderstand export preview as export approval or decision submission as client acceptance. |
| Refactoring Intent | Use Decision List and Create Export as safe handoff hubs; push approval/release/download to detail/gated pages. |
| Target Files | components/decisions-governance-screen.tsx; components/communication-export-ops-screen.tsx; components/page-header.tsx |
| Allowed Changes | Add lifecycle summary, next actions and safe route links. |
| Forbidden Changes | No export approval/download/share on hub; no release/client acceptance overclaim. |
| Implementation Steps | 1. Separate hub vs detail concerns. 2. Add lifecycle rail. 3. Add disabled CTA explanations. 4. Keep export stages distinct. |
| Acceptance Criteria | Decision/export hubs orient and route; final actions remain on detail/confirmation pages; lifecycle wording is safe. |
| P0 / Safety Tests | Export preview != approval/download; compliance release != client acceptance. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:file-export; pnpm test:workflow-gate |
| Proof Required | Decision/export screenshots and file-export test output. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |


## 10. UX-PAGE — Page-Type Refactoring Tasks

### UX-PAGE-001 — Apply page-type contract to all MVP and MVP_SUPPORT routes

| Field | Value |
| --- | --- |
| Task ID | UX-PAGE-001 |
| Workstream | UX-PAGE |
| Source Decision | Decision Brief §8–9; Route Policy Matrix §10 |
| Related Routes | 001–058 except P1/reference/hold; all MVP/MVP_SUPPORT routes |
| Route Policy | UX_TASK_ELIGIBLE_WITH_SAFETY_TESTS; UX_SUPPORT_ONLY; no reclassification |
| Problem | Many pages currently behave like mixed route canvases instead of distinct hub/workbench/detail/drawer patterns. |
| User Impact | Users cannot tell whether a page is for orientation, processing, deciding or reference. |
| Refactoring Intent | Use route page-type metadata to standardize structure and content responsibility per route. |
| Target Files | lib/route-registry.ts; components/page-header.tsx; all route screen components listed in target map |
| Allowed Changes | Add non-behavioural UX metadata; reorganize visible content to match page type. |
| Forbidden Changes | No scope changes; no new routes; no generation; no P1/Hold/Reference elevation. |
| Implementation Steps | 1. Add page-type metadata where appropriate. 2. Audit each MVP/MVP_SUPPORT screen. 3. Apply page-type layout containers. 4. Add no-product treatment for reference/P1/Hold. |
| Acceptance Criteria | Every eligible route has clear page type and job; P1/reference/hold remain guarded/deferred/reference. |
| P0 / Safety Tests | Route-smoke for all 71 routes; no scope elevation regression. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke |
| Proof Required | Route matrix reconciliation and representative screenshots. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-PAGE-002 — Split workbench pages into queue / selected context / action rail

| Field | Value |
| --- | --- |
| Task ID | UX-PAGE-002 |
| Workstream | UX-PAGE |
| Source Decision | Decision Brief §8 Workbench; Density D2/D3 |
| Related Routes | 027–030,033,036,038,046,048–051,054–056 |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; P0 where safety-critical |
| Problem | Work pages risk being overloaded with cards, metrics and static panels rather than a task flow. |
| User Impact | Analysts, advisors, compliance and governance users lose prioritization and next action. |
| Refactoring Intent | Use a consistent split: work queue/table, selected context panel/drawer, action rail with one primary CTA and blocked reason. |
| Target Files | components/client-intake-screen.tsx; components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; components/communication-export-ops-screen.tsx; components/ui/data-table.tsx; components/ui/filter-bar.tsx; components/ui/drawer.tsx |
| Allowed Changes | Rearrange content, consolidate cards, introduce selected-item context, add filters/row actions where already in scope. |
| Forbidden Changes | No fake row mutations; no untested drag/drop; no gate proof from status chips. |
| Implementation Steps | 1. Identify workbench route rows. 2. Create common workbench layout helper/pattern if practical. 3. Move secondary detail to drawer/tabs. 4. Connect row selection/CTA states as static/demo or real as code supports. |
| Acceptance Criteria | Workbench pages present queue + context + action rail above fold; repeated non-action cards reduced; CTA state is clear. |
| P0 / Safety Tests | For compliance/evidence/export/governance workbenches, add negative tests when actions/payload visibility change. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:file-export |
| Proof Required | Workbench screenshots and P0 test summary for touched safety routes. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-PAGE-003 — Standardize detail pages with object header, evidence/timeline and gated action rail

| Field | Value |
| --- | --- |
| Task ID | UX-PAGE-003 |
| Workstream | UX-PAGE |
| Source Decision | Decision Brief §8 Detailseite; Route Policy Matrix §6 |
| Related Routes | 026,035,037,039,044,047,057,058 |
| Route Policy | D4 Focused Detail; RBAC_PAYLOAD_CRITICAL; ADVICE_BOUNDARY_CRITICAL where relevant |
| Problem | Detail pages may mix global context, object details and actions without clear decision support. |
| User Impact | Users struggle to decide because key facts, evidence, audit and next action are not consistently grouped. |
| Refactoring Intent | Detail pages use object header, key facts, evidence/audit sections, related objects and gated action rail. |
| Target Files | components/client-intake-screen.tsx; components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; components/communication-export-ops-screen.tsx; components/ui/evidence-list.tsx; components/ui/audit-timeline.tsx |
| Allowed Changes | Reorganize object detail sections, add action rail, add progressive sections/tabs. |
| Forbidden Changes | No global queue overload; no hidden gate prerequisites; no payload expansion. |
| Implementation Steps | 1. Map each detail route to object type. 2. Add object header and key facts. 3. Move secondary material to tabs/drawers. 4. Add gated action rail. |
| Acceptance Criteria | Detail pages show decision basis and safe action state above fold; evidence/audit visibility follows policy. |
| P0 / Safety Tests | No unapproved advice; evidence/audit/export negative tests where touched. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:workflow-gate; pnpm test:file-export; pnpm test:permissions |
| Proof Required | Detail screenshots for trigger, advisor approval, compliance, decision, evidence and export detail. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-PAGE-004 — Keep P1, Reference and Hold routes out of productive MVP page-type work

| Field | Value |
| --- | --- |
| Task ID | UX-PAGE-004 |
| Workstream | UX-PAGE |
| Source Decision | Route Policy Matrix §11; Screen Generation Brief no-generation decision |
| Related Routes | 052,053,059,060,061,062,063,064,065,066,067,068,069,070,071 |
| Route Policy | UX_P1_DEFERRED; UX_REFERENCE_ONLY_NO_PRODUCT_TASK; UX_HOLD_BLOCKED_NO_TASK |
| Problem | Deferred/reference/hold routes can visually appear as product surfaces and confuse navigation. |
| User Impact | Users may follow dead ends or believe future/held capabilities are MVP-ready. |
| Refactoring Intent | Render deferred/reference/hold treatment as clearly non-productive, outside primary flow, with no MVP CTA. |
| Target Files | components/communication-export-ops-screen.tsx; components/kyc-aml-workflow-screen.tsx; components/suitability-ips-screen.tsx; components/review-monitoring-screen.tsx; components/committee-review-screen.tsx; components/sidebar.tsx; lib/route-registry.ts |
| Allowed Changes | Add guard labels, deferred notes, reference-only nav grouping and blocked state; preserve route render. |
| Forbidden Changes | No implementation of held/P1 features; no screen generation; no route deletion unless explicitly authorized later. |
| Implementation Steps | 1. Identify protected routes. 2. Exclude from MVP primary nav. 3. Add clear guard/deferred/reference copy. 4. Route-smoke all 71 routes. |
| Acceptance Criteria | Protected routes remain accessible only as intended guard/reference/deferred surfaces; no primary MVP CTA appears on them. |
| P0 / Safety Tests | Route smoke and no-elevation assertions if route registry/nav tests exist. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke |
| Proof Required | Screenshots of one P1, one Reference, one Hold route and nav exclusion proof. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |


## 11. UX-COMPLEXITY — Page Complexity Reduction Tasks

### UX-COMPLEXITY-001 — Reduce card-wall overload into summary + priority queue + action rail

| Field | Value |
| --- | --- |
| Task ID | UX-COMPLEXITY-001 |
| Workstream | UX-COMPLEXITY |
| Source Decision | Decision Brief §§4,8,10,14; Route Policy Matrix §§6–8 |
| Related Routes | MVP hubs/workbenches; especially 032,033,039,042,056 |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; no safety weakening |
| Problem | Cards/metrics/chips compete without hierarchy. |
| User Impact | Users cannot distinguish signal from decoration. |
| Refactoring Intent | Consolidate repeated cards/badges/metrics into summary strips and move detail into drawers/tabs. |
| Target Files | Relevant screen components; components/ui/card.tsx; components/ui/metric-card.tsx; components/ui/badge.tsx; components/ui/drawer.tsx; components/ui/state-panel.tsx |
| Allowed Changes | Reorder, consolidate, collapse, tab or move content to drawers; improve hierarchy and spacing. |
| Forbidden Changes | Do not hide required gates, safety caveats, evidence needs or audit state; no new screen generation. |
| Implementation Steps | 1. Identify page content by priority. 2. Remove/merge duplicates. 3. Move secondary content to drawer/tab. 4. Keep first-screen job/status/next-step visible. 5. Validate with screenshot and route-smoke proof. |
| Acceptance Criteria | Page is scannable; primary job and CTA clear above fold; no required gate/safety information hidden. |
| P0 / Safety Tests | Where safety pages are touched, run relevant workflow/permission/export/upload tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; targeted P0 tests for touched routes |
| Proof Required | Before/after screenshots and content-priority notes. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-COMPLEXITY-002 — Move secondary/tertiary detail into drawers/tabs without hiding safety gates

| Field | Value |
| --- | --- |
| Task ID | UX-COMPLEXITY-002 |
| Workstream | UX-COMPLEXITY |
| Source Decision | Decision Brief §§4,8,10,14; Route Policy Matrix §§6–8 |
| Related Routes | 031,046,048,050,051 plus detail-heavy routes |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; no safety weakening |
| Problem | Secondary detail consumes primary work space. |
| User Impact | Users lose primary action context. |
| Refactoring Intent | Use drawers for secondary detail and tabs for deep object information; keep gate prerequisites visible. |
| Target Files | Relevant screen components; components/ui/card.tsx; components/ui/metric-card.tsx; components/ui/badge.tsx; components/ui/drawer.tsx; components/ui/state-panel.tsx |
| Allowed Changes | Reorder, consolidate, collapse, tab or move content to drawers; improve hierarchy and spacing. |
| Forbidden Changes | Do not hide required gates, safety caveats, evidence needs or audit state; no new screen generation. |
| Implementation Steps | 1. Identify page content by priority. 2. Remove/merge duplicates. 3. Move secondary content to drawer/tab. 4. Keep first-screen job/status/next-step visible. 5. Validate with screenshot and route-smoke proof. |
| Acceptance Criteria | Page is scannable; primary job and CTA clear above fold; no required gate/safety information hidden. |
| P0 / Safety Tests | Where safety pages are touched, run relevant workflow/permission/export/upload tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; targeted P0 tests for touched routes |
| Proof Required | Before/after screenshots and content-priority notes. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-COMPLEXITY-003 — Create Must-see / Secondary / Tertiary content hierarchy per page type

| Field | Value |
| --- | --- |
| Task ID | UX-COMPLEXITY-003 |
| Workstream | UX-COMPLEXITY |
| Source Decision | Decision Brief §§4,8,10,14; Route Policy Matrix §§6–8 |
| Related Routes | All MVP/MVP_SUPPORT route groups |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; no safety weakening |
| Problem | Pages combine all content at same visual priority. |
| User Impact | High cognitive load and slow scanning. |
| Refactoring Intent | Define visible first-screen content vs expandable content. |
| Target Files | Relevant screen components; components/ui/card.tsx; components/ui/metric-card.tsx; components/ui/badge.tsx; components/ui/drawer.tsx; components/ui/state-panel.tsx |
| Allowed Changes | Reorder, consolidate, collapse, tab or move content to drawers; improve hierarchy and spacing. |
| Forbidden Changes | Do not hide required gates, safety caveats, evidence needs or audit state; no new screen generation. |
| Implementation Steps | 1. Identify page content by priority. 2. Remove/merge duplicates. 3. Move secondary content to drawer/tab. 4. Keep first-screen job/status/next-step visible. 5. Validate with screenshot and route-smoke proof. |
| Acceptance Criteria | Page is scannable; primary job and CTA clear above fold; no required gate/safety information hidden. |
| P0 / Safety Tests | Where safety pages are touched, run relevant workflow/permission/export/upload tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; targeted P0 tests for touched routes |
| Proof Required | Before/after screenshots and content-priority notes. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-COMPLEXITY-004 — Remove dead-end and duplicate CTA clusters

| Field | Value |
| --- | --- |
| Task ID | UX-COMPLEXITY-004 |
| Workstream | UX-COMPLEXITY |
| Source Decision | Decision Brief §§4,8,10,14; Route Policy Matrix §§6–8 |
| Related Routes | Priority flow routes MJ-001/MJ-002/MJ-003/MJ-005/MJ-006/MJ-010 |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; no safety weakening |
| Problem | Multiple buttons imply parallel paths where gates require sequence. |
| User Impact | Users make wrong or unsafe choices. |
| Refactoring Intent | Replace competing CTAs with one primary, secondary contextual actions and disabled reason. |
| Target Files | Relevant screen components; components/ui/card.tsx; components/ui/metric-card.tsx; components/ui/badge.tsx; components/ui/drawer.tsx; components/ui/state-panel.tsx |
| Allowed Changes | Reorder, consolidate, collapse, tab or move content to drawers; improve hierarchy and spacing. |
| Forbidden Changes | Do not hide required gates, safety caveats, evidence needs or audit state; no new screen generation. |
| Implementation Steps | 1. Identify page content by priority. 2. Remove/merge duplicates. 3. Move secondary content to drawer/tab. 4. Keep first-screen job/status/next-step visible. 5. Validate with screenshot and route-smoke proof. |
| Acceptance Criteria | Page is scannable; primary job and CTA clear above fold; no required gate/safety information hidden. |
| P0 / Safety Tests | Where safety pages are touched, run relevant workflow/permission/export/upload tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; targeted P0 tests for touched routes |
| Proof Required | Before/after screenshots and content-priority notes. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-COMPLEXITY-005 — Densify sparse support/context pages without making them noisy

| Field | Value |
| --- | --- |
| Task ID | UX-COMPLEXITY-005 |
| Workstream | UX-COMPLEXITY |
| Source Decision | Decision Brief §§4,8,10,14; Route Policy Matrix §§6–8 |
| Related Routes | 001–018,021–026,031–032 |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; no safety weakening |
| Problem | Some pages use space without enough job clarity. |
| User Impact | Premium look feels empty or clickdummy-like. |
| Refactoring Intent | Add page job, status and meaningful next-step content while staying D1/D2 appropriate. |
| Target Files | Relevant screen components; components/ui/card.tsx; components/ui/metric-card.tsx; components/ui/badge.tsx; components/ui/drawer.tsx; components/ui/state-panel.tsx |
| Allowed Changes | Reorder, consolidate, collapse, tab or move content to drawers; improve hierarchy and spacing. |
| Forbidden Changes | Do not hide required gates, safety caveats, evidence needs or audit state; no new screen generation. |
| Implementation Steps | 1. Identify page content by priority. 2. Remove/merge duplicates. 3. Move secondary content to drawer/tab. 4. Keep first-screen job/status/next-step visible. 5. Validate with screenshot and route-smoke proof. |
| Acceptance Criteria | Page is scannable; primary job and CTA clear above fold; no required gate/safety information hidden. |
| P0 / Safety Tests | Where safety pages are touched, run relevant workflow/permission/export/upload tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; targeted P0 tests for touched routes |
| Proof Required | Before/after screenshots and content-priority notes. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |


## 12. UX-DENSITY — Density / Layout System Tasks

### UX-DENSITY-001 — Introduce density tier mapping D1–D4 into layout patterns

| Field | Value |
| --- | --- |
| Task ID | UX-DENSITY-001 |
| Workstream | UX-DENSITY |
| Source Decision | Decision Brief §10–11; Route Policy Matrix §7 |
| Related Routes | All eligible routes |
| Route Policy | CONTROLLED_PREMIUM_WORKBENCH_HYBRID; NO_SCREEN_GENERATION |
| Problem | Density differs by page inconsistently; some views are overfull while others waste space. |
| User Impact | Users experience either clutter or empty premium dead zones. |
| Refactoring Intent | Centralize density tier usage without creating visual assets. |
| Target Files | components/ui/card.tsx; components/ui/data-table.tsx; components/ui/drawer.tsx; components/page-header.tsx; relevant screen components; app/globals.css if token/layout changes are needed |
| Allowed Changes | Adjust spacing, grid, grouping, table density, card count and section hierarchy. |
| Forbidden Changes | No design-only work that hides safety/status/gates; no visual generation; no inaccessible density. |
| Implementation Steps | 1. Map density tier to routes. 2. Add reusable layout classes/components if needed. 3. Apply tier-specific rules. 4. Validate readability and above-fold content. |
| Acceptance Criteria | Density follows D1–D4 rules; first viewport includes page job/status/primary next step; no card walls or empty dead zones. |
| P0 / Safety Tests | Visual density must not hide client visibility/advice/evidence/audit/export caveats. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; visual contract if applicable: pnpm visual:contract |
| Proof Required | Screenshot set across D1, D2, D3, D4 representatives. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-DENSITY-002 — Apply D1 Calm Executive to client-facing views

| Field | Value |
| --- | --- |
| Task ID | UX-DENSITY-002 |
| Workstream | UX-DENSITY |
| Source Decision | Client visibility policy; Route Policy Matrix §7 |
| Related Routes | 019,020 |
| Route Policy | CONTROLLED_PREMIUM_WORKBENCH_HYBRID; NO_SCREEN_GENERATION |
| Problem | Density differs by page inconsistently; some views are overfull while others waste space. |
| User Impact | Users experience either clutter or empty premium dead zones. |
| Refactoring Intent | Calm, premium, client-safe released/hidden view. |
| Target Files | components/ui/card.tsx; components/ui/data-table.tsx; components/ui/drawer.tsx; components/page-header.tsx; relevant screen components; app/globals.css if token/layout changes are needed |
| Allowed Changes | Adjust spacing, grid, grouping, table density, card count and section hierarchy. |
| Forbidden Changes | No design-only work that hides safety/status/gates; no visual generation; no inaccessible density. |
| Implementation Steps | 1. Map density tier to routes. 2. Add reusable layout classes/components if needed. 3. Apply tier-specific rules. 4. Validate readability and above-fold content. |
| Acceptance Criteria | Density follows D1–D4 rules; first viewport includes page job/status/primary next step; no card walls or empty dead zones. |
| P0 / Safety Tests | Visual density must not hide client visibility/advice/evidence/audit/export caveats. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; visual contract if applicable: pnpm visual:contract |
| Proof Required | Screenshot set across D1, D2, D3, D4 representatives. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-DENSITY-003 — Apply D2 Productive Workbench to analyst/advisor/compliance work routes

| Field | Value |
| --- | --- |
| Task ID | UX-DENSITY-003 |
| Workstream | UX-DENSITY |
| Source Decision | Workbench policy; Route Policy Matrix §7 |
| Related Routes | 027–030,033–040,046–047 |
| Route Policy | CONTROLLED_PREMIUM_WORKBENCH_HYBRID; NO_SCREEN_GENERATION |
| Problem | Density differs by page inconsistently; some views are overfull while others waste space. |
| User Impact | Users experience either clutter or empty premium dead zones. |
| Refactoring Intent | Queue + context + action rail. |
| Target Files | components/ui/card.tsx; components/ui/data-table.tsx; components/ui/drawer.tsx; components/page-header.tsx; relevant screen components; app/globals.css if token/layout changes are needed |
| Allowed Changes | Adjust spacing, grid, grouping, table density, card count and section hierarchy. |
| Forbidden Changes | No design-only work that hides safety/status/gates; no visual generation; no inaccessible density. |
| Implementation Steps | 1. Map density tier to routes. 2. Add reusable layout classes/components if needed. 3. Apply tier-specific rules. 4. Validate readability and above-fold content. |
| Acceptance Criteria | Density follows D1–D4 rules; first viewport includes page job/status/primary next step; no card walls or empty dead zones. |
| P0 / Safety Tests | Visual density must not hide client visibility/advice/evidence/audit/export caveats. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; visual contract if applicable: pnpm visual:contract |
| Proof Required | Screenshot set across D1, D2, D3, D4 representatives. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-DENSITY-004 — Apply D3 Dense Operations to governance/export/audit tables

| Field | Value |
| --- | --- |
| Task ID | UX-DENSITY-004 |
| Workstream | UX-DENSITY |
| Source Decision | Operations policy; Route Policy Matrix §7 |
| Related Routes | 048–051,054–056,042 |
| Route Policy | CONTROLLED_PREMIUM_WORKBENCH_HYBRID; NO_SCREEN_GENERATION |
| Problem | Density differs by page inconsistently; some views are overfull while others waste space. |
| User Impact | Users experience either clutter or empty premium dead zones. |
| Refactoring Intent | Data-first with filter/sort/row action, not card walls. |
| Target Files | components/ui/card.tsx; components/ui/data-table.tsx; components/ui/drawer.tsx; components/page-header.tsx; relevant screen components; app/globals.css if token/layout changes are needed |
| Allowed Changes | Adjust spacing, grid, grouping, table density, card count and section hierarchy. |
| Forbidden Changes | No design-only work that hides safety/status/gates; no visual generation; no inaccessible density. |
| Implementation Steps | 1. Map density tier to routes. 2. Add reusable layout classes/components if needed. 3. Apply tier-specific rules. 4. Validate readability and above-fold content. |
| Acceptance Criteria | Density follows D1–D4 rules; first viewport includes page job/status/primary next step; no card walls or empty dead zones. |
| P0 / Safety Tests | Visual density must not hide client visibility/advice/evidence/audit/export caveats. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; visual contract if applicable: pnpm visual:contract |
| Proof Required | Screenshot set across D1, D2, D3, D4 representatives. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-DENSITY-005 — Apply D4 Focused Detail to object decision routes

| Field | Value |
| --- | --- |
| Task ID | UX-DENSITY-005 |
| Workstream | UX-DENSITY |
| Source Decision | Detail policy; Route Policy Matrix §7 |
| Related Routes | 035,037,039,044,047,057,058 |
| Route Policy | CONTROLLED_PREMIUM_WORKBENCH_HYBRID; NO_SCREEN_GENERATION |
| Problem | Density differs by page inconsistently; some views are overfull while others waste space. |
| User Impact | Users experience either clutter or empty premium dead zones. |
| Refactoring Intent | Object header + key facts + evidence/audit + action rail. |
| Target Files | components/ui/card.tsx; components/ui/data-table.tsx; components/ui/drawer.tsx; components/page-header.tsx; relevant screen components; app/globals.css if token/layout changes are needed |
| Allowed Changes | Adjust spacing, grid, grouping, table density, card count and section hierarchy. |
| Forbidden Changes | No design-only work that hides safety/status/gates; no visual generation; no inaccessible density. |
| Implementation Steps | 1. Map density tier to routes. 2. Add reusable layout classes/components if needed. 3. Apply tier-specific rules. 4. Validate readability and above-fold content. |
| Acceptance Criteria | Density follows D1–D4 rules; first viewport includes page job/status/primary next step; no card walls or empty dead zones. |
| P0 / Safety Tests | Visual density must not hide client visibility/advice/evidence/audit/export caveats. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; visual contract if applicable: pnpm visual:contract |
| Proof Required | Screenshot set across D1, D2, D3, D4 representatives. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-DENSITY-006 — Enforce above-the-fold status/page-job/next-step rule

| Field | Value |
| --- | --- |
| Task ID | UX-DENSITY-006 |
| Workstream | UX-DENSITY |
| Source Decision | Decision Brief density rules; Route Policy Matrix §7 |
| Related Routes | All MVP and flow-relevant support routes |
| Route Policy | CONTROLLED_PREMIUM_WORKBENCH_HYBRID; NO_SCREEN_GENERATION |
| Problem | Density differs by page inconsistently; some views are overfull while others waste space. |
| User Impact | Users experience either clutter or empty premium dead zones. |
| Refactoring Intent | Every eligible route shows why this page exists and what next. |
| Target Files | components/ui/card.tsx; components/ui/data-table.tsx; components/ui/drawer.tsx; components/page-header.tsx; relevant screen components; app/globals.css if token/layout changes are needed |
| Allowed Changes | Adjust spacing, grid, grouping, table density, card count and section hierarchy. |
| Forbidden Changes | No design-only work that hides safety/status/gates; no visual generation; no inaccessible density. |
| Implementation Steps | 1. Map density tier to routes. 2. Add reusable layout classes/components if needed. 3. Apply tier-specific rules. 4. Validate readability and above-fold content. |
| Acceptance Criteria | Density follows D1–D4 rules; first viewport includes page job/status/primary next step; no card walls or empty dead zones. |
| P0 / Safety Tests | Visual density must not hide client visibility/advice/evidence/audit/export caveats. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; visual contract if applicable: pnpm visual:contract |
| Proof Required | Screenshot set across D1, D2, D3, D4 representatives. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |


## 13. UX-CTA — CTA / Next-Step Guidance Tasks

### UX-CTA-001 — Implement one-primary-CTA page-state pattern

| Field | Value |
| --- | --- |
| Task ID | UX-CTA-001 |
| Workstream | UX-CTA |
| Source Decision | Decision Brief §13; Global CTA policy; Feedback/Validation/Error Contract |
| Related Routes | All MVP/MVP_SUPPORT eligible routes |
| Route Policy | One primary CTA; forbidden success overclaim; safety caveats per route |
| Problem | Primary/secondary/blocked CTAs are not consistently tied to workflow state and safety gates. |
| User Impact | Users can misread what an action does or why it is unavailable. |
| Refactoring Intent | Define state-specific CTA slots and copy: primary next step, secondary context, blocked reason and recovery. |
| Target Files | components/page-header.tsx; relevant screen components; components/ui/modal.tsx; components/ui/state-panel.tsx; lib/workflow-gate.ts for read-only gate mapping if needed |
| Allowed Changes | Change CTA labels, placement, disabled state, helper copy and next-route links. |
| Forbidden Changes | No action may imply downstream gate completion; no release/upload/export overclaims; no bypass. |
| Implementation Steps | 1. Map CTA state from route policy and flow. 2. Replace competing CTAs. 3. Add disabled reason/recovery. 4. Link to correct next route. 5. Add tests for safety wording where relevant. |
| Acceptance Criteria | Each state has exactly one primary CTA; blocked actions explain why and next recovery; success feedback names only completed action. |
| P0 / Safety Tests | Upload not sufficiency; advisor approval not release; compliance release not client acceptance; export preview not approval/download; admin non-bypass. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:permissions |
| Proof Required | CTA screenshots for six priority flows and negative test outputs. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-CTA-002 — Implement MJ-001 setup-to-release CTA chain

| Field | Value |
| --- | --- |
| Task ID | UX-CTA-002 |
| Workstream | UX-CTA |
| Source Decision | Decision Brief §13; MJ-001 flow; Feedback/Validation/Error Contract |
| Related Routes | 001/013/014 → 015/018/027–030/033–045 → 019/020/045 |
| Route Policy | One primary CTA; forbidden success overclaim; safety caveats per route |
| Problem | Primary/secondary/blocked CTAs are not consistently tied to workflow state and safety gates. |
| User Impact | Users can misread what an action does or why it is unavailable. |
| Refactoring Intent | Define state-specific CTA slots and copy: primary next step, secondary context, blocked reason and recovery. |
| Target Files | components/page-header.tsx; relevant screen components; components/ui/modal.tsx; components/ui/state-panel.tsx; lib/workflow-gate.ts for read-only gate mapping if needed |
| Allowed Changes | Change CTA labels, placement, disabled state, helper copy and next-route links. |
| Forbidden Changes | No action may imply downstream gate completion; no release/upload/export overclaims; no bypass. |
| Implementation Steps | 1. Map CTA state from route policy and flow. 2. Replace competing CTAs. 3. Add disabled reason/recovery. 4. Link to correct next route. 5. Add tests for safety wording where relevant. |
| Acceptance Criteria | Each state has exactly one primary CTA; blocked actions explain why and next recovery; success feedback names only completed action. |
| P0 / Safety Tests | Upload not sufficiency; advisor approval not release; compliance release not client acceptance; export preview not approval/download; admin non-bypass. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:permissions |
| Proof Required | CTA screenshots for six priority flows and negative test outputs. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-CTA-003 — Implement evidence upload/review CTA chain without sufficiency overclaim

| Field | Value |
| --- | --- |
| Task ID | UX-CTA-003 |
| Workstream | UX-CTA |
| Source Decision | Decision Brief §13; MJ-002 flow; Feedback/Validation/Error Contract |
| Related Routes | 027–030,038–041,047 |
| Route Policy | One primary CTA; forbidden success overclaim; safety caveats per route |
| Problem | Primary/secondary/blocked CTAs are not consistently tied to workflow state and safety gates. |
| User Impact | Users can misread what an action does or why it is unavailable. |
| Refactoring Intent | Define state-specific CTA slots and copy: primary next step, secondary context, blocked reason and recovery. |
| Target Files | components/page-header.tsx; relevant screen components; components/ui/modal.tsx; components/ui/state-panel.tsx; lib/workflow-gate.ts for read-only gate mapping if needed |
| Allowed Changes | Change CTA labels, placement, disabled state, helper copy and next-route links. |
| Forbidden Changes | No action may imply downstream gate completion; no release/upload/export overclaims; no bypass. |
| Implementation Steps | 1. Map CTA state from route policy and flow. 2. Replace competing CTAs. 3. Add disabled reason/recovery. 4. Link to correct next route. 5. Add tests for safety wording where relevant. |
| Acceptance Criteria | Each state has exactly one primary CTA; blocked actions explain why and next recovery; success feedback names only completed action. |
| P0 / Safety Tests | Upload not sufficiency; advisor approval not release; compliance release not client acceptance; export preview not approval/download; admin non-bypass. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:permissions |
| Proof Required | CTA screenshots for six priority flows and negative test outputs. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-CTA-004 — Implement AI draft rejection/rebuild CTA chain as internal-only

| Field | Value |
| --- | --- |
| Task ID | UX-CTA-004 |
| Workstream | UX-CTA |
| Source Decision | Decision Brief §13; MJ-003 flow; Feedback/Validation/Error Contract |
| Related Routes | 033–037,027–030 |
| Route Policy | One primary CTA; forbidden success overclaim; safety caveats per route |
| Problem | Primary/secondary/blocked CTAs are not consistently tied to workflow state and safety gates. |
| User Impact | Users can misread what an action does or why it is unavailable. |
| Refactoring Intent | Define state-specific CTA slots and copy: primary next step, secondary context, blocked reason and recovery. |
| Target Files | components/page-header.tsx; relevant screen components; components/ui/modal.tsx; components/ui/state-panel.tsx; lib/workflow-gate.ts for read-only gate mapping if needed |
| Allowed Changes | Change CTA labels, placement, disabled state, helper copy and next-route links. |
| Forbidden Changes | No action may imply downstream gate completion; no release/upload/export overclaims; no bypass. |
| Implementation Steps | 1. Map CTA state from route policy and flow. 2. Replace competing CTAs. 3. Add disabled reason/recovery. 4. Link to correct next route. 5. Add tests for safety wording where relevant. |
| Acceptance Criteria | Each state has exactly one primary CTA; blocked actions explain why and next recovery; success feedback names only completed action. |
| P0 / Safety Tests | Upload not sufficiency; advisor approval not release; compliance release not client acceptance; export preview not approval/download; admin non-bypass. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:permissions |
| Proof Required | CTA screenshots for six priority flows and negative test outputs. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-CTA-005 — Implement governance/admin non-bypass CTA behaviour

| Field | Value |
| --- | --- |
| Task ID | UX-CTA-005 |
| Workstream | UX-CTA |
| Source Decision | Decision Brief §13; MJ-010 and MJ-006 flows; Feedback/Validation/Error Contract |
| Related Routes | 009,048–051,038–040 |
| Route Policy | One primary CTA; forbidden success overclaim; safety caveats per route |
| Problem | Primary/secondary/blocked CTAs are not consistently tied to workflow state and safety gates. |
| User Impact | Users can misread what an action does or why it is unavailable. |
| Refactoring Intent | Define state-specific CTA slots and copy: primary next step, secondary context, blocked reason and recovery. |
| Target Files | components/page-header.tsx; relevant screen components; components/ui/modal.tsx; components/ui/state-panel.tsx; lib/workflow-gate.ts for read-only gate mapping if needed |
| Allowed Changes | Change CTA labels, placement, disabled state, helper copy and next-route links. |
| Forbidden Changes | No action may imply downstream gate completion; no release/upload/export overclaims; no bypass. |
| Implementation Steps | 1. Map CTA state from route policy and flow. 2. Replace competing CTAs. 3. Add disabled reason/recovery. 4. Link to correct next route. 5. Add tests for safety wording where relevant. |
| Acceptance Criteria | Each state has exactly one primary CTA; blocked actions explain why and next recovery; success feedback names only completed action. |
| P0 / Safety Tests | Upload not sufficiency; advisor approval not release; compliance release not client acceptance; export preview not approval/download; admin non-bypass. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:permissions |
| Proof Required | CTA screenshots for six priority flows and negative test outputs. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-CTA-006 — Implement export lifecycle CTA separation

| Field | Value |
| --- | --- |
| Task ID | UX-CTA-006 |
| Workstream | UX-CTA |
| Source Decision | Decision Brief §13; MJ-005 flow; Feedback/Validation/Error Contract |
| Related Routes | 054–058 |
| Route Policy | One primary CTA; forbidden success overclaim; safety caveats per route |
| Problem | Primary/secondary/blocked CTAs are not consistently tied to workflow state and safety gates. |
| User Impact | Users can misread what an action does or why it is unavailable. |
| Refactoring Intent | Define state-specific CTA slots and copy: primary next step, secondary context, blocked reason and recovery. |
| Target Files | components/page-header.tsx; relevant screen components; components/ui/modal.tsx; components/ui/state-panel.tsx; lib/workflow-gate.ts for read-only gate mapping if needed |
| Allowed Changes | Change CTA labels, placement, disabled state, helper copy and next-route links. |
| Forbidden Changes | No action may imply downstream gate completion; no release/upload/export overclaims; no bypass. |
| Implementation Steps | 1. Map CTA state from route policy and flow. 2. Replace competing CTAs. 3. Add disabled reason/recovery. 4. Link to correct next route. 5. Add tests for safety wording where relevant. |
| Acceptance Criteria | Each state has exactly one primary CTA; blocked actions explain why and next recovery; success feedback names only completed action. |
| P0 / Safety Tests | Upload not sufficiency; advisor approval not release; compliance release not client acceptance; export preview not approval/download; admin non-bypass. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:permissions |
| Proof Required | CTA screenshots for six priority flows and negative test outputs. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-CTA-007 — Standardize disabled/blocked/recovery CTA copy

| Field | Value |
| --- | --- |
| Task ID | UX-CTA-007 |
| Workstream | UX-CTA |
| Source Decision | Decision Brief §13; Feedback contract; Feedback/Validation/Error Contract |
| Related Routes | All safety-critical routes |
| Route Policy | One primary CTA; forbidden success overclaim; safety caveats per route |
| Problem | Primary/secondary/blocked CTAs are not consistently tied to workflow state and safety gates. |
| User Impact | Users can misread what an action does or why it is unavailable. |
| Refactoring Intent | Define state-specific CTA slots and copy: primary next step, secondary context, blocked reason and recovery. |
| Target Files | components/page-header.tsx; relevant screen components; components/ui/modal.tsx; components/ui/state-panel.tsx; lib/workflow-gate.ts for read-only gate mapping if needed |
| Allowed Changes | Change CTA labels, placement, disabled state, helper copy and next-route links. |
| Forbidden Changes | No action may imply downstream gate completion; no release/upload/export overclaims; no bypass. |
| Implementation Steps | 1. Map CTA state from route policy and flow. 2. Replace competing CTAs. 3. Add disabled reason/recovery. 4. Link to correct next route. 5. Add tests for safety wording where relevant. |
| Acceptance Criteria | Each state has exactly one primary CTA; blocked actions explain why and next recovery; success feedback names only completed action. |
| P0 / Safety Tests | Upload not sufficiency; advisor approval not release; compliance release not client acceptance; export preview not approval/download; admin non-bypass. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:permissions |
| Proof Required | CTA screenshots for six priority flows and negative test outputs. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |


## 14. UX-INTERACTION — Interaction / State / Feedback Tasks

### UX-INTERACTION-001 — Implement table/search/filter/sort/row-action semantics only where scoped

| Field | Value |
| --- | --- |
| Task ID | UX-INTERACTION-001 |
| Workstream | UX-INTERACTION |
| Source Decision | DataTable/FilterBar reality audit; Decision Brief §§8,13; Drawer/Modal + Feedback Contracts |
| Related Routes | 027–030,033,036,038,046,048–051,054–056 |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; safety-specific labels |
| Problem | Several UI elements look interactive but are partial/demo/static or lack lifecycle clarity. |
| User Impact | Users see buttons, tables, drawers, modals or steppers without reliable expectations for what happens next. |
| Refactoring Intent | Bind visible interactions to explicit trigger, loading, validation, success, error, blocked and recovery states, or clearly keep them static/reference/deferred. |
| Target Files | components/ui/data-table.tsx; components/ui/filter-bar.tsx; components/ui/drawer.tsx; components/ui/modal.tsx; components/ui/wizard-stepper.tsx; components/ui/state-panel.tsx; relevant screen components; tests/* |
| Allowed Changes | Add handlers, state props, callback contracts, focus/escape behaviour, validation display and safe feedback where task scope permits. |
| Forbidden Changes | No fake persistence; no untested safety mutation; no drag/drop or workflow mutation without contract/test coverage. |
| Implementation Steps | 1. Identify current reality: implemented/partial/static. 2. Add lifecycle only when scoped. 3. Add state/feedback hooks. 4. Add tests or mark as static/deferred. |
| Acceptance Criteria | Interactive-looking elements either perform scoped lifecycle with feedback or are clearly non-actionable/static; no fake interactivity remains in MVP flows. |
| P0 / Safety Tests | Safety-critical interactions need denial/leakage/bypass/fail-closed tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:playwright; targeted specs: upload, permissions, workflow, export |
| Proof Required | Interaction screenshots, keyboard/focus notes, test results. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-INTERACTION-002 — Harden drawer and modal lifecycle

| Field | Value |
| --- | --- |
| Task ID | UX-INTERACTION-002 |
| Workstream | UX-INTERACTION |
| Source Decision | Drawer/Modal Contract; Decision Brief §§8,13; Drawer/Modal + Feedback Contracts |
| Related Routes | 005,007,009,010,018,031,040,041,044,046,048–051,057 |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; safety-specific labels |
| Problem | Several UI elements look interactive but are partial/demo/static or lack lifecycle clarity. |
| User Impact | Users see buttons, tables, drawers, modals or steppers without reliable expectations for what happens next. |
| Refactoring Intent | Bind visible interactions to explicit trigger, loading, validation, success, error, blocked and recovery states, or clearly keep them static/reference/deferred. |
| Target Files | components/ui/data-table.tsx; components/ui/filter-bar.tsx; components/ui/drawer.tsx; components/ui/modal.tsx; components/ui/wizard-stepper.tsx; components/ui/state-panel.tsx; relevant screen components; tests/* |
| Allowed Changes | Add handlers, state props, callback contracts, focus/escape behaviour, validation display and safe feedback where task scope permits. |
| Forbidden Changes | No fake persistence; no untested safety mutation; no drag/drop or workflow mutation without contract/test coverage. |
| Implementation Steps | 1. Identify current reality: implemented/partial/static. 2. Add lifecycle only when scoped. 3. Add state/feedback hooks. 4. Add tests or mark as static/deferred. |
| Acceptance Criteria | Interactive-looking elements either perform scoped lifecycle with feedback or are clearly non-actionable/static; no fake interactivity remains in MVP flows. |
| P0 / Safety Tests | Safety-critical interactions need denial/leakage/bypass/fail-closed tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:playwright; targeted specs: upload, permissions, workflow, export |
| Proof Required | Interaction screenshots, keyboard/focus notes, test results. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-INTERACTION-003 — Convert wizard/stepper visuals into explicit progression where route is in support scope

| Field | Value |
| --- | --- |
| Task ID | UX-INTERACTION-003 |
| Workstream | UX-INTERACTION |
| Source Decision | Wizard Stepper contract; Decision Brief §§8,13; Drawer/Modal + Feedback Contracts |
| Related Routes | 003–006,014–015,025,054–055 |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; safety-specific labels |
| Problem | Several UI elements look interactive but are partial/demo/static or lack lifecycle clarity. |
| User Impact | Users see buttons, tables, drawers, modals or steppers without reliable expectations for what happens next. |
| Refactoring Intent | Bind visible interactions to explicit trigger, loading, validation, success, error, blocked and recovery states, or clearly keep them static/reference/deferred. |
| Target Files | components/ui/data-table.tsx; components/ui/filter-bar.tsx; components/ui/drawer.tsx; components/ui/modal.tsx; components/ui/wizard-stepper.tsx; components/ui/state-panel.tsx; relevant screen components; tests/* |
| Allowed Changes | Add handlers, state props, callback contracts, focus/escape behaviour, validation display and safe feedback where task scope permits. |
| Forbidden Changes | No fake persistence; no untested safety mutation; no drag/drop or workflow mutation without contract/test coverage. |
| Implementation Steps | 1. Identify current reality: implemented/partial/static. 2. Add lifecycle only when scoped. 3. Add state/feedback hooks. 4. Add tests or mark as static/deferred. |
| Acceptance Criteria | Interactive-looking elements either perform scoped lifecycle with feedback or are clearly non-actionable/static; no fake interactivity remains in MVP flows. |
| P0 / Safety Tests | Safety-critical interactions need denial/leakage/bypass/fail-closed tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:playwright; targeted specs: upload, permissions, workflow, export |
| Proof Required | Interaction screenshots, keyboard/focus notes, test results. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-INTERACTION-004 — Standardize route state panels and recovery paths

| Field | Value |
| --- | --- |
| Task ID | UX-INTERACTION-004 |
| Workstream | UX-INTERACTION |
| Source Decision | State Screen Spec; Decision Brief §§8,13; Drawer/Modal + Feedback Contracts |
| Related Routes | All MVP routes + flow-relevant support |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; safety-specific labels |
| Problem | Several UI elements look interactive but are partial/demo/static or lack lifecycle clarity. |
| User Impact | Users see buttons, tables, drawers, modals or steppers without reliable expectations for what happens next. |
| Refactoring Intent | Bind visible interactions to explicit trigger, loading, validation, success, error, blocked and recovery states, or clearly keep them static/reference/deferred. |
| Target Files | components/ui/data-table.tsx; components/ui/filter-bar.tsx; components/ui/drawer.tsx; components/ui/modal.tsx; components/ui/wizard-stepper.tsx; components/ui/state-panel.tsx; relevant screen components; tests/* |
| Allowed Changes | Add handlers, state props, callback contracts, focus/escape behaviour, validation display and safe feedback where task scope permits. |
| Forbidden Changes | No fake persistence; no untested safety mutation; no drag/drop or workflow mutation without contract/test coverage. |
| Implementation Steps | 1. Identify current reality: implemented/partial/static. 2. Add lifecycle only when scoped. 3. Add state/feedback hooks. 4. Add tests or mark as static/deferred. |
| Acceptance Criteria | Interactive-looking elements either perform scoped lifecycle with feedback or are clearly non-actionable/static; no fake interactivity remains in MVP flows. |
| P0 / Safety Tests | Safety-critical interactions need denial/leakage/bypass/fail-closed tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:playwright; targeted specs: upload, permissions, workflow, export |
| Proof Required | Interaction screenshots, keyboard/focus notes, test results. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-INTERACTION-005 — Align upload interaction with upload-only safety messaging

| Field | Value |
| --- | --- |
| Task ID | UX-INTERACTION-005 |
| Workstream | UX-INTERACTION |
| Source Decision | Upload interaction proof; Decision Brief §§8,13; Drawer/Modal + Feedback Contracts |
| Related Routes | 028,027,029,030 |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; safety-specific labels |
| Problem | Several UI elements look interactive but are partial/demo/static or lack lifecycle clarity. |
| User Impact | Users see buttons, tables, drawers, modals or steppers without reliable expectations for what happens next. |
| Refactoring Intent | Bind visible interactions to explicit trigger, loading, validation, success, error, blocked and recovery states, or clearly keep them static/reference/deferred. |
| Target Files | components/ui/data-table.tsx; components/ui/filter-bar.tsx; components/ui/drawer.tsx; components/ui/modal.tsx; components/ui/wizard-stepper.tsx; components/ui/state-panel.tsx; relevant screen components; tests/* |
| Allowed Changes | Add handlers, state props, callback contracts, focus/escape behaviour, validation display and safe feedback where task scope permits. |
| Forbidden Changes | No fake persistence; no untested safety mutation; no drag/drop or workflow mutation without contract/test coverage. |
| Implementation Steps | 1. Identify current reality: implemented/partial/static. 2. Add lifecycle only when scoped. 3. Add state/feedback hooks. 4. Add tests or mark as static/deferred. |
| Acceptance Criteria | Interactive-looking elements either perform scoped lifecycle with feedback or are clearly non-actionable/static; no fake interactivity remains in MVP flows. |
| P0 / Safety Tests | Safety-critical interactions need denial/leakage/bypass/fail-closed tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:playwright; targeted specs: upload, permissions, workflow, export |
| Proof Required | Interaction screenshots, keyboard/focus notes, test results. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-INTERACTION-006 — Use drawers for secondary context, not workflows

| Field | Value |
| --- | --- |
| Task ID | UX-INTERACTION-006 |
| Workstream | UX-INTERACTION |
| Source Decision | Page-type policy; Decision Brief §§8,13; Drawer/Modal + Feedback Contracts |
| Related Routes | 031,046,048,050,051 and detail-heavy workbenches |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; safety-specific labels |
| Problem | Several UI elements look interactive but are partial/demo/static or lack lifecycle clarity. |
| User Impact | Users see buttons, tables, drawers, modals or steppers without reliable expectations for what happens next. |
| Refactoring Intent | Bind visible interactions to explicit trigger, loading, validation, success, error, blocked and recovery states, or clearly keep them static/reference/deferred. |
| Target Files | components/ui/data-table.tsx; components/ui/filter-bar.tsx; components/ui/drawer.tsx; components/ui/modal.tsx; components/ui/wizard-stepper.tsx; components/ui/state-panel.tsx; relevant screen components; tests/* |
| Allowed Changes | Add handlers, state props, callback contracts, focus/escape behaviour, validation display and safe feedback where task scope permits. |
| Forbidden Changes | No fake persistence; no untested safety mutation; no drag/drop or workflow mutation without contract/test coverage. |
| Implementation Steps | 1. Identify current reality: implemented/partial/static. 2. Add lifecycle only when scoped. 3. Add state/feedback hooks. 4. Add tests or mark as static/deferred. |
| Acceptance Criteria | Interactive-looking elements either perform scoped lifecycle with feedback or are clearly non-actionable/static; no fake interactivity remains in MVP flows. |
| P0 / Safety Tests | Safety-critical interactions need denial/leakage/bypass/fail-closed tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:playwright; targeted specs: upload, permissions, workflow, export |
| Proof Required | Interaction screenshots, keyboard/focus notes, test results. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-INTERACTION-007 — Add accessibility/focus/keyboard expectations to overlays and workbenches

| Field | Value |
| --- | --- |
| Task ID | UX-INTERACTION-007 |
| Workstream | UX-INTERACTION |
| Source Decision | Interaction contract; Decision Brief §§8,13; Drawer/Modal + Feedback Contracts |
| Related Routes | Modal/drawer/wizard/table routes |
| Route Policy | VISUAL_NOT_BEHAVIOUR_PROOF; STATUS_CHIP_NOT_GATE_PROOF; safety-specific labels |
| Problem | Several UI elements look interactive but are partial/demo/static or lack lifecycle clarity. |
| User Impact | Users see buttons, tables, drawers, modals or steppers without reliable expectations for what happens next. |
| Refactoring Intent | Bind visible interactions to explicit trigger, loading, validation, success, error, blocked and recovery states, or clearly keep them static/reference/deferred. |
| Target Files | components/ui/data-table.tsx; components/ui/filter-bar.tsx; components/ui/drawer.tsx; components/ui/modal.tsx; components/ui/wizard-stepper.tsx; components/ui/state-panel.tsx; relevant screen components; tests/* |
| Allowed Changes | Add handlers, state props, callback contracts, focus/escape behaviour, validation display and safe feedback where task scope permits. |
| Forbidden Changes | No fake persistence; no untested safety mutation; no drag/drop or workflow mutation without contract/test coverage. |
| Implementation Steps | 1. Identify current reality: implemented/partial/static. 2. Add lifecycle only when scoped. 3. Add state/feedback hooks. 4. Add tests or mark as static/deferred. |
| Acceptance Criteria | Interactive-looking elements either perform scoped lifecycle with feedback or are clearly non-actionable/static; no fake interactivity remains in MVP flows. |
| P0 / Safety Tests | Safety-critical interactions need denial/leakage/bypass/fail-closed tests. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:playwright; targeted specs: upload, permissions, workflow, export |
| Proof Required | Interaction screenshots, keyboard/focus notes, test results. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |


## 15. UX-SAFETY — Safety / RBAC / Visibility / P0 Test Tasks

### UX-SAFETY-001 — Client-facing fail-closed UX and tests

| Field | Value |
| --- | --- |
| Task ID | UX-SAFETY-001 |
| Workstream | UX-SAFETY |
| Source Decision | RBAC/Visibility/Advice Boundary Contract; Evidence/Audit/Export Safety Contract; P0 Test Acceptance Matrix; Route Policy Matrix |
| Related Routes | 019,020 |
| Route Policy | Safety-critical route policies from matrix; P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE |
| Problem | UX can accidentally imply safety gates are passed because a state, chip, button or route is visible. |
| User Impact | Users may trust or act on incomplete/unapproved/unauthorized information. |
| Refactoring Intent | Make safety boundaries visible and test-backed without making UX alarmist or confusing. |
| Target Files | Relevant screen components; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts; tests/permission-engine.spec.ts; tests/workflow-gate.spec.ts; tests/recommendation-review-workflow-api.spec.ts; tests/document-upload-api.spec.ts; tests/file-export-realism.spec.ts |
| Allowed Changes | Add fail-closed UI states, disabled reasons, explicit caveats and tests; wire to existing services/engines where present. |
| Forbidden Changes | No weakening of safety; no manual override; no bypass; no payload expansion; no schema replacement. |
| Implementation Steps | 1. Identify route/UI safety claim. 2. Add safe state/copy/disabled reason. 3. Add positive and negative tests. 4. Confirm no route/task changes P1/Hold/Reference scope. |
| Acceptance Criteria | Safety-sensitive UX states cannot be misread as gate proof; negative tests prove blocked/leakage/bypass cases fail safely. |
| P0 / Safety Tests | P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE; add/update positive and negative tests as needed. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:playwright |
| Proof Required | P0 test output and safety screenshot proof. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-SAFETY-002 — AI Draft internal-only UX and tests

| Field | Value |
| --- | --- |
| Task ID | UX-SAFETY-002 |
| Workstream | UX-SAFETY |
| Source Decision | RBAC/Visibility/Advice Boundary Contract; Evidence/Audit/Export Safety Contract; P0 Test Acceptance Matrix; Route Policy Matrix |
| Related Routes | 033–037,019–020,054–058 |
| Route Policy | Safety-critical route policies from matrix; P0_AI_DRAFT_INTERNAL_ONLY_GATE |
| Problem | UX can accidentally imply safety gates are passed because a state, chip, button or route is visible. |
| User Impact | Users may trust or act on incomplete/unapproved/unauthorized information. |
| Refactoring Intent | Make safety boundaries visible and test-backed without making UX alarmist or confusing. |
| Target Files | Relevant screen components; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts; tests/permission-engine.spec.ts; tests/workflow-gate.spec.ts; tests/recommendation-review-workflow-api.spec.ts; tests/document-upload-api.spec.ts; tests/file-export-realism.spec.ts |
| Allowed Changes | Add fail-closed UI states, disabled reasons, explicit caveats and tests; wire to existing services/engines where present. |
| Forbidden Changes | No weakening of safety; no manual override; no bypass; no payload expansion; no schema replacement. |
| Implementation Steps | 1. Identify route/UI safety claim. 2. Add safe state/copy/disabled reason. 3. Add positive and negative tests. 4. Confirm no route/task changes P1/Hold/Reference scope. |
| Acceptance Criteria | Safety-sensitive UX states cannot be misread as gate proof; negative tests prove blocked/leakage/bypass cases fail safely. |
| P0 / Safety Tests | P0_AI_DRAFT_INTERNAL_ONLY_GATE; add/update positive and negative tests as needed. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:playwright |
| Proof Required | P0 test output and safety screenshot proof. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-SAFETY-003 — Advisor approval is not compliance release UX and tests

| Field | Value |
| --- | --- |
| Task ID | UX-SAFETY-003 |
| Workstream | UX-SAFETY |
| Source Decision | RBAC/Visibility/Advice Boundary Contract; Evidence/Audit/Export Safety Contract; P0 Test Acceptance Matrix; Route Policy Matrix |
| Related Routes | 036–040,043–045 |
| Route Policy | Safety-critical route policies from matrix; P0_ADVISOR_NOT_RELEASE_GATE |
| Problem | UX can accidentally imply safety gates are passed because a state, chip, button or route is visible. |
| User Impact | Users may trust or act on incomplete/unapproved/unauthorized information. |
| Refactoring Intent | Make safety boundaries visible and test-backed without making UX alarmist or confusing. |
| Target Files | Relevant screen components; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts; tests/permission-engine.spec.ts; tests/workflow-gate.spec.ts; tests/recommendation-review-workflow-api.spec.ts; tests/document-upload-api.spec.ts; tests/file-export-realism.spec.ts |
| Allowed Changes | Add fail-closed UI states, disabled reasons, explicit caveats and tests; wire to existing services/engines where present. |
| Forbidden Changes | No weakening of safety; no manual override; no bypass; no payload expansion; no schema replacement. |
| Implementation Steps | 1. Identify route/UI safety claim. 2. Add safe state/copy/disabled reason. 3. Add positive and negative tests. 4. Confirm no route/task changes P1/Hold/Reference scope. |
| Acceptance Criteria | Safety-sensitive UX states cannot be misread as gate proof; negative tests prove blocked/leakage/bypass cases fail safely. |
| P0 / Safety Tests | P0_ADVISOR_NOT_RELEASE_GATE; add/update positive and negative tests as needed. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:playwright |
| Proof Required | P0 test output and safety screenshot proof. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-SAFETY-004 — Upload success is not evidence sufficiency UX and tests

| Field | Value |
| --- | --- |
| Task ID | UX-SAFETY-004 |
| Workstream | UX-SAFETY |
| Source Decision | RBAC/Visibility/Advice Boundary Contract; Evidence/Audit/Export Safety Contract; P0 Test Acceptance Matrix; Route Policy Matrix |
| Related Routes | 027–030,038–041,046–047 |
| Route Policy | Safety-critical route policies from matrix; P0_UPLOAD_NOT_SUFFICIENCY_GATE |
| Problem | UX can accidentally imply safety gates are passed because a state, chip, button or route is visible. |
| User Impact | Users may trust or act on incomplete/unapproved/unauthorized information. |
| Refactoring Intent | Make safety boundaries visible and test-backed without making UX alarmist or confusing. |
| Target Files | Relevant screen components; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts; tests/permission-engine.spec.ts; tests/workflow-gate.spec.ts; tests/recommendation-review-workflow-api.spec.ts; tests/document-upload-api.spec.ts; tests/file-export-realism.spec.ts |
| Allowed Changes | Add fail-closed UI states, disabled reasons, explicit caveats and tests; wire to existing services/engines where present. |
| Forbidden Changes | No weakening of safety; no manual override; no bypass; no payload expansion; no schema replacement. |
| Implementation Steps | 1. Identify route/UI safety claim. 2. Add safe state/copy/disabled reason. 3. Add positive and negative tests. 4. Confirm no route/task changes P1/Hold/Reference scope. |
| Acceptance Criteria | Safety-sensitive UX states cannot be misread as gate proof; negative tests prove blocked/leakage/bypass cases fail safely. |
| P0 / Safety Tests | P0_UPLOAD_NOT_SUFFICIENCY_GATE; add/update positive and negative tests as needed. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:playwright |
| Proof Required | P0 test output and safety screenshot proof. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-SAFETY-005 — Export preview/approval/download separation UX and tests

| Field | Value |
| --- | --- |
| Task ID | UX-SAFETY-005 |
| Workstream | UX-SAFETY |
| Source Decision | RBAC/Visibility/Advice Boundary Contract; Evidence/Audit/Export Safety Contract; P0 Test Acceptance Matrix; Route Policy Matrix |
| Related Routes | 054–058 |
| Route Policy | Safety-critical route policies from matrix; P0_EXPORT_REDACTION_GATE / P0_EXPORT_APPROVAL_GATE |
| Problem | UX can accidentally imply safety gates are passed because a state, chip, button or route is visible. |
| User Impact | Users may trust or act on incomplete/unapproved/unauthorized information. |
| Refactoring Intent | Make safety boundaries visible and test-backed without making UX alarmist or confusing. |
| Target Files | Relevant screen components; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts; tests/permission-engine.spec.ts; tests/workflow-gate.spec.ts; tests/recommendation-review-workflow-api.spec.ts; tests/document-upload-api.spec.ts; tests/file-export-realism.spec.ts |
| Allowed Changes | Add fail-closed UI states, disabled reasons, explicit caveats and tests; wire to existing services/engines where present. |
| Forbidden Changes | No weakening of safety; no manual override; no bypass; no payload expansion; no schema replacement. |
| Implementation Steps | 1. Identify route/UI safety claim. 2. Add safe state/copy/disabled reason. 3. Add positive and negative tests. 4. Confirm no route/task changes P1/Hold/Reference scope. |
| Acceptance Criteria | Safety-sensitive UX states cannot be misread as gate proof; negative tests prove blocked/leakage/bypass cases fail safely. |
| P0 / Safety Tests | P0_EXPORT_REDACTION_GATE / P0_EXPORT_APPROVAL_GATE; add/update positive and negative tests as needed. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:playwright |
| Proof Required | P0 test output and safety screenshot proof. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-SAFETY-006 — Admin non-bypass and route/action/payload separation tests

| Field | Value |
| --- | --- |
| Task ID | UX-SAFETY-006 |
| Workstream | UX-SAFETY |
| Source Decision | RBAC/Visibility/Advice Boundary Contract; Evidence/Audit/Export Safety Contract; P0 Test Acceptance Matrix; Route Policy Matrix |
| Related Routes | 009,010,048–051,038–040,054–058 |
| Route Policy | Safety-critical route policies from matrix; P0_ADMIN_NON_BYPASS_GATE / P0_RBAC_ACTION_GATE |
| Problem | UX can accidentally imply safety gates are passed because a state, chip, button or route is visible. |
| User Impact | Users may trust or act on incomplete/unapproved/unauthorized information. |
| Refactoring Intent | Make safety boundaries visible and test-backed without making UX alarmist or confusing. |
| Target Files | Relevant screen components; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts; tests/permission-engine.spec.ts; tests/workflow-gate.spec.ts; tests/recommendation-review-workflow-api.spec.ts; tests/document-upload-api.spec.ts; tests/file-export-realism.spec.ts |
| Allowed Changes | Add fail-closed UI states, disabled reasons, explicit caveats and tests; wire to existing services/engines where present. |
| Forbidden Changes | No weakening of safety; no manual override; no bypass; no payload expansion; no schema replacement. |
| Implementation Steps | 1. Identify route/UI safety claim. 2. Add safe state/copy/disabled reason. 3. Add positive and negative tests. 4. Confirm no route/task changes P1/Hold/Reference scope. |
| Acceptance Criteria | Safety-sensitive UX states cannot be misread as gate proof; negative tests prove blocked/leakage/bypass cases fail safely. |
| P0 / Safety Tests | P0_ADMIN_NON_BYPASS_GATE / P0_RBAC_ACTION_GATE; add/update positive and negative tests as needed. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:playwright |
| Proof Required | P0 test output and safety screenshot proof. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-SAFETY-007 — Audit visibility vs audit persistence warning and tests

| Field | Value |
| --- | --- |
| Task ID | UX-SAFETY-007 |
| Workstream | UX-SAFETY |
| Source Decision | RBAC/Visibility/Advice Boundary Contract; Evidence/Audit/Export Safety Contract; P0 Test Acceptance Matrix; Route Policy Matrix |
| Related Routes | 042,051,045,058 and critical actions |
| Route Policy | Safety-critical route policies from matrix; P0_AUDIT_PERSISTENCE_GATE |
| Problem | UX can accidentally imply safety gates are passed because a state, chip, button or route is visible. |
| User Impact | Users may trust or act on incomplete/unapproved/unauthorized information. |
| Refactoring Intent | Make safety boundaries visible and test-backed without making UX alarmist or confusing. |
| Target Files | Relevant screen components; lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts; tests/permission-engine.spec.ts; tests/workflow-gate.spec.ts; tests/recommendation-review-workflow-api.spec.ts; tests/document-upload-api.spec.ts; tests/file-export-realism.spec.ts |
| Allowed Changes | Add fail-closed UI states, disabled reasons, explicit caveats and tests; wire to existing services/engines where present. |
| Forbidden Changes | No weakening of safety; no manual override; no bypass; no payload expansion; no schema replacement. |
| Implementation Steps | 1. Identify route/UI safety claim. 2. Add safe state/copy/disabled reason. 3. Add positive and negative tests. 4. Confirm no route/task changes P1/Hold/Reference scope. |
| Acceptance Criteria | Safety-sensitive UX states cannot be misread as gate proof; negative tests prove blocked/leakage/bypass cases fail safely. |
| P0 / Safety Tests | P0_AUDIT_PERSISTENCE_GATE; add/update positive and negative tests as needed. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:permissions; pnpm test:workflow-gate; pnpm test:workflow-api; pnpm test:file-export; pnpm test:playwright |
| Proof Required | P0 test output and safety screenshot proof. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |


## 16. UX-POLICY — Route Policy Enforcement Tasks

### UX-POLICY-001 — Materialize route UX policy metadata without creating a new product scope engine

| Field | Value |
| --- | --- |
| Task ID | UX-POLICY-001 |
| Workstream | UX-POLICY |
| Source Decision | Route Policy Matrix; Final Codex handoff discipline; no-generation decision |
| Related Routes | All 71 routes |
| Route Policy | NO_ROUTE_RECLASSIFICATION; NO_SCREEN_GENERATION; policy eligibility labels |
| Problem | Without an explicit policy layer, later UX tasks may drift from route scope and safety constraints. |
| User Impact | UX may improve locally while damaging trust, safety or product clarity elsewhere. |
| Refactoring Intent | Make route policy consumable by navigation/page/header/CTA logic and by tests/reporting without creating a competing product engine. |
| Target Files | lib/route-registry.ts; optional new lib/ux-route-policy.ts if final handoff authorizes |
| Allowed Changes | Add metadata/config/test/reporting if final handoff authorizes and existing structures support it. |
| Forbidden Changes | No new route scope decisions; no replacement of permission/visibility/workflow engines; no generation. |
| Implementation Steps | 1. Map matrix fields to code-friendly metadata. 2. Connect nav/page/header task decisions to metadata. 3. Add tests/reporting for protected routes and policy deviations. |
| Acceptance Criteria | Every UX task can cite route policy; protected routes remain protected; no route count/scope drift. |
| P0 / Safety Tests | Route-smoke and permission tests; no-elevation regression for P1/Hold/Reference. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; pnpm test:permissions |
| Proof Required | Policy mapping diff, route-smoke output, no-generation confirmation. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-POLICY-002 — Use route policy to exclude P1/reference/hold from productive MVP navigation

| Field | Value |
| --- | --- |
| Task ID | UX-POLICY-002 |
| Workstream | UX-POLICY |
| Source Decision | Route Policy Matrix; Final Codex handoff discipline; no-generation decision |
| Related Routes | 052–071 protected sets |
| Route Policy | NO_ROUTE_RECLASSIFICATION; NO_SCREEN_GENERATION; policy eligibility labels |
| Problem | Without an explicit policy layer, later UX tasks may drift from route scope and safety constraints. |
| User Impact | UX may improve locally while damaging trust, safety or product clarity elsewhere. |
| Refactoring Intent | Make route policy consumable by navigation/page/header/CTA logic and by tests/reporting without creating a competing product engine. |
| Target Files | components/sidebar.tsx; components/app-shell.tsx; lib/route-registry.ts |
| Allowed Changes | Add metadata/config/test/reporting if final handoff authorizes and existing structures support it. |
| Forbidden Changes | No new route scope decisions; no replacement of permission/visibility/workflow engines; no generation. |
| Implementation Steps | 1. Map matrix fields to code-friendly metadata. 2. Connect nav/page/header task decisions to metadata. 3. Add tests/reporting for protected routes and policy deviations. |
| Acceptance Criteria | Every UX task can cite route policy; protected routes remain protected; no route count/scope drift. |
| P0 / Safety Tests | Route-smoke and permission tests; no-elevation regression for P1/Hold/Reference. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; pnpm test:permissions |
| Proof Required | Policy mapping diff, route-smoke output, no-generation confirmation. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-POLICY-003 — Add route-policy regression proof

| Field | Value |
| --- | --- |
| Task ID | UX-POLICY-003 |
| Workstream | UX-POLICY |
| Source Decision | Route Policy Matrix; Final Codex handoff discipline; no-generation decision |
| Related Routes | All 71 routes |
| Route Policy | NO_ROUTE_RECLASSIFICATION; NO_SCREEN_GENERATION; policy eligibility labels |
| Problem | Without an explicit policy layer, later UX tasks may drift from route scope and safety constraints. |
| User Impact | UX may improve locally while damaging trust, safety or product clarity elsewhere. |
| Refactoring Intent | Make route policy consumable by navigation/page/header/CTA logic and by tests/reporting without creating a competing product engine. |
| Target Files | tests/route-smoke.spec.ts; optional new policy test if authorized |
| Allowed Changes | Add metadata/config/test/reporting if final handoff authorizes and existing structures support it. |
| Forbidden Changes | No new route scope decisions; no replacement of permission/visibility/workflow engines; no generation. |
| Implementation Steps | 1. Map matrix fields to code-friendly metadata. 2. Connect nav/page/header task decisions to metadata. 3. Add tests/reporting for protected routes and policy deviations. |
| Acceptance Criteria | Every UX task can cite route policy; protected routes remain protected; no route count/scope drift. |
| P0 / Safety Tests | Route-smoke and permission tests; no-elevation regression for P1/Hold/Reference. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; pnpm test:permissions |
| Proof Required | Policy mapping diff, route-smoke output, no-generation confirmation. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-POLICY-004 — Add no-generation/no-route-reclassification reporting checks

| Field | Value |
| --- | --- |
| Task ID | UX-POLICY-004 |
| Workstream | UX-POLICY |
| Source Decision | Route Policy Matrix; Final Codex handoff discipline; no-generation decision |
| Related Routes | All UX implementation tasks |
| Route Policy | NO_ROUTE_RECLASSIFICATION; NO_SCREEN_GENERATION; policy eligibility labels |
| Problem | Without an explicit policy layer, later UX tasks may drift from route scope and safety constraints. |
| User Impact | UX may improve locally while damaging trust, safety or product clarity elsewhere. |
| Refactoring Intent | Make route policy consumable by navigation/page/header/CTA logic and by tests/reporting without creating a competing product engine. |
| Target Files | documentation/reporting only unless test harness supports |
| Allowed Changes | Add metadata/config/test/reporting if final handoff authorizes and existing structures support it. |
| Forbidden Changes | No new route scope decisions; no replacement of permission/visibility/workflow engines; no generation. |
| Implementation Steps | 1. Map matrix fields to code-friendly metadata. 2. Connect nav/page/header task decisions to metadata. 3. Add tests/reporting for protected routes and policy deviations. |
| Acceptance Criteria | Every UX task can cite route policy; protected routes remain protected; no route count/scope drift. |
| P0 / Safety Tests | Route-smoke and permission tests; no-elevation regression for P1/Hold/Reference. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; pnpm test:permissions |
| Proof Required | Policy mapping diff, route-smoke output, no-generation confirmation. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |

### UX-POLICY-005 — Keep UX task execution traceable to source decisions

| Field | Value |
| --- | --- |
| Task ID | UX-POLICY-005 |
| Workstream | UX-POLICY |
| Source Decision | Route Policy Matrix; Final Codex handoff discipline; no-generation decision |
| Related Routes | All tasks |
| Route Policy | NO_ROUTE_RECLASSIFICATION; NO_SCREEN_GENERATION; policy eligibility labels |
| Problem | Without an explicit policy layer, later UX tasks may drift from route scope and safety constraints. |
| User Impact | UX may improve locally while damaging trust, safety or product clarity elsewhere. |
| Refactoring Intent | Make route policy consumable by navigation/page/header/CTA logic and by tests/reporting without creating a competing product engine. |
| Target Files | Task reporting and handoff template |
| Allowed Changes | Add metadata/config/test/reporting if final handoff authorizes and existing structures support it. |
| Forbidden Changes | No new route scope decisions; no replacement of permission/visibility/workflow engines; no generation. |
| Implementation Steps | 1. Map matrix fields to code-friendly metadata. 2. Connect nav/page/header task decisions to metadata. 3. Add tests/reporting for protected routes and policy deviations. |
| Acceptance Criteria | Every UX task can cite route policy; protected routes remain protected; no route count/scope drift. |
| P0 / Safety Tests | Route-smoke and permission tests; no-elevation regression for P1/Hold/Reference. |
| Validation Commands | pnpm typecheck; pnpm lint; pnpm test:route-smoke; pnpm test:permissions |
| Proof Required | Policy mapping diff, route-smoke output, no-generation confirmation. |
| Codex Status | IMPLEMENTATION_READY_AFTER_FINAL_HANDOFF |


## 17. Forbidden Changes Register

| Forbidden Change | Why Forbidden | Source | Applies To | Codex Enforcement |
| --- | --- | --- | --- | --- |
| Screen generation | No-generation decision; existing visuals are references only. | SCREEN_GENERATION_BRIEF_IF_NEEDED.md | All tasks | Reject any task proposing new/generated screens. |
| State-screen generation | State behaviour may be implemented, but no visual state-screen assets. | STATE_SCREEN_SPEC.md | UX-STATE / UX-INTERACTION | Reject image/state-screen generation. |
| Image generation | No image generation in UX implementation path. | No-generation decision | All tasks | Reject image generation requests. |
| New routes | Route universe is 71 registered routes. | ROUTE_SCOPE_LOCK.md | All tasks | Reject route creation unless future explicit authorization. |
| Route reclassification | Scope labels are locked. | ROUTE_SCOPE_LOCK.md | All tasks | Route IDs retain MVP/MVP_SUPPORT/P1/Reference/Hold. |
| P1/Hold elevation | P1/Hold routes remain deferred/blocked. | Route Policy Matrix | 052–071 protected sets | Reject productive MVP task on protected route. |
| Reference-to-product conversion | 061–063 are reference-only. | Route Policy Matrix | 061–063 | Reject product CTAs/workflows. |
| Client-visible AI Draft | AI Draft is internal-only. | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md | Advisory/client/export routes | Negative test required where advisory payload renders. |
| Unapproved advice | No unapproved advice to client. | MVP control rules | Client/advisory/export routes | Block task until P0 no-leakage proof. |
| Admin bypass | Admin cannot bypass gates. | RBAC contract | Governance/admin/compliance/export | Require admin non-bypass tests. |
| Manual visibility override | Client visibility is derived/fail-closed. | Visibility contract | Client-facing routes | Reject manual visibility toggle. |
| Upload-to-release shortcut | Upload success is not evidence sufficiency. | Evidence contract | Document/evidence/compliance routes | Require upload-not-sufficiency proof. |
| Blind schema replacement | Full workflow schema remains baseline. | SCHEMA_FIELD_LEVEL_RECONCILIATION.md | Schema/API/safety tasks | No patch schema replacement. |
| `main` target tasks | `main` is false-gap source only. | False-gap cleanup | All tasks | Target only full-workflow. |

## 18. Target File / Component Map

| Target Area | Likely Files / Components | Workstreams | Allowed Change Type | Forbidden Change Type | Validation |
| --- | --- | --- | --- | --- | --- |
| App shell / primary navigation | components/app-shell.tsx; components/sidebar.tsx; lib/route-registry.ts | UX-NAV; UX-POLICY | Workspace grouping, active state, protected-route nav treatment | No route creation/reclassification; no P1/Hold promotion | pnpm test:route-smoke; pnpm test:permissions |
| Topbar context | components/top-bar.tsx; components/demo-session-provider.tsx; components/demo-session-panel.tsx | UX-NAV | Tenant/role/object context display and fail-closed unknown state | No payload visibility expansion; no manual visibility override | pnpm test:permissions |
| Page header | components/page-header.tsx; relevant route screen components | UX-NAV; UX-CTA; UX-STATE | Page job, gate status, one primary CTA, secondary actions | No status-chip-as-gate-proof; no success overclaim | pnpm test:route-smoke; targeted workflow tests |
| Auth/onboarding | components/auth-onboarding-screen.tsx; components/ui/wizard-stepper.tsx | UX-PAGE; UX-INTERACTION; UX-CTA | Wizard progression, validation, support-state guidance | No production IAM overclaim; no scope expansion | pnpm test:route-smoke |
| Admin/tenant setup | components/admin-tenant-setup-screen.tsx | UX-HUB; UX-PAGE; UX-INTERACTION; UX-SAFETY | Setup hubs, role/security modals, blocked states | No admin bypass; no gate override | pnpm test:permissions |
| Client intake/portal/documents | components/client-intake-screen.tsx; components/ui/state-panel.tsx | UX-HUB; UX-PAGE; UX-CTA; UX-SAFETY | D1 client views; document/evidence upload/review flow | No client leakage; upload not sufficiency | pnpm test:permissions; pnpm test:playwright tests/document-upload-api.spec.ts; pnpm test:playwright tests/document-upload-flow.spec.ts |
| Advisory workflow | components/internal-workflow-screen.tsx | UX-HUB; UX-PAGE; UX-CTA; UX-SAFETY | Signal/advisor/compliance workbench/detail refactor | No AI Draft client visibility; advisor != release | pnpm test:workflow-gate; pnpm test:workflow-api |
| Decision/evidence/governance | components/decisions-governance-screen.tsx; components/ui/evidence-list.tsx; components/ui/audit-timeline.tsx | UX-PAGE; UX-COMPLEXITY; UX-SAFETY | Decision/evidence/governance detail and audit views | Audit display not persistence proof; no RBAC expansion | pnpm test:permissions; pnpm test:workflow-gate |
| Export / communication / ops | components/communication-export-ops-screen.tsx | UX-HUB; UX-PAGE; UX-DENSITY; UX-SAFETY | Export scope/redaction/preview/download separation | Export preview not approval/download; P1 routes deferred | pnpm test:file-export |
| Held/P1 specialist screens | components/kyc-aml-workflow-screen.tsx; components/suitability-ips-screen.tsx; components/review-monitoring-screen.tsx; components/committee-review-screen.tsx | UX-PAGE; UX-POLICY only | Guard/deferred/hold treatment only | No MVP task, no scope unlock, no generation | pnpm test:route-smoke |
| UI primitives | components/ui/* | UX-DENSITY; UX-INTERACTION; UX-CTA | Reusable density, table, drawer, modal, state panel improvements | No fake lifecycle; no untested mutation | pnpm typecheck; pnpm lint; targeted Playwright tests |
| Safety engines/services | lib/permission-engine.ts; lib/visibility-engine.ts; lib/workflow-gate.ts | UX-SAFETY; UX-POLICY | Read-only integration or scoped hardening when final handoff authorizes | No replacement or bypass of engines | pnpm test:permissions; pnpm test:workflow-gate |
| Tests | tests/* | UX-SAFETY; UX-POLICY; all safety-critical tasks | Add/extend positive/negative tests | Do not claim existing tests fully close P0 without proof | pnpm test:playwright; targeted specs |

## 19. Acceptance Criteria Matrix

| Acceptance Area | Criteria | Applies To | Proof Required | P0 / Safety Link |
| --- | --- | --- | --- | --- |
| Navigation | Sidebar/App Shell groups by journey/workspace; role-aware filtering; object context in topbar/header. | UX-NAV tasks | Screenshots by role + route-smoke | RBAC route visibility/payload separation |
| Page Header | Every eligible route shows page job, status/gate and one primary next step above fold. | UX-NAV/UX-CTA | Representative screenshots; route-smoke | No status-chip-as-gate-proof |
| Hubs | Hubs orient and prioritize, but do not execute full workflows or final gate actions. | UX-HUB | Screenshots of 013/019/034/043/054 | No scope elevation; no final release/export on hub |
| Workbenches | Workbenches focus active queue/task + selected context + action rail. | UX-PAGE/UX-COMPLEXITY | Screenshots; targeted tests | Action permission and payload visibility remain gated |
| Details | Detail pages bundle decision basis, evidence, audit/timeline and focused action. | UX-PAGE | Screenshots of 035/039/044/047/057 | Evidence/audit visibility policy |
| Drawers | Drawers provide secondary context and do not host full workflows. | UX-INTERACTION | Interaction screenshots; keyboard/focus proof | No full release/export/advice action in drawer |
| Density | D1-D4 route tiers applied consistently. | UX-DENSITY | Screenshot set D1/D2/D3/D4 | Safety content not hidden by density |
| CTA | Exactly one primary CTA per state; blocked CTAs explain reason and recovery. | UX-CTA | CTA matrix proof; screenshots | No upload/release/export/advice overclaim |
| Client visibility | Client-facing routes fail closed to released/redacted/client-safe content. | UX-SAFETY | Permission/visibility negative tests | No client leakage |
| AI Draft | AI/rules draft remains internal-only. | UX-SAFETY | Negative no-client-release tests | No unapproved advice leakage |
| Evidence | Upload success is upload-only and does not unlock sufficiency/release/export. | UX-CTA/UX-SAFETY | Document upload API/flow tests | P0_UPLOAD_NOT_SUFFICIENCY_GATE |
| Export | Preview, approval and download/share remain separate. | UX-CTA/UX-SAFETY | File export tests | P0_EXPORT_REDACTION_GATE |
| Protected routes | P1/Hold/Reference remain deferred/reference/blocked. | UX-POLICY | Route-smoke and screenshots | No P1/Hold elevation |

## 20. Validation Commands

```bash
pnpm typecheck
pnpm lint
pnpm test:playwright
pnpm test:route-smoke
pnpm test:permissions
pnpm test:workflow-gate
pnpm test:workflow-api
pnpm test:file-export
pnpm playwright test tests/document-upload-api.spec.ts
pnpm playwright test tests/document-upload-flow.spec.ts
pnpm playwright test tests/file-export-realism.spec.ts
pnpm playwright test tests/route-smoke.spec.ts
pnpm playwright test tests/permission-engine.spec.ts
pnpm playwright test tests/workflow-gate.spec.ts
```

`package.json` in the full-workflow ZIP declares `pnpm@9.15.9` and includes `typecheck`, `lint`, `test:playwright`, `test:route-smoke`, `test:permissions`, `test:workflow-gate`, `test:workflow-api`, `test:file-export` and `phase:check`. Use targeted Playwright commands when a named script does not exist for a specific file.

## 21. Reporting Requirements

Later Codex execution must report:

| Report Item | Required Content |
|---|---|
| Changed files | Exact file list and task IDs touching each file. |
| Implemented tasks | Task IDs completed and acceptance evidence. |
| Skipped tasks | Task IDs skipped with reason. |
| Blocked tasks | Blocker, route/policy affected, and required decision. |
| Tests run | Command, result and relevant output summary. |
| Tests passed/failed | Passed/failed list with remediation notes. |
| Screenshots/proofs | Representative route/role screenshots and flow proof. |
| P0 negative tests | Added/updated denial, leakage, bypass and fail-closed tests. |
| Route policy deviations | Any mismatch against `ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md`; should be zero. |
| No-generation confirmation | Explicit confirmation that no screens/state-screens/images were generated. |
| No-safety-regression confirmation | Explicit confirmation for client visibility, advice boundary, upload/evidence, audit/export, RBAC. |

## 22. Blocked / Deferred / Reference-only Register

| Category | Route IDs | Status | Permitted Task Treatment |
|---|---|---|---|
| P1 deferred | 052, 053, 059, 060, 068 | `DEFERRED_P1` | Guard/deprioritization only; no MVP product UX implementation. |
| Reference-only | 061, 062, 063 | `REFERENCE_ONLY_NO_TASK` | Keep out of productive main flow; reference utility only. |
| Hold-blocked | 064, 065, 066, 067, 069, 070, 071 | `HOLD_BLOCKED` | No product UX task, no generation, no safety finalization. |
| Visual refs unresolved | 064–071 | `NO_GENERATION_TASK` | Preserve as known gap; no image/screen generation from this task master. |

## 23. Readiness for Implementation Handoff

| Readiness Area | Status | Notes |
|---|---|---|
| Route policy | READY | Companion matrix created and should be imported into next handoff. |
| Task detail | READY | Workstreams include task IDs, target files, allowed/forbidden changes, steps, acceptance, tests and validation. |
| Codex execution | NOT AUTHORIZED | Requires `ALPHAVEST_UX_REFACTORING_IMPLEMENTATION_HANDOFF.md`. |
| Safety/P0 proof | PARTIAL BUT MAPPED | Missing/required tests are assigned to UX-SAFETY and affected tasks. |
| Package validation commands | READY | pnpm confirmed from package.json in full-workflow ZIP. |
| Visual generation | BLOCKED | No screen/state/image generation authorized. |
| Scope drift | BLOCKED | Route policy prevents P1/Hold/Reference elevation. |

## 24. QA / Proof

| QA Check | Result |
|---|---|
| Route Policy Matrix created first | PASS |
| UX Task Master created second | PASS |
| Workstreams separated | PASS — UX-NAV, UX-HUB, UX-PAGE, UX-COMPLEXITY, UX-DENSITY, UX-CTA, UX-INTERACTION, UX-SAFETY, UX-POLICY. |
| Target files/components named | PASS |
| Allowed and forbidden changes included | PASS |
| Acceptance criteria included | PASS |
| Validation commands included | PASS |
| P0/safety tests integrated | PASS |
| No implementation authorized | PASS |
| No final handoff created | PASS |
| No screen/state/image generation authorized | PASS |
| `main` not used as target truth | PASS |
