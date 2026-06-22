# ROUTE_SCOPE_LOCK.md
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


## 1. Executive Decision

**Route scope lock status:** `ROUTE_SCOPE_LOCK_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

All **71 registered full-workflow routes** are classified exactly once. This artefact locks route scope only; it does not implement, generate screens, create state-screens, create images, modify code, create tests, create API contracts, change Prisma, create Codex tasks or prepare a final Codex handoff.

**Codex readiness status:** `CODEX_HANDOFF_NOT_READY`

The downstream artefact `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` may proceed because `MVP_SCOPE_LOCK.md` exists and has been used as the binding predecessor. Codex remains blocked until all roadmap artefacts and P0 gates are complete.

**Still blocked:** implementation, Codex tasks, final handoff, screen generation, state-screen generation, visual replacement/generation for `064–071`, API implementation, schema changes, migrations and test implementation.

## 2. Source-of-Truth Lock

| Rank | Source | Role | Use Allowed | Use Forbidden |
|---:|---|---|---|---|
| 1 | ALPHAVEST_CODEX_HANDOFF_PREPARATION_ROADMAP_v0.8.md | Roadmap control | Controls sequence, readiness gates, stop rules and artefact dependencies. | Bypassing sequence or starting Codex. |
| 2 | MVP_SCOPE_LOCK.md | Binding predecessor | Controls MVP product boundary, support/P1/hold/non-goal decisions and safety-critical P0 scope. | Inventing a conflicting MVP route scope. |
| 3 | ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md | Latest KB layer | Controls schema/domain/patch interpretation; full-workflow schema remains baseline. | Treating schema gate as passed or replacing schema. |
| 4 | ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md | Interaction reality layer | Controls implemented/partial/deterministic/static interaction distinction. | Treating visual UI as lifecycle proof. |
| 5 | ALPHAVEST_FULL_WORKFLOW_ROUTE_VISUAL_STATE_RECONCILIATION_v0.5.md | Route/visual/state layer | Controls 71-route universe, 63 PNG baseline and unresolved `064–071`. | Generating screens or treating 63 PNGs as 71-route coverage. |
| 6 | ALPHAVEST_FULL_WORKFLOW_READINESS_KNOWLEDGE_BASE_REBASE_v0.4.md | Readiness layer | Controls Codex-not-ready and open gate state. | Overclaiming file presence as readiness. |
| 7 | ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md | False-gap cleanup | Blocks `main` absence claims and stale task implications. | Target decisions from `main`. |
| 8 | ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md | Validated code inventory | Confirms 405 files, 71 routes, 4 APIs, 42 models, 10 specs and 63 PNGs. | Treating inventory as MVP safety proof. |
| 9 | ALPHAVEST_LIVING_KNOWLEDGE_BASE.md | KB protocol | Recovery/versioning and source hierarchy discipline. | Letting v0.1 override later layers. |
| 10 | control-spec concepts represented in bundled markdown artefacts; no patch archive included | Control Spec | Use for advice boundary, RBAC, visibility, workflow and acceptance gates. | Replacing target code/schema. |
| 11 | local repository checkout / pull of target branch full-workflow | Primary target codebase | Target source for routes, components, APIs, Prisma, tests and assets. | Assuming all present code is ready. |
| 12 | main branch as false-gap / historical only; never target truth | False-gap source only | Historical comparison only. | Any target truth or Codex task. |

## 3. Roadmap Position

| Field | Value |
|---|---|
| Artefact | `ROUTE_SCOPE_LOCK.md` |
| Position | 2 of 15 |
| Predecessor | `MVP_SCOPE_LOCK.md` |
| Predecessor status | Exists and used as binding input |
| Successor | `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` |
| Purpose | Classify all 71 registered full-workflow routes by MVP/P1/future/demo/reference/hold scope |
| Codex status | `CODEX_HANDOFF_NOT_READY` |

## 4. Input Artefacts

| Input | Role | Applied Decision |
|---|---|---|
| `MVP_SCOPE_LOCK.md` | Binding predecessor | MVP core is controlled human-backed workflow; auth/tenant/client context are support; communication/ops/review rhythm default P1; `064–071` sensitive routes remain held where unresolved. |
| `ALPHAVEST_CODEX_HANDOFF_PREPARATION_ROADMAP_v0.8.md` | Roadmap control | Position 2 follows MVP scope and precedes route-screen/visual matrix; no Codex handoff. |
| `ALPHAVEST_FULL_WORKFLOW_ROUTE_VISUAL_STATE_RECONCILIATION_v0.5.md` | Route baseline | 71 routes exist; `001–063` clean PNGs exist; `064–071` are registered with missing/non-public visual refs. |
| `ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md` | Interaction truth | Upload is strongest implemented interaction; many other routes remain partial/static/deterministic. |
| `ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md` | Schema/domain layer | Full schema remains baseline; safety concepts require later contracts. |
| `full-workflow` ZIP | Target codebase | Route registry and target component universe are target truth. |
| MVP patch ZIP | Control Spec | Advice/RBAC/visibility/evidence/audit/export principles only. |
| `main` ZIP | False-gap source | No target route scope derived from `main`. |

## 5. Route Scope Classification Method

Routes are classified by combining the binding MVP product boundary with full-workflow route reality. A route is not MVP merely because it exists. A visual asset is not behaviour proof. A partial/demo/static interaction is not final MVP behaviour. Safety-critical routes are allowed into MVP only as scoped proof-path routes whose later contracts and tests remain mandatory.

| Label | Meaning |
|---|---|
| `MVP` | Core MVP proof route for human-backed workflow, release, evidence, audit, RBAC, visibility or safe export. |
| `MVP_SUPPORT` | Supports MVP context, access, tenant/admin setup, client context or internal workflow context. |
| `P1_AFTER_MVP` | Useful after MVP but not required for the first MVP proof. |
| `FUTURE_STATE` | Outside the current MVP/P1 preparation boundary. |
| `DEMO_ONLY` | Demo narrative only. |
| `REFERENCE_ONLY` | Internal reference/catalogue/state/design page. |
| `HOLD_PENDING_DECISION` | Registered route with unresolved scope, visual, safety or behaviour decision. |
| `OUT_OF_SCOPE` | Excluded unless explicitly reopened. |

## 6. Route Scope Summary

| Scope Label | Count | Route IDs | Meaning |
|---|---:|---|---|
| `MVP` | 31 | 008, 019, 020, 027, 028, 029, 030, 033, 034, 035, 036, 037, 038, 039, 040, 041, 042, 043, 044, 045, 046, 047, 048, 049, 050, 051, 054, 055, 056, 057, 058 | Core MVP proof route for human-backed workflow, release, evidence, audit, RBAC, visibility or safe export. |
| `MVP_SUPPORT` | 25 | 001, 002, 003, 004, 005, 006, 007, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 021, 022, 023, 024, 025, 026, 031, 032 | Supports MVP context, access, tenant/admin setup, client context or internal workflow context. |
| `P1_AFTER_MVP` | 5 | 068, 052, 053, 059, 060 | Useful after MVP but not required for the first MVP proof. |
| `FUTURE_STATE` | 0 | — | Outside the current MVP/P1 preparation boundary. |
| `DEMO_ONLY` | 0 | — | Demo narrative only. |
| `REFERENCE_ONLY` | 3 | 061, 062, 063 | Internal reference/catalogue/state/design page. |
| `HOLD_PENDING_DECISION` | 7 | 064, 065, 066, 067, 069, 070, 071 | Registered route with unresolved scope, visual, safety or behaviour decision. |
| `OUT_OF_SCOPE` | 0 | — | Excluded unless explicitly reopened. |

## 7. Full 71-Route Scope Register

| Route ID | Path | Title | Group | Component | Audience | Scope Label | Reason | Safety Relevance | Visual Dependency | State-Screen Dependency | Interaction Dependency | Downstream Artefact Routing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 001 | `/login` | Authentication Login | Access | AuthOnboardingScreen | Invited users | `MVP_SUPPORT` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 002 | `/mfa` | Multi-Factor Authentication | Access | AuthOnboardingScreen | Invited users | `MVP_SUPPORT` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 003 | `/onboarding/invite` | Invitation Acceptance | Access | AuthOnboardingScreen | Invited users | `MVP_SUPPORT` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 004 | `/onboarding/identity` | Identity Setup | Access | AuthOnboardingScreen | Invited users | `MVP_SUPPORT` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 005 | `/onboarding/consent` | Consent and Privacy | Access | AuthOnboardingScreen | Invited users | `MVP_SUPPORT` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 006 | `/onboarding/role-confirmation` | Role Confirmation | Access | AuthOnboardingScreen | Invited users | `MVP_SUPPORT` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 007 | `/admin/platform` | Platform Settings | Platform / Admin | AdminTenantSetupScreen | Platform admin | `MVP_SUPPORT` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 008 | `/admin/policies/advice-boundary` | Advice Boundary Policy | Platform / Admin | AdminTenantSetupScreen | Compliance and platform admin | `MVP` | MVP safety policy route for advice-boundary control. | CLIENT_VISIBILITY; RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 009 | `/admin/roles` | Global Role Templates | Platform / Admin | AdminTenantSetupScreen | Platform admin | `MVP_SUPPORT` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 010 | `/admin/security` | Security Configuration | Platform / Admin | AdminTenantSetupScreen | Security officer | `MVP_SUPPORT` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 011 | `/admin/evidence-templates` | Evidence Templates | Platform / Admin | AdminTenantSetupScreen | Compliance and platform admin | `MVP_SUPPORT` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | EVIDENCE | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 012 | `/admin/export-templates` | Export Templates and Redaction | Platform / Admin | AdminTenantSetupScreen | Privacy and platform admin | `MVP_SUPPORT` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | EXPORT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 013 | `/admin/tenants` | Tenant List | Tenant Setup | AdminTenantSetupScreen | Ops admin and client success | `MVP_SUPPORT` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 014 | `/tenants/new` | Create Client Tenant | Tenant Setup | AdminTenantSetupScreen | Ops admin and client success | `MVP_SUPPORT` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT |
| 015 | `/tenants/:id/setup` | Tenant Setup Dashboard | Tenant Setup | AdminTenantSetupScreen | Client success and compliance | `MVP_SUPPORT` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT |
| 016 | `/tenants/:id/team` | Assign AlphaVest Team | Tenant Setup | AdminTenantSetupScreen | Client success and operations | `MVP_SUPPORT` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 017 | `/tenants/:id/policies` | Tenant Policies | Tenant Setup | AdminTenantSetupScreen | Compliance and client success | `MVP_SUPPORT` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | CLIENT_VISIBILITY; RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 018 | `/tenants/:id/users` | Tenant Users | Tenant Setup | AdminTenantSetupScreen | Client success and tenant admin | `MVP_SUPPORT` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 019 | `/portal` | Client Web Dashboard | Client Workspace | ClientIntakeScreen | Principal and family office users | `MVP` | Client-facing visibility surface; MVP must prove fail-closed released client information. | CLIENT_VISIBILITY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 020 | `/mobile` | Mobile Home | Client Workspace | ClientIntakeScreen | Principal and family office users | `MVP` | Client-facing visibility surface; MVP must prove fail-closed released client information. | CLIENT_VISIBILITY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 021 | `/client/profile` | Client Profile | Client Workspace | ClientIntakeScreen | Principal, family CFO and analyst | `MVP_SUPPORT` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 022 | `/client/family-members` | Family Members | Client Workspace | ClientIntakeScreen | Principal, family CFO and analyst | `MVP_SUPPORT` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 023 | `/relationships` | Relationship Map | Client Workspace | ClientIntakeScreen | Principal, family CFO and analyst | `MVP_SUPPORT` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 024 | `/entities` | Entity List | Client Workspace | ClientIntakeScreen | Principal, family CFO and advisor | `MVP_SUPPORT` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 025 | `/entities/new` | Create Entity | Client Workspace | ClientIntakeScreen | Principal, family CFO and advisor | `MVP_SUPPORT` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT |
| 026 | `/entities/:id` | Entity Detail | Client Workspace | ClientIntakeScreen | Principal, family CFO and advisor | `MVP_SUPPORT` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 027 | `/documents` | Documents List | Client Workspace | ClientIntakeScreen | Client, family CFO, analyst and compliance | `MVP` | Document/evidence intake and review route; MVP core requires evidence story without upload-to-release shortcut. | EVIDENCE | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 028 | `/documents/upload` | Document Upload | Client Workspace | ClientIntakeScreen | Client, family CFO and external advisor | `MVP` | Document/evidence intake and review route; MVP core requires evidence story without upload-to-release shortcut. | EVIDENCE | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Implemented upload mechanics; sufficiency still routed to safety/test contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 029 | `/documents/extraction-review` | Extraction Review | Client Workspace | ClientIntakeScreen | Client, family CFO and analyst | `MVP` | Document/evidence intake and review route; MVP core requires evidence story without upload-to-release shortcut. | EVIDENCE | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 030 | `/documents/verification-pending` | Verification Pending | Client Workspace | ClientIntakeScreen | Analyst and compliance | `MVP` | Document/evidence intake and review route; MVP core requires evidence story without upload-to-release shortcut. | EVIDENCE | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 031 | `/wealth-map` | Live Wealth Map | Wealth / Actions | WealthActionsScreen | Principal, family CFO, analyst and advisor | `MVP_SUPPORT` | Wealth/action context support; not a full live wealth engine or task management product. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT |
| 032 | `/actions` | Action Board | Wealth / Actions | WealthActionsScreen | Principal, analyst, advisor and client success | `MVP_SUPPORT` | Wealth/action context support; not a full live wealth engine or task management product. | CLIENT_VISIBILITY | Public clean PNG `001–063` exists; visual is not behaviour proof. | State coverage only where setup/access/context affects MVP route flow. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 033 | `/signals` | Signal Review | Advisory Workflow | InternalWorkflowScreen | System and analyst | `MVP` | Internal signal/draft/workbench route for human-backed workflow before approval. | ADVICE_BOUNDARY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 034 | `/workbench` | Consultant Workbench | Advisory Workflow | InternalWorkflowScreen | Analyst and advisor | `MVP` | Internal signal/draft/workbench route for human-backed workflow before approval. | ADVICE_BOUNDARY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 035 | `/workbench/triggers/:id` | Trigger Detail | Advisory Workflow | InternalWorkflowScreen | Analyst and advisor | `MVP` | Internal signal/draft/workbench route for human-backed workflow before approval. | ADVICE_BOUNDARY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 064 | `/kyc/:id/review` | KYC / AML Review | Advisory Workflow | KycAmlWorkflowScreen | Analyst and compliance | `HOLD_PENDING_DECISION` | KYC/source-of-wealth route exists but visual asset, scope and safety treatment remain unresolved. | CLIENT_VISIBILITY; EVIDENCE | `064–071` non-public/missing artifact reference; no generation allowed here. | Blocked until scope/safety/visual decision. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; MISSING_SCREEN_STATE_SCREEN_DECISION_LOG |
| 065 | `/kyc/:id/source-of-wealth` | Source-of-Wealth Review | Advisory Workflow | KycAmlWorkflowScreen | Analyst, advisor and compliance | `HOLD_PENDING_DECISION` | KYC/source-of-wealth route exists but visual asset, scope and safety treatment remain unresolved. | CLIENT_VISIBILITY; ADVICE_BOUNDARY; EVIDENCE | `064–071` non-public/missing artifact reference; no generation allowed here. | Blocked until scope/safety/visual decision. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT; MISSING_SCREEN_STATE_SCREEN_DECISION_LOG |
| 066 | `/suitability/:tenantId/profile` | Suitability Profile | Advisory Workflow | SuitabilityIpsScreen | Analyst, advisor and compliance | `HOLD_PENDING_DECISION` | Suitability/IPS route may be advice-sensitive; hold until advice-boundary and visual decisions. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | `064–071` non-public/missing artifact reference; no generation allowed here. | Blocked until scope/safety/visual decision. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; MISSING_SCREEN_STATE_SCREEN_DECISION_LOG |
| 067 | `/ips/:tenantId` | IPS / Mandate | Advisory Workflow | SuitabilityIpsScreen | Advisor and compliance | `HOLD_PENDING_DECISION` | Suitability/IPS route may be advice-sensitive; hold until advice-boundary and visual decisions. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | `064–071` non-public/missing artifact reference; no generation allowed here. | Blocked until scope/safety/visual decision. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; MISSING_SCREEN_STATE_SCREEN_DECISION_LOG |
| 068 | `/reviews/calendar` | Review Calendar | Operations / Reference | ReviewMonitoringScreen | Operations, analyst, advisor and QA | `P1_AFTER_MVP` | Review rhythm route is valuable after MVP; not first MVP core unless elevated by later safety contract. | CLIENT_VISIBILITY | `064–071` non-public/missing artifact reference; no generation allowed here. | State spec deferred unless later elevated. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 069 | `/monitoring/rebalance` | Rebalance Monitoring | Advisory Workflow | ReviewMonitoringScreen | Analyst, advisor, operations and compliance | `HOLD_PENDING_DECISION` | Rebalance monitoring could imply advice execution; hold until no-auto-advice proof. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | `064–071` non-public/missing artifact reference; no generation allowed here. | Blocked until scope/safety/visual decision. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; MISSING_SCREEN_STATE_SCREEN_DECISION_LOG |
| 036 | `/advisor-approval` | Advisor Approval Queue | Advisory Workflow | InternalWorkflowScreen | Senior wealth advisor | `MVP` | Advisor approval gate route; MVP requires human judgement before compliance release. | ADVICE_BOUNDARY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 037 | `/advisor-approval/:id` | Advisor Approval Detail | Advisory Workflow | InternalWorkflowScreen | Senior wealth advisor | `MVP` | Advisor approval gate route; MVP requires human judgement before compliance release. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 070 | `/committee/reviews` | Committee Review Queue | Advisory Workflow | CommitteeReviewScreen | Committee chair, peer reviewer and senior wealth advisor | `HOLD_PENDING_DECISION` | Committee review exists but route actions/static behaviour and visual assets remain unresolved. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | `064–071` non-public/missing artifact reference; no generation allowed here. | Blocked until scope/safety/visual decision. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; MISSING_SCREEN_STATE_SCREEN_DECISION_LOG |
| 071 | `/committee/reviews/:id` | Committee Review Detail | Advisory Workflow | CommitteeReviewScreen | Committee chair, peer reviewer and senior wealth advisor | `HOLD_PENDING_DECISION` | Committee review exists but route actions/static behaviour and visual assets remain unresolved. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | `064–071` non-public/missing artifact reference; no generation allowed here. | Blocked until scope/safety/visual decision. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; MISSING_SCREEN_STATE_SCREEN_DECISION_LOG |
| 038 | `/compliance` | Compliance Queue | Advisory Workflow | InternalWorkflowScreen | Compliance officer | `MVP` | Compliance review/release/block/audit route; MVP core safety gate. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 039 | `/compliance/:id/review` | Compliance Review Detail | Advisory Workflow | InternalWorkflowScreen | Compliance officer | `MVP` | Compliance review/release/block/audit route; MVP core safety gate. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 040 | `/compliance/:id/release` | Release to Client | Advisory Workflow | InternalWorkflowScreen | Compliance officer | `MVP` | Compliance review/release/block/audit route; MVP core safety gate. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 041 | `/compliance/:id/block` | Block or Request Evidence | Advisory Workflow | DecisionsGovernanceScreen | Compliance officer | `MVP` | Compliance review/release/block/audit route; MVP core safety gate. | CLIENT_VISIBILITY; ADVICE_BOUNDARY; EVIDENCE | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 042 | `/compliance/:id/audit` | Audit and Exception Log | Advisory Workflow | DecisionsGovernanceScreen | Compliance officer | `MVP` | Compliance review/release/block/audit route; MVP core safety gate. | ADVICE_BOUNDARY; RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 043 | `/decisions` | Decision List | Decisions / Evidence / Governance | DecisionsGovernanceScreen | Principal, family council and trustee | `MVP` | Decision record route for approved/released workflow outcomes. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 044 | `/decisions/:id` | Digital Decision Room | Decisions / Evidence / Governance | DecisionsGovernanceScreen | Principal, family council and trustee | `MVP` | Decision record route for approved/released workflow outcomes. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 045 | `/decisions/:id/success` | Decision Submitted | Decisions / Evidence / Governance | DecisionsGovernanceScreen | Principal, family council and trustee | `MVP` | Decision record route for approved/released workflow outcomes. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 046 | `/evidence` | Evidence Vault | Decisions / Evidence / Governance | DecisionsGovernanceScreen | Client, advisor, compliance and privacy | `MVP` | Evidence vault/detail route supporting auditability and proof readiness. | CLIENT_VISIBILITY; EVIDENCE | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 047 | `/evidence/:id` | Evidence Record Detail | Decisions / Evidence / Governance | DecisionsGovernanceScreen | Client, advisor, compliance and privacy | `MVP` | Evidence vault/detail route supporting auditability and proof readiness. | CLIENT_VISIBILITY; EVIDENCE | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 048 | `/governance/users` | Governance Users | Decisions / Evidence / Governance | DecisionsGovernanceScreen | Principal, admin, compliance and security | `MVP` | Governance/RBAC/audit route relevant to route/action/payload safety and admin non-bypass. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 049 | `/governance/roles` | Role Management | Decisions / Evidence / Governance | DecisionsGovernanceScreen | Principal, admin, compliance and security | `MVP` | Governance/RBAC/audit route relevant to route/action/payload safety and admin non-bypass. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 050 | `/governance/access-requests` | Access Requests | Decisions / Evidence / Governance | DecisionsGovernanceScreen | Principal, admin, compliance and security | `MVP` | Governance/RBAC/audit route relevant to route/action/payload safety and admin non-bypass. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 051 | `/governance/audit-history` | Access Audit History | Decisions / Evidence / Governance | CommunicationExportOpsScreen | Principal, admin, compliance and security | `MVP` | Governance/RBAC/audit route relevant to route/action/payload safety and admin non-bypass. | RBAC/AUDIT | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 052 | `/communication` | Communication Centre | Communication | CommunicationExportOpsScreen | Advisor, client success and client | `P1_AFTER_MVP` | Communication workflow is useful but not required for initial no-unapproved-advice proof. | CLIENT_VISIBILITY | Public clean PNG `001–063` exists; visual is not behaviour proof. | State spec deferred unless later elevated. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 053 | `/communication/call-trigger` | Call Trigger Matrix | Communication | CommunicationExportOpsScreen | Advisor and client success | `P1_AFTER_MVP` | Communication workflow is useful but not required for initial no-unapproved-advice proof. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State spec deferred unless later elevated. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX |
| 054 | `/export/new` | Create Export | Export | CommunicationExportOpsScreen | Principal, advisor, compliance and privacy | `MVP` | Client-safe export/redaction route for approved evidence/decision package. | CLIENT_VISIBILITY; EXPORT | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 055 | `/export/:id/scope` | Export Scope Selection | Export | CommunicationExportOpsScreen | Principal, advisor, compliance and privacy | `MVP` | Client-safe export/redaction route for approved evidence/decision package. | CLIENT_VISIBILITY; EXPORT | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | MVP action behaviour must be checked against v0.6 and later contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 056 | `/export/:id/redaction` | Export Redaction | Export | CommunicationExportOpsScreen | Principal, advisor, compliance and privacy | `MVP` | Client-safe export/redaction route for approved evidence/decision package. | CLIENT_VISIBILITY; EXPORT | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 057 | `/export/:id/preview` | Export Preview | Export | CommunicationExportOpsScreen | Principal, advisor, compliance and privacy | `MVP` | Client-safe export/redaction route for approved evidence/decision package. | CLIENT_VISIBILITY; EXPORT | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 058 | `/export/:id/download` | Export Download and Share | Export | CommunicationExportOpsScreen | Principal, advisor, compliance and privacy | `MVP` | Client-safe export/redaction route for approved evidence/decision package. | CLIENT_VISIBILITY; EXPORT | Public clean PNG `001–063` exists; visual is not behaviour proof. | STATE_SCREEN_SPEC required for MVP route states. | Needs interaction/feedback contract; visual mode is not lifecycle proof. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 059 | `/ops/queues` | Ops Queues | Operations / Reference | CommunicationExportOpsScreen | Operations, product and QA | `P1_AFTER_MVP` | Operational maturity route after MVP proof. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State spec deferred unless later elevated. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX |
| 060 | `/ops/sla` | SLA and Escalation | Operations / Reference | CommunicationExportOpsScreen | Operations, product and QA | `P1_AFTER_MVP` | Operational maturity route after MVP proof. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | State spec deferred unless later elevated. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX |
| 061 | `/service-blueprint` | Service Blueprint | Operations / Reference | CommunicationExportOpsScreen | Operations, product and QA | `REFERENCE_ONLY` | Reference/demo/catalogue route; not a product route for MVP implementation. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | No product state-screen required unless documentation needs it. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX |
| 062 | `/roadmap` | MVP vs Future Scope | Operations / Reference | CommunicationExportOpsScreen | Operations, product and QA | `REFERENCE_ONLY` | Reference/demo/catalogue route; not a product route for MVP implementation. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | No product state-screen required unless documentation needs it. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX |
| 063 | `/states` | State and Badge Reference | Operations / Reference | CommunicationExportOpsScreen | Operations, product and QA | `REFERENCE_ONLY` | Reference/demo/catalogue route; not a product route for MVP implementation. | LOW / CONTEXTUAL | Public clean PNG `001–063` exists; visual is not behaviour proof. | No product state-screen required unless documentation needs it. | No MVP interaction contract unless elevated. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX |

## 8. MVP Route Set

| Route ID | Path | Why MVP | MVP Core Rule Supported | Downstream Contract Dependency |
|---|---|---|---|---|
| 008 | `/admin/policies/advice-boundary` | MVP safety policy route for advice-boundary control. | Advice boundary policy / admin non-bypass | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 019 | `/portal` | Client-facing visibility surface; MVP must prove fail-closed released client information. | Fail-closed client visibility | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 020 | `/mobile` | Client-facing visibility surface; MVP must prove fail-closed released client information. | Fail-closed client visibility | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 027 | `/documents` | Document/evidence intake and review route; MVP core requires evidence story without upload-to-release shortcut. | Evidence/document intake | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 028 | `/documents/upload` | Document/evidence intake and review route; MVP core requires evidence story without upload-to-release shortcut. | Evidence/document intake without sufficiency shortcut | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 029 | `/documents/extraction-review` | Document/evidence intake and review route; MVP core requires evidence story without upload-to-release shortcut. | Evidence qualification | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 030 | `/documents/verification-pending` | Document/evidence intake and review route; MVP core requires evidence story without upload-to-release shortcut. | Evidence qualification | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 033 | `/signals` | Internal signal/draft/workbench route for human-backed workflow before approval. | Internal signal intake | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 034 | `/workbench` | Internal signal/draft/workbench route for human-backed workflow before approval. | Internal AI/rules draft preparation | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 035 | `/workbench/triggers/:id` | Internal signal/draft/workbench route for human-backed workflow before approval. | Analyst review / advisor routing | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 036 | `/advisor-approval` | Advisor approval gate route; MVP requires human judgement before compliance release. | Advisor approval | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 037 | `/advisor-approval/:id` | Advisor approval gate route; MVP requires human judgement before compliance release. | Advisor approval detail | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 038 | `/compliance` | Compliance review/release/block/audit route; MVP core safety gate. | Compliance queue | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 039 | `/compliance/:id/review` | Compliance review/release/block/audit route; MVP core safety gate. | Compliance review | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 040 | `/compliance/:id/release` | Compliance review/release/block/audit route; MVP core safety gate. | Compliance release | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 041 | `/compliance/:id/block` | Compliance review/release/block/audit route; MVP core safety gate. | Compliance block / evidence request | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 042 | `/compliance/:id/audit` | Compliance review/release/block/audit route; MVP core safety gate. | Audit visibility | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 043 | `/decisions` | Decision record route for approved/released workflow outcomes. | Decision record | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 044 | `/decisions/:id` | Decision record route for approved/released workflow outcomes. | Decision room | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 045 | `/decisions/:id/success` | Decision record route for approved/released workflow outcomes. | Decision success/confirmation | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 046 | `/evidence` | Evidence vault/detail route supporting auditability and proof readiness. | Evidence vault | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 047 | `/evidence/:id` | Evidence vault/detail route supporting auditability and proof readiness. | Evidence detail | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 048 | `/governance/users` | Governance/RBAC/audit route relevant to route/action/payload safety and admin non-bypass. | RBAC/governance user control | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 049 | `/governance/roles` | Governance/RBAC/audit route relevant to route/action/payload safety and admin non-bypass. | RBAC role control/admin non-bypass | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 050 | `/governance/access-requests` | Governance/RBAC/audit route relevant to route/action/payload safety and admin non-bypass. | Access request control | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 051 | `/governance/audit-history` | Governance/RBAC/audit route relevant to route/action/payload safety and admin non-bypass. | Audit history | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 054 | `/export/new` | Client-safe export/redaction route for approved evidence/decision package. | Export creation | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 055 | `/export/:id/scope` | Client-safe export/redaction route for approved evidence/decision package. | Export scope | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 056 | `/export/:id/redaction` | Client-safe export/redaction route for approved evidence/decision package. | Export redaction | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 057 | `/export/:id/preview` | Client-safe export/redaction route for approved evidence/decision package. | Export approval/preview | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 058 | `/export/:id/download` | Client-safe export/redaction route for approved evidence/decision package. | Export download/share safety | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |

## 9. MVP Support Route Set

| Route ID | Path | Why Support | Supports | Can Remain Partial/Static for MVP? | Downstream Dependency |
|---|---|---|---|---|---|
| 001 | `/login` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 002 | `/mfa` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 003 | `/onboarding/invite` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 004 | `/onboarding/identity` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 005 | `/onboarding/consent` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 006 | `/onboarding/role-confirmation` | Auth/onboarding shell supports controlled demo access and role context; not production IAM scope. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 007 | `/admin/platform` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 009 | `/admin/roles` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | MVP context/setup/client/internal workflow | PARTIAL ONLY; route has interaction/safety dependencies that must not be overclaimed. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 010 | `/admin/security` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | MVP context/setup/client/internal workflow | PARTIAL ONLY; route has interaction/safety dependencies that must not be overclaimed. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 011 | `/admin/evidence-templates` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 012 | `/admin/export-templates` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 013 | `/admin/tenants` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 014 | `/tenants/new` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT |
| 015 | `/tenants/:id/setup` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT |
| 016 | `/tenants/:id/team` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 017 | `/tenants/:id/policies` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 018 | `/tenants/:id/users` | Setup/admin/tenant support route for MVP context; safety-sensitive items are routed to later contracts. | MVP context/setup/client/internal workflow | PARTIAL ONLY; route has interaction/safety dependencies that must not be overclaimed. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 021 | `/client/profile` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | MVP context/setup/client/internal workflow | PARTIAL ONLY; route has interaction/safety dependencies that must not be overclaimed. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 022 | `/client/family-members` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 023 | `/relationships` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 024 | `/entities` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | MVP context/setup/client/internal workflow | YES, if it does not carry P0 release/visibility/evidence behaviour; safety-sensitive actions still need contracts. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 025 | `/entities/new` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | MVP context/setup/client/internal workflow | PARTIAL ONLY; route has interaction/safety dependencies that must not be overclaimed. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT |
| 026 | `/entities/:id` | Client/family/entity context support; useful for MVP story but not full family-office graph scope. | MVP context/setup/client/internal workflow | PARTIAL ONLY; route has interaction/safety dependencies that must not be overclaimed. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC |
| 031 | `/wealth-map` | Wealth/action context support; not a full live wealth engine or task management product. | MVP context/setup/client/internal workflow | PARTIAL ONLY; route has interaction/safety dependencies that must not be overclaimed. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT |
| 032 | `/actions` | Wealth/action context support; not a full live wealth engine or task management product. | MVP context/setup/client/internal workflow | PARTIAL ONLY; route has interaction/safety dependencies that must not be overclaimed. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; STATE_SCREEN_SPEC; DRAWER_MODAL_INTERACTION_CONTRACT; FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT; RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |

## 10. P1 / Future / Demo / Reference Route Set

### P1_AFTER_MVP

| Route ID | Path | Title | Reason |
|---|---|---|---|
| 068 | `/reviews/calendar` | Review Calendar | Review rhythm route is valuable after MVP; not first MVP core unless elevated by later safety contract. |
| 052 | `/communication` | Communication Centre | Communication workflow is useful but not required for initial no-unapproved-advice proof. |
| 053 | `/communication/call-trigger` | Call Trigger Matrix | Communication workflow is useful but not required for initial no-unapproved-advice proof. |
| 059 | `/ops/queues` | Ops Queues | Operational maturity route after MVP proof. |
| 060 | `/ops/sla` | SLA and Escalation | Operational maturity route after MVP proof. |

### FUTURE_STATE

| Route ID | Path | Title | Reason |
|---|---|---|---|
| — | — | — | No routes assigned in this artefact. |

### DEMO_ONLY

| Route ID | Path | Title | Reason |
|---|---|---|---|
| — | — | — | No routes assigned in this artefact. |

### REFERENCE_ONLY

| Route ID | Path | Title | Reason |
|---|---|---|---|
| 061 | `/service-blueprint` | Service Blueprint | Reference/demo/catalogue route; not a product route for MVP implementation. |
| 062 | `/roadmap` | MVP vs Future Scope | Reference/demo/catalogue route; not a product route for MVP implementation. |
| 063 | `/states` | State and Badge Reference | Reference/demo/catalogue route; not a product route for MVP implementation. |

### OUT_OF_SCOPE

| Route ID | Path | Title | Reason |
|---|---|---|---|
| — | — | — | No routes assigned in this artefact. |

## 11. Hold Pending Decision Register

| Route ID | Path | Hold Reason | Missing Decision | Safety Risk | Visual Risk | Required Downstream Artefact | Stop Rule |
|---|---|---|---|---|---|---|---|
| 064 | `/kyc/:id/review` | KYC/source-of-wealth route exists but visual asset, scope and safety treatment remain unresolved. | MVP vs P1 vs future route decision plus safety and visual treatment. | CLIENT_VISIBILITY; EVIDENCE | Missing/non-public public clean asset if `064–071`; otherwise visual readiness unresolved. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC/ADVICE/EVIDENCE contracts as relevant | No implementation, no screen generation, no Codex task. |
| 065 | `/kyc/:id/source-of-wealth` | KYC/source-of-wealth route exists but visual asset, scope and safety treatment remain unresolved. | MVP vs P1 vs future route decision plus safety and visual treatment. | CLIENT_VISIBILITY; ADVICE_BOUNDARY; EVIDENCE | Missing/non-public public clean asset if `064–071`; otherwise visual readiness unresolved. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC/ADVICE/EVIDENCE contracts as relevant | No implementation, no screen generation, no Codex task. |
| 066 | `/suitability/:tenantId/profile` | Suitability/IPS route may be advice-sensitive; hold until advice-boundary and visual decisions. | MVP vs P1 vs future route decision plus safety and visual treatment. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Missing/non-public public clean asset if `064–071`; otherwise visual readiness unresolved. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC/ADVICE/EVIDENCE contracts as relevant | No implementation, no screen generation, no Codex task. |
| 067 | `/ips/:tenantId` | Suitability/IPS route may be advice-sensitive; hold until advice-boundary and visual decisions. | MVP vs P1 vs future route decision plus safety and visual treatment. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Missing/non-public public clean asset if `064–071`; otherwise visual readiness unresolved. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC/ADVICE/EVIDENCE contracts as relevant | No implementation, no screen generation, no Codex task. |
| 069 | `/monitoring/rebalance` | Rebalance monitoring could imply advice execution; hold until no-auto-advice proof. | MVP vs P1 vs future route decision plus safety and visual treatment. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Missing/non-public public clean asset if `064–071`; otherwise visual readiness unresolved. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC/ADVICE/EVIDENCE contracts as relevant | No implementation, no screen generation, no Codex task. |
| 070 | `/committee/reviews` | Committee review exists but route actions/static behaviour and visual assets remain unresolved. | MVP vs P1 vs future route decision plus safety and visual treatment. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Missing/non-public public clean asset if `064–071`; otherwise visual readiness unresolved. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC/ADVICE/EVIDENCE contracts as relevant | No implementation, no screen generation, no Codex task. |
| 071 | `/committee/reviews/:id` | Committee review exists but route actions/static behaviour and visual assets remain unresolved. | MVP vs P1 vs future route decision plus safety and visual treatment. | CLIENT_VISIBILITY; ADVICE_BOUNDARY | Missing/non-public public clean asset if `064–071`; otherwise visual readiness unresolved. | ROUTE_SCREEN_VISUAL_ASSET_MATRIX; RBAC/ADVICE/EVIDENCE contracts as relevant | No implementation, no screen generation, no Codex task. |

## 12. Safety-Relevant Route Matrix

| Route ID | Path | RBAC | Client Visibility | Advice Boundary | Evidence | Audit | Export | Admin Non-Bypass | Required Contract |
|---|---|---|---|---|---|---|---|---|---|
| 001 | `/login` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 002 | `/mfa` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 003 | `/onboarding/invite` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 004 | `/onboarding/identity` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 005 | `/onboarding/consent` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 006 | `/onboarding/role-confirmation` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 007 | `/admin/platform` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | YES | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 008 | `/admin/policies/advice-boundary` | YES | YES | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 009 | `/admin/roles` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | YES | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 010 | `/admin/security` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | YES | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 011 | `/admin/evidence-templates` | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 012 | `/admin/export-templates` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 013 | `/admin/tenants` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 014 | `/tenants/new` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 015 | `/tenants/:id/setup` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 016 | `/tenants/:id/team` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 017 | `/tenants/:id/policies` | YES | YES | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 018 | `/tenants/:id/users` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 019 | `/portal` | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 020 | `/mobile` | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 021 | `/client/profile` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 022 | `/client/family-members` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 023 | `/relationships` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 024 | `/entities` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 025 | `/entities/new` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 026 | `/entities/:id` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 027 | `/documents` | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 028 | `/documents/upload` | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 029 | `/documents/extraction-review` | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 030 | `/documents/verification-pending` | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 031 | `/wealth-map` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 032 | `/actions` | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 033 | `/signals` | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 034 | `/workbench` | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 035 | `/workbench/triggers/:id` | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 064 | `/kyc/:id/review` | NO/LOW | YES | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 065 | `/kyc/:id/source-of-wealth` | NO/LOW | YES | YES | YES | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 066 | `/suitability/:tenantId/profile` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 067 | `/ips/:tenantId` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 068 | `/reviews/calendar` | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 069 | `/monitoring/rebalance` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 036 | `/advisor-approval` | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 037 | `/advisor-approval/:id` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 070 | `/committee/reviews` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 071 | `/committee/reviews/:id` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 038 | `/compliance` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 039 | `/compliance/:id/review` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 040 | `/compliance/:id/release` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 041 | `/compliance/:id/block` | NO/LOW | YES | YES | YES | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 042 | `/compliance/:id/audit` | YES | NO/LOW | YES | NO/LOW | YES | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 043 | `/decisions` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 044 | `/decisions/:id` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 045 | `/decisions/:id/success` | NO/LOW | YES | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 046 | `/evidence` | NO/LOW | YES | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 047 | `/evidence/:id` | NO/LOW | YES | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 048 | `/governance/users` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | YES | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 049 | `/governance/roles` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | YES | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 050 | `/governance/access-requests` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | YES | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 051 | `/governance/audit-history` | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 052 | `/communication` | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT |
| 053 | `/communication/call-trigger` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 054 | `/export/new` | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 055 | `/export/:id/scope` | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 056 | `/export/:id/redaction` | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 057 | `/export/:id/preview` | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 058 | `/export/:id/download` | NO/LOW | YES | NO/LOW | NO/LOW | NO/LOW | YES | NO/LOW | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT; EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT |
| 059 | `/ops/queues` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 060 | `/ops/sla` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 061 | `/service-blueprint` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 062 | `/roadmap` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |
| 063 | `/states` | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | NO/LOW | None unless elevated |

## 13. Visual / Screen Dependency Matrix

| Route ID | Path | Clean PNG Status | `064–071` Risk? | Needs Visual Matrix? | Needs Missing Screen Decision? | Generation Allowed Now? |
|---|---|---|---|---|---|---|
| 001 | `/login` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 002 | `/mfa` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 003 | `/onboarding/invite` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 004 | `/onboarding/identity` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 005 | `/onboarding/consent` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 006 | `/onboarding/role-confirmation` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 007 | `/admin/platform` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 008 | `/admin/policies/advice-boundary` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 009 | `/admin/roles` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 010 | `/admin/security` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 011 | `/admin/evidence-templates` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 012 | `/admin/export-templates` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 013 | `/admin/tenants` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 014 | `/tenants/new` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 015 | `/tenants/:id/setup` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 016 | `/tenants/:id/team` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 017 | `/tenants/:id/policies` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 018 | `/tenants/:id/users` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 019 | `/portal` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 020 | `/mobile` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 021 | `/client/profile` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 022 | `/client/family-members` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 023 | `/relationships` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 024 | `/entities` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 025 | `/entities/new` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 026 | `/entities/:id` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 027 | `/documents` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 028 | `/documents/upload` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 029 | `/documents/extraction-review` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 030 | `/documents/verification-pending` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 031 | `/wealth-map` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 032 | `/actions` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 033 | `/signals` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 034 | `/workbench` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 035 | `/workbench/triggers/:id` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 064 | `/kyc/:id/review` | NO: non-public/missing artifact reference | YES | YES | YES, if MVP/HOLD after visual matrix | NO |
| 065 | `/kyc/:id/source-of-wealth` | NO: non-public/missing artifact reference | YES | YES | YES, if MVP/HOLD after visual matrix | NO |
| 066 | `/suitability/:tenantId/profile` | NO: non-public/missing artifact reference | YES | YES | YES, if MVP/HOLD after visual matrix | NO |
| 067 | `/ips/:tenantId` | NO: non-public/missing artifact reference | YES | YES | YES, if MVP/HOLD after visual matrix | NO |
| 068 | `/reviews/calendar` | NO: non-public/missing artifact reference | YES | YES | NO unless later elevated | NO |
| 069 | `/monitoring/rebalance` | NO: non-public/missing artifact reference | YES | YES | YES, if MVP/HOLD after visual matrix | NO |
| 036 | `/advisor-approval` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 037 | `/advisor-approval/:id` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 070 | `/committee/reviews` | NO: non-public/missing artifact reference | YES | YES | YES, if MVP/HOLD after visual matrix | NO |
| 071 | `/committee/reviews/:id` | NO: non-public/missing artifact reference | YES | YES | YES, if MVP/HOLD after visual matrix | NO |
| 038 | `/compliance` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 039 | `/compliance/:id/review` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 040 | `/compliance/:id/release` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 041 | `/compliance/:id/block` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 042 | `/compliance/:id/audit` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 043 | `/decisions` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 044 | `/decisions/:id` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 045 | `/decisions/:id/success` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 046 | `/evidence` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 047 | `/evidence/:id` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 048 | `/governance/users` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 049 | `/governance/roles` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 050 | `/governance/access-requests` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 051 | `/governance/audit-history` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 052 | `/communication` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 053 | `/communication/call-trigger` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 054 | `/export/new` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 055 | `/export/:id/scope` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 056 | `/export/:id/redaction` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 057 | `/export/:id/preview` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 058 | `/export/:id/download` | YES: public clean PNG exists | NO | YES | YES, if MVP/HOLD after visual matrix | NO |
| 059 | `/ops/queues` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 060 | `/ops/sla` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 061 | `/service-blueprint` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 062 | `/roadmap` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |
| 063 | `/states` | YES: public clean PNG exists | NO | YES | NO unless later elevated | NO |

## 14. Interaction Dependency Matrix

| Route ID | Path | Interaction Reality from v0.6 | Scope Impact | Needs Drawer/Modal Contract? | Needs Feedback/Error Contract? |
|---|---|---|---|---|---|
| 001 | `/login` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 002 | `/mfa` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | YES | YES |
| 003 | `/onboarding/invite` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 004 | `/onboarding/identity` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 005 | `/onboarding/consent` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | YES | YES |
| 006 | `/onboarding/role-confirmation` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 007 | `/admin/platform` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | YES | YES |
| 008 | `/admin/policies/advice-boundary` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 009 | `/admin/roles` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | YES | YES |
| 010 | `/admin/security` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | YES | YES |
| 011 | `/admin/evidence-templates` | PARTIAL or static route action behaviour; verify before Codex. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 012 | `/admin/export-templates` | PARTIAL or static route action behaviour; verify before Codex. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 013 | `/admin/tenants` | PARTIAL or static route action behaviour; verify before Codex. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 014 | `/tenants/new` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 015 | `/tenants/:id/setup` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 016 | `/tenants/:id/team` | PARTIAL or static route action behaviour; verify before Codex. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 017 | `/tenants/:id/policies` | PARTIAL or static route action behaviour; verify before Codex. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 018 | `/tenants/:id/users` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | YES | YES |
| 019 | `/portal` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 020 | `/mobile` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 021 | `/client/profile` | PARTIAL or static route action behaviour; verify before Codex. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 022 | `/client/family-members` | PARTIAL or static route action behaviour; verify before Codex. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 023 | `/relationships` | PARTIAL or static route action behaviour; verify before Codex. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 024 | `/entities` | PARTIAL or static route action behaviour; verify before Codex. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 025 | `/entities/new` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 026 | `/entities/:id` | PARTIAL or static route action behaviour; verify before Codex. | MVP_SUPPORT route scope does not prove implementation behaviour. | NO/conditional | YES |
| 027 | `/documents` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 028 | `/documents/upload` | IMPLEMENTED_INTERACTION for upload mechanics only; evidence sufficiency unproven. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 029 | `/documents/extraction-review` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 030 | `/documents/verification-pending` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 031 | `/wealth-map` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | MVP_SUPPORT route scope does not prove implementation behaviour. | YES | YES |
| 032 | `/actions` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP_SUPPORT route scope does not prove implementation behaviour. | YES | YES |
| 033 | `/signals` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 034 | `/workbench` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 035 | `/workbench/triggers/:id` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 064 | `/kyc/:id/review` | PARTIAL or static route action behaviour; verify before Codex. | HOLD_PENDING_DECISION route scope does not prove implementation behaviour. | NO/conditional | YES |
| 065 | `/kyc/:id/source-of-wealth` | PARTIAL or static route action behaviour; verify before Codex. | HOLD_PENDING_DECISION route scope does not prove implementation behaviour. | NO/conditional | YES |
| 066 | `/suitability/:tenantId/profile` | PARTIAL or static route action behaviour; verify before Codex. | HOLD_PENDING_DECISION route scope does not prove implementation behaviour. | NO/conditional | YES |
| 067 | `/ips/:tenantId` | PARTIAL or static route action behaviour; verify before Codex. | HOLD_PENDING_DECISION route scope does not prove implementation behaviour. | NO/conditional | YES |
| 068 | `/reviews/calendar` | PARTIAL or static route action behaviour; verify before Codex. | P1_AFTER_MVP route scope does not prove implementation behaviour. | NO/conditional | NO unless elevated |
| 069 | `/monitoring/rebalance` | PARTIAL or static route action behaviour; verify before Codex. | HOLD_PENDING_DECISION route scope does not prove implementation behaviour. | NO/conditional | YES |
| 036 | `/advisor-approval` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 037 | `/advisor-approval/:id` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 070 | `/committee/reviews` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | HOLD_PENDING_DECISION route scope does not prove implementation behaviour. | NO/conditional | YES |
| 071 | `/committee/reviews/:id` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | HOLD_PENDING_DECISION route scope does not prove implementation behaviour. | NO/conditional | YES |
| 038 | `/compliance` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 039 | `/compliance/:id/review` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 040 | `/compliance/:id/release` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | YES | YES |
| 041 | `/compliance/:id/block` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | YES | YES |
| 042 | `/compliance/:id/audit` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 043 | `/decisions` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 044 | `/decisions/:id` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | YES | YES |
| 045 | `/decisions/:id/success` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 046 | `/evidence` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | YES | YES |
| 047 | `/evidence/:id` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 048 | `/governance/users` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | YES | YES |
| 049 | `/governance/roles` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | YES | YES |
| 050 | `/governance/access-requests` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | YES | YES |
| 051 | `/governance/audit-history` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | YES | YES |
| 052 | `/communication` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | P1_AFTER_MVP route scope does not prove implementation behaviour. | NO/conditional | NO unless elevated |
| 053 | `/communication/call-trigger` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | P1_AFTER_MVP route scope does not prove implementation behaviour. | NO/conditional | NO unless elevated |
| 054 | `/export/new` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 055 | `/export/:id/scope` | PARTIAL or static route action behaviour; verify before Codex. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 056 | `/export/:id/redaction` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | NO/conditional | YES |
| 057 | `/export/:id/preview` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | YES | YES |
| 058 | `/export/:id/download` | PARTIALLY_IMPLEMENTED_INTERACTION or DETERMINISTIC_VISUAL_STATE; lifecycle not fully proven. | MVP route scope does not prove implementation behaviour. | YES | YES |
| 059 | `/ops/queues` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | P1_AFTER_MVP route scope does not prove implementation behaviour. | NO/conditional | NO unless elevated |
| 060 | `/ops/sla` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | P1_AFTER_MVP route scope does not prove implementation behaviour. | NO/conditional | NO unless elevated |
| 061 | `/service-blueprint` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | REFERENCE_ONLY route scope does not prove implementation behaviour. | NO/conditional | NO unless elevated |
| 062 | `/roadmap` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | REFERENCE_ONLY route scope does not prove implementation behaviour. | NO/conditional | NO unless elevated |
| 063 | `/states` | STATIC_SCREEN_STATE or visual/reference surface; not behaviour proof. | REFERENCE_ONLY route scope does not prove implementation behaviour. | NO/conditional | NO unless elevated |

## 15. Downstream Artefact Routing

| Downstream Artefact | What This Route Lock Passes Forward |
|---|---|
| `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` | Use this route scope lock as the input universe; map all 71 routes to component, asset and visual status; no generation. |
| `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` | Use MVP/HOLD routes to decide which screens/state-screens are missing, deferred or not required. |
| `STATE_SCREEN_SPEC.md` | Specify states primarily for MVP and safety-relevant MVP_SUPPORT routes; do not promote P1/HOLD silently. |
| `DRAWER_MODAL_INTERACTION_CONTRACT.md` | Use routes with modal/drawer/confirmation visual modes and v0.6 partial/static findings. |
| `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Cover MVP and safety-sensitive support/hold routes with explicit validation/loading/success/error semantics. |
| `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Prioritise client routes, advisory workflow, governance/RBAC and export routes; include held KYC/suitability/committee only if later elevated. |
| `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Prioritise documents, evidence, compliance block/release, audit and export routes. |
| `API_CONTRACT_MATRIX.md` | Use route scope to decide which existing APIs need MVP/P0 contracts; do not invent APIs here. |
| `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | Use safety-relevant route scope to drive field-level mapping after safety/API contracts. |
| `P0_TEST_ACCEPTANCE_MATRIX.md` | Map MVP safety routes to existing and missing negative tests. |
| `SCREEN_GENERATION_BRIEF_IF_NEEDED.md` | Only consider generation if prior visual/state decision logs require it; `064–071` remain no-generation here. |
| `FINAL_CODEX_TASK_MASTER.md` | Blocked until all contracts/gates are complete; may later use this route scope as task filter. |
| `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` | Blocked; Codex cannot start from this artefact. |

## 16. Stop Rules

* No implementation.
* No Codex tasks.
* No final Codex handoff.
* No code changes.
* No route-registry changes.
* No API implementation.
* No Prisma/schema/migration changes.
* No test implementation.
* No screen generation.
* No state-screen generation.
* No image generation.
* No visual treatment decision for `064–071` beyond route-scope hold/defer classification.
* No `main` target truth.
* No patch-schema replacement.
* No claim that route existence equals MVP scope.
* No claim that a PNG proves behaviour.
* No claim that a drawer/modal primitive proves route-level lifecycle.
* No claim that document upload proves evidence sufficiency.
* No claim that existing tests prove full P0 safety.
* No client-visible AI draft.
* No manual visibility override.
* No admin bypass.
* No upload-to-release shortcut.
* No export without redaction/approval proof.

## 17. Acceptance Criteria

| Criterion | Status |
|---|---|
| All 71 routes classified | `PASS` |
| `MVP_SCOPE_LOCK.md` used | `PASS` |
| `full-workflow` target enforced | `PASS` |
| `main` blocked | `PASS` |
| `064–071` treated as registered but unresolved | `PASS` |
| No screen generation | `PASS` |
| No Codex tasks | `PASS` |
| No implementation | `PASS` |
| Safety routes identified | `PASS` |
| Downstream routing clear | `PASS` |
| Every route has exactly one scope label | `PASS` |
| Final Codex handoff remains blocked | `PASS` |

## 18. Final Decision

`ROUTE_SCOPE_LOCK.md` is **accepted with downstream dependencies**.

The next preparation artefact, `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md`, may proceed. Codex remains blocked. `064–071` remain registered routes with unresolved/missing/non-public visual references; no generation is allowed from this artefact.

## 19. ENGINE Proof

### ENGINE_v3 Standard — All Phases

| Phase | Proof |
|---|---|
| Source-of-truth control | v0.8 roadmap, `MVP_SCOPE_LOCK.md`, v0.7–v0.2 KB layers, full-workflow target, MVP patch Control Spec and `main` false-gap status were applied in hierarchy. |
| Evidence discipline | All 71 registered routes were classified from full-workflow route reality, while presence was not overclaimed as readiness. |
| Contradiction control | The artefact prevents both false absence claims and overcompletion claims: routes/APIs/schema/tests exist, but Codex remains blocked. |
| False-positive protection | It blocks route-exists-equals-MVP, PNG-as-behaviour, modal-as-lifecycle, upload-as-sufficiency and tests-as-full-P0-proof assumptions. |
| Gap classification | Held routes, especially `064–071`, remain explicit with reasons and downstream dependencies. |
| Stop-rule protection | Implementation, generation, schema/API/test changes, Codex tasks and final handoff remain forbidden. |
| Final QA | Every route has one label; summary counts match 71; downstream routing is explicit. |

### ENGINE_v2

| Method | Proof |
|---|---|
| Reframing | The task is route scope locking, not implementation or visual production. |
| Map-vs-Reality | MVP product boundary is separated from full-workflow route/code reality. |
| Decision logic | Each route receives a scope label, reason, safety relevance and routing path. |
| Sequencing | Position 2 follows `MVP_SCOPE_LOCK.md` and passes only route scope into the visual matrix. |
| Psycho-Logic | The artefact reduces false confidence and Codex drift by preventing premature implementation and ambiguous held-route handling. |
| Dependency thinking | Route decisions now feed visual, state, interaction, safety, API, schema and test artefacts without solving them prematurely. |

### ENGINE_v2-B Implementation Handoff Discipline

| Discipline | Proof |
|---|---|
| Precise route references | Every route has ID, path, title, group, component, audience, scope, safety and downstream routing. |
| No implementation leakage | The artefact creates no tasks, no code, no changes and no final handoff. |
| Target-codebase correctness | `full-workflow` is target; `main` is blocked as false-gap source only. |
| Future Codex usability | The route scope can later filter Codex tasks after all gates/contracts are complete. |

### ENGINE_v2 Compression / Operational Layer

| Compression Rule | Proof |
|---|---|
| Portable | The artefact is self-contained Markdown. |
| Reusable | Downstream artefact routing is explicit and sequence-safe. |
| Compact but complete | It gives full 71-route classification without implementation detail. |
| Codex-safe | Final Codex handoff remains blocked. |
