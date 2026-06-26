# P44 Next Cleanup - Typed Workflow Command Bus

Generated: 2026-06-25

## Directive

`max`

Stop extending generic demo workflow mutation semantics for advisor, compliance and release behavior.

Promote the P44 phase modules into a typed workflow command bus with separate command families for analyst draft, advisor review, compliance release and export. This removes a major place where old safety debt can hide.

## Current Evidence

- The command bus now lives at `lib/typed-workflow-command-bus.ts`; `/api/demo-workflow` remains the HTTP adapter.
- P44 phase-specific modules already exist as stronger domain seams:
  - `lib/internal-draft-governance-spine.ts`
  - `lib/p44-phase6-advisor-review-closure.ts`
  - `lib/p44-phase7-compliance-rationale-closure.ts`
  - `lib/p44-phase8-export-command-closure.ts`
  - `lib/p44-phase9-cross-process-certification.ts`
- Current Phase 9 proof treats command-family separation as a claim-control requirement. The current slice names the bus and routes advisor/compliance release payload readiness through canonical internal-draft and release-spine helpers.

## Problem

`/api/demo-workflow` remains broad as an HTTP adapter. The risk is letting adapter compatibility become business authority instead of routing safety-critical actions through explicit command-family helpers.

That makes old safety debt hard to see:

- advisor approval can be accidentally coupled to release semantics
- compliance release can inherit generic journey mutation assumptions
- export readiness can be inferred from old workflow state instead of explicit export command stages
- internal draft governance can be represented as generic recommendation mutations
- tests can pass through adapter compatibility while the intended P44 command family remains only partially authoritative

## Target Architecture

Create a typed workflow command bus that routes explicit command families:

| Family | Purpose | Initial Owner Module |
| --- | --- | --- |
| `AnalystDraftCommand` | Internal draft generation, classification, unsupported-claim handling, evidence-backed rebuild, draft trace | `lib/internal-draft-governance-spine.ts` |
| `AdvisorReviewCommand` | Advisor queue triage, approve, reject, request evidence, return to analyst | `lib/p44-phase6-advisor-review-closure.ts` |
| `ComplianceReleaseCommand` | Compliance queue, evidence request, rationale capture, release denial, `ReleaseSpine` precondition evaluation | `lib/p44-phase7-compliance-rationale-closure.ts` and `lib/release-spine-command-surface.ts` |
| `ExportCommand` | Scope, redaction, preview, approval, package generation, download/share | `lib/export-workflow-command-service.ts` and `lib/p44-phase8-export-command-closure.ts` |

The bus should be a thin dispatcher, not a new all-purpose service. Domain semantics must stay in the command-family modules.
Release readiness should flow through `ReleaseSpine`, not through a private compliance/export/demo-workflow shape.
Export readiness should flow through `lib/export-workflow-command-service.ts`, with AV27, WP10, WCL export safety, file realism and Phase 8 proof families classified behind the command spine by `tests/export-command-spine-contract.spec.ts`.

## Proposed Ticket

`P44-COMMAND-BUS-01`

Replace generic demo workflow command extension with a typed P44 workflow command bus.

### Scope

- Add a typed command discriminated union.
- Add separate handlers for analyst draft, advisor review, compliance release and export.
- Route new P44 safety-critical command tests through the typed bus.
- Keep `/api/demo-workflow` as the HTTP adapter.
- Forbid new advisor/compliance/release/export semantics from bypassing the typed command-family helpers inside `lib/typed-workflow-command-bus.ts`.

### Acceptance

- Each command family has a typed command and typed result.
- Advisor review commands cannot return compliance release or client-visible success states.
- Compliance release commands require advisor approval, evidence sufficiency, payload readiness, permission and audit persistence.
- Export commands require explicit export stage progression and do not infer readiness from generic workflow state.
- Analyst draft commands remain internal-only and cannot produce client/export payloads.
- A compatibility adapter can call the typed bus, but business logic does not live in the adapter.
- Tests prove command-family separation and fail if generic adapter code absorbs new safety semantics.

### Negative Acceptance

- No new advisor/compliance/release/export action is added to the `DemoWorkflowAction` union as the primary domain contract.
- No release/client-visible/export-ready state is returned by advisor review commands.
- No export approval/download/share is reachable through generic workflow mutation state alone.
- No hidden client/internal payload field is exposed through the compatibility adapter.
- No command handler can skip audit persistence for safety-critical mutations.

### Initial Test Anchors

- `tests/p44-phase6-certification.spec.ts`
- `tests/p44-phase7-certification.spec.ts`
- `tests/p44-phase8-certification.spec.ts`
- `tests/p44-phase9-certification.spec.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/workflow-gate.spec.ts`

## Migration Plan

1. Add typed command bus and result envelopes without changing route behavior.
2. Move advisor review actions behind `AdvisorReviewCommand`.
3. Move compliance release actions behind `ComplianceReleaseCommand`.
4. Move export semantics behind `ExportCommand` and existing export workflow command service.
5. Move analyst draft governance behind `AnalystDraftCommand`.
6. Convert `/api/demo-workflow` into a compatibility adapter that delegates to the bus.
7. Add a lint/test guard that blocks new P44 safety semantics in `runDemoWorkflowMutation`.
8. Remove compatibility branches once all UI/API callers use typed command families.

## Stop Conditions

- Schema changes are required but not explicitly authorized.
- Current UI callers cannot be mapped to command families without a route/action decision.
- A command family would weaken existing fail-closed behavior.
- Tests reveal that the compatibility adapter is still the only place where a safety rule exists.

## Bold Recommendation

Do not make a larger, prettier `demo-workflow` service. Kill the pattern.

The old mutation spine should become a compatibility shell only. All new safety-critical semantics should live in typed P44 command families, with Phase 9 certification acting as the claim-control gate.
