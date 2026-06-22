# ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE_AND_ROUTE_EVOLUTION_POLICY
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


**Generated:** 2026-06-22  
**Mode:** Governance / decision policy only. Keine Implementierung. Keine Codeänderung. Keine Codex-Ausführung. Kein finaler Implementation Handoff. Keine automatische Screen-, State-Screen- oder Image-Generation.  
**Target project:** AlphaVest WealthOS  
**Target branch:** `full-workflow`  
**Primary purpose:** Establish the decision authority and route/screen evolution policy required before a true UX-flow refactoring plan and Codex task pack can be created.

---

## 1. Executive Decision

**Artefact status:** `DECISION_GOVERNANCE_APPROVED_BY_PRODUCT_OWNER`

**Governance decision:** AlphaVest may now move from restrictive UX clean-up into **true UX flow refactoring**. Earlier blanket constraints such as "no new routes", "no screen splitting", "P1 always deferred" and "Hold always blocked" are superseded as false constraints. They are replaced by governed route/screen evolution with records, safety checks and tests.

| Decision Area | Decision | Meaning |
|---|---|---|
| Governance status | `DECISION_GOVERNANCE_APPROVED_BY_PRODUCT_OWNER` | This artefact is the governing decision layer for the next UX refactoring artefacts. |
| P1/Hold elevation | `P1_AND_HOLD_TO_MVP_APPROVED_WITH_SAFETY_RECHECK` | Former P1 and Hold routes may be moved into MVP implementation scope. They are no longer automatically blocked. |
| UX strategy proposals | `AUTO_APPROVED_UNLESS_SAFETY_CONFLICT` | UX strategy proposals do not need new Product Owner approval if they follow this governance and do not violate hard constraints. |
| Route evolution | `ALLOWED_WITH_ROUTE_EVOLUTION_RECORD` | New routes, subroutes, hubs, details, decision rooms, client projections and route splits are allowed when documented. |
| Screen splitting | `ALLOWED_WITH_ALTERNATIVE_ASSESSMENT` | Screen splits are allowed only after comparing no split, simple split, multiple split and multiple split plus merge. |
| Screen merging | `ALLOWED_WHEN_IT_REDUCES_DUPLICATION_WITHOUT_LOSS_OF_PAGE_JOB` | Merging is allowed when it simplifies duplicated or contradictory flows while preserving ownership, safety and page jobs. |
| Codex autonomy | `TECHNICAL_IMPLEMENTATION_ONLY_AFTER_HANDOFF` | Codex may decide technical implementation details only after a final implementation handoff. |
| Safety constraints | `REMAIN_HARD_NON_NEGOTIABLE` | Product Owner auto-approval does not override safety, RBAC, client visibility, advice boundary, evidence, audit or export constraints. |
| Moving baseline | `CURRENT_BASELINE_RECHECK_REQUIRED_BEFORE_TASKS` | Before any task pack, the current `full-workflow` branch/working tree or latest ZIP must be re-inventoried. |

**Practical interpretation:** The Product Owner has already approved the strategic shift. The next artefacts may propose and task new route structures and screen splits without waiting for further Product Owner permission. However, each structural change must have a record, a clear UX reason, a safety policy, a migration/navigation plan and test obligations.

---

## 2. Source-of-Truth Applied

| Rank | Source | Use | Governance Decision | Limit |
|---:|---|---|---|---|
| 1 | Current Product Owner instruction | Authorizes P1/Hold→MVP, UX auto-approval and governed screen splits | `HIGHEST_DECISION_AUTHORITY_FOR_UX_GOVERNANCE` | Does not override hard safety constraints. |
| 2 | Current `full-workflow` repo / working tree or latest ZIP | Current implementation reality after parallel refactoring | `MOVING_BASELINE_REQUIRED` | Must be rechecked before task pack; old artefacts may be stale. |
| 3 | `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN.md` | True UX doctrine and route/screen evolution model | `STRATEGY_PREDECESSOR` | Strategy only; not implementation. |
| 4 | `ALPHAVEST_UX_NAVIGATION_PAGE_DENSITY_CTA_DECISION_BRIEF.md` | Navigation, page type, density and CTA decision history | `REBASE_INPUT` | Earlier route restrictions must be superseded. |
| 5 | `ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md` | Historical route policy | `REBASE_REQUIRED` | P1/Hold blocking is superseded by Product Owner approval. |
| 6 | `ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md` | Historical task master | `REBASE_REQUIRED` | Must not be executed blindly; new governance changes task eligibility. |
| 7 | MVP / route / safety / schema / test artefacts | Product and safety constraints | `SAFETY_CONTEXT_REMAINS_BINDING` | Route scope may evolve; safety cannot be weakened. |
| 8 | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` | Existing implementation boundary pattern | `REFERENCE_FOR_HANDOFF_DISCIPLINE` | Not a final UX handoff for this new governance. |
| 9 | `control-spec concepts represented in bundled markdown artefacts; no patch archive included` | Control spec | `CONTROL_SPEC_ONLY` | Not code or schema replacement. |
| 10 | `main` branch / `main` ZIP | False-gap warning only | `FALSE_GAP_SOURCE_ONLY` | Never target truth. |

### Moving Baseline Rule

Because another refactoring is being implemented in parallel, every downstream artefact must begin with a current baseline check before deriving tasks:

| Check | Required before Task Pack? | Reason |
|---|---:|---|
| current branch / target source | Yes | Prevents tasks from using stale assumptions. |
| current route registry | Yes | Route count and paths may have changed. |
| current App Shell / Sidebar / Topbar / Page Header | Yes | Navigation work may already be partly implemented. |
| current page components | Yes | Screen split candidates may already be changed. |
| current tests | Yes | Existing proof and missing proof may have shifted. |
| current pending diffs | Yes | Avoids conflict with ongoing implementation. |

---

## 3. Product Owner Freigaben

| Freigabe ID | Decision | Scope | What It Allows | What It Does Not Allow | Required Proof |
|---|---|---|---|---|---|
| `PO-UX-001` | P1 routes may be elevated into MVP implementation scope. | Former `P1_AFTER_MVP` routes, including `052`, `053`, `059`, `060`, `068`. | These routes may receive MVP UX architecture, tasking and implementation treatment. | Does not allow safety weakening, payload leakage, or untested release/advice behaviour. | Current baseline check, scope elevation record, safety recheck, route/flow tests. |
| `PO-UX-002` | Hold routes may be elevated into MVP implementation scope. | Former `HOLD_PENDING_DECISION` routes, including `064`, `065`, `066`, `067`, `069`, `070`, `071`. | These routes may be unlocked for route evolution, UX architecture and Codex tasking. | Does not automatically approve unresolved KYC, suitability, committee, rebalance or advice policy semantics. | Safety review, route evolution record, P0 negative tests, no-leakage proof. |
| `PO-UX-003` | UX strategy recommendations are auto-approved unless they violate hard constraints. | IA, navigation, page type, route evolution, screen split, density, CTA and state model proposals. | No new Product Owner approval loop is required for each UX strategy decision. | Does not let Codex improvise without records, tests or final handoff. | Decision record or task source decision, acceptance criteria, validation plan. |
| `PO-UX-004` | New routes and subroutes are allowed if a route evolution record exists. | Hubs, subroutes, details, queues, decision rooms, client projections and step routes. | Route creation can be part of true UX refactoring. | Does not allow route sprawl, hidden safety scope changes, or untested nav. | Route Evolution Record, route-smoke, navigation proof, safety proof if relevant. |
| `PO-UX-005` | Screen splits are allowed if alternatives were assessed. | Overloaded pages, mixed hubs/workbenches/details, cards/tables/drawers/decision surfaces. | Simple or multiple screen splits can be selected. | Does not allow splitting by taste alone. | Screen Split Decision Record, alternative scoring, page job proof. |
| `PO-UX-006` | Multiple splits plus merge with adjacent routes/screens are allowed. | Duplicated or fragmented flows across related screens. | Screens/routes may be split and partially merged to improve flow coherence. | Does not allow losing audit/evidence/compliance context or ownership clarity. | Flow coherence proof, migration/redirect plan, safety and regression tests. |

---

## 4. Decision Governance Model

The decision model separates **what is already approved**, **what can be auto-decided by UX strategy**, **what Codex can decide technically**, and **what remains non-negotiable**.

| Level | Decision Type | Owner | Grundlage | Codex Role | Requires Human Approval? |
|---:|---|---|---|---|---:|
| 1 | Hard Safety / Compliance / Advice Boundary Decisions | Product / Safety contracts | MVP control rules, RBAC, client visibility, advice boundary, evidence/audit/export contracts | Implement and test only | No new approval; already hard locked. Safety conflict pauses work. |
| 2 | Product Scope / P1-Hold-to-MVP Elevation | Product Owner | Current user instruction | Execute only after records and tests | Already approved globally; per-route safety recheck required. |
| 3 | UX Strategy / IA / Route Evolution Decisions | UX Strategy under PO auto-approval | True UX doctrine, UX research, current baseline, route evolution records | Implement after final handoff | Auto-approved unless safety conflict. |
| 4 | Screen Split / Merge Architecture Decisions | UX Strategy under PO auto-approval | Alternative assessment, page job clarity, flow coherence | Implement chosen option after final handoff | Auto-approved if assessment complete and safe. |
| 5 | Page-Type / Density / CTA Pattern Decisions | UX Strategy | Page type model, density tiers, flow state, CTA rules | Implement patterns | Auto-approved unless safety conflict. |
| 6 | Technical Component / File Implementation Decisions | Codex after final handoff | Task pack, target files, acceptance criteria | May decide implementation details | No, if inside task and no policy invention. |
| 7 | Test / Proof / Reporting Decisions | Task pack + Codex within handoff | P0, route-smoke, flow, RBAC, no-leakage, accessibility proof | Write/run/update tests and report | No, if tests match accepted criteria. |

### Governance Principle

**Product Owner approval removes friction, not discipline.** Auto-approval means no repeated manual permission is needed for every UX proposal, but it does not remove the need for records, evidence, alternatives, safety checks, acceptance criteria and tests.

---

## 5. Decision Authority Matrix

| Decision | Default Owner | Auto-Approved? | Evidence Required | Blocking Condition | Codex Allowed To Decide? |
|---|---|---:|---|---|---:|
| New hub route | UX Strategy | Yes | Journey/IA reason, route evolution record, nav proof | Safety conflict or no clear hub job | No; Codex may implement only after handoff. |
| New detail route | UX Strategy | Yes | Object/page-job reason, RBAC/payload caveat | Payload visibility unclear | No. |
| New decision room route | UX Strategy + Safety contracts | Yes, if safety proof defined | Decision context, approval/release/export distinction, P0 tests | Advice/release/export semantics unclear | No. |
| New queue/workbench route | UX Strategy | Yes | Actor/task queue need, flow proof | Duplicates existing queue without merge plan | No. |
| New client projection route | UX Strategy + Safety contracts | Yes, if fail-closed proof defined | Client-safe content model, no-leakage tests | Internal/client surface mixed without redaction | No. |
| Route split | UX Strategy | Yes | Route Evolution Record + alternative assessment where screen split involved | No migration/nav/test plan | No. |
| Route merge | UX Strategy | Yes, conditional | Duplication proof, no loss of page job | Merge hides safety-critical context | No. |
| Route deprecation / removal from main nav | UX Strategy | Yes | IA reason, compatibility/redirect plan | Route still required for core flow and no replacement | No. |
| Drawer becomes detail page | UX Strategy | Yes | Detail depth or safety-critical decision need | New route exposes forbidden payload | No. |
| Detail page becomes drawer preview | UX Strategy | Yes, conditional | Page has no standalone job, no safety-critical decision | Loses audit/evidence/compliance context | No. |
| Hub split from workbench | UX Strategy | Yes | Hub job vs active work job conflict | Split worsens journey continuity | No. |
| Workbench split from detail | UX Strategy | Yes | Active queue/action vs object decision conflict | User must jump too often without need | No. |
| Multiple screen split | UX Strategy | Yes, if scored | Multiple page jobs, flow map, test plan | Complexity increases without clarity | No. |
| Multiple split plus merge | UX Strategy | Yes, if scored | Duplicate/fragmented flows, merge rationale | Merge weakens ownership or safety | No. |
| Page Type assignment | UX Strategy | Yes | Page job, route role, actor goal | Conflicts with hard safety surface type | No. |
| Density tier assignment | UX Strategy | Yes | Page type, actor/task intensity | Readability/accessibility concern | No. |
| Primary CTA per state | UX Strategy | Yes | Flow state, blocked/recovery/success rules | CTA overclaims safety outcome | No. |
| Safety gate presentation | Safety contracts + UX Strategy | Yes for presentation, not policy | Gate state, blocker reason, recovery | Rewords gate as false success | No. |
| Client visibility projection | Safety contracts | No policy invention; UX implementation auto-approved | Released/redacted/client-safe payload rules | Potential leakage | No. |
| RBAC payload visibility | Safety contracts | No policy invention; implementation auto-approved | Role/action/object/payload matrix | Unclear permission semantics | No. |
| Test creation / update | Task pack / Codex | Yes | Acceptance criteria and P0 obligations | Tests would encode wrong policy | Yes, inside handoff. |

---

## 6. Superseded vs. Still-Hard Constraints

### 6.1 Superseded False Constraints

| Old Constraint | New Status | Replacement Rule | Why | Codex Implication |
|---|---|---|---|---|
| No new routes | `SUPERSEDED_FALSE_CONSTRAINT` | New routes allowed with Route Evolution Record, navigation/migration plan and tests. | True UX flow often requires hubs, subroutes, detail routes, queues or decision rooms. | Codex may create routes only when explicitly tasked from a record. |
| No screen splitting | `SUPERSEDED_FALSE_CONSTRAINT` | Screen splitting allowed with alternative assessment and page-job proof. | Overloaded pages often cannot be fixed by spacing alone. | Codex may split components/pages if task references split decision. |
| No new page components | `SUPERSEDED_FALSE_CONSTRAINT` | New components allowed when they encode reusable page types or flow patterns. | Good UX may require focused components instead of mega-components. | Codex may create/extract components inside task scope. |
| No structural IA changes | `SUPERSEDED_FALSE_CONSTRAINT` | IA restructuring is allowed under journey-first, role-aware, object-contextual model. | Poor navigation is often an IA problem, not a visual problem. | Codex may change App Shell/Sidebar/Topbar/Header after handoff. |
| Preserve route count exactly | `SUPERSEDED_FALSE_CONSTRAINT` | Route count may change if route evolution is documented and tested. | Route count is not a quality metric. | Route registry may change when task authorizes it. |
| P1 always deferred | `SUPERSEDED_FALSE_CONSTRAINT` | Former P1 may enter MVP after Product Owner approval and safety recheck. | PO has approved P1→MVP. | P1 routes can be tasked after elevation record. |
| Hold always blocked | `SUPERSEDED_FALSE_CONSTRAINT` | Former Hold may enter MVP after Product Owner approval and safety recheck. | PO has approved Hold→MVP. | Hold routes can be tasked after elevation/safety record. |

### 6.2 Still-Hard Constraints

| Constraint | Status | Why Hard | Applies To | Proof Required |
|---|---|---|---|---|
| No unapproved advice | `HARD_NON_NEGOTIABLE` | AlphaVest is human-backed, not autonomous advice. | Client routes, recommendations, decisions, exports | No-leakage tests, workflow gate tests. |
| AI Draft internal-only | `HARD_NON_NEGOTIABLE` | Internal preparation must not become client-visible advice. | Workbench, recommendations, export, client projection | Payload redaction and negative tests. |
| Client visibility fail-closed | `HARD_NON_NEGOTIABLE` | Client sees only released/redacted/client-safe output. | Portal, mobile, export, evidence summaries | Fail-closed state tests, no-leakage tests. |
| Advisor approval != compliance release | `HARD_NON_NEGOTIABLE` | Human advice review and compliance release are distinct gates. | Advisor and compliance flows | Workflow state and negative tests. |
| Compliance release != client acceptance | `HARD_NON_NEGOTIABLE` | Release is not acceptance, execution or understanding by client. | Client projection and export | Feedback wording and flow tests. |
| Upload success != evidence sufficiency | `HARD_NON_NEGOTIABLE` | File transfer does not prove relevance, review or sufficiency. | Documents/evidence/compliance | Upload negative tests, evidence sufficiency tests. |
| Export preview != approval/download/share | `HARD_NON_NEGOTIABLE` | Preview, approval and distribution are separate safety events. | Export flow | Export redaction and approval tests. |
| Admin non-bypass | `HARD_NON_NEGOTIABLE` | Admin config power must not force release, visibility or evidence sufficiency. | Admin/governance/compliance/export | Permission and bypass negative tests. |
| Route access != payload visibility | `HARD_NON_NEGOTIABLE` | Seeing a shell does not mean seeing sensitive data. | All role-sensitive routes | RBAC/payload tests. |
| No blind schema replacement | `HARD_NON_NEGOTIABLE` | Full-workflow schema remains baseline unless explicitly changed by later accepted task. | Prisma/schema/services/tests | Schema change review and migration proof if ever needed. |
| No `main` target truth | `HARD_NON_NEGOTIABLE` | `main` has been a false-gap source. | All planning and Codex tasks | Target branch/source confirmation. |

---

## 7. P1/Hold-to-MVP Elevation Policy

Former P1 and Hold classification no longer blocks MVP implementation. It becomes a **former-scope label** that triggers a safety and baseline recheck.

| Former Scope | New Governance Status | Required Recheck | Allowed Task Types | Mandatory Safety Proof | Stop Conditions |
|---|---|---|---|---|---|
| `P1_AFTER_MVP` | `MVP_ELEVATION_APPROVED_BY_PO` | Current route/component/API/test baseline; route purpose; safety relevance | UX-IA, UX-ROUTE-EVO, UX-PAGE-SPLIT, UX-WORKBENCH, UX-DETAIL, UX-CTA-STATE, UX-P0-SAFETY | route-smoke, navigation proof, RBAC where sensitive, no-overclaim feedback | Baseline conflict, route duplicates better solved by merge, safety ambiguity. |
| `HOLD_PENDING_DECISION` | `MVP_ELEVATION_APPROVED_BY_PO_WITH_SAFETY_RECHECK` | Current implementation reality, missing visual/assets, route purpose, safety semantics, policy ambiguity | UX-ROUTE-EVO, UX-DETAIL, UX-DECISION-ROOM, UX-CLIENT-PROJECTION, UX-P0-SAFETY | RBAC/no-leakage/advice-boundary/evidence/audit/export P0 proof as relevant | Advice policy undefined, client visibility unclear, KYC/suitability/committee semantics unresolved. |
| `REFERENCE_ONLY` | `NOT_AUTOMATICALLY_PRODUCTIZED` | Check if reference page is being used as product navigation | Usually deprecate from main nav, not convert | N/A unless converted via explicit Route Evolution Record | Attempt to make reference page a product flow without page-job proof. |

### Elevation Record Requirement

Every former P1/Hold route moved into MVP work must receive either:

1. a `Route Evolution Record`, if route/path/page structure changes; or  
2. a `Scope Elevation Record`, if the route remains but becomes MVP task-eligible.

Minimum fields for scope elevation:

| Field | Required Content |
|---|---|
| Elevation ID | `UX-SCOPE-ELEV-###` |
| Former Scope | P1 / Hold |
| New Status | MVP implementation candidate |
| Product Owner Basis | `P1_AND_HOLD_TO_MVP_APPROVED_WITH_SAFETY_RECHECK` |
| UX Reason | Why route is needed for true UX flow |
| Safety Review | Risks and non-negotiables |
| Tests Required | Route, flow, RBAC, no-leakage, workflow, export/evidence as applicable |
| Stop Conditions | Any unresolved policy/safety conflict |

---

## 8. UX Strategy Auto-Approval Policy

`AUTO_APPROVED_UNLESS_SAFETY_CONFLICT` means the UX strategy no longer needs manual Product Owner approval for each recommendation. It does **not** mean Codex can implement undocumented decisions.

| UX Proposal Type | Auto-Approved? | Conditions | Required Record | Safety Override |
|---|---:|---|---|---|
| Route create | Yes | Clear journey/page job, no safety conflict, tests defined | Route Evolution Record | `SAFETY_REVIEW_REQUIRED` if payload/advice/client visibility affected. |
| Subroute create | Yes | Step/detail/queue reason and nav integration | Route Evolution Record | Stop if route exposes internal-only data. |
| Screen split | Yes | Alternative assessment completed | Screen Split Decision Record | Stop if split hides required evidence/audit/compliance context. |
| Screen merge | Yes | Reduces duplication and preserves ownership/page jobs | Screen Split Decision Record or Route Evolution Record | Stop if merge weakens RBAC or safety context. |
| Hub create | Yes | Orientation and prioritization purpose | Route Evolution Record | Stop if hub becomes product action surface without controls. |
| Workbench create | Yes | Active task processing surface needed | Route Evolution Record | Stop if actions bypass workflow gates. |
| Detail page create | Yes | Object review needs depth | Route Evolution Record | Stop if payload visibility unclear. |
| Decision room create | Yes | Safety-critical approval/block/release/export decision needs full context | Route Evolution Record + Safety proof | Stop if decision semantics are undefined. |
| Client projection create | Yes | Internal/client-safe views are mixed or client needs released view | Route Evolution Record + Client visibility proof | Stop on leakage risk. |
| Drawer extraction | Yes | Secondary/contextual detail only | Screen Split Decision Record | Stop if drawer carries primary safety decision. |
| Component extraction | Yes | Reusable pattern improves maintainability and consistency | Task source decision | Stop if extraction changes behaviour without tests. |
| IA/sidebar restructuring | Yes | Journey-first/role-aware/object-contextual navigation improves flow | UX-IA decision record | Stop if navigation implies unauthorized route/payload access. |
| CTA model change | Yes | One primary CTA per state and no-overclaim rules met | CTA/State decision | Stop if CTA implies false gate completion. |
| Density model change | Yes | Page type and readability/accessibility considered | Density decision | Stop if density harms scanability/accessibility. |
| Feedback/state model change | Yes | State, recovery and blocked logic aligned | State/Feedback decision | Stop if feedback overclaims success. |

---

## 9. Route Evolution Governance

| Evolution Type | Allowed? | Auto-Approved? | Required Evidence | Required Tests | Example |
|---|---:|---:|---|---|---|
| `ROUTE_KEEP` | Yes | Yes | Existing route has clear page job after refactor | Existing route-smoke, page/flow proof | Improve `/workbench` without changing path. |
| `ROUTE_SPLIT` | Yes | Yes | Current route has multiple page jobs; split improves flow | route-smoke for old/new, navigation, flow tests | Split `/documents` into list + review detail. |
| `ROUTE_CREATE_SUBROUTE` | Yes | Yes | Substep/detail/review needs own URL/state | route-smoke, back/forward/recovery tests | `/export/:id/approval`. |
| `ROUTE_CREATE_HUB` | Yes | Yes | Area needs orientation, status and priority | route-smoke, navigation screenshot/proof | `/advisory` or `/governance` hub. |
| `ROUTE_CREATE_DETAIL` | Yes | Yes | Object requires focused review and payload rules | route-smoke, RBAC/payload tests | `/evidence/:id/review`. |
| `ROUTE_CREATE_DECISION_ROOM` | Yes | Yes | Approval/block/release/export needs full context | workflow, RBAC, no-overclaim, audit tests | `/compliance/:id/decision-room`. |
| `ROUTE_CREATE_CLIENT_PROJECTION` | Yes | Yes | Client-safe surface must be separate from internal view | no-leakage, client visibility tests | `/portal/decisions/:id`. |
| `ROUTE_CREATE_QUEUE` | Yes | Yes | Actor needs next-work queue separate from detail | route, filter, row-action, keyboard tests | `/advisor-approval/queue`. |
| `ROUTE_MERGE` | Conditional | Yes if no safety loss | Duplication/fragmentation proof and merge plan | regression tests, route redirects if needed | Merge duplicate evidence previews. |
| `ROUTE_DEPRECATE_FROM_NAV` | Conditional | Yes | Route no longer belongs in primary nav but remains accessible/redirected | route-smoke, nav proof | Remove reference pages from primary workflow nav. |
| `ROUTE_REMOVE` | Rare | No automatic implementation; strategy may recommend | Route proven obsolete/out-of-scope and safe to remove | route tests updated, migration/redirect proof | Remove obsolete demo-only surface after approval in task pack. |

### Route Evolution Governance Rules

1. New route count is allowed to increase.  
2. Route registry may change only from an accepted Route Evolution Record.  
3. New routes must have page type, actor, page job, primary CTA and safety policy.  
4. Former P1/Hold routes are no longer blocked, but they require safety recheck.  
5. Reference pages do not become product flows without explicit page-job and route evolution justification.  
6. Deprecation from navigation is preferred over deletion unless deletion is proven safe.

---

## 10. Screen Split / Merge Decision Framework

Screen splitting is allowed, but it must be intentional. Every split candidate must compare alternatives instead of jumping directly to a preferred architecture.

| Split Option | Meaning | Use When | Avoid When | Required Proof | Example |
|---|---|---|---|---|---|
| `NO_SPLIT_REFINE_IN_PLACE` | Screen remains one surface, but hierarchy, CTA, density and sections are cleaned up. | Complexity is mostly visual or content-order related. | The screen has multiple real page jobs. | Before/after page-job and density proof. | Page header + CTA cleanup. |
| `SIMPLE_SPLIT` | One page becomes two clear surfaces. | Hub vs detail or queue vs detail is enough. | Three or more distinct page jobs exist. | Page-job proof, route/nav plan. | `/documents` + `/documents/:id`. |
| `MULTIPLE_SPLIT` | One page becomes multiple specialized surfaces. | Hub, queue, workbench, detail and decision jobs are all mixed. | It creates route hopping without better flow. | Journey continuity proof, route-smoke, flow tests. | `/workbench`, `/workbench/queue`, `/workbench/:id`. |
| `MULTIPLE_SPLIT_PLUS_MERGE` | Page is split and parts are merged with adjacent routes or flows. | Adjacent routes duplicate or fragment the same work. | Merge weakens ownership or safety boundaries. | Flow coherence proof, duplication analysis, safety tests. | Evidence detail merged into Decision Room context while keeping evidence record route. |
| `DRAWER_EXTRACTION` | Secondary details move into drawer. | Detail is short/contextual and should not interrupt workflow. | Content is decision-critical or too deep. | Interaction/focus/keyboard proof. | Evidence or audit preview drawer. |
| `DRAWER_TO_ROUTE_PROMOTION` | Drawer becomes standalone detail route. | Drawer contains deep or safety-critical decision context. | Drawer is only short context. | Route/safety/payload proof. | Compliance evidence review detail. |
| `ROUTE_TO_DRAWER_DEMOTION` | Standalone detail route becomes drawer preview. | Route has no standalone page job. | Route is safety-critical or needs deep state. | No-loss proof and route deprecation plan. | Secondary entity preview. |

---

## 11. Screen Split Alternative Assessment Model

### 11.1 Mandatory Alternatives

For every screen split candidate, assess at least:

1. `NO_SPLIT_REFINE_IN_PLACE`  
2. `SIMPLE_SPLIT`  
3. `MULTIPLE_SPLIT`  
4. `MULTIPLE_SPLIT_PLUS_MERGE`

Optional where relevant:

5. `DRAWER_EXTRACTION`  
6. `DRAWER_TO_ROUTE_PROMOTION`  
7. `ROUTE_TO_DRAWER_DEMOTION`

### 11.2 Scoring Matrix

Use 1–5 per criterion. Higher is better. Weights are guidance and may be adjusted with reason.

| Criterion | Weight | NO_SPLIT | SIMPLE_SPLIT | MULTIPLE_SPLIT | MULTIPLE_PLUS_MERGE | Notes |
|---|---:|---:|---:|---:|---:|---|
| Page Job Clarity | 5 | score | score | score | score | Does each resulting surface have exactly one primary job? |
| Journey Continuity | 5 | score | score | score | score | Does the user follow a clearer path? |
| Cognitive Load Reduction | 4 | score | score | score | score | Does the user see less irrelevant content at each moment? |
| Navigation Simplicity | 4 | score | score | score | score | Does the model avoid unnecessary jumping? |
| Safety / Visibility Preservation | 5 | score | score | score | score | Are RBAC, evidence, audit, advice and client visibility preserved? |
| Implementation Complexity | 3 | score | score | score | score | Is the implementation manageable? |
| Testability | 4 | score | score | score | score | Can route/flow/state/safety tests prove it? |
| Backward Compatibility | 3 | score | score | score | score | Are old links/nav states handled? |
| Reuse / Component Quality | 3 | score | score | score | score | Does it create reusable patterns? |
| User Recovery / Back/Cancel | 4 | score | score | score | score | Can the user exit/recover without losing context? |

### 11.3 Decision Rules

| Rule | Action |
|---|---|
| If `NO_SPLIT` cannot produce one clear page job | Kill `NO_SPLIT`. |
| If `SIMPLE_SPLIT` fully solves page job and flow clarity | Prefer `SIMPLE_SPLIT` over multiple split. |
| If the source screen has three or more distinct jobs | Evaluate `MULTIPLE_SPLIT`. |
| If adjacent routes duplicate or fragment the same work | Evaluate `MULTIPLE_SPLIT_PLUS_MERGE`. |
| If detail is short and secondary | Consider `DRAWER_EXTRACTION`. |
| If drawer content is safety-critical or deep | Promote drawer to route or decision room. |
| If route has no standalone job | Consider route-to-drawer demotion or nav deprecation. |
| If any option weakens safety or client visibility | Kill that option regardless of UX score. |

---

## 12. Route Evolution Record Template

| Field | Required Content |
|---|---|
| Route Evolution ID | `UX-ROUTE-EVO-###` |
| Decision Status | `AUTO_APPROVED`, `SAFETY_REVIEW_REQUIRED`, `BLOCKED`, or `READY_AFTER_TASK_PACK` |
| Current Route(s) | Existing paths and route IDs. |
| Proposed Route(s) | New, changed, split, merged or deprecated paths. |
| Evolution Type | `ROUTE_KEEP`, `ROUTE_SPLIT`, `ROUTE_CREATE_SUBROUTE`, `ROUTE_CREATE_HUB`, `ROUTE_CREATE_DETAIL`, `ROUTE_CREATE_DECISION_ROOM`, `ROUTE_CREATE_CLIENT_PROJECTION`, `ROUTE_CREATE_QUEUE`, `ROUTE_MERGE`, `ROUTE_DEPRECATE_FROM_NAV`, `ROUTE_REMOVE`. |
| Former Scope | MVP / MVP_SUPPORT / P1 / Hold / Reference. |
| New Scope | Usually MVP if elevated; otherwise state exact status. |
| Product Owner Basis | `P1_AND_HOLD_TO_MVP_APPROVED_WITH_SAFETY_RECHECK` / `AUTO_APPROVED_UNLESS_SAFETY_CONFLICT`. |
| UX Reason | Journey, page-job, navigation, density or flow evidence. |
| Alternative Assessment | Link to split assessment if applicable. |
| Actor / Role | Affected user roles. |
| Page Type | Hub / Workbench / Queue / Detail / Decision Room / Client Projection / Reference. |
| Safety Policy | RBAC, client visibility, advice boundary, evidence, audit, export caveats. |
| Migration / Redirect | Required redirect, nav update or backward compatibility handling. |
| Tests Required | route-smoke, nav, flow, RBAC, no-leakage, workflow, accessibility. |
| Stop Conditions | Safety conflict, baseline drift, ambiguous policy, missing testability. |
| Codex Readiness | `READY_AFTER_TRUE_UX_TASK_PACK`, `BLOCKED`, or `SAFETY_REVIEW_REQUIRED`. |

---

## 13. Screen Split Decision Record Template

| Field | Required Content |
|---|---|
| Screen Split ID | `UX-SPLIT-###` |
| Source Route / Component | Current route/path/component. |
| Current Problem | Why split/merge/extraction is considered. |
| Options Compared | No split / simple split / multiple split / multiple plus merge / drawer options. |
| Chosen Option | Selected option. |
| Why Chosen | Evidence-based reason with scoring summary. |
| Rejected Options | Why alternatives were rejected. |
| New Surfaces | Route/page/component list after split/merge. |
| Page Job per Surface | One primary job per resulting surface. |
| CTA per Surface | Primary CTA/state for each surface. |
| Safety Caveat | Visibility/advice/evidence/audit/export caveat. |
| Test Plan | Flow/state/RBAC/accessibility/route smoke tests. |
| Codex Readiness | Ready/blocked/safety-review-required. |

---

## 14. Safety / Compliance / RBAC Non-Negotiables

Product Owner auto-approval, P1/Hold elevation and route/screen evolution do not override safety. If safety conflict exists, the proposal is not rejected forever, but it must pause and become `SAFETY_REVIEW_REQUIRED` until resolved by a later explicit safety decision.

| Safety Rule | Applies To | UX Risk | Required Guardrail | Required Tests |
|---|---|---|---|---|
| No unapproved advice | Client projection, recommendations, export, decision rooms | UX may make draft look releasable | Explicit gate language; no release CTA without approval/compliance | no-client-leakage, workflow gate negative tests |
| AI Draft internal-only | Workbench, analyst review, export, client projection | Draft appears in client view or export | Internal-only labelling and payload redaction | AI draft redaction negative tests |
| Client visibility fail-closed | Portal, mobile, client projection, export | Hidden data accidentally shown after route split | Client-safe projection surfaces and denied/empty states | client visibility fail-closed tests |
| Advisor approval is not compliance release | Advisor approval/detail/decision room | CTA wording implies release | Separate states and CTAs | advisor-not-release tests |
| Compliance release is not client acceptance | Compliance/client projection/export | Success wording overclaims client action | Success confirms only release, not acceptance | feedback/no-overclaim tests |
| Upload success is not evidence sufficiency | Document/evidence/upload/compliance | Upload CTA unlocks release | Upload-only success; evidence review required | upload-not-sufficiency tests |
| Export preview is not approval/download/share | Export flow | Preview appears to authorize package | Separate preview/approval/download steps | export workflow tests |
| Admin non-bypass | Admin/governance/RBAC/compliance | Admin route changes release or visibility | Admin cannot set safety outcomes directly | admin bypass negative tests |
| Route access is not payload visibility | All routes with role variation | Route split exposes payload by shell access | Payload checks per actor/object/field | RBAC payload tests |
| No blind schema replacement | Schema/services/API work | UX task triggers model rewrite without evidence | Use existing schema unless explicitly authorized later | schema/migration proof if any |

---

## 15. Codex Decision Boundary

| Decision Type | Codex May Decide? | Codex May Execute? | Conditions |
|---|---:|---:|---|
| Technical file organization inside accepted task | Yes | Yes | Must not alter product/safety semantics. |
| Component extraction | Yes | Yes | Must preserve behaviour and tests. |
| Component props/state implementation | Yes | Yes | Must align with task acceptance and UX/state contract. |
| Tests write/update | Yes | Yes | Must prove task acceptance and safety obligations. |
| New route creation | No policy invention | Yes | Route Evolution Record and task must exist. |
| Redirect/navigation update | No policy invention | Yes | Required by route evolution task. |
| Route split/merge | No policy invention | Yes | Route Evolution Record + Screen Split Decision Record if applicable. |
| P1/Hold implementation | No policy invention | Yes | Scope elevation/safety recheck record exists. |
| Safety policy | No | No, only implement existing policy | Must not invent or weaken safety. |
| Advice boundary | No | No, only preserve/implement accepted gate | Any ambiguity stops work. |
| Client visibility rules | No | No, only implement accepted rules | Fail closed. |
| Financial product logic | No | No | Requires Product/Safety decision, not Codex. |
| Schema replacement | No | No | Only explicit later schema task can alter schema. |
| Screen split without alternative assessment | No | No | Must stop and request missing record in task report. |

---

## 16. Next Artefact Derivation Path

| Artefact | Purpose | Inputs | Must Include | Must Not Do |
|---|---|---|---|---|
| `ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md` | Translate this governance into route-by-route evolution eligibility and required records. | This governance, current baseline, route registry, prior route/scope artefacts, true UX strategy. | All routes, former/new scope, elevation status, evolution type candidates, safety recheck, tests. | Implement, create final tasks, ignore moving baseline. |
| `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md` | Produce the actual flow architecture and screen split plan. | Route Evolution Policy Matrix, UX evidence, current code baseline, journey priorities. | Priority journeys, target routes, screen split assessments, page jobs, CTA/state model. | Create Codex tasks prematurely or skip split alternatives. |
| `ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md` | Convert approved flow refactoring plan into detailed Codex tasks. | Flow Refactoring Plan, route/screen records, safety rules, target files. | Task IDs, target files, implementation steps, acceptance, tests, validation, proof. | Execute code or leave decisions to Codex. |
| `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Final implementation-only handoff. | Task Pack, current baseline recheck, validation commands. | Execution order, allowed tasks, stop rules, reporting, test commands. | Product/safety decisions, uncontrolled route changes, implementation outside scope. |

---

## 17. Validation / Proof Requirements

Every downstream task pack and handoff must attach proof obligations according to decision risk.

| Proof Type | Required For | Minimum Proof |
|---|---|---|
| Moving baseline proof | All downstream artefacts | Current branch/source, route count, component inventory, test inventory, drift notes. |
| Route evolution proof | Any new/split/merged/deprecated route | Route Evolution Record, route-smoke, nav proof. |
| Screen split proof | Any split/merge/drawer promotion/demotion | Screen Split Decision Record, alternative assessment, page jobs. |
| Flow proof | Any journey-level UX refactor | Playwright or documented clickflow proof. |
| State proof | Critical states and feedback | Loading/error/empty/permission/blocked/success/recovery verification. |
| RBAC / no-leakage proof | Client/internal and safety routes | Negative payload visibility tests. |
| CTA proof | Decision or workflow routes | One primary CTA per state, no success overclaim. |
| Accessibility proof | Drawer/modal/wizard/forms | Keyboard/focus/status/error proof. |
| Regression proof | Navigation and route registry | route-smoke and affected flow tests. |

Recommended validation commands to verify against current `package.json` before execution:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
pnpm playwright test
pnpm playwright test tests/route-smoke.spec.ts
pnpm playwright test tests/permission-engine.spec.ts
pnpm playwright test tests/workflow-gate.spec.ts
pnpm playwright test tests/document-upload-api.spec.ts
pnpm playwright test tests/document-upload-flow.spec.ts
pnpm playwright test tests/file-export-realism.spec.ts
```

If scripts differ, mark `VALIDATION_COMMANDS_REQUIRE_PACKAGE_JSON_CONFIRMATION`.

---

## 18. Decision Summary for the User

You have already made the key Product Owner governance decisions:

1. Former P1 routes may become MVP.
2. Former Hold routes may become MVP.
3. UX strategy proposals are automatically approved unless they violate hard safety constraints.
4. New routes and real screen splits are allowed.
5. Screen splits must still be disciplined: compare no split, simple split, multiple split and multiple split plus merge before selecting the architecture.

The practical effect is that the next plan no longer needs to ask whether true UX refactoring is allowed. It is allowed. The next plan must instead prove **which route/screen evolution is best**, document the decision, preserve safety and define tests.

Codex will not decide product strategy. Codex will later execute a final handoff containing accepted route evolution records, split decisions, target files, implementation steps and tests.

---

## 19. ENGINE Proof / QA

### 19.1 ENGINE Selection Proof

| Need | Engine Used | Application |
|---|---|---|
| Product Owner approvals operationalized | ENGINE_v3 Governance | P1/Hold→MVP and UX auto-approval are modeled as binding decision authority. |
| Old false constraints removed | ENGINE_v3 Adversarial + ENGINE_v2 Reframing | No-new-route/no-screen-split/P1/Hold blocking are marked as superseded. |
| Screen split alternatives governed | ENGINE_v2 UX + Morphological Analysis | No split, simple split, multiple split, multiple plus merge and drawer options are compared. |
| Safety preserved | ENGINE_v3 Proof / Ethics | Auto-approval cannot weaken advice boundary, RBAC, client visibility, evidence, audit or export. |
| Codex boundary defined | ENGINE_v2-B | Codex may implement technical details only after final handoff and only from records. |
| Operational clarity | ENGINE_v2 Compression | Output is a reusable governance layer with tables, templates and next artefacts. |

### 19.2 ENGINE_v3 Phase Proof

| Phase | Applied | Proof |
|---|---|---|
| Charter | Sections 1 and 18 | Governance mission and decisions are explicit. |
| Evidence | Section 2 | Source hierarchy and moving baseline are locked. |
| Framing | Sections 3–6 | Product Owner approvals, ownership and constraints are separated. |
| Divergence | Sections 9–11 | Multiple route/screen evolution options are allowed. |
| Contradictions | Sections 6 and 14 | UX freedom is separated from hard safety. |
| Branch Build | Sections 7–13 | Elevation policy, auto-approval, route evolution and split records are operationalized. |
| Debate | Section 11 | Screen split alternatives must be scored and rejected with reasons. |
| Adversarial | Sections 14–15 | Safety conflicts and Codex overreach are blocked. |
| Convergence | Sections 16–18 | Next artefact path and user decision summary are clear. |
| Proof | Section 17 | Validation and proof obligations are defined. |
| Learning | Moving baseline rule | Future artefacts must recheck current code before tasking. |

### 19.3 ENGINE_v2 Method Proof

| Method | Applied | Result |
|---|---|---|
| Psycho-Logic | Decision Governance Model | Reduces decision friction while preserving control and trust. |
| Double Diamond | Governance → route/screen policy → task path | Prevents implementation before decision architecture. |
| Reframing Matrix | Superseded vs hard constraints | Converts "no routes" into governed route evolution. |
| TRIZ | Auto-approval vs safety | Allows strong UX change without safety bypass. |
| SIT / Closed World | Moving baseline | Start from existing code but do not let current structure trap UX. |
| Morphological Analysis | Screen split options and scoring | Splits become comparable decision alternatives. |
| SCAMPER | Split, merge, extract, promote, demote | Allows structural refactoring options. |
| Harvard / Principled Negotiation | UX freedom vs safety constraints | Separates negotiable architecture from non-negotiable safety. |
| MESOs | Split alternatives | Multiple acceptable paths are scored before selecting. |
| Measurement Plan | Validation requirements | Every later decision can become testable. |
| Ethics & Fairness | Safety matrix | Prevents unsafe client visibility and misleading advice flows. |

### 19.4 ENGINE_v2-B Handoff Discipline Proof

| Handoff Need | Included | Location |
|---|---:|---|
| Decision records | Yes | Route Evolution Record, Screen Split Decision Record |
| Allowed changes | Yes | Route Evolution Governance, UX Auto-Approval |
| Forbidden changes | Yes | Still-Hard Constraints, Safety Non-Negotiables |
| Codex boundary | Yes | Section 15 |
| Acceptance/proof | Yes | Section 17 |
| Next artefacts | Yes | Section 16 |
| No implementation now | Yes | Mode and Codex boundary |
| Safety tests | Yes | Sections 14 and 17 |

### 19.5 QA Checklist

| QA Check | Result |
|---|---|
| Target artefact created | PASS |
| Product Owner P1/Hold→MVP approval documented | PASS |
| UX strategy auto-approval documented | PASS |
| Old no-route/no-split constraints superseded | PASS |
| Screen split alternatives include Simple, Multiple, Multiple plus Merge | PASS |
| Route evolution governance included | PASS |
| Templates included | PASS |
| Safety constraints remain hard | PASS |
| Codex boundary defined | PASS |
| Next artefact path defined | PASS |
| No implementation started | PASS |
| No final Codex tasks created | PASS |
