# ALPHAVEST_V0_96_WP07_DECISION_RECORD_CLIENT_SAFE_PROJECTION_DEEP_TASK_DESCRIPTION.md

**Generated:** 2026-06-23  
**Mode:** Prompt 08 execution. Deep Codex-ready task description only.  
**Work Package:** `WP-07 — Decision Record + Client-Safe Projection`  
**Release Target:** `V0.96 Core Journey Release + UX/IA Refactor`  
**Implementation status:** Not implemented here.  
**Screen/image generation:** Not authorized.  

---

## 1. Executive Task Decision

**Decision:** `WP07_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_DECISION_RECORD_AND_CLIENT_SAFE_PROJECTION_AFTER_WP00_REBASE`

`WP-07` turns the released AlphaVest decision into a traceable, client-safe product object. It connects the internal recommendation/advisor/compliance/evidence/audit chain to a released decision record and a fail-closed client projection for `/portal` and `/mobile`.

This is a Codex task-description artefact only. It does **not** implement code, change routes, change schema, generate screens, write tests, create new visual assets or start Codex. It specifies how Codex must later implement/harden decision records and client-safe projection against current `full-workflow` reality.

The core product rule for this WP is:

```text
Client visibility is a derived, fail-closed projection from compliance release, redaction and payload rules. A decision record may contain internal traceability, but client-facing surfaces may show only released, redacted, client-safe summaries. AI Draft, internal rationale, analyst notes, advisor notes, compliance notes, unreleased evidence, raw evidence and internal audit details never reach the client projection.
```

`WP-07` is P0 because AlphaVest V0.96 cannot credibly claim “Digital first, human reviewed, evidence backed” unless the client sees exactly the safe released output of the controlled journey and nothing else.

---

## 2. Source-of-Truth Lock

| Rank | Source | Role for WP-07 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current `full-workflow` repo / snapshot | Target implementation baseline | Inspect actual routes, components, APIs, services, schema, tests and current projection helpers before edits | Do not infer missing work from older KB counts or from `main` |
| 2 | `ALPHAVEST_V0_96_WP00_MOVING_BASELINE_UX_IA_DELTA_REGISTER_DEEP_TASK_DESCRIPTION.md` and implemented WP-00 output | Mandatory predecessor | Moving baseline, current decision/client projection classification, current UX/IA delta register | Starting implementation before current repo is classified |
| 3 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | UX/IA evidence register | Known client-safe UI, density, fail-closed, no-overclaim and route/component problem signals | Inventing unsupported UX problems |
| 4 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary WP source | WP-07 goal, target files, tests, stop rules and UI/UX refactor scope | Treating the task pack as implementation proof |
| 5 | `ALPHAVEST_V0_96_WP01...` and `ALPHAVEST_V0_96_WP02...` | IA and density predecessors | Journey-first navigation, page job/header model, page-type/density rules | Rebuilding global IA/density from scratch inside WP-07 |
| 6 | `MVP_SCOPE_LOCK.md`, `ROUTE_SCOPE_LOCK.md`, `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md`, `STATE_SCREEN_SPEC.md` | Route/scope/state controls | Routes `019–020`, `043–047` are MVP surfaces; state requirements bind client and decision UI | Elevating P1/HOLD/reference-only routes |
| 7 | `DRAWER_MODAL_INTERACTION_CONTRACT.md`, `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Interaction and feedback contracts | No-overclaim feedback, release-pending/client-hidden states and decision-state lifecycle | Treating visible status chips or static panels as projection proof |
| 8 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Core safety contract | Route/action/object/payload separation; client-safe released-only visibility; AI Draft internal-only | Manual visibility override or payload visibility from route access |
| 9 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence/audit/export safety | Evidence summary must be client-safe; audit/event references are internal unless safe/redacted | Raw evidence/internal audit leakage |
| 10 | `API_CONTRACT_MATRIX.md`, `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`, `P0_TEST_ACCEPTANCE_MATRIX.md` | API/schema/test proof | Existing API hardening, schema usage alignment and P0 proof obligations | Claiming existing APIs/schema/tests already prove WP-07 |
| 11 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`, `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey priority source | `MJ-001`, `MJ-002` client-safe decision proof; `MJ-005` later export dependency | Pulling committee/KYC/suitability/communication into WP-07 |
| 12 | `main` branch / `alphavest-wealthos-clickdummy-main.zip` | False-gap warning only | Identify stale assumptions | Any target task, absence claim or implementation basis |

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | Task Implication | Must Refactor Now? |
|---|---|---|---|---|---|---|
| Client-facing pages must fail closed. | State spec; RBAC/visibility contract; UX/IA evidence index | `/portal`, `/mobile`, `ClientIntakeScreen`, WP-07 | Client-safe visibility | Critical | Before release, client surfaces must show `no released content` or pending state; never internal previews. | Yes |
| AI/rules draft must stay internal-only. | MVP scope; RBAC/visibility/advice contract; journey requirements | Decision record, client projection, export dependency | AI/advice boundary | Critical | Decision record may reference internal draft internally, but projection must exclude AI Draft and internal rationale. | Yes |
| Compliance release is the only client visibility release gate. | MVP scope; compliance WP; RBAC/visibility contract | Decision/client projection | Workflow gate | Critical | Projection source must require compliance release and safe redaction; advisor approval is not enough. | Yes |
| Client pages require calm executive density, not internal workbench density. | UX/IA evidence index; page-type/density task | `/portal`, `/mobile` | Density/layout | High | Client projection should be summary-first, calm, minimal and safe; no internal rails or noisy workbench panels. | Yes |
| Long/complex pages include `/portal` and decision/evidence routes. | UX/IA evidence index | `/portal`, `/decisions/:id`, `/evidence/:id` | Layout/scroll depth | High | Use summary-first layout and progressive disclosure for internal decision record. | Yes |
| Decision record is needed to prove governance, not just workflow movement. | MVP scope; journey matrix | `/decisions`, `/decisions/:id`, `/decisions/:id/success` | Product traceability | Critical | Decision record must link recommendation, evidence, advisor approval, compliance release, audit refs and visibility status. | Yes |
| Visual assets/status chips are not gate proof. | Interaction audit; feedback contract | Decision/status UI | Visual-only overclaim | High | Decision UI must be backed by service/state; status chips must not imply release without projection source. | Yes |
| Audit timeline display is not persistence proof. | Interaction audit; evidence/audit/export contract | Decision detail/audit refs | Audit proof | High | Decision record may display audit references only when persisted/source-backed; client projection hides internal audit. | Yes |
| Upload success is upload-only. | Evidence contract; feedback contract; P0 tests | Evidence summary in decision/client | Evidence overclaim | Critical | Client-safe evidence summary must not claim sufficiency from upload alone. | Yes |
| Export depends on client-safe projection. | Export contract; journey priority `MJ-005` | WP-10 dependency | Downstream safety | High | WP-07 must expose safe projection/data contract that WP-10 can consume without forbidden payload. | Yes, as interface expectation |
| P1/HOLD visual refs do not authorize generation. | Screen generation brief; route matrix | Routes `064–071` | Scope/generation | Medium | Do not pull held suitability/committee routes into client projection. | Yes, as stop rule |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must perform this as a **read-only recheck** after WP-00 and before any WP-07 implementation. Older KB counts may be stale; current snapshot evidence already suggests richer code reality, including dedicated client visibility and projection helpers.

| Area | Current Reality to Recheck | Files / Commands / Evidence |
|---|---|---|
| Client projection helpers | Check whether `lib/control-layer/client-visibility.ts`, `lib/control-layer/visibility-projection.ts` and `lib/visibility-engine.ts` already produce fail-closed client-safe payloads. | `sed -n`, `rg "client.*visible|visibility|projection|released" lib/` |
| Client surfaces | Check `/portal` and `/mobile` ownership and current rendering in `components/client-intake-screen.tsx`. | `rg "portal|mobile|client-safe|released|visibility" components/client-intake-screen.tsx` |
| Decision surfaces | Check decision list/detail/success and evidence detail ownership in `components/decisions-governance-screen.tsx`. | `rg "decision|release|audit|evidence|client" components/decisions-governance-screen.tsx` |
| Decision data source | Check `lib/decisions-governance-demo-data.ts`, Prisma models, seed and services for decision/recommendation/compliance/evidence links. | `rg "Decision|Recommendation|ComplianceReview|EvidenceRecord|clientSummary" prisma lib app tests` |
| Existing APIs | Check whether dashboard/profile/decision/client APIs exist and return safe envelopes. Current prompt source names `/api/dashboard-metrics` and `/api/profile`; current repo may have more APIs than old KB. | `find app/api -type f -maxdepth 4`, `rg "GET|POST|client" app/api` |
| Existing tests | Check client visibility and true-UX tests before writing or renaming. Current snapshot indicates files such as `tests/client-visibility-projection.spec.ts`, `tests/client-visibility-proof.spec.ts`, `tests/true-ux-client-projection.spec.ts`, `tests/scf-p07-p09-trust-ui.spec.ts`. | `ls tests`, `rg "AI Draft|internal|portal|mobile|released|client-safe" tests` |
| UI primitives | Check availability of `StatePanel`, `AuditTimeline`, `EvidenceList`, `PageHeader`, `ux-detail-standard-panel`, `ux-cta-cluster`, guarded buttons and a11y status. | `find components -maxdepth 3 -type f`, `rg "PageHeader|StatePanel|Guarded|client-safe|released" components` |
| Snapshot artefacts | Screenshot artefacts may exist in `/artifacts/...` but are proof only if test-generated/current; they are not authorization for new image generation. | `find artifacts -type f | grep client` |

**Classification required before edits:** Each relevant route/component/service/test must be classified as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `STALE_KB_ASSUMPTION`, or `BLOCKED`.

---

## 5. WP Problem Statement

Current AlphaVest surfaces can show decisions, evidence, statuses and client areas, but V0.96 needs a stronger truth boundary:

1. A decision record must be a real governance object, not just a screen or success state.
2. Client portal/mobile must show only released client-safe content.
3. Internal rationale, AI Draft, analyst/advisor/compliance notes, raw evidence and internal audit must not leak into client routes, export payloads or API responses.
4. Client pages must not inherit dense internal workbench layouts or internal process rails.
5. Decision/detail pages must be traceable internally without overloading the client view.
6. Unknown actor, wrong tenant, missing release, missing redaction, API error or incomplete visibility proof must fail closed.

---

## 6. V0.96 Journey Role

| Journey | WP-07 Role |
|---|---|
| `MJ-001 — New Family Office onboarding to first client-safe decision` | Provides the released decision output and client-safe view at the end of the core journey. |
| `MJ-002 — Evidence missing to client upload to release` | Converts reviewed and linked evidence into safe decision/evidence summary after compliance release. |
| `MJ-003 — AI draft rejected and rebuilt with evidence` | Ensures AI Draft/internal rationale remain internal and do not enter client projection. |
| `MJ-006 — Cross-tenant access denied with audit proof` | Ensures client projection is tenant/object scoped and fail-closed. |
| `MJ-010 — Admin role change cannot bypass compliance release` | Ensures admin cannot force client visibility or manually override projection. |
| `MJ-005 — Export package with forbidden internal payload redaction` | Consumes the same safe projection principles later for export/redaction; WP-07 creates the prerequisite projection truth. |

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | WP-07 Interpretation | Required Refactor |
|---|---|---|
| Route-catalog navigation vs journey-first IA | Client/decision routes must sit in a release/projection journey, not loose route catalogue entries. | Use WP-01 navigation group labels and page headers. Do not add new nav sections inside WP-07 unless WP-01 has defined them. |
| Long page / scroll sprawl | Decision detail and portal can become long if internal evidence/audit/release data are dumped into one surface. | Use summary-first; move secondary details into sections/tabs/drawers only if primitives already support lifecycle. |
| Empty / sparse pages | Before release, client portal/mobile may appear empty. | Show meaningful `No released content available yet` with current safe state and next non-sensitive step, not filler. |
| Weak page job | Client and decision pages need clear purpose. | Page headers must show page job, current gate, blocker and next safe step where applicable. |
| Too many CTAs | Client and decision detail must not show multiple equal actions. | One primary CTA per state; client has view/acknowledge-type actions only if safe and already scoped. |
| Status chips as gate proof | Released/pending chips can falsely imply visibility. | Chips reflect source-backed state; copy explains that release requires compliance and projection. |
| Client-visible internal data risk | Portal/mobile are the main leakage surfaces. | Apply projection whitelist; hide/redact everything not explicitly client-safe. |
| No-overclaim microcopy | Release is not client acceptance. Upload is not evidence sufficiency. | Copy must say exactly what happened and what remains pending. |
| Internal vs client density mismatch | Client UI must be calmer than internal decision room. | Calm executive density on `/portal` and `/mobile`; compact traceability only internal. |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### 8.1 Changes Now

| Scope | Included in WP-07 |
|---|---|
| Decision record | Link recommendation, evidence, advisor approval, compliance release, release actor/timestamp, audit refs and visibility status. |
| Client projection | Build/harden client-safe read model using visibility/projection engines; fail closed. |
| Portal/mobile UI | Replace internal previews with no-release/released-safe states; calm layout. |
| Decision detail UI | Summary-first internal traceability; safe evidence/audit references; no client leakage. |
| Microcopy | No-overclaim wording for pending/released/client-safe/no-release states. |
| Tests | Positive/negative client visibility, AI Draft leakage, internal note leakage, wrong tenant, advisor-not-release and upload-not-release proofs. |
| API/service integration | Any client-facing API/envelope used by portal/mobile must return safe projection only. |

### 8.2 Stays Out

| Out of Scope | Reason |
|---|---|
| Manual client-visibility override | Explicitly forbidden by MVP/control rules. |
| Full export implementation | WP-10 owns export scope/redaction/approval; WP-07 only provides projection prerequisite. |
| Committee/KYC/SoW/Suitability/IPS projection | Held/P2 routes must not be elevated. |
| Broad redesign or new visual assets | No screen/image generation authorized. |
| Client acceptance workflow | Release/client-safe visibility does not mean client acceptance/action. |
| Production financial advice automation | Non-goal; AI Draft remains internal. |
| Blind Prisma replacement | Schema usage alignment belongs to WP-14 if current schema cannot express state safely. |

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| `WP07-T01-REALITY-CLASSIFY-DECISION-PROJECTION` | Classify current decision/client projection implementation before edits. | WP-00 requires moving baseline because older KB counts may be stale. | `components/client-intake-screen.tsx`, `components/decisions-governance-screen.tsx`, `lib/visibility-engine.ts`, `lib/control-layer/client-visibility.ts`, `lib/control-layer/visibility-projection.ts`, `tests/client-visibility-*`, `tests/true-ux-client-projection.spec.ts` | Inventory current routes, projection helpers, current client payloads, current decision fields and tests. Label each as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING` or `BLOCKED`. | Codex knows what to reuse vs harden; no stale false-gap tasks created. | `tests/source-reality-gate.spec.ts` if present; otherwise record manual read-only evidence in implementation notes. | Yes: classify current client/decision surfaces and UX defects. | Stop if implementation begins before classification. |
| `WP07-T02-DECISION-RECORD-READ-MODEL` | Create/harden internal decision record read model. | Decision record must prove traceability without becoming client payload. | `lib/decisions-governance-demo-data.ts`, Prisma `Decision`, `Recommendation`, `ComplianceReview`, `EvidenceRecord`, `Approval`, `AuditEvent`, relevant services/API | Build/read decision detail object with recommendation ref, evidence refs, advisor approval ref, compliance release ref, release actor/timestamp, audit refs, visibility status and client-safe summary field. | Internal decision detail has traceable source links; missing links display explicit blocked/pending states. | `tests/schema-alignment.spec.ts`, `tests/p0-acceptance.spec.ts`, decision/visibility tests. | Yes: summary-first internal decision detail layout. | Do not put internal notes into client summary. Do not collapse advisor/compliance gates. |
| `WP07-T03-CLIENT-SAFE-PROJECTION-WHITELIST` | Define/enforce projection whitelist. | Client projection must be explicit allowlist, not broad object serialization. | `lib/control-layer/client-visibility.ts`, `lib/control-layer/visibility-projection.ts`, `lib/visibility-engine.ts`, API/client data helpers | Create/harden projection function returning only released safe summary, safe evidence summary, released status, safe next action and permitted metadata. Exclude forbidden fields by default. | Projection excludes AI Draft, internal rationale, analyst/advisor/compliance notes, raw/unreleased evidence and internal audit. | `tests/client-visibility-projection.spec.ts`, `tests/client-visibility-proof.spec.ts`, `tests/p0-acceptance.spec.ts`. | Yes: projection fields map to visible calm client UI. | Stop if projection uses spread/raw Prisma/API object serialization. |
| `WP07-T04-CLIENT-FAIL-CLOSED-NO-RELEASE-STATE` | Implement/harden before-release client state. | Client-facing pages must fail closed when release proof is incomplete. | `components/client-intake-screen.tsx`, `components/ui/state-panel.tsx`, visibility helper/API | Before compliance release or on unknown/error state, show `No released content available yet`, optional safe pending explanation and no internal data. | `/portal` and `/mobile` before release show no internal preview, no internal workflow state and no raw evidence. | `tests/true-ux-client-projection.spec.ts`, `tests/scf-p07-p09-trust-ui.spec.ts`, `tests/ui-state-boundaries.spec.ts`. | Yes: calm empty/pending client state, meaningful not blank. | Stop if client sees draft, internal notes, compliance status details or unreleased evidence. |
| `WP07-T05-CLIENT-RELEASED-SAFE-SUMMARY-UI` | Render released client-safe summary after release. | Compliance release enables client-safe projection, not client acceptance. | `components/client-intake-screen.tsx`, projection helper, API envelope | After release, render only client-safe summary, safe decision status, safe evidence summary and safe next step. Keep internal traceability out. | Client sees released safe content only after release. Copy does not imply client acceptance/action. | `tests/true-ux-client-projection.spec.ts`, `tests/client-visibility-proof.spec.ts`, `tests/p0-acceptance.spec.ts`. | Yes: calm executive density, summary-first, no internal rails. | Stop if release success copy implies “client accepted” or shows internal data. |
| `WP07-T06-MOBILE-PROJECTION-PARITY` | Ensure `/mobile` has same safety boundary as `/portal`. | Mobile home is MVP client surface, not a looser preview. | `components/client-intake-screen.tsx`, responsive/mobile layout, tests | Apply same projection source and forbidden-field tests to mobile. Adjust density for mobile without hiding critical state explanation. | Mobile before/after release matches portal safety semantics. | `tests/true-ux-client-projection.spec.ts`, `tests/scf-p07-p09-trust-ui.spec.ts`, mobile route smoke if present. | Yes: mobile calm layout and safe pending/released states. | Stop if mobile uses separate unsafe demo data path. |
| `WP07-T07-INTERNAL-DECISION-DETAIL-UX` | Refactor internal decision detail to summary-first traceability. | Internal users need evidence/audit/release traceability without long-page sprawl. | `components/decisions-governance-screen.tsx`, `components/ux-detail-standard-panel.tsx`, `components/ui/evidence-list.tsx`, `components/ui/audit-timeline.tsx` | Create a decision overview: client-safe summary preview, current gate, evidence status, approval/release refs, audit refs. Put secondary details into progressive sections/drawers/tabs only if available. | Decision detail is navigable, traceable and not a dump of all internal panels. | `tests/true-ux-density.spec.ts`, `tests/true-ux-cta-state.spec.ts`, `tests/ui-clickflow-phase06-10.spec.ts`. | Yes: reduce long-page sprawl and enforce page job/current gate/next step. | Do not expose this internal detail layout to client routes. |
| `WP07-T08-EVIDENCE-SUMMARY-SAFETY` | Show safe evidence summaries without raw/unreviewed evidence leakage. | Evidence is client-safe only if released/redacted/reviewed. | `components/client-intake-screen.tsx`, `components/decisions-governance-screen.tsx`, `lib/evidence-service.ts`, projection helper | Map evidence states: no evidence, pending review, insufficient, sufficient internal, safe summary released. Client sees only safe summary after release. | Upload-only or unreviewed evidence never appears as sufficient in client projection. | `tests/evidence-review-api.spec.ts`, `tests/document-upload-api.spec.ts`, `tests/client-visibility-projection.spec.ts`. | Yes: evidence status copy and summary hierarchy. | Stop if upload success appears as evidence sufficient or raw evidence leaks. |
| `WP07-T09-API-CLIENT-PAYLOAD-HARDENING` | Harden APIs used by client/decision projection. | API route presence is not payload safety proof. | `app/api/dashboard-metrics/route.ts`, `app/api/profile/route.ts`, any client/decision API found by rebase, projection services | Ensure client-facing API uses projection helper and safe error envelope. Deny wrong actor/tenant/object. Do not include forbidden fields even on errors. | Client APIs return safe projection or fail-closed hidden/denied response. | `tests/p0-api-contract.spec.ts`, `tests/fail-closed-error-envelope.spec.ts`, `tests/client-visibility-proof.spec.ts`. | Yes indirectly: UI truth depends on safe API envelopes. | Stop if API returns raw recommendation/decision/evidence objects to client. |
| `WP07-T10-AUDIT-REFS-INTERNAL-ONLY` | Display audit references internally without leaking internal audit to client. | Audit is proof spine but client should not see internal audit details. | `components/decisions-governance-screen.tsx`, `components/ui/audit-timeline.tsx`, `lib/audit-service.ts`, projection helper | Decision detail can show persisted audit refs internally. Client projection may show generic safe confirmation only if approved; no internal audit rows. | Internal audit refs are source-backed; client routes do not show internal audit detail. | `tests/phase6-audit-persistence.spec.ts`, `tests/audit-fail-closed.spec.ts`, `tests/client-visibility-projection.spec.ts`. | Yes: internal progressive disclosure; no client audit clutter. | Stop if static audit rows are treated as persistence proof or client sees internal audit. |
| `WP07-T11-NO-OVERCLAIM-COPY-PASS` | Harden copy for decision/client states. | Copy is a safety surface. | `components/client-intake-screen.tsx`, `components/decisions-governance-screen.tsx`, copy constants/tests | Replace ambiguous copy: “released/approved/complete/ready” with gate-specific wording. Required distinctions: upload-only, advisor-approved-not-release, compliance-released-client-safe-summary-available, release-not-client-acceptance. | No touched copy overclaims downstream gate completion. | `tests/demo-session-panel-copy.spec.ts`, `tests/mvp-support-copy-cleanup.spec.ts`, `tests/true-ux-p0-safety.spec.ts`. | Yes: no-overclaim microcopy. | Stop if copy implies client acceptance, autonomous advice or upload/evidence/release shortcut. |
| `WP07-T12-P0-PROJECTION-PROOF` | Add V0.96 P0 proof for decision/client projection. | WP-07 complete only with positive and negative proof. | `tests/p0-acceptance.spec.ts`, `tests/client-visibility-projection.spec.ts`, `tests/true-ux-client-projection.spec.ts`, fixtures | Positive: compliance released + projection exists => client sees safe summary. Negative: before release, advisor-only release, upload-only, wrong tenant, admin override, AI Draft/internal note leakage, API error all fail closed. | Client projection is test-backed and fail-closed. | Named tests in section 16. | Yes: UI assertions for safe/no-release states. | Do not mark WP-07 done without forbidden payload negative tests. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### 10.1 Routes

| Route ID | Route | Scope | WP-07 Treatment |
|---|---|---|---|
| `019` | `/portal` | `MVP` | Primary client web projection surface; fail-closed before release, client-safe summary after release. |
| `020` | `/mobile` | `MVP` | Mobile client projection parity; same safety semantics as portal. |
| `043` | `/decisions` | `MVP` | Internal decision list; must not be confused with client view. |
| `044` | `/decisions/:id` | `MVP` | Internal decision record / traceability detail. |
| `045` | `/decisions/:id/success` | `MVP` | Decision submitted / release outcome state; no-overclaim copy. |
| `046` | `/evidence` | `MVP` | Evidence vault context; safe evidence summary dependency. |
| `047` | `/evidence/:id` | `MVP` | Evidence detail context; raw/internal evidence remains internal. |
| `036–037` | Advisor approval | `MVP` predecessor | Advisor approval state is input only; not client release. |
| `038–042` | Compliance | `MVP` predecessor | Compliance release is required before client projection. |
| `054–058` | Export | `MVP` downstream | Consumes safe projection; implementation belongs to WP-10. |

### 10.2 Components

| Component | Use in WP-07 |
|---|---|
| `components/client-intake-screen.tsx` | Primary portal/mobile client projection surface. |
| `components/decisions-governance-screen.tsx` | Decision list/detail/success/evidence traceability surfaces. |
| `components/page-header.tsx` | Page job/current gate/blocker/next step if global pattern exists. |
| `components/ux-detail-standard-panel.tsx` | Decision detail summary-first layout if present. |
| `components/ux-calm-client-panel.tsx` or equivalent if present | Calm client projection density if current repo has it. |
| `components/ux-cta-cluster.tsx` | One-primary-CTA per state if present. |
| `components/ui/state-panel.tsx` | No-release, released, denied, error, pending states. |
| `components/ui/evidence-list.tsx` | Safe/internal evidence summary display. |
| `components/ui/audit-timeline.tsx` | Internal persisted audit refs only. |
| `components/ui/status-chip.tsx` / `workflow-badge.tsx` | State label display; not gate proof. |

### 10.3 APIs / Services / Libraries

| Area | Use in WP-07 |
|---|---|
| `lib/visibility-engine.ts` | Existing visibility logic to preserve/harden. |
| `lib/control-layer/client-visibility.ts` | Candidate client visibility control layer; inspect and reuse if current. |
| `lib/control-layer/visibility-projection.ts` | Candidate projection builder; inspect and reuse if current. |
| `lib/decisions-governance-demo-data.ts` | Existing decision data, to replace/harden with source-backed shape where necessary. |
| `lib/client-intake-demo-data.ts` | Existing client portal data, to bind to projection instead of internal demo data. |
| `lib/audit-service.ts` | Internal audit refs; not client projection payload. |
| `app/api/dashboard-metrics/route.ts` | Potential client dashboard metrics; must be safe or not used. |
| `app/api/profile/route.ts` | Potential profile/client context; must be tenant/object scoped. |
| Any current decision/client API found in rebase | Must use projection allowlist and fail-closed envelopes. |

### 10.4 Schema Areas

| Schema Area | WP-07 Usage |
|---|---|
| `Decision` | Decision record status, released timestamp, client-safe summary, evidence/compliance/audit refs if present. |
| `Recommendation` | Internal recommendation, AI Draft/internal rationale fields must not project to client. |
| `ComplianceReview` | Release/block state and compliance actor/precondition source. |
| `Approval` | Advisor approval source; not release. |
| `EvidenceRecord` / `EvidenceItem` | Safe evidence summary only after review/release/redaction. |
| `AuditEvent` | Internal traceability and release proof; client projection hides internal audit detail. |
| `PolicyDefinition` / visibility fields | Projection policy/fail-closed rules. |

---

## 11. Interaction Lifecycle Requirements

| Interaction / State | Lifecycle Requirement |
|---|---|
| Client projection load | Loading → safe projection / no released content / permission denied / error fail-closed. |
| Decision detail load | Loading → internal traceability detail / not found / denied / blocked / audit unavailable if relevant. |
| Released summary display | Must be driven by compliance release + projection helper; no manual toggle. |
| Evidence summary expansion | Internal pages may show expanded evidence; client sees only safe summary. |
| Client action | If any CTA exists, it must be safe, secondary to released summary and not imply acceptance/advice execution. |
| Error recovery | Error states preserve fail-closed visibility. Retry must not expose stale internal payload. |
| Status changes | Status chips/badges update from source-backed state, not static visual mode. |

---

## 12. State / Feedback / Microcopy Requirements

| State | Required UI / Copy |
|---|---|
| No release | “No released content is available yet.” Optional safe context: “Your AlphaVest team is still reviewing this item.” |
| Advisor approved only | “Advisor approved — compliance release is still required before client visibility.” |
| Evidence pending | “Evidence has been uploaded and is awaiting review.” |
| Evidence insufficient | “Additional or corrected evidence is required before this can be released.” |
| Compliance released | “Client-safe summary is now available.” |
| Released safe evidence summary | “Evidence summary approved for client view.” |
| Permission denied | “You do not have access to this released view.” Do not reveal internal object names if denied actor is client/external. |
| Error | “We could not load a released client-safe view. No internal information has been shown.” |
| Internal decision detail | “Internal traceability view — not client-visible.” |
| Audit reference internal | “Audit reference stored internally.” not “Client audit available.” |
| Release not acceptance | Avoid “client accepted”, “acted”, “confirmed advice” unless an explicit future client acceptance workflow exists. |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-07 Requirement |
|---|---|
| RBAC | Client route access is scoped; action/object/payload checks apply separately. Wrong tenant/object fails closed. |
| Client visibility | Derived from compliance release + visibility/projection helper. No manual override. |
| Advice boundary | AI Draft/internal rationale/recommendation internals are never client-visible. |
| Evidence | Safe evidence summary only after evidence review/link/sufficiency/release conditions. |
| Audit | Internal decision record can reference persisted audit; client projection hides internal audit details. |
| Export | WP-10 must consume safe projection or a stricter redacted export projection; WP-07 must not produce export package itself. |
| Admin non-bypass | Admin cannot force client visibility; admin attempts must be denied/audited in WP-09/P0 tests. |
| API safety | Client APIs must return projection allowlist only and safe error envelope. |

---

## 14. Positive Acceptance Criteria

| ID | Positive Acceptance Criterion |
|---|---|
| `WP07-POS-01` | After valid advisor approval, sufficient linked evidence, compliance release and audit availability, `/portal` shows released client-safe summary only. |
| `WP07-POS-02` | `/mobile` shows the same safe released state as `/portal`, adjusted for mobile density. |
| `WP07-POS-03` | Internal `/decisions/:id` shows traceability links: recommendation, evidence, advisor approval, compliance release, release timestamp/actor, audit refs and visibility status. |
| `WP07-POS-04` | Client-safe evidence summary appears only as redacted/released summary, not raw evidence. |
| `WP07-POS-05` | API payload used by client UI is an allowlisted projection, not raw decision/recommendation/evidence object. |
| `WP07-POS-06` | Page headers and states communicate page job, current released/pending state and safe next step. |
| `WP07-POS-07` | UI density is calm for client pages and compact/traceable only for internal decision detail. |

---

## 15. Negative Acceptance Criteria

| ID | Negative Acceptance Criterion |
|---|---|
| `WP07-NEG-01` | Before compliance release, client routes show no released content and no internal preview. |
| `WP07-NEG-02` | Advisor approval alone does not create client visibility. |
| `WP07-NEG-03` | Upload success alone does not create client visibility or evidence sufficiency. |
| `WP07-NEG-04` | AI Draft, internal rationale, analyst notes, advisor notes and compliance notes are absent from client UI/API/export-projection payloads. |
| `WP07-NEG-05` | Wrong tenant, wrong object, wrong role or unknown actor receives denied/hidden/empty safe response, not partial data. |
| `WP07-NEG-06` | Admin cannot manually turn on client visibility. |
| `WP07-NEG-07` | API error or projection failure fails closed; no stale internal payload is shown. |
| `WP07-NEG-08` | Client UI does not imply client acceptance, investment action, or autonomous advice after release. |
| `WP07-NEG-09` | Internal audit detail is not visible on client portal/mobile. |
| `WP07-NEG-10` | Held routes `064–067`, `069–071` are not elevated or referenced as V0.96 client-safe projection surfaces. |

---

## 16. Required Tests and Test Names

Codex must rebase test names against current suite and reuse existing files where appropriate. Do not duplicate current tests without reading them.

| Test File | Required Coverage |
|---|---|
| `tests/client-visibility-projection.spec.ts` | Projection allowlist, released safe summary, forbidden field exclusion. |
| `tests/client-visibility-proof.spec.ts` | Client visibility source proof and fail-closed negative cases. |
| `tests/true-ux-client-projection.spec.ts` | Portal/mobile no-release/released-safe UI states and no internal rails. |
| `tests/scf-p07-p09-trust-ui.spec.ts` | Trust UI flow for client-safe visibility if current naming exists. |
| `tests/p0-acceptance.spec.ts` | End-to-end positive and negative journey acceptance. |
| `tests/p0-api-contract.spec.ts` | Safe API envelope and no raw object leakage. |
| `tests/fail-closed-error-envelope.spec.ts` | Error state does not expose internal content. |
| `tests/true-ux-p0-safety.spec.ts` | No-overclaim copy and safety UI boundaries. |
| `tests/true-ux-density.spec.ts` | Calm client density vs internal decision density. |
| `tests/route-smoke.spec.ts` | Routes still render after refactor. |

Suggested test case names:

- `client projection shows no released content before compliance release`
- `advisor approval does not expose client-safe view`
- `released decision projection excludes AI draft and internal rationale`
- `client portal and mobile use identical fail-closed projection semantics`
- `wrong tenant cannot load released decision projection`
- `decision detail remains internal traceability surface`
- `client projection API returns allowlisted payload only`
- `projection API error preserves hidden state`
- `released copy does not imply client acceptance`

---

## 17. Validation Commands

Codex must adapt commands to current `package.json` scripts after WP-00 rebase.

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm playwright test tests/client-visibility-projection.spec.ts
pnpm playwright test tests/client-visibility-proof.spec.ts
pnpm playwright test tests/true-ux-client-projection.spec.ts
pnpm playwright test tests/p0-acceptance.spec.ts
pnpm playwright test tests/p0-api-contract.spec.ts
pnpm playwright test tests/fail-closed-error-envelope.spec.ts
pnpm playwright test tests/true-ux-p0-safety.spec.ts
pnpm playwright test tests/true-ux-density.spec.ts
pnpm playwright test tests/route-smoke.spec.ts
```

If scripts differ, record actual commands in the implementation evidence file and do not invent passing status.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| `NO_MANUAL_VISIBILITY_OVERRIDE` | Do not introduce a UI/API/schema path that manually turns on client visibility. |
| `NO_RAW_OBJECT_SERIALIZATION_TO_CLIENT` | Do not return raw `Decision`, `Recommendation`, `Evidence`, `AuditEvent` or compliance objects to client UI/API. |
| `NO_AI_DRAFT_CLIENT_LEAK` | AI Draft/internal rationale is internal-only. |
| `NO_ADVISOR_APPROVAL_AS_RELEASE` | Advisor approval cannot create client-visible state. |
| `NO_UPLOAD_TO_RELEASE` | Upload/evidence existence cannot create client visibility. |
| `NO_CLIENT_ACCEPTANCE_CLAIM` | Release/download/viewing must not be represented as client acceptance/action. |
| `NO_INTERNAL_AUDIT_TO_CLIENT` | Client UI must not show internal audit details. |
| `NO_HOLD_SCOPE_ELEVATION` | Do not pull committee/KYC/suitability/IPS held routes into V0.96. |
| `NO_SCREEN_GENERATION` | Do not generate or replace visual assets. |
| `NO_SCHEMA_REPLACEMENT` | Do not replace Prisma schema with patch schema. Schema decisions route to WP-14. |
| `NO_MAIN_BASED_TASK` | Do not use `main` as target or source for missing claims. |

---

## 19. Open Questions / Blockers

| Open Item | Blocker Type | Required Handling |
|---|---|---|
| Exact current projection helper names may differ. | `REQUIRES_REBASE` | WP-00 must identify actual helpers; reuse current files where possible. |
| Some client/decision APIs may already exist beyond prompt source list. | `REQUIRES_REBASE` | Inspect `app/api` and route tests before adding/hardening. |
| Decision schema may represent client-safe summary differently than control spec. | `REQUIRES_SCHEMA_ALIGNMENT` | Use existing schema; route gaps to WP-14, no blind replacement. |
| Client-safe evidence summary may need field mapping. | `REQUIRES_EVIDENCE_SCHEMA_MAPPING` | Coordinate with WP-03 and WP-14. |
| Export projection dependency must not duplicate WP-10. | `DOWNSTREAM_DEPENDENCY` | Document interface expectation only; leave export implementation to WP-10. |
| Screenshots in `artifacts/...` may exist but are not generation authorization. | `NO_GENERATION` | Use only as evidence if test-generated/current. |

---

## 20. Codex Execution Notes

1. Start by reading WP-00 outputs and current repo reality.
2. Do not assume older KB counts for APIs/tests/components are current.
3. Reuse existing projection/control-layer helpers if present; do not create parallel client visibility systems without reason.
4. Prefer allowlist projection over blacklist redaction.
5. Keep client UI calm and minimal; move traceability to internal decision detail only.
6. Treat copy as safety logic: every success/pending/denied text must avoid overclaiming downstream gates.
7. Every touched client payload must have at least one negative test for forbidden fields.
8. If a required field is missing from schema, record blocker and route to WP-14; do not replace schema in this WP.
9. If a current test already covers a case, strengthen it rather than duplicate it.
10. Mark WP-07 incomplete if any negative test cannot be expressed.

---

## 21. QA Matrix

| QA Check | Required Result |
|---|---|
| Source hierarchy preserved | `PASS_REQUIRED` |
| Current repo classified before edit | `PASS_REQUIRED` |
| `main` not used as target | `PASS_REQUIRED` |
| Client projection fail-closed | `PASS_REQUIRED` |
| AI Draft/internal rationale excluded | `PASS_REQUIRED` |
| Advisor approval not release | `PASS_REQUIRED` |
| Upload not release/evidence sufficiency | `PASS_REQUIRED` |
| Client portal/mobile parity | `PASS_REQUIRED` |
| Internal decision traceability present | `PASS_REQUIRED` |
| No internal audit on client | `PASS_REQUIRED` |
| No manual visibility override | `PASS_REQUIRED` |
| UX/IA refactor included where surfaces touched | `PASS_REQUIRED` |
| Positive and negative tests mapped | `PASS_REQUIRED` |
| No screen/image generation | `PASS_REQUIRED` |
| No blind schema replacement | `PASS_REQUIRED` |
| P1/HOLD routes not elevated | `PASS_REQUIRED` |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Role | ENGINE_v2 Role | Codex-Spark-like Convergence | Output in this Artefact |
|---|---|---|---|---|
| KB / UX Discovery | Extracted client-safe, fail-closed, density, no-overclaim, internal-only and decision-record evidence from KB context. | Normalized evidence into source hierarchy and task implications. | Chose direct WP-07 decisions over broad alternatives. | Sections 2–8 |
| Contradiction Control | Separated visual/client route presence from behaviour/projection proof. | Preserved full-workflow target, `main` false-gap, no visual proof and no schema replacement rules. | Converted contradictions into stop rules. | Sections 4, 18, 19 |
| Task Operationalization | Identified route/component/service surfaces and UX/IA refactor needs. | Produced task table with files, steps, acceptance, tests and stop rules. | Made implementation path concrete and ordered. | Section 9 |
| Safety / P0 Discipline | Focused on AI Draft leakage, advisor-not-release, upload-not-release, client fail-closed and admin non-bypass. | Translated into positive/negative acceptance and named test obligations. | Blocked completion without negative proof. | Sections 13–17 |
| QA | Checked no generation, no overclaim, no held-route elevation and no implementation inside artefact. | Produced QA matrix and validation commands. | Finalized Codex-ready task description. | Sections 17–22 |
