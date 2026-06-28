# EPIC-08-ANALYSIS-01 Domain Gap Report

Generated: 2026-06-28
Ticket: EPIC-08-ANALYSIS-01
Epic: EPIC-08 Evidence and Document Sufficiency Lifecycle
Source: ALPHAVEST_PROCESS_FIRST_REFACTORING_MASTERPLAN_BOC_CTES.json
Baseline: full-workflow @ 961e7f3

## Ticket Definition Re-Read

Task: Audit all mapped processes and steps for Evidence and Document Sufficiency Lifecycle against current routes, components, services and tests.

Goal: Separate implemented behavior from visual-only or specified-only claims.

Scope:
- BP-023 Evidence request
- BP-024 Client document upload
- BP-025 Document metadata validation
- BP-026 Document versioning and provenance
- BP-027 Extraction review
- BP-028 Verification pending escalation
- BP-029 Evidence linking to object
- BP-030 Evidence sufficiency decision
- BP-031 Client-safe evidence summary
- BP-032 Evidence vault management
- BP-033 Evidence rejection and re-request

Expected output: EPIC-08 domain gap report.

Definition of done: Each mapped process has implementation status and missing step list.

## Extracted EPIC-08 Delivery Chain

EPIC-08 purpose: Implement and prove Evidence and Document Sufficiency Lifecycle as a process-first app area, not as isolated screens.

EPIC-08 goal: Every relevant process/step for DOMAIN-C has a route/component/service/test proof state and user-facing work surface where authorized.

Target app area: AREA-03. Process domain: DOMAIN-C. Target screens: S027, S028, S029, S030, S046, S047.

Ordered child tasks:

1. EPIC-08-ANALYSIS-01 - Step coverage and current implementation audit for Evidence and Document Sufficiency Lifecycle
   - Status in masterplan: Planned
   - Decision: Plan-first analysis
   - Output: EPIC-08 domain gap report
   - DoD: Each mapped process has implementation status and missing step list.

2. EPIC-08-SPEC-01 - Process-first target contract for Evidence and Document Sufficiency Lifecycle
   - Status in masterplan: Blocked until EPIC-08-ANALYSIS-01
   - Decision: No implementation until specification
   - Output: EPIC-08 implementation contract
   - DoD: Acceptance criteria cover positive and negative paths; UI, service and test boundaries are named.

3. EPIC-08-IMPL-01 - Implement Evidence and Document Sufficiency Lifecycle process area
   - Status in masterplan: Blocked until EPIC-08-SPEC-01, EPIC-03-IMPL-01, EPIC-04-IMPL-01 and EPIC-05-IMPL-01
   - Decision: Split required
   - Subtasks:
     - EPIC-08-IMPL-01A - Implement primary area hub/workbench entry
     - EPIC-08-IMPL-01B - Implement queue/detail/step surfaces for core process cluster
     - EPIC-08-IMPL-01C - Implement proof/audit/client-safe boundaries
     - EPIC-08-IMPL-01D - Update process coverage matrix statuses

4. EPIC-08-QA-01 - Positive, negative and screenshot proof for Evidence and Document Sufficiency Lifecycle
   - Status in masterplan: Blocked until EPIC-08-IMPL-01
   - Decision: Split required
   - DoD: Positive path passes; negative path fails closed; screenshots show improved structure or approved exception; coverage matrix reflects result.

## Current Route and Code Coverage

Implemented route seams found:
- S027 `/documents`
- S028 `/documents/upload`
- S029 `/documents/review-queue`
- S030 `/documents/:id/review`
- S046 `/evidence`
- S047 `/evidence/:id/review`

Implemented service/API seams found:
- `app/api/documents/upload/route.ts`
- `app/api/documents/review/route.ts`
- `app/api/documents/route.ts`
- `app/api/journeys/[id]/evidence-sufficiency/route.ts`
- `lib/document-upload-service.ts`
- `lib/evidence-review-service.ts`
- `lib/evidence-service.ts`
- `lib/visibility-engine.ts`
- `lib/permission-engine.ts`

Implemented UI seams found:
- `components/client-intake-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ui/evidence-list.tsx`
- `components/wealth-actions-screen.tsx`

Implemented test seams found:
- `tests/document-upload-api.spec.ts`
- `tests/document-upload-flow.spec.ts`
- `tests/evidence-review-api.spec.ts`
- `tests/evidence-drawer-lifecycle.spec.ts`
- `tests/client-visibility-projection.spec.ts`
- `tests/permission-engine.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/pp002-evidence-sufficiency-canonical.spec.ts`

## Step Coverage Summary

Source step inventory for BP-023 through BP-033 contains 77 steps.

Current source status distribution:
- strong_partial_domain_representation: 14 steps
- partial_current_app_representation: 28 steps
- specified_not_proven: 35 steps

Process-level source status:

| Process | Name | Current status | Missing step list |
| --- | --- | --- | --- |
| BP-023 | Evidence request | specified_not_proven | BP-023-S01 Request; BP-023-S02 Upload; BP-023-S03 Validate; BP-023-S04 Review; BP-023-S05 Link; BP-023-S06 Decide sufficiency; BP-023-S07 Project safely |
| BP-024 | Client document upload | strong_partial_domain_representation | No missing behavioral core found for upload; still missing EPIC-08-owned step proof tags/status mapping across S01-S07. |
| BP-025 | Document metadata validation | partial_current_app_representation | BP-025-S03 Validate lacks explicit metadata-validation contract proof; S04 Review/S05 Link/S06 Sufficiency/S07 Projection are only indirectly represented. |
| BP-026 | Document versioning and provenance | partial_current_app_representation | Version creation and checksum exist, but S03-S07 lack explicit provenance lineage proof and user-facing step status. |
| BP-027 | Extraction review | partial_current_app_representation | Review queue and actions exist; missing explicit process-step acceptance mapping for validate/review/link/sufficiency/projection. |
| BP-028 | Verification pending escalation | strong_partial_domain_representation | S030/S029 show strong representation; missing escalation owner/SLA and re-request lifecycle proof for S06-S07. |
| BP-029 | Evidence linking to object | specified_not_proven | Link rows exist during review, but no EPIC-08 route contract proves object-link review as a first-class process across S01-S07. |
| BP-030 | Evidence sufficiency decision | specified_not_proven | Sufficiency service/API exists, but current source inventory still marks all S01-S07 as unproven; route contract covers only S046/S047 and lacks full acceptance closure. |
| BP-031 | Client-safe evidence summary | specified_not_proven | Client-safe projection exists elsewhere, but DOMAIN-C evidence-summary acceptance and screen proof are not first-class for S01-S07. |
| BP-032 | Evidence vault management | partial_current_app_representation | S046/S047 are route-contracted for BP-030/BP-031/BP-032; missing vault command boundaries, lineage status and step-level proof for S01-S07. |
| BP-033 | Evidence rejection and re-request | specified_not_proven | Clarification request exists, but no complete rejection -> re-request -> upload -> review -> sufficiency loop proof across S01-S07. |

## Evidence From Current Code

Strong implemented behavior:
- Upload writes Document, DocumentVersion, DocumentExtraction, EvidenceRecord, EvidenceItem and AuditEvent in one audited transaction.
- Upload validates document type, file size, safe filename, supported MIME/extension, tenant scope and role allowlist.
- Upload fail-closed path blocks mutation when audit persistence is unavailable.
- Review action supports `mark_reviewed`, `request_clarification` and `accept_sufficiency`.
- Sufficiency acceptance is compliance-only and checks relevance, currentness, scope and client-safe acceptance.
- Review service writes denied, blocked and success audit events and keeps release/export/client visibility locked.
- Evidence lifecycle maps upload, extraction pending, review pending, insufficient, linked and sufficient states.
- UI copy repeatedly states upload is not sufficiency and review/sufficiency does not unlock release, export or client visibility.
- S029 has master/detail workbench structure and proof drawer handoff.
- S046/S047 have a process-first route contract for BP-030, BP-031 and BP-032.

Thin or missing behavior:
- BP-023 evidence request is not owned by the documents/evidence lifecycle area; request evidence exists in compliance/governance surfaces but not as a DOMAIN-C lifecycle entry.
- BP-029 evidence linking is implemented as a review side effect, not as a first-class route/process contract.
- BP-031 client-safe evidence summary is represented by generic client-safe projection and export/client tests, not by a DOMAIN-C evidence-summary contract.
- BP-033 rejection and re-request has `request_clarification`, but lacks a closed re-request loop and route/screenshot proof.
- `lib/process-first-ux-contract.ts` only binds BP-030/BP-031/BP-032 to S046/S047; BP-023 through BP-029 and BP-033 are not part of the canonical process-first route contract.
- No EPIC-08/BP-023..BP-033 data attributes were found on the visible route components; process proof is mostly service/test inferred rather than step-addressable in the UI.

## Refactor-First Finding

The tempting shortcut would be to add another explanatory evidence panel to S027/S029/S046. That would hide the core debt.

The real implementation path is to promote DOMAIN-C lifecycle ownership into a hard contract:
- one typed process-step contract for BP-023 through BP-033,
- one area workbench entry that names request -> upload -> review -> link -> sufficiency -> client-safe summary -> re-request,
- one route-to-process matrix for S027/S028/S029/S030/S046/S047,
- one proof adapter that exposes UI step status without exposing internal payloads,
- negative tests proving upload/review/link/request/re-request never unlock release/export/client visibility.

## Bold Recommendation For EPIC-08-SPEC-01

Recommended option: hard canonical lifecycle contract, not UI patching.

Define a new EPIC-08 contract that retires the loose split between documents, evidence vault and compliance request copy:
- `lib/evidence-lifecycle-contract.ts` as canonical source for BP-023..BP-033 steps, allowed roles, route owners, audit events, UI states and forbidden overclaims.
- Extend `lib/process-first-ux-contract.ts` so every EPIC-08 route has BP coverage, not only S046/S047.
- Make S029 the operational review workbench and S046/S047 the evidence/vault/detail proof surfaces; do not let them duplicate the same decision job.
- Treat `/documents/upload` as upload-intake only, never as evidence sufficiency.
- Treat clarification as the start of BP-033 re-request lifecycle, not as just an error message.

Rejected weaker options:
- Add a summary card to the existing pages: rejected because it preserves the visual-only/process-unclear gap.
- Mark current services as fully done without route/step proof: rejected because 35 steps are still `specified_not_proven`.
- Move everything into one evidence vault page: rejected because it re-creates the long-page and mixed-page-job debt.

## Decision Gate

EPIC-08-ANALYSIS-01 is complete.

EPIC-08-SPEC-01 can start because the domain audit is now complete. It should remain a specification ticket, not implementation. The spec must name UI, service and test boundaries before EPIC-08-IMPL-01 starts.

No human product decision is required to write the spec. A human decision will be required before implementing any new route, route merge, or schema/API expansion not already covered by the True-UX route evolution authority.

## Screenshot Decision

No screenshot was warranted for EPIC-08-ANALYSIS-01. This ticket produced a source/report audit only and did not change visible UI.

## Validation

Commands run:
- `git status --short`
- `git branch --show-current`
- `git log -1 --oneline`
- `git diff --stat`
- `cat package.json`
- `pnpm guard:source`

Result:
- Branch: `full-workflow`
- Baseline: `961e7f3 feat: close epic 07 relationship audit slice`
- Source guard: PASS
- Product code changed: no
- UI changed: no
- Safety regression introduced: no
