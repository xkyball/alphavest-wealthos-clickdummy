# AlphaVest WP06 RBAC / Admin Non-Bypass Execution

Source upload: `/Users/chris/Downloads/alphavest/ALPHAVEST_WP06_RBAC_ADMIN_NON_BYPASS_BOC_TICKET_STRUCTURE.md`

Execution date: 2026-06-25

Task status: STOPPED_AT_DECISION_WP06_1

## 0. Moving Baseline Preflight

Reported baseline:

- Branch: `full-workflow`
- Remote state before WP06 analysis: `full-workflow...origin/full-workflow [ahead 25]`
- Latest commit: `87f1339 feat: implement wp05 advisory compliance flow`
- Working tree before WP06 documentation edit: clean
- Diff stat before WP06 documentation edit: empty
- Package manager: `pnpm@9.15.9`
- Key scripts found: `typecheck`, `lint`, `db:validate`, `build`, `guard:source`, `test:permissions`, `test:governance-non-bypass`, `test:client-visibility`, `test:workflow-gate`, `test:workflow-api`, `test:route-smoke`, `phase:check`
- Route registry exists: `lib/route-registry.ts`
- WP06 route families exist: admin routes 008-010, tenant/admin support 017-020, advisor/compliance routes 036-040, governance routes 048-051, export routes 054-058.

Decision: preflight passes for WP06 analysis and specification. Implementation remains blocked by `DECISION-WP06-1`.

## 1. Upload Task Extraction

### EPIC-WP06 Governance / RBAC / Admin Non-Bypass

Detailed description:
Lock the AlphaVest governance safety spine. Route access, action permission, object scope and payload visibility must be separate. Admin and security roles may administer governance configuration, but must not bypass advice, evidence, compliance, audit, client visibility or export gates.

Purpose:
Protect the MVP from unauthorized mutation, payload leakage, cross-tenant access and admin bypass.

Out of scope:
Production IAM provider, held-route unlock, schema replacement, screen generation and direct implementation without spec.

Completion criteria:
All child tasks are complete or explicitly deferred; admin bypass fails closed; payload leakage is prevented; audit expectations are verified; P0 regression proof exists.

### ANALYSIS-WP06-1 Current RBAC, governance and payload visibility audit

Detailed description:
Audit the current permission engine, visibility engine, governance UI, audit service, route guards, action guards and relevant tests to identify real enforcement points and gaps.

Questions:
- Where is current user / tenant / role resolved?
- Are route guards central or only navigation visibility?
- Where are action permissions checked?
- Where are object/tenant scopes checked?
- Where are payloads filtered/redacted?
- Which admin actions could bypass gates?
- Which denied actions write audit events?
- Which tests cover RBAC, cross-tenant denial, admin non-bypass and internal-only payload?

Definition of Done:
Relevant files/routes/services/tests are identified, current enforcement is mapped, bypass/leakage risks are documented and an implementation cut is proposed.

Status: DONE in this execution.

### SPEC-WP06-1 Route/action/object/payload permission and admin non-bypass contract

Detailed description:
Define a target state precise enough for implementation: role matrix, route/action/object/payload separation, admin non-bypass rules, payload projection/redaction rules, denied/sensitive audit requirements, governance UI feedback and test design.

Definition of Done:
Roles, permissions, actions, payload rules, audit expectations and testable acceptance criteria are specified.

Status: DONE in this execution as first-wave spec proposal, pending human approval.

### DECISION-WP06-1 Human approval of enforcement depth and first-wave scope

Detailed description:
Approve whether WP06 first wave covers only route/action guards or also payload/API/service-level enforcement. Confirm audit-failure behavior, second-confirmation/access-request treatment and tested roles.

Definition of Done:
Human explicitly approves or adjusts enforcement depth, first-wave cutline and blocker list.

Status: STOP REQUIRED.

### IMPL-WP06-1 Central route/action/object guard integration

Detailed description:
Implement or harden the shared guard path for actor context, route shell access, action permission and object/tenant scope so users cannot mutate merely because a route is visible.

Subtasks:
- Current user / tenant / role resolution guard: normalize actor, tenant, roles and scopes into one guard input; missing context must deny sensitive actions.
- Route access guard layer: render safe route-shell access or deterministic denied route state according to route matrix.
- Action permission and object-scope guard helper: require explicit action permission and object scope before mutations.

Status: PLANNED / BLOCKED by `DECISION-WP06-1`.

### IMPL-WP06-2 Payload visibility projection and redaction

Detailed description:
Harden role/context-aware payload projection so clients and unauthorized roles never receive internal-only fields. Payload visibility must be independent from route access and action permission.

Subtasks:
- Client-safe projection rules for portal/mobile: project only released/redacted/approved information.
- Internal-only field redaction for AI Draft, rationale and compliance notes: strip/redact AI draft, internal rationale, analyst notes, compliance notes, unreleased evidence and internal audit metadata from unauthorized contexts.

Status: PLANNED / BLOCKED by `DECISION-WP06-1`.

### IMPL-WP06-3 Admin non-bypass and denied-action audit

Detailed description:
Deny admin attempts to release advice, mark evidence sufficient, force client visibility, approve/export forbidden payload or suppress audit requirements. Denied sensitive attempts must be audited where required and must not mutate state.

Subtasks:
- Block safety-critical admin bypass.
- Audit denied attempts.

Status: PLANNED / BLOCKED by `DECISION-WP06-1`.

### IMPL-WP06-4 Governance console state and feedback hardening

Detailed description:
Update governance UI states so users understand allowed, denied, pending, second-confirmation, audit-required and blocked states without implying bypass authority.

Execution steps:
- Add denied/blocked/pending states.
- Preserve no-overclaim wording: governance success must not imply release, visibility, sufficiency, export or audit authority.

Status: PLANNED / BLOCKED by `DECISION-WP06-1`.

### QA-WP06-1 P0 RBAC/admin non-bypass regression validation

Detailed description:
Validate route/action/object/payload separation, admin non-bypass, cross-tenant denial, payload redaction, denied audit events and governance UI feedback states.

Required checks:
- Allowed actor can perform permitted route/action.
- Route-visible but action-denied actor cannot mutate.
- Wrong-tenant/wrong-object actor receives no payload.
- Admin cannot force compliance release, evidence sufficiency, client visibility or export.
- AI Draft/internal rationale/compliance notes are absent from client-facing payload.
- Denied sensitive attempts are audited where specified.
- Audit failure keeps safety action denied/pending.
- Governance UI shows denied/blocked/pending states.

Status: BLOCKED until implementation tasks are complete.

## 2. ANALYSIS-WP06-1 Findings

### Enforcement Point Map

| Layer | Current files | Current reality |
| --- | --- | --- |
| Actor context | `lib/control-layer/actor-context.ts`, `lib/demo-session.ts`, `lib/auth/current-user.ts` | Demo actor context is normalized in WCL, while Journey API uses current-user. This is workable but creates two enforcement entry points. |
| Route registry / route shell | `lib/route-registry.ts`, `lib/permission-engine.ts`, `components/process-navigation.tsx`, screen components | Route metadata carries object/action and scope labels. `permissionEngine.evaluateRouteBoundary` separates shell accessibility from action and payload decisions. |
| Action permission | `lib/permission-engine.ts`, `lib/control-layer/permission-decision.ts`, `lib/demo-workflow-mutation.ts`, `lib/journeys/journey-api-service.ts` | Permission engine already denies admin release, admin evidence sufficiency, admin export and admin visibility bypass. Demo workflow and Journey API both perform pre-mutation checks, but they use related rather than identical guard wrappers. |
| Object / tenant scope | `lib/control-layer/scope-resolver.ts`, `lib/permission-engine.ts`, `lib/journeys/journey-api-service.ts` | Tenant mismatch and object-scope gaps fail closed. Journey API also checks current-user tenant on load. |
| Payload visibility | `lib/visibility-engine.ts`, `lib/control-layer/client-visibility.ts`, `lib/client-portal-projection-state.ts` | Recommendation, decision and document projections redact internal-only fields for client roles and fail closed for unreleased payloads. |
| Audit fail-closed | `lib/audit-service.ts`, `lib/control-layer/audit-guard.ts`, `lib/demo-workflow-mutation.ts`, `lib/journeys/journey-api-service.ts` | Critical actions require minimum audit fields and audit persistence. Demo workflow and Journey API block or error before mutation if audit persistence is unavailable. |
| Governance UI | `components/decisions-governance-screen.tsx`, `components/admin-tenant-setup-screen.tsx` | UI already names governance capability boundaries, second-confirmation states and blocked states. It is strong copy/state proof, but implementation authority must remain in services/API. |
| API surfaces | `app/api/demo-workflow/route.ts`, `app/api/journeys/[id]/commands/route.ts`, `app/api/journeys/[id]/client-projection/route.ts`, `app/api/documents/*`, `app/api/export-workflow/route.ts` | Main safety surfaces exist. `/api/demo-workflow` is broad compatibility; `/api/journeys/:id/commands` is the cleaner command spine after WP05. |

### Existing Test Coverage

- `tests/permission-engine.spec.ts`: cross-tenant denial, route visible vs mutation denied, object-scope requirement, admin export bypass denial, payload visibility.
- `tests/governance-non-bypass.spec.ts`: governance management allowed while admin safety bypasses denied; denied audit row for admin evidence sufficiency.
- `tests/true-ux-governance-non-bypass.spec.ts`: governance UI boundary copy and admin non-bypass engine checks.
- `tests/client-visibility-projection.spec.ts`, `tests/true-ux-client-projection.spec.ts`, `tests/client-visibility-proof.spec.ts`: client projection and forbidden-field absence.
- `tests/audit-fail-closed.spec.ts`, `tests/phase6-audit-persistence.spec.ts`: audit persistence fail-closed behavior.
- `tests/demo-workflow-api.spec.ts`: broad demo workflow mutation, audit and recommendation review coverage.
- `tests/journey-api.spec.ts`, `tests/wave-0-2-p0-validation.spec.ts`: Journey command admin non-bypass and audit failure coverage.

### Gaps / Drift Risks

1. Two guard language layers exist: WCL control-layer wrappers and direct Journey API/current-user logic. They are consistent today, but can drift.
2. `/api/demo-workflow` remains a broad compatibility endpoint with many action cases. WP05 already marked this as demo compatibility only; WP06 should not make it the new source of truth.
3. Some governance proof is source-copy based (`readFileSync` UI assertions). Useful as no-overclaim proof, but not enough as enforcement proof.
4. Admin release denial reason for recommendation release is currently `DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED`; semantically correct but less explicit than `ADMIN_NON_BYPASS` for audit/reporting.
5. Route-smoke has known broader stale workbench-structure failures after WP05. WP06 should use focused route/API/UI tests instead of treating the whole route-smoke as final acceptance until that separate backlog is fixed.

## 3. SPEC-WP06-1 First-Wave Contract

### Recommended First-Wave Role Matrix

| Actor | May do | Must not imply |
| --- | --- | --- |
| Platform/Tenant Admin | Manage governance settings, roles, policies, users and access requests with second confirmation/audit. | Release advice, mark evidence sufficient, force client visibility, approve/export restricted packages, suppress audit. |
| Security Officer | Govern access/security policy and review access requests. | Same safety-gate bypass restrictions as Admin. |
| Compliance Officer | Release/block compliance items, decide evidence sufficiency, approve export where gates pass. | Skip evidence, payload, audit or tenant/object scope checks. |
| Senior Wealth Advisor | Approve advisory draft for compliance review. | Compliance release, evidence sufficiency, client visibility or export release. |
| Analyst | Draft/rebuild internal advice and link evidence where allowed. | Advisor approval, compliance release, client-visible payload. |
| Client roles | View only released/redacted client-safe projection. | Internal rationale, AI draft, compliance notes, unreleased evidence/audit metadata. |
| External Advisor / limited roles | Scoped collaboration where allowed. | Internal-only object access or restricted export. |

### Enforcement Rules

- Route visibility is not action authority.
- Action authority requires explicit role permission, current tenant scope, object target and object-scope membership.
- Payload visibility requires role/context projection; forbidden internal fields must be absent, not merely hidden by CSS.
- Admin and security roles must fail closed for release, evidence sufficiency, client visibility, export approval/download/share and audit suppression.
- Critical denied attempts should audit where a sensitive action was attempted.
- Audit persistence failure blocks safety-sensitive mutation before state changes.
- Unknown tenant, unknown object, missing object scope or missing audit fields fail closed.
- Governance UI may explain capability boundaries, but service/API guard outcomes remain authoritative.

### Acceptance Criteria

- Given an admin can open governance routes, when they attempt compliance release, evidence sufficiency, export or direct visibility release, then the action is denied, no mutation occurs and denial is auditable.
- Given a compliance officer acts on a scoped object with required evidence, payload and audit persistence, then the action may proceed through the correct gate.
- Given a route-visible actor lacks object/action permission, then the route can remain visible but mutation remains disabled/denied.
- Given a client-facing route requests recommendation/decision/document data, then internal-only fields are absent from the returned projection.
- Given cross-tenant object access, then response fails closed with no payload leak.
- Given audit persistence is unavailable, then critical safety action remains denied or pending.

## 4. DECISION-WP06-1 Options

### Option A - Recommended: Full First-Wave Enforcement, No New API, No Schema Migration

Decision:
Include route/action/object guards, payload/API/service-level visibility, admin non-bypass, denied audit and governance UI feedback in the first WP06 implementation wave. Reuse existing WCL/control-layer, `permissionEngine`, `visibilityEngine`, `auditService`, Journey command service and demo workflow compatibility paths. Do not add schema or new API.

Why this is the cleanest aggressive path:
- Removes the main Altlast: UI proof and service proof stay aligned.
- Prevents admin non-bypass from being only a copy/test illusion.
- Keeps WP06 aligned with WP03-WP05 safety boundaries.
- Avoids broad product/IAM scope expansion.
- Creates a canonical first-wave proof suite instead of relying on stale full route-smoke.

Implementation cutline:
- Consolidate WP06 contract constants/metadata where useful.
- Harden explicit admin non-bypass reason codes for safety-gate actions.
- Add missing targeted tests for demo workflow and Journey API parity.
- Extend payload projection tests for admin/security and client contexts.
- Add one governance UI proof screenshot only if UI states change.

Approval sentence:
`I approve WP06 Option A: full first-wave route/action/object plus payload/API/service-level enforcement, admin non-bypass fail-closed, denied sensitive attempts audited before mutation, governance UI feedback included, no new API, no schema migration, demo workflow compatibility only.`

### Option B - Narrow Route/Action Guard Wave

Decision:
Only harden route/action/object guards first; defer payload/API projection hardening.

Why weaker:
Leaves the most dangerous class open: data can still leak if route/action guard passes but payload projection drifts.

Recommendation:
Reject unless time-boxed.

### Option C - UI/Governance Console First

Decision:
Only update governance UI feedback and disabled states first.

Why weaker:
Fails the WP06 safety premise because UI disabled states are not enforcement.

Recommendation:
Reject.

### Option D - New IAM/API/Scheme Expansion

Decision:
Create new production-style RBAC APIs, schema models or IAM provider integration.

Why weaker:
Too broad for WP06 first wave, violates upload/no-schema/no-new-API posture unless separately approved.

Recommendation:
Reject for now.

## 5. Aggressive Recommendation

Approve Option A.

This is the best clean solution because it preserves the existing strong guard modules while removing drift between them. It also avoids both bad extremes: a cosmetic UI-only hardening and a too-large production-IAM rewrite.

## 6. Current Stop State

Stopped at `DECISION-WP06-1` because the upload explicitly requires human approval of enforcement depth and first-wave scope before implementation tasks start.

No UI changes were made in this WP06 analysis/specification step, so no screenshot is required.

Next step after approval:

1. `IMPL-WP06-1`: centralize/align first-wave guard contract and action/object proof.
2. `IMPL-WP06-2`: harden payload projection and forbidden-field tests.
3. `IMPL-WP06-3`: harden admin non-bypass reason/audit coverage across demo workflow and Journey API.
4. `IMPL-WP06-4`: governance UI feedback only if guard outcomes need visible state changes.
5. `QA-WP06-1`: focused `permission-engine`, `governance-non-bypass`, `client-visibility`, `audit-fail-closed`, `demo-workflow-api`, `journey-api` and screenshot if UI changed.

