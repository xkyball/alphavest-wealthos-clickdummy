# ALPHAVEST WP05 Internal Draft / Advisor / Compliance Flow Execution

Generated: 2026-06-25
Target branch: `full-workflow`
Source upload: `/Users/chris/Downloads/alphavest/ALPHAVEST_WP05_INTERNAL_DRAFT_ADVISOR_COMPLIANCE_FLOW_BOC_TICKET_STRUCTURE.md`
Operative repo authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

## 0. Moving Baseline Preflight

Task status: DONE

Reported baseline:

- Branch: `full-workflow`
- Remote state before implementation: `full-workflow...origin/full-workflow [ahead 24]`
- Latest implementation-start commit: `0a9248e docs: add wp05 advisory flow execution spec`
- Working tree before WP05 documentation edit: clean
- Diff stat before WP05 documentation edit: empty
- Package manager: `pnpm@9.15.9`
- Guard: `pnpm guard:source` PASS, 0 violations
- Route registry: `lib/route-registry.ts` exists and contains WP05 routes 033-042.
- Test inventory: WP05-relevant tests exist, including `tests/demo-workflow-api.spec.ts`, `tests/journey-api.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/client-visibility-projection.spec.ts`, `tests/permission-engine.spec.ts`, `tests/governance-non-bypass.spec.ts`, `tests/true-ux-p0-safety.spec.ts`, `tests/scf-p04-p06-flow-ui.spec.ts` and route/navigation smoke tests.

Decision: Preflight passes. `DECISION-WP05-1` was approved by the user on 2026-06-25 with Option A.

## 1. Upload Interpretation

WP05 is the controlled advisory chain:

Internal AI/rules draft -> analyst review/rebuild -> advisor approval -> compliance review/block/request evidence/release -> downstream client-safe visibility.

Core safety rules:

- AI/rules drafts are internal-only.
- Unsupported claims must not reach advisor or client as evidence-backed advice.
- Advisor approval is human review only and does not release content.
- Compliance release is the client-visibility gate.
- Release requires advisor approval, evidence sufficiency, client-safe payload, permission and audit persistence.
- Client visibility fails closed.

The upload explicitly rejects a single direct implementation task because the scope touches multiple routes, work surfaces, states, APIs, models, audit, RBAC, client visibility and P0 tests.

## 2. Extracted Task Chain

### EPIC: WP-05 Internal Draft / Analyst / Advisor / Compliance Flow

Description:
Build the process-first advisory gate chain from internal draft and analyst rebuild through advisor approval and compliance release, block or request evidence. Preserve AI Draft internal-only, Advisor Approval not Release, Compliance Release as the client-visibility gate, audit traceability and fail-closed safety.

Scope:

- Routes 033-042.
- Internal Workbench.
- Advisor Review Workspace.
- Compliance Release Workspace.
- Decision and Audit linkage.
- State, feedback, API, schema and test alignment.

Out of scope:

- Screen generation.
- Schema migration without separate approval.
- Held KYC/Committee routes.
- Export implementation.
- Client-visible AI Draft.
- Autonomous advice.

### ANALYSIS-WP05-1 Current advisory-flow implementation and gate audit

Type: Analysis / Research / Spike
Status in this execution: DONE

Detailed description:
Audit current routes, components, actions, services, models and tests for Draft -> Analyst -> Advisor -> Compliance. Determine which actions are static, demo-only, partial or mutating; where Recommendation, Approval, ComplianceReview, Decision, EvidenceRecord and AuditEvent are written; and where AI Draft leakage or Advisor-Approval-as-Release could occur.

Definition of done:

- Routes/components/actions/services/tests identified.
- Static/demo/real mutation boundaries classified.
- State labels and feedback text reviewed.
- Audit and permission checks mapped.
- Risks, gaps and implementation split proposed.

### SPEC-WP05-1 Draft -> Analyst -> Advisor -> Compliance workflow contract

Type: Specification / Design / Acceptance Criteria
Status in this execution: DONE as draft, blocked for human cutline approval

Detailed description:
Define target state machine, roles, work surface boundaries, state names, transition semantics, no-overclaim feedback, preconditions, payload visibility, audit expectations, API/service/schema boundaries and P0 positive/negative acceptance criteria.

Subtask: State taxonomy and transition naming contract

- Canonical state list.
- Allowed transition table.
- Forbidden transition table.
- Mapping to UI feedback and tests.

Subtask: Role/gate/payload/audit acceptance contract

- Role/action/payload/audit matrix.
- Positive and negative acceptance criteria.
- Admin non-bypass coverage.
- P0 test obligations.

### DECISION-WP05-1 Human approval of WP-05 state/API/gate cutline

Type: Human Decision / Approval
Status in this execution: DONE

Detailed description:
Approve or correct state taxonomy, implementation cutline, API approach, audit-failure handling and whether Decision Record linkage is included in the first WP05 wave.

Required human outputs:

- Approved state/API/gate cutline.
- API strategy.
- Audit-failure behavior.
- Decision Record inclusion decision.
- Go/no-go for implementation tasks.

Approved cutline:

- Canonical API/command strategy: `/api/journeys/:id/commands` is the WP05 command spine.
- Demo Workflow strategy: typed `/api/demo-workflow` recommendation-review remains compatibility/demo fixture only and must map to canonical WP05 commands/states.
- Audit behavior: fail closed before mutation for critical gate actions.
- Decision/Audit linkage: minimal linkage included in WP05 first wave.
- API/schema: no new API and no schema migration in first wave.

### IMPL-WP05-1 Internal Workbench draft/rebuild and unsupported-claim control

Status: Blocked until `ANALYSIS-WP05-1`, `SPEC-WP05-1` and `DECISION-WP05-1`

Detailed description:
Implement Internal Workbench handling so AI/rules drafts remain internal-only, unsupported claims are flagged or rejected, evidence gaps are visible, and Analyst can rebuild/escalate to Advisor only after evidence and state conditions pass.

Subtasks:

- Draft internal-only state handling.
- Unsupported claim / evidence-gap states.
- Analyst rebuild/escalate-to-advisor action path.

### IMPL-WP05-2 Advisor approval not release

Status: Blocked until `SPEC-WP05-1`, `DECISION-WP05-1` and internal handoff semantics are accepted

Detailed description:
Implement Advisor Review so approval creates compliance-pending state only. Advisor can approve for compliance, return to analyst or request evidence, but never release content or create client visibility.

Subtasks:

- Advisor queue/detail state and validation.
- Approve-for-compliance transition.
- Return-to-analyst / needs-evidence transition.

### IMPL-WP05-3 Compliance release/block/request-evidence gate

Status: Blocked until `SPEC-WP05-1`, `DECISION-WP05-1`, advisor approval semantics and WP04 evidence sufficiency semantics

Detailed description:
Implement or harden Compliance Release Workspace so Compliance can validate preconditions, block, request evidence or release only a client-safe projection, with audit and fail-closed behavior.

Subtasks:

- Compliance precondition checks.
- Block/request-evidence action state.
- Release action with audit and fail-closed behavior.
- Compliance audit/exception surface integration.

### IMPL-WP05-4 Decision/audit linkage for released or blocked advisory item

Status: Blocked until compliance outcomes are stable

Detailed description:
Link advisor/compliance outcomes to Decision, Evidence and Audit Record surfaces. The record must distinguish draft, advisor approval, compliance pending, compliance blocked, compliance released and client acceptance/non-acceptance.

Execution steps:

- Map outcome states into Decision Record.
- Link relevant evidence and audit references.
- Prevent client acceptance overclaim.

### QA-WP05-1 End-to-end P0 validation for advisory gate chain

Status: Blocked until implementation tasks complete

Detailed description:
Validate positive and negative cases for Draft -> Analyst -> Advisor -> Compliance.

Required proof:

- Draft remains internal-only.
- Unsupported draft cannot proceed without rebuild/evidence.
- Advisor approval creates compliance-pending, not client visibility.
- Compliance release fails without advisor approval.
- Compliance release fails without sufficient evidence.
- Compliance release fails when audit persistence is unavailable.
- Admin cannot bypass.
- Decision record distinguishes release from client acceptance.

## 3. ANALYSIS-WP05-1 Result

### Route and Component Inventory

| Route ID | Route | Current component | Current status | WP05 assessment |
| --- | --- | --- | --- | --- |
| 033 | `/advisory` | `InternalWorkflowScreen` -> `SignalsPage` | Implemented via process shell/hub | Orientation only; no mutation |
| 034 | `/advisory/review-queue` | `InternalWorkflowScreen` -> `WorkbenchPage` | Implemented via hub | Queue surface; action detail lives elsewhere |
| 035 | `/advisory/triggers/:id/review` | `TriggerDetailPage` | UI action posts `j01.routeToAdvisor` | Legacy demo action path; not the clean canonical WP05 command path |
| 036 | `/advisor/reviews` | `AdvisorQueuePage` | Queue table and static states | Mostly UI; detail owns mutation |
| 037 | `/advisor/reviews/:id` | `AdvisorDetailPage` | Calls `runRecommendationReviewWorkflowAction(advisor_approve)` | Real mutation path through `/api/demo-workflow` |
| 038 | `/compliance/reviews` | `ComplianceQueuePage` | Queue surface and process states | Mostly UI |
| 039 | `/compliance/reviews/:id/decision-room` | `ComplianceReviewPage` | Request evidence/block modal uses typed recommendation review workflow | Real mutation path through `/api/demo-workflow` |
| 040 | `/compliance/reviews/:id/release` | `ReleasePage` / `ReleaseModal` | Calls typed `compliance_release` | Real mutation path through `/api/demo-workflow` |
| 041 | `/compliance/reviews/:id/block` | `DecisionsGovernanceScreen` -> `ComplianceBlockPage` | Implemented; contains request-evidence confirmation and blocked state | Corrected finding after deeper route dispatch read: route is not an InternalWorkflow fallback |
| 042 | `/compliance/reviews/:id/audit` | `DecisionsGovernanceScreen` -> `ComplianceAuditPage` | Implemented; audit surface covered by SCF P04-P06 UI test | Corrected finding after deeper route dispatch read: route is not an InternalWorkflow fallback |

### Service and API Inventory

| Surface | Current status | Finding |
| --- | --- | --- |
| `lib/demo-workflow-validation.ts` | Real typed state machine exists | Covers `submit_review`, `reject_unsupported_claim`, `rebuild_with_evidence`, `advisor_approve`, `compliance_release`, `compliance_block`, `request_evidence` |
| `lib/demo-workflow-mutation.ts` | Real mutating recommendation-review workflow exists | Writes Recommendation, Approval, ComplianceReview, EvidenceRecord, EvidenceItem and AuditEvent |
| `app/api/demo-workflow/route.ts` | Mixed API for old `jXX.*` actions and typed recommendation-review | Functional but overloaded; this is the main cleanup target |
| `lib/journeys/journey-api-service.ts` | Real journey command API exists | Covers `AI_DRAFT_INTERNAL`, `ADVISOR_APPROVE`, `COMPLIANCE_BLOCK`, `COMPLIANCE_REQUEST_EVIDENCE`, `COMPLIANCE_RELEASE`, sufficiency decisions and audit |
| `app/api/journeys/[id]/commands/route.ts` | Canonical authenticated command endpoint exists | Stronger long-term foundation than ad hoc demo workflow actions |
| `lib/workflow-gate.ts` | Shared release/client visibility gate exists | `canPassComplianceReleaseGate` requires advisor, evidence, payload, permission and audit |
| `lib/visibility-engine.ts` | Client-safe projection boundary exists | Redacts `clientSummaryDraft`, internal rationale, compliance notes, audit metadata and assumptions |
| `lib/audit-service.ts` | Critical audit contract exists | Critical actions fail closed if audit persistence is unavailable |

### Current Positive Proof

- `tests/demo-workflow-api.spec.ts` proves the typed recommendation-review spine:
  - analyst submit review;
  - unsupported claim rejection;
  - evidence-backed rebuild;
  - advisor approval without client release;
  - compliance release blocked before prerequisites;
  - missing evidence, internal draft marker, missing payload and audit failure all block release;
  - successful release returns a client-safe projection only.
- `tests/journey-api.spec.ts` proves journey commands:
  - explicit evidence sufficiency;
  - AI draft internal-only;
  - advisor approval no release;
  - compliance release only with phrase, evidence, advisor and audit gates;
  - upload-only/admin/cross-tenant fail-closed cases.
- `tests/workflow-gate.spec.ts` proves the pure gates for evidence sufficiency, advisor-not-release, AI Draft/internal-rationale block and audit persistence.
- `tests/client-visibility-projection.spec.ts` proves internal fields are hidden from client projections.

### Current Gaps / Risks

1. Two command stacks exist in parallel:
   - `/api/demo-workflow` typed `recommendation-review`.
   - `/api/journeys/:id/commands`.
   Both are real enough to pass P0 tests, but they can drift.
2. Pre-implementation, `RecommendationStatus.COMPLIANCE_PENDING` existed in schema but the typed recommendation-review approval path set `ADVISOR_APPROVED` plus `ComplianceReview.status = PENDING`. This was changed in Option A implementation so advisor approval now outputs `COMPLIANCE_PENDING`.
3. UI still mixes static Phase panels and real mutation controls. The critical controls are real, but several surrounding cards remain explanatory/static.
4. Demo workflow release mutates `clientVisible: true` directly after passing gates. This remains acceptable in the current demo because release now uses the client-safe release phrase and projection proof; future work should move demo workflow behind the canonical journey command/service adapter.
5. Decision linkage was stronger in `journey-api-service` than in typed `demo-workflow`. Option A implementation adds minimal release/block/request Decision linkage metadata and release Decision status linkage in demo workflow.

## 4. SPEC-WP05-1 Draft Contract

### Canonical States

Recommended canonical WP05 state labels:

| Canonical label | Existing schema/service mapping | Meaning |
| --- | --- | --- |
| `DRAFT_INTERNAL_ONLY` | `RecommendationStatus.AI_DRAFT`, `metadata.aiDraftInternalOnly` | Internal AI/rules draft exists and is never client-visible |
| `UNSUPPORTED_CLAIM_BLOCKED` | `REVISION_REQUESTED`, `ReviewStatus.REQUEST_MORE_DATA`, `ComplianceStatus.NEEDS_EVIDENCE` | Analyst rejected unsupported claim |
| `EVIDENCE_GAP` | `MORE_DATA_REQUESTED`, `ComplianceStatus.NEEDS_EVIDENCE`, evidence `PLACEHOLDER/CREATED` | Evidence missing, unreviewed, wrong-scope or insufficient |
| `ANALYST_REBUILT_WITH_EVIDENCE` | `ANALYST_REVIEWED`, accepted scoped evidence | Analyst rebuilt internal draft with accepted evidence |
| `ADVISOR_APPROVED_FOR_COMPLIANCE` | `ReviewStatus.APPROVED` plus `RecommendationStatus.COMPLIANCE_PENDING` output | Advisor approved; not released |
| `COMPLIANCE_PENDING` | `ComplianceReview.status = PENDING`; `RecommendationStatus.COMPLIANCE_PENDING` | Compliance gate must still decide |
| `COMPLIANCE_NEEDS_EVIDENCE` | `ComplianceStatus.NEEDS_EVIDENCE`, `RecommendationStatus.MORE_DATA_REQUESTED` | Compliance requested evidence |
| `COMPLIANCE_BLOCKED` | `ComplianceStatus.BLOCKED`, `RecommendationStatus.BLOCKED` | Compliance blocks release |
| `COMPLIANCE_RELEASED_CLIENT_SAFE` | `ComplianceStatus.RELEASED`, `RecommendationStatus.RELEASED_TO_CLIENT`, client-safe projection only | Release passed gates |
| `CLIENT_ACCEPTANCE_SEPARATE` | `DecisionStatus.ACCEPTED/DEFERRED/REJECTED` | Downstream client decision, not WP05 release |

### Allowed Transitions

| From | Action | Actor | To | Required gates |
| --- | --- | --- | --- | --- |
| `DRAFT_INTERNAL_ONLY` | `reject_unsupported_claim` | Analyst | `UNSUPPORTED_CLAIM_BLOCKED` | Reason, audit |
| `DRAFT_INTERNAL_ONLY` / `UNSUPPORTED_CLAIM_BLOCKED` / `EVIDENCE_GAP` | `rebuild_with_evidence` | Analyst | `ANALYST_REBUILT_WITH_EVIDENCE` | Accepted scoped evidence, audit |
| `ANALYST_REBUILT_WITH_EVIDENCE` | `advisor_approve` | Advisor | `ADVISOR_APPROVED_FOR_COMPLIANCE` / `COMPLIANCE_PENDING` | Advisor role, audit |
| `ADVISOR_APPROVED_FOR_COMPLIANCE` | `request_evidence` | Compliance | `COMPLIANCE_NEEDS_EVIDENCE` | Compliance role, reason, audit |
| `ADVISOR_APPROVED_FOR_COMPLIANCE` | `compliance_block` | Compliance | `COMPLIANCE_BLOCKED` | Compliance role, phrase/reason, audit |
| `COMPLIANCE_PENDING` | `compliance_release` | Compliance | `COMPLIANCE_RELEASED_CLIENT_SAFE` | Advisor approval, evidence sufficiency, payload ready, permission, audit, phrase |

### Forbidden Transitions

- Draft directly to client visibility.
- Analyst directly to compliance release.
- Advisor approval to client visibility.
- Compliance release without advisor approval.
- Compliance release without sufficient scoped evidence.
- Compliance release with internal draft marker or internal rationale payload.
- Compliance release without audit persistence.
- Admin release bypass.
- Compliance release equals client acceptance.

### Role / Payload / Audit Contract

| Actor | May do | Must not do | Payload boundary | Audit |
| --- | --- | --- | --- | --- |
| Analyst | Internal draft, reject unsupported claim, rebuild with evidence, route to advisor | Release, advisor approve, compliance block | Internal draft and notes are internal-only | Review/rebuild/reject actions require audit |
| Advisor | Review, approve for compliance, return/request more evidence where implemented | Release to client or mark compliance released | Sees internal package, not client projection authority | Approval/return require audit |
| Compliance | Block, request evidence, release after all gates | Skip advisor/evidence/payload/audit gates | Release emits only client-safe projection | Block/request/release require audit and fail closed |
| Client | See released/redacted client-safe projection | See internal draft, rationale, compliance notes, unreleased evidence | Client-safe projection only | Client acceptance is downstream |
| Admin | Manage platform context | Bypass release/evidence/advisor/audit gates | No special payload bypass | Denied attempts audited |

### Acceptance Criteria

- Given an internal draft with unsupported claims, analyst rejection keeps the recommendation client-hidden and marks evidence/advisor/compliance gates missing.
- Given accepted scoped evidence, analyst rebuild can produce an advisor-review-ready item without release.
- Given advisor approval, recommendation remains client-hidden and compliance pending.
- Given missing evidence, compliance release is denied and no release/clientVisible mutation occurs.
- Given audit persistence failure, release fails closed and state remains unreleased.
- Given all preconditions, compliance release creates only a client-safe projection, not internal payload exposure and not client acceptance.
- Given admin tries to force release, mutation is denied.

## 5. DECISION-WP05-1 Options

### Option A - Approved and Implemented in First Wave: Canonical Journey Command Path, Demo Workflow Compatibility Only

Decision:
Make `/api/journeys/:id/commands` the canonical WP05 command spine. Keep `/api/demo-workflow` typed recommendation-review only as compatibility/test/demo fixture until it can delegate to the same command/service contract.

Implementation cutline:

- First wave: normalize state naming, route 041/042 rendering branches, UI copy and tests against the canonical command contract.
- Second wave: extract shared advisory gate service or adapter so demo workflow and journey commands cannot drift.
- No new API.
- No schema migration in first wave.
- Include minimal Decision/Audit linkage for compliance release/block; full client acceptance remains downstream.

Audit failure:
Fail closed before mutation. No pending-soft-success for release/block/sufficiency decisions.

Why this is the cleanest aggressive path:

- Removes duplicated gate semantics over time instead of adding a third stack.
- Uses the already-authenticated journey API as the product-shaped command boundary.
- Preserves existing P0 proof while giving a concrete cleanup target.
- Avoids route/UI-only fixes.
- Keeps WP05 inside True-UX boundaries without inventing new product scope.

### Option B - Rejected: Faster but Dirtier `/api/demo-workflow` Authority

Decision:
Keep typed `recommendation-review` in `/api/demo-workflow` as the WP05 authority and only patch UI/routes/tests around it.

Pros:

- Fastest next implementation.
- Lowest short-term test churn.

Cons:

- Leaves duplicate command logic next to journey commands.
- Keeps demo-workflow overloaded with unrelated `jXX.*` actions.
- Higher future drift risk.

### Option C - Rejected: New Dedicated Advisor/Compliance API

Decision:
Create a new `/api/advisory-review` or `/api/compliance-release` contract now.

Pros:

- Clean naming on paper.

Cons:

- Adds a third command stack.
- Requires more API/test/auth/scope work.
- Violates the aggressive cleanup goal unless paired with immediate deletion/migration.

Recommendation: do not choose this for WP05.

### Option D - Rejected for This Wave: Stop at Advisor Approval / Compliance Pending

Decision:
Implement only internal draft/rebuild and advisor approval; defer compliance release.

Pros:

- Lower blast radius.

Cons:

- Avoids the main WP05 trust chain.
- Leaves compliance release debt and duplicated paths unresolved.

Recommendation: use only if time-boxed or if canonical command consolidation is not approved.

## 6. Aggressive Recommendation

Option A was approved and executed.

After approval, execute implementation in this order:

1. `IMPL-WP05-1`: internal draft/rebuild control, but align UI/action semantics with canonical command names.
2. `IMPL-WP05-2`: advisor approval outputs explicit compliance-pending semantics and no release.
3. `IMPL-WP05-3`: compliance preconditions, block/request/release, route 041/042 branch cleanup, audit fail-closed.
4. `IMPL-WP05-4`: minimal Decision/Audit linkage for release/block/request evidence.
5. `QA-WP05-1`: run focused API/service/UI P0 suite plus route/navigation smoke.

## 7. Implementation Result

Implemented files:

- `lib/advisory-workflow-contract.ts`
- `lib/journeys/journey-command-registry.ts`
- `lib/journeys/journey-api-service.ts`
- `lib/demo-workflow-validation.ts`
- `lib/demo-workflow-mutation.ts`
- `components/internal-workflow-screen.tsx`
- `tests/demo-workflow-api.spec.ts`
- `tests/demo-workflow-validation.spec.ts`
- `tests/confirmation-lifecycle.spec.ts`
- `tests/wp05-advisory-workflow-contract.spec.ts`
- `docs/00-current/ALPHAVEST_WP05_INTERNAL_DRAFT_ADVISOR_COMPLIANCE_FLOW_EXECUTION.md`

Implementation notes:

- Added `wp05CanonicalStates`, canonical Journey command IDs, client-safe release phrase and demo workflow compatibility mapping.
- `journeyCommandIds` now takes WP05-specific commands from the shared WP05 contract.
- Journey advisor approval now sets recommendation state to `COMPLIANCE_PENDING`.
- Typed demo workflow advisor approval now sets recommendation state to `COMPLIANCE_PENDING`.
- Typed demo workflow returns/audits `canonicalCommand`, `canonicalState` and `DEMO_WORKFLOW_COMPATIBILITY_ONLY` metadata.
- Compliance release confirmation phrase is now `RELEASE CLIENT-SAFE JOURNEY`.
- Compliance release updates linked Decision rows to `RELEASED_TO_CLIENT`, sets `releasedToClientAt` and links the evidence record while leaving client acceptance fields empty.
- Compliance block/request evidence actions link available evidence into the Decision record without overclaiming release.

## 8. QA-WP05-1 Validation Evidence

Validation commands:

- `pnpm typecheck` - PASS
- `pnpm playwright test tests/wp05-advisory-workflow-contract.spec.ts tests/demo-workflow-validation.spec.ts --workers=1` - PASS, 2/2
- `pnpm playwright test tests/demo-workflow-api.spec.ts --workers=1` - PASS, 15/15
- `pnpm playwright test tests/journey-api.spec.ts --workers=1` - PASS, 8/8
- `pnpm playwright test tests/workflow-gate.spec.ts tests/client-visibility-projection.spec.ts --workers=1` - PASS, 17/17
- `pnpm playwright test tests/confirmation-lifecycle.spec.ts tests/scf-p04-p06-flow-ui.spec.ts --workers=1` - PASS, 7/7
- `pnpm guard:source` - PASS
- `pnpm db:validate` - PASS
- `pnpm lint` - PASS with existing warnings only

Route-smoke note:

- `pnpm test:route-smoke` was attempted as an aggressive additional gate. The registered route smoke section reached WP05 routes 038-042 successfully, then the broader pre-existing `UX-PAGE workbench structure` block failed on missing `ux-page-workbench-triad` expectations beginning at `/documents` and other non-WP05 workbench routes. This is not counted as a WP05 pass gate; focused WP05 route/API/UI coverage above is the acceptance evidence for this wave.

Screenshot proof:

- `artifacts/wp05-advisory-flow/release-client-safe-journey-desktop.png`

Observed UI proof:

- Release dialog title is `Release client-safe journey`.
- Release confirmation prompt requires `RELEASE CLIENT-SAFE JOURNEY`.
- Initial release action remains blocked until acknowledgement plus exact phrase are provided.
- Dialog copy preserves the safety boundary: no unapproved advice reaches the client, advisor approval alone is not enough and client acceptance/export/share remain separate.

## 9. Current Stop State

Implementation wave and focused QA are complete.

No further human decision is required for this first Option A wave.
