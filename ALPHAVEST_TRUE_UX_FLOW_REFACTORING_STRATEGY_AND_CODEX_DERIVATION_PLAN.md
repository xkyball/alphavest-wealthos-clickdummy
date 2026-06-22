# ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


**Generated:** 2026-06-22  
**Mode:** Strategy / research-grounded planning only. No implementation. No code changes. No Codex execution. No final Codex task pack. No final implementation handoff.  
**Target project:** AlphaVest WealthOS  
**Target repository / branch:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`  
**Current local baseline inspected:** `[repo-local artefact filename only; local runtime path removed] repository checkout / pull of target branch full-workflow` snapshot.  
**Important correction:** Prior UX artefacts over-constrained the refactoring by treating `no new routes`, `no screen splitting`, `no new page components`, and `preserve exact route count` as hard UX constraints. These are now classified as `SUPERSEDED_FALSE_CONSTRAINTS`.  
**Hard safety boundary:** Advice boundary, RBAC, fail-closed client visibility, evidence/audit/export safety, AI-draft internal-only, admin non-bypass, and test/proof obligations remain hard constraints.

---

## 1. Executive Decision

| Decision Area | Decision | Confidence | Meaning |
|---|---|---:|---|
| Prior no-new-routes rule | `SUPERSEDED_FALSE_CONSTRAINT` | High | A UX flow may require new hubs, subroutes, review queues, detail pages, decision rooms, redirects, or route deprecations. Route creation is not inherently bad; uncontrolled route creation is bad. |
| Prior no-screen-splitting rule | `SUPERSEDED_FALSE_CONSTRAINT` | High | Overloaded pages should be split when one surface is trying to be hub, queue, detail, audit, and decision room at once. |
| Prior no-new-page-components rule | `SUPERSEDED_FALSE_CONSTRAINT` | High | Focused UX architecture often needs reusable page-type components such as `HubShell`, `WorkQueue`, `DecisionRoom`, `ObjectDetail`, `ClientProjection`, and `ActionRail`. |
| Route evolution | `ALLOWED_WITH_POLICY_AND_TESTS` | High | New / split / merged / deprecated routes are allowed when the route-evolution record, safety policy, migration/redirect plan, and tests are explicit. |
| Screen splitting | `ALLOWED_WITH_PAGE_JOB_AND_FLOW_PROOF` | High | Split screens when it reduces cognitive load, clarifies page job, improves journey progress, or separates client-safe projection from internal work. |
| UX strategy | `TRUE_FLOW_REFACTORING_REQUIRED` | High | AlphaVest needs structural UX refactoring, not only denser cards or better labels. |
| Codex tasks | `NOT_CREATED_YET_READY_FOR_NEXT_TASK_PACK` | Medium | This artefact defines the doctrine and derivation model. The next artefact should create a new route-evolution-aware Codex task pack. |
| Safety constraints | `REMAIN_HARD_CONSTRAINTS` | Very high | New routes and page splits must not weaken advice boundary, RBAC, visibility, evidence, audit, export, or no-leakage requirements. |
| Moving baseline | `CURRENT_BASELINE_RECHECK_REQUIRED_BEFORE_TASKS` | Very high | The user is implementing another refactor in parallel. Codex must re-check the live `full-workflow` state before converting this strategy into executable tasks. |

**Core decision:** AlphaVest should move from a locked-screen UX policy to a **route-evolution-governed UX refactoring strategy**. The right constraint is not “do not create routes.” The right constraint is: **create, split, merge, hide, or deprecate routes only when it improves a journey, clarifies a page job, preserves safety, and has a route policy, migration/redirect, and test plan.**

---

## 2. Research Method and Source Handling

### 2.1 Research method

This strategy uses a short research synthesis from established UX and design-system sources, then applies the principles to AlphaVest’s current known code and artefact baseline.

| Research Need | Source Type | Use |
|---|---|---|
| Difference between journeys and flows | Nielsen Norman Group, UX research sources | Prevent screen-first refactoring; separate strategic journey from tactical UI flow. |
| Bad flow refactoring heuristics | Nielsen Norman Group usability heuristics | Require system status, mental model match, control/freedom, error recovery, consistency. |
| Complexity reduction | Nielsen Norman Group progressive disclosure; Carbon patterns | Support route/screen splitting, drawers, secondary screens, empty states, and data-table discipline. |
| Service journey structure | GOV.UK Service Manual / GDS step-by-step navigation | Use end-to-end journey logic with clear start, ordered steps, completion, and recovery. |
| Navigation architecture | Material Design navigation; Atlassian navigation system | Separate app structure, lateral movement, forward movement, back/up/reverse navigation, contextual sidebar. |
| Accessibility and feedback | WCAG / WAI | Require focus visible, keyboard operability, error identification, status messages, and recovery. |

### 2.2 Source handling rules

| Source Layer | Treatment |
|---|---|
| Online UX research | Method input. It informs UX architecture but does not override AlphaVest safety or product constraints. |
| Current `full-workflow` code / ZIP | Current implementation reality available in this environment. Must be rechecked in live repo before Codex tasks because parallel refactoring is ongoing. |
| Prior UX decision / policy / task artefacts | Historical decision layer. Useful, but no-route/no-screen-split policies are superseded. |
| Safety / RBAC / API / schema / P0 artefacts | Hard safety layer. Still binding unless explicitly superseded by a newer safety artefact, not by UX preference. |
| `main` branch / main ZIP | False-gap source only. Never target truth. |

---

## 3. Online UX Refactoring Research Synthesis

| Research Source | Relevant Principle | Why It Matters For Bad UX Flow Refactoring | AlphaVest Application | Citation / URL |
|---|---|---|---|---|
| Nielsen Norman Group — User Journeys vs. User Flows | User journeys describe broader activities over longer periods; user flows describe shorter, concrete interface steps. | A bad app often confuses “journey” with “route list.” Refactoring must first choose the journey, then design the concrete flow. | Use MJ-001/MJ-002/MJ-003/MJ-005/MJ-006/MJ-010 as journey anchors; derive tactical pageflows from them rather than flattening 71 routes into navigation. | https://www.nngroup.com/articles/user-journeys-vs-user-flows/ |
| Nielsen Norman Group — 10 Usability Heuristics | Visibility of system status, match with real-world language, user control/freedom, error prevention, recovery. | Poor flows fail because users do not know where they are, what changed, what is blocked, how to go back, or what action is safe. | Add explicit Page Job, current workflow state, next step, blocked reason, recovery, and save/cancel/back rules to every critical surface. | https://www.nngroup.com/articles/ten-usability-heuristics/ |
| Nielsen Norman Group — Visibility of System Status | Users need current state feedback to feel control and trust. | Complex workflows become confusing when status chips exist but do not explain what is next or why an action is blocked. | Convert passive status into actionable gate panels: “Advisor approved; compliance release pending because evidence X is missing.” | https://www.nngroup.com/articles/visibility-system-status/ |
| Nielsen Norman Group — Progressive Disclosure | Defer advanced or rarely used features to secondary screens to make apps easier to learn and less error-prone. | Trying to show everything on one page creates overloaded cards, duplicate metrics, unclear CTAs, and fake productivity. | Split Hub / Queue / Workbench / Detail / Drawer / Decision Room. Advanced evidence/audit/export details move into detail layers, not the hub. | https://www.nngroup.com/articles/progressive-disclosure/ |
| GOV.UK Service Manual — Map a user’s whole problem | Improve around the whole user problem and introduce step-by-step navigation for linear journeys. | Bad UX often optimizes isolated screens rather than the end-to-end service path. | Build end-to-end AlphaVest step journeys: evidence request → upload → review → advisor approval → compliance release → client-safe projection. | https://www.gov.uk/service-manual/design/map-a-users-whole-problem |
| GOV.UK Design System — Step by step navigation | Step-by-step navigation presents an end-to-end journey in logical steps and links to what users need to complete each step. | A family-office workflow needs ordered gates, not a generic sidebar. | Use step indicators and in-flow nav for onboarding, evidence, compliance, export, and tenant setup journeys. | https://design-system.service.gov.uk/patterns/step-by-step-navigation/ |
| Material Design — Understanding Navigation | Navigation is movement between app screens to complete tasks; apps use navigation components, content-embedded navigation, and platform affordances. | A sidebar alone cannot carry all flow meaning. Navigation must include lateral, forward, and reverse movement. | App shell handles destinations; page header and in-content actions handle forward movement; breadcrumbs/back/up support reverse movement. | https://m2.material.io/design/navigation/understanding-navigation.html |
| Material Design — Navigation Patterns | Organize app structure around content and tasks users need; emphasize important destinations and de-emphasize inessential content. | Reference, P1, and held routes should not compete with MVP work in primary navigation. | Create primary journey navigation, secondary object/context navigation, and de-emphasized reference/dev surfaces. | https://m1.material.io/patterns/navigation.html |
| Atlassian Design System — Navigation System | Layout defines page structure and areas for navigation and content; complex apps may use contextual sidebars. | Enterprise applications need clear hierarchy and contextual navigation, not only route lists. | AlphaVest should use role-aware primary nav + object/contextual sidebar/action rail for workbench and detail pages. | https://atlassian.design/components/navigation-system |
| Atlassian Jira Navigation guidance | Not every app feature needs a nav entry; deeper IA may use contextual sidebar. | Route proliferation becomes harmful when every subroute appears as a main nav item. | New routes may be created but not necessarily exposed in the primary sidebar. Use route registry + nav policy separately. | https://developer.atlassian.com/cloud/jira/platform/navigation/ |
| IBM Carbon Design System — Data Table | Data tables organize and display data efficiently and allow user-needed customization. | Dense enterprise data should not be forced into cards; tables work for comparison and queue operations. | Use tables for queues, audits, export objects, RBAC/access lists; use cards for decisions and summaries. | https://carbondesignsystem.com/components/data-table/usage/ |
| IBM Carbon Design System — Empty states / patterns | Empty states and disabled states are design patterns, not afterthoughts. | A flow is not complete if it has no useful zero-state, blocked-state, or disabled-state guidance. | Add empty/blocked/recovery states to client portal, documents, workbench, compliance, evidence, export, governance. | https://carbondesignsystem.com/patterns/empty-states-pattern/ |
| W3C WCAG 2.2 | Focus visible and error identification require clear focus indicators and text identification of errors. | Real UX refactoring must include keyboard/focus/error behavior, not only visual layout. | Drawer/modal/wizard/confirmation tasks must include focus, keyboard, aria/status/error behavior. | https://www.w3.org/TR/WCAG22/ |
| WAI / WCAG Error Identification | Users must be aware an error occurred and determine what is wrong. | Bad forms and workflows fail when errors silently block or only re-render the same page. | Validation errors must explain cause, affected field/object, and recovery route/action. | https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html |

### 3.1 Research synthesis distilled for AlphaVest

1. **Journey and flow are different.** AlphaVest needs a journey-first architecture and flow-specific route/page design.
2. **Navigation is not the route registry.** It is a user-facing model of work: journeys, roles, objects, and current state.
3. **Progressive disclosure can require architecture changes.** Good progressive disclosure may be a drawer, tab, subroute, detail page, queue, or decision room.
4. **New routes are not bad.** Unjustified routes are bad. New routes are valid if they improve page job separation and preserve safety.
5. **Status must be actionable.** A status chip without next-step/recovery guidance is decoration, not UX.
6. **Enterprise density needs patterns.** Queues and audit tables should be dense; client-facing executive surfaces should be calm; decision rooms should be focused.
7. **Accessibility is part of flow quality.** Focus, keyboard, status messages, and error identification are required for modals, drawers, forms, wizards, and confirmations.

---

## 4. Moving Baseline / Current Code Reality Check

### 4.1 Baseline availability

| Baseline Source | Availability | Decision |
|---|---|---|
| Live Git repo / working tree | `NOT_AVAILABLE_IN_THIS_EXECUTION_CONTEXT` | Cannot run `git status`, `git branch`, `git log`, or inspect uncommitted parallel refactoring. Codex must do this before implementation tasks. |
| local repository checkout / pull of full-workflow snapshot | `AVAILABLE_AND_INSPECTED` | Used as current local baseline, but not assumed to include the user’s parallel refactoring. |
| Prior UX artefacts | `AVAILABLE` | Treated as historical decisions; no-route/no-screen-split constraints are superseded. |
| New UX videos / ZIP | `PARTIALLY_AVAILABLE` | Earlier evidence informed the prior decision brief. This strategy does not reprocess video frames; it focuses on doctrine and derivation. |

### 4.2 Current local code reality from ZIP snapshot

| Area | Previous Assumption | Current Check | Drift? | Refactoring Impact | Decision |
|---|---|---|---|---|---|
| Route count / registry | 71 registered routes in `lib/route-registry.ts` | Local snapshot contains `lib/route-registry.ts` with 71 unique page IDs `001–071`. | No count drift in snapshot | Route registry is real and should become an evolvable route policy source, not a fixed cage. | `ROUTE_BASELINE_CONFIRMED_IN_ZIP`; live repo recheck required before tasks. |
| Route visual assets | Public clean PNGs `001–063`; artifact refs `064–071` | Local snapshot has 63 clean PNGs. Routes `064–071` reference non-public `artifacts/...` paths. | No known drift in snapshot | Missing artifact refs are not automatic generation authority; but they also must not block route architecture if route is UX-justified. | `VISUAL_BASELINE_PARTIAL`; future route evolution may create code routes without generating images. |
| App shell / sidebar / topbar / page header | Existing components but prior task policy too restrictive | Local snapshot has `components/app-shell.tsx`, `sidebar.tsx`, `top-bar.tsx`, `page-header.tsx`. | Unknown live drift | These are primary candidates for IA refactor; may need structural changes and new nav config. | `REFACTOR_ALLOWED_WITH_TESTS`. |
| Route grouping | Existing groups: access, platform, tenant_setup, client_workspace, wealth_actions, advisory_workflow, decisions_evidence, communication, export, operations | Confirmed in route registry. | Unknown live drift | Groups should evolve from feature buckets into journey/workspace IA. | `GROUPING_REBASE_REQUIRED`. |
| Current hubs | Prior policy assumed no new hubs | Snapshot has routes but no clear dedicated journey hubs for Advisory, Evidence, Governance, Export as first-class flow hubs. | UX architecture drift vs desired model | New hubs may be needed; hub routes can be created if they orient work without inflating scope. | `NEW_HUBS_ALLOWED_WITH_POLICY`. |
| Current workbench/detail structure | Workbench and detail routes exist in some areas (`/workbench`, `/workbench/triggers/:id`, approval/detail routes, compliance detail, evidence/detail, export steps) | Confirmed route registry and components. | Partial structural coverage | Some areas already have route patterns; others need splitting/refinement into queue/detail/decision room. | `SPLIT_OR_EXTRACT_WHERE_PAGE_JOB_CONFLICTS`. |
| Existing drawers/modals | Drawer/modal primitives exist | Confirmed `components/ui/drawer.tsx`, `modal.tsx`. | Unknown lifecycle completeness | Drawers/modals may remain, but heavy workflow decisions should move to routes/decision rooms where context and safety require. | `DRAWER_FOR_CONTEXT_NOT_FULL_WORKFLOW`. |
| Existing tests | 10 Playwright/spec files | Confirmed in local ZIP. | Unknown live drift | Tests are proof slices. New route evolution requires route smoke, navigation, flow, RBAC/no-leakage, and state/accessibility tests. | `TEST_BASELINE_PARTIAL`. |
| Existing UX task files | Prior `ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md` and `ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md` exist | Confirmed in `/mnt/data`. | Conceptual drift: prior files forbid new routes/screen generation too broadly | Treat as superseded planning artefacts. Rebase into true UX task pack. | `PRIOR_UX_TASK_MASTER_REBASE_REQUIRED`. |
| Current pending changes from parallel refactoring | User says another refactor is being implemented | Not visible in local ZIP or file tree | Yes, potential live baseline drift | Before Codex tasks: inspect live repo `git status`, `git diff --stat`, route registry, components, tests. | `CURRENT_BASELINE_RECHECK_REQUIRED_BEFORE_TASKS`. |

### 4.3 Required live baseline commands before next Codex task pack

```bash
git status --short
git branch --show-current
git log -1 --oneline
git diff --stat
find app components lib tests -maxdepth 3 -type f | sort
sed -n '1,220p' lib/route-registry.ts
cat package.json
pnpm typecheck
pnpm lint
pnpm test --if-present
pnpm playwright test tests/route-smoke.spec.ts
```

If a live repo is unavailable and only a ZIP snapshot is provided, the task pack must start with a new ZIP inventory and mark all differences from this artefact as `BASELINE_DRIFT`.

---

## 5. Superseded False Constraints / Still Valid Hard Constraints

### 5.1 Superseded false constraints

| Old Constraint | Why It Is False / Too Restrictive | Replacement Rule | Codex Implication |
|---|---|---|---|
| No new routes | Good flows often need explicit steps, detail pages, review queues, hubs, or client-safe projection routes. Route count is not UX quality. | `ROUTE_EVOLUTION_ALLOWED_WITH_POLICY_AND_TESTS` | Codex tasks may add routes under a route-evolution record. |
| No screen splitting | Overloaded pages cannot become clear merely by tightening spacing. Splitting by page job is often the correct fix. | `SCREEN_SPLITTING_ALLOWED_WITH_PAGE_JOB_AND_FLOW_PROOF` | Codex may split monolithic components/pages into hub, queue, workbench, detail, drawer, or decision-room surfaces. |
| No new page components | New page-type architecture needs reusable components and primitives. | `NEW_COMPONENTS_ALLOWED_IF_REUSABLE_AND_POLICY_ALIGNED` | Codex may create focused components such as `JourneyHub`, `WorkQueue`, `DecisionRoom`, `ObjectHeader`, `ActionRail`, `ClientProjection`. |
| No structural navigation changes | Bad UX often comes from wrong information architecture, not visual polish. | `IA_REFACTORING_ALLOWED` | Codex may refactor sidebar, topbar, page header, breadcrumb, contextual nav, and route grouping. |
| Preserve route count exactly | Route count is an implementation fact, not a product virtue. | `ROUTE_COUNT_CAN_CHANGE_WITH_MIGRATION_AND_TESTS` | Codex may split/create/merge/deprecate routes if route policy, redirects, route smoke and navigation tests are included. |
| No screen/state/image generation | This was useful to prevent premature image generation, but should not mean no coded screen/page creation. | `NO_AUTOMATIC_IMAGE_GENERATION`; `CODED_SCREEN_CREATION_ALLOWED` | Codex may create coded React pages/components. It may not generate visual image assets unless explicitly authorized in a separate visual brief. |

### 5.2 Still valid hard constraints

| Hard Constraint | Why It Remains Binding | Implementation Consequence |
|---|---|---|
| No unapproved advice to client | Core AlphaVest safety boundary. | New routes must not expose draft/advice content until proper gates pass. |
| AI Draft internal-only | AI/rules draft is support for staff, not client advice. | Client projection routes must redact/hide draft and internal rationale. |
| Client visibility fail-closed | Unknown/incomplete release state must hide content, not show it. | New client routes need no-leakage tests. |
| Advisor approval is not compliance release | Human review and compliance release are distinct gates. | CTA labels and route transitions must not conflate them. |
| Compliance release is not client acceptance | Client visibility is not evidence of understanding/action. | Success feedback must only name completed action. |
| Upload success is not evidence sufficiency | File transfer is not proof quality. | Upload flows must keep review/sufficiency gates closed until review/linking passes. |
| Export preview is not approval/download/share | Preview, approval, generation and delivery are separate. | Export route splits should preserve gated sequence. |
| Admin cannot bypass safety gates | Governance rights are not release rights. | Admin/Governance routes need non-bypass negative tests. |
| Route access is not payload visibility | A page shell being reachable does not authorize every field. | New routes need payload filtering/redaction rules. |
| No blind schema replacement | The full workflow schema is baseline. | Add code usage only after field-level need; avoid replacing schema with patch concepts. |
| No `main` as target truth | `main` produced false-gap contamination. | Codex must use `full-workflow` only. |
| No fake interaction overclaim | Buttons/chips/modals are not proof of mutation/gates. | New surfaces require lifecycle + tests or explicit static/demo marking. |
| Tests and proof required | UX is not done until routes, flows, states, and safety are tested. | Every route evolution requires validation plan. |

---

## 6. AlphaVest True UX Refactoring Doctrine

1. **Flow first, route second.** Route design follows the work users must complete. Routes are not sacred; journeys are.
2. **One page job per surface.** A page must not simultaneously be a hub, queue, detail view, audit log, configuration page, and decision room.
3. **Route evolution is allowed.** New routes, subroutes, detail pages, hubs, review queues, and redirects are valid UX tools when policy-controlled.
4. **Screen splitting is often the fix.** Overloaded pages should be separated into hub + queue + workbench + detail + drawer + decision room as needed.
5. **Progressive disclosure is architecture, not decoration.** Secondary content belongs in drawers, tabs, accordions, detail pages, or subroutes by intent, not by accident.
6. **Primary CTA follows workflow state.** Each state needs exactly one next meaningful action, plus non-competing secondary actions.
7. **Safety gates must be visible and actionable.** Blockers must explain cause, missing input, responsible role, and recovery path.
8. **Navigation must match the user mental model.** AlphaVest navigation is `journey-first`, `role-aware`, and `object-contextual`, not a file tree.
9. **Client-safe projection is a separate UX surface.** Client-facing surfaces should be designed as released/redacted projections, not internal screens with hidden fields.
10. **Proof beats aesthetics.** A nicer screen is not a better flow unless the user can complete the task with clear status, accessible controls, safe payloads, and tested recovery.
11. **Density follows page type.** Executive/client surfaces can be calm; workbenches and queues should be productively dense; decision rooms should be focused.
12. **Navigation has direction.** Lateral navigation selects workspaces; forward navigation advances the task; reverse navigation returns safely without data loss.
13. **Route registry and navigation are separate concerns.** A route can exist without being a primary navigation destination.
14. **HOLD and P1 are not MVP by accident.** Route creation or refactoring must not silently elevate scope.
15. **Codex should implement decisions, not invent them.** When a new route/page split requires product policy, Codex stops and reports the decision need.

---

## 7. Route and Screen Evolution Policy

### 7.1 Route evolution types

| Type | Meaning | Allowed? | Required Proof | AlphaVest Example |
|---|---|---|---|---|
| `ROUTE_KEEP` | Route remains but internal layout/flow is refactored. | Yes | Acceptance + route smoke + no regression | Improve `/workbench` with better queue/status/action rail. |
| `ROUTE_SPLIT` | One overloaded route becomes hub / workbench / detail / queue / decision room routes. | Yes | Page job separation, updated nav, redirect/back path, tests | Split `/documents` into `/documents`, `/documents/review-queue`, `/documents/:id/review` if current page mixes list, review, evidence, and upload. |
| `ROUTE_CREATE_SUBROUTE` | New child route for a specific step or detail. | Yes | Journey reason, route policy, tests | Add `/export/:id/approval` to separate preview from approval. |
| `ROUTE_CREATE_HUB` | New route that orients a workspace. | Yes | IA reason, no scope inflation, route smoke | Add `/advisory` hub for signals/workbench/approval/compliance next work. |
| `ROUTE_CREATE_DETAIL` | New object/detail page for focused review. | Yes | Object/page-job reason + payload rules | Add `/evidence/:id/review` for sufficiency decision instead of overloading evidence vault. |
| `ROUTE_CREATE_DECISION_ROOM` | New route for safety-critical decision context. | Yes | Safety gate, evidence/audit visibility, action lifecycle | Add `/compliance/:id/decision-room` if compliance release requires full context. |
| `ROUTE_CREATE_CLIENT_PROJECTION` | New client-safe projection route. | Yes | Fail-closed visibility + no-leakage tests | Add `/portal/decisions/:id` if internal decision page cannot safely double as client view. |
| `ROUTE_CREATE_STEP` | Step route for a wizard/setup/ordered journey. | Conditional | Step validation, back/cancel/save, recovery | `/tenants/:id/setup/team`, `/tenants/:id/setup/policies`. |
| `ROUTE_MERGE` | Consolidate duplicate or confusing routes. | Conditional | No safety/state loss; redirect plan | Merge duplicated admin/security/policy fragments if user mental model improves. |
| `ROUTE_DEPRECATE` | Route remains addressable but leaves primary nav or redirects. | Conditional | Backward compatibility, route smoke | Remove reference/P1/Hold from primary nav; keep direct URL or guarded page. |
| `ROUTE_REMOVE` | Delete route entirely. | Rare | Proven unused/out-of-scope, tests updated, no broken references | Only for obsolete demo-only surfaces after explicit decision. |

### 7.2 Screen evolution types

| Type | Meaning | Allowed? | Required Proof |
|---|---|---|---|
| `SCREEN_SPLIT_HUB_WORKBENCH` | Separate orientation from task execution. | Yes | Hub job + workbench job + navigation link + route smoke. |
| `SCREEN_SPLIT_QUEUE_DETAIL` | Separate list/queue selection from object review. | Yes | Queue state + detail state + row action tests. |
| `SCREEN_SPLIT_DETAIL_DRAWER` | Move secondary context into drawer; keep primary decision on page. | Yes | Drawer lifecycle, focus/keyboard, close/cancel. |
| `SCREEN_CREATE_DECISION_ROOM` | Full-context decision surface for approval/release/export. | Yes | Safety gates, action audit, blocked/recovery states. |
| `SCREEN_CREATE_REVIEW_QUEUE` | Queue for pending work. | Yes | Actor/task clarity, filters, row actions, empty states. |
| `SCREEN_CREATE_CLIENT_PROJECTION` | Separate client-safe view. | Yes | No-leakage, redaction, fail-closed tests. |
| `SCREEN_COMPONENT_EXTRACT` | Reusable page-type or layout component. | Yes | Reuse, accessibility, no style regression. |
| `DRAWER_TO_ROUTE` | Promote a heavy drawer to route when it contains full workflow or safety decision. | Yes | Decision risk, page job, navigation/back path. |
| `ROUTE_TO_DRAWER_PREVIEW` | Convert lightweight detail page to drawer preview where full route is unnecessary. | Conditional | No loss of deep linking if needed, accessibility. |

### 7.3 Required route evolution record

Every route creation, split, merge, deprecation, or deletion must have the following record before implementation:

| Field | Required Content |
|---|---|
| Route Evolution ID | e.g. `UX-ROUTE-EVO-001`. |
| Current Route | Old route/path and component. |
| Proposed Route(s) | New/changed route(s). |
| Evolution Type | Keep/split/create/merge/deprecate/remove. |
| UX Reason | Flow, page job, IA, density, recovery, or safety reason. |
| Affected Journey | MJ-001, MJ-002, MJ-003, MJ-005, MJ-006, MJ-010, etc. |
| Actor / Role | Who benefits and how. |
| Page Type | Hub, Queue, Workbench, Detail, Drawer, Decision Room, Client Projection, Reference. |
| Safety Policy | RBAC, visibility, advice, evidence, audit, export caveat. |
| Migration / Redirect | How old links, direct paths, browser back, and bookmarks behave. |
| Navigation Exposure | Primary nav, contextual nav, hidden/deprecated, or direct-link only. |
| Tests Required | Route smoke, nav click, flow, state, RBAC/no-leakage, accessibility. |
| Codex Readiness | ready / blocked / needs product decision / needs baseline recheck. |

---

## 8. AlphaVest UX Flow Diagnosis

| UX Problem | Current Symptom | Research Principle | AlphaVest Impact | Refactoring Strategy | Route / Screen Evolution Needed? |
|---|---|---|---|---|---|
| Navigation is route-list / feature-list instead of service journey | Sidebar/grouping mirrors routes and feature buckets more than the user’s next work. | Journeys vs flows; Material navigation should organize around tasks. | Users must infer “where do I continue this family-office decision?” from route labels. | Create journey/workspace hubs and contextual nav. De-emphasize reference/P1/hold. | Likely yes: `ROUTE_CREATE_HUB`, `ROUTE_DEPRECATE` for nav-only exposure. |
| Page Header does not consistently explain job, status, next step | Prior artefacts required Page Job/Next Step but existing components need recheck. | Visibility of system status; one primary job per page. | Users see status chips/panels but may not know what action is safe. | Refactor page header to include Page Job, object context, workflow state, primary next step, blocked reason. | Usually no new route; component extraction likely. |
| Hubs and workbenches are not cleanly separated | Many pages combine metrics, cards, tables, status, details, and actions. | Progressive disclosure; task-focused pages. | Users are overloaded, and page purpose is ambiguous. | Split hubs from workbenches; hubs orient and prioritize, workbenches execute. | Yes for several route groups: `SCREEN_SPLIT_HUB_WORKBENCH`, possible `ROUTE_CREATE_HUB`. |
| Detail information competes with action decisions | Decision, evidence, audit, export context may appear as cards/panels instead of layered details. | Progressive disclosure; tables for comparison, details for decisions. | Actions compete with background details; hard to know what matters. | Use detail pages/decision rooms/action rails; put secondary evidence/audit in tabs/drawers. | Yes: `ROUTE_CREATE_DETAIL`, `SCREEN_CREATE_DECISION_ROOM`. |
| Client-facing and internal surfaces need clearer separation | Client portal/mobile are routes, but internal/client payload boundaries need UX distinction. | Client-safe projection; no-leakage. | Internal recommendations, drafts, evidence, and compliance notes risk being visually conflated with client views. | Create or clarify client projection surfaces that are released/redacted and fail-closed by design. | Possibly yes: `ROUTE_CREATE_CLIENT_PROJECTION`. |
| Export / Evidence / Compliance need decision-room logic | Existing export steps and compliance routes exist but may not clearly distinguish preview, approval, release, download/share. | Step-by-step navigation; no success overclaim. | Users may think preview equals approval or upload equals sufficiency. | Split or harden lifecycle surfaces: scope → redaction → preview → approval → download/share. Evidence: upload → review → link → sufficiency. | Yes: `ROUTE_CREATE_SUBROUTE`, `SCREEN_CREATE_DECISION_ROOM`, route keep/split. |
| Admin/Governance needs safety-first navigation, not only settings | Governance routes exist, but admin power must not suggest bypass. | Match real-world roles; admin non-bypass. | Admin may be perceived as a superuser who can release/override. | Governance hub + access queue + audit history + second-confirmation surfaces with explicit non-bypass messaging. | Possibly: `ROUTE_CREATE_HUB` and component extraction. |
| Reference/P1/Hold routes are too easy to mix with product flow | Prior matrices identify reference and hold routes, but nav may still expose them similarly. | Navigation should de-emphasize inessential content. | Users may confuse roadmap/states/reference pages with live product capability. | Hide/deprioritize from primary nav; keep in developer/reference section or gated internal tools. | `ROUTE_DEPRECATE` from primary navigation, not necessarily delete. |
| Density is inconsistent | Some pages too dense but unfocused; others too spacious without a work purpose. | Enterprise pattern discipline. | Premium calm turns into wasted space; workbench density turns into chaos. | Apply density tiers by page type: D1 client/executive, D2 workbench, D3 ops/table, D4 decision/detail. | Usually component/layout refactor; route splits if density conflict reflects page-job conflict. |
| Static/demo interaction is mistaken for real flow | Prior interaction audit found implemented upload, but many buttons/chips/modals are visual/static/demo. | Visibility/status and user control require actual lifecycle. | Users see actions without reliable mutation/recovery proof. | Convert critical actions to real lifecycle or label/static-disable them. Heavy actions move to decision rooms. | Yes where fake interaction hides workflow: route/detail/decision-room splits possible. |

---

## 9. Target UX Architecture

### 9.1 Architecture decisions

| Architecture Area | Target Decision | Meaning |
|---|---|---|
| Navigation Model | `JOURNEY_FIRST_ROLE_AWARE_OBJECT_CONTEXTUAL_HYBRID` | Primary navigation follows work journeys; role filters what appears; object context appears in workbench/detail/header/action rail. |
| Route Architecture | `ROUTE_EVOLUTION_ALLOWED_UNDER_POLICY` | Route registry may change if route-evolution record, safety, migration and tests are included. |
| Page-Type System | `HUB / QUEUE / WORKBENCH / DETAIL / DRAWER / DECISION_ROOM / CLIENT_PROJECTION / REFERENCE` | Each surface has a single job and expected density/CTA pattern. |
| Density System | `CONTROLLED_PREMIUM_WORKBENCH_HYBRID` | Calm executive/client surfaces; productive internal workbenches; dense operations tables; focused decision rooms. |
| CTA System | `ONE_PRIMARY_CTA_PER_STATE_SAFETY_AWARE` | Primary CTA advances the safe next step; blocked CTA explains reason and recovery. |
| State System | `LOADING_ERROR_EMPTY_PERMISSION_BLOCKED_SUCCESS_RECOVERY_PER_CRITICAL_SURFACE` | States are not visuals only; they carry recovery and safety meaning. |
| Client/Internal Split | `CLIENT_SAFE_PROJECTION_SEPARATE_WHERE_NEEDED` | Client views are released/redacted projections, not reused internal surfaces. |
| Test System | `ROUTE_SMOKE_FLOW_RBAC_NO_LEAKAGE_A11Y_DENSITY_PROOF` | Structural UX changes require proof. |

### 9.2 Page-type target model

| Page Type | Purpose | When To Create New Route | When To Use Drawer | CTA Pattern | Density |
|---|---|---|---|---|---|
| Hub | Orient user, show priority work, explain status across a workspace. | If current route mixes multiple workstreams, or if navigation lacks a landing/triage surface. | Never for full workflow; hub may open lightweight previews only. | Continue / Review next / Resolve blockers. | D1/D2 |
| Queue | Select next item from a prioritized list. | If table/list and object detail/action crowd the same page. | Drawer preview can help triage; full decision goes to detail/decision route. | Open item / Assign / Filter / Review selected. | D3 |
| Workbench | Active task processing with context and action rail. | If current hub also executes workflow actions. | Drawer for secondary context/evidence snippets. | Review / Approve / Request evidence / Save draft. | D2 |
| Detail | Understand one object and its state. | If object has enough evidence, audit, related objects, or role-specific visibility. | Drawer for adjacent object snippets, not main decision. | Approve / Block / Attach / Export / Back. | D4 |
| Decision Room | Safety-critical approval/release/export decision surface. | When decision needs evidence, audit, compliance, consequences, and confirmation in one focused place. | Avoid destructive decisions only in drawer. | Approve / Release / Block / Request evidence / Cancel. | D4 |
| Client Projection | Released client-safe view. | If internal route cannot safely double as client route. | Limited drill-down only, always released/redacted. | View released summary / Upload requested evidence / Acknowledge receipt. | D1 |
| Reference | Documentation, state catalogue, roadmap, design/dev reference. | Already exists or can exist outside primary nav. | Not a product workflow drawer. | None or back to admin/reference. | D1 Doc |
| P1 / Hold Shell | Deferred or blocked capability placeholder. | Only when a registered route must remain addressable for future scope. | Not for active MVP decisions. | None except return/back. | D1/D2 deferred |

### 9.3 Navigation architecture

| Navigation Layer | Job | Rule |
|---|---|---|
| App Shell / Sidebar | Select major workspace/journey area. | Do not expose every route. Use role-aware workspace groups. |
| Topbar | Tenant, role, session, object/workspace context. | Do not duplicate sidebar. Show context and switcher state. |
| Page Header | Page job, current state, next step, object/tenant context. | Must answer: where am I, why am I here, what is next? |
| Workspace Hub | Orient and prioritize. | No full workflow execution on hub. |
| In-Flow Navigation | Move forward through journey steps. | Step labels, progress, next/previous, recovery. |
| Breadcrumb / Back / Up | Reverse safely. | Back returns to previous context; Up returns hierarchy; Cancel preserves or discards explicitly. |
| Contextual Sidebar / Action Rail | Object-specific secondary navigation and safe actions. | Only actions allowed by role/object/state. |

---

## 10. Candidate Route and Screen Refactoring Strategy

| Strategy ID | Area | Current Problem | Proposed UX Architecture | Route Evolution | Screen Evolution | Safety Caveat | Task-Pack Readiness |
|---|---|---|---|---|---|---|---|
| TRUE-UX-IA-001 | App Shell / Sidebar / Topbar / Header | Navigation likely maps feature groups and route list more than journey work. | Journey-first sidebar with role-aware workspaces; topbar for tenant/role/object; page header for page job/status/next step. | `ROUTE_DEPRECATE` for reference/P1/Hold from primary nav; no deletion. | Extract nav model, contextual header, next-step block. | Route visibility must not imply payload visibility. | Ready after live baseline recheck. |
| TRUE-UX-HUB-001 | Journey Hubs | No clear MVP journey hub layer for advisory/evidence/governance/export. | Create hubs for Advisory, Evidence, Governance, Export, Client Workspace if current nav lacks triage. | `ROUTE_CREATE_HUB` possible: `/advisory`, `/evidence-hub`, `/governance`, `/exports` if justified. | Hub surfaces show queues, blockers, next work. | Hubs orient only; no safety gate bypass. | Candidate; route-evolution records needed. |
| TRUE-UX-WBQ-001 | Workbench / Review Queues | Workbench/detail/queue may be mixed. | Separate queue from active workbench and detail/decision. | `ROUTE_SPLIT` or `ROUTE_CREATE_SUBROUTE`: `/workbench/review-queue`, `/workbench/triggers/:id/review`. | Queue + detail split; action rail. | Draft/internal content remains internal. | Candidate after component inspection. |
| TRUE-UX-EVD-001 | Evidence / Document Flow | Upload/list/review/evidence sufficiency may be visually conflated. | Evidence lifecycle: request → upload → extraction/review → link → sufficiency. | Possible `/documents/review-queue`, `/evidence/:id/review`, `/evidence/:id/sufficiency`. | Review queue, evidence detail, sufficiency decision room. | Upload success remains upload-only. | Strong candidate; P0 tests required. |
| TRUE-UX-AI-001 | Advisory / AI Draft / Analyst Review | AI/rules draft must be internal but may lack clear rejection/rebuild flow. | Internal draft workbench + unsupported claim review + evidence linking. | Possible subroutes under `/workbench` or keep existing `/signals`, `/workbench`, `/workbench/triggers/:id`. | Workbench detail with draft/evidence/rebuild action. | AI Draft internal-only; no client visibility. | Candidate; no-leakage tests mandatory. |
| TRUE-UX-APP-001 | Advisor Approval / Compliance Release | Approval, compliance review, release, block may need sharper decision separation. | Advisor decision page distinct from compliance decision room and client release. | Possible `/advisor-approval/:id/decision`, `/compliance/:id/decision-room`. | Decision room with evidence/audit/consequence/confirm. | Advisor approval != release; compliance release required. | Candidate; P0 workflow-gate tests required. |
| TRUE-UX-DEC-001 | Decision / Evidence / Audit Detail | Decision room may compete with audit/evidence/details. | Decision detail route with tabs/sections and audit/evidence drawer/context. | Keep `/decisions/:id`; maybe add `/decisions/:id/evidence`, `/decisions/:id/audit` only if detail overflows. | Detail + contextual drawers/tabs. | Audit display not persistence proof. | Candidate after page complexity inventory. |
| TRUE-UX-EXP-001 | Export / Redaction Flow | Export preview/approval/download/share can be conflated. | Explicit export step route sequence: scope → redaction → preview → approval → download/share. | Existing `/export/:id/*`; maybe add `/export/:id/approval` if missing. | Export decision room for approval. | Preview != approval; approval != download/share; no forbidden payload. | High candidate; export tests mandatory. |
| TRUE-UX-GOV-001 | Governance / RBAC / Access | Governance/admin pages may read like settings, not safety workflow. | Governance hub + role/access queue + audit history + second confirmation. | Possible `/governance` hub; keep `/governance/users`, `/roles`, `/access-requests`, `/audit-history`. | Hub + queues + detail drawers. | Admin non-bypass hard constraint. | Candidate; permission negative tests mandatory. |
| TRUE-UX-CLI-001 | Client Portal / Client Projection | Client view may not be sufficiently distinct from internal flow. | Separate released client-safe projection surfaces with hidden/empty/blocked states. | Possible `/portal/decisions/:id`, `/portal/evidence-requests/:id`; avoid exposing internal detail routes. | Client projection layout D1, upload/request response. | Fail-closed client visibility; no AI draft/internal rationale. | Candidate; no-leakage tests mandatory. |
| TRUE-UX-REF-001 | Reference / P1 / Hold Exposure | Reference/P1/Hold may pollute product IA. | Move to internal reference/developer nav or guarded direct links. | `ROUTE_DEPRECATE` from primary nav; no route removal unless decided. | Reference shell only. | No MVP scope elevation. | Ready after live nav inventory. |

---

## 11. Codex Task Derivation Model

### 11.1 New task classes

| Task Class | Purpose | May Create Routes? | May Split Screens? | Safety Requirement |
|---|---|---:|---:|---|
| `UX-BASELINE` | Re-inventory current code before task execution. | No | No | Must detect drift before changes. |
| `UX-IA` | App shell, nav hierarchy, labels, context model. | Yes | Yes | RBAC nav visibility and no payload leak. |
| `UX-ROUTE-EVO` | Route split/create/merge/deprecate. | Yes | Yes | Route policy, redirect/migration, route-smoke, safety tests. |
| `UX-PAGE-SPLIT` | Hub/workbench/detail/drawer separation. | Maybe | Yes | Page job, no scope drift, state coverage. |
| `UX-WORKBENCH` | Queue + active decision surfaces. | Maybe | Yes | Workflow state tests and internal-only draft rules. |
| `UX-DETAIL` | Object detail and decision room. | Maybe | Yes | Payload visibility and audit/evidence availability. |
| `UX-CLIENT-PROJECTION` | Client-safe released views. | Yes | Yes | No-leakage, fail-closed visibility tests. |
| `UX-CTA-STATE` | Next-step / blocked / recovery / success copy and behavior. | Usually no | Maybe | No-overclaim tests. |
| `UX-DENSITY` | Layout/grid/card/table hierarchy and density tiers. | Usually no | Yes | Accessibility/readability proof. |
| `UX-A11Y` | Focus, keyboard, ARIA, status, errors. | No | No | Accessibility proof for all interactive surfaces. |
| `UX-P0-SAFETY` | Positive/negative tests for gates. | No | No | Mandatory where route or payload safety is touched. |

### 11.2 Task readiness rules

A task is ready for Codex only if:

| Readiness Rule | Required Evidence |
|---|---|
| Current baseline checked | Live repo or newest ZIP inventory attached. |
| Route evolution reason explicit | Route record states UX reason, journey, role, page type. |
| Page job explicit | Surface has one primary job and page-type classification. |
| Source and target routes explicit | Current path(s), proposed path(s), route action (keep/split/create/deprecate). |
| Target files/components explicit | Component(s), route registry, navigation config, tests. |
| Safety boundaries explicit | RBAC, payload visibility, advice/evidence/audit/export caveat. |
| Acceptance criteria explicit | What user can do after refactor and what is prevented. |
| Validation commands explicit | Typecheck, lint, build, route-smoke, flow tests, safety tests. |
| Route smoke specified | All existing and new routes resolve or redirect correctly. |
| Migration/redirect/back compatibility addressed | Old route works, redirects, or is intentionally deprecated with test. |

### 11.3 Next required artefacts

| Order | Artefact | Purpose |
|---:|---|---|
| 1 | `ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md` | Route-by-route and candidate-new-route policy matrix including route evolution records. |
| 2 | `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md` | Journey-first plan with target IA, route splits, page splits, and flow proof requirements. |
| 3 | `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md` | Detailed route-evolution-aware Codex tasks with target files, steps, tests, stop rules. |
| 4 | `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Final executable Codex handoff with sequencing, validation commands, report obligations. |

### 11.4 Required task format for next task pack

| Field | Required Content |
|---|---|
| Task ID | `TRUE-UX-ROUTE-EVO-001`, `TRUE-UX-IA-001`, etc. |
| Task Class | From task classes above. |
| Baseline Evidence | Current route/component/test state. |
| Source Decision | Strategy section + route evolution policy + safety contract. |
| Current Route(s) | Existing paths/components. |
| Proposed Route(s) | New/changed/deprecated paths. |
| Page Job | Single primary page job per target surface. |
| Affected Journey | MJ mapping. |
| Affected Role(s) | Actor impact. |
| Target Files | Concrete files/components/tests. |
| Allowed Changes | Code changes allowed. |
| Forbidden Changes | Safety and scope stop rules. |
| Implementation Steps | Concrete steps. |
| Acceptance Criteria | User-visible and safety-visible outcome. |
| Validation Commands | Commands to run. |
| Proof Required | Screenshots, route smoke, flow proof, no-leakage proof, a11y proof. |
| Codex Stop Condition | When to stop and report. |

---

## 12. UX Refactoring Validation Model

| Proof Type | Purpose | Required For | Example Validation |
|---|---|---|---|
| Baseline proof | Confirm current live code before work. | All task packs | `git status`, route registry count, component/test inventory. |
| Route-smoke proof | All existing/new/redirect routes resolve. | Route evolution | `pnpm playwright test tests/route-smoke.spec.ts` plus new route cases. |
| Navigation proof | Main nav reflects IA and hides/deprioritizes reference/P1/hold. | `UX-IA`, hubs | Screenshot + Playwright click navigation. |
| Flow proof | User can complete target journey. | Top flows MJ-001/MJ-002/MJ-003/MJ-005/MJ-006/MJ-010 | Playwright flow test with success and blocked cases. |
| State proof | Loading/error/empty/permission/blocked/success/recovery states show correctly. | Critical surfaces | Component/page tests or Playwright assertions. |
| RBAC/no-leakage proof | Forbidden payloads do not render or return. | Client/internal split, new routes | Permission engine tests + client portal assertions. |
| CTA proof | One primary CTA per state; blocked CTAs explain recovery. | Workbenches/details/decision rooms | Screenshot review + DOM assertions. |
| Accessibility proof | Focus, keyboard, aria labels/status/errors. | Modals, drawers, forms, wizards, decision rooms | Keyboard path test; axe if available; focus visible checks. |
| Density proof | Above-the-fold status/page job/next step and layout hierarchy. | Page-type refactors | Screenshot comparison + page-type checklist. |
| Safety proof | No unapproved advice, upload-to-release, export-overclaim, admin bypass. | Safety-affecting tasks | Workflow gate, permission, upload, export tests. |

### 12.1 Recommended validation commands

Verify these against `package.json` before final task execution:

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm test:playwright
pnpm test:route-smoke
pnpm test:permissions
pnpm test:workflow-gate
pnpm test:workflow-api
pnpm playwright test tests/document-upload-api.spec.ts
pnpm playwright test tests/document-upload-flow.spec.ts
pnpm test:file-export
pnpm test:data-quality
```

The local snapshot `package.json` includes `phase:check`, `test:playwright`, `test:route-smoke`, `test:permissions`, `test:workflow-gate`, `test:workflow-api`, `test:file-export`, and `test:data-quality`. The live repo must still confirm current scripts before Codex runs.

---

## 13. Stop Rules

### 13.1 Stop immediately if

| Stop Rule | Why |
|---|---|
| Codex would need to decide financial/advice product policy. | Product policy must be human-decided. |
| A new route would expose client-visible internal data. | Client-safe projection must fail closed. |
| A route split weakens RBAC or payload visibility. | Route access is not payload visibility. |
| A CTA implies unapproved advice, compliance release, client acceptance, evidence sufficiency, or export approval falsely. | Success/CTA overclaim creates safety risk. |
| A screen split hides required audit/evidence/compliance context for a safety decision. | Decision rooms require full context. |
| Route evolution has no migration/redirect/navigation/test plan. | Broken flows are not acceptable refactoring. |
| Current baseline cannot be verified. | Moving baseline risk is explicit. |
| Existing parallel refactoring creates unresolved conflicts. | Codex must not overwrite unknown live changes. |
| New route requires schema/API not covered by existing contracts. | Need explicit API/schema decision before implementation. |
| Accessibility/focus/error behavior for a modal/drawer/wizard cannot be specified. | Flow quality includes accessibility. |

### 13.2 Do not stop merely because

| Allowed Situation | Condition |
|---|---|
| A new route is needed. | Route-evolution record + tests exist. |
| A page must be split. | Page job separation and journey benefit are explicit. |
| A new hub is needed. | Hub orients/prioritizes without scope inflation. |
| A new detail page is needed. | Object detail needs focused state/evidence/audit/context. |
| A drawer should become a route. | The drawer contains full workflow/safety decision complexity. |
| A route should become a drawer preview. | It is lightweight context and deep linking is not required. |
| Navigation must be restructured. | Role/object/journey logic and route policy are explicit. |
| A component must be extracted. | It improves reuse, page-type discipline, accessibility, or maintainability. |
| A page appears fixed in older matrices. | Older no-route/no-screen-split constraints are superseded. |
| Route count changes. | Route count change is justified, documented, and tested. |

---

## 14. Decision Summary for the User

Deine Korrektur ist richtig: Der bisherige UX-Refactoring-Ansatz war zu defensiv. Er hat wichtige Sicherheitsgrenzen geschützt, aber dabei echte UX-Architektur fälschlich eingeschränkt. Ein schlechter Flow wird nicht automatisch gut, wenn man dieselben Screens nur enger, ruhiger oder hübscher macht.

Die neue Strategie lautet:

1. **Neue Routen sind erlaubt**, wenn sie einen Flow verbessern und eine Route-Evolution-Policy mit Tests haben.
2. **Screen-Splitting ist erlaubt**, wenn eine Seite mehrere Jobs gleichzeitig erledigt und dadurch Nutzer verwirrt.
3. **Neue Hubs, Detailseiten, Decision Rooms, Review Queues und Client Projection Pages sind erlaubt**, wenn sie Journey-Führung, page job clarity, progressive disclosure oder safety clarity verbessern.
4. **Automatische Bild-/Screen-Generation bleibt nicht automatisch erlaubt**; aber **coded React surfaces / routes / components** dürfen entstehen.
5. **Safety bleibt hart:** keine client-visible AI drafts, keine unapproved advice, kein admin bypass, kein upload-to-release, kein export-overclaim.
6. **Die parallel laufende Refactoring-Basis muss vor neuen Codex-Tasks neu geprüft werden.** Alte Artefakte sind nicht blind aktuell.

Der nächste beste Schritt ist nicht, den alten UX Task Master weiterzubenutzen. Der nächste Schritt ist ein neuer, route-evolution-fähiger Task-Pack:

```text
ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md
ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md
ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md
ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md
```

Erst dieser neue Pfad kann Codex wirklich erlauben, echte UX zu refactoren: Navigation ändern, Routen splitten, Hubs schaffen, Detailseiten auslagern, Decision Rooms bauen, Client/Internal trennen und die App von einem Clickdummy in eine echte Workflow-Anwendung überführen.

---

## 15. ENGINE Proof / QA

### 15.1 ENGINE_v3 phase proof

| Phase | Applied | Proof |
|---|---|---|
| Charter | Target artefact and decisions defined in section 1. | Strategy, not implementation. |
| Evidence | Online research and local ZIP baseline are separated. | Research table + moving baseline check. |
| Framing | Problem reframed from “avoid route changes” to “govern route evolution.” | Superseded false constraints section. |
| Divergence | Route and screen evolution types provide multiple valid refactor paths. | Keep/split/create/merge/deprecate/remove taxonomy. |
| Contradictions | Stop vs do-not-stop rules distinguish safety blockers from false blockers. | New routes allowed; safety bypass blocked. |
| Branch Build | Strategy candidates cover IA, hubs, evidence, advisory, approval, export, governance, client projection. | Candidate strategy table. |
| Debate | Old constraints explicitly judged as false or hard. | Constraint tables. |
| Adversarial | Safety, baseline drift, route migration, no-leakage, no-overclaim stop rules. | Section 13. |
| Convergence | Target architecture and task derivation model define next artefacts. | Sections 9–11. |
| Proof | Validation model defines route, flow, state, RBAC, accessibility, density proof. | Section 12. |
| Learning | Moving baseline and drift are explicit. | Section 4. |

### 15.2 ENGINE_v2 method proof

| Method | Applied | Result |
|---|---|---|
| Psycho-Logic | Navigation and CTA doctrine. | Users regain orientation, control, trust, and clear next step. |
| Double Diamond | Research/diagnosis before target architecture/task model. | Avoids solving too early. |
| Reframing Matrix | False constraints transformed into route evolution policy. | “No routes” becomes “controlled route evolution.” |
| TRIZ | Stop/do-not-stop contradiction resolution. | Structural UX change is allowed without weakening safety. |
| SIT / Closed World | Local code baseline inspected first. | Uses existing routes/components but allows evolution. |
| Morphological Analysis | Route/screen/task class taxonomies. | Complex UX work becomes controllable dimensions. |
| SCAMPER | Split, extract, merge, deprecate, create patterns. | Supports real refactoring, not cosmetic cleanup. |
| Harvard / Principled Negotiation | UX flexibility vs safety constraints. | Separates negotiable architecture from non-negotiable advice/visibility safety. |
| MESOs | Candidate route/screen strategies. | Multiple valid strategies before final task pack. |
| Measurement Plan | Validation model. | Future Codex tasks require proof. |
| Ethics & Fairness | Client visibility, RBAC, no-leakage, advice boundary. | UX cannot mislead or expose unsafe content. |

### 15.3 ENGINE_v2-B handoff discipline proof

| Handoff Need | Included | Location |
|---|---|---|
| Future task classes | Yes | Section 11.1 |
| Route evolution record | Yes | Section 7.3 |
| Allowed changes | Yes | Sections 7 and 13.2 |
| Forbidden changes | Yes | Section 13.1 |
| Baseline checks | Yes | Section 4 |
| Validation commands | Yes | Section 12.1 |
| Safety mapping | Yes | Sections 5, 7, 12, 13 |
| No implementation now | Yes | Header and executive decision |
| Next artefacts | Yes | Section 11.3 |

### 15.4 Final QA

| QA Check | Result |
|---|---|
| Online UX research summarized | PASS |
| AlphaVest application concrete | PASS |
| Old no-new-routes logic reclassified | PASS |
| New routes allowed with policy | PASS |
| Screen splitting allowed with proof | PASS |
| Hard safety constraints preserved | PASS |
| Moving baseline considered | PASS |
| Route/screen evolution types defined | PASS |
| Candidate AlphaVest strategy groups defined | PASS |
| Codex task derivation path defined | PASS |
| No implementation started | PASS |
| No final Codex tasks created | PASS |
| No safety weakening authorized | PASS |
| ENGINE_v2 and ENGINE_v3 applied | PASS |
