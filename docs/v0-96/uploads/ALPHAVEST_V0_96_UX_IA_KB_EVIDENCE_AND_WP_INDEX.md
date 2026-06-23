# ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md

**Generated:** 2026-06-23  
**Mode:** Prompt 00 execution only. Read-only KB/UI/UX/IA evidence intake and Work Package index.  
**Target source file:** `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md`  
**No implementation. No code changes. No Codex tickets. No screen generation. No image generation.**

---

## 1. Executive Intake Decision

**Decision:** `PROMPT_00_KB_UI_UX_IA_INTAKE_ACCEPTED_WITH_WP_INDEX_READY`

Prompt 00 has been executed as an evidence and indexing artefact. The available AlphaVest Knowledge Base and the V0.96 Core Journey UX/IA Refactor source file were read as control evidence, while the current `full-workflow` ZIP snapshot was treated as code/snapshot reality where directly inspected.

**Core result:** the next prompt-runner may proceed to WP-specific deep task prompts **only after preserving this register**. The UI/UX/IA issues are not generic redesign issues; they are concrete refactor obligations that must be embedded into the Work Packages whenever Codex touches the relevant surface.

**Primary intake finding:** the UI problem is not simply visual polish. It is an operating-model problem: AlphaVest must stop behaving like a route catalogue / screen catalogue and become a journey-first, role-aware, fail-closed workflow product. The task suite must therefore fold IA, layout, density, CTA hierarchy, state feedback, microcopy and interaction lifecycle work directly into Evidence, Analyst, Advisor, Compliance, Client, Audit, Governance and Export tasks.

**Readiness decision for next prompts:** `READY_TO_RUN_WP_01_TO_WP_17_PROMPTS_AFTER_WP00_REBASE`

---

## 2. Source-of-Truth Lock

| Rank | Source / Artefact | Type | Trust Level | Allowed Use | Forbidden Use |
|---:|---|---|---|---|---|
| 1 | Current `full-workflow` repo or current ZIP snapshot | Code reality | Highest for routes/files/APIs/components/tests/schema if directly inspected | Implementation baseline and rebase target | Assuming every file is complete, safe or V0.96-ready |
| 2 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Target WP source | Highest for this prompt suite's WP list and V0.96 UX/IA intent | WP index, release scope, UX/IA task framing | Treating it as code proof |
| 3 | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` + `FINAL_CODEX_TASK_MASTER.md` | Handoff/control | Binding for implementation constraints | Stop rules and task authorization boundary | Expanding scope beyond V0.96 |
| 4 | `ALPHAVEST_UX_NAVIGATION_PAGE_DENSITY_CTA_DECISION_BRIEF.md`, `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`, `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md` when present in repo/snapshot | UX/IA control evidence | High for UX direction, not code truth | Journey-first IA, page type, density, CTA, long/sparse page policy | Treating visual proof assets as behaviour proof |
| 5 | Phase 3 UX, Phase 5 IA, Phase 6 Layout, Phase 8 Interaction, Phase 9 States, Phase 15 Microcopy outputs from KB bundle | Audit evidence | High for discovered issue families; medium for route/code mapping | Problem-family evidence and candidate gaps | Direct implementation without code recheck |
| 6 | `MVP_SCOPE_LOCK.md`, `ROUTE_SCOPE_LOCK.md`, `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md`, `STATE_SCREEN_SPEC.md` | Scope/state control | Binding scope and state context | MVP/P1/HOLD boundaries and state worksets | Reclassifying held or P1 routes |
| 7 | `DRAWER_MODAL_INTERACTION_CONTRACT.md`, `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Interaction/feedback contracts | Binding for lifecycle/no-overclaim | Modal/drawer lifecycle, feedback states, microcopy rules | Treating visible UI as completed behaviour |
| 8 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md`, `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | P0 safety contracts | Binding | No unapproved advice, no AI draft leakage, no admin bypass, upload-not-sufficiency, audit/export safety | Weakening gates for UX convenience |
| 9 | `API_CONTRACT_MATRIX.md`, `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`, `P0_TEST_ACCEPTANCE_MATRIX.md` | API/schema/test contracts | Binding for proof obligations | API hardening, schema baseline, P0 positive/negative tests | Claiming presence equals readiness |
| 10 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`, `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey/product control | High | Selected V0.96 journey spine and foundational requirements | Flattening all journeys into this release |
| 11 | `main` branch / `alphavest-wealthos-clickdummy-main.zip` | Legacy/false-gap source | Low for target truth | Historical warning only | Any implementation task, route decision or absence claim |

**Current snapshot note:** the inspected `alphavest-wealthos-clickdummy-full-workflow.zip` contains **815 files**, **15 API route files**, **51 Playwright/spec files**, **51 component files** and **76 lib modules**. This supersedes older snapshot counts such as 405 files, 4 APIs and 10 specs **for current-snapshot planning only**. WP-00 must re-check the live repo/checkout again before implementation.

---

## 3. UI/UX/IA Evidence Register

| Evidence Item | Source Artefact | Route / Component / Work Package | Problem Type | Severity | Task Implication | Must Refactor Now? |
|---|---|---|---|---|---|---|
| Route catalogue / state catalogue feeling must become a guided operating system. | V0.96 UX/IA Refactor source; True-UX direction in repo snapshot | WP-01, app shell, sidebar, topbar, page header | IA / navigation | High | Build journey-first navigation and page headers around current job, gate, blocker and next step. | Yes |
| `HYBRID_JOURNEY_FIRST_IA` is the selected navigation model. | V0.96 UX/IA Refactor source | WP-01 | IA / product framing | High | Role-aware primary navigation; object context inside workspaces/details; no flat screen list. | Yes |
| Long/complex pages were explicitly listed: `/actions`, `/signals`, `/admin/platform`, `/compliance/:id/review`, `/export/:id/redaction`, `/compliance/:id/audit`, `/workbench`, `/workbench/triggers/:id`, `/advisor-approval/:id`, `/portal`, `/documents`, `/export/:id/scope`, `/export/:id/preview`. | V0.96 source; Phase 3 UX; Phase 6 layout evidence | WP-02, WP-03, WP-04, WP-05, WP-06, WP-07, WP-10 | Layout / scroll depth | High | Use summary-first, decision room structure, queue/detail split, secondary drawers/tabs, progressive disclosure. | Yes for touched V0.96 routes |
| Sparse / low-value pages should gain meaningful density, not filler. | V0.96 source; Phase 6 Layout | WP-02, WP-07, WP-16 | Layout / density | Medium | Add next-work, state explanation, related evidence/decision/audit/context only when supported by data. | Yes where touched |
| Many screens show 25–30+ interactive candidates and unclear priority. | V0.96 source; Phase 3 UX map | WP-01, WP-11, WP-12, all surface WPs | CTA hierarchy | High | Enforce one primary CTA per page state; demote secondary actions. | Yes |
| Guidance panels can become decorative and compete with main content. | V0.96 source; product guidance tests/components in snapshot | WP-01, WP-12 | Page header / guidance | Medium | Page header must state page job, gate/blocker and next step; guidance collapsible/contextual. | Yes |
| Advisor Approval can look like client release if copy/layout is weak. | V0.96 source; Feedback contract; RBAC/advice boundary contract | WP-05, WP-06, WP-12, WP-15 | Gate semantics / microcopy | Critical | Advisor UI must say waiting for compliance; no client visibility from advisor approval. | Yes |
| Upload interaction is real, but upload is not evidence sufficiency. | Interaction Reality Audit; Evidence/Audit/Export Contract; V0.96 source | WP-03, WP-12, WP-13, WP-15 | Feedback / evidence semantics | Critical | Upload success text must be upload-only; sufficiency requires review/link/relevance/acceptance. | Yes |
| Evidence sufficiency requires linked, relevant, reviewed and accepted evidence. | Evidence/Audit/Export Contract; MVP Journey Requirements Matrix | WP-03, WP-06, WP-14, WP-15 | Evidence lifecycle | Critical | Evidence UI needs pending/insufficient/rejected/sufficient/link states and release blockers. | Yes |
| AI/rules draft must stay internal-only. | RBAC/Visibility/Advice Contract; MVP Journey Requirements Matrix | WP-04, WP-07, WP-10, WP-15 | Client visibility / AI safety | Critical | Internal AI Draft and rationale must be labelled internal and excluded from client/export payloads. | Yes |
| Compliance release is the only client-visibility release gate. | MVP Scope; RBAC/Visibility/Advice Contract | WP-06, WP-07, WP-12, WP-15 | Workflow gate | Critical | Compliance Decision Room must show blocker/precondition/release states; release disabled until gates pass. | Yes |
| Client-facing pages must fail closed. | State Spec; RBAC/Visibility/Advice Contract | WP-07, WP-13, WP-15 | Client-safe UI | Critical | Portal/mobile show no released content / redacted summary unless release proof exists. | Yes |
| Audit timeline/display is not audit persistence proof. | Interaction Reality Audit; Evidence/Audit/Export Contract | WP-08, WP-13, WP-15 | Audit truth | Critical | UI must bind to persisted audit events and show audit unavailable/fail-closed states. | Yes |
| Export preview, approval and download/share are different gates. | Evidence/Audit/Export Contract; V0.96 source | WP-10, WP-12, WP-15 | Export semantics | Critical | Staged export UI: scope → redaction → preview → approval → manifest/download; copy must not overclaim. | Yes |
| Forbidden export payload must be excluded. | Evidence/Audit/Export Contract; P0 matrix | WP-10, WP-13, WP-15 | Export safety | Critical | Tests must assert no AI draft/internal notes/compliance notes/unreleased evidence in export. | Yes |
| Modals/drawers are often visual or partial, not lifecycle proof. | Interaction Reality Audit; Drawer/Modal Contract | WP-06, WP-09, WP-10, WP-11 | Interaction lifecycle | High | Define trigger/open/close/cancel/submit/loading/error/focus/permission/audit lifecycle. | Yes where touched |
| Tables/filter/kanban primitives can render without real interaction behaviour. | Interaction Reality Audit; Phase 8 interaction outputs | WP-03, WP-04, WP-05, WP-09, WP-11 | Interaction / table states | Medium/High | Add empty/loading/error/filtered-empty/row-action semantics only where V0.96 needs them. | Yes where touched |
| State-screen audit found many missing/inferred loading/error/success/validation/confirmation states. | Phase 9 state outputs; State Screen Spec | WP-03–WP-12, WP-15 | State coverage | High | Implement V0.96-required loading/error/empty/permission/blocked/success/retry states. | Yes |
| Microcopy audit identified unclear CTAs, missing guidance, consequence explanations and state feedback gaps. | Phase 15 content/microcopy outputs | WP-12, all surface WPs | Microcopy / terminology | High | Replace overclaim copy; verify status labels and CTA wording. | Yes |
| Navigation-like elements are numerous and may imply actions not proven by interaction phases. | Phase 5 IA outputs | WP-01, WP-11, WP-15 | IA / interaction expectation | High | Navigation labels and action labels must not imply unsupported workflow actions. | Yes |
| Visual assets `001–063` are visual evidence only; `064–071` missing/non-public refs are not generation authorization. | Route/Visual/State Reconciliation; Screen Generation Brief | WP-00, WP-16 | Visual proof / generation stop | High | No screen/image generation; hold/P1/reference routes remain blocked/deferred. | Yes as stop rule |
| Existing tests are proof slices, not complete V0.96 P0 proof. | P0 Test Acceptance Matrix; current snapshot specs | WP-15, WP-16 | Test proof | Critical | Add/update positive and negative tests for journey, safety and true UX. | Yes |
| Current snapshot already contains UX helpers and true-UX tests. | Current full-workflow ZIP snapshot | WP-00–WP-16 | Code reality / reuse | High | Reuse `ux-*`, `product-guidance-panel`, `guarded-action-button`, `a11y-status`, true-UX tests before adding new abstractions. | Yes, after recheck |
| App shell / sidebar / topbar / page-header components exist and must be rechecked. | Current full-workflow ZIP snapshot | WP-01 | Component reality | High | Codex must inspect before changing navigation or header semantics. | Yes |
| Client pages and internal workbenches need different density. | V0.96 source; True-UX density evidence | WP-02, WP-07 | Density / layout | High | Calm client pages; compact productive internal pages; no one-size-fits-all density. | Yes |
| Status chips/buttons are not gates. | Feedback contract; Interaction audit; V0.96 rules | WP-11, WP-12, WP-13, WP-15 | UI truth | Critical | Bind status and actions to service/state/permission truth; disable/deny/hide honestly. | Yes |
| Admin must not look like superuser release authority. | RBAC contract; V0.96 source | WP-09, WP-15 | Governance UX | Critical | Admin UI may configure/govern, not force release/evidence/export/visibility gates. | Yes |
| Hold routes `064–067`, `069–071` must not silently become V0.96. | Route Scope Lock; Route/Visual Matrix; V0.96 source | WP-00, WP-01, WP-16 | Scope control | Critical | Only guard/de-emphasize if navigation touches them; no implementation or visual generation. | Yes as guard |

---

## 4. Known UI/UX/Layout/IA Problem Families

| Problem Family | Evidence Summary | Required Task Handling |
|---|---|---|
| Journey-first IA vs route catalogue | The KB repeatedly frames the app as too route/screen/state-catalogue-like. | WP-01 must create role-aware journey navigation and useful page headers; WP-specific tasks must not rebuild a flat 71-route menu. |
| Long page / scroll sprawl | Multiple V0.96 routes are explicitly flagged as long/complex. | WP-02 defines page types and density; WP-03–WP-10 apply summary-first and progressive disclosure to touched surfaces. |
| Empty or low-value space | Some surfaces have too much empty/unused space relative to decision work. | Add real next-work / blocker / related-object context only if supported by state/data. No filler. |
| Weak page jobs | Guidance exists but may not answer “what do I do here?”. | Page header/page job must show current gate, blocker and next step. |
| Too many equal CTAs | Many pages expose large numbers of actions. | One primary CTA per state; secondary actions grouped/demoted/disabled. |
| Visual-only interaction | Modal/drawer/table/status presence does not prove lifecycle. | WP-11 hardens shared primitives; surface WPs specify lifecycle and tests. |
| No-overclaim feedback | Upload/advisor/export/audit copy can imply downstream gates. | WP-12 creates microcopy and feedback rules used by all surface WPs. |
| Safety state visibility | Client/admin/advisor/compliance surfaces must fail closed. | WP-06/WP-07/WP-09/WP-13/WP-15 must test deny/hidden/redacted states. |
| Evidence lifecycle truth | Upload alone can be confused with sufficiency. | WP-03 must represent pending/review/linked/sufficient/insufficient/rejected states. |
| Advisor/compliance boundary | Advisor approval can be mistaken for release. | WP-05 and WP-06 must visually and semantically separate approval and release. |
| Audit truth | Audit display can be mistaken for persisted proof. | WP-08 must bind UI to persisted audit references and fail closed if audit is unavailable. |
| Export staging | Export preview, approval, download/share can be conflated. | WP-10 must implement staged export UX and forbidden-payload tests. |
| Density inconsistency | Client pages and internal workbenches require different density. | WP-02 must define page type/density rules and WP-15 must test them. |
| P1/HOLD visual refs | Missing refs are not authorization to generate. | WP-00/WP-16 must preserve no-generation and held-route blockers. |

---

## 5. Work Package Index from `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md`

| WP | Name | Purpose | Primary Surface / Area | V0.96 Blocking? | UX/IA Role |
|---|---|---|---|---|---|
| WP-00 | Moving Baseline + UX/IA Delta Register | Reconcile current repo, KB, V0.96 scope and UX evidence before edits. | Whole repo / docs / tests | Yes | Evidence intake, delta map, stop-rule enforcement |
| WP-01 | Journey-first IA / App Shell / Sidebar / Topbar / Page Header | Stop route-catalogue feel and create role-aware journey navigation. | App shell, sidebar, topbar, page header | Yes | Primary IA refactor |
| WP-02 | Page-Type + Density System | Define page types and density tiers. | Layout patterns across V0.96 surfaces | Yes | Layout and density refactor |
| WP-03 | Evidence Workbench + Sufficiency UX | Build evidence request/upload/review/link/sufficiency UX. | Documents, upload, evidence, extraction/review | Yes | Evidence lifecycle truth |
| WP-04 | Analyst Workbench + AI Draft Internal Review | Support unsupported claim/rebuild/internal-only review. | Signals, workbench, trigger detail | Yes | Internal review IA and AI safety UI |
| WP-05 | Advisor Queue + Approval Detail | Advisor approval without release overclaim. | Advisor queue/detail | Yes | Human review gate clarity |
| WP-06 | Compliance Decision Room | Compliance block/request evidence/release with audit and confirmation. | Compliance queue/review/release/block/audit | Yes | Decision room and release gate UI |
| WP-07 | Decision Record + Client-Safe Projection | Released decision record and fail-closed client view. | Decisions, portal, mobile | Yes | Client-safe projection and calm client UI |
| WP-08 | Audit Surface + Persistence UI | Show persisted audit events and unavailable/fail-closed states. | Audit timeline/history | Yes | Audit truth UI |
| WP-09 | Governance / Admin Non-Bypass UX | Governance UI without superuser-bypass impression. | Admin roles/users/access/security | Yes | Admin safety UX |
| WP-10 | Export Scope / Redaction / Approval UX | Staged export with redaction and approval boundaries. | Export scope/redaction/preview/download | Late-stage yes | Trust-output UX |
| WP-11 | Shared Interaction Primitives | Modal/drawer/table/form/CTA/a11y lifecycle. | Shared UI primitives | Yes | Cross-cutting interaction refactor |
| WP-12 | No-Overclaim Microcopy + State Feedback | Copy and state feedback hardening. | All touched surfaces | Yes | Cross-cutting content safety |
| WP-13 | API/Service Integration for UI Truth | Drive UI states from real service/API truth. | APIs/services/UI data binding | Yes | Prevent fake chips/buttons |
| WP-14 | Schema Usage Alignment for UI/Journey | Align existing schema usage to journey/UI state needs. | Prisma/schema usage | Support blocker | Status/visibility/evidence/export truth support |
| WP-15 | P0 + True-UX Acceptance Suite | Positive/negative safety and UX proof. | Tests | Release blocker | Test real journey + UX behaviour |
| WP-16 | Release Evidence / Handoff Update | Close with evidence index, changed files/tests and carry-forward blockers. | Docs/handoff/proof | Yes | Release proof, no-generation report |

---

## 6. WP-to-UX/IA-Problem Mapping

| WP | Must Include UX/IA Refactor? | Problem Families to Carry | Primary KB Evidence | Key Acceptance Signal |
|---|---|---|---|---|
| WP-00 | Yes, audit only | Moving baseline, UX delta, current snapshot contradiction, old counts vs current repo | V0.96 source, current snapshot, all KB | Delta register exists before any edit |
| WP-01 | Yes, primary | Route catalogue, role-aware nav, page job, sidebar/topbar/header, P1/HOLD de-emphasis | V0.96 source, Phase 5 IA, route scope | Navigation groups by journey and role, not flat route list |
| WP-02 | Yes, primary | Long pages, whitespace, density, page type, progressive disclosure | V0.96 source, Phase 6 Layout, True-UX density | Page-type/density rules are reusable and tested |
| WP-03 | Yes | Upload/sufficiency confusion, evidence states, no-overclaim, table/detail states | Evidence contract, interaction audit, state spec | Upload success remains upload-only; sufficiency requires review/link/relevance |
| WP-04 | Yes | AI internal-only, analyst review, unsupported claim, needs evidence, internal note clarity | RBAC/advice contract, journey requirements | AI Draft and internal rationale never client/export visible |
| WP-05 | Yes | Advisor approval vs release confusion, queue/detail density, comments internal-only | Feedback contract, RBAC/advice contract | Advisor approved -> compliance pending, not client-visible |
| WP-06 | Yes | Compliance decision room, blockers, release confirmation, request evidence, audit required | State spec, drawer/modal contract, evidence/audit contract | Release disabled/fails closed until advisor/evidence/audit/preconditions pass |
| WP-07 | Yes | Client-safe projection, calm client UI, fail-closed, decision record | RBAC/visibility contract, journey matrix | Client sees only released redacted summary or no released content |
| WP-08 | Yes | Audit display vs persistence, audit unavailable, event references | Evidence/audit contract, interaction audit | Gate action UI references persisted audit event or blocks |
| WP-09 | Yes | Admin non-bypass, second confirmation, governance scope, denied admin actions | RBAC contract, P0 matrix | Admin cannot force release, evidence sufficiency, visibility or export |
| WP-10 | Yes | Export staging, redaction preview, approval/download separation, forbidden payload | Export contract, feedback contract | Export manifest excludes internal/forbidden payloads and separates preview/approval/download |
| WP-11 | Yes, shared | Modal/drawer lifecycle, table/form states, CTA logic, focus/a11y | Drawer/modal contract, interaction audit | Shared primitives no longer behave as visual-only proof where used |
| WP-12 | Yes, cross-cutting | Microcopy gaps, no-overclaim, status terms, consequence explanations | Phase 15, feedback contract | Copy names only completed action and does not imply downstream gate |
| WP-13 | Indirect but mandatory | UI truth from APIs/services, safe error states, no fake chips | API matrix, P0 matrix | UI states derive from service/API payload/guards, not static labels |
| WP-14 | Indirect but mandatory | Schema state/visibility/status support for truthful UI | Schema reconciliation | Existing schema fields are aligned; no blind replacement |
| WP-15 | Yes, proof | True-UX, density, states, IA, interaction lifecycle, P0 negative proof | P0 matrix, current snapshot tests | Positive + negative tests prove journey and UX claims |
| WP-16 | Yes, proof only | Evidence/handoff, no-generation, screenshots only from tests, carry-forward | Final handoff, screen-generation brief | Release evidence index and blockers are documented |

---

## 7. Route / Component / Surface Mapping

### 7.1 V0.96 Core Route Workset

| Route IDs | Routes / Surface | Primary WPs | UX/IA Treatment |
|---|---|---|---|
| 027–030 | `/documents`, `/documents/upload`, `/documents/extraction-review`, `/documents/verification-pending` | WP-03, WP-12, WP-13, WP-15 | Evidence workbench; upload-only success; extraction/review/pending/insufficient/sufficient states. |
| 033–035 | `/signals`, `/workbench`, `/workbench/triggers/:id` | WP-04, WP-12, WP-13, WP-15 | Analyst queue/workbench/detail; internal AI Draft; unsupported claim and needs-evidence states. |
| 036–037 | `/advisor-approval`, `/advisor-approval/:id` | WP-05, WP-12, WP-15 | Advisor queue/detail; approve/reject/request changes; no release overclaim. |
| 038–042 | `/compliance`, `/compliance/:id/review`, `/compliance/:id/release`, `/compliance/:id/block`, `/compliance/:id/audit` | WP-06, WP-08, WP-12, WP-15 | Compliance decision room; blocker/precondition/release confirmation/audit. |
| 043–047 | `/decisions`, `/decisions/:id`, `/decisions/:id/success`, `/evidence`, `/evidence/:id` | WP-07, WP-03, WP-08, WP-12, WP-15 | Decision record, evidence trace, released summary, audit context. |
| 019–020 | `/portal`, `/mobile` | WP-07, WP-12, WP-15 | Calm client-safe projection; fail-closed no released content state. |
| 048–051 | `/governance/users`, `/governance/roles`, `/governance/access-requests`, `/governance/audit-history` | WP-09, WP-08, WP-12, WP-15 | Governance non-bypass; role/action/audit states. |
| 054–058 | `/export/new`, `/export/:id/scope`, `/export/:id/redaction`, `/export/:id/preview`, `/export/:id/download` | WP-10, WP-12, WP-13, WP-15 | Export staged flow; redaction; preview/approval/download separation. |
| 007–018 | Admin/Tenant support | WP-01, WP-09, WP-12, WP-15 | Support only where required for V0.96 user/tenant/role/governance safety. |

### 7.2 Defer / Guard Route Workset

| Routes | Current Scope Treatment | UX/IA Handling |
|---|---|---|
| 052–053, 059–060, 068 | `P1_AFTER_MVP` | Do not implement for V0.96. If visible in nav, de-emphasize or mark deferred without breaking route smoke tests. |
| 061–063 | `REFERENCE_ONLY` | Do not treat as product surfaces. If navigation is refactored, place under reference/utility or hide from journey nav. |
| 064–067, 069–071 | `HOLD_PENDING_DECISION` | No implementation, no visual generation, no scope elevation. Guard only if needed to prevent misleading navigation. |

### 7.3 Component / Module Families to Recheck

| Component / Module | Expected Relevance | WP(s) |
|---|---|---|
| `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx`, `components/page-header.tsx` | App shell/navigation/header IA | WP-01 |
| `lib/navigation.ts`, `lib/route-registry.ts`, `lib/ux-route-policy.ts`, `lib/ux-page-contract.ts` | Route metadata, nav grouping, page contract | WP-00, WP-01, WP-02 |
| `components/ux-hub-page.tsx`, `components/ux-cta-cluster.tsx`, `lib/ux-density.ts`, `lib/ux-content-hierarchy.ts` | Existing UX helpers to reuse | WP-02, surface WPs |
| `components/client-intake-screen.tsx` | Documents, upload, portal/mobile | WP-03, WP-07 |
| `components/internal-workflow-screen.tsx` | Analyst, advisor, compliance workflow | WP-04, WP-05, WP-06 |
| `components/decisions-governance-screen.tsx` | Decisions, evidence, governance | WP-07, WP-08, WP-09 |
| `components/communication-export-ops-screen.tsx` | Export surfaces | WP-10 |
| `components/ui/modal.tsx`, `components/ui/drawer.tsx`, `components/ui/data-table.tsx`, `components/ui/state-panel.tsx`, `components/ui/guarded-action-button.tsx`, `components/ui/a11y-status.tsx` | Interaction primitives | WP-11 |
| API routes under `app/api/**/route.ts` | UI truth and safe state transitions | WP-13 |
| `prisma/schema.prisma` and service modules | State/schema truth | WP-14 |
| `tests/true-ux-*.spec.ts`, `tests/*p0*.spec.ts`, `tests/navigation-shell.spec.ts`, `tests/ui-state-boundaries.spec.ts`, `tests/interaction-lifecycle.spec.ts` | Acceptance proof | WP-15 |

---

## 8. Refactor-Now vs Refactor-Later Decision Table

| Item | Decision | Why | Routed To |
|---|---|---|---|
| Journey-first navigation for V0.96 routes | `REFACTOR_NOW` | The task pack explicitly makes IA a V0.96 blocker. | WP-01 |
| Page header semantics | `REFACTOR_NOW` | Page job/gate/blocker/next step are required to make workflows understandable. | WP-01, WP-12 |
| Page-type/density system | `REFACTOR_NOW` | Long/sparse page problems affect the same routes V0.96 touches. | WP-02 |
| Evidence workbench states | `REFACTOR_NOW` | Core journey and P0 safety depend on evidence lifecycle truth. | WP-03 |
| Analyst AI Draft internal-only UI | `REFACTOR_NOW` | Core no-unapproved-advice and AI draft redaction proof. | WP-04 |
| Advisor queue/detail | `REFACTOR_NOW` | Advisor approval must not look like release. | WP-05 |
| Compliance decision room | `REFACTOR_NOW` | Release gate is central to V0.96. | WP-06 |
| Client portal/mobile projection | `REFACTOR_NOW` | Client visibility must fail closed. | WP-07 |
| Audit persistence UI | `REFACTOR_NOW` | Audit display vs persistence is a safety risk. | WP-08 |
| Admin/governance non-bypass UI | `REFACTOR_NOW` | Admin superuser illusion breaks safety promise. | WP-09 |
| Export redaction flow | `REFACTOR_NOW_AS_LATE_STAGE` | `MJ-005` is V0.96 trust output, after release/client-safe logic. | WP-10 |
| Shared modal/drawer/form/table CTA/a11y primitives | `REFACTOR_NOW_WHERE_USED` | Required only where V0.96 surfaces use them. | WP-11 |
| Microcopy/no-overclaim | `REFACTOR_NOW` | Cross-cutting safety and UX issue. | WP-12 |
| API/service integration for UI truth | `REFACTOR_NOW` | UI must not rely on static chips. | WP-13 |
| Schema usage alignment | `REFACTOR_NOW_IF_NEEDED_AFTER_REBASE` | Existing schema should be used first; migrations only if proven necessary. | WP-14 |
| Committee/KYC/SoW/Suitability/IPS visuals | `REFRACTOR_LATER/HOLD` | Held routes and missing/non-public refs do not authorize implementation. | Carry-forward blocker |
| Full 71-route redesign | `DO_NOT_DO` | Broad redesign is explicitly out of scope. | Stop rule |
| New screens/images/state-screen assets | `DO_NOT_DO` | Generation is not authorized. | Stop rule |

---

## 9. Current Repo Reality Checks Required in WP-00

Codex must perform these checks before implementing any downstream WP:

| Check ID | Required Check | Expected Output |
|---|---|---|
| RR-001 | Count routes in `lib/route-registry.ts` and classify V0.96/P1/HOLD/reference. | Current route register and delta to KB. |
| RR-002 | Count and list `app/api/**/route.ts`. | API inventory; note existing 15-route snapshot if still true. |
| RR-003 | Count and list tests under `tests/**/*.spec.ts`. | Test inventory; note existing 51-spec snapshot if still true. |
| RR-004 | List UX helper modules/components: `ux-*`, `product-guidance-panel`, `guarded-action-button`, `a11y-status`, `state-panel`, `modal`, `drawer`, `data-table`. | Reuse-first map. |
| RR-005 | Inspect app shell/sidebar/topbar/page-header. | Current IA capability and refactor entry points. |
| RR-006 | Inspect V0.96 surface components: client intake, internal workflow, decisions/governance, export/ops, admin setup. | Current layout/state/interaction reality. |
| RR-007 | Inspect API/service paths for Evidence, Advisor, Compliance, Client Visibility, Audit and Export. | UI truth source map. |
| RR-008 | Inspect Prisma schema fields relevant to `Recommendation`, `Approval`, `ComplianceReview`, `Decision`, `Document`, `EvidenceRecord`, `AuditEvent`, `ExportRequest`, `Role`, `Permission`, `UserRole`. | Schema support map; no blind changes. |
| RR-009 | Compare current code with older KB counts. | `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `BLOCKED` classification. |
| RR-010 | Produce UX/IA delta register before edits. | Route/component/WP delta and priority order. |

Suggested validation commands must be confirmed in `package.json` first:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test -- --grep "true-ux|p0|visibility|evidence|audit|export|navigation|interaction"
```

---

## 10. Global Stop Rules

| Rule | Applies To | Meaning |
|---|---|---|
| No `main` target use | All WPs | `main` is false-gap only. |
| No broad redesign | All UI WPs | Refactor only touched V0.96 surfaces. |
| No screen/image/state-screen generation | All WPs | Missing visual refs are not generation authorization. |
| No P1/HOLD elevation | All WPs | Routes `052–053`, `059–060`, `068`, `064–067`, `069–071` remain deferred/held unless separately unlocked. |
| No client-visible AI Draft | WP-04, WP-07, WP-10, WP-15 | AI/rules draft and internal rationale remain internal-only. |
| No upload-to-release shortcut | WP-03, WP-06, WP-15 | Upload success never implies sufficiency, release or client visibility. |
| No advisor approval equals release | WP-05, WP-06, WP-12, WP-15 | Advisor approval moves to compliance pending only. |
| No admin bypass | WP-09, WP-15 | Admin can govern/configure but cannot release, force visibility, mark evidence sufficient or suppress audit. |
| No audit-display-as-persistence | WP-08, WP-15 | UI timeline is not proof unless backed by persisted event. |
| No export overclaim | WP-10, WP-12, WP-15 | Preview is not approval; approval is not download/share; download/share is not client acceptance. |
| No visual-only proof | All WPs | Chips, buttons, drawers, modals and PNGs must not be treated as behaviour. |
| No blind schema replacement | WP-14 | Full-workflow schema remains baseline. |
| No API proliferation | WP-13 | Harden existing APIs first; add only if WP-00 proves no safe alternative. |

---

## 11. Prompt Suite Readiness Decision

| Readiness Area | Decision | Notes |
|---|---|---|
| KB-first UI/UX/IA evidence intake | `PASSED_FOR_PROMPT_SUITE` | Evidence register above is sufficient to drive WP-specific prompts. |
| WP source index | `PASSED` | WP-00 through WP-16 identified. |
| Source hierarchy | `PASSED` | `full-workflow` target, `main` false-gap, MD as control evidence. |
| UX/IA problem families | `PASSED` | Route catalogue, long pages, density, CTAs, states, lifecycle and microcopy families extracted. |
| Current code reality | `PARTIAL_SNAPSHOT_ONLY` | ZIP snapshot inspected; live repo must be checked in WP-00 before edits. |
| Prompt 01 readiness | `READY` | Generate WP-00 deep task description next. |
| Prompt 02–17 readiness | `READY_AFTER_PROMPT_01` | Each WP prompt must consume this artefact and the target source WP section. |

**Next required prompt:** `PROMPT 01 — WP-00 DEEP TASK DESCRIPTION`.

---

## 12. ENGINE Execution Proof

| Phase | Engine | What Was Done | Output |
|---|---|---|---|
| Problem framing | ENGINE_v3 | Interpreted the user request as execution of Prompt 00, not implementation. | Prompt 00 artefact target fixed. |
| KB/UI discovery | ENGINE_v3 | Read the V0.96 UX/IA task source and extracted UI/UX/Layout/IA families from KB phase outputs and contracts. | UI/UX/IA Evidence Register. |
| Source hierarchy control | ENGINE_v2 | Locked `full-workflow` as target, `main` as false-gap and Markdown as control evidence. | Source-of-Truth Lock and Stop Rules. |
| Current snapshot reconciliation | ENGINE_v2 | Inspected current `full-workflow` ZIP file counts for API/test/component/lib deltas. | Repo Reality Checks Required in WP-00. |
| WP indexing | ENGINE_v2 | Extracted WP-00 through WP-16 from the target source file. | Work Package Index. |
| UX/IA refactor mapping | ENGINE_v3 + ENGINE_v2 | Connected problem families to WPs and route/component surfaces. | WP-to-UX/IA Mapping and Route/Surface Mapping. |
| Safety/P0 discipline | ENGINE_v2 | Preserved no-overclaim, no-leakage, fail-closed, no-generation and no-bypass rules. | Global Stop Rules and Refactor Decisions. |
| Convergence | Codex-Spark-like | Reduced discovery into direct prompt-suite readiness and next action. | `READY_TO_RUN_PROMPT_01`. |

