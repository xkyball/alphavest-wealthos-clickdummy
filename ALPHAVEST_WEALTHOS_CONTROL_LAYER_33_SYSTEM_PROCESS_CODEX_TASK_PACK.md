# ALPHAVEST_WEALTHOS_CONTROL_LAYER_33_SYSTEM_PROCESS_CODEX_TASK_PACK.md

**Generated:** 2026-06-21  
**Mode:** Codex Task Pack / Implementation Task Specification only. Keine Implementierung. Keine Codeänderung. Keine Codex-Ausführung. Keine Testausführung. Keine Screen-, State-Screen-, Image-, API- oder Schema-Generierung.  
**Target repository:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`  
**Target branch:** `full-workflow`  
**Primary target codebase:** `alphavest-wealthos-clickdummy-full-workflow.zip`  
**Purpose:** Detaillierte Codex-Implementierungsaufgaben für alle 33 AlphaVest-Systemprozesse als generische WealthOS-Control-Layer-Architektur, auf der spätere User Journeys beweisbar werden.

---

## 1. Executive Decision

**Artefaktstatus:** `CONTROL_LAYER_33_SYSTEM_PROCESS_CODEX_TASK_PACK_ACCEPTED_WITH_EXECUTION_DEPENDENCIES`  
**Task-Pack-Zweck:** Dieses Artefakt übersetzt die 33 Systemprozesse aus dem Journey-/Process-Atlas in detaillierte Codex-Implementierungsaufgaben. Es ist bewusst kein Journey-by-Journey-Featureplan, sondern eine Control-Layer-Architektur, die spätere Journeys und P0-Safety-Cases beweisbar macht.

**Architekturprinzip:** Implementiere zuerst die generische WealthOS-Prozessmaschine:

`ActorContext → Tenant/Object Scope → RBAC PermissionDecision → Payload VisibilityProjection → Document/Evidence Control → Workflow/Advice Boundary Gate → Audit Guard → Compliance Release → Client Visibility Projection → Export Redaction/Approval → Fail-Closed Error/Feedback`.

Erst danach sollen User Journeys, Canonical Paths und Demo-/Produktpfade als Prozesspfade über diese Engines bewiesen werden.

**Codex darf später, nach separater Ausführung dieses Task Packs im Repository:**

* bestehende Services/Engines härten oder neue interne Control-Layer-Module anlegen, wenn keine bestehende Fläche passt,
* bestehende API-Routen härten,
* bestehende Schemafelder korrekt verwenden,
* UI-/API-States und Error Envelopes verdrahten,
* P0-positive und P0-negative Tests ergänzen,
* Seed-/Fixture-Daten für P0-Testrollen ergänzen, soweit keine Migration nötig ist.

**Codex darf nicht entscheiden:** Produktumfang, Routen-Scope, P1/HOLD-Elevation, neue Screens, neue State-Screens, neue Images, blindes Prisma-Schema-Replacement, Prisma-Migrationen, neue API-Routen ohne `API_DECISION_REQUIRED`, autonome Advice-Entscheidungen, Client-visible AI Draft, Admin Bypass oder `main`-derived Tasks.

**Gesamtentscheidung der Task-Klassifikation:**


| Task Treatment | Anzahl | Bedeutung |
| --- | --- | --- |
| IMPLEMENTATION_READY Varianten | 26 | Safety-critical, foundation, support, internal-only und MVP_SUPPORT-Control-Layer-Tasks mit direkter Umsetzungsreife, aber nur innerhalb Final-Handoff-Constraints. |
| CONDITIONAL_SUPPORT | 1 | Data Quality kann als unterstützende Gate-Härtung umgesetzt werden, darf aber nicht zur primären Journey werden. |
| P1_DEFERRED / INTERNAL_ONLY_GUARD | 2 | Review/Monitoring darf nur als interner Guard/no-auto-advice behandelt werden, nicht als vollständige P1-Implementierung. |
| SPEC_REQUIRED / CONTROL_LAYER_CANDIDATE | 4 | Offboarding-/Retention-Controls erhalten Task-/Contract-Cards, aber keine ungeprüfte MVP-Vollimplementierung. |

**Nicht-Implementierungsstatus dieses Artefakts:** `TASK_PACK_ONLY_NOT_EXECUTED`. Dieses Markdown definiert Tasks; es führt nichts aus.

---

## 2. Source-of-Truth Lock

| Rang | Source | Verwendung im Task Pack | Verbot | Task-Konsequenz |
| --- | --- | --- | --- | --- |
| 1 | ALPHAVEST_COMPLETE_USER_JOURNEY_PROCESS_ATLAS.md | 33 Systemprozesse, Capability Universe, Journey Register, Input-/Output-Kataloge, Canonical Paths, Offboarding Deep Dive | Nicht als Implementierungsbeweis behandeln | Alle 33 SPs müssen Coverage und Task-/Coverage-Card erhalten. |
| 2 | FINAL_CODEX_IMPLEMENTATION_HANDOFF.md | Finaler Constraint-Rahmen, Stop Rules, Target Codebase full-workflow | Kein Freibrief für Scope-Ausweitung | Tasks dürfen nur innerhalb locked MVP/MVP_SUPPORT und constraints executable werden. |
| 3 | FINAL_CODEX_TASK_MASTER.md | Bestehende Task-Logik, P0-Pflichten, Blocker, Do-not-create Items | Nicht ungeprüft duplizieren | Dieses Pack refokussiert auf generische Control Layer. |
| 4 | ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md | Foundation Requirements, positive/negative Akzeptanz | Nicht als Codebeweis verwenden | P0 Foundation als Test- und Task-Pflicht übernehmen. |
| 5 | ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md | MVP/P1/Hold-Journey-Priorisierung, Auth-Korrektur | Keine Journey-Ausweitung | MVP-Spine bleibt MJ-001/002/003/010/006/005. |
| 6 | P0_TEST_ACCEPTANCE_MATRIX.md | Vorhandene Proof-Slices und fehlende Tests | Proof-Slices nicht überclaimen | Jede Safety-Task braucht positive und negative Tests. |
| 7 | SCHEMA_FIELD_LEVEL_RECONCILIATION.md | Full-workflow Schema Baseline und Field-Level Safety | Kein blindes Patch-Schema-Replacement | Bestehende 42 Modelle/22 Enums nutzen; keine Migration autorisieren. |
| 8 | API_CONTRACT_MATRIX.md | Vier bestehende API-Routen und API Safety Contracts | API-Präsenz nicht als Safety-Beweis | Bestehende APIs härten; neue APIs nur als API_DECISION_REQUIRED. |
| 9 | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md | Evidence Sufficiency, Audit Persistence, Export/Redaction Safety | Upload/Export/Audit-UI nicht als Safety Proof | Evidence/Audit/Export Tasks müssen Fail-Closed und Negativtests enthalten. |
| 10 | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md | RBAC, Payload Visibility, AI Draft internal-only, No-unapproved-advice, Admin Non-Bypass | Route Access nicht als Payload Visibility | Permission und payload projection werden getrennte Engine-Tasks. |
| 11 | FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md | No-overclaim feedback and fail-closed messaging | Feedback nicht als Implementierungsbeweis | UI/API Fehlerhüllen und Success-Wording müssen Gate-semantisch korrekt sein. |
| 12 | DRAWER_MODAL_INTERACTION_CONTRACT.md | Overlay-/Wizard-/Upload-Lifecycles | Sichtbare Overlays nicht als Lifecycle-Beweis | UI-State Tasks nur Verdrahtung, keine Screen-Generierung. |
| 13 | STATE_SCREEN_SPEC.md | Route- und Flow-State Requirements | Keine State-Screen-Bilder | States als Code-/Feedback-Verhalten, nicht als neue Assets. |
| 14 | ROUTE_SCOPE_LOCK.md + ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md | 71-Routen-Universum, Scope Labels, Visual-Proof-Limits | Keine Route-Reklassifikation, PNGs nicht als Verhalten | Tasks müssen route scope respektieren; 064–071 bleiben held/deferred. |
| 15 | MVP_SCOPE_LOCK.md | MVP Boundary, Non-Goals, P0 Scope | MVP nicht unkontrolliert erweitern | P1/HOLD/FUTURE nicht heimlich zu MVP machen. |
| 16 | ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md | Schema/domain/patch rebase | Schema gate nicht als passed behandeln | Schema Alignment statt Schema Replacement. |
| 17 | ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md | Real/partial/static/deterministic interaction truth | Visual/static states nicht überclaimen | Tasks müssen Lifecycle und Tests ergänzen, nicht UI-Präsenz feiern. |
| 18 | ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md | Target code inventory: routes/APIs/schema/tests/assets | Inventory nicht als Readiness Proof | Alle Target Files vor Edit prüfen. |
| 19 | alphavest_mvp_artifact_completion_patch.zip | MVP Control Spec only | Nicht blind ersetzen | Control-Begriffe nur als Safety-/Domain Input. |
| 20 | alphavest-wealthos-clickdummy-full-workflow.zip | Primary Target Codebase | Nicht annehmen, dass alles fertig ist | Nur diese Codebasis als Ziel verwenden. |
| 21 | alphavest-wealthos-clickdummy-main.zip | False-gap source only | Niemals target truth | Keine main-derived Tasks. |

---

## 3. Control-Layer Architecture Overview

| Layer ID | Layer Name | Responsibility | Covered System Processes | Data Objects | Safety Gates | Implementation Status | Main Task Group |
| --- | --- | --- | --- | --- | --- | --- | --- |
| WCL-01 | Actor / Session / Current User Context | Erzeugt aus Providerless/Auth Stub, Demo Session und User-/Tenant-Daten einen deterministischen ActorContext; unbekannte Akteure scheitern fail-closed. | SP-001 | User, UserProfile, ClientTenant, UserRole | RBAC, Tenant Isolation, Audit | IMPLEMENTATION_READY | WS-01 |
| WCL-02 | Tenant and Object Scope Resolver | Löst Tenant-, Engagement-, Document-, Evidence-, Decision- und Export-Scope auf und verweigert Cross-Tenant/Wrong-Object-Zugriff. | SP-002 | ClientTenant, UserRole, Document, EvidenceRecord, Decision, ExportRequest | Tenant Isolation, Payload Visibility | IMPLEMENTATION_READY | WS-01 |
| WCL-03 | RBAC / Action Permission Engine | Trennt Route Access, Action Permission, Object Scope und Second Confirmation. | SP-003, SP-028 | Role, Permission, RolePermission, UserRole, AccessRequest, SecondConfirmation | RBAC, Admin Non-Bypass, Audit | IMPLEMENTATION_READY | WS-02 |
| WCL-04 | Payload Visibility / Redaction Engine | Leitet hidden/redacted/visible-Felder ab; Grundlage für Client Visibility und Export Redaction. | SP-004, SP-005, SP-022 | PolicyDefinition, Recommendation, Decision, EvidenceRecord, ExportRequest | Payload Visibility, Client Fail-Closed, Export Redaction | IMPLEMENTATION_READY | WS-02 / WS-06 / WS-07 |
| WCL-05 | Document Intake / Storage / Extraction Layer | Härtet Upload, Versioning, Storage Metadata und Extraction Queueing. | SP-006, SP-007, SP-008 | Document, DocumentVersion, DocumentExtraction, DocumentReview | Upload Not Sufficiency, Evidence | IMPLEMENTATION_READY | WS-03 |
| WCL-06 | Evidence Control Layer | Verknüpft Evidence mit Zielen und bewertet Sufficiency; Upload bleibt nur Upload. | SP-009, SP-010, SP-016 | DocumentLink, EvidenceRecord, EvidenceItem, ComplianceReview | Evidence Sufficiency, Compliance Block | IMPLEMENTATION_READY | WS-03 / WS-04 |
| WCL-07 | Workflow / Advice Boundary Gate | Trennt Trigger, internen Draft, Analyst Review, Advisor Approval, Compliance Review/Release und Decision Record. | SP-011..SP-018 | Trigger, Recommendation, Approval, ComplianceReview, Decision, AuditEvent | No Unapproved Advice, AI Draft Internal Only, Advisor Not Release | IMPLEMENTATION_READY | WS-04 |
| WCL-08 | Audit / Correlation / Fail-Closed Layer | Schreibt AuditEvents für kritische Aktionen und hält/verweigert Sicherheitsaktionen bei Audit Failure. | SP-019, SP-020, SP-033 | AuditEvent plus correlationId in Service-Results | Audit Persistence, Admin Non-Bypass, Fail Closed | IMPLEMENTATION_READY | WS-05 |
| WCL-09 | Export / Redaction / Delivery Layer | Trennt Export Scope, Redaction, Preview, Approval, Package Generation, Download und Share. | SP-021..SP-024, SP-031 | ExportRequest, Document, Decision, EvidenceRecord, AuditEvent | Export Redaction, Client Safe Export | IMPLEMENTATION_READY / SPEC for final handover | WS-07 / WS-09 |
| WCL-10 | Data Quality and Monitoring Safety Layer | Setzt Data Quality Blocks und Review/Rebalance Monitoring nur als interne Trigger ohne automatische Advice frei. | SP-025, SP-026, SP-027 | DataQualityIssue, ReviewSchedule, QueueItem, Trigger | No Auto Advice, P1 Guard | CONDITIONAL_SUPPORT / P1_DEFERRED | WS-08 |
| WCL-11 | Offboarding / Retention / Deactivation Control Layer | Definiert sichere Controls für Access Revocation, Retention, Legal Hold, Final Export und User/Tenant Deactivation. | SP-029..SP-032 | UserRole, User, ClientTenant, Document, EvidenceRecord, ExportRequest, AuditEvent | Residual Access Denial, Retention, Legal Hold | SPEC_REQUIRED / CONTROL_LAYER_CANDIDATE | WS-09 |
| WCL-12 | UI State / API Error / Feedback Guard Layer | Standardisiert Fail-Closed Error Envelopes, Retry/Denied/Hidden/Blocked States und verhindert stille State Advances. | SP-033 plus alle safety SPs | Service Result Objects, API responses, UI state props | Fail Closed, No Overclaim Feedback | IMPLEMENTATION_READY | WS-10 |

---

## 4. System Process Coverage Matrix — 33/33

| Process ID | Process Name | Scope / Treatment | Covered By Layer | Task ID(s) | Implementation Strategy | Target Files / Areas | Required Tests | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SP-001 | Current User Resolution | IMPLEMENTATION_READY / FOUNDATION | WCL-01 | WCL-SP-001 | Resolver bauen/härten; unbekannte Akteure fail-closed; ActorContext als Standard-Input für APIs/Services etablieren. | lib/control-layer/actor-context.ts; components/demo-session-provider.tsx; app/api/demo-workflow/route.ts; prisma/seed.ts | tests/control-layer-actor-scope.spec.ts; tests/permission-engine.spec.ts | IMPLEMENTATION_READY |
| SP-002 | Tenant Selection and Scope Resolution | IMPLEMENTATION_READY / FOUNDATION | WCL-02 | WCL-SP-002 | Tenant/Object Scope Resolver vor jede safety-relevante Serviceaktion setzen. | lib/control-layer/scope-resolver.ts; lib/permission-engine.ts; app/api/demo-workflow/route.ts | tests/control-layer-actor-scope.spec.ts; tests/permission-engine.spec.ts | IMPLEMENTATION_READY |
| SP-003 | Role/Permission Evaluation | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-03 | WCL-SP-003 | PermissionDecision-Objekt standardisieren und Route/Action/Object trennen. | lib/permission-engine.ts; lib/control-layer/permission-decision.ts; tests/permission-engine.spec.ts | tests/permission-engine.spec.ts; tests/demo-workflow-api.spec.ts | IMPLEMENTATION_READY |
| SP-004 | Payload Visibility Evaluation | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-04 | WCL-SP-004 | VisibilityProjection-Objekt für hidden/redacted/visible payloads einführen. | lib/visibility-engine.ts; lib/control-layer/visibility-projection.ts; app/api/documents/route.ts; app/api/demo-workflow/route.ts | tests/payload-visibility.spec.ts; tests/permission-engine.spec.ts | IMPLEMENTATION_READY |
| SP-005 | Client Visibility Projection | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-04 | WCL-SP-005 | Client-safe Projection aus Release, Redaction und Role Scope ableiten, default hidden. | lib/visibility-engine.ts; components/client-intake-screen.tsx; app/api/demo-workflow/route.ts | tests/client-visibility-projection.spec.ts; tests/demo-workflow-api.spec.ts | IMPLEMENTATION_READY |
| SP-006 | Document Upload Processing | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-05 | WCL-SP-006 | Upload-Flow härten; success bleibt upload-only; RBAC/validation/audit prüfen. | lib/document-upload-service.ts; app/api/documents/upload/route.ts; components/client-intake-screen.tsx | tests/document-upload-api.spec.ts; tests/document-upload-flow.spec.ts | IMPLEMENTATION_READY |
| SP-007 | Document Versioning and Storage Key Generation | IMPLEMENTATION_READY / SUPPORT | WCL-05 | WCL-SP-007 | Versioning/storage metadata deterministisch machen und Checksums/StorageKey prüfen. | lib/document-upload-service.ts; lib/document-storage-adapter.ts; prisma/schema.prisma | tests/document-upload-api.spec.ts | IMPLEMENTATION_READY |
| SP-008 | Extraction and Review Queueing | IMPLEMENTATION_READY / SUPPORT | WCL-05 | WCL-SP-008 | Extraction/review queue als pending/review-needed state abbilden. | lib/document-upload-service.ts; components/client-intake-screen.tsx; app/api/demo-workflow/route.ts | tests/document-upload-api.spec.ts; tests/document-upload-flow.spec.ts | IMPLEMENTATION_READY |
| SP-009 | Evidence Linking | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-06 | WCL-SP-009 | Evidence-Zielverknüpfung tenant-/object-scoped machen. | lib/evidence-service.ts; lib/document-upload-service.ts; app/api/demo-workflow/route.ts | tests/evidence-sufficiency.spec.ts; tests/demo-workflow-api.spec.ts | IMPLEMENTATION_READY |
| SP-010 | Evidence Sufficiency Evaluation | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-06 | WCL-SP-010 | Sufficiency-Result als eigener Gate-Output; upload nie ausreichend. | lib/evidence-service.ts; lib/workflow-gate.ts; app/api/demo-workflow/route.ts | tests/evidence-sufficiency.spec.ts; tests/workflow-gate.spec.ts | IMPLEMENTATION_READY |
| SP-011 | Trigger Creation | IMPLEMENTATION_READY / INTERNAL_ONLY | WCL-07 | WCL-SP-011 | Trigger nur internal; Monitoring/Signal darf keine client release erzeugen. | lib/demo-workflow-mutation.ts; lib/review-monitoring-service.ts; app/api/demo-workflow/route.ts | tests/demo-workflow-api.spec.ts; tests/review-monitoring-service.spec.ts | IMPLEMENTATION_READY |
| SP-012 | Internal Draft Generation / Rules Drafting | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-07 | WCL-SP-012 | Internal Draft als AI_DRAFT_INTERNAL_ONLY absichern. | lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; app/api/demo-workflow/route.ts | tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts | IMPLEMENTATION_READY |
| SP-013 | Analyst Review | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-07 | WCL-SP-013 | Analyst Review kann unsupported claims blocken. | lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; components/internal-workflow-screen.tsx | tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts | IMPLEMENTATION_READY |
| SP-014 | Advisor Approval | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-07 | WCL-SP-014 | Advisor Approval erzeugt CompliancePending, keine Client Visibility. | lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; components/internal-workflow-screen.tsx | tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts | IMPLEMENTATION_READY |
| SP-015 | Compliance Review | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-07 | WCL-SP-015 | Compliance Review prüft Advisor/Evidence/Audit-Preconditions. | lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; components/internal-workflow-screen.tsx | tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts | IMPLEMENTATION_READY |
| SP-016 | Compliance Block / Request Evidence | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-06; WCL-07 | WCL-SP-016 | Block/Request Evidence als kontrollierten Gate-Zustand implementieren. | lib/workflow-gate.ts; lib/evidence-service.ts; lib/demo-workflow-mutation.ts | tests/workflow-gate.spec.ts; tests/evidence-sufficiency.spec.ts; tests/demo-workflow-api.spec.ts | IMPLEMENTATION_READY |
| SP-017 | Compliance Release | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-07 | WCL-SP-017 | Release nur bei Advisor+Evidence+Audit+Visibility Preconditions. | lib/workflow-gate.ts; lib/visibility-engine.ts; lib/demo-workflow-mutation.ts | tests/workflow-gate.spec.ts; tests/client-visibility-projection.spec.ts; tests/demo-workflow-api.spec.ts | IMPLEMENTATION_READY |
| SP-018 | Decision Record Creation | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-07 | WCL-SP-018 | Decision Record als auditierbaren Release-/Submission-Datensatz erzeugen. | lib/demo-workflow-mutation.ts; lib/workflow-gate.ts; components/decisions-governance-screen.tsx | tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts | IMPLEMENTATION_READY |
| SP-019 | Audit Event Writing | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-08 | WCL-SP-019 | AuditEvent als verpflichtender Append vor/mit kritischer Mutation. | lib/audit-service.ts; lib/control-layer/audit-guard.ts; app/api/demo-workflow/route.ts | tests/audit-fail-closed.spec.ts; tests/permission-engine.spec.ts | IMPLEMENTATION_READY |
| SP-020 | Audit Failure Handling | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-08 | WCL-SP-020 | Audit-Failure hält/verweigert Safety-Aktion. | lib/audit-service.ts; lib/control-layer/audit-guard.ts; lib/workflow-gate.ts | tests/audit-fail-closed.spec.ts; tests/workflow-gate.spec.ts | IMPLEMENTATION_READY |
| SP-021 | Export Scope Selection | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-09 | WCL-SP-021 | Export scope darf Permission/Visibility nicht überschreiten. | lib/export-service.ts; lib/export-package-service.ts; components/communication-export-ops-screen.tsx | tests/file-export-realism.spec.ts; tests/export-safety.spec.ts | IMPLEMENTATION_READY |
| SP-022 | Export Redaction | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-04; WCL-09 | WCL-SP-022 | Forbidden internal payload wird aus Export entfernt. | lib/export-service.ts; lib/export-package-service.ts; lib/visibility-engine.ts | tests/file-export-realism.spec.ts; tests/export-safety.spec.ts | IMPLEMENTATION_READY |
| SP-023 | Export Approval | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-09 | WCL-SP-023 | Approval separiert von preview und download/share. | lib/export-service.ts; lib/export-package-service.ts; app/api/demo-workflow/route.ts | tests/file-export-realism.spec.ts; tests/export-safety.spec.ts | IMPLEMENTATION_READY |
| SP-024 | Export Package Generation / Download / Share | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-09 | WCL-SP-024 | Package generation nur nach Scope+Redaction+Approval+Audit. | lib/export-package-service.ts; lib/export-service.ts; components/communication-export-ops-screen.tsx | tests/file-export-realism.spec.ts; tests/export-safety.spec.ts | IMPLEMENTATION_READY |
| SP-025 | Data Quality Detection and Blocking | CONDITIONAL_SUPPORT | WCL-10 | WCL-SP-025 | Data-quality blockers als conditional support integrieren. | lib/data-quality-service.ts or TARGET_FILE_TO_VERIFY; tests/data-quality-service.spec.ts | tests/data-quality-service.spec.ts | CONDITIONAL_SUPPORT |
| SP-026 | Review Schedule Evaluation | P1_DEFERRED unless internal proof support | WCL-10 | WCL-SP-026 | Review schedule nur deferred/internal; kein MVP overbuild. | lib/review-monitoring-service.ts; app/api/review-monitoring/route.ts | tests/review-monitoring-service.spec.ts | P1_DEFERRED unless internal proof support |
| SP-027 | Review Monitoring / Rebalance Triggering without automatic advice | P1_DEFERRED / INTERNAL_ONLY_GUARD | WCL-10 | WCL-SP-027 | Rebalance monitoring erzeugt internal trigger only, noClientRelease. | lib/review-monitoring-service.ts; app/api/review-monitoring/route.ts; app/api/demo-workflow/route.ts | tests/review-monitoring-service.spec.ts | P1_DEFERRED |
| SP-028 | Access Request / Second Confirmation | IMPLEMENTATION_READY / MVP_SUPPORT | WCL-03 | WCL-SP-028 | Sensitive access/role changes mit access request + second confirmation. | lib/permission-engine.ts; lib/demo-workflow-mutation.ts; components/decisions-governance-screen.tsx | tests/permission-engine.spec.ts; tests/demo-workflow-api.spec.ts | IMPLEMENTATION_READY |
| SP-029 | Offboarding Access Revocation | SPEC_REQUIRED / CONTROL_LAYER_CANDIDATE | WCL-11 | WCL-SP-029 | Offboarding revocation als Control-Layer-Contract/Stub vorbereiten. | lib/control-layer/offboarding-service.ts (candidate); lib/permission-engine.ts; lib/audit-service.ts | tests/offboarding-control.spec.ts | SPEC_REQUIRED |
| SP-030 | Retention / Archive / Legal Hold | SPEC_REQUIRED / CONTROL_LAYER_CANDIDATE | WCL-11 | WCL-SP-030 | Retention/legal hold als Contract/Stub vorbereiten. | lib/control-layer/retention-service.ts (candidate); lib/audit-service.ts | tests/offboarding-control.spec.ts | SPEC_REQUIRED |
| SP-031 | Final Client Export / Handover | SPEC_REQUIRED / CONTROL_LAYER_CANDIDATE | WCL-09; WCL-11 | WCL-SP-031 | Final export/handover über Export Safety Layer nur spec-ready. | lib/export-package-service.ts; lib/control-layer/offboarding-service.ts (candidate) | tests/offboarding-control.spec.ts; tests/export-safety.spec.ts | SPEC_REQUIRED |
| SP-032 | User Deactivation / Tenant Deactivation | SPEC_REQUIRED / CONTROL_LAYER_CANDIDATE | WCL-11 | WCL-SP-032 | Deactivation residual access fail-closed spezifizieren. | lib/control-layer/offboarding-service.ts (candidate); lib/permission-engine.ts; prisma/seed.ts | tests/offboarding-control.spec.ts | SPEC_REQUIRED |
| SP-033 | Error / Retry / Permission Denied / Fail Closed Handling | IMPLEMENTATION_READY / SAFETY_CRITICAL | WCL-12 | WCL-SP-033 | Standardisierte fail-closed error envelopes und UI states. | lib/control-layer/error-envelope.ts; app/api/*/route.ts; components/*screen.tsx | tests/fail-closed-error-envelope.spec.ts; route/API targeted specs | IMPLEMENTATION_READY |

---

## 5. Implementation Workstream Plan

| Workstream ID | Workstream | Purpose | Included SPs | Dependencies | Why this order | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| WS-00 | Repo/Source Reality Audit and Baseline Validation | Vor jeder Umsetzung Zielcodebase, package scripts, vorhandene Module und Tests prüfen. | Alle SPs indirekt | Keine | Verhindert falsche Pfade, main-Kontamination und veraltete Annahmen. | Repository report: package.json scripts, existing target files, missing target files, no main usage. |
| WS-01 | Actor, Tenant, Scope Foundation | ActorContext und Tenant/Object Scope als Basis jeder späteren Permission/Visibility/Workflow-Aktion. | SP-001, SP-002 | WS-00 | Ohne deterministischen Actor und Scope sind alle Journey-Proofs wertlos. | ActorContext/TenantScope Resolver + negative tests unknown user/wrong tenant. |
| WS-02 | RBAC, Action Permission, Payload Visibility | Route access, action permission, object permission und payload visibility trennen. | SP-003, SP-004, SP-028 | WS-01 | Safety foundation before every UI/API claim. | PermissionDecision + VisibilityProjection + second confirmation tests. |
| WS-03 | Document Intake and Evidence Control | Upload, versioning, extraction, linking und sufficiency als Evidence-Layer bauen/härten. | SP-006, SP-007, SP-008, SP-009, SP-010 | WS-01, WS-02 | Evidence ist zentral für compliance release, darf aber nicht aus upload abgeleitet werden. | Upload positive/negative + sufficiency negative tests. |
| WS-04 | Workflow, Advice Boundary, Human Review, Compliance Release | Trigger, internal draft, analyst review, advisor approval, compliance block/release, decision record trennen. | SP-011..SP-018 | WS-01, WS-02, WS-03 | Human-backed advice chain ist der Produktkern. | Workflow gate positive/negative tests: advisor not release, no unapproved advice. |
| WS-05 | Audit Persistence and Audit Failure Fail-Closed | AuditEvent writing und audit failure guard vor release/export/role changes absichern. | SP-019, SP-020 | WS-02, WS-04 | Ohne Audit darf kein kritischer Gate-Schritt still weiterlaufen. | Audit required + audit failure holds action tests. |
| WS-06 | Client Visibility Projection | Client-safe fail-closed Projection für Portal/Mobile/Client payloads. | SP-005 | WS-02, WS-04, WS-05 | Client Visibility darf erst nach Release+Redaction+Policy entstehen. | Client hidden before release; redacted after release tests. |
| WS-07 | Export Scope, Redaction, Approval, Download/Share | Export lifecycle von scope bis download/share kontrollieren. | SP-021..SP-024 | WS-02, WS-05, WS-06 | Export ist Trust Output; muss forbidden payload ausschließen. | Preview not approval; approval not download; forbidden payload absent tests. |
| WS-08 | Data Quality, Monitoring, No-Auto-Advice Guard | Data Quality Blocks und Monitoring als support/deferred no-auto-advice guard. | SP-025, SP-026, SP-027 | WS-01, WS-02, WS-05 | Nützlich, aber P1/conditional; darf kein Auto-Advice liefern. | Data quality blocking + review monitoring noClientRelease tests. |
| WS-09 | Offboarding / Retention / Deactivation Control Contracts | Offboarding controls als spec/control-layer candidates vorbereiten, nicht overbuilden. | SP-029..SP-032 | WS-01, WS-02, WS-05, WS-07 | Offboarding braucht dieselben Access/Retention/Audit/Export Controls, aber Scope ist SPEC_REQUIRED. | Spec/stub tests for residual access denial and legal hold behaviour. |
| WS-10 | UI/API Feedback and Fail-Closed State Wiring | Standardisierte Error/Retry/Denied/Hidden/Blocked states in APIs und relevanten Screens. | SP-033 plus safety SPs | WS-01..WS-09 | Keine stille State Advancement, keine Success-Overclaims. | FailClosedErrorEnvelope tests + route/API failure behaviour. |
| WS-11 | P0 Positive and Negative Test Completion | Fehlende P0-Safety-Tests ergänzen und bestehende Proof-Slices nicht overclaimen. | Alle MVP/SP safety tasks | WS-01..WS-10 | Jede Safety-Behauptung braucht positive und negative Proofs. | P0 matrix green for MVP spine. |
| WS-12 | Final Validation and Reporting | Validation commands ausführen und Abschlussbericht erzeugen. | Alle ausführbaren SPs | WS-11 | Codex muss nachvollziehbar zeigen, was implementiert, übersprungen und getestet wurde. | Final report with changed files, tests, P0 proof status and known gaps. |

---

## 6. Detailed Codex Task Cards

**Anwendungsregel:** Jede Task Card ist eine spätere Codex-Aufgabe. Dieses Artefakt führt sie nicht aus. Codex muss vor jeder Dateiänderung prüfen, ob die genannten Target Files im `full-workflow`-Target existieren. Wenn ein vorgeschlagenes Modul nicht existiert, muss Codex entweder die bestehende äquivalente Fläche finden oder `TARGET_FILE_TO_VERIFY / CREATE_INTERNAL_MODULE_IF_NO_EQUIVALENT` im Bericht dokumentieren. Keine neue Route, keine Prisma-Migration und keine Screen-/Image-Generierung ist durch diese Karten erlaubt.


### 6.1 Task Card — `WCL-SP-001`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-001` |
| Task Title | `Current User Resolution` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-001` — Current User Resolution |
| Control Layer | `WCL-01` |
| Workstream | `WS-01` |
| Scope Label | `IMPLEMENTATION_READY / FOUNDATION` |
| Product Intent | Current User Resolution ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/control-layer/actor-context.ts; components/demo-session-provider.tsx; app/api/demo-workflow/route.ts; prisma/seed.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `actorUserId, session token/providerless actor hint, clientTenantId, roleKeys` |
| Outputs / Results | `ActorContext, ActorDeniedResult, audit denial` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/control-layer-actor-scope.spec.ts; tests/permission-engine.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-001` erzeugen `ActorContext, ActorDeniedResult, audit denial`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-001` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.2 Task Card — `WCL-SP-002`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-002` |
| Task Title | `Tenant Selection and Scope Resolution` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-002` — Tenant Selection and Scope Resolution |
| Control Layer | `WCL-02` |
| Workstream | `WS-01` |
| Scope Label | `IMPLEMENTATION_READY / FOUNDATION` |
| Product Intent | Tenant Selection and Scope Resolution ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/control-layer/scope-resolver.ts; lib/permission-engine.ts; app/api/demo-workflow/route.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `clientTenantId, platformTenantId, objectType, objectId, actorUserId` |
| Outputs / Results | `TenantScope, ObjectScope, ScopeDeniedResult` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/control-layer-actor-scope.spec.ts; tests/permission-engine.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-002` erzeugen `TenantScope, ObjectScope, ScopeDeniedResult`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-002` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.3 Task Card — `WCL-SP-003`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-003` |
| Task Title | `Role/Permission Evaluation` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-003` — Role/Permission Evaluation |
| Control Layer | `WCL-03` |
| Workstream | `WS-02` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Role/Permission Evaluation ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/permission-engine.ts; lib/control-layer/permission-decision.ts; tests/permission-engine.spec.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `actorUserId, roleId, permissionKey, objectType, objectId, action` |
| Outputs / Results | `PermissionDecision allow/deny/reason/requiresAudit` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/permission-engine.spec.ts; tests/demo-workflow-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-003` erzeugen `PermissionDecision allow/deny/reason/requiresAudit`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-003` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.4 Task Card — `WCL-SP-004`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-004` |
| Task Title | `Payload Visibility Evaluation` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-004` — Payload Visibility Evaluation |
| Control Layer | `WCL-04` |
| Workstream | `WS-02` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Payload Visibility Evaluation ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/visibility-engine.ts; lib/control-layer/visibility-projection.ts; app/api/documents/route.ts; app/api/demo-workflow/route.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `actorRole, sensitivity, visibilityStatus, objectScope, payload fields` |
| Outputs / Results | `VisibilityProjection with visible/redacted/hidden fields` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/payload-visibility.spec.ts; tests/permission-engine.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-004` erzeugen `VisibilityProjection with visible/redacted/hidden fields`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-004` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.5 Task Card — `WCL-SP-005`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-005` |
| Task Title | `Client Visibility Projection` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-005` — Client Visibility Projection |
| Control Layer | `WCL-04` |
| Workstream | `WS-06` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Client Visibility Projection ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/visibility-engine.ts; components/client-intake-screen.tsx; app/api/demo-workflow/route.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `decisionId, recommendationId, releaseStatus, redactionProfile, clientTenantId` |
| Outputs / Results | `ClientSafeProjection or ClientVisibilityHiddenResult` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/client-visibility-projection.spec.ts; tests/demo-workflow-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-005` erzeugen `ClientSafeProjection or ClientVisibilityHiddenResult`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-005` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.6 Task Card — `WCL-SP-006`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-006` |
| Task Title | `Document Upload Processing` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-006` — Document Upload Processing |
| Control Layer | `WCL-05` |
| Workstream | `WS-03` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Document Upload Processing ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/document-upload-service.ts; app/api/documents/upload/route.ts; components/client-intake-screen.tsx` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `file, fileName, mimeType, sizeBytes, actorUserId, clientTenantId` |
| Outputs / Results | `Document, DocumentVersion, DocumentExtraction, EvidenceRecord candidate, audit event` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/document-upload-api.spec.ts; tests/document-upload-flow.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-006` erzeugen `Document, DocumentVersion, DocumentExtraction, EvidenceRecord candidate, audit event`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-006` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.7 Task Card — `WCL-SP-007`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-007` |
| Task Title | `Document Versioning and Storage Key Generation` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-007` — Document Versioning and Storage Key Generation |
| Control Layer | `WCL-05` |
| Workstream | `WS-03` |
| Scope Label | `IMPLEMENTATION_READY / SUPPORT` |
| Product Intent | Document Versioning and Storage Key Generation ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/document-upload-service.ts; lib/document-storage-adapter.ts; prisma/schema.prisma` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `documentId, storageKey, checksum, versionNumber, changeReason` |
| Outputs / Results | `DocumentVersion and storage metadata result` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Teilweise |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/document-upload-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-007` erzeugen `DocumentVersion and storage metadata result`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-007` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.8 Task Card — `WCL-SP-008`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-008` |
| Task Title | `Extraction and Review Queueing` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-008` — Extraction and Review Queueing |
| Control Layer | `WCL-05` |
| Workstream | `WS-03` |
| Scope Label | `IMPLEMENTATION_READY / SUPPORT` |
| Product Intent | Extraction and Review Queueing ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/document-upload-service.ts; components/client-intake-screen.tsx; app/api/demo-workflow/route.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `documentId, extractionStatus, confidenceScore, extractedFieldsJson` |
| Outputs / Results | `DocumentExtraction pending/review-needed result` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Teilweise |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/document-upload-api.spec.ts; tests/document-upload-flow.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-008` erzeugen `DocumentExtraction pending/review-needed result`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-008` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.9 Task Card — `WCL-SP-009`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-009` |
| Task Title | `Evidence Linking` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-009` — Evidence Linking |
| Control Layer | `WCL-06` |
| Workstream | `WS-03` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Evidence Linking ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/evidence-service.ts; lib/document-upload-service.ts; app/api/demo-workflow/route.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `documentId, evidenceRecordId, targetType, targetId, actorUserId` |
| Outputs / Results | `DocumentLink, EvidenceItem, EvidenceLinkedResult` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/evidence-sufficiency.spec.ts; tests/demo-workflow-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-009` erzeugen `DocumentLink, EvidenceItem, EvidenceLinkedResult`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-009` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.10 Task Card — `WCL-SP-010`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-010` |
| Task Title | `Evidence Sufficiency Evaluation` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-010` — Evidence Sufficiency Evaluation |
| Control Layer | `WCL-06` |
| Workstream | `WS-03` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Evidence Sufficiency Evaluation ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/evidence-service.ts; lib/workflow-gate.ts; app/api/demo-workflow/route.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `evidenceRecordId, reviewStatus, relevance, scope, reviewerUserId, gateId` |
| Outputs / Results | `EvidenceSufficiencyResult sufficient/insufficient/pending` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/evidence-sufficiency.spec.ts; tests/workflow-gate.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-010` erzeugen `EvidenceSufficiencyResult sufficient/insufficient/pending`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-010` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.11 Task Card — `WCL-SP-011`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-011` |
| Task Title | `Trigger Creation` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-011` — Trigger Creation |
| Control Layer | `WCL-07` |
| Workstream | `WS-04` |
| Scope Label | `IMPLEMENTATION_READY / INTERNAL_ONLY` |
| Product Intent | Trigger Creation ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/demo-workflow-mutation.ts; lib/review-monitoring-service.ts; app/api/demo-workflow/route.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `clientTenantId, source, triggerType, severity, noClientRelease` |
| Outputs / Results | `Trigger with internal-only visibility and audit` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Teilweise |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/demo-workflow-api.spec.ts; tests/review-monitoring-service.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-011` erzeugen `Trigger with internal-only visibility and audit`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-011` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.12 Task Card — `WCL-SP-012`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-012` |
| Task Title | `Internal Draft Generation / Rules Drafting` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-012` — Internal Draft Generation / Rules Drafting |
| Control Layer | `WCL-07` |
| Workstream | `WS-04` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Internal Draft Generation / Rules Drafting ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; app/api/demo-workflow/route.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `triggerId, evidenceIds, sourceModelVersion, draftText, assumptionsJson` |
| Outputs / Results | `Internal Recommendation draft, AI_DRAFT_INTERNAL_ONLY result` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-012` erzeugen `Internal Recommendation draft, AI_DRAFT_INTERNAL_ONLY result`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-012` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.13 Task Card — `WCL-SP-013`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-013` |
| Task Title | `Analyst Review` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-013` — Analyst Review |
| Control Layer | `WCL-07` |
| Workstream | `WS-04` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Analyst Review ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; components/internal-workflow-screen.tsx` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `recommendationId, analystUserId, evidenceIds, reviewDecision, unsupportedClaims` |
| Outputs / Results | `AnalystReviewResult accepted/rejected/needs evidence` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-013` erzeugen `AnalystReviewResult accepted/rejected/needs evidence`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-013` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.14 Task Card — `WCL-SP-014`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-014` |
| Task Title | `Advisor Approval` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-014` — Advisor Approval |
| Control Layer | `WCL-07` |
| Workstream | `WS-04` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Advisor Approval ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; components/internal-workflow-screen.tsx` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `recommendationId, advisorUserId, approvalNotes, approvalDecision` |
| Outputs / Results | `Approval record and CompliancePending state, not released` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-014` erzeugen `Approval record and CompliancePending state, not released`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-014` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.15 Task Card — `WCL-SP-015`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-015` |
| Task Title | `Compliance Review` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-015` — Compliance Review |
| Control Layer | `WCL-07` |
| Workstream | `WS-04` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Compliance Review ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; components/internal-workflow-screen.tsx` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `approvalId, complianceReviewId, evidenceRecordIds, checklist` |
| Outputs / Results | `ComplianceReview pending/blocked/releasable result` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-015` erzeugen `ComplianceReview pending/blocked/releasable result`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-015` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.16 Task Card — `WCL-SP-016`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-016` |
| Task Title | `Compliance Block / Request Evidence` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-016` — Compliance Block / Request Evidence |
| Control Layer | `WCL-06; WCL-07` |
| Workstream | `WS-04` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Compliance Block / Request Evidence ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/workflow-gate.ts; lib/evidence-service.ts; lib/demo-workflow-mutation.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `complianceReviewId, reason, requiredEvidenceType, targetObjectId` |
| Outputs / Results | `ComplianceBlockedResult or EvidenceRequestResult` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/workflow-gate.spec.ts; tests/evidence-sufficiency.spec.ts; tests/demo-workflow-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-016` erzeugen `ComplianceBlockedResult or EvidenceRequestResult`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-016` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.17 Task Card — `WCL-SP-017`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-017` |
| Task Title | `Compliance Release` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-017` — Compliance Release |
| Control Layer | `WCL-07` |
| Workstream | `WS-04` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Compliance Release ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/workflow-gate.ts; lib/visibility-engine.ts; lib/demo-workflow-mutation.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `complianceReviewId, releaseChecklist, evidenceRecordIds, auditCorrelationId` |
| Outputs / Results | `ComplianceReleasedResult and decision candidate, not client acceptance` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/workflow-gate.spec.ts; tests/client-visibility-projection.spec.ts; tests/demo-workflow-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-017` erzeugen `ComplianceReleasedResult and decision candidate, not client acceptance`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-017` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.18 Task Card — `WCL-SP-018`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-018` |
| Task Title | `Decision Record Creation` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-018` — Decision Record Creation |
| Control Layer | `WCL-07` |
| Workstream | `WS-04` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Decision Record Creation ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/demo-workflow-mutation.ts; lib/workflow-gate.ts; components/decisions-governance-screen.tsx` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `decisionId, recommendationId, evidenceRecordId, complianceReviewId` |
| Outputs / Results | `DecisionRecord created/updated and audit event` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/workflow-gate.spec.ts; tests/demo-workflow-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-018` erzeugen `DecisionRecord created/updated and audit event`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-018` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.19 Task Card — `WCL-SP-019`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-019` |
| Task Title | `Audit Event Writing` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-019` — Audit Event Writing |
| Control Layer | `WCL-08` |
| Workstream | `WS-05` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Audit Event Writing ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/audit-service.ts; lib/control-layer/audit-guard.ts; app/api/demo-workflow/route.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `actorUserId, actorRoleKey, targetType, targetId, action, previousState, nextState, result, reason, correlationId` |
| Outputs / Results | `AuditEvent append-only record` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/audit-fail-closed.spec.ts; tests/permission-engine.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-019` erzeugen `AuditEvent append-only record`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-019` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.20 Task Card — `WCL-SP-020`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-020` |
| Task Title | `Audit Failure Handling` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-020` — Audit Failure Handling |
| Control Layer | `WCL-08` |
| Workstream | `WS-05` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Audit Failure Handling ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/audit-service.ts; lib/control-layer/audit-guard.ts; lib/workflow-gate.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `correlationId, attemptedAction, errorCode, targetState` |
| Outputs / Results | `SafetyActionHeldResult or SafetyActionDeniedResult` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/audit-fail-closed.spec.ts; tests/workflow-gate.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-020` erzeugen `SafetyActionHeldResult or SafetyActionDeniedResult`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-020` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.21 Task Card — `WCL-SP-021`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-021` |
| Task Title | `Export Scope Selection` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-021` — Export Scope Selection |
| Control Layer | `WCL-09` |
| Workstream | `WS-07` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Export Scope Selection ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/export-service.ts; lib/export-package-service.ts; components/communication-export-ops-screen.tsx` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `exportRequestId, scopeJson, actorUserId, objectIds` |
| Outputs / Results | `ExportScopeSelectedResult` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/file-export-realism.spec.ts; tests/export-safety.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-021` erzeugen `ExportScopeSelectedResult`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-021` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.22 Task Card — `WCL-SP-022`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-022` |
| Task Title | `Export Redaction` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-022` — Export Redaction |
| Control Layer | `WCL-04; WCL-09` |
| Workstream | `WS-07` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Export Redaction ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/export-service.ts; lib/export-package-service.ts; lib/visibility-engine.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `redactionProfile, forbiddenPayloadList, scopeJson, payload fields` |
| Outputs / Results | `ExportRedactionResult with forbidden payload removed` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/file-export-realism.spec.ts; tests/export-safety.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-022` erzeugen `ExportRedactionResult with forbidden payload removed`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-022` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.23 Task Card — `WCL-SP-023`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-023` |
| Task Title | `Export Approval` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-023` — Export Approval |
| Control Layer | `WCL-09` |
| Workstream | `WS-07` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Export Approval ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/export-service.ts; lib/export-package-service.ts; app/api/demo-workflow/route.ts` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `exportRequestId, approvedByUserId, approvalDecision, auditCorrelationId` |
| Outputs / Results | `ExportApprovedResult; preview not approval` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/file-export-realism.spec.ts; tests/export-safety.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-023` erzeugen `ExportApprovedResult; preview not approval`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-023` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.24 Task Card — `WCL-SP-024`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-024` |
| Task Title | `Export Package Generation / Download / Share` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-024` — Export Package Generation / Download / Share |
| Control Layer | `WCL-09` |
| Workstream | `WS-07` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Export Package Generation / Download / Share ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/export-package-service.ts; lib/export-service.ts; components/communication-export-ops-screen.tsx` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `exportRequestId, generatedFileDocumentId, watermark, expiry, shareTarget` |
| Outputs / Results | `ExportPackageManifest, DownloadAllowedResult or ExportBlockedResult` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/file-export-realism.spec.ts; tests/export-safety.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-024` erzeugen `ExportPackageManifest, DownloadAllowedResult or ExportBlockedResult`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-024` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.25 Task Card — `WCL-SP-025`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-025` |
| Task Title | `Data Quality Detection and Blocking` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-025` — Data Quality Detection and Blocking |
| Control Layer | `WCL-10` |
| Workstream | `WS-08` |
| Scope Label | `CONDITIONAL_SUPPORT` |
| Product Intent | Data Quality Detection and Blocking ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/data-quality-service.ts or TARGET_FILE_TO_VERIFY; tests/data-quality-service.spec.ts` |
| Allowed Changes | Conditional Support: nur wenn die Umsetzung P0-Release-/Readiness-Blocker absichert; keine neue Ops-Journey als MVP-Hauptpfad. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `dataQualityIssueId, severity, targetType, targetId, status` |
| Outputs / Results | `DataQualityBlockResult or ResolvedIssueResult` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Teilweise |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/data-quality-service.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-025` erzeugen `DataQualityBlockResult or ResolvedIssueResult`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-025` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.26 Task Card — `WCL-SP-026`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-026` |
| Task Title | `Review Schedule Evaluation` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-026` — Review Schedule Evaluation |
| Control Layer | `WCL-10` |
| Workstream | `WS-08` |
| Scope Label | `P1_DEFERRED unless internal proof support` |
| Product Intent | Review Schedule Evaluation ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/review-monitoring-service.ts; app/api/review-monitoring/route.ts` |
| Allowed Changes | Nur interne Guard-/No-Auto-Advice-Absicherung und Tests; keine vollständige P1-Feature-Implementierung. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `reviewScheduleId, nextReviewDate, cadence, clientTenantId` |
| Outputs / Results | `ReviewDueResult/OverdueResult internal-only` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Teilweise |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/review-monitoring-service.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-026` erzeugen `ReviewDueResult/OverdueResult internal-only`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-026` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.27 Task Card — `WCL-SP-027`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-027` |
| Task Title | `Review Monitoring / Rebalance Triggering without automatic advice` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-027` — Review Monitoring / Rebalance Triggering without automatic advice |
| Control Layer | `WCL-10` |
| Workstream | `WS-08` |
| Scope Label | `P1_DEFERRED / INTERNAL_ONLY_GUARD` |
| Product Intent | Review Monitoring / Rebalance Triggering without automatic advice ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/review-monitoring-service.ts; app/api/review-monitoring/route.ts; app/api/demo-workflow/route.ts` |
| Allowed Changes | Nur interne Guard-/No-Auto-Advice-Absicherung und Tests; keine vollständige P1-Feature-Implementierung. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `reviewScheduleId, triggerType, noClientRelease, clientVisible=false` |
| Outputs / Results | `InternalTriggerCreatedResult; no automatic advice` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/review-monitoring-service.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-027` erzeugen `InternalTriggerCreatedResult; no automatic advice`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-027` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.28 Task Card — `WCL-SP-028`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-028` |
| Task Title | `Access Request / Second Confirmation` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-028` — Access Request / Second Confirmation |
| Control Layer | `WCL-03` |
| Workstream | `WS-02` |
| Scope Label | `IMPLEMENTATION_READY / MVP_SUPPORT` |
| Product Intent | Access Request / Second Confirmation ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/permission-engine.ts; lib/demo-workflow-mutation.ts; components/decisions-governance-screen.tsx` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `accessRequestId, confirmationPhrase, reviewerUserId, expiresAt, reason` |
| Outputs / Results | `AccessApproved/DeniedResult, SecondConfirmationResult` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/permission-engine.spec.ts; tests/demo-workflow-api.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-028` erzeugen `AccessApproved/DeniedResult, SecondConfirmationResult`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-028` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.29 Task Card — `WCL-SP-029`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-029` |
| Task Title | `Offboarding Access Revocation` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-029` — Offboarding Access Revocation |
| Control Layer | `WCL-11` |
| Workstream | `WS-09` |
| Scope Label | `SPEC_REQUIRED / CONTROL_LAYER_CANDIDATE` |
| Product Intent | Offboarding Access Revocation ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/control-layer/offboarding-service.ts (candidate); lib/permission-engine.ts; lib/audit-service.ts` |
| Allowed Changes | Nur Control-Layer-Contract, safe stubs, test fixtures und residual-access negative tests; keine vollständige Offboarding-Produktimplementierung ohne Unlock. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `offboardingReason, effectiveDate, affectedUserIds, roleIds, clientTenantId` |
| Outputs / Results | `AccessRevokedResult, residual visibility denied` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/offboarding-control.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-029` erzeugen `AccessRevokedResult, residual visibility denied`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-029` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.30 Task Card — `WCL-SP-030`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-030` |
| Task Title | `Retention / Archive / Legal Hold` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-030` — Retention / Archive / Legal Hold |
| Control Layer | `WCL-11` |
| Workstream | `WS-09` |
| Scope Label | `SPEC_REQUIRED / CONTROL_LAYER_CANDIDATE` |
| Product Intent | Retention / Archive / Legal Hold ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/control-layer/retention-service.ts (candidate); lib/audit-service.ts` |
| Allowed Changes | Nur Control-Layer-Contract, safe stubs, test fixtures und residual-access negative tests; keine vollständige Offboarding-Produktimplementierung ohne Unlock. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `retentionPolicy, legalHoldFlag, documentIds, evidenceIds, clientTenantId` |
| Outputs / Results | `RetentionAppliedResult, LegalHoldAppliedResult` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/offboarding-control.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-030` erzeugen `RetentionAppliedResult, LegalHoldAppliedResult`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-030` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.31 Task Card — `WCL-SP-031`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-031` |
| Task Title | `Final Client Export / Handover` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-031` — Final Client Export / Handover |
| Control Layer | `WCL-09; WCL-11` |
| Workstream | `WS-09` |
| Scope Label | `SPEC_REQUIRED / CONTROL_LAYER_CANDIDATE` |
| Product Intent | Final Client Export / Handover ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/export-package-service.ts; lib/control-layer/offboarding-service.ts (candidate)` |
| Allowed Changes | Nur Control-Layer-Contract, safe stubs, test fixtures und residual-access negative tests; keine vollständige Offboarding-Produktimplementierung ohne Unlock. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `finalExportScope, redactionProfile, approverUserId, auditCorrelationId` |
| Outputs / Results | `FinalClientExportGenerated/BlockedResult` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/offboarding-control.spec.ts; tests/export-safety.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-031` erzeugen `FinalClientExportGenerated/BlockedResult`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-031` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.32 Task Card — `WCL-SP-032`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-032` |
| Task Title | `User Deactivation / Tenant Deactivation` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-032` — User Deactivation / Tenant Deactivation |
| Control Layer | `WCL-11` |
| Workstream | `WS-09` |
| Scope Label | `SPEC_REQUIRED / CONTROL_LAYER_CANDIDATE` |
| Product Intent | User Deactivation / Tenant Deactivation ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/control-layer/offboarding-service.ts (candidate); lib/permission-engine.ts; prisma/seed.ts` |
| Allowed Changes | Nur Control-Layer-Contract, safe stubs, test fixtures und residual-access negative tests; keine vollständige Offboarding-Produktimplementierung ohne Unlock. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `userIds, clientTenantId, deactivationReason, pendingWorkflowIds` |
| Outputs / Results | `UserDeactivatedResult, TenantArchivedResult, residual access denied` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/offboarding-control.spec.ts`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-032` erzeugen `UserDeactivatedResult, TenantArchivedResult, residual access denied`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-032` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


### 6.33 Task Card — `WCL-SP-033`

| Field | Content |
| --- | --- |
| Task ID | `WCL-SP-033` |
| Task Title | `Error / Retry / Permission Denied / Fail Closed Handling` Control-Layer-Implementierung / Härtung |
| System Process Coverage | `SP-033` — Error / Retry / Permission Denied / Fail Closed Handling |
| Control Layer | `WCL-12` |
| Workstream | `WS-10` |
| Scope Label | `IMPLEMENTATION_READY / SAFETY_CRITICAL` |
| Product Intent | Error / Retry / Permission Denied / Fail Closed Handling ist nötig, damit WealthOS-Workflows nicht nur sichtbar, sondern kontrolliert, tenant-scoped, auditierbar und client-safe beweisbar sind. |
| Implementation Objective | Baue oder härte den generischen Control-Layer-Mechanismus für diesen Prozess; Journey-spezifische Pfade müssen diesen Mechanismus nutzen, statt eigene Sonderlogik zu erfinden. |
| Target Files / Areas | `lib/control-layer/error-envelope.ts; app/api/*/route.ts; components/*screen.tsx` |
| Allowed Changes | Bestehende Services/Engines härten; interne Result-/Guard-Typen ergänzen; bestehende API-Validierung/Redaction/Failure Behaviour ergänzen; Tests/Fixtures hinzufügen; vorhandene UI-States nur verdrahten, nicht neu designen. |
| Forbidden Changes | Keine neue Route; keine Prisma-Migration; keine Screen-/State-Screen-/Image-Generierung; keine main-derived Änderungen; keine autonome Advice-Entscheidung; keine Success-Message, die downstream gates überclaimt. |
| Data Inputs | `errorCode, actorUserId, targetType, targetId, correlationId` |
| Outputs / Results | `FailClosedErrorEnvelope, RetryAllowedResult, PermissionDeniedState` |
| API / Service Impact | Bestehende Services/APIs verwenden; neue API nur als `API_DECISION_REQUIRED`, nicht als Standardlösung. |
| Schema Impact | Bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration; fehlende Felder als `SCHEMA_DECISION_REQUIRED` markieren. |
| UI / State Impact | Falls UI betroffen: bestehende States/Feedback fail-closed verdrahten; keine neuen Screens generieren. |
| Audit Requirements | Safety-relevante Allow/Deny/Mutation muss AuditEvent oder Audit-Failure-Guard berücksichtigen; Audit Failure darf keine stille Mutation erlauben. |
| Safety Critical? | Ja |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted Playwright spec(s): `tests/fail-closed-error-envelope.spec.ts; route/API targeted specs`; final `pnpm phase:check` wenn Repo bereit ist. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, bestehende API/Schema nicht passt, Migration nötig wäre, P1/HOLD-Elevation nötig wäre, oder Safety-Negativtest nicht formulierbar ist. |
| Reporting Requirement | Changed files, Task ID, SP coverage, positive/negative tests, safety proof, skipped blockers, known gaps. |

**Implementation Steps**

1. Prüfe im `full-workflow`-Repo, ob die Target Files existieren und ob bereits eine äquivalente Engine vorhanden ist.
2. Definiere ein stabiles Result-Objekt für den Prozess, z. B. `allow/deny`, `hidden/redacted/visible`, `pending/blocked/released` oder `safe error`.
3. Verdrahte den Prozess nur an bestehenden Service-/API-Flächen; erfinde keine neue Route.
4. Stelle sicher, dass Dateninputs tenant-/object-scoped validiert werden.
5. Implementiere fail-closed Verhalten für fehlende Preconditions, falsche Rollen, falsche Tenants, fehlende Evidence, fehlende Auditfähigkeit oder forbidden payload.
6. Ergänze positive Tests für erlaubte Happy-Path-Nutzung.
7. Ergänze negative Tests für Denial, Leakage, Bypass, Overclaim oder silent state advance.
8. Dokumentiere im Abschlussbericht, welche Journeys danach über diesen Prozess beweisbar werden.

**Positive Tests**

* Gültige Inputs für `SP-033` erzeugen `FailClosedErrorEnvelope, RetryAllowedResult, PermissionDeniedState`.
* Der Prozess kann von mindestens einem scoped Actor erfolgreich genutzt werden.
* Audit-, State- oder Visibility-Ergebnis ist konsistent mit den Safety Contracts.

**Negative Tests**

* Unknown actor oder falscher Tenant/Object Scope erhält denial/hidden result ohne payload leak.
* Route-/UI-Sichtbarkeit allein reicht nicht für Action Permission oder Payload Visibility.
* Safety-kritische Aktionen schlagen fehl oder bleiben held, wenn Evidence/Audit/Compliance/Redaction-Preconditions fehlen.
* Erfolgsmeldung darf nur den tatsächlich abgeschlossenen Prozess benennen, nicht downstream gates.

**Acceptance Criteria**

* `SP-033` ist in Coverage Matrix, Task Card, Tests und Abschlussbericht referenziert.
* Der Prozess nutzt generische Control-Layer-Resultate statt Journey-Sonderlogik.
* Positive und negative Tests sind entweder implementiert oder als blocked mit präzisem Grund dokumentiert.
* Keine verbotene Änderung wurde vorgenommen.


---

## 7. Cross-Cutting Shared Engine Tasks

| Shared Task ID | Engine / Service | Covered SPs | Purpose | Target Files | Required Tests | Dependency |
| --- | --- | --- | --- | --- | --- | --- |
| WCL-SHARED-001 | Current User / Actor Context Resolver | SP-001, SP-002 | Standardisiert ActorContext für Providerless/Auth Stub, Demo Session, User/Tenant/Role Mapping. | lib/control-layer/actor-context.ts; components/demo-session-provider.tsx; prisma/seed.ts | Unknown-user-denied; mapped-user-scoped-access | WS-01 |
| WCL-SHARED-002 | Tenant/Object Scope Resolver | SP-002, SP-003, SP-004 | Zentrale Scope-Auflösung für Tenant, Document, Evidence, Recommendation, Decision, Export. | lib/control-layer/scope-resolver.ts; lib/permission-engine.ts | Wrong-tenant/object denied; no payload leak | WS-01 |
| WCL-SHARED-003 | Permission Decision Object Standardization | SP-003, SP-028 | Einheitliches PermissionDecision-Objekt mit allow/deny/reason/requiresAudit/requiresSecondConfirmation. | lib/permission-engine.ts; lib/control-layer/permission-decision.ts | Route access not action permission; admin non-bypass | WS-02 |
| WCL-SHARED-004 | Payload Visibility Projection Object | SP-004, SP-005, SP-022 | Einheitliches VisibilityProjection-Objekt für hidden/redacted/visible. | lib/visibility-engine.ts; lib/control-layer/visibility-projection.ts | Client sees released/redacted only; AI draft hidden | WS-02 / WS-06 |
| WCL-SHARED-005 | Evidence Sufficiency Result Object | SP-009, SP-010, SP-016 | Einheitliches EvidenceSufficiencyResult mit sufficient/insufficient/pending/reason/linkedTargets. | lib/evidence-service.ts; lib/workflow-gate.ts | Upload not sufficiency; insufficiency blocks release/export | WS-03 |
| WCL-SHARED-006 | Workflow Gate Result Object | SP-011..SP-018 | Einheitliches WorkflowGateResult für blocked/pending/allowed/released mit gate reason. | lib/workflow-gate.ts; lib/demo-workflow-mutation.ts | Advisor approval not release; compliance release required | WS-04 |
| WCL-SHARED-007 | Audit Guard / Safe Mutation Wrapper | SP-019, SP-020, SP-033 | Wrapper für kritische Mutationen: audit-first/with-audit, correlationId, fail-closed on audit failure. | lib/audit-service.ts; lib/control-layer/audit-guard.ts | Audit write failure holds/denies action | WS-05 |
| WCL-SHARED-008 | Export Safety Result Object | SP-021..SP-024, SP-031 | Einheitliches ExportSafetyResult für scope/redaction/approval/download/share gates. | lib/export-service.ts; lib/export-package-service.ts | Preview not approval; forbidden payload absent | WS-07 |
| WCL-SHARED-009 | Fail-Closed API Error Envelope | SP-033 plus all API-related SPs | Einheitliche API-Antworten für denied/hidden/blocked/retry/error ohne silent advancement. | app/api/*/route.ts; lib/control-layer/error-envelope.ts | API validation fail-closed; no sensitive error leak | WS-10 |
| WCL-SHARED-010 | P0 Test Fixture / Seed User Matrix | SP-001..SP-033 | Seed-/Fixture-Matrix für Platform Admin, Tenant Admin, Compliance, Advisor, Analyst, Client, External Guest, Service Account. | prisma/seed.ts; tests/fixtures/control-layer-fixtures.ts | All P0 positive/negative role/scope cases reproducible | WS-11 |

---

## 8. API Hardening Task Matrix

**Regel:** Nur bestehende API-Routen nutzen/härten. Neue API-Routen sind nur `API_DECISION_REQUIRED` und nicht automatisch umsetzbar.

| API Route | Related SPs | Required Request Validation | Required Permission Check | Required Payload Redaction | Required Audit | Failure Behaviour | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /api/demo-workflow | SP-003, SP-011..SP-018, SP-019, SP-020, SP-021..SP-024, SP-027, SP-028 | Action payload, actor context, tenantId, objectId, action type, noClientRelease flag | PermissionDecision + ObjectScope vor Mutation | AI draft/internal rationale/compliance notes hidden for client-facing actions | Audit for gate actions and denials | 400 for malformed action; 403/hidden for denied; no workflow advance on error | tests/demo-workflow-api.spec.ts; tests/workflow-gate.spec.ts; tests/audit-fail-closed.spec.ts |
| /api/documents | SP-002, SP-004, SP-005, SP-006, SP-009, SP-010 | clientTenantId/query scope, actor role, document visibility state | Tenant/Object Scope + document list permission | Document rows filtered/redacted by VisibilityProjection | Audit denied access if sensitive | Denied returns safe empty/hidden or 403 without row leak | tests/document-upload-api.spec.ts; tests/payload-visibility.spec.ts |
| /api/documents/upload | SP-001, SP-002, SP-003, SP-006, SP-007, SP-008, SP-019 | multipart file, mimeType, fileSize, actorUserId, clientTenantId, metadata | Upload permission + tenant membership + file validation | Upload response excludes internal storage details unless role-safe | Audit success/denial/rejection | Unsupported file rejected no row; forbidden role denied + audit; upload success not sufficiency | tests/document-upload-api.spec.ts; tests/document-upload-flow.spec.ts |
| /api/review-monitoring | SP-026, SP-027 | reviewScheduleId/date range/tenant context; noClientRelease expected | Internal role or scoped analyst/advisor only | No client-visible advice payload; due/overdue state internal only | Audit only when trigger created or sensitive state changes | Monitoring errors do not create advice/release; clientVisible false | tests/review-monitoring-service.spec.ts |

---

## 9. Schema Alignment Task Matrix

**Regel:** Full-workflow Prisma-Baseline mit 42 Modellen / 22 Enums bleibt Ziel. Diese Matrix autorisiert keine Migration. Codex darf nur bestehende Felder korrekt verwenden; fehlende Felder sind `SCHEMA_DECISION_REQUIRED`.

| Domain | Related SPs | Existing Models / Fields | Required Usage Alignment | Missing Field Concern | Decision | Task Status |
| --- | --- | --- | --- | --- | --- | --- |
| User / UserProfile / ClientTenant / UserRole | SP-001, SP-002, SP-029, SP-032 | User, UserProfile, ClientTenant, UserRole | ActorContext, tenant membership, status/deactivation and role scope aus bestehenden Feldern ableiten. | Offboarding residual access may need explicit status rules; no migration now. | USE_EXISTING_FIELDS; SPEC_REQUIRED for offboarding semantics | IMPLEMENTATION_READY for current user/scope; SPEC_REQUIRED for offboarding deactivation |
| Role / Permission / RolePermission / AccessRequest / SecondConfirmation | SP-003, SP-028 | Role, Permission, RolePermission, AccessRequest, SecondConfirmation | PermissionDecision und second confirmation lifecycle auf existing models mappen. | Confirmation phrase/expiry/status semantics prüfen. | ALIGN_USAGE_NO_SCHEMA_CHANGE | IMPLEMENTATION_READY / MVP_SUPPORT |
| Document / DocumentVersion / DocumentExtraction / DocumentReview / DocumentLink | SP-006, SP-007, SP-008, SP-009 | Document, DocumentVersion, DocumentExtraction, DocumentReview, DocumentLink | Upload, version, extraction review and linking sauber trennen. | Storage/checksum/error details ggf. service-level, nicht schema-level. | USE_EXISTING_DOCUMENT_MODELS | IMPLEMENTATION_READY |
| EvidenceRecord / EvidenceItem | SP-009, SP-010, SP-016 | EvidenceRecord, EvidenceItem | Sufficiency status, related target and visibilityStatus kontrolliert verwenden. | Explicit sufficiency evaluator may be service-derived. | SERVICE_DERIVED_RESULT_OBJECT | IMPLEMENTATION_READY |
| Trigger / ActionItem / Recommendation / RecommendationOption | SP-011, SP-012, SP-013 | Trigger, ActionItem, Recommendation, RecommendationOption | Internal trigger/draft/recommendation states; AI draft internal-only. | Separate AiDraft model not created; representation via fields/status/service. | NO_PATCH_MODEL_NOW | IMPLEMENTATION_READY |
| Approval / ComplianceReview / Decision | SP-014, SP-015, SP-016, SP-017, SP-018 | Approval, ComplianceReview, Decision | Advisor approval, compliance review/release and decision record are distinct. | Do not conflate approval/release/client acceptance. | ALIGN_STATUS_TRANSITIONS | IMPLEMENTATION_READY |
| AuditEvent | SP-019, SP-020, SP-033 | AuditEvent | Minimum audit fields and correlationId usage for critical actions. | Audit failure simulation may be test/service-level. | AUDIT_GUARD_REQUIRED | IMPLEMENTATION_READY |
| ExportRequest | SP-021, SP-022, SP-023, SP-024, SP-031 | ExportRequest, generated file Document link | ScopeJson, redactionProfile, approvalRequired, approvedBy, generatedFileDocumentId correctly sequence. | Final handover export is SPEC_REQUIRED; no new schema now. | USE_EXISTING_EXPORT_MODEL | IMPLEMENTATION_READY for MVP export; SPEC_REQUIRED for final handover |
| ReviewSchedule / QueueItem / DataQualityIssue | SP-025, SP-026, SP-027 | ReviewSchedule, QueueItem, DataQualityIssue | Data quality block and review due/overdue internal monitoring. | Review monitoring P1; keep no-auto-advice guard. | CONDITIONAL_SUPPORT / P1_DEFERRED | CONDITIONAL / DEFERRED |
| MessageThread / Message | Communication P1 support; not one of core SPs except error/client request touchpoints | MessageThread, Message | Do not implement full communication centre in MVP; retain visibility rules if used. | P1 communication layer requires separate unlock. | DEFER_TO_P1 | P1_DEFERRED |

---

## 10. P0 Test Task Matrix

| P0 Test ID | Related SPs | Positive Case | Negative Case | Existing Proof Slice | Missing Test | Required Test File / Candidate |
| --- | --- | --- | --- | --- | --- | --- |
| P0-NEG-001 | SP-001 | Mapped actor resolves ActorContext | Unknown user denied; no anonymous payload expansion | partial role/session demo support | Need backend resolver negative test | tests/control-layer-actor-scope.spec.ts |
| P0-NEG-002 | SP-002, SP-003, SP-004 | Scoped actor accesses own object | Wrong tenant/object denied; no payload leak | tests/permission-engine.spec.ts partial | Add API/list payload leak assertions | tests/permission-engine.spec.ts; tests/payload-visibility.spec.ts |
| P0-NEG-003 | SP-003 | Route shell may render for allowed actor | Route access does not grant action permission | permission-engine partial | Route/API distinction test | tests/permission-engine.spec.ts |
| P0-NEG-004 | SP-004, SP-005 | Allowed payload fields visible after release | Route access does not grant payload visibility | partial visibility engine proof | Client/API payload redaction test missing | tests/payload-visibility.spec.ts |
| P0-NEG-005 | SP-012, SP-005, SP-022 | Internal draft can be reviewed internally | Client-visible AI Draft denied in portal/API/export | demo workflow noClientRelease partial | Explicit forbidden payload assertions | tests/client-visibility-projection.spec.ts; tests/export-safety.spec.ts |
| P0-NEG-006 | SP-011..SP-018 | Approved/released decision appears only after gates | Unapproved advice not client-visible | workflow-gate partial | End-to-end client payload hidden before release | tests/workflow-gate.spec.ts; tests/client-visibility-projection.spec.ts |
| P0-NEG-007 | SP-014, SP-017 | Advisor approval creates approval record | Advisor approval does not release or set client visibility | workflow-gate partial | Explicit advisor-not-release test | tests/workflow-gate.spec.ts |
| P0-NEG-008 | SP-015, SP-017, SP-019 | Compliance release succeeds with advisor/evidence/audit | Compliance release requires evidence and audit | workflow-gate partial | Audit failure + missing evidence negatives | tests/audit-fail-closed.spec.ts; tests/evidence-sufficiency.spec.ts |
| P0-NEG-009 | SP-006, SP-010 | Upload stores document/version/evidence candidate | Upload success does not mark evidence sufficient | document upload API strong partial | Assert sufficiency remains pending/insufficient | tests/document-upload-api.spec.ts; tests/evidence-sufficiency.spec.ts |
| P0-NEG-010 | SP-010, SP-016, SP-021..SP-024 | Sufficient evidence can unlock scoped gate | Evidence insufficiency blocks release/export | not complete | Gate and export blocking tests | tests/evidence-sufficiency.spec.ts; tests/export-safety.spec.ts |
| P0-NEG-011 | SP-003, SP-028, SP-017, SP-023 | Admin can manage governance within policy | Admin cannot bypass release/evidence/export/visibility | permission-engine partial | Admin bypass matrix across gates | tests/permission-engine.spec.ts; tests/workflow-gate.spec.ts |
| P0-NEG-012 | SP-019, SP-020 | Critical action writes audit | Audit write failure holds/denies safety action | not complete | Simulated audit failure wrapper tests | tests/audit-fail-closed.spec.ts |
| P0-NEG-013 | SP-021, SP-023 | Preview can be generated after scope/redaction | Export preview is not approval | file-export partial | Preview not approved state test | tests/export-safety.spec.ts |
| P0-NEG-014 | SP-023, SP-024 | Approved export can generate package | Export approval is not download/share without final checks | file-export partial | Separate approval/download gate test | tests/export-safety.spec.ts |
| P0-NEG-015 | SP-022, SP-024 | Export package includes allowed metadata/content | Export package excludes forbidden internal payload | file-export metadata partial | Forbidden payload assertion test | tests/export-safety.spec.ts |
| P0-NEG-016 | SP-026, SP-027 | Monitoring creates due/overdue internal trigger | Review/rebalance monitoring creates internal trigger only, no automatic advice | review-monitoring-service partial | No client release/advice side effects test | tests/review-monitoring-service.spec.ts |
| P0-NEG-017 | SP-029..SP-032 | Offboarding revokes scoped access under spec/stub | Offboarding prevents residual payload visibility | none or spec only | Spec/control-layer negative test required | tests/offboarding-control.spec.ts |
| P0-NEG-018 | SP-033 | API/UI returns safe error states | API validation fail-closed and no silent state advance | some API 400 tests | Standard error envelope tests | tests/fail-closed-error-envelope.spec.ts |

---

## 11. Implementation Sequence with Dependencies

| Phase | Name | Tasks | Must Complete Before | Validation | Stop Rule |
| --- | --- | --- | --- | --- | --- |
| Phase 0 | Baseline Reality Check | WS-00 | All later phases | Inspect package.json, target files, existing tests, no main usage | Stop if target codebase differs or scripts/files missing without equivalent. |
| Phase 1 | Actor/Tenant/Scope Foundation | WCL-SP-001, WCL-SP-002, WCL-SHARED-001, WCL-SHARED-002 | RBAC, Visibility, Evidence, Workflow | Actor/scope tests pass | Stop if no deterministic actor model can be resolved. |
| Phase 2 | RBAC and Payload Visibility | WCL-SP-003, WCL-SP-004, WCL-SP-028, WCL-SHARED-003, WCL-SHARED-004 | Client Visibility, Evidence, Workflow, Export | Permission and payload negative tests pass | Stop if route access and action/payload visibility cannot be separated. |
| Phase 3 | Document and Evidence Control | WCL-SP-006..WCL-SP-010, WCL-SHARED-005 | Compliance release, export | Upload and sufficiency tests pass | Stop if upload success implies sufficiency anywhere. |
| Phase 4 | Workflow / Advice Boundary | WCL-SP-011..WCL-SP-018, WCL-SHARED-006 | Audit, Client Visibility, Export | Workflow gate tests pass | Stop if advisor approval can set client visibility/release. |
| Phase 5 | Audit Guard | WCL-SP-019, WCL-SP-020, WCL-SHARED-007 | Release/export role changes | Audit failure tests pass | Stop if critical action can complete without required audit. |
| Phase 6 | Client Visibility Projection | WCL-SP-005 | Portal/mobile/client projection claims | Client fail-closed tests pass | Stop if unreleased/internal payload reaches client. |
| Phase 7 | Export Safety | WCL-SP-021..WCL-SP-024, WCL-SHARED-008 | Final MVP trust output | Export redaction and lifecycle tests pass | Stop if preview/approval/download/share are conflated. |
| Phase 8 | Monitoring/Data Quality Guard | WCL-SP-025..WCL-SP-027 | P1 or support only | No-auto-advice tests pass | Stop if monitoring creates client-visible advice. |
| Phase 9 | Offboarding Control Contracts | WCL-SP-029..WCL-SP-032 | Future/full lifecycle proof | Spec/stub residual access tests pass | Stop if full offboarding needs product decision not in sources. |
| Phase 10 | Fail-Closed Feedback/API States | WCL-SP-033, WCL-SHARED-009 | All user/API surfaces | Error envelope and UI state tests pass | Stop if errors advance workflow or leak sensitive data. |
| Phase 11 | P0 Test Completion | All P0-NEG/POS tasks | Final validation | Targeted and full Playwright suites pass | Stop if any P0 negative cannot be implemented or classified. |
| Phase 12 | Final Reporting | All implemented tasks | None | Final report complete | Stop if changed files/tests/status cannot be reported by Task ID. |

---

## 12. Blocked / Deferred / Do-Not-Create Register

| Item ID | Item | Why Blocked / Deferred | Source | Can Become Task When | Current Instruction |
| --- | --- | --- | --- | --- | --- |
| BD-001 | KYC/AML / Source-of-Wealth / Suitability / IPS | Held/P2 by current scope; routes 064–067 unresolved and safety/policy-heavy. | Route scope and journey priority locks | Separate policy/suitability artefact unlocks routes and P0 safety rules. | DO_NOT_CREATE_MVP_TASK_NOW |
| BD-002 | Committee review routes 070–071 | Held routes with missing/non-public visuals and unresolved governance depth. | Route scope lock, screen-generation decision | Committee governance/scope/visual/P0 unlock exists. | HOLD_BLOCKED |
| BD-003 | Full P1 Communication Centre | P1 after MVP; not needed for first control-layer proof. | MVP scope and route scope | Communication journey is explicitly elevated. | P1_DEFERRED |
| BD-004 | Review Monitoring full service expansion | P1; only no-auto-advice internal guard is allowed now. | Route scope / monitoring safety | Review rhythm becomes MVP requirement by separate decision. | P1_DEFERRED_WITH_INTERNAL_GUARD_ONLY |
| BD-005 | Production banking/custody integrations | Explicit non-goal / not MVP. | MVP scope lock | Production integration roadmap exists. | DO_NOT_CREATE |
| BD-006 | Autonomous financial advice | Violates human-backed model. | MVP and advice-boundary contracts | Never in MVP; only explicit future policy could discuss assistive automation. | DO_NOT_CREATE |
| BD-007 | Client-visible AI Draft | Forbidden; AI/rules draft internal-only. | RBAC/advice-boundary contract | Never unless product policy fundamentally changes. | DO_NOT_CREATE |
| BD-008 | Manual client-visibility override | Visibility must be derived/fail-closed. | MVP and visibility contracts | Never in MVP. | DO_NOT_CREATE |
| BD-009 | Admin bypass | Admin cannot bypass advice/evidence/audit/export/release gates. | Safety contracts | Never. | DO_NOT_CREATE |
| BD-010 | New screen generation | No screen/state/image generation authorized. | Screen-generation brief says not authorized | Separate generation brief unlocks it. | DO_NOT_CREATE |
| BD-011 | Prisma migration / schema replacement | Full-workflow schema remains baseline; no blind patch replacement. | Schema reconciliation | Explicit migration handoff after field-level decision. | DO_NOT_CREATE |
| BD-012 | main-derived tasks | main is false-gap source only. | False-gap cleanup and final handoff | Never as target truth. | DO_NOT_CREATE |
| BD-013 | New API routes as default | Existing APIs must be hardened first. | API contract matrix | Explicit API_DECISION_REQUIRED accepted. | DO_NOT_CREATE_BY_DEFAULT |

---

## 13. Validation Commands and Reporting Pflicht

### 13.1 Repo Commands to Verify Before Execution

Die folgenden Befehle sind aus `package.json` des `full-workflow`-Snapshots als vorhanden abgeleitet. Codex muss sie vor Ausführung im aktuellen Repo erneut prüfen.

| Command | Purpose | When to Run | Notes |
| --- | --- | --- | --- |
| `pnpm typecheck` | TypeScript contract check | After service/API/type changes | Required for all implementation-ready tasks. |
| `pnpm lint` | Static lint check | After any code change | Required for all tasks. |
| `pnpm db:validate` | Prisma schema validation | After schema usage changes; no migration | Does not authorize migration. |
| `pnpm test:permissions` | Permission engine proof | WS-02 and admin non-bypass | Targeted safety suite. |
| `pnpm test:workflow-gate` | Workflow/advice boundary proof | WS-04 | Advisor-not-release and compliance preconditions. |
| `pnpm test:workflow-api` | Demo workflow API proof | WS-04 / WS-05 / WS-07 | Validate noClientRelease and API behaviour. |
| `pnpm test:file-export` | Export package proof slice | WS-07 | Must be supplemented by forbidden-payload tests. |
| `pnpm test:data-quality` | Data quality proof slice | WS-08 | Conditional support. |
| `pnpm test:phase-d` | Review monitoring proof slice | WS-08 | Must remain no-auto-advice. |
| `pnpm test:route-smoke` | Route shell proof | Final regression | Route access is not payload proof. |
| `pnpm test:playwright` | Full Playwright run | Final validation | If environment supports it. |
| `pnpm phase:check` | Combined typecheck/lint/db/build | Final validation | Package script exists; run when dependencies/env are ready. |

`pnpm test` ist im beobachteten `package.json` nicht als Script vorhanden. Codex darf es nur verwenden, wenn es im aktuellen Repo inzwischen existiert; sonst `pnpm test:playwright` oder targeted scripts nutzen.

### 13.2 Reporting Pflicht

| Report Field | Required Content |
| --- | --- |
| Changed files | Alle geänderten Dateien, gruppiert nach Task ID. |
| Implemented tasks | Task IDs, SP IDs, WCL layer. |
| Skipped / blocked tasks | Grund, Stop Rule, benötigte Entscheidung. |
| Tests run | Befehle + Ergebnis. |
| Tests not run | Präziser Grund, z. B. fehlende Dependencies/DB/env. |
| P0 proof status | Positive und negative Cases, passed/failed/missing. |
| Safety proof | RBAC, Visibility, Evidence, Audit, Export, Advice Boundary, Admin Non-Bypass. |
| Known gaps | Präzise Liste, keine vagen Caveats. |
| API/schema deviations | Jede API_DECISION_REQUIRED oder SCHEMA_DECISION_REQUIRED Markierung. |
| No-generation confirmation | Bestätigung: keine Screens, State-Screens, Images generiert. |
| No-main confirmation | Bestätigung: keine `main`-derived Tasks/Files verwendet. |

---

## 14. Final QA / Proof Section

### 14.1 QA Matrix

| QA Check | PASS/FAIL | Evidence |
| --- | --- | --- |
| All 33 system processes covered | PASS | Coverage Matrix enthält SP-001 bis SP-033; jede SP hat Task Card `WCL-SP-xxx`. |
| Generic Control Layer architecture created | PASS | 12 WCL Layer definieren Actor, Scope, RBAC, Visibility, Evidence, Workflow, Audit, Export, Monitoring, Offboarding und Fail-Closed. |
| No journey-by-journey overbuild | PASS | Task Pack bündelt Prozesse in Engines/Workstreams statt einzelne Journeys isoliert zu bauen. |
| MVP/P1/HOLD/SPEC labels preserved | PASS | P1 monitoring, held KYC/Committee und SPEC Offboarding werden nicht heimlich zu MVP gemacht. |
| No screen/image/state generation | PASS | Alle Task Cards verbieten Generation; Screen-generation block preserved. |
| No Prisma migration authorized | PASS | Schema Alignment Matrix erlaubt nur bestehende Baseline-Nutzung; Migrationen verboten. |
| Existing APIs used before new APIs | PASS | API Matrix nutzt nur vier bestehende Routen; neue APIs nur API_DECISION_REQUIRED. |
| `main` blocked as target truth | PASS | Source Lock und Stop Rules blocken main-derived Tasks. |
| Upload not treated as evidence sufficiency | PASS | SP-006/SP-010 und P0-NEG-009/010 erzwingen upload-only und sufficiency gate. |
| Advisor approval not treated as release | PASS | SP-014/SP-017 und P0-NEG-007 trennen Approval und Release. |
| Compliance release not treated as client acceptance | PASS | SP-017/SP-005 und Export/Visibility Regeln trennen Release, Projection und Acceptance. |
| Export preview not treated as approval | PASS | SP-021..SP-024 und P0-NEG-013/014 trennen Preview, Approval, Download/Share. |
| Route access not treated as payload visibility | PASS | SP-003/SP-004 und P0-NEG-003/004 trennen Access/Action/Payload. |
| Admin non-bypass preserved | PASS | SP-003/SP-028 und P0-NEG-011 blocken Admin Bypass. |
| P0 positive and negative tests specified | PASS | P0 Test Task Matrix enthält mindestens 18 negative/positive proof tasks. |
| Offboarding covered as control-layer/spec track | PASS | SP-029..SP-032 erhalten SPEC_REQUIRED Control-Layer-Cards und negative residual-access tests. |
| Blocked/deferred register complete | PASS | BD-001..BD-013 listen KYC, Committee, P1 communication/monitoring, banking, autonomous advice, AI draft, screen generation, migrations, main, APIs. |

### 14.2 ENGINE Execution Proof

| Phase | Engine Combination | What was done | Proof / Output |
| --- | --- | --- | --- |
| Phase 1 — Charter | ENGINE_v3 | Zielartefakt, Nicht-Implementierungsgrenze, Control-Layer-Prinzip und 33/33 Coverage gesperrt. | Sections 1, 4, 14 |
| Phase 2 — Source Intake | ENGINE_v3 Evidence | Atlas, Final Handoff, Task Master, Journey Requirements, P0, Schema, API, Safety Contracts und Route Scope als Hierarchie übernommen. | Section 2 |
| Phase 3 — Architecture Reframing | ENGINE_v2 | 33 Systemprozesse in 12 generische WealthOS-Control-Layer übersetzt. | Section 3 |
| Phase 4 — Task Decomposition | ENGINE_v2-B | Codex-taugliche Task Cards mit Target Files, Allowed/Forbidden Changes, Inputs/Outputs, Tests, Acceptance, Stop Rules erstellt. | Section 6 |
| Phase 5 — Safety Adversarial | ENGINE_v3 Adversarial | Negative Tests für unknown user, cross-tenant leak, AI Draft leak, advisor-not-release, upload-not-sufficiency, admin bypass, audit failure, export leakage ergänzt. | Section 10 |
| Phase 6 — Sequence and Dependency Convergence | ENGINE_v3 Convergence | Sichere Reihenfolge Foundation → RBAC/Visibility → Evidence → Workflow → Audit → Client Projection → Export → Monitoring/Offboarding → P0 Tests definiert. | Sections 5 and 11 |
| Phase 7 — QA / Proof | ENGINE_v3 QA | 33/33 Coverage, Stop Rules, No-overclaim, Scope Preservation, Blocked Register und Testpflichten geprüft. | Section 14 |

---

## Appendix A — Mandatory Codex Stop Rules

1. Stop if a Target File does not exist and no equivalent can be verified.
2. Stop if implementing a task requires a Prisma migration, unless a later explicit migration handoff exists.
3. Stop if a task would create a new API route without an accepted `API_DECISION_REQUIRED` resolution.
4. Stop if route scope must be reclassified.
5. Stop if a P1/HOLD/SPEC process must become MVP to complete the task.
6. Stop if a success path would imply downstream gate completion without actual gate proof.
7. Stop if a negative P0 test cannot be written because the expected safety behaviour is ambiguous.
8. Stop if a screen/state/image generation appears necessary.
9. Stop if any source or task derives target truth from `main`.
10. Stop if autonomous advice, client-visible AI Draft, manual visibility override or admin bypass is introduced.

## Appendix B — Compact Build Spine

The first implementation run should prove this compact control spine:

`ActorContext → TenantScope → PermissionDecision → VisibilityProjection → Upload Candidate → EvidenceSufficiencyResult → Internal Draft → Analyst Review → Advisor Approval → Compliance Review/Block/Release → Audit Guard → Decision Record → ClientSafeProjection → ExportRedaction/Approval → Fail-Closed Negative Tests`.

This build spine is not a separate journey. It is the generic machinery that later proves CJ/MJ journeys without rebuilding safety logic per journey.
