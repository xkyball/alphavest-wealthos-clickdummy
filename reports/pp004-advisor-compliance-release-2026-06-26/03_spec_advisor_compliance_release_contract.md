# SPEC-1.2 - PP-004 Advisor Approval, Compliance Release and Client Visibility Contract

Generated: 2026-06-26

Status: `COMPLETE`

Source ticket: `SPEC-1.2`

## Contract Decision

PP-004 must use the typed journey command path as the canonical release-boundary proof path:

- `POST /api/journeys/:id/commands`
- `lib/journeys/journey-api-service.ts`
- `lib/workflow-gate.ts`
- `lib/release-spine-command-surface.ts`
- PP001 payload contract
- PP002 canonical evidence sufficiency contract
- PP003 lifecycle gate and redaction matrix

The older `/api/demo-workflow` path may remain as compatibility proof and regression guard, but it must not be treated as primary PP-004 release proof unless a later ticket explicitly hardens a specific action into the typed contract.

## Release Boundary Rules

### Advisor Approval

Advisor approval may:

- create/update an `Approval` record;
- move a recommendation to `COMPLIANCE_PENDING`;
- update journey metadata with `advisorApprovalIsNotRelease=true`;
- write audit proof;
- make the object eligible for compliance review.

Advisor approval must not:

- set `Recommendation.clientVisible=true`;
- set `Recommendation.status=RELEASED_TO_CLIENT`;
- set `ComplianceReview.status=RELEASED`;
- set `ComplianceReview.releasedAt`;
- set `Decision.status=RELEASED_TO_CLIENT`;
- set `Decision.releasedToClientAt`;
- return client-visible projection payload;
- imply client acceptance, export approval or evidence sufficiency.

### Compliance Block

Compliance block may:

- set `ComplianceReview.status=BLOCKED`;
- set `blockedAt`;
- set recommendation/internal journey blocker metadata;
- write audit proof;
- explain safe recovery.

Compliance block must not:

- create client visibility;
- release a decision;
- approve export/download/share;
- expose compliance notes or internal rationale to client surfaces.

### Request Evidence

Request evidence may:

- set `ComplianceReview.status=NEEDS_EVIDENCE`;
- move recommendation to `MORE_DATA_REQUESTED`;
- create or update safe evidence-request workflow state;
- write audit proof;
- create a client-safe evidence request projection only when redacted.

Request evidence must not:

- treat upload as sufficiency;
- release content;
- expose internal evidence record IDs, internal reasons or compliance notes to client-role responses.

### Compliance Release

Compliance release may proceed only when all required preconditions pass:

- actor is a compliance-authorized role;
- tenant/object scope is valid;
- advisor approval is complete;
- PP002 canonical evidence sufficiency passes for required evidence;
- PP003 lifecycle gate and payload/surface inspection pass;
- client-safe summary/payload exists;
- permission check passes;
- audit persistence is available and writes proof;
- release step/state is current;
- required release confirmation phrase matches;
- data-quality gate passes where applicable.

Compliance release must:

- set `ComplianceReview.status=RELEASED`;
- set `releasedAt`;
- set `Recommendation.status=RELEASED_TO_CLIENT`;
- set `Recommendation.clientVisible=true`;
- set linked `Decision.status=RELEASED_TO_CLIENT` and `releasedToClientAt` where the decision exists;
- write `journey.compliance.released` or equivalent audit proof;
- return only client-safe projection payload.

Compliance release must not:

- imply client acceptance;
- approve export/download/share;
- bypass PP003 with waiver-based unsupported-claim promotion;
- consume legacy/P44 evidence as release proof unless adapted into PP002 canonical sufficiency;
- fork a parallel release-readiness vocabulary.

### Release Denial

Failed release attempts must:

- fail closed before client-visible state mutation;
- report missing preconditions;
- write denied audit proof when audit is available;
- keep recommendation, compliance review, decision and journey client visibility unchanged.

## Canonical Preconditions

Use this precondition list for `DECISION-1.3`:

| Precondition | Source contract | Missing code |
| --- | --- | --- |
| Advisor approval | PP004 / `workflowGate` / journey command run | `advisor_approval` |
| Canonical evidence sufficiency | PP002 | `evidence_sufficiency:*`, `accepted_evidence`, `scoped_evidence` |
| PP003 lifecycle and payload safety | PP003 | `payload_ready`, `decision_rationale`, PP003 forbidden field names |
| Compliance role/permission | PP001 / permission engine | `permission_check` |
| Tenant/object scope | PP001 scope resolver | `scope_denied` or equivalent |
| Audit persistence | audit service | `audit_persistence` |
| Release step current | journey state machine | `journey_release_step_current` |
| Confirmation phrase | journey command request | `release_confirmation_phrase` |
| Data quality | data-quality gate where present | data-quality gate missing codes |

## Client Projection Contract

Before release:

- client projection is hidden, empty, redacted or blocked;
- no AI draft, internal rationale, analyst notes, advisor notes, compliance notes, internal evidence details, audit internals or unreleased evidence are returned.

After release:

- client projection may return only PP001/PP003 client-safe fields;
- audit internals are hidden or redacted;
- release state is visible as release state only, not client acceptance.

## UI / UX Wording Contract

Allowed phrasing:

- "Approve for compliance review"
- "Sent to compliance"
- "Release client-safe decision"
- "Request evidence"
- "Block release"
- "Release denied: missing preconditions"
- "Client-safe content available after compliance release"

Forbidden or unsafe phrasing:

- "Released" after advisor approval.
- "Client accepted" after compliance release.
- "Evidence sufficient" after upload-only success.
- "Export approved" after preview.
- "Admin override release."
- Any success copy that collapses advisor approval, compliance release, client visibility and client acceptance into one state.

## Test Design

PP-004 implementation should add or maintain focused tests for:

1. Advisor approval positive transition to compliance pending.
2. Advisor approval negative no-release/no-client-visibility/no-decision-release.
3. Compliance release happy path through typed journey command.
4. Release denial for missing advisor approval.
5. Release denial for missing PP002 canonical evidence sufficiency.
6. Release denial for PP003 forbidden payload / non-ready lifecycle.
7. Release denial for wrong role/admin bypass.
8. Release denial when audit persistence is unavailable.
9. Block/request evidence no-client-visibility and audit proof.
10. Client projection fail-closed before release and clean after release.
11. No-overclaim UI wording where the UI is touched.
12. `/api/demo-workflow` classification so legacy demo success is not PP-004 proof.

## Implementation Boundary

Codex may later:

- harden existing typed journey command paths;
- add focused PP004 tests;
- add report/proof artifacts;
- update no-overclaim UI wording if the decision gate approves UI work;
- classify/retire unsafe demo action proof paths.

Codex must not:

- create a broad new API surface unless explicitly approved;
- replace Prisma schema blindly;
- create a second release-readiness vocabulary;
- make legacy/P44 evidence release-compatible by default;
- use advisor approval as release;
- use compliance release as export approval or client acceptance;
- weaken PP001/PP002/PP003 tests to pass PP004.

## Ticket Completion

`SPEC-1.2` is finished.
