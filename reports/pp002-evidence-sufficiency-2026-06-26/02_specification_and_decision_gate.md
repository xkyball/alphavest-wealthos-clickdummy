# PP-002 Specification - Evidence Sufficiency Proof Contract

Generated: 2026-06-26

Task: `SPEC-1 PP-002 Evidence Sufficiency Proof Contract`

Status: `READY_FOR_DECISION_1`

## Contract Scope

This specification defines the first-wave PP-002 proof contract for AlphaVest Evidence Sufficiency. It consumes the upload and the current repo analysis, and stays inside the True-UX / PP-001 safety boundary.

## Canonical First-Wave Architecture

Use the journey-level evidence sufficiency contract as the canonical PP-002 gate:

- command: `DECIDE_EVIDENCE_SUFFICIENCY`
- read endpoint: `/api/journeys/[id]/evidence-sufficiency`
- service owner: `lib/journeys/journey-api-service.ts`
- policy helper: `lib/evidence-service.ts`
- persisted decision: `EvidenceSufficiencyDecision`
- source evidence objects: `EvidenceRecord`, `EvidenceItem`, `Document`, `DocumentReview`, `DocumentLink`, `AuditEvent`

The document-review path remains the upload/review adapter:

- `/api/documents/upload` creates candidate evidence only.
- `/api/documents/review` may review/link evidence and, for the approved first wave, can prove a document-scoped sufficiency acceptance.
- PP-002 should not create a third broad Evidence API before this canonical path is proven and accepted.

## Evidence State Taxonomy

| State | Meaning | Gate Effect |
|---|---|---|
| `uploaded_candidate` | Document/evidence artefact exists after upload. | No sufficiency, release, export or client visibility. |
| `extraction_pending` | Uploaded evidence awaits extraction/review. | No sufficiency, release, export or client visibility. |
| `review_pending` | Evidence exists but human review is incomplete. | No sufficiency. |
| `linked_not_sufficient` | Evidence is linked to a target but at least one condition is missing. | Gate remains blocked. |
| `insufficient` | Evidence failed review or sufficiency checks. | Gate remains blocked; reason required where available. |
| `rejected` | Evidence is explicitly rejected for the target. | Gate remains blocked; may enable re-request. |
| `re_requested` | New evidence has been requested after insufficiency/rejection. | Gate remains blocked until replacement evidence passes. |
| `sufficient_for_scoped_gate` | Evidence passed all first-wave sufficiency conditions for one target/gate. | Can satisfy evidence prerequisite only; does not itself release/export/client-publish. |
| `client_safe_summary_available` | A redacted/released/allowed summary exists. | Can support client/export projection only through downstream visibility/export gates. |

## Sufficiency Conditions

Evidence may be sufficient only for a concrete requirement/gate when all required conditions are true:

- evidence is uploaded/persisted and linked to the target requirement,
- evidence has been human reviewed,
- evidence is relevant to the requirement,
- evidence scope matches tenant, object, target and gate,
- evidence is current enough for the requirement,
- evidence status meets the required minimum, normally `VALIDATED`,
- evidence is not rejected, stale, archived, superseded or wrong-scope,
- client-facing use is controlled by approved visibility/redaction rules,
- the decision is made by an allowed role,
- the decision is audited, or the action fails closed.

## Upload-Only Rules

- Upload may create `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem` and `AuditEvent`.
- Upload response/state must say upload/candidate/review pending only.
- Upload must not set `EvidenceSufficiencyDecision`.
- Upload must not set compliance release, export approval/download/share, or client-visible publication.
- Upload failure, denied role, invalid tenant, invalid metadata, unsupported file type and audit-unavailable paths must fail closed without unsafe mutation.

## Review / Link Rules

- Analyst review can create review/link proof but cannot set final sufficiency.
- Review alone is necessary but not sufficient.
- Evidence link must be target-specific.
- Wrong-object, wrong-tenant, wrong-requirement or unlinked evidence cannot satisfy a gate.
- Clarification/insufficiency must preserve no-release/no-export/no-client-visibility safety.

## Rejection / Re-request Rules

First-wave PP-002 may implement or prove rejection/re-request only if DECISION-1 includes it.

Required if approved:

- rejected/insufficient evidence carries a reason,
- rejected evidence cannot become sufficient without a new accepted action or replacement path,
- re-request creates an internal audited workflow state,
- client notification is out of scope unless explicitly approved,
- re-request does not release, export or expose evidence.

## Client-Safe Evidence Summary Rules

First-wave PP-002 must define client-safe evidence as an allowlist, not as raw evidence with hidden fields patched later.

Allowed first-wave fields:

- evidence title or document title,
- document/evidence type,
- version count,
- review/sufficiency state label,
- redacted summary approved for client-safe use,
- non-sensitive date/status metadata where downstream visibility permits it.

Forbidden unless separately released/redacted:

- storage keys,
- checksums and raw file hashes,
- raw file names for restricted evidence,
- internal notes,
- extraction low-confidence fields,
- compliance notes,
- analyst/advisor rationale,
- unreleased evidence content,
- internal audit metadata,
- raw document/evidence IDs when they expose internal object structure.

## Audit Contract

Required evidence action families:

- `document.upload.created`
- `document.upload.denied`
- `document.evidence_review.linked`
- `document.evidence_review.clarification_requested`
- `document.evidence_review.denied`
- `document.evidence_sufficiency.accepted`
- `document.evidence_sufficiency.blocked`
- `journey.evidence.linked`
- `journey.evidence_sufficiency.sufficient`
- `journey.evidence_sufficiency.insufficient`

Minimum fields:

- actor user,
- actor role,
- tenant,
- target type,
- target ID,
- event type,
- previous state,
- next state,
- result,
- reason,
- relevant metadata including requirement key, missing conditions and `uploadIsNotSufficiency` where applicable.

Fail-closed rule:

If audit persistence is required and unavailable, the safety-critical action must not silently mutate state.

## Implementation Boundary For DECISION-1

Recommended approved scope:

1. Canonicalize PP-002 around the journey-level sufficiency path.
2. Keep document upload/review as adapter proof.
3. Add only missing tests/doc alignment for stale/rejected/re-request/client-safe summary gaps.
4. Do not create new Prisma models or migrations.
5. Do not create a broad new Evidence API.
6. Do not expand into PP-003 advice, PP-004 release, or PP-005 export beyond negative lock assertions.

## P0 Acceptance Criteria

- Given valid upload succeeds, document/version/extraction/evidence/audit records may exist, but sufficiency, release, export and client visibility stay locked.
- Given evidence is reviewed and linked but not accepted by compliance for a scoped requirement, the gate remains blocked.
- Given compliance tries to mark evidence sufficient without review/link/relevance/scope/currentness/client-safe visibility, the action fails closed and records or returns the missing conditions.
- Given evidence is accepted as sufficient, the decision is target-specific and audited, and does not itself release to client or export.
- Given an analyst/admin/principal tries to force sufficiency outside permission, the action is denied or blocked and no unsafe mutation occurs.
- Given wrong-scope evidence is used, sufficiency fails and document/evidence state remains unchanged.
- Given audit persistence is unavailable for a critical action, the action fails closed.
- Given a client/export context requests evidence, only approved client-safe summary fields are visible.
- Given raw/internal/unreleased evidence fields are present, client/export-facing contexts hide or redact them.

## Tests Required For The Approved First Wave

Already passing:

- `tests/document-upload-api.spec.ts`
- `tests/evidence-review-api.spec.ts`

Recommended before PP-002 completion:

- journey-level sufficiency API tests for `DECIDE_EVIDENCE_SUFFICIENCY`,
- stale/rejected/re-request negative tests if DECISION-1 includes those states,
- client-safe evidence summary allowlist test,
- raw/internal/unreleased evidence leakage negative test,
- audit unavailable test on the canonical journey sufficiency decision path.

## DECISION-1 Required

Choose one:

- `APPROVE_PP002_FIRST_WAVE_CANONICALIZATION`
- `APPROVE_PP002_TESTS_ONLY_PROOF`
- `BLOCK_PP002_PENDING_POLICY_REWORK`

## Recommendation

Recommend: `APPROVE_PP002_FIRST_WAVE_CANONICALIZATION`.

This is the most aggressive cleanup path that is still safe. It uses the existing strong implementation, but it stops pretending that all evidence-related paths are equal. It makes one canonical sufficiency gate, demotes older/P44 and scattered document-review semantics into adapters/reference, and avoids another schema/API layer until proof says it is needed.

## Ticket Result

`SPEC-1` is finished. PP-002 is now at `DECISION-1`.

Implementation tasks `IMPL-1` through `IMPL-6` remain blocked until the human decision gate is accepted.

