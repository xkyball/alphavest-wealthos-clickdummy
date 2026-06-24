# ALPHAVEST V0.96 — WP-12 No-Overclaim Microcopy + State Feedback — Deep Task Description

**Artefact status:** `WP12_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_CODEX_HANDOFF_INPUT`  
**Work Package:** `WP-12 — No-Overclaim Microcopy + State Feedback`  
**Mode:** Task description only. No implementation. No code changes. No screenshots. No generated screens. No visual assets.  
**Target implementation baseline:** `full-workflow` only.  
**Primary successor use:** Codex implementation after `WP-00` moving-baseline rebase confirms current copy, state helpers, route surfaces, tests and contradictions.

---

## 1. Executive Task Decision

`WP-12` turns AlphaVest V0.96 copy and state feedback into a **safety-critical product control layer**. It is not marketing copy cleanup and not cosmetic UX writing. The task is to make every user-visible message, CTA label, badge explanation, empty state, blocked state, success state and error state truthful about what has actually happened in the journey.

The core rule is strict:

> A message may name only the action that truly completed. It must not imply that a downstream gate has passed.

Therefore:

- Upload success is upload-only, not evidence sufficiency.
- Evidence sufficient is only after review, relevance, link and acceptance are proven.
- Analyst review is not Advisor approval.
- Advisor approval is not Compliance release.
- Compliance release is not client acceptance.
- Client-safe visibility is not raw internal visibility.
- Audit display is not audit persistence.
- Export preview is not export approval.
- Export approval is not download/share.
- Download/share is not client acceptance.
- Route access is not action permission.
- Action permission is not payload visibility.
- Admin authority is not a safety-gate bypass.

This WP must create a practical, reusable no-overclaim microcopy and feedback system for all V0.96 core surfaces: Evidence, Analyst Workbench, Advisor Approval, Compliance Decision Room, Decision Record, Client Portal/Mobile, Audit, Governance/Admin and Export.

**Implementation authorization:** Not in this artefact. Codex may implement later only after `WP-00` confirms current repo reality and after WP-01 to WP-11 have either established or confirmed the IA, density, surface, state and interaction primitives that this WP will use.

---

## 2. Source-of-Truth Lock

| Rank | Source | Use in this WP | Forbidden Use |
|---:|---|---|---|
| 1 | Current `full-workflow` repo / snapshot | Only target code reality for copy strings, state helpers, route components, APIs, tests and schema-backed states. | Do not derive target work from `main`. |
| 2 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | KB-based UX/IA evidence register and WP mapping. | Do not invent copy problems outside the evidence or current code. |
| 3 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary WP-12 goal, files, context and stop rules. | Do not expand beyond V0.96 touched surfaces. |
| 4 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Binding no-overclaim feedback rules, state vocabulary and route feedback obligations. | Do not weaken no-overclaim wording for nicer UX. |
| 5 | `STATE_SCREEN_SPEC.md` | State taxonomy: loading, error, empty, permission, blocked, needs evidence, release pending, client visibility hidden, export pending. | Do not generate state-screen images. |
| 6 | `DRAWER_MODAL_INTERACTION_CONTRACT.md` | Interaction lifecycle states that require feedback: open, cancel, submit, loading, validation, error, success, denied. | Do not treat visible modals/drawers as behaviour proof. |
| 7 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | RBAC, client visibility, AI Draft internal-only, no-unapproved-advice and admin non-bypass wording rules. | Do not allow copy to imply unauthorized visibility or advice release. |
| 8 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence sufficiency, audit persistence and export stage separation. | Do not let upload/export/audit copy imply proof that is not persisted. |
| 9 | `API_CONTRACT_MATRIX.md` and `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | Current API/schema fields that must support truthful UI state. | Do not claim API/schema presence is readiness. |
| 10 | `P0_TEST_ACCEPTANCE_MATRIX.md` | Existing proof slices and missing positive/negative tests. | Do not claim P0 is complete from current specs. |
| 11 | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` | Constrained implementation authority only. | Do not create new product scope, P1/HOLD elevation or new visual assets. |

Non-negotiable: `full-workflow` is the target. `main` is false-gap/legacy only. Markdown is control evidence, not code truth. Visual assets, status chips, buttons, modals and route presence are not behaviour proof.

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | Task Implication | Must Refactor Now? |
|---|---|---|---|---|---|---|
| Upload interaction is the strongest implemented product interaction, but upload success is not evidence sufficiency. | Interaction Reality Audit; Evidence/Audit/Export Contract; UX/IA Evidence Index | Routes `027–030`, upload feedback, WP-03/WP-12 | Feedback semantics / evidence safety | Critical | Replace upload success copy with upload-only wording and explicit review/sufficiency next step. | Yes. |
| Advisor Approval can look like client release if copy/layout is weak. | Feedback Contract; RBAC/Advice Boundary Contract; UX/IA Evidence Index | Routes `036–037`, WP-05/WP-12 | Gate semantics / microcopy | Critical | Advisor approval copy must say `waiting for compliance release`; no client visibility from approval. | Yes. |
| Compliance release is not client acceptance. | Feedback Contract; Evidence/Audit/Export Contract | Routes `038–045`, client routes `019–020`, WP-06/WP-07/WP-12 | Release semantics | Critical | Release success copy must state client-safe content is now available, not accepted or acted on by client. | Yes. |
| Client-facing payload must fail closed and avoid internal jargon. | RBAC/Visibility/Advice Contract; State Screen Spec | Routes `019–020`, WP-07/WP-12 | Client-safe visibility / microcopy | Critical | Client copy must hide internal workflow detail and show calm, released-only states. | Yes. |
| Audit timeline/display is not audit persistence proof. | Interaction Reality Audit; Evidence/Audit/Export Contract | Routes `042`, `051`, audit panels, WP-08/WP-12 | Audit truth | Critical | Audit copy must distinguish displayed rows, persisted events, unavailable audit and fail-closed actions. | Yes. |
| Export preview, approval and download/share are separate gates. | Evidence/Audit/Export Contract; UX/IA Evidence Index | Routes `054–058`, WP-10/WP-12 | Export semantics | Critical | Export copy must show stage-specific states: scope, redaction, preview, approval, manifest/download. | Yes. |
| Status chips/buttons are not gates. | Feedback Contract; Interaction Audit; UX/IA Evidence Index | Shared UI, WP-11/WP-12 | UI truth | Critical | Chip labels and CTA copy must not read as proof unless backed by service/state; disabled reasons required. | Yes. |
| Guidance panels can become decorative and compete with main content. | UX/IA Evidence Index; V0.96 source | Page header/guidance components, WP-01/WP-12 | Guidance / IA | Medium | Guidance copy must be contextual and action-oriented, not repeated ornamental text. | Yes where touched. |
| Too many equal CTAs and unclear next steps reduce task clarity. | UX/IA Evidence Index; CTA state evidence | Page headers, CTA cluster, route components | CTA hierarchy / microcopy | High | Every state needs one primary action label and secondary/destructive alternatives with consequences. | Yes. |
| Modals/drawers need lifecycle feedback. | Drawer/Modal Contract; WP-11 | Release, block, request evidence, export approval, role change modals | Interaction lifecycle / feedback | High | Modal copy must cover open/cancel/submit/loading/validation/error/success/denied states. | Yes. |
| P1/HOLD route visual refs do not authorize generation or scope expansion. | Route Scope Lock; Screen Generation Brief | Routes `064–067`, `069–071` | Scope control / copy | Critical | Copy may mark unavailable/deferred where navigation exposes them, but must not imply implementation. | Yes only if surfaced. |

---

## 4. Current Code / Route / Component Reality to Recheck

Before implementation, Codex must run read-only checks and record exact current state in the WP-00 delta register. The following files/modules are expected from the task source and KB, but current repo reality must win:

| Area | Files / Modules to inspect | Recheck Goal |
|---|---|---|
| Page header and guidance copy | `components/page-header.tsx`, `components/product-guidance-panel.tsx`, `lib/product-guidance.ts`, `lib/ux-content-hierarchy.ts` | Locate shared title/subtitle/guidance strings, state labels, page-job language and duplicated guidance. |
| Route demo/context copy | `components/route-demo-context-card.tsx`, `components/demo-session-panel.tsx`, `components/demo-actor-handoff-bar.tsx` | Identify demo limitation wording, actor handoff copy, safety preview copy and overclaim risks. |
| Journey panels | `components/scf-p04-p06-flow-panel.tsx`, `components/scf-p07-p09-trust-panel.tsx`, `components/scf-p10-p14-closure-panel.tsx` | Confirm copy consistency across scenario-flow panels and closure/trust story. |
| Main route screens | `components/client-intake-screen.tsx`, `components/internal-workflow-screen.tsx`, `components/decisions-governance-screen.tsx`, `components/communication-export-ops-screen.tsx`, `components/admin-tenant-setup-screen.tsx` | Inventory all upload/evidence/advisor/compliance/client/audit/admin/export feedback strings and CTA labels. |
| Shared state components | `components/ui/state-panel.tsx`, `components/ui/status-chip.tsx`, `components/ui/workflow-badge.tsx`, `components/ui/a11y-status.tsx`, `components/ui/guarded-action-button.tsx` | Determine whether labels are hard-coded, prop-driven, state-driven, or unsafe. |
| Feedback / copy tests | `tests/demo-session-panel-copy.spec.ts`, `tests/mvp-support-copy-cleanup.spec.ts`, `tests/true-ux-cta-state.spec.ts`, `tests/true-ux-p0-safety.spec.ts` | Confirm current assertion scope and missing copy/feedback safety tests. |
| API/service state sources | Current APIs from WP-00 rebase; likely `/api/demo-workflow`, `/api/documents`, `/api/documents/upload`, export/audit/evidence services | Ensure UI feedback uses real state sources where available and does not invent success. |

Reality labels to assign before edits: `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `BLOCKED`, `REQUIRES_REBASE`.

---

## 5. WP Problem Statement

AlphaVest V0.96 is a trust product. Its UX fails if messages imply more certainty, release, sufficiency, visibility, acceptance or proof than the system actually has.

The known risk is not only technical. It is semantic:

- The app may correctly block a release, but the UI can still make the user think it released.
- The app may store an upload, but the UI can still make the user think evidence is sufficient.
- The app may render an audit timeline, but the UI can still make the user think persistence is proven.
- The app may show an export preview, but the UI can still make the user think the package is approved.
- The app may show an advisor-approved status, but the UI can still make the user think the client can see it.

This WP makes feedback language, CTA copy and state wording part of the V0.96 safety boundary.

---

## 6. V0.96 Journey Role

`WP-12` is cross-cutting and applies to all V0.96 core journeys:

| Journey / Flow | Copy and Feedback Role | Failure if WP-12 is skipped |
|---|---|---|
| Evidence upload and sufficiency | Distinguish upload, extraction, review, insufficiency, sufficiency and linked evidence. | Upload-to-release illusion. |
| Analyst / AI Draft review | Mark AI/rules draft and internal rationale as internal-only; unsupported claims need evidence. | AI/client leakage or false confidence. |
| Advisor approval | State advisor approval as an internal human-review gate only. | Advisor approval mistaken as client release. |
| Compliance release/block/request evidence | Show blockers, preconditions, request-evidence path and release state precisely. | Compliance gate appears optional or already passed. |
| Decision record/client projection | Client sees only released safe summary or no released content. | Client-visible internal data risk. |
| Audit | Show persisted audit references or audit unavailable/fail-closed states. | Audit display mistaken for audit proof. |
| Governance/Admin | Explain denied admin actions without implying superuser authority. | Admin bypass illusion. |
| Export/redaction | Separate preview, approval, manifest/download/share and forbidden-payload exclusion. | Export leakage or premature client-package claim. |

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | WP-12 Treatment | Boundary |
|---|---|---|
| Route-catalog / journey confusion | Standardize journey terms across page headers and feedback: Evidence → Analyst → Advisor → Compliance → Client-safe View → Audit → Export. | WP-01 owns navigation structure; WP-12 owns wording consistency. |
| Weak page jobs and guidance | Page header copy must state page job, gate, blocker and next step without decorative repetition. | Do not redesign page header layout unless WP-01/WP-02 already touches it. |
| Too many equal CTAs | Copy must support one-primary-CTA state: primary verb names the actual next action; secondary labels are demoted. | WP-11 owns CTA component behavior. |
| Long-page sprawl | Feedback summaries should reduce cognitive load; state summaries go near the primary decision area. | WP-02 owns layout/density. |
| Empty/unused whitespace | Empty states must explain why there is no data and what the safe next action is. | No filler content. |
| Visual-only drawers/modals | Modal/drawer copy must include action consequence, validation requirements and cancel safety. | WP-11 owns primitive lifecycle. |
| Status chips pretending to be gates | Chip descriptions must be informational, not proof; use “Pending review” / “Waiting for release” unless backed by state. | WP-13/WP-14 own state source integration. |
| Client-visible internal data risk | Client copy must be calm, non-internal and fail-closed. | No internal jargon on client views. |
| Export stage confusion | Copy must enforce preview ≠ approval ≠ download ≠ client acceptance. | WP-10 owns export flow implementation. |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### Changes Now

- Create or normalize a no-overclaim copy/state vocabulary for V0.96 flows.
- Replace unsafe success/complete/done/released wording on touched routes.
- Add blocked, pending, denied, unavailable, needs-evidence and retry microcopy.
- Add state-specific primary CTA labels and secondary action wording.
- Add client-safe wording for portal/mobile: released-only, no internal jargon.
- Add modal/drawer confirmation copy for release, block, evidence request, role change and export approval.
- Add tests that fail when prohibited wording appears in client or safety-critical contexts.
- Ensure feedback copy can be driven by real state rather than hard-coded happy-path claims.

### Stays Out

- Broad brand tone overhaul.
- Marketing-site copy.
- New product names or renaming AlphaVest concepts without explicit product decision.
- Legal disclaimer drafting beyond safe product boundary language.
- New screens, image generation, state-screen generation or visual replacement.
- P1/HOLD route implementation or copy that implies those routes are ready.
- Full translation/i18n system unless already present and required by current code.
- Blind schema/API changes solely to support copy.

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| WP12-T01 | Recheck copy and feedback reality | Current repo may already include copy cleanup helpers/tests. | Route components, `lib/product-guidance.ts`, `lib/ux-content-hierarchy.ts`, copy tests | Inventory all V0.96 copy strings; classify as `SAFE`, `OVERCLAIM_RISK`, `AMBIGUOUS`, `CLIENT_UNSAFE`, `DUPLICATE`, `MISSING_STATE_COPY`; record in WP-00 delta. | Copy inventory exists before edits; stale assumptions are marked. | Static grep/report only; no code tests yet. | Yes, evidence-driven. | No edits before rebase; do not rewrite unrelated copy. |
| WP12-T02 | Define no-overclaim copy vocabulary | Copy must be consistent across flow. | `lib/product-guidance.ts`, `lib/ux-content-hierarchy.ts`, possible constants files | Create/extend copy map for action/state families: upload, evidence, analyst, advisor, compliance, client visibility, audit, admin, export. | Copy map uses consistent terms and names only completed action. | Unit/static test if copy map exists. | Yes. | Do not invent new product stage names conflicting with route/safety contracts. |
| WP12-T03 | Correct upload/evidence feedback | Upload success must not imply sufficiency. | `client-intake-screen.tsx`, documents/evidence components, upload API UI states | Replace upload success copy; add review-required, extraction-pending, insufficient, rejected, sufficient, linked, needs-more-evidence and retry copy. | Upload success says upload completed and evidence needs review; sufficiency text appears only when review/link/relevance/acceptance are true. | `tests/document-upload-flow.spec.ts`, add `tests/no-overclaim-copy.spec.ts` cases. | Yes. | No upload-to-release shortcut; no “Evidence complete” after upload alone. |
| WP12-T04 | Correct Analyst/AI Draft feedback | AI/rules draft must stay internal-only. | `internal-workflow-screen.tsx`, workbench/trigger components, demo workflow copy | Add internal-only labels for AI Draft/rationale; unsupported-claim and needs-evidence copy; reject/rebuild success copy that does not imply approval. | AI Draft is labelled internal on internal routes and absent from client/export copy. | P0 no-leakage tests; copy assertions for “internal-only” context. | Yes. | Do not expose AI Draft or internal rationale in client-safe copy. |
| WP12-T05 | Correct Advisor approval feedback | Advisor approval is not release. | `internal-workflow-screen.tsx`, advisor queue/detail, decision components | Replace approval success copy with “Advisor approved. Waiting for compliance release.”; add reject/request-changes copy; label internal comments. | Advisor approval never says released/client-visible. | Advisor copy negative test. | Yes. | Do not set or imply client visibility from advisor state. |
| WP12-T06 | Correct Compliance feedback | Compliance is release gate, but release is not client acceptance. | Compliance routes/components, release/block/request evidence modals | Add precondition copy: advisor approval required, evidence required, audit required, permission required; release success says client-safe content is available; block/request evidence copy includes next step. | Release/blocked/request-evidence states are explicit and actionable. | Compliance decision room tests and no-overclaim copy tests. | Yes. | Do not imply client accepted/acted; do not bypass audit/evidence. |
| WP12-T07 | Correct Client Portal/Mobile feedback | Client views fail closed and avoid internal jargon. | `client-intake-screen.tsx`, portal/mobile sections, visibility projection UI | Add copy for no released content, released summary available, evidence requested, uploaded document awaiting review, safe evidence summary. Remove internal workflow terms. | Client never sees AI Draft/internal notes/compliance notes/unreleased evidence wording. | Client-safe projection tests. | Yes, calm client copy. | No internal jargon or unreleased state details on client UI. |
| WP12-T08 | Correct Audit feedback | Display is not persistence. | Audit timeline/history components, `decisions-governance-screen.tsx`, audit service UI | Add persisted-event reference copy, audit unavailable copy, action-blocked-because-audit-unavailable copy. | UI distinguishes displayed audit rows from required persisted audit proof. | Audit persistence UI tests. | Yes. | Do not say “Audit complete” unless persisted event source is proven. |
| WP12-T09 | Correct Governance/Admin feedback | Admin is not superuser release authority. | Admin/governance screens, access request/roles/security UI | Add denied admin bypass copy; second-confirmation-required copy; governance-only authority wording; permission denied copy. | Admin UI clearly explains configuration scope and blocked safety-gate bypasses. | Admin non-bypass tests and copy assertions. | Yes. | Do not imply admin can force release/evidence/export/visibility. |
| WP12-T10 | Correct Export feedback | Preview/approval/download/share are separate. | Export route components, export service UI, manifest preview | Add scope-incomplete, redaction-pending, preview-ready-not-approved, approval-required, approved-ready-for-manifest, download/share-not-client-acceptance copy. | Export messages never imply approval from preview or acceptance from download/share. | Export redaction/copy tests. | Yes. | No forbidden payload, no “client accepted” language. |
| WP12-T11 | Normalize page header/guidance/CTA copy | Guidance must not be decorative and CTAs need clear consequences. | `page-header.tsx`, `product-guidance-panel.tsx`, `ux-cta-cluster`, route screens | For V0.96 surfaces, align page job/gate/blocker/next-step copy; remove duplicate guidance; ensure primary CTA labels describe actual action. | Header and CTA copy tell user where they are, why blocked/pending, and the next safe step. | `tests/true-ux-cta-state.spec.ts`, copy cleanup specs. | Yes. | Do not change visual design broadly; no P1/HOLD elevation. |
| WP12-T12 | Add no-overclaim copy test suite | Existing tests are proof slices. | `tests/demo-session-panel-copy.spec.ts`, `tests/mvp-support-copy-cleanup.spec.ts`, `tests/true-ux-cta-state.spec.ts`, new copy spec if needed | Add assertions for prohibited terms/phrases in specific contexts; assert safe phrases for upload/advisor/compliance/client/export. | Tests fail if overclaim copy returns. | `tests/no-overclaim-copy.spec.ts` or equivalent; existing copy tests updated. | Yes, test UX truth. | Do not rely on screenshot/image comparison. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### V0.96 Route Families

| Family | Routes | Copy / Feedback Focus |
|---|---|---|
| Client Portal/Mobile | `019–020` | No released content; released client-safe summary; evidence request; no internal jargon. |
| Documents/Evidence | `027–030`, `046–047` | Upload-only, review pending, insufficient, sufficient, rejected, linked, needs evidence. |
| Analyst / Workbench | `033–035` | AI Draft internal-only, unsupported claim, needs evidence, analyst reviewed/rejected/rebuilt. |
| Advisor | `036–037` | Advisor pending/approved/rejected/request changes; waiting for compliance release. |
| Compliance / Decision | `038–045` | Release preconditions, block, request evidence, released client-safe, decision submitted. |
| Governance/Admin | `008–010`, `048–051` | Admin denied, second confirmation, access request, audit required, no bypass. |
| Export | `054–058` | Scope, redaction, preview, approval, manifest/download/share stages. |
| Reference/P1/HOLD | `061–063`, `052–053`, `059–060`, `064–067`, `068–071` | Defer/hold wording only if surfaced; no implementation or readiness claim. |

### Components / Modules

- `components/page-header.tsx`
- `components/product-guidance-panel.tsx`
- `components/route-demo-context-card.tsx`
- `components/demo-session-panel.tsx`
- `components/demo-actor-handoff-bar.tsx`
- `components/client-intake-screen.tsx`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/admin-tenant-setup-screen.tsx`
- `components/scf-p04-p06-flow-panel.tsx`
- `components/scf-p07-p09-trust-panel.tsx`
- `components/scf-p10-p14-closure-panel.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/status-chip.tsx`
- `components/ui/workflow-badge.tsx`
- `components/ui/guarded-action-button.tsx`
- `components/ui/a11y-status.tsx`
- `lib/product-guidance.ts`
- `lib/ux-content-hierarchy.ts`

### APIs / Services / Schema Areas

WP-12 should not create APIs or schema changes. It must ensure copy/state feedback can be driven by truth from:

- Evidence/document services and upload APIs.
- Workflow/demo action responses after WP-13 hardening.
- Permission and visibility engines.
- Audit service and `AuditEvent` model.
- Export/redaction service and `ExportRequest` state.
- Schema fields for `Document`, `EvidenceRecord`, `Recommendation`, `Approval`, `ComplianceReview`, `Decision`, `AuditEvent`, `ExportRequest`, `Role`, `Permission`, `UserRole`.

---

## 11. Interaction Lifecycle Requirements

Every interaction feedback path must cover:

| Lifecycle Stage | Required Copy Behaviour |
|---|---|
| Initial / idle | State what the user can safely do now. |
| Disabled / gated | Explain why the action is disabled and what unlocks it. |
| Permission denied | Explain the action is not available for this role/scope without exposing sensitive detail. |
| Validation failed | Identify missing/invalid input and preserve safe user input. |
| Loading / submitting | Name the action being attempted; do not imply completion. |
| Success | Name only the completed action; never imply downstream gates. |
| Error | Explain recoverable/blocking failure and retry/cancel path. |
| Blocked | Name blocker and next safe path, e.g. request evidence or return to queue. |
| Audit unavailable | State safety action cannot complete until audit is available, where applicable. |
| Client-safe visibility unavailable | State no released content is available; do not leak internal state. |

---

## 12. State / Feedback / Microcopy Requirements

### Required Safe Vocabulary

| Concept | Preferred Copy Pattern | Forbidden / Risky Copy Pattern |
|---|---|---|
| Upload success | “Upload complete. Evidence is awaiting review.” | “Evidence complete”; “Ready for release” |
| Evidence sufficient | “Evidence reviewed, linked and accepted for this decision.” | “Document uploaded, evidence sufficient” |
| Analyst review | “Analyst review complete. Ready for advisor review.” | “Approved”; “Released” |
| AI Draft | “Internal AI/rules draft — not client visible.” | “Client recommendation”; “Advice ready” |
| Advisor approved | “Advisor approved. Waiting for compliance release.” | “Released to client”; “Client visible” |
| Compliance blocked | “Compliance blocked release. More evidence is required.” | “Failed”; “Complete” |
| Compliance released | “Compliance released a client-safe summary.” | “Client accepted”; “Advice executed” |
| Client no content | “No released content is available yet.” | Internal workflow details or draft status |
| Audit displayed | “Audit events available for this action.” | “Audit proven” unless persisted source is confirmed |
| Audit unavailable | “Action cannot complete because required audit logging is unavailable.” | “Completed; audit pending” for safety-critical actions |
| Export preview | “Preview generated. Approval is still required.” | “Export approved”; “Ready to send” |
| Export approved | “Export approved for redacted package generation.” | “Client accepted package” |
| Download/share | “Package downloaded/shared. This does not confirm client acceptance.” | “Client accepted”; “Action complete for client” |
| Admin denied | “This admin role cannot bypass release/evidence/export gates.” | “Superuser override” |

### Required Feedback Categories

- `UPLOAD_SUCCESS_UPLOAD_ONLY_FEEDBACK`
- `EVIDENCE_REVIEW_PENDING_FEEDBACK`
- `EVIDENCE_INSUFFICIENT_FEEDBACK`
- `EVIDENCE_SUFFICIENT_AFTER_REVIEW_FEEDBACK`
- `AI_DRAFT_INTERNAL_ONLY_FEEDBACK`
- `ADVISOR_APPROVED_NOT_RELEASED_FEEDBACK`
- `COMPLIANCE_RELEASED_CLIENT_SAFE_ONLY_FEEDBACK`
- `CLIENT_VISIBILITY_HIDDEN_FEEDBACK`
- `AUDIT_UNAVAILABLE_FAIL_CLOSED_FEEDBACK`
- `ADMIN_NON_BYPASS_DENIED_FEEDBACK`
- `EXPORT_PREVIEW_NOT_APPROVAL_FEEDBACK`
- `EXPORT_APPROVAL_NOT_DOWNLOAD_FEEDBACK`
- `DOWNLOAD_NOT_CLIENT_ACCEPTANCE_FEEDBACK`

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-12 Requirement | Negative Case |
|---|---|---|
| RBAC | Denied actions must say denied/disabled without implying hidden payload exists. | Role route access must not imply action rights. |
| Client visibility | Client copy must show only released client-safe states. | Client must not see internal draft, compliance notes, analyst notes or unreleased evidence wording. |
| Advice boundary | AI/rules draft and internal recommendation copy must remain internal-only. | Copy must not present draft as advice or client recommendation. |
| Evidence | Upload and sufficiency wording must be separate. | Upload alone must not produce sufficiency/release copy. |
| Compliance | Compliance release copy must require preconditions and not imply client acceptance. | Advisor-approved state must not show released/client-visible copy. |
| Audit | Audit copy must distinguish display from persistence. | Safety action cannot say complete when audit write failed/unavailable. |
| Export | Export copy must preserve stage separation and forbidden-payload exclusion. | Preview cannot be labelled approved/downloadable; download cannot mean client accepted. |
| Admin | Admin copy must make non-bypass explicit. | Admin cannot see override language for release, evidence sufficiency, client visibility or export approval. |

---

## 14. Positive Acceptance Criteria

- All V0.96 route families use consistent journey terminology.
- Every success message names only the exact completed action.
- Upload success copy explicitly says review/sufficiency remains pending.
- Advisor approval copy explicitly says compliance release is still required.
- Compliance release copy states client-safe content is available, not client acceptance.
- Client portal/mobile copy is calm, released-only and free of internal workflow jargon.
- Export copy preserves scope → redaction → preview → approval → manifest/download separation.
- Denied/blocked/disabled states explain why and what the safe next step is where appropriate.
- Page headers/guidance/CTA labels show page job, current gate, blocker and next step without decorative duplication.
- Copy tests assert safe wording for upload, advisor, compliance, client, audit, admin and export flows.

---

## 15. Negative Acceptance Criteria

- No client-facing route renders `AI Draft`, `internal rationale`, `analyst notes`, `compliance notes`, `unreleased recommendation`, `raw evidence`, or equivalent internal terms.
- No upload success path renders `evidence sufficient`, `ready for release`, `released`, or equivalent downstream completion wording.
- No advisor approval path renders `released to client`, `client visible`, or equivalent release wording.
- No compliance release path renders `client accepted`, `advice executed`, or equivalent client-action wording.
- No export preview path renders `approved`, `ready to send`, `download complete`, or equivalent later-stage wording unless the corresponding gate is proven.
- No audit display path renders audit persistence proof unless persisted event source is available.
- No admin/governance route renders superuser override copy for safety gates.
- No P1/HOLD route copy implies V0.96 readiness or implementation.
- No status chip alone is used as gate proof in copy or tests.

---

## 16. Required Tests and Test Names

Codex must recheck current test names and reuse/extend existing specs where possible. Suggested test coverage:

| Test Name | Purpose |
|---|---|
| `tests/no-overclaim-copy.spec.ts` | Cross-route prohibited/safe wording assertions for V0.96. |
| `tests/demo-session-panel-copy.spec.ts` | Demo/context copy does not claim production persistence or release. |
| `tests/mvp-support-copy-cleanup.spec.ts` | Support route copy does not imply product scope or gate completion. |
| `tests/true-ux-cta-state.spec.ts` | Primary CTA labels and disabled/blocked reasons are state-appropriate. |
| `tests/true-ux-p0-safety.spec.ts` | Client/internal/admin/export copy respects P0 safety boundaries. |
| `tests/document-upload-flow.spec.ts` | Upload success copy remains upload-only. |
| `tests/client-safe-projection.spec.ts` or existing equivalent | Client-facing copy excludes internal terms pre/post release. |
| `tests/export-redaction-copy.spec.ts` or export equivalent | Preview/approval/download wording remains separated. |

Required validation: tests must include both positive safe wording assertions and negative prohibited wording assertions.

---

## 17. Validation Commands

Codex must inspect `package.json` first and use actual available scripts. Candidate commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm playwright test tests/no-overclaim-copy.spec.ts
pnpm playwright test tests/demo-session-panel-copy.spec.ts
pnpm playwright test tests/mvp-support-copy-cleanup.spec.ts
pnpm playwright test tests/true-ux-cta-state.spec.ts
pnpm playwright test tests/true-ux-p0-safety.spec.ts
pnpm playwright test tests/document-upload-flow.spec.ts
pnpm playwright test tests/file-export-realism.spec.ts
```

If a listed test does not exist, Codex must either extend the closest existing spec or create the named spec only if consistent with repo conventions discovered in WP-00.

---

## 18. Stop Rules / Do-Not-Do Register

- Do not implement before WP-00 moving-baseline rebase.
- Do not change copy in a way that weakens legal/advice boundary or safety semantics.
- Do not make copy sound more production-ready than the system is.
- Do not imply autonomous advice.
- Do not make AI Draft client-visible.
- Do not imply upload equals evidence sufficiency.
- Do not imply Advisor Approval equals Compliance Release.
- Do not imply Compliance Release equals client acceptance or execution.
- Do not imply export preview equals export approval.
- Do not imply export download/share equals client acceptance.
- Do not imply audit display equals audit persistence.
- Do not imply admin can bypass gates.
- Do not elevate P1/HOLD routes through wording.
- Do not generate screens, images, visual assets or state-screen images.
- Do not introduce broad redesign or unrelated copy rewrites.
- Do not introduce new schema/API solely for copy unless WP-13/WP-14 proves it is necessary and authorized.

---

## 19. Open Questions / Blockers

| Question / Blocker | Routing |
|---|---|
| Current copy map may already exist under a different file name. | WP-00 rebase; inspect before creating new abstraction. |
| Some tests listed in source may not exist in current repo. | WP-00/WP-15 must reconcile existing specs and naming. |
| Current APIs may already return status labels that conflict with safe vocabulary. | WP-13 API/service integration. |
| Schema states may not cleanly distinguish all copy states. | WP-14 schema usage alignment. |
| Client-facing copy may need legal review language later. | Release evidence/handoff; not solved by WP-12. |
| P1/HOLD routes may appear in navigation. | WP-01/WP-16 must mark deferred/hold without implementation claims. |

---

## 20. Codex Execution Notes

1. Start by reading `AGENTS.md`, `package.json`, current route components, current tests and WP-00 delta register.
2. Do not create a new copy abstraction if an existing product-guidance/content hierarchy helper can be safely extended.
3. Prefer centralized copy constants/helpers for repeated safety-critical language.
4. Preserve route-specific nuance: internal workbench copy may be more operational; client copy must be calm and non-internal.
5. Add negative copy tests for prohibited phrases where possible; this is a safety requirement, not polish.
6. Copy changes must be paired with state/source checks where wording depends on actual gate state.
7. Keep all copy aligned to the locked V0.96 flow: Evidence → Analyst → Advisor → Compliance → Client-safe View → Audit → Export.
8. Any route/component not in V0.96 should be left untouched unless its navigation/copy risks scope overclaim.

---

## 21. QA Matrix

| QA Check | Required Result | Status for this Artefact |
|---|---|---|
| Uses `full-workflow` only | Yes | Specified |
| Blocks `main` as target truth | Yes | Specified |
| Incorporates KB UI/UX/IA evidence | Yes | Specified |
| Includes no-overclaim copy rules | Yes | Specified |
| Includes upload-not-sufficiency | Yes | Specified |
| Includes advisor-not-release | Yes | Specified |
| Includes compliance-not-client-acceptance | Yes | Specified |
| Includes export preview/approval/download separation | Yes | Specified |
| Includes audit display vs persistence | Yes | Specified |
| Includes admin non-bypass wording | Yes | Specified |
| Includes client-safe/fail-closed copy | Yes | Specified |
| Includes affected files/modules | Yes | Specified |
| Includes positive and negative acceptance | Yes | Specified |
| Includes tests and commands | Yes | Specified |
| Authorizes implementation in this artefact | No | Blocked |
| Authorizes screens/images/assets | No | Blocked |
| Authorizes P1/HOLD elevation | No | Blocked |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Contribution | ENGINE_v2 Contribution | Codex-Spark-like Convergence |
|---|---|---|---|
| KB / UX discovery | Extracted no-overclaim, microcopy, state feedback, gate-confusion and UI truth evidence across KB. | Classified evidence into task implications, severity and refactor-now decisions. | Selected only V0.96-relevant copy/state surfaces. |
| Contradiction control | Separated visual feedback from real gate proof; identified upload/advisor/compliance/export/audit semantic traps. | Converted traps into non-negotiable stop rules and negative acceptance criteria. | Removed broad copy/brand alternatives and focused on safety language. |
| Task decomposition | Mapped copy risks to Evidence, Analyst, Advisor, Compliance, Client, Audit, Admin and Export flows. | Produced concrete task table with files, steps, tests and acceptance criteria. | Made each subtask Codex-ready without allowing product/scope decisions. |
| UI/UX/IA integration | Connected microcopy to page job, CTA priority, state feedback, blocked/empty/denied recovery and client-safe UX. | Operationalized into route/component/test obligations. | Embedded refactor work only where surfaces are touched. |
| Safety / P0 discipline | Preserved advice boundary, AI internal-only, admin non-bypass, evidence, audit and export safety. | Added positive/negative tests and validation commands. | Kept implementation blocked until WP-00 rebase and final handoff execution. |

