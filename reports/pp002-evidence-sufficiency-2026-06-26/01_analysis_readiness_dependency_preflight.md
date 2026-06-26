# PP-002 Analysis - Readiness & Dependency Preflight

Generated: 2026-06-26

Task: `ANALYSIS-1 PP-002 Evidence Sufficiency Readiness & Dependency Preflight`

Status: `COMPLETE_FOR_CURRENT_BASELINE`

## Facts

- Current branch is `full-workflow`.
- Working tree was clean before PP-002 report generation.
- `pnpm guard:source` passed with `violations: 0`.
- PP-001 is closed with `AUTHORIZE_PP002_SPECIFICATION_WITH_PP001_DEPENDENCIES` in `reports/pp001-identity-rbac-payload-2026-06-26/10_decision_pp002_readiness_gate.md`.
- Focused PP-002 proof validation passed: `pnpm playwright test tests/document-upload-api.spec.ts tests/evidence-review-api.spec.ts --workers=1` returned 16/16 passing.

## PP-001 Dependency Status

| Dependency | Current Status | Evidence |
|---|---|---|
| Actor/current-user context | Accepted for PP-002 specification | `tests/auth-spine.spec.ts`, PP-001 decision report |
| Tenant membership / cross-tenant denial | Accepted for PP-002 specification | `tests/auth-spine.spec.ts`, `tests/providerless-scope.spec.ts`, PP-001 decision report |
| Object/action scope | Accepted for PP-002 specification | `tests/providerless-scope.spec.ts`, `lib/permission-engine.ts`, `lib/control-layer/*` |
| Payload visibility matrix | Accepted for PP-002 specification | `lib/pp001-payload-visibility-contract.ts`, PP-001 payload tests |
| Admin non-bypass | Accepted for PP-002 specification | `tests/pp001-admin-audit-proof.spec.ts`, `tests/permission-engine.spec.ts` |
| Denied/sensitive audit | Accepted for PP-002 specification | `tests/pp001-admin-audit-proof.spec.ts`, `tests/audit-fail-closed.spec.ts`, `lib/audit-service.ts` |
| UX safety wording | Accepted as PP-001 convention | `tests/pp001-ux-safety-clarity.spec.ts`, `lib/no-overclaim-copy.ts` |

## Current PP-002 Code Reality

| Area | Current Evidence | Readiness |
|---|---|---|
| Upload-only candidate evidence | `/api/documents/upload`, `lib/document-upload-service.ts`, `tests/document-upload-api.spec.ts` | Strong first-wave proof. Upload creates document/version/extraction/evidence/audit rows, returns upload-only safety state, keeps `clientVisible=false`, evidence `CREATED`, visibility `INTERNAL_ONLY`, and export count unchanged. |
| Document evidence review | `/api/documents/review`, `lib/evidence-review-service.ts`, `tests/evidence-review-api.spec.ts` | Strong first-wave proof. Analyst review links evidence but does not unlock sufficiency/release/export/client visibility. Clarification creates insufficient state. |
| Compliance sufficiency acceptance | `lib/evidence-review-service.ts`, `lib/evidence-service.ts`, `tests/evidence-review-api.spec.ts` | Strong but bounded proof. Compliance can accept current/relevant/scoped/client-safe evidence for a document gate; this marks evidence `VALIDATED`/`REDACTED` but still reports no client release. |
| Journey-level sufficiency | `app/api/journeys/[id]/evidence-sufficiency/route.ts`, `lib/journeys/journey-api-service.ts`, `lib/journeys/journey-command-registry.ts` | Present and promising. The service supports `LINK_EVIDENCE`, `DECIDE_EVIDENCE_SUFFICIENCY`, persisted `EvidenceSufficiencyDecision`, requirement-level conditions, audit and fail-closed errors. Needs explicit PP-002 spec ownership before implementation expansion. |
| Schema support | `prisma/schema.prisma` | Present. Models/enums include `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceRecord`, `EvidenceItem`, `EvidenceSufficiencyDecision`, `ComplianceReview`, `AuditEvent`, `EvidenceStatus`, and `EvidenceSufficiencyDecisionStatus`. No migration is currently justified by ANALYSIS-1. |
| Client-safe projection | `lib/visibility-engine.ts`, `lib/control-layer/client-visibility.ts`, `tests/client-visibility-projection.spec.ts`, document upload reload assertions | Partial for PP-002. Uploaded raw/internal fields are hidden for client contexts, but PP-002 still needs a named evidence-summary allowlist and raw/internal/unreleased leakage negatives. |
| Export/release interaction | `tests/file-export-realism.spec.ts`, `tests/workflow-gate.spec.ts`, `lib/workflow-gate.ts` | Partial. Upload/export count checks exist and workflow gates understand evidence, but route/API export and client projection negatives remain broader than the current PP-002 first-wave proof. |
| Audit fail-closed | `lib/audit-service.ts`, `tests/document-upload-api.spec.ts`, `tests/evidence-review-api.spec.ts`, `tests/audit-fail-closed.spec.ts` | Strong first-wave proof for upload/review. Journey-level audit failure coverage needs to be made part of PP-002 spec/QA if DECISION-1 approves it. |
| UX no-overclaim wording | `components/client-intake-screen.tsx`, `components/internal-workflow-screen.tsx`, `components/ui/evidence-list.tsx`, tests with upload safety labels | Partial. Copy uses upload/review/gate language, but PP-002 should create a canonical evidence-state wording map rather than relying on scattered strings. |

## Existing Tests Mapped To Upload Questions

| Upload Question | Current Answer |
|---|---|
| Which tests prove upload/audit/invalid file/denied role/persistence? | `tests/document-upload-api.spec.ts` proves multipart persistence, version linkage, audit failure fail-closed, tenant isolation, invalid tenant/role, invalid file, missing type, denied role audit. |
| Which tests prove upload-not-sufficiency? | `tests/document-upload-api.spec.ts` asserts upload safety state and no export count change; `tests/evidence-review-api.spec.ts` proves review/link does not release; this is strong but should be formalized in PP-002 QA. |
| Which tests prove wrong-scope evidence? | `tests/evidence-review-api.spec.ts` blocks wrong-scope sufficiency acceptance and leaves document/evidence unmutated. |
| Which tests prove unreviewed/rejected/stale evidence? | Unreviewed/pending and clarification/insufficient are covered. Rejected and stale are not yet first-class PP-002 proof cases in the inspected first-wave tests. |
| Which tests prove client-safe evidence summary? | Document projection hides raw fields in client contexts, but a PP-002-specific client-safe evidence summary allowlist and leakage-negative suite is still needed. |
| Is sufficiency a status, service derivation, workflow gate or demo action? | It is currently both service-derived (`evidenceService`) and persisted for journeys (`EvidenceSufficiencyDecision`). Document review path stores review/link/evidence status, while journey path stores requirement-level decisions. PP-002 must choose the canonical first-wave contract. |

## Candidate Evidence State Taxonomy

Use this as SPEC-1 input, not final policy:

- `uploaded_candidate`
- `extraction_pending`
- `review_pending`
- `linked_not_sufficient`
- `insufficient`
- `rejected`
- `re_requested`
- `sufficient_for_scoped_gate`
- `client_safe_summary_available`

## Gaps And Risks

- There are two sufficiency centers: document-review sufficiency and journey requirement sufficiency. Keeping both without an explicit adapter will preserve legacy ambiguity.
- Rejection/re-request exists in older P44 evidence lifecycle code, but not yet as the canonical PP-002 MVP path.
- Stale evidence and full forbidden evidence payload leakage negatives are not yet complete PP-002 proof.
- Client-safe summary is currently represented through visibility/redaction/projection behavior, but PP-002 needs a named allowlist and field-level negative tests.
- Export/release route/API proof should remain downstream unless DECISION-1 explicitly includes it; otherwise PP-002 will expand into PP-004/PP-005.

## Recommendation

Recommend: `APPROVE_SPEC_1_WITH_FIRST_WAVE_CANONICALIZATION`.

The bold cleanup is to make the journey-level sufficiency contract canonical for PP-002 and treat the document-review path as an upload/review adapter feeding that contract. Do not add a new broad Evidence API yet. First retire ambiguity by specifying one canonical first-wave path:

1. Upload creates candidate evidence only.
2. Review/link moves evidence to linked but not sufficient.
3. Compliance can create an auditable target-scoped sufficiency decision only when review, link, relevance, scope, currentness and client-safe visibility conditions pass.
4. Client/export/release remain locked unless their own downstream gates pass.
5. Legacy/P44 evidence lifecycle code stays reference-only until a later consolidation ticket.

This removes old proof sprawl instead of covering it with another parallel model.

## Definition Of Done Check

| DoD Item | Result |
|---|---|
| PP-001 dependency requirements listed and classified | PASS |
| Relevant files / flows / artefacts identified | PASS |
| Existing proof slices and missing proof cases documented | PASS |
| Evidence status taxonomy candidates listed | PASS |
| Specification needs clear | PASS |
| Implementation split and CTES candidates inherited from upload | PASS |
| Open questions and risks explicit | PASS |

## Ticket Result

`ANALYSIS-1` is finished for the current baseline.

Next ticket in source order: `SPEC-1 PP-002 Evidence Sufficiency Proof Contract`.

