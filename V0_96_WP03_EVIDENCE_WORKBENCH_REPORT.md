# V0.96 WP-03 Evidence Workbench Report

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Companion task source: `/Users/chris/Downloads/ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md`

Status: `ACCEPTED_WITH_PROOF`

Date: 2026-06-23

## Scope

WP-03 asked for the evidence lifecycle to behave as a real workbench: upload remains intake only, review/link/sufficiency stay separate, insufficient evidence has recovery, and client visibility/export/release remain blocked until their own gates pass.

This slice did not add schema, route creation, upload-to-release shortcuts, client-visible raw evidence, or bypasses around permission/audit checks.

## Classification

Initial WP-00 classification: `PARTIAL`

Post-slice classification: `PARTIAL_WITH_TARGETED_IMPLEMENTATION`

Reason: the repo already had multipart upload, evidence records, extraction review, sufficiency checks, audit writes, fail-closed permissions and no-release assertions. WP-03 needed an explicit lifecycle taxonomy exposed through API/UI so pending, insufficient, linked and sufficient states are not inferred from scattered raw enum labels.

## Changed Files

| File | Change |
| --- | --- |
| `lib/evidence-service.ts` | Added `EvidenceLifecycleStatus` taxonomy and `evidenceLifecycleStatusForDocument`. |
| `lib/document-upload-service.ts` | Projects lifecycle status on uploaded document list items. |
| `lib/evidence-review-service.ts` | Returns lifecycle status from review and sufficiency actions. |
| `app/api/documents/upload/route.ts` | Adds lifecycle status to upload safety envelope. |
| `components/client-intake-screen.tsx` | Shows lifecycle labels in upload/review UI and adds request-clarification review action. |
| `tests/document-upload-api.spec.ts` | Asserts upload-only lifecycle status and no release/export/client visibility. |
| `tests/evidence-review-api.spec.ts` | Adds linked/sufficient/insufficient lifecycle assertions and clarification negative path. |
| `tests/document-upload-flow.spec.ts` | Adds visible lifecycle assertions for extraction-pending, insufficient and sufficient states. |
| `V0_96_WP03_EVIDENCE_WORKBENCH_REPORT.md` | Added this execution report. |

## Inspected Files

- `components/client-intake-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ui/state-panel.tsx`
- `app/api/documents/route.ts`
- `app/api/documents/upload/route.ts`
- `app/api/documents/review/route.ts`
- `lib/document-upload-service.ts`
- `lib/evidence-review-service.ts`
- `lib/evidence-service.ts`
- `lib/visibility-engine.ts`
- `tests/document-upload-api.spec.ts`
- `tests/document-upload-flow.spec.ts`
- `tests/evidence-review-api.spec.ts`
- `tests/ui-state-boundaries.spec.ts`

## Acceptance Results

| Criterion | Result |
| --- | --- |
| Upload success does not unlock release, client visibility or export | `PASS` |
| Evidence cannot be sufficient without review, link, relevance and scope | `PASS` |
| Wrong-role and wrong-scope review actions deny or block without leaking/mutating | `PASS` |
| UI states are honest and no-overclaim | `PASS` |
| Pending, insufficient, linked and sufficient states render from API state | `PASS` |

## Lifecycle Taxonomy

The new API/UI taxonomy is:

- `uploaded`
- `extraction_pending`
- `review_pending`
- `insufficient`
- `rejected`
- `linked`
- `sufficient`

The current Prisma model has no dedicated rejected evidence enum; `rejected` maps from blocked document state. Evidence insufficiency maps from `NEEDS_CLARIFICATION` or restricted evidence state.

## Proof

Focused proof for this slice:

- `pnpm test:document-upload-api`
- `pnpm exec playwright test tests/evidence-review-api.spec.ts`
- `pnpm test:document-upload-flow`

Regression proof:

- `pnpm typecheck`
- `pnpm test:route-smoke`

Lint proof:

- Initial concurrent `pnpm lint` run hit transient `ENOENT` on `test-results` while Route-Smoke was running.
- Final sequential `pnpm lint` passed with the existing 30 warnings.

## Screenshot

Local screenshot proof:

- `artifacts/v0-96/wp03-evidence-lifecycle-insufficient.png`

The screenshot shows the review queue after requesting clarification, with `Lifecycle: Insufficient` visible and release/export/client visibility still locked.

## Deviations

- No schema migration was added because the existing enums and service layer already support the needed workflow semantics.
- The screenshot artifact is local QA evidence and not part of the committed code scope unless explicitly force-added later.

## Next Recommended Work Package

Proceed to `WP-04 — Analyst Workbench + AI Draft Internal Review`.
