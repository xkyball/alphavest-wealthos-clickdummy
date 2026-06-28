# EPIC-06 Domain Gap Report

Ticket: `EPIC-06-ANALYSIS-01`
Datum: 2026-06-28
Branch: `full-workflow`
Quelle: `reports/process-first-refactoring-masterplan-2026-06-28/ALPHAVEST_PROCESS_FIRST_REFACTORING_MASTERPLAN_BOC_CTES.json`

## 1. Re-read Ticket Definition

`EPIC-06` heisst `Identity, Tenant, RBAC and Admin Non-Bypass`.

Purpose: Identity, Tenant, RBAC und Admin Non-Bypass muessen als process-first App Area implementiert und bewiesen werden, nicht als isolierte Screens.

Goal: Jeder relevante Prozess/Step fuer `DOMAIN-B` und `DOMAIN-L` braucht einen Route-/Component-/Service-/Test-Proof-State und eine autorisierte user-facing Work Surface.

Target app area: `AREA-01`.

Mapped process IDs:

- `BP-011` Providerless current-user mapping
- `BP-012` Invitation acceptance
- `BP-013` Identity/profile activation
- `BP-014` Tenant membership assignment
- `BP-015` Role assignment
- `BP-016` Permission evaluation
- `BP-017` Object-scope evaluation
- `BP-018` Access request workflow
- `BP-019` Second confirmation
- `BP-020` Admin non-bypass enforcement
- `BP-022` Denied access audit
- `BP-103` Platform settings administration
- `BP-104` Security configuration
- `BP-105` Tenant policies administration
- `BP-106` Evidence template administration
- `BP-107` Export/redaction template administration
- `BP-108` Policy versioning
- `BP-109` Team assignment

Target screens: `S007`, `S009`, `S011`, `S012`, `S013`, `S017`, `S018`, `S048`, `S049`, `S050`, `S051`.

Current code seams named by the epic:

- `lib/permission-engine.ts`
- `lib/tenant-governance-workflow-actions.ts`
- `components/admin-tenant-setup-screen.tsx`
- `components/decisions-governance-screen.tsx`

Out of scope remains: blind schema replacement, production IdP overbuild, new product scope outside True-UX route evolution authority, screen/image generation, client-visible unapproved advice.

## 2. EPIC-06 Child Ticket Chain

| Order | Ticket | Status in masterplan | Required output | Decision |
| --- | --- | --- | --- | --- |
| 1 | `EPIC-06-ANALYSIS-01` | Planned | EPIC-06 domain gap report | Executable first; this report is the output. |
| 2 | `EPIC-06-SPEC-01` | Blocked | EPIC-06 implementation contract | Becomes executable after this report. |
| 3 | `EPIC-06-IMPL-01` | Blocked | Implementation slices `01A` to `01D` | Must not start before SPEC-01. |
| 4 | `EPIC-06-QA-01` | Blocked | Positive, negative and screenshot proof | Must not start before implementation. |

Implementation subtasks under `EPIC-06-IMPL-01`:

- `EPIC-06-IMPL-01A`: implement primary area hub/workbench entry; validation: route smoke and screenshot proof.
- `EPIC-06-IMPL-01B`: implement queue/detail/step surfaces for the core process cluster; validation: targeted Playwright/source tests.
- `EPIC-06-IMPL-01C`: implement proof/audit/client-safe boundaries; validation: negative no-overclaim tests.
- `EPIC-06-IMPL-01D`: update process coverage matrix statuses; validation: matrix integrity check.

## 3. Sources Inspected

Authority and preflight:

- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- `pnpm guard:source` result before EPIC-06 work: PASS
- `git status --short --branch`: clean on `full-workflow...origin/full-workflow [ahead 25]`

Process and route evidence:

- `docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json`
- `lib/route-registry.ts`
- `docs/00-current/ALPHAVEST_PROCESS_FIRST_UX_LAYOUT_CONTRACT.md`
- `docs/00-current/ALPHAVEST_WP06_RBAC_ADMIN_NON_BYPASS_EXECUTION.md`

Runtime/component/service/test seams:

- `lib/permission-engine.ts`
- `lib/tenant-governance-action-contract.ts`
- `lib/tenant-governance-workflow-actions.ts`
- `app/api/tenant-governance/actions/route.ts`
- `components/admin-tenant-setup-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `tests/permission-engine.spec.ts`
- `tests/governance-non-bypass.spec.ts`
- `tests/tenant-governance-actions-api.spec.ts`
- `tests/governance-user-drawer-lifecycle.spec.ts`
- `tests/role-drawer-confirmation-lifecycle.spec.ts`
- `tests/access-request-drawer-lifecycle.spec.ts`
- `tests/wp02-worksurface-shell.spec.ts`
- `tests/ux-data-surface-contract.spec.ts`

## 4. Current Implementation Truth

Strong existing seams:

- `permissionEngine.can` enforces tenant mismatch, missing tenant context, actor tenant mismatch, actor tenant membership, object-scope target/type/tenant mismatch, explicit object target, explicit object scope, internal advice payload denial and admin/security non-bypass for evidence sufficiency, client visibility and export.
- `permissionEngine.evaluateRouteBoundary` separates route shell access from action and payload decisions.
- `tenantGovernanceCanonicalApiRoute` is `/api/tenant-governance/actions`.
- Tenant/governance action IDs cover J06/J07 tenant, user, role, access and audit commands.
- `/api/tenant-governance/actions` fails closed when `DATABASE_URL` is absent, rejects unsupported actions without command execution, returns `clientVisible: false`, and carries no client release/advice execution safety flags.
- Governance UI already has no-overclaim lifecycle controls for user invite, role drawer/second confirmation and access-request approval.
- Worksurface shell tests include `S007`, `S009`, `S011`, `S012`, `S013`, `S017`, `S018`, `S048`, `S049`, `S050`.

Hard gap:

- The P0 coverage matrix still marks every EPIC-06 process as either `specified_only` or `partially_implemented`.
- Every mapped EPIC-06 process has empty `proof_refs.positive` and `proof_refs.negative`.
- Missing layers repeat across the mapped processes: `negative_test`, `step_level_gate_proof`, `audit_or_evidence_failure_proof`, and for the specified-only processes also `implementation_touchpoint_proof`.

Conclusion: The repo has real safety/UX/service seams, but EPIC-06 cannot be honestly claimed complete at process level yet. The current truth is `partial implementation with strong cross-cutting safety proof, missing per-process step proof`.

## 5. Process Gap Matrix

| Process | Current matrix state | Real code/test evidence found | Missing steps/proof |
| --- | --- | --- | --- |
| `BP-011` Providerless current-user mapping | `specified_only`, `specified_not_proven` | Demo/current-user context exists through demo session, route boundary checks and providerless-scope/permission tests in adjacent seams. | All 4 steps need implementation touchpoint proof, negative tests, step-level gate proof, audit/evidence failure proof. |
| `BP-012` Invitation acceptance | `partially_implemented`, `partial_current_app_representation` | Tenant and governance invite UI/actions exist via J06/J07 commands and drawer lifecycle tests. | Missing step-level positive/negative proof and audit/evidence failure proof for invitation acceptance itself. |
| `BP-013` Identity/profile activation | `partially_implemented`, `partial_domain_representation` | Route family exists and profile/current-user APIs exist; permission engine can evaluate role/tenant context. | Missing explicit activation state machine, negative proof and audit/evidence failure proof. |
| `BP-014` Tenant membership assignment | `specified_only`, `specified_not_proven` | Tenant user screens and tenant governance command surface exist. | All 4 steps need implementation touchpoint proof, negative tests, step-level gate proof, audit/evidence failure proof. |
| `BP-015` Role assignment | `partially_implemented`, `partial_current_app_representation` | Role drawer, second confirmation, `j07.saveRoleChanges`, governance non-bypass tests and permission engine role guards exist. | Missing per-step matrix proof tying role assignment to actor resolution, allow/deny and audit. |
| `BP-016` Permission evaluation | `partially_implemented`, `partial_current_app_representation` | `permissionEngine.can` and `evaluateRouteBoundary` are strong shared primitives. | Missing process-level proof refs and audit/evidence failure proof per P0 matrix. |
| `BP-017` Object-scope evaluation | `specified_only`, `specified_not_proven` | Permission engine implements object-scope target/type/tenant/object-id checks; permission tests cover some object-scope denial. | Matrix still lacks implementation touchpoint proof, negative proof, step-level gate proof and audit/evidence failure proof. |
| `BP-018` Access request workflow | `partially_implemented`, `partial_domain_representation` | `S050`, access request drawer lifecycle and `j07.approveAccess` typed action exist. | Missing explicit per-step proof for resolve/evaluate/allow-deny/audit. |
| `BP-019` Second confirmation | `partially_implemented`, `partial_current_app_representation` | Role drawer exact phrase confirmation and permission `requiresSecondConfirmation` exist. | Missing matrix proof refs and negative audit/evidence failure proof. |
| `BP-020` Admin non-bypass enforcement | `partially_implemented`, `partial_current_app_representation` | Strongest current seam: permission engine, governance non-bypass tests, visibility/export/evidence denials. | Missing per-process matrix closure and explicit step-level audit/evidence failure proof. |
| `BP-022` Denied access audit | `partially_implemented`, `partial_current_app_representation` | Permission decisions require audit; typed workflows and governance API carry audit rows in tests. | Missing per-step denied access audit proof refs and failure-mode proof. |
| `BP-103` Platform settings administration | `partially_implemented`, `partial_current_app_representation` | `S007` work surface exists with RBAC safety note and route metadata `MANAGE PLATFORM`. | Missing step-level validation/confirm/audit/apply proof and negative test specific to platform settings. |
| `BP-104` Security configuration | `partially_implemented`, `partial_current_app_representation` | Route `S010` exists but is not in EPIC-06 target list; target list focuses adjacent platform screens. | Missing explicit EPIC-06 target-surface decision and process proof. This is a decision pressure point for SPEC-01. |
| `BP-105` Tenant policies administration | `partially_implemented`, `partial_domain_representation` | `S017` tenant policies work surface exists with client-visibility-sensitive route metadata. | Missing validate/confirm/audit/apply proof and negative tests. |
| `BP-106` Evidence template administration | `partially_implemented`, `partial_domain_representation` | `S011` route exists with evidence template work surface and admin shell adoption. | Missing template-specific state machine and audit proof. |
| `BP-107` Export/redaction template administration | `partially_implemented`, `partial_domain_representation` | `S012` route exists and export safety primitives exist elsewhere. | Missing template-specific confirm/audit/apply proof and negative tests. |
| `BP-108` Policy versioning | `specified_only`, `specified_not_proven` | Policy-related UI exists but no explicit versioning command/state proof was found in the EPIC-06 target seams. | All 5 steps need implementation touchpoint proof, negative tests, step-level gate proof, audit/evidence failure proof. |
| `BP-109` Team assignment | `partially_implemented`, `partial_current_app_representation` | Tenant team route `S016` and `j06.assignTeam` exist, but `S016` is not in the EPIC-06 target screen list. | SPEC-01 must decide whether team assignment proof remains via adjacent route `S016` or target list expands by route-evolution record. |

## 6. Risk Assessment

P0 risk:

- If `EPIC-06-IMPL-01` simply adds more UI copy, it will mask the real gap. The problem is not missing explanation; the problem is missing per-process proof closure in the matrix.

Route/scope risk:

- `BP-104` naturally maps to `S010`, and `BP-109` naturally maps to `S016`, but these are not in the EPIC-06 target screen list. Implementing them as target surfaces without a route-evolution/contract decision would violate the True-UX discipline.

Safety risk:

- Existing admin non-bypass code is strong. The bigger risk is drift: multiple UI/API/action seams prove fragments, but the coverage matrix has no canonical proof refs, so future work can overclaim completion.

## 7. Recommendation For SPEC-01

Bold recommendation: make EPIC-06 a canonical governance spine instead of adding compatibility prose.

SPEC-01 should define one EPIC-06 process contract with:

- one canonical actor/tenant/object decision primitive: `permissionEngine.evaluateRouteBoundary` plus `permissionEngine.can`
- one canonical mutation command spine for tenant/governance actions: `/api/tenant-governance/actions`
- one canonical proof/audit pattern: every sensitive allow/deny path either writes audit or has an explicit fail-closed reason
- one canonical surface family: `S048` hub, `S049` role/confirmation, `S050` access request, `S051` audit history, with `S007/S009/S011/S012/S013/S017/S018` as setup/admin sources
- one explicit route decision for `BP-104` and `BP-109`: either include adjacent `S010/S016` by route-evolution record or mark these processes as deliberately out-of-target but covered by shared service proof

Do not hide this with a generic "admin settings" panel. Burn down the legacy ambiguity by giving each BP process a target surface, service primitive, positive proof, negative proof and matrix status.

## 8. DoD Result For EPIC-06-ANALYSIS-01

DoD: Each mapped process has implementation status and missing step list.

Result: PASS for analysis.

Implementation status:

- Fully implemented/proven at matrix level: none.
- Partially implemented with real code/test seams: `BP-012`, `BP-013`, `BP-015`, `BP-016`, `BP-018`, `BP-019`, `BP-020`, `BP-022`, `BP-103`, `BP-104`, `BP-105`, `BP-106`, `BP-107`, `BP-109`.
- Specified-only / not proven in matrix: `BP-011`, `BP-014`, `BP-017`, `BP-108`.

Next executable ticket: `EPIC-06-SPEC-01`.

Screenshot: not applicable; analysis-only artefact, no UI change.
