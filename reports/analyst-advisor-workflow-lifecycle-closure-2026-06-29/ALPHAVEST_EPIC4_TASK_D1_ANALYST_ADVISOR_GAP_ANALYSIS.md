# ALPHAVEST EPIC-4 / TASK-D1 Analyst and Advisor Lifecycle Gap Analysis

Status: complete
Source ticket: `AV-PFUI-E04` / `TASK-D1`
Date: 2026-06-29

## Re-read Definition

`TASK-D1` requires analysis of analyst draft workflows, internal-only no-leakage boundaries, source traceability, advisor rationale, option comparison, request evidence, and return/reject. Output must classify every scoped analyst/advisor action, list missing negative paths, and produce a specification split for `TASK-D2`.

## Current Evidence Base

- `/Users/chris/projects/alphavest-wealthos-clickdummy/components/internal-workflow-screen.tsx`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/lib/analyst-draft-governance-contract.ts`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/lib/advisor-review-approval-contract.ts`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/lib/advisor-review-workflow-actions.ts`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/lib/typed-workflow-command-bus.ts`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/app/api/advisor-review/actions/route.ts`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/app/api/recommendation-review-workflow/route.ts`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/tests/analyst-draft-governance-contract.spec.ts`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/tests/analyst-draft-proof-boundary-ui.spec.ts`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/tests/advisor-review-approval-contract.spec.ts`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/tests/advisor-review-approval-ui.spec.ts`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/tests/advisor-review-command-api.spec.ts`
- `/Users/chris/projects/alphavest-wealthos-clickdummy/tests/workflow-gate.spec.ts`

## Action Classification

| Area | Action | Current State | Missing Output / Negative Path | Classification |
| --- | --- | --- | --- | --- |
| Analyst | Signal intake | Contracted and represented through internal queue context. | Needs no client-visible output claim. | mostly_service_backed |
| Analyst | Workbench triage | UI can select a work item, but primary controls are partly static. | Selected work item must map to a workflow action or explicit product blocker. | partial |
| Analyst | Request evidence from workbench | Existing `j01.requestData` command updates trigger/action item and audit. | UI should invoke it from operational control where applicable. | service_backed_needs_ui_wire |
| Analyst | Route to advisor | Existing `j01.routeToAdvisor` command updates trigger, recommendation, approval and audit. | Workbench/detail UI should not represent route as advisor approval. | service_backed |
| Analyst | Reject unsupported claim | `runAdvisorApprovalWorkflowAction` supports `reject_unsupported_claim` through typed workflow mutation. | UI needs product-native action or blocker and no client rejection wording. | service_backed_needs_ui_wire |
| Analyst | Rebuild with evidence | `runAdvisorApprovalWorkflowAction` supports `rebuild_with_evidence`, evidence-scoped, fail-closed without accepted evidence. | UI needs scoped path or honest blocker if evidence is unavailable. | service_backed_needs_ui_wire |
| Analyst | Redact internal-only | Contracted as required; no direct operational UI path found. | Redaction cannot be shown as release or client-safe approval. | specified_only |
| Analyst | Source traceability | InternalDraft/DraftTrace exist and typed workflow writes traces for rebuild/submit. | UI should show safe source summary only; raw trace stays internal. | service_backed_needs_safe_readmodel |
| Advisor | Queue open/select | UI opens selected detail and does not mutate release. | Queue still carries internal proof/process data attributes. | visible_operational_with_meta_debt |
| Advisor | Rationale input | Current approval reason is hardcoded in UI action. | Advisor must type or choose rationale before approval/return/request evidence. | missing_input |
| Advisor | Option comparison | UI shows metrics/options but no persisted option-comparison command. | Needs workflow-backed output or honest read-only state. | visible_only |
| Advisor | Request evidence | `runAdvisorApprovalWorkflowAction` supports `request_evidence`. | Advisor detail UI has static control, not workflow-backed. | service_backed_needs_ui_wire |
| Advisor | Return/reject | Contract requires return/reject; typed bus has `compliance_block` and analyst rejection, but no advisor return/reject action name exposed to UI/API. | Need conservative state transition that keeps release/export/client visibility blocked and preserves reason. | service_gap |
| Advisor | Approve to compliance | UI calls `advisor_approve` via typed workflow bus. | Must require rationale input and must remain separate from compliance release. | service_backed_needs_input_gate |

## No-Leakage Risk Map

- High: hardcoded advisor reason can create audit without real advisor input.
- High: static advisor request/rebuild controls can look actionable while producing no state change.
- High: visible `proof`, `process`, `gate` and contract data attributes on operational surfaces contradict the repo-level operational UI rule.
- Medium: option comparison currently reads as decision evidence but has no persisted option-comparison output.
- Medium: source traceability exists in backend traces but lacks a clean safe summary/readmodel in the advisor UI.
- Low: queue-level open-detail behavior is acceptable if it stays non-mutating and does not imply approval/release.

## Specification Split For TASK-D2

1. Analyst operational closure:
   - Wire or honestly block workbench/detail actions for request data, route to advisor, reject unsupported claim, rebuild with evidence and source trace summary.
   - Keep all internal payloads out of client-facing surfaces.

2. Advisor decision input closure:
   - Require advisor rationale before approval, evidence request or return/reject.
   - Persist the selected action through typed workflow mutation and audit.

3. Advisor negative-path closure:
   - Implement service-backed request-evidence and return-to-analyst paths.
   - Return/reject must not mean compliance release, client rejection, export failure or client visibility.

4. Operational UI cleanup:
   - Remove operationally visible process/gate/proof/meta scaffolding from affected screens.
   - Preserve machine-testable safety through services, state, audit, tests and reports, not through visible process boards.

## TASK-D1 Definition Of Done

- Every scoped action is classified: done.
- Missing negative paths are listed: done.
- Specification can proceed: done.

