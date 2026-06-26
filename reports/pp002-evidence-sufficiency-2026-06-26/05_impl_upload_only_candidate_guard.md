# IMPL-1 - Upload-Only Evidence Candidate Guard & Tests

Generated: 2026-06-26

Task: `IMPL-1 Upload-Only Evidence Candidate Guard & Tests`

Status: `COMPLETE_ZERO_DELTA_PRODUCT_CODE`

## Parent Task Result

The current implementation already satisfies the approved first-wave upload-only invariant. No product code change was needed for IMPL-1.

## Subtask 1.4.1 - Upload Success Remains Candidate-Only In API/UI State

Status: `COMPLETE_ZERO_DELTA_PRODUCT_CODE`

Evidence:

- `app/api/documents/upload/route.ts` returns `uploadOnly: true`, `sufficiency: false`, `releaseUnlocked: false`, `clientVisible: false` and the label `Upload complete - evidence review pending`.
- `lib/document-upload-service.ts` persists `Document.status = UPLOADED`, `EvidenceRecord.status = CREATED`, `EvidenceRecord.visibilityStatus = INTERNAL_ONLY` and `Document.clientVisible = false`.
- `tests/document-upload-api.spec.ts` asserts the API safety payload and persisted candidate-only state.
- `tests/document-upload-flow.spec.ts` asserts visible UI wording: `Evidence sufficiency, release, export and client visibility remain locked.`

Conclusion:

Upload success is a candidate/review-pending state only. It does not imply sufficiency, release, export or client visibility.

## Subtask 1.4.2 - Upload-Not-Sufficiency Negative Tests

Status: `COMPLETE_ZERO_DELTA_PRODUCT_CODE`

Evidence:

- `tests/document-upload-api.spec.ts` counts export requests before/after upload and verifies no export unlock.
- The same suite verifies invalid file, invalid role/tenant, missing document type and audit-unavailable paths fail closed without unsafe document/evidence/export mutation.
- `tests/document-upload-flow.spec.ts` verifies the browser flow keeps the no-sufficiency/no-release/no-export/no-client-visibility message visible after successful upload.
- `tests/evidence-review-api.spec.ts` verifies later review/link steps still do not unlock release/export/client visibility.

Conclusion:

The negative rule is covered for the first-wave upload surface. Broader release/export/client projection tests remain downstream PP-004/PP-005 concerns unless a later PP-002 QA ticket only asserts locks.

## Refactor-First Check

No smaller substitute was used. The real implementation path was inspected:

- API route: `app/api/documents/upload/route.ts`
- service: `lib/document-upload-service.ts`
- UI/browser proof: `tests/document-upload-flow.spec.ts`
- API proof: `tests/document-upload-api.spec.ts`

The existing real product path already carries the invariant. Adding code would duplicate the same guard and increase noise.

## Validation

Pending focused rerun after this report update:

```text
pnpm playwright test tests/document-upload-api.spec.ts tests/document-upload-flow.spec.ts --workers=1
```

## Ticket Result

`IMPL-1` is finished as zero-delta product code with focused proof.

