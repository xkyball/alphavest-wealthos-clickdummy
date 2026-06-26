# ALPHAVEST WP04 Evidence Workflow Upload-not-Sufficiency Execution

Generated: 2026-06-25
Target branch: `full-workflow`
Source upload: `/Users/chris/Downloads/alphavest/ALPHAVEST_WP04_EVIDENCE_WORKFLOW_UPLOAD_NOT_SUFFICIENCY_BOC_TICKET_STRUCTURE.md`
Operative repo authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

## 0. Moving Baseline Preflight

Task status: DONE

Reported baseline:

- Branch: `full-workflow`
- Remote state: `full-workflow...origin/full-workflow [ahead 21]`
- Latest commit: `ad37f39 feat: implement wp03 client-safe projection states`
- Working tree before WP04 documentation edit: clean
- Diff stat before WP04 documentation edit: empty
- Package manager: `pnpm@9.15.9`
- Guard: `pnpm guard:source` PASS, 0 violations
- Route registry: `lib/route-registry.ts` exists and contains WP04-relevant routes including document, compliance, communication/export and client projection route families.
- Test inventory: WP04-relevant tests exist, including document upload API/flow/lifecycle hardening, evidence review API, workflow gate, permission engine, journey API, true UX P0 safety, export realism and audit fail-closed tests.

Decision: Preflight passes for read-only WP04 analysis and specification. Implementation remains blocked by `WP04-DECISION-1`.

## 1. Upload Interpretation

Core rule from WP04:

> Upload success is upload-only. It must never imply Evidence Sufficiency, Advisor Approval, Compliance Release, Client Visibility or Export Readiness.

WP04 is a P0 safety spine. The target chain is:

Upload -> Review -> Linkage -> Sufficiency Decision -> Compliance Gate -> Client-safe Visibility / Export.

## 2. Extracted Task Chain

The upload explicitly rejects a single direct implementation task. It requires an Epic delivery chain with analysis, specification, human policy decision, implementation slices and P0 QA.

### EPIC: WP04 Evidence Workflow & Upload-not-Sufficiency Safety Spine

Description:
Build the evidence workflow safety spine so that documents may be uploaded, but upload alone remains candidate evidence only. The workflow must separate document intake, human review, linkage to a scoped object or requirement, sufficiency decision, compliance release blocking, audit persistence and client-safe/export projection.

Detailed scope:

- Candidate upload evidence.
- Evidence review.
- Evidence linkage to object, recommendation, decision or compliance review.
- Evidence sufficiency decision.
- Compliance release blocker.
- Client visibility and export boundary.
- Audit evidence for critical transitions.
- P0 positive and negative proof.

Out of scope:

- New visual screen generation.
- State-screen image generation.
- Full KYC/SoW/Suitability/IPS policy buildout.
- Committee route unlock.
- Production storage redesign.
- Blind schema replacement.
- Export implementation beyond preventing premature evidence leakage.

### WP04-ANALYSIS-1 Evidence Workflow Reality Audit

Type: Analysis / Research / Spike
Status in this execution: DONE

Detailed description:
Analyse the current `full-workflow` codebase and AlphaVest artifacts to determine whether Upload, Document Review, Evidence Linkage, Evidence Sufficiency, Compliance Release Blocking, Audit and Tests are real, partial, static, demo-only or unproven. The analysis prevents existing upload code or evidence models from being overclaimed as complete sufficiency implementation.

Definition of done:

- Identify affected routes, APIs, services and tests.
- Separate upload-only from sufficiency.
- Name proof slices and missing P0 tests.
- Document specification needs.
- Validate or adjust implementation task boundaries.
- Pass open decisions to `WP04-DECISION-1`.

### WP04-SPEC-1 Evidence Sufficiency and Upload-not-Sufficiency Contract

Type: Specification / Design / Acceptance Criteria
Status in this execution: DONE as draft, blocked for human policy approval

Detailed description:
Define the target state precisely enough that implementation can harden upload, review, linkage, sufficiency gate, compliance block and audit without inventing business safety policy. The spec must define evidence state taxonomy, upload-only semantics, review and verification semantics, object linkage, sufficiency decision semantics, compliance release blocker, audit requirements, API/UI expectations, client visibility/export redaction boundaries and P0 acceptance.

Definition of done:

- State taxonomy is explicit.
- Upload-only semantics are explicit.
- Sufficiency criteria are explicit.
- Role/action boundaries are explicit.
- API/UI/test expectations are explicit.
- Implementation boundaries are explicit.
- Implementation tasks remain derivable with CTES.

### WP04-DECISION-1 Approve Minimal MVP Evidence Sufficiency Policy

Type: Human Decision / Approval
Status in this execution: STOP REQUIRED

Detailed description:
The human confirms the minimal MVP policy for Evidence Sufficiency: what is enough, who may decide, at which object/workflow level sufficiency applies and when release/export remain blocked. Codex must not invent this policy.

Required human outputs:

- Approved MVP Evidence Sufficiency Policy.
- Role/ownership decision.
- Scope-level decision.
- Stop rules for insufficient evidence.
- Confirmation that implementation may proceed.

### WP04-IMPL-1 Upload-only UI/API Semantics

Status: Blocked until `WP04-SPEC-1` and `WP04-DECISION-1`

Detailed description:
Implement UI and API semantics so a successful upload confirms only transfer/intake. It must not imply review completion, evidence sufficiency, compliance release, client visibility or export readiness.

Subtasks:

- `WP04-IMPL-1.1 Upload feedback wording and state separation`: visible upload copy must say upload is complete or review pending, with sufficiency/release/export/client visibility still locked.
- `WP04-IMPL-1.2 API response/payload no-sufficiency semantics`: upload and documents APIs must not include or imply sufficiency/release/client visibility after upload.

### WP04-IMPL-2 Evidence Review and Linkage Lifecycle

Status: Blocked until `WP04-SPEC-1`, `WP04-DECISION-1` and `WP04-IMPL-1`

Detailed description:
Implement or connect a review lifecycle and evidence-to-object linkage so evidence can be reviewed, marked insufficient/needs clarification, linked to the relevant target and later evaluated by sufficiency gates.

Subtasks:

- `WP04-IMPL-2.1 Evidence review states`: map uploaded/review pending/reviewed/insufficient states so no evidence can count before review.
- `WP04-IMPL-2.2 Evidence-to-object linkage`: enforce linkage to the relevant object, recommendation, compliance review, decision, export scope or evidence record.

### WP04-IMPL-3 Sufficiency Gate and Compliance Release Blocker

Status: Blocked until `WP04-IMPL-2`

Detailed description:
Implement a testable evidence sufficiency predicate and integrate it into compliance release so release is blocked when evidence is missing, unreviewed, unlinked, insufficient, stale, wrong-scope or unaudited.

Subtasks:

- `WP04-IMPL-3.1 Sufficiency gate derivation`: implement the pure predicate/derivation from approved policy.
- `WP04-IMPL-3.2 Compliance release block integration`: wire the predicate into compliance release/block/request evidence workflows.

### WP04-IMPL-4 Evidence Audit and Fail-Closed Behaviour

Status: Blocked until `WP04-SPEC-1`, `WP04-DECISION-1`, review/linkage/gate transitions and event list

Detailed description:
Harden audit events for evidence-critical actions and fail closed when audit persistence is unavailable. No sufficiency, compliance release or export action may silently complete without an audit trail.

Subtasks:

- `WP04-IMPL-4.1 Audit event mapping for evidence actions`: audit upload, review, linkage, sufficiency decision, request evidence, block and release where critical.
- `WP04-IMPL-4.2 Audit unavailable fail-closed handling`: block critical gate transition if audit write cannot be confirmed.

### WP04-QA-1 P0 Evidence Workflow Positive/Negative Validation

Status: Blocked until WP04 implementation tasks complete

Detailed description:
Validate upload-only, review/linkage, sufficiency, release, audit, client visibility and export boundaries with positive and negative P0 proof.

Expected negative proof:

- Upload-only cannot release.
- Unreviewed evidence cannot release.
- Unlinked/wrong-scope evidence cannot release.
- Wrong-tenant evidence is denied.
- Admin cannot force sufficiency or release.
- Audit failure blocks critical transitions.
- Export excludes unreleased/internal evidence.

## 3. Reality Audit Matrix

### Upload

Current reality: real and already strongly aligned.

Evidence:

- `app/api/documents/upload/route.ts` returns `safety.uploadOnly: true`, `sufficiency: false`, `releaseUnlocked: false`, `clientVisible: false`.
- `lib/document-upload-service.ts` persists `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem` and `AuditEvent`.
- Upload creates `DocumentStatus.UPLOADED`, `EvidenceStatus.CREATED`, `VisibilityStatus.INTERNAL_ONLY`.
- UI copy in `components/client-intake-screen.tsx` already states upload is intake/review only and keeps sufficiency/release/export/client visibility locked.

Gap:

- Copy is good, but WP04 still needs final approved wording. Recommended wording: `Upload complete - evidence review pending`.

### Review

Current reality: real but split.

Evidence:

- `app/api/documents/review/route.ts` exposes `mark_reviewed`, `request_clarification`, `accept_sufficiency`.
- `lib/evidence-review-service.ts` creates `DocumentReview`, updates `Document`, updates `DocumentExtraction`, creates `DocumentLink`, updates `EvidenceRecord`, creates `EvidenceItem` and audit.
- `DocumentReview` exists in Prisma with `reviewType`, `status`, `notes`, `clientVisibleSummary`, `reviewedAt`.

Gap:

- `accept_sufficiency` bundles review acceptance and sufficiency acceptance in the document review path. Clean WP04 should prefer a shared sufficiency service or journey-level decision path, not duplicate hidden policy inside document review.

### Linkage

Current reality: real but not yet unified.

Evidence:

- `DocumentLink` exists for document-to-target links.
- `JourneyObjectLink` supports `SUPPORTING_EVIDENCE` links with `requirementKey` metadata.
- `EvidenceRecord` contains `relatedObjectType` and `relatedObjectId`.
- Recommendation review workflow validates evidence scope through related object or `EvidenceItem` source object.

Gap:

- Linkage semantics are split between document review, journey evidence requirements and recommendation review. WP04 should normalize on requirement/object-scoped linkage for release gates.

### Sufficiency

Current reality: partial real implementation, policy not final.

Evidence:

- `lib/evidence-service.ts` has `evaluateEvidenceSufficiency`.
- Prisma has `EvidenceSufficiencyDecision` with `reviewed`, `scopeMatches`, `relevanceConfirmed`, `currentnessConfirmed`, decision, role/user, audit id and requirement key.
- `lib/journeys/journey-api-service.ts` has `DECIDE_EVIDENCE_SUFFICIENCY` logic and blocks `SUFFICIENT` unless linked, reviewed, scoped, relevant, current, minimum status and client-safe visibility checks pass.
- Tests already cover upload-created evidence not being sufficient and admin non-bypass.

Gap:

- The upload file asks for human decision on who owns sufficiency. Current journey command allows both `analyst` and `compliance_officer` to decide. Aggressive clean recommendation: analyst can prepare/review/link, but only compliance can make final `SUFFICIENT`.

### Compliance Release

Current reality: real in two paths, but not fully consolidated.

Evidence:

- `workflowGate.canPassComplianceReleaseGate` consumes a full `EvidenceSufficiencyDecision`.
- `lib/journeys/journey-api-service.ts` blocks `COMPLIANCE_RELEASE` unless every journey evidence requirement has a latest sufficient, reviewed, scoped, relevant, current and audited decision.
- `lib/typed-workflow-command-bus.ts` has recommendation review release preconditions: advisor approval, accepted/scoped evidence, payload ready, permission, audit readiness.

Gap:

- Legacy/demo recommendation review path still uses `EvidenceStatus.VALIDATED/RELEASED` and scoped items, not the canonical `EvidenceSufficiencyDecision` model.
- J02 screencast release path uses `canBecomeClientVisible` with evidence status, not the stronger `canPassComplianceReleaseGate` predicate.

### Audit

Current reality: real, upload and generic mutation fail-closed are strong; review/journey sufficiency need hardening.

Evidence:

- `auditService.assertCriticalAuditWritable` defines required fields and fail-closed behavior.
- Upload asserts critical audit writable before creating document/evidence rows.
- `runTypedWorkflowMutation` asserts audit writable before mutation.
- Audit events include actor, role, tenant, target, previous/next state, result and reason.

Gap:

- `evidence-review-service` writes audit inside transaction but does not accept `auditPersistenceAvailable`, so it lacks explicit fail-closed simulation for review/sufficiency transitions.
- `journey-api-service` creates journey audit rows but does not currently expose the same audit-persistence simulation in the inspected path.

### Client Visibility

Current reality: real and fail-closed.

Evidence:

- Client projection state and visibility engine block unreleased/internal payloads.
- Upload UI/API explicitly sets no client release.
- Document projection hides internal fields for client roles.

Gap:

- Sufficiency itself should remain internal/compliance-only. Client should see request/review/released summary states, not raw sufficiency rationale unless later redacted/released.

### Export

Current reality: real export gate and redaction classification exist; not directly tied to WP04 sufficiency decision in every path.

Evidence:

- `exportService` blocks forbidden payload classes including `UNRELEASED_EVIDENCE`, `COMPLIANCE_NOTES`, `INTERNAL_RATIONALE` and hidden fields.
- Export generation checks permission, redaction profile, approval, selected request, audit and data quality.

Gap:

- Export uses payload classifications and approval gates, but WP04 should ensure sufficient/released evidence is the only evidence eligible for export scope.

## 4. Target Contract Draft

### State taxonomy

- `UPLOAD_RECEIVED`: source document exists; review not complete; cannot support release/export.
- `REVIEW_PENDING`: extraction/review queue item exists; cannot support release/export.
- `REVIEWED_LINKED`: reviewed and linked, but not yet sufficient.
- `INSUFFICIENT`: reviewed evidence failed criteria or clarification needed.
- `SUFFICIENT_FOR_SCOPED_GATE`: reviewed, linked, relevant, scoped, current, accepted by authorized role and audited.
- `RELEASED_CLIENT_SAFE`: compliance release has passed and client/export projection uses released/redacted payload only.

### Minimal sufficiency criteria

Evidence may be sufficient only when all are true:

- It is tied to a specific journey evidence requirement or target object.
- It is tenant-scoped to the active client tenant.
- It is linked to the relevant `EvidenceRecord` and object/requirement.
- It has been reviewed by an operational reviewer.
- Its scope matches the requirement.
- Its relevance is confirmed.
- Its currentness/staleness is confirmed.
- Its evidence status meets the requirement minimum.
- It is accepted by the authorized final decision role.
- The decision has an audit event id.

### Blockers

Release/export/client visibility stay blocked for:

- Upload-only.
- Unreviewed evidence.
- Unlinked evidence.
- Wrong object or wrong tenant.
- Stale/currentness not confirmed.
- Relevance not confirmed.
- Scope mismatch.
- Insufficient evidence status.
- Missing audit event.
- Admin/security attempted bypass.

## 5. Decision Options

### Option A: Compliance-owned final sufficiency, analyst/advisor prepare only

Recommendation: APPROVE.

Shape:

- Analyst may review/link/prepare.
- Advisor may rely on reviewed evidence for advice workflow but cannot mark final sufficiency.
- Compliance officer owns final `SUFFICIENT` decision.
- Scope is `JourneyEvidenceRequirement` plus linked `EvidenceRecord` and target object.
- Use existing `EvidenceSufficiencyDecision` as canonical record.
- Keep sufficiency internal/compliance-only; client sees only safe request/review/released summaries.
- No schema migration unless implementation proves a real field gap.

Why this is cleanest:

- It removes role ambiguity.
- It uses the existing strong schema.
- It prevents upload and advisor approval from drifting into release authority.
- It gives one canonical predicate for compliance release and later export.

### Option B: Analyst can decide sufficiency, compliance only releases

Recommendation: REJECT for clean MVP.

Tradeoff:

- Faster operations.
- Dirtier safety boundary because the same role that prepares evidence can make it sufficient.
- Requires more compensating checks in compliance release.

### Option C: Document-level sufficiency field

Recommendation: REJECT.

Tradeoff:

- Easy UI/API implementation.
- Wrong domain model: a document is not sufficient by itself; sufficiency is contextual to a requirement/object/gate.
- High risk of recreating the upload-equals-sufficiency anti-pattern.

### Option D: New schema/migration now

Recommendation: DEFER unless proven necessary.

Tradeoff:

- Could make future abstractions explicit.
- Current schema already has enough primitives. A migration now would be churn and risk without proof.

## 6. Aggressive Implementation Recommendation After Approval

Approve Option A, then execute the implementation in this order:

1. Normalize final sufficiency ownership so only `compliance_officer` can create `SUFFICIENT`; analyst may still create or prepare non-final review/linkage states.
2. Extract a shared evidence sufficiency policy helper used by document review, journey release and recommendation review paths.
3. Route all release checks through the canonical `EvidenceSufficiencyDecision` model where a journey/evidence requirement exists.
4. Keep upload API/UI almost unchanged except final copy alignment and tests, because it already obeys upload-only semantics.
5. Add audit fail-closed simulation to evidence review/sufficiency and journey sufficiency/release commands.
6. Add P0 tests that prove upload-only, analyst-only, advisor-only, admin-force and audit-failure paths cannot release/export/client-show.

## 7. Current Stop

`WP04-DECISION-1` was approved by the human with Option A:

- Final sufficiency is Compliance-owned.
- Analyst/advisor roles may review/link/prepare, but cannot create a final `SUFFICIENT` decision.
- Sufficiency remains scoped to `JourneyEvidenceRequirement` plus linked `EvidenceRecord` and target object.
- Existing schema is used; no new migration is required for this slice.

## 8. Implementation Result After Approval

### WP04-IMPL-1 Upload-only UI/API Semantics

Status: DONE

Implemented:

- Upload UI copy now states `Upload complete - evidence review pending`.
- Upload API response exposes `safety.uploadStateLabel`.
- Upload API continues to return `uploadOnly: true`, `sufficiency: false`, `releaseUnlocked: false`, `clientVisible: false`.

### WP04-IMPL-2 Evidence Review and Linkage Lifecycle

Status: DONE

Implemented:

- Analyst/advisor/compliance review/linkage paths remain available where permitted.
- Final document evidence sufficiency acceptance is explicit Compliance-only.
- Analyst `accept_sufficiency` remains fail-closed, audited and non-mutating.

### WP04-IMPL-3 Sufficiency Gate and Compliance Release Blocker

Status: DONE

Implemented:

- Shared requirement-sufficiency policy helper added to `evidenceService`.
- Journey sufficiency decision now uses the shared policy helper.
- Journey `SUFFICIENT` command is Compliance-only; `INSUFFICIENT` remains available for operational preparation.
- Compliance release continues to require latest sufficient, reviewed, scoped, relevant, current and audited evidence decisions for all journey requirements.

### WP04-IMPL-4 Evidence Audit and Fail-Closed Behaviour

Status: DONE

Implemented:

- Evidence review/sufficiency API now accepts audit-failure simulation and blocks mutation when audit persistence is unavailable.
- Journey command registry accepts audit-failure simulation.
- Central journey audit/run persistence now asserts critical audit writability before creating audit/run rows.
- Audit failure produces `AUDIT_PERSISTENCE_UNAVAILABLE` and no state advance.

### WP04-QA-1 P0 Evidence Workflow Validation

Status: DONE

Validation run:

- `pnpm guard:source` PASS
- `pnpm typecheck` PASS
- `pnpm lint` PASS with pre-existing warnings only
- `pnpm playwright test tests/document-upload-api.spec.ts tests/evidence-review-api.spec.ts tests/journey-api.spec.ts tests/document-upload-lifecycle-hardening.spec.ts --workers=1` PASS, 26/26

Screenshot proof:

- `artifacts/wp04-evidence-workflow/documents-upload-desktop.png`

Residual risk:

- Legacy/demo recommendation review and J02 screencast paths still have some status-based release checks. WP04 now strengthens the journey and document evidence paths; the next aggressive clean-up should normalize remaining legacy release paths onto the shared sufficiency policy helper.

## 9. WP04 Rerun After WP03/WP05-WP06 Artefacts

Execution date: 2026-06-25.

Rerun trigger:

- User requested a WP04 rerun from the original upload.
- User requested all generated specification artefacts to be used either as input or override for later tasks.
- Current branch baseline before rerun: `full-workflow`, latest commit `b0f8b51 docs: rerun wp03 client visibility proof`, working tree clean.

Generated artefacts used as rerun input:

- `docs/00-current/ALPHAVEST_WP00_SOURCE_HIERARCHY_TARGET_GUARD_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP01_PROCESS_FIRST_ROUTE_NAV_SHELL_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP02_WORKSURFACE_LAYOUT_REFACTOR_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP03_CLIENT_SAFE_VISIBILITY_PORTAL_STATES_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP04_EVIDENCE_WORKFLOW_UPLOAD_NOT_SUFFICIENCY_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP05_INTERNAL_DRAFT_ADVISOR_COMPLIANCE_FLOW_EXECUTION.md`
- `docs/00-current/ALPHAVEST_WP06_RBAC_ADMIN_NON_BYPASS_EXECUTION.md`

Important execution note:

This rerun did not create a fresh WP04 product-code mutation. The earlier user-approved Option A implementation was already present in the repository. The rerun re-extracted the upload tasks, applied the generated WP00-WP06 artefacts as current input/override, and then validated each implementation task against the live code and tests. Therefore `COMPLETE` below means `implemented earlier and revalidated against the rerun specification`, not `newly rewritten during this rerun`.

Rerun task-by-task status:

- EPIC WP04 Evidence Workflow & Upload-not-Sufficiency Safety Spine: `COMPLETE_FOR_APPROVED_FIRST_WAVE`.
- `WP04-ANALYSIS-1` Evidence Workflow Reality Audit: `COMPLETE`. Live recheck confirms real upload, review/linkage, sufficiency, release-block, audit, client-visibility and export boundaries exist in the current codebase.
- `WP04-SPEC-1` Evidence Sufficiency and Upload-not-Sufficiency Contract: `COMPLETE_AND_STILL_VALID`. WP03, WP05 and WP06 reinforce the same safety contract: upload is not sufficiency, advisor approval is not release, admin cannot force visibility or sufficiency, and export/client payloads must be redacted/released only.
- `WP04-DECISION-1` Approve Minimal MVP Evidence Sufficiency Policy: `COMPLETE`. Earlier user-approved Option A remains the clean path: Compliance owns final `SUFFICIENT`; analyst/advisor may review/link/prepare only; sufficiency is requirement/object scoped; existing schema remains enough for this wave.
- `WP04-IMPL-1` Upload-only UI/API Semantics: `COMPLETE`. Upload UI/API still confirms intake only and returns `uploadOnly: true`, `sufficiency: false`, `releaseUnlocked: false`, `clientVisible: false`.
- `WP04-IMPL-1.1` Upload feedback wording and state separation: `COMPLETE`. Current UI copy states `Upload complete - evidence review pending` and keeps sufficiency/release/export/client visibility locked.
- `WP04-IMPL-1.2` API response/payload no-sufficiency semantics: `COMPLETE`. Upload and document APIs do not set release, sufficiency or client-visible state from upload alone.
- `WP04-IMPL-2` Evidence Review and Linkage Lifecycle: `COMPLETE`. Review/linkage is real; final sufficiency acceptance is Compliance-only; Analyst review remains non-release and non-sufficiency.
- `WP04-IMPL-2.1` Evidence review states: `COMPLETE`. Uploaded, review pending, linked, insufficient and sufficient lifecycle states are mapped and tested.
- `WP04-IMPL-2.2` Evidence-to-object linkage: `COMPLETE`. Document/evidence links and journey requirement evidence links are explicit enough for first-wave gates.
- `WP04-IMPL-3` Sufficiency Gate and Compliance Release Blocker: `COMPLETE`. Shared sufficiency helpers and journey release checks require reviewed, linked, scoped, relevant, current and audited evidence decisions.
- `WP04-IMPL-3.1` Sufficiency gate derivation: `COMPLETE`. `evidenceService.evaluateEvidenceSufficiency` and `evaluateRequirementSufficiency` provide testable predicates.
- `WP04-IMPL-3.2` Compliance release block integration: `COMPLETE`. Journey compliance release denies missing evidence sufficiency and keeps client visibility hidden.
- `WP04-IMPL-4` Evidence Audit and Fail-Closed Behaviour: `COMPLETE`. Upload/review/journey critical actions assert audit writability before mutation; audit failure returns `AUDIT_PERSISTENCE_UNAVAILABLE`.
- `WP04-IMPL-4.1` Audit event mapping for evidence actions: `COMPLETE`. Upload, review/linkage, sufficiency, denied attempts and release paths are audit-mapped for first wave.
- `WP04-IMPL-4.2` Audit unavailable fail-closed handling: `COMPLETE`. Tests prove upload, review and journey sufficiency mutation do not silently complete when audit persistence is unavailable.
- `WP04-QA-1` P0 Evidence Workflow Positive/Negative Validation: `COMPLETE_FOR_APPROVED_FIRST_WAVE`.

Spec-to-code traceability:

| Spec / task requirement | Live implementation inspected | Test / proof used in rerun | Rerun result |
| --- | --- | --- | --- |
| Upload success is upload-only and must not imply sufficiency, release, client visibility or export readiness. | `app/api/documents/upload/route.ts`, `lib/document-upload-service.ts`, `components/client-intake-screen.tsx` | `tests/document-upload-api.spec.ts`, `tests/document-upload-lifecycle-hardening.spec.ts` | Existing implementation conforms. |
| Review/linkage must be separate from final sufficiency and release. | `app/api/documents/review/route.ts`, `lib/evidence-review-service.ts`, `lib/evidence-service.ts` | `tests/evidence-review-api.spec.ts` | Existing implementation conforms; Analyst review/link remains non-release and non-final-sufficiency. |
| Final `SUFFICIENT` decision is Compliance-owned and scoped to requirement/object evidence. | `lib/evidence-review-service.ts`, `lib/journeys/journey-api-service.ts`, `lib/permission-engine.ts` | `tests/evidence-review-api.spec.ts`, `tests/journey-api.spec.ts`, `tests/governance-non-bypass.spec.ts` | Existing implementation conforms to Option A. |
| Compliance release must block missing, unreviewed, unlinked, wrong-scope or unaudited evidence. | `lib/journeys/journey-api-service.ts`, `lib/workflow-gate.ts`, `lib/evidence-service.ts` | `tests/journey-api.spec.ts`, `tests/workflow-gate.spec.ts` inspected as supporting gate contract | Existing implementation conforms for first-wave journey path. |
| Audit unavailable must fail closed before critical evidence mutation. | `lib/audit-service.ts`, `lib/document-upload-service.ts`, `lib/evidence-review-service.ts`, `lib/journeys/journey-api-service.ts` | `tests/document-upload-api.spec.ts`, `tests/evidence-review-api.spec.ts`, `tests/journey-api.spec.ts` | Existing implementation conforms. |
| Client projection must not expose internal/unreleased evidence. | `lib/control-layer/client-visibility.ts`, `lib/visibility-engine.ts`, document projection paths | `tests/client-visibility-projection.spec.ts`, `tests/document-upload-api.spec.ts` | Existing implementation conforms. |
| Export must exclude unreleased/internal evidence and forbidden internal payload classes. | `lib/export-service.ts`, `lib/export-package-service.ts` | `tests/file-export-realism.spec.ts` | Existing implementation conforms. |
| Admin cannot force evidence sufficiency, release, export or visibility. | `lib/permission-engine.ts`, journey command role guards, governance tests | `tests/governance-non-bypass.spec.ts`, `tests/journey-api.spec.ts` | Existing implementation conforms. |

Validation performed in rerun:

```bash
pnpm guard:source
pnpm exec tsc --noEmit --pretty false
pnpm db:validate
pnpm playwright test tests/document-upload-api.spec.ts tests/evidence-review-api.spec.ts tests/journey-api.spec.ts tests/document-upload-lifecycle-hardening.spec.ts --workers=1
pnpm playwright test tests/file-export-realism.spec.ts tests/client-visibility-projection.spec.ts tests/governance-non-bypass.spec.ts --workers=1
```

Validation result:

- Source/target guard: PASS.
- TypeScript: PASS.
- Prisma validate: PASS.
- WP04 upload/review/journey/UI lifecycle slice: PASS, 26 passed.
- Export/client visibility/governance non-bypass slice: PASS, 21 passed.

Screenshot produced in rerun:

- `artifacts/wp04-evidence-workflow/rerun-documents-upload-desktop.png`

Current option shown to user:

`WP04 Rerun Option A — No new product code. Treat WP04 approved first wave as complete; keep Compliance-owned final sufficiency, keep Analyst/Advisor as prepare/review/link roles only, keep existing EvidenceSufficiencyDecision and journey requirement linkage as canonical first-wave model, keep upload API/UI upload-only, keep audit fail-closed before mutation, keep export/client-visibility redaction gates, and record this rerun proof. Next aggressive cleanup should normalize remaining legacy/demo recommendation and screencast release paths onto the shared sufficiency policy helper, not expand WP04 with new schema or routes.`

Rejected branches:

- New schema/migration now: rejected because current schema has enough proof-bearing primitives for first wave.
- Document-level sufficiency flag: rejected because it recreates the upload-equals-sufficiency trap.
- Analyst-owned final sufficiency: rejected because it blurs preparation and release authority.
- UI-only wording fix: rejected as insufficient because service/API/audit gates already carry the safety boundary and must remain canonical.

Method/proof notes:

- Facts: live code contains upload-only API safety fields, Compliance-only `accept_sufficiency`, shared sufficiency predicates, journey release blockers, audit failure simulation and export/client visibility negative tests.
- Assumption: legacy/demo recommendation and J02 screencast paths are compatibility surfaces, not the canonical WP04 first-wave safety boundary.
- Interpretation: WP04 is complete for the approved first wave; the cleanest next move is consolidation of remaining legacy release paths onto the shared sufficiency helper.

## 10. WP04 Strict Source-Scope Rerun

Execution date: 2026-06-25.

Rerun trigger:

- User requested WP04 rerun from `/Users/chris/Downloads/alphavest/ALPHAVEST_WP04_EVIDENCE_WORKFLOW_UPLOAD_NOT_SUFFICIENCY_BOC_TICKET_STRUCTURE.md`.
- User required strict source scope: uploaded blueprint, current repo, generated artefacts from the same refactor chain and explicit human/generated decisions only.
- User required the execution chain: blueprint task -> executed analysis result -> refined specification -> derived implementation task -> implementation or zero-delta implementation -> QA/proof -> report.

Preflight and source-scope result:

- Current branch: `full-workflow`.
- Current baseline commit before this report update: `fe55663 docs: rerun wp03 client visibility proof`.
- Working tree before report update: clean.
- `package.json` confirms `pnpm@9.15.9` and runnable source guard, typecheck, Prisma validation and Playwright tests.
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` was used as operative repo authority required by `AGENTS.md`, not as a replacement for the WP04 blueprint.
- No unrelated legacy planning docs, broad handoff docs, old KB artefacts, `source_refs`, `source_artefacts` or unvalidated prior assumptions were imported as WP04 specification authority.

Generated artefacts used as input or override:

- This WP04 execution report, including the earlier accepted Option A implementation proof.
- Earlier same-chain generated reports in `docs/00-current/` for WP00, WP01, WP02, WP03, WP05 and WP06, only where they encode accepted process results or reinforce safety constraints already revalidated against the current repo.
- Explicit human decision already present in the thread: WP04 Option A was approved with "ich gebe das frei".

### WP04-ANALYSIS-1 Executed Analysis Result

Status: `COMPLETE`.

Blueprint tasks/subtasks extracted:

- Epic: `WP04 Evidence Workflow & Upload-not-Sufficiency Safety Spine`.
- `WP04-ANALYSIS-1` Evidence Workflow Reality Audit.
- `WP04-SPEC-1` Evidence Sufficiency and Upload-not-Sufficiency Contract.
- `WP04-DECISION-1` Approve Minimal MVP Evidence Sufficiency Policy.
- `WP04-IMPL-1` Upload-only UI/API Semantics.
- `WP04-IMPL-1.1` Upload feedback wording and state separation.
- `WP04-IMPL-1.2` API response/payload no-sufficiency semantics.
- `WP04-IMPL-2` Evidence Review and Linkage Lifecycle.
- `WP04-IMPL-2.1` Evidence review states.
- `WP04-IMPL-2.2` Evidence-to-object linkage.
- `WP04-IMPL-3` Sufficiency Gate and Compliance Release Blocker.
- `WP04-IMPL-3.1` Sufficiency gate derivation.
- `WP04-IMPL-3.2` Compliance release block integration.
- `WP04-IMPL-4` Evidence Audit and Fail-Closed Behaviour.
- `WP04-IMPL-4.1` Audit event mapping for evidence actions.
- `WP04-IMPL-4.2` Audit unavailable fail-closed handling.
- `WP04-QA-1` P0 Evidence Workflow Positive/Negative Validation.

Live repo evidence:

- WP04 route scope exists in `lib/route-registry.ts`: `019`, `020`, `027`, `028`, `029`, `030`, `038`, `039`, `040`, `041`, `046`, `047`, `054`, `055`, `056`, `057`, `058`.
- Upload API in `app/api/documents/upload/route.ts` returns safety fields: `uploadOnly: true`, `sufficiency: false`, `releaseUnlocked: false`, `clientVisible: false`, `uploadStateLabel: "Upload complete - evidence review pending"`.
- Upload service in `lib/document-upload-service.ts` creates document/version/extraction/evidence/audit rows with `clientVisible: false`, `DocumentStatus.UPLOADED`, `EvidenceStatus.CREATED`, `VisibilityStatus.INTERNAL_ONLY` and pre-mutation critical audit writability.
- Upload and document UI in `components/client-intake-screen.tsx` says upload is intake/review only and explicitly keeps evidence sufficiency, release, export and client visibility locked.
- Review/linkage service in `lib/evidence-review-service.ts` separates `mark_reviewed`, `request_clarification` and `accept_sufficiency`; `accept_sufficiency` is Compliance-only and creates review/link/evidence item/audit without client release.
- Shared sufficiency predicates in `lib/evidence-service.ts` require review, scope, relevance, currentness, evidence status and, where required, audit evidence.
- Journey evidence command in `lib/journeys/journey-api-service.ts` permits final `SUFFICIENT` only for `compliance_officer` and stores `EvidenceSufficiencyDecision`.
- Journey compliance release in `lib/journeys/journey-api-service.ts` and `lib/workflow-gate.ts` blocks release unless sufficient evidence, advisor approval, payload readiness, permission, data quality and audit persistence are all present.
- Export guard in `lib/export-service.ts` classifies and blocks `AI_DRAFT`, `INTERNAL_RATIONALE`, `COMPLIANCE_NOTES`, `UNRELEASED_EVIDENCE`, `UNRELEASED_RECOMMENDATION` and hidden fields.

Analysis conclusion:

The approved WP04 first-wave implementation is already present in the current repo. No product-code gap was found for the blueprint's first-wave scope. Remaining clean-up stays a separate consolidation task: normalize legacy/demo recommendation and screencast release compatibility paths onto the shared sufficiency helper.

### WP04-SPEC-1 Refined Specification

Status: `COMPLETE_AND_STILL_VALID`.

Refined first-wave contract:

- Upload is candidate intake only.
- Upload success never implies evidence sufficiency, advisor approval, compliance release, client visibility or export readiness.
- Evidence must pass review and linkage before it can be considered for sufficiency.
- Final `SUFFICIENT` is Compliance-owned.
- Analyst/advisor roles may prepare, review, link or rely on reviewed evidence, but may not create final sufficiency or release.
- Sufficiency is requirement/object scoped, not document scoped.
- `EvidenceSufficiencyDecision` remains the canonical first-wave record.
- Compliance release requires reviewed, linked, scoped, relevant, current and audited sufficiency plus the other release gates.
- Client-visible payloads are released/redacted summaries only.
- Export excludes unreleased/internal evidence and forbidden internal payload classes.
- Audit persistence is required before critical mutation; unavailable audit fails closed.
- No new API, route, schema migration or product scope expansion is authorized for this rerun.

### WP04-DECISION-1 Decision Result

Status: `COMPLETE`.

Existing human approval applies:

- Option A remains the accepted policy.
- Compliance owns final sufficiency.
- Analyst/advisor roles prepare/review/link only.
- Existing schema is sufficient for this wave.
- No new route/API/schema migration is needed.

No human stop was required in this strict rerun.

### WP04 Implementation Result

Overall implementation status: `ZERO-DELTA PRODUCT CODE`.

Product-code changes in this strict rerun: none.

Generated artefact changes in this strict rerun: this report section.

Task-by-task derived implementation result:

- `WP04-IMPL-1` Upload-only UI/API Semantics: `ZERO-DELTA IMPLEMENTATION`. Code already returns upload-only safety fields and UI already states review pending without release/export/client visibility.
- `WP04-IMPL-1.1` Upload feedback wording and state separation: `ZERO-DELTA IMPLEMENTATION`. UI copy already includes `Upload complete - evidence review pending` and `No sufficiency shortcut`.
- `WP04-IMPL-1.2` API response/payload no-sufficiency semantics: `ZERO-DELTA IMPLEMENTATION`. Upload API already returns `sufficiency: false`, `releaseUnlocked: false`, `clientVisible: false`.
- `WP04-IMPL-2` Evidence Review and Linkage Lifecycle: `ZERO-DELTA IMPLEMENTATION`. Review/linkage lifecycle is implemented in the document review service and API.
- `WP04-IMPL-2.1` Evidence review states: `ZERO-DELTA IMPLEMENTATION`. Upload, review pending, clarification/insufficient, linked and sufficient states are mapped and tested.
- `WP04-IMPL-2.2` Evidence-to-object linkage: `ZERO-DELTA IMPLEMENTATION`. Document links, evidence records and journey supporting evidence links exist and are used by gates.
- `WP04-IMPL-3` Sufficiency Gate and Compliance Release Blocker: `ZERO-DELTA IMPLEMENTATION`. Shared predicates and journey release checks already block insufficient evidence.
- `WP04-IMPL-3.1` Sufficiency gate derivation: `ZERO-DELTA IMPLEMENTATION`. `evaluateEvidenceSufficiency` and `evaluateRequirementSufficiency` already encode the first-wave predicate.
- `WP04-IMPL-3.2` Compliance release block integration: `ZERO-DELTA IMPLEMENTATION`. Release blocks missing evidence sufficiency and keeps client visibility hidden until release gates pass.
- `WP04-IMPL-4` Evidence Audit and Fail-Closed Behaviour: `ZERO-DELTA IMPLEMENTATION`. Upload, review and journey command paths already fail closed when audit persistence is unavailable.
- `WP04-IMPL-4.1` Audit event mapping for evidence actions: `ZERO-DELTA IMPLEMENTATION`. Upload, review/linkage, sufficiency acceptance/block and journey sufficiency/release attempts are audit-mapped for this wave.
- `WP04-IMPL-4.2` Audit unavailable fail-closed handling: `ZERO-DELTA IMPLEMENTATION`. Tests prove no silent mutation for upload, review or journey evidence sufficiency when audit persistence fails.

### WP04-QA-1 Proof

Status: `COMPLETE_FOR_APPROVED_FIRST_WAVE`.

Validation run:

```bash
pnpm guard:source
pnpm exec tsc --noEmit --pretty false
pnpm db:validate
pnpm exec playwright test tests/document-upload-api.spec.ts tests/evidence-review-api.spec.ts tests/journey-api.spec.ts tests/document-upload-lifecycle-hardening.spec.ts --workers=1 --reporter=line
pnpm exec playwright test tests/file-export-realism.spec.ts tests/client-visibility-projection.spec.ts tests/governance-non-bypass.spec.ts --workers=1 --reporter=line
```

Validation result:

- Source/target guard: PASS, 0 violations.
- TypeScript: PASS.
- Prisma validate: PASS.
- Upload/review/journey/lifecycle WP04 slice: PASS, 26 passed.
- Export/client visibility/governance non-bypass slice: PASS, 21 passed.

Positive proof:

- Upload happy path still works.
- Compliance can accept reviewed scoped evidence without releasing client visibility.
- Journey can complete compliance release only after explicit evidence sufficiency, advisor approval, confirmation, audit and gate prerequisites align.
- Client projection can show released client-safe summaries without internal leakage.
- Export package generation works when scope, redaction, approval, audit and data quality controls align.

Negative proof:

- Upload success does not set sufficiency, release, export readiness or client visibility.
- Analyst cannot force final sufficiency.
- Advisor approval alone cannot release.
- Wrong-scope sufficiency blocks without mutation.
- Missing evidence sufficiency blocks release.
- Admin cannot force evidence sufficiency or release.
- Audit persistence failure blocks critical upload/review/journey mutations.
- Export blocks unreleased/internal evidence and forbidden internal payload classes.
- Client projection fails closed for unreleased decision/document payloads.

Screenshot proof:

- `test-results/wp04-strict-rerun-screenshots/wp04-documents-upload.png`
- `test-results/wp04-strict-rerun-screenshots/wp04-documents-review-queue.png`
- `test-results/wp04-strict-rerun-screenshots/wp04-compliance-release.png`

Residual risks:

- This rerun did not execute full `pnpm phase:check`; it executed the focused WP04 proof set plus source guard, typecheck and Prisma validation.
- Legacy/demo recommendation and screencast compatibility paths should still be normalized onto the shared sufficiency helper in a separate cleanup task.
- Production storage/security scanning and full KYC/SoW/IPS/committee policy buildout remain explicitly out of WP04 scope.

Aggressive clean-solution recommendation:

Keep WP04 closed as `ZERO-DELTA PRODUCT CODE / COMPLETE_FOR_APPROVED_FIRST_WAVE`. Do not add schema, routes or APIs here. The next clean debt-removal task should be a narrow consolidation ticket that routes remaining legacy/demo recommendation and screencast release compatibility paths through the shared sufficiency policy helper and proves no behavior regression with journey/export/client-visibility tests.
