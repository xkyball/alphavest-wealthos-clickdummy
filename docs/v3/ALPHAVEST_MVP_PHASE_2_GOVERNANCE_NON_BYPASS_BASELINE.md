# AlphaVest MVP Phase 2 Governance Non-Bypass Baseline

Date: 2026-06-20
Phase source: `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN.md`
Phase: `2 - Governance / Admin Non-Bypass Foundation`
Execution status: `PHASE_2_COMPLETED_DOCS_ONLY`

## 1. Scope

Phase 2 locks the governance and admin non-bypass foundation for later MVP journey implementation. The purpose is to allow admin and governance setup while blocking release, evidence sufficiency, export, visibility and audit bypass through broad administrative authority.

This phase is a source-grounded documentation and acceptance-contract phase only. It does not implement product behavior, run tests, change routes, create APIs, alter Prisma schema, execute migrations, generate screenshots, generate images or target `main` as source truth.

## 2. Source Files Read

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN.md`
- `docs/v3/ALPHAVEST_MVP_PHASE_0_SOURCE_REALITY_BASELINE.md`
- `docs/v3/ALPHAVEST_MVP_PHASE_1_PROVIDERLESS_SCOPE_BASELINE.md`
- `docs/v3/CODEX_TASKS_DETAILED_V3.md`
- `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
- `docs/v3/OPERATIONALIZATION_PROJECT_CONTRACT_V3.md`
- `docs/v3/CAPABILITY_TRUTH_AUDIT_V3.md`
- `docs/v3/WORKFLOW_EXECUTION_REALITY_MATRIX_V3.md`
- `docs/v3/INPUT_MASK_AND_DATA_MAINTENANCE_REQUIREMENTS_V3.md`
- `lib/permission-engine.ts`
- `lib/typed-workflow-command-bus.ts`
- `lib/demo-workflow-validation.ts`
- `lib/workflow-gate.ts`
- `lib/audit-service.ts`
- `components/admin-tenant-setup-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/internal-workflow-screen.tsx`
- `tests/p0-acceptance.spec.ts`
- `prisma/schema.prisma`

## 3. Phase 2 Stop Rules

| Rule | Result |
| --- | --- |
| No code change | Passed. No product TypeScript, API route, component or service implementation changed. |
| No test execution | Passed. Existing tests were inspected only as proof candidates. |
| No schema migration | Passed. `prisma/schema.prisma` and migrations were not changed. |
| No screen/state/image generation | Passed. No screenshots, route states, visual assets or generated images were created. |
| No Codex execution of downstream implementation | Passed. Phase 2 stayed at the contract/report layer. |
| No `main` target truth | Passed. Current `full-workflow` checkout and mega-journey source files remain the target truth. |

## 4. Current Source Reality

| Surface | Current reality | Phase 2 interpretation |
| --- | --- | --- |
| Governance UI | `components/admin-tenant-setup-screen.tsx` and `components/decisions-governance-screen.tsx` expose admin, policy, roles, users, access requests, security and second-confirmation surfaces. | These are useful demo/governance surfaces, not proof that every governance mutation is operational or persistently reviewed. |
| Permission engine | `lib/permission-engine.ts` centralizes governance roles, access approval roles, tenant admin roles, admin non-bypass roles, compliance release roles and export approval roles. | This is the main current foundation for admin non-bypass semantics. |
| Admin governance authority | Admin/security can be allowed for `MANAGE` on `ROLE` or `POLICY` with audit and second-confirmation flags. | Admin setup is allowed only inside governance scope. It does not imply advice payload, release, export or visibility authority. |
| Compliance release | Non-compliance roles are denied `RELEASE`/`BLOCK` on `RECOMMENDATION` with `DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED`. | Admin role escalation cannot replace a compliance actor for release/block authority. |
| Export | Admin/security export of `EXPORT_REQUEST` is denied with `DEMO_DENY_ADMIN_NON_BYPASS`; other forbidden roles are denied with role-specific export denials. | Export must remain approval, redaction, visibility and evidence gated. Admin cannot bypass these gates. |
| Advice payload visibility | Admin/security role authority alone is denied internal advice payload visibility with `DEMO_DENY_ADMIN_ADVICE_PAYLOAD_NON_BYPASS`. | Route or governance authority is not enough to view internal advice payload. |
| Workflow gate | `lib/workflow-gate.ts` requires released recommendation state, advisor approval, compliance release, evidence and permission before client visibility. | Advisor approval, upload, admin role, UI state or audit copy alone is insufficient. |
| Mutation wrapper | `lib/typed-workflow-command-bus.ts` records denied recommendation-review actions as audit rows and keeps `mutated: false`; typed release/block/evidence actions require exact confirmation text. | Current recommendation review workflow has stronger proof candidates than static governance UI, but fresh proof was not run in this phase. |
| Audit service | `lib/audit-service.ts` can preview event metadata including permission decisions and second-confirmation flags. | Preview metadata is not a persistence proof unless a bounded mutation test or API path proves persisted audit rows. |
| Schema | Prisma includes `Role`, `Permission`, `RolePermission`, `UserRole`, `AccessRequest`, `SecondConfirmation`, `AuditEvent` and `PolicyDefinition`. | The model supports later governance implementation, but schema presence alone is not operational proof. |
| P0 tests | `tests/p0-acceptance.spec.ts` already contains admin non-bypass assertions as proof candidates. | These tests map the right acceptance shape but were not executed in Phase 2. |

## 5. Capability Position

| Capability | Current level | Target later level | Non-claim boundary |
| --- | ---: | ---: | --- |
| Governance role and policy setup | E4-E6 candidate | E6/E7 depending payload persistence | UI and fixture/demo actions are not generalized role/policy CRUD proof. |
| Admin non-bypass permission semantics | E6 candidate | E6 with rerun tests, E7 only with provider/session enforcement | Current engine can express denials, but Phase 2 did not run the permission suite. |
| Second confirmation | E2-E6 depending surface | E7 for governance CRUD only after validated phrase, durable record and reload proof | Modal presence and copy are not enough. |
| Audit behavior | E3-E6 depending path | E6/E7 with persisted denied/success rows and fail-closed unavailable-audit behavior | Preview audit metadata is not persisted audit proof. |
| Compliance release non-escalation | E6 candidate | E6 with current tests rerun and P1-deferred route work respected | Admin cannot be treated as compliance release authority by policy or UI copy. |
| Export non-bypass | E5-E6 candidate | E7 only after generated binary export lifecycle | Metadata-only export remains below operational binary export. |

## 6. Governance Role Model And Sensitive Action Classification

Phase 2 locks these role semantics for later implementation:

| Role class | May do | Must not do by implication |
| --- | --- | --- |
| Admin / security governance | Manage tenant setup, policy setup, role templates, user invitations, access requests and scoped permission changes when authorized. | Release advice-like content, approve advisor decisions, approve/export restricted packages, mark evidence sufficient, make internal advice client-visible, suppress audit, or view internal advice payload by governance authority alone. |
| Compliance officer | Release/block recommendation workflows, approve restricted export gates and review evidence when prerequisites pass. | Skip advisor approval, evidence sufficiency, audit persistence, visibility projection or tenant/object scope checks. |
| Senior wealth advisor | Review and approve recommendation movement toward compliance. | Release content to client or replace compliance review. |
| Analyst/client success/external/family roles | Operate only their scoped workflow lanes. | Bypass release, export, evidence, internal-payload or governance controls. |

Sensitive action classes for later route/API/service work:

| Action class | Examples | Required control |
| --- | --- | --- |
| Governance setup | Role creation, role assignment, permission assignment, policy edit, tenant activation setting. | Permission check, second confirmation where sensitive, audit event, tenant/object scope. |
| Advice lifecycle | Advisor approve, compliance release, compliance block, request evidence. | Actor role check, workflow gate, exact confirmation where configured, audit event, no client-visible mutation on denial. |
| Evidence sufficiency | Accept evidence, mark evidence release-ready, attach evidence to recommendation/export. | Evidence status/scope/currentness check, audit, client-safe visibility classification. |
| Export lifecycle | Request export, approve export, generate/download/share export. | Export role and compliance approval checks, redaction/scope validation, audit, binary-generation proof before E7 claim. |
| Visibility projection | Move recommendation/document/evidence/client payload to client-visible state. | Advisor approval, compliance release, evidence, permission, redaction, tenant/object scope. |
| Audit-sensitive mutation | Any restricted/highly restricted object mutation. | Audit persistence or fail-closed behavior. |

## 7. Admin Non-Bypass Checks To Preserve

Later implementation must preserve the following denials as hard acceptance requirements:

| Bypass attempt | Required result |
| --- | --- |
| Admin/security tries to release or block a recommendation. | Deny with compliance-release-required semantics; create denied audit where mutation path exists; no recommendation/client visibility mutation. |
| Admin/security tries to view unreleased internal advice payload through route, API, export or governance screen. | Deny or project a redacted payload; do not expose internal rationale, AI draft, compliance notes or assumptions JSON. |
| Admin/security tries to create/download/share restricted export package without compliance/export approval and redaction gates. | Deny with admin non-bypass semantics; no package generation or download authorization. |
| Admin/security tries to mark upload-created evidence as sufficient for release/export. | Deny unless evidence is current, reviewed, accepted, object-scoped and client-safe visible. |
| Admin/security tries to set client visibility directly. | Deny unless the full workflow gate passes. |
| Admin/security tries to suppress audit or continue when audit persistence is unavailable. | Deny or fail closed; no sensitive mutation should be accepted without the required audit behavior. |

## 8. Second-Confirmation And Audit Expectations

Second-confirmation proof must include all applicable items:

- A non-read-only confirmation input for the actor.
- Exact required phrase validation for the action class.
- Role, tenant and object-scope checks before mutation acceptance.
- A durable `SecondConfirmation` or equivalent domain record where the governance workflow claims persistence.
- A durable `AuditEvent` for success and denied attempts where the mutation path exists.
- No domain mutation when confirmation, role, scope or audit persistence fails.
- Reload proof for any claim above E6.

For Phase 2, existing typed recommendation-review confirmation behavior is a proof candidate. Governance modal copy and static UI confirmation surfaces are not enough by themselves.

## 9. P2 Task Closure

| Task | Phase 2 result |
| --- | --- |
| `AV-MVP-P2-T001` Lock governance role model and sensitive action classification. | Completed as contract. Role classes and sensitive action classes are documented above. |
| `AV-MVP-P2-T002` Specify admin non-bypass checks for release, evidence sufficiency, visibility and export. | Completed as contract. Required denials and no-mutation expectations are documented above. |
| `AV-MVP-P2-T003` Define second-confirmation and audit expectations for sensitive governance mutations. | Completed as contract. Confirmation/audit proof requirements are documented above. |
| `AV-MVP-P2-T004` Protect compliance release route against admin role escalation. | Kept `P1_DEFERRED` per plan. Contract states admin cannot replace compliance release authority. No route/code work performed. |
| `AV-MVP-P2-T005` Map admin non-bypass tests into P0 acceptance suite. | Completed as test map. Existing P0/permission/workflow/export test slices are proof candidates; no tests were added or run. |

## 10. P0 Acceptance Test Map

Later P0 acceptance must include or preserve:

| Test obligation | Candidate current surface |
| --- | --- |
| Admin can perform governance management with audit and second-confirmation requirements. | `tests/p0-acceptance.spec.ts` `AV-SLICE-P0-04`; `tests/permission-engine.spec.ts`. |
| Admin cannot release/block recommendation to client. | `permissionEngine.can(..., "RELEASE", RECOMMENDATION)` and recommendation-review workflow denial paths. |
| Admin cannot view unreleased internal advice payload. | `visibilityEngine.projectRecommendationPayload` and permission-engine internal payload denials. |
| Admin cannot export restricted package by role authority alone. | `permissionEngine.can(..., "EXPORT", EXPORT_REQUEST)` and export-service checks. |
| Upload-created evidence is not evidence sufficiency. | `evidenceService.evaluateEvidenceSufficiency` and workflow gate tests. |
| Denied sensitive attempts are audited and do not mutate. | `runRecommendationReviewWorkflowMutation` denial paths and demo-workflow API tests. |
| Audit persistence unavailable blocks sensitive mutation. | Existing audit fail-closed tests where applicable; later governance APIs must add equivalents. |
| Confirmation phrase invalid blocks mutation. | `demo-workflow-validation.ts`, `typed-workflow-command-bus.ts`, confirmation lifecycle tests. |

## 11. Impact Matrix

| Area | Phase 2 decision |
| --- | --- |
| Routes `007-010`, `017-018`, `040`, `048-051`, `057` | No route changed. These remain affected surfaces for later governance/non-bypass implementation and proof. |
| API `/api/demo-workflow` | No API changed. Current recommendation-review paths are proof candidates. Future governance APIs remain unauthorized until explicit handoff. |
| Schema/models | No schema changed. `Role`, `Permission`, `RolePermission`, `UserRole`, `AccessRequest`, `SecondConfirmation`, `AuditEvent`, `PolicyDefinition` remain the relevant model set. |
| Services/components | No service/component changed. `permission-engine`, `audit-service`, `typed-workflow-command-bus`, `workflow-gate`, export/evidence/visibility services remain the relevant proof surfaces. |
| Tests | No tests changed or run. `permission-engine.spec.ts`, `demo-workflow-api.spec.ts`, `p0-acceptance.spec.ts`, `workflow-gate.spec.ts` and export/evidence tests remain proof candidates. |

## 12. Exit Gate Decision

`PHASE_2_EXIT_PASSED_WITH_DOCUMENTED_LIMITATIONS`

Phase 2 passes because the admin non-bypass contract is now explicit, mapped to current source surfaces and constrained by the plan stop rules. The exit gate does not claim fresh test proof, operational governance CRUD, production authentication, real provider enforcement, binary export readiness, full audit persistence across all governance surfaces or E7 operational capability.

