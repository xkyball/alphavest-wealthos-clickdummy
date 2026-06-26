# ANALYSIS-1.1 - PP-004 Advisor/Compliance/Release Readiness & Dependency Preflight

Generated: 2026-06-26

Status: `COMPLETE`

Source ticket: `ANALYSIS-1.1`

## Executive Finding

PP-004 is ready for specification and decision-gate review. The current repo already contains strong PP-004 implementation seams:

- typed journey command API: `app/api/journeys/[id]/commands/route.ts`;
- typed command service: `lib/journeys/journey-api-service.ts`;
- advisor workflow command bus: `app/api/recommendation-review-workflow/route.ts` and `lib/typed-workflow-command-bus.ts`;
- release precondition evaluators: `lib/workflow-gate.ts` and `lib/release-spine-command-surface.ts`;
- accepted PP001/PP002/PP003 contracts and tests.

The main specification need is not whether these concepts exist. They do. The need is to lock one canonical PP-004 proof path and prevent older demo compatibility paths from becoming false proof.

## Affected Routes And Surfaces

| Source route range | Current role | PP-004 relevance |
| --- | --- | --- |
| `036-037` Advisor Approval | Advisor review queue/detail and advisor candidate boundary | Advisor approval must remain compliance-pending/internal and not client-visible. |
| `038-041` Compliance | Compliance review, release, block and request evidence | Compliance release/block/request evidence are the core PP-004 gate actions. |
| `042-045` Audit / Decision | Audit/decision/submitted state | Decision record and audit persistence prove what happened without overclaiming client acceptance. |
| `019-020` Client Portal/Mobile | Client projection | Client sees only released, redacted, client-safe content. |
| `054-058` Export | Downstream PP-005 dependency | PP-004 defines released-client-safe state; export remains PP-005-owned. |

## Affected Code Paths

| Area | Current file(s) | Finding |
| --- | --- | --- |
| Typed journey commands | `app/api/journeys/[id]/commands/route.ts`, `lib/journeys/journey-api-service.ts` | Best candidate for canonical PP-004 release path. It already handles `ADVISOR_APPROVE`, `COMPLIANCE_BLOCK`, `COMPLIANCE_REQUEST_EVIDENCE` and `COMPLIANCE_RELEASE`. |
| Advisor workflow command bus | `app/api/recommendation-review-workflow/route.ts`, `lib/typed-workflow-command-bus.ts` | Strong advisor candidate and release-spine command path. It consumes PP003 draft lifecycle logic and release-spine preconditions. |
| Workflow gates | `lib/workflow-gate.ts` | Provides `canBecomeClientVisible` and `canPassComplianceReleaseGate`. It checks advisor approval, evidence sufficiency, payload readiness, permission, audit persistence and data quality. |
| Release spine | `lib/release-spine-command-surface.ts` | Provides canonical release preconditions with missing reasons for advisor, evidence, audit, redaction, rationale, payload, permission, data quality and export-specific downstream fields. |
| PP003 contract | `lib/pp003-advice-boundary-contract.ts` | Contains field classification, surface redaction matrix and draft lifecycle gate that PP-004 must consume directly. |
| PP001 payload contract | `lib/pp001-payload-visibility-contract.ts` | Provides client payload visibility classes and forbidden payload inspection. |
| Visibility | `lib/visibility-engine.ts`, `lib/client-portal-projection-state.ts`, `lib/client-context-visibility.ts` | Existing projection seams support fail-closed client visibility and redaction. |
| Audit | `lib/audit-service.ts`, Prisma `AuditEvent`, journey audit/run helpers | Critical gate actions already write audit events or fail closed when audit persistence is unavailable. |
| Demo compatibility | `app/api/demo-workflow/route.ts`, `tests/demo-workflow-api.spec.ts` | Useful compatibility proof, but not recommended as the canonical PP-004 proof path because it mixes legacy demo actions with newer typed APIs. |

## Prisma / State Inventory

| Model / enum | Current field or status | PP-004 use |
| --- | --- | --- |
| `Recommendation` | `status`, `clientVisible`, `advisorApprovalId`, `complianceReviewId`, internal summaries | Core object whose visibility must stay false until compliance release. |
| `Approval` | `status`, `approvalType`, `approvedAt`, `approverRoleKey`, `notes` | Advisor approval audit/state record. |
| `ComplianceReview` | `status`, `evidenceComplete`, `releaseNotes`, `releasedAt`, `blockedAt` | Compliance release/block/request-evidence record. |
| `Decision` | `status`, `releasedToClientAt`, `decisionAction`, `decisionReason`, `evidenceRecordId` | Released decision record and later client decision state. |
| `EvidenceRecord` | `status`, `visibilityStatus`, `sufficiencyDecisions` | PP002 canonical evidence input to release gate. |
| `AuditEvent` | actor, role, target, previous/next state, result, reason, metadata | Required proof for approval/block/evidence request/release/denial. |
| `ReviewStatus` | `APPROVED`, `REQUEST_MORE_DATA`, `IN_REVIEW` etc. | Advisor review status. |
| `ComplianceStatus` | `PENDING`, `RELEASED`, `BLOCKED`, `NEEDS_EVIDENCE` etc. | Compliance gate state. |
| `RecommendationStatus` | `COMPLIANCE_PENDING`, `RELEASED_TO_CLIENT`, `BLOCKED`, `MORE_DATA_REQUESTED` etc. | Recommendation progression state. |
| `DecisionStatus` | `DRAFT`, `RELEASED_TO_CLIENT`, `ACCEPTED`, `DEFERRED`, `REJECTED` etc. | Decision record and client decision separation. |

## Existing Test Coverage

| Test family | Coverage |
| --- | --- |
| `tests/journey-api.spec.ts` | Runs MJ-001 through explicit evidence, internal draft, advisor approval and compliance release gates; checks client projection excludes internal payload; checks upload-only, advisor-only, admin and cross-tenant paths fail closed. |
| `tests/pp003-advisor-candidate-boundary.spec.ts` | Proves advisor approval can create only compliance-pending/internal advisor candidate and not release/client visibility. |
| `tests/pp003-leakage-negative.spec.ts` | Proves PP003 forbidden payloads do not leak through client/API/decision surfaces. |
| `tests/pp003-boundary-audit-proof.spec.ts` | Proves critical PP003 boundary audit/trace proof. |
| `tests/pp002-evidence-sufficiency-canonical.spec.ts` | Proves canonical evidence sufficiency and upload-not-sufficiency. |
| `tests/client-visibility-projection.spec.ts` and `tests/client-visibility-proof.spec.ts` | Cover fail-closed client projection and visibility. |
| `tests/workflow-gate.spec.ts`, `tests/true-ux-p0-safety.spec.ts` | Cover generic advisor/compliance/client visibility gates and negative cases. |
| `tests/demo-workflow-api.spec.ts` | Covers legacy/demo workflow action behavior and retirement of unsafe export demo actions. |

## Candidate Release State Taxonomy

Use this taxonomy for `SPEC-1.2`:

| Canonical state | Current repo mapping |
| --- | --- |
| `advisor-approved/internal-only` | `Approval.status=APPROVED`, `Recommendation.status=COMPLIANCE_PENDING`, `Recommendation.clientVisible=false`, journey metadata `advisorApprovalIsNotRelease=true`. |
| `compliance-pending` | `ComplianceReview.status=PENDING`, recommendation still not client-visible. |
| `compliance-blocked` | `ComplianceReview.status=BLOCKED`, `blockedAt` set, recommendation blocked/internal, journey status blocked. |
| `evidence-requested` | `ComplianceReview.status=NEEDS_EVIDENCE`, recommendation `MORE_DATA_REQUESTED`, client visibility false. |
| `release-denied` | Failed `COMPLIANCE_RELEASE` with audit event `journey.compliance.release_denied`, no mutation to client-visible state. |
| `released-to-client` | `ComplianceReview.status=RELEASED`, `Recommendation.status=RELEASED_TO_CLIENT`, `Recommendation.clientVisible=true`, `Decision.status=RELEASED_TO_CLIENT`, `Decision.releasedToClientAt` set. |
| `client-decision-submitted` | Client action state after release; must remain separate from compliance release. |

## Gaps And Risks

| Finding | Severity | Recommendation |
| --- | --- | --- |
| Canonical proof path must be chosen. | P0 decision risk | Choose typed journey commands as canonical PP-004 path; keep `/api/demo-workflow` as compatibility context only. |
| PP-004 must consume PP003 gate/matrix directly. | P0 safety risk | Make `evaluatePp003DraftLifecycleGate`, `inspectPp003PayloadSurface`, `pp003SurfaceRedactionMatrix` explicit spec requirements. |
| Release-spine and workflow-gate overlap. | Medium architecture risk | Preserve both for now: `workflowGate` is UI/domain gate vocabulary; `release-spine-command-surface` is canonical precondition shape. Do not fork a third vocabulary. |
| Legacy/P44 evidence paths exist. | P0 false-proof risk | Quarantine unless adapted to PP002 canonical sufficiency. |
| Demo-workflow route still contains many legacy action IDs. | Medium false-proof risk | PP-004 tests should prefer typed journey commands and typed advisor workflow API; demo-workflow assertions should only prove no unsafe legacy shortcut. |
| Export readiness appears in release-spine output. | Medium downstream-scope risk | Keep `canExportAfterRelease` as PP-005 readiness information only; PP-004 release must not approve export/download/share. |

## Recommended Implementation Split

| Source task | Current recommendation |
| --- | --- |
| `IMPL-1.4` Advisor Approval Is Not Release | Likely already mostly covered by typed journey commands and PP003 advisor candidate boundary; implementation may be zero-delta plus targeted PP004 tests if spec confirms. |
| `IMPL-1.5` Compliance Preconditions / Release / Block / Request Evidence | Implement/harden against typed journey command path; likely small targeted gaps around explicit PP004 contract tests and release-denied audit assertions. |
| `IMPL-1.6` Decision Record / Client Projection | Already partially covered by MJ-001 journey API and visibility tests; likely needs PP004-specific release-state matrix tests. |
| `IMPL-1.7` Audit Persistence | Existing audit helpers are strong; PP004 may need a focused denied-release audit persistence test. |
| `IMPL-1.8` UX Safety Wording | Existing no-overclaim copy is broad; PP004 may need screenshots/text assertions for advisor/compliance pages if UI changes are approved. |
| `IMPL-1.9` Demo/API Directness Boundary | Recommended as the bold cleanup task: classify typed journey commands as canonical, retire or quarantine legacy release demo proof. |

## Ticket Completion

`ANALYSIS-1.1` is finished.
