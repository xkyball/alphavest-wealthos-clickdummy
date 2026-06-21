# ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md

## 1. Executive Decision

**Route / screen / visual asset matrix status:** `ROUTE_SCREEN_VISUAL_ASSET_MATRIX_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

This artefact maps all **71 registered AlphaVest full-workflow routes** to their screen/component owner, visual reference, clean-PNG status, manifest status, referenced-asset status, route-scope label and downstream state/interaction/safety dependencies.

**Codex readiness status:** `CODEX_HANDOFF_NOT_READY`

This artefact is evidence and decision preparation only. It does **not** implement, generate screens, generate state-screens, create images, change code, change routes, create tests, change APIs, change Prisma, create Codex tasks or prepare final Codex handoff.

**Core decision:** routes `001–063` have matched public clean PNG references; routes `061–063` are reference-only despite having clean PNGs; routes `064–071` are registered routes but use non-public `artifacts/...` visual references that are not present in the uploaded ZIP. Route `068` is `P1_AFTER_MVP`, not hold. The other unresolved artifact-ref routes `064–067` and `069–071` remain `HOLD_PENDING_DECISION`.

## 2. Roadmap Position and Sequence Check

| Field | Value | Decision |
| --- | --- | --- |
| Artefact | `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` | PASS |
| Position | 3 of 15 | PASS |
| Direct predecessor | `ROUTE_SCOPE_LOCK.md` | Exists and used |
| Required predecessor artefacts | `MVP_SCOPE_LOCK.md`, `ROUTE_SCOPE_LOCK.md` | Both exist and used |
| Direct successor | `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` | Prepared, not generated |
| Codex status | `CODEX_HANDOFF_NOT_READY` | Codex remains blocked |

## 3. Source-of-Truth Lock

| Rank | Source | Role | Use Allowed | Use Forbidden |
| --- | --- | --- | --- | --- |
| 1 | `ALPHAVEST_CODEX_HANDOFF_PREPARATION_ROADMAP_v0.8.md` | Roadmap control | Sequence, gates, dependencies, stop rules | Bypassing sequence or starting Codex |
| 2 | `ROUTE_SCOPE_LOCK.md` | Binding predecessor | Route scope labels for all 71 routes | Reclassifying routes without evidence |
| 3 | `MVP_SCOPE_LOCK.md` | MVP scope predecessor | MVP/support/P1/hold/reference/non-goal boundaries | Inventing conflicting MVP scope |
| 4 | `ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md` | Latest KB layer | Schema/domain/patch interpretation | Treating schema gate as passed or replacing schema |
| 5 | `ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md` | Interaction reality layer | Real/partial/deterministic/static interaction distinction | Treating visible UI as lifecycle proof |
| 6 | `ALPHAVEST_FULL_WORKFLOW_ROUTE_VISUAL_STATE_RECONCILIATION_v0.5.md` | Route/visual/state layer | 71-route universe, 63 clean PNGs, unresolved `064–071` | Generating screens or treating 63 PNGs as full coverage |
| 7 | `ALPHAVEST_FULL_WORKFLOW_READINESS_KNOWLEDGE_BASE_REBASE_v0.4.md` | Readiness layer | Codex-not-ready and open gates | Overclaiming readiness |
| 8 | `ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md` | False-gap cleanup | Blocks `main` absence claims | Target gaps/tasks from `main` |
| 9 | `ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md` | Code inventory | 405 files, 71 routes, 4 APIs, 42 models, 10 specs, 63 PNGs | Treating inventory as MVP readiness proof |
| 10 | `ALPHAVEST_LIVING_KNOWLEDGE_BASE.md` | Recovery/versioning protocol | Versioning and source hierarchy | Letting v0.1 override newer layers |
| 11 | `alphavest_mvp_artifact_completion_patch.zip` | MVP Control Spec | Advice boundary, RBAC, visibility, workflow, domain and acceptance concepts | Replacing full-workflow code/schema |
| 12 | `alphavest-wealthos-clickdummy-full-workflow.zip` | Primary target codebase | Target route registry, components, assets, APIs, Prisma, tests | Assuming all present code is ready |
| 13 | `alphavest-wealthos-clickdummy-main.zip` | False-gap source only | Historical comparison only | Any target truth or Codex task |

## 4. Binding Predecessor Artefacts

### 4.1 `MVP_SCOPE_LOCK.md`

* MVP is a controlled human-backed, evidence-backed Family Office workflow platform.
* MVP core includes internal draft preparation, advisor approval, compliance review/release/block, client visibility, decision records, evidence/document intake, audit, RBAC/governance baseline and safe export/redaction subset.
* Tenant/admin/auth/client context are `MVP_SUPPORT`.
* Communication, operations and review rhythm default to `P1_AFTER_MVP` unless later elevated.
* KYC/AML, source-of-wealth, suitability, IPS, rebalance monitoring and committee review remain held where route scope requires it.
* No Codex start, no screen generation and no visual treatment for `064–071` may happen here.

### 4.2 `ROUTE_SCOPE_LOCK.md`

| Scope Label | Count | Route IDs |
| --- | --- | --- |
| MVP | 31 | 008, 019, 020, 027, 028, 029, 030, 033, 034, 035, 036, 037, 038, 039, 040, 041, 042, 043, 044, 045, 046, 047, 048, 049, 050, 051, 054, 055, 056, 057, 058 |
| MVP_SUPPORT | 25 | 001, 002, 003, 004, 005, 006, 007, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 021, 022, 023, 024, 025, 026, 031, 032 |
| P1_AFTER_MVP | 5 | 052, 053, 059, 060, 068 |
| REFERENCE_ONLY | 3 | 061, 062, 063 |
| HOLD_PENDING_DECISION | 7 | 064, 065, 066, 067, 069, 070, 071 |
| FUTURE_STATE | 0 | — |
| DEMO_ONLY | 0 | — |
| OUT_OF_SCOPE | 0 | — |

## 5. Current Route / Scope / Visual Baseline

| Baseline Item | Current Evidence Decision |
| --- | --- |
| Route universe | 71 registered routes `001–071`; all are mapped below exactly once. |
| Public clean PNG universe | 63 public clean PNGs exist for `001–063`. |
| Manifest universe | 63 manifest entries exist, covering `001–063`. |
| Unresolved visual refs | Routes `064–071` point to non-public `artifacts/...` paths and referenced assets are not present in the uploaded ZIP. |
| Reference-only pages | Routes `061–063` are reference-only and are not MVP product implementation proof. |
| Visual proof limit | A PNG, manifest entry, visual mode or reference page is visual evidence only, not interaction/safety/gate proof. |

## 6. Visual Status Vocabulary

| Label | Meaning |
| --- | --- |
| `MATCHED_PUBLIC_CLEAN_PNG` | Route has matching clean PNG under `public/reference/page_ui_v3/clean_pages`. |
| `PUBLIC_CLEAN_PNG_MISSING` | No public clean PNG exists for that route ID. |
| `MANIFEST_ENTRY_EXISTS` | Visual manifest contains matching route/asset entry. |
| `MANIFEST_ENTRY_MISSING` | Visual manifest lacks matching route/asset entry. |
| `REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF` | Registry points to a non-public `artifacts/...` reference. |
| `REGISTERED_ROUTE_WITH_MISSING_ASSET` | Referenced registry asset is not present in uploaded ZIP. |
| `REFERENCE_ONLY_ROUTE` | Route is reference-only and not MVP product implementation surface. |
| `P1_VISUAL_DEFERRED` | Route is P1 and visual treatment is deferred from MVP. |
| `HOLD_VISUAL_DECISION_REQUIRED` | Route is held and cannot receive generation/implementation decisions. |
| `DOC_SUPPORT_ASSET_ONLY` | Asset supports documentation/manual/process context only. |
| `NOT_BEHAVIOUR_PROOF` | Visual asset does not prove interaction, mutation, permission, audit, visibility or gate behaviour. |
| `DO_NOT_GENERATE_YET` | No screen/image generation may happen from this artefact. |

## 7. Full 71-Route Screen / Visual Asset Matrix

| Route ID | Path | Title | Scope Label | Route Group | Component | Audience | Visual Mode | Registry Visual Ref | Public Clean PNG | Clean PNG Exists? | Manifest Entry Exists? | Referenced Asset Exists? | Visual Status | Screen Decision | State-Screen Dependency | Interaction Dependency | Safety Dependency | Downstream Routing | Stop Rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | /login | Authentication Login | `MVP_SUPPORT` | Access | `AuthOnboardingScreen` | Invited users | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-001-login.png` | `public/reference/page_ui_v3/clean_pages/PAGE-001-login.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | RBAC/AUDIT | STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 002 | /mfa | Multi-Factor Authentication | `MVP_SUPPORT` | Access | `AuthOnboardingScreen` | Invited users | MODAL_CAPABLE_AUTH_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-002-mfa.png` | `public/reference/page_ui_v3/clean_pages/PAGE-002-mfa.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | RBAC/AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 003 | /onboarding/invite | Invitation Acceptance | `MVP_SUPPORT` | Access | `AuthOnboardingScreen` | Invited users | WIZARD_OR_STEP_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-003-onboarding-invite.png` | `public/reference/page_ui_v3/clean_pages/PAGE-003-onboarding-invite.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | RBAC/AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 004 | /onboarding/identity | Identity Setup | `MVP_SUPPORT` | Access | `AuthOnboardingScreen` | Invited users | WIZARD_OR_STEP_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-004-onboarding-identity.png` | `public/reference/page_ui_v3/clean_pages/PAGE-004-onboarding-identity.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | RBAC/AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 005 | /onboarding/consent | Consent and Privacy | `MVP_SUPPORT` | Access | `AuthOnboardingScreen` | Invited users | PAGE_WITH_POLICY_MODAL_AVAILABLE | `public/reference/page_ui_v3/clean_pages/PAGE-005-onboarding-consent.png` | `public/reference/page_ui_v3/clean_pages/PAGE-005-onboarding-consent.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | RBAC/AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 006 | /onboarding/role-confirmation | Role Confirmation | `MVP_SUPPORT` | Access | `AuthOnboardingScreen` | Invited users | WIZARD_OR_STEP_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-006-onboarding-role-confirmation.png` | `public/reference/page_ui_v3/clean_pages/PAGE-006-onboarding-role-confirmation.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | RBAC/AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 007 | /admin/platform | Platform Settings | `MVP_SUPPORT` | Platform / Admin | `AdminTenantSetupScreen` | Platform admin | PAGE_WITH_SECOND_CONFIRMATION_MODAL | `public/reference/page_ui_v3/clean_pages/PAGE-007-admin-platform.png` | `public/reference/page_ui_v3/clean_pages/PAGE-007-admin-platform.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 008 | /admin/policies/advice-boundary | Advice Boundary Policy | `MVP` | Platform / Admin | `AdminTenantSetupScreen` | Compliance and platform admin | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-008-admin-policies-advice-boundary.png` | `public/reference/page_ui_v3/clean_pages/PAGE-008-admin-policies-advice-boundary.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | RBAC/AUDIT; CLIENT_VISIBILITY | STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 009 | /admin/roles | Global Role Templates | `MVP_SUPPORT` | Platform / Admin | `AdminTenantSetupScreen` | Platform admin | PAGE_WITH_PERMISSION_MODAL | `public/reference/page_ui_v3/clean_pages/PAGE-009-admin-roles.png` | `public/reference/page_ui_v3/clean_pages/PAGE-009-admin-roles.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | RBAC/AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 010 | /admin/security | Security Configuration | `MVP_SUPPORT` | Platform / Admin | `AdminTenantSetupScreen` | Security officer | PAGE_WITH_SECOND_CONFIRMATION_MODAL | `public/reference/page_ui_v3/clean_pages/PAGE-010-admin-security.png` | `public/reference/page_ui_v3/clean_pages/PAGE-010-admin-security.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | RBAC/AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 011 | /admin/evidence-templates | Evidence Templates | `MVP_SUPPORT` | Platform / Admin | `AdminTenantSetupScreen` | Compliance and platform admin | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-011-admin-evidence-templates.png` | `public/reference/page_ui_v3/clean_pages/PAGE-011-admin-evidence-templates.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | EVIDENCE; AUDIT | STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 012 | /admin/export-templates | Export Templates and Redaction | `MVP_SUPPORT` | Platform / Admin | `AdminTenantSetupScreen` | Privacy and platform admin | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-012-admin-export-templates.png` | `public/reference/page_ui_v3/clean_pages/PAGE-012-admin-export-templates.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | EXPORT; AUDIT | STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 013 | /admin/tenants | Tenant List | `MVP_SUPPORT` | Tenant Setup | `AdminTenantSetupScreen` | Ops admin and client success | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-013-admin-tenants.png` | `public/reference/page_ui_v3/clean_pages/PAGE-013-admin-tenants.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 014 | /tenants/new | Create Client Tenant | `MVP_SUPPORT` | Tenant Setup | `AdminTenantSetupScreen` | Ops admin and client success | WIZARD_OR_STEP_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-014-tenants-new.png` | `public/reference/page_ui_v3/clean_pages/PAGE-014-tenants-new.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | LOW / CONTEXTUAL | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 015 | /tenants/:id/setup | Tenant Setup Dashboard | `MVP_SUPPORT` | Tenant Setup | `AdminTenantSetupScreen` | Client success and compliance | WIZARD_OR_STEP_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-015-tenants-id-setup.png` | `public/reference/page_ui_v3/clean_pages/PAGE-015-tenants-id-setup.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | LOW / CONTEXTUAL | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 016 | /tenants/:id/team | Assign AlphaVest Team | `MVP_SUPPORT` | Tenant Setup | `AdminTenantSetupScreen` | Client success and operations | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-016-tenants-id-team.png` | `public/reference/page_ui_v3/clean_pages/PAGE-016-tenants-id-team.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | AUDIT | STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 017 | /tenants/:id/policies | Tenant Policies | `MVP_SUPPORT` | Tenant Setup | `AdminTenantSetupScreen` | Compliance and client success | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-017-tenants-id-policies.png` | `public/reference/page_ui_v3/clean_pages/PAGE-017-tenants-id-policies.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | RBAC/AUDIT; CLIENT_VISIBILITY | STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 018 | /tenants/:id/users | Tenant Users | `MVP_SUPPORT` | Tenant Setup | `AdminTenantSetupScreen` | Client success and tenant admin | PAGE_WITH_INVITE_ROLE_MODAL | `public/reference/page_ui_v3/clean_pages/PAGE-018-tenants-id-users.png` | `public/reference/page_ui_v3/clean_pages/PAGE-018-tenants-id-users.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | RBAC/AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 019 | /portal | Client Web Dashboard | `MVP` | Client Workspace | `ClientIntakeScreen` | Principal and family office users | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-019-portal.png` | `public/reference/page_ui_v3/clean_pages/PAGE-019-portal.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | CLIENT_VISIBILITY | STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 020 | /mobile | Mobile Home | `MVP` | Client Workspace | `ClientIntakeScreen` | Principal and family office users | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-020-mobile.png` | `public/reference/page_ui_v3/clean_pages/PAGE-020-mobile.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | CLIENT_VISIBILITY | STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 021 | /client/profile | Client Profile | `MVP_SUPPORT` | Client Workspace | `ClientIntakeScreen` | Principal, family CFO and analyst | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-021-client-profile.png` | `public/reference/page_ui_v3/clean_pages/PAGE-021-client-profile.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 022 | /client/family-members | Family Members | `MVP_SUPPORT` | Client Workspace | `ClientIntakeScreen` | Principal, family CFO and analyst | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-022-client-family-members.png` | `public/reference/page_ui_v3/clean_pages/PAGE-022-client-family-members.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 023 | /relationships | Relationship Map | `MVP_SUPPORT` | Client Workspace | `ClientIntakeScreen` | Principal, family CFO and analyst | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-023-relationships.png` | `public/reference/page_ui_v3/clean_pages/PAGE-023-relationships.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 024 | /entities | Entity List | `MVP_SUPPORT` | Client Workspace | `ClientIntakeScreen` | Principal, family CFO and advisor | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-024-entities.png` | `public/reference/page_ui_v3/clean_pages/PAGE-024-entities.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 025 | /entities/new | Create Entity | `MVP_SUPPORT` | Client Workspace | `ClientIntakeScreen` | Principal, family CFO and advisor | WIZARD_OR_STEP_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-025-entities-new.png` | `public/reference/page_ui_v3/clean_pages/PAGE-025-entities-new.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | LOW / CONTEXTUAL | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 026 | /entities/:id | Entity Detail | `MVP_SUPPORT` | Client Workspace | `ClientIntakeScreen` | Principal, family CFO and advisor | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-026-entities-id.png` | `public/reference/page_ui_v3/clean_pages/PAGE-026-entities-id.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 027 | /documents | Documents List | `MVP` | Client Workspace | `ClientIntakeScreen` | Client, family CFO, analyst and compliance | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-027-documents.png` | `public/reference/page_ui_v3/clean_pages/PAGE-027-documents.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | EVIDENCE | STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 028 | /documents/upload | Document Upload | `MVP` | Client Workspace | `ClientIntakeScreen` | Client, family CFO and external advisor | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-028-documents-upload.png` | `public/reference/page_ui_v3/clean_pages/PAGE-028-documents-upload.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | IMPLEMENTED_UPLOAD_MECHANICS_ONLY; evidence sufficiency still downstream | EVIDENCE; AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 029 | /documents/extraction-review | Extraction Review | `MVP` | Client Workspace | `ClientIntakeScreen` | Client, family CFO and analyst | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-029-documents-extraction-review.png` | `public/reference/page_ui_v3/clean_pages/PAGE-029-documents-extraction-review.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | EVIDENCE | STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 030 | /documents/verification-pending | Verification Pending | `MVP` | Client Workspace | `ClientIntakeScreen` | Analyst and compliance | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-030-documents-verification-pending.png` | `public/reference/page_ui_v3/clean_pages/PAGE-030-documents-verification-pending.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | EVIDENCE | STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 031 | /wealth-map | Live Wealth Map | `MVP_SUPPORT` | Wealth / Actions | `WealthActionsScreen` | Principal, family CFO, analyst and advisor | PAGE_WITH_SIDE_DRAWER | `public/reference/page_ui_v3/clean_pages/PAGE-031-wealth-map.png` | `public/reference/page_ui_v3/clean_pages/PAGE-031-wealth-map.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | LOW / CONTEXTUAL | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 032 | /actions | Action Board | `MVP_SUPPORT` | Wealth / Actions | `WealthActionsScreen` | Principal, analyst, advisor and client success | PAGE_WITH_SIDE_DRAWER | `public/reference/page_ui_v3/clean_pages/PAGE-032-actions.png` | `public/reference/page_ui_v3/clean_pages/PAGE-032-actions.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | CLIENT_VISIBILITY | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 033 | /signals | Signal Review | `MVP` | Advisory Workflow | `InternalWorkflowScreen` | System and analyst | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-033-signals.png` | `public/reference/page_ui_v3/clean_pages/PAGE-033-signals.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | ADVICE_BOUNDARY | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 034 | /workbench | Consultant Workbench | `MVP` | Advisory Workflow | `InternalWorkflowScreen` | Analyst and advisor | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-034-workbench.png` | `public/reference/page_ui_v3/clean_pages/PAGE-034-workbench.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | ADVICE_BOUNDARY | STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 035 | /workbench/triggers/:id | Trigger Detail | `MVP` | Advisory Workflow | `InternalWorkflowScreen` | Analyst and advisor | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-035-workbench-triggers-id.png` | `public/reference/page_ui_v3/clean_pages/PAGE-035-workbench-triggers-id.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | ADVICE_BOUNDARY | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 036 | /advisor-approval | Advisor Approval Queue | `MVP` | Advisory Workflow | `InternalWorkflowScreen` | Senior wealth advisor | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-036-advisor-approval.png` | `public/reference/page_ui_v3/clean_pages/PAGE-036-advisor-approval.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | ADVICE_BOUNDARY; AUDIT | STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 037 | /advisor-approval/:id | Advisor Approval Detail | `MVP` | Advisory Workflow | `InternalWorkflowScreen` | Senior wealth advisor | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-037-advisor-approval-id.png` | `public/reference/page_ui_v3/clean_pages/PAGE-037-advisor-approval-id.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | ADVICE_BOUNDARY; CLIENT_VISIBILITY; AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 038 | /compliance | Compliance Queue | `MVP` | Advisory Workflow | `InternalWorkflowScreen` | Compliance officer | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-038-compliance.png` | `public/reference/page_ui_v3/clean_pages/PAGE-038-compliance.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | ADVICE_BOUNDARY; CLIENT_VISIBILITY | STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 039 | /compliance/:id/review | Compliance Review Detail | `MVP` | Advisory Workflow | `InternalWorkflowScreen` | Compliance officer | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-039-compliance-id-review.png` | `public/reference/page_ui_v3/clean_pages/PAGE-039-compliance-id-review.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | ADVICE_BOUNDARY; CLIENT_VISIBILITY | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 040 | /compliance/:id/release | Release to Client | `MVP` | Advisory Workflow | `InternalWorkflowScreen` | Compliance officer | RELEASE_CONFIRMATION_MODAL_STATE | `public/reference/page_ui_v3/clean_pages/PAGE-040-compliance-id-release.png` | `public/reference/page_ui_v3/clean_pages/PAGE-040-compliance-id-release.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | ADVICE_BOUNDARY; CLIENT_VISIBILITY; AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 041 | /compliance/:id/block | Block or Request Evidence | `MVP` | Advisory Workflow | `DecisionsGovernanceScreen` | Compliance officer | BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE | `public/reference/page_ui_v3/clean_pages/PAGE-041-compliance-id-block.png` | `public/reference/page_ui_v3/clean_pages/PAGE-041-compliance-id-block.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | ADVICE_BOUNDARY; CLIENT_VISIBILITY; AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 042 | /compliance/:id/audit | Audit and Exception Log | `MVP` | Advisory Workflow | `DecisionsGovernanceScreen` | Compliance officer | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-042-compliance-id-audit.png` | `public/reference/page_ui_v3/clean_pages/PAGE-042-compliance-id-audit.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 043 | /decisions | Decision List | `MVP` | Decisions / Evidence / Governance | `DecisionsGovernanceScreen` | Principal, family council and trustee | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-043-decisions.png` | `public/reference/page_ui_v3/clean_pages/PAGE-043-decisions.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | ADVICE_BOUNDARY; CLIENT_VISIBILITY | STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 044 | /decisions/:id | Digital Decision Room | `MVP` | Decisions / Evidence / Governance | `DecisionsGovernanceScreen` | Principal, family council and trustee | PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION | `public/reference/page_ui_v3/clean_pages/PAGE-044-decisions-id.png` | `public/reference/page_ui_v3/clean_pages/PAGE-044-decisions-id.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | ADVICE_BOUNDARY; CLIENT_VISIBILITY; AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 045 | /decisions/:id/success | Decision Submitted | `MVP` | Decisions / Evidence / Governance | `DecisionsGovernanceScreen` | Principal, family council and trustee | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-045-decisions-id-success.png` | `public/reference/page_ui_v3/clean_pages/PAGE-045-decisions-id-success.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | ADVICE_BOUNDARY; CLIENT_VISIBILITY; AUDIT | STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 046 | /evidence | Evidence Vault | `MVP` | Decisions / Evidence / Governance | `DecisionsGovernanceScreen` | Client, advisor, compliance and privacy | PAGE_WITH_SIDE_DRAWER | `public/reference/page_ui_v3/clean_pages/PAGE-046-evidence.png` | `public/reference/page_ui_v3/clean_pages/PAGE-046-evidence.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | EVIDENCE; CLIENT_VISIBILITY | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 047 | /evidence/:id | Evidence Record Detail | `MVP` | Decisions / Evidence / Governance | `DecisionsGovernanceScreen` | Client, advisor, compliance and privacy | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-047-evidence-id.png` | `public/reference/page_ui_v3/clean_pages/PAGE-047-evidence-id.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | EVIDENCE; CLIENT_VISIBILITY | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 048 | /governance/users | Governance Users | `MVP` | Decisions / Evidence / Governance | `DecisionsGovernanceScreen` | Principal, admin, compliance and security | PAGE_WITH_USER_DRAWER_OR_MODAL | `public/reference/page_ui_v3/clean_pages/PAGE-048-governance-users.png` | `public/reference/page_ui_v3/clean_pages/PAGE-048-governance-users.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | RBAC/AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 049 | /governance/roles | Role Management | `MVP` | Decisions / Evidence / Governance | `DecisionsGovernanceScreen` | Principal, admin, compliance and security | PAGE_WITH_ROLE_DRAWER_AND_SECOND_CONFIRMATION_MODAL | `public/reference/page_ui_v3/clean_pages/PAGE-049-governance-roles.png` | `public/reference/page_ui_v3/clean_pages/PAGE-049-governance-roles.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | RBAC/AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 050 | /governance/access-requests | Access Requests | `MVP` | Decisions / Evidence / Governance | `DecisionsGovernanceScreen` | Principal, admin, compliance and security | PAGE_WITH_APPROVAL_DRAWER | `public/reference/page_ui_v3/clean_pages/PAGE-050-governance-access-requests.png` | `public/reference/page_ui_v3/clean_pages/PAGE-050-governance-access-requests.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | RBAC/AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 051 | /governance/audit-history | Access Audit History | `MVP` | Decisions / Evidence / Governance | `CommunicationExportOpsScreen` | Principal, admin, compliance and security | PAGE_WITH_SIDE_DRAWER | `public/reference/page_ui_v3/clean_pages/PAGE-051-governance-audit-history.png` | `public/reference/page_ui_v3/clean_pages/PAGE-051-governance-audit-history.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 052 | /communication | Communication Centre | `P1_AFTER_MVP` | Communication | `CommunicationExportOpsScreen` | Advisor, client success and client | PREVIEW_PAGE_OR_PANEL | `public/reference/page_ui_v3/clean_pages/PAGE-052-communication.png` | `public/reference/page_ui_v3/clean_pages/PAGE-052-communication.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | P1 visual deferred; no MVP generation unless later elevated. | DEFER_STATE_SPEC_UNLESS_ELEVATED | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | CLIENT_VISIBILITY | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 053 | /communication/call-trigger | Call Trigger Matrix | `P1_AFTER_MVP` | Communication | `CommunicationExportOpsScreen` | Advisor and client success | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-053-communication-call-trigger.png` | `public/reference/page_ui_v3/clean_pages/PAGE-053-communication-call-trigger.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | P1 visual deferred; no MVP generation unless later elevated. | DEFER_STATE_SPEC_UNLESS_ELEVATED | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 054 | /export/new | Create Export | `MVP` | Export | `CommunicationExportOpsScreen` | Principal, advisor, compliance and privacy | WIZARD_OR_STEP_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-054-export-new.png` | `public/reference/page_ui_v3/clean_pages/PAGE-054-export-new.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | EXPORT; CLIENT_VISIBILITY | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 055 | /export/:id/scope | Export Scope Selection | `MVP` | Export | `CommunicationExportOpsScreen` | Principal, advisor, compliance and privacy | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-055-export-id-scope.png` | `public/reference/page_ui_v3/clean_pages/PAGE-055-export-id-scope.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | EXPORT; CLIENT_VISIBILITY | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 056 | /export/:id/redaction | Export Redaction | `MVP` | Export | `CommunicationExportOpsScreen` | Principal, advisor, compliance and privacy | PREVIEW_PAGE_OR_PANEL | `public/reference/page_ui_v3/clean_pages/PAGE-056-export-id-redaction.png` | `public/reference/page_ui_v3/clean_pages/PAGE-056-export-id-redaction.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | EXPORT; CLIENT_VISIBILITY | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 057 | /export/:id/preview | Export Preview | `MVP` | Export | `CommunicationExportOpsScreen` | Principal, advisor, compliance and privacy | PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL | `public/reference/page_ui_v3/clean_pages/PAGE-057-export-id-preview.png` | `public/reference/page_ui_v3/clean_pages/PAGE-057-export-id-preview.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | EXPORT; CLIENT_VISIBILITY; AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 058 | /export/:id/download | Export Download and Share | `MVP` | Export | `CommunicationExportOpsScreen` | Principal, advisor, compliance and privacy | DOWNLOAD_CONFIRMATION_STATE | `public/reference/page_ui_v3/clean_pages/PAGE-058-export-id-download.png` | `public/reference/page_ui_v3/clean_pages/PAGE-058-export-id-download.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Accept as route visual reference only; no generation. | STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | EXPORT; CLIENT_VISIBILITY; AUDIT | STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 059 | /ops/queues | Ops Queues | `P1_AFTER_MVP` | Operations / Reference | `CommunicationExportOpsScreen` | Operations, product and QA | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-059-ops-queues.png` | `public/reference/page_ui_v3/clean_pages/PAGE-059-ops-queues.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | P1 visual deferred; no MVP generation unless later elevated. | DEFER_STATE_SPEC_UNLESS_ELEVATED | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 060 | /ops/sla | SLA and Escalation | `P1_AFTER_MVP` | Operations / Reference | `CommunicationExportOpsScreen` | Operations, product and QA | NORMAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-060-ops-sla.png` | `public/reference/page_ui_v3/clean_pages/PAGE-060-ops-sla.png` | YES | YES | YES | MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | P1 visual deferred; no MVP generation unless later elevated. | DEFER_STATE_SPEC_UNLESS_ELEVATED | STATIC_OR_VISUAL_ONLY_AUDIT_LATER | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 061 | /service-blueprint | Service Blueprint | `REFERENCE_ONLY` | Operations / Reference | `CommunicationExportOpsScreen` | Operations, product and QA | REFERENCE_ONLY_INTERNAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-061-service-blueprint.png` | `public/reference/page_ui_v3/clean_pages/PAGE-061-service-blueprint.png` | YES | YES | YES | REFERENCE_ONLY_ROUTE; MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Reference-only visual retained; no MVP product screen generation. | NO_PRODUCT_STATE_SCREEN_REQUIRED | REFERENCE_ONLY_NO_PRODUCT_INTERACTION_CONTRACT | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 062 | /roadmap | MVP vs Future Scope | `REFERENCE_ONLY` | Operations / Reference | `CommunicationExportOpsScreen` | Operations, product and QA | REFERENCE_ONLY_INTERNAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-062-roadmap.png` | `public/reference/page_ui_v3/clean_pages/PAGE-062-roadmap.png` | YES | YES | YES | REFERENCE_ONLY_ROUTE; MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Reference-only visual retained; no MVP product screen generation. | NO_PRODUCT_STATE_SCREEN_REQUIRED | REFERENCE_ONLY_NO_PRODUCT_INTERACTION_CONTRACT | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 063 | /states | State and Badge Reference | `REFERENCE_ONLY` | Operations / Reference | `CommunicationExportOpsScreen` | Operations, product and QA | REFERENCE_ONLY_INTERNAL_PAGE | `public/reference/page_ui_v3/clean_pages/PAGE-063-states.png` | `public/reference/page_ui_v3/clean_pages/PAGE-063-states.png` | YES | YES | YES | REFERENCE_ONLY_ROUTE; MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Reference-only visual retained; no MVP product screen generation. | NO_PRODUCT_STATE_SCREEN_REQUIRED | REFERENCE_ONLY_NO_PRODUCT_INTERACTION_CONTRACT | LOW / CONTEXTUAL | STATE_SCREEN_SPEC | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 064 | /kyc/:id/review | KYC / AML Review | `HOLD_PENDING_DECISION` | Advisory Workflow | `KycAmlWorkflowScreen` | Analyst and compliance | NORMAL_PAGE | `artifacts/imagegen/B-05/kyc-review/reference-app.png` | `NONE` | NO | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | BLOCKED_PENDING_SCOPE_AND_VISUAL_DECISION | NO_MVP_INTERACTION_CONTRACT_UNLESS_ELEVATED | EVIDENCE; CLIENT_VISIBILITY | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 065 | /kyc/:id/source-of-wealth | Source-of-Wealth Review | `HOLD_PENDING_DECISION` | Advisory Workflow | `KycAmlWorkflowScreen` | Analyst, advisor and compliance | NORMAL_PAGE | `artifacts/imagegen/B-05/source-of-wealth-review/reference-app.png` | `NONE` | NO | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | BLOCKED_PENDING_SCOPE_AND_VISUAL_DECISION | NO_MVP_INTERACTION_CONTRACT_UNLESS_ELEVATED | ADVICE_BOUNDARY; CLIENT_VISIBILITY | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 066 | /suitability/:tenantId/profile | Suitability Profile | `HOLD_PENDING_DECISION` | Advisory Workflow | `SuitabilityIpsScreen` | Analyst, advisor and compliance | NORMAL_PAGE | `artifacts/phase-c-suitability-ips/C-04-reference-screenshots/client-profile-reference-app.png` | `NONE` | NO | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | BLOCKED_PENDING_SCOPE_AND_VISUAL_DECISION | NO_MVP_INTERACTION_CONTRACT_UNLESS_ELEVATED | CLIENT_VISIBILITY | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 067 | /ips/:tenantId | IPS / Mandate | `HOLD_PENDING_DECISION` | Advisory Workflow | `SuitabilityIpsScreen` | Advisor and compliance | NORMAL_PAGE | `artifacts/phase-c-suitability-ips/C-04-reference-screenshots/documents-reference-app.png` | `NONE` | NO | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | BLOCKED_PENDING_SCOPE_AND_VISUAL_DECISION | NO_MVP_INTERACTION_CONTRACT_UNLESS_ELEVATED | CLIENT_VISIBILITY | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 068 | /reviews/calendar | Review Calendar | `P1_AFTER_MVP` | Operations / Reference | `ReviewMonitoringScreen` | Operations, analyst, advisor and QA | NORMAL_PAGE | `artifacts/phase-d-review-monitoring/D-04-reference-screenshots/ops-sla-reference-catalogue.png` | `NONE` | NO | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; P1_VISUAL_DEFERRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | P1 visual deferred; no MVP generation unless later elevated. | DEFER_STATE_SPEC_UNLESS_ELEVATED | DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | CLIENT_VISIBILITY | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 069 | /monitoring/rebalance | Rebalance Monitoring | `HOLD_PENDING_DECISION` | Advisory Workflow | `ReviewMonitoringScreen` | Analyst, advisor, operations and compliance | NORMAL_PAGE | `artifacts/phase-d-review-monitoring/D-04-reference-screenshots/signals-reference-catalogue.png` | `NONE` | NO | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | BLOCKED_PENDING_SCOPE_AND_VISUAL_DECISION | NO_MVP_INTERACTION_CONTRACT_UNLESS_ELEVATED | ADVICE_BOUNDARY; CLIENT_VISIBILITY | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 070 | /committee/reviews | Committee Review Queue | `HOLD_PENDING_DECISION` | Advisory Workflow | `CommitteeReviewScreen` | Committee chair, peer reviewer and senior wealth advisor | NORMAL_PAGE | `artifacts/phase-e-committee-peer-review/E-02-reference-screenshots/advisor-approval-reference-app.png` | `NONE` | NO | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | BLOCKED_PENDING_SCOPE_AND_VISUAL_DECISION | NO_MVP_INTERACTION_CONTRACT_UNLESS_ELEVATED | ADVICE_BOUNDARY; CLIENT_VISIBILITY | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |
| 071 | /committee/reviews/:id | Committee Review Detail | `HOLD_PENDING_DECISION` | Advisory Workflow | `CommitteeReviewScreen` | Committee chair, peer reviewer and senior wealth advisor | NORMAL_PAGE | `artifacts/phase-e-committee-peer-review/E-02-reference-screenshots/advisor-approval-detail-reference-app.png` | `NONE` | NO | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | BLOCKED_PENDING_SCOPE_AND_VISUAL_DECISION | NO_MVP_INTERACTION_CONTRACT_UNLESS_ELEVATED | ADVICE_BOUNDARY; CLIENT_VISIBILITY | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | NO_GENERATION; NO_CODE; NO_CODEX_TASKS |

## 8. Asset Universe Summary

| Asset / Route Universe | Count | Decision |
| --- | --- | --- |
| Registered route IDs | 71 | All `001–071` mapped exactly once. |
| Matched public clean PNG routes | 63 | Accept as visual references only; not behaviour proof. |
| Missing or unresolved visual refs | 8 | No generation; route downstream. |
| Manifest entries | 63 | Covers `001–063`; no entries for `064–071`. |
| Reference-only routes | 3 | `061–063`; retain as reference, not product proof. |
| Routes with non-public artifact refs | 8 | `064–071`; registered but referenced assets missing from ZIP. |

## 9. `001–063` Public Clean PNG Summary

| Route ID | Path | Scope | Component | Public Clean PNG | Clean PNG Exists? | Manifest? | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | /login | MVP_SUPPORT | AuthOnboardingScreen | public/reference/page_ui_v3/clean_pages/PAGE-001-login.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 002 | /mfa | MVP_SUPPORT | AuthOnboardingScreen | public/reference/page_ui_v3/clean_pages/PAGE-002-mfa.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 003 | /onboarding/invite | MVP_SUPPORT | AuthOnboardingScreen | public/reference/page_ui_v3/clean_pages/PAGE-003-onboarding-invite.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 004 | /onboarding/identity | MVP_SUPPORT | AuthOnboardingScreen | public/reference/page_ui_v3/clean_pages/PAGE-004-onboarding-identity.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 005 | /onboarding/consent | MVP_SUPPORT | AuthOnboardingScreen | public/reference/page_ui_v3/clean_pages/PAGE-005-onboarding-consent.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 006 | /onboarding/role-confirmation | MVP_SUPPORT | AuthOnboardingScreen | public/reference/page_ui_v3/clean_pages/PAGE-006-onboarding-role-confirmation.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 007 | /admin/platform | MVP_SUPPORT | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-007-admin-platform.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 008 | /admin/policies/advice-boundary | MVP | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-008-admin-policies-advice-boundary.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 009 | /admin/roles | MVP_SUPPORT | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-009-admin-roles.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 010 | /admin/security | MVP_SUPPORT | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-010-admin-security.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 011 | /admin/evidence-templates | MVP_SUPPORT | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-011-admin-evidence-templates.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 012 | /admin/export-templates | MVP_SUPPORT | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-012-admin-export-templates.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 013 | /admin/tenants | MVP_SUPPORT | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-013-admin-tenants.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 014 | /tenants/new | MVP_SUPPORT | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-014-tenants-new.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 015 | /tenants/:id/setup | MVP_SUPPORT | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-015-tenants-id-setup.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 016 | /tenants/:id/team | MVP_SUPPORT | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-016-tenants-id-team.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 017 | /tenants/:id/policies | MVP_SUPPORT | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-017-tenants-id-policies.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 018 | /tenants/:id/users | MVP_SUPPORT | AdminTenantSetupScreen | public/reference/page_ui_v3/clean_pages/PAGE-018-tenants-id-users.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 019 | /portal | MVP | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-019-portal.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 020 | /mobile | MVP | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-020-mobile.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 021 | /client/profile | MVP_SUPPORT | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-021-client-profile.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 022 | /client/family-members | MVP_SUPPORT | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-022-client-family-members.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 023 | /relationships | MVP_SUPPORT | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-023-relationships.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 024 | /entities | MVP_SUPPORT | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-024-entities.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 025 | /entities/new | MVP_SUPPORT | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-025-entities-new.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 026 | /entities/:id | MVP_SUPPORT | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-026-entities-id.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 027 | /documents | MVP | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-027-documents.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 028 | /documents/upload | MVP | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-028-documents-upload.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 029 | /documents/extraction-review | MVP | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-029-documents-extraction-review.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 030 | /documents/verification-pending | MVP | ClientIntakeScreen | public/reference/page_ui_v3/clean_pages/PAGE-030-documents-verification-pending.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 031 | /wealth-map | MVP_SUPPORT | WealthActionsScreen | public/reference/page_ui_v3/clean_pages/PAGE-031-wealth-map.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 032 | /actions | MVP_SUPPORT | WealthActionsScreen | public/reference/page_ui_v3/clean_pages/PAGE-032-actions.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 033 | /signals | MVP | InternalWorkflowScreen | public/reference/page_ui_v3/clean_pages/PAGE-033-signals.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 034 | /workbench | MVP | InternalWorkflowScreen | public/reference/page_ui_v3/clean_pages/PAGE-034-workbench.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 035 | /workbench/triggers/:id | MVP | InternalWorkflowScreen | public/reference/page_ui_v3/clean_pages/PAGE-035-workbench-triggers-id.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 036 | /advisor-approval | MVP | InternalWorkflowScreen | public/reference/page_ui_v3/clean_pages/PAGE-036-advisor-approval.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 037 | /advisor-approval/:id | MVP | InternalWorkflowScreen | public/reference/page_ui_v3/clean_pages/PAGE-037-advisor-approval-id.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 038 | /compliance | MVP | InternalWorkflowScreen | public/reference/page_ui_v3/clean_pages/PAGE-038-compliance.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 039 | /compliance/:id/review | MVP | InternalWorkflowScreen | public/reference/page_ui_v3/clean_pages/PAGE-039-compliance-id-review.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 040 | /compliance/:id/release | MVP | InternalWorkflowScreen | public/reference/page_ui_v3/clean_pages/PAGE-040-compliance-id-release.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 041 | /compliance/:id/block | MVP | DecisionsGovernanceScreen | public/reference/page_ui_v3/clean_pages/PAGE-041-compliance-id-block.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 042 | /compliance/:id/audit | MVP | DecisionsGovernanceScreen | public/reference/page_ui_v3/clean_pages/PAGE-042-compliance-id-audit.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 043 | /decisions | MVP | DecisionsGovernanceScreen | public/reference/page_ui_v3/clean_pages/PAGE-043-decisions.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 044 | /decisions/:id | MVP | DecisionsGovernanceScreen | public/reference/page_ui_v3/clean_pages/PAGE-044-decisions-id.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 045 | /decisions/:id/success | MVP | DecisionsGovernanceScreen | public/reference/page_ui_v3/clean_pages/PAGE-045-decisions-id-success.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 046 | /evidence | MVP | DecisionsGovernanceScreen | public/reference/page_ui_v3/clean_pages/PAGE-046-evidence.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 047 | /evidence/:id | MVP | DecisionsGovernanceScreen | public/reference/page_ui_v3/clean_pages/PAGE-047-evidence-id.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 048 | /governance/users | MVP | DecisionsGovernanceScreen | public/reference/page_ui_v3/clean_pages/PAGE-048-governance-users.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 049 | /governance/roles | MVP | DecisionsGovernanceScreen | public/reference/page_ui_v3/clean_pages/PAGE-049-governance-roles.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 050 | /governance/access-requests | MVP | DecisionsGovernanceScreen | public/reference/page_ui_v3/clean_pages/PAGE-050-governance-access-requests.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 051 | /governance/audit-history | MVP | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-051-governance-audit-history.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 052 | /communication | P1_AFTER_MVP | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-052-communication.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 053 | /communication/call-trigger | P1_AFTER_MVP | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-053-communication-call-trigger.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 054 | /export/new | MVP | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-054-export-new.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 055 | /export/:id/scope | MVP | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-055-export-id-scope.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 056 | /export/:id/redaction | MVP | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-056-export-id-redaction.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 057 | /export/:id/preview | MVP | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-057-export-id-preview.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 058 | /export/:id/download | MVP | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-058-export-id-download.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 059 | /ops/queues | P1_AFTER_MVP | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-059-ops-queues.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 060 | /ops/sla | P1_AFTER_MVP | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-060-ops-sla.png | YES | YES | Accept as visual reference only; not behaviour proof. |
| 061 | /service-blueprint | REFERENCE_ONLY | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-061-service-blueprint.png | YES | YES | Reference-only; not MVP product proof. |
| 062 | /roadmap | REFERENCE_ONLY | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-062-roadmap.png | YES | YES | Reference-only; not MVP product proof. |
| 063 | /states | REFERENCE_ONLY | CommunicationExportOpsScreen | public/reference/page_ui_v3/clean_pages/PAGE-063-states.png | YES | YES | Reference-only; not MVP product proof. |

## 10. `061–063` Reference-Only Treatment

| Route ID | Path | Title | Scope | Visual Status | Decision |
| --- | --- | --- | --- | --- | --- |
| 061 | /service-blueprint | Service Blueprint | REFERENCE_ONLY | REFERENCE_ONLY_ROUTE; MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Reference-only visual retained; no MVP product screen generation. |
| 062 | /roadmap | MVP vs Future Scope | REFERENCE_ONLY | REFERENCE_ONLY_ROUTE; MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Reference-only visual retained; no MVP product screen generation. |
| 063 | /states | State and Badge Reference | REFERENCE_ONLY | REFERENCE_ONLY_ROUTE; MATCHED_PUBLIC_CLEAN_PNG; MANIFEST_ENTRY_EXISTS; NOT_BEHAVIOUR_PROOF | Reference-only visual retained; no MVP product screen generation. |

Route `063 /states` is a reference/catalogue route. It does not prove route-level state-screen coverage for MVP routes.

## 11. `064–071` Unresolved / Non-Public Artifact Ref Register

| Route ID | Path | Title | Scope | Component | Registry Visual Ref | Referenced Asset Exists? | Manifest? | Visual Status | Decision | Downstream Routing |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 064 | /kyc/:id/review | KYC / AML Review | HOLD_PENDING_DECISION | KycAmlWorkflowScreen | artifacts/imagegen/B-05/kyc-review/reference-app.png | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 065 | /kyc/:id/source-of-wealth | Source-of-Wealth Review | HOLD_PENDING_DECISION | KycAmlWorkflowScreen | artifacts/imagegen/B-05/source-of-wealth-review/reference-app.png | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 066 | /suitability/:tenantId/profile | Suitability Profile | HOLD_PENDING_DECISION | SuitabilityIpsScreen | artifacts/phase-c-suitability-ips/C-04-reference-screenshots/client-profile-reference-app.png | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 067 | /ips/:tenantId | IPS / Mandate | HOLD_PENDING_DECISION | SuitabilityIpsScreen | artifacts/phase-c-suitability-ips/C-04-reference-screenshots/documents-reference-app.png | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 068 | /reviews/calendar | Review Calendar | P1_AFTER_MVP | ReviewMonitoringScreen | artifacts/phase-d-review-monitoring/D-04-reference-screenshots/ops-sla-reference-catalogue.png | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; P1_VISUAL_DEFERRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | P1 visual deferred; no MVP generation unless later elevated. | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 069 | /monitoring/rebalance | Rebalance Monitoring | HOLD_PENDING_DECISION | ReviewMonitoringScreen | artifacts/phase-d-review-monitoring/D-04-reference-screenshots/signals-reference-catalogue.png | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 070 | /committee/reviews | Committee Review Queue | HOLD_PENDING_DECISION | CommitteeReviewScreen | artifacts/phase-e-committee-peer-review/E-02-reference-screenshots/advisor-approval-reference-app.png | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 071 | /committee/reviews/:id | Committee Review Detail | HOLD_PENDING_DECISION | CommitteeReviewScreen | artifacts/phase-e-committee-peer-review/E-02-reference-screenshots/advisor-approval-detail-reference-app.png | NO | NO | REGISTERED_ROUTE_WITH_NON_PUBLIC_ARTIFACT_REF; REGISTERED_ROUTE_WITH_MISSING_ASSET; MANIFEST_ENTRY_MISSING; HOLD_VISUAL_DECISION_REQUIRED; NOT_BEHAVIOUR_PROOF; DO_NOT_GENERATE_YET | Hold visual decision; keep registered route; route to missing-screen/state decision log; no generation. | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |

## 12. Documentation / Support Asset Register

| Asset Class | Observed Path Pattern | Count | Classification | Allowed Use |
| --- | --- | --- | --- | --- |
| Contact sheets | public/reference/page_ui_v3/contact_sheets/*.jpg | 7 | DOC_SUPPORT_ASSET_ONLY; NOT_ROUTE_LEVEL_CLEAN_PNG | May support visual review; not primary route asset. |
| Annotated manual screenshots | docs/v3/user-manual-visual-process/annotated-screenshots/*.png | 10 | DOC_SUPPORT_ASSET_ONLY; NOT_ROUTE_LEVEL_CLEAN_PNG | Manual/process support only unless route-bound later. |
| Process graphics | docs/v3/user-manual-visual-process/process-graphics/*.{png,svg} | 20 | DOC_SUPPORT_ASSET_ONLY; NOT_ROUTE_LEVEL_CLEAN_PNG | Process support only; not route UI proof. |

Supporting assets may inform later visual review, but they are not primary route-level clean PNGs unless a later artefact explicitly validates them as such.

## 13. Visual Gaps and Non-Gaps

| Item | Decision | Reason |
| --- | --- | --- |
| `001–063` public clean PNGs | NON_GAP_FOR_VISUAL_REFERENCE | Matched public visual references exist. They are still not behaviour proof. |
| `061–063` clean PNGs | REFERENCE_ONLY_NON_GAP | Assets exist, but routes are reference-only and not MVP product surfaces. |
| `064–071` routes | NOT_ROUTE_GAP | Routes are registered. Do not call them absent. |
| `064–071` visual refs | VISUAL_ASSET_GAP | Registry refs point to non-public `artifacts/...` paths missing from uploaded ZIP. |
| Route `068` | P1_VISUAL_DEFERRED | It is in the unresolved visual-ref group but route scope is `P1_AFTER_MVP`, not hold. |
| Routes `064–067`, `069–071` | HOLD_VISUAL_DECISION_REQUIRED | Scope/safety/visual decisions remain unresolved. |
| Contact sheets/manual/process images | DOC_SUPPORT_ASSET_ONLY | Not route-level visual proof. |

## 14. State-Screen Dependency Summary

| State-Screen Dependency | Count |
| --- | --- |
| BLOCKED_PENDING_SCOPE_AND_VISUAL_DECISION | 7 |
| DEFER_STATE_SPEC_UNLESS_ELEVATED | 5 |
| NO_PRODUCT_STATE_SCREEN_REQUIRED | 3 |
| STATE_SCREEN_SPEC_REQUIRED_FOR_MVP_ROUTE | 31 |
| SUPPORT_STATE_COVERAGE_IF_FLOW_RELEVANT | 25 |

MVP routes require later `STATE_SCREEN_SPEC.md` coverage. MVP-support routes require state coverage only where setup/access/context affects the MVP journey. P1 and hold routes do not receive MVP state-screen generation or implementation decisions here.

## 15. Interaction Dependency Summary

| Interaction Dependency | Count |
| --- | --- |
| DRAWER_MODAL_OR_FEEDBACK_CONTRACT_REQUIRED | 35 |
| IMPLEMENTED_UPLOAD_MECHANICS_ONLY; evidence sufficiency still downstream | 1 |
| NO_MVP_INTERACTION_CONTRACT_UNLESS_ELEVATED | 7 |
| REFERENCE_ONLY_NO_PRODUCT_INTERACTION_CONTRACT | 3 |
| STATIC_OR_VISUAL_ONLY_AUDIT_LATER | 25 |

Interaction dependencies remain downstream. A visual drawer, modal, wizard, confirmation or preview state does not prove a user-triggered lifecycle, validation, API mutation, focus/escape handling, permission enforcement or audit persistence.

## 16. Safety Dependency Summary

| Safety Dependency | Count |
| --- | --- |
| ADVICE_BOUNDARY | 3 |
| ADVICE_BOUNDARY; AUDIT | 1 |
| ADVICE_BOUNDARY; CLIENT_VISIBILITY | 7 |
| ADVICE_BOUNDARY; CLIENT_VISIBILITY; AUDIT | 5 |
| AUDIT | 4 |
| CLIENT_VISIBILITY | 7 |
| EVIDENCE | 3 |
| EVIDENCE; AUDIT | 2 |
| EVIDENCE; CLIENT_VISIBILITY | 3 |
| EXPORT; AUDIT | 1 |
| EXPORT; CLIENT_VISIBILITY | 3 |
| EXPORT; CLIENT_VISIBILITY; AUDIT | 2 |
| LOW / CONTEXTUAL | 16 |
| RBAC/AUDIT | 12 |
| RBAC/AUDIT; CLIENT_VISIBILITY | 2 |

Safety dependencies must be handled by later RBAC/client-visibility/advice-boundary and evidence/audit/export contracts. This artefact only identifies where those dependencies attach to route/visual surfaces.

## 17. Downstream Routing Matrix

| Downstream Artefact | Number of Routes Routed | Reason |
| --- | --- | --- |
| DRAWER_MODAL_INTERACTION_CONTRACT | 36 | Routes with modal/drawer/wizard/confirmation/implemented upload mechanics need lifecycle contracts. |
| EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT | 38 | Evidence/audit/export-sensitive routes need sufficiency, persistence and redaction contracts. |
| FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT | 36 | Routes with actionable interactions need loading/success/error/validation semantics. |
| MISSING_SCREEN_STATE_SCREEN_DECISION_LOG | 8 | Missing, unresolved or held visual decisions route here before any generation brief. |
| RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT | 45 | Routes with RBAC/client/advice-boundary dependencies need safety contracts. |
| STATE_SCREEN_SPEC | 63 | Matched/accepted visual routes still need state-screen decisions where in scope. |

## 18. Stop Rules

* No implementation.
* No code changes.
* No route changes.
* No component changes.
* No API changes.
* No Prisma changes.
* No migrations.
* No tests.
* No Codex tasks.
* No final Codex handoff.
* No screen generation.
* No state-screen generation.
* No image generation.
* No visual replacement.
* No asset creation.
* No use of `main` as target codebase.
* No `main`-based gaps as target gaps.
* No blind patch-schema replacement.
* No assumption that 63 PNGs cover 71 routes.
* No assumption that `064–071` are absent.
* No assumption that `064–071` should be generated.
* No assumption that a visual asset proves interaction.
* No assumption that a visible drawer/modal proves lifecycle.
* No assumption that a button proves mutation.
* No assumption that a status chip proves a gate.
* No assumption that route presence equals MVP implementation readiness.
* No assumption that Codex may start.

## 19. Acceptance Criteria

| Criterion | Status |
| --- | --- |
| Roadmap position 3 of 15 confirmed | PASS |
| `MVP_SCOPE_LOCK.md` predecessor checked | PASS |
| `ROUTE_SCOPE_LOCK.md` predecessor checked | PASS |
| All 71 registered routes mapped exactly once | PASS |
| Scope labels preserved from route lock | PASS |
| 31 MVP routes mapped | PASS |
| 25 MVP_SUPPORT routes mapped | PASS |
| 5 P1_AFTER_MVP routes mapped | PASS |
| 3 REFERENCE_ONLY routes mapped | PASS |
| 7 HOLD_PENDING_DECISION routes mapped | PASS |
| `001–063` public PNGs mapped | PASS |
| `064–071` unresolved refs recorded | PASS |
| `061–063` reference-only treatment explicit | PASS |
| Route `068` kept as `P1_AFTER_MVP` | PASS |
| Visual ≠ behaviour warning included | PASS |
| State-screen dependencies routed | PASS |
| Interaction dependencies routed | PASS |
| Safety dependencies routed | PASS |
| No screen generation | PASS |
| No implementation | PASS |
| No Codex tasks | PASS |
| Final Codex handoff remains blocked | PASS |

## 20. Final Decision

`ROUTE_SCREEN_VISUAL_ASSET_MATRIX_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

The project may proceed to `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md`. Codex remains blocked. No screen, state-screen or image generation is allowed from this artefact. Routes `001–063` have accepted public clean visual references. Routes `061–063` are reference-only. Routes `064–071` are registered routes with unresolved/non-public visual references; they must be handled by scope/state/safety decisions before any generation brief is considered.

## 21. ENGINE Proof

### ENGINE_v3 Standard — All Phases

| Phase | Proof |
| --- | --- |
| Charter | The artefact is limited to route/screen/component/visual-asset mapping and downstream dependency routing. |
| Evidence | Route registry, manifest and ZIP asset existence were checked against `full-workflow`; predecessor route-scope labels were preserved. |
| Framing | The work separates route presence, route scope, visual reference, visual completeness, interaction proof and safety proof. |
| Divergence | Possible states were separated into matched PNG, reference-only, P1-deferred, hold/unresolved and documentation-support categories. |
| Contradictions | The artefact blocks both false route absence claims and false visual completeness claims. `064–071` exist as routes but their referenced assets are missing/non-public. |
| Branch Build | Every route has a matrix decision and downstream routing without making downstream implementation decisions. |
| Debate | MVP routes are accepted as visual references only; P1/hold/reference routes are not promoted. |
| Adversarial | The artefact explicitly rejects PNG-as-behaviour, drawer-as-lifecycle, button-as-mutation, status-chip-as-gate and test-existence-as-P0-proof overclaims. |
| Convergence | The final matrix preserves all 71 routes exactly once and prepares the next roadmap artefact. |
| Proof | Acceptance criteria confirm route count, scope counts, visual status coverage and stop-rule compliance. |
| Learning | The next learning step is the missing screen/state-screen decision log, not generation. |

### ENGINE_v2

| Method | Proof |
| --- | --- |
| Reframing | The prompt was executed as matrix creation, not visual production. |
| Map-vs-Reality | Map: MVP/route scope decisions. Reality: route registry, manifest and ZIP asset existence. |
| Decision Logic | Each route receives one scope label, one visual status set and one downstream routing decision. |
| Dependency Thinking | State, interaction and safety dependencies are routed to later artefacts in roadmap order. |
| Psycho-Logic | The artefact reduces decision friction by preventing panic-generation of `064–071` and preventing false confidence in `001–063`. |
| Sequencing | The artefact respects position 3 and enables position 4 without skipping any gate. |

### ENGINE_v2-B Implementation Handoff Discipline

| Discipline | Proof |
| --- | --- |
| Route precision | All route IDs `001–071`, paths, titles and groups are present. |
| Component precision | Every route is mapped to a screen component owner. |
| Asset precision | Every route has registry visual ref, public clean PNG status, manifest status and referenced asset status. |
| No implementation leakage | The artefact contains no code changes, route changes, API changes, Prisma changes, tests or Codex tasks. |
| Codex usability later | The matrix can feed later missing-screen, state-screen, interaction, safety, API, schema and test artefacts. |

### ENGINE_v2 Compression / Operational Layer

| Layer | Proof |
| --- | --- |
| Compact reuse | The artefact uses a single 71-route matrix plus focused summary registers. |
| Portable structure | The matrix columns can be reused by the next roadmap artefacts. |
| No hidden assumptions | Missing assets, reference-only pages and downstream blockers are explicit. |
| Operational clarity | All visual gaps are routed; no generation or Codex start is implied. |