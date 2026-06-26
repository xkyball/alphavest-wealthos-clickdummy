# ALPHAVEST_V0_96_WP09_GOVERNANCE_ADMIN_NON_BYPASS_UX_DEEP_TASK_DESCRIPTION.md

**Generated:** 2026-06-23  
**Prompt executed:** Prompt 10 — WP-09 Deep Task Description  
**Work Package:** `WP-09 — Governance / Admin Non-Bypass UX`  
**Mode:** Deep Codex-ready task-description artefact only. No implementation. No code changes. No screen generation. No image generation. No Codex tickets created.  
**ENGINE mix:** ENGINE_v3 for KB/UX/IA discovery and contradiction control; ENGINE_v2 for operational tasking, gates, acceptance, tests and stop rules; Codex-Spark-like convergence for direct implementation instructions.

---

## 1. Executive Task Decision

**Decision:** `WP09_GOVERNANCE_ADMIN_NON_BYPASS_UX_DEEP_TASK_READY_FOR_CODEX_DESCRIPTION_USE`

This artefact defines the detailed Codex-ready task description for **WP-09 — Governance / Admin Non-Bypass UX**.

The task is to make AlphaVest governance and admin surfaces truthful, bounded and non-bypassable:

> Admin users may configure tenants, users, roles, policies and access requests, but they must never visually or functionally appear able to bypass advice, evidence, compliance, client-visibility, audit or export gates.

This WP is part of the V0.96 Core Journey + UX/IA Refactor release. It supports the V0.96 proof spine, especially:

- `MJ-010` — Admin role change cannot bypass compliance release.
- `MJ-006` — Cross-tenant access denied with audit proof.
- `MJ-001` — New family office onboarding to first client-safe decision.
- `MJ-005` — Export package with forbidden internal payload redaction.

The implementation posture is strict:

```text
Admin power is governance-scoped.
Admin route access is not advisory payload access.
Admin role change is not client visibility.
Admin policy configuration is not compliance release.
Admin action success is not safety gate completion.
```

This WP does **not** authorize a full IAM rewrite, production identity provider integration, new broad admin platform, new role model, blind Prisma replacement, P1/HOLD route elevation, screen generation or visual redesign. It authorizes Codex to harden existing governance/admin surfaces, state feedback, interaction lifecycles, service/API permission use and P0 tests inside the V0.96 journey path.

---

## 2. Source-of-Truth Lock

| Rank | Source | Trust Level | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current `full-workflow` repo / checkout | Highest code truth after WP-00 rebase | Target files, routes, services, APIs, components, schema and tests | Assuming older KB counts are current |
| 2 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | Binding Prompt-00 UX/IA intake | UI/UX/IA evidence register, WP mapping, refactor-now decisions | Treating evidence register as implemented code |
| 3 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Binding WP source | WP-09 goal, target files, UI/UX implications, tests and stop rules | Treating WP source as implementation proof |
| 4 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Binding core safety contract | Route/action/object/payload separation, admin non-bypass, AI Draft internal-only, client-safe-only payloads | Weakening non-bypass rules for admin convenience |
| 5 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Binding safety contract | Admin cannot force evidence sufficiency, suppress audit, bypass redaction or force export release | Treating audit/export/evidence UI as proof |
| 6 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Binding no-overclaim feedback contract | Admin-denied copy, blocked states, disabled action semantics, no success overclaim | Showing success text that implies gate bypass |
| 7 | `DRAWER_MODAL_INTERACTION_CONTRACT.md` | Binding interaction contract | Role drawer, access request modal, second confirmation, cancel/submit/error lifecycle | Treating visible drawer/modal as behaviour proof |
| 8 | `STATE_SCREEN_SPEC.md` | Binding state contract | Permission denied, blocked, validation failed, audit unavailable, disabled gated action states | Generating state-screen images |
| 9 | `API_CONTRACT_MATRIX.md` | Binding API contract | Existing API hardening, request validation, safe errors, no route-access-equals-payload rule | Creating API sprawl without proof |
| 10 | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | Binding schema contract | Full-workflow schema baseline, `Role`, `Permission`, `UserRole`, `AccessRequest`, `SecondConfirmation`, `AuditEvent` mapping | Blind patch schema replacement |
| 11 | `P0_TEST_ACCEPTANCE_MATRIX.md` | Binding acceptance contract | Existing tests are proof slices; missing admin-bypass negatives are blockers | Claiming current tests close P0 governance gate |
| 12 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md` / `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey/product control | `MJ-010`, `MJ-006`, providerless mapped user/tenant/role foundation | Pulling P1/HOLD journeys into WP-09 |
| 13 | `main` / `alphavest-wealthos-clickdummy-main.zip` | False-gap only | Historical warning | Any target implementation task |

**Hard lock:** `full-workflow` is target reality. `main` remains false-gap only. Markdown artefacts are control and safety evidence, not code truth. Codex must re-check current code in WP-00 before applying this WP.

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | Task Implication | Must Refactor Now? |
|---|---|---|---|---|---|---|
| Admin may not bypass advice, compliance, evidence, audit, visibility or export gates. | RBAC / Client Visibility / Advice Boundary Contract; MVP Scope Lock | Governance/admin routes, `WP-09` | Safety / non-bypass | Critical | Remove or disable any UI/API affordance that suggests forced release, forced visibility, forced evidence sufficiency, audit suppression or export bypass. | Yes |
| Route access is not action permission, and action permission is not payload visibility. | RBAC Contract | Admin roles, tenant users, governance users, access requests | RBAC / payload separation | Critical | Admin UI must separate visible route shell, allowed governance action, object scope and payload visibility. | Yes |
| Admin power is governance-scoped, not advisory authority. | Mega Journey `MJ-010`, Journey Requirements Matrix | Admin platform, roles, access requests | Product/Journey safety | Critical | UI copy and grouping must frame admin as configuration/governance, not superuser release/control. | Yes |
| Role changes must not grant client/advice payload visibility by implication. | RBAC Contract, P0 Test Matrix | `/admin/roles`, `/governance/roles`, `UserRole`, `RolePermission` | RBAC / overclaim | Critical | Role drawers must show scope, expiry, object limits and non-bypass consequences. | Yes |
| Access request approval must not bypass evidence/compliance/export gates. | RBAC Contract, Evidence/Audit/Export Contract | `/governance/access-requests` | Workflow gate | Critical | Access request UI must show what is granted and explicitly what remains blocked. | Yes |
| Sensitive admin actions require second confirmation and audit. | Drawer/Modal Contract, Evidence/Audit/Export Contract | `/admin/security`, `/admin/roles`, `/governance/roles` | Interaction / audit | High/Critical | Second-confirmation lifecycle must include validation, loading, failure, audit-required and denied states. | Yes |
| Admin denied states need explicit non-bypass explanation. | Feedback / Validation / Error State Contract | Permission denied / blocked admin actions | Microcopy / safety education | High | Show copy such as “Admins cannot release advice or override compliance gates.” | Yes |
| Governance screens risk becoming long, dense superuser dashboards. | UX/IA Evidence Register, V0.96 UX/IA Task Pack | Admin screens, governance screens | IA / layout / density | High | Refactor into governance workbench: summary, queue/table, detail drawer, clear primary CTA per state. | Yes |
| Buttons and status chips are not gate proof. | Interaction Reality Audit, Feedback Contract | Role/action buttons, permission chips, admin status chips | Visual-only proof | High | Buttons must derive from permission and precondition checks; chips must reflect actual state source. | Yes |
| Audit timeline visibility is not audit persistence proof. | Evidence/Audit/Export Contract | Governance audit history, admin action audit | Audit truth | High | Governance changes and denied attempts must be source-backed with audit event refs. | Yes |
| Client-facing data must remain hidden/redacted even for admin previews unless scoped. | Client Visibility / Advice Boundary Contract | Admin previews, user detail, portal/mobile | Client visibility / leakage | Critical | Admin screens may not leak client-safe projection internals or internal advice payload through preview. | Yes |
| P1/HOLD routes must not be elevated during governance work. | Route Scope Lock / Screen Generation Brief | Review monitoring, committee, KYC/suitability | Scope control | High | Governance UI may mention future scopes only as disabled/deferred; no implementation scope expansion. | Yes |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must re-check the current `full-workflow` repo after WP-00. The following files and areas are likely relevant but must be classified before editing.

| Area | Files / Modules to Inspect | Required Classification |
|---|---|---|
| Admin setup surfaces | `components/admin-tenant-setup-screen.tsx` | `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `BLOCKED` |
| Governance surfaces | `components/decisions-governance-screen.tsx` | Determine routes/users/roles/access/audit handling and static vs real states |
| App shell / navigation interaction | `components/sidebar.tsx`, `components/top-bar.tsx`, `components/page-header.tsx`, `components/app-shell.tsx` | Confirm how admin/governance sections are labelled and grouped |
| Shared primitives | `components/ui/modal.tsx`, `components/ui/drawer.tsx`, `components/ui/data-table.tsx`, `components/ui/state-panel.tsx`, `components/ui/audit-timeline.tsx`, `components/ui/guarded-action-button.tsx` if present | Determine lifecycle, a11y, table states, guarded action behaviour |
| Permission services | `lib/permission-engine.ts`, `lib/control-layer/*`, `lib/visibility-engine.ts` | Verify route/action/object/payload separation |
| Admin read models | `lib/admin-tenant-readmodel-service.ts` if present, any `governance` / `admin` read model service | Verify admin data surfaces do not leak payloads |
| Audit services | `lib/audit-service.ts`, `lib/typed-workflow-command-bus.ts` | Verify role changes, denied attempts and access requests write audit |
| Workflow gates | `lib/workflow-gate.ts`, `lib/evidence-service.ts`, `lib/export-service.ts` | Ensure admin cannot call or imply gate transitions |
| APIs | `app/api/admin-tenants/route.ts` if present, `deleted generic workflow route`, any `app/api/*governance*`, `app/api/*audit*`, `app/api/*role*`, `app/api/*access*` routes | Verify validation, RBAC, safe errors, non-bypass semantics |
| Schema | `prisma/schema.prisma` models: `User`, `Role`, `Permission`, `RolePermission`, `UserRole`, `AccessRequest`, `SecondConfirmation`, `AuditEvent`, `PolicyDefinition`, `ClientTenant` | Verify field support; no blind replacement |
| Tests | `tests/governance-non-bypass.spec.ts`, `tests/permission-engine.spec.ts`, `tests/control-layer-actor-scope.spec.ts`, `tests/confirmation-lifecycle.spec.ts`, `tests/p0-*`, `tests/true-ux-*` if present | Reuse/harden tests; add only when missing |

**Required WP-09 pre-edit output:** Before editing, Codex must update the moving-baseline register with admin/governance UI/API/service/test reality and mark each target as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING` or `BLOCKED`.

---

## 5. WP Problem Statement

The current AlphaVest UI risks making admin and governance areas look like broad control panels. That is dangerous because AlphaVest’s MVP trust model depends on human-backed, evidence-backed and compliance-gated decisions. Admins can configure governance context, but they must not appear to have product authority to force advice release, evidence sufficiency, client visibility, audit suppression or export redaction bypass.

The core UI/UX/IA problem is not visual style. It is semantic truth:

```text
Admin screens must communicate governance boundaries.
Admin actions must be scoped, audited and permission-controlled.
Admin success must not imply downstream advisory gates are complete.
```

Therefore WP-09 must refactor governance/admin surfaces into clear governance workbenches with scoped actions, denied states, second confirmations, audit evidence and no-overclaim microcopy.

---

## 6. V0.96 Journey Role

| Journey | WP-09 Role |
|---|---|
| `MJ-010 — Admin role change cannot bypass compliance release` | Primary journey proof. Demonstrates admin can change governance context but cannot force client release or bypass gates. |
| `MJ-006 — Cross-tenant access denied with audit proof` | Ensures wrong-tenant/wrong-object admin actions fail closed and are audited. |
| `MJ-001 — New FO onboarding to first client-safe decision` | Provides tenant/user/role foundation without expanding admin power into advisory workflow. |
| `MJ-002 — Evidence missing to client upload to release` | Ensures admin cannot mark uploaded evidence sufficient or release client visibility directly. |
| `MJ-005 — Export package with forbidden internal payload redaction` | Ensures admin/export template authority cannot bypass redaction or approval gates. |

WP-09 is a P0 safety work package because a single admin-bypass affordance would undermine the entire V0.96 trust story.

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | Governance/Admin Manifestation | Required Refactor |
|---|---|---|
| Route-catalog navigation | Admin/Governance routes may appear as independent screens rather than a governance journey. | Group as `Governance & Access Control`, with sub-areas for tenant setup, roles, access requests, audit history and policy boundaries. |
| Weak page jobs | Admin pages may not clearly state what they do and what they cannot do. | Page headers must include page job, scope boundary, current gate/status and primary next step. |
| Superuser dashboard impression | Admin panels may imply broad platform authority. | Add boundary copy: “Configuration only — advisory release remains compliance-gated.” |
| Too many equal CTAs | Role/access pages may have many buttons with unclear priority. | One primary CTA per state; destructive/safety-sensitive actions require confirmation. |
| Long page sprawl | Role/user/access/policy details may be stacked into long pages. | Use summary-first layout, scannable table/list and detail drawer/modal with lifecycle. |
| Empty/unused space | Admin pages with few items may feel unfinished. | Meaningful empty states: “No pending access requests”, “No role changes awaiting confirmation”, “No denied bypass attempts recorded.” |
| Visual-only modals/drawers | Role permission modal / second confirmation may exist but not persist/validate. | Bind lifecycle: open, validate, submit, loading, success, failure, denied, audit result. |
| Status chips as proof | “Active”, “Approved”, “Admin” chips may imply authority. | Chips must reflect source-backed state and include scope/limits where safety relevant. |
| Missing non-bypass copy | Denied admin actions may be generic. | Explain specific boundary: “Admins cannot release advice or mark evidence sufficient.” |
| Payload leakage through admin preview | Admin detail views may expose client/advice payload by admin status alone. | Preview only scoped governance metadata; hide/redact internal advisory payloads. |
| Audit display overclaim | Governance history may be static. | Show source-backed audit event refs or explicit unavailable state. |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### 8.1 Changes Now

| Scope | Included Work |
|---|---|
| IA | Reframe admin/governance navigation and page semantics as governance workbench, not route catalogue or superuser console. |
| UI Layout | Summary-first admin pages, table/detail pattern, role/access detail drawers, clear status and blockers. |
| CTA Logic | One primary action per state; destructive or sensitive actions use second confirmation. |
| Permission UX | Denied, disabled and hidden action states based on route/action/object/payload checks. |
| Admin Non-Bypass Copy | Explicit copy for release/evidence/visibility/export/audit boundaries. |
| Governance Actions | Role change, access request approval/denial, second confirmation and audit-required states. |
| Audit | Audit event references for governance actions and denied bypass attempts. |
| Tests | P0 positive and negative admin non-bypass tests plus True-UX assertions for copy/layout/disabled states. |

### 8.2 Stays Out

| Out-of-Scope Item | Reason |
|---|---|
| Production IAM / SSO / external auth provider | V0.96 uses providerless mapped users/tenants/roles; production IAM is later. |
| Full policy authoring platform | WP-09 hardens MVP governance surfaces only. |
| New role hierarchy product design | Use existing schema/permission-engine baseline unless WP-00 proves a concrete gap. |
| Committee review governance | Routes `070–071` remain HOLD/P2 unless separately unlocked. |
| KYC/SoW/Suitability/IPS governance | Routes `064–067` remain HOLD/P2. |
| Broad redesign | Only UX/IA/layout refactor where admin/governance surfaces are touched. |
| New screen/image generation | Explicitly blocked. |
| Blind Prisma replacement | Schema alignment only; route schema issues to WP-14. |

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| `WP09-T00-BASELINE-RECHECK` | Recheck current governance/admin code reality before edits. | Older KB counts may be stale; WP-00 must control implementation baseline. | `components/admin-tenant-setup-screen.tsx`, `components/decisions-governance-screen.tsx`, `lib/permission-engine.ts`, `app/api/*`, `tests/*governance*`, `tests/*permission*` | Inventory current admin/governance routes, components, services, APIs and tests. Classify each as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `BLOCKED`. | Moving-baseline register updated before implementation. | No new tests; evidence register / baseline output. | Indirect: identifies surfaces requiring UX/IA refactor. | No edits before baseline classification. |
| `WP09-T01-GOVERNANCE-CAPABILITY-TAXONOMY` | Define what admins can and cannot do in code-facing task language. | Admin UI needs precise boundaries. | WP source, RBAC contract, `permission-engine`, schema models | Create/verify taxonomy: tenant setup, role management, access requests, policy configuration, audit view = allowed; release/evidence sufficiency/client visibility/export bypass/audit suppression = denied. | Taxonomy documented and referenced by UI/API/tests. | P0 admin non-bypass tests later reference taxonomy. | Yes: taxonomy drives page headers and copy. | Stop if task defines admin as unrestricted superuser. |
| `WP09-T02-ADMIN-IA-PAGE-HEADER-REFRACTOR` | Refactor admin/governance pages into journey-first governance workbench IA. | Navigation/page headers must avoid route-catalog and superuser impression. | `sidebar.tsx`, `top-bar.tsx`, `page-header.tsx`, `admin-tenant-setup-screen.tsx`, `decisions-governance-screen.tsx`, `route-registry.ts` | Group admin routes around governance jobs. Add/adjust page headers with job, scope boundary, blocker and next step. Preserve route scope labels. | Admin/governance surfaces explain what they do and what they cannot do. | True-UX navigation/page-header test. | Yes: IA, page jobs, boundary copy. | Do not reclassify P1/HOLD/reference routes. |
| `WP09-T03-ROLE-ACCESS-LIST-DETAIL-PATTERN` | Convert role/user/access surfaces into scannable table/list + detail drawer pattern. | Long pages and too much equal detail create poor governance UX. | `admin-tenant-setup-screen.tsx`, `decisions-governance-screen.tsx`, `DataTable`, `Drawer`, `StatePanel` | Show summary metrics, active scope, pending requests and denied attempts. Move role/user/access detail into drawer/modal with lifecycle. Add empty/loading/error/permission states. | Pages are summary-first and not endless sprawl; detail is accessible but scoped. | True-UX density/layout tests if present; new `admin-governance-ux.spec.ts`. | Yes: layout/density/table/detail refactor. | Do not hide critical blockers only inside collapsed detail. |
| `WP09-T04-ROLE-SCOPE-DRAWER` | Ensure role and access drawers show scope, expiry, object/tenant boundaries and consequences. | Role change may be misunderstood as payload/release authority. | `components/ui/drawer.tsx`, role/access UI, `UserRole`, `RolePermission`, `AccessRequest` usage | Add scope blocks: tenant, object, action, sensitivity, expiry, approval status, second confirmation requirement. Add “Does not grant” section for release/evidence/export/client visibility. | User can understand granted and non-granted powers. | UI assertion for role drawer boundaries. | Yes: drawer content architecture and microcopy. | Stop if role drawer implies client visibility or compliance release authority. |
| `WP09-T05-SECOND-CONFIRMATION-LIFECYCLE` | Harden second confirmation for sensitive governance actions. | Sensitive role/policy/access actions need explicit confirmation and audit. | `Modal`, `SecondConfirmation`, `permission-engine`, `audit-service`, `confirmation-lifecycle.spec.ts` | Add confirmation phrase/checkbox where required; validate phrase; show loading/success/error/denied/audit state; cancel preserves state. | Sensitive admin action cannot complete without valid confirmation and audit. | `pnpm playwright test tests/confirmation-lifecycle.spec.ts`; governance test updates. | Yes: modal lifecycle, validation and a11y. | Stop if modal simply closes and implies success. |
| `WP09-T06-DENIED-ADMIN-BYPASS-UX` | Add explicit denied states for attempted gate bypass actions. | Admin non-bypass must be understandable and testable. | Governance/admin components; guarded action button; permission engine; workflow/export/evidence services | For denied attempts, show blocked state and reason. Examples: admin cannot release advice, mark evidence sufficient, force client visibility, approve export without redaction, suppress audit. | Denied admin actions are blocked, audited and explained. | `tests/governance-non-bypass.spec.ts`; P0 negative tests. | Yes: blocked/denied copy and state panels. | Stop if denied action is hidden without audit where attempt occurs; stop if allowed silently. |
| `WP09-T07-ROUTE-ACTION-PAYLOAD-SEPARATION` | Enforce and expose route/action/object/payload separation in admin surfaces. | Route access cannot expand payload visibility. | `permission-engine.ts`, `visibility-engine.ts`, admin APIs, governance components | Verify route shell checks, action checks, object scope checks and payload projection checks are separate. UI should show route access while disabling/denying actions as needed. | Admin route access does not reveal or allow unauthorized payload/action. | `tests/control-layer-actor-scope.spec.ts`, `tests/permission-engine.spec.ts`, client leakage tests. | Yes: disabled/hidden/permission states. | Stop if route access equals payload access. |
| `WP09-T08-ACCESS-REQUEST-WORKFLOW-UX` | Harden access request approval/denial UX. | Access request approval must not bypass downstream gates. | `/governance/access-requests`, `AccessRequest`, `permission-engine`, `audit-service` | Show request reason, requested object/action, scope, risk, approver, expiry, decision state and audit status. Approved access grants only described scope. Denied access records reason. | Access request workflow is scoped, auditable and non-bypassable. | Access request positive/negative tests. | Yes: workbench table/detail, one CTA per request state. | Stop if access approval grants release/evidence/export authority indirectly. |
| `WP09-T09-ADMIN-PREVIEW-REDACTION` | Prevent admin screens from previewing internal advisory/client data beyond scope. | Admin status alone must not expose client/advice payload. | admin read models, `visibility-engine`, `client-safe projection`, governance components | Audit what admin previews render. Redact/hide AI drafts, internal rationale, analyst notes, compliance notes, unreleased evidence and client-safe projections unless role/object permits. | Admin cannot see internal advisory payload by being admin only. | Payload visibility negative tests. | Yes: redacted/hidden preview UI. | Stop if admin previews raw recommendation/advice/compliance content without role scope. |
| `WP09-T10-AUDIT-GOVERNANCE-ACTIONS` | Ensure governance actions and denied attempts write audit events. | Audit proof is part of non-bypass story. | `audit-service`, `permission-engine`, `AccessRequest`, `RolePermission`, API routes, audit UI | Write audit for role changes, access approvals/denials, policy changes, second confirmation, denied bypass attempts. Surface audit refs in UI. | Governance actions have source-backed audit proof. | `tests/governance-non-bypass.spec.ts`, audit tests. | Yes: audit-required / recorded / unavailable states. | Stop if audit write failure allows sensitive action to complete. |
| `WP09-T11-GOVERNANCE-COPY-NO-OVERCLAIM` | Normalize admin/governance microcopy. | Copy must prevent false interpretation of admin power. | Component copy, constants, feedback components | Replace vague success messages with scoped success. Examples: “Role updated for tenant setup. Compliance release remains gated.” “Access approved for document review only.” | Feedback names exact action and explicitly avoids downstream gate claims. | Microcopy/true-UX tests. | Yes: no-overclaim microcopy. | Stop if success message implies release/visibility/evidence/export gate completion. |
| `WP09-T12-API-SAFE-ERRORS-AND-VALIDATION` | Harden admin/governance API responses used by UI. | API presence is not safety proof. | `app/api/admin-tenants/route.ts`, `deleted generic workflow route`, any governance/role/access APIs | Validate actor, tenant, object, action and confirmation. Return safe errors without sensitive payload. Do not advance state on error. | APIs support truthful UI states and no leakage. | API validation + negative tests. | Indirect: UI gets safe errors and states. | Stop if API returns raw internals or advances state after denied/error. |
| `WP09-T13-P0-ADMIN-NON-BYPASS-TESTS` | Add/update P0 positive and negative tests for governance/admin. | Existing tests are proof slices only. | `tests/governance-non-bypass.spec.ts`, `tests/permission-engine.spec.ts`, `tests/control-layer-actor-scope.spec.ts`, `tests/confirmation-lifecycle.spec.ts`, `tests/true-ux-*` | Add positives for allowed role/access governance actions. Add negatives for admin force release, mark evidence sufficient, force visibility, approve export bypass, suppress audit, cross-tenant access. Add UI copy assertions. | P0 non-bypass gate has explicit proof. | Named specs listed in Section 16. | Yes: True-UX assertions for denied copy, disabled CTAs, scope drawers. | Stop if tests only check route headings. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### 10.1 Routes

| Route ID | Path | WP-09 Relevance | UI / Safety Treatment |
|---|---|---|---|
| `007` | `/admin/platform` | Platform setup/configuration. | Show configuration boundary; no release/evidence/export authority. |
| `008` | `/admin/policies/advice-boundary` | Advice boundary policy. | Policy config only; no manual advice release. |
| `009` | `/admin/roles` | Global role templates. | Role scope, permissions, second confirmation, non-bypass copy. |
| `010` | `/admin/security` | Security configuration. | Sensitive changes require confirmation/audit; no safety bypass. |
| `011` | `/admin/evidence-templates` | Evidence template config. | Templates do not mark evidence sufficient. |
| `012` | `/admin/export-templates` | Export template/redaction config. | Templates do not approve export or bypass redaction. |
| `013` | `/admin/tenants` | Tenant list/context. | Tenant-scoped visibility; no cross-tenant payload leak. |
| `014` | `/tenants/new` | Tenant creation. | Setup only; no advisory/payload authority. |
| `015` | `/tenants/:id/setup` | Tenant setup dashboard. | Activation cannot bypass evidence/release gates. |
| `016` | `/tenants/:id/team` | Assign team. | Assignment does not grant release authority unless role/action/object gates pass. |
| `017` | `/tenants/:id/policies` | Tenant policies. | Scoped policy config; no manual visibility override. |
| `018` | `/tenants/:id/users` | Tenant users. | Invite/manage users with explicit scope; no payload expansion. |
| `048` | `/governance/users` | Governance user management. | Scannable table/detail, role state, denied/action states. |
| `049` | `/governance/roles` | Role management. | Role drawer, second confirmation, audit-required. |
| `050` | `/governance/access-requests` | Access requests. | Approve/deny scoped access only; no downstream gate bypass. |
| `051` | `/governance/audit-history` | Governance audit history. | Source-backed audit for admin actions and denied bypass attempts. |
| `040`, `041`, `057`, `058` | Release/block/export routes | Negative non-bypass proof. | Admin attempts to force these are denied/audited. |
| `019`, `020` | Client portal/mobile | Negative payload proof. | Admin changes must not cause client-visible leakage. |

### 10.2 Components

| Component | Treatment |
|---|---|
| `components/admin-tenant-setup-screen.tsx` | Refactor admin setup surfaces into scoped governance/configuration pages with boundary copy and truthful states. |
| `components/decisions-governance-screen.tsx` | Harden governance users/roles/access/audit surfaces with table/detail, denied states and audit refs. |
| `components/sidebar.tsx`, `components/top-bar.tsx`, `components/page-header.tsx` | Support journey-first governance grouping and page-job clarity. |
| `components/ui/modal.tsx` | Second-confirmation and sensitive-action lifecycle. |
| `components/ui/drawer.tsx` | Role/access detail lifecycle and scope explanation. |
| `components/ui/data-table.tsx` | Governance lists with loading/empty/error/permission states. |
| `components/ui/state-panel.tsx` | Denied/blocked/audit unavailable/empty states. |
| `components/ui/audit-timeline.tsx` | Source-backed governance audit status. |
| `components/ui/guarded-action-button.tsx` if present | Role/action/precondition-aware CTAs. |

### 10.3 APIs / Services / Schema

| Area | Treatment |
|---|---|
| `lib/permission-engine.ts` | Central authority for admin route/action/object permission; do not replace with UI-only checks. |
| `lib/visibility-engine.ts` / control-layer visibility projection | Prevent admin payload expansion and client leakage. |
| `lib/audit-service.ts` | Write role/access/denied-bypass/second-confirmation audit events. |
| `lib/admin-tenant-readmodel-service.ts` if present | Provide safe governance read model, not raw advisory payload. |
| `app/api/admin-tenants/route.ts` if present | Validate request, tenant scope, actor role, action, safe errors. |
| `deleted generic workflow route` | Demo action transport must still enforce non-bypass and audit for simulated governance actions. |
| Prisma models | `User`, `Role`, `Permission`, `RolePermission`, `UserRole`, `AccessRequest`, `SecondConfirmation`, `AuditEvent`, `PolicyDefinition`, `ClientTenant`. |

---

## 11. Interaction Lifecycle Requirements

| Interaction | Required Lifecycle |
|---|---|
| Role detail drawer | Open from scoped role/user row; show scope and boundaries; close/cancel without mutation; submit role change only after validation/permission/confirmation/audit. |
| Access request drawer/modal | Open request detail; approve/deny with reason; validate scope; submit with loading; success only for scoped grant/denial; audit state displayed. |
| Second confirmation modal | Open for sensitive action; require phrase/checkbox/reason; show validation errors; submit with loading; success only after audit; failure preserves state. |
| Admin denied action | Trigger can show denied state and reason; no mutation; denied attempt audit where applicable. |
| Policy/template edit action | Save only allowed configuration; no implied release/evidence/export approval; audit status shown. |
| Table filtering/search | If present, must not hide critical denied/pending states without clear filters; no fake filter behaviour. |

---

## 12. State / Feedback / Microcopy Requirements

### 12.1 Required States

| State | Governance/Admin Meaning |
|---|---|
| `LOADING_STATE` | Role/access/policy/audit data is loading. |
| `EMPTY_STATE` | No users, roles, requests or denied attempts are available in current scope. |
| `ERROR_STATE` | Governance data/action failed without advancing state. |
| `PERMISSION_DENIED_STATE` | Actor cannot view or perform requested governance action. |
| `DISABLED_GATED_ACTION_STATE` | Action visible but unavailable due to role, scope, confirmation, audit or precondition. |
| `VALIDATION_FAILED_STATE` | Missing reason, invalid scope, failed confirmation phrase or invalid permission set. |
| `BLOCKED_STATE` | Action blocked because it would bypass advice/evidence/compliance/visibility/audit/export gate. |
| `AUDIT_UNAVAILABLE_STATE` | Sensitive governance action cannot complete because audit write/source is unavailable. |
| `SUCCESS_STATE` | Only names completed scoped governance action; does not imply downstream gate completion. |

### 12.2 Required Microcopy Examples

| Situation | Required Copy Direction |
|---|---|
| Role updated | “Role updated for scoped governance access. Advisory release and client visibility remain compliance-gated.” |
| Access approved | “Access approved for the selected scope only. This does not grant release, export approval or client visibility.” |
| Admin attempts release | “Blocked: administrators cannot release advice. Compliance release is required.” |
| Admin attempts evidence sufficiency | “Blocked: evidence sufficiency requires evidence review; upload or admin status is not enough.” |
| Admin attempts manual visibility | “Blocked: client visibility is derived from release and redaction gates; it cannot be manually forced.” |
| Admin attempts export bypass | “Blocked: export requires scope, redaction, approval and audit.” |
| Audit unavailable | “Audit is unavailable. This action remains pending and has not completed.” |
| Cross-tenant denied | “Access denied: this object belongs to a different tenant or scope.” |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-09 Requirement |
|---|---|
| RBAC | Admin route shell, action permission, object scope and payload visibility must remain separate. |
| Tenant isolation | Admin actions and previews must be tenant/object scoped; cross-tenant attempts fail closed. |
| Client visibility | Admin cannot force client visibility; visibility remains derived and fail-closed. |
| Advice boundary | Admin cannot approve or release advice by role/policy change alone. |
| AI Draft internal-only | Admin previews must not expose AI Draft/internal rationale unless separately scoped internal role permits. |
| Evidence sufficiency | Admin cannot mark evidence sufficient; review/link/relevance/acceptance required. |
| Compliance release | Admin cannot replace Compliance Officer or force compliance release. |
| Audit | Sensitive governance actions and denied bypass attempts require audit. |
| Export | Admin/template authority cannot bypass scope, redaction, approval or forbidden-payload exclusion. |

---

## 14. Positive Acceptance Criteria

| ID | Positive Acceptance |
|---|---|
| `WP09-POS-001` | Admin can view scoped governance pages appropriate to role and tenant. |
| `WP09-POS-002` | Admin can perform allowed tenant/user/role/access configuration actions when role, object, confirmation and audit preconditions pass. |
| `WP09-POS-003` | Role/access drawers clearly show tenant/object/action scope, expiry/status and non-granted powers. |
| `WP09-POS-004` | Sensitive role/access/security changes require second confirmation where configured. |
| `WP09-POS-005` | Successful governance action writes or references an audit event. |
| `WP09-POS-006` | Governance page headers explain page job, boundary and next step. |
| `WP09-POS-007` | Access request approval grants only requested scoped access and displays scoped success copy. |
| `WP09-POS-008` | Empty/loading/error/permission states are visible and truthful across governance tables/drawers. |

---

## 15. Negative Acceptance Criteria

| ID | Negative Acceptance |
|---|---|
| `WP09-NEG-001` | Admin cannot force compliance release. |
| `WP09-NEG-002` | Admin cannot mark evidence sufficient without evidence review/link/relevance acceptance. |
| `WP09-NEG-003` | Admin cannot force client visibility or manual visibility override. |
| `WP09-NEG-004` | Admin cannot approve export or bypass redaction through template or role power alone. |
| `WP09-NEG-005` | Admin cannot suppress audit or complete sensitive action when audit write fails. |
| `WP09-NEG-006` | Role change cannot expand payload visibility beyond route/action/object scope. |
| `WP09-NEG-007` | Cross-tenant or wrong-object admin access is denied and audited. |
| `WP09-NEG-008` | Admin preview does not leak AI Draft, analyst notes, compliance notes, unreleased recommendation or raw evidence. |
| `WP09-NEG-009` | Access request approval does not bypass compliance/evidence/export gates. |
| `WP09-NEG-010` | UI never shows success copy implying downstream release, sufficiency, visibility or export approval after governance action. |

---

## 16. Required Tests and Test Names

| Test Name / Command | Purpose |
|---|---|
| `pnpm test:governance-non-bypass` | Preferred existing script if present; covers admin non-bypass. |
| `pnpm test:permissions` | Permission engine and RBAC negative proof. |
| `pnpm playwright test tests/governance-non-bypass.spec.ts` | Positive/negative governance flows. |
| `pnpm playwright test tests/control-layer-actor-scope.spec.ts` | Tenant/object/actor scope proof. |
| `pnpm playwright test tests/confirmation-lifecycle.spec.ts` | Second confirmation lifecycle for sensitive actions. |
| `pnpm playwright test tests/admin-governance-ux.spec.ts` | New or updated True-UX spec for page headers, role drawers, denied copy, one CTA/state. |
| `pnpm playwright test tests/admin-non-bypass-p0.spec.ts` | New or updated P0 negative test for force release/evidence/visibility/export/audit bypass. |
| `pnpm playwright test tests/client-visibility-negative.spec.ts` | If present; verify admin changes do not cause client payload leakage. |
| `pnpm playwright test tests/true-ux-p0-safety.spec.ts` | If present; assert no visual-only gate proof or no-overclaim copy. |

**Test creation rule:** Do not create duplicate specs if equivalent current tests exist. First inspect existing tests and extend them where appropriate.

---

## 17. Validation Commands

Codex should adapt commands to the repo scripts discovered by WP-00. Minimum expected validation set:

```bash
pnpm lint
pnpm typecheck
pnpm test:permissions
pnpm playwright test tests/governance-non-bypass.spec.ts
pnpm playwright test tests/control-layer-actor-scope.spec.ts
pnpm playwright test tests/confirmation-lifecycle.spec.ts
pnpm playwright test tests/admin-governance-ux.spec.ts
pnpm playwright test tests/admin-non-bypass-p0.spec.ts
```

If a script does not exist, Codex must record it in implementation notes and use the closest available test command rather than silently skipping validation.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| `NO_ADMIN_BYPASS` | Do not add any UI/API/service path allowing admin to bypass advice, evidence, compliance, visibility, audit or export gates. |
| `NO_MANUAL_CLIENT_VISIBILITY_OVERRIDE` | Do not add a manual visibility toggle. Visibility remains derived and fail-closed. |
| `NO_UPLOAD_TO_RELEASE` | Do not let admin or evidence template status convert upload into sufficiency/release. |
| `NO_ADVISORY_PAYLOAD_EXPANSION_BY_ADMIN_ROLE` | Admin route access must not expose internal advice payload. |
| `NO_AUDIT_SUPPRESSION` | Sensitive admin action cannot complete when audit is required and unavailable. |
| `NO_EXPORT_REDACTION_BYPASS` | Export template/admin role cannot bypass redaction/approval. |
| `NO_SCHEMA_REPLACEMENT` | Do not replace full-workflow schema with patch schema. Route unavoidable schema issues to WP-14. |
| `NO_SCREEN_GENERATION` | Do not generate screens, images or visual assets. |
| `NO_P1_HOLD_ELEVATION` | Do not pull committee, KYC/SoW/suitability/IPS, review monitoring or communication center into V0.96 via admin work. |
| `NO_FAKE_UI_PROOF` | Buttons, chips, modals and static text cannot count as permission or gate proof. |

---

## 19. Open Questions / Blockers

| Item | Status | Handling |
|---|---|---|
| Current admin/governance API surface may differ from older KB. | `REQUIRES_REBASE` | WP-00 must inventory actual APIs before edits. |
| Whether `guarded-action-button.tsx` exists in current repo. | `REQUIRES_REBASE` | If missing, reuse existing button/state primitives or define minimal local guarded logic without broad design-system build. |
| Whether `SecondConfirmation` is fully wired or only schema/demo support. | `PARTIAL/UNPROVEN` | Recheck schema/service/test before implementing lifecycle. |
| Whether admin read model leaks advisory payload. | `UNPROVEN` | Add explicit negative tests and projection checks. |
| Whether governance audit history is source-backed. | `UNPROVEN` | Coordinate with WP-08; do not duplicate but assert dependency. |
| Whether P0 tests already exist with different names. | `REQUIRES_REBASE` | Extend existing tests instead of duplicating. |

---

## 20. Codex Execution Notes

1. Start only after WP-00 has produced the moving-baseline and UX/IA delta register.
2. Classify all relevant admin/governance files as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING` or `BLOCKED`.
3. Implement governance UX as a bounded workbench, not a new admin product.
4. Prefer existing primitives: `PageHeader`, `StatePanel`, `DataTable`, `Drawer`, `Modal`, `AuditTimeline` and permission helpers.
5. Keep role/access details scoped and explain consequences directly in UI.
6. Treat denied admin-bypass actions as first-class P0 proof, not edge cases.
7. Add or update tests before claiming completion.
8. If a required implementation would require schema replacement, new broad API surface or route reclassification, stop and mark blocker for WP-14 / follow-up decision.

---

## 21. QA Matrix

| QA Check | Expected Result |
|---|---|
| Source hierarchy preserved | `full-workflow` target, `main` false-gap only. |
| Admin non-bypass preserved | Admin cannot release, force evidence, force visibility, bypass export or suppress audit. |
| UI/UX/IA integrated | Governance pages have page job, scope boundary, one primary CTA, table/detail pattern and truthful states. |
| No-overclaim feedback | Success copy names only the scoped governance action. |
| Permission separation | Route/action/object/payload visibility checks remain separate. |
| Client leakage prevented | Admin previews do not expose internal/client-sensitive payload beyond scope. |
| Audit proof present | Sensitive governance actions and denied bypass attempts write/source audit events or fail closed. |
| Tests include negatives | Admin bypass, cross-tenant, payload expansion and audit suppression negatives exist. |
| No generation | No screen/image/visual asset generation. |
| No blind schema replacement | Full-workflow schema remains baseline. |
| P1/HOLD preserved | Committee/KYC/Suitability/Review Monitoring/Communication not elevated. |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Role | ENGINE_v2 Role | Codex-Spark-like Convergence | Output in this Artefact |
|---|---|---|---|---|
| KB / UX / IA discovery | Extracted admin non-bypass, navigation, page job, density, CTA, modal/drawer, audit, no-overclaim and payload visibility signals. | Classified evidence into task implications and refactor-now decisions. | Removed broad alternatives and focused on governance non-bypass. | Sections 3, 7, 8 |
| Source hierarchy | Checked contradictions between KB, WP source and moving repo baseline requirements. | Locked `full-workflow`, blocked `main`, preserved control artefacts as non-code truth. | Converted hierarchy into operational stop rules. | Section 2, 18 |
| Task decomposition | Identified surface and safety problem families. | Produced task IDs, files, steps, acceptance, tests and validation commands. | Made tasks directly executable after WP-00 rebase. | Section 9 |
| Safety discipline | Preserved no admin bypass, no client-visible AI draft, no manual visibility override and no upload-to-release. | Mapped positive/negative P0 acceptance and stop rules. | Forced blocked/denied/audited outcomes. | Sections 13–18 |
| UX/IA integration | Mapped route-catalog, weak page jobs, long pages, equal CTAs and superuser dashboard risks. | Embedded refactor requirements into admin/governance implementation tasks. | Kept refactor scoped to touched surfaces. | Sections 7–12 |
| Final QA | Detected overclaim risks and P1/HOLD expansion risks. | Converted them into QA checks. | Finalized a Codex-ready task description with no implementation. | Section 21 |

**Final readiness:** `WP09_DEEP_TASK_DESCRIPTION_COMPLETE_READY_FOR_SEQUENCE_PROMPT_11`
