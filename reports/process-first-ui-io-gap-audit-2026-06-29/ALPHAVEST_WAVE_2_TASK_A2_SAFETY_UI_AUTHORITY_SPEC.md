# AlphaVest Wave 2 / TASK-A2 Safety UI Authority Specification

Date: 2026-06-29
Mode: Wave 2, specification / acceptance criteria
Status: COMPLETED_SPEC_READY_FOR_ACCEPTANCE

## Re-read Task Definition

TASK-A2 was re-read from `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json` before execution.

Goal: define exact UI, service, state, audit and negative-test contracts for safety-critical actions.

Explicit boundary: implementation and visible UI changes are out of scope until the acceptance criteria are accepted.

## Source Basis

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_1_TASK_A1_SAFETY_AUTHORITY_FINDINGS.md`
- `lib/permission-engine.ts`
- `lib/typed-workflow-command-bus.ts`
- `lib/visibility-engine.ts`
- `lib/export-workflow-command-service.ts`
- `lib/export-workflow-readmodel-service.ts`
- `app/api/export-workflow/route.ts`
- `components/admin-tenant-setup-screen.tsx`
- `components/internal-workflow-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `tests/permission-engine.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/compliance-review-release-ui.spec.ts`
- `tests/file-export-realism.spec.ts`

Preflight note: current worktree contains pre-existing/parallel product diffs in safety-relevant UI files. This spec does not modify them.

## Authority Contract Matrix

| Safety action | Required UI input | Required service / workflow | Required output state | Audit / evidence requirement | Negative acceptance criteria |
|---|---|---|---|---|---|
| Admin configuration | Selected tenant/admin object, exact setting, user acknowledgement for sensitive change | Permission engine permits configuration only, never release/export/client-visibility authority | Change is saved, routed, blocked or pending approval as configuration state only | Sensitive changes write audit or show fail-closed audit-unavailable state | Admin cannot mark evidence sufficient, approve export, release recommendation, expose internal advice, or make client projection visible |
| Advisor approval | Selected advisor review package, advisor decision, rationale/reason where required | Typed workflow `advisor_approve` or approved advisor review command | Advisor approved / compliance pending, `clientVisible=false`, export/share unavailable | Advisor approval event recorded; no compliance release audit emitted | Advisor approval must not create compliance release, client acceptance, export package, share link, or client visibility |
| Compliance request evidence | Selected compliance review, missing-evidence reason, required confirmation | Typed workflow `request_evidence` | Review remains blocked; evidence request visible on same selected object | Audit event and evidence-request state persisted or fail-closed | Request evidence must not release, export, download, share, or mark evidence sufficient |
| Compliance block release | Selected compliance review, block reason, required confirmation | Typed workflow `compliance_block` | Review blocked/held; client visibility remains false | Audit event persisted or fail-closed | Block action must not create client-safe release, export readiness, or client acceptance |
| Compliance release | Selected review, selected evidence, advisor approval, release preconditions, compliance confirmation phrase | Typed workflow `compliance_release` with release-spine gates | Selected review becomes released; released projection/client visibility output appears only for same object | Release audit event, selected evidence linkage, release timestamp, client-safe projection metadata | Missing advisor approval, missing evidence, unsafe payload, missing permission, audit failure, wrong object, stale evidence or process-step mismatch block release |
| Export set scope | Selected export request/object, scope fields | Export workflow `SET_SCOPE` | Scope state visible on same export request | Audit/event or command record for scope selection if sensitive | Route/screen presence or summary row cannot count as scope command |
| Export validate redaction | Selected export request, redaction profile/check result | Export workflow `VALIDATE_REDACTION` | Redaction validation state visible with blockers | Redaction validation event or fail-closed reason | Export cannot proceed to preview/approval if redaction validation is absent or failed |
| Export preview | Selected export request, preview acknowledgement | Export workflow `PREVIEW` | Preview-generated state, not approval/download/share | Preview event or readmodel proof | Preview cannot imply approval, generation, download, share, delivery or client acceptance |
| Export approve | Selected export request, authority acknowledgement, approval reason if required | Export workflow `APPROVE` | Approved-for-generation state only | Export approval audit event | Approval cannot create binary download, share link, delivery, client response, or client acceptance |
| Export generate | Selected approved export request | Export workflow `GENERATE` | Generated package state with protected filename/checksum/readmodel output | Generation event/audit | Generation blocked unless release/redaction/authority gates pass |
| Export download | Selected generated export package, download acknowledgement | Export workflow `DOWNLOAD` | Download recorded; share remains separate | Download audit event | Download cannot create share link, client response, or client acceptance |
| Export share | Selected generated/downloaded export package, share target, redaction/release authority | Export workflow `SHARE` | Share prepared/sent/blocked state | Share audit event, recipient/scope proof | Share blocked without release/redaction/authority and must not bypass client visibility gates |
| Client visibility projection | Selected released client-safe object | Visibility engine projection | Released projection or fail-closed empty/blocked state | Projection source and release linkage available to proof tooling | Internal draft, analyst notes, compliance notes, unreleased evidence and proof scaffolding never appear in client UI |

## UI Rules

1. Each visible safety action must show the selected object before the action.
2. Every enabled action must map to a typed service or workflow command.
3. Every disabled action must show a product-native blocker and recovery path.
4. A badge, chip, proof strip, route, screenshot, table row or component presence is not an output proof.
5. Output state must be visible on the same selected object after success or failure.
6. Advisor approval, compliance release, export authority, client visibility and client acceptance remain separate states.
7. Admin can configure policies and roles, but cannot bypass workflow gates.
8. Client-facing UI consumes only fail-closed visibility projections.
9. Internal proof markers, task IDs, phase IDs, route IDs and contract names stay out of default operational UI.

## Service / State Rules

1. `targetId`, selected row/detail object, route param and post-command read model must refer to the same object.
2. Sensitive workflow commands must return enough state for the UI to show success, blocked, denied and audit-unavailable results.
3. Service read models must distinguish display state, command state and persisted workflow state.
4. Audit-unavailable must fail closed for release/export/share/client visibility.
5. Demo or seeded state may be used only if the UI labels it as product state, not proof scaffolding.

## Required Negative Tests

| Test target | Required negative proof |
|---|---|
| Admin non-bypass | Admin role cannot release advice, mark evidence sufficient, approve export, create share, or expose client projection |
| Advisor approval | Advisor approval leaves `clientVisible=false`, compliance pending, no export/download/share |
| Compliance release | Missing evidence, advisor approval, permission, safe payload, audit persistence or selected process runtime blocks release |
| Object continuity | Mutating a hardcoded target different from the selected row fails the test |
| Export command spine | Each command stage blocks when prerequisite stage is missing |
| Export no-overclaim | Preview/approval/generation/download/share are distinct visible states |
| Client projection | Client routes fail closed and never render internal draft/rationale/evidence payloads |
| Audit unavailable | Release/export/share actions are blocked or fail closed when audit persistence is unavailable |

## Implementation Slices For TASK-A3

| Slice | Scope | CTES decision | Dependencies | Validation |
|---|---|---:|---|---|
| A3-1 Admin Non-Bypass UI Contract | Replace overclaiming labels with product-native configure/routed/blocked language; bind admin actions to non-bypass outputs | 8 | A2 accepted; current dirty admin UI reconciled | `permission-engine.spec.ts`, governance non-bypass UI assertions |
| A3-2 Compliance Object Continuity | Selected review -> command target -> persisted output -> visible post-command state | 12 | A2 accepted; release fixtures stable | `compliance-review-release-ui.spec.ts`, targeted object-continuity test |
| A3-3 Export Command Spine UI | Scope, redaction, preview, approve, generate, download, share as separate workflow steps | 12 | A2 accepted; export service command contract current | `file-export-realism.spec.ts`, export UI command spine test |
| A3-4 Client Visibility Trace | Released projection and fail-closed client surfaces tied to visibility engine | 11 | A2 + C2 accepted | `true-ux-client-projection.spec.ts`, `client-visibility-projection.spec.ts` |
| A3-5 Safety Visual Proof States | Route/state-specific screenshot proof for release/export/visibility blockers | 7 | E2 accepted | `operational-visual-audit.spec.ts`, screenshot audit at 1400x900 |

## Human Confirmation Points

Before implementation, a human should accept or revise:

1. User-facing blocker wording standard.
2. Whether export `SHARE` remains blocked in MVP or is wired as a command.
3. Whether compliance release success may immediately create client visibility in demo mode, or must require a separate projection confirmation.
4. Reviewer-only proof surface policy from TASK-E2.

## Item Outcome

Status: completed as a specification item.

Changed files:

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_2_TASK_A2_SAFETY_UI_AUTHORITY_SPEC.md`

Tests:

- `pnpm guard:source` was run during Wave 2 preflight and passed.
- No additional tests were required because TASK-A2 is specification-only.

Findings:

- Safety implementation should not start as one broad refactor.
- Export command spine and compliance object continuity are the first implementation candidates.
- Current dirty UI files must be reconciled before A3 changes are staged.

Next item:

- TASK-B2.
