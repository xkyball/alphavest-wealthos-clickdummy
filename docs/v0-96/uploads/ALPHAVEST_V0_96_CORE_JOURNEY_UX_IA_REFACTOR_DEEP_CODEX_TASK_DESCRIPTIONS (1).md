# ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DEEP_CODEX_TASK_DESCRIPTIONS.md

**Generated:** 2026-06-23  
**Mode:** Deep Codex/developer execution task pack derived from `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` plus AlphaVest Knowledge Base Bundle.  
**ENGINE mix:** `ENGINE_v2` for execution discipline, evidence rules, file-level tasking, P0 gates and QA + `ENGINE_v3` for UX/IA synthesis, journey design, contradiction control and problem framing.  
**Release target:** `V0.96 Core Journey Release + UX/IA/Layout/IA Refactor`.  
**Implementation style:** Codex-Spark-like: high decision density, no wandering, no overbuild, implement only locked work.  
**This artefact does not implement code. It is a task specification.**

---

## 1. Executive Decision

This document expands the previous V0.96 UX/IA refactor pack into **atomic Codex-ready implementation tasks**. The prior pack described work packages. This pack turns those work packages into explicit execution cards with:

- business and product intent
- AlphaVest KB context Codex must carry
- likely target files and modules
- concrete implementation steps
- UI/UX/Layout/IA refactor instructions
- service/API/schema dependencies
- positive and negative tests
- acceptance criteria
- stop rules
- final proof requirements

The core release stays the same:

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

The important strengthening is this:

```text
Whenever Codex touches a V0.96 surface, it must also repair the known UX/IA/Layout problem on that surface.
```

That means no separate UX cleanup later for touched pages. If Codex is already in `ClientIntakeScreen`, `InternalWorkflowScreen`, `DecisionsGovernanceScreen`, `CommunicationExportOpsScreen`, `AdminTenantSetupScreen`, `AppShell`, `Sidebar`, `PageHeader`, `Modal`, `Drawer`, `DataTable`, `StatePanel`, `EvidenceList`, `AuditTimeline`, `GuardedActionButton` or existing `ux-*` helpers, the task must make the surface truthful, journey-first, role-aware, density-appropriate and fail-closed.

---

## 2. Non-negotiable interpretation for Codex

| Rule | Meaning for implementation |
|---|---|
| `full-workflow` only | Implement against the current full-workflow repo checkout. `main` is false-gap history only. |
| Start with WP-00 | No feature task before repo-reality and UX/IA delta rebase. |
| UI proof is not behaviour proof | Screens, PNGs, chips, buttons, modals and guidance panels do not prove interaction, permission, audit or release. |
| Refactor where touched | When a V0.96 surface is changed, apply known UX/IA/Layout fixes on that surface. |
| No broad redesign | Keep visual identity. Improve structure, states, density, labels, CTAs and truthful feedback. |
| No image generation | Do not generate or replace reference PNGs or state-screen images. |
| No hold-route elevation | Routes 064-067 and 069-071 remain held. Route 068 remains P1 unless later explicitly unlocked. |
| No schema replacement | Full-workflow schema is baseline. Align usage; create migration only if unavoidable and documented. |
| No new API sprawl | Harden/reuse existing APIs. Add API only if WP-00 proves existing routes cannot support locked V0.96 needs. |
| Safety beats polish | RBAC, visibility, advice-boundary, evidence, audit and export safety always override UX convenience. |
| One primary CTA | Every state has at most one primary action. Secondary actions are demoted, grouped or disabled. |
| Copy cannot overclaim | Success text names only the gate actually completed. |

---

## 3. Knowledgebase evidence Codex must carry

### 3.1 Current source hierarchy

| Rank | Source | Use | Forbidden use |
|---:|---|---|---|
| 1 | Current local/full-workflow repo checkout | Code, route, API, Prisma, test, component reality | Assuming older counts are still current |
| 2 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Direct predecessor task pack | Treating it as implemented proof |
| 3 | `ALPHAVEST_KNOWLEDGE_BASE_BUNDLE_2026-06-23.zip` | UX/IA/layout/functionality/interaction/state/form/table/role/workflow/content evidence | Treating screenshot-derived candidates as code truth |
| 4 | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` + `FINAL_CODEX_TASK_MASTER.md` | Final AlphaVest implementation boundaries | Reclassifying product scope |
| 5 | Scope, route, state, feedback, safety, API, schema and P0 artefacts | Contracts and acceptance gates | Weakening stop rules |
| 6 | `alphavest_mvp_artifact_completion_patch.zip` | Control spec for MVP safety, RBAC, visibility, workflow and acceptance | Blind schema/code replacement |
| 7 | `alphavest-wealthos-clickdummy-main.zip` / `main` | False-gap warning only | Target implementation source |

### 3.2 Runtime snapshot Codex must re-check, not blindly trust

The local snapshot observed for this task pack contains approximately:

| Area | Observed count |
|---|---:|
| Files in uploaded full-workflow snapshot | 815 |
| `app/` files | 22 |
| API route files | 15 |
| Component `.tsx` files | 50 |
| `lib/*.ts` files | 73 |
| Playwright/spec files | 51 |
| Prisma folder files | 5 |
| Public clean page PNGs | 63 |

**Codex must verify these in WP-00 against the actual repo checkout before editing.** Older artefacts mention 4 APIs and 10 specs; those are stale for the current snapshot unless WP-00 proves otherwise.

### 3.3 UX/IA/Layout evidence summary from KB bundle

| Knowledgebase phase | Evidence signal | Implementation meaning |
|---|---|---|
| UX audit | 84 user-task candidates, 335 orientation findings, 273 guidance findings, 161 friction items, 53 high frictions, 23 unclear next-step items, 29 decision-support gaps | Add page-job headers, next-step clarity, consequence clarity and one primary CTA on touched V0.96 surfaces. |
| IA/navigation audit | 1282 navigation-like elements, 71 route registry entries, 106 IA candidates, 67 ambiguous labels, 108 duplicate labels, 549 nav elements without confirmed targets | Replace route-catalogue feel with journey-first IA; split title from description; normalize labels on touched routes. |
| Layout audit | 84 layout summaries, 511 layout-region findings, 208 alignment findings, 261 spacing findings, responsive and cropping-risk registers | Apply page-type/density tiers; reduce long-page friction; avoid sparse/decorative pages; add semantic layout tests. |
| Functionality audit | UI actions, data needs, permission candidates and functional gap registers | Do not treat buttons as functions; bind actions to services, permissions and tests. |
| Interaction audit | High-risk interactions, CTA-to-state transitions, form/file/table candidates | Implement lifecycle for touched modals/drawers/forms/buttons: trigger, validation, loading, error, success, audit and cancel. |
| States/edge cases audit | State map, transition draft, feedback/recovery, high-risk state coverage and state gaps | Add loading, empty, denied, blocked, validation failed, retry, success and fail-closed states on touched surfaces. |
| Forms audit | 84 forms, 288 fields, 197 actions, 172 validations, 283 validation gaps, 593 form gaps | Add validation and feedback only where V0.96 forms are touched. |
| Tables/search/filter/sort audit | 34 tables, 208 columns, 46 row actions, 66 search items, 165 filters, 76 sort items, 256 table gaps | Add semantic table behaviour or explicitly disable/defer row actions; no fake sorting/filtering. |
| Roles/rights audit | 1406 role-permission matrix items, 1577 action candidates, 531 permission risks, 275 unresolved permission rules | Route/action/object/payload separation is required; avoid admin-bypass and cross-tenant leakage. |
| Workflow/pageflow audit | 14 workflow candidates, 79 steps, 680 workflow gates, 576 missing/unverified gates, 1944 workflow gaps | V0.96 must implement a single core journey spine with proof; do not claim every workflow complete. |
| Content/microcopy audit | Ambiguous terms and CTAs such as Back, Continue, Review, Approval, Released, Denied, Evidence Vault, Client home released projection | Normalize terminology and no-overclaim copy on touched V0.96 surfaces. |

---

## 4. V0.96 route and journey focus

### 4.1 Core V0.96 route workset

| Journey section | Routes | UI treatment |
|---|---|---|
| Client-safe projection | `019 /portal`, `020 /mobile` | Calm fail-closed released view; no internal workbench density. |
| Evidence | `027 /documents`, `028 /documents/upload`, `029 /documents/extraction-review`, `030 /documents/verification-pending`, `046 /evidence`, `047 /evidence/:id` | Evidence workbench, upload-only success, review/link/sufficiency states. |
| Analyst / AI draft | `033 /signals`, `034 /workbench`, `035 /workbench/triggers/:id` | Internal-only draft review, unsupported claim, needs evidence, ready for advisor. |
| Advisor | `036 /advisor-approval`, `037 /advisor-approval/:id` | Advisor approval as human review, not release. |
| Compliance | `038 /compliance`, `039 /compliance/:id/review`, `040 /compliance/:id/release`, `041 /compliance/:id/block`, `042 /compliance/:id/audit` | Decision room, release/block/request evidence, modal lifecycle and audit. |
| Decision record | `043 /decisions`, `044 /decisions/:id`, `045 /decisions/:id/success` | Linked recommendation/evidence/approval/release/audit refs and client-safe outcome. |
| Governance/admin | `007-012`, `013-018`, `048-051` where required | Admin configuration without superuser bypass impression; role-aware states. |
| Export | `054-058` | Scope → redaction → preview → approval → manifest/download staging. |

### 4.2 Defer/guard route workset

| Routes | Rule |
|---|---|
| `052-053`, `059-060`, `068` | P1/deferred; do not bring into V0.96 except de-emphasis/guard in nav. |
| `061-063` | Reference only; may be hidden/de-emphasized if they clutter navigation. |
| `064-067`, `069-071` | Hold; no V0.96 implementation. If visible, show hold/guard only. |
## 5. Atomic work package index

| WP | Name | Primary kind | Release blocking? |
|---|---|---|---|
| WP-00 | Repo Reality + UX/IA Delta Rebase | Rebase/Closure | Yes |
| WP-01 | Journey-first IA / App Shell / Navigation | UX/IA + Safety | Yes |
| WP-02 | Page Header Contract + Page Job / Gate / Next Step | UX/IA + Safety | Yes |
| WP-03 | Page Type + Density System | UX/IA + Safety | Yes |
| WP-04 | Shared CTA / Button / Action Priority Contract | UX/IA + Safety | Yes |
| WP-05 | Evidence Intake Workbench UI + Upload Truth | Journey/Safety/API | Yes |
| WP-06 | Evidence Review + Sufficiency Lifecycle | Journey/Safety/API | Yes |
| WP-07 | Analyst Workbench + AI Draft Internal-only Review | Journey/Safety/API | Yes |
| WP-08 | Advisor Queue + Approval Detail UX | Journey/Safety/API | Yes |
| WP-09 | Compliance Decision Room / Release / Block / Request Evidence | Journey/Safety/API | Yes |
| WP-10 | Decision Record + Traceability UI | Journey/Safety/API | Yes |
| WP-11 | Client-Safe Projection / Portal / Mobile Fail-Closed UX | UX/IA + Safety | Yes |
| WP-12 | Audit Persistence + Audit Surface UX | Journey/Safety/API | Yes |
| WP-13 | Governance / Admin Non-Bypass UX and Permissions | Journey/Safety/API | Yes |
| WP-14 | Export Scope / Redaction / Approval / Manifest UX | Journey/Safety/API | Yes |
| WP-15 | Shared Modal / Drawer / Form / Table Lifecycle Refactor | UX/IA + Safety | Yes |
| WP-16 | No-Overclaim Microcopy + Domain Terminology Harmonization | UX/IA + Safety | Yes |
| WP-17 | API / Service Integration for UI Truth | Journey/Safety/API | Yes |
| WP-18 | Schema Usage Alignment for Journey and UI State | Journey/Safety/API | Yes |
| WP-19 | P0 + True-UX Acceptance Suite | UX/IA + Safety | Yes |
| WP-20 | Release Proof / Handoff Update | Rebase/Closure | Yes |

---
## WP-00 — Repo Reality + UX/IA Delta Rebase

| Field | Value |
|---|---|
| Priority | `P0 / must run first` |
| Journey mapping | `All V0.96 flows` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Audit before edits. Reconcile current repo with this pack, predecessor pack, KB bundle and current tests. Produce a delta register that prevents stale assumptions and duplicate work.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof. It also uses the IA audit signals: 1282 navigation-like elements, ambiguous/duplicate labels and unclear hub hierarchy; the solution is journey-first primary IA, not a broader visual redesign.

### Likely target files/modules to inspect
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
- `docs/**`

### Implementation steps
1. Record branch, commit, working tree status and package scripts.
2. Inventory current route registry and classify V0.96/P1/reference/hold routes.
3. Inventory API routes and compare with older 4-API assumption.
4. Inventory tests and identify true-UX/P0/safety specs already present.
5. Inventory UX helper components and where they are used.
6. Create `docs/V0_96_UX_IA_DELTA_REGISTER.md` or equivalent final report section with ALREADY_PRESENT/PARTIAL/MISSING/CONFLICTING/BLOCKED per WP.
7. Map long-page, sparse-page, duplicate-label, unclear-CTA and missing-state findings to actual components before changing code.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- No code change in WP-00.
- Delta register exists and is evidence-based.
- Stale older KB claims are marked stale, not implemented.
- Subsequent WPs have exact target files.

### Required tests/proof
- Run or inspect package scripts; run source reality/route smoke if available.
- Attach route/API/test/component inventory to final report.

### Stop rules
- Wrong branch/repo unknown.
- Current repo contradicts task pack.
- Required V0.96 route registry missing.

---

## WP-01 — Journey-first IA / App Shell / Navigation

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-001/MJ-002/MJ-003/MJ-005/MJ-006/MJ-010` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Make the app feel like a guided operating system rather than a flat route catalogue. Navigation must follow journey, role and next work.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof. It also uses the IA audit signals: 1282 navigation-like elements, ambiguous/duplicate labels and unclear hub hierarchy; the solution is journey-first primary IA, not a broader visual redesign.

### Likely target files/modules to inspect
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

### Implementation steps
1. Create/confirm canonical V0.96 groups: Foundation, Client, Evidence, Advisory, Compliance, Decisions, Governance, Export.
2. Use route metadata and role/session context to filter or guard navigation.
3. Split long navigation-card labels into short label + description; remove duplicate/ambiguous labels on touched routes.
4. De-emphasize P1/reference/hold routes so they do not compete with the core journey.
5. Ensure client-facing nav does not reveal internal workflow counts, titles or labels.
6. Add route context chips only where they clarify tenant, actor, object, journey step or gate.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- V0.96 path can be followed without browsing all 71 routes.
- Client and internal navigation differ by role/scope.
- P1/hold/reference routes are not primary V0.96 navigation.
- No internal counts/previews leak through nav.

### Required tests/proof
- Route-smoke.
- Navigation shell/true-UX navigation specs if present.
- Add assertion that core journey nav order exists and hold routes are not promoted.

### Stop rules
- Nav change hides required safety route.
- Client nav exposes internal workflow labels.
- Task needs new route scope decision.

---

## WP-02 — Page Header Contract + Page Job / Gate / Next Step

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `All touched V0.96 UI surfaces` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Every touched page needs an actionable header that explains the page job, current gate, blocker and next action. Decorative guidance panels must become contextual or collapsible.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof. It uses layout and UX evidence about long pages, sparse pages, unclear next steps and decorative guidance panels; refactor structure only where V0.96 surfaces are touched.

### Likely target files/modules to inspect
- `components/page-header.tsx`
- `components/product-guidance-panel.tsx`
- `components/route-context-chip.tsx`
- `components/ux-page-contract.tsx`
- `lib/ux-page-contract.ts`
- `lib/ux-content-hierarchy.ts`

### Implementation steps
1. Define a `PageJob`/`PageGate`/`NextStep` contract if not already present.
2. For every V0.96 route touched, set: title, page job, current gate/status, blocker, primary next action and safety note when needed.
3. Move repeated workflow guidance out of primary content unless it gives actionable recovery.
4. Ensure high-impact pages name the gate exactly: Evidence Review, Advisor Approval, Compliance Release, Client Visibility, Export Approval.
5. Add blocked/permission/no-data text to headers where the page cannot proceed.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- Above the fold tells user what this page does and what must happen next.
- Advisor pages never imply release.
- Upload pages never imply sufficiency.
- Export pages distinguish preview/approval/download.

### Required tests/proof
- True-UX CTA/page-header specs if present.
- Add semantic test for page header metadata on V0.96 route sample.

### Stop rules
- Header copy implies downstream gate already passed.
- Header adds product claims not backed by service state.

---

## WP-03 — Page Type + Density System

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `All touched V0.96 UI surfaces` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Apply page types and density tiers: hubs orient, queues process work, details support review, decision rooms handle safety gates, client projections stay calm.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof. It uses layout and UX evidence about long pages, sparse pages, unclear next steps and decorative guidance panels; refactor structure only where V0.96 surfaces are touched.

### Likely target files/modules to inspect
- `components/ux-hub-page.tsx`
- `components/ux-dense-operations-panel.tsx`
- `components/ux-detail-standard-panel.tsx`
- `components/ux-support-density-strip.tsx`
- `components/ux-secondary-context-tabs.tsx`
- `components/ux-complexity-priority-panel.tsx`
- `components/ui/card.tsx`
- `components/ui/data-table.tsx`
- `lib/ux-density.ts`
- `lib/ux-hub.ts`
- `lib/ux-content-hierarchy.ts`

### Implementation steps
1. Confirm existing density helpers.
2. Assign page type to touched V0.96 routes: HUB, WORKBENCH_QUEUE, DETAIL_REVIEW, DECISION_ROOM, CLIENT_PROJECTION, GOVERNANCE, EXPORT_STEP.
3. Refactor long pages into summary-first layout, main decision section, secondary tabs/drawers/rails and audit/evidence context.
4. Add useful density to sparse pages via next-work, blocker, related evidence, related decision or recent audit modules.
5. Keep client projection pages calmer than internal workbenches.
6. Do not use filler content.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- Touched pages have explicit page type and density tier.
- Long pages have shorter primary decision path.
- Sparse pages explain state and next work.
- Client pages do not look like internal operations boards.

### Required tests/proof
- True-UX density specs if present.
- Target viewport manual proof or semantic layout tests.
- Route-smoke for changed routes.

### Stop rules
- Requires new visual assets.
- Page split creates new route without scope lock.
- Safety-critical blocker is hidden in collapsed area.

---

## WP-04 — Shared CTA / Button / Action Priority Contract

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `All action-heavy V0.96 surfaces` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Too many equal actions was a recurring UX problem. Every state must expose one primary CTA, with secondary actions grouped, disabled, hidden or deferred.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof.

### Likely target files/modules to inspect
- `components/ui/guarded-action-button.tsx`
- `components/ux-cta-cluster.tsx`
- `components/ui/data-table.tsx`
- `components/page-header.tsx`
- `lib/ux-cta.ts`
- `lib/permission-engine.ts`

### Implementation steps
1. Inventory CTAs on documents, workbench, advisor, compliance, governance and export pages.
2. For each state, assign exactly one primary CTA.
3. Demote secondary actions into text links, grouped menus, side drawers or secondary button style.
4. Disable or hide actions when permissions/preconditions fail; do not rely on visual style alone.
5. Add reason text for disabled safety-critical actions.
6. Ensure button label states consequence: Request evidence, Approve as advisor, Release to client, Review redaction, Approve export.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- One primary CTA per page state.
- Disabled actions explain blocker.
- Guarded buttons call permission/precondition logic.
- CTA copy does not overclaim downstream gate.

### Required tests/proof
- True-UX CTA state tests.
- Permission-action negative tests for disabled/denied actions.

### Stop rules
- Multiple primary CTAs remain on critical route.
- Button is enabled without service/precondition check.
- Generic “Continue” used for safety-critical action.

---

## WP-05 — Evidence Intake Workbench UI + Upload Truth

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-002/MJ-001` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Turn documents/upload/evidence pages into an evidence workbench. Upload is candidate evidence only, never sufficiency or release.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof. It uses the evidence/audit/export contract and interaction audit: upload is the strongest implemented interaction, but it is upload-only until review, link, relevance and sufficiency are proven.

### Likely target files/modules to inspect
- `components/client-intake-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ui/evidence-list.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/guarded-action-button.tsx`
- `app/api/documents/route.ts`
- `app/api/documents/upload/route.ts`
- `lib/document-upload-service.ts`
- `lib/evidence-service.ts`
- `lib/evidence-review-service.ts`

### Implementation steps
1. Verify current upload and document listing behaviour.
2. Add evidence status model usage in UI: uploaded, extraction_pending, review_pending, insufficient, rejected, sufficient, linked.
3. Update upload success copy to “upload complete, review required”.
4. Show evidence blocker and next action on documents/evidence pages.
5. Show link/relevance/scope indicators for recommendation/compliance/decision relationships.
6. Ensure evidence rows are sourced from service/API state, not static labels.
7. Add upload failed/retry and unsupported file type feedback.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.
- Make uploaded/review_pending/insufficient/sufficient visually distinct without implying release.
- Show evidence link/relevance/scope before sufficiency.

### Acceptance criteria
- Upload success does not unlock release, client visibility or export.
- Evidence cannot be sufficient without review/link/relevance/scope.
- Evidence workbench shows pending/insufficient/sufficient states truthfully.
- Wrong-role evidence action is denied.

### Required tests/proof
- document upload API/flow tests.
- Evidence review tests if present; add negative upload-alone-no-release.
- UI state tests for upload-only success and evidence pending.

### Stop rules
- Upload-to-release shortcut.
- Client can see raw/unreleased evidence.
- Evidence status chip not backed by state.

---

## WP-06 — Evidence Review + Sufficiency Lifecycle

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-002` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Implement review/link/sufficiency workflow after upload. This is the transition from document to usable evidence.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof. It uses the evidence/audit/export contract and interaction audit: upload is the strongest implemented interaction, but it is upload-only until review, link, relevance and sufficiency are proven.

### Likely target files/modules to inspect
- `app/api/documents/review/route.ts`
- `lib/evidence-review-service.ts`
- `lib/evidence-service.ts`
- `lib/workflow-gate.ts`
- `lib/audit-service.ts`
- `prisma/schema.prisma`
- `tests/evidence-review-api.spec.ts`
- `tests/workflow-gate.spec.ts`

### Implementation steps
1. Verify existing review endpoint/service.
2. Implement or harden review actions: mark needs_review, insufficient, rejected, sufficient.
3. Require object link and relevance for sufficiency.
4. Require actor permission and tenant/object scope.
5. Write audit events for evidence accepted/rejected/insufficient/request more evidence.
6. Expose safe UI state to documents/evidence/compliance screens.
7. Keep schema usage aligned to existing models; no blind new model.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.
- Make uploaded/review_pending/insufficient/sufficient visually distinct without implying release.
- Show evidence link/relevance/scope before sufficiency.

### Acceptance criteria
- Evidence sufficiency requires review, link, relevance and actor authority.
- Missing/wrong-scope evidence blocks compliance release.
- Audit exists for evidence sufficiency decision.
- UI indicates needs more evidence when blocked.

### Required tests/proof
- Evidence review API positive/negative tests.
- Workflow gate negative: unreviewed evidence cannot release.
- Audit persistence test for evidence decision.

### Stop rules
- Sufficiency set by admin bypass.
- Sufficiency without link/relevance.
- Migration needed but not documented.

---

## WP-07 — Analyst Workbench + AI Draft Internal-only Review

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-003/MJ-001` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Make analyst review a real human checkpoint. AI/rules draft is internal support only and must never leak to client/export.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof.

### Likely target files/modules to inspect
- `components/internal-workflow-screen.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/evidence-list.tsx`
- `app/api/demo-workflow/route.ts`
- `lib/demo-workflow-mutation.ts`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `lib/export-service.ts`
- `tests/workflow-gate.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`

### Implementation steps
1. Show internal draft clearly labelled as internal-only.
2. Add unsupported claim state and evidence-needed state.
3. Add analyst actions: reject draft, request evidence, rebuild/mark ready for advisor where existing services support.
4. Keep analyst notes/rationale internal-only in UI/API/export.
5. Add clear next step after analyst review: send to advisor or request evidence.
6. Refactor workbench layout: queue summary first, selected trigger/detail second, secondary evidence/audit context in tabs/drawer.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- AI draft is never visible in client portal/mobile/export.
- Unsupported claim cannot proceed without evidence/rebuild.
- Analyst review does not become advisor approval.
- Workbench has one primary next action.

### Required tests/proof
- Negative tests: AI draft not in client/API/export.
- Workflow tests for unsupported claim block.
- True-UX tests for internal-only labels and next action.

### Stop rules
- Client-visible AI Draft.
- Analyst action releases or advisor-approves.
- Internal notes leak via table/detail/export.

---

## WP-08 — Advisor Queue + Approval Detail UX

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-001/MJ-003` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Advisor approval must be a distinct human gate that does not release to client. The UI must make that impossible to misunderstand.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof. It uses the workflow and feedback contracts: advisor approval and compliance release are distinct human gates, and UI copy must not collapse them.

### Likely target files/modules to inspect
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ui/audit-timeline.tsx`
- `app/api/demo-workflow/route.ts`
- `lib/workflow-gate.ts`
- `lib/audit-service.ts`
- `tests/workflow-gate.spec.ts`
- `tests/p0-acceptance.spec.ts`

### Implementation steps
1. Refactor advisor queue to show readiness, evidence state and blockers.
2. Advisor detail shows recommendation summary, evidence summary, analyst review note, risks, and next action.
3. Implement approve/reject/request changes lifecycle with loading/error/success states.
4. After advisor approval, set/display compliance_pending, not released.
5. Write audit for advisor approve/reject.
6. UI copy: “Advisor approved. Waiting for compliance release.”

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- Advisor approval cannot create client visibility.
- Advisor approval requires sufficient evidence or allowed exception state as specified.
- Advisor queue/detail has clear blocker and one primary CTA.
- Audit written for approval/rejection.

### Required tests/proof
- Positive advisor approval to compliance pending.
- Negative: advisor approval does not release.
- UI test for no “released” copy after advisor approval.

### Stop rules
- Approval mutates release/clientVisible.
- Generic approve label without gate context.
- Missing audit on approval.

---

## WP-09 — Compliance Decision Room / Release / Block / Request Evidence

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-001/MJ-002` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Build the visible release gate. Compliance is the only V0.96 release authority and must block/request evidence/release with audit and confirmation.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof. It uses the evidence/audit/export contract and interaction audit: upload is the strongest implemented interaction, but it is upload-only until review, link, relevance and sufficiency are proven. It uses the workflow and feedback contracts: advisor approval and compliance release are distinct human gates, and UI copy must not collapse them.

### Likely target files/modules to inspect
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ui/modal.tsx`
- `components/ui/state-panel.tsx`
- `app/api/demo-workflow/route.ts`
- `lib/workflow-gate.ts`
- `lib/audit-service.ts`
- `lib/visibility-engine.ts`
- `tests/confirmation-lifecycle.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/p0-acceptance.spec.ts`

### Implementation steps
1. Turn compliance detail into a decision-room layout: case summary, evidence sufficiency, advisor approval, blocker, primary decision.
2. Implement release confirmation modal lifecycle: open, validate, submit, loading, success, failure, close/cancel.
3. Implement block/request evidence modal lifecycle with reason and requested evidence.
4. Disable release when advisor approval, evidence sufficiency, actor permission or audit precondition is missing.
5. On release, write audit and create/update released client-safe projection.
6. On block/request evidence, write audit and show recovery state.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.
- Make uploaded/review_pending/insufficient/sufficient visually distinct without implying release.
- Show evidence link/relevance/scope before sufficiency.
- High-impact confirmations require explicit consequence, loading and recoverable failure states.
- Keyboard/focus/escape handling should be added where feasible without broad primitive breakage.

### Acceptance criteria
- Compliance release only after advisor approval, sufficient evidence, permission and audit.
- Compliance can block/request evidence with reason.
- Client visibility remains hidden before release.
- UI clearly distinguishes blocked, pending and released.

### Required tests/proof
- Positive: release after all preconditions.
- Negative: missing evidence/advisor/audit/wrong role/admin cannot release.
- Confirmation lifecycle tests.

### Stop rules
- Admin bypass release.
- Release succeeds without audit.
- Release modal closes as success without mutation proof.

---

## WP-10 — Decision Record + Traceability UI

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-001/MJ-002/MJ-005` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Create the governance record tying recommendation, evidence, advisor approval, compliance release, audit and client-safe summary together.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof.

### Likely target files/modules to inspect
- `components/decisions-governance-screen.tsx`
- `components/ui/audit-timeline.tsx`
- `components/ui/evidence-list.tsx`
- `lib/decision-service.ts`
- `lib/evidence-service.ts`
- `lib/audit-service.ts`
- `lib/visibility-engine.ts`
- `prisma/schema.prisma`
- `tests/p0-acceptance.spec.ts`

### Implementation steps
1. Verify existing decision models/services.
2. Expose decision record fields: recommendation ref, evidence refs, advisor approval ref, compliance release ref, visibility status, release actor/timestamp, audit refs.
3. Refactor decision detail into summary-first decision room: outcome, evidence, approval/release chain, audit.
4. Ensure client-safe summary is separate from internal rationale.
5. Avoid creating new schema if existing Decision/Recommendation/ComplianceReview/EvidenceRecord supports mapping.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- Decision record makes release traceable.
- Client-safe summary is separate from internal notes.
- Decision detail does not expose forbidden payload to client role.
- Evidence/audit links are present internally.

### Required tests/proof
- Positive end-to-end decision record assertion.
- Negative client role cannot see internal decision fields.

### Stop rules
- Decision record becomes raw internal dump.
- Schema replacement attempted.
- Traceability fields simulated without service/source.

---

## WP-11 — Client-Safe Projection / Portal / Mobile Fail-Closed UX

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-001/MJ-002/MJ-006` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Client portal/mobile must show only released, redacted, client-safe content. Before release, show calm fail-closed state.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof. It uses the RBAC/client visibility contract: client payloads must be released, redacted and client-safe; fail closed on uncertainty.

### Likely target files/modules to inspect
- `components/client-intake-screen.tsx`
- `components/demo-session-panel.tsx`
- `lib/visibility-engine.ts`
- `lib/client-safe-projection-service.ts`
- `app/api/dashboard-metrics/route.ts`
- `app/api/profile/route.ts`
- `tests/true-ux-client-projection.spec.ts`
- `tests/client-visibility.spec.ts`

### Implementation steps
1. Verify visibility engine/projection service.
2. Create/confirm client-safe projection structure for released decision summary and safe evidence summary.
3. Bind portal/mobile to projection, not internal workbench data.
4. Before release, show “No released content available yet” / pending state.
5. Redact/hide AI Draft, internal rationale, analyst notes, compliance notes, unreleased recommendation/evidence and internal audit.
6. Use calm executive density; remove internal operational clutter.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.
- Use calm client density and avoid internal operational panels.
- Display no released content state before compliance release.

### Acceptance criteria
- Client sees safe released summary only after compliance release.
- Client sees no internal content before release.
- Portal/mobile have clear empty/pending state.
- Client UI remains calm and role-appropriate.

### Required tests/proof
- Positive: released client-safe projection visible.
- Negative: forbidden terms/content absent before and after release.
- Cross-tenant client cannot see other tenant.

### Stop rules
- Client-visible AI Draft or notes.
- Portal uses internal state source.
- Fail-open behaviour on error.

---

## WP-12 — Audit Persistence + Audit Surface UX

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-001/MJ-002/MJ-005/MJ-006/MJ-010` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Audit must be real and visible internally. Audit timeline visibility is not persistence proof; critical actions must write events and fail closed if audit fails.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof.

### Likely target files/modules to inspect
- `components/ui/audit-timeline.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/admin-tenant-setup-screen.tsx`
- `app/api/audit-events/route.ts`
- `lib/audit-service.ts`
- `tests/audit-fail-closed.spec.ts`
- `tests/permission-engine.spec.ts`

### Implementation steps
1. Verify audit service and audit API.
2. List critical actions: upload, evidence review, advisor approve/reject, compliance block/request/release, client visibility projection, role/access change, export preview/approval/download, denied bypass.
3. Ensure each critical action writes actor, role, tenant, target, previous state, next state, result, reason/context, correlation id.
4. Add audit unavailable/fail-closed state for critical action failures.
5. Refactor audit UI to show real audit rows, not static timeline.
6. Hide internal audit detail from client projection.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- Critical actions have persisted audit events.
- Audit failure blocks safety-critical action.
- Internal audit timeline is sourced from persisted events.
- Client does not see internal audit details.

### Required tests/proof
- Audit positive per gate.
- Negative audit failure blocks release/export/permission change.
- Denied admin/cross-tenant attempts write audit.

### Stop rules
- Action succeeds when audit fails.
- Static audit rows used as proof.
- Audit event lacks actor/target/result.

---

## WP-13 — Governance / Admin Non-Bypass UX and Permissions

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `MJ-006/MJ-010` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Admin UI must support governance without implying superuser bypass. Role changes, access requests and policies cannot force release, evidence sufficiency, export approval or visibility.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof.

### Likely target files/modules to inspect
- `components/admin-tenant-setup-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ui/guarded-action-button.tsx`
- `app/api/admin-tenants/route.ts`
- `app/api/auth/dummy/route.ts`
- `lib/permission-engine.ts`
- `lib/audit-service.ts`
- `tests/governance-non-bypass.spec.ts`
- `tests/permission-engine.spec.ts`

### Implementation steps
1. Verify providerless mapped user/tenant/role context.
2. Refactor admin/governance pages to show allowed configuration actions and denied safety-gate actions.
3. Implement second confirmation/confirmation phrase where high-impact governance changes exist.
4. Ensure admin role change does not grant release/evidence/export bypass.
5. Show denied/admin non-bypass feedback clearly.
6. Audit access request/role changes and denied bypass attempts.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.
- High-impact confirmations require explicit consequence, loading and recoverable failure states.
- Keyboard/focus/escape handling should be added where feasible without broad primitive breakage.

### Acceptance criteria
- Admin can manage governance but cannot release advice, mark evidence sufficient, force visibility or export without gates.
- Wrong tenant/object admin access denied.
- UI communicates governance scope and safety boundaries.

### Required tests/proof
- Negative admin cannot release, mark sufficient, force export or visibility.
- Cross-tenant denial tests.
- Role/action/payload separation tests.

### Stop rules
- Admin superuser path.
- Manual visibility override.
- Role change silently expands payload visibility.

---

## WP-14 — Export Scope / Redaction / Approval / Manifest UX

| Field | Value |
|---|---|
| Priority | `P0 late-stage` |
| Journey mapping | `MJ-005` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Export is the trust output after client-safe release. It must stage scope, redaction, preview, approval and manifest/download without forbidden payload.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof. It uses the export safety contract: scope, redaction, preview, approval and download/share are separate states; forbidden payload exclusion is mandatory.

### Likely target files/modules to inspect
- `components/communication-export-ops-screen.tsx`
- `components/ui/modal.tsx`
- `components/ui/data-table.tsx`
- `app/api/export-workflow/route.ts`
- `lib/export-service.ts`
- `lib/export-package-service.ts`
- `lib/visibility-engine.ts`
- `lib/audit-service.ts`
- `tests/export-safety.spec.ts`
- `tests/file-export-realism.spec.ts`

### Implementation steps
1. Verify export API/service and existing file-export tests.
2. Implement staged UI: scope selection → redaction review → preview → approval → manifest/download.
3. Block preview/approval/download until required preconditions pass.
4. Show forbidden payload detection/blocker: AI Draft, internal rationale, analyst notes, compliance notes, unreleased recommendation/evidence.
5. Separate preview copy from approval and download/share copy.
6. Write audit for export preview/approval/download/share where applicable.
7. Keep metadata-only/manifest proof if binary export is not in V0.96.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.
- Show scope/redaction/preview/approval/download as staged steps.
- Show forbidden payload blocker when export contains internal-only content.

### Acceptance criteria
- Export contains only scoped, released, redacted, approved content.
- Preview is not approval; approval is not download; download is not client acceptance.
- Forbidden payload exclusion is tested.
- Export actions are audited.

### Required tests/proof
- Positive redacted manifest.
- Negative: export without redaction/approval blocked; forbidden payload excluded.
- Audit test for export action.

### Stop rules
- Raw internal dump export.
- Binary export scope creep.
- Export approval bypassed by admin.

---

## WP-15 — Shared Modal / Drawer / Form / Table Lifecycle Refactor

| Field | Value |
|---|---|
| Priority | `P0 shared` |
| Journey mapping | `All touched V0.96 surfaces` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Turn visual overlays and primitives into real lifecycle components where touched. Forms/tables must not pretend to support behaviour they lack.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof.

### Likely target files/modules to inspect
- `components/ui/modal.tsx`
- `components/ui/drawer.tsx`
- `components/ui/data-table.tsx`
- `components/ui/filter-bar.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/kanban.tsx`
- `components/ui/evidence-list.tsx`
- `components/ui/audit-timeline.tsx`
- `components/ui/a11y-status.tsx`
- `components/ui/guarded-action-button.tsx`

### Implementation steps
1. For modal/drawer: implement/verify open, close, cancel, submit, loading, validation error, success, failure, permission denied.
2. Add Escape/backdrop/focus handling where feasible and not risky.
3. For forms: add validation and preserve input on safe recoverable errors.
4. For tables: distinguish visual search/filter/sort controls from implemented behaviour; implement only V0.96-needed controls or disable/defer with copy.
5. For status components: ensure source state is passed from service/gate, not hardcoded.
6. For high-impact actions: second confirmation or explicit confirmation state.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.
- High-impact confirmations require explicit consequence, loading and recoverable failure states.
- Keyboard/focus/escape handling should be added where feasible without broad primitive breakage.

### Acceptance criteria
- Touched overlays have complete lifecycle.
- Forms show validation/loading/error/success states.
- Tables do not show fake sort/filter/search.
- A11y status announces important changes.

### Required tests/proof
- Interaction lifecycle specs.
- Confirmation lifecycle specs.
- A11y/modal tests.
- Table control tests for implemented/deferred behaviour.

### Stop rules
- Generic primitive refactor breaks all routes.
- Fake filter/sort stays visible.
- Modal confirms without validation.

---

## WP-16 — No-Overclaim Microcopy + Domain Terminology Harmonization

| Field | Value |
|---|---|
| Priority | `P0 cross-cutting` |
| Journey mapping | `All touched V0.96 surfaces` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Clean up labels and feedback so the UI never claims a downstream gate is complete. Reduce ambiguous terms and generic CTA labels.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof.

### Likely target files/modules to inspect
- `components/**/*.tsx`
- `lib/ux-copy.ts`
- `lib/ux-page-contract.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `tests/content-microcopy.spec.ts`

### Implementation steps
1. Build a small V0.96 terminology map: upload, evidence review, evidence sufficient, analyst reviewed, advisor approved, compliance released, client-visible, export preview, export approved.
2. Replace ambiguous CTAs like Continue/Review/Approve where safety context is needed.
3. Add no-overclaim copy: Upload complete → review required; Advisor approved → waiting for compliance; Export preview → approval required.
4. Keep internal-only labels visible internally for AI draft/rationale/notes.
5. Ensure client copy is calm and does not expose internal workflow mechanics.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- No touched success text implies downstream gate.
- Safety-critical actions have context-specific labels.
- Ambiguous duplicate labels reduced on touched routes.
- Client-facing copy contains no internal-only language.

### Required tests/proof
- Content/microcopy semantic tests if present.
- Negative tests assert forbidden phrases absent in client/export.

### Stop rules
- Copy says “released” before compliance release.
- Copy says evidence complete after upload only.
- Generic “Approve” used for advisor/compliance/export without context.

---

## WP-17 — API / Service Integration for UI Truth

| Field | Value |
|---|---|
| Priority | `P0` |
| Journey mapping | `All core journeys` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
UI state must come from services, APIs and gates. Do not leave static chips or demo-only actions where V0.96 requires proof.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof.

### Likely target files/modules to inspect
- `app/api/demo-workflow/route.ts`
- `app/api/documents/route.ts`
- `app/api/documents/upload/route.ts`
- `app/api/documents/review/route.ts`
- `app/api/audit-events/route.ts`
- `app/api/export-workflow/route.ts`
- `lib/*service.ts`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `lib/permission-engine.ts`

### Implementation steps
1. Verify existing API route contracts and use them before adding new endpoints.
2. Add safe error envelope to touched APIs where missing.
3. Ensure actor context, tenant scope, role/action/object checks and payload filtering for UI-facing responses.
4. Make API errors fail closed and avoid state advancement.
5. Ensure UI chips/buttons use response/gate state rather than static demo metadata.
6. Do not expand review-monitoring/communication into V0.96 unless already safely integrated and needed.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- Touched APIs validate request and actor context.
- Errors do not leak internal data or advance workflow.
- UI reflects actual service state.
- No new API created without WP-00 justification.

### Required tests/proof
- API contract tests.
- Fail-closed error tests.
- Payload redaction tests.

### Stop rules
- New API sprawl.
- API returns internal fields to client.
- UI remains hardcoded after supposed service integration.

---

## WP-18 — Schema Usage Alignment for Journey and UI State

| Field | Value |
|---|---|
| Priority | `P0 support` |
| Journey mapping | `All core journeys` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Align usage to existing full-workflow Prisma schema. The task is field usage and status mapping, not schema replacement.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof.

### Likely target files/modules to inspect
- `prisma/schema.prisma`
- `lib/*service.ts`
- `app/api/**/route.ts`
- `tests/**/*.spec.ts`
- `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`

### Implementation steps
1. Map V0.96 state fields to existing models: Document, EvidenceRecord, Recommendation, Approval, ComplianceReview, Decision, AuditEvent, ExportRequest, UserRole, Permission.
2. Confirm status enums/strings used consistently in UI/API/services.
3. If a required field is missing, document migration decision with reason and alternatives.
4. Do not create patch-only models such as AiDraft or ClientVisibilityEvaluation unless existing schema cannot represent the locked requirement.
5. Keep AI draft internal-only as field/state/service projection if possible.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- Existing schema is preserved where sufficient.
- Status mapping supports UI truth and P0 tests.
- Any schema change is minimal, justified and covered by migration/test.

### Required tests/proof
- Schema validation.
- Service tests using fields.
- Regression tests for status transitions.

### Stop rules
- Blind patch schema replacement.
- Unjustified new model.
- UI state stored only as frontend constant.

---

## WP-19 — P0 + True-UX Acceptance Suite

| Field | Value |
|---|---|
| Priority | `P0 release blocker` |
| Journey mapping | `Full V0.96` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Prove the core journey and the UX/IA refactor. Existing tests are proof slices only; V0.96 needs positive journey and negative safety proof.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof.

### Likely target files/modules to inspect
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
1. Inventory existing tests and mark covered/partial/missing.
2. Add positive end-to-end: mapped user → evidence review/sufficiency → analyst review → advisor approval → compliance release → client-safe projection → audit → redacted export manifest.
3. Add negatives: cross-tenant denied, wrong role denied, admin cannot release, upload alone no release, advisor approval no release, AI draft no leak, notes no leak, audit failure blocks, export forbidden payload excluded.
4. Add True-UX tests: journey nav, page header job/next step, one primary CTA, density tier, client fail-closed projection, modal/drawer lifecycle, no-overclaim copy.
5. Keep tests semantic and deterministic; no pixel/image generation assertions.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- Positive V0.96 journey passes.
- All listed negative gates pass.
- True-UX assertions prove touched surfaces improved.
- Skipped tests are documented with reason.

### Required tests/proof
- Targeted P0 and true-UX suite.
- Typecheck/lint/build/db validate if available.
- Final proof matrix.

### Stop rules
- P0 negative hidden or skipped without reason.
- Brittle screenshot pixel assertions.
- Test relies on external service.

---

## WP-20 — Release Proof / Handoff Update

| Field | Value |
|---|---|
| Priority | `P0 closure` |
| Journey mapping | `Release closure` |
| Codex mode | `START_WITH_REBASE_OR_CLASSIFY`; before editing, mark this WP as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED` in the delta register. |

### Goal
Close the release with evidence: changed files, tests, no-generation proof, remaining blockers and next release recommendation.

### KB context Codex must carry
This task inherits the AlphaVest rules: full-workflow only, main as false-gap, visual presence is not behaviour proof, route access is not action permission, action permission is not payload visibility, client visibility is derived and fail-closed, AI draft is internal-only, upload is not sufficiency, advisor approval is not compliance release, and audit/export claims require proof.

### Likely target files/modules to inspect
- `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md`
- `FINAL_CODEX_TASK_MASTER.md`
- `docs/**`
- `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_RELEASE_PROOF.md`

### Implementation steps
1. Create release proof markdown with completed WPs, changed files, tests run, tests passed/failed/skipped and known blockers.
2. Document route/API/schema/test deltas from WP-00 to final state.
3. Document UI/UX/IA changes: nav grouping, page headers, density, CTAs, long page refactors, client fail-closed states, no-overclaim copy.
4. Confirm no image/screen/state-screen generation.
5. List deferred P1/reference/hold items without elevating them.
6. Update handoff/status docs only if repo convention allows and claims are verified.

### UI / UX / Layout / IA refactor requirements
- Preserve existing visual design language; refactor structure/state/copy, not brand.
- Keep one primary CTA for the current state and demote secondary actions.
- Make the page job, current gate, blocker and next step visible without long searching.
- Use progressive disclosure for secondary evidence, audit, metadata and admin context.
- Do not hide safety blockers in collapsed content unless the collapsed header names the blocker.
- Use honest microcopy that names only the gate/action actually completed.

### Acceptance criteria
- Reviewer can verify release from proof.
- No hidden scope expansion.
- Failed/partial tests are transparent.
- Next release scope is clearly separated.

### Required tests/proof
- Final route smoke.
- Final targeted P0/UX tests.
- Proof report attached.

### Stop rules
- Report claims unverified production readiness.
- Hold routes recommended for implementation without decision.
- Failed P0 marked pass.

---

## 6. Cross-WP UX/IA refactor checklist

Codex must apply this checklist whenever a touched V0.96 file renders UI.

| Check | Required decision |
|---|---|
| Route placement | Is this route core V0.96, support, P1, reference or hold? |
| Page type | Is the page a hub, workbench, detail, decision room, client projection, governance page, export step or reference page? |
| Header | Does the header state page job, gate, blocker and next step? |
| Primary CTA | Is there exactly one primary CTA for this state? |
| State source | Is the shown status backed by service/API/gate state? |
| Permission | Does route/action/object/payload permission apply separately? |
| Client safety | Could a client role see internal-only labels, counts, drafts or notes? |
| Evidence safety | Does upload copy imply sufficiency? If yes, fix. |
| Advisor/release safety | Does advisor copy imply release? If yes, fix. |
| Export safety | Does preview copy imply approval/download/client acceptance? If yes, fix. |
| Layout | Is the page too long or too sparse? Refactor only if touched. |
| Guidance | Is guidance actionable or decorative? Collapse/remove/deprioritize decorative guidance. |
| Modal/drawer | Does the overlay have open/close/cancel/submit/loading/error/success lifecycle? |
| Table/filter | Are search/filter/sort controls implemented? If not, disable/defer honestly. |
| Accessibility | Are important state changes announced and modal focus handled where practical? |
| Tests | Is there a semantic test for the safety/UX claim? |

---

## 7. Required validation command plan

Codex must first inspect `package.json` and use actual scripts. Suggested commands, to be adapted to the repo:

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

If runtime is too high, run targeted suites and document skipped suites with reason. Never mark a P0 blocker as passed without proof.

---

## 8. Forbidden changes register

| Forbidden change | Reason |
|---|---|
| New design direction / broad visual redesign | V0.96 needs truthful journey UX, not a brand/design restart. |
| Image/screen/state-screen generation | Screen generation is not authorized. |
| Full 71-route production UX | V0.96 is core journey, not every route. |
| Hold-route implementation | Committee/KYC/SoW/Suitability/IPS/Rebalance remain outside this pack unless explicitly unlocked later. |
| Client-visible AI Draft | Violates advice boundary. |
| Upload-to-release shortcut | Violates evidence sufficiency. |
| Advisor approval as release | Violates workflow gate. |
| Admin as superuser bypass | Violates governance safety. |
| Manual client visibility override | Visibility must be derived and fail-closed. |
| Export without redaction/approval/audit | Violates export safety. |
| Broad new API layer | Reuse/harden existing APIs unless proven impossible. |
| Blind Prisma schema replacement | Full-workflow schema remains baseline. |
| `main` as target truth | `main` is false-gap only. |
| Decorative filler panels | Sparse pages need true next work/state/context, not visual padding. |
| Fake filters/search/sort | Table controls must either work or be honestly deferred/disabled. |

---

## 9. ENGINE Execution Proof

| Phase | Primary Engine | Secondary Engine | Output in this artefact |
|---|---|---|---|
| Source intake | ENGINE_v2 | ENGINE_v3 | Source hierarchy, current snapshot and KB evidence summary. |
| UX/IA synthesis | ENGINE_v3 | ENGINE_v2 | Journey-first IA, density, page job, one-CTA and no-overclaim rules. |
| Task decomposition | ENGINE_v2 | Codex-Spark-like execution | 21 atomic work packages with files, steps, tests and stop rules. |
| Contradiction control | ENGINE_v3 | ENGINE_v2 | Separates visual vs behaviour, upload vs sufficiency, advisor vs release, preview vs approval. |
| Safety acceptance | ENGINE_v2 | ENGINE_v3 | P0 positive/negative test obligations and fail-closed UX rules. |

---

## 10. Short Codex start instruction

```text
Implement ALPHAVEST V0.96 Core Journey + UX/IA Refactor from this task pack. Start with WP-00 and create the delta register before code edits. Use full-workflow only. Reuse existing UX helpers, services and tests where present. When touching a UI surface, also fix known UX/IA/Layout issues on that surface: journey-first navigation, page job/gate/next-step headers, one primary CTA, correct density, honest states, no-overclaim copy and fail-closed client visibility. Do not redesign, generate screens, promote hold routes, replace schema blindly or weaken P0 safety rules.
```
