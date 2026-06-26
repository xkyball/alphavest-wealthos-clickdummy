# ALPHAVEST_UI_CLICKFLOW_PAGEFLOW_STATE_VISIBILITY_INTERACTION_CODEX_TASK_PACK.md

**Generated:** 2026-06-21  
**Mode:** Codex Task Pack / Implementation Task Specification only. Keine Implementierung. Keine Codeänderung. Keine Codex-Ausführung. Keine Screen-, State-Screen-, Image-, API- oder Schema-Generierung.  
**Target repository:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`  
**Target branch:** `full-workflow`

---

## 1. Executive Decision

**Artefaktstatus:** `UI_CLICKFLOW_PAGEFLOW_STATE_VISIBILITY_INTERACTION_TASK_PACK_ACCEPTED_WITH_CONSTRAINTS`

**Task-Pack-Zweck:** Dieses Artefakt übersetzt die 25 Canonical Journeys in implementierbare UI-Clickflow-/Pageflow-/State-/Visibility-/Interaction-Codex-Tasks. Es baut keine neuen Screens und ersetzt keine Produktentscheidungen. Es definiert, wie bestehende Routen, Komponenten, Services und APIs so gehärtet werden müssen, dass UI und Pageflows niemals mehr anzeigen, versprechen oder auslösen als die generische WealthOS-Control-Layer-Architektur beweisen kann.

**Architekturprinzip:** `Journey UI Proofs auf Control Layer, nicht Screen-Neuerfindung`. Die UI ist eine Projektion von Actor Context, Tenant/Object Scope, PermissionDecision, PayloadVisibility, EvidenceSufficiency, WorkflowGate, AuditGuard, ClientVisibilityProjection und ExportSafety. Route Access, sichtbare Buttons, Statuschips und vorhandene PNGs sind keine Beweise für erlaubte Payloads oder Mutationen.

**Codex darf später implementieren:** UI Guards, State Mapping, Disabled/Denied/Hidden/Redacted-Zustände, Upload-/Approval-/Compliance-/Export-Lifecycles, route-nahe Feedback- und Error-States, Test-Harnesses und P0 UI-/Payload-Negativtests auf bestehenden Komponenten, Services und APIs.

**Codex darf nicht entscheiden:** Route Scope, MVP/P1/HOLD-Reklassifikation, neue API-Routen, Prisma-Migrationen, neue Screens, Visual Generation, autonome Advice-Automation, Client-visible AI Draft, Admin Bypass oder manuelle Client-Visibility-Override.

**Gesamtentscheidung:** MVP- und MVP_SUPPORT-Flows erhalten implementierbare UI-/State-/Visibility-Tasks. P1-Flows erhalten Guard-/Deferred-Tasks. HOLD-Flows erhalten Blocked-State-Tasks. Offboarding bleibt `SPEC_REQUIRED / P1_CONTROL_TRACK`, außer ein späteres Artefakt hebt es explizit in den MVP.

## 2. Source-of-Truth Lock

| Rang | Source | Verwendung im Task Pack | Verbot | Task-Konsequenz |
| --- | --- | --- | --- | --- |
| 1 | ALPHAVEST_E2E_JOURNEY_PROOF_25_CODEX_TASK_PACK.md | Journey-Proof-Tasks, Proof-Layer, Fixtures, P0-Testpflichten | nicht als Beweis bereits umgesetzter Journey-Proofs interpretieren | UI Tasks müssen Journey Proofs nur vorbereiten/beweisbar machen |
| 2 | ALPHAVEST_WEALTHOS_CONTROL_LAYER_33_SYSTEM_PROCESS_CODEX_TASK_PACK.md | Control-Layer-Basis, 33 Systemprozesse, Shared Engines | nicht als Beweis interpretieren, dass Control Layer bereits umgesetzt ist | UI hängt von WCL-Ergebnissen ab; Tasks dürfen WCL nicht umgehen |
| 3 | ALPHAVEST_COMPLETE_USER_JOURNEY_PROCESS_ATLAS.md | Journey-Step-Matrizen, Lifecycle, Inputs, Outputs, Canonical Paths | nicht als Implementierungsbeweis behandeln | Pageflows leiten sich aus Journey Steps und Outputs ab |
| 4 | FINAL_CODEX_IMPLEMENTATION_HANDOFF.md | Constraint-Rahmen, Stop Rules, target codebase | kein Freibrief für Scope-Ausweitung | Codex darf nur im locked full-workflow-Kontext arbeiten |
| 5 | FINAL_CODEX_TASK_MASTER.md | Task-Logik, P0-Pflichten, Do-not-create | nicht ungeprüft duplizieren | nur UI-/Flow-spezifische Tasks übernehmen |
| 6 | ROUTE_SCOPE_LOCK.md | 71-Routen-Universum und Scope Labels | Routen nicht reklassifizieren | MVP/P1/HOLD/REFERENCE bleiben erhalten |
| 7 | ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md | Route-to-component-to-visual mapping | PNGs nicht als Verhalten beweisen | Visual references sind Design-Hinweise, keine Gate-Beweise |
| 8 | STATE_SCREEN_SPEC.md | Route- und Flow-State Requirements | keine State-Screen-Bilder generieren | State requirements werden als Code-/Test-Aufgaben formuliert |
| 9 | DRAWER_MODAL_INTERACTION_CONTRACT.md | Overlay-/Modal-/Wizard-/Upload-Lifecycles | sichtbare Overlays nicht als Lifecycle-Beweis behandeln | Modal/Drawer Tasks brauchen echte Trigger/Close/Submit/Fail-States |
| 10 | FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md | Feedback, Validation, Error, Fail-Closed Messaging | Feedback nicht als Implementierungsbeweis behandeln | No-overclaim copy und fail-closed feedback werden verpflichtend |
| 11 | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md | RBAC, Payload Visibility, AI Draft internal-only, Admin Non-Bypass | Route Access nicht als Payload Visibility behandeln | Visibility/Action-Guards werden zentral |
| 12 | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md | Evidence Sufficiency, Audit Persistence, Export Safety | Upload/Export/Audit-UI nicht als Safety Proof behandeln | Upload/Export/Audit UI muss no-overclaim sein |
| 13 | API_CONTRACT_MATRIX.md | bestehende API-Baseline | API-Präsenz nicht als Safety-Beweis behandeln | UI/API integration nutzt bestehende Routen nur mit validation/redaction/failure states |
| 14 | SCHEMA_FIELD_LEVEL_RECONCILIATION.md | Full-workflow Schema Baseline | kein blindes Patch-Schema-Replacement | UI nutzt vorhandene Modelle/Felder via Services |
| 15 | P0_TEST_ACCEPTANCE_MATRIX.md | Proof-Slices und fehlende Tests | bestehende Tests nicht als komplette Abdeckung überclaimen | fehlende UI-/Payload-Negativtests werden Tasks |
| 16 | ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md | Journey-first Requirements | nicht als Codebeweis verwenden | Requirements liefern Akzeptanzlogik |
| 17 | ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md | MVP/P1/Hold-Priorisierung | keine ungeprüfte Journey-Ausweitung | MVP-Spine zuerst |
| 18 | MVP_SCOPE_LOCK.md | MVP Boundary, Non-Goals, P0 Scope | MVP nicht ausweiten | Non-goals bleiben DO_NOT_CREATE |
| 19 | ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md | Real/partial/static/deterministic interaction truth | Visual/static states nicht als Verhalten überclaimen | UI Tasks müssen echte Interaktion beweisen |
| 20 | ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md | Target inventory | Inventory nicht als Readiness Proof behandeln | Target files müssen vor Codex-Änderung geprüft werden |
| 21 | alphavest_mvp_artifact_completion_patch.zip | MVP Control Spec only | nicht blind ersetzen | nur Control-Regeln referenzieren |
| 22 | alphavest-wealthos-clickdummy-full-workflow.zip | Primary Target Codebase | nicht annehmen, dass alles fertig ist | einziger Zielcode-Kontext |
| 23 | alphavest-wealthos-clickdummy-main.zip | False-gap source only | niemals Target Truth | main-derived tasks verboten |

## 3. UI Clickflow / Pageflow Architecture Overview

| Flow Layer ID | Layer Name | Responsibility | Covered Journeys | Required Control Layers | Primary Components | Safety Gates | Implementation Status | Main Task Group |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UIF-L01 | Access / Onboarding / Current User Flow Layer | Onboarding, auth-state, consent, role confirmation and no-anonymous-context feedback | CJ-001 | WCL-01, WCL-02, WCL-03 | AuthOnboardingScreen, WizardStepper, Modal | RBAC, Consent, Tenant Scope | IMPLEMENTATION_READY | UIF-CJ-001 |
| UIF-L02 | Tenant / Admin / Governance Setup Flow Layer | Tenant setup, policies, team assignment, invite/user-role flow | CJ-002, CJ-012 | WCL-02, WCL-03, WCL-08 | AdminTenantSetupScreen, DataTable, Modal/Drawer | RBAC, Audit, Admin Non-Bypass | IMPLEMENTATION_READY / CONDITIONAL_SUPPORT | UIF-CJ-002, UIF-CJ-012 |
| UIF-L03 | Client Context / Object Scope Flow Layer | Client/family/entity/wealth map surfaces with object-scope and sensitivity guards | CJ-003 | WCL-02, WCL-04 | ClientIntakeScreen, WealthActionsScreen | Payload Visibility, Tenant Isolation | CONDITIONAL_SUPPORT | UIF-CJ-003 |
| UIF-L04 | Document Upload / Evidence Intake Flow Layer | Upload, retry, extraction/review, evidence link and sufficiency UI | CJ-004, CJ-005, CJ-025 | WCL-05, WCL-06, WCL-08 | ClientIntakeScreen, EvidenceList, StatePanel | Upload-not-sufficiency, Evidence, Audit | IMPLEMENTATION_READY | UIF-CJ-004, UIF-CJ-005, UIF-CJ-025 |
| UIF-L05 | Internal Workflow / Draft / Analyst Review Flow Layer | Signals, draft, unsupported claim rejection and analyst review states | CJ-006, CJ-007, CJ-008 | WCL-07, WCL-08 | InternalWorkflowScreen | AI Draft Internal Only, Advice Boundary | IMPLEMENTATION_READY | UIF-CJ-006..008 |
| UIF-L06 | Advisor Approval / Compliance Release Flow Layer | Approval, block, request evidence and release UI states | CJ-009, CJ-010 | WCL-06, WCL-07, WCL-08 | InternalWorkflowScreen, DecisionsGovernanceScreen, Modal | Advisor-not-release, Compliance Release, Audit | IMPLEMENTATION_READY | UIF-CJ-009, UIF-CJ-010 |
| UIF-L07 | Client Visibility / Decision Room Flow Layer | Client-safe projection, portal/mobile fail-closed state and decision room | CJ-011 | WCL-04, WCL-07, WCL-08 | ClientIntakeScreen, DecisionsGovernanceScreen | Client Visibility, Redaction | IMPLEMENTATION_READY | UIF-CJ-011 |
| UIF-L08 | Governance Negative Safety Flow Layer | Access request, second confirmation, cross-tenant denial, admin non-bypass and guest scope | CJ-012, CJ-013, CJ-014, CJ-019 | WCL-02, WCL-03, WCL-08 | AdminTenantSetupScreen, DecisionsGovernanceScreen | RBAC, Payload Visibility, Admin Non-Bypass | IMPLEMENTATION_READY / CONDITIONAL_SUPPORT | UIF-CJ-012..014, UIF-CJ-019 |
| UIF-L09 | Export / Redaction / Download Flow Layer | Export scope, redaction, preview, approval, download/share separation | CJ-015 | WCL-04, WCL-08, WCL-09 | CommunicationExportOpsScreen, Modal | Export Redaction, Audit, Client Safe Export | IMPLEMENTATION_READY | UIF-CJ-015 |
| UIF-L10 | Monitoring / Communication / Ops Guard Flow Layer | P1 guarded monitoring, communication and ops flows without automatic advice or bypass | CJ-016, CJ-017, CJ-018 | WCL-10, WCL-08 | CommunicationExportOpsScreen, ReviewMonitoringScreen | No Auto Advice, No Gate Bypass | P1_DEFERRED / GUARD_ONLY | UIF-CJ-016..018 |
| UIF-L11 | Held High-Risk Route Guard Flow Layer | KYC, suitability, IPS and committee held-state surfaces without MVP activation | CJ-020, CJ-021, CJ-022 | WCL-03, WCL-04, WCL-08 | KycAmlWorkflowScreen, SuitabilityIpsScreen, CommitteeReviewScreen | Hold Integrity, Compliance Safety | HOLD_BLOCKED / GUARD_ONLY | UIF-CJ-020..022 |
| UIF-L12 | Offboarding / Retention / Revocation Flow Layer | Spec/P1 access revocation, final export, retention and legal hold flow states | CJ-024 | WCL-11, WCL-08, WCL-09 | TARGET_FILE_TO_VERIFY, existing admin/export components if scoped later | Access Revocation, Retention, Audit | SPEC_REQUIRED / CONTROL_LAYER_SAFE_STUB | UIF-CJ-024 |
| UIF-L13 | Cross-Cutting Fail-Closed State / Feedback Flow Layer | Common denied, hidden, redacted, blocked, retry, audit unavailable and no-silent-progress behaviour | CJ-013, CJ-014, CJ-023, CJ-025 plus all safety flows | WCL-03, WCL-04, WCL-08, WCL-12 | StatePanel, Modal, Drawer, API error handling | Fail-Closed, Audit, Visibility | IMPLEMENTATION_READY | UIF-SHARED-* |

## 4. Journey-to-Pageflow Coverage Matrix — 25/25

| Journey ID | Journey Name | Scope / Treatment | Flow Layer | Route Sequence / Pageflow | Required UI States | What May Be Visible | What Must Not Be Visible | Required Interactions | Task ID(s) | Required Tests | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CJ-001 | Client Onboarding: Invite → Identity → Consent → Role Confirmation | MVP_SUPPORT | UIF-L01 | 001→002→003→004→005→006 | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-001 | Positive + negative UI/Payload tests | CONDITIONAL_SUPPORT |
| CJ-002 | Tenant Setup and Team Assignment | MVP_SUPPORT | UIF-L02 | 007→013→014→015→016→017→018 | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-002 | Positive + negative UI/Payload tests | CONDITIONAL_SUPPORT |
| CJ-003 | Client Context Setup: Profile, Family, Relationships, Entities, Wealth Map | MVP_SUPPORT | UIF-L03 | 021→022→023→024→025→026→031→032 | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-003 | Positive + negative UI/Payload tests | CONDITIONAL_SUPPORT |
| CJ-004 | Document Upload and Intake | MVP | UIF-L04 | 027→028→027 | loading, error, permission denied, hidden/redacted, blocked, success; upload in progress, upload failed, upload success upload-only | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-004 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY |
| CJ-005 | Evidence Review, Linkage and Sufficiency | MVP | UIF-L04 | 029→030→046→047→041/038 | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-005 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY |
| CJ-006 | Signal / Trigger Intake | MVP | UIF-L05 | 033→034→035 | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-006 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY |
| CJ-007 | Internal AI / Rules Draft Creation | MVP | UIF-L05 | 034→035 | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-007 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY |
| CJ-008 | Analyst Review and Unsupported Claim Rejection | MVP | UIF-L05 | 034→035→036 | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-008 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY |
| CJ-009 | Advisor Approval | MVP | UIF-L06 | 036→037→038 | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-009 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY |
| CJ-010 | Compliance Block / Request Evidence / Release | MVP | UIF-L06 | 038→039→040 / 041→042 | loading, error, permission denied, hidden/redacted, blocked, success; needs evidence, compliance blocked, release pending, audit unavailable | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-010 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY |
| CJ-011 | Client Visibility and Digital Decision Room | MVP | UIF-L07 | 019/020→043→044→045→046→047 | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-011 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY |
| CJ-012 | Governance: Role, Access Request, Second Confirmation | MVP_SUPPORT | UIF-L08 | 009→010→048→049→050→051 | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-012 | Positive + negative UI/Payload tests | CONDITIONAL_SUPPORT |
| CJ-013 | Cross-Tenant / Wrong-Object Denial | MVP | UIF-L08 | any scoped route → denied/hidden state | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-013 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY_NEGATIVE_SAFETY_PROOF |
| CJ-014 | Admin Non-Bypass | MVP | UIF-L08 | 009/010/048/049/050 → attempted release/export/evidence bypass → denied | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-014 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY_NEGATIVE_SAFETY_PROOF |
| CJ-015 | Export Scope, Redaction, Preview, Approval, Download / Share | MVP | UIF-L09 | 054→055→056→057→058 | loading, error, permission denied, hidden/redacted, blocked, success; export pending, redaction pending, preview generated, approval pending, download blocked/allowed | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-015 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY |
| CJ-016 | Review Rhythm / Monitoring / Rebalance Review without Automatic Advice | P1_AFTER_MVP | UIF-L10 | 068→069→033 internal trigger only | loading, error, permission denied, hidden/redacted, blocked, success | P1/internal-only Guard-State; keine Client Advice Projection | MVP Release oder automatische Advice-Aktion | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-016 | Positive + negative UI/Payload tests | P1_DEFERRED_GUARD_ONLY |
| CJ-017 | Communication / Client Request / Call Trigger | P1_AFTER_MVP | UIF-L10 | 052→053→034 internal workflow | loading, error, permission denied, hidden/redacted, blocked, success | P1/internal-only Guard-State; keine Client Advice Projection | MVP Release oder automatische Advice-Aktion | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-017 | Positive + negative UI/Payload tests | P1_DEFERRED_GUARD_ONLY |
| CJ-018 | Operations Queues / SLA / Data Quality Remediation | P1_AFTER_MVP | UIF-L10 | 059→060→blocked/remediated state | loading, error, permission denied, hidden/redacted, blocked, success | P1/internal-only Guard-State; keine Client Advice Projection | MVP Release oder automatische Advice-Aktion | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-018 | Positive + negative UI/Payload tests | P1_DEFERRED_GUARD_ONLY |
| CJ-019 | External Advisor / Guest Scoped Access | CONDITIONAL_SUPPORT | UIF-L08 | 003→018→027/028 object-scoped only | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-019 | Positive + negative UI/Payload tests | CONDITIONAL_SUPPORT |
| CJ-020 | KYC / AML / Source-of-Wealth Review | HOLD_PENDING_DECISION | UIF-L11 | 064→065 held-state only | loading, error, permission denied, hidden/redacted, blocked, success | Hold-/Blocked-State und ggf. interne scoped Metadata only | produktive Approve/Release/Client-Visibility/Export-Actions | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-020 | Positive + negative UI/Payload tests | HOLD_BLOCKED_NO_MVP_FLOW |
| CJ-021 | Suitability / IPS / Mandate | HOLD_PENDING_DECISION | UIF-L11 | 066→067 held-state only | loading, error, permission denied, hidden/redacted, blocked, success | Hold-/Blocked-State und ggf. interne scoped Metadata only | produktive Approve/Release/Client-Visibility/Export-Actions | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-021 | Positive + negative UI/Payload tests | HOLD_BLOCKED_NO_MVP_FLOW |
| CJ-022 | Committee Review and Dissent | HOLD_PENDING_DECISION | UIF-L11 | 070→071 held-state only | loading, error, permission denied, hidden/redacted, blocked, success | Hold-/Blocked-State und ggf. interne scoped Metadata only | produktive Approve/Release/Client-Visibility/Export-Actions | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-022 | Positive + negative UI/Payload tests | HOLD_BLOCKED_NO_MVP_FLOW |
| CJ-023 | Audit Failure / Safety Action Held | MVP | UIF-L13 | critical action → audit unavailable → held/denied state | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-023 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY_NEGATIVE_SAFETY_PROOF |
| CJ-024 | Offboarding: Access Revocation, Final Export, Retention, Archive | SPEC_REQUIRED / P1_AFTER_MVP | UIF-L12 | offboarding spec flow: revoke→final export→retention/archive | loading, error, permission denied, hidden/redacted, blocked, success | P1/internal-only Guard-State; keine Client Advice Projection | MVP Release oder automatische Advice-Aktion | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-024 | Positive + negative UI/Payload tests | P1_DEFERRED_GUARD_ONLY |
| CJ-025 | Upload / Error / Retry / Permission Denied Exception Journey | MVP | UIF-L13 | 028 invalid/denied/error → retry/no sufficiency | loading, error, permission denied, hidden/redacted, blocked, success | role- und scope-erlaubte Shell + client-safe / internal-safe Payload gemäß Actor | AI Draft, internal rationale, compliance notes, unreleased recommendations, wrong-tenant data; keine Gate-Overclaims | siehe Interaction Contract Matrix; alle safety-relevanten Aktionen mit validation/loading/error/denied/audit states | UIF-CJ-025 | Positive + negative UI/Payload tests | IMPLEMENTATION_READY_NEGATIVE_SAFETY_PROOF |

## 5. Route / Component / State Matrix

| Route ID | Route Path | Component | Scope Label | Used In Journey / Flow | Required States | Visibility Rule | Required Interactions | Forbidden UI Claim | Target Task IDs | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | /login | AuthOnboardingScreen | MVP_SUPPORT | CJ-001 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-001 | state + visibility + interaction test where flow-relevant |
| 002 | /mfa | AuthOnboardingScreen | MVP_SUPPORT | CJ-001 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | open/close/cancel/confirm modal with validation, focus/escape, blocked/error handling | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-001 | state + visibility + interaction test where flow-relevant |
| 003 | /onboarding/invite | AuthOnboardingScreen | MVP_SUPPORT | CJ-001, CJ-019 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | wizard next/back/save/cancel with validation and denied/error states | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-001; UIF-CJ-019 | state + visibility + interaction test where flow-relevant |
| 004 | /onboarding/identity | AuthOnboardingScreen | MVP_SUPPORT | CJ-001 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | wizard next/back/save/cancel with validation and denied/error states | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-001 | state + visibility + interaction test where flow-relevant |
| 005 | /onboarding/consent | AuthOnboardingScreen | MVP_SUPPORT | CJ-001 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | open/close/cancel/confirm modal with validation, focus/escape, blocked/error handling | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-001 | state + visibility + interaction test where flow-relevant |
| 006 | /onboarding/role-confirmation | AuthOnboardingScreen | MVP_SUPPORT | CJ-001 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | wizard next/back/save/cancel with validation and denied/error states | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-001 | state + visibility + interaction test where flow-relevant |
| 007 | /admin/platform | AdminTenantSetupScreen | MVP_SUPPORT | CJ-002 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | open/close/cancel/confirm modal with validation, focus/escape, blocked/error handling | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-002 | state + visibility + interaction test where flow-relevant |
| 008 | /admin/policies/advice-boundary | AdminTenantSetupScreen | MVP | CJ-002, CJ-012 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | view, filter/review as scoped; manage action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-002; UIF-CJ-012 | state + visibility + interaction test where flow-relevant |
| 009 | /admin/roles | AdminTenantSetupScreen | MVP_SUPPORT | CJ-012, CJ-014 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | open/close/cancel/confirm modal with validation, focus/escape, blocked/error handling | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-012; UIF-CJ-014 | state + visibility + interaction test where flow-relevant |
| 010 | /admin/security | AdminTenantSetupScreen | MVP_SUPPORT | CJ-012, CJ-014 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | open/close/cancel/confirm modal with validation, focus/escape, blocked/error handling | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-012; UIF-CJ-014 | state + visibility + interaction test where flow-relevant |
| 011 | /admin/evidence-templates | AdminTenantSetupScreen | MVP_SUPPORT | CJ-002 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | view, filter/review as scoped; manage action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-002 | state + visibility + interaction test where flow-relevant |
| 012 | /admin/export-templates | AdminTenantSetupScreen | MVP_SUPPORT | CJ-015 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | view, filter/review as scoped; manage action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-015 | state + visibility + interaction test where flow-relevant |
| 013 | /admin/tenants | AdminTenantSetupScreen | MVP_SUPPORT | CJ-002 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-002 | state + visibility + interaction test where flow-relevant |
| 014 | /tenants/new | AdminTenantSetupScreen | MVP_SUPPORT | CJ-002 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | wizard next/back/save/cancel with validation and denied/error states | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-002 | state + visibility + interaction test where flow-relevant |
| 015 | /tenants/:id/setup | AdminTenantSetupScreen | MVP_SUPPORT | CJ-002 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | wizard next/back/save/cancel with validation and denied/error states | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-002 | state + visibility + interaction test where flow-relevant |
| 016 | /tenants/:id/team | AdminTenantSetupScreen | MVP_SUPPORT | CJ-002 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | view, filter/review as scoped; assign action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-002 | state + visibility + interaction test where flow-relevant |
| 017 | /tenants/:id/policies | AdminTenantSetupScreen | MVP_SUPPORT | CJ-002 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | view, filter/review as scoped; manage action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-002 | state + visibility + interaction test where flow-relevant |
| 018 | /tenants/:id/users | AdminTenantSetupScreen | MVP_SUPPORT | CJ-002, CJ-012, CJ-019 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | open/close/cancel/confirm modal with validation, focus/escape, blocked/error handling | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-002; UIF-CJ-012; UIF-CJ-019 | state + visibility + interaction test where flow-relevant |
| 019 | /portal | ClientIntakeScreen | MVP | CJ-011, CJ-013 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Kein AI Draft, interne Rationale, Compliance Notes oder unreleased Recommendations im Client UI | UIF-CJ-011; UIF-CJ-013 | state + visibility + interaction test where flow-relevant |
| 020 | /mobile | ClientIntakeScreen | MVP | CJ-011, CJ-013 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Kein AI Draft, interne Rationale, Compliance Notes oder unreleased Recommendations im Client UI | UIF-CJ-011; UIF-CJ-013 | state + visibility + interaction test where flow-relevant |
| 021 | /client/profile | ClientIntakeScreen | MVP_SUPPORT | CJ-003 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-003 | state + visibility + interaction test where flow-relevant |
| 022 | /client/family-members | ClientIntakeScreen | MVP_SUPPORT | CJ-003 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-003 | state + visibility + interaction test where flow-relevant |
| 023 | /relationships | ClientIntakeScreen | MVP_SUPPORT | CJ-003 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-003 | state + visibility + interaction test where flow-relevant |
| 024 | /entities | ClientIntakeScreen | MVP_SUPPORT | CJ-003 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-003 | state + visibility + interaction test where flow-relevant |
| 025 | /entities/new | ClientIntakeScreen | MVP_SUPPORT | CJ-003 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | wizard next/back/save/cancel with validation and denied/error states | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-003 | state + visibility + interaction test where flow-relevant |
| 026 | /entities/:id | ClientIntakeScreen | MVP_SUPPORT | CJ-003 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-003 | state + visibility + interaction test where flow-relevant |
| 027 | /documents | ClientIntakeScreen | MVP | CJ-004, CJ-005, CJ-019, CJ-025 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-004; UIF-CJ-005; UIF-CJ-019; UIF-CJ-025 | state + visibility + interaction test where flow-relevant |
| 028 | /documents/upload | ClientIntakeScreen | MVP | CJ-004, CJ-025, CJ-019 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, UPLOAD_IN_PROGRESS_STATE, UPLOAD_FAILED_STATE, UPLOAD_SUCCESS_UPLOAD_ONLY_STATE, VALIDATION_FAILED_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | file select/drop, validate, submit upload, retry/reselect, show upload-only success | Upload success darf nie Evidence Sufficient / Release Ready anzeigen | UIF-CJ-004; UIF-CJ-025; UIF-CJ-019 | state + visibility + interaction test where flow-relevant |
| 029 | /documents/extraction-review | ClientIntakeScreen | MVP | CJ-005 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | view, filter/review as scoped; review action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-005 | state + visibility + interaction test where flow-relevant |
| 030 | /documents/verification-pending | ClientIntakeScreen | MVP | CJ-005 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | view, filter/review as scoped; review action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-005 | state + visibility + interaction test where flow-relevant |
| 031 | /wealth-map | WealthActionsScreen | MVP_SUPPORT | CJ-003 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted | open/close drawer, scoped row detail, no mutation without action permission | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-003 | state + visibility + interaction test where flow-relevant |
| 032 | /actions | WealthActionsScreen | MVP_SUPPORT | CJ-003 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | open/close drawer, scoped row detail, no mutation without action permission | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-003 | state + visibility + interaction test where flow-relevant |
| 033 | /signals | InternalWorkflowScreen | MVP | CJ-006, CJ-016 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | view, filter/review as scoped; review action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-006; UIF-CJ-016 | state + visibility + interaction test where flow-relevant |
| 034 | /workbench | InternalWorkflowScreen | MVP | CJ-006, CJ-007, CJ-008, CJ-017 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | view, filter/review as scoped; review action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-006; UIF-CJ-007; UIF-CJ-008; UIF-CJ-017 | state + visibility + interaction test where flow-relevant |
| 035 | /workbench/triggers/:id | InternalWorkflowScreen | MVP | CJ-006, CJ-007, CJ-008 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | view, filter/review as scoped; review action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-006; UIF-CJ-007; UIF-CJ-008 | state + visibility + interaction test where flow-relevant |
| 036 | /advisor-approval | InternalWorkflowScreen | MVP | CJ-008, CJ-009 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, APPROVAL_PENDING_STATE, SUCCESS_STATE, RELEASE_PENDING_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | review detail, approve/reject/request evidence, show release-pending not client-visible | Advisor approval darf nie Compliance Release oder Client Visibility bedeuten | UIF-CJ-008; UIF-CJ-009 | state + visibility + interaction test where flow-relevant |
| 037 | /advisor-approval/:id | InternalWorkflowScreen | MVP | CJ-009 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, APPROVAL_PENDING_STATE, SUCCESS_STATE, RELEASE_PENDING_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | review detail, approve/reject/request evidence, show release-pending not client-visible | Advisor approval darf nie Compliance Release oder Client Visibility bedeuten | UIF-CJ-009 | state + visibility + interaction test where flow-relevant |
| 038 | /compliance | InternalWorkflowScreen | MVP | CJ-010 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, NEEDS_EVIDENCE_STATE, COMPLIANCE_BLOCKED_STATE, RELEASE_PENDING_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | review compliance, block, request evidence, release only with preconditions, modal confirmation | Compliance release darf nie Client Acceptance oder Investment Execution implizieren | UIF-CJ-010 | state + visibility + interaction test where flow-relevant |
| 039 | /compliance/:id/review | InternalWorkflowScreen | MVP | CJ-010 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, NEEDS_EVIDENCE_STATE, COMPLIANCE_BLOCKED_STATE, RELEASE_PENDING_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | review compliance, block, request evidence, release only with preconditions, modal confirmation | Compliance release darf nie Client Acceptance oder Investment Execution implizieren | UIF-CJ-010 | state + visibility + interaction test where flow-relevant |
| 040 | /compliance/:id/release | InternalWorkflowScreen | MVP | CJ-010, CJ-014, CJ-023 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, NEEDS_EVIDENCE_STATE, COMPLIANCE_BLOCKED_STATE, RELEASE_PENDING_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | review compliance, block, request evidence, release only with preconditions, modal confirmation | Compliance release darf nie Client Acceptance oder Investment Execution implizieren | UIF-CJ-010; UIF-CJ-014; UIF-CJ-023 | state + visibility + interaction test where flow-relevant |
| 041 | /compliance/:id/block | DecisionsGovernanceScreen | MVP | CJ-005, CJ-010 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, NEEDS_EVIDENCE_STATE, COMPLIANCE_BLOCKED_STATE, RELEASE_PENDING_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | review compliance, block, request evidence, release only with preconditions, modal confirmation | Compliance release darf nie Client Acceptance oder Investment Execution implizieren | UIF-CJ-005; UIF-CJ-010 | state + visibility + interaction test where flow-relevant |
| 042 | /compliance/:id/audit | DecisionsGovernanceScreen | MVP | CJ-010, CJ-023 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, NEEDS_EVIDENCE_STATE, COMPLIANCE_BLOCKED_STATE, RELEASE_PENDING_STATE, SUCCESS_STATE, AUDIT_UNAVAILABLE_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-010; UIF-CJ-023 | state + visibility + interaction test where flow-relevant |
| 043 | /decisions | DecisionsGovernanceScreen | MVP | CJ-011 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Kein AI Draft, interne Rationale, Compliance Notes oder unreleased Recommendations im Client UI | UIF-CJ-011 | state + visibility + interaction test where flow-relevant |
| 044 | /decisions/:id | DecisionsGovernanceScreen | MVP | CJ-011 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | open/close/cancel/confirm modal with validation, focus/escape, blocked/error handling | Kein AI Draft, interne Rationale, Compliance Notes oder unreleased Recommendations im Client UI | UIF-CJ-011 | state + visibility + interaction test where flow-relevant |
| 045 | /decisions/:id/success | DecisionsGovernanceScreen | MVP | CJ-011 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | view, filter/review as scoped; approve action only if permission + object scope + gate preconditions pass | Kein AI Draft, interne Rationale, Compliance Notes oder unreleased Recommendations im Client UI | UIF-CJ-011 | state + visibility + interaction test where flow-relevant |
| 046 | /evidence | DecisionsGovernanceScreen | MVP | CJ-005, CJ-011 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | open/close drawer, scoped row detail, no mutation without action permission | Kein AI Draft, interne Rationale, Compliance Notes oder unreleased Recommendations im Client UI | UIF-CJ-005; UIF-CJ-011 | state + visibility + interaction test where flow-relevant |
| 047 | /evidence/:id | DecisionsGovernanceScreen | MVP | CJ-005, CJ-011 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, CLIENT_VISIBILITY_HIDDEN_STATE, REDACTED_INTERNAL_ONLY_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | view, filter/review as scoped; view action only if permission + object scope + gate preconditions pass | Kein AI Draft, interne Rationale, Compliance Notes oder unreleased Recommendations im Client UI | UIF-CJ-005; UIF-CJ-011 | state + visibility + interaction test where flow-relevant |
| 048 | /governance/users | DecisionsGovernanceScreen | MVP | CJ-012, CJ-014 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | open user/role/access drawer, approve/deny request, second confirmation, audit history view | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-012; UIF-CJ-014 | state + visibility + interaction test where flow-relevant |
| 049 | /governance/roles | DecisionsGovernanceScreen | MVP | CJ-012, CJ-014 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | open user/role/access drawer, approve/deny request, second confirmation, audit history view | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-012; UIF-CJ-014 | state + visibility + interaction test where flow-relevant |
| 050 | /governance/access-requests | DecisionsGovernanceScreen | MVP | CJ-012, CJ-014 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | open user/role/access drawer, approve/deny request, second confirmation, audit history view | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-012; UIF-CJ-014 | state + visibility + interaction test where flow-relevant |
| 051 | /governance/audit-history | CommunicationExportOpsScreen | MVP | CJ-012, CJ-013, CJ-014, CJ-023 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit | open user/role/access drawer, approve/deny request, second confirmation, audit history view | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-CJ-012; UIF-CJ-013; UIF-CJ-014; UIF-CJ-023 | state + visibility + interaction test where flow-relevant |
| 052 | /communication | CommunicationExportOpsScreen | P1_AFTER_MVP | CJ-017 | P1_DEFERRED_STATE, INTERNAL_ONLY_GUARD_STATE, PERMISSION_DENIED_STATE, ERROR_STATE | nur P1-Guard/Internal-only; kein client-visible Advice oder Release | guarded view/internal-only action; no automatic advice or release | P1 Route darf keinen MVP Release/Advice Flow aktivieren | UIF-CJ-017 | state + visibility + interaction test where flow-relevant |
| 053 | /communication/call-trigger | CommunicationExportOpsScreen | P1_AFTER_MVP | CJ-017 | P1_DEFERRED_STATE, INTERNAL_ONLY_GUARD_STATE, PERMISSION_DENIED_STATE, ERROR_STATE | nur P1-Guard/Internal-only; kein client-visible Advice oder Release | guarded view/internal-only action; no automatic advice or release | P1 Route darf keinen MVP Release/Advice Flow aktivieren | UIF-CJ-017 | state + visibility + interaction test where flow-relevant |
| 054 | /export/new | CommunicationExportOpsScreen | MVP | CJ-015 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, EXPORT_PENDING_STATE, EXPORT_REDACTION_PENDING_STATE, EXPORT_FAILED_STATE, AUDIT_UNAVAILABLE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | scope export, redact, preview, approve, download/share only after approval/redaction/audit | Preview darf nie Approval sein; Approval darf nicht automatisch Download/Share sein; keine internen Payloads | UIF-CJ-015 | state + visibility + interaction test where flow-relevant |
| 055 | /export/:id/scope | CommunicationExportOpsScreen | MVP | CJ-015 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, EXPORT_PENDING_STATE, EXPORT_REDACTION_PENDING_STATE, EXPORT_FAILED_STATE, AUDIT_UNAVAILABLE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | scope export, redact, preview, approve, download/share only after approval/redaction/audit | Preview darf nie Approval sein; Approval darf nicht automatisch Download/Share sein; keine internen Payloads | UIF-CJ-015 | state + visibility + interaction test where flow-relevant |
| 056 | /export/:id/redaction | CommunicationExportOpsScreen | MVP | CJ-015 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, EXPORT_PENDING_STATE, EXPORT_REDACTION_PENDING_STATE, EXPORT_FAILED_STATE, AUDIT_UNAVAILABLE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | scope export, redact, preview, approve, download/share only after approval/redaction/audit | Preview darf nie Approval sein; Approval darf nicht automatisch Download/Share sein; keine internen Payloads | UIF-CJ-015 | state + visibility + interaction test where flow-relevant |
| 057 | /export/:id/preview | CommunicationExportOpsScreen | MVP | CJ-015, CJ-014, CJ-023 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, EXPORT_PENDING_STATE, EXPORT_REDACTION_PENDING_STATE, EXPORT_FAILED_STATE, AUDIT_UNAVAILABLE_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | scope export, redact, preview, approve, download/share only after approval/redaction/audit | Preview darf nie Approval sein; Approval darf nicht automatisch Download/Share sein; keine internen Payloads | UIF-CJ-015; UIF-CJ-014; UIF-CJ-023 | state + visibility + interaction test where flow-relevant |
| 058 | /export/:id/download | CommunicationExportOpsScreen | MVP | CJ-015 | LOADING_STATE, ERROR_STATE, EMPTY_STATE, PERMISSION_DENIED_STATE, DISABLED_GATED_ACTION_STATE, EXPORT_PENDING_STATE, EXPORT_REDACTION_PENDING_STATE, EXPORT_FAILED_STATE, AUDIT_UNAVAILABLE_STATE, VALIDATION_FAILED_STATE, CANCEL_CLOSE_STATE | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted | scope export, redact, preview, approve, download/share only after approval/redaction/audit | Preview darf nie Approval sein; Approval darf nicht automatisch Download/Share sein; keine internen Payloads | UIF-CJ-015 | state + visibility + interaction test where flow-relevant |
| 059 | /ops/queues | CommunicationExportOpsScreen | P1_AFTER_MVP | CJ-018 | P1_DEFERRED_STATE, INTERNAL_ONLY_GUARD_STATE, PERMISSION_DENIED_STATE, ERROR_STATE | nur P1-Guard/Internal-only; kein client-visible Advice oder Release | guarded view/internal-only action; no automatic advice or release | P1 Route darf keinen MVP Release/Advice Flow aktivieren | UIF-CJ-018 | state + visibility + interaction test where flow-relevant |
| 060 | /ops/sla | CommunicationExportOpsScreen | P1_AFTER_MVP | CJ-018 | P1_DEFERRED_STATE, INTERNAL_ONLY_GUARD_STATE, PERMISSION_DENIED_STATE, ERROR_STATE | nur P1-Guard/Internal-only; kein client-visible Advice oder Release | guarded view/internal-only action; no automatic advice or release | P1 Route darf keinen MVP Release/Advice Flow aktivieren | UIF-CJ-018 | state + visibility + interaction test where flow-relevant |
| 061 | /service-blueprint | CommunicationExportOpsScreen | REFERENCE_ONLY | REFERENCE / no product journey | REFERENCE_ONLY_NO_PRODUCT_STATE | nur Referenzinhalt; keine Produktpayload oder Mutation | read-only reference navigation only | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-REFERENCE-NO-TASK | No product test |
| 062 | /roadmap | CommunicationExportOpsScreen | REFERENCE_ONLY | REFERENCE / no product journey | REFERENCE_ONLY_NO_PRODUCT_STATE | nur Referenzinhalt; keine Produktpayload oder Mutation | read-only reference navigation only | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-REFERENCE-NO-TASK | No product test |
| 063 | /states | CommunicationExportOpsScreen | REFERENCE_ONLY | REFERENCE / no product journey | REFERENCE_ONLY_NO_PRODUCT_STATE | nur Referenzinhalt; keine Produktpayload oder Mutation | read-only reference navigation only | Route Access darf nicht Payload Visibility oder Action Permission beweisen | UIF-REFERENCE-NO-TASK | No product test |
| 064 | /kyc/:id/review | KycAmlWorkflowScreen | HOLD_PENDING_DECISION | CJ-020 | HOLD_BLOCKED_STATE, PERMISSION_DENIED_STATE, REDACTED_INTERNAL_ONLY_STATE | nur Hold-/Blocked-/Internal-only-Hinweis; keine produktive Payload, kein Client Release | Hold-Info anzeigen; keine produktive Submit/Approve/Release-Interaktion | Held Route darf nicht als aktiver MVP Flow erscheinen | UIF-CJ-020 | Held/guard assertion |
| 065 | /kyc/:id/source-of-wealth | KycAmlWorkflowScreen | HOLD_PENDING_DECISION | CJ-020 | HOLD_BLOCKED_STATE, PERMISSION_DENIED_STATE, REDACTED_INTERNAL_ONLY_STATE | nur Hold-/Blocked-/Internal-only-Hinweis; keine produktive Payload, kein Client Release | Hold-Info anzeigen; keine produktive Submit/Approve/Release-Interaktion | Held Route darf nicht als aktiver MVP Flow erscheinen | UIF-CJ-020 | Held/guard assertion |
| 066 | /suitability/:tenantId/profile | SuitabilityIpsScreen | HOLD_PENDING_DECISION | CJ-021 | HOLD_BLOCKED_STATE, PERMISSION_DENIED_STATE, REDACTED_INTERNAL_ONLY_STATE | nur Hold-/Blocked-/Internal-only-Hinweis; keine produktive Payload, kein Client Release | Hold-Info anzeigen; keine produktive Submit/Approve/Release-Interaktion | Held Route darf nicht als aktiver MVP Flow erscheinen | UIF-CJ-021 | Held/guard assertion |
| 067 | /ips/:tenantId | SuitabilityIpsScreen | HOLD_PENDING_DECISION | CJ-021 | HOLD_BLOCKED_STATE, PERMISSION_DENIED_STATE, REDACTED_INTERNAL_ONLY_STATE | nur Hold-/Blocked-/Internal-only-Hinweis; keine produktive Payload, kein Client Release | Hold-Info anzeigen; keine produktive Submit/Approve/Release-Interaktion | Held Route darf nicht als aktiver MVP Flow erscheinen | UIF-CJ-021 | Held/guard assertion |
| 068 | /reviews/calendar | ReviewMonitoringScreen | P1_AFTER_MVP | CJ-016 | P1_DEFERRED_STATE, INTERNAL_ONLY_GUARD_STATE, PERMISSION_DENIED_STATE, ERROR_STATE | nur P1-Guard/Internal-only; kein client-visible Advice oder Release | guarded view/internal-only action; no automatic advice or release | P1 Route darf keinen MVP Release/Advice Flow aktivieren | UIF-CJ-016 | state + visibility + interaction test where flow-relevant |
| 069 | /monitoring/rebalance | ReviewMonitoringScreen | HOLD_PENDING_DECISION | CJ-016 | HOLD_BLOCKED_STATE, PERMISSION_DENIED_STATE, REDACTED_INTERNAL_ONLY_STATE | nur Hold-/Blocked-/Internal-only-Hinweis; keine produktive Payload, kein Client Release | Hold-Info anzeigen; keine produktive Submit/Approve/Release-Interaktion | Held Route darf nicht als aktiver MVP Flow erscheinen | UIF-CJ-016 | Held/guard assertion |
| 070 | /committee/reviews | CommitteeReviewScreen | HOLD_PENDING_DECISION | CJ-022 | HOLD_BLOCKED_STATE, PERMISSION_DENIED_STATE, REDACTED_INTERNAL_ONLY_STATE | nur Hold-/Blocked-/Internal-only-Hinweis; keine produktive Payload, kein Client Release | Hold-Info anzeigen; keine produktive Submit/Approve/Release-Interaktion | Held Route darf nicht als aktiver MVP Flow erscheinen | UIF-CJ-022 | Held/guard assertion |
| 071 | /committee/reviews/:id | CommitteeReviewScreen | HOLD_PENDING_DECISION | CJ-022 | HOLD_BLOCKED_STATE, PERMISSION_DENIED_STATE, REDACTED_INTERNAL_ONLY_STATE | nur Hold-/Blocked-/Internal-only-Hinweis; keine produktive Payload, kein Client Release | Hold-Info anzeigen; keine produktive Submit/Approve/Release-Interaktion | Held Route darf nicht als aktiver MVP Flow erscheinen | UIF-CJ-022 | Held/guard assertion |

## 6. Visibility and Redaction Matrix

| Actor / Role | Route / Flow Context | May See | Must Be Hidden | Must Be Redacted | Disabled / Denied Actions | Reason | Required Test |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Client / Principal | Portal/Mobile, Decision Room, scoped document participation | released client-safe summary; own scoped document metadata; own client-safe export when approved | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendation, wrong-tenant data | raw evidence unless released/redacted; audit internals | approve/release/export-build/governance/internal workflow | CLIENT_SAFE_RELEASED_ONLY; fail closed | negative: no AI Draft/internal/unreleased payload in client route/export |
| Family Office User / CFO | Client workspace and released context within tenant | released scoped family/entity/decision/evidence summaries | unreleased advice, internal workflow, unrelated family/tenant data | sensitive docs where not explicitly released | compliance release, advisor approval, admin bypass | object scope + relationship scope | negative: wrong relationship hidden/redacted |
| Analyst / Consultant | Workbench, documents, extraction, evidence, trigger/draft review | internal drafts, extraction, evidence review, trigger context for assigned tenant | client-only secrets outside assignment; release authority | client-ready summary draft until released | advisor approval, compliance release, export approval | internal-only + audit on review | negative: analyst cannot release or expose draft to client |
| Senior Wealth Advisor | Advisor approval, decision room internal, export preparation | recommendation, rationale, evidence context, advisor notes | compliance-only notes where restricted; unrelated tenant data | client summary before compliance release | compliance release; admin bypass | advisor approval not release | negative: advisor-approved remains client-hidden |
| Compliance Officer | Compliance queue/review/release/block/export approval | compliance-relevant internal payload, evidence, audit context | unrelated tenant/object data | client-facing payload only after redaction/release | skip advisor/evidence/audit preconditions | release requires preconditions and audit | negative: missing evidence/audit blocks release |
| Platform Admin | Platform policies, templates, tenant setup | platform config, policy templates, role definitions | client advice payload by admin status alone | sensitive client data unless scoped | force release/evidence sufficiency/export/visibility | admin non-bypass | negative: admin cannot release or force export |
| Tenant Admin | Tenant users and policies | tenant-scoped users/roles/status | internal advice unless assigned/scoped | sensitive payload outside role | bypass gates or expand visibility manually | tenant scope, second confirmation | negative: role change does not expand payload visibility |
| Security / Governance Admin | Roles, access requests, audit history | governance metadata, access request status, denied audit events | client advice payload by governance role alone | raw sensitive payload unless policy permits | suppress audit or force compliance release | second confirmation + audit | negative: access approval cannot bypass release gates |
| Operations / Client Success | Tenant setup, ops queues, SLA, data quality | ops/status context, data-quality blocker state | advice payload or client release data unless scoped | client-sensitive data | execute advice/release/export approval | P1/conditional ops guard | negative: ops action cannot bypass compliance |
| External Advisor / Guest | Explicit object/document scope only | one invited object/document summary as scoped | tenant-wide context, internal workflow, unrelated docs | most sensitive context by default | approve/release/export/admin actions | object-scoped guest access only | negative: guest sees no tenant-wide payload |
| Committee Member / Chair | Held committee routes if unlocked later | held-state or future committee payload only when unlocked | MVP release authority, client-visible output | all productive data in current MVP | silent release/dissent mutation | HOLD route guard | negative: CJ-022 stays held |
| System / AI Draft Producer | Internal draft automation only | system internal draft metadata; no client UI | client-visible advice, human approval identity | all client-facing summary unless human approved/released | act as advisor/compliance/client source | AI_DRAFT_INTERNAL_ONLY | negative: AI Draft hidden from portal/export |
| Service Account | Background jobs under strict service scope | job metadata, correlation IDs under audit | expanded human-readable payload privileges | payload data unless specifically scoped | impersonate human gates | service scope + audit | negative: service cannot bypass human gates |

## 7. Interaction Contract Matrix

| Interaction ID | Journey / Route | Interaction Type | Trigger | Preconditions | Required Inputs | UI State Before | UI State During | UI State After Success | Failure / Blocked State | Audit Required? | Safety Gate | Target Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| s |
| i |
| e |
| h |
| e |
|   |
| I |
| n |
| t |
| e |
| r |
| a |
| c |
| t |
| i |
| o |
| n |
|   |
| C |
| o |
| n |
| t |
| r |
| a |
| c |
| t |
|   |
| M |
| a |
| t |
| r |
| i |
| x |
| ; |
|   |
| a |
| l |
| l |
| e |
|   |
| s |
| a |
| f |
| e |
| t |
| y |
| - |
| r |
| e |
| l |
| e |
| v |
| a |
| n |
| t |
| e |
| n |
|   |
| A |
| k |
| t |
| i |
| o |
| n |
| e |
| n |
|   |
| m |
| i |
| t |
|   |
| v |
| a |
| l |
| i |
| d |
| a |
| t |
| i |
| o |
| n |
| / |
| l |
| o |
| a |
| d |
| i |
| n |
| g |
| / |
| e |
| r |
| r |
| o |
| r |
| / |
| d |
| e |
| n |
| i |
| e |
| d |
| / |
| a |
| u |
| d |
| i |
| t |
|   |
| s |
| t |
| a |
| t |
| e |
| s |

## 8. Detailed Codex UI Flow Task Cards


### UIF-CJ-001 — Client Onboarding: Invite → Identity → Consent → Role Confirmation

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-001 |
| Task Title | Client Onboarding: Invite → Identity → Consent → Role Confirmation — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-001; routes: 001 `/login`, 002 `/mfa`, 003 `/onboarding/invite`, 004 `/onboarding/identity`, 005 `/onboarding/consent`, 006 `/onboarding/role-confirmation`; Flow Layer: UIF-L01 |
| Scope Label | CONDITIONAL_SUPPORT |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: RBAC, Consent, Tenant Scope, no anonymous payload expansion |
| UI / Flow Objective | Route/Pageflow `001→002→003→004→005→006` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | AuthOnboardingScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 001→002→003→004→005→006; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-001 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-002 — Tenant Setup and Team Assignment

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-002 |
| Task Title | Tenant Setup and Team Assignment — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-002; routes: 007 `/admin/platform`, 013 `/admin/tenants`, 014 `/tenants/new`, 015 `/tenants/:id/setup`, 016 `/tenants/:id/team`, 017 `/tenants/:id/policies`, 018 `/tenants/:id/users`; Flow Layer: UIF-L02 |
| Scope Label | CONDITIONAL_SUPPORT |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Tenant isolation, role assignment, audit |
| UI / Flow Objective | Route/Pageflow `007→013→014→015→016→017→018` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | AdminTenantSetupScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 007→013→014→015→016→017→018; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-002 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-003 — Client Context Setup: Profile, Family, Relationships, Entities, Wealth Map

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-003 |
| Task Title | Client Context Setup: Profile, Family, Relationships, Entities, Wealth Map — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-003; routes: 021 `/client/profile`, 022 `/client/family-members`, 023 `/relationships`, 024 `/entities`, 025 `/entities/new`, 026 `/entities/:id`, 031 `/wealth-map`, 032 `/actions`; Flow Layer: UIF-L03 |
| Scope Label | CONDITIONAL_SUPPORT |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Object scope, payload visibility, sensitivity |
| UI / Flow Objective | Route/Pageflow `021→022→023→024→025→026→031→032` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | ClientIntakeScreen, WealthActionsScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 021→022→023→024→025→026→031→032; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-003 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-004 — Document Upload and Intake

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-004 |
| Task Title | Document Upload and Intake — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-004; routes: 027 `/documents`, 028 `/documents/upload`, 027 `/documents`; Flow Layer: UIF-L04 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Upload validation, audit, upload-not-sufficiency |
| UI / Flow Objective | Route/Pageflow `027→028→027` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | ClientIntakeScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 027→028→027; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId, documentId, file metadata, evidenceRecordId, evidenceStatus |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-004 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-005 — Evidence Review, Linkage and Sufficiency

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-005 |
| Task Title | Evidence Review, Linkage and Sufficiency — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-005; routes: 029 `/documents/extraction-review`, 030 `/documents/verification-pending`, 046 `/evidence`, 047 `/evidence/:id`, 041 `/compliance/:id/block`, 038 `/compliance`; Flow Layer: UIF-L04 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Evidence sufficiency, release/export blocking |
| UI / Flow Objective | Route/Pageflow `029→030→046→047→041/038` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | ClientIntakeScreen, DecisionsGovernanceScreen, InternalWorkflowScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 029→030→046→047→041/038; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId, documentId, file metadata, evidenceRecordId, evidenceStatus |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-005 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-006 — Signal / Trigger Intake

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-006 |
| Task Title | Signal / Trigger Intake — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-006; routes: 033 `/signals`, 034 `/workbench`, 035 `/workbench/triggers/:id`; Flow Layer: UIF-L05 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: No direct advice, internal trigger only |
| UI / Flow Objective | Route/Pageflow `033→034→035` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | InternalWorkflowScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 033→034→035; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId, triggerId, recommendationId, approvalId, complianceReviewId, decisionId, visibilityStatus |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-006 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-007 — Internal AI / Rules Draft Creation

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-007 |
| Task Title | Internal AI / Rules Draft Creation — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-007; routes: 034 `/workbench`, 035 `/workbench/triggers/:id`; Flow Layer: UIF-L05 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: AI Draft internal-only, no client-visible AI |
| UI / Flow Objective | Route/Pageflow `034→035` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | InternalWorkflowScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 034→035; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId, triggerId, recommendationId, approvalId, complianceReviewId, decisionId, visibilityStatus |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-007 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-008 — Analyst Review and Unsupported Claim Rejection

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-008 |
| Task Title | Analyst Review and Unsupported Claim Rejection — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-008; routes: 034 `/workbench`, 035 `/workbench/triggers/:id`, 036 `/advisor-approval`; Flow Layer: UIF-L05 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Unsupported claim rejection, evidence, audit |
| UI / Flow Objective | Route/Pageflow `034→035→036` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | InternalWorkflowScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 034→035→036; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId, triggerId, recommendationId, approvalId, complianceReviewId, decisionId, visibilityStatus |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-008 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-009 — Advisor Approval

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-009 |
| Task Title | Advisor Approval — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-009; routes: 036 `/advisor-approval`, 037 `/advisor-approval/:id`, 038 `/compliance`; Flow Layer: UIF-L06 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Advisor approval not release |
| UI / Flow Objective | Route/Pageflow `036→037→038` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | InternalWorkflowScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 036→037→038; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId, triggerId, recommendationId, approvalId, complianceReviewId, decisionId, visibilityStatus |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-009 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-010 — Compliance Block / Request Evidence / Release

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-010 |
| Task Title | Compliance Block / Request Evidence / Release — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-010; routes: 038 `/compliance`, 039 `/compliance/:id/review`, 040 `/compliance/:id/release`, 041 `/compliance/:id/block`, 042 `/compliance/:id/audit`; Flow Layer: UIF-L06 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Compliance release, evidence, audit fail-closed |
| UI / Flow Objective | Route/Pageflow `038→039→040 / 041→042` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | DecisionsGovernanceScreen, InternalWorkflowScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 038→039→040 / 041→042; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId, triggerId, recommendationId, approvalId, complianceReviewId, decisionId, visibilityStatus |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-010 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-011 — Client Visibility and Digital Decision Room

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-011 |
| Task Title | Client Visibility and Digital Decision Room — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-011; routes: 019 `/portal`, 020 `/mobile`, 043 `/decisions`, 044 `/decisions/:id`, 045 `/decisions/:id/success`, 046 `/evidence`, 047 `/evidence/:id`; Flow Layer: UIF-L07 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Fail-closed projection, redaction, no leakage |
| UI / Flow Objective | Route/Pageflow `019/020→043→044→045→046→047` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | ClientIntakeScreen, DecisionsGovernanceScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 019/020→043→044→045→046→047; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId, triggerId, recommendationId, approvalId, complianceReviewId, decisionId, visibilityStatus |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-011 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-012 — Governance: Role, Access Request, Second Confirmation

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-012 |
| Task Title | Governance: Role, Access Request, Second Confirmation — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-012; routes: 009 `/admin/roles`, 010 `/admin/security`, 048 `/governance/users`, 049 `/governance/roles`, 050 `/governance/access-requests`, 051 `/governance/audit-history`; Flow Layer: UIF-L08 |
| Scope Label | CONDITIONAL_SUPPORT |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Route/action/payload separation, second confirmation |
| UI / Flow Objective | Route/Pageflow `009→010→048→049→050→051` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | AdminTenantSetupScreen, CommunicationExportOpsScreen, DecisionsGovernanceScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 009→010→048→049→050→051; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-012 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-013 — Cross-Tenant / Wrong-Object Denial

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-013 |
| Task Title | Cross-Tenant / Wrong-Object Denial — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-013; routes: any scoped route → denied/hidden state; Flow Layer: UIF-L08 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Tenant isolation, no payload leak, audit |
| UI / Flow Objective | Route/Pageflow `any scoped route → denied/hidden state` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | TARGET_FILE_TO_VERIFY; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | any scoped route → denied/hidden state; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | Only scoped and safe content according to actor/context |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-013 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-014 — Admin Non-Bypass

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-014 |
| Task Title | Admin Non-Bypass — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-014; routes: 009 `/admin/roles`, 010 `/admin/security`, 048 `/governance/users`, 049 `/governance/roles`, 050 `/governance/access-requests`; Flow Layer: UIF-L08 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Admin cannot bypass release/evidence/export/visibility |
| UI / Flow Objective | Route/Pageflow `009/010/048/049/050 → attempted release/export/evidence bypass → denied` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | AdminTenantSetupScreen, DecisionsGovernanceScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 009/010/048/049/050 → attempted release/export/evidence bypass → denied; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-014 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-015 — Export Scope, Redaction, Preview, Approval, Download / Share

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-015 |
| Task Title | Export Scope, Redaction, Preview, Approval, Download / Share — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-015; routes: 054 `/export/new`, 055 `/export/:id/scope`, 056 `/export/:id/redaction`, 057 `/export/:id/preview`, 058 `/export/:id/download`; Flow Layer: UIF-L09 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Preview not approval, redaction, forbidden payload |
| UI / Flow Objective | Route/Pageflow `054→055→056→057→058` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | CommunicationExportOpsScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 054→055→056→057→058; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | Payload über Visibility Engine: client-safe released only; interne Notizen, AI Draft, Compliance Notes hidden/redacted |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId, exportRequestId, selectedObjectIds, redactionProfile, approvalStatus |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-015 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-016 — Review Rhythm / Monitoring / Rebalance Review without Automatic Advice

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-016 |
| Task Title | Review Rhythm / Monitoring / Rebalance Review without Automatic Advice — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-016; routes: 068 `/reviews/calendar`, 069 `/monitoring/rebalance`, 033 `/signals`; Flow Layer: UIF-L10 |
| Scope Label | P1_DEFERRED_GUARD_ONLY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: No automatic advice, no client release |
| UI / Flow Objective | Route/Pageflow `068→069→033 internal trigger only` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | InternalWorkflowScreen, ReviewMonitoringScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | Guard-only UI states, internal-only labels, disabled release/advice actions, no-auto-advice assertions. |
| Forbidden Changes | Keine vollständige P1-Feature-Implementierung; kein Client Advice; kein Compliance/Release-Bypass. |
| Pageflow Steps | 068→069→033 internal trigger only; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | nur P1-Guard/Internal-only; kein client-visible Advice oder Release |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | P1 route renders safely and, if action exists, creates internal-only/queued state. |
| Negative Tests | No client advice, release, export or gate bypass from P1 UI. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-016 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-017 — Communication / Client Request / Call Trigger

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-017 |
| Task Title | Communication / Client Request / Call Trigger — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-017; routes: 052 `/communication`, 053 `/communication/call-trigger`, 034 `/workbench`; Flow Layer: UIF-L10 |
| Scope Label | P1_DEFERRED_GUARD_ONLY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Client request does not bypass advice/compliance gates |
| UI / Flow Objective | Route/Pageflow `052→053→034 internal workflow` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | CommunicationExportOpsScreen, InternalWorkflowScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | Guard-only UI states, internal-only labels, disabled release/advice actions, no-auto-advice assertions. |
| Forbidden Changes | Keine vollständige P1-Feature-Implementierung; kein Client Advice; kein Compliance/Release-Bypass. |
| Pageflow Steps | 052→053→034 internal workflow; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | nur P1-Guard/Internal-only; kein client-visible Advice oder Release |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | P1 route renders safely and, if action exists, creates internal-only/queued state. |
| Negative Tests | No client advice, release, export or gate bypass from P1 UI. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-017 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-018 — Operations Queues / SLA / Data Quality Remediation

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-018 |
| Task Title | Operations Queues / SLA / Data Quality Remediation — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-018; routes: 059 `/ops/queues`, 060 `/ops/sla`; Flow Layer: UIF-L10 |
| Scope Label | P1_DEFERRED_GUARD_ONLY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Data quality may block release; ops cannot bypass gates |
| UI / Flow Objective | Route/Pageflow `059→060→blocked/remediated state` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | CommunicationExportOpsScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | Guard-only UI states, internal-only labels, disabled release/advice actions, no-auto-advice assertions. |
| Forbidden Changes | Keine vollständige P1-Feature-Implementierung; kein Client Advice; kein Compliance/Release-Bypass. |
| Pageflow Steps | 059→060→blocked/remediated state; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | nur P1-Guard/Internal-only; kein client-visible Advice oder Release |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | P1 route renders safely and, if action exists, creates internal-only/queued state. |
| Negative Tests | No client advice, release, export or gate bypass from P1 UI. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-018 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-019 — External Advisor / Guest Scoped Access

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-019 |
| Task Title | External Advisor / Guest Scoped Access — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-019; routes: 003 `/onboarding/invite`, 018 `/tenants/:id/users`, 027 `/documents`, 028 `/documents/upload`; Flow Layer: UIF-L08 |
| Scope Label | CONDITIONAL_SUPPORT |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Object-scoped guest access, no tenant-wide visibility |
| UI / Flow Objective | Route/Pageflow `003→018→027/028 object-scoped only` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | AdminTenantSetupScreen, AuthOnboardingScreen, ClientIntakeScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 003→018→027/028 object-scoped only; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | route shell sichtbar nur für scoped actor; action buttons abhängig von PermissionDecision; sensible Payload hidden/redacted |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-019 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-020 — KYC / AML / Source-of-Wealth Review

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-020 |
| Task Title | KYC / AML / Source-of-Wealth Review — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-020; routes: 064 `/kyc/:id/review`, 065 `/kyc/:id/source-of-wealth`; Flow Layer: UIF-L11 |
| Scope Label | HOLD_BLOCKED_DO_NOT_EXECUTE_UNTIL_UNLOCKED |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Held route/policy; compliance-sensitive |
| UI / Flow Objective | Route/Pageflow `064→065 held-state only` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | KycAmlWorkflowScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | Held/blocked-state rendering, route guard copy, hidden/disabled productive actions, tests proving no MVP activation. |
| Forbidden Changes | Keine produktiven KYC/Suitability/Committee Actions; keine Release/Client Visibility/Export-Bypass; keine Route-Reklassifikation. |
| Pageflow Steps | 064→065 held-state only; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | nur Hold-/Blocked-/Internal-only-Hinweis; keine produktive Payload, kein Client Release |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Held-state visible with clear reason and no crash. |
| Negative Tests | No approve/release/vote/client-visible action; no hidden MVP flow activation. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-020 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-021 — Suitability / IPS / Mandate

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-021 |
| Task Title | Suitability / IPS / Mandate — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-021; routes: 066 `/suitability/:tenantId/profile`, 067 `/ips/:tenantId`; Flow Layer: UIF-L11 |
| Scope Label | HOLD_BLOCKED_DO_NOT_EXECUTE_UNTIL_UNLOCKED |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Advice-sensitive; policy/scope unlock required |
| UI / Flow Objective | Route/Pageflow `066→067 held-state only` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | SuitabilityIpsScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | Held/blocked-state rendering, route guard copy, hidden/disabled productive actions, tests proving no MVP activation. |
| Forbidden Changes | Keine produktiven KYC/Suitability/Committee Actions; keine Release/Client Visibility/Export-Bypass; keine Route-Reklassifikation. |
| Pageflow Steps | 066→067 held-state only; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | nur Hold-/Blocked-/Internal-only-Hinweis; keine produktive Payload, kein Client Release |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Held-state visible with clear reason and no crash. |
| Negative Tests | No approve/release/vote/client-visible action; no hidden MVP flow activation. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-021 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-022 — Committee Review and Dissent

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-022 |
| Task Title | Committee Review and Dissent — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-022; routes: 070 `/committee/reviews`, 071 `/committee/reviews/:id`; Flow Layer: UIF-L11 |
| Scope Label | HOLD_BLOCKED_DO_NOT_EXECUTE_UNTIL_UNLOCKED |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Committee routes held; no silent release bypass |
| UI / Flow Objective | Route/Pageflow `070→071 held-state only` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | CommitteeReviewScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | Held/blocked-state rendering, route guard copy, hidden/disabled productive actions, tests proving no MVP activation. |
| Forbidden Changes | Keine produktiven KYC/Suitability/Committee Actions; keine Release/Client Visibility/Export-Bypass; keine Route-Reklassifikation. |
| Pageflow Steps | 070→071 held-state only; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | nur Hold-/Blocked-/Internal-only-Hinweis; keine produktive Payload, kein Client Release |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Held-state visible with clear reason and no crash. |
| Negative Tests | No approve/release/vote/client-visible action; no hidden MVP flow activation. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-022 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-023 — Audit Failure / Safety Action Held

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-023 |
| Task Title | Audit Failure / Safety Action Held — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-023; routes: critical action → audit unavailable → held/denied state; Flow Layer: UIF-L13 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Audit write failure holds/denies critical action |
| UI / Flow Objective | Route/Pageflow `critical action → audit unavailable → held/denied state` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | TARGET_FILE_TO_VERIFY; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | critical action → audit unavailable → held/denied state; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | Only scoped and safe content according to actor/context |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-023 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-024 — Offboarding: Access Revocation, Final Export, Retention, Archive

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-024 |
| Task Title | Offboarding: Access Revocation, Final Export, Retention, Archive — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-024; routes: offboarding spec flow: revoke→final export→retention/archive; Flow Layer: UIF-L12 |
| Scope Label | P1_DEFERRED_GUARD_ONLY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Access revocation, retention, final export, legal hold |
| UI / Flow Objective | Route/Pageflow `offboarding spec flow: revoke→final export→retention/archive` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | TARGET_FILE_TO_VERIFY for offboarding UI/control track, CommunicationExportOpsScreen if final export scoped, AdminTenantSetupScreen / governance UI if access revocation scoped; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | Guard-only UI states, internal-only labels, disabled release/advice actions, no-auto-advice assertions. |
| Forbidden Changes | Keine vollständige P1-Feature-Implementierung; kein Client Advice; kein Compliance/Release-Bypass. |
| Pageflow Steps | offboarding spec flow: revoke→final export→retention/archive; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | Only scoped and safe content according to actor/context |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId, offboardingReason, effectiveDate, userIds, retentionPolicy, legalHoldFlag, finalExportScope |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | P1 route renders safely and, if action exists, creates internal-only/queued state. |
| Negative Tests | No client advice, release, export or gate bypass from P1 UI. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-024 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |


### UIF-CJ-025 — Upload / Error / Retry / Permission Denied Exception Journey

| Field | Required Content |
| --- | --- |
| Task ID | UIF-CJ-025 |
| Task Title | Upload / Error / Retry / Permission Denied Exception Journey — UI Clickflow/Pageflow/State/Visibility Proof Task |
| Journey / Route Coverage | CJ-025; routes: 028 `/documents/upload`; Flow Layer: UIF-L13 |
| Scope Label | IMPLEMENTATION_READY |
| Product Intent | Diese Journey muss als UI-Prozess beweisbar sein, ohne Control-Layer- oder Safety-Regeln zu überclaimen. Safety/Compliance: Invalid file/API error/denied state, no false progress |
| UI / Flow Objective | Route/Pageflow `028 invalid/denied/error → retry/no sufficiency` so härten, dass sichtbare Inhalte, Interaktionen und States exakt dem Actor-, Scope-, Permission-, Visibility- und Gate-Ergebnis entsprechen. |
| Required Control-Layer Dependencies | WCL-01 ActorContext, WCL-02 Tenant/Object Scope, WCL-03 PermissionDecision, WCL-04 PayloadVisibility, WCL-08 Audit/Failsafe; plus journey-specific WCLs from E2E task pack |
| Target Files / Areas | ClientIntakeScreen; supporting services: permission-engine, visibility-engine, workflow-gate, audit/evidence/export services where relevant; TARGET_FILE_TO_VERIFY before editing |
| Allowed Changes | State mapping, visibility/redaction guard wiring, button disabled/denied handling, modal/drawer lifecycle hardening, tests. |
| Forbidden Changes | Keine neuen Routen, keine neuen Screens, keine Prisma-Migration, keine API-Erfindung, keine AI Advice Automation, keine safety gate bypasses. |
| Pageflow Steps | 028 invalid/denied/error → retry/no sufficiency; each step must define actor, state, visible payload, disabled/denied actions and next action. |
| Visible Content Rules | sichtbar nur nach RBAC + PayloadVisibility; fail-closed hidden/denied bei Unsicherheit |
| Hidden / Redacted / Forbidden Content Rules | AI Draft, internal rationale, analyst/advisor/compliance notes, unreleased recommendations, wrong-tenant data and any unapproved export content are hidden/redacted unless explicitly released and safe. |
| Interaction Requirements | Click/submit/modal/drawer/upload/retry/approve/reject/block/release/export actions must have precondition, validation, loading, success, failure and denied states. |
| State Requirements | loading, error, empty, permission denied, disabled/gated action, hidden/redacted, blocked, validation failed, audit unavailable, success; plus route-specific states from matrix. |
| Data Inputs | actorUserId, clientTenantId, roleId, objectType, objectId, auditCorrelationId, documentId, file metadata, evidenceRecordId, evidenceStatus |
| Expected Outputs / Results | UI state, visible/hidden/redacted payload projection, action result, audit event or held/denied state, next action guidance |
| API / Service Impact | Use existing `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring` and existing services where relevant; new API => `API_DECISION_REQUIRED`, not default task. |
| Schema Impact | Use existing Prisma baseline only through services; no schema replacement or migration authorized. |
| Audit Requirements | Critical actions require AuditEvent or fail-closed/held state; audit display alone is not persistence proof. |
| Positive Tests | Happy-path state/interaktion works for scoped actor and required visible content appears. |
| Negative Tests | Forbidden content hidden/redacted; forbidden action disabled/denied/blocked; no overclaiming feedback. |
| Validation Commands | Verify package scripts first; candidate commands: `pnpm lint`, `pnpm test`, `pnpm exec playwright test`, `pnpm prisma validate`. |
| Acceptance Criteria | CJ-025 has route/pageflow coverage, correct visible/hidden rules, required interactions/states, and positive/negative UI tests or guarded/deferred status. |
| Stop Rules | Stop if target route/component is missing, if required control-layer result is unavailable, if a task would require new route/API/schema/migration/screen generation, or if scope label would be elevated. |
| Reporting Requirement | Report changed files, route/journey coverage, visibility proof, interaction proof, tests run/not run, skipped/blocked tasks and deferred/hold integrity. |

## 9. Cross-Cutting Shared UI Guard Tasks

| Shared Task ID | Guard / Helper | Covered Journeys / Routes | Purpose | Target Files | Required Tests | Dependency |
| --- | --- | --- | --- | --- | --- | --- |
| UIF-SHARED-001 | UI Visibility Guard / Redaction Mapper | CJ-003, CJ-011, CJ-013, CJ-015, CJ-019 | Central mapper for visible/hidden/redacted/denied payload states by actor, route and object scope | lib/visibility-engine.ts; components/ui/state-panel.tsx; TARGET_FILE_TO_VERIFY for UI helper | payload redaction and hidden-state tests | WCL-04 |
| UIF-SHARED-002 | Role-aware Action Button Guard | all MVP/MVP_SUPPORT flows | Disable/hide/deny actions independent of route visibility | lib/permission-engine.ts; components/ui/*; page components | route visible/action denied tests | WCL-03 |
| UIF-SHARED-003 | Route/Page State Mapper | all flow layers | Map route scope + control-layer result to loading/empty/denied/blocked/hidden/success/error states | components/ui/state-panel.tsx; components/page-header.tsx; page components | state rendering tests | WCL-12 |
| UIF-SHARED-004 | Client Fail-Closed Projection Component Pattern | CJ-011, CJ-015, CJ-019 | Reusable pattern for client-safe projection only | components/client-intake-screen.tsx; decisions-governance-screen.tsx | client hidden/redacted tests | WCL-04, WCL-07 |
| UIF-SHARED-005 | Evidence Sufficiency UI Badge/State Guard | CJ-004, CJ-005, CJ-010, CJ-015 | Evidence status display distinguishes upload/review/link/sufficient/insufficient | components/ui/evidence-list.tsx; evidence-service.ts | upload not sufficiency tests | WCL-06 |
| UIF-SHARED-006 | Advisor-not-release UI State Guard | CJ-009, CJ-010, CJ-011 | Advisor-approved state must render compliance pending/client hidden | internal-workflow-screen.tsx; workflow-gate.ts | advisor approved but client hidden tests | WCL-07 |
| UIF-SHARED-007 | Compliance Release UI Gate Guard | CJ-010, CJ-011 | Release buttons/states depend on advisor, evidence, audit and permission preconditions | internal-workflow-screen.tsx; decisions-governance-screen.tsx | release blocked missing precondition tests | WCL-06, WCL-07, WCL-08 |
| UIF-SHARED-008 | Audit-unavailable Action-Hold UI Guard | CJ-010, CJ-014, CJ-015, CJ-023 | Critical actions hold/deny if audit cannot persist | audit-service.ts; page components; state-panel.tsx | audit failure holds/denies tests | WCL-08 |
| UIF-SHARED-009 | Export Preview/Approval/Download Separation Guard | CJ-015 | Separate preview, approval and download/share UI states/buttons | communication-export-ops-screen.tsx; export-service.ts | preview not approval tests | WCL-09 |
| UIF-SHARED-010 | Upload Success Is Upload-Only Feedback Guard | CJ-004, CJ-025 | Upload success message explicitly avoids evidence sufficiency/release claims | client-intake-screen.tsx; document-upload-service.ts | success copy + no sufficiency tests | WCL-05, WCL-06 |
| UIF-SHARED-011 | Held Route Blocked-State Guard | CJ-020, CJ-021, CJ-022 | Held routes show blocked/held state without productive mutation | kyc/suitability/committee screens | held route no-elevation tests | WCL-03, WCL-04 |
| UIF-SHARED-012 | P1 Route No-Auto-Advice Guard | CJ-016, CJ-017, CJ-018 | P1 routes may create internal guards only, no client advice/release | review-monitoring-screen.tsx; communication-export-ops-screen.tsx | no automatic advice tests | WCL-10 |
| UIF-SHARED-013 | Drawer/Modal Focus/Close/Submit Lifecycle Guard | modal/drawer flows | Enforce lifecycle: open/close/cancel/submit/escape/focus/no silent submit | components/ui/modal.tsx; components/ui/drawer.tsx | focus/escape/cancel/validation tests | WCL-12 |
| UIF-SHARED-014 | Negative Payload Visibility Test Helper | all safety flows | Shared assertions for absent forbidden text/fields in DOM and API response | tests/helpers/TARGET_FILE_TO_VERIFY | negative payload tests | P0 harness |
| UIF-SHARED-015 | Journey Pageflow Test Harness / Tagging Convention | CJ-001..CJ-025 | Tag route steps and assertions for E2E journey proof | tests/journey-pageflows.spec.ts or TARGET_FILE_TO_VERIFY | 25/25 coverage tests | all WCL layers |

## 10. API / Service UI Integration Matrix

| API Route | Related UI Flows | Request Validation Needed | Permission Check Needed | Payload Redaction Needed | UI State on Success | UI State on Failure | Audit Requirement | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| deleted generic workflow route | CJ-006, CJ-007, CJ-008, CJ-009, CJ-010, CJ-012, CJ-014, CJ-016, CJ-017, CJ-018, CJ-023 | action name, actor context, target ids, workflow preconditions | RBAC/action/object scope per action | no internal/client forbidden payload; noClientRelease honoured | success state must be named action only; no downstream gate overclaim | fail closed with denied/blocked/error; no state advance | critical mutations audited or held | typed workflow UI action and negative no-client-release tests |
| /api/documents | CJ-004, CJ-005, CJ-011, CJ-019, CJ-025 | tenant/object/document query scope | document list scoped by actor/object | document metadata redacted by role; no wrong-tenant rows | document list/empty/review-pending states | denied/empty/hidden on permission or scope failure | denied access audited if mutation/forbidden attempt | document list redaction and wrong-tenant tests |
| /api/documents/upload | CJ-004, CJ-025, CJ-019 | multipart file, type, size, actor, tenant/object context | upload permission, object scope, allowed file types | response shows upload-only result; no sufficiency/release flags | upload success upload-only + evidence pending | invalid type/size/role/api error => retry/reselect and no sufficiency | upload/denied audit required | upload positive + invalid/denied/no-sufficiency UI tests |
| /api/review-monitoring | CJ-016, CJ-018 | review schedule filters, actor/context | internal role/object scope | internal-only monitoring payload; no client advice | due/overdue/internal trigger state | no automatic advice/release; denied if not scoped | internal trigger audit if mutation occurs | no-auto-advice monitoring tests |

## 11. P0 UI / Pageflow Test Matrix

| P0 UI Test ID | Related Journey / Route | Positive Case | Negative Case | Required UI Assertion | Required Payload Assertion | Existing Proof Slice | Missing Test | Required Test File / Candidate | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0-UI-001 | CJ-001 / routes 001-006 | mapped invited user completes onboarding shell and consent | unknown user sees denied/no anonymous payload expansion | No tenant/client payload before mapping; disabled actions until role confirmed | No user/tenant payload in API/UI for unknown actor | route smoke / auth screens | missing unknown user negative | tests/ui-access-pageflow.spec.ts | P0 |
| P0-UI-002 | CJ-013 / scoped routes | correct actor sees own scoped object | wrong tenant/object denied, no payload leak | Denied or hidden state visible; no sensitive rows/cards | API/DOM contains no wrong-tenant identifiers | permission-engine partial | missing route+payload E2E | tests/ui-scope-visibility.spec.ts | P0 |
| P0-UI-003 | CJ-012 / governance | route visible for governance admin with scoped actions | route visible but action button disabled/denied without action permission | Button disabled/hidden/denied feedback | no mutation and no payload expansion | permission-engine partial | missing UI assertions | tests/ui-governance-actions.spec.ts | P0 |
| P0-UI-004 | CJ-011 / client | client sees released summary | route visible but sensitive payload hidden/redacted | Client-safe content only | AI Draft/internal/compliance fields absent | visibility engine exists | missing client DOM/API redaction assertions | tests/ui-client-visibility.spec.ts | P0 |
| P0-UI-005 | CJ-007 / 011 / 015 | AI draft visible only internally to assigned actor | client-visible AI Draft denied | Portal/export/decision room hide AI Draft | AI Draft absent from client/export payload | typed-workflow partial noClientRelease | missing full UI payload proof | tests/ui-ai-draft-boundary.spec.ts | P0 |
| P0-UI-006 | CJ-006..011 | approved/released client-safe path works after all gates | unapproved advice not shown in portal/mobile/export | Portal hidden/release-pending until compliance release | unreleased recommendation absent | workflow gate partial | missing E2E pageflow | tests/ui-no-unapproved-advice.spec.ts | P0 |
| P0-UI-007 | CJ-008 | unsupported draft rejected and cannot advance | unsupported internal draft cannot advance visually without review | Reject/rebuild state; advisor CTA disabled | no advisor-ready status | workflow gate partial | missing unsupported draft UI test | tests/ui-analyst-review.spec.ts | P0 |
| P0-UI-008 | CJ-009 | advisor approves recommendation and compliance queue receives it | advisor-approved state shows compliance pending and client visibility hidden | Compliance pending / client hidden status visible | client portal has no released payload | workflow gate partial | missing client hidden assertion | tests/ui-advisor-not-release.spec.ts | P0 |
| P0-UI-009 | CJ-010 | compliance release succeeds with evidence+audit | compliance release blocked when evidence/audit missing | Blocked/needs evidence/audit unavailable state | no release status/visibility mutation | document/upload tests partial | missing audit failure E2E | tests/ui-compliance-release.spec.ts | P0 |
| P0-UI-010 | CJ-004/CJ-025 | valid upload succeeds and document appears | upload success message does not say evidence sufficient | Success copy says upload only; evidence pending | no sufficiency/release flags | document-upload-flow exists | missing copy/no-sufficiency assertion | tests/ui-upload-feedback.spec.ts | P0 |
| P0-UI-011 | CJ-005/CJ-010/CJ-015 | evidence sufficient unlocks scoped gate | evidence insufficiency blocks release/export UI actions | Release/export buttons disabled/blocked | no release/export status | file-export and upload tests partial | missing insufficiency UI test | tests/ui-evidence-sufficiency.spec.ts | P0 |
| P0-UI-012 | CJ-014 | admin can manage governance within scope | admin bypass attempt shows denied/blocked/audited state | Denied/blocked message; no mutation | no release/export/visibility change | permission-engine partial | missing admin UI bypass test | tests/ui-admin-non-bypass.spec.ts | P0 |
| P0-UI-013 | CJ-023 | critical action succeeds when audit persists | audit write failure holds/denies safety action in UI | Audit unavailable/held state shown | no completed state/status | none full | missing audit failure seam/test | tests/ui-audit-fail-closed.spec.ts | P0 |
| P0-UI-014 | CJ-015 | preview generated after scope/redaction | export preview does not show download/share as available | Download/share disabled until approval | no package delivery state | file-export partial | missing UI separation test | tests/ui-export-redaction.spec.ts | P0 |
| P0-UI-015 | CJ-015 | export approval state shown after approval | export approval is not download/share | Approved but not delivered state distinct | no download/share audit until action | file-export partial | missing state separation | tests/ui-export-state-separation.spec.ts | P0 |
| P0-UI-016 | CJ-015 | approved export package contains client-safe content | export package excludes forbidden internal payload | Forbidden fields absent in preview/package | no AI Draft/internal/compliance notes | file-export partial | missing forbidden payload assertions | tests/ui-export-forbidden-payload.spec.ts | P0 |
| P0-UI-017 | CJ-016 | monitoring due row creates internal review trigger | review/rebalance monitoring shows internal-only trigger, no client advice | Internal-only state visible | no client portal release/advice | review-monitoring test partial | missing route/client assertion | tests/ui-monitoring-no-auto-advice.spec.ts | P1 guard / P0 if included |
| P0-UI-018 | CJ-017 | client request routes internally | P1 communication cannot bypass advice/compliance gates | Internal route/queued state | no direct advice/release | none | missing P1 guard test | tests/ui-communication-guard.spec.ts | P1 guard |
| P0-UI-019 | CJ-019 | guest sees one scoped object/document | external advisor sees only object-scoped data | Only invited object visible | no tenant-wide docs/entities | permission-engine partial | missing guest fixture/test | tests/ui-external-advisor-scope.spec.ts | conditional |
| P0-UI-020 | CJ-020..022 | held route renders held/blocked state | held KYC/Suitability/Committee routes do not silently become MVP flow | Hold message; productive actions absent | no release/approve/client visibility mutation | committee route test partial | missing held route action assertions | tests/ui-held-route-guards.spec.ts | hold guard |
| P0-UI-021 | CJ-024 | offboarding revoked user hidden/denied after revocation state | offboarding revoked user cannot see residual payload | Revoked state/denied route | no stale client/export/document payload | none | missing spec/P1 control test | tests/ui-offboarding-guards.spec.ts | SPEC/P1 |
| P0-UI-022 | CJ-025 | invalid upload can retry/reselect | invalid upload type/size/API error preserves retry and no sufficiency | Retry/reselect visible; no success gate | no document/evidence sufficiency/status created | document-upload-api rejects type | missing UI invalid file test | tests/ui-upload-error-retry.spec.ts | P0 |

## 12. Canonical Pageflow Proof Matrix

| Path ID | Name | Related Journeys | Pageflow Sequence | Required UI Tasks | Visible / Hidden Rules | Positive Proof | Negative Proof | Scope / Blocker |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CP-001 | Happy Path: Client onboarding to first client-safe decision | CJ-001,CJ-002,CJ-004,CJ-005,CJ-006,CJ-007,CJ-008,CJ-009,CJ-010,CJ-011 | 001→006→014/018→028→029/046→034/035→036/037→038/040→019/044 | UIF-CJ-001,002,004,005,006,007,008,009,010,011 | client sees only released summary; internal draft hidden | end-to-end released client-safe decision after all gates | unreleased state hidden before release | MVP |
| CP-002 | Evidence Missing Path | CJ-005,CJ-010,CJ-004,CJ-025 | 039/041→028→029/030→046/047→040 | UIF-CJ-005,010,004,025 | needs evidence visible internally/client-safe request only | block→request→upload-only→review→release | upload-only cannot unlock release | MVP |
| CP-003 | AI Draft Rejection Path | CJ-006,CJ-007,CJ-008,CJ-009 | 033→034→035→036 | UIF-CJ-006,007,008,009 | AI draft internal only | unsupported draft rejected/rebuilt with evidence | unsupported draft cannot advance to advisor/client | MVP |
| CP-004 | Advisor Approval Not Release Path | CJ-009,CJ-011 | 036/037→019/020 | UIF-CJ-009,011 | advisor-approved status internal; client hidden | advisor approval recorded/compliance pending | portal/mobile no released decision | MVP |
| CP-005 | Admin Non-Bypass Path | CJ-012,CJ-014,CJ-023 | 009/010/048/050→attempt release/export/evidence override | UIF-CJ-012,014,023 | governance metadata only; no advice payload expansion | admin denied/blocked/audited | no release/export/visibility mutation | MVP |
| CP-006 | Cross-Tenant Denial Path | CJ-013 | wrong-tenant request on any scoped route/API | UIF-CJ-013 | denied/hidden only | no payload leak and audit written | DOM/API no wrong-tenant fields | MVP |
| CP-007 | Export Redaction Path | CJ-015 | 054→055→056→057→058 | UIF-CJ-015 | only scoped redacted content; forbidden payload absent | redacted approved export downloadable/shareable | preview not approval; approval not download/share | MVP |
| CP-008 | Review Monitoring Path | CJ-016 | 068→069→033 internal trigger | UIF-CJ-016 | internal-only trigger status | review due creates internal review trigger | no client advice/release | P1 guard |
| CP-009 | External Advisor Scoped Access Path | CJ-019 | 003/018→027 or scoped object route | UIF-CJ-019 | single scoped object only | guest sees invited object/document | no tenant-wide payload | conditional |
| CP-010 | Offboarding Path | CJ-024 | revoke→final export→retention/legal hold→archive | UIF-CJ-024 | client-safe offboarding confirmation; internal closure note hidden | revoked access and retention/archive applied | revoked user sees no residual payload | SPEC/P1 |
| CP-011 | Audit Failure Path | CJ-023 | critical action→audit unavailable→held/denied | UIF-CJ-023 | audit unavailable state | action held/denied | no silent progress | MVP |
| CP-012 | Upload Failure Path | CJ-025 | 028 invalid file/API error→retry/reselect | UIF-CJ-025 | upload error/retry only | retry works after invalid upload | no sufficiency/release/status false progress | MVP |

## 13. Implementation Sequence with Dependencies

| Phase | Name | Tasks | Must Complete Before | Validation | Stop Rule |
| --- | --- | --- | --- | --- | --- |
| Phase 0 | Repo/source and target-file verification | none / all | any edit | inspect package scripts, target components, route registry, current tests | Stop if target codebase is not full-workflow or expected files cannot be verified |
| Phase 1 | Shared UI Guards and state mapper | UIF-SHARED-001..004, 013..015 | journey-specific UI tasks | lint + unit/test helper smoke | Stop if visibility/action/state guard would require schema/API migration |
| Phase 2 | Access/Foundation pageflows | UIF-CJ-001, UIF-CJ-002, UIF-CJ-003 | document/evidence/workflow flows | onboarding/admin/context positive+negative tests | Stop if route access expands payload visibility |
| Phase 3 | Document upload/evidence UI | UIF-CJ-004, UIF-CJ-005, UIF-CJ-025, shared evidence/upload guards | compliance release UI | document upload flow + no-sufficiency tests | Stop if upload success implies evidence sufficiency |
| Phase 4 | Internal workflow and advice boundary UI | UIF-CJ-006, UIF-CJ-007, UIF-CJ-008 | advisor/compliance/client visibility UI | AI draft internal-only + unsupported draft rejection tests | Stop if AI draft appears in client/export payload |
| Phase 5 | Advisor and compliance UI | UIF-CJ-009, UIF-CJ-010 | client visibility/export UI | advisor-not-release + compliance precondition tests | Stop if advisor approval creates client visibility |
| Phase 6 | Client visibility and decision room UI | UIF-CJ-011 | export UI | client fail-closed and released-only tests | Stop if client-facing route returns internal/unreleased data |
| Phase 7 | Governance negative safety UI | UIF-CJ-012, UIF-CJ-013, UIF-CJ-014, UIF-CJ-023 | export/offboarding/P1 guards | admin non-bypass/cross-tenant/audit failure tests | Stop if admin/security route can bypass gates |
| Phase 8 | Export UI separation | UIF-CJ-015 | regression | preview-not-approval/export-forbidden-payload tests | Stop if preview enables download/share or forbidden payload leaks |
| Phase 9 | P1/HOLD/SPEC guards | UIF-CJ-016..024 guard tasks | final regression | no-auto-advice/held-route/offboarding-guard tests | Stop if P1/HOLD/SPEC becomes MVP implementation without unlock |
| Phase 10 | Full UI/pageflow regression and reporting | all UIF tasks | final report | pnpm lint/test/playwright/prisma validate where available | Stop and report any failed P0 negative case |

## 14. Blocked / Deferred / Do-Not-Create Register

| Item ID | Item | Why Blocked / Deferred | Source | Can Become Task When | Current Instruction |
| --- | --- | --- | --- | --- | --- |
| BLK-001 | KYC/AML / Source-of-Wealth Journey `CJ-020` | HOLD_PENDING_DECISION; routes 064–065 unresolved/held | Route scope / Journey proof packs | dedicated KYC/AML policy + route unlock + P0 safety scope exists | Render held/blocked-state only; no productive MVP flow |
| BLK-002 | Suitability / IPS / Mandate Journey `CJ-021` | HOLD_PENDING_DECISION; advice-sensitive routes 066–067 | Route scope / Safety contracts | suitability/IPS policy unlock + advice-boundary acceptance exists | Render held/blocked-state only |
| BLK-003 | Committee Review Journey `CJ-022` routes 070–071 | HOLD_PENDING_DECISION; committee governance scope unresolved | Route scope / Visual matrix | committee route/safety/visual unlock exists | Render held/blocked-state only; no voting/release mutation |
| BLK-004 | Full Communication Centre `CJ-017` | P1_AFTER_MVP; communication must not bypass advice/compliance | MVP scope lock | P1 scope/handoff exists | Guard-only/internal-routing tasks; no direct advice |
| BLK-005 | Full Review Monitoring expansion `CJ-016` | P1_AFTER_MVP; only no-auto-advice guard now | Route scope / P0 | P1 monitoring handoff exists | Internal-only guard and no-auto-advice tests only |
| BLK-006 | Full Operations/SLA `CJ-018` | P1/conditional; ops cannot bypass gates | MVP scope / Journey atlas | P1 ops scope exists | Guard/data-quality block UI only where MVP-relevant |
| BLK-007 | Full production Offboarding `CJ-024` | SPEC_REQUIRED / P1; retention/legal/production scope unresolved | Journey atlas offboarding deep dive | offboarding policy + API/schema/task unlock exists | Control-track guards, revoked-access test candidates only |
| BLK-008 | Production banking/custody integrations | NON_GOAL for MVP | MVP scope lock | separate integration programme approved | Do not create |
| BLK-009 | Autonomous financial advice | NON_GOAL / safety violation | MVP scope / advice boundary | never in current MVP; only if governance fundamentally changes | Do not create |
| BLK-010 | Client-visible AI Draft | forbidden by advice boundary | RBAC/client visibility contract | never unless explicitly redefined by policy and tests | Do not create; negative tests required |
| BLK-011 | Manual client-visibility override | forbidden; visibility derived/fail-closed | MVP control rules | never unless new policy unlocks; would require P0 redesign | Do not create |
| BLK-012 | Admin bypass | forbidden; admin governance is not release authority | RBAC/Admin non-bypass | never | Do not create; negative tests required |
| BLK-013 | New screen generation | not authorized | Screen generation brief / final handoff | separate screen-generation brief unlocks it | Do not create |
| BLK-014 | New state-screen/image generation | not authorized | State screen spec / no-generation decision | separate visual generation authorization exists | Do not create |
| BLK-015 | Prisma migration / schema replacement | not authorized in UI task pack | Schema reconciliation | explicit schema handoff/migration approval exists | Do not create |
| BLK-016 | New API routes | not default solution | API contract matrix | API_DECISION_REQUIRED approved | Mark decision required, do not implement |
| BLK-017 | `main`-derived tasks | false-gap source only | false-gap cleanup | never as target truth | Do not create |

## 15. Validation Commands and Reporting Pflicht

Codex muss die tatsächlichen Scripts im `package.json` vor Ausführung prüfen. Kandidatenbefehle:

```bash
pnpm install
pnpm lint
pnpm test
pnpm exec playwright test
pnpm exec playwright test tests/document-upload-flow.spec.ts
pnpm exec playwright test tests/route-smoke.spec.ts
pnpm prisma validate
```

| Report Field | Required Content |
|---|---|
| Changed files | Alle geänderten Dateien |
| Implemented tasks | Task IDs |
| Journey UI coverage | CJ-001 bis CJ-025 Status |
| Route/Pageflow coverage | route IDs und Status |
| Visibility proof | Was sichtbar/hidden/redacted/denied getestet wurde |
| Interaction proof | Click/submit/upload/modal/drawer states |
| Skipped / blocked tasks | mit Grund |
| Tests run | Befehle + Ergebnis |
| Tests not run | Grund |
| P0 proof status | positiv/negativ |
| Safety proof | RBAC, Visibility, Evidence, Audit, Export, Compliance |
| Known gaps | präzise |
| Deferred/Hold integrity | Nachweis, dass P1/HOLD/SPEC nicht heimlich implementiert wurden |

## 16. Final QA / Proof Section

### 16.1 QA Matrix

| QA Check | PASS/FAIL | Evidence |
| --- | --- | --- |
| All 25 canonical journeys covered | PASS | Section 4 and 8 include CJ-001..CJ-025 |
| UI clickflow/pageflow architecture created | PASS | Section 3 defines UIF-L01..UIF-L13 |
| Route/component/state matrix present | PASS | Section 5 maps all 71 route IDs |
| Visibility/redaction matrix present | PASS | Section 6 actor/payload rules |
| Interaction matrix present | PASS | Section 7 includes required interactions |
| Control-layer dependency preserved | PASS | Task cards reference WCL dependencies and never bypass them |
| No isolated journey overbuild | PASS | Shared guards + flow layers are primary, journey tasks bind to them |
| MVP/P1/HOLD/SPEC labels preserved | PASS | Coverage, sequence and blocked register preserve labels |
| Safety / Compliance mapped per journey | PASS | Coverage, task cards, P0 tests and visibility matrix map safety gates |
| No screen/image/state generation | PASS | Forbidden in executive decision, task cards and blocked register |
| No Prisma migration authorized | PASS | Schema impact says existing baseline only; blocked register contains migration block |
| Existing APIs used before new APIs | PASS | API matrix lists four existing APIs; new APIs are API_DECISION_REQUIRED |
| `main` blocked as target truth | PASS | Source lock and blocked register prohibit main-derived tasks |
| Upload not treated as evidence sufficiency | PASS | UIF-003, CJ-004/CJ-025 tasks, P0-UI-010/022 |
| Advisor approval not treated as release | PASS | UIF-006, CJ-009, P0-UI-008 |
| Compliance release not treated as client acceptance | PASS | UIF-007 and compliance task wording |
| Export preview not treated as approval | PASS | UIF-008, CJ-015, P0-UI-014 |
| Route access not treated as payload visibility | PASS | UIF-001, Visibility matrix, P0-UI-002/004 |
| Admin non-bypass preserved | PASS | CJ-014 task, blocked register, P0-UI-012 |
| AI Draft internal-only preserved | PASS | CJ-007/CJ-011/CJ-015 rules and P0-UI-005 |
| P0 positive and negative UI tests specified | PASS | Section 11 includes 22 P0 UI tests |
| Offboarding covered as SPEC/P1 control track | PASS | CJ-024 and blocked register BLK-007 |
| Blocked/deferred register complete | PASS | Section 14 includes required blockers and do-not-create items |

### 16.2 ENGINE Execution Proof

| Phase | Engine Combination | What was done | Proof / Output |
| --- | --- | --- | --- |
| Charter | ENGINE_v3 | Zielartefakt, Nicht-Implementierungsgrenze, UI/Pageflow/State/Visibility/Interaction-Ziel und 25/25 Coverage gesperrt. | Sections 1, 4, 16 |
| Source Intake | ENGINE_v3 Evidence | Quellenhierarchie und spätere Korrekturen in Task-Konsequenzen überführt; main blockiert. | Section 2 |
| UI / UX Flow Reframing | ENGINE_v2 | 25 Journeys in 13 UI Flow Layer, Pageflows und Nutzerzustände übersetzt. | Sections 3 and 4 |
| Visibility and Interaction Decomposition | ENGINE_v2-B | Sichtbar/hidden/redacted/forbidden sowie Interaction Contracts und Codex Task Cards strukturiert. | Sections 5-9 |
| Safety / Compliance Adversarial | ENGINE_v3 Adversarial | Negative UI-/Payload-Tests gegen AI Draft Leakage, Admin Bypass, Export Leakage, Audit Failure und Scope Leakage definiert. | Sections 6, 7, 11, 14 |
| Sequence and Dependency Convergence | ENGINE_v3 Convergence | Sichere Umsetzungsreihenfolge mit Control-Layer vor UI Proof und P1/HOLD/SPEC Guards definiert. | Section 13 |
| QA / Proof | ENGINE_v3 Proof | QA-Matrix prüft Coverage, Stop Rules, No-Overclaim, Safety und Testpflichten. | Section 16 |
