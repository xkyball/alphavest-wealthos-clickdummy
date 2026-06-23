# ALPHAVEST_V0_96_WP02_PAGE_TYPE_DENSITY_SYSTEM_DEEP_TASK_DESCRIPTION.md

**Generated:** 2026-06-23  
**Mode:** Prompt 03 execution. Deep Codex-ready task description only.  
**Work Package:** `WP-02 — Page-Type + Density System`  
**Release Target:** `V0.96 Core Journey Release + UX/IA Refactor`  
**Implementation status:** Not implemented here.  
**Screen/image generation:** Not authorized.  

---

## 1. Executive Task Decision

**Decision:** `WP02_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_PAGE_TYPE_AND_DENSITY_SYSTEM_IMPLEMENTATION_AFTER_WP00_REBASE`

`WP-02` defines and operationalizes the AlphaVest V0.96 page-type and density system. The goal is not a redesign. The goal is to make every touched V0.96 surface behave like the right kind of page: hubs orient, workbenches process queues, detail pages support review, decision rooms carry irreversible/safety-sensitive actions, client projections remain calm, and reference/hold pages do not visually compete with product journeys.

This WP is the bridge between the known UI/UX/IA problem families and the surface-specific work in WP-03 through WP-10. It must prevent two opposite failures:

1. **Overlong internal pages** where everything is stacked into one scroll-heavy route with weak decision hierarchy.
2. **Sparse pages with decorative whitespace** where the page fails to explain next work, blockers, state, evidence or audit context.

**Core implementation decision:**

```text
Use a reusable page-type and density contract for touched V0.96 surfaces. Apply it through existing UX helpers and screen components first. Do not generate new visuals, do not create a new design system, and do not split routes unless WP-00 proves an existing route already supports the split or a route decision exists.
```

**Codex result expected from this WP:**

```text
A consistent V0.96 UI structure where each touched page has an explicit page type, density tier, above-the-fold job/status/blocker/next-action region, progressive disclosure for secondary content, and no misleading filler, visual-only gate proof or client/internal density leakage.
```

---

## 2. Source-of-Truth Lock

| Rank | Source / Artefact | Role in WP-02 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current live `full-workflow` repo checkout, if available | Highest implementation reality | Current components, UX helpers, routes, tests, package scripts | Assuming older KB/ZIP counts are current code truth |
| 2 | Current `alphavest-wealthos-clickdummy-full-workflow.zip` snapshot | Snapshot implementation evidence | Identify existing UX helpers, page components and test files | Treating snapshot as newer than live repo without inspection |
| 3 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | Prompt 00 evidence register | Known UI/UX/IA problem families and WP-to-problem mapping | Treating evidence register as code proof |
| 4 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary WP source | WP-02 goal, target files, acceptance criteria, stop rules | Implementing without WP-00 moving baseline |
| 5 | `ALPHAVEST_V0_96_WP00_MOVING_BASELINE_UX_IA_DELTA_REGISTER_DEEP_TASK_DESCRIPTION.md` and WP-00 output when implemented | Mandatory predecessor | Current repo delta, route/component/test classification | Starting density refactor without current baseline |
| 6 | `ALPHAVEST_V0_96_WP01_JOURNEY_FIRST_IA_APP_SHELL_SIDEBAR_TOPBAR_PAGE_HEADER_DEEP_TASK_DESCRIPTION.md` | Direct IA predecessor | Page-header and journey-first navigation contract | Replacing WP-01 IA decisions |
| 7 | `MVP_SCOPE_LOCK.md`, `ROUTE_SCOPE_LOCK.md`, `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md`, `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md`, `STATE_SCREEN_SPEC.md` | Scope/state/route controls | MVP/P1/HOLD/reference boundaries, state worksets | Pulling P1/HOLD/reference routes into V0.96 because layout work touches routes |
| 8 | `DRAWER_MODAL_INTERACTION_CONTRACT.md`, `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Interaction and feedback controls | Drawer/modal lifecycle, one primary CTA, no-overclaim wording | Treating a visual state or layout region as behaviour proof |
| 9 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Client visibility and advice safety | Fail-closed client-safe surfaces, route/action/payload separation | Using layout to reveal internal content to clients |
| 10 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence/audit/export safety | Upload-not-sufficiency, audit persistence, export stage separation | Hiding blockers/audit/evidence under density compaction |
| 11 | `API_CONTRACT_MATRIX.md`, `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`, `P0_TEST_ACCEPTANCE_MATRIX.md` | API/schema/test proof | Service/state dependencies and tests for UI truth | Claiming density/visual changes prove safety |
| 12 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`, `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey proof spine | MJ-001, MJ-002, MJ-003, MJ-005, MJ-006, MJ-010 route/workflow priorities | Flattening all journeys into V0.96 |
| 13 | `main` branch / old main ZIP | False-gap warning only | Contamination detection | Any target implementation task or absence claim |

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | WP-02 Task Implication |
|---|---|---|---|---|---|
| UX density decision is `CONTROLLED_PREMIUM_WORKBENCH_HYBRID`. | V0.96 UX/IA Refactor source; Prompt 00 register | WP-02 / all touched surfaces | Density model | High | Use calm premium client surfaces and compact internal workbenches, not one density everywhere. |
| Long/complex pages were explicitly listed: `/actions`, `/signals`, `/admin/platform`, `/compliance/:id/review`, `/export/:id/redaction`, `/compliance/:id/audit`, `/workbench`, `/workbench/triggers/:id`, `/advisor-approval/:id`, `/portal`, `/documents`, `/export/:id/scope`, `/export/:id/preview`. | Prompt 00 evidence register; V0.96 source | WP-02, WP-03 through WP-10 | Layout / scroll depth | High | Refactor touched long pages using summary-first sections, decision-room layout, queue/detail split, tabs/rails/drawers and progressive disclosure. |
| Sparse / low-value pages should gain meaningful density, not filler. | Prompt 00 evidence register; V0.96 source | WP-02 / portal, decision, support pages | Layout / empty space | Medium | Add real next-work, blockers, related evidence/decision/audit and state context only when backed by data. |
| Many screens show 25-30+ interactive candidates and unclear priority. | Prompt 00 register; Feedback contract | All touched UI WPs | CTA hierarchy | High | Density system must enforce one primary CTA per state and demote secondary content. |
| Page headers must state page job, current gate/status, blocker and next action. | WP-01; State/Feedback contracts | `components/page-header.tsx`, all V0.96 pages | Page semantics | High | Above-the-fold region must expose page job, state, blocker and primary next action before secondary content. |
| Client-facing pages must remain calm and fail closed. | RBAC/Client Visibility contract; State spec | `/portal`, `/mobile`, client-safe decision/evidence summaries | Client projection density | Critical | Do not apply dense internal workbench layout to client pages; show safe summaries/no released content state. |
| Evidence, audit and export details are safety-critical but can cause page sprawl. | Evidence/Audit/Export contract | Evidence, audit, export routes | Progressive disclosure | Critical | Use progressive disclosure without hiding blockers or required proof. |
| Audit display is not persistence proof. | Interaction Reality Audit; Evidence/Audit/Export contract | Audit surfaces | Proof semantics | Critical | Audit panels may be compact, but must distinguish persisted event source from visual timeline. |
| Export preview, approval and download are separate gates. | Evidence/Audit/Export contract | Export routes 054-058 | Stage semantics | Critical | Layout must show staged progression and prevent a single dense page from collapsing stage meaning. |
| Modals/drawers/tables can be visual-only. | Interaction Reality Audit; Drawer/Modal contract | `modal`, `drawer`, `data-table`, `state-panel` | Interaction proof | High | Density refactor may use drawers/tabs only if lifecycle and state requirements are routed to WP-11/WP-13/WP-15. |
| P1/HOLD visual refs are not generation authorization. | Route/Visual matrix; Screen Generation Brief | 052-053, 059-060, 068, 064-067, 069-071 | Scope control | Critical | Page-type system may classify them as P1/HOLD/reference only; no V0.96 product layout implementation. |

---

## 4. Current Code / Route / Component Reality to Recheck

WP-02 must begin by consuming WP-00’s moving baseline. If WP-00 has not produced a current repo delta, this WP is blocked.

### 4.1 Files / modules to inspect before edits

| Area | Files / Modules | Recheck Purpose |
|---|---|---|
| UX page helpers | `components/ux-hub-page.tsx`, `components/ux-dense-operations-panel.tsx`, `components/ux-detail-standard-panel.tsx`, `components/ux-support-density-strip.tsx`, `components/ux-secondary-context-tabs.tsx`, `components/ux-complexity-priority-panel.tsx` | Reuse existing UX helpers before adding new layout primitives. |
| Content hierarchy | `lib/ux-density.ts`, `lib/ux-content-hierarchy.ts`, `lib/ux-hub.ts`, `lib/ux-page-contract.ts`, `lib/ux-route-policy.ts` | Confirm whether page-type/density contracts already exist and how route policies are encoded. |
| Shared UI primitives | `components/ui/card.tsx`, `components/ui/data-table.tsx`, `components/ui/state-panel.tsx`, `components/ui/modal.tsx`, `components/ui/drawer.tsx`, `components/ui/evidence-list.tsx`, `components/ui/audit-timeline.tsx` | Confirm what can be reused for density, state, tables and progressive disclosure. |
| Headers / CTA | `components/page-header.tsx`, `components/ux-cta-cluster.tsx`, `components/product-guidance-panel.tsx` | Confirm header/CTA hierarchy from WP-01 can support page-type layout. |
| Surface screens | `components/client-intake-screen.tsx`, `components/internal-workflow-screen.tsx`, `components/decisions-governance-screen.tsx`, `components/communication-export-ops-screen.tsx`, `components/admin-tenant-setup-screen.tsx` | Locate current long-page/sparse-page patterns and surface-specific layouts. |
| Route registry | `lib/route-registry.ts`, `lib/navigation.ts` | Map page types to registered V0.96 route IDs without scope changes. |
| Tests | `tests/true-ux-density.spec.ts`, `tests/true-ux-cta-state.spec.ts`, `tests/true-ux-flow-navigation.spec.ts`, `tests/route-smoke.spec.ts`, any current `ui-*`, `navigation-*`, `layout-*` specs | Confirm current test names and available assertions before adding/updating tests. |

### 4.2 Current snapshot facts to treat carefully

The Prompt 00 register notes a current local snapshot with 815 files, 15 API routes, 51 spec files, 51 component files and 76 lib modules. These counts supersede older artefact counts for current-snapshot planning only. Codex must re-check the live repo or active checkout before changing code.

### 4.3 Required classification before edits

Codex must classify each target file/module/page-type capability as:

| Label | Meaning |
|---|---|
| `ALREADY_PRESENT` | Existing implementation satisfies the WP-02 contract and only needs tests/proof. |
| `PARTIAL` | Existing helper/layout exists but does not satisfy page type, density, state or CTA requirements. |
| `MISSING` | Required helper or route application is absent. |
| `CONFLICTING` | Current layout contradicts V0.96 source, KB safety, IA, or density rules. |
| `BLOCKED` | Implementation depends on unresolved route/scope/schema/API decision. |

---

## 5. WP Problem Statement

AlphaVest currently risks presenting the V0.96 journey as a collection of long screens, static visual sections, scattered CTAs and uneven density. Some internal surfaces are too dense and scroll-heavy; some client/support surfaces may appear too sparse or decorative; some pages can visually imply that workflow gates are complete when they are only pending, visual or static.

`WP-02` solves this by establishing a page-type system and density contract that downstream WPs must follow. It makes UI layout serve product truth:

- Workbenches are compact and action-oriented.
- Decision rooms show preconditions, blockers, evidence and audit without hiding safety-critical information.
- Client projections remain calm, redacted and fail-closed.
- Sparse pages show meaningful state and next work, not filler.
- Long pages use progressive disclosure and section hierarchy instead of endless panels.
- Reference/P1/HOLD pages remain de-emphasized and cannot be converted into product screens.

---

## 6. V0.96 Journey Role

`WP-02` is cross-cutting. It supports the full V0.96 proof spine:

| Journey / Proof Spine | WP-02 Contribution |
|---|---|
| `MJ-001` New Family Office onboarding to first client-safe decision | Ensures the path from internal work to client-safe decision is visible as a coherent operating flow, not disconnected pages. |
| `MJ-002` Evidence missing to client upload to release | Gives evidence routes workbench density and progressive disclosure for upload/review/sufficiency states. |
| `MJ-003` AI draft rejected and rebuilt with evidence | Gives analyst pages enough density to review unsupported claims without leaking AI draft semantics to client pages. |
| `MJ-010` Admin role change cannot bypass compliance release | Ensures governance pages show admin limits and do not look like superuser control panels. |
| `MJ-006` Cross-tenant access denied with audit proof | Requires denied/hidden/payload-safe states to be visible without exposing data. |
| `MJ-005` Export package with forbidden internal payload redaction | Structures export as a staged workflow, not one collapsed export page. |

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | Route / Surface Examples | Required WP-02 Treatment | Routed Follow-up WPs |
|---|---|---|---|
| Route-catalog / screen-catalogue feel | Global app shell and all route pages | Page type + density metadata must align with WP-01 journey-first IA. | WP-01, WP-15 |
| Long page / excessive scroll | `/documents`, `/workbench`, `/workbench/triggers/:id`, `/advisor-approval/:id`, `/compliance/:id/review`, `/compliance/:id/audit`, `/export/:id/scope`, `/export/:id/redaction`, `/export/:id/preview`, `/portal` | Summary-first top region; primary decision section; secondary details in tabs/rails/drawers/collapsibles where already supported. | WP-03–WP-10, WP-11 |
| Sparse / empty pages | Client projection, support/detail pages with weak state | Meaningful density strip: next work, status, blocker, related evidence/decision/audit, only when backed by state/data. | WP-07, WP-12 |
| Weak page job / weak header | All V0.96 surfaces | Require PageHeader contract from WP-01 with job, gate/status, blocker, primary next step. | WP-01, WP-12 |
| Too many equal CTAs | Workbenches, decision rooms, export pages | One primary CTA per state; secondary actions demoted into grouped/action menu/secondary buttons. | WP-11, WP-12, WP-15 |
| Visual-only status / chips as gate proof | Evidence/advisor/compliance/export/audit | Density must not elevate chips above actual gate source; include source labels/recovery. | WP-13, WP-15 |
| Client/internal density leakage | `/portal`, `/mobile` vs internal workbenches | Apply `CLIENT_PROJECTION` calm density; never expose internal queue/decision-room density to client. | WP-07, WP-15 |
| Progressive disclosure hiding blockers | Decision/audit/export detail surfaces | Safety-critical blockers stay above fold; only secondary context can collapse. | WP-06, WP-08, WP-10 |
| P1/HOLD/ref routes competing visually | 052-053, 059-060, 061-063, 064-067, 068-071 | Assign `REFERENCE`, `P1_DEFERRED`, `HOLD_GUARD` page types; no product layout work. | WP-00, WP-16 |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### 8.1 Changes included in WP-02

- Define or confirm route/page type vocabulary for touched V0.96 surfaces.
- Define or confirm density tiers for page types.
- Map all V0.96 core routes to a page type and density tier.
- Reuse existing `ux-*` components and `lib/ux-*` modules where present.
- Add a page type contract that downstream WPs can consume.
- Refactor shared page layout patterns only where they affect V0.96 touched surfaces.
- Provide standard layout expectations for:
  - `HUB`
  - `WORKBENCH_QUEUE`
  - `DETAIL_REVIEW`
  - `DECISION_ROOM`
  - `CLIENT_PROJECTION`
  - `GOVERNANCE_PANEL`
  - `EXPORT_STAGE`
  - `REFERENCE`
  - `HOLD_GUARD`
- Add tests proving page type, density, CTA hierarchy and no client/internal density leakage for representative routes.

### 8.2 Changes explicitly out of scope

- No broad redesign.
- No new visual design direction.
- No screen/image/state-screen generation.
- No new route creation solely to split a page.
- No P1/HOLD/reference product implementation.
- No blind schema replacement.
- No API proliferation for layout convenience.
- No hiding of safety-critical evidence, blocker, audit or release information.
- No client-visible internal workflow density.
- No attempt to make all 71 routes production-polished.

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| WP02-T01 | Consume WP-00 baseline and classify existing density system | WP-02 must not duplicate helpers that already exist. | WP-00 output, `lib/ux-density.ts`, `lib/ux-content-hierarchy.ts`, `components/ux-*`, `tests/true-ux-density.spec.ts` | Read WP-00 delta; classify helpers as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `BLOCKED`; create implementation note before edits. | Codex records current density/page-type baseline and exact delta. | Existing `true-ux-density` tests pass or are updated with rationale. | Yes — controls minimal-vs-deeper refactor. | Stop if WP-00 output is missing. |
| WP02-T02 | Define canonical page type vocabulary | Downstream WPs need one shared language. | `lib/ux-density.ts`, `lib/ux-page-contract.ts`, `lib/ux-route-policy.ts`, `lib/route-registry.ts` | Confirm/add page type enum/consts: `HUB`, `WORKBENCH_QUEUE`, `DETAIL_REVIEW`, `DECISION_ROOM`, `CLIENT_PROJECTION`, `GOVERNANCE_PANEL`, `EXPORT_STAGE`, `REFERENCE`, `HOLD_GUARD`; document intended use. | Page type vocabulary is explicit, typed and reusable; no route-scope changes. | Unit/type tests where present; typecheck. | Yes — IA/page model. | Do not create page types that imply new product scope. |
| WP02-T03 | Define density tiers and rules | Client pages and internal pages need different density. | `lib/ux-density.ts`, `components/ux-dense-operations-panel.tsx`, `components/ux-hub-page.tsx`, `components/ux-detail-standard-panel.tsx` | Define tiers such as `CALM_CLIENT`, `BALANCED_STANDARD`, `COMPACT_WORKBENCH`, `HIGH_SIGNAL_DECISION`, `REFERENCE_MINIMAL`; map allowed components, spacing, number of visible sections and progressive disclosure rules. | Density rules exist and are consumed by representative V0.96 surfaces. | `tests/true-ux-density.spec.ts` covers representative page types. | Yes — density/refactor. | Do not use internal dense tier for client projection. |
| WP02-T04 | Map V0.96 routes to page type and density | Every touched route needs a layout contract. | `lib/route-registry.ts`, `lib/ux-route-policy.ts`, `lib/navigation.ts`, WP-00 route register | Create route-to-page-type/density map for V0.96 routes; P1/reference/HOLD get deferred/guard types; ensure one mapping per route. | Each V0.96 touched route has page type + density; P1/HOLD/reference not elevated. | Route policy tests; route-smoke still passes. | Yes — route/page IA. | Stop if route registry contradicts scope lock. |
| WP02-T05 | Implement above-the-fold content hierarchy contract | Long pages need clear top hierarchy. | `components/page-header.tsx`, `components/product-guidance-panel.tsx`, `components/ux-content-hierarchy*`, screen components | Ensure page header/top block shows page job, current state/gate, blocker, primary CTA; secondary info moves below or into progressive disclosure. | Representative touched pages show job/state/blocker/primary action above fold. | `tests/true-ux-cta-state.spec.ts`; add page type assertions. | Yes — layout/header/CTA. | Do not duplicate WP-01 header logic; use existing contract. |
| WP02-T06 | Refactor long-page patterns where V0.96 touches them | The known pain is excessive scroll and weak hierarchy. | `client-intake`, `internal-workflow`, `decisions-governance`, `communication-export-ops`, `admin-tenant-setup` components | For listed long pages, add summary-first structure, split sections into scannable zones, move secondary proof/context into tabs/side rails/drawers/collapsibles using existing primitives. | Long pages are easier to scan; safety blockers remain visible; no new route required. | Screenshot/manual proof; true-ux density tests; route-smoke. | Yes — direct layout refactor. | Stop if page split requires new route or visual asset. |
| WP02-T07 | Add meaningful density to sparse pages without filler | Sparse pages need useful state/context, not decoration. | `components/ux-support-density-strip.tsx`, `components/ux-secondary-context-tabs.tsx`, client/support routes | Add density strips only for real next work, blocker, related evidence/decision/audit, safe summaries or recovery actions. Avoid decorative copy. | Sparse pages show meaningful state/context; no filler panels. | True-UX density test for sparse/support route. | Yes — whitespace/content refactor. | Do not show internal data to client to fill space. |
| WP02-T08 | Keep client projection calm and fail-closed | Client surfaces must not inherit dense internal workbench layout. | `components/client-intake-screen.tsx`, client route contracts, `visibility-engine` outputs if present | Map `/portal` and `/mobile` to `CLIENT_PROJECTION`; use safe summary/no released content state; limit panels; hide internal queue/audit/workflow details. | Client pages remain calm and safe; no internal labels/counts/details leak. | Client visibility / true-ux tests. | Yes — client layout and density. | Stop if client route needs data not provided by visibility contract; route to WP-13. |
| WP02-T09 | Standardize queue/detail/decision-room layouts for downstream WPs | Advisor, Compliance and Export need recognizable patterns. | `components/ux-dense-operations-panel.tsx`, `components/ux-detail-standard-panel.tsx`, relevant screen components | Define reusable patterns: queue list + active item summary; detail review; decision room preconditions; export stage page. Keep implementation minimal and reusable. | Downstream WPs can reuse patterns without inventing per-route layout structures. | Component smoke/visual assertions if present. | Yes — layout system. | Do not over-abstract or create unused framework. |
| WP02-T10 | Progressive disclosure rules for evidence/audit/export | Secondary details should not create scroll sprawl but blockers cannot disappear. | `components/ux-secondary-context-tabs.tsx`, `components/ui/drawer.tsx`, `components/ui/modal.tsx`, evidence/audit/export components | Define what may collapse: raw detail, history, secondary metadata; define what must stay visible: gate blocker, sufficiency, release status, required audit, export redaction state. | Secondary details are accessible but safety-critical blockers remain visible. | Interaction lifecycle tests where drawer/tab used. | Yes — progressive disclosure. | Stop if collapse hides release/evidence/audit blockers. |
| WP02-T11 | CTA density and priority enforcement | Too many equal actions make pages hard to operate. | `components/ux-cta-cluster.tsx`, `components/page-header.tsx`, screen components | Enforce one primary CTA per page state; group secondary/tertiary actions; add disabled reasons for blocked actions. | Representative pages have exactly one primary CTA in a given state. | `tests/true-ux-cta-state.spec.ts`. | Yes — CTA hierarchy. | Do not remove recovery/cancel actions; demote or group them. |
| WP02-T12 | Add/update P0/True-UX tests for density system | Layout changes must be provable. | `tests/true-ux-density.spec.ts`, `tests/true-ux-cta-state.spec.ts`, `tests/route-smoke.spec.ts` | Add tests for route-to-page-type mapping, density tier, one primary CTA, client calm density, internal compact density and HOLD/P1/reference non-promotion. | Tests prove WP-02 scope without relying on screenshots alone. | See Section 16. | Yes — acceptance proof. | Do not mark done without tests or documented unavailable test harness. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### 10.1 Route families affected by WP-02

| Route Family | Representative Routes | Page Type | Density Tier | WP-02 Treatment |
|---|---|---|---|---|
| Evidence workbench | `/documents`, `/documents/upload`, `/documents/extraction-review`, `/documents/verification-pending`, `/evidence`, `/evidence/:id` | `WORKBENCH_QUEUE` / `DETAIL_REVIEW` | `COMPACT_WORKBENCH` / `BALANCED_STANDARD` | Make evidence lifecycle scannable; distinguish upload, review, sufficiency and link states. |
| Analyst workbench | `/signals`, `/workbench`, `/workbench/triggers/:id` | `WORKBENCH_QUEUE` / `DETAIL_REVIEW` | `COMPACT_WORKBENCH` | Compact internal review without hiding unsupported claims/evidence needs. |
| Advisor approval | `/advisor-approval`, `/advisor-approval/:id` | `WORKBENCH_QUEUE` / `DETAIL_REVIEW` | `COMPACT_WORKBENCH` / `BALANCED_STANDARD` | Queue/detail clarity; no release overclaim. |
| Compliance release | `/compliance`, `/compliance/:id/review`, `/compliance/:id/release`, `/compliance/:id/block`, `/compliance/:id/audit` | `DECISION_ROOM` | `HIGH_SIGNAL_DECISION` | Keep preconditions, blockers, release action and audit status visible. |
| Decision record | `/decisions`, `/decisions/:id`, `/decisions/:id/success` | `DETAIL_REVIEW` / `DECISION_ROOM` | `BALANCED_STANDARD` | Summary-first decision proof; linked evidence/advisor/compliance/audit refs. |
| Client projection | `/portal`, `/mobile` | `CLIENT_PROJECTION` | `CALM_CLIENT` | Calm, released-only, fail-closed projection. |
| Governance | `/governance/users`, `/governance/roles`, `/governance/access-requests`, `/governance/audit-history` | `GOVERNANCE_PANEL` | `BALANCED_STANDARD` / `COMPACT_WORKBENCH` | Admin non-bypass UX; second confirmation and audit states visible. |
| Export | `/export/new`, `/export/:id/scope`, `/export/:id/redaction`, `/export/:id/preview`, `/export/:id/download` | `EXPORT_STAGE` | `HIGH_SIGNAL_DECISION` / `BALANCED_STANDARD` | Staged layout: scope → redaction → preview → approval → manifest/download. |
| Support/setup | `/login`, `/mfa`, `/onboarding/*`, `/admin/*`, `/tenants/*`, `/client/*`, `/entities*`, `/wealth-map`, `/actions` | `HUB`, `DETAIL_REVIEW`, `GOVERNANCE_PANEL` as applicable | `BALANCED_STANDARD` | Only refactor where touched by V0.96 support flow. |
| P1 / reference / hold | P1: 052,053,059,060,068; Reference: 061-063; HOLD: 064-067,069-071 | `REFERENCE`, `HOLD_GUARD`, `P1_DEFERRED` | `REFERENCE_MINIMAL` | Do not productize. Keep non-primary/deferred/guarded. |

### 10.2 APIs / services / schema

WP-02 should not create API or schema changes for layout alone. It may require APIs/services to provide state signals so layout can be truthful. If missing, route to WP-13 or WP-14.

| Area | Possible Dependency | Rule |
|---|---|---|
| Evidence state | `/api/documents`, document/evidence services, `EvidenceRecord`, `DocumentReview` | UI density may display state only if backed by service/schema truth. |
| Compliance blockers | workflow/compliance services, `ComplianceReview`, `Approval`, `Decision` | Decision-room density cannot invent blockers. |
| Client-safe summary | visibility engine/projection service | Client projection must fail closed if state source is missing. |
| Audit event refs | audit service, `AuditEvent` | Audit summary must not be visual-only. |
| Export stages | export services, `ExportRequest` | Export layout must not imply approval/download if service state absent. |

---

## 11. Interaction Lifecycle Requirements

WP-02 is not the main interaction-primitive WP, but density refactors often introduce or reuse tabs, drawers, collapsibles, filters, tables and CTAs. Therefore:

| Interaction | WP-02 Requirement | Routed To |
|---|---|---|
| Tabs / secondary context | Must be keyboard reachable and not hide blockers. | WP-11, WP-15 |
| Drawers for secondary detail | May be used only if open/close/cancel/focus lifecycle exists or is routed. | WP-11 |
| Collapsible sections | May hide secondary metadata, not safety-critical blockers or primary CTAs. | WP-11, WP-15 |
| Data tables | Must include loading/empty/error/permission states and not rely on fake row actions. | WP-11, WP-13 |
| Primary CTA | Exactly one primary CTA per page state; disabled/denied reason must be visible. | WP-11, WP-12 |
| Client projection | No internal interactions; calm view with safe next action only. | WP-07, WP-15 |

---

## 12. State / Feedback / Microcopy Requirements

WP-02 must make room for truthful states and safe copy. It must not write all microcopy itself, but it must specify where copy and state density appear.

| State / Feedback Family | Required Layout Treatment | Example Safe Copy Intent |
|---|---|---|
| Upload success | Keep as upload-only state; do not place in release-complete region. | “Upload complete. Evidence still requires review.” |
| Evidence pending / insufficient / sufficient | Show in evidence workbench and compliance blocker area. | “Evidence review pending.” / “Evidence insufficient for release.” |
| Advisor approved | Show as compliance-pending, not released. | “Advisor approved. Waiting for compliance release.” |
| Compliance blocked | High-visibility decision-room blocker. | “Release blocked until evidence is sufficient.” |
| Client no released content | Calm client projection empty state. | “No released content is available yet.” |
| Audit unavailable | Visible blocker where action requires audit. | “Audit confirmation unavailable. Action cannot complete.” |
| Export preview ready | Stage-specific, not approval. | “Preview ready. Approval still required.” |
| Permission denied | State panel or disabled action reason. | “You do not have permission for this action.” |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-02 Implication |
|---|---|
| RBAC | Density must not expose action controls or payload previews to roles that lack permission. |
| Client visibility | Client projection uses `CALM_CLIENT` density and fail-closed content. No internal workflow panels. |
| Advice boundary | Internal AI/rules draft review density must not leak into client or export layouts. |
| Evidence | Evidence sufficiency blockers must remain visible; upload-only success must not be promoted. |
| Audit | Audit summary must differentiate persisted audit event from visual timeline/display. |
| Export | Stage layout must preserve scope/redaction/preview/approval/download separation. |
| Admin non-bypass | Governance density must show admin constraints, second confirmation and denied bypass states. |
| P1/HOLD scope | P1/HOLD routes may receive guard/deferred classification only; no product density implementation. |

---

## 14. Positive Acceptance Criteria

| ID | Acceptance Criteria |
|---|---|
| WP02-POS-001 | Every touched V0.96 route has an explicit page type and density tier in code or a documented current-route contract. |
| WP02-POS-002 | Above-the-fold content on representative routes shows page job, current state/gate, blocker if present, and one primary next action. |
| WP02-POS-003 | Internal workbench pages are scannable and compact without hiding blockers, evidence status or audit requirements. |
| WP02-POS-004 | Client portal/mobile surfaces remain calm, redacted and fail-closed. |
| WP02-POS-005 | Long touched pages use summary-first and progressive disclosure for secondary content. |
| WP02-POS-006 | Sparse touched pages show meaningful next-work/state/context only when backed by data/state. |
| WP02-POS-007 | Export pages show staged density and do not collapse preview, approval and download. |
| WP02-POS-008 | P1/HOLD/reference routes are classified as deferred/reference/hold and not promoted by density work. |
| WP02-POS-009 | Existing route-smoke and relevant True-UX tests pass. |

---

## 15. Negative Acceptance Criteria

| ID | Negative Acceptance Criteria |
|---|---|
| WP02-NEG-001 | No client-facing page uses dense internal workbench layout or reveals internal queue/status/audit details. |
| WP02-NEG-002 | No long-page refactor hides compliance blockers, evidence insufficiency, audit-required state or export-redaction blockers. |
| WP02-NEG-003 | No sparse page is padded with decorative filler or marketing copy that is not backed by current state. |
| WP02-NEG-004 | No page renders multiple competing primary CTAs for the same state. |
| WP02-NEG-005 | No layout copy implies upload equals evidence sufficiency, advisor approval equals release, export preview equals approval or audit timeline equals persistence. |
| WP02-NEG-006 | No density/page-type mapping elevates P1/HOLD/reference routes into V0.96 product scope. |
| WP02-NEG-007 | No new visual assets, image generation or state-screen generation are introduced. |
| WP02-NEG-008 | No route is split into a new route without existing route registry support and scope decision. |

---

## 16. Required Tests and Test Names

Codex must confirm actual available package scripts and test names in `package.json`. Use existing tests where present, add/update only where needed.

| Test Name / Command | Purpose |
|---|---|
| `pnpm typecheck` | Validate route/page-type/density types and component props. |
| `pnpm lint` | Validate code style and accessibility/static issues where lint covers them. |
| `pnpm playwright test tests/true-ux-density.spec.ts` | Prove page-type/density rules for representative routes. |
| `pnpm playwright test tests/true-ux-cta-state.spec.ts` | Prove one primary CTA per state and disabled/gated action reasons. |
| `pnpm playwright test tests/true-ux-flow-navigation.spec.ts` | Prove density aligns with journey flow and WP-01 IA. |
| `pnpm playwright test tests/route-smoke.spec.ts` | Ensure registered routes still render after layout changes. |
| Add/update `tests/page-type-density-contract.spec.ts` if no equivalent exists | Verify route-to-page-type mapping, P1/HOLD/reference de-emphasis, client calm density and internal compact density. |
| Add/update `tests/client-projection-density-safety.spec.ts` if no equivalent exists | Ensure client portal/mobile do not show internal dense panels or internal state. |

---

## 17. Validation Commands

Codex must inspect `package.json` first and use the repo’s actual scripts. Suggested command set:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm playwright test tests/route-smoke.spec.ts
pnpm playwright test tests/true-ux-density.spec.ts
pnpm playwright test tests/true-ux-cta-state.spec.ts
pnpm playwright test tests/true-ux-flow-navigation.spec.ts
```

If test files do not exist, Codex must either:

1. add the missing test file as part of WP-02 if in scope, or
2. document why an equivalent existing test covers the acceptance criterion.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| `STOP_NO_WP00_REBASE` | Do not implement WP-02 before current repo baseline and UX/IA delta are available. |
| `STOP_NO_SCREEN_GENERATION` | Do not create or generate screen/state/image assets. |
| `STOP_NO_BROAD_REDESIGN` | Do not change design direction or rewrite all routes. |
| `STOP_NO_ROUTE_SPLIT_WITHOUT_SCOPE` | Do not split pages into new routes unless route registry/scope already supports it. |
| `STOP_NO_P1_HOLD_ELEVATION` | Do not promote P1/HOLD/reference routes to V0.96 product pages. |
| `STOP_NO_CLIENT_INTERNAL_DENSITY` | Do not apply internal workbench density to client-facing routes. |
| `STOP_NO_HIDDEN_SAFETY_BLOCKERS` | Do not collapse/hide blockers, audit-required states, evidence insufficiency or release gates. |
| `STOP_NO_FILLER_CONTENT` | Do not fill whitespace with decorative copy or unsupported content. |
| `STOP_NO_VISUAL_ONLY_PROOF` | Do not treat status chips, panels, modals or layout as behaviour proof. |
| `STOP_NO_SCHEMA_REPLACEMENT` | Do not modify Prisma schema for layout convenience. Route to WP-14. |
| `STOP_NO_API_PROLIFERATION` | Do not add APIs for layout convenience. Route to WP-13 if state source is missing. |

---

## 19. Open Questions / Blockers

| Question / Blocker | Decision Rule |
|---|---|
| Does the live repo still contain all UX helper modules listed in the source? | WP-00 must verify. If absent, implement minimal helper only if needed by V0.96 touched surfaces. |
| Are `true-ux-density` and `true-ux-cta-state` tests already present? | Reuse/update existing tests first. Add new tests only if no equivalent exists. |
| Can long pages be improved without new routes? | Yes: use summary-first, progressive disclosure, tabs/rails/drawers. Stop if a new route is required. |
| Which pages are truly sparse vs intentionally calm? | Client pages may be calm by design. Add density only when it improves state/next-action clarity without leakage. |
| Can a layout refactor hide safety content behind a drawer? | No. Safety-critical blockers/preconditions must remain visible or immediately accessible above fold. |
| Does page type need schema/API fields? | Layout itself should not. If truthful state is missing, route to WP-13/WP-14. |

---

## 20. Codex Execution Notes

1. Start with WP-00 output, not the older KB counts.
2. Use existing `ux-*` helpers first. Avoid parallel layout system creation.
3. Implement page-type/density contracts before refactoring individual surfaces.
4. Touch only V0.96 routes and flow-relevant support surfaces.
5. Do not treat visual compaction as completed workflow behaviour.
6. Keep client pages calm and fail-closed.
7. Keep blockers visible.
8. Add tests for both positive layout correctness and negative safety regressions.
9. Record any deferred long/sparse page issues in release evidence / handoff update rather than silently ignoring them.

---

## 21. QA Matrix

| QA Check | Required Result | Status Before Implementation |
|---|---|---|
| WP-00 baseline consumed | Required | `PENDING_CODEX_EXECUTION` |
| Page-type vocabulary exists | Required | `TO_RECHECK` |
| Density tiers exist | Required | `TO_RECHECK` |
| Route-to-page-type map exists for V0.96 | Required | `TO_RECHECK` |
| Long pages touched by V0.96 have refactor plan | Required | `SPECIFIED_HERE` |
| Sparse pages avoid filler | Required | `SPECIFIED_HERE` |
| Client projection remains calm/fail-closed | Required | `SPECIFIED_HERE` |
| One primary CTA per state | Required | `ROUTED_TO_WP02/WP11/WP12` |
| P1/HOLD/reference not promoted | Required | `SPECIFIED_HERE` |
| No screen/image generation | Required | `LOCKED` |
| Tests identified | Required | `SPECIFIED_HERE` |
| Implementation performed in this artefact | Must be no | `NO_IMPLEMENTATION` |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Contribution | ENGINE_v2 Contribution | Codex-Spark-like Convergence |
|---|---|---|---|
| KB/UI/IA discovery | Extracted page-density, long-page, sparse-page, CTA, client/internal leakage and progressive-disclosure problem families. | Classified evidence into task implications and stop rules. | Selected concrete page-type/density implementation path instead of broad redesign options. |
| Source hierarchy | Detected contradictions between older KB counts and current snapshot notes. | Locked full-workflow/current repo as implementation baseline and `main` as false-gap only. | Required WP-00 baseline before implementation. |
| Scope control | Preserved V0.96 route/journey scope and P1/HOLD/reference boundaries. | Converted scope into route family and stop-rule tables. | Blocked P1/HOLD elevation and screen generation. |
| UX/IA operationalization | Interpreted `CONTROLLED_PREMIUM_WORKBENCH_HYBRID` into page-type logic. | Created task IDs, files to inspect, steps, tests and acceptance criteria. | Produced Codex-ready instructions with no product decisions delegated. |
| Safety integration | Connected density to client visibility, evidence, compliance, audit and export risks. | Added positive/negative acceptance criteria and test requirements. | Kept safety blockers visible and routed missing service/schema truth to later WPs. |
| Final QA | Checked against no redesign/no generation/no schema replacement constraints. | Built QA matrix and validation commands. | Delivered one implementation-ready task description artefact for WP-02. |

