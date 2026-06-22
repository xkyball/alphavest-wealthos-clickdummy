# ALPHAVEST_UX_REFACTORING_INPUT_AND_APPROACH_BRIEF
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


**Generated:** 2026-06-21  
**Mode:** Input and approach brief only. No implementation. No code changes. No Codex execution. No final Codex tasks. No screen generation. No state-screen generation. No image generation.  
**Target project:** AlphaVest WealthOS  
**Target repository / branch:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`  
**Purpose:** Define what input is required to create a robust UX refactoring plan with detailed Codex implementation tasks for navigation, user flows, page flows, click flows, page complexity, density, state handling and safety-preserving interaction design.

---

## 1. Executive Decision

**Decision:** `UX_INPUT_PARTIAL_BUT_PLAN_POSSIBLE`

There is already enough AlphaVest source material to create a structured UX refactoring approach and a first evidence-backed planning scaffold. The existing artefacts cover the target codebase boundary, MVP scope, route scope, route-to-screen mapping, state requirements, interaction reality, feedback rules, RBAC/client-visibility/advice-boundary constraints, evidence/audit/export safety, API contracts, schema baseline, P0 test gaps and final implementation boundaries.

However, there is **not yet enough UX-specific input** to produce a no-interpretation, route-by-route Codex implementation plan for UX refactoring. The missing inputs are not generic “more context”; they are specific: annotated screenshots or recordings of the current UI, a prioritized list of the worst navigation/page-flow issues, page complexity ratings, desired information-density targets, top clickflows by role, before/after preferences, and explicit decisions about which pages should become hubs, work pages, detail pages or drawers.

Therefore:

| Readiness Question | Decision | Reason |
|---|---|---|
| Can a UX refactoring method be defined now? | `YES` | Existing route, journey, safety and implementation-boundary artefacts are strong enough. |
| Can a first UX input inventory be created now? | `YES` | Source hierarchy and missing-input categories are clear. |
| Can a full UX refactoring plan be drafted now? | `PARTIALLY` | Journey and route structure are available, but concrete UX evidence and page-level pain ratings are missing. |
| Can detailed Codex UX tasks be created now without interpretation risk? | `NO` | Task-level work needs route/page problem evidence, target files, desired behaviour and acceptance proof. |
| Should Codex implement anything from this artefact? | `NO` | This artefact is input discovery and method definition only. |

**Practical conclusion:** The next best step is not to redesign immediately. The next step is to create a UX evidence package and then produce `ALPHAVEST_UX_ROUTE_FLOW_PROBLEM_MAP.md`, `ALPHAVEST_UX_NAVIGATION_INFORMATION_ARCHITECTURE_PLAN.md`, `ALPHAVEST_UX_PAGE_COMPLEXITY_REDUCTION_MATRIX.md` and `ALPHAVEST_UX_CLICKFLOW_PAGEFLOW_REDESIGN.md`. Only after those are locked should detailed Codex tasks be created.

---

## 2. Source-of-Truth Applied

The following hierarchy was applied. Existing artefacts were treated as binding context; missing or UX-specific artefacts were treated as required inputs, not as assumptions.

| Rank | Source | Availability | Use in this brief | Guardrail |
|---:|---|---|---|---|
| 1 | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` | Present | Latest implementation boundary and stop-rule layer. | Does not authorize this new UX refactor by itself. |
| 2 | `FINAL_CODEX_TASK_MASTER.md` | Present | Existing task discipline, task categories, no-generation rules. | Do not reuse task groups blindly for UX. |
| 3 | `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Present | Journey-first requirements and decisive product proof. | Do not fall back into screen-first redesign. |
| 4 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md` | Present | Prioritized mega-journeys and first product build path. | Do not treat all journeys equally. |
| 5 | `ROUTE_SCOPE_LOCK.md` | Present | 71-route scope classification. | Do not reclassify routes through UX preference. |
| 6 | `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` | Present | Route-to-screen/component/visual reference mapping. | PNGs are visual references, not behaviour proof. |
| 7 | `STATE_SCREEN_SPEC.md` | Present | Required route and flow states. | Do not generate state-screen assets. |
| 8 | `DRAWER_MODAL_INTERACTION_CONTRACT.md` | Present | Overlay, drawer, modal, wizard and upload lifecycles. | Visible modal/drawer surfaces are not complete interactions. |
| 9 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Present | Feedback, validation, loading, error, success and blocked semantics. | No success overclaims. |
| 10 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Present | Route/action/object/payload visibility and advice-boundary constraints. | UX must not weaken safety. |
| 11 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Present | Evidence sufficiency, audit persistence, export/redaction boundaries. | Upload/audit/export UI is not proof. |
| 12 | `API_CONTRACT_MATRIX.md` | Present | Four existing API routes and safety obligations. | API presence is not API safety proof. |
| 13 | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | Present | 42-model / 22-enum full-workflow schema baseline. | No blind patch-schema replacement. |
| 14 | `P0_TEST_ACCEPTANCE_MATRIX.md` | Present | Existing proof slices and missing P0 positive/negative tests. | Existing tests are partial proof only. |
| 15 | `SCREEN_GENERATION_BRIEF_IF_NEEDED.md` | Present | No-generation decision. | Missing visual refs are not generation authorization. |
| 16 | `local repository checkout / pull of target branch full-workflow` / `full-workflow` repo | Present | Target codebase. | Do not use `main` as implementation target. |
| 17 | `control-spec concepts represented in bundled markdown artefacts; no patch archive included` | Present | Control Spec only. | Do not replace full-workflow code/schema. |
| 18 | `main branch as false-gap / historical only; never target truth` | Present | False-gap warning only. | Never target truth. |

**Map-vs-reality rule:** Product intent, UX preference, visual references, route labels and contracts are not implementation proof. A future Codex task may only be derived when a UX problem, target route/component/file, desired behaviour, safety constraint and acceptance proof are all explicit.

---

## 3. Current Evidence Baseline

### 3.1 What is already known

| Area | Current Evidence | UX Meaning | Limitation |
|---|---|---|---|
| Product spine | AlphaVest is digital-first, human-reviewed, evidence-backed. | UX must guide controlled work, not just display dashboards. | Does not specify page-level UI fixes. |
| Journey priority | MVP core journeys are `MJ-001`, `MJ-002`, `MJ-003`, `MJ-005`, `MJ-006`, `MJ-010`; support includes `MJ-012`, conditional `MJ-011`. | UX should be journey-first around onboarding-to-release, evidence, AI draft review, admin non-bypass, cross-tenant denial and export. | Needs concrete clickflow evidence. |
| Route scope | 71 routes are classified: 31 MVP, 25 MVP_SUPPORT, 5 P1, 3 reference-only, 7 hold. | UX planning can prioritize MVP/MVP_SUPPORT and block hold/P1/ref expansion. | Route scope is not information architecture quality. |
| Visual assets | Public clean PNGs exist for routes `001–063`; routes `064–071` reference missing/non-public assets. | Enough visual baseline for many screens; no generation needed now. | PNGs do not prove behaviour or current runtime quality. |
| States | MVP routes require state specs; support routes need conditional states. | UX can standardize loading/error/empty/permission/blocked/success. | State visuals are not generated and not implemented by spec alone. |
| Interaction reality | Document upload is strongest implemented interaction; many other interactions are partial/static/demo/visual. | UX refactor must convert fake/static UI into real lifecycle where necessary. | Requires route-level target behaviour. |
| Feedback rules | Upload success is upload-only; advisor approval is not release; compliance release is not client acceptance. | UX wording must prevent false confidence. | Needs exact copy/content implementation later. |
| Safety | Route access ≠ action permission ≠ payload visibility; client visibility fails closed; AI Draft internal-only. | Navigation, CTAs and page content must be role- and payload-safe. | Needs P0 tests for final task acceptance. |
| API baseline | Four existing APIs: `/api/demo-workflow`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring`. | UX tasks must harden existing API surfaces, not invent new ones by default. | API safety remains contract-driven, not proven by presence. |
| Schema baseline | Full-workflow Prisma schema has 42 models and 22 enums. | UX tasks should align to existing model semantics. | No blind schema expansion for UX wishes. |
| P0 proof | 10 test files exist; proof is partial. | UX refactor must add or update tests where it changes safety-critical flows. | Existing tests do not close all gates. |
| No-generation gate | No current screen/state-screen/image generation is authorized. | UX refactor must use existing visual references and code. | Missing visual refs do not authorize new screens. |

### 3.2 Readiness interpretation

The existing AlphaVest material is unusually strong for **scope and safety**. It is weaker for **UX evidence**. It tells us what must not be broken and which flows matter, but it does not yet tell us exactly where users get lost, which pages feel bloated, which pages waste space, which menu labels fail, or which CTAs should become primary versus secondary.

The future UX plan should therefore be built from two inputs:

1. **Locked AlphaVest control context** — already largely available.
2. **Current UX friction evidence** — still missing and must be gathered explicitly.

---

## 4. Minimum Required Input Package

The table below defines the minimum input required before creating a robust UX refactoring plan with detailed Codex tasks.

| Input Category | Minimum Needed | Already Available? | Missing / Needs Confirmation | Why It Matters for Codex Tasks |
|---|---|---:|---|---|
| Target Codebase / Repo Input | Repo URL or ZIP, branch, latest commit/snapshot, `AGENTS.md`, package manager, validation commands. | `PARTIAL` | Confirm latest branch state versus current local repository working tree after preflight; confirm exact package manager and final validation commands. | Codex tasks need target files, commands and branch discipline. |
| Current UX Evidence | Current screenshots/reference PNGs, app-shell/sidebar/topbar/page header captures, list of complex pages, list of wasteful pages, examples of unclear CTAs/dead ends. | `PARTIAL` | Annotated screenshots or screen recording of current runtime; explicit top UX pain list. | Prevents task generation from guessing. |
| Journey / User Flow Input | Prioritized journeys, roles/personas, user goals, top 5–10 clickflows, start/end/success/abort states, visibility rules per role. | `PARTIAL_STRONG` | Top clickflows need to be selected and written as actual path sequences. | Codex tasks should follow flows, not isolated screens. |
| Navigation / IA Input | Current menu structure, desired mental model, area hubs, primary/secondary/utility navigation, in-flow navigation, breadcrumbs/next-step/status guidance. | `PARTIAL` | Current menu pain and desired IA model need explicit articulation. | Navigation refactor is impossible without deciding mental grouping. |
| Page Complexity Input | Page list with complexity rating, page job statement, primary task, must-see/secondary/tertiary content, content eligible for tabs/drawers/detail pages. | `MISSING_AS_UX_INPUT` | Need page-by-page complexity teardown for MVP/MVP_SUPPORT routes. | Prevents “make it cleaner” tasks with no acceptance criteria. |
| Density / Spacing / Layout Input | Desired density, examples of too airy/too full pages, viewport targets, scroll/above-the-fold rules. | `MISSING_AS_UX_INPUT` | Need viewport priority: 1440×900, 16:9, laptop, mobile; density preferences. | Codex needs measurable layout expectations. |
| Interaction Input | Tables, filters, search, sort, row actions, drawer/modal lifecycles, wizard steps, states, validation/feedback rules. | `PARTIAL_STRONG` | Need which interactions are priority for UX refactor now. | Prevents fake interactivity and untested interactions. |
| Safety / Compliance / Visibility Input | RBAC, client visibility, advice boundary, AI Draft internal-only, evidence/audit/export safety, P0 negative tests. | `STRONG` | Need explicit mapping of UX changes to safety-critical routes. | UX must not leak payloads or bypass gates. |
| Design Direction Input | Desired character: Family Office, calm, precise, trustworthy, less clickdummy-like; references; anti-patterns. | `PARTIAL` | Need concrete visual/interaction references or examples of acceptable density/hierarchy. | Avoids cosmetic redesign with wrong tone. |
| Codex Task Output Input | Desired granularity, target/forbidden files, allowed technical changes, tests, validation commands, reporting format. | `PARTIAL` | Need UX-specific task granularity and target areas. | Determines how detailed the implementation handoff can be. |

### 4.1 Minimum concrete package to request from the user

For the next planning stage, the minimum user-provided package should be:

1. **A screen recording** of the current app covering sidebar, topbar, page headers and the top 5 flows.
2. **10–20 annotated screenshots** marking: confusing navigation, overloaded pages, wasted space, unclear CTAs, dead ends and fake interactions.
3. **Top 5 UX-critical flows** with role, start route, end route, success state and where the user gets confused.
4. **Top 20 page problem list** with one label per page: `too complex`, `too empty`, `unclear CTA`, `wrong hierarchy`, `fake interaction`, `bad navigation`, `safety unclear`.
5. **Target density preference**: compact enterprise dashboard, balanced executive workbench, or spacious premium family-office style.
6. **Desired navigation mental model**: journey-stage navigation, role-based workspace navigation, object-centered navigation, or hybrid.
7. **Explicit non-negotiables** for visual style and UX tone.
8. **Confirmation of latest repo/branch snapshot** and validation command set.

---

## 5. Optional High-Value Inputs

These inputs are not strictly required, but they would greatly improve the quality and precision of the later UX refactoring plan.

| Optional Input | Value Added | Use in Later Artefacts |
|---|---|---|
| Loom / screen recording with spoken commentary | Captures hesitation, dead ends and mental-model mismatch. | UX problem map and clickflow redesign. |
| Annotated screenshots with “why this is bad” notes | Reduces interpretation risk. | Page complexity matrix and Codex acceptance criteria. |
| User feedback from internal testers | Reveals actual friction rather than assumed friction. | Journey prioritization and validation proof. |
| Internal review notes | Shows strategic intent and stakeholder pain. | Navigation and page job statements. |
| Figma / visual references | Clarifies layout density and component hierarchy. | Layout density system. |
| Competitor / benchmark screens | Helps define professional Family Office / WealthOS expectations. | Design direction input and IA decisions. |
| Analytics / heatmaps / click paths | Shows real usage bottlenecks. | Flow priority and problem severity. |
| Before/after preference examples | Makes style intent concrete. | Codex task acceptance snapshots. |
| Top-20 pages by business criticality | Prevents polishing low-value pages first. | Work package sequencing. |
| Top-20 pages by UX pain | Targets the biggest friction first. | Page complexity reduction matrix. |
| Examples of pages whose density works | Avoids redesigning the good parts. | Layout density rules. |
| Accessibility audit notes | Captures keyboard/focus/readability issues. | Interaction/state tasks and validation. |
| Copy/content audit | Prevents labels and CTAs from remaining vague. | Navigation and feedback contract refinement. |
| Role-based walkthrough notes | Shows what Analyst, Advisor, Compliance, Admin and Client each need. | Role-specific navigation model. |
| Live repo diff from current branch | Protects against stale ZIP assumptions. | Codex target-file selection. |

---

## 6. What Existing AlphaVest Inputs Already Cover

### 6.1 Existing artefact coverage

| Question | Existing Coverage | Assessment |
|---|---|---|
| Is there already route scope? | Yes. 71 routes classified into MVP, MVP_SUPPORT, P1, reference-only and hold. | Strong. |
| Is there a route-to-screen matrix? | Yes. All 71 routes mapped to components and visual reference status. | Strong for visual baseline; not behaviour proof. |
| Is there a state-screen spec? | Yes. MVP/support/P1/reference/hold state expectations are specified. | Strong for state intent. |
| Is there an interaction reality audit? | Yes. Document upload is implemented; many others are partial/static/demo/visual. | Strong for overclaim prevention. |
| Is there a feedback/validation contract? | Yes. No-overclaim rules and feedback categories exist. | Strong for safety wording. |
| Are safety contracts present? | Yes. RBAC/client visibility/advice boundary plus evidence/audit/export safety. | Strong and binding. |
| Are journey requirements present? | Yes. MVP journey portfolio and foundational requirements exist. | Strong for journey-first UX. |
| Is there a final Codex Task Master / Handoff? | Yes. Task master and final handoff exist for the current controlled implementation path. | Useful boundary, but new UX refactor still needs its own UX task master. |

### 6.2 What can already be prepared now

With the current artefacts, the following UX planning work can already be prepared:

| Work Product | Can Start Now? | Why |
|---|---:|---|
| `ALPHAVEST_UX_INPUT_INVENTORY.md` | `YES` | Source hierarchy and missing-input structure are clear. |
| `ALPHAVEST_UX_ROUTE_FLOW_PROBLEM_MAP.md` | `PARTIAL` | Route scope exists, but UX problem evidence is missing. |
| `ALPHAVEST_UX_NAVIGATION_INFORMATION_ARCHITECTURE_PLAN.md` | `PARTIAL` | Route groups and roles exist, but desired mental model needs input. |
| `ALPHAVEST_UX_PAGE_COMPLEXITY_REDUCTION_MATRIX.md` | `PARTIAL_LOW` | Route list exists, but page-level complexity ratings and screenshots are missing. |
| `ALPHAVEST_UX_CLICKFLOW_PAGEFLOW_REDESIGN.md` | `PARTIAL` | Journey priorities exist, but actual top clickflows must be selected. |
| `ALPHAVEST_UX_INTERACTION_STATE_REFACTORING_CONTRACT.md` | `PARTIAL_STRONG` | Existing interaction and state contracts provide a strong base. |
| `ALPHAVEST_UX_LAYOUT_DENSITY_SYSTEM.md` | `PARTIAL_LOW` | Design direction exists, but density/viewport targets are missing. |
| `ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md` | `NO` | Needs locked UX problem map and route/page decisions first. |
| `ALPHAVEST_UX_REFACTORING_IMPLEMENTATION_HANDOFF.md` | `NO` | Must follow task master and acceptance mapping. |

### 6.3 Highest risk of false assumptions

| Risk | Why It Is Dangerous | Prevention |
|---|---|---|
| Treating route count as navigation quality | 71 registered routes do not mean users can find the right path. | Build IA from journeys and roles. |
| Treating PNGs as current UX proof | PNGs show visuals, not runtime behaviour, user confusion or interaction state. | Require recordings/annotated screenshots. |
| Solving complexity by adding widgets | More components can increase overload. | Use page job statements and content hierarchy. |
| Making pages cleaner by hiding safety gates | This can undermine trust and compliance. | Status before action; fail-closed safety states. |
| Making CTAs more prominent without permissions | Visible action can imply authority. | Route access/action permission/payload visibility separation. |
| Turning hold/P1 routes into MVP navigation | UX cleanup could accidentally elevate scope. | Preserve route scope lock. |
| Creating new screens for missing assets | No-generation decision is binding. | Use existing routes/components unless a later brief unlocks generation. |
| Assuming demo actions are product persistence | Demo transport can mislead task planning. | Interaction reality audit remains binding. |

---

## 7. Missing Inputs / Open Questions

The following are the concrete missing inputs needed before detailed Codex UX tasks can be created.

| Missing Input | Required Form | Decision Needed | Consequence if Missing |
|---|---|---|---|
| Current runtime UX evidence | Screen recording or screenshots | Which screens actually confuse or waste space? | UX plan will rely on inferred problems. |
| Top 5–10 clickflows | Flow list with role, start, end, success, failure | Which flows matter first? | Codex tasks may optimize wrong routes. |
| Page complexity ratings | Page list with severity and reason | Which pages are overloaded versus underused? | Page refactor scope remains vague. |
| Desired IA mental model | One chosen or hybrid model | Should nav be journey-stage, role-based, object-based or hybrid? | Sidebar/topbar changes risk becoming arbitrary. |
| Hub/work/detail classification | Route-by-route or group-level decision | Which pages are hubs, work pages, details, reference pages? | Page restructuring lacks architecture. |
| Content priority per key page | Must-see / secondary / tertiary | What must stay above the fold? | Progressive disclosure could hide critical data. |
| Density targets | Viewport + density examples | How compact should the app become? | Layout tasks will lack measurable acceptance. |
| CTA hierarchy | Primary/secondary/destructive actions per state | What is the next best action? | User guidance remains weak. |
| Interaction priority | Tables/search/filter/drawer/modal/wizard priority list | Which fake/partial interactions must become real first? | Implementation could overbuild low-value interactions. |
| Safety-critical UX changes | Route/action/payload impact list | Which UX changes need P0 negative tests? | Safety regression risk. |
| Validation command set | Exact commands | How should Codex prove completion? | Handoff acceptance remains weak. |

### 7.1 Specific questions to resolve

1. Which five flows are most important for the first UX refactor: onboarding, evidence upload, AI draft review, advisor approval, compliance release, client visibility, export, admin non-bypass, or cross-tenant denial?
2. Which current route group feels most confusing: access/onboarding, admin/tenant setup, client workspace, advisory workflow, decisions/evidence, governance, export or operations?
3. Which pages feel most overloaded today?
4. Which pages feel too empty or waste vertical/horizontal space?
5. Should AlphaVest navigation be primarily organized by **journey stage**, **role workspace**, **client object**, or **operating control layer**?
6. Which routes should become area hubs and which should become detail/work pages?
7. Which components are visually noisy or repetitive: cards, chips, metrics, side panels, tables, timeline rows, badges, CTAs?
8. Where are current CTAs unclear, duplicated or misleading?
9. Where does a user currently hit a dead end?
10. Which screens must remain conservative and compliance-led even if they look visually heavier?

---

## 8. UX Refactoring Method

The UX refactoring should be performed in phases. Each phase produces an artefact and prevents premature Codex implementation.

### Phase UX-0 — Intake / Evidence Lock

**Goal:** Lock inputs before redesign.

| Step | Work | Output |
|---|---|---|
| UX-0.1 | Inventory all available source artefacts and repo snapshot. | Source inventory and freshness status. |
| UX-0.2 | Confirm target branch and block `main` as target truth. | Target-codebase lock. |
| UX-0.3 | Gather annotated screenshots / recording / UX pain list. | UX evidence pack. |
| UX-0.4 | Mark missing inputs explicitly. | Missing input register. |
| UX-0.5 | Preserve no-generation and safety stop rules. | Stop-rule lock. |

**Output artefact:** `ALPHAVEST_UX_INPUT_INVENTORY.md`

### Phase UX-1 — Product / Journey Alignment

**Goal:** Keep UX journey-first, not menu-first.

| Step | Work | Output |
|---|---|---|
| UX-1.1 | Select top 5–10 journeys from existing mega-journey priority. | UX journey workset. |
| UX-1.2 | Define role, goal, start, end, success and abort states for each flow. | Flow cards. |
| UX-1.3 | Map route sequences to each journey. | Route-flow map. |
| UX-1.4 | Identify where guidance, status, gates or CTAs are missing. | Flow problem map. |
| UX-1.5 | Separate MVP, MVP_SUPPORT, P1, reference-only and hold route treatment. | Scope-safe UX workset. |

**Output artefact:** `ALPHAVEST_UX_ROUTE_FLOW_PROBLEM_MAP.md`

### Phase UX-2 — Navigation / Information Architecture

**Goal:** Replace clickdummy menu logic with user guidance.

| Step | Work | Output |
|---|---|---|
| UX-2.1 | Audit App Shell, Sidebar, Topbar and Page Header roles. | Navigation audit. |
| UX-2.2 | Group routes by mental model: Setup, Client Context, Workbench, Approval, Compliance, Evidence, Export, Governance. | IA proposal. |
| UX-2.3 | Separate primary nav, secondary nav, utility nav and in-flow nav. | Navigation layers. |
| UX-2.4 | Define area hubs and next-step guidance. | Hub model. |
| UX-2.5 | Define role-specific navigation visibility. | Role-aware navigation rules. |

**Output artefact:** `ALPHAVEST_UX_NAVIGATION_INFORMATION_ARCHITECTURE_PLAN.md`

### Phase UX-3 — Page Complexity Teardown

**Goal:** Reduce overload and wasted space with page job discipline.

| Step | Work | Output |
|---|---|---|
| UX-3.1 | Assign every priority page a Page Job Statement. | Page job register. |
| UX-3.2 | Define one primary task and one primary CTA per state. | CTA matrix. |
| UX-3.3 | Split content into must-see, secondary and tertiary. | Content hierarchy matrix. |
| UX-3.4 | Identify pages to split into hub + detail + drawer. | Decomposition candidates. |
| UX-3.5 | Identify pages to compact or consolidate. | Density candidates. |

**Output artefact:** `ALPHAVEST_UX_PAGE_COMPLEXITY_REDUCTION_MATRIX.md`

### Phase UX-4 — Clickflow / Pageflow Redesign

**Goal:** Make paths understandable, recoverable and decisive.

| Step | Work | Output |
|---|---|---|
| UX-4.1 | For each top flow, define start, next, gate, error, success and exit. | Flow lifecycle table. |
| UX-4.2 | Remove dead ends and orphan routes. | Flow continuity fixes. |
| UX-4.3 | Standardize primary/secondary/destructive CTAs. | CTA hierarchy. |
| UX-4.4 | Add gate hints without alarmism. | Gate messaging rules. |
| UX-4.5 | Define breadcrumbs, “next best action” and “why blocked” logic. | In-flow guidance model. |

**Output artefact:** `ALPHAVEST_UX_CLICKFLOW_PAGEFLOW_REDESIGN.md`

### Phase UX-5 — Interaction and State Refactoring

**Goal:** Turn visual/demo/static elements into clear, tested lifecycles where needed.

| Step | Work | Output |
|---|---|---|
| UX-5.1 | Classify current interactions as real, partial, visual, static or missing. | Interaction reality workset. |
| UX-5.2 | Define table/filter/search/sort/row-action behaviour. | Data interaction contract. |
| UX-5.3 | Define drawer/modal open/close/submit/cancel/error/focus rules. | Overlay lifecycle contract. |
| UX-5.4 | Define wizard progression, validation and save/cancel behaviour. | Wizard contract. |
| UX-5.5 | Standardize loading/error/empty/permission/blocked/success states. | State implementation contract. |

**Output artefact:** `ALPHAVEST_UX_INTERACTION_STATE_REFACTORING_CONTRACT.md`

### Phase UX-6 — Component and Layout System Refactoring

**Goal:** Improve scanability, density and hierarchy without changing product scope.

| Step | Work | Output |
|---|---|---|
| UX-6.1 | Define page patterns: Hub, Work Queue, Detail Room, Wizard, Evidence Review, Export Flow, Governance Console. | Page pattern system. |
| UX-6.2 | Define density rules for cards, tables, headers, summary strips and drawers. | Density rules. |
| UX-6.3 | Standardize grid, spacing, card hierarchy and section headers. | Layout system. |
| UX-6.4 | Consolidate repeated chips/cards/metrics. | Component cleanup candidates. |
| UX-6.5 | Define responsive behaviour for target viewports. | Viewport rules. |

**Output artefact:** `ALPHAVEST_UX_LAYOUT_DENSITY_SYSTEM.md`

### Phase UX-7 — Codex Task Derivation

**Goal:** Convert locked UX decisions into implementation tasks only when each task is unambiguous.

| Step | Work | Output |
|---|---|---|
| UX-7.1 | Group tasks by flow, component, route and safety impact. | Task groups. |
| UX-7.2 | Assign target files and forbidden files. | Target-file matrix. |
| UX-7.3 | Add acceptance criteria and validation commands. | Acceptance matrix. |
| UX-7.4 | Link safety-critical changes to P0 positive and negative tests. | P0 UX test mapping. |
| UX-7.5 | Apply stop rules and blocked/deferred classifications. | Codex-ready task master. |

**Output artefact:** `ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md`

### Phase UX-8 — Validation / Proof

**Goal:** Prove the refactor improved guidance and did not weaken safety.

| Proof Type | Required Evidence |
|---|---|
| Route smoke proof | All relevant routes still load and have expected headings/states. |
| User-flow proof | Top flows can be followed from start to success or blocked state. |
| Screenshot proof | Before/after screenshots for affected pages. |
| Keyboard/focus proof | Critical overlays and forms support keyboard and focus behaviour. |
| No-leakage proof | Client-facing routes do not show internal-only data. |
| RBAC proof | Unauthorized roles cannot see or perform restricted actions. |
| Feedback proof | Success/error/blocked messages do not overclaim downstream gates. |
| Density proof | Affected pages meet viewport and above-the-fold expectations. |

**Output artefact:** `ALPHAVEST_UX_REFACTORING_IMPLEMENTATION_HANDOFF.md`

---

## 9. Navigation / IA Input Model

### 9.1 Navigation layers to define

| Layer | Purpose | Required Input | Candidate AlphaVest Application |
|---|---|---|---|
| Primary Navigation | Main user mental model. | Which major workspaces matter first? | Client Workspace, Workbench, Approvals, Compliance, Evidence, Export, Governance, Admin. |
| Secondary Navigation | Subsections within a workspace. | Which route groups belong together? | Documents list/upload/review; export scope/redaction/preview/download; governance users/roles/access/audit. |
| Utility Navigation | Session, role, tenant, search, notifications, help. | What must be in topbar versus sidebar? | Tenant/user/role context, environment status, maybe current journey status. |
| In-Flow Navigation | Guides the user through the current process. | What is the next step and why? | Workbench → advisor approval → compliance → decision → client visibility/export. |
| Breadcrumbs | Location and reversibility. | Which pages require hierarchy? | Details, review pages, decision room, evidence record, export steps. |
| Status / Gate Guidance | Shows state before action. | Which gates are pending/blocked/approved? | Evidence needed, advisor pending, compliance blocked, release pending, export redaction pending. |
| Area Hubs | Prevent giant menus by grouping flows. | Which hubs should exist? | Advisory Workflow Hub, Evidence Hub, Governance Hub, Export Hub, Client Context Hub. |

### 9.2 Candidate navigation model

A likely AlphaVest navigation model should be **hybrid journey-stage + role workspace**, not a raw list of routes.

| Navigation Group | Purpose | Candidate Routes | Notes |
|---|---|---|---|
| Access & Setup | Get mapped user/tenant/role context ready. | 001–018 | Mostly MVP_SUPPORT; avoid making this feel like product core. |
| Client View | Client-safe released view and client context. | 019–026 | Must fail closed; client-facing routes need strict visibility. |
| Evidence & Documents | Intake, review and verification of documents/evidence. | 027–030, 046–047 | Document upload is real, but evidence sufficiency is not automatic. |
| Advisory Workbench | Signals, internal draft, analyst review and advisor approval. | 033–037 | Internal-only AI/draft discipline is central. |
| Compliance & Release | Compliance review, release, block, audit. | 038–042 | Gate clarity without panic. |
| Decisions | Decision list/detail/submitted state. | 043–045 | Should show decision state and next step clearly. |
| Governance | Users, roles, access requests, audit history. | 048–051, plus 008–010 | Admin non-bypass must be visible in UX. |
| Export | Scope, redaction, preview, download/share. | 054–058 | Preview ≠ approval ≠ download/share. |
| Operations / P1 | Communication, ops queues, review calendar. | 052, 053, 059, 060, 068 | Defer from MVP UX implementation unless explicitly elevated later. |
| Reference | Service blueprint, roadmap, state reference. | 061–063 | Reference-only; should not appear as product work surfaces for normal users. |
| Held Advanced Scope | KYC/SoW/suitability/IPS/rebalance/committee. | 064–067, 069–071 | Must not be promoted by UX refactor. |

### 9.3 Roles requiring their own navigation logic

| Role | Navigation Need | Must Avoid |
|---|---|---|
| Client / Principal | Simple client-safe view, released decisions, evidence requests, upload participation. | Internal workbench, AI drafts, compliance notes, unreleased evidence. |
| Family Office User / CFO | Client-safe collaboration and scoped context. | Internal advisory payload expansion. |
| Analyst / Consultant | Workbench, signals, evidence review, draft preparation, unsupported-claim handling. | Release authority or client visibility toggles. |
| Senior Wealth Advisor | Advisor approval, decision room, export preparation. | Compliance release or admin bypass. |
| Compliance Officer | Compliance queue, review, block, evidence request, release, audit. | Skipping advisor/evidence/audit prerequisites. |
| Platform / Tenant / Security Admin | Setup, roles, policies, access governance and audit history. | Advice, release, evidence sufficiency, export redaction bypass. |
| Operations / Client Success | Tenant setup, operational queues, handoff support. | Acting on advice or release gates. |
| External Advisor / Guest | Conditional scoped access only if later unlocked. | Tenant-wide visibility or internal workflow access. |
| System / AI Draft Producer | No navigation as a human user; internal-only source indicator. | Client-visible AI advice or autonomous actions. |

---

## 10. Page Complexity Input Model

### 10.1 Page job model

Every page selected for UX refactoring must receive this minimum specification.

| Field | Required Meaning |
|---|---|
| Route ID / Path | Exact route from `ROUTE_SCOPE_LOCK.md`. |
| Scope Label | MVP, MVP_SUPPORT, P1, reference-only, hold. |
| Page Type | Hub, work queue, detail page, wizard, review page, governance console, export step, reference page. |
| Page Job Statement | “This page helps [role] do [job] so that [outcome].” |
| Primary User | Main actor for this page. |
| Primary Task | One dominant action or decision. |
| Primary CTA | One next best action for the current state. |
| Secondary Actions | Useful but not primary. |
| Must-See Content | Information that must be visible immediately. |
| Secondary Content | Can be in tabs, drawers, accordions or below fold. |
| Tertiary Content | Can move to detail pages, drawers or audit views. |
| Safety Content | Must remain visible or fail-closed. |
| Complexity Problem | Overloaded, too empty, unclear CTA, dead end, duplicate cards, fake interaction, wrong hierarchy. |
| Refactor Pattern | Consolidate, split, move to drawer, convert to table, create hub, create detail, compress, expand. |

### 10.2 Pages likely to be hubs, work pages, detail pages and reference pages

This is a first hypothesis only. It must be validated with screenshots and current runtime evidence.

| Page Type | Candidate Routes | Why |
|---|---|---|
| Area Hubs | `/portal`, `/documents`, `/workbench`, `/advisor-approval`, `/compliance`, `/decisions`, `/evidence`, `/governance/users`, `/export/new` | These likely orient users across a work area or flow stage. |
| Work Queues | `/signals`, `/advisor-approval`, `/compliance`, `/documents/extraction-review`, `/documents/verification-pending`, `/governance/access-requests` | These likely need filters, priority, status, row actions and next-step guidance. |
| Detail / Decision Rooms | `/workbench/triggers/:id`, `/advisor-approval/:id`, `/compliance/:id/review`, `/decisions/:id`, `/evidence/:id`, `/entities/:id` | These likely carry evidence, rationale, state, CTAs and audit. |
| Wizards / Step Flows | `/onboarding/*`, `/tenants/new`, `/tenants/:id/setup`, `/export/new`, `/export/:id/scope`, `/export/:id/redaction`, `/export/:id/preview`, `/export/:id/download` | These need stepper progression, validation, back/cancel/save states. |
| Client-Safe Surfaces | `/portal`, `/mobile` | These require fail-closed, redacted, released-only content. |
| Governance Consoles | `/admin/roles`, `/admin/security`, `/governance/roles`, `/governance/access-requests`, `/governance/audit-history` | These need admin non-bypass clarity. |
| Reference Pages | `/service-blueprint`, `/roadmap`, `/states` | These should not appear as normal product tasks. |
| Hold Pages | `/kyc/:id/review`, `/kyc/:id/source-of-wealth`, `/suitability/:tenantId/profile`, `/ips/:tenantId`, `/monitoring/rebalance`, `/committee/reviews`, `/committee/reviews/:id` | Must not be finalized or visually generated now. |

### 10.3 Candidate pages for decomposition

| Candidate | Possible Split | Reason to Investigate |
|---|---|---|
| Workbench / trigger detail | Hub + focused trigger detail + evidence drawer + audit drawer | Avoid one page carrying all signals, evidence, rationale and actions at once. |
| Advisor approval detail | Approval decision room + evidence panel + risk notes drawer | Keep primary approval action clear. |
| Compliance review/release/block | Queue + review detail + release modal + evidence request flow | Compliance gates need clarity, not clutter. |
| Decision room | Summary + evidence + audit + client-safe projection | Decision pages often become overloaded. |
| Evidence vault | Evidence list/table + record detail + link/review drawer | Evidence can become card-heavy and hard to compare. |
| Export flow | Wizard steps + preview + redaction details drawer | Export safety requires staged clarity. |
| Governance roles/access | Governance hub + role table + permission drawer + confirmation modal | Avoid giant permission matrices on one screen. |
| Admin platform/security | Admin hub + settings panels + confirmation states | Security controls need hierarchy and audit clarity. |
| Client profile/entities/wealth map/actions | Client context hub + details + drawers | Reduce dense family-office context pages. |

### 10.4 Candidate pages for density improvement

| Candidate | Likely Issue | Needed Input |
|---|---|---|
| Auth/onboarding pages | May be too spacious or low-value per screen. | Screenshots and desired premium/enterprise density. |
| Client portal/mobile | May waste space if cards are decorative. | What client must see above the fold. |
| Tenant setup pages | May have repeated setup cards and unclear next step. | Which setup actions matter for MVP. |
| Evidence/document pages | May need tables over cards for comparison. | Current screenshot and data density target. |
| Export pages | May need step summary and redaction status compressed. | Flow screenshots and export decision priorities. |
| Reference pages | May be visually polished but not product-critical. | Whether they should be hidden from normal navigation. |

---

## 11. Clickflow / Pageflow Input Model

### 11.1 First 5–10 journeys to consider as UX flows

| Priority | Journey / Flow | Why First | Candidate Route Span | UX Focus |
|---:|---|---|---|---|
| 1 | `MJ-001` New Family Office onboarding to first client-safe decision | Umbrella product proof. | 001–020, 027–045 | Orientation, role context, evidence, review, release, client visibility. |
| 2 | `MJ-002` Evidence missing → client upload → release | Strongest client-value and upload interaction slice. | 027–030, 038–041, 019 | Evidence request, upload, review, release-safe client view. |
| 3 | `MJ-003` AI draft rejected/rebuilt with evidence | Differentiating safety story. | 033–037, 027–030 | Internal-only draft, unsupported claim rejection, evidence links. |
| 4 | `MJ-010` Admin role change cannot bypass release | Governance trust proof. | 009, 010, 048–051, 040 | Admin boundaries, permission feedback, non-bypass. |
| 5 | `MJ-006` Cross-tenant access denied with audit proof | Tenant/object isolation proof. | 001, 018, 027–030, 048–051 | Denial, audit, no payload leak. |
| 6 | `MJ-005` Export package with forbidden internal payload redaction | Trust output after release path. | 054–058 | Scope, redaction, preview, approval, download/share separation. |
| 7 | `MJ-012` Data-quality issue blocks release until resolved | Parallel hardening if release-blocking. | 034, 038–040, 059–060 | Blocked state, resolution, audit. |
| 8 | `MJ-011` External advisor scoped document access only | Conditional after user/object scope stable. | 003, 018, 027–028 | Scoped access, guest visibility. |
| 9 | `MJ-009` Client mobile request creates workflow | P1 after MVP core. | 020, 027–030, 052 | Client request to internal workflow. |
| 10 | `MJ-008` Monitoring creates internal review, not automatic advice | P1 / safety-relevant later. | 068–069, 033–037 | No auto-advice execution. |

### 11.2 Required clickflow fields

Each flow must be documented like this before Codex tasks are created.

| Field | Required Content |
|---|---|
| Flow ID | `UX-FLOW-001`, etc. |
| Source Journey | `MJ-001`, `MJ-002`, etc. |
| Primary Role | Analyst, Advisor, Compliance, Client, Admin, etc. |
| Secondary Roles | Other actors who influence the flow. |
| Start Route | First route the user sees. |
| End Route | Desired success route/state. |
| Success State | What counts as success without overclaim. |
| Abort / Blocked State | Where flow stops and why. |
| Required Context | Tenant, role, object, evidence, permission, status. |
| Route Sequence | Actual path list. |
| Primary CTA per Step | One primary action for each state. |
| Secondary CTA per Step | Back, cancel, save draft, request evidence, open details. |
| Gate Messages | Advisor/compliance/evidence/export/visibility gates. |
| Error / Empty / Permission States | Required recovery states. |
| Safety Constraints | RBAC, payload visibility, advice boundary, evidence/audit/export. |
| Codex Readiness | Ready / partial / blocked. |

### 11.3 Flow anti-patterns to detect

| Anti-Pattern | Why It Hurts UX | Later Fix Pattern |
|---|---|---|
| Route list without journey guidance | User sees pages but not a path. | Area hubs + next-step guidance. |
| Multiple primary CTAs | Decision paralysis and accidental actions. | One primary CTA per state. |
| Status chips without explanation | User sees a label but not what to do. | Status + reason + next action. |
| Compliance gates hidden in dense cards | Users may miss why release is blocked. | Gate summary strip. |
| Repeated metrics/cards | Noise without decision value. | Consolidated summary rows. |
| Fake buttons | Trust erosion and clickdummy feel. | Implement lifecycle or mark as static. |
| Detail overload on list pages | Hard to compare and scan. | Table/list + drawer/detail page. |
| Visual polish without route logic | Looks good but does not guide. | Flow-state-driven UI. |

---

## 12. Interaction / State Input Model

### 12.1 Current interaction reality to preserve

| Interaction Area | Current Reality | UX Refactor Treatment |
|---|---|---|
| Document upload route `028` | Implemented interaction for upload mechanics. | Preserve and improve UX states; do not imply evidence sufficiency. |
| Demo workflow actions | Partially implemented/demo action transport. | Can support demos; must not be represented as production persistence. |
| Demo role/tenant switcher | Implemented as demo session state. | Useful for role-aware UX testing; not production auth proof. |
| Drawer/modal primitives | Partial reusable primitives. | Need real lifecycle: trigger, focus, escape, submit, error, audit. |
| Wizard steppers | Visual state support. | Need real progression, validation, back/cancel/save. |
| Data tables/filter bars | Mostly visual support. | Need route-level sorting/filtering/search/row action contract. |
| Kanban | Static screen state. | Do not treat as workflow mutation unless implemented/testable. |
| Evidence/audit lists | Visual state support. | Must be backed by evidence/audit contracts if safety-critical. |
| Committee routes | Held/static proof slices. | No UX implementation until hold is lifted. |
| Safety gates | Contracted but not fully implemented. | UX tasks must include safety tests if touched. |

### 12.2 Required interaction inputs

| Interaction Type | Needed Input Before Tasks | Acceptance Direction |
|---|---|---|
| Table / queue | Columns, default sort, filters, row click, bulk actions, empty/error states. | User can find, compare and act without leaking hidden data. |
| Search / filter | Search scope, URL state or local state, no-results behaviour. | Search changes visible rows and has reset/empty state. |
| Drawer | Trigger, allowed content, close/cancel, save, error, focus, escape, audit. | Drawer has real lifecycle or is not treated as interactive. |
| Modal / confirmation | Trigger, destructive state, confirmation phrase, success/error, close rules. | Safety-sensitive confirmation cannot be bypassed. |
| Wizard | Steps, validation per step, save draft, back/cancel, completion state. | Progression is real and recoverable. |
| Upload | File type/size, metadata, progress, fail/retry, upload-only success. | Upload success does not unlock evidence sufficiency. |
| Approval action | Preconditions, denied state, audit, success wording. | Advisor approval does not release to client. |
| Compliance release/block | Preconditions, evidence, audit, fail-closed, release-safe projection. | Compliance release is controlled and traceable. |
| Export | Scope, redaction, preview, approval, download/share separation. | Forbidden internal payload is never included. |

---

## 13. Safety / RBAC / Visibility Input Model

UX refactoring must treat safety as part of the interaction model, not as an afterthought.

### 13.1 Binding safety rules

| Rule | UX Consequence |
|---|---|
| Route access is not action permission. | A user may see a page shell but not see or perform all actions. |
| Action permission is not payload visibility. | A CTA can be available while some fields remain hidden/redacted. |
| Client visibility fails closed. | Client pages show only released, redacted, client-safe content. |
| AI Draft is internal-only. | AI/rules draft indicators must never appear in client-facing payloads. |
| Advisor approval is not compliance release. | Advisor approval success cannot say or imply “released to client.” |
| Compliance release is not client acceptance. | Release success cannot imply client has accepted/acted. |
| Upload success is not evidence sufficiency. | Upload UI must say upload succeeded, not evidence approved. |
| Audit display is not audit persistence proof. | Audit timeline UI cannot imply immutable audit unless backed by test/API. |
| Export preview is not export approval. | Preview UI must not imply download/share is authorized. |
| Admin cannot bypass gates. | Admin UX must show governance power but not outcome override. |

### 13.2 Safety inputs required for UX tasks

| UX Change Type | Safety Input Required | Test Implication |
|---|---|---|
| Navigation visibility changes | Role-to-route and role-to-workspace rules. | Negative route/payload tests. |
| CTA changes | Action permission and object-scope preconditions. | Positive allowed + negative denied action tests. |
| Client page changes | Client-safe payload fields and redaction rules. | No-leakage tests. |
| Approval/release changes | Advisor/compliance gate separation. | Advisor-not-release and release-block tests. |
| Evidence page changes | Sufficiency rules and evidence links. | Upload-not-sufficiency tests. |
| Audit UI changes | Audit event requirements and failure behaviour. | Audit persistence/fail-closed tests. |
| Export changes | Scope/redaction/approval/download separation. | Forbidden-payload and approval/download separation tests. |
| Admin/governance changes | Admin non-bypass contract. | Admin bypass negative tests. |

---

## 14. Codex Task Derivation Preconditions

Codex tasks for UX refactoring may only be created after the following intermediate artefacts exist.

| Order | Required Artefact | Purpose | Codex Gate |
|---:|---|---|---|
| 1 | `ALPHAVEST_UX_INPUT_INVENTORY.md` | Lock inputs and missing evidence. | Required before planning. |
| 2 | `ALPHAVEST_UX_ROUTE_FLOW_PROBLEM_MAP.md` | Map route/flow problems by journey and role. | Required before route tasks. |
| 3 | `ALPHAVEST_UX_NAVIGATION_INFORMATION_ARCHITECTURE_PLAN.md` | Define app shell, sidebar, topbar, hubs and in-flow nav. | Required before navigation implementation. |
| 4 | `ALPHAVEST_UX_PAGE_COMPLEXITY_REDUCTION_MATRIX.md` | Define page jobs, primary tasks, content hierarchy and decomposition/compaction. | Required before page refactor tasks. |
| 5 | `ALPHAVEST_UX_CLICKFLOW_PAGEFLOW_REDESIGN.md` | Define redesigned user flows and CTAs. | Required before flow tasks. |
| 6 | `ALPHAVEST_UX_INTERACTION_STATE_REFACTORING_CONTRACT.md` | Define real interactions and states. | Required before interaction tasks. |
| 7 | `ALPHAVEST_UX_LAYOUT_DENSITY_SYSTEM.md` | Define density, spacing, grid and component hierarchy. | Required before broad layout work. |
| 8 | `ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md` | Convert locked UX decisions into task groups. | Required before final handoff. |
| 9 | `ALPHAVEST_UX_REFACTORING_IMPLEMENTATION_HANDOFF.md` | Final implementation-only handoff. | Required before Codex execution. |

### 14.1 Task-readiness checklist

A future UX Codex task is ready only if every item below is explicit.

| Requirement | Required? |
|---|---:|
| Source route / flow / screenshot is identified. | Yes |
| UX problem is concrete and user-impact is stated. | Yes |
| Target route/component/files are known. | Yes |
| Allowed changes are listed. | Yes |
| Forbidden changes and stop rules are listed. | Yes |
| Safety impact is classified. | Yes |
| Acceptance criteria are measurable. | Yes |
| P0 positive/negative tests are mapped if safety-critical. | Yes |
| Validation commands are known. | Yes |
| Proof required is specified. | Yes |

---

## 15. Later Codex Task Format Preview

No final Codex tasks are created here. The later task format should be:

| Field | Meaning |
|---|---|
| Task ID | Unique UX task ID, e.g. `UX-TASK-NAV-001`. |
| Source Decision | Artefact, route, flow, screenshot or problem-map reference. |
| Problem | Concrete UX issue. |
| User Impact | Why it confuses, slows, overloads or misleads users. |
| Refactoring Intent | What should change and why. |
| Target Files | Concrete files/components/routes. |
| Allowed Changes | Permitted technical and design changes. |
| Forbidden Changes | Stop rules, scope blockers and safety limits. |
| Implementation Steps | Codex-ready steps with sequence. |
| Acceptance Criteria | Checkable outcome. |
| P0 / Safety Tests | Positive and negative tests where required. |
| Validation Commands | Exact commands to run. |
| Proof Required | Screenshot, route smoke, flow proof, no-leakage proof, test output. |
| Reporting Required | What Codex must report after implementation. |

### 15.1 Example task skeleton only

```markdown
## UX-TASK-NAV-001 — Refactor Advisory Workflow navigation grouping

**Source Decision:** ALPHAVEST_UX_NAVIGATION_INFORMATION_ARCHITECTURE_PLAN.md / UX-FLOW-003  
**Problem:** Users cannot distinguish signals, workbench, advisor approval and compliance release as one staged journey.  
**User Impact:** Analyst and Advisor lose orientation and may treat approval/release as disconnected pages.  
**Refactoring Intent:** Group advisory workflow routes into a stage-based navigation model with visible current stage and next best action.  
**Target Files:** To be determined from `full-workflow` route/component inspection.  
**Allowed Changes:** Navigation labels, grouping, page-header metadata, in-flow guidance.  
**Forbidden Changes:** No route reclassification; no P1/hold elevation; no client-visible AI Draft; no safety weakening.  
**Implementation Steps:** To be filled only after UX IA plan is locked.  
**Acceptance Criteria:** Navigation shows stages and preserves role/payload restrictions.  
**P0 / Safety Tests:** Required if route/action visibility changes.  
**Validation Commands:** To be confirmed.  
**Proof Required:** Screenshot proof, route smoke, role visibility/no-leakage proof.
```

---

## 16. Stop Rules

The following stop rules apply to this brief and to every downstream UX refactoring artefact.

### 16.1 Absolute stop rules

- No implementation from this artefact.
- No code changes from this artefact.
- No Codex execution from this artefact.
- No final Codex tasks from this artefact.
- No final implementation handoff from this artefact.
- No screen generation.
- No state-screen generation.
- No image generation.
- No new route authorization.
- No P1 or hold route promotion to MVP.
- No reference-only route conversion into product surface.
- No `main` target usage.
- No `main`-derived target gaps.
- No blind schema replacement.
- No new Prisma model solely because UX wants a cleaner screen.
- No new API route unless later final handoff proves existing APIs cannot satisfy the locked task.

### 16.2 UX-specific stop rules

- Do not solve page complexity by adding more cards, widgets or status chips.
- Do not hide safety gates just to make pages cleaner.
- Do not collapse advisor approval and compliance release.
- Do not present upload success as evidence sufficiency.
- Do not present export preview as export approval.
- Do not present audit timeline display as audit persistence.
- Do not present route access as action authority.
- Do not make fake interactions look real.
- Do not add CTAs without permission/object/payload semantics.
- Do not make client-facing pages show internal-only drafts, rationale, compliance notes or unreleased evidence.
- Do not turn demo workflow actions into claims of production persistence.

### 16.3 Scope-specific route stop rules

| Route Scope | UX Treatment |
|---|---|
| `MVP` | Eligible for UX planning and later tasks, with safety/P0 obligations. |
| `MVP_SUPPORT` | Eligible only where flow-relevant. |
| `P1_AFTER_MVP` | Document as deferred; no MVP UX implementation task. |
| `REFERENCE_ONLY` | Keep as reference/catalogue; no product implementation task. |
| `HOLD_PENDING_DECISION` | No final UX contract, no screen generation, no implementation task. |

---

## 17. Minimum Direct Answer to the User

Um dir einen belastbaren UX-Refactoring-Plan mit detaillierten Codex-Tasks zu erstellen, brauche ich mindestens:

1. den aktuellen `full-workflow` Repo-/ZIP-Stand inklusive Branch und Validierungsbefehlen,
2. aktuelle Screenshots oder ein Screen Recording der App,
3. eine markierte Liste der Seiten, die zu komplex sind,
4. eine markierte Liste der Seiten, die zu viel Platz verschwenden,
5. die Top 5–10 Clickflows mit Rolle, Start, Ziel, Erfolgszustand und Abbruchzustand,
6. die aktuelle Menü-/Sidebar-/Topbar-Struktur inklusive deiner Kritik daran,
7. deine gewünschte Navigationslogik: journey-stage, role-based, object-based oder hybrid,
8. Page Job Statements für die wichtigsten Seiten oder zumindest eine Priorisierung der Top-20 Seiten,
9. gewünschte Dichte/Viewport-Ziele, zum Beispiel 1440×900 oder 16:9 Laptop,
10. klare Beispiele für gewünschte bzw. unerwünschte UX-Tonalität,
11. Bestätigung, welche UX-Änderungen safety-kritisch sind und P0-Negativtests brauchen.

Mit den vorhandenen AlphaVest-Artefakten kann ich bereits vorbereiten:

- die Source-of-Truth-Hierarchie,
- die 71-Routen-Scope-Grenzen,
- die Unterscheidung MVP / MVP_SUPPORT / P1 / Reference / Hold,
- den journey-first UX-Arbeitsrahmen,
- die wichtigsten MVP-Flows aus `MJ-001`, `MJ-002`, `MJ-003`, `MJ-005`, `MJ-006` und `MJ-010`,
- die Safety-Stop-Rules für RBAC, Client Visibility, Advice Boundary, Evidence, Audit und Export,
- ein erstes Navigation-/IA-Modell,
- ein erstes Page-Complexity- und Density-Raster,
- das spätere Codex-Task-Format.

Für die beste Qualität fehlen noch:

- konkrete UX-Evidence aus der laufenden App,
- annotierte Problem-Screenshots,
- priorisierte Flow-Schmerzpunkte,
- Seite-für-Seite-Komplexitätsbewertungen,
- Ziel-Dichte und Layoutpräferenzen,
- genaue Beispiele, welche Bereiche zu “clickdummy-artig” wirken,
- die finalen UX-spezifischen Akzeptanzkriterien und Validierungsbefehle.

**Kurz:** Ich kann den UX-Refactoring-Prozess jetzt sauber strukturieren. Für detaillierte Codex-Umsetzungs-Tasks ohne Interpretationsspielraum brauche ich noch konkrete aktuelle UX-Beweise: Screenshots/Recording, Top-Flows, Problemseiten, Ziel-Dichte und gewünschte Navigationslogik.

---

## 18. ENGINE Proof / QA

### 18.1 ENGINE_v3 Evidence-first proof

| Phase | Applied Decision | Proof in Artefact |
|---|---|---|
| Charter | The artefact is input/approach only, not implementation. | Sections 1 and 16. |
| Evidence | Source hierarchy is explicit and availability is checked. | Section 2. |
| Framing | UX problem is framed as navigation, flows, page complexity, density, interaction and safety. | Sections 4–13. |
| Divergence | Minimum and optional input branches are separated. | Sections 4 and 5. |
| Contradictions | UX simplification is constrained by safety, scope and no-generation rules. | Sections 13 and 16. |
| Branch Build | Phased UX method creates multiple intermediate artefacts. | Section 8. |
| Debate | Journey-first vs menu-first vs page-first is resolved in favour of journey-first with page-level support. | Sections 8–11. |
| Adversarial | False assumptions are listed and blocked. | Sections 6.3 and 16. |
| Convergence | A concrete input package and next artefact chain are defined. | Sections 4, 14 and 17. |
| Proof | Acceptance and validation needs are defined before Codex. | Sections 14–15. |
| Learning | Missing inputs and open questions are preserved. | Section 7. |

### 18.2 ENGINE_v2 UX / Psycho-Logic proof

| Method | Applied To | Result |
|---|---|---|
| Psycho-Logic | Trust, control, orientation, status and decision friction. | UX is treated as guidance and confidence, not cosmetic cleanup. |
| Double Diamond | UX-0 to UX-8. | Discovery and framing precede task convergence. |
| Reframing Matrix | “Pages are complex / waste space.” | Reframed into page job, CTA, content priority, density and flow state. |
| TRIZ | Dense but not overloaded, safe but not alarming. | Progressive disclosure, status-before-action and gate clarity. |
| SIT / Closed World | Existing routes/components/assets. | No screen generation or invention-first redesign. |
| Morphological Analysis | Input package dimensions. | UX is decomposed into route, role, flow, page, layout, state, interaction and safety. |
| SCAMPER | Page simplification. | Consolidate, remove, move to drawers, split into hubs/details, rearrange hierarchy. |
| Harvard / Principled Negotiation | Usability vs safety. | UX improvements cannot compromise non-negotiable safety gates. |
| Measurement Plan | Validation/proof. | Future tasks require route smoke, flow proof, screenshots, no-leakage and tests. |
| Ethics & Fairness | Client visibility and advice boundary. | Client-safe by design remains binding. |

### 18.3 ENGINE_v2-B implementation handoff discipline proof

| Handoff Discipline | Present? | Where |
|---|---:|---|
| Target files later required | Yes | Section 15. |
| Allowed/forbidden changes later required | Yes | Sections 15–16. |
| Acceptance criteria later required | Yes | Sections 14–15. |
| Test obligations later required | Yes | Sections 13–15. |
| Validation commands later required | Yes | Sections 4 and 15. |
| Stop rules included | Yes | Section 16. |
| No implementation now | Yes | Sections 1 and 16. |
| No final Codex tasks now | Yes | Sections 14–15. |

### 18.4 QA checklist

| QA Check | Result |
|---|---|
| Answers what input is needed | PASS |
| Separates minimum from optional inputs | PASS |
| Uses existing AlphaVest artefacts | PASS |
| Does not implement | PASS |
| Does not create final Codex tasks | PASS |
| Explains how inputs become tasks later | PASS |
| Addresses navigation / user flows / page flows / click flows | PASS |
| Addresses complex pages and wasted space | PASS |
| Protects safety and route scope | PASS |
| Blocks `main` target usage | PASS |
| Blocks screen/state/image generation | PASS |
| Provides direct answer to user | PASS |
| Applies ENGINE_v2 and ENGINE_v3 | PASS |

