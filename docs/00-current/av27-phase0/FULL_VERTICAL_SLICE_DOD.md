# AV27 Phase 0 - Full Vertical Slice Definition of Done

Generated: 2026-06-25
Mode: max
Source index: `/Users/chris/Downloads/alphavest/ALPHAVEST_27_STRONG_SLICES_BOC_CTES_DELIVERY_CHAIN_TASK_MASTER_INDEX.md`
Source task master: `/Users/chris/Downloads/alphavest/ALPHAVEST_27_STRONG_SLICES_BOC_CTES_DELIVERY_CHAIN_TASK_MASTER.md`
Active repo authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
Ticket chain: `AV27-P0-T04-A`, `AV27-P0-T04-S`, `AV27-P0-T04-I`, `AV27-P0-T04-Q`
Status: `PHASE0_FULL_VERTICAL_SLICE_DOD_READY_FOR_REVIEW`

## Purpose

This is the standard Definition of Done for all 27 AV27 target processes. It is a claim guard: no process may be labelled `FULLY_FULFILLED_VERTICAL_SLICE` unless every required layer is proven or explicitly marked not applicable with a reviewed reason.

## Standard Seven-Layer DoD

| Layer | Required proof | Negative proof |
| --- | --- | --- |
| 1. UI / route | User can reach the correct route or UI surface through the active route registry and task-oriented navigation. | Wrong role, wrong route scope, reference-only or hold route cannot silently appear as MVP fulfillment. |
| 2. Interaction lifecycle | Primary action, blocker, recovery and state feedback are visible and truthful. | Fake success states, hidden shortcuts and upload-as-sufficiency patterns fail review. |
| 3. API / service | Action reaches a bounded API/service path with typed validation and fail-closed error handling. | Missing, invalid, wrong-role or wrong-object request does not mutate state. |
| 4. DB / durable state | Intended state persists or is represented by the approved demo-data/state layer for this repo stage. | Partial or orphan state cannot be presented as completed. |
| 5. Workflow / gates | Advisor, compliance, evidence, release, visibility, export and review gates execute in the approved order. | Advisor approval alone does not release; compliance release does not imply client acceptance; data-quality blockers cannot be skipped. |
| 6. Safety | RBAC, object scope, client visibility, advice boundary, evidence/audit/export controls remain intact. | Admin bypass, cross-tenant access, unreleased payload leakage and internal-note export fail closed. |
| 7. Positive and negative tests | Targeted tests, review notes or proof artifacts cover success and failure behavior. | No process can pass with only visual presence, route presence, schema presence or happy-path-only proof. |

## Per-Process Completion Checklist

For each target process, later QA must answer:

1. Which route(s) prove user-facing reachability?
2. Which component(s) prove the interaction lifecycle?
3. Which API/service functions perform the action?
4. Which DB/demo-state/read-model records prove durable state?
5. Which workflow gates are involved and in what order?
6. Which safety boundaries are involved?
7. Which positive tests ran?
8. Which negative tests ran?
9. Which audit/evidence/export/client-visibility proof was captured?
10. What remains partial, blocked or not applicable?

## False-Claim Blockers

Any one of these blocks a full vertical-slice claim:

- route exists but action does not mutate or persist the intended state
- API exists but UI cannot reach it in the intended workflow
- upload exists but reviewed/linkable/sufficient evidence is not proven
- advisor approval changes client visibility
- compliance release skips evidence, audit, data-quality or permission preconditions
- export contains or can infer internal drafts, compliance notes or unreleased evidence
- client projection contains unreleased internal payloads
- admin can bypass business/safety gates
- no negative test or negative review evidence exists
- test evidence is stale, unrelated or not tied to the target process

## Phase 0 Completion Boundary

Phase 0 may complete the following:

- target process lock
- evidence inventory
- dependency graph
- reusable DoD

Phase 0 may not claim:

- product implementation completion
- full vertical-slice fulfillment
- P0 certification
- UI parity or user-facing change
- schema/API migration acceptance

## Ticket Results

| Ticket | Result | Evidence |
| --- | --- | --- |
| `AV27-P0-T04-A` | Complete | Current proof expectations and seven-layer closure needs inspected. |
| `AV27-P0-T04-S` | Complete | Standard DoD, checklist and false-claim blockers specified. |
| `AV27-P0-T04-I` | Complete | Reusable full vertical-slice DoD implemented in this file. |
| `AV27-P0-T04-Q` | Complete | DoD is usable across all 27 processes and blocks stale/unmapped/false-completion claims. |
