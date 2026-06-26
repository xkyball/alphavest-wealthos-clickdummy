# ALPHAVEST_V0_96_WP10_EXPORT_SCOPE_REDACTION_APPROVAL_UX_DEEP_TASK_DESCRIPTION.md

**Generated:** 2026-06-23  
**Prompt executed:** Prompt 11 — WP-10 Deep Task Description  
**Work Package:** `WP-10 — Export Scope / Redaction / Approval UX`  
**Mode:** Deep Codex-ready task-description artefact only. No implementation. No code changes. No screen generation. No image generation. No Codex tickets created.  
**ENGINE mix:** ENGINE_v3 for KB/UX/IA discovery and contradiction control; ENGINE_v2 for operational tasking, gates, acceptance, tests and stop rules; Codex-Spark-like convergence for direct implementation instructions.

---

## 1. Executive Task Decision

**Decision:** `WP10_EXPORT_SCOPE_REDACTION_APPROVAL_UX_DEEP_TASK_READY_FOR_CODEX_DESCRIPTION_USE`

This artefact defines the detailed Codex-ready task description for **WP-10 — Export Scope / Redaction / Approval UX**.

The task is to make export the V0.96 late-stage **trust output** of the AlphaVest core journey:

> Only released, client-safe, scoped, redacted and approved content may become an export manifest/package. Export preview is not approval. Export approval is not download/share. Export download/share is not client acceptance.

This WP belongs to the V0.96 Core Journey + UX/IA Refactor release and primarily supports:

- `MJ-005` — Export package with forbidden internal payload redaction.
- `MJ-001` — New family office onboarding to first client-safe decision.
- `MJ-002` — Evidence missing to client upload to release.
- `MJ-003` — AI Draft rejected/rebuilt with evidence, while AI/rules draft remains internal-only.
- `MJ-006` / `MJ-010` — Cross-tenant and admin non-bypass protections for export actions.

The implementation posture is strict:

```text
Export is a client-safe projection, not a raw data dump.
Scope is not redaction.
Redaction is not preview.
Preview is not approval.
Approval is not download/share.
Download/share is not client acceptance.
Admin access is not export bypass.
```

This WP does **not** authorize a full production binary-export platform, external file-sharing infrastructure, new document package format, client-delivery automation, new visual assets, screen generation, P1/HOLD route elevation, blind Prisma replacement or broad redesign. Codex may harden existing export routes, export UI states, redaction/approval copy, API/service boundaries, audit references and tests inside the V0.96 journey path.

---

## 2. Source-of-Truth Lock

| Rank | Source | Trust Level | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current `full-workflow` repo / checkout | Highest code truth after WP-00 rebase | Target files, routes, components, APIs, services, schema and tests | Assuming older KB file/API/test counts remain current |
| 2 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | Binding Prompt-00 UX/IA intake | UI/UX/IA evidence register, WP mapping, route/component/surface mapping | Treating evidence register as implemented code |
| 3 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Binding WP source | WP-10 goal, target files, UI/UX implications, acceptance, tests, stop rules | Treating WP source as implementation proof |
| 4 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Binding export/evidence/audit safety contract | Export scope, redaction, approval, forbidden-payload and audit rules | Weakening export safety for UX convenience |
| 5 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Binding core safety contract | Client-safe-only payload, AI Draft internal-only, admin non-bypass, route/action/object/payload separation | Treating admin/advisor access as export payload permission |
| 6 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Binding no-overclaim feedback contract | Preview-not-approval, approval-not-download, no client-acceptance overclaim, safe error copy | Success copy that implies downstream gates |
| 7 | `DRAWER_MODAL_INTERACTION_CONTRACT.md` | Binding interaction contract | Export approval modal, confirmation, cancel/submit/loading/error lifecycle | Treating visible modals as behaviour proof |
| 8 | `STATE_SCREEN_SPEC.md` | Binding state contract | Export pending, redaction pending, permission denied, blocked, audit unavailable, validation failed states | Generating visual state-screen assets |
| 9 | `API_CONTRACT_MATRIX.md` | Binding API contract | Existing API hardening, validation, safe errors, no state advancement on failure | Creating API sprawl without proof |
| 10 | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | Binding schema contract | Full-workflow schema baseline; `ExportRequest`, `Decision`, `EvidenceRecord`, `Document`, `AuditEvent` mapping | Blind patch schema/model replacement |
| 11 | `P0_TEST_ACCEPTANCE_MATRIX.md` | Binding acceptance contract | Existing tests are proof slices; missing export leakage and bypass negatives are blockers | Claiming current tests fully close P0 export gate |
| 12 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md` / `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey/product control | `MJ-005` as MVP late-stage trust output | Pulling P1/HOLD journeys into export scope |
| 13 | `main` / `alphavest-wealthos-clickdummy-main.zip` | False-gap only | Historical warning | Any target implementation task or target gap |

**Hard lock:** `full-workflow` is target reality. `main` remains false-gap only. Markdown artefacts are control and safety evidence, not code truth. Codex must re-check current code in WP-00 before applying this WP.

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | Task Implication | Must Refactor Now? |
|---|---|---|---|---|---|---|
| Export/redaction is MVP late-stage trust output, not a raw operational dump. | Mega Journey Priority Lock; MVP Journey Requirements Matrix | `MJ-005`, routes 054–058, `WP-10` | Journey / product proof | Critical | Export must be staged after client-safe release and prove trust, not breadth. | Yes |
| Export preview is not approval; approval is not download/share; download/share is not client acceptance. | Evidence/Audit/Export Safety Contract; Feedback Contract | `/export/:id/preview`, `/export/:id/download` | Export gate semantics / microcopy | Critical | UI, API and tests must keep preview, approval and download/share as separate states/actions. | Yes |
| Export may include only released, redacted, approved and scoped client-safe content. | RBAC/Client Visibility/Advice Boundary Contract; Evidence/Audit/Export Safety Contract | Export service, visibility engine, client-safe projection | Client visibility / payload safety | Critical | Export payload must be built from client-safe projection; not internal workflow objects. | Yes |
| Forbidden internal payload must never enter export: AI Draft, internal rationale, analyst notes, compliance notes, unreleased recommendation, unreleased evidence, hidden fields. | Evidence/Audit/Export Contract; P0 Matrix | Export manifest/package, `WP-10` | P0 leakage risk | Critical | Add/require negative tests asserting forbidden payload absence. | Yes |
| Export cannot proceed without deliberate scope, redaction, approval and audit. | Evidence/Audit/Export Contract | Routes 054–058; `ExportRequest` | Gate/precondition | Critical | Add blockers and disabled states for missing scope, missing redaction, missing approval, audit unavailable/failure. | Yes |
| Admin cannot force export release, bypass redaction, suppress audit or expand export payload. | RBAC Contract; Governance/Admin Non-Bypass WP | Governance + export approval | Admin non-bypass | Critical | Export UI/API must require actor/action/object permission and reject admin bypass attempts. | Yes |
| Export pages `/export/:id/scope`, `/export/:id/redaction`, `/export/:id/preview` are long/complex and need staging. | Prompt-00 UX/IA Evidence Register; V0.96 UX/IA Refactor source | WP-10, routes 055–057 | Layout / long page | High | Split export flow into staged panels with progress, summary, blocker and one primary CTA per state. | Yes |
| Redaction detail can become too dense. | Prompt-00 UX/IA Evidence Register | `/export/:id/redaction`, `components/communication-export-ops-screen.tsx` | Density / detail overload | High | Use summary-first redaction status plus secondary detail drawer/tabs for dense field-level evidence. | Yes |
| Status chips and buttons are not gate proof. | Interaction Reality Audit; Feedback Contract | Export status chips/buttons | Visual-only proof | High | Export status chips must derive from service/API state; buttons must be disabled/denied until preconditions pass. | Yes |
| Visible export preview is not proof of redaction or approval. | Evidence/Audit/Export Contract | Export preview UI | Overclaim / visual proof | Critical | Preview UI must show redaction/approval/audit state and blockers, not imply readiness. | Yes |
| Audit display is not audit persistence. | Evidence/Audit/Export Contract; Audit WP | Export approval/download/share | Audit truth | High/Critical | Export actions must reference persisted audit events or fail closed. | Yes |
| Existing tests are proof slices only. | P0 Test Acceptance Matrix | `export-safety.spec.ts`, `file-export-realism.spec.ts`, `phase8-export-workflow-api.spec.ts`, `true-ux-p0-safety.spec.ts` | Test gap | High | Add/update positive and negative tests for staged export, forbidden payload, no bypass and no-overclaim copy. | Yes |
| Current snapshot has export-specific API and tests beyond older KB counts. | Prompt-00 Evidence Register / current snapshot | `app/api/export-workflow/route.ts`, 51 specs | Moving baseline | High | Codex must inspect current reality before editing and avoid duplicating existing export hardening. | Yes |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must re-check the current `full-workflow` repo after WP-00. The following files and areas are likely relevant but must be classified before editing as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED`.

| Area | Files / Modules to Inspect | Required Classification |
|---|---|---|
| Export UI surfaces | `components/communication-export-ops-screen.tsx` | Determine whether Create/Scope/Redaction/Preview/Download states are static, partial or service-backed. |
| Shared UI primitives used by export | `components/ui/modal.tsx`, `components/ui/drawer.tsx`, `components/ui/state-panel.tsx`, `components/ui/data-table.tsx`, `components/ux-detail-standard-panel.tsx`, `components/ux-cta-cluster.tsx` | Confirm lifecycle, primary CTA, density, empty/error/blocked states. |
| Export API | `app/api/export-workflow/route.ts`; existing `deleted generic workflow route` export actions if still used | Confirm request/response contracts, actor checks, validation, safe errors, audit behavior. |
| Export services | `lib/export-service.ts`, `lib/export-package-service.ts`, `lib/file-metadata-service.ts`, `lib/visibility-engine.ts`, `lib/audit-service.ts`, `lib/permission-engine.ts` | Confirm redaction, projection, forbidden payload checks, approval, manifest/download state. |
| Client-safe projection dependencies | `lib/client-visibility` / `visibility-engine.ts`, decision/evidence services | Confirm export reads released client-safe projection, not raw internal recommendation/evidence. |
| Route registry and page contracts | `lib/route-registry.ts`, `lib/navigation.ts`, `lib/ux-page-contract.ts`, `lib/ux-route-policy.ts` | Confirm export routes 054–058 remain V0.96 and no P1/HOLD elevation occurs. |
| Schema | `prisma/schema.prisma` (`ExportRequest`, `Document`, `Decision`, `EvidenceRecord`, `AuditEvent`, visibility/status fields) | Confirm existing fields are sufficient before any migration proposal. |
| Tests | `tests/export-safety.spec.ts`, `tests/file-export-realism.spec.ts`, `tests/phase8-export-workflow-api.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/p0-acceptance.spec.ts`, route smoke | Confirm existing proof slices and missing negative/true-UX assertions. |
| Existing artefact screenshots/proofs | `artifacts/mvp-first-build-phase7-export/*`, `artifacts/mvp-phase-8/*`, `artifacts/scf-p07-p09/*` if present | Treat as proof artefacts only, not implementation authority or generation permission. |

---

## 5. WP Problem Statement

The export flow is a high-trust, high-risk late-stage V0.96 surface. It is the first place where AlphaVest attempts to package client-safe material outside the internal workflow context. If export is treated as a normal download button, it can silently violate the core product promise.

Current risks to eliminate:

- Export pages may appear as a simple linear UI while missing true precondition enforcement.
- Preview may be visually interpreted as approval.
- Approval may be visually interpreted as download/share authorization.
- Download/share success may be misread as client acceptance.
- Export package may accidentally include AI Draft, internal rationale, compliance notes, analyst comments, unreleased evidence, hidden payload fields or raw internal decision data.
- Redaction may be displayed as a status chip without proving redaction rules.
- Export approval may run without actor/action/object permission.
- Export audit may be shown visually without persisted audit proof.
- Long export pages may overwhelm users with scope/redaction detail rather than guiding a controlled staged workflow.

WP-10 must make export honest, staged, blocked-by-default when unsafe, and demonstrably client-safe.

---

## 6. V0.96 Journey Role

| Journey | WP-10 Role |
|---|---|
| `MJ-005 — Export package with forbidden internal payload redaction` | Primary journey. Export is the trust output after release and client-safe projection. |
| `MJ-001 — First client-safe decision` | Export can only package material from released decision/client-safe projection. |
| `MJ-002 — Evidence missing to upload to release` | Export may include only safe summaries of reviewed/accepted evidence where allowed. |
| `MJ-003 — AI Draft rejected/rebuilt with evidence` | AI Draft/internal rationale must be excluded from export. |
| `MJ-006 — Cross-tenant access denied` | Export must be tenant/object scoped and fail closed for wrong scope. |
| `MJ-010 — Admin role change cannot bypass compliance release` | Admin/export actor cannot bypass redaction, approval, visibility or audit gates. |

**V0.96 release role:** late-stage, but in scope. Export should be implemented/hardened only after Evidence, Advisor, Compliance, Client-Safe Projection, Governance and Audit rules are available enough to support it.

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | Export-Specific Manifestation | Required Refactor |
|---|---|---|
| Route-catalog navigation | Export pages are separate routes that may feel disconnected from the journey. | Export page headers and navigation labels must position export as post-release trust output. |
| Long pages / scroll depth | Scope, redaction and preview pages can become dense and hard to act on. | Use staged panels: summary + blocker + primary action + secondary detail. Dense redaction detail goes to drawer/tabs. |
| Empty/unused space | Export pages may show little context before package exists. | Use meaningful empty states: no released decision, no approved export, scope incomplete, redaction not run. |
| Weak page job | Users may not know whether they are selecting scope, reviewing redaction, previewing, approving or downloading. | Page header must state page job, current export gate, blocker and next step. |
| Too many CTAs | Scope/redaction/preview/download screens may show equal actions. | One primary CTA per state; dangerous or later-gate actions disabled/secondary. |
| Visual-only state | Status chips can imply export is safe. | Chips must be backed by export service/API state and tests. |
| Preview/approval/download confusion | Preview might look like a complete export. | Explicit state/copy separation in UI and feedback. |
| No-overclaim feedback | “Export ready” can imply approval/client acceptance. | Copy must say exact completed action: “Preview generated”, “Approval required”, “Manifest available”. |
| Modal lifecycle | Export approval confirmation can close without real submit/failure states. | Approval modal must validate, submit, load, error, success and preserve state on cancel/failure. |
| Client-safe boundary | Export may show raw internal material in preview. | Preview must render redacted/client-safe projection only and show blocked-forbidden-payload state. |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### 8.1 Changes now

| Change Area | Included in WP-10 |
|---|---|
| Export journey staging | Create/Scope → Redaction → Preview → Approval → Manifest/Download state model in UI/API/service/tests. |
| Export page headers | Page job, current gate, blocker and next action for routes 054–058. |
| Export density/layout | Summary-first staged panels, secondary redaction detail in drawer/tabs, no endless raw list sprawl. |
| Export CTA model | One primary CTA per export state; disabled/denied/blocked for unsafe next gates. |
| Export no-overclaim copy | Preview-not-approval, approval-not-download/share, download-not-client-acceptance. |
| Forbidden payload exclusion | AI Draft, internal rationale, analyst notes, compliance notes, unreleased evidence/recommendations and hidden fields are blocked from package/manifest. |
| Client-safe projection source | Export service/API reads released/redacted client-safe projection, not raw internal data. |
| Export audit | Preview/approval/download/share actions require appropriate audit references or fail closed where required. |
| Tests | Positive staged export tests and negative leakage/bypass/no-overclaim tests. |

### 8.2 Stays out

| Excluded Area | Reason |
|---|---|
| Full production binary export and file sharing infrastructure | Not authorized by V0.96 unless already present and scoped; metadata/manifest proof is sufficient where current services support it. |
| External client delivery workflow | V0.96 can prove package safety without automating external delivery. |
| New visual assets or screen generation | Explicitly prohibited by screen generation brief and prompt suite. |
| Committee/KYC/Suitability/IPS export scope | HOLD/P2 routes must not be elevated. |
| Blind Prisma/schema replacement | Full-workflow schema remains baseline; migrations only under separate proven decision protocol. |
| Broad redesign of export screens | Refactor layout/IA only where export surfaces are touched. |
| Manual client visibility override | Forbidden by MVP/safety contracts. |

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| `WP10-T01-EXPORT-REALITY-REBASE` | Classify current export implementation before editing. | Current snapshot includes export API, services, tests and screenshots/proof artefacts beyond older KB counts. | `communication-export-ops-screen.tsx`, `app/api/export-workflow/route.ts`, `lib/export-service.ts`, `lib/export-package-service.ts`, `tests/export-safety.spec.ts`, `tests/file-export-realism.spec.ts`, `tests/phase8-export-workflow-api.spec.ts` | Inventory existing flow states, API actions, service functions, schema fields and tests. Mark each export feature `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `BLOCKED`. | Export delta is recorded and prevents duplicate builds. | Run/read export tests list; do not edit before classification. | Yes, audit-only; maps pages to UX problems. | Stop if repo state contradicts task assumptions or export API/service is absent without rebase note. |
| `WP10-T02-EXPORT-STAGE-MODEL` | Define/export the staged export state model. | Export must be explicit: create/scope/redaction/preview/approval/manifest-download. | `lib/export-service.ts`, `lib/export-package-service.ts`, `schema.prisma`, `communication-export-ops-screen.tsx` | Create or normalize state helpers for `scope_incomplete`, `scope_selected`, `redaction_pending`, `redaction_failed`, `preview_ready`, `approval_required`, `approved`, `manifest_ready`, `download_ready`, `blocked_forbidden_payload`, `audit_unavailable`. | UI and API use same state vocabulary. | Unit/API tests assert state transitions. | Yes: page state drives header/CTA/copy. | Stop if a single `ready` boolean hides separate gates. |
| `WP10-T03-EXPORT-PAGE-HEADER-GATE-COPY` | Add page job/current gate/blocker/next step to export routes. | Export pages can feel like separate route catalogue pages. | `page-header.tsx`, `communication-export-ops-screen.tsx`, `lib/ux-page-contract.ts`, `lib/navigation.ts` | For routes 054–058, define page job and current gate. Show blocker and next action from export state. De-emphasize P1/HOLD contexts. | User can identify where they are in export flow and why next action is enabled/blocked. | True-UX/page header assertions. | Yes: IA/page header refactor. | Stop if header says “Export ready” before approval/download gates. |
| `WP10-T04-SCOPE-SELECTION-UX` | Harden export scope selection. | Scope must be deliberate and cannot exceed permission or released client-safe projection. | `communication-export-ops-screen.tsx`, `export-service.ts`, `permission-engine.ts`, `visibility-engine.ts`, `ExportRequest.scopeJson` | Display eligible released decisions/evidence summaries only. Validate tenant/object/action scope. Show no-eligible-content empty state. Disable redaction until valid scope exists. | Export cannot proceed without valid scope; wrong tenant/object scope denied. | Export API and P0 negative scope tests. | Yes: scoped table/list + one primary CTA. | Stop if scope UI includes raw/unreleased/internal objects. |
| `WP10-T05-REDACTION-RULES-AND-FORBIDDEN-PAYLOAD-BLOCKER` | Apply redaction and forbidden-payload checks before preview. | Export must exclude AI Draft/internal rationale/compliance notes/unreleased evidence. | `export-service.ts`, `export-package-service.ts`, `file-metadata-service.ts`, `visibility-engine.ts`, `RBAC/visibility helpers` | Build redaction check for forbidden field families. Produce blocker list for forbidden payload found. Redaction must run before preview/approval. | Forbidden payload blocks preview/approval/package. | Negative tests for each forbidden payload family. | Yes: redaction summary + detail drawer/tabs. | Stop if package contains forbidden payload or silently strips without evidence/copy. |
| `WP10-T06-REDACTION-PREVIEW-UX` | Make redaction preview understandable without implying approval. | `/export/:id/redaction` and `/preview` are long/complex. | `communication-export-ops-screen.tsx`, `ux-detail-standard-panel.tsx`, `drawer.tsx`, `state-panel.tsx` | Show redaction summary: included, excluded, redacted, blocked. Put field-level detail in secondary context. Add copy: “Preview is not approval.” | Preview explains redaction state and blockers, and approval remains separate. | True-UX density + export preview tests. | Yes: staged panels, progressive disclosure, no long sprawl. | Stop if preview button also approves or enables download. |
| `WP10-T07-EXPORT-APPROVAL-LIFECYCLE` | Harden export approval as explicit confirmation lifecycle. | Approval is a safety gate, not preview. | `modal.tsx`, `communication-export-ops-screen.tsx`, `export-workflow/route.ts`, `audit-service.ts` | Approval requires actor/action/object permission, scope, redaction, no forbidden payload and audit availability. Modal supports open/cancel/submit/loading/error/success. | Export cannot become approved without all preconditions and audit. | `phase8-export-workflow-api.spec.ts`, `confirmation-lifecycle.spec.ts`, export safety tests. | Yes: modal lifecycle and no-overclaim feedback. | Stop if modal closes and implies success without API/audit result. |
| `WP10-T08-MANIFEST-DOWNLOAD-SHARE-SEPARATION` | Separate approval from manifest/download/share. | Download/share should not imply client acceptance or external delivery. | `export-package-service.ts`, `file-metadata-service.ts`, `communication-export-ops-screen.tsx`, `export-workflow/route.ts` | After approval, generate/display manifest/package state only if supported. Keep download/share gated. Copy must say “Package available” not “client accepted”. | Download/share actions only available after approval and audit; no client acceptance claim. | File export realism + true-UX no-overclaim tests. | Yes: final-stage CTA/copy refactor. | Stop if download/share occurs before approval or expands payload. |
| `WP10-T09-EXPORT-AUDIT-REFERENCE` | Persist and display audit references for export actions. | Audit display is not audit persistence proof. | `audit-service.ts`, `ExportRequest`, `AuditEvent`, `communication-export-ops-screen.tsx`, `audit-timeline.tsx` | Write audit for scope save, redaction run, preview generation where required, approval, download/share attempt, denial. Display source-backed audit refs. Fail closed if required audit cannot persist. | Critical export actions have audit refs or remain blocked. | Audit/export tests; audit-fail-closed tests. | Yes: audit-required/unavailable/recorded states. | Stop if audit failure allows approval/download. |
| `WP10-T10-EXPORT-API-HARDENING` | Harden export API request/response/error contract. | API route presence is not safety proof. | `app/api/export-workflow/route.ts`, `deleted generic workflow route` if export actions remain there | Validate request action, export ID, actor, tenant, scope, redaction status, approval state. Return safe error envelope without internal payload. Do not advance state on error. | API supports truthful UI states and fail-closed errors. | `phase8-export-workflow-api.spec.ts`, `p0-api-contract.spec.ts`. | Indirect: UI receives safe state/errors. | Stop if API returns raw internals or changes state after denied/error. |
| `WP10-T11-CLIENT-SAFE-PROJECTION-SOURCE` | Ensure export reads client-safe released projection only. | Export must not package internal workflow records. | `visibility-engine.ts`, client-safe projection helpers, `Decision`, `Recommendation`, `EvidenceRecord`, `ExportRequest` usage | Route export source through released/redacted projection. Confirm no AI/internal/unreleased fields enter DTO. | Export payload and manifest contain only client-safe fields. | Payload visibility/export safety tests. | Yes: preview states reflect projection source. | Stop if export reads raw Recommendation/Document/Evidence without projection. |
| `WP10-T12-EXPORT-DENSITY-LAYOUT-PASS` | Apply page-type/density model to export pages. | Export pages are listed as long/complex. | `communication-export-ops-screen.tsx`, `ux-detail-standard-panel.tsx`, `ux-secondary-context-tabs.tsx`, `ux-cta-cluster.tsx`, `ux-density.ts` | Convert pages to decision/detail flow: top summary, gate status, blocker, one primary CTA, secondary details. Use dense internal workbench style, not calm client style. | Export pages are navigable, not endlessly dense; no critical info hidden only in drawer. | `true-ux-density.spec.ts`, `true-ux-cta-state.spec.ts`. | Yes, primary UX refactor. | Stop if layout refactor becomes broad redesign. |
| `WP10-T13-EXPORT-NO-OVERCLAIM-MICROCOPY` | Normalize export copy. | Export copy is a safety surface. | Component copy/constants, `state-panel.tsx`, `ux-cta-cluster.tsx` | Replace vague messages: “Export ready” → “Preview generated; approval required”; “Download complete” → “Package downloaded; client acceptance not recorded.” | All export feedback names exact completed action only. | Microcopy assertions in true-UX/P0 tests. | Yes: no-overclaim copy. | Stop if copy implies client acceptance, approval or release incorrectly. |
| `WP10-T14-EXPORT-P0-TRUE-UX-TESTS` | Add/update export positive and negative tests. | Current tests are proof slices only. | `tests/export-safety.spec.ts`, `tests/file-export-realism.spec.ts`, `tests/phase8-export-workflow-api.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/true-ux-density.spec.ts`, `tests/true-ux-cta-state.spec.ts` | Add positives for staged export. Add negatives for forbidden payload, preview-download bypass, approval missing, redaction missing, wrong tenant, admin bypass, audit unavailable, no-overclaim copy. | Export P0 and True-UX proof is explicit. | Named specs pass. | Yes: test UI states and copy. | Stop if tests only check headings or static status chips. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### 10.1 Routes

| Route ID | Path | WP-10 Relevance | UI / Safety Treatment |
|---|---|---|---|
| `054` | `/export/new` | Start export request. | Show export job, prerequisites and no-eligible-content state; no package creation without scope. |
| `055` | `/export/:id/scope` | Scope selection. | Validate scoped released/client-safe objects; one primary CTA to continue to redaction only when scope is valid. |
| `056` | `/export/:id/redaction` | Redaction review. | Summary-first redaction panel; forbidden payload blockers; secondary detail disclosure. |
| `057` | `/export/:id/preview` | Preview and approval boundary. | Preview visible only after redaction; approval is separate explicit action; no download. |
| `058` | `/export/:id/download` | Manifest/package/download/share state. | Download/share only after approval and audit; no client acceptance overclaim. |
| `019–020` | `/portal`, `/mobile` | Client-safe projection dependency. | Export must not derive from client UI visuals; it must derive from the same released client-safe projection logic. |
| `043–047` | Decision/evidence routes | Decision/evidence source dependency. | Export may include only allowed released/redacted summaries and links. |
| `048–051` | Governance/audit routes | Permission/audit dependency. | Export approvals/denials/audit refs must be visible to authorized internal roles. |

### 10.2 Components and UI modules

| Component / Module | Usage |
|---|---|
| `components/communication-export-ops-screen.tsx` | Primary export UI surface. |
| `components/page-header.tsx` | Page job/gate/blocker/next-step semantics. |
| `components/ui/state-panel.tsx` | Export blocked/pending/error/success states. |
| `components/ui/modal.tsx` | Export approval confirmation lifecycle. |
| `components/ui/drawer.tsx` | Secondary redaction/detail context where needed. |
| `components/ui/data-table.tsx` | Scope item and redaction item lists with loading/empty/error/permission states. |
| `components/ux-detail-standard-panel.tsx` | Detail layout for export stage pages. |
| `components/ux-cta-cluster.tsx` | One primary CTA per export state. |
| `components/ui/a11y-status.tsx` | Async export state announcements if available. |

### 10.3 APIs and services

| Area | Candidate Files |
|---|---|
| Export workflow API | `app/api/export-workflow/route.ts` |
| Legacy/typed workflow export actions | `deleted generic workflow route` if still used after rebase |
| Export logic | `lib/export-service.ts`, `lib/export-package-service.ts` |
| File metadata / manifest | `lib/file-metadata-service.ts` |
| Client visibility / redaction | `lib/visibility-engine.ts` |
| Permissions | `lib/permission-engine.ts` |
| Audit | `lib/audit-service.ts` |

### 10.4 Schema areas

| Model / Field Area | WP-10 Use |
|---|---|
| `ExportRequest` | Status, scope, redaction profile, approval, generated package/document refs. |
| `Decision` | Source of released decision/client-safe summary. |
| `Recommendation` | Must not leak internal draft/rationale fields. |
| `EvidenceRecord` / `EvidenceItem` | Only released/redacted/client-safe summaries where allowed. |
| `Document` / `DocumentVersion` | Generated export manifest/package refs if current schema supports it. |
| `AuditEvent` | Export scope, redaction, preview, approval, download/share attempt, denial/failure events. |
| Visibility/status fields | Derive client-safe-only export eligibility. |

---

## 11. Interaction Lifecycle Requirements

| Interaction | Required Lifecycle | Failure / Denial Behaviour |
|---|---|---|
| Create export | Trigger → validate actor/scope availability → create request/draft → show scope route/state | If no released content or permission denied, show blocked/empty state; do not create request. |
| Select scope | Select eligible items → validate tenant/object/client-safe eligibility → save scope → audit if required → continue | If invalid/forbidden/missing scope, disable continue and show exact blocker. |
| Run/review redaction | Trigger redaction → compute safe/blocked/excluded fields → show summary + detail | If forbidden payload detected or redaction fails, block preview/approval and show recovery. |
| Generate preview | Request preview from safe projection → render redacted preview → keep approval separate | If preview fails, do not create approval/download state; preserve input/scope. |
| Approve export | Open modal → confirm consequences → submit → loading → success/error → audit ref | If preconditions or permission fail, show denied/blocked; do not approve. |
| Download/share manifest/package | Trigger after approval only → validate audit/package state → mark/download/share attempt | If approval/audit/package missing, block and explain; do not claim client acceptance. |
| Cancel/back | Cancel preserves last safe persisted state and does not silently advance gates | No gate state may change on cancel/backdrop/Escape. |

---

## 12. State / Feedback / Microcopy Requirements

### 12.1 Required export states

| State | Required UI Meaning |
|---|---|
| `NO_RELEASED_CONTENT_AVAILABLE` | There is nothing eligible to export yet. |
| `SCOPE_INCOMPLETE` | Scope must be selected before redaction. |
| `SCOPE_INVALID` | Scope includes object/tenant/content not eligible for export. |
| `REDACTION_PENDING` | Redaction must run or be reviewed. |
| `REDACTION_BLOCKED_FORBIDDEN_PAYLOAD` | Forbidden internal payload was detected or would be included. |
| `PREVIEW_READY_NOT_APPROVED` | Preview is available but export is not approved. |
| `APPROVAL_REQUIRED` | Export needs explicit approval before package/download. |
| `APPROVAL_PENDING` | Approval action is in progress. |
| `APPROVED_NOT_DOWNLOADED` | Approval succeeded; package/download remains separate. |
| `MANIFEST_READY` | Metadata/manifest package is available according to current service support. |
| `DOWNLOAD_READY` | Download/share action is available after approval and audit. |
| `DOWNLOAD_COMPLETE_NOT_ACCEPTED` | Package/download completed; no client acceptance is implied. |
| `PERMISSION_DENIED` | Actor may not perform export action or view payload. |
| `AUDIT_UNAVAILABLE` | Required audit could not be written/confirmed; action is blocked/pending. |
| `SAFE_ERROR` | Recoverable API/service error with no sensitive payload. |

### 12.2 No-overclaim copy examples

| Unsafe / Too Broad | Required Direction |
|---|---|
| “Export ready.” | “Preview generated. Approval is still required before package/download.” |
| “Export approved and shared.” | “Export approved. Download/share remains a separate audited action.” |
| “Downloaded by client.” | “Package downloaded. Client acceptance is not recorded by this action.” |
| “All evidence included.” | “Selected released evidence summaries included; internal or unreleased evidence excluded.” |
| “Redaction complete.” | “Redaction review complete. Forbidden-payload checks passed for this preview.” |
| “Admin approved export.” | “Export approved by authorized actor after redaction and audit checks.” |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | Required WP-10 Rule |
|---|---|
| RBAC | Actor must have export action permission for route/action/object, not merely route access. |
| Tenant/object scope | Export may include only objects in the actor's permitted tenant/object scope. |
| Client visibility | Export may include only released, redacted, client-safe projection. |
| Advice boundary | No unapproved advice or internal recommendation draft may enter export. |
| AI Draft internal-only | AI Draft, internal rationale, model/source reasoning and analyst draft commentary are forbidden payload. |
| Evidence sufficiency | Only reviewed/accepted/released evidence summaries are export-eligible; upload-only documents are not sufficient. |
| Audit | Critical export actions require persisted audit references or must fail closed. |
| Admin non-bypass | Admin cannot force redaction pass, approval, download/share, visibility or audit suppression. |
| API safety | API returns safe errors and does not advance export state on validation/permission/audit failure. |
| Schema | Use existing full-workflow schema first; no blind export model replacement. |

---

## 14. Positive Acceptance Criteria

| ID | Acceptance Criterion |
|---|---|
| `WP10-POS-001` | A valid internal actor can create/export request only for released client-safe content in permitted tenant/object scope. |
| `WP10-POS-002` | Export scope page shows eligible released content, current blocker and one primary next action. |
| `WP10-POS-003` | Redaction stage produces a clear summary of included, redacted, excluded and blocked content. |
| `WP10-POS-004` | Preview can be generated only after valid scope and redaction checks. |
| `WP10-POS-005` | Approval is a separate explicit action after preview and redaction, with modal lifecycle and audit reference. |
| `WP10-POS-006` | Manifest/package state becomes available only after approval and audit where required. |
| `WP10-POS-007` | Download/share action, if supported, remains separate from approval and does not imply client acceptance. |
| `WP10-POS-008` | Export UI uses stage-appropriate page header, blocker, next step and one primary CTA per state. |
| `WP10-POS-009` | Export audit references are visible to authorized internal roles after critical export actions. |
| `WP10-POS-010` | Tests demonstrate staged export success path from scope to redacted manifest/package. |

---

## 15. Negative Acceptance Criteria

| ID | Negative Acceptance Criterion |
|---|---|
| `WP10-NEG-001` | Export cannot include AI Draft, internal rationale, analyst notes, compliance notes or unreleased recommendations. |
| `WP10-NEG-002` | Export cannot include raw/unreleased/unreviewed evidence or upload-only documents as sufficient evidence. |
| `WP10-NEG-003` | Preview cannot approve export and cannot enable download/share by itself. |
| `WP10-NEG-004` | Approval cannot occur without valid scope, redaction pass, actor permission and audit availability where required. |
| `WP10-NEG-005` | Download/share cannot occur before approval and audit. |
| `WP10-NEG-006` | Admin cannot bypass redaction, approval, visibility, evidence or audit gates. |
| `WP10-NEG-007` | Cross-tenant or wrong-object export scope is denied and does not leak payload. |
| `WP10-NEG-008` | API error or permission denial does not advance export state. |
| `WP10-NEG-009` | Export success copy does not claim client acceptance, advice execution or downstream client action. |
| `WP10-NEG-010` | P1/HOLD routes/content cannot be pulled into export scope by default. |
| `WP10-NEG-011` | If required audit write fails, export approval/download remains blocked or pending. |
| `WP10-NEG-012` | Status chips/buttons alone are not accepted as proof of redaction/approval/download state. |

---

## 16. Required Tests and Test Names

Codex must inspect existing tests first. Add/update only after classification.

| Test Name / File | Purpose | Required Assertions |
|---|---|---|
| `tests/export-safety.spec.ts` | Export forbidden payload and redaction safety | No AI Draft/internal rationale/compliance notes/unreleased evidence; redaction blockers work. |
| `tests/file-export-realism.spec.ts` | Export metadata/manifest realism | Manifest/package contains safe metadata only; unsafe metadata rejected; package blocked without approval/redaction. |
| `tests/phase8-export-workflow-api.spec.ts` | Export API workflow | Scope/redaction/preview/approval/download state separation; safe errors; no state advancement on failure. |
| `tests/true-ux-p0-safety.spec.ts` | P0 UI safety assertions | Preview-not-approval, approval-not-download, client-safe-only copy and blocked states visible. |
| `tests/true-ux-density.spec.ts` | Export layout/density | Export scope/redaction/preview use staged panels, not uncontrolled long page sprawl. |
| `tests/true-ux-cta-state.spec.ts` | One primary CTA per state | Disabled/blocked/export stage CTAs behave and label correctly. |
| `tests/confirmation-lifecycle.spec.ts` | Export approval modal lifecycle | Open/cancel/submit/loading/error/success; cancel does not advance state. |
| `tests/p0-acceptance.spec.ts` | End-to-end V0.96 proof | Export appears only after release/client-safe projection and passes negative bypass/leakage tests. |
| `tests/p0-api-contract.spec.ts` | API safety | Request validation, safe errors, no sensitive payload in failure responses. |

Suggested new/updated test titles:

- `export blocks preview when forbidden internal payload is present`
- `export preview does not approve or enable download`
- `export approval requires redaction pass and audit reference`
- `export package excludes AI draft analyst notes compliance notes and unreleased evidence`
- `admin cannot approve export by bypassing redaction or audit`
- `wrong tenant export scope is denied without payload leak`
- `download message does not imply client acceptance`

---

## 17. Validation Commands

Codex must adapt commands to the current repo scripts after WP-00 rebase.

```bash
pnpm typecheck
pnpm lint
pnpm test:route-smoke
pnpm playwright test tests/export-safety.spec.ts
pnpm playwright test tests/file-export-realism.spec.ts
pnpm playwright test tests/phase8-export-workflow-api.spec.ts
pnpm playwright test tests/true-ux-p0-safety.spec.ts
pnpm playwright test tests/true-ux-density.spec.ts
pnpm playwright test tests/true-ux-cta-state.spec.ts
pnpm playwright test tests/confirmation-lifecycle.spec.ts
pnpm playwright test tests/p0-api-contract.spec.ts
```

If a script does not exist, Codex must inspect `package.json`, select the equivalent command, and document the substitution in the implementation evidence report.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| Export includes forbidden internal payload | Stop immediately; export safety is violated. |
| Export bypasses client-safe visibility engine/projection | Stop; must route through released/redacted projection. |
| Preview enables approval/download implicitly | Stop; gate separation violated. |
| Approval occurs without redaction pass/audit/permission | Stop; P0 safety gate violated. |
| Download/share implies client acceptance | Stop; no-overclaim rule violated. |
| New production binary/share infrastructure is needed | Stop and escalate unless current repo already authorizes/supports it. |
| Admin can force export or suppress audit | Stop; admin non-bypass violated. |
| Wrong tenant/object scope leaks payload | Stop; tenant isolation violated. |
| Schema replacement seems required | Stop; use migration decision protocol, no blind replacement. |
| Route scope requires P1/HOLD elevation | Stop; do not implement P1/HOLD content in V0.96. |
| UI refactor requires new screens/images/assets | Stop; generation not authorized. |
| Tests only check headings/status chips | Stop; must prove behaviour, payload and negative safety cases. |

---

## 19. Open Questions / Blockers

| Open Item | Default Handling |
|---|---|
| Whether current export service supports real binary files | Treat metadata/manifest proof as sufficient unless current repo already has authorized binary export. |
| Whether external share/delivery is implemented | Do not implement external sharing; treat as `P1_AFTER_V0_96` unless explicitly present and safe. |
| Whether export approval is stored in `ExportRequest` or derived from audit/workflow state | Recheck schema/service and use existing field/service; do not create model blindly. |
| Whether export should include raw evidence files | Default no; include only released/redacted summaries or metadata unless separate approved file-scope contract exists. |
| Whether client can trigger export | Default no for V0.96; export is internal/advisor/compliance trust output unless route scope says otherwise. |
| Whether P1/HOLD routes can be exported | Default no. Carry as blocked/deferred. |

---

## 20. Codex Execution Notes

1. Start after WP-00 and after upstream Evidence, Analyst, Advisor, Compliance, Client-Safe Projection, Audit and Governance foundations are sufficiently available.
2. Reuse existing export services/tests if they already implement portions of the staged model.
3. Do not create parallel export logic if `export-service.ts` / `export-package-service.ts` already provide intended functions.
4. Keep export state machine small and explicit. Avoid generic “ready” booleans.
5. Treat UI copy as safety behaviour; it must not claim approval/download/client acceptance too early.
6. Use current UX helpers (`ux-detail-standard-panel`, `ux-cta-cluster`, density/page contract helpers) where present and suitable.
7. Update tests together with UI/service/API changes. Export safety is not done without negative payload/bypass tests.
8. Preserve route smoke and unrelated routes after touching shared export/communication component.

---

## 21. QA Matrix

| QA Check | Required Result |
|---|---|
| Source hierarchy preserved | PASS: full-workflow current repo truth; main false-gap only. |
| WP-10 section used | PASS: source WP goal/files/tests/stop rules are carried forward. |
| KB evidence integrated | PASS: export safety, no-overclaim, UX density, audit, visibility and P0 proof included. |
| UI/UX/IA refactor scoped | PASS: export stages/layout/copy/CTA refactored only where routes 054–058 are touched. |
| No broad redesign | PASS: no new design direction or generated visuals. |
| Preview/approval/download separation | PASS: explicit in states, tasks and tests. |
| Forbidden payload excluded | PASS: explicit positive/negative criteria and tests. |
| Client-safe projection required | PASS: export source must be released/redacted projection. |
| Admin non-bypass preserved | PASS: admin cannot bypass redaction/approval/audit/visibility. |
| Audit persistence required | PASS: critical actions need audit refs or fail closed. |
| Schema discipline | PASS: use existing schema first, no blind replacement. |
| Tests required | PASS: export safety, API, true-UX and P0 negative tests named. |
| Stop rules present | PASS: explicit do-not-do register. |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Role | ENGINE_v2 Role | Codex-Spark-like Convergence |
|---|---|---|---|
| KB/UI/UX discovery | Identified export as trust-output surface, long/complex page family, preview/approval/download confusion, forbidden-payload risk and no-overclaim needs. | Converted evidence into task-relevant source hierarchy and acceptance gates. | Chose one direct WP-10 direction: staged export with redaction, approval, manifest and hard negative tests. |
| Contradiction control | Separated export as MVP late-stage trust proof from full production binary/share infrastructure. | Preserved no-generation, no-scope-elevation and no-blind-schema rules. | Stopped overbroad export platform ambitions; kept V0.96 manifest/client-safe proof. |
| Task decomposition | Mapped UI, API, services, schema, audit and tests into implementable subtasks. | Produced task table with files, steps, acceptance, tests and stop rules. | Made each task concrete enough for Codex without product decisions. |
| Safety/P0 discipline | Surfaced leakage, admin bypass, audit failure, preview/approval/download ambiguity and client acceptance overclaim as critical risks. | Converted risks into positive and negative acceptance criteria and test names. | Required export safety tests as release blockers. |
| Final QA | Checked that WP-10 does not create screens/images, elevate P1/HOLD, or treat visual UI as proof. | Produced QA matrix and validation commands. | Final artefact is Codex-ready task description only, not implementation. |
