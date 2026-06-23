# ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md

**Generated:** 2026-06-23  
**Mode:** Detailed Codex/developer task pack for `V0.96 Core Journey Release` with integrated UI/UX/Layout/IA refactoring.  
**ENGINE mix:** `ENGINE_v2` for execution discipline, task decomposition, evidence gates, tests and stop rules + `ENGINE_v3` for UX/IA strategy, contradiction control and journey design.  
**No code changes made here. No image generation. No screen generation. No state-screen generation. No blind schema replacement.**

---

## 1. Executive Decision

This pack replaces the previous V0.96 task framing with a stronger version:

```text
V0.96 Core Journey Release + UX/IA Refactor
```

The release still implements the product core:

```text
Evidence Request / Upload / Review / Sufficiency
→ Analyst Review / AI Draft internal-only rebuild
→ Advisor Approval
→ Compliance Block / Request Evidence / Release
→ Decision Record
→ Client-Safe Visibility
→ Audit Persistence
→ Redacted Export Manifest
→ P0 positive and negative proof
```

But it now also folds in the UI/UX/Layout/IA knowledgebase findings wherever Codex is already touching the surface. The target is not a visual redesign. The target is a **truthful, guided operating system** instead of a route catalogue, state catalogue or long-page demo rail.

**Primary UX decision:** use a `HYBRID_JOURNEY_FIRST_IA`: journey-first primary navigation, role-aware filtering, object context inside workspaces/details, and page types that separate hubs, queues/workbenches, detail review, decision rooms, drawers and client-safe projections.

**Primary layout decision:** use `CONTROLLED_PREMIUM_WORKBENCH_HYBRID`: calm executive/client pages, compact productive internal workbenches, progressive disclosure for long pages, and one primary CTA per state.

**Primary safety decision:** no UI improvement may weaken RBAC, client visibility, advice boundary, evidence sufficiency, audit persistence or export redaction. UI copy and layout must not overclaim later gates.

---

## 2. Why this new pack exists

The user explicitly clarified that the known UI/UX/Layout/IA problems are already in the knowledgebase. This pack therefore integrates those known findings into implementation tasks instead of producing separate generic UX work.

### Known UI/UX/IA problems to carry into Codex

| Problem family | Knowledgebase signal | Implementation implication |
|---|---|---|
| Route catalogue / state catalogue feeling | AlphaVest should stop feeling like a flat route/state catalogue and become a guided operating system. | Navigation and page headers must guide by journey, role and next work, not merely list screens. |
| Long pages | Screens such as `/actions`, `/signals`, `/admin/platform`, `/compliance/:id/review`, `/export/:id/redaction`, `/compliance/:id/audit`, `/workbench`, `/workbench/triggers/:id`, `/advisor-approval/:id`, `/portal`, `/documents`, `/export/:id/scope`, `/export/:id/preview` were identified as long/complex. | Apply page-type refactor, progressive disclosure, summary-first sections, queue/detail split, drawers for secondary context and sticky/clear next action. |
| Sparse / low-value pages | Some pages carry too much empty space or reference/demo structure relative to actual decision work. | Use support-density strips, decision summaries, compact panels and “next work” modules, not filler. |
| Too many options | Many screens show 25–30+ interactive candidates, making priority unclear. | Enforce one primary CTA per state and demote secondary actions into grouped menus, drawers or context rails. |
| Guidance panels become decorative | Repeated “Workflow guidance” exists but competes with content. | Page header must state page job, current gate/blocker and next step. Guidance becomes contextual and collapsible. |
| Advisor/Compliance confusion | Advisor approval can look like release if copy/layout is weak. | Separate advisor detail from compliance decision room; copy says “waiting for compliance release”. |
| Upload/Sufficiency confusion | Upload interaction is real but upload is not evidence sufficiency. | Upload UI success must remain upload-only; sufficiency requires review/link/relevance/acceptance. |
| Export step confusion | Preview, approval, download/share are semantically different. | Export UI must stage scope → redaction → preview → approval → manifest/download and test forbidden payload exclusion. |
| Modals/drawers are visual or partial | Many overlays exist via visual state/query/static render, not complete lifecycle. | Implement trigger/open/close/cancel/submit/loading/error/focus/permission/audit lifecycles where touched. |
| IA ambiguity and duplicate labels | IA audit found many navigation elements without confirmed targets, duplicate/ambiguous labels and unclear hubs/sections. | Normalize route labels, nav grouping, page headers and action labels for V0.96 routes only. |
| Layout/responsive risks | Layout audit found medium layout risks, scroll/overflow candidates and weak multi-viewport proof. | Add density/layout tests for touched V0.96 surfaces; avoid pixel-perfect broad QA unless necessary. |
| Missing states | State audit found large numbers of inferred missing loading/success/error/validation/confirmation states. | Implement required states only for V0.96 paths and support routes touched by V0.96. |
| Static chips/buttons as fake gates | Visual status chips/buttons are not proof of gate enforcement. | Bind chips/buttons to state, permissions and API/service truth; disabled/denied states must be explicit. |

---

## 3. Source-of-Truth Lock

| Rank | Source / artefact | Use in this task pack | Do not use for |
|---:|---|---|---|
| 1 | Current `full-workflow` repo/branch | Only implementation target. Codex must inspect before edits. | Assuming older MD is current code truth. |
| 2 | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` | Binding implementation constraints and stop rules. | Expanding scope beyond approved constraints. |
| 3 | `ALPHAVEST_UX_NAVIGATION_PAGE_DENSITY_CTA_DECISION_BRIEF.md` | UX direction: journey-first IA, page types, density, one CTA, long/sparse page risks. | Treating video/screenshot evidence as behaviour proof. |
| 4 | `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | UX execution phases: IA, hubs, workbenches, details/drawers, decision rooms, client projections, CTA/state/recovery, density, a11y and P0 tests. | Implementing former P1/Hold scope without current release decision. |
| 5 | `ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md` | Flow split/merge logic and guided operating-system target. | Turning all flow ideas into V0.96 scope. |
| 6 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md` | Journey selection: `MJ-001`, `MJ-002`, `MJ-003`, `MJ-005`, `MJ-006`, `MJ-010`. | Flattening all 144 use cases into this release. |
| 7 | `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Foundation and journey requirements. | Pulling P1/Hold journeys into core. |
| 8 | `MVP_SCOPE_LOCK.md`, `ROUTE_SCOPE_LOCK.md` | Scope boundary. | Reclassifying routes casually. |
| 9 | `STATE_SCREEN_SPEC.md`, `DRAWER_MODAL_INTERACTION_CONTRACT.md`, `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | State/lifecycle/no-overclaim rules. | Generating visual assets or treating visible states as behaviour proof. |
| 10 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | RBAC, payload visibility, AI Draft internal-only, fail-closed client visibility. | Route access equals payload visibility. |
| 11 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence sufficiency, audit persistence, export redaction. | Upload/audit UI/export preview as safety proof. |
| 12 | `API_CONTRACT_MATRIX.md` | API hardening expectations. | API presence as API safety proof. |
| 13 | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | Existing schema baseline and mapping discipline. | Blind Prisma schema replacement. |
| 14 | `P0_TEST_ACCEPTANCE_MATRIX.md` | Positive/negative P0 proof obligations. | Claiming current tests already prove V0.96. |
| 15 | `ALPHAVEST_KNOWLEDGE_BASE_BUNDLE_2026-06-23.zip` generated phase outputs | UX, design, IA, layout, functionality, interaction and states evidence. | Treating screenshot-derived findings as direct code facts. |
| 16 | `main` / old zip | False-gap warning only. | Target implementation truth. |

---

## 4. Current runtime snapshot to re-check in WP-00

The local snapshot currently shows more than older KB layers: approximately **71 routes**, **15 API routes**, **51 Playwright specs**, **60 lib modules**, **50 component files**, and existing UX helper components such as `ux-hub-page`, `ux-cta-cluster`, `ux-density`, `ux-page-contract`, `product-guidance-panel`, `route-context-chip`, `guarded-action-button`, `a11y-status` and several true-UX tests.

Codex must not trust these counts blindly. It must verify them in `WP-00` on the actual repo checkout.

---

## 5. V0.96 Core Journey + UX/IA scope boundary

| Area | Included in V0.96 | Refactor depth | Explicitly not included |
|---|---|---|---|
| Navigation / IA | Journey-first IA for touched V0.96 flows; role-aware nav; route labels; page headers. | Medium: refactor app shell/sidebar/topbar/page header where necessary. | Full global IA redesign for all 71 routes. |
| Hubs | V0.96 journey hubs for evidence/advisory/compliance/governance/export if current repo supports them. | Medium: use existing `ux-hub-page`/contracts if present. | New visual assets or marketing pages. |
| Workbenches / queues | Evidence, analyst, advisor, compliance, governance and export work queues. | High on V0.96 routes; compact task-first layouts. | P1 ops/comms/review monitoring as MVP. |
| Details / drawers | Evidence detail, recommendation detail, audit detail, role/access detail. | High where touched; drawers carry secondary context only. | Drawer as fake primary workflow. |
| Decision rooms | Advisor, compliance release/block, export approval. | High; safety-critical. | Committee/KYC/suitability decision rooms. |
| Client projection | Portal/mobile fail-closed released view. | High; calm executive density. | Client-visible AI Draft or internal notes. |
| Layout density | Apply density tiers to touched pages. | Medium/high: break long pages, compact internals, calm client views. | Pixel-perfect redesign and full multi-viewport QA for all routes. |
| CTA/copy | One primary CTA per state, no-overclaim copy. | High for V0.96 actions. | Generic success messages that imply downstream gates. |
| Forms/tables | Review, approval, evidence, export, governance forms/tables. | Medium/high where touched; validation/error/empty states required. | Full DB-backed CRUD for every route unless already scoped. |
| Tests | True-UX, route, workflow, safety and P0 negative tests for changed paths. | Release blocker. | Done without negative proof. |

---

## 6. Work package overview

| WP | Name | Purpose | UI/UX/IA included? | Blocking? |
|---|---|---|---|---|
| WP-00 | Moving Baseline + UX/IA Delta Register | Reconcile repo, KB, V0.96 and UX findings before edits. | Yes, audit only. | Yes |
| WP-01 | Journey-first IA / App Shell / Navigation | Stop route-catalogue feel; build role-aware V0.96 navigation. | Yes, primary. | Yes |
| WP-02 | Page-Type + Density System | Establish hub/workbench/detail/decision/client page types and density tiers. | Yes, primary. | Yes |
| WP-03 | Evidence Workbench + Sufficiency UX | Evidence request/upload/review/link/sufficiency with honest states. | Yes. | Yes |
| WP-04 | Analyst Workbench + AI Draft Internal Review | Unsupported claim/rebuild flow and internal-only AI draft UX. | Yes. | Yes |
| WP-05 | Advisor Queue + Approval Detail | Advisor gate without release overclaim. | Yes. | Yes |
| WP-06 | Compliance Decision Room | Block/request evidence/release with modal lifecycle and audit. | Yes. | Yes |
| WP-07 | Decision Record + Client-Safe Projection | Released decision/client projection, calm client UI, fail closed. | Yes. | Yes |
| WP-08 | Audit Surface + Persistence UI | Show real audit events and audit unavailable/fail-closed states. | Yes. | Yes |
| WP-09 | Governance / Admin Non-Bypass UX | Governance UI without superuser-bypass impression. | Yes. | Yes |
| WP-10 | Export Scope / Redaction / Approval UX | Staged export flow and forbidden payload exclusion. | Yes. | Late-stage yes |
| WP-11 | Shared Interaction Primitives | Modal/drawer/table/form/CTA/focus lifecycle. | Yes, shared. | Yes |
| WP-12 | No-Overclaim Microcopy + State Feedback | Copy and feedback hardening across V0.96. | Yes, cross-cutting. | Yes |
| WP-13 | API/Service Integration for UI Truth | Bind UI to real state; avoid fake chips/buttons. | Indirect. | Yes |
| WP-14 | Schema Usage Alignment for UI/Journey | Align status/visibility/evidence/export fields. | Indirect. | Support blocker |
| WP-15 | P0 + True-UX Acceptance Suite | Positive/negative proof including UX state/layout/IA checks. | Yes. | Release blocker |
| WP-16 | Release Evidence / Handoff Update | Close with proof, screenshots, diffs, no-generation report. | Yes, proof only. | Yes |

---

## 7. Global implementation rules

1. **Codex must start with WP-00.** No feature edit before rebase.
2. **Refactor only where the release already touches the surface.** No broad redesign.
3. **Use existing UX components first** (`ux-hub-page`, `ux-cta-cluster`, `ux-density`, `product-guidance-panel`, `guarded-action-button`, `state-panel`, `a11y-status`) if present and suitable.
4. **One primary CTA per page state.** Secondary actions are grouped, demoted, disabled or placed in contextual drawers.
5. **Page header must do real work.** It must show page job, current gate/state, blocker and next step.
6. **Long pages get structure, not just scrolling.** Summary first, queue/detail split, tabs, collapsible secondary context, sticky action area if appropriate.
7. **Sparse pages get useful density, not filler.** Add next-work summary, state explanation, related objects or support-density strip only when true to the data.
8. **Client pages stay calm.** No internal workbench density leaks into client portal/mobile.
9. **Status chips are labels, not gates.** Every safety-relevant status must be backed by service/state/test.
10. **No success overclaim.** Copy names only the action that actually happened.
11. **No image/screen/state-screen generation.** Code refactor only.

---

## WP-00 — Moving Baseline + UX/IA Delta Register

| Field | Value |
|---|---|
| Priority | `P0 / must run first` |
| Journey mapping | `All V0.96 journeys + all UX/IA workstreams` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Codex must reconcile the current repo against this pack and the knowledgebase before editing. The repo has moved beyond older KB counts, and UX evidence includes both route/state screenshots and True-UX plans that may already be partially implemented.

### Knowledgebase context Codex must carry
Living KB and false-gap cleanup prevent stale `main`/old-snapshot tasks. UX decision brief says decisions are ready but code must be inspected. Phase-3 to Phase-9 audits provide candidate UX/IA/layout/state findings but not direct implementation proof.

### Target files / modules to inspect before edits
- `AGENTS.md`
- `package.json`
- `app/[...segments]/page.tsx`
- `lib/route-registry.ts`
- `lib/navigation.ts`
- `lib/ux-*.ts`
- `components/**/*.tsx`
- `app/api/**/route.ts`
- `tests/**/*.spec.ts`
- `prisma/schema.prisma`
- `ALPHAVEST_UX_NAVIGATION_PAGE_DENSITY_CTA_DECISION_BRIEF.md`
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

### Implementation steps
- Record current branch, commit, status and uncommitted files.
- List current routes, route groups, nav entries, page components and V0.96 route IDs.
- List existing UX helper components and true-UX tests.
- Map existing APIs/services/tests relevant to evidence, analyst, advisor, compliance, client visibility, audit, governance and export.
- Produce `V0_96_UX_IA_DELTA_REGISTER.md` in repo docs or final Codex report with each WP marked ALREADY_PRESENT/PARTIAL/MISSING/CONFLICTING/BLOCKED.
- Identify any already-implemented route splits/hubs/page-type components so later WPs reuse rather than duplicate.

### UI / UX / Layout / IA refactor that is included here
- Audit current navigation for route-catalogue/state-catalogue feel.
- Audit long pages and sparse pages against the density decision brief.
- Audit one-primary-CTA compliance on V0.96 pages.
- Audit whether guidance panels are actionable or decorative.
- Audit whether existing UX helper components are used consistently or just present.

### Acceptance criteria
- No implementation performed in WP-00.
- Delta register identifies exact target files for each subsequent WP.
- All stale KB assumptions are explicitly marked stale rather than converted into tasks.
- Any scope conflict is reported before implementation.

### Required tests / proof
- Run/read `pnpm typecheck`, `pnpm lint`, `pnpm test --list` or equivalent only after confirming scripts.
- Run or inspect `test:source-reality`, `test:route-smoke`, and current true-UX tests if available.
- Attach route/API/test inventory to final report.

### Stop rules
- Wrong branch or repo unknown.
- Target route registry missing.
- Existing implementation contradicts task assumptions.
- Task requires route/scope elevation not locked for V0.96.

## WP-01 — Journey-first IA / App Shell / Sidebar / Topbar / Page Header

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-001/MJ-002/MJ-003/MJ-005/MJ-006/MJ-010` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Convert V0.96 navigation from a screen catalogue into a role-aware guided operating system. Users should enter through role/work context and understand where they are in the journey: evidence, analyst, advisor, compliance, client projection, governance, export.

### Knowledgebase context Codex must carry
UX decision brief locks `HYBRID` navigation: journey-first primary navigation, role-aware filtering, object context inside workspaces/details. IA audit found many ambiguous/duplicate labels and navigation-like elements without confirmed targets. True-UX handoff has IA/App Shell phase.

### Target files / modules to inspect before edits
- `components/app-shell.tsx`
- `components/sidebar.tsx`
- `components/top-bar.tsx`
- `components/page-header.tsx`
- `components/route-context-chip.tsx`
- `components/product-guidance-panel.tsx`
- `components/global-search-box.tsx`
- `lib/navigation.ts`
- `lib/route-registry.ts`
- `lib/ux-page-contract.ts`
- `lib/ux-route-policy.ts`
- `tests/navigation-shell.spec.ts`
- `tests/ui-clickflow-phase01-05.spec.ts`
- `tests/true-ux-flow-navigation.spec.ts`

### Implementation steps
- Verify existing navigation model and route group metadata.
- Create or harden journey groups: Foundation/Client, Evidence, Advisory, Compliance, Decisions, Governance, Export.
- Filter nav by role/scope where current session context supports it; otherwise show guarded state rather than unauthorized payload.
- Update page headers to include page job, current gate/status, blocker and one next step.
- Normalize labels for V0.96 routes so terms such as Review, Approval, Release, Visibility and Export are not ambiguous.
- Keep P1/reference/hold routes present but visually de-emphasized/guarded if still accessible.

### UI / UX / Layout / IA refactor that is included here
- Replace flat route-list feel with role-aware journey grouping.
- Make page headers decisive; reduce decorative workflow guidance.
- Add route context chips only when they clarify current actor/tenant/object/gate.
- Ensure support/reference routes do not visually compete with V0.96 core journey.
- Do not redesign the full app shell beyond V0.96 needs.

### Acceptance criteria
- User can navigate the V0.96 journey from evidence to export without hunting through an undifferentiated route list.
- Page header on each V0.96 page states page job, current state and next action.
- P1/hold/reference pages are not promoted to core nav priority.
- No nav item exposes unauthorized payload by label, count or preview.

### Required tests / proof
- `pnpm test:route-smoke`
- `pnpm playwright test tests/navigation-shell.spec.ts` if present
- `pnpm playwright test tests/ui-clickflow-phase01-05.spec.ts tests/ui-clickflow-phase06-10.spec.ts` if present
- Add/update navigation assertion for role-aware V0.96 path.

### Stop rules
- Need new route/scope decision.
- Navigation change hides a required safety route.
- Client nav reveals internal workflow labels or counts.
- P1/Hold route becomes primary V0.96 path without decision.

## WP-02 — Page-Type + Density System

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `All touched V0.96 UI surfaces` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Apply a consistent page-type and density model: hubs orient, workbenches process queues, details support review, decision rooms carry irreversible/safety decisions, drawers carry secondary context, client projections remain calm.

### Knowledgebase context Codex must carry
UX density decision is `CONTROLLED_PREMIUM_WORKBENCH_HYBRID`. Layout audit found many medium scroll/overflow risks and weak multi-viewport proof. The decision brief identified both overlong dense pages and sparse pages, plus a need for progressive disclosure.

### Target files / modules to inspect before edits
- `components/ux-hub-page.tsx`
- `components/ux-dense-operations-panel.tsx`
- `components/ux-detail-standard-panel.tsx`
- `components/ux-support-density-strip.tsx`
- `components/ux-secondary-context-tabs.tsx`
- `components/ux-complexity-priority-panel.tsx`
- `components/ui/card.tsx`
- `components/ui/data-table.tsx`
- `components/page-header.tsx`
- `lib/ux-density.ts`
- `lib/ux-content-hierarchy.ts`
- `lib/ux-hub.ts`
- `tests/true-ux-density.spec.ts`
- `tests/true-ux-cta-state.spec.ts`

### Implementation steps
- Inventory existing density and page contract helpers.
- Define or confirm page type contracts: HUB, WORKBENCH_QUEUE, DETAIL_REVIEW, DECISION_ROOM, CLIENT_PROJECTION, REFERENCE, HOLD_GUARD.
- Apply density tiers to V0.96 routes only.
- Refactor long pages touched by V0.96 into summary-first sections, collapsible secondary context, tab/rail/drawer patterns or queue/detail split where already locked.
- Add support-density strips for sparse pages only when they present true next work or state, not filler.
- Ensure internal dense workbench style does not leak into client projection surfaces.

### UI / UX / Layout / IA refactor that is included here
- Address long-page pain where touched: `/documents`, `/workbench`, `/workbench/triggers/:id`, `/advisor-approval/:id`, `/compliance/:id/review`, `/compliance/:id/audit`, `/export/:id/scope`, `/export/:id/redaction`, `/export/:id/preview`, `/portal`.
- Keep client portal calm and executive; use fewer panels with clearer state.
- Use progressive disclosure for audit/evidence/export details.
- Make queues scannable and details decisive.
- Keep reference/P1/Hold surfaces from becoming large fake product screens.

### Acceptance criteria
- Touched pages have assigned page type and density tier.
- Above-the-fold content shows page job, current state, primary next action and blocker where relevant.
- Long-page refactor reduces scrolling without hiding safety-critical blockers.
- No sparse page is padded with decorative copy.

### Required tests / proof
- `pnpm playwright test tests/true-ux-density.spec.ts` if present
- `pnpm playwright test tests/true-ux-cta-state.spec.ts` if present
- Manual/screenshot proof at target viewport for changed V0.96 pages
- Route-smoke for every touched route.

### Stop rules
- Refactor requires new visual asset.
- Page split requires new route without route record.
- Density change hides safety evidence or audit trail.
- Client page becomes internal-workbench dense.

## WP-03 — Evidence Workbench + Sufficiency UX

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-002 + MJ-001 proof spine` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Implement the evidence lifecycle as a real workbench: request evidence, upload, extraction/review, link to object/recommendation/compliance case, sufficiency decision, insufficient/rejected/accepted states.

### Knowledgebase context Codex must carry
Interaction audit says document upload is the strongest implemented interaction, but only upload mechanics. Evidence/audit/export contract says upload success is not evidence sufficiency. UX brief says document/evidence routes should be a workbench flow, not isolated menu entries.

### Target files / modules to inspect before edits
- `components/client-intake-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ui/evidence-list.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/guarded-action-button.tsx`
- `app/api/documents/route.ts`
- `app/api/documents/upload/route.ts`
- `app/api/documents/review/route.ts`
- `lib/document-upload-service.ts`
- `lib/evidence-review-service.ts`
- `lib/evidence-service.ts`
- `lib/visibility-engine.ts`
- `tests/document-upload-api.spec.ts`
- `tests/document-upload-flow.spec.ts`
- `tests/evidence-review-api.spec.ts`
- `tests/ui-state-boundaries.spec.ts`

### Implementation steps
- Verify current upload/review APIs and services.
- Create or harden evidence status taxonomy in code usage: uploaded, extraction_pending, review_pending, insufficient, rejected, sufficient, linked.
- Bind evidence UI rows/cards/chips to real service state, not static demo labels.
- Add link/relevance/scope indicators for recommendation/compliance/decision relationships.
- Implement review actions with permission, loading, success, error, retry and audit expectations.
- Ensure uploaded document appears as candidate evidence only until review/link/relevance/acceptance.

### UI / UX / Layout / IA refactor that is included here
- Documents list becomes an evidence workbench with priority, blockers and next work.
- Evidence detail uses summary-first layout with secondary metadata in drawer/tabs.
- Upload success copy says upload-only and review required.
- Evidence status chips cannot imply sufficiency unless reviewed and linked.
- Empty/error/permission states explain recovery.

### Acceptance criteria
- Upload success does not unlock release, client visibility or export.
- Evidence cannot be sufficient without review, link, relevance and scope.
- Wrong-role or wrong-tenant review action is denied and does not leak data.
- UI states are honest and no-overclaim.

### Required tests / proof
- `pnpm test:document-upload-api`
- `pnpm test:document-upload-flow`
- `pnpm playwright test tests/evidence-review-api.spec.ts` if present
- Add/update negative: upload alone does not release or expose client-safe content.
- Add/update UI: evidence pending/insufficient/sufficient states render correctly.

### Stop rules
- Task implies upload-to-release shortcut.
- Evidence review mutates without audit/permission.
- Client can see raw/internal/unreleased evidence.
- Schema change required without approved migration decision.

## WP-04 — Analyst Workbench + AI Draft Internal Review

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-003 + MJ-001` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Build the analyst review surface around internal draft assessment: unsupported claims, needs evidence, reject/rebuild, internal notes and route to advisor while AI/rules draft remains internal-only.

### Knowledgebase context Codex must carry
Mega Journey Matrix makes AI governance a V0.96 core proof. Safety contracts forbid client-visible AI Draft. UX flow refactor notes signal/workbench/approval surfaces are spread without enough journey status clarity.

### Target files / modules to inspect before edits
- `components/internal-workflow-screen.tsx`
- `components/ux-detail-standard-panel.tsx`
- `components/ux-cta-cluster.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/guarded-action-button.tsx`
- `app/api/demo-workflow/route.ts`
- `lib/internal-workflow-demo-data.ts`
- `lib/demo-workflow-mutation.ts`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `tests/true-ux-client-projection.spec.ts`

### Implementation steps
- Verify existing recommendation/draft data model and workflow actions.
- Expose analyst work queue/detail with current gate: draft_review, needs_evidence, unsupported_claim, rebuilt, ready_for_advisor.
- Add explicit internal-only AI/rules draft labeling.
- Implement analyst reject/rebuild/request-evidence actions as guarded actions.
- Ensure analyst notes/internal rationale never feed client projection/export.
- Link draft rebuild to evidence references when evidence exists.

### UI / UX / Layout / IA refactor that is included here
- Split workbench queue vs detail if current screen is too long or conflated.
- Show unsupported claims as blockers with clear recovery.
- Use one primary CTA per state: Request Evidence, Reject Draft, Rebuild Draft, Send to Advisor.
- Move secondary context into tabs/drawers.
- Avoid generic AI confidence theatre; show evidence and human review status.

### Acceptance criteria
- Analyst can move a supported draft toward advisor only when evidence/review preconditions are satisfied.
- AI Draft/internal rationale are redacted from client projection, export and client-facing APIs.
- UI explicitly says internal-only and does not imply client advice.

### Required tests / proof
- `pnpm test:workflow-gate`
- `pnpm test:workflow-api`
- Add/update negative: AI Draft/internal rationale absent from portal/mobile/export payload.
- Add/update UI test for unsupported claim and needs-evidence states.

### Stop rules
- Client-visible AI Draft introduced.
- Analyst action releases to client or bypasses advisor/compliance.
- UI copy implies autonomous advice.
- Draft rebuild lacks evidence/audit route when required.

## WP-05 — Advisor Queue + Approval Detail

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-001/MJ-003` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Implement/harden advisor review as a separate human gate. Advisor can approve, reject or request changes, but approval never releases client visibility.

### Knowledgebase context Codex must carry
Task/safety KB requires advisor approval and compliance release to remain separate. UX decision brief observed advisor approval queue where metrics, list, guidance and action rail compete for attention; it needs one primary next action and clear queue/detail model.

### Target files / modules to inspect before edits
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ux-dense-operations-panel.tsx`
- `components/ux-detail-standard-panel.tsx`
- `components/ux-cta-cluster.tsx`
- `app/api/demo-workflow/route.ts`
- `lib/workflow-gate.ts`
- `lib/permission-engine.ts`
- `lib/audit-service.ts`
- `tests/workflow-gate.spec.ts`
- `tests/permission-engine.spec.ts`
- `tests/true-ux-cta-state.spec.ts`
- `tests/p0-acceptance.spec.ts`

### Implementation steps
- Verify advisor routes `/advisor-approval` and `/advisor-approval/:id` current behaviour.
- Create/harden advisor queue with state counts, priority, blocker, and next review.
- Create/harden advisor detail with evidence summary, internal rationale, decision alternatives and primary CTA.
- Implement approve/reject/request changes as guarded actions with loading/error/success states.
- Move approved item to compliance_pending, not client-visible.
- Persist or route audit event for advisor action where existing services support it.

### UI / UX / Layout / IA refactor that is included here
- Use compact workbench queue density; detail page supports decision not browsing.
- Advisor approved state must display `Waiting for compliance release`.
- Secondary actions are demoted; one primary CTA per state.
- Add clear distinction between internal comment and client-safe summary.

### Acceptance criteria
- Advisor approval changes advisor gate only.
- No client portal/mobile/export visibility is created by advisor approval.
- Advisor cannot approve without required evidence/analyst state if workflow gate requires it.
- Wrong role denied.

### Required tests / proof
- `pnpm test:workflow-gate`
- `pnpm test:permissions`
- Add/update negative: advisor-approved item is absent from client-safe projection until compliance release.
- Add/update CTA-state test for advisor detail.

### Stop rules
- Advisor approval becomes compliance release.
- Advisor action visible to client before release.
- Admin/advisor role bypasses evidence or compliance.
- UI text says released after advisor approval.

## WP-06 — Compliance Decision Room

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-001/MJ-002/MJ-006` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Create/harden compliance as the central decision room for release/block/request-evidence. Compliance is the only release gate to client-safe visibility and requires advisor approval, sufficient evidence, permission and audit.

### Knowledgebase context Codex must carry
Compliance gate is central in UX evidence. Safety contracts require release/block/evidence request to be separated, audited and fail-closed. Interaction audit notes release and block modals are partial/query-driven and need real lifecycle.

### Target files / modules to inspect before edits
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ui/modal.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/guarded-action-button.tsx`
- `app/api/demo-workflow/route.ts`
- `lib/workflow-gate.ts`
- `lib/permission-engine.ts`
- `lib/evidence-service.ts`
- `lib/audit-service.ts`
- `tests/workflow-gate.spec.ts`
- `tests/confirmation-lifecycle.spec.ts`
- `tests/audit-fail-closed.spec.ts`
- `tests/p0-acceptance.spec.ts`

### Implementation steps
- Verify compliance routes `/compliance`, `/compliance/:id/review`, `/compliance/:id/release`, `/compliance/:id/block`, `/compliance/:id/audit`.
- Refactor compliance review detail into decision room: preconditions, evidence status, advisor approval status, audit status, release/block/request evidence actions.
- Implement release modal lifecycle: trigger/open/validate/confirm/loading/error/success/cancel/focus.
- Implement block/request-evidence modal lifecycle with reason and required evidence validation.
- Block release when advisor approval/evidence/audit/permission preconditions fail.
- Write/route audit event for release, block and request evidence.

### UI / UX / Layout / IA refactor that is included here
- Compliance screen must be focused: state, blockers, evidence, one primary action.
- Release/block are modal/decision-room actions, not generic buttons.
- Show disabled/gated states with explanation and recovery.
- Keep audit/context secondary but reachable.
- No visual state should imply release if backend gate denies it.

### Acceptance criteria
- Compliance can release only when all preconditions pass.
- Compliance can block/request evidence with reason and audit.
- Release success creates released/client-safe state but not client acceptance.
- Denied release remains blocked/pending and communicates why.

### Required tests / proof
- `pnpm test:workflow-gate`
- `pnpm playwright test tests/confirmation-lifecycle.spec.ts`
- `pnpm playwright test tests/audit-fail-closed.spec.ts`
- Add/update negative: missing evidence, missing advisor approval, wrong role, admin bypass and audit failure block release.

### Stop rules
- Release is possible without sufficient evidence/advisor/audit.
- Release modal lacks validation/focus/error state.
- Compliance notes leak to client.
- Admin can trigger release from governance/admin UI.

## WP-07 — Decision Record + Client-Safe Projection

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-001/MJ-002` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Create/harden decision records and client-safe projection so client portal/mobile show only released, redacted, approved content and nothing before release.

### Knowledgebase context Codex must carry
MVP scope requires decision record, client visibility and fail-closed projection. UX evidence says client navigation must be calm executive and fail-closed; internal workbench density must not leak into client views.

### Target files / modules to inspect before edits
- `components/client-intake-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ui/state-panel.tsx`
- `components/ux-detail-standard-panel.tsx`
- `lib/visibility-engine.ts`
- `lib/decisions-governance-demo-data.ts`
- `lib/client-intake-demo-data.ts`
- `app/api/dashboard-metrics/route.ts`
- `app/api/profile/route.ts`
- `tests/client-visibility-projection.spec.ts`
- `tests/client-visibility-proof.spec.ts`
- `tests/true-ux-client-projection.spec.ts`
- `tests/p0-acceptance.spec.ts`

### Implementation steps
- Verify decision model/service/read-model already present.
- Create/harden decision detail linking recommendation, evidence, advisor approval, compliance release, audit refs and visibility status.
- Create client-safe projection read model using existing visibility engine/policies.
- Portal/mobile before release show no released content / pending state, not internal previews.
- Portal/mobile after release show client-safe summary and safe evidence summary only.
- Redact AI Draft, internal rationale, analyst notes, advisor notes, compliance notes, raw evidence and internal audit.

### UI / UX / Layout / IA refactor that is included here
- Client pages use calm executive density and clear released/pending state.
- No internal workflow rails/panels appear on client portal/mobile.
- Decision record is summary-first; secondary evidence/audit context is internal-only unless released/redacted.
- Empty states are useful, not blank.

### Acceptance criteria
- Client sees nothing sensitive before release.
- After release, client sees only client-safe summary and safe evidence summary.
- Decision record internally shows traceability without leaking internals externally.
- Fail-closed behaviour on errors/unknown actor/unknown visibility.

### Required tests / proof
- `pnpm test:client-visibility`
- `pnpm playwright test tests/true-ux-client-projection.spec.ts`
- Add/update negative: client/export/API payload excludes AI Draft, internal rationale, analyst/advisor/compliance notes and unreleased evidence.

### Stop rules
- Manual visibility override introduced.
- Client receives internal payload or hidden workflow state.
- Decision record collapses advisor/compliance gates.
- Client UI implies acceptance/action by client after release.

## WP-08 — Audit Surface + Persistence UI

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-006/MJ-010 + all gate actions` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Bind audit UI to persisted audit events and implement audit-unavailable/fail-closed states for safety-critical actions.

### Knowledgebase context Codex must carry
Interaction audit and safety contracts say visible audit timelines are not persistence proof. Evidence/audit/export contract says if required audit cannot persist, safety action must fail closed or remain pending.

### Target files / modules to inspect before edits
- `components/ui/audit-timeline.tsx`
- `components/decisions-governance-screen.tsx`
- `components/demo-session-panel.tsx`
- `app/api/audit-events/route.ts`
- `lib/audit-service.ts`
- `lib/permission-engine.ts`
- `lib/demo-workflow-mutation.ts`
- `tests/audit-fail-closed.spec.ts`
- `tests/phase6-audit-persistence.spec.ts`
- `tests/permission-engine.spec.ts`
- `tests/governance-non-bypass.spec.ts`

### Implementation steps
- Verify existing audit API/service/events and tests.
- Ensure gate actions create audit event with actor, role, tenant, target, action, result, prev/next state, reason and correlation where available.
- Update audit timeline to render persisted/source-backed events, not static proof rows.
- Add audit unavailable / write failed UI state.
- Ensure release/block/export/permission changes fail closed or remain pending if audit write is required and unavailable.
- Hide/redact internal audit details from client-facing routes.

### UI / UX / Layout / IA refactor that is included here
- Audit UI distinguishes persisted audit event vs display-only history.
- Audit detail is progressive disclosure; it does not bloat decision screens.
- Audit unavailable state tells the user action is blocked/pending, not silently completed.
- Governance audit has scannable table/detail pattern.

### Acceptance criteria
- Critical V0.96 gate actions write or require audit.
- Audit display is source-backed.
- Audit failure blocks critical action.
- Client-facing surfaces never show internal audit detail.

### Required tests / proof
- `pnpm playwright test tests/audit-fail-closed.spec.ts`
- `pnpm playwright test tests/phase6-audit-persistence.spec.ts` if present
- `pnpm test:permissions`
- Add/update UI assertion for audit unavailable state.

### Stop rules
- Audit timeline remains static while treated as proof.
- Audit write failure allows release/export/permission change.
- Audit payload leaks client-sensitive or internal-only data.

## WP-09 — Governance / Admin Non-Bypass UX

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-010/MJ-006` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Refactor governance/admin surfaces so admins configure policy/users/access but cannot visually or functionally appear to bypass advice, evidence, compliance, visibility, audit or export gates.

### Knowledgebase context Codex must carry
Mega Journey `MJ-010` requires admin role change cannot bypass compliance release. UX flow plan says governance surfaces risk looking like broad power panels unless configuration, access request, audit and non-bypass constraints are distinguished.

### Target files / modules to inspect before edits
- `components/admin-tenant-setup-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ui/modal.tsx`
- `components/ui/drawer.tsx`
- `components/ui/guarded-action-button.tsx`
- `lib/permission-engine.ts`
- `lib/admin-tenant-readmodel-service.ts`
- `app/api/admin-tenants/route.ts`
- `tests/governance-non-bypass.spec.ts`
- `tests/permission-engine.spec.ts`
- `tests/control-layer-actor-scope.spec.ts`
- `tests/confirmation-lifecycle.spec.ts`

### Implementation steps
- Verify admin/roles/users/access-request current surfaces.
- Separate configuration actions from advisory/release actions in UI copy and grouping.
- Add second confirmation/permission denied/audit required states where sensitive.
- Disable or remove any UI affordance suggesting admin can force release, mark evidence sufficient, force visibility or approve export.
- Bind access request and role changes to permission/audit state.
- Ensure admin previews do not expose client advice payload by admin status alone.

### UI / UX / Layout / IA refactor that is included here
- Admin screens become governance workbenches, not superuser dashboards.
- Role/access drawers show scope, expiry, object/tenant boundaries and consequences.
- Denied admin-bypass actions show explicit non-bypass explanation.
- One primary action per role/access state.

### Acceptance criteria
- Admin can manage allowed governance setup only.
- Admin cannot release, force evidence sufficiency, force client visibility, suppress audit or bypass export redaction.
- Cross-tenant/wrong-object access denied and audited.

### Required tests / proof
- `pnpm test:governance-non-bypass`
- `pnpm test:permissions`
- `pnpm playwright test tests/control-layer-actor-scope.spec.ts`
- Add/update UI test for admin denied non-bypass copy.

### Stop rules
- Admin UI introduces manual override.
- Role change grants payload visibility beyond route/action/object scope.
- Access approval bypasses compliance/evidence/export gates.

## WP-10 — Export Scope / Redaction / Approval UX

| Field | Value |
|---|---|
| Priority | `P0 late-stage` |
| Journey mapping | `MJ-005` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Implement/harden export as the visible trust output: scope, redaction, preview, approval, manifest/download state and audit, while forbidding internal payloads.

### Knowledgebase context Codex must carry
Journey KB marks export/redaction as MVP late-stage trust output. Safety contracts say preview is not approval, approval is not download/share, and export must exclude AI Draft/internal rationale/compliance notes/unreleased content. UX brief identifies `/export/:id/scope`, `/redaction`, `/preview` as long/complex pages needing staging.

### Target files / modules to inspect before edits
- `components/communication-export-ops-screen.tsx`
- `components/ui/modal.tsx`
- `components/ui/state-panel.tsx`
- `components/ux-detail-standard-panel.tsx`
- `app/api/export-workflow/route.ts`
- `lib/export-service.ts`
- `lib/export-package-service.ts`
- `lib/file-metadata-service.ts`
- `lib/visibility-engine.ts`
- `tests/export-safety.spec.ts`
- `tests/file-export-realism.spec.ts`
- `tests/phase8-export-workflow-api.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`

### Implementation steps
- Verify existing export workflow API/services/tests.
- Stage UI explicitly: Create/Scope → Redaction → Preview → Approval → Manifest/Download.
- Add blockers for incomplete scope, missing redaction, missing approval, forbidden payload and audit failure.
- Generate metadata/manifest package only as currently supported; do not invent full production binary/share infra unless already present.
- Ensure export package pulls only client-safe released projection.
- Audit preview/approval/download/share actions where required.

### UI / UX / Layout / IA refactor that is included here
- Break long export pages into staged panels with clear progress and one primary CTA.
- Show `Preview is not approval` and `Approval is not client acceptance` through copy/state.
- Surface forbidden payload blockers clearly.
- Move redaction details into detail/secondary context when too dense.

### Acceptance criteria
- Export cannot proceed without scope, redaction, approval and audit.
- Forbidden payloads are absent from manifest/package.
- Preview does not allow download/share.
- Download/share success does not imply client acceptance.

### Required tests / proof
- `pnpm test:export-safety`
- `pnpm test:file-export`
- `pnpm playwright test tests/phase8-export-workflow-api.spec.ts` if present
- Add/update negative: AI Draft/internal rationale/compliance notes/unreleased evidence absent from export.

### Stop rules
- Export includes internal payload.
- Preview enables approval/download implicitly.
- New production binary/share infrastructure required without decision.
- Export bypasses client visibility engine.

## WP-11 — Shared Interaction Primitives: Modal / Drawer / Table / Form / CTA / A11y

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `All V0.96 touched UI interactions` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Harden shared UI primitives so visible components become real, accessible interaction lifecycles: trigger, open, close, cancel, submit, loading, validation, error, success, denied, focus and keyboard handling.

### Knowledgebase context Codex must carry
Interaction audit found drawers/modals partial: missing Escape/focus trap/aria relationships/validation/route-level mutation proof. Phase-8/9 audits found many not-verifiable transitions and missing states. True-UX handoff includes accessibility/focus/keyboard/status phase.

### Target files / modules to inspect before edits
- `components/ui/modal.tsx`
- `components/ui/drawer.tsx`
- `components/ui/data-table.tsx`
- `components/ui/filter-bar.tsx`
- `components/ui/guarded-action-button.tsx`
- `components/ui/a11y-status.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/status-chip.tsx`
- `components/ux-cta-cluster.tsx`
- `tests/interaction-lifecycle.spec.ts`
- `tests/confirmation-lifecycle.spec.ts`
- `tests/true-ux-a11y.spec.ts`
- `tests/true-ux-cta-state.spec.ts`

### Implementation steps
- Inspect current primitives and usages before changing shared behaviour.
- Add or preserve accessible dialog/drawer semantics: labelled dialog, focus management, Escape/backdrop policy, inert background where feasible.
- Standardize guarded action button states: hidden, disabled, denied, loading, success, error.
- Ensure tables/lists expose empty/loading/error/permission states.
- Ensure form/confirmation modals support validation and no silent submit.
- Add status announcements via a11y-status for async state changes where practical.

### UI / UX / Layout / IA refactor that is included here
- Shared components support one primary CTA cluster per state.
- Dangerous/safety actions use confirmation and clear consequence copy.
- Drawers are secondary context, not substitute for core decision rooms.
- Status chips are paired with actual state source and not gate proof.

### Acceptance criteria
- Modal/drawer lifecycle works with keyboard and focus.
- Guarded actions cannot be triggered when denied/disabled/loading.
- Table/form empty/error states are visible and useful.
- Existing routes do not regress.

### Required tests / proof
- `pnpm playwright test tests/interaction-lifecycle.spec.ts`
- `pnpm playwright test tests/confirmation-lifecycle.spec.ts`
- `pnpm playwright test tests/true-ux-a11y.spec.ts`
- Route smoke and targeted V0.96 flow tests after shared component changes.

### Stop rules
- Shared component change breaks unrelated routes without route-smoke fix.
- Accessibility implementation requires large design-system rewrite.
- Confirmation closes without preserving safe state.
- CTA component allows denied action execution.

## WP-12 — No-Overclaim Microcopy + State Feedback

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `All V0.96 journeys` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Implement honest copy and feedback so every success, blocked, pending, denied and release state names only what actually happened and never implies downstream gates.

### Knowledgebase context Codex must carry
Feedback contract central rule: Upload success is not evidence sufficiency; advisor approval is not release; compliance release is not client acceptance; export preview is not approval. UX friction register found missing feedback, unclear action consequence and no clear next step patterns.

### Target files / modules to inspect before edits
- `components/page-header.tsx`
- `components/product-guidance-panel.tsx`
- `components/route-demo-context-card.tsx`
- `components/demo-actor-handoff-bar.tsx`
- `components/scf-p04-p06-flow-panel.tsx`
- `components/scf-p07-p09-trust-panel.tsx`
- `components/scf-p10-p14-closure-panel.tsx`
- `lib/product-guidance.ts`
- `lib/ux-content-hierarchy.ts`
- `tests/demo-session-panel-copy.spec.ts`
- `tests/mvp-support-copy-cleanup.spec.ts`
- `tests/true-ux-cta-state.spec.ts`

### Implementation steps
- Inventory existing copy for upload, evidence, advisor, compliance, decision, client visibility, audit, admin and export states.
- Replace overclaiming success copy with action-specific copy.
- Add blocker/recovery copy for denied, needs evidence, compliance pending, audit unavailable and export redaction pending.
- Ensure page headers and CTAs use consistent terms: analyst review, advisor approval, compliance release, client-safe visibility.
- Remove/de-emphasize decorative repeated guidance where page header/state already communicates it.

### UI / UX / Layout / IA refactor that is included here
- Copy supports clear next step and consequence for every primary CTA.
- Guidance is contextual, not ornamental.
- Duplicate/ambiguous labels on V0.96 paths are normalized.
- Client-facing copy avoids internal jargon and advice overclaim.

### Acceptance criteria
- No success message implies downstream gate completion.
- Blocked/denied states explain why and what can be done next.
- Terminology is consistent across V0.96 flow.
- Existing copy tests updated or added.

### Required tests / proof
- `pnpm playwright test tests/demo-session-panel-copy.spec.ts` if present
- `pnpm playwright test tests/mvp-support-copy-cleanup.spec.ts` if present
- Add/update true-UX CTA/copy assertions for upload/advisor/compliance/export.

### Stop rules
- Copy weakens legal/advice boundary.
- Copy implies client acceptance or production advice.
- Terms conflict with route/safety contracts.

## WP-13 — API/Service Integration for UI Truth

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `All V0.96 journeys` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Ensure UI states and actions are sourced from existing APIs/services where possible, not static demo text or visual-only chips. Harden existing relevant API responses for safe UI consumption.

### Knowledgebase context Codex must carry
API contract says route presence is not API safety proof. Current snapshot has 15 API routes, so Codex must harden/reuse existing APIs rather than inventing parallel APIs. UI must reflect service truth.

### Target files / modules to inspect before edits
- `app/api/demo-workflow/route.ts`
- `app/api/documents/route.ts`
- `app/api/documents/upload/route.ts`
- `app/api/documents/review/route.ts`
- `app/api/export-workflow/route.ts`
- `app/api/audit-events/route.ts`
- `app/api/auth/dummy/route.ts`
- `app/api/admin-tenants/route.ts`
- `lib/demo-workflow-validation.ts`
- `lib/demo-workflow-mutation.ts`
- `lib/permission-engine.ts`
- `lib/visibility-engine.ts`
- `lib/workflow-gate.ts`
- `tests/p0-api-contract.spec.ts`
- `tests/fail-closed-error-envelope.spec.ts`

### Implementation steps
- Map each V0.96 UI action/state to an existing API/service or mark readmodel-only.
- Add request validation and safe error envelopes where missing.
- Ensure actor/tenant/role context is applied before action and payload response.
- Ensure API errors do not advance UI/workflow state.
- Ensure response payloads exclude hidden/internal fields for client/export contexts.
- Avoid creating new APIs unless WP-00 proves no existing route/service can support the locked task.

### UI / UX / Layout / IA refactor that is included here
- UI buttons/chips reflect service state, not fake local state.
- Error feedback maps safe API errors to recovery states.
- Loading/pending states remain visible during API calls.
- No internal fields included just because UI needs text.

### Acceptance criteria
- V0.96 API actions validate input, actor, tenant, object and preconditions.
- UI does not advance on failed API response.
- Client/export responses are redacted/fail-closed.
- Existing API tests pass and new negative cases cover V0.96 risks.

### Required tests / proof
- `pnpm test:phase10`
- `pnpm playwright test tests/p0-api-contract.spec.ts`
- `pnpm playwright test tests/fail-closed-error-envelope.spec.ts`
- Targeted API tests for documents/review, export-workflow, audit-events, demo-workflow.

### Stop rules
- Task requires broad new API architecture.
- API change exposes internal payload.
- API error lets UI show success.
- Schema migration required without WP-14 decision.

## WP-14 — Schema Usage Alignment for UI/Journey

| Field | Value |
|---|---|
| Priority | `P0 support` |
| Journey mapping | `All V0.96 journeys` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Align existing schema field usage with journey/UI state needs without blind schema replacement. Only add migration if current schema cannot represent locked V0.96 state and WP-00/WP-13 prove no safe alternative.

### Knowledgebase context Codex must carry
Schema reconciliation preserves the full-workflow 42-model baseline and treats patch schema as control spec. Current repo may already have more implementation. UI/Journey tasks must use existing models/fields correctly before asking for schema changes.

### Target files / modules to inspect before edits
- `prisma/schema.prisma`
- `lib/domain-types.ts`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `lib/evidence-service.ts`
- `lib/export-service.ts`
- `lib/audit-service.ts`
- `tests/schema-alignment.spec.ts`
- `tests/p0-acceptance.spec.ts`

### Implementation steps
- Map V0.96 states to existing models/fields: Document, DocumentReview, DocumentLink, EvidenceRecord, Recommendation, Approval, ComplianceReview, Decision, AuditEvent, ExportRequest, UserRole/Permission.
- Identify fields currently strings/enums/JSON and document canonical allowed values in code/type helpers where appropriate.
- Avoid creating patch-only models such as AiDraft or ClientVisibilityEvaluation unless proven necessary and explicitly approved.
- If a field is missing, evaluate service-derived/runtime-only representation first.
- Only if unavoidable, produce migration decision note with exact reason, fields, tests and backward compatibility impact.

### UI / UX / Layout / IA refactor that is included here
- UI status choices map to canonical status values.
- Status chips and filters use typed/canonical mappings rather than hardcoded inconsistent labels.
- Decision/evidence/export UI can render accurate state without schema guesswork.

### Acceptance criteria
- No blind schema replacement.
- No status field inconsistency causing false UI state.
- All safety-critical UI states map to schema/service truth or explicit derived logic.
- Schema alignment tests updated.

### Required tests / proof
- `pnpm db:validate`
- `pnpm playwright test tests/schema-alignment.spec.ts`
- `pnpm test:workflow-gate`
- `pnpm test:client-visibility`

### Stop rules
- Migration requested for convenience only.
- Patch schema used to replace full schema.
- Schema change lacks P0 tests.
- Status values break existing routes/APIs.

## WP-15 — P0 + True-UX Acceptance Suite

| Field | Value |
|---|---|
| Priority | `P0 / release blocker` |
| Journey mapping | `All V0.96 journeys + UX/IA refactor` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Create/update the release proof suite: end-to-end positive journey, negative safety cases, and True-UX tests for navigation, density, CTA/state, client projection, a11y and no-generation.

### Knowledgebase context Codex must carry
P0 matrix says existing tests are proof slices, not full P0 coverage. The current snapshot already has many true-UX and safety specs; Codex must extend them, not duplicate blindly.

### Target files / modules to inspect before edits
- `tests/p0-acceptance.spec.ts`
- `tests/p0-api-contract.spec.ts`
- `tests/true-ux-a11y.spec.ts`
- `tests/true-ux-client-projection.spec.ts`
- `tests/true-ux-cta-state.spec.ts`
- `tests/true-ux-density.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `tests/ui-clickflow-phase01-05.spec.ts`
- `tests/ui-clickflow-phase06-10.spec.ts`
- `tests/interaction-lifecycle.spec.ts`
- `tests/confirmation-lifecycle.spec.ts`
- `tests/export-safety.spec.ts`
- `tests/governance-non-bypass.spec.ts`
- `tests/audit-fail-closed.spec.ts`
- `tests/route-smoke.spec.ts`

### Implementation steps
- Inventory existing tests and mark each required P0/UX gate covered/partial/missing.
- Add one positive V0.96 journey proof: mapped user → evidence review/sufficiency → analyst → advisor → compliance release → client-safe projection → audit → redacted export manifest.
- Add negative tests: cross-tenant denied, wrong role denied, admin cannot release, upload alone no release, advisor approval no release, AI Draft no leak, internal notes no leak, missing audit blocks critical action, export forbidden payload excluded.
- Add True-UX tests for V0.96: journey nav, page header job/next-step, one primary CTA per state, density tier markers, client calm/fail-closed page, modal/drawer lifecycle, no overclaim copy.
- Ensure tests are deterministic and do not rely on generated images.

### UI / UX / Layout / IA refactor that is included here
- Tests assert UI truth, not just route 200.
- Density/CTA tests focus on V0.96 touched routes only.
- Client projection tests assert absence of forbidden labels/payloads.
- A11y tests cover changed modal/drawer/CTA states.

### Acceptance criteria
- Positive core journey passes.
- All listed negative safety cases pass.
- True-UX tests prove route catalogue/density/CTA problems are improved on touched surfaces.
- No screenshot asset generation is required.

### Required tests / proof
- `pnpm phase:check` if available
- `pnpm test:playwright` or targeted suite if runtime too large
- All targeted tests listed in this WP
- Final report includes covered/partial/missing matrix.

### Stop rules
- Tests require external services not in repo.
- P0 negative case cannot be expressed without missing product decision.
- UX tests become brittle pixel assertions instead of semantic/layout contract assertions.

## WP-16 — Release Evidence / Handoff Update

| Field | Value |
|---|---|
| Priority | `P0 closure` |
| Journey mapping | `Release closure` |
| Codex mode | `IMPLEMENT_AFTER_WP_00_REBASE`; classify first as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` |

### Goal
Produce the release proof report and update implementation handoff docs without turning them into new product strategy. Capture what changed, what passed, what remains partial, and what is next.

### Knowledgebase context Codex must carry
Final handoff requires proof and stop-rule discipline. User wants Codex to have maximum context but not to treat old prompts as source truth. This WP closes the loop with evidence.

### Target files / modules to inspect before edits
- `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md`
- `FINAL_CODEX_IMPLEMENTATION_HANDOFF_REBASED_ON_SCF.md if present`
- `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_RELEASE_PROOF.md (new)`
- `docs/** if existing doc location is used`
- `package.json test scripts only if already appropriate`

### Implementation steps
- Create a release proof markdown with changed files, tasks completed, tests run, tests passed/failed/skipped, screenshots/manual proof if needed, no-generation confirmation and known blockers.
- Update only relevant handoff/status docs if repo convention allows; otherwise include proof in final Codex response.
- Record any deferred UX/IA findings not addressed because outside V0.96.
- Record any schema/API decisions made or avoided.
- Record next release recommendation after V0.96.

### UI / UX / Layout / IA refactor that is included here
- Proof includes before/after UX intent for touched surfaces without relying on image generation.
- Document states which long pages were structurally improved and which remain deferred.
- Document that reference/P1/Hold routes were not promoted.
- Document no-overclaim copy and client-safe projection proof.

### Acceptance criteria
- Report is complete enough for reviewer to verify release.
- No hidden scope expansion.
- No-generated-assets confirmation included.
- Remaining open items are labelled P1/Hold/Blocked/Partial.

### Required tests / proof
- Include outputs from lint/typecheck/build/targeted tests.
- Include route and test inventory delta.
- Attach list of unchanged/blocked WPs if any.

### Stop rules
- Docs update tries to overwrite source of truth with unverified claims.
- Failed P0 test is hidden or marked pass.
- Report recommends implementing hold routes without decision.

---

## 8. Route workset for V0.96 UX/IA refactor

### Core routes to prioritize

| Route IDs | Routes | UX treatment |
|---|---|---|
| 027–030 | `/documents`, `/documents/upload`, `/documents/extraction-review`, `/documents/verification-pending` | Evidence workbench + upload/review/sufficiency states. |
| 033–035 | `/signals`, `/workbench`, `/workbench/triggers/:id` | Analyst queue/workbench/detail; AI draft internal-only. |
| 036–037 | `/advisor-approval`, `/advisor-approval/:id` | Advisor queue/detail; approval not release. |
| 038–042 | `/compliance`, `/compliance/:id/review`, `/release`, `/block`, `/audit` | Compliance decision room; release/block/request evidence; audit. |
| 043–047 | `/decisions`, `/decisions/:id`, `/success`, `/evidence`, `/evidence/:id` | Decision record + evidence trace + audit context. |
| 019–020 | `/portal`, `/mobile` | Client-safe projection; calm fail-closed released view. |
| 048–051 | Governance routes | Admin non-bypass, access requests, audit history. |
| 054–058 | Export routes | Scope/redaction/preview/approval/download staged trust output. |
| 007–012, 013–018 | Admin/Tenant support | Only where required for V0.96 user/tenant/role context and governance safety. |

### Defer or guard

| Routes | Treatment |
|---|---|
| 052–053, 059–060, 068 | P1/deferred unless WP-00 proves already safely integrated without expanding V0.96. |
| 061–063 | Reference-only; no product UX tasks except de-emphasis/guard if they clutter navigation. |
| 064–067, 069–071 | Hold; do not implement as V0.96 core. Show held/guard state only if touched by existing nav/smoke tests. |

---

## 9. Validation command set

Codex must verify scripts in `package.json` first. Suggested target commands based on current snapshot:

```bash
pnpm typecheck
pnpm lint
pnpm db:validate
pnpm build
pnpm test:source-reality
pnpm test:route-smoke
pnpm test:document-upload-api
pnpm test:document-upload-flow
pnpm test:workflow-gate
pnpm test:permissions
pnpm test:client-visibility
pnpm test:export-safety
pnpm test:governance-non-bypass
pnpm test:fail-closed-error-envelope
pnpm playwright test tests/evidence-review-api.spec.ts
pnpm playwright test tests/audit-fail-closed.spec.ts
pnpm playwright test tests/confirmation-lifecycle.spec.ts
pnpm playwright test tests/interaction-lifecycle.spec.ts
pnpm playwright test tests/true-ux-density.spec.ts
pnpm playwright test tests/true-ux-cta-state.spec.ts
pnpm playwright test tests/true-ux-client-projection.spec.ts
pnpm playwright test tests/true-ux-a11y.spec.ts
pnpm playwright test tests/true-ux-p0-safety.spec.ts
pnpm playwright test tests/p0-acceptance.spec.ts
```

If runtime is too high, Codex may run targeted subsets but must explain what was skipped and why.

---

## 10. Forbidden changes register

| Forbidden change | Reason |
|---|---|
| New design direction / broad visual redesign | The release needs truthfulness and journey UX, not a new brand system. |
| Image/screen/state-screen generation | Screen generation is not authorized. |
| Full 71-route production UX | V0.96 is core journey, not every route. |
| Hold-route implementation | Committee/KYC/SoW/Suitability/IPS/Rebalance remain outside this pack unless explicitly unlocked later. |
| Client-visible AI Draft | Violates advice boundary. |
| Upload-to-release shortcut | Violates evidence sufficiency contract. |
| Advisor approval as release | Violates workflow gate contract. |
| Admin as superuser bypass | Violates governance safety. |
| Manual client visibility override | Visibility must be derived and fail-closed. |
| Export without redaction/approval/audit | Violates export safety. |
| Broad new API layer | Reuse/harden existing APIs unless proven impossible. |
| Blind Prisma schema replacement | Full-workflow schema remains baseline. |
| `main` as target truth | `main` is false-gap only. |

---

## 11. ENGINE Execution Proof

| Phase | Primary Engine | Secondary Engine | Output in this pack |
|---|---|---|---|
| Source intake | ENGINE_v2 | ENGINE_v3 | Source-of-truth lock and KB hierarchy. |
| UX/IA synthesis | ENGINE_v3 | ENGINE_v2 | Journey-first IA, density/page-type decisions and UI problem register. |
| Release scoping | ENGINE_v2 | ENGINE_v3 | V0.96 route/workset boundary and forbidden changes. |
| Task decomposition | ENGINE_v2 | Codex-Spark-like execution | 17 implementation work packages with files, steps, tests and stop rules. |
| Contradiction control | ENGINE_v3 | ENGINE_v2 | Separation of visual vs behaviour, upload vs sufficiency, advisor vs release, preview vs approval. |
| QA discipline | ENGINE_v2 | ENGINE_v3 | P0/True-UX test strategy and final proof requirements. |

---

## 12. Short Codex instruction

```text
Implement V0.96 Core Journey Release with integrated UX/IA/Layout refactor only where the V0.96 surface is touched. Start with WP-00. Use full-workflow only. Reuse existing UX helpers and tests where present. Make the UI honest, role-aware, journey-first and fail-closed. Do not redesign, generate screens, promote hold routes, replace schema blindly, or weaken any P0 safety rule.
```
