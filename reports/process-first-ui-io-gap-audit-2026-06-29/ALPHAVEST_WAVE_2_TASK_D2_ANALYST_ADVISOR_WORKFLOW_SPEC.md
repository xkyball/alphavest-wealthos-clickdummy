# AlphaVest Wave 2 / TASK-D2 Analyst Draft And Advisor Review Workflow Specification

Date: 2026-06-29
Mode: Wave 2, specification / acceptance criteria
Status: COMPLETED_SPEC_READY_FOR_ACCEPTANCE

## Re-read Task Definition

TASK-D2 was re-read from `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json` before execution.

Goal: define safe operational workflows for analyst draft actions and advisor review negative paths.

## Source Basis

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_1_TASK_D1_ANALYST_ADVISOR_FINDINGS.md`
- `components/internal-workflow-screen.tsx`
- `lib/analyst-draft-governance-contract.ts`
- `lib/typed-workflow-command-bus.ts`
- `lib/recommendation-review-workflow-validation.ts`
- `lib/internal-workflow-demo-data.ts`
- `tests/analyst-draft-proof-boundary-ui.spec.ts`
- `tests/analyst-draft-governance-contract.spec.ts`
- `tests/advisor-review-approval-ui.spec.ts`
- `tests/workflow-gate.spec.ts`

## No-Leakage Contract

Internal analyst draft content remains internal-only across every action.

Forbidden from client/export/default operational output:

- `aiDraft`
- `internalDraftText`
- `internalRationale`
- `analystNotes`
- `advisorNotes`
- `complianceNotes`
- `unsupportedClaims`
- `draftTraceInternals`
- `sourceRefsJson`
- `auditMetadataJson`
- `evidenceInternalIds`
- `rawExtractionPayload`
- workflow gate debug metadata

Allowed product-native outputs:

- selected object identity
- safe source/evidence availability state
- blocker reason
- recovery action
- next permitted workflow action
- client-safe summary only after release-safe projection

## Analyst Workflow Contracts

| Analyst path | Required UI input | Allowed action | Required output | Blocked behavior | Proof requirement |
|---|---|---|---|---|---|
| Signal intake | Selected signal/review item, source label, severity/confidence | Open analyst work context | Selected signal work item with no advice/release/export/client visibility mutation | No client-visible recommendation, no advisor approval | UI no-overclaim plus contract proof |
| Draft create / submit review | Selected signal/draft, source context, analyst reason where required | `submit_review` or approved draft-submit command | Internal draft submitted for advisor review; compliance pending; clientVisible false | Missing source/evidence blocks submit | Command mutation, audit, no client payload |
| Reject unsupported claim | Selected unsupported claim, rejection reason | `reject_unsupported_claim` | Draft/recommendation returned/rejected with audit and unsupported claim state | No client release, no evidence sufficiency, no export | Negative proof for wrong role/scope/missing target |
| Rebuild with evidence | Selected accepted scoped evidence, rebuild reason | `rebuild_with_evidence` | New internal draft trace created; advisor/compliance gates remain pending | Missing accepted scoped evidence blocks rebuild | Evidence gate proof and no raw trace leak |
| Request evidence | Selected draft/review, missing evidence item, reason | `request_evidence` or evidence request command | Evidence requested; release/client visibility remains blocked | No sufficiency, no release, no export | Audit/event plus selected-object continuity |
| Route to advisor | Selected draft, safe-source trace status, analyst confirmation | `route_to_advisor` / `j01.routeToAdvisor` | Advisor-pending state only | Missing safe trace blocks handoff; route is not approval | Source-trace gate and no-overclaim proof |
| Redact / safe summary prep | Selected internal draft, redaction target | Redaction/prep command only if approved by implementation slice | Client-safe candidate state, not release | Raw internal rationale never client-visible | Visibility-engine/no-leak test |

## Advisor Workflow Contracts

| Advisor path | Required UI input | Allowed action | Required output | Blocked behavior | Proof requirement |
|---|---|---|---|---|---|
| Queue selection | Search/filter, selected review package | Open selected advisor detail | Selected package visible with object identity | Queue row cannot approve/release/export | Selected-object proof |
| Option comparison | Options/alternatives, selected recommendation, rejection reasons | Compare/select option for review | Option comparison decision context visible | Summary metrics alone do not count | UI comparison table and test assertion |
| Rationale input | Advisor rationale/reason, evidence reviewed acknowledgement | Capture rationale or approve with rationale | Rationale stored or visible as required input/output | Hardcoded reason alone is insufficient for full process proof | Command payload proof or explicit blocked state |
| Request evidence | Selected review/evidence gap, reason | `request_evidence` | Evidence requested; compliance release remains blocked | No advisor release, no client visibility | Workflow command/audit and negative proof |
| Request analyst rebuild | Selected package, rebuild reason, evidence gap | `rebuild_with_evidence` request or product-native block | Return/rebuild requested state | Static control cannot count as lifecycle action | Command or honest blocked reason |
| Return / send back | Selected package, return reason | Return/send-back workflow | Returned-to-analyst state with audit | No compliance release, no export | Wrong role/scope negative proof |
| Reject unsupported claim | Selected unsupported claim, rejection reason | `reject_unsupported_claim` | Rejected/blocked recommendation state | No client projection | Command mutation, audit, no-leak proof |
| Advisor approve | Selected package, reviewed evidence, rationale/confirmation | `advisor_approve` | Advisor approved, compliance pending, clientVisible false | Not compliance release; no export/share/client acceptance | UI click-to-command proof and no-overclaim |
| Escalate advisor review | Selected package, escalation reason/target | Escalation command | Escalation routed; state visible | No approval/release/export | API/action proof |

## Source Trace Gate

Before analyst handoff to advisor:

1. UI must show product-native source/evidence readiness.
2. Missing safe trace blocks route-to-advisor.
3. Safe trace enables only advisor-pending state.
4. Raw trace internals stay out of default UI.
5. Tests must fail if handoff proceeds with missing source/evidence trace.

## Option Comparison Target State

Advisor review must include a compact comparison surface with:

- selected recommendation
- alternatives considered
- why alternatives were rejected or deferred
- evidence/source linkage
- suitability/risk constraints
- advisor rationale input or explicit blocked reason
- output state after approval/return/request-evidence

Existing demo alternatives may seed this, but demo data alone does not count as implemented unless the UI binds it to selected review state and workflow output.

## Implementation Slices For TASK-D3

| Slice | Scope | CTES decision | Dependencies | Validation |
|---|---|---:|---|---|
| D3-1 Analyst Action Spine | request evidence, reject unsupported claim, rebuild with evidence, submit/route advisor | 12 | D2 accepted; A2/C2 for evidence/release boundaries | analyst workflow UI tests, command mutation tests |
| D3-2 Source Trace Gate | product-native safe/unsafe source trace before advisor handoff | 9 | D2 accepted; trace source readmodel chosen | missing trace blocks handoff; safe trace advisor-pending only |
| D3-3 Advisor Decision Controls | option comparison, rationale input, request evidence, return/reject, request rebuild | 12 | D2 accepted | advisor UI action tests, no release/client visibility proof |
| D3-4 Advisor Approval End-to-End Proof | click approval, verify exact target, audit, compliance pending, clientVisible false | 8 | D2 + A2 accepted | `advisor-review-approval-ui.spec.ts` extended or equivalent |
| D3-5 No-Leakage Cleanup | remove visible proof/contract vocabulary and verify internal fields absent | 8 | D2 + E2 accepted | no-leak UI tests, screenshot audit |

## Acceptance Criteria For TASK-D3 / TASK-D4

1. Every analyst/advisor mutation has visible selected-object identity.
2. Every required reason/rationale/evidence input is either captured or explicitly blocked.
3. Every action produces durable selected-object output or honest blocked state.
4. Advisor approval always leaves compliance release and client visibility separate.
5. Source-trace handoff is a gate, not a proof strip.
6. Option comparison is rendered as workflow decision context, not only summary metrics.
7. Internal draft fields never render in client/export/default product surfaces.
8. Negative tests cover wrong role, wrong tenant/scope, missing evidence, missing trace, missing target and audit failure where applicable.

## Human Confirmation Points

Before implementation, confirm:

1. Product copy for analyst/advisor blocked states.
2. Whether advisor request-evidence reuses the compliance `request_evidence` workflow or receives an advisor-specific command.
3. Whether return/send-back and reject unsupported claim are one workflow action or separate product actions.
4. Whether rationale is required as free text, structured option decision, or both.

## Item Outcome

Status: completed as a specification item.

Changed files:

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_2_TASK_D2_ANALYST_ADVISOR_WORKFLOW_SPEC.md`

Tests:

- `pnpm guard:source` was run during Wave 2 preflight and passed.
- No additional tests were required because TASK-D2 is specification-only.

Findings:

- Analyst/advisor closure must be an action spine, not a proof/copy cleanup only.
- Source trace and option comparison are first-class workflow requirements.
- Advisor approval proof must become UI click-to-command proof, not just visible-button proof.

Next item:

- TASK-E2.
