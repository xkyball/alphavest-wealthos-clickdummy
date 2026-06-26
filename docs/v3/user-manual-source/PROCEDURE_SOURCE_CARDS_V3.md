# Procedure Source Cards V3

Generated: 2026-06-16T23:25:11.459Z

## MT-001 Configure the platform policy baseline

Audience: Platform Admin / Compliance / Security Officer

Business goal: Platform settings, advice-boundary rules, role templates, security defaults, evidence templates, and export defaults are visible and ready for tenant setup.

When to use: Use this task when the user needs to complete UF-01 / W-01 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Platform Admin / Compliance / Security Officer. Tenant context depends on the task; platform tasks use platform context.

UI start point: Platform Settings

Screenshots: SS-01-01, SS-01-02, SS-01-03, SS-01-04, SS-01-05, SS-01-06

Required data: Platform name; retention default; MFA/session defaults; advice classification rules; role template changes; evidence and export template settings

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /admin/platform | Open the task entry screen and verify the role/tenant context. | Platform Settings | Platform name; retention default | The Configure the platform policy baseline context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-01-01 | Audit expected for policy/security/role changes; evidence templates define later proof requirements. | MT-001; UF-01; W-01; PF-A |
| 2 | /admin/policies/advice-boundary | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | MFA/session defaults; advice classification rules; role template changes | The Configure the platform policy baseline context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-01-02 | Audit expected for policy/security/role changes; evidence templates define later proof requirements. | MT-001; UF-01; W-01; PF-A |
| 3 | /admin/roles | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | MFA/session defaults; advice classification rules; role template changes | The Configure the platform policy baseline context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-01-03 | Audit expected for policy/security/role changes; evidence templates define later proof requirements. | MT-001; UF-01; W-01; PF-A |
| 4 | /admin/security | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | MFA/session defaults; advice classification rules; role template changes | The Configure the platform policy baseline context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-01-04 | Audit expected for policy/security/role changes; evidence templates define later proof requirements. | MT-001; UF-01; W-01; PF-A |
| 5 | /admin/evidence-templates | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | MFA/session defaults; advice classification rules; role template changes | The Configure the platform policy baseline context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-01-05 | Audit expected for policy/security/role changes; evidence templates define later proof requirements. | MT-001; UF-01; W-01; PF-A |
| 6 | /admin/export-templates | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | MFA/session defaults; advice classification rules; role template changes | The Configure the platform policy baseline context is visible. | Policy baseline is reviewed; sensitive changes require confirmation and audit. | SS-01-06 | Audit expected for policy/security/role changes; evidence templates define later proof requirements. | MT-001; UF-01; W-01; PF-A |

Expected result: Policy baseline is reviewed; sensitive changes require confirmation and audit.

Evidence created or referenced: Audit expected for policy/security/role changes; evidence templates define later proof requirements.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: No unapproved advice reaches the client.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E3 navigable UI with visible policy states; broad persisted policy transactions are not claimed.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-002 Create and prepare a client tenant

Audience: Admin / Client Success / Compliance

Business goal: A tenant moves from list/create/setup into team assignment, policy selection, and user invitation readiness.

When to use: Use this task when the user needs to complete UF-02 / W-02 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Admin / Client Success / Compliance. Tenant context depends on the task; platform tasks use platform context.

UI start point: Tenant List

Screenshots: SS-02-01, SS-02-02, SS-02-03, SS-02-04, SS-02-05, SS-02-06

Required data: family office name; jurisdiction; service tier; advisor; analyst; compliance owner; client success owner; tenant policy profile; principal invitation

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /admin/tenants | Open the task entry screen and verify the role/tenant context. | Tenant List | family office name; jurisdiction | The Create and prepare a client tenant context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-02-01 | Tenant create, team assignment, policy override, and invitation should be audited. | MT-002; UF-02; W-02; PF-B |
| 2 | /tenants/new | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | service tier; advisor; analyst | The Create and prepare a client tenant context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-02-02 | Tenant create, team assignment, policy override, and invitation should be audited. | MT-002; UF-02; W-02; PF-B |
| 3 | /tenants/demo/setup | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | service tier; advisor; analyst | The Create and prepare a client tenant context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-02-03 | Tenant create, team assignment, policy override, and invitation should be audited. | MT-002; UF-02; W-02; PF-B |
| 4 | /tenants/demo/team | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | service tier; advisor; analyst | The Create and prepare a client tenant context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-02-04 | Tenant create, team assignment, policy override, and invitation should be audited. | MT-002; UF-02; W-02; PF-B |
| 5 | /tenants/demo/policies | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | service tier; advisor; analyst | The Create and prepare a client tenant context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-02-05 | Tenant create, team assignment, policy override, and invitation should be audited. | MT-002; UF-02; W-02; PF-B |
| 6 | /tenants/demo/users | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | service tier; advisor; analyst | The Create and prepare a client tenant context is visible. | Tenant setup checklist shows whether activation gates are ready or blocked. | SS-02-06 | Tenant create, team assignment, policy override, and invitation should be audited. | MT-002; UF-02; W-02; PF-B |

Expected result: Tenant setup checklist shows whether activation gates are ready or blocked.

Evidence created or referenced: Tenant create, team assignment, policy override, and invitation should be audited.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: No unapproved advice reaches the client.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E3 navigable UI; tenant write workflow is a required input-mask slice, not yet fully governed.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-003 Accept an invitation and complete onboarding

Audience: Invited User

Business goal: The invited user accepts the invitation, confirms identity/MFA, accepts privacy/consent, and acknowledges role scope.

When to use: Use this task when the user needs to complete UF-03 / W-03 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Invited User. Tenant context depends on the task; platform tasks use platform context.

UI start point: Invitation Acceptance

Screenshots: SS-03-01, SS-03-02, SS-03-03, SS-03-04, SS-03-05, SS-03-06

Required data: invite token; name; email confirmation; MFA method; consent version; role acknowledgement

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /onboarding/invite | Open the task entry screen and verify the role/tenant context. | Invitation Acceptance | invite token; name | The Accept an invitation and complete onboarding context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-03-01 | Consent and onboarding audit expected; no real auth is introduced in this demo-first phase. | MT-003; UF-03; W-03; PF-B |
| 2 | /onboarding/identity | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | email confirmation; MFA method; consent version | The Accept an invitation and complete onboarding context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-03-02 | Consent and onboarding audit expected; no real auth is introduced in this demo-first phase. | MT-003; UF-03; W-03; PF-B |
| 3 | /mfa | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | email confirmation; MFA method; consent version | The Accept an invitation and complete onboarding context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-03-03 | Consent and onboarding audit expected; no real auth is introduced in this demo-first phase. | MT-003; UF-03; W-03; PF-B |
| 4 | /onboarding/consent | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | email confirmation; MFA method; consent version | The Accept an invitation and complete onboarding context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-03-04 | Consent and onboarding audit expected; no real auth is introduced in this demo-first phase. | MT-003; UF-03; W-03; PF-B |
| 5 | /onboarding/role-confirmation | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | email confirmation; MFA method; consent version | The Accept an invitation and complete onboarding context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-03-05 | Consent and onboarding audit expected; no real auth is introduced in this demo-first phase. | MT-003; UF-03; W-03; PF-B |
| 6 | /login | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | email confirmation; MFA method; consent version | The Accept an invitation and complete onboarding context is visible. | User reaches role confirmation; production auth remains intentionally deferred. | SS-03-06 | Consent and onboarding audit expected; no real auth is introduced in this demo-first phase. | MT-003; UF-03; W-03; PF-B |

Expected result: User reaches role confirmation; production auth remains intentionally deferred.

Evidence created or referenced: Consent and onboarding audit expected; no real auth is introduced in this demo-first phase.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: No unapproved advice reaches the client.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E2/E3 visual and navigable onboarding surfaces; no real authentication claim.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-004 Submit client profile and family context

Audience: Principal / Family CFO

Business goal: Client profile, family members, and relationships provide context for later decisions and access.

When to use: Use this task when the user needs to complete UF-04 / W-04 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Principal / Family CFO. Tenant context depends on the task; platform tasks use platform context.

UI start point: Client Web Dashboard

Screenshots: SS-04-01, SS-04-02, SS-04-03, SS-04-04

Required data: family profile; governance preferences; family member details; relationship type; ownership or beneficiary links; missing-evidence notes

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /portal | Open the task entry screen and verify the role/tenant context. | Client Web Dashboard | family profile; governance preferences | The Submit client profile and family context context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-04-01 | Profile/family edits should create audit events and review tasks. | MT-004; UF-04; W-04; PF-C |
| 2 | /client/profile | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | family member details; relationship type; ownership or beneficiary links | The Submit client profile and family context context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-04-02 | Profile/family edits should create audit events and review tasks. | MT-004; UF-04; W-04; PF-C |
| 3 | /client/family-members | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | family member details; relationship type; ownership or beneficiary links | The Submit client profile and family context context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-04-03 | Profile/family edits should create audit events and review tasks. | MT-004; UF-04; W-04; PF-C |
| 4 | /relationships | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | family member details; relationship type; ownership or beneficiary links | The Submit client profile and family context context is visible. | Profile and relationship context is visible with conflicts or missing evidence flagged. | SS-04-04 | Profile/family edits should create audit events and review tasks. | MT-004; UF-04; W-04; PF-C |

Expected result: Profile and relationship context is visible with conflicts or missing evidence flagged.

Evidence created or referenced: Profile/family edits should create audit events and review tasks.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: No unapproved advice reaches the client.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E3 navigable UI with static/demo data; profile persistence is a P0/P1 implementation need.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-005 Create an entity and review wealth structure

Audience: Principal / Family CFO / Analyst / Advisor

Business goal: Entity records, participants, documents, wealth-map nodes, and action cards expose structure gaps safely.

When to use: Use this task when the user needs to complete UF-05 / W-05 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Principal / Family CFO / Analyst / Advisor. Tenant context depends on the task; platform tasks use platform context.

UI start point: Entity List

Screenshots: SS-05-01, SS-05-02, SS-05-03, SS-05-04, SS-05-05

Required data: entity type; entity name; jurisdiction; participants; asset link; document evidence; action owner; readiness state

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /entities | Open the task entry screen and verify the role/tenant context. | Entity List | entity type; entity name | The Create an entity and review wealth structure context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-05-01 | Entity/action changes should audit; missing evidence blocks readiness. | MT-005; UF-05; W-05; PF-C |
| 2 | /entities/new | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | jurisdiction; participants; asset link | The Create an entity and review wealth structure context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-05-02 | Entity/action changes should audit; missing evidence blocks readiness. | MT-005; UF-05; W-05; PF-C |
| 3 | /entities/demo | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | jurisdiction; participants; asset link | The Create an entity and review wealth structure context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-05-03 | Entity/action changes should audit; missing evidence blocks readiness. | MT-005; UF-05; W-05; PF-C |
| 4 | /wealth-map | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | jurisdiction; participants; asset link | The Create an entity and review wealth structure context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-05-04 | Entity/action changes should audit; missing evidence blocks readiness. | MT-005; UF-05; W-05; PF-C |
| 5 | /actions | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | jurisdiction; participants; asset link | The Create an entity and review wealth structure context is visible. | Entity detail, wealth-map drawer, and action-board blockers show what must happen next. | SS-05-05 | Entity/action changes should audit; missing evidence blocks readiness. | MT-005; UF-05; W-05; PF-C |

Expected result: Entity detail, wealth-map drawer, and action-board blockers show what must happen next.

Evidence created or referenced: Entity/action changes should audit; missing evidence blocks readiness.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: No unapproved advice reaches the client.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E3 navigable UI; entity/action mutations and evidence gate need transaction wiring.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-006 Upload and verify a document

Audience: Client / Family CFO / External Advisor / Analyst

Business goal: A document is uploaded, extraction is reviewed as draft, and human verification or evidence linking is required.

When to use: Use this task when the user needs to complete UF-06 / W-06 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Client / Family CFO / External Advisor / Analyst. Tenant context depends on the task; platform tasks use platform context.

UI start point: Documents List

Screenshots: SS-06-01, SS-06-02, SS-06-03, SS-06-04

Required data: document file; document type; entity/asset link; sensitivity; notes; corrected extracted values; confidence override

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /documents | Open the task entry screen and verify the role/tenant context. | Documents List | document file; document type | The Upload and verify a document context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-06-01 | Upload, extraction review, document version, and evidence link should audit. | MT-006; UF-06; W-06; PF-D |
| 2 | /documents/upload | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | entity/asset link; sensitivity; notes | The Upload and verify a document context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-06-02 | Upload, extraction review, document version, and evidence link should audit. | MT-006; UF-06; W-06; PF-D |
| 3 | /documents/extraction-review | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | entity/asset link; sensitivity; notes | The Upload and verify a document context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-06-03 | Upload, extraction review, document version, and evidence link should audit. | MT-006; UF-06; W-06; PF-D |
| 4 | /documents/verification-pending | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | entity/asset link; sensitivity; notes | The Upload and verify a document context is visible. | Document reaches verification-pending or needs-clarification state. | SS-06-04 | Upload, extraction review, document version, and evidence link should audit. | MT-006; UF-06; W-06; PF-D |

Expected result: Document reaches verification-pending or needs-clarification state.

Evidence created or referenced: Upload, extraction review, document version, and evidence link should audit.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: No unapproved advice reaches the client.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E3 navigable UI; no real file storage/extraction transaction is claimed.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-007 Process a signal and route internal work

Audience: Analyst

Business goal: The analyst reviews an internal-only trigger, requests data or routes to advisor, and keeps client visibility blocked.

When to use: Use this task when the user needs to complete UF-07 / W-07 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Analyst. Tenant context depends on the task; platform tasks use platform context.

UI start point: Signal Review

Screenshots: SS-07-01, SS-07-02, SS-07-03, SS-07-04

Required data: signal ID; missing beneficial owner; purpose of wire; source of funds; analyst note; route decision

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /signals | Open the task entry screen and verify the role/tenant context. | Signal Review | signal ID; missing beneficial owner | The Process a signal and route internal work context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-07-01 | J01 request-data actions use the canonical typed boundary (legacy compatibility bridge); typed recommendation-review boundaries define the canonical product path and carry audit expectations. | MT-007; UF-07; W-07; PF-E |
| 2 | /workbench | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | purpose of wire; source of funds; analyst note | The Process a signal and route internal work context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-07-02 | J01 request-data actions use the canonical typed boundary (legacy compatibility bridge); typed recommendation-review boundaries define the canonical product path and carry audit expectations. | MT-007; UF-07; W-07; PF-E |
| 3 | /workbench/triggers/demo | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | purpose of wire; source of funds; analyst note | The Process a signal and route internal work context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-07-03 | J01 request-data actions use the canonical typed boundary (legacy compatibility bridge); typed recommendation-review boundaries define the canonical product path and carry audit expectations. | MT-007; UF-07; W-07; PF-E |
| 4 | /actions | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | purpose of wire; source of funds; analyst note | The Process a signal and route internal work context is visible. | Trigger moves toward awaiting information or advisor review while staying internal-only. | SS-07-04 | J01 request-data actions use the canonical typed boundary (legacy compatibility bridge); typed recommendation-review boundaries define the canonical product path and carry audit expectations. | MT-007; UF-07; W-07; PF-E |

Expected result: Trigger moves toward awaiting information or advisor review while staying internal-only.

Evidence created or referenced: J01 request-data actions use the canonical typed boundary (legacy compatibility bridge); typed recommendation-review boundaries define the canonical product path and carry audit expectations.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: No unapproved advice reaches the client.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: canonical typed boundary (legacy compatibility bridge) for J01 request-data; full signal governance is not yet implemented.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-008 Review an advisor approval package

Audience: Senior Wealth Advisor

Business goal: Advisor approves, revises, requests more data, or escalates without releasing to the client.

When to use: Use this task when the user needs to complete UF-08 / W-08 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Senior Wealth Advisor. Tenant context depends on the task; platform tasks use platform context.

UI start point: Advisor Approval Queue

Screenshots: SS-08-01, SS-08-02

Required data: recommendation ID; advisor decision; rationale; conditions; escalation reason

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /advisor-approval | Open the task entry screen and verify the role/tenant context. | Advisor Approval Queue | recommendation ID; advisor decision | The Review an advisor approval package context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-08-01 | Advisor approval should audit; J01 approve/escalate is on the canonical typed boundary (legacy compatibility bridge), while typed recommendation-review commands are the canonical product path. | MT-008; UF-08; W-08; PF-E |
| 2 | /advisor-approval/demo | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | rationale; conditions; escalation reason | The Review an advisor approval package context is visible. | Advisor decision is recorded or routed; compliance release remains required. | SS-08-02 | Advisor approval should audit; J01 approve/escalate is on the canonical typed boundary (legacy compatibility bridge), while typed recommendation-review commands are the canonical product path. | MT-008; UF-08; W-08; PF-E |

Expected result: Advisor decision is recorded or routed; compliance release remains required.

Evidence created or referenced: Advisor approval should audit; J01 approve/escalate is on the canonical typed boundary (legacy compatibility bridge), while typed recommendation-review commands are the canonical product path.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: Advisor approval alone never releases to the client.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: canonical typed boundary (legacy compatibility bridge) for J01 advisor actions; advisor approval is internal and not client visibility.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-009 Release, block, or request evidence for advice-like content

Audience: Compliance Officer

Business goal: Compliance determines whether content can become client-visible, stays blocked, or needs more evidence.

When to use: Use this task when the user needs to complete UF-09 / W-09 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Compliance Officer. Tenant context depends on the task; platform tasks use platform context.

UI start point: Compliance Queue

Screenshots: SS-09-01, SS-09-02, SS-09-03, SS-09-04, SS-09-05

Required data: classification; evidence completeness; risk disclosure check; release note; block reason; requested evidence; owner

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /compliance | Open the task entry screen and verify the role/tenant context. | Compliance Queue | classification; evidence completeness | The Release, block, or request evidence for advice-like content context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-09-01 | Compliance release/block must create audit; evidence completeness is required for release. | MT-009; UF-09; W-09; PF-F |
| 2 | /compliance/demo/review | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | risk disclosure check; release note; block reason | The Release, block, or request evidence for advice-like content context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-09-02 | Compliance release/block must create audit; evidence completeness is required for release. | MT-009; UF-09; W-09; PF-F |
| 3 | /compliance/demo/release | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | risk disclosure check; release note; block reason | The Release, block, or request evidence for advice-like content context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-09-03 | Compliance release/block must create audit; evidence completeness is required for release. | MT-009; UF-09; W-09; PF-F |
| 4 | /compliance/demo/block | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | risk disclosure check; release note; block reason | The Release, block, or request evidence for advice-like content context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-09-04 | Compliance release/block must create audit; evidence completeness is required for release. | MT-009; UF-09; W-09; PF-F |
| 5 | /compliance/demo/audit | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | risk disclosure check; release note; block reason | The Release, block, or request evidence for advice-like content context is visible. | Release, block, or evidence-request state is visible; no unapproved advice reaches the client. | SS-09-05 | Compliance release/block must create audit; evidence completeness is required for release. | MT-009; UF-09; W-09; PF-F |

Expected result: Release, block, or evidence-request state is visible; no unapproved advice reaches the client.

Evidence created or referenced: Compliance release/block must create audit; evidence completeness is required for release.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: Compliance release controls visibility.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E3/E4 mixed demo states; broad release transaction is still a top implementation gap.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-010 Review and submit a released client decision

Audience: Principal / Family Council / Trustee scoped

Business goal: Client reviews only released content, chooses accept/defer/reject, and receives proof of submission.

When to use: Use this task when the user needs to complete UF-10 / W-10 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Principal / Family Council / Trustee scoped. Tenant context depends on the task; platform tasks use platform context.

UI start point: Decision List

Screenshots: SS-10-01, SS-10-02, SS-10-03, SS-10-04

Required data: decision choice; participant acknowledgement; comment; request-more-information reason

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /decisions | Open the task entry screen and verify the role/tenant context. | Decision List | decision choice; participant acknowledgement | The Review and submit a released client decision context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-10-01 | Decision event and evidence package should be immutable/audited. | MT-010; UF-10; W-10; PF-F |
| 2 | /decisions/demo | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | comment; request-more-information reason | The Review and submit a released client decision context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-10-02 | Decision event and evidence package should be immutable/audited. | MT-010; UF-10; W-10; PF-F |
| 3 | /decisions/demo/success | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | comment; request-more-information reason | The Review and submit a released client decision context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-10-03 | Decision event and evidence package should be immutable/audited. | MT-010; UF-10; W-10; PF-F |
| 4 | /evidence/demo | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | comment; request-more-information reason | The Review and submit a released client decision context is visible. | Decision success page and linked evidence record show the completion proof. | SS-10-04 | Decision event and evidence package should be immutable/audited. | MT-010; UF-10; W-10; PF-F |

Expected result: Decision success page and linked evidence record show the completion proof.

Evidence created or referenced: Decision event and evidence package should be immutable/audited.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: The decision must already be released before the client can act.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E3 navigable UI with demo workflow actions; final decision/evidence package persistence remains incomplete.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-011 Review evidence and create a controlled export

Audience: Client / Advisor / Compliance / Privacy Officer

Business goal: Evidence is inspected and exported only through scoped, redacted, approved, audited export steps.

When to use: Use this task when the user needs to complete UF-11 / W-11 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Client / Advisor / Compliance / Privacy Officer. Tenant context depends on the task; platform tasks use platform context.

UI start point: Evidence Vault / Create Export

Screenshots: SS-11-01, SS-11-02, SS-11-03, SS-11-04, SS-11-05, SS-11-06, SS-11-07, SS-11-08

Required data: evidence search/filter; export type; scope items; redaction profile; recipient/share expiry; approval reason

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /evidence | Open the task entry screen and verify the role/tenant context. | Evidence Vault / Create Export | evidence search/filter; export type | The Review evidence and create a controlled export context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-11-01 | Export create/scope/redaction/approval/download/share should audit. | MT-011; UF-11; W-11; PF-I |
| 2 | /evidence/demo | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | scope items; redaction profile; recipient/share expiry | The Review evidence and create a controlled export context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-11-02 | Export create/scope/redaction/approval/download/share should audit. | MT-011; UF-11; W-11; PF-I |
| 3 | /governance/audit-history | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | scope items; redaction profile; recipient/share expiry | The Review evidence and create a controlled export context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-11-03 | Export create/scope/redaction/approval/download/share should audit. | MT-011; UF-11; W-11; PF-I |
| 4 | /export/new | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | scope items; redaction profile; recipient/share expiry | The Review evidence and create a controlled export context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-11-04 | Export create/scope/redaction/approval/download/share should audit. | MT-011; UF-11; W-11; PF-I |
| 5 | /export/demo/scope | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | scope items; redaction profile; recipient/share expiry | The Review evidence and create a controlled export context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-11-05 | Export create/scope/redaction/approval/download/share should audit. | MT-011; UF-11; W-11; PF-I |
| 6 | /export/demo/redaction | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | scope items; redaction profile; recipient/share expiry | The Review evidence and create a controlled export context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-11-06 | Export create/scope/redaction/approval/download/share should audit. | MT-011; UF-11; W-11; PF-I |
| 7 | /export/demo/preview | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | scope items; redaction profile; recipient/share expiry | The Review evidence and create a controlled export context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-11-07 | Export create/scope/redaction/approval/download/share should audit. | MT-011; UF-11; W-11; PF-I |
| 8 | /export/demo/download | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | scope items; redaction profile; recipient/share expiry | The Review evidence and create a controlled export context is visible. | Export package is previewed/downloaded only if scope, redaction, permission, and approval allow it. | SS-11-08 | Export create/scope/redaction/approval/download/share should audit. | MT-011; UF-11; W-11; PF-I |

Expected result: Export package is previewed/downloaded only if scope, redaction, permission, and approval allow it.

Evidence created or referenced: Export create/scope/redaction/approval/download/share should audit.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: Export content must be scoped, redacted and approved before download/share.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E3 visual/navigable; export package/file/share realism is a Phase 18 gap.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-012 Manage governance users, roles, and access requests

Audience: Principal / Admin / Compliance / Security

Business goal: Sensitive user/role/access changes require scoped roles, confirmation, and audit history.

When to use: Use this task when the user needs to complete UF-12 / W-12 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Principal / Admin / Compliance / Security. Tenant context depends on the task; platform tasks use platform context.

UI start point: Governance Users

Screenshots: SS-12-01, SS-12-02, SS-12-03, SS-12-04

Required data: user email; role; permission scope; change reason; confirmation phrase; access decision; comment

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /governance/users | Open the task entry screen and verify the role/tenant context. | Governance Users | user email; role | The Manage governance users, roles, and access requests context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-12-01 | Sensitive role/access actions require second confirmation and audit. | MT-012; UF-12; W-12; PF-G |
| 2 | /governance/roles | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | permission scope; change reason; confirmation phrase | The Manage governance users, roles, and access requests context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-12-02 | Sensitive role/access actions require second confirmation and audit. | MT-012; UF-12; W-12; PF-G |
| 3 | /governance/access-requests | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | permission scope; change reason; confirmation phrase | The Manage governance users, roles, and access requests context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-12-03 | Sensitive role/access actions require second confirmation and audit. | MT-012; UF-12; W-12; PF-G |
| 4 | /governance/audit-history | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | permission scope; change reason; confirmation phrase | The Manage governance users, roles, and access requests context is visible. | Access request is approved/denied/escalated and audit history shows lineage. | SS-12-04 | Sensitive role/access actions require second confirmation and audit. | MT-012; UF-12; W-12; PF-G |

Expected result: Access request is approved/denied/escalated and audit history shows lineage.

Evidence created or referenced: Sensitive role/access actions require second confirmation and audit.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: No unapproved advice reaches the client.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E3/E4 demo actions visible; governed role/access transactions remain incomplete.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-013 Choose a communication or escalation path

Audience: Advisor / Client Success / Client

Business goal: The right secure message, data request, call, workshop, external specialist, or compliance escalation path is selected.

When to use: Use this task when the user needs to complete UF-13 / W-13 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Advisor / Client Success / Client. Tenant context depends on the task; platform tasks use platform context.

UI start point: Communication Centre

Screenshots: SS-13-01, SS-13-02, SS-13-03

Required data: channel; recipient; message/call notes; sensitivity; reason for escalation; follow-up owner

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /communication | Open the task entry screen and verify the role/tenant context. | Communication Centre | channel; recipient | The Choose a communication or escalation path context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-13-01 | Sensitive communication should audit and evidence-link; advice-like messages require release controls. | MT-013; UF-13; W-13; PF-H |
| 2 | /communication/call-trigger | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | message/call notes; sensitivity; reason for escalation | The Choose a communication or escalation path context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-13-02 | Sensitive communication should audit and evidence-link; advice-like messages require release controls. | MT-013; UF-13; W-13; PF-H |
| 3 | /evidence | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | message/call notes; sensitivity; reason for escalation | The Choose a communication or escalation path context is visible. | Communication path or call-trigger state is visible and linked to evidence when material. | SS-13-03 | Sensitive communication should audit and evidence-link; advice-like messages require release controls. | MT-013; UF-13; W-13; PF-H |

Expected result: Communication path or call-trigger state is visible and linked to evidence when material.

Evidence created or referenced: Sensitive communication should audit and evidence-link; advice-like messages require release controls.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: No unapproved advice reaches the client.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E2/E3 mostly static communication surfaces; message/call persistence not claimed.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?

---

## MT-014 Monitor operations, SLA, and reference state

Audience: Ops / Product / QA / Leads

Business goal: Ops reviews queues, SLA risk, service blueprint, roadmap, and state catalogue for delivery/control monitoring.

When to use: Use this task when the user needs to complete UF-14 / W-14 from the UI.

Prerequisites: Demo session is available; correct role and tenant are selected; required seeded/demo data exists.

Role and tenant context: Ops / Product / QA / Leads. Tenant context depends on the task; platform tasks use platform context.

UI start point: Ops Queues

Screenshots: SS-14-01, SS-14-02, SS-14-03, SS-14-04, SS-14-05

Required data: queue filter; SLA threshold; owner; roadmap scope; state/badge reference

Optional data: Notes, filters, comments, secondary review context, and search terms where the UI exposes them.

Allowed values: Use visible UI options and enum/status values from DATA_MODEL_V3.md and route-specific PAGE_SPECS_V3.md.

Validation and blocked inputs: Block cross-tenant access, unapproved advice release, missing evidence, missing consent, missing role/scope, unredacted exports, and unsupported uploads.

Step-by-step source:

| Step | UI Location | User Action | UI Target Label | Input Data | Expected UI Response | State Change | Screenshot ID | Evidence/Audit | Source Proof |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /ops/queues | Open the task entry screen and verify the role/tenant context. | Ops Queues | queue filter; SLA threshold | The Monitor operations, SLA, and reference state context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-14-01 | Ops mutations should audit if implemented; reference pages are internal only. | MT-014; UF-14; W-14; PF-J |
| 2 | /ops/sla | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | owner; roadmap scope; state/badge reference | The Monitor operations, SLA, and reference state context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-14-02 | Ops mutations should audit if implemented; reference pages are internal only. | MT-014; UF-14; W-14; PF-J |
| 3 | /service-blueprint | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | owner; roadmap scope; state/badge reference | The Monitor operations, SLA, and reference state context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-14-03 | Ops mutations should audit if implemented; reference pages are internal only. | MT-014; UF-14; W-14; PF-J |
| 4 | /roadmap | Select the next relevant action, tab, drawer, modal, or navigation item. | Visible UI control or navigation link | owner; roadmap scope; state/badge reference | The Monitor operations, SLA, and reference state context is visible. | Progresses to the next planned screen/state without client-visibility overclaim. | SS-14-04 | Ops mutations should audit if implemented; reference pages are internal only. | MT-014; UF-14; W-14; PF-J |
| 5 | /states | Review the final task state and confirm the result or blocked condition. | Visible UI control or navigation link | owner; roadmap scope; state/badge reference | The Monitor operations, SLA, and reference state context is visible. | Bottlenecks, SLA breaches, roadmap scope, and state language are visible for internal use. | SS-14-05 | Ops mutations should audit if implemented; reference pages are internal only. | MT-014; UF-14; W-14; PF-J |

Expected result: Bottlenecks, SLA breaches, roadmap scope, and state language are visible for internal use.

Evidence created or referenced: Ops mutations should audit if implemented; reference pages are internal only.

Audit created or expected: Sensitive create/edit/upload/review/approve/release/block/export/invite/assign/revoke/manage actions require audit.

Client visibility / compliance rule: No unapproved advice reaches the client.

Variants and branches: Happy path, blocked/restricted state, missing evidence, permission mismatch, tenant mismatch, draft/cancel where applicable.

Troubleshooting / blocked states: Check role, tenant, evidence completeness, compliance status, redaction status and current workflow state.

Current implementation status: E2/E3 reference and dashboard surfaces; queue/SLA mutation not yet implemented.

Source proof: AGENTS.md; CODEX_MASTER_TASK.md; PAGEFLOW_USERFLOW_MAPPING_V3.md; PAGE_SPECS_V3.md; USER_JOURNEY_PLAYBOOK_V3.md; route-registry.ts; relevant component/demo data.

Open questions: Which of the visible controls should become persisted first, and which should remain demonstrational until later phases?
