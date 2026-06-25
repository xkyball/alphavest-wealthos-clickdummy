# P44 Next Cleanup - Typed Workflow Command Bus

Generated: 2026-06-25

## Directive

`max`

Stop extending the legacy all-purpose demo workflow mutation for advisor, compliance and release semantics.

Promote the P44 phase modules into a typed workflow command bus with separate command families for analyst draft, advisor review, compliance release and export. This removes a major place where old safety debt can hide.

## Current Evidence

- Legacy all-purpose mutation path exists at `app/api/demo-workflow/route.ts` and `lib/demo-workflow-mutation.ts`.
- P44 phase-specific modules already exist as stronger domain seams:
  - `lib/p44-phase5-ai-draft-governance.ts`
  - `lib/p44-phase6-advisor-review-closure.ts`
  - `lib/p44-phase7-compliance-rationale-closure.ts`
  - `lib/p44-phase8-export-command-closure.ts`
  - `lib/p44-phase9-cross-process-certification.ts`
- Current Phase 9 proof already treats command-family separation as a claim-control requirement, but it does not yet replace the legacy mutation spine.

## Problem

`/api/demo-workflow` and `runDemoWorkflowMutation` are too broad. They can carry analyst, advisor, compliance, release, export, evidence and client-visibility semantics through one compatibility-style mutation surface.

That makes old safety debt hard to see:

- advisor approval can be accidentally coupled to release semantics
- compliance release can inherit generic journey mutation assumptions
- export readiness can be inferred from old workflow state instead of explicit export command stages
- internal draft governance can be represented as generic recommendation mutations
- tests can pass through the legacy compatibility path while the intended P44 command family remains only partially authoritative

## Target Architecture

Create a typed workflow command bus that routes explicit command families:

| Family | Purpose | Initial Owner Module |
| --- | --- | --- |
| `AnalystDraftCommand` | Internal draft generation, classification, unsupported-claim handling, evidence-backed rebuild, draft trace | `lib/p44-phase5-ai-draft-governance.ts` |
| `AdvisorReviewCommand` | Advisor queue triage, approve, reject, request evidence, return to analyst | `lib/p44-phase6-advisor-review-closure.ts` |
| `ComplianceReleaseCommand` | Compliance queue, evidence request, rationale capture, release denial, `ReleaseSpine` precondition evaluation | `lib/p44-phase7-compliance-rationale-closure.ts` and `lib/release-spine-command-surface.ts` |
| `ExportCommand` | Scope, redaction, preview, approval, package generation, download/share | `lib/export-workflow-command-service.ts` and `lib/p44-phase8-export-command-closure.ts` |

The bus should be a thin dispatcher, not a new all-purpose service. Domain semantics must stay in the command-family modules.
Release readiness should flow through `ReleaseSpine`, not through a private compliance/export/demo-workflow shape.

## Proposed Ticket

`P44-COMMAND-BUS-01`

Replace legacy all-purpose demo workflow command extension with a typed P44 workflow command bus.

### Scope

- Add a typed command discriminated union.
- Add separate handlers for analyst draft, advisor review, compliance release and export.
- Route new P44 safety-critical command tests through the typed bus.
- Keep `/api/demo-workflow` only as a temporary compatibility adapter.
- Forbid new advisor/compliance/release/export semantics from being added directly to `runDemoWorkflowMutation`.

### Acceptance

- Each command family has a typed command and typed result.
- Advisor review commands cannot return compliance release or client-visible success states.
- Compliance release commands require advisor approval, evidence sufficiency, payload readiness, permission and audit persistence.
- Export commands require explicit export stage progression and do not infer readiness from generic workflow state.
- Analyst draft commands remain internal-only and cannot produce client/export payloads.
- A compatibility adapter can call the typed bus, but business logic does not live in the adapter.
- Tests prove command-family separation and fail if a legacy all-purpose mutation tries to absorb new safety semantics.

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
