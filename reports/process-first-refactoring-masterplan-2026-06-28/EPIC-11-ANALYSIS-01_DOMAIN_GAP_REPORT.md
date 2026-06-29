# EPIC-11-ANALYSIS-01 Domain Gap Report

Generated: 2026-06-29

Source: `reports/process-first-refactoring-masterplan-2026-06-28/ALPHAVEST_PROCESS_FIRST_REFACTORING_MASTERPLAN_BOC_CTES.json`

Ticket: `EPIC-11-ANALYSIS-01` - Step coverage and current implementation audit for Compliance Review, Block and Release

## Definition Re-Read

- Task: Audit all mapped processes and steps for Compliance Review, Block and Release against current routes, components, services and tests.
- Goal: Separate implemented behavior from visual-only or specified-only claims.
- Scope: `BP-058`, `BP-059`, `BP-060`, `BP-061`, `BP-062`, `BP-063`, `BP-064`, `BP-066`.
- Expected output: EPIC-11 domain gap report.
- Definition of done: Each mapped process has implementation status and missing step list.

## Current Evidence

### Source and Guard

- Branch: `full-workflow`.
- Baseline commit before this ticket: `3ff0516 feat: close domain f backend lifecycle`.
- `pnpm guard:source`: PASS, 0 violations.
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` read before execution.

### Current Route and Surface Evidence

- `lib/route-registry.ts` defines the compliance release route group:
  - `038` `/compliance/reviews` - Compliance Queue.
  - `039` `/compliance/reviews/:id/decision-room` - Compliance Review Detail.
  - `040` `/compliance/reviews/:id/release` - Release to Client.
  - `041` `/compliance/reviews/:id/block` - Block or Request Evidence.
  - `042` `/compliance/reviews/:id/audit` - Compliance Audit.
- `components/internal-workflow-screen.tsx` contains the active internal compliance surfaces for `038`, `039` and `040`.
- `components/decisions-governance-screen.tsx` contains the compliance block and audit surfaces for `041` and `042`.
- Existing long-screen audit evidence flags `S038` and `S042` as excessive-height risk and `S039` as long-structure risk. That is UX debt, but not a reason to claim the process is missing.

### Current Service and API Evidence

- `lib/typed-workflow-command-bus.ts` is the strongest DOMAIN-G service seam:
  - identifies compliance release process `BP-063`;
  - identifies active release step `BP-063-S03`;
  - evaluates release preconditions;
  - records request-evidence, compliance-block and compliance-release actions;
  - blocks release when audit persistence or release preconditions fail.
- `lib/recommendation-review-workflow-api.ts` routes typed advisor/compliance workflow requests through the command bus and returns fail-closed JSON for invalid or unsafe requests.
- `lib/audit-service.ts` contains audit event classification for review, release and block actions.
- This evidence is real backend behavior, but it is not yet attached as step-level proof refs across all DOMAIN-G process steps.

### Current Test Evidence

- `tests/recommendation-review-workflow-api.spec.ts` covers compliance release process runtime and API behavior, including `BP-063-S03` linkage.
- `tests/workflow-gate.spec.ts` covers SCF-P06 compliance release gate behavior, including advisor approval separation, missing evidence, audit blocking and client visibility boundaries.
- `tests/release-spine-command-surface.spec.ts` covers release-spine command behavior for `BP-063`.
- `tests/wp02-worksurface-shell.spec.ts` locks worksurface shell coverage for S038-S042.
- `tests/ux-master-detail-surface.spec.ts`, `tests/ux-data-surface-contract.spec.ts` and `tests/ux-status-command-hierarchy.spec.ts` lock selected S038/S039 primitive-consumer contracts.
- These tests are valuable seams. The matrix still correctly refuses full implementation credit because every DOMAIN-G step lacks direct negative proof refs and many steps lack step-gate/audit-failure/touchpoint proof.

## Coverage Matrix Snapshot

DOMAIN-G currently has 40 P0 steps.

- `partially_implemented`: 20
- `specified_only`: 20
- `implemented`: 0

Missing layers currently recorded:

- `negative_test`: 40
- `step_level_gate_proof`: 24
- `audit_or_evidence_failure_proof`: 24
- `implementation_touchpoint_proof`: 20

AREA-06 is therefore partially implemented and not closable. This is correct: route/screen presence plus some release-command behavior must not be upgraded to process completion without direct step-level positive and negative proof refs.

## Process-Level Findings

### BP-058 - Compliance Queue Triage

Current status: `partially_implemented`.

Evidence:

- S038-S042 routes exist.
- S038 queue surface exists and can open the selected decision room.
- Current touchpoints include `ComplianceReview`, `Approval`, `Decision`, `EvidenceRecord`, `Recommendation`, `AuditEvent`, `/api/demo-workflow`, `workflow-gate.spec.ts` and `demo-workflow-api.spec.ts`.

Missing step list:

- `BP-058-S01`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-058-S02`: negative proof missing.
- `BP-058-S03`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-058-S04`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-058-S05`: negative proof missing.

Interpretation:

The queue is real and should stay partial. It must not be marked implemented until queue selection, wrong role/object scope, and no downstream release/client visibility overclaim are directly proven at step level.

### BP-059 - Precondition Check

Current status: `specified_only`.

Evidence:

- Compliance release preconditions exist in the typed command bus and workflow gate tests.
- The current matrix still does not treat those seams as BP-059 implementation-touchpoint proof.

Missing step list:

- `BP-059-S01`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-059-S02`: negative and implementation-touchpoint proof missing.
- `BP-059-S03`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-059-S04`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-059-S05`: negative and implementation-touchpoint proof missing.

Interpretation:

This is a stale-proof gap more than a total product absence. The bold cleanup path is to make precondition evaluation a canonical DOMAIN-G contract seam instead of leaving it hidden inside generic workflow-gate tests.

### BP-060 - Evidence Completeness Check

Current status: `specified_only`.

Evidence:

- Workflow gate tests already prove that upload/created evidence is not sufficiency and that reviewed, scoped, current and client-safe evidence is required.
- Compliance release preconditions in the command bus also evaluate selected evidence and payload readiness.

Missing step list:

- `BP-060-S01`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-060-S02`: negative and implementation-touchpoint proof missing.
- `BP-060-S03`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-060-S04`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-060-S05`: negative and implementation-touchpoint proof missing.

Interpretation:

Evidence completeness exists as safety logic, but DOMAIN-G needs its own named proof boundary. Do not create a new ad hoc evidence engine; reuse the release precondition and workflow-gate seams.

### BP-061 - Request Evidence

Current status: `specified_only`.

Evidence:

- `components/internal-workflow-screen.tsx` includes request-evidence confirmation behavior for compliance-sensitive actions.
- `lib/typed-workflow-command-bus.ts` persists `request_evidence` as a typed workflow mutation and keeps release separately gated.

Missing step list:

- `BP-061-S01`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-061-S02`: negative and implementation-touchpoint proof missing.
- `BP-061-S03`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-061-S04`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-061-S05`: negative and implementation-touchpoint proof missing.

Interpretation:

The action exists, but the process proof is scattered. EPIC-11 should connect the existing mutation path, modal confirmation and audit/no-release negative proof into one contract.

### BP-062 - Block Release

Current status: `partially_implemented`.

Evidence:

- S041 block/request evidence route exists.
- Compliance-sensitive confirmation requires acknowledgement, reason and exact phrase.
- `typed-workflow-command-bus` persists `compliance_block`, clears release state and keeps client visibility blocked.

Missing step list:

- `BP-062-S01`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-062-S02`: negative proof missing.
- `BP-062-S03`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-062-S04`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-062-S05`: negative proof missing.

Interpretation:

Block-release behavior is real enough for partial credit. The remaining gap is not another blocking UI panel; it is step-level proof that block writes audit, blocks release/client/export projection and fails closed without audit persistence.

### BP-063 - Release To Client

Current status: `partially_implemented`.

Evidence:

- S040 release route and release confirmation modal exist.
- `typed-workflow-command-bus` maps compliance release to `BP-063-S03`.
- Release preconditions require advisor approval, evidence, payload readiness, permission, audit persistence and release-spine allowance.
- API tests already exercise compliance release and process runtime linkage.

Missing step list:

- `BP-063-S01`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-063-S02`: negative proof missing.
- `BP-063-S03`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-063-S04`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-063-S05`: negative proof missing.

Interpretation:

This is the strongest DOMAIN-G seam. It should be promoted only after a canonical compliance release contract adds proof refs for the success path and the negative matrix.

### BP-064 - Exception Log Handling

Current status: `partially_implemented`.

Evidence:

- S042 audit route exists.
- `lib/audit-service.ts` classifies review, block and release audit events.
- S042 currently states that demo audit rows are display-only context and that persisted records are DB-backed `AuditEvent` records returned by audited actions or audit-history APIs.

Missing step list:

- `BP-064-S01`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-064-S02`: negative proof missing.
- `BP-064-S03`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-064-S04`: step-level gate, audit/evidence failure and negative proof missing.
- `BP-064-S05`: negative proof missing.

Interpretation:

Audit presentation exists, but process completion requires tying exception/audit rows to persisted action outcomes and audit failure behavior. S042 should become concise proof navigation, not a giant audit wall.

### BP-066 - Compliance-Not-Client-Acceptance Boundary

Current status: `specified_only`.

Evidence:

- Multiple UI and workflow-gate seams already state that compliance release is not client acceptance.
- The current matrix has not recognized a DOMAIN-G implementation-touchpoint proof for that boundary.

Missing step list:

- `BP-066-S01`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-066-S02`: negative and implementation-touchpoint proof missing.
- `BP-066-S03`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-066-S04`: step-level gate, audit/evidence failure, negative and implementation-touchpoint proof missing.
- `BP-066-S05`: negative and implementation-touchpoint proof missing.

Interpretation:

This is the core overclaim boundary. Treat it as first-class backend/UI contract text and negative proof, not as copy sprinkled across pages.

## Contradictions To Resolve

1. Compliance release must be a real client-visibility gate, but it must not imply client acceptance.
2. Release confirmation must be operational, but preview/export/share/download must remain separate gates.
3. Audit proof must be visible enough to trust, but not expanded into long operational pages that hide the primary action.
4. Existing workflow-gate and command-bus tests prove important behavior, but the P0 matrix needs explicit DOMAIN-G proof refs before completion can be claimed.
5. The current UI is already process-themed, but EPIC-11 acceptance requires step-level proof, not another layer of process labels.

## Recommendation

Proceed to `EPIC-11-SPEC-01`.

Bold path: create a canonical `compliance-review-release-contract` and a focused DOMAIN-G proof suite that reuses the existing typed workflow command bus, release spine, workflow gate and audit service. Do not invent new routes, APIs, schema or fake visual panels. Close the debt by naming the real seams and attaching positive/negative step-level proof to all 40 DOMAIN-G steps.

## Ticket Completion

`EPIC-11-ANALYSIS-01` is complete.

No screenshot was warranted: this ticket changed only a report artefact and did not change UI.
