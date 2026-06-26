# ALPHAVEST V0.96 — WP-14 Schema Usage Alignment for UI/Journey — Deep Task Description

**Work Package:** `WP-14 — Schema Usage Alignment for UI/Journey`  
**Release:** `V0.96 Core Journey + UX/IA Refactor`  
**Mode:** Codex-ready task description only. No implementation in this artefact.  
**ENGINE Combination:** ENGINE_v3 for KB / UX / IA discovery and contradiction control; ENGINE_v2 for operational task decomposition, acceptance criteria, negative tests and stop rules; Codex-Spark-like convergence for implementation-ready specificity.

---

## 1. Executive Task Decision

**Task decision:** `WP14_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_CODEX_EXECUTION_AFTER_WP00_REBASE`

WP-14 exists to make the AlphaVest schema usage trustworthy for the V0.96 journey UI. It must align existing Prisma models, domain types, service-derived states and UI status mappings so Evidence, Analyst Review, Advisor Approval, Compliance Release, Decision Record, Client-Safe Projection, Audit and Export surfaces can render truthful states without hardcoded chips, inconsistent strings, patch-schema assumptions or blind migrations.

This is not a schema-replacement task. The full-workflow schema remains the implementation baseline. Patch/control concepts may guide safety semantics, but Codex must first prove whether existing models/fields/enums/JSON policy fields and service-derived read models already represent the locked V0.96 states.

**Current local snapshot reality observed for this prompt run:**

- Prisma model count: **42**.
- Prisma enum count: **22**.
- API route files observed under `app/api/**/route.ts`: **15**.
- Top-level `lib` modules observed: **60**.
- Playwright/spec files observed under `tests/*.spec.ts`: **51**.
- Total files under `tests/`: **61**.

Older KB layers reported fewer APIs/specs in earlier snapshots. Codex must therefore execute WP-00 rebase first and treat old counts as historical evidence, not current implementation truth.

**Core implementation intent:**

> Use the existing full-workflow schema correctly, type/canonicalize state values for UI and service usage, avoid blind Prisma replacement, and request migrations only through a strict migration-decision protocol when no existing or service-derived representation can safely satisfy V0.96.

**Codex status:** `READY_FOR_CODEX_AFTER_WP00_REBASE_AND_CURRENT_SCHEMA_CONFIRMATION`

---

## 2. Source-of-Truth Lock

| Rank | Source | Role for WP-14 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current `full-workflow` repo / snapshot | Target implementation baseline | Inspect current Prisma schema, migrations, domain types, services, APIs, tests and UI mappings before edits | Do not implement from old counts or stale assumptions |
| 2 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | KB-derived UI/UX/IA evidence register and WP index | Use the known UI/UX/IA problem families and WP mapping | Do not treat it as code proof |
| 3 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary V0.96 WP source | Use WP-14 goal, target files, tests, stop rules and schema-usage scope | Do not skip current repo/schema rebase |
| 4 | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | Binding schema-control source | Preserve full-workflow 42-model / 22-enum baseline, patch-as-control-spec logic, field mapping rules | Do not replace full schema with patch schema |
| 5 | `API_CONTRACT_MATRIX.md` | API/schema dependency contract | Align request/response/payload fields to existing API safety obligations | Do not treat API presence as safety proof |
| 6 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | RBAC / visibility / advice-boundary rules | Ensure fields support route/action/object/payload separation and fail-closed client visibility | Do not allow manual client visibility override or admin bypass |
| 7 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence/audit/export safety semantics | Ensure schema usage supports evidence sufficiency, audit persistence and redacted export states | Do not treat upload row, audit row display or export preview as final proof |
| 8 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | No-overclaim UI state language | Bind status values to truthful microcopy and no-overclaim state labels | Do not allow schema status labels that imply later gates passed |
| 9 | `STATE_SCREEN_SPEC.md` and `DRAWER_MODAL_INTERACTION_CONTRACT.md` | UI state and lifecycle contracts | Ensure state labels map to data/service truth used by UI surfaces | Do not let UI invent state from visual mode/query/defaults |
| 10 | `P0_TEST_ACCEPTANCE_MATRIX.md` | Positive/negative proof obligations | Extend schema-alignment and safety tests | Do not claim existing tests prove full P0 |
| 11 | `ALPHAVEST_FULL_WORKFLOW_* v0.2–v0.7` KB layers | Historical source hierarchy and proof limits | Use for recovery logic, false-gap blocking and proof limits | Do not override newer current code reality |
| 12 | `main` repo / zip | False-gap history only | Explain contamination if a legacy claim appears | Never derive target tasks from `main` |

**Binding rule:** current `full-workflow` schema/code reality wins for implementation targets. KB artefacts define constraints, safety rules, known problem families and stop rules.

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | WP-14 Task Implication | Must Refactor Now? |
|---|---|---|---|---|---|---|
| Full-workflow schema is baseline; patch is control spec only | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`; v0.7 schema rebase | Prisma / domain layer | Source-of-truth control | Critical | Do not replace schema; map V0.96 needs to existing models first | Yes |
| Schema presence is not P0 proof | `P0_TEST_ACCEPTANCE_MATRIX.md`; v0.7 schema rebase | All safety-critical models | Proof discipline | Critical | Add/extend schema-alignment and safety tests | Yes |
| UI status values must not be hardcoded inconsistent labels | Prompt 00 Evidence Register; Interaction Audit | Status chips / filters / states | UI truth | Critical | Centralize canonical status mappings and UI display labels | Yes |
| Upload success is not evidence sufficiency | Evidence/Audit/Export Contract; Feedback Contract | Document/Evidence schema fields | Evidence semantics | Critical | Document/DocumentReview/EvidenceRecord fields must not imply sufficiency from upload alone | Yes |
| Advisor approval is not compliance release | RBAC/Advice Contract; Feedback Contract | Approval / ComplianceReview / Recommendation / Decision | Gate semantics | Critical | Status fields and type helpers must preserve separate states | Yes |
| Client-safe visibility is derived/fail-closed | RBAC/Visibility Contract; State Spec | Decision / Recommendation / Evidence / Export / client routes | Client visibility | Critical | No manual visibility override; UI projection should derive from release/redaction rules | Yes |
| AI Draft is internal-only | MVP Scope Lock; Journey Matrix; RBAC/Advice Contract | Recommendation / Trigger / Draft-like fields | Advice boundary | Critical | Avoid patch-only `AiDraft` model unless necessary; map internal draft to existing fields/service-derived state and forbid client/export exposure | Yes |
| Audit display is not persistence proof | Interaction Audit; Evidence/Audit Contract | AuditEvent / audit UI | Audit proof | Critical | Audit UI must reference persisted AuditEvent/correlation fields; missing audit blocks critical actions | Yes |
| Export preview, approval and download are separate | Evidence/Audit/Export Contract; API Matrix | ExportRequest / Export services / Export UI | Export safety | Critical | ExportRequest field usage must separate scope/redaction/approval/generated/download states | Yes |
| Current snapshot has more APIs/tests than older KB | WP-00/WP-13 source reality | Schema/API/test layer | Moving baseline | High | Rebase before migration decisions; update current tests rather than duplicating stale tasks | Yes |
| JSON/string taxonomy fields exist and need discipline | Schema reconciliation | PolicyDefinition, RolePermission, ExportRequest, Recommendation, etc. | Type safety / UI truth | High | Provide canonical helpers/validators before migration requests | Yes |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must recheck current repo reality before implementation. The list below is an inspection map, not a claim that every item needs changes.

### Schema and domain files

| File / Area | Why to inspect | Expected WP-14 decision |
|---|---|---|
| `prisma/schema.prisma` | Primary schema reality | Preserve baseline; map models/fields before requesting migrations |
| `prisma/migrations/**` | Existing migration history | Do not add migration without strict decision note and tests |
| `prisma/seed.ts` and screencast/seed scripts | Demo data state values | Ensure demo/seed values use canonical statuses and do not create false gate success |
| `lib/domain-types.ts` | Domain type helpers | Centralize or extend canonical state unions/mappings where current code already uses types |
| `lib/workflow-gate.ts` | Advisor/compliance/release gate semantics | Ensure fields used by gate logic separate advisor, compliance and release states |
| `lib/visibility-engine.ts` | Client-safe projection | Ensure projection derives from release/redaction fields and fails closed |
| `lib/evidence-service.ts` / `lib/evidence-review-service.ts` | Evidence sufficiency / review state | Ensure upload/review/link/sufficiency states have canonical mapping |
| `lib/audit-service.ts` | Audit persistence and correlation | Ensure critical state changes reference persisted AuditEvent-compatible fields |
| `lib/export-service.ts`, `lib/export-package-service.ts`, `lib/export-workflow-readmodel-service.ts` | Export lifecycle | Ensure scope/redaction/approval/generated/download status semantics are separate |
| `lib/permission-engine.ts` | Route/action/object/payload scope | Ensure fields used for object scope and tenant isolation are canonical and testable |
| `lib/product-guidance.ts`, `lib/ux-page-contract.ts`, `lib/ux-density.ts`, `lib/ux-content-hierarchy.ts` | UI truth/display labels | Ensure UI guidance consumes canonical state labels, not duplicated text logic |

### Models/concepts to map explicitly

| Concept | Existing full-workflow candidate(s) | WP-14 mapping rule |
|---|---|---|
| Tenant / actor scope | `ClientTenant`, `PlatformTenant`, `User`, `UserProfile`, `UserRole`, `Role`, `Permission`, `RolePermission`, `AccessRequest`, `SecondConfirmation` | Preserve tenant/object/action separation; no superuser shortcut |
| Document upload | `Document`, `DocumentVersion`, `DocumentExtraction` | Upload creates document/version/extraction candidate only; not sufficiency |
| Evidence review / link / sufficiency | `DocumentReview`, `DocumentLink`, `EvidenceRecord`, `EvidenceItem` | Sufficiency requires reviewed, linked, relevant, accepted/scoped evidence |
| AI/internal draft | `Trigger`, `Recommendation`, `RecommendationOption`, `DocumentExtraction`, service-derived state | Keep internal-only; do not create patch `AiDraft` unless proven unavoidable |
| Advisor approval | `Approval`, `Recommendation` fields/status refs | Advisor approval state must not set compliance release/client visibility |
| Compliance release/block/request evidence | `ComplianceReview`, `Recommendation`, `Decision`, `EvidenceRecord`, `AuditEvent` | Release requires advisor approval + evidence + compliance + audit preconditions |
| Decision record | `Decision`, `DecisionParticipant`, linked recommendation/evidence/audit refs | Decision must show source trail and client-safe projection state |
| Client-safe projection | `Decision`, `Recommendation`, `EvidenceRecord`, `ExportRequest`, `PolicyDefinition`, `visibility-engine` | Prefer service-derived projection over manual visibility flags |
| Audit proof | `AuditEvent` | Critical actions require persisted audit event/correlation references |
| Export lifecycle | `ExportRequest`, generated file/document references, export services | Scope/redaction/preview/approval/generated/download/share states remain separate |
| Review monitoring / P1 | `ReviewSchedule`, `QueueItem`, `DataQualityIssue`, `CallEvent` | Do not promote P1/HOLD via schema fields |

### Tests to inspect and extend where current repo supports them

- `tests/schema-alignment.spec.ts`
- `tests/p0-acceptance.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/client-visibility-projection.spec.ts`
- `tests/evidence-review-api.spec.ts`
- `tests/audit-fail-closed.spec.ts`
- `tests/phase8-export-workflow-api.spec.ts`
- `tests/export-safety.spec.ts`
- `tests/governance-non-bypass.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`

---

## 5. WP Problem Statement

The V0.96 UI/UX/IA refactor needs truthful state, but truth cannot be created by UI copy alone. If schema usage remains inconsistent, Codex could accidentally make the UI look correct while the underlying journey state is ambiguous.

The main risks WP-14 prevents:

- UI status chips use inconsistent hardcoded labels across Documents, Evidence, Advisor, Compliance, Decision, Audit and Export surfaces.
- Upload-related fields are interpreted as evidence sufficiency.
- Advisor approval status is interpreted as release status.
- Client visibility is treated as a manual boolean rather than a derived, fail-closed projection.
- AI/internal draft content is stored or surfaced in a way that leaks to client/export payloads.
- Audit UI displays rows without persisted `AuditEvent` linkage.
- Export status collapses preview, approval and download into one misleading “ready” state.
- Patch schema concepts (`AiDraft`, `ClientVisibilityEvaluation`, `PolicyException`, etc.) are blindly introduced even where full-workflow already has sufficient fields or service-derived logic.

WP-14 converts these into a schema-usage and type-mapping task.

---

## 6. V0.96 Journey Role

| Journey / Proof Spine | WP-14 role |
|---|---|
| `MJ-001` New family-office onboarding to first client-safe decision | Ensures user/tenant/role/object fields can carry the end-to-end journey without anonymous or cross-tenant leakage |
| `MJ-002` Evidence missing → upload → release | Ensures upload, review, link, sufficiency and evidence request states are distinct |
| `MJ-003` AI draft rejected/rebuilt with evidence | Ensures internal AI/rules draft state remains internal-only and maps to existing recommendation/trigger/evidence fields |
| `MJ-010` Admin role change cannot bypass compliance release | Ensures Role/UserRole/Permission/AccessRequest/SecondConfirmation fields do not grant release/visibility authority |
| `MJ-006` Cross-tenant access denied with audit proof | Ensures tenant/object scope fields and audit event fields support denial and no-leak proof |
| `MJ-005` Export package with forbidden internal payload redaction | Ensures ExportRequest/export service fields distinguish scope, redaction, approval, generation and share/download states |

---

## 7. UI / UX / Layout / IA Problem Mapping

| UI/UX/IA Problem | Schema Usage Requirement | Affected Surfaces |
|---|---|---|
| Status chips pretend to be gate proof | Chips must map to canonical status values derived from schema/service truth | Documents, Evidence, Advisor, Compliance, Export, Audit |
| Upload success overclaims evidence sufficiency | `Document`/upload state and `EvidenceRecord`/review state remain separate | Upload, Documents, Evidence Workbench, Compliance |
| Advisor approval overclaims release | `Approval`/advisor status remains separate from `ComplianceReview.releasedAt` / `Decision.releasedToClientAt` equivalents | Advisor Queue, Compliance Decision Room, Decision Record |
| Client UI shows internal data risk | Client-safe UI consumes projection fields/read-models only; internal fields are marked as forbidden for client/export | Portal, Mobile, Decision, Evidence, Export |
| Audit display overclaims persistence | UI audit rows require persisted AuditEvent source or explicit unavailable state | Audit Timeline, Compliance Audit, Governance Audit |
| Export preview overclaims approval/download | Export UI maps to distinct status phases and cannot collapse lifecycle into one `ready` label | Export Scope, Redaction, Preview, Download |
| Long pages mix unrelated states | Schema/read-models should produce page contract sections: summary, gate, blockers, next action, detail | Workbench, Compliance, Export, Evidence |
| Table/filter options inconsistent | Filters use canonical allowed status sets, not route-local strings | Evidence list, Advisor queue, Compliance queue, Export list, Audit history |
| Empty states lack meaning | Empty state derives from status: no data, no released content, missing evidence, permission denied, blocked | Client, Evidence, Queues, Audit, Export |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### Changes now

- Inventory schema fields used by V0.96 journey surfaces and classify as `CANONICAL`, `PARTIAL`, `STRING_TAXONOMY`, `JSON_POLICY`, `SERVICE_DERIVED`, `MISSING`, or `CONFLICTING`.
- Define canonical status/value maps in existing TypeScript helpers where appropriate.
- Align UI status chips, filters, state panels and microcopy to canonical value maps.
- Map Evidence, Recommendation, Approval, Compliance, Decision, Audit and Export states to existing schema fields or service-derived read models.
- Add tests proving the canonical state mapping prevents false UI states.
- Create a migration-decision note only if an unavoidable schema gap is proven after alternatives are exhausted.

### Stays out

- No blind replacement of `prisma/schema.prisma`.
- No patch-schema import as-is.
- No patch-only models by default (`AiDraft`, `ClientVisibilityEvaluation`, `PolicyException`, etc.).
- No migration for convenience, cosmetic labels or local UI simplification.
- No P1/HOLD route schema promotion.
- No production banking/custody/financial-advice automation schema expansion.
- No generated screens, generated state screens or image assets.

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| WP14-T01 | Produce current schema usage inventory for V0.96 | Older KB is useful but current repo has moved | `prisma/schema.prisma`, `lib/domain-types.ts`, `lib/*service*.ts`, `components/*screen.tsx`, `tests/schema-alignment.spec.ts` | List all models/fields/enums used by V0.96 journey; classify field usage; identify duplicated UI status strings | Inventory exists and labels each field usage `CANONICAL`, `PARTIAL`, `STRING_TAXONOMY`, `JSON_POLICY`, `SERVICE_DERIVED`, `MISSING`, `CONFLICTING` | Add/update `tests/schema-alignment.spec.ts` inventory assertions where feasible | Yes — status/filter/CTA state source map | No code edits before inventory; no migration request without inventory |
| WP14-T02 | Canonicalize V0.96 status taxonomy | UI cannot use inconsistent hardcoded statuses | `lib/domain-types.ts`, `lib/ux-page-contract.ts`, `lib/product-guidance.ts`, `components/ui/status-chip.tsx`, `components/ui/workflow-badge.tsx` | Define/extend canonical unions/maps for evidence, recommendation, advisor, compliance, decision, visibility, audit, export; map display labels and blocked states | Status chips and filters consume canonical maps; no route-local duplicate status labels for touched surfaces | `tests/schema-alignment.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/ui-state-boundaries.spec.ts` | Yes — chips, filters, page headers, no-overclaim copy | Do not rename DB enum/field unless migration protocol passes |
| WP14-T03 | Map Document/Evidence lifecycle fields | Upload-only must stay separate from sufficiency | `prisma/schema.prisma`, `lib/document-upload-service.ts`, `lib/evidence-review-service.ts`, `lib/evidence-service.ts`, `components/client-intake-screen.tsx`, `components/decisions-governance-screen.tsx` | Map `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceRecord`, `EvidenceItem`; ensure upload/review/link/sufficiency states are separate | UI can render uploaded, extraction pending, review pending, insufficient, rejected, sufficient, linked without guesswork | `tests/evidence-review-api.spec.ts`, `tests/document-upload-api.spec.ts`, `tests/p0-acceptance.spec.ts` | Yes — Evidence Workbench state truth | Stop if upload success sets sufficiency/release/client visibility |
| WP14-T04 | Map Recommendation / AI Draft / Analyst Review fields | AI draft stays internal-only | `prisma/schema.prisma`, `lib/workflow-gate.ts`, `lib/internal-workflow-demo-data.ts`, `lib/typed-workflow-command-bus.ts`, `components/internal-workflow-screen.tsx` | Identify internal summary/draft/rationale fields; mark forbidden client/export fields; decide service-derived AI draft state vs explicit field | Analyst UI can show internal draft/unsupported claim/rebuild state; client/export cannot include it | `tests/client-visibility-projection.spec.ts`, `tests/export-safety.spec.ts`, `tests/true-ux-p0-safety.spec.ts` | Yes — internal-only indicators and warning copy | Do not create `AiDraft` model unless proven unavoidable and approved |
| WP14-T05 | Preserve Advisor Approval vs Compliance Release separation | Advisor approval must not become release | `prisma/schema.prisma`, `lib/workflow-gate.ts`, `components/internal-workflow-screen.tsx`, `components/decisions-governance-screen.tsx` | Map `Approval`, `Recommendation`, `ComplianceReview`, `Decision`; define transition truth for `advisor_approved`, `compliance_pending`, `compliance_blocked`, `released_to_client` | Advisor UI and Compliance UI use separate states; no field mapping allows approval to imply release | `tests/workflow-gate.spec.ts`, `tests/p0-acceptance.spec.ts`, `tests/client-visibility-projection.spec.ts` | Yes — Advisor/Compliance copy and CTAs | Stop if any helper maps advisor approval to client visibility |
| WP14-T06 | Map Decision Record + client-safe projection fields | Client sees released/redacted summary only | `prisma/schema.prisma`, `lib/visibility-engine.ts`, `components/client-intake-screen.tsx`, `components/decisions-governance-screen.tsx` | Map Decision fields, release timestamps/actors, recommendation refs, evidence refs, visibility status and projection read model; avoid manual override | Client-safe projection is derived/fail-closed; internal fields are hidden/redacted | `tests/client-visibility-projection.spec.ts`, `tests/true-ux-client-projection.spec.ts` | Yes — Client Portal/Mobile fail-closed states | No manual `clientVisible=true` shortcut where release/redaction proof missing |
| WP14-T07 | Map AuditEvent persistence/correlation fields | Audit display must have persistence source | `prisma/schema.prisma`, `lib/audit-service.ts`, `components/ui/audit-timeline.tsx`, `components/decisions-governance-screen.tsx` | Confirm minimum audit fields for actor, role, tenant, target, previous/next state, result, reason, correlation; map UI audit refs to persisted source | Critical actions can reference persisted audit event or show unavailable/fail-closed state | `tests/audit-fail-closed.spec.ts`, `tests/phase6-audit-persistence.spec.ts` | Yes — audit unavailable/fail-closed states | Stop if audit UI rows are pure static proof for gate actions |
| WP14-T08 | Map ExportRequest/export lifecycle fields | Export stages must remain distinct | `prisma/schema.prisma`, `lib/export-service.ts`, `lib/export-package-service.ts`, `lib/export-workflow-readmodel-service.ts`, `components/communication-export-ops-screen.tsx` | Map export scope, redaction profile, preview, approvalRequired, approvedBy, generated file, expires, download/share/readiness fields | Export UI can distinguish scope incomplete, redaction pending, preview ready, approval pending, approved, generated/downloadable | `tests/phase8-export-workflow-api.spec.ts`, `tests/export-safety.spec.ts`, `tests/file-export-realism.spec.ts` | Yes — export status/CTA truth | Stop if preview equals approval or download/share |
| WP14-T09 | Map RBAC / tenant / object-scope schema usage | Route access/action/payload separation depends on fields | `prisma/schema.prisma`, `lib/permission-engine.ts`, `lib/admin-tenant-readmodel-service.ts`, `components/admin-tenant-setup-screen.tsx` | Confirm role/user/permission/object scope fields; document allowed scope expressions; align admin UI to field semantics | Wrong tenant/wrong object/wrong role cannot get payload or action authority | `tests/permission-engine.spec.ts`, `tests/governance-non-bypass.spec.ts`, `tests/control-layer-actor-scope.spec.ts` | Yes — admin denied/second-confirmation UX | Stop if admin role implies release/visibility/evidence/export authority |
| WP14-T10 | Create JSON/string taxonomy guardrails | Some fields may remain strings/JSON but need discipline | `lib/domain-types.ts`, `lib/*validation*.ts`, `lib/ux-page-contract.ts`, `lib/product-guidance.ts` | Add helper validators/canonical value maps for string/JSON policy fields where schema change is not needed; document allowed values | UI and services share canonical helpers; inconsistent raw strings reduced on touched surfaces | `tests/schema-alignment.spec.ts`, targeted unit tests if helpers exist | Yes — filters/status tables use shared values | Do not add DB enums just for label cleanup unless necessary |
| WP14-T11 | Apply migration decision protocol only if unavoidable | Schema changes are high-risk | `prisma/schema.prisma`, `prisma/migrations/**`, `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | For any missing field, evaluate existing field, JSON policy, relation, service-derived state, read model first; if still missing, create decision note with exact reason/tests/backward impact | Migration request includes rationale, impacted models, compatibility, rollback, tests and no-scope-expansion proof | `pnpm db:validate`, schema-alignment tests, affected P0 tests | Indirect — supports truthful UI | Stop if migration is for convenience, cosmetics or patch parity alone |
| WP14-T12 | Update schema alignment and UI truth tests | Schema usage must be proven | `tests/schema-alignment.spec.ts`, `tests/p0-acceptance.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/ui-state-boundaries.spec.ts` | Add tests for status taxonomy, no upload-to-sufficiency, advisor-not-release, client fail-closed, audit persisted ref, export stage separation | Tests fail if schema/service mapping lets UI overclaim gates | Listed tests pass or missing tests clearly labelled | Yes — tests enforce UI truth from schema truth | Do not mark coverage complete if only route smoke/chip labels pass |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### Routes / screen groups

| Route IDs / Groups | Role in WP-14 |
|---|---|
| `027–030` Documents / upload / extraction / verification | Document/evidence lifecycle status mapping |
| `033–035` Signals / Workbench / Trigger Detail | AI/internal draft, analyst review and evidence need states |
| `036–037` Advisor approval queue/detail | Advisor approval separate from release |
| `038–042` Compliance review/release/block/audit | Compliance gate, release/block/request evidence, audit fields |
| `043–047` Decisions / Evidence Vault / Detail | Decision record, evidence link, audit/visibility state |
| `019–020` Client portal/mobile | Client-safe projection fail-closed state |
| `048–051` Governance / access audit | RBAC, admin non-bypass, audit fields |
| `054–058` Export flow | Export scope/redaction/approval/download state mapping |
| P1/HOLD routes `052–053`, `059–060`, `064–071` | Must not be promoted by schema convenience |

### Components

- `components/client-intake-screen.tsx`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/admin-tenant-setup-screen.tsx`
- `components/ui/status-chip.tsx`
- `components/ui/workflow-badge.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/evidence-list.tsx`
- `components/ui/audit-timeline.tsx`
- `components/ui/data-table.tsx`

### APIs / services

- `/api/documents`, `/api/documents/upload`, `/api/documents/review`
- `/api/demo-workflow`
- `/api/audit-events`
- `/api/export-workflow`
- `/api/admin-tenants`
- `lib/workflow-gate.ts`
- `lib/visibility-engine.ts`
- `lib/permission-engine.ts`
- `lib/evidence-review-service.ts`
- `lib/evidence-service.ts`
- `lib/audit-service.ts`
- `lib/export-workflow-readmodel-service.ts`
- `lib/export-service.ts`
- `lib/export-package-service.ts`
- `lib/domain-types.ts`

### Schema areas

- Identity / Tenant / RBAC: `PlatformTenant`, `ClientTenant`, `User`, `UserProfile`, `Role`, `Permission`, `UserRole`, `RolePermission`, `AccessRequest`, `SecondConfirmation`
- Document / Evidence: `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceRecord`, `EvidenceItem`
- Advice / workflow: `Trigger`, `ActionItem`, `Recommendation`, `RecommendationOption`, `Approval`, `ComplianceReview`, `Decision`, `DecisionParticipant`
- Audit: `AuditEvent`
- Export: `ExportRequest`
- Policy / Visibility: `PolicyDefinition`, service-derived visibility logic

---

## 11. Interaction Lifecycle Requirements

WP-14 is not a UI primitive task, but it must ensure lifecycle actions have schema/service truth behind them.

| Lifecycle | Schema/service requirement | UI implication |
|---|---|---|
| Upload | Persist document/version/extraction/evidence candidate without sufficiency/release | Show upload-only success; continue to review state |
| Evidence review | Persist or derive reviewed/insufficient/sufficient/rejected/link state | Evidence UI can show blocker and next action |
| Analyst reject/rebuild | Represent internal-only draft and evidence need without client exposure | Analyst Workbench shows internal-only state |
| Advisor approve/reject | Separate advisor outcome from compliance release | Advisor UI says waiting for compliance |
| Compliance release/block/request evidence | Represent preconditions, release/block result and audit refs | Compliance Decision Room disables/rejects unsafe actions |
| Client projection | Derived from released/redacted/client-safe state | Portal/Mobile fail closed |
| Audit write | Persisted AuditEvent or failure state | UI shows audit source or blocks critical action |
| Export preview/approval/download | Separate state fields/service-derived steps | Export UI cannot overclaim readiness |

---

## 12. State / Feedback / Microcopy Requirements

| State Family | Canonical meaning | Forbidden overclaim |
|---|---|---|
| `upload_success_upload_only` | File transfer and document row succeeded | “Evidence sufficient” / “Ready to release” |
| `evidence_review_pending` | Evidence exists but not accepted | “Evidence complete” |
| `evidence_insufficient` | Evidence reviewed and rejected/insufficient | “Release allowed” |
| `advisor_approved` | Advisor completed advisor step | “Released to client” |
| `compliance_pending` | Compliance still required | “Client can view” |
| `compliance_released` | Compliance release passed with preconditions | “Client accepted” |
| `client_hidden_no_release` | No released client-safe projection | Displaying internal state as preview |
| `audit_unavailable` | Audit proof unavailable | Showing static audit row as proof |
| `export_preview_ready` | Preview generated/scoped | “Approved” / “Download ready” |
| `export_approved` | Export approval passed | “Client accepted” |
| `permission_denied` | Actor lacks route/action/object/payload permission | Hiding denial reason where recovery is needed, or showing action as available |

Codex must update display-label helpers and UI copy only through canonical status maps where practical.

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-14 requirement | Negative case to preserve |
|---|---|---|
| RBAC | Schema usage must support tenant/object/action/payload separation | Route access cannot expand payload/action authority |
| Client visibility | Projection must be derived/fail-closed | Unreleased/internal content cannot appear in client routes |
| Advice boundary | AI/internal draft fields are internal-only | AI draft/internal rationale cannot appear in client/export payload |
| Evidence sufficiency | Upload/review/link/sufficiency are distinct | Upload alone cannot release or export |
| Advisor/Compliance | Approval and release are separate | Advisor approval cannot release |
| Audit | Critical gate actions require persisted audit event/correlation | Missing audit cannot silently complete release/export/permission change |
| Export | Scope/redaction/approval/generated/download states separate | Preview cannot equal approval/download; forbidden payload excluded |
| Admin non-bypass | Admin field privileges do not bypass workflow gates | Admin cannot set release/visibility/evidence/export approval directly |

---

## 14. Positive Acceptance Criteria

| Acceptance ID | Positive Acceptance |
|---|---|
| WP14-POS-001 | Current schema inventory exists and identifies all models/fields used by V0.96 journey surfaces. |
| WP14-POS-002 | Canonical status maps exist for Evidence, Recommendation/Advisor, Compliance, Decision/Visibility, Audit and Export state families where the UI uses labels/filters/chips. |
| WP14-POS-003 | Document upload state maps separately from evidence review and sufficiency state. |
| WP14-POS-004 | Advisor approval maps separately from compliance release and client visibility. |
| WP14-POS-005 | Client-safe projection has clear field/service-derived source and fail-closed default. |
| WP14-POS-006 | Audit UI state references persisted audit source or explicit audit-unavailable state. |
| WP14-POS-007 | Export status mapping distinguishes scope, redaction, preview, approval, generated/downloadable/share states. |
| WP14-POS-008 | JSON/string taxonomy fields have TypeScript helper guards or documented canonical values where schema changes are not required. |
| WP14-POS-009 | Any proposed migration has an explicit decision note with alternatives considered, P0 impact, tests and backward compatibility. |
| WP14-POS-010 | Schema alignment tests and affected UI truth/P0 tests pass or open blockers are labelled honestly. |

---

## 15. Negative Acceptance Criteria

| Acceptance ID | Negative Acceptance |
|---|---|
| WP14-NEG-001 | Patch schema is not used to replace full-workflow schema. |
| WP14-NEG-002 | No new patch-only model is added unless the migration-decision protocol proves necessity and receives explicit approval. |
| WP14-NEG-003 | Upload success cannot set or imply evidence sufficiency, compliance release, export approval or client visibility. |
| WP14-NEG-004 | Advisor approval cannot set or imply compliance release or client visibility. |
| WP14-NEG-005 | Client routes cannot receive AI Draft, internal rationale, analyst notes, compliance notes or unreleased evidence through schema/service mapping. |
| WP14-NEG-006 | Admin role/permission field usage cannot bypass evidence, audit, compliance, visibility or export gates. |
| WP14-NEG-007 | Export preview cannot set or imply approval/download/share/client acceptance. |
| WP14-NEG-008 | Audit display cannot be treated as persisted proof without persisted `AuditEvent`/correlation source. |
| WP14-NEG-009 | Status labels cannot be hardcoded differently across touched surfaces for the same canonical state. |
| WP14-NEG-010 | No migration is introduced for UI cosmetics, convenience or route-local label cleanup. |

---

## 16. Required Tests and Test Names

Codex should reuse existing tests if present and extend them rather than duplicate blindly.

| Test Name | Purpose | Expected Scope |
|---|---|---|
| `tests/schema-alignment.spec.ts` | Canonical status maps and schema usage inventory | Main WP-14 proof |
| `tests/p0-acceptance.spec.ts` | Core positive journey and negative safety proof | Ensure schema usage supports full journey |
| `tests/workflow-gate.spec.ts` | Advisor/compliance/release separation | Prevent approval-to-release collapse |
| `tests/client-visibility-projection.spec.ts` | Client-safe fail-closed projection | Prevent internal field leakage |
| `tests/evidence-review-api.spec.ts` | Evidence review/sufficiency mapping | Prevent upload-to-sufficiency shortcut |
| `tests/document-upload-api.spec.ts` | Upload-only status and validation | Prevent upload overclaim |
| `tests/audit-fail-closed.spec.ts` | Audit persistence/fail-closed semantics | Prevent audit display-only proof |
| `tests/phase8-export-workflow-api.spec.ts` | Export workflow state separation | Scope/redaction/preview/approval/download separation |
| `tests/export-safety.spec.ts` | Forbidden payload exclusion | Prevent AI/internal notes/export leakage |
| `tests/governance-non-bypass.spec.ts` | Admin non-bypass | Ensure schema permission usage is not bypass |
| `tests/true-ux-p0-safety.spec.ts` | UI truth bound to canonical states | Prevent status chip / copy overclaim |
| `tests/ui-state-boundaries.spec.ts` | State labels, disabled actions, fail-closed states | Ensure UI state taxonomy matches schema/service truth |

---

## 17. Validation Commands

Codex should run the available commands from current `package.json`. If a command does not exist, Codex must report it and run the nearest current equivalent.

```bash
pnpm db:validate
pnpm lint
pnpm typecheck
pnpm playwright test tests/schema-alignment.spec.ts
pnpm playwright test tests/workflow-gate.spec.ts tests/client-visibility-projection.spec.ts tests/evidence-review-api.spec.ts tests/audit-fail-closed.spec.ts tests/phase8-export-workflow-api.spec.ts tests/export-safety.spec.ts tests/governance-non-bypass.spec.ts tests/true-ux-p0-safety.spec.ts tests/ui-state-boundaries.spec.ts
```

If full Playwright runtime is too large, run the targeted WP-14 subset first and document what was not run.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| `NO_BLIND_SCHEMA_REPLACEMENT` | Do not replace full-workflow schema with patch schema or planning schema. |
| `NO_PATCH_MODEL_BY_DEFAULT` | Do not add `AiDraft`, `ClientVisibilityEvaluation`, `PolicyException`, etc. merely because patch docs mention them. |
| `NO_MIGRATION_FOR_CONVENIENCE` | Do not add migrations for cosmetic labels, local UI convenience or avoidable status typing. |
| `NO_UPLOAD_TO_RELEASE` | Upload/status fields must not unlock sufficiency/release/export/client visibility. |
| `NO_ADVISOR_TO_RELEASE_COLLAPSE` | Advisor approval fields must not equal compliance release. |
| `NO_CLIENT_INTERNAL_PAYLOAD` | Client-safe projection must hide internal/AI/compliance/analyst/unreleased fields. |
| `NO_ADMIN_BYPASS` | Admin role/permission fields must not bypass controlled gates. |
| `NO_AUDIT_DISPLAY_ONLY_PROOF` | UI audit rows without persisted source do not prove audit. |
| `NO_EXPORT_STAGE_COLLAPSE` | Preview, approval, generation, download/share and client acceptance remain separate. |
| `NO_P1_HOLD_PROMOTION` | Do not add schema fields or UI states that promote P1/HOLD routes into V0.96. |
| `NO_GENERATED_SCREENS` | No visual/screen/state-screen/image generation. |
| `NO_STATUS_LABEL_FORKING` | Do not create route-local status strings when canonical maps exist or can be created safely. |

---

## 19. Open Questions / Blockers

| Question / Blocker | How Codex should handle it |
|---|---|
| Current repo schema differs from uploaded KB baseline | Current `full-workflow` reality wins; document delta in WP-00 and WP-14 inventory |
| Existing field can represent state but name differs from patch/control spec | Use `RENAMED_FIELD_MATCH` / `SEMANTIC_FIELD_MATCH`; do not create duplicate field |
| Existing field is a string/JSON but safe with helper validation | Prefer helper/validator/read-model discipline before migration |
| Existing field cannot represent locked V0.96 state safely | Create migration decision note; do not auto-migrate without P0 impact proof |
| UI needs state that should be runtime-derived only | Use `SERVICE_DERIVED_FIELD` / read-model; do not persist derived state unless necessary |
| Tests reveal contradictory state semantics | Stop and label `CONFLICTING`; do not patch around it with copy only |
| P1/HOLD route requires schema support | Defer unless explicitly unlocked by scope decision |

---

## 20. Codex Execution Notes

1. Start with WP-00 current repo reality and schema inventory before editing.
2. Read `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`, but treat it as control evidence, not live code truth.
3. Inspect `prisma/schema.prisma` directly in the current target repo.
4. Search all usages of each candidate field before changing helpers or mapping.
5. Prefer canonical TypeScript helpers and service-derived read models over migrations.
6. Where UI needs a status, bind the label to canonical source state and no-overclaim microcopy.
7. Use tests to prove negative cases, not just happy path labels.
8. Record every migration decision, including why existing fields/read models are insufficient.
9. Keep changes inside V0.96 touched surfaces; do not promote P1/HOLD/reference-only work.
10. Update docs/status only if current repo conventions require it and proof exists.

---

## 21. QA Matrix

| QA Check | Required Result |
|---|---|
| Current schema inspected directly | PASS required before edits |
| Full-workflow baseline preserved | PASS |
| Patch schema not blindly imported | PASS |
| Status taxonomy centralized for touched surfaces | PASS |
| Upload-only and evidence-sufficiency states separated | PASS |
| Advisor approval and compliance release separated | PASS |
| Client-safe projection fail-closed | PASS |
| AI/internal draft forbidden from client/export payloads | PASS |
| Audit persistence source mapped | PASS |
| Export lifecycle stages separated | PASS |
| Admin non-bypass preserved | PASS |
| JSON/string fields guarded where kept | PASS or documented blocker |
| Migration decision protocol applied | PASS if migration proposed; N/A if no migration |
| Positive and negative tests updated | PASS |
| No P1/HOLD route promotion | PASS |
| No generated screen/image asset | PASS |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Contribution | ENGINE_v2 Contribution | Codex-Spark-like Convergence |
|---|---|---|---|
| KB / UX / IA discovery | Extracted the problem that UI truth depends on schema/service truth and not static labels | Converted evidence into explicit source hierarchy and task constraints | Chose a schema-usage task, not a broad schema redesign |
| Contradiction control | Preserved current snapshot reality while keeping older KB as control evidence | Labelled old counts as historical and required WP-00 rebase | Prevented stale schema/API/test assumptions from becoming tasks |
| Schema reasoning | Identified patch-vs-full-schema risks and semantic field mapping needs | Produced field/model/concept mapping tables and stop rules | Required mapping before migrations |
| UX/IA integration | Connected status chips, filters, copy, CTA state and client-safe UI to schema truth | Added UI refactor requirements inside schema task where surfaces depend on status values | Kept UI improvements tied to V0.96 surfaces only |
| Safety / P0 discipline | Identified upload-to-release, advisor-release, AI leak, admin bypass, audit display and export collapse risks | Added positive/negative acceptance and required tests | Made test proof mandatory before completion |
| Operationalization | Framed current-code rechecks and affected areas | Decomposed into WP14-T01 through WP14-T12 with files, steps, criteria and tests | Produced Codex-ready instructions without implementation or product-scope expansion |

**Final WP-14 readiness decision:** `READY_FOR_CODEX_AFTER_WP00_REBASE_AND_CURRENT_SCHEMA_CONFIRMATION`.
