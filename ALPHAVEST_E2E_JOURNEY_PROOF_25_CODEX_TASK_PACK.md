# ALPHAVEST_E2E_JOURNEY_PROOF_25_CODEX_TASK_PACK.md
**Generated:** 2026-06-21  
**Mode:** Codex Task Pack / Implementation Task Specification only. Keine Implementierung. Keine Codeänderung. Keine Codex-Ausführung. Keine Testausführung. Keine Screen-, State-Screen-, Image-, API- oder Schema-Generierung.  
**Target repository:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`  
**Target branch:** `full-workflow`  
**Primary target codebase:** `alphavest-wealthos-clickdummy-full-workflow.zip`  
**Purpose:** Detaillierte Codex-Implementierungsaufgaben für alle 25 Canonical Journeys als E2E-Proofs auf der generischen WealthOS-Control-Layer-Architektur.

---

## 1. Executive Decision

**Artefaktstatus:** `E2E_JOURNEY_PROOF_25_CODEX_TASK_PACK_ACCEPTED_WITH_EXECUTION_DEPENDENCIES`  
**Task-Pack-Zweck:** Dieses Artefakt übersetzt die 25 Canonical Journeys aus dem Complete User Journey & Process Atlas in detaillierte Codex-Task-Cards. Der Fokus liegt nicht auf 25 isolierten Feature-Bauten, sondern auf E2E-Proof-Pfaden, die auf der generischen WealthOS-Control-Layer-Architektur laufen.

**Architekturprinzip:** Die generische Control Layer ist Pflichtbasis. Eine Journey gilt erst als beweisbar, wenn Actor/Tenant/Scope, RBAC, Payload Visibility, Evidence Sufficiency, Workflow/Advice Boundary, Audit, Compliance Release, Client Visibility, Export Redaction und Fail-Closed Feedback zusammenspielen. Einzelne Route/API/Schema/Test-Präsenz reicht nicht.

**Codex darf später in einem separaten Ausführungslauf:**

* Journey Proof Fixtures und Test-Harnesses ergänzen,
* bestehende APIs/Services/Engines für Journey-Proof härten,
* UI/API states und feedback fail-closed verdrahten,
* positive und negative P0-E2E-Tests ergänzen,
* Journey Coverage Reports für CJ-001 bis CJ-025 erzeugen.

**Codex darf nicht entscheiden:** Produktumfang, Routen-Scope, P1/HOLD-Elevation, neue Screens, neue State-Screens, neue Images, blindes Prisma-Schema-Replacement, Prisma-Migrationen, neue API-Routen ohne `API_DECISION_REQUIRED`, autonome Advice, Client-visible AI Draft, Admin Bypass oder `main`-derived Tasks.

| Journey Task Treatment | Anzahl | Bedeutung |
| --- | --- | --- |
| IMPLEMENTATION_READY / MVP Proof | 14 | MVP-Journeys und negative Safety-Proofs, die nach Control-Layer-Baseline als E2E-Proof-Tasks spezifiziert werden können. |
| MVP_SUPPORT / CONDITIONAL_SUPPORT | 5 | Foundation-, Context-, Governance- und Guest-Scope-Journeys, die für MVP-Proof relevant sind, aber nicht zur Scope-Ausweitung werden dürfen. |
| P1_DEFERRED / GUARD | 3 | Monitoring, Communication und Operations werden als no-bypass/no-auto-advice Guards behandelt, nicht als vollständige P1-Ausbaustufe. |
| HOLD_BLOCKED | 3 | KYC/SoW, Suitability/IPS und Committee Review bleiben held; nur Held-Guard-Proofs sind zulässig. |
| SPEC_REQUIRED / CONTROL_LAYER_SAFE_STUB | 1 | Offboarding erhält Spec-/Control-Track-Coverage, aber keine ungeprüfte Production-Implementation. |
**Nicht-Implementierungsstatus dieses Artefakts:** `TASK_PACK_ONLY_NOT_EXECUTED`. Dieses Markdown definiert spätere Codex-Aufgaben; es führt nichts aus.

---

## 2. Source-of-Truth Lock

| Rang | Source | Verwendung im Task Pack | Verbot | Task-Konsequenz |
| --- | --- | --- | --- | --- |
| 1 | ALPHAVEST_COMPLETE_USER_JOURNEY_PROCESS_ATLAS.md | Primäre Quelle für 25 Journeys, Journey-Step-Matrizen, Data Inputs, Result Outputs, Canonical Paths und Offboarding Deep Dive. | Nicht als Implementierungsbeweis behandeln. | Alle CJ-001 bis CJ-025 müssen Coverage, Proof Task und Testpflicht erhalten. |
| 2 | ALPHAVEST_WEALTHOS_CONTROL_LAYER_33_SYSTEM_PROCESS_CODEX_TASK_PACK.md | Primäre Architektur- und Prozess-Task-Basis: generische Control Layer, 33 Systemprozess-Coverage, Shared Engines, P0-Testpflichten. | Nicht als Beweis interpretieren, dass die Control Layer schon umgesetzt ist. | Journey Tasks hängen explizit von WCL-Dependencies ab; Control-Layer-Baseline muss zuerst validiert werden. |
| 3 | FINAL_CODEX_IMPLEMENTATION_HANDOFF.md | Finaler Constraint-Rahmen: Codex-Authority, Stop Rules, Target Branch/Codebase, No-Generation-Regeln. | Nicht als Freibrief für Scope-Ausweitung interpretieren. | Alle Tasks bleiben innerhalb locked MVP/MVP_SUPPORT oder werden P1/HOLD/SPEC markiert. |
| 4 | FINAL_CODEX_TASK_MASTER.md | Bestehende Task-Logik, P0-Pflichten, Blocker, Do-not-create Items. | Nicht ungeprüft duplizieren. | Dieses Pack refokussiert auf Journey-Proof statt Control-Layer-Implementierung. |
| 5 | ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md | Journey-first Requirements, Foundation Requirements, positive/negative Akzeptanz. | Nicht als Codebeweis verwenden. | MVP-Spine und negative Akzeptanz in E2E Tests übernehmen. |
| 6 | ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md | 12 Mega-Journeys, MVP/P1/Hold-Priorisierung, erster Produktbaupfad, Auth-Korrektur. | Keine ungeprüfte Journey-Ausweitung. | MVP Core bleibt MJ-001, MJ-002, MJ-003, MJ-010, MJ-006, MJ-005. |
| 7 | P0_TEST_ACCEPTANCE_MATRIX.md | Vorhandene Proof-Slices und fehlende positive/negative Tests. | Vorhandene Tests nicht als komplette P0-Abdeckung überclaimen. | Jede Journey braucht explizite positive und negative Testpflicht. |
| 8 | SCHEMA_FIELD_LEVEL_RECONCILIATION.md | Full-workflow Schema Baseline, Field-Level Safety Obligations. | Kein blindes Patch-Schema-Replacement. | Bestehende Modelle/Felder nutzen; fehlende Felder als Entscheidung markieren. |
| 9 | API_CONTRACT_MATRIX.md | Bestehende API-Baseline: /api/demo-workflow, /api/documents, /api/documents/upload, /api/review-monitoring. | API-Präsenz nicht als API-Safety-Beweis behandeln. | Bestehende APIs härten und beweisen; neue APIs nur API_DECISION_REQUIRED. |
| 10 | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md | Evidence Sufficiency, Audit Persistence, Export/Redaction Safety. | Upload/Export/Audit-UI nicht als Safety Proof behandeln. | Evidence/Export Journeys müssen fail-closed Proofs enthalten. |
| 11 | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md | RBAC, Payload Visibility, AI Draft internal-only, No-unapproved-advice, Admin Non-Bypass. | Route Access nicht als Payload Visibility behandeln. | Route, Action, Object, Payload getrennt testen. |
| 12 | FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md | Feedback, Validation, Error, Fail-Closed Messaging. | Feedback nicht als Implementierungsbeweis behandeln. | E2E Success/Failure-Wording darf keine downstream gates überclaimen. |
| 13 | DRAWER_MODAL_INTERACTION_CONTRACT.md | Overlay-/Modal-/Wizard-/Upload-Lifecycles. | Sichtbare Overlays nicht als Lifecycle-Beweis behandeln. | Journey UI Tasks dürfen nur verdrahten, nicht visuelle Assets erzeugen. |
| 14 | STATE_SCREEN_SPEC.md | Route- und Flow-State Requirements. | Keine State-Screen-Bilder generieren. | States als code-/feedbackseitige Zustände beweisen. |
| 15 | ROUTE_SCOPE_LOCK.md + ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md | 71-Routen-Universum, Scope Labels, Visual-Proof-Limits. | Routen nicht umklassifizieren; PNGs nicht als Verhalten beweisen. | P1/HOLD/REFERENCE Labels bleiben bindend. |
| 16 | MVP_SCOPE_LOCK.md | MVP Boundary, Non-Goals, P0 Scope. | MVP nicht unkontrolliert erweitern. | MVP Journey Proofs müssen nicht alle WealthOS-Future-Capabilities bauen. |
| 17 | ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md | Schema/domain/patch rebase. | Schema gate nicht als passed behandeln. | Schema Alignment, keine Migration. |
| 18 | ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md | Real/partial/static/deterministic interaction truth. | Visual/static states nicht als Verhalten überclaimen. | E2E Tasks müssen Lifecycle/State/Audit/Test proof ergänzen. |
| 19 | ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md | Target code inventory: routes/APIs/schema/tests/assets. | Inventory nicht als Readiness Proof behandeln. | Target Files vor Edit prüfen. |
| 20 | alphavest_mvp_artifact_completion_patch.zip | MVP Control Spec only. | Nicht blind ersetzen. | Control-Begriffe nur als Contract Input. |
| 21 | alphavest-wealthos-clickdummy-full-workflow.zip | Primary Target Codebase. | Nicht annehmen, dass alles darin fertig ist. | Nur full-workflow ist Target. |
| 22 | alphavest-wealthos-clickdummy-main.zip | False-gap source only. | Niemals target truth. | Keine main-derived Tasks. |

---

## 3. E2E Journey Proof Architecture Overview

| Proof Layer ID | Layer Name | Responsibility | Covered Journeys | Required Control Layers | Primary Services / Engines | Safety Gates | Implementation Status | Main Task Group |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E2E-PL-01 | Foundation Journey Proof | Actor, current user, tenant, role, consent und setup E2E beweisen. | CJ-001, CJ-002, CJ-003 | WCL-01, WCL-02, WCL-03, WCL-08, WCL-12 | demo-session-provider, auth/admin/client screens, /api/demo-workflow, prisma seed | RBAC, tenant isolation, consent, audit | CONTROL_LAYER_REQUIRED | E2E-TG-FOUNDATION |
| E2E-PL-02 | Document and Evidence Journey Proof | Upload, document row, extraction, evidence link und sufficiency E2E beweisen. | CJ-004, CJ-005, CJ-025 | WCL-02, WCL-03, WCL-05, WCL-06, WCL-08, WCL-12 | document upload API/service, evidence-service, client-intake-screen | Upload not sufficiency, evidence sufficiency, audit | IMPLEMENTATION_READY_PROOF | E2E-TG-EVIDENCE |
| E2E-PL-03 | Internal Workflow and Advice Boundary Proof | Trigger, AI/rules draft, analyst review und unsupported claim rejection beweisen. | CJ-006, CJ-007, CJ-008 | WCL-03, WCL-04, WCL-06, WCL-07, WCL-08, WCL-12 | workflow-gate, demo-workflow-mutation, internal-workflow-screen | AI draft internal-only, no unapproved advice, evidence link | IMPLEMENTATION_READY_PROOF | E2E-TG-WORKFLOW |
| E2E-PL-04 | Human Approval and Compliance Proof | Advisor approval getrennt von compliance block/request/release beweisen. | CJ-009, CJ-010 | WCL-06, WCL-07, WCL-08, WCL-12 | workflow-gate, audit-service, internal-workflow-screen, decisions-governance-screen | Advisor approval not release, compliance release required, audit | IMPLEMENTATION_READY_PROOF | E2E-TG-COMPLIANCE |
| E2E-PL-05 | Client Visibility and Decision Proof | Fail-closed portal/mobile, decision room und client-safe projection beweisen. | CJ-011 | WCL-04, WCL-07, WCL-08, WCL-12 | visibility-engine, client-intake-screen, decisions-governance-screen | Client fail-closed, payload redaction, no AI draft leakage | IMPLEMENTATION_READY_PROOF | E2E-TG-VISIBILITY |
| E2E-PL-06 | Governance and Negative Safety Proof | Access requests, cross-tenant denial, admin non-bypass und audit failure beweisen. | CJ-012, CJ-013, CJ-014, CJ-023 | WCL-01, WCL-02, WCL-03, WCL-08, WCL-12 | permission-engine, audit-service, governance screens, /api/demo-workflow | Admin non-bypass, tenant isolation, audit fail-closed | IMPLEMENTATION_READY_NEGATIVE_PROOF | E2E-TG-GOVERNANCE |
| E2E-PL-07 | Export and Redaction Proof | Export scope, redaction, preview, approval und download/share E2E beweisen. | CJ-015 | WCL-04, WCL-08, WCL-09, WCL-12 | export-service, export-package-service, communication-export-ops-screen | Preview not approval, redaction, forbidden payload absent | IMPLEMENTATION_READY_PROOF | E2E-TG-EXPORT |
| E2E-PL-08 | Monitoring / Communication / Ops Conditional Proof | P1/conditional Journeys mit no-auto-advice/no-bypass Guards behandeln. | CJ-016, CJ-017, CJ-018, CJ-019 | WCL-01, WCL-02, WCL-03, WCL-08, WCL-10, WCL-12 | review-monitoring-service, communication-export-ops-screen, /api/review-monitoring | No automatic advice, no communication bypass, guest object scope | CONDITIONAL_SUPPORT / P1_DEFERRED | E2E-TG-P1-GUARDS |
| E2E-PL-09 | Held High-Risk Journey Guard Proof | KYC/SoW, suitability/IPS und committee review als held/block states beweisen, nicht implementieren. | CJ-020, CJ-021, CJ-022 | WCL-03, WCL-04, WCL-07, WCL-08, WCL-12 | kyc/suitability/committee screens as held surfaces only | Held route no-elevation, no silent release bypass | HOLD_BLOCKED_GUARD_ONLY | E2E-TG-HOLD-GUARDS |
| E2E-PL-10 | Offboarding Control Proof | Access revocation, final export, retention/archive/legal hold als SPEC/P1-Control-Track behandeln. | CJ-024 | WCL-02, WCL-03, WCL-08, WCL-09, WCL-11, WCL-12 | TARGET_FILE_TO_VERIFY; governance/export/document areas | Access revocation, residual payload hidden, audit/retention | SPEC_REQUIRED / CONTROL_LAYER_SAFE_STUB | E2E-TG-OFFBOARDING |

---

## 4. Journey Coverage Matrix — 25/25

| Journey ID | Journey Name | Scope / Treatment | Proof Layer | Related Control Layers | Task ID(s) | Implementation Strategy | Target Files / Areas | Required Positive Tests | Required Negative Tests | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CJ-001 | Client Onboarding: Invite → Identity → Consent → Role Confirmation | MVP_SUPPORT / FOUNDATION_PROOF | E2E-PL-01 | WCL-01, WCL-02, WCL-03, WCL-08, WCL-12 | E2E-CJ-001 | Onboarding als scoped Actor/Tenant/Consent-Proof verdrahten; keine Production-IAM-Überdehnung. | components/auth-onboarding-screen.tsx; components/demo-session-provider.tsx; lib/permission-engine.ts; prisma/seed.ts; app/api/demo-workflow/route.ts | Eingeladener User wird mapped Actor mit Tenant-Rolle und Consent. | Unknown/uninvited user bleibt denied; keine anonymous payload expansion. | IMPLEMENTATION_READY / FOUNDATION |
| CJ-002 | Tenant Setup and Team Assignment | MVP_SUPPORT / FOUNDATION_PROOF | E2E-PL-01 | WCL-01, WCL-02, WCL-03, WCL-08, WCL-12 | E2E-CJ-002 | Tenant-Setup-Flow als kontrolliertes Bootstrap mit Team-/Policy-/Audit-Beweis. | components/admin-tenant-setup-screen.tsx; lib/demo-workflow-mutation.ts; lib/permission-engine.ts; lib/audit-service.ts; prisma/seed.ts | Tenant wird active/setup-blocked mit assignierten Rollen und Audit. | Tenant activation ohne required setup/team/policy bleibt blocked. | IMPLEMENTATION_READY / FOUNDATION |
| CJ-003 | Client Context Setup: Profile, Family, Relationships, Entities, Wealth Map | MVP_SUPPORT / CONTEXT_PROOF | E2E-PL-01 | WCL-01, WCL-02, WCL-04, WCL-08, WCL-12 | E2E-CJ-003 | Kontext-Graph scoped und payload-redacted beweisen, ohne full Wealth-Graph zu überbauen. | components/client-intake-screen.tsx; lib/visibility-engine.ts; lib/demo-workflow-mutation.ts; prisma/seed.ts | Client-/Family-/Entity-Kontext ist tenant-scoped sichtbar. | Unrelated actor sieht keine sensiblen Context-Payloads. | CONDITIONAL_SUPPORT |
| CJ-004 | Document Upload and Intake | MVP / IMPLEMENTATION_READY_PROOF | E2E-PL-02 | WCL-02, WCL-03, WCL-05, WCL-08, WCL-12 | E2E-CJ-004 | Bestehenden starken Upload-Slice zur E2E-Evidence-Intake-Story mit negativen Proofs härten. | components/client-intake-screen.tsx; app/api/documents/upload/route.ts; app/api/documents/route.ts; lib/document-upload-service.ts; lib/document-storage-adapter.ts | Erlaubter Upload erzeugt Document/Version/Extraction/EvidenceCandidate/Audit und reloadbare Dokumentliste. | Invalid type/forbidden role/wrong tenant erzeugt reject/deny ohne rows/sufficiency. | IMPLEMENTATION_READY |
| CJ-005 | Evidence Review, Linkage and Sufficiency | MVP / SAFETY_CRITICAL_PROOF | E2E-PL-02 | WCL-05, WCL-06, WCL-07, WCL-08, WCL-12 | E2E-CJ-005 | Evidence Lifecycle von Review/Linkage/Sufficiency als Gate-Basis beweisen. | lib/evidence-service.ts; lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; components/client-intake-screen.tsx; components/decisions-governance-screen.tsx | Reviewed linked relevant evidence kann sufficiency result liefern. | Uploaded/unreviewed/unlinked/stale/wrong-scope evidence bleibt insufficient und blockiert release/export. | IMPLEMENTATION_READY / SAFETY_CRITICAL |
| CJ-006 | Signal / Trigger Intake | MVP / INTERNAL_WORKFLOW_PROOF | E2E-PL-03 | WCL-02, WCL-03, WCL-07, WCL-08, WCL-12 | E2E-CJ-006 | Signale in interne Trigger überführen; keine direkte Advice oder Client Visibility. | components/internal-workflow-screen.tsx; lib/demo-workflow-mutation.ts; lib/demo-workflow-validation.ts; lib/review-monitoring-service.ts | Scoped signal creates internal Trigger/ActionItem with audit. | Trigger creation never creates client-visible advice/release. | IMPLEMENTATION_READY / INTERNAL_ONLY |
| CJ-007 | Internal AI / Rules Draft Creation | MVP / ADVICE_BOUNDARY_PROOF | E2E-PL-03 | WCL-04, WCL-07, WCL-08, WCL-12 | E2E-CJ-007 | AI/Rules Draft als internal-only Recommendation state beweisen. | lib/workflow-gate.ts; lib/visibility-engine.ts; lib/demo-workflow-mutation.ts; components/internal-workflow-screen.tsx | Internal draft is created and visible only to allowed internal actor. | Client/API/export payload never contains AI Draft/internal rationale. | IMPLEMENTATION_READY / SAFETY_CRITICAL |
| CJ-008 | Analyst Review and Unsupported Claim Rejection | MVP / HUMAN_REVIEW_PROOF | E2E-PL-03 | WCL-06, WCL-07, WCL-08, WCL-12 | E2E-CJ-008 | Analyst Review blockiert unsupported claims und kann evidence-backed rebuild anfordern. | components/internal-workflow-screen.tsx; lib/workflow-gate.ts; lib/evidence-service.ts; lib/demo-workflow-mutation.ts | Analyst akzeptiert supported draft oder rejected unsupported draft with reason/audit. | Unsupported draft cannot advance to advisor/client without analyst review/rebuild. | IMPLEMENTATION_READY / SAFETY_CRITICAL |
| CJ-009 | Advisor Approval | MVP / HUMAN_APPROVAL_PROOF | E2E-PL-04 | WCL-06, WCL-07, WCL-08, WCL-12 | E2E-CJ-009 | Advisor Approval als eigenes Gate beweisen, getrennt von Compliance Release. | components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; lib/workflow-gate.ts; lib/audit-service.ts; lib/demo-workflow-mutation.ts | Advisor-approved item moves to compliance pending with audit. | Advisor approval does not set clientVisible/releasedToClientAt. | IMPLEMENTATION_READY / SAFETY_CRITICAL |
| CJ-010 | Compliance Block / Request Evidence / Release | MVP / COMPLIANCE_RELEASE_PROOF | E2E-PL-04 | WCL-06, WCL-07, WCL-08, WCL-12 | E2E-CJ-010 | Compliance review/block/request/release mit Preconditions und Audit beweisen. | components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; lib/workflow-gate.ts; lib/evidence-service.ts; lib/audit-service.ts; lib/demo-workflow-mutation.ts | Compliance release succeeds only with advisor approval, evidence sufficiency and audit. | Missing evidence/advisor/audit blocks or holds release. | IMPLEMENTATION_READY / SAFETY_CRITICAL |
| CJ-011 | Client Visibility and Digital Decision Room | MVP / CLIENT_VISIBILITY_PROOF | E2E-PL-05 | WCL-04, WCL-07, WCL-08, WCL-12 | E2E-CJ-011 | Client-safe projection fail-closed vor release und redacted nach release beweisen. | components/client-intake-screen.tsx; components/decisions-governance-screen.tsx; lib/visibility-engine.ts; lib/workflow-gate.ts | Released decision produces client-safe projection/decision room view. | Unreleased/internal/AI/compliance note payloads hidden/redacted. | IMPLEMENTATION_READY / SAFETY_CRITICAL |
| CJ-012 | Governance: Role, Access Request, Second Confirmation | MVP_SUPPORT / GOVERNANCE_PROOF | E2E-PL-06 | WCL-01, WCL-02, WCL-03, WCL-08, WCL-12 | E2E-CJ-012 | Governance lifecycle mit role/access/second confirmation beweisen, ohne gate bypass. | components/admin-tenant-setup-screen.tsx; components/decisions-governance-screen.tsx; lib/permission-engine.ts; lib/audit-service.ts; lib/demo-workflow-mutation.ts | Allowed governance actor approves/denies scoped access with audit/confirmation where required. | Role/access route access does not grant advice/release/export/payload visibility. | IMPLEMENTATION_READY / MVP_SUPPORT |
| CJ-013 | Cross-Tenant / Wrong-Object Denial | MVP / NEGATIVE_SAFETY_PROOF | E2E-PL-06 | WCL-01, WCL-02, WCL-03, WCL-04, WCL-08, WCL-12 | E2E-CJ-013 | Wrong tenant/object denial as core negative regression across document/export/workflow payloads. | lib/permission-engine.ts; lib/visibility-engine.ts; app/api/documents/route.ts; app/api/documents/upload/route.ts; app/api/demo-workflow/route.ts | Correct scoped actor sees/acts on own tenant objects. | Wrong tenant/object denied with no payload leak and audit. | IMPLEMENTATION_READY / NEGATIVE_SAFETY |
| CJ-014 | Admin Non-Bypass | MVP / NEGATIVE_GOVERNANCE_PROOF | E2E-PL-06 | WCL-03, WCL-06, WCL-07, WCL-08, WCL-09, WCL-12 | E2E-CJ-014 | Admin power als governance-only beweisen; kein safety gate override. | lib/permission-engine.ts; lib/workflow-gate.ts; lib/evidence-service.ts; lib/export-service.ts; lib/audit-service.ts; app/api/demo-workflow/route.ts | Admin can perform allowed governance action within policy. | Admin cannot force release/evidence sufficiency/export approval/client visibility. | IMPLEMENTATION_READY / NEGATIVE_GOVERNANCE |
| CJ-015 | Export Scope, Redaction, Preview, Approval, Download / Share | MVP / EXPORT_SAFETY_PROOF | E2E-PL-07 | WCL-04, WCL-08, WCL-09, WCL-12 | E2E-CJ-015 | Export lifecycle mit Scope, Redaction, Preview, Approval, Download/Share getrennt beweisen. | components/communication-export-ops-screen.tsx; lib/export-service.ts; lib/export-package-service.ts; lib/visibility-engine.ts; lib/audit-service.ts; lib/demo-workflow-mutation.ts | Released scoped decision yields redacted approved export and downloadable/shareable package. | Preview not approval; approval not download/share; forbidden internal payload absent. | IMPLEMENTATION_READY / SAFETY_CRITICAL |
| CJ-016 | Review Rhythm / Monitoring / Rebalance Review without Automatic Advice | P1_AFTER_MVP / INTERNAL_ONLY_GUARD | E2E-PL-08 | WCL-02, WCL-03, WCL-07, WCL-08, WCL-10, WCL-12 | E2E-CJ-016 | Nur no-auto-advice Guard und interne Trigger beweisen; keine vollständige P1-Expansion. | components/review-monitoring-screen.tsx; lib/review-monitoring-service.ts; app/api/review-monitoring/route.ts; lib/demo-workflow-mutation.ts | Review due/rebalance creates internal review trigger only. | Monitoring never creates client advice/release/clientVisible state automatically. | P1_DEFERRED / CONTROL_LAYER_SAFE_STUB |
| CJ-017 | Communication / Client Request / Call Trigger | P1_AFTER_MVP / CONDITIONAL_SUPPORT | E2E-PL-08 | WCL-02, WCL-03, WCL-04, WCL-07, WCL-08, WCL-12 | E2E-CJ-017 | Kommunikation als P1 Guard: client request darf Advice/Compliance nicht umgehen. | components/communication-export-ops-screen.tsx; components/client-intake-screen.tsx; lib/demo-workflow-mutation.ts; TARGET_FILE_TO_VERIFY for message service | Client request is triaged into internal action/workflow when scoped. | Message/call trigger cannot create unapproved client advice or bypass compliance. | P1_DEFERRED / CONDITIONAL_SUPPORT |
| CJ-018 | Operations Queues / SLA / Data Quality Remediation | P1_AFTER_MVP / MVP_SUPPORT_CONDITIONAL | E2E-PL-08 | WCL-02, WCL-03, WCL-06, WCL-08, WCL-10, WCL-12 | E2E-CJ-018 | Data quality as release-blocking support guard; full ops/SLA bleibt P1. | components/communication-export-ops-screen.tsx; lib/review-monitoring-service.ts; TARGET_FILE_TO_VERIFY data-quality service; lib/workflow-gate.ts | High severity data quality issue blocks readiness/release until resolved. | Ops/SLA action cannot release advice or bypass compliance/evidence. | CONDITIONAL_SUPPORT / P1_DEFERRED |
| CJ-019 | External Advisor / Guest Scoped Access | MVP_SUPPORT / P1_AFTER_MVP_CONDITIONAL | E2E-PL-08 | WCL-01, WCL-02, WCL-03, WCL-04, WCL-08, WCL-12 | E2E-CJ-019 | Guest access object-scoped beweisen, aber keine tenant-wide collaboration überbauen. | components/auth-onboarding-screen.tsx; components/admin-tenant-setup-screen.tsx; components/client-intake-screen.tsx; lib/permission-engine.ts; lib/visibility-engine.ts; app/api/documents/route.ts | External advisor sees only explicitly scoped object/document. | Guest sees no tenant-wide payload, internal workflow, release/export authority. | CONDITIONAL_SUPPORT |
| CJ-020 | KYC / AML / Source-of-Wealth Review | HOLD_PENDING_DECISION | E2E-PL-09 | WCL-03, WCL-04, WCL-06, WCL-07, WCL-08, WCL-12 | E2E-CJ-020 | Held-route guard beweisen: keine MVP-Implementation, nur block/hold state und no-release bypass. | components/kyc-aml-workflow-screen.tsx; app/api/demo-workflow/route.ts; lib/workflow-gate.ts; lib/visibility-engine.ts | Held KYC/SoW state is visible as blocked/decision-required when accessed internally. | KYC held route cannot silently become MVP flow or release advice. | HOLD_BLOCKED / NO_CODE_TASK_ALLOWED_EXCEPT_GUARD |
| CJ-021 | Suitability / IPS / Mandate | HOLD_PENDING_DECISION | E2E-PL-09 | WCL-03, WCL-04, WCL-07, WCL-08, WCL-12 | E2E-CJ-021 | Advice-sensitive held capability nur als blocked guard behandeln. | components/suitability-ips-screen.tsx; lib/workflow-gate.ts; lib/visibility-engine.ts; app/api/demo-workflow/route.ts | Suitability/IPS route remains held until policy/scope unlock. | Held suitability/IPS cannot create client-visible mandate/advice. | HOLD_BLOCKED / NO_CODE_TASK_ALLOWED_EXCEPT_GUARD |
| CJ-022 | Committee Review and Dissent | HOLD_PENDING_DECISION | E2E-PL-09 | WCL-03, WCL-04, WCL-07, WCL-08, WCL-12 | E2E-CJ-022 | Committee review labels/held status beweisen; keine vote/dissent mutation implementieren ohne Unlock. | components/committee-review-screen.tsx; lib/workflow-gate.ts; app/api/demo-workflow/route.ts; tests/committee-review-routes.spec.ts | Committee routes remain available as held/reference proof with no clientVisible leakage. | Committee cannot become silent release bypass or MVP approval gate without unlock. | HOLD_BLOCKED / NO_CODE_TASK_ALLOWED_EXCEPT_GUARD |
| CJ-023 | Audit Failure / Safety Action Held | MVP / NEGATIVE_SAFETY_PROOF | E2E-PL-06 | WCL-08, WCL-12 plus WCL-03/WCL-07/WCL-09 | E2E-CJ-023 | Audit failure simulation/test seam für kritische mutations beweisen. | lib/audit-service.ts; lib/demo-workflow-mutation.ts; lib/workflow-gate.ts; lib/export-service.ts; app/api/demo-workflow/route.ts; app/api/documents/upload/route.ts | Audit writes for critical release/block/export/access action. | Audit write failure holds/denies safety action and prevents silent completion. | IMPLEMENTATION_READY / NEGATIVE_SAFETY |
| CJ-024 | Offboarding: Access Revocation, Final Export, Retention, Archive | SPEC_REQUIRED / P1_AFTER_MVP | E2E-PL-10 | WCL-02, WCL-03, WCL-08, WCL-09, WCL-11, WCL-12 | E2E-CJ-024 | Offboarding als SPEC/P1-Control-Track: access revocation/residual visibility/final export/legal hold contracts, keine Full Production ohne Unlock. | TARGET_FILE_TO_VERIFY for offboarding service; components/admin-tenant-setup-screen.tsx; components/decisions-governance-screen.tsx; lib/export-service.ts; lib/audit-service.ts; prisma/seed.ts | Offboarding pending/revoked state prevents access and can trigger final export/retention decision. | Revoked user has no residual payload visibility; final export blocked without scope/redaction/audit. | SPEC_REQUIRED / CONTROL_LAYER_SAFE_STUB |
| CJ-025 | Upload / Error / Retry / Permission Denied Exception Journey | MVP / FAIL_CLOSED_PROOF | E2E-PL-02 | WCL-03, WCL-05, WCL-06, WCL-08, WCL-12 | E2E-CJ-025 | Upload- und API-Fehlerzustände beweisen: retry/reselect/denied ohne false progress. | components/client-intake-screen.tsx; app/api/documents/upload/route.ts; app/api/documents/route.ts; lib/document-upload-service.ts; lib/audit-service.ts | Valid retry after recoverable error can succeed without stale state. | Invalid type/size/API error/denied role creates no sufficiency/release/client visibility. | IMPLEMENTATION_READY / FAIL_CLOSED |

---

## 5. E2E Proof Workstream Plan

| Workstream ID | Workstream | Purpose | Included Journeys | Dependencies | Why this order | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| E2E-WS-00 | Repo/Source Reality Audit and Control-Layer Baseline Validation | Prüfe full-workflow Target, package scripts, bestehende Module, aktuelle Tests und Control-Layer-Task-Pack-Annahmen. | Alle CJ indirekt | Keine | Verhindert falsche Pfade und task-smuggling. | Baseline report: files verified, scripts verified, no main usage, Control-Layer dependencies classified. |
| E2E-WS-01 | E2E Proof Fixtures, Seed Matrix and Actor/Tenant Journey Context | Fixture-Harness für Actor/Tenant/Role/Object/Data States aufbauen. | CJ-001–CJ-025 | E2E-WS-00 | Ohne reproduzierbare Fixtures sind Journey-Proofs nicht belastbar. | Seed/fixture matrix with positive/negative actors and objects. |
| E2E-WS-02 | Foundation Journeys: Onboarding, Tenant Setup, Client Context | Onboarding/Setup/Context als scoped foundation beweisen. | CJ-001, CJ-002, CJ-003 | WS-01/WCL-01..04 baseline | Späterer Evidence/Advice Proof braucht Actor/Tenant/Context. | Foundation e2e tests and route/API feedback checks. |
| E2E-WS-03 | Document and Evidence Journeys | Upload, intake, evidence review/link/sufficiency and exception handling beweisen. | CJ-004, CJ-005, CJ-025 | Foundation + WCL-05/WCL-06 | Evidence ist Compliance-Gate-Voraussetzung. | Upload positive/negative and sufficiency lifecycle tests. |
| E2E-WS-04 | Internal Workflow and Advice Boundary Journeys | Signal, AI/rules draft, analyst review, unsupported claim rejection beweisen. | CJ-006, CJ-007, CJ-008 | Evidence/visibility/audit baseline | Internal draft darf nie client-visible werden. | Internal-only draft tests and unsupported-claim rejection tests. |
| E2E-WS-05 | Advisor Approval and Compliance Release Journeys | Advisor gate und Compliance gate getrennt beweisen. | CJ-009, CJ-010 | WCL-06/WCL-07/WCL-08 | Release darf erst nach evidence/advisor/audit entstehen. | Advisor-not-release and compliance release/block tests. |
| E2E-WS-06 | Client Visibility and Decision Room Proof | Client-safe fail-closed projection beweisen. | CJ-011 | Compliance release + visibility engine | Client-facing Proof darf nicht leaken. | Portal/mobile/decision payload redaction tests. |
| E2E-WS-07 | Governance, Cross-Tenant Denial, Admin Non-Bypass and Audit Failure Proof | Negative Safety-Proofs als Regression Spine bauen. | CJ-012, CJ-013, CJ-014, CJ-023 | RBAC/audit baseline | Trust entsteht durch bewiesene Denials, nicht nur Happy Paths. | Cross-tenant, admin bypass, audit failure tests. |
| E2E-WS-08 | Export Scope, Redaction, Approval and Delivery Proof | Export lifecycle beweisen. | CJ-015 | Client visibility + audit | Export ist kritischer Trust Output. | Preview/approval/download separation and forbidden payload tests. |
| E2E-WS-09 | Conditional P1 / Monitoring / Communication / External Advisor Proof Guards | P1/conditional Journeys als Guards, keine Full Implementation. | CJ-016, CJ-017, CJ-018, CJ-019 | Foundation, RBAC, visibility | P1 darf MVP-Safety nicht umgehen. | No-auto-advice, communication no-bypass, guest object-scope tests. |
| E2E-WS-10 | Hold-Blocked High-Risk Journey Guards | Held high-risk journeys bleiben blocked, nicht heimlich MVP. | CJ-020, CJ-021, CJ-022 | Route/Scope/Hold labels | KYC/Suitability/Committee brauchen eigene Unlocks. | Held-route guard tests and no client release proof. |
| E2E-WS-11 | Offboarding Control Proof Track | Offboarding als SPEC/P1-Control-Track absichern. | CJ-024 | Access, audit, export baseline | Offboarding ist echter WealthOS Bedarf, aber nicht unkontrolliert MVP. | Spec/stub tests for revoked access/final export/retention gates. |
| E2E-WS-12 | Full Canonical Path Regression and Reporting | 12 Canonical Paths mit Tasks/Teststatus reporten. | Alle CJ | E2E-WS-01..11 | Abschlussproof über Path-Sequenzen statt isolierte Tasks. | Journey proof status report CJ-001..CJ-025 + canonical path matrix. |

---

## 6. Detailed Codex Journey Task Cards

**Anwendungsregel:** Jede Task Card ist eine spätere Codex-Aufgabe. Dieses Artefakt führt sie nicht aus. Codex muss vor jeder Dateiänderung prüfen, ob die genannten Target Files im `full-workflow`-Target existieren. Neue API-Routen, Prisma-Migrationen, Screens, State-Screens und Images sind nicht autorisiert. Wenn eine Journey `P1_DEFERRED`, `HOLD_BLOCKED` oder `SPEC_REQUIRED` ist, darf nur der ausdrücklich beschriebene Guard-/Coverage-/Spec-Task ausgeführt werden.

### 6.1 Task Card — `E2E-CJ-001`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-001` |
| Task Title | Client Onboarding: Invite → Identity → Consent → Role Confirmation — E2E Journey Proof Task |
| Journey Coverage | `CJ-001` |
| Source Journey / Mega Journey | MJ-001 |
| Proof Layer | E2E-PL-01 |
| Scope Label | MVP_SUPPORT / FOUNDATION_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Onboarding als scoped Actor/Tenant/Consent-Proof verdrahten; keine Production-IAM-Überdehnung. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-01, WCL-02, WCL-03, WCL-08, WCL-12 |
| Target Files / Areas | components/auth-onboarding-screen.tsx; components/demo-session-provider.tsx; lib/permission-engine.ts; prisma/seed.ts; app/api/demo-workflow/route.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Eingeladener User wird mapped Actor mit Tenant-Rolle und Consent. |
| API / Service Impact | /api/demo-workflow; API_DECISION_REQUIRED only for current-user if no service seam exists |
| Schema Impact | User, UserProfile, ConsentRecord, UserRole, ClientTenant, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Eingeladener User wird mapped Actor mit Tenant-Rolle und Consent. |
| Negative Tests | Unknown/uninvited user bleibt denied; keine anonymous payload expansion. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-001` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.2 Task Card — `E2E-CJ-002`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-002` |
| Task Title | Tenant Setup and Team Assignment — E2E Journey Proof Task |
| Journey Coverage | `CJ-002` |
| Source Journey / Mega Journey | MJ-001 |
| Proof Layer | E2E-PL-01 |
| Scope Label | MVP_SUPPORT / FOUNDATION_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Tenant-Setup-Flow als kontrolliertes Bootstrap mit Team-/Policy-/Audit-Beweis. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-01, WCL-02, WCL-03, WCL-08, WCL-12 |
| Target Files / Areas | components/admin-tenant-setup-screen.tsx; lib/demo-workflow-mutation.ts; lib/permission-engine.ts; lib/audit-service.ts; prisma/seed.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Tenant wird active/setup-blocked mit assignierten Rollen und Audit. |
| API / Service Impact | /api/demo-workflow |
| Schema Impact | PlatformTenant, ClientTenant, Role, UserRole, PolicyDefinition, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Tenant wird active/setup-blocked mit assignierten Rollen und Audit. |
| Negative Tests | Tenant activation ohne required setup/team/policy bleibt blocked. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-002` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.3 Task Card — `E2E-CJ-003`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-003` |
| Task Title | Client Context Setup: Profile, Family, Relationships, Entities, Wealth Map — E2E Journey Proof Task |
| Journey Coverage | `CJ-003` |
| Source Journey / Mega Journey | MJ-001 |
| Proof Layer | E2E-PL-01 |
| Scope Label | MVP_SUPPORT / CONTEXT_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Kontext-Graph scoped und payload-redacted beweisen, ohne full Wealth-Graph zu überbauen. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-01, WCL-02, WCL-04, WCL-08, WCL-12 |
| Target Files / Areas | components/client-intake-screen.tsx; lib/visibility-engine.ts; lib/demo-workflow-mutation.ts; prisma/seed.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Client-/Family-/Entity-Kontext ist tenant-scoped sichtbar. |
| API / Service Impact | /api/demo-workflow; /api/documents where evidence context appears |
| Schema Impact | ClientTenant, FamilyMember, Relationship, Entity, Asset, ClientObjective, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Client-/Family-/Entity-Kontext ist tenant-scoped sichtbar. |
| Negative Tests | Unrelated actor sieht keine sensiblen Context-Payloads. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-003` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Behandle die Journey als Guard-/Conditional-Proof; implementiere nur no-bypass/no-leak/no-auto-advice Verhalten, wenn die Control Layer es braucht.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.4 Task Card — `E2E-CJ-004`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-004` |
| Task Title | Document Upload and Intake — E2E Journey Proof Task |
| Journey Coverage | `CJ-004` |
| Source Journey / Mega Journey | MJ-002 |
| Proof Layer | E2E-PL-02 |
| Scope Label | MVP / IMPLEMENTATION_READY_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Bestehenden starken Upload-Slice zur E2E-Evidence-Intake-Story mit negativen Proofs härten. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-02, WCL-03, WCL-05, WCL-08, WCL-12 |
| Target Files / Areas | components/client-intake-screen.tsx; app/api/documents/upload/route.ts; app/api/documents/route.ts; lib/document-upload-service.ts; lib/document-storage-adapter.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Erlaubter Upload erzeugt Document/Version/Extraction/EvidenceCandidate/Audit und reloadbare Dokumentliste. |
| API / Service Impact | /api/documents/upload; /api/documents |
| Schema Impact | Document, DocumentVersion, DocumentExtraction, EvidenceRecord, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Erlaubter Upload erzeugt Document/Version/Extraction/EvidenceCandidate/Audit und reloadbare Dokumentliste. |
| Negative Tests | Invalid type/forbidden role/wrong tenant erzeugt reject/deny ohne rows/sufficiency. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-004` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.5 Task Card — `E2E-CJ-005`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-005` |
| Task Title | Evidence Review, Linkage and Sufficiency — E2E Journey Proof Task |
| Journey Coverage | `CJ-005` |
| Source Journey / Mega Journey | MJ-002 |
| Proof Layer | E2E-PL-02 |
| Scope Label | MVP / SAFETY_CRITICAL_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Evidence Lifecycle von Review/Linkage/Sufficiency als Gate-Basis beweisen. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-05, WCL-06, WCL-07, WCL-08, WCL-12 |
| Target Files / Areas | lib/evidence-service.ts; lib/workflow-gate.ts; lib/demo-workflow-mutation.ts; components/client-intake-screen.tsx; components/decisions-governance-screen.tsx |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Reviewed linked relevant evidence kann sufficiency result liefern. |
| API / Service Impact | /api/demo-workflow; /api/documents |
| Schema Impact | DocumentExtraction, DocumentReview, DocumentLink, EvidenceRecord, EvidenceItem, ComplianceReview, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Reviewed linked relevant evidence kann sufficiency result liefern. |
| Negative Tests | Uploaded/unreviewed/unlinked/stale/wrong-scope evidence bleibt insufficient und blockiert release/export. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-005` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.6 Task Card — `E2E-CJ-006`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-006` |
| Task Title | Signal / Trigger Intake — E2E Journey Proof Task |
| Journey Coverage | `CJ-006` |
| Source Journey / Mega Journey | MJ-001, MJ-008 |
| Proof Layer | E2E-PL-03 |
| Scope Label | MVP / INTERNAL_WORKFLOW_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Signale in interne Trigger überführen; keine direkte Advice oder Client Visibility. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-02, WCL-03, WCL-07, WCL-08, WCL-12 |
| Target Files / Areas | components/internal-workflow-screen.tsx; lib/demo-workflow-mutation.ts; lib/demo-workflow-validation.ts; lib/review-monitoring-service.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Scoped signal creates internal Trigger/ActionItem with audit. |
| API / Service Impact | /api/demo-workflow; /api/review-monitoring only for P1 guard |
| Schema Impact | Trigger, ActionItem, ReviewSchedule, DataQualityIssue, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Scoped signal creates internal Trigger/ActionItem with audit. |
| Negative Tests | Trigger creation never creates client-visible advice/release. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-006` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.7 Task Card — `E2E-CJ-007`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-007` |
| Task Title | Internal AI / Rules Draft Creation — E2E Journey Proof Task |
| Journey Coverage | `CJ-007` |
| Source Journey / Mega Journey | MJ-003 |
| Proof Layer | E2E-PL-03 |
| Scope Label | MVP / ADVICE_BOUNDARY_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: AI/Rules Draft als internal-only Recommendation state beweisen. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-04, WCL-07, WCL-08, WCL-12 |
| Target Files / Areas | lib/workflow-gate.ts; lib/visibility-engine.ts; lib/demo-workflow-mutation.ts; components/internal-workflow-screen.tsx |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Internal draft is created and visible only to allowed internal actor. |
| API / Service Impact | /api/demo-workflow |
| Schema Impact | Trigger, Recommendation, RecommendationOption, DocumentExtraction, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Internal draft is created and visible only to allowed internal actor. |
| Negative Tests | Client/API/export payload never contains AI Draft/internal rationale. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-007` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.8 Task Card — `E2E-CJ-008`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-008` |
| Task Title | Analyst Review and Unsupported Claim Rejection — E2E Journey Proof Task |
| Journey Coverage | `CJ-008` |
| Source Journey / Mega Journey | MJ-003 |
| Proof Layer | E2E-PL-03 |
| Scope Label | MVP / HUMAN_REVIEW_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Analyst Review blockiert unsupported claims und kann evidence-backed rebuild anfordern. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-06, WCL-07, WCL-08, WCL-12 |
| Target Files / Areas | components/internal-workflow-screen.tsx; lib/workflow-gate.ts; lib/evidence-service.ts; lib/demo-workflow-mutation.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Analyst akzeptiert supported draft oder rejected unsupported draft with reason/audit. |
| API / Service Impact | /api/demo-workflow |
| Schema Impact | Recommendation, EvidenceRecord, DocumentExtraction, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Analyst akzeptiert supported draft oder rejected unsupported draft with reason/audit. |
| Negative Tests | Unsupported draft cannot advance to advisor/client without analyst review/rebuild. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-008` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.9 Task Card — `E2E-CJ-009`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-009` |
| Task Title | Advisor Approval — E2E Journey Proof Task |
| Journey Coverage | `CJ-009` |
| Source Journey / Mega Journey | MJ-001, MJ-003 |
| Proof Layer | E2E-PL-04 |
| Scope Label | MVP / HUMAN_APPROVAL_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Advisor Approval als eigenes Gate beweisen, getrennt von Compliance Release. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-06, WCL-07, WCL-08, WCL-12 |
| Target Files / Areas | components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; lib/workflow-gate.ts; lib/audit-service.ts; lib/demo-workflow-mutation.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Advisor-approved item moves to compliance pending with audit. |
| API / Service Impact | /api/demo-workflow |
| Schema Impact | Approval, Recommendation, Decision, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Advisor-approved item moves to compliance pending with audit. |
| Negative Tests | Advisor approval does not set clientVisible/releasedToClientAt. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-009` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.10 Task Card — `E2E-CJ-010`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-010` |
| Task Title | Compliance Block / Request Evidence / Release — E2E Journey Proof Task |
| Journey Coverage | `CJ-010` |
| Source Journey / Mega Journey | MJ-001, MJ-002 |
| Proof Layer | E2E-PL-04 |
| Scope Label | MVP / COMPLIANCE_RELEASE_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Compliance review/block/request/release mit Preconditions und Audit beweisen. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-06, WCL-07, WCL-08, WCL-12 |
| Target Files / Areas | components/internal-workflow-screen.tsx; components/decisions-governance-screen.tsx; lib/workflow-gate.ts; lib/evidence-service.ts; lib/audit-service.ts; lib/demo-workflow-mutation.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Compliance release succeeds only with advisor approval, evidence sufficiency and audit. |
| API / Service Impact | /api/demo-workflow |
| Schema Impact | ComplianceReview, Approval, EvidenceRecord, Decision, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Compliance release succeeds only with advisor approval, evidence sufficiency and audit. |
| Negative Tests | Missing evidence/advisor/audit blocks or holds release. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-010` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.11 Task Card — `E2E-CJ-011`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-011` |
| Task Title | Client Visibility and Digital Decision Room — E2E Journey Proof Task |
| Journey Coverage | `CJ-011` |
| Source Journey / Mega Journey | MJ-001 |
| Proof Layer | E2E-PL-05 |
| Scope Label | MVP / CLIENT_VISIBILITY_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Client-safe projection fail-closed vor release und redacted nach release beweisen. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-04, WCL-07, WCL-08, WCL-12 |
| Target Files / Areas | components/client-intake-screen.tsx; components/decisions-governance-screen.tsx; lib/visibility-engine.ts; lib/workflow-gate.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Released decision produces client-safe projection/decision room view. |
| API / Service Impact | /api/demo-workflow; /api/documents |
| Schema Impact | Decision, Recommendation, EvidenceRecord, PolicyDefinition, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Released decision produces client-safe projection/decision room view. |
| Negative Tests | Unreleased/internal/AI/compliance note payloads hidden/redacted. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-011` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.12 Task Card — `E2E-CJ-012`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-012` |
| Task Title | Governance: Role, Access Request, Second Confirmation — E2E Journey Proof Task |
| Journey Coverage | `CJ-012` |
| Source Journey / Mega Journey | MJ-010 |
| Proof Layer | E2E-PL-06 |
| Scope Label | MVP_SUPPORT / GOVERNANCE_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Governance lifecycle mit role/access/second confirmation beweisen, ohne gate bypass. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-01, WCL-02, WCL-03, WCL-08, WCL-12 |
| Target Files / Areas | components/admin-tenant-setup-screen.tsx; components/decisions-governance-screen.tsx; lib/permission-engine.ts; lib/audit-service.ts; lib/demo-workflow-mutation.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Allowed governance actor approves/denies scoped access with audit/confirmation where required. |
| API / Service Impact | /api/demo-workflow |
| Schema Impact | Role, Permission, UserRole, RolePermission, AccessRequest, SecondConfirmation, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Allowed governance actor approves/denies scoped access with audit/confirmation where required. |
| Negative Tests | Role/access route access does not grant advice/release/export/payload visibility. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-012` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.13 Task Card — `E2E-CJ-013`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-013` |
| Task Title | Cross-Tenant / Wrong-Object Denial — E2E Journey Proof Task |
| Journey Coverage | `CJ-013` |
| Source Journey / Mega Journey | MJ-006 |
| Proof Layer | E2E-PL-06 |
| Scope Label | MVP / NEGATIVE_SAFETY_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Wrong tenant/object denial as core negative regression across document/export/workflow payloads. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-01, WCL-02, WCL-03, WCL-04, WCL-08, WCL-12 |
| Target Files / Areas | lib/permission-engine.ts; lib/visibility-engine.ts; app/api/documents/route.ts; app/api/documents/upload/route.ts; app/api/demo-workflow/route.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Correct scoped actor sees/acts on own tenant objects. |
| API / Service Impact | /api/documents; /api/documents/upload; /api/demo-workflow |
| Schema Impact | UserRole, Document, EvidenceRecord, ExportRequest, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Correct scoped actor sees/acts on own tenant objects. |
| Negative Tests | Wrong tenant/object denied with no payload leak and audit. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-013` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.14 Task Card — `E2E-CJ-014`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-014` |
| Task Title | Admin Non-Bypass — E2E Journey Proof Task |
| Journey Coverage | `CJ-014` |
| Source Journey / Mega Journey | MJ-010 |
| Proof Layer | E2E-PL-06 |
| Scope Label | MVP / NEGATIVE_GOVERNANCE_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Admin power als governance-only beweisen; kein safety gate override. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-03, WCL-06, WCL-07, WCL-08, WCL-09, WCL-12 |
| Target Files / Areas | lib/permission-engine.ts; lib/workflow-gate.ts; lib/evidence-service.ts; lib/export-service.ts; lib/audit-service.ts; app/api/demo-workflow/route.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Admin can perform allowed governance action within policy. |
| API / Service Impact | /api/demo-workflow |
| Schema Impact | Role, Permission, UserRole, ComplianceReview, ExportRequest, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Admin can perform allowed governance action within policy. |
| Negative Tests | Admin cannot force release/evidence sufficiency/export approval/client visibility. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-014` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.15 Task Card — `E2E-CJ-015`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-015` |
| Task Title | Export Scope, Redaction, Preview, Approval, Download / Share — E2E Journey Proof Task |
| Journey Coverage | `CJ-015` |
| Source Journey / Mega Journey | MJ-005 |
| Proof Layer | E2E-PL-07 |
| Scope Label | MVP / EXPORT_SAFETY_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Export lifecycle mit Scope, Redaction, Preview, Approval, Download/Share getrennt beweisen. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-04, WCL-08, WCL-09, WCL-12 |
| Target Files / Areas | components/communication-export-ops-screen.tsx; lib/export-service.ts; lib/export-package-service.ts; lib/visibility-engine.ts; lib/audit-service.ts; lib/demo-workflow-mutation.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Released scoped decision yields redacted approved export and downloadable/shareable package. |
| API / Service Impact | /api/demo-workflow; API_DECISION_REQUIRED for dedicated export endpoint only if unavoidable |
| Schema Impact | ExportRequest, Decision, Document, EvidenceRecord, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Released scoped decision yields redacted approved export and downloadable/shareable package. |
| Negative Tests | Preview not approval; approval not download/share; forbidden internal payload absent. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-015` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.16 Task Card — `E2E-CJ-016`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-016` |
| Task Title | Review Rhythm / Monitoring / Rebalance Review without Automatic Advice — E2E Journey Proof Task |
| Journey Coverage | `CJ-016` |
| Source Journey / Mega Journey | MJ-008 |
| Proof Layer | E2E-PL-08 |
| Scope Label | P1_AFTER_MVP / INTERNAL_ONLY_GUARD |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Nur no-auto-advice Guard und interne Trigger beweisen; keine vollständige P1-Expansion. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-02, WCL-03, WCL-07, WCL-08, WCL-10, WCL-12 |
| Target Files / Areas | components/review-monitoring-screen.tsx; lib/review-monitoring-service.ts; app/api/review-monitoring/route.ts; lib/demo-workflow-mutation.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Review due/rebalance creates internal review trigger only. |
| API / Service Impact | /api/review-monitoring; /api/demo-workflow |
| Schema Impact | ReviewSchedule, Trigger, ActionItem, Recommendation, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Review due/rebalance creates internal review trigger only. |
| Negative Tests | Monitoring never creates client advice/release/clientVisible state automatically. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-016` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Behandle die Journey als Guard-/Conditional-Proof; implementiere nur no-bypass/no-leak/no-auto-advice Verhalten, wenn die Control Layer es braucht.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.17 Task Card — `E2E-CJ-017`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-017` |
| Task Title | Communication / Client Request / Call Trigger — E2E Journey Proof Task |
| Journey Coverage | `CJ-017` |
| Source Journey / Mega Journey | MJ-009 |
| Proof Layer | E2E-PL-08 |
| Scope Label | P1_AFTER_MVP / CONDITIONAL_SUPPORT |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Kommunikation als P1 Guard: client request darf Advice/Compliance nicht umgehen. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-02, WCL-03, WCL-04, WCL-07, WCL-08, WCL-12 |
| Target Files / Areas | components/communication-export-ops-screen.tsx; components/client-intake-screen.tsx; lib/demo-workflow-mutation.ts; TARGET_FILE_TO_VERIFY for message service |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Client request is triaged into internal action/workflow when scoped. |
| API / Service Impact | /api/demo-workflow; API_DECISION_REQUIRED for messages |
| Schema Impact | MessageThread, Message, CallEvent, ActionItem, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Client request is triaged into internal action/workflow when scoped. |
| Negative Tests | Message/call trigger cannot create unapproved client advice or bypass compliance. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-017` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Behandle die Journey als Guard-/Conditional-Proof; implementiere nur no-bypass/no-leak/no-auto-advice Verhalten, wenn die Control Layer es braucht.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.18 Task Card — `E2E-CJ-018`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-018` |
| Task Title | Operations Queues / SLA / Data Quality Remediation — E2E Journey Proof Task |
| Journey Coverage | `CJ-018` |
| Source Journey / Mega Journey | MJ-012 |
| Proof Layer | E2E-PL-08 |
| Scope Label | P1_AFTER_MVP / MVP_SUPPORT_CONDITIONAL |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Data quality as release-blocking support guard; full ops/SLA bleibt P1. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-02, WCL-03, WCL-06, WCL-08, WCL-10, WCL-12 |
| Target Files / Areas | components/communication-export-ops-screen.tsx; lib/review-monitoring-service.ts; TARGET_FILE_TO_VERIFY data-quality service; lib/workflow-gate.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | High severity data quality issue blocks readiness/release until resolved. |
| API / Service Impact | /api/demo-workflow; /api/review-monitoring if relevant |
| Schema Impact | QueueItem, DataQualityIssue, ActionItem, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | High severity data quality issue blocks readiness/release until resolved. |
| Negative Tests | Ops/SLA action cannot release advice or bypass compliance/evidence. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-018` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Behandle die Journey als Guard-/Conditional-Proof; implementiere nur no-bypass/no-leak/no-auto-advice Verhalten, wenn die Control Layer es braucht.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.19 Task Card — `E2E-CJ-019`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-019` |
| Task Title | External Advisor / Guest Scoped Access — E2E Journey Proof Task |
| Journey Coverage | `CJ-019` |
| Source Journey / Mega Journey | MJ-011 |
| Proof Layer | E2E-PL-08 |
| Scope Label | MVP_SUPPORT / P1_AFTER_MVP_CONDITIONAL |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Guest access object-scoped beweisen, aber keine tenant-wide collaboration überbauen. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-01, WCL-02, WCL-03, WCL-04, WCL-08, WCL-12 |
| Target Files / Areas | components/auth-onboarding-screen.tsx; components/admin-tenant-setup-screen.tsx; components/client-intake-screen.tsx; lib/permission-engine.ts; lib/visibility-engine.ts; app/api/documents/route.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | External advisor sees only explicitly scoped object/document. |
| API / Service Impact | /api/documents; /api/demo-workflow |
| Schema Impact | User, UserRole, Document, AccessRequest, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | External advisor sees only explicitly scoped object/document. |
| Negative Tests | Guest sees no tenant-wide payload, internal workflow, release/export authority. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-019` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Behandle die Journey als Guard-/Conditional-Proof; implementiere nur no-bypass/no-leak/no-auto-advice Verhalten, wenn die Control Layer es braucht.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.20 Task Card — `E2E-CJ-020`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-020` |
| Task Title | KYC / AML / Source-of-Wealth Review — E2E Journey Proof Task |
| Journey Coverage | `CJ-020` |
| Source Journey / Mega Journey | MJ-007 |
| Proof Layer | E2E-PL-09 |
| Scope Label | HOLD_PENDING_DECISION |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Held-route guard beweisen: keine MVP-Implementation, nur block/hold state und no-release bypass. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-03, WCL-04, WCL-06, WCL-07, WCL-08, WCL-12 |
| Target Files / Areas | components/kyc-aml-workflow-screen.tsx; app/api/demo-workflow/route.ts; lib/workflow-gate.ts; lib/visibility-engine.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Held KYC/SoW state is visible as blocked/decision-required when accessed internally. |
| API / Service Impact | /api/demo-workflow; /api/documents/upload only as document evidence source |
| Schema Impact | Document, EvidenceRecord, ComplianceReview, Trigger, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Held KYC/SoW state is visible as blocked/decision-required when accessed internally. |
| Negative Tests | KYC held route cannot silently become MVP flow or release advice. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-020` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere keine fachliche Journey-Mutation; implementiere oder teste nur Held-/Blocked-State, no-client-release und no-elevation Guard.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.21 Task Card — `E2E-CJ-021`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-021` |
| Task Title | Suitability / IPS / Mandate — E2E Journey Proof Task |
| Journey Coverage | `CJ-021` |
| Source Journey / Mega Journey | MJ-007 |
| Proof Layer | E2E-PL-09 |
| Scope Label | HOLD_PENDING_DECISION |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Advice-sensitive held capability nur als blocked guard behandeln. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-03, WCL-04, WCL-07, WCL-08, WCL-12 |
| Target Files / Areas | components/suitability-ips-screen.tsx; lib/workflow-gate.ts; lib/visibility-engine.ts; app/api/demo-workflow/route.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Suitability/IPS route remains held until policy/scope unlock. |
| API / Service Impact | /api/demo-workflow |
| Schema Impact | Engagement, PolicyDefinition, Recommendation, Decision, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Suitability/IPS route remains held until policy/scope unlock. |
| Negative Tests | Held suitability/IPS cannot create client-visible mandate/advice. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-021` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere keine fachliche Journey-Mutation; implementiere oder teste nur Held-/Blocked-State, no-client-release und no-elevation Guard.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.22 Task Card — `E2E-CJ-022`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-022` |
| Task Title | Committee Review and Dissent — E2E Journey Proof Task |
| Journey Coverage | `CJ-022` |
| Source Journey / Mega Journey | MJ-004 |
| Proof Layer | E2E-PL-09 |
| Scope Label | HOLD_PENDING_DECISION |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Committee review labels/held status beweisen; keine vote/dissent mutation implementieren ohne Unlock. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-03, WCL-04, WCL-07, WCL-08, WCL-12 |
| Target Files / Areas | components/committee-review-screen.tsx; lib/workflow-gate.ts; app/api/demo-workflow/route.ts; tests/committee-review-routes.spec.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Committee routes remain available as held/reference proof with no clientVisible leakage. |
| API / Service Impact | /api/demo-workflow |
| Schema Impact | Recommendation, Approval, ComplianceReview, EvidenceRecord, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Committee routes remain available as held/reference proof with no clientVisible leakage. |
| Negative Tests | Committee cannot become silent release bypass or MVP approval gate without unlock. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-022` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere keine fachliche Journey-Mutation; implementiere oder teste nur Held-/Blocked-State, no-client-release und no-elevation Guard.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.23 Task Card — `E2E-CJ-023`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-023` |
| Task Title | Audit Failure / Safety Action Held — E2E Journey Proof Task |
| Journey Coverage | `CJ-023` |
| Source Journey / Mega Journey | All MVP safety journeys |
| Proof Layer | E2E-PL-06 |
| Scope Label | MVP / NEGATIVE_SAFETY_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Audit failure simulation/test seam für kritische mutations beweisen. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-08, WCL-12 plus WCL-03/WCL-07/WCL-09 |
| Target Files / Areas | lib/audit-service.ts; lib/demo-workflow-mutation.ts; lib/workflow-gate.ts; lib/export-service.ts; app/api/demo-workflow/route.ts; app/api/documents/upload/route.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Audit writes for critical release/block/export/access action. |
| API / Service Impact | /api/demo-workflow; /api/documents/upload |
| Schema Impact | AuditEvent, ComplianceReview, ExportRequest, AccessRequest; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Audit writes for critical release/block/export/access action. |
| Negative Tests | Audit write failure holds/denies safety action and prevents silent completion. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-023` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.24 Task Card — `E2E-CJ-024`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-024` |
| Task Title | Offboarding: Access Revocation, Final Export, Retention, Archive — E2E Journey Proof Task |
| Journey Coverage | `CJ-024` |
| Source Journey / Mega Journey | Expanded WealthOS lifecycle |
| Proof Layer | E2E-PL-10 |
| Scope Label | SPEC_REQUIRED / P1_AFTER_MVP |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Offboarding als SPEC/P1-Control-Track: access revocation/residual visibility/final export/legal hold contracts, keine Full Production ohne Unlock. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-02, WCL-03, WCL-08, WCL-09, WCL-11, WCL-12 |
| Target Files / Areas | TARGET_FILE_TO_VERIFY for offboarding service; components/admin-tenant-setup-screen.tsx; components/decisions-governance-screen.tsx; lib/export-service.ts; lib/audit-service.ts; prisma/seed.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Offboarding pending/revoked state prevents access and can trigger final export/retention decision. |
| API / Service Impact | API_DECISION_REQUIRED for offboarding; /api/demo-workflow only as safe stub if already present |
| Schema Impact | ClientTenant, UserRole, Document, EvidenceRecord, ExportRequest, AuditEvent; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Offboarding pending/revoked state prevents access and can trigger final export/retention decision. |
| Negative Tests | Revoked user has no residual payload visibility; final export blocked without scope/redaction/audit. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-024` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Erzeuge nur Control-Layer-Safe-Stub/Spec-Track und negative residual-access checks; keine vollständige Offboarding-Produktimplementierung ohne Unlock.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

### 6.25 Task Card — `E2E-CJ-025`

| Field | Required Content |
| --- | --- |
| Task ID | `E2E-CJ-025` |
| Task Title | Upload / Error / Retry / Permission Denied Exception Journey — E2E Journey Proof Task |
| Journey Coverage | `CJ-025` |
| Source Journey / Mega Journey | MJ-002 |
| Proof Layer | E2E-PL-02 |
| Scope Label | MVP / FAIL_CLOSED_PROOF |
| Product Intent | Diese Journey ist notwendig, um WealthOS nicht als Screenfolge, sondern als kontrollierten, rollen- und evidenzbasierten Prozesspfad zu beweisen: Upload- und API-Fehlerzustände beweisen: retry/reselect/denied ohne false progress. |
| Proof Objective | Beweise die Journey E2E über die angegebenen Control-Layer-Dependencies. Die Journey darf kein Safety Gate überspringen und darf keine downstream readiness überclaimen. |
| Required Control-Layer Dependencies | WCL-03, WCL-05, WCL-06, WCL-08, WCL-12 |
| Target Files / Areas | components/client-intake-screen.tsx; app/api/documents/upload/route.ts; app/api/documents/route.ts; lib/document-upload-service.ts; lib/audit-service.ts |
| Allowed Changes | Bestehende Services/Engines/APIs/UI-State-Verdrahtung härten; Journey-Fixtures und Tests ergänzen; interne Harness-/Helper-Dateien nur anlegen, wenn sie keine Produktentscheidung erzwingen. |
| Forbidden Changes | Keine neue Route; keine Prisma Migration; keine Screen-/State-Screen-/Image-Generierung; keine AI Advice Automation; keine client-visible AI Draft; keine P1/HOLD-Elevation; keine main-derived Änderungen. |
| Journey Preconditions | ActorContext vorhanden; clientTenantId und object scope resolved; erforderliche Control-Layer-Baseline implementiert oder explizit als dependency blocked dokumentiert. |
| Data Inputs | actorUserId, clientTenantId, roleKey(s), objectType, objectId, documentId/evidenceRecordId/recommendationId/approvalId/complianceReviewId/decisionId/exportRequestId wo passend, auditCorrelationId, visibilityContext. |
| Expected Outputs / Results | Valid retry after recoverable error can succeed without stale state. |
| API / Service Impact | /api/documents/upload; /api/documents |
| Schema Impact | Document, AuditEvent, EvidenceRecord; bestehende Full-Workflow-Prisma-Baseline nutzen; keine Migration ohne explizite spätere Freigabe. |
| UI / State Impact | Bestehende Route-/Screen-Flächen nur verdrahten: loading/error/empty/permission denied/blocked/success/retry/hidden/redacted. Keine neuen Screens. |
| Safety / Compliance Gates | RBAC, Tenant/Object Scope, Payload Visibility, Client Fail-Closed, Advice Boundary, Evidence Sufficiency, Audit Persistence, Export Redaction/Admin Non-Bypass je nach Journey. |
| Audit Requirements | Kritische Allow/Deny/Release/Block/Export/Access/Upload-Aktionen müssen auditierbar sein; Audit-Failure darf keine stille Mutation erlauben. |
| Positive Tests | Valid retry after recoverable error can succeed without stale state. |
| Negative Tests | Invalid type/size/API error/denied role creates no sufficiency/release/client visibility. |
| Validation Commands | `pnpm typecheck`; `pnpm lint`; `pnpm db:validate`; targeted `pnpm exec playwright test ...`; `pnpm phase:check` nach Repo-Prüfung. |
| Acceptance Criteria | `CJ-025` ist in Coverage, Task, Fixture/Testmatrix und Abschlussbericht sichtbar; positive und negative Proofs sind implementiert oder präzise blocked; keine Stop Rule verletzt. |
| Stop Rules | Stoppen und berichten, wenn Target Files fehlen, Control-Layer-Dependency nicht existiert, neue API/Schema-Migration nötig wäre, P1/HOLD/SPEC Scope heimlich erweitert würde, oder ein negativer Safety-Proof nicht formulierbar ist. |
| Reporting Requirement | Changed files, implemented task id, journey coverage status, tests run/not run, positive/negative proof status, safety/compliance proof, blockers and known gaps. |

**Implementation Steps**

1. Prüfe Target Files und bestehende äquivalente Module im `full-workflow`-Repo; verwende keine `main`-Quelle.
2. Validiere, dass alle Required Control-Layer Dependencies vorhanden oder in diesem Task als blockierend dokumentiert sind.
3. Implementiere/härte den Journey-Proof nur über vorhandene Control-Layer-Engines und bestehende API-/Service-Flächen.
4. Ergänze oder härte Journey-Fixtures für positive und negative Actor-/Tenant-/Object-/Data-Zustände.
5. Verdrahte API-/Service-/UI-State-Verhalten so, dass Success nur den tatsächlich abgeschlossenen Schritt benennt und downstream gates nicht überclaimt.
6. Ergänze positive Tests für den erlaubten Journey-Pfad.
7. Ergänze negative Tests für Leakage, Bypass, Fail-Closed, Scope oder Status-Überclaiming.
8. Berichte abschließend Journey-Status, Tests, Safety-Proof und alle Blocker.

---

## 7. Cross-Journey Shared Proof Harness Tasks

| Shared Task ID | Harness / Fixture / Proof Utility | Covered Journeys | Purpose | Target Files | Required Tests | Dependency |
| --- | --- | --- | --- | --- | --- | --- |
| E2E-HAR-001 | E2E Actor/Tenant/Role Fixture Matrix | CJ-001, CJ-002, CJ-012, CJ-013, CJ-014, CJ-019 | Erzeuge deterministic actors: client, CFO, analyst, advisor, compliance, platform admin, security admin, external guest, wrong-tenant actor. | prisma/seed.ts; tests/fixtures/e2e-actors.ts | Unknown/wrong-tenant/admin-bypass negatives | E2E-WS-01 |
| E2E-HAR-002 | E2E Object Scope Fixture Matrix | CJ-003, CJ-013, CJ-019, CJ-024 | Dokumente, Evidence, Decision, Export und Entity objektgescoped vorbereiten. | tests/fixtures/e2e-object-scope.ts; prisma/seed.ts | Wrong-object no-leak tests | E2E-WS-01 |
| E2E-HAR-003 | E2E Document/Evidence Fixture Matrix | CJ-004, CJ-005, CJ-010, CJ-025 | Dokumentzustände: uploaded-only, extraction pending, reviewed, linked, sufficient, insufficient. | tests/fixtures/e2e-evidence.ts | Upload-not-sufficiency and insufficiency blocks release/export | E2E-WS-03 |
| E2E-HAR-004 | E2E Recommendation/Approval/Compliance Fixture Matrix | CJ-006–CJ-010 | Trigger, internal draft, analyst reviewed, advisor approved, compliance blocked/released vorbereiten. | tests/fixtures/e2e-workflow.ts | Advisor-not-release and compliance precondition tests | E2E-WS-04/05 |
| E2E-HAR-005 | E2E Decision/Client Visibility Fixture Matrix | CJ-011, CJ-013, CJ-015 | Unreleased, released, redacted, hidden decision projections vorbereiten. | tests/fixtures/e2e-visibility.ts | AI draft/internal note leakage tests | E2E-WS-06 |
| E2E-HAR-006 | E2E Export/Redaction Fixture Matrix | CJ-015, CJ-024 | Export scope/preview/approval/download states mit forbidden internal payload vorbereiten. | tests/fixtures/e2e-export.ts | Preview-not-approval, forbidden payload absent | E2E-WS-08 |
| E2E-HAR-007 | E2E Audit Correlation Helper | CJ-010, CJ-012, CJ-013, CJ-014, CJ-015, CJ-023, CJ-024 | Audit correlationId und expected audit rows pro critical action standardisieren. | tests/helpers/e2e-audit-correlation.ts; lib/audit-service.ts | Audit failure holds/denies tests | E2E-WS-07 |
| E2E-HAR-008 | E2E Fail-Closed Error Envelope Assertions | CJ-004, CJ-010, CJ-011, CJ-013, CJ-023, CJ-025 | Standardisierte Assertions für denied/hidden/blocked/retry without state advance. | tests/helpers/e2e-fail-closed.ts | API error fail-closed tests | E2E-WS-07/12 |
| E2E-HAR-009 | E2E Route/API Payload Redaction Assertions | CJ-011, CJ-013, CJ-015, CJ-019 | Payload-Feldlisten und forbidden payload checks für client/export/guest routes. | tests/helpers/e2e-redaction.ts | Route access not payload visibility | E2E-WS-06/08/09 |
| E2E-HAR-010 | E2E Journey Test Runner / Tagging Convention | Alle CJ | Tests mit Tags wie @e2e-cj-001, @p0-negative, @hold-guard standardisieren. | playwright.config.ts; tests/e2e/*.spec.ts | Coverage report includes CJ-001..CJ-025 | E2E-WS-12 |

---

## 8. API / Service Journey Proof Matrix

| API Route | Related Journeys | Required Request Validation | Required Permission Check | Required Payload Redaction | Required Audit | Failure Behaviour | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /api/demo-workflow | CJ-002, CJ-006–CJ-010, CJ-012, CJ-014–CJ-018, CJ-020–CJ-023, CJ-024 if safe stub | Validate action id, actor context, tenant/object scope, workflow preconditions, no P1/HOLD elevation. | PermissionDecision from WCL-03 before mutation. | Return only allowed safe fields; no AI draft/internal rationale/client-ineligible evidence. | Audit for critical actions; audit failure holds safety mutation. | 400/403/423 safe envelope; no silent state advancement; no clientVisible unless released. | tests/demo-workflow-api.spec.ts plus tests/e2e/e2e-demo-workflow-journeys.spec.ts |
| /api/documents | CJ-004, CJ-005, CJ-011, CJ-013, CJ-019, CJ-025 | Validate tenant, actor, document filters, object scope and visibility mode. | Document list requires tenant/object permission. | Client/guest payload redacted; internal-only extraction/review hidden unless allowed. | Audit denied access and sensitive list operations where required. | 403/empty hidden result for wrong scope; no payload leak. | tests/document-upload-api.spec.ts plus tests/e2e/e2e-document-visibility.spec.ts |
| /api/documents/upload | CJ-004, CJ-005, CJ-013, CJ-019, CJ-025 | Validate multipart file, metadata, type/size, tenant/object scope, upload role. | Upload permission and object scope required. | Upload response confirms upload-only; no evidence sufficiency/release. | Audit upload success/denial/reject. | Invalid type/size/role returns safe error; no rows/sufficiency. | tests/document-upload-api.spec.ts; tests/document-upload-flow.spec.ts; tests/e2e/e2e-upload-fail-closed.spec.ts |
| /api/review-monitoring | CJ-016, CJ-018 | Validate actor, tenant, review window, internal-only context. | Ops/analyst/advisor internal permission only. | No client payload; no advice/release fields. | Audit internal monitoring trigger/action when created. | Monitoring creates internal trigger only; no clientVisible/advice execution. | tests/review-monitoring-service.spec.ts plus tests/e2e/e2e-monitoring-no-auto-advice.spec.ts |

**API-Regel:** Keine neuen API-Routen als Standardlösung. Wenn eine Journey einen neuen Endpoint fachlich zu brauchen scheint, muss Codex `API_DECISION_REQUIRED` melden und darf nicht implementieren.

---

## 9. Journey Data / Seed / Fixture Task Matrix

| Fixture ID | Journey(s) | Required Seed Data | Required Actor Context | Required Object Scope | Positive Fixture | Negative Fixture | Persistence Target | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FX-001 | CJ-001, CJ-002 | PlatformTenant, ClientTenant, invited User, consent version, base roles | invited client/principal, tenant admin | clientTenantId + invitation scope | valid invite + consent accepted | unknown/uninvited user | User, UserProfile, ConsentRecord, UserRole | IMPLEMENTATION_READY |
| FX-002 | CJ-003 | FamilyMember, Relationship, Entity, Asset, Objective | client/family CFO/analyst | tenant-owned context objects | scoped context exists | unrelated tenant context request | FamilyMember, Relationship, Entity, Asset | CONDITIONAL_SUPPORT |
| FX-003 | CJ-004, CJ-025 | Valid PDF/JPEG metadata, invalid file type, oversized file, upload target | client/advisor/analyst/forbidden role | document target scope | valid upload | invalid type/forbidden role/API error | Document, DocumentVersion, EvidenceRecord, AuditEvent | IMPLEMENTATION_READY |
| FX-004 | CJ-005, CJ-010 | Evidence states: uploaded-only, reviewed, linked, sufficient, insufficient | analyst, advisor, compliance | recommendation/evidence target | linked sufficient evidence | uploaded-only evidence insufficient | EvidenceRecord, EvidenceItem, DocumentLink, ComplianceReview | IMPLEMENTATION_READY |
| FX-005 | CJ-006–CJ-008 | Trigger, unsupported AI/rules draft, evidence-backed rebuild | system/AI, analyst | internal workflow scope | internal draft/rebuild | client-visible AI draft request | Trigger, Recommendation, DocumentExtraction | IMPLEMENTATION_READY |
| FX-006 | CJ-009, CJ-010 | Analyst-reviewed recommendation, advisor approval, compliance review | advisor, compliance | recommendation/decision scope | advisor approved then compliance released | advisor-approved but unreleased client view | Approval, ComplianceReview, Decision | IMPLEMENTATION_READY |
| FX-007 | CJ-011 | Released decision, unreleased decision, redaction policies | client, advisor, compliance | decision/evidence/export scope | client-safe projection | internal notes/AI draft leakage attempt | Decision, Recommendation, EvidenceRecord | IMPLEMENTATION_READY |
| FX-008 | CJ-012–CJ-014 | AccessRequest, SecondConfirmation, admin bypass attempts | platform/security/tenant admin | role/object scope | allowed governance action | admin forced release/export/evidence | Role, Permission, AccessRequest, AuditEvent | IMPLEMENTATION_READY |
| FX-009 | CJ-013, CJ-019 | Wrong-tenant actor, external guest, one scoped document | external advisor, wrong tenant actor | document/object-only scope | guest sees one scoped document | guest/wrong actor sees tenant-wide data | UserRole, Document, AccessRequest | CONDITIONAL_SUPPORT |
| FX-010 | CJ-015 | ExportRequest states: scope selected, preview, approved, downloadable; forbidden payload | advisor, compliance | released decision/export scope | approved redacted export | preview treated as approval or forbidden payload included | ExportRequest, Decision, Document | IMPLEMENTATION_READY |
| FX-011 | CJ-016, CJ-018 | ReviewSchedule, due/overdue, DataQualityIssue high severity | system, analyst, ops | review/data-quality target | internal review trigger or block | automatic client advice/release | ReviewSchedule, DataQualityIssue, Trigger | P1_DEFERRED / GUARD |
| FX-012 | CJ-020–CJ-022 | Held route states for KYC, suitability, committee | analyst/advisor/committee | held route scope | held/block message | route silently becomes MVP release path | ComplianceReview, Recommendation, AuditEvent | HOLD_BLOCKED |
| FX-013 | CJ-023 | Audit service failure seam or simulated audit write error | compliance/admin/advisor/system | critical action requiring audit | audit success allows action | audit failure holds/denies action | AuditEvent, ComplianceReview, ExportRequest | IMPLEMENTATION_READY |
| FX-014 | CJ-024 | Offboarding pending, revoked user, final export scope, retention policy/legal hold | client success, compliance, security admin | clientTenantId/userRole/document/export scope | access revoked and legal hold applied | revoked user still sees payload | ClientTenant, UserRole, ExportRequest, AuditEvent | SPEC_REQUIRED |

---

## 10. P0 Journey Test Task Matrix

| P0 Test ID | Related Journey | Positive Case | Negative Case | Existing Proof Slice | Missing Test | Required Test File / Candidate | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E2E-P0-NEG-001 | CJ-001 | Mapped invited user gets scoped ActorContext | Unknown user denied, no anonymous payload expansion | Route/auth shell only | Need current-user/session negative e2e | tests/e2e/e2e-foundation-auth.spec.ts | P0 |
| E2E-P0-NEG-002 | CJ-013 | Correct tenant actor sees own object | Wrong tenant/object denied, no payload leak | permission-engine partial | Need route/API payload redaction across docs/export/workflow | tests/e2e/e2e-cross-tenant-denial.spec.ts | P0 |
| E2E-P0-NEG-003 | CJ-012 | Allowed role performs scoped action | Route access does not grant action permission | permission-engine partial | Need route shell vs action permission e2e | tests/e2e/e2e-route-vs-action.spec.ts | P0 |
| E2E-P0-NEG-004 | CJ-011, CJ-013 | Allowed actor receives safe projection | Route access does not grant payload visibility | contracts only | Need payload field assertions | tests/e2e/e2e-payload-visibility.spec.ts | P0 |
| E2E-P0-NEG-005 | CJ-007, CJ-011, CJ-015 | AI/rules draft created internal-only | Client-visible AI Draft denied in portal/API/export | demo-workflow partial noClientRelease | Need full leakage assertions | tests/e2e/e2e-ai-draft-internal-only.spec.ts | P0 |
| E2E-P0-NEG-006 | CJ-006–CJ-011 | Approved released path yields client-safe decision | Unapproved advice not client-visible | workflow-gate partial | Need portal/API/export no-unapproved proof | tests/e2e/e2e-no-unapproved-advice.spec.ts | P0 |
| E2E-P0-NEG-007 | CJ-008 | Unsupported draft rejected/rebuilt | Unsupported internal draft cannot advance to advisor/client without review | requirement only | Need claim rejection lifecycle | tests/e2e/e2e-unsupported-claim-rejection.spec.ts | P0 |
| E2E-P0-NEG-008 | CJ-009 | Advisor approval moves to compliance pending | Advisor approval does not release | workflow-gate partial | Need client visibility after advisor approve hidden | tests/e2e/e2e-advisor-not-release.spec.ts | P0 |
| E2E-P0-NEG-009 | CJ-010 | Compliance release succeeds with evidence + audit | Compliance release requires evidence and audit | workflow/API partial | Need audit/evidence precondition matrix | tests/e2e/e2e-compliance-release-preconditions.spec.ts | P0 |
| E2E-P0-NEG-010 | CJ-004, CJ-005, CJ-025 | Upload succeeds and creates candidate evidence | Upload success does not mark evidence sufficient | document-upload tests partial | Need sufficiency gate after upload | tests/e2e/e2e-upload-not-sufficiency.spec.ts | P0 |
| E2E-P0-NEG-011 | CJ-005, CJ-010, CJ-015 | Sufficient evidence supports release/export | Evidence insufficiency blocks release/export | contract only | Need release/export blocks | tests/e2e/e2e-evidence-insufficiency-blocks.spec.ts | P0 |
| E2E-P0-NEG-012 | CJ-014 | Admin allowed governance action succeeds | Admin cannot bypass release/evidence/export/visibility | permission-engine partial | Need admin bypass matrix | tests/e2e/e2e-admin-non-bypass.spec.ts | P0 |
| E2E-P0-NEG-013 | CJ-023 | Critical action writes audit | Audit write failure holds/denies safety action | audit rows in some tests | Need audit failure seam | tests/e2e/e2e-audit-failure-fail-closed.spec.ts | P0 |
| E2E-P0-NEG-014 | CJ-015 | Export preview generated from safe scope | Export preview is not approval | file-export service partial | Need route/API lifecycle proof | tests/e2e/e2e-export-preview-not-approval.spec.ts | P0 |
| E2E-P0-NEG-015 | CJ-015 | Approved export can proceed to download/share | Export approval is not download/share | file-export service partial | Need download/share separation | tests/e2e/e2e-export-approval-not-download.spec.ts | P0 |
| E2E-P0-NEG-016 | CJ-015 | Export package contains redacted released content | Export package excludes forbidden internal payload | file-export partial | Need forbidden payload field assertions | tests/e2e/e2e-export-forbidden-payload.spec.ts | P0 |
| E2E-P0-NEG-017 | CJ-016 | Review/rebalance creates internal trigger | Monitoring creates no automatic advice/client release | review-monitoring partial | Need e2e no-auto-advice guard | tests/e2e/e2e-monitoring-no-auto-advice.spec.ts | P1_GUARD |
| E2E-P0-NEG-018 | CJ-017 | Client request becomes internal triage item | P1 communication cannot bypass advice/compliance gates | none/partial | Need conditional no-bypass guard | tests/e2e/e2e-communication-no-bypass.spec.ts | P1_GUARD |
| E2E-P0-NEG-019 | CJ-019 | External advisor sees one scoped object | External advisor receives no tenant-wide data | conditional requirement | Need object scoped guest access tests | tests/e2e/e2e-external-advisor-scope.spec.ts | CONDITIONAL |
| E2E-P0-NEG-020 | CJ-020–CJ-022 | Held routes show held/block state | Held KYC/Suitability/Committee routes do not become MVP flow | route smoke/committee labels partial | Need held no-elevation proof | tests/e2e/e2e-held-routes-no-elevation.spec.ts | HOLD_GUARD |
| E2E-P0-NEG-021 | CJ-024 | Offboarding revokes access and applies retention/final export rules | Revoked user has no residual payload visibility | not covered | Need spec/control proof after unlock | tests/e2e/e2e-offboarding-revocation.spec.ts | SPEC_REQUIRED |
| E2E-P0-NEG-022 | CJ-025 | Invalid upload error supports retry/reselect | Invalid type/size/API error preserves retry and no sufficiency | unsupported file test partial | Need UI retry/fail-closed proof | tests/e2e/e2e-upload-error-retry.spec.ts | P0 |

---

## 11. Canonical Path Proof Matrix

| Path ID | Name | Related Journeys | Required Task IDs | Positive Proof | Negative Proof | Scope / Blocker |
| --- | --- | --- | --- | --- | --- | --- |
| PATH-001 | Happy Path: Client onboarding to first client-safe decision | CJ-001, CJ-002, CJ-004, CJ-005, CJ-006, CJ-007, CJ-008, CJ-009, CJ-010, CJ-011 | E2E-CJ-001..011 | Mapped user → evidence-backed workflow → advisor approval → compliance release → client-safe projection. | No AI draft/unapproved/advisor-only payload visible. | MVP |
| PATH-002 | Evidence Missing Path: Compliance block → evidence request → upload → review → release | CJ-004, CJ-005, CJ-010, CJ-011, CJ-025 | E2E-CJ-004,005,010,011,025 | Compliance requests evidence, client uploads, analyst reviews, evidence becomes sufficient, compliance releases. | Upload-only or insufficient evidence blocks release/export. | MVP |
| PATH-003 | AI Draft Rejection Path | CJ-006, CJ-007, CJ-008, CJ-009 | E2E-CJ-006,007,008,009 | Unsupported draft is rejected, rebuilt with evidence, then advisor-reviewed. | Unsupported draft cannot advance or leak. | MVP |
| PATH-004 | Advisor Approval Not Release Path | CJ-009, CJ-010, CJ-011 | E2E-CJ-009,010,011 | Advisor approval produces compliance pending state. | Client visibility remains hidden until compliance release. | MVP |
| PATH-005 | Admin Non-Bypass Path | CJ-012, CJ-014, CJ-023 | E2E-CJ-012,014,023 | Admin governance action allowed where scoped. | Admin cannot force release/evidence/export/visibility; denied audited. | MVP |
| PATH-006 | Cross-Tenant Denial Path | CJ-013 | E2E-CJ-013 | Correct scoped access works. | Wrong tenant/object denied, no payload, audit written. | MVP |
| PATH-007 | Export Redaction Path | CJ-011, CJ-015 | E2E-CJ-011,015 | Released decision scoped/redacted/approved/downloadable. | Preview not approval; forbidden internal payload absent. | MVP |
| PATH-008 | Review Monitoring Path | CJ-016, CJ-006 | E2E-CJ-016,006 | Review due creates internal trigger. | No automatic advice or client release. | P1_GUARD |
| PATH-009 | External Advisor Scoped Access Path | CJ-019, CJ-013 | E2E-CJ-019,013 | Guest sees explicit object/document scope. | No tenant-wide payload or gate action. | CONDITIONAL |
| PATH-010 | Offboarding Path | CJ-024, CJ-015, CJ-013 | E2E-CJ-024,015,013 | Access revocation, final export/retention/legal hold decision. | Revoked actor has no residual payload visibility. | SPEC/P1 |
| PATH-011 | Audit Failure Path | CJ-023, CJ-010, CJ-015, CJ-012 | E2E-CJ-023 | Critical action with audit success proceeds. | Audit failure holds/denies release/export/access action. | MVP |
| PATH-012 | Upload Failure Path | CJ-025, CJ-004, CJ-005 | E2E-CJ-025,004,005 | Recoverable error retry works. | Invalid/denied upload creates no evidence sufficiency/release. | MVP |

---

## 12. Implementation Sequence with Dependencies

| Phase | Name | Tasks | Must Complete Before | Validation | Stop Rule |
| --- | --- | --- | --- | --- | --- |
| Phase 0 | Repo/Source Reality Audit and Control-Layer Baseline Validation | E2E-HAR-010 baseline tags, Repo/source audit | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 1 | E2E Proof Fixtures, Seed Matrix and Actor/Tenant Journey Context | E2E-HAR-001..009 | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 2 | Foundation Journeys: Onboarding, Tenant Setup, Client Context | E2E-CJ-001, E2E-CJ-002, E2E-CJ-003 | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 3 | Document and Evidence Journeys | E2E-CJ-004, E2E-CJ-005, E2E-CJ-025 | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 4 | Internal Workflow and Advice Boundary Journeys | E2E-CJ-006, E2E-CJ-007, E2E-CJ-008 | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 5 | Advisor Approval and Compliance Release Journeys | E2E-CJ-009, E2E-CJ-010 | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 6 | Client Visibility and Decision Room Proof | E2E-CJ-011 | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 7 | Governance, Cross-Tenant Denial, Admin Non-Bypass and Audit Failure Proof | E2E-CJ-012, E2E-CJ-013, E2E-CJ-014, E2E-CJ-023 | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 8 | Export Scope, Redaction, Approval and Delivery Proof | E2E-CJ-015 | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 9 | Conditional P1 / Monitoring / Communication / External Advisor Proof Guards | E2E-CJ-016, E2E-CJ-017, E2E-CJ-018, E2E-CJ-019 | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 10 | Hold-Blocked High-Risk Journey Guards | E2E-CJ-020, E2E-CJ-021, E2E-CJ-022 | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 11 | Offboarding Control Proof Track | E2E-CJ-024 | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |
| Phase 12 | Full Canonical Path Regression and Reporting | All E2E-CJ task report | Next dependent phase; safety-critical downstream tasks | Run targeted Playwright/specs plus typecheck/lint/db validate where repo supports. | Stop if dependency unresolved, scope elevation required, or safety negative cannot be enforced. |

**Sequenzregel:** Control-Layer foundation vor E2E-Proof. Safety foundation vor UI convenience. Audit vor Release/Export. Visibility vor Client-Portal-Claims. Evidence Sufficiency vor Compliance Release. Export Redaction vor Export Approval/Download. P1/HOLD/SPEC Tracks bleiben Guards oder Coverage Tasks, bis explizit unlocked.

---

## 13. Blocked / Deferred / Do-Not-Create Register

| Item ID | Item | Why Blocked / Deferred | Source | Can Become Task When | Current Instruction |
| --- | --- | --- | --- | --- | --- |
| BLK-001 | KYC/AML / Source-of-Wealth Journey CJ-020 | Held route/policy/safety unresolved; routes 064–065 missing/non-public visuals and high compliance depth. | Route Scope + Atlas | Dedicated KYC/AML policy, data model, route visual/safety unlock and P0 tests exist. | HOLD_BLOCKED; only held-state/no-release guard allowed. |
| BLK-002 | Suitability / IPS / Mandate Journey CJ-021 | Advice-sensitive; held routes 066–067 and suitability policy not locked. | Route Scope + Atlas | Suitability/IPS policy and advice-boundary contracts are explicitly unlocked. | HOLD_BLOCKED; no client-visible suitability/mandate flow. |
| BLK-003 | Committee Review Journey CJ-022 / routes 070–071 | Committee governance/vote/dissent mutation and visuals unresolved. | Route Scope + P0 matrix | Committee route/safety/visual unlock and P0 tests are defined. | HOLD_BLOCKED; label/held guard only. |
| BLK-004 | Full Communication Centre CJ-017 | P1 route family; could bypass advice if overbuilt too early. | Route Scope + MVP lock | Core release/visibility/compliance safety is proven and communication contract unlocked. | P1_DEFERRED; no-bypass guard only. |
| BLK-005 | Full Review Monitoring expansion CJ-016 | P1/HOLD review rhythm; risk of automatic advice impression. | Route Scope + API contract | Monitoring product scope and no-auto-advice tests are accepted. | P1_DEFERRED; internal-only trigger guard only. |
| BLK-006 | Full Operations/SLA implementation CJ-018 | P1 ops maturity; not first-path MVP except data-quality block support. | MVP scope + Route scope | Ops/SLA scope becomes explicit P1 phase. | P1_DEFERRED; data quality guard conditional. |
| BLK-007 | Full Offboarding production implementation CJ-024 | No dedicated route/API/schema scope fully locked; needs retention/legal policy decisions. | Atlas Offboarding Deep Dive | Offboarding policy/API/schema/route handoff exists. | SPEC_REQUIRED; safe control stub only. |
| BLK-008 | Production banking/custody integrations | Explicit non-goal for MVP and not target code reality. | MVP Scope / Final Handoff | Separate integration programme approved. | DO_NOT_CREATE. |
| BLK-009 | Autonomous financial advice | Violates human-backed/advice-boundary model. | MVP Scope / Safety contracts | Never for MVP; only if future policy fundamentally changes. | DO_NOT_CREATE. |
| BLK-010 | Client-visible AI Draft | Explicitly forbidden; AI/rules drafts internal-only. | RBAC/Advice Boundary contract | No current unlock; future still unlikely. | DO_NOT_CREATE. |
| BLK-011 | Manual client-visibility override | Violates fail-closed derived visibility. | MVP Scope / Visibility contract | Only if explicit policy with P0 tests, not now. | DO_NOT_CREATE. |
| BLK-012 | Admin bypass | Violates governance non-bypass. | RBAC contract | Never as shortcut. | DO_NOT_CREATE. |
| BLK-013 | New screen generation | Generation gate not authorized; existing visuals are references. | Screen Generation Brief | Separate screen-generation brief later authorizes. | DO_NOT_CREATE. |
| BLK-014 | Prisma migration / schema replacement | Schema baseline locked; no blind replacement. | Schema reconciliation | Explicit schema handoff/migration approval. | DO_NOT_CREATE now. |
| BLK-015 | New API routes without explicit API decision | Existing APIs must be used/hardened first. | API contract | API_DECISION_REQUIRED resolved. | DO_NOT_CREATE now. |
| BLK-016 | main-derived tasks | main is false-gap only. | False gap cleanup | Never as target truth. | DO_NOT_CREATE. |

---

## 14. Validation Commands and Reporting Pflicht

### 14.1 Candidate Validation Commands

Codex muss vor Ausführung die tatsächlich vorhandenen `package.json`-Scripts prüfen. Im aktuellen full-workflow Package sind folgende Kandidaten plausibel und müssen repo-realistisch verwendet werden:

| Command | Use | When Required | Notes |
| --- | --- | --- | --- |
| `pnpm install` | Dependencies installieren | Nur wenn nicht bereits vorhanden und Repo-Workflow es verlangt. | Keine package manager migration. |
| `pnpm typecheck` | TypeScript-NoEmit | Nach TS-/service-/test changes. | Script im package.json vorhanden. |
| `pnpm lint` | ESLint | Nach Code-/Testchanges. | Script im package.json vorhanden. |
| `pnpm db:validate` | Prisma schema validate | Bei Prisma usage alignment; keine Migration. | Script im package.json vorhanden. |
| `pnpm test:playwright` oder `pnpm exec playwright test` | Gesamte Playwright Suite | Nach größeren E2E changes, falls Laufzeit akzeptabel. | Vor Ausführung gegen package.json prüfen. |
| `pnpm test:workflow-api` | Demo workflow API proof | Bei /api/demo-workflow changes. | Existing targeted script. |
| `pnpm test:permissions` | Permission/RBAC proof | Bei RBAC/tenant/object/payload tests. | Existing targeted script. |
| `pnpm test:file-export` | Export package proof | Bei export service changes. | Existing targeted script. |
| `pnpm test:route-smoke` | Route shell smoke | Bei route-linked UI proof changes. | Existing targeted script. |
| `pnpm phase:check` | Typecheck + lint + db validate + build | Final validation if feasible. | Existing script; may be heavier. |

### 14.2 Reporting Pflicht

| Report Field | Required Content |
| --- | --- |
| Changed files | Alle geänderten Dateien mit kurzer Begründung. |
| Implemented tasks | Task IDs, z. B. E2E-CJ-004, E2E-HAR-003, E2E-P0-NEG-010. |
| Journey proof coverage | CJ-001 bis CJ-025 Status: implemented, guard-only, deferred, hold-blocked, spec-required, skipped. |
| Skipped / blocked tasks | Genaue Gründe und Stop Rules. |
| Tests run | Befehle und Ergebnis. |
| Tests not run | Grund, Risiko und Ersatzprüfung. |
| P0 proof status | Positive/negative Proofs pro Journey oder Canonical Path. |
| Safety proof | RBAC, Visibility, Evidence, Audit, Export, Compliance, Admin Non-Bypass. |
| Known gaps | Präzise, nicht generisch. |
| Deferred/Hold integrity | Nachweis, dass P1/HOLD/SPEC nicht heimlich implementiert wurden. |

---

## 15. Final QA / Proof Section

| QA Check | PASS/FAIL | Evidence |
| --- | --- | --- |
| All 25 canonical journeys covered | PASS | Coverage Matrix enthält CJ-001 bis CJ-025; jede Journey hat eine Task Card. |
| Journey proof architecture created | PASS | 10 Proof Layers und 13 Workstreams definieren E2E-Proof auf Control Layer. |
| Control-layer dependency preserved | PASS | Jede Task Card enthält Required Control-Layer Dependencies. |
| No journey-by-journey isolated overbuild | PASS | Tasks nutzen Shared Harnesses und Control Layer; isolierter Featurebau ist verboten. |
| MVP/P1/HOLD/SPEC labels preserved | PASS | P1/HOLD/SPEC Journeys sind als deferred/guard/spec-only markiert. |
| Safety / Compliance mapped per journey | PASS | Task Cards und P0 Matrix enthalten RBAC, Visibility, Advice, Evidence, Audit, Export, Compliance. |
| No screen/image/state generation | PASS | Stop Rules verbieten Screen-/State-Screen-/Image-Generierung. |
| No Prisma migration authorized | PASS | Schema Impact nutzt bestehende Baseline; Migration ist verboten. |
| Existing APIs used before new APIs | PASS | API Matrix nutzt nur vier bestehende APIs; neue APIs = API_DECISION_REQUIRED. |
| `main` blocked as target truth | PASS | Source lock und task Stop Rules blocken main-derived tasks. |
| Upload not treated as evidence sufficiency | PASS | CJ-004/CJ-005/CJ-025 und P0-NEG-010/011 erzwingen separation. |
| Advisor approval not treated as release | PASS | CJ-009/CJ-010 und P0-NEG-008/009. |
| Compliance release not treated as client acceptance | PASS | Client Visibility/Export tasks unterscheiden release, projection, acceptance. |
| Export preview not treated as approval | PASS | CJ-015, E2E-P0-NEG-014. |
| Route access not treated as payload visibility | PASS | CJ-012/CJ-013 and P0-NEG-003/004. |
| Admin non-bypass preserved | PASS | CJ-014 and blocked register. |
| AI Draft internal-only preserved | PASS | CJ-007 and P0-NEG-005. |
| P0 positive and negative tests specified | PASS | 22 P0/guard tests listed with candidate files. |
| Offboarding covered as SPEC/P1 control track | PASS | CJ-024, Proof Layer 10, Fixture FX-014, Blocker BLK-007. |
| Blocked/deferred register complete | PASS | KYC, Suitability, Committee, P1 Communication/Monitoring/Ops, Offboarding, forbidden items included. |

### ENGINE Execution Proof

| Phase | Engine Combination | What was done | Proof / Output |
| --- | --- | --- | --- |
| Charter | ENGINE_v3 | Zielartefakt, Nicht-Implementierungsgrenze und 25/25 Coverage gesperrt. | Executive Decision + QA checks. |
| Source Intake | ENGINE_v3 Evidence | Journey Atlas, Control-Layer Pack, Final Handoff, Task Master, P0/Schema/API/Safety Artefakte als Hierarchie übernommen. | Source-of-Truth Lock. |
| Journey Proof Reframing | ENGINE_v2 | 25 Journeys als E2E-Proofs auf generischer Control Layer statt isolierter Feature-Bauten strukturiert. | Proof Layer Architecture + Workstreams. |
| Task Decomposition | ENGINE_v2-B | Codex-taugliche Task Cards mit Target Files, Inputs, Outputs, Safety Gates, Tests, Stop Rules erzeugt. | Detailed Codex Journey Task Cards. |
| Safety / Compliance Adversarial | ENGINE_v3 Adversarial | AI Draft leakage, unapproved advice, advisor-not-release, upload-not-sufficiency, admin bypass, audit failure, export leakage, cross-tenant no-leak geprüft. | P0 Journey Test Task Matrix + Blocked Register. |
| Sequence and Dependency Convergence | ENGINE_v3 Convergence | Control-Layer foundation vor E2E proof, Audit vor Release/Export, Visibility vor Client claims, P1/HOLD/SPEC als guards. | Implementation Sequence with Dependencies. |
| QA / Proof | ENGINE_v3 QA | 25/25 Coverage, no-overclaim, Stop Rules, API/Schema/Generation-Schutz und Deferred/Hold Integrity geprüft. | Final QA / Proof Section. |
