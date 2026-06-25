# AV27 Phase 3 Execution Report - Evidence and Document Lifecycle Closure

Date: 2026-06-25
Branch: `full-workflow`
Baseline commit: `76ffae6 feat: close av27 phase 2 client context`
Task source: `/Users/chris/Downloads/alphavest/ALPHAVEST_27_STRONG_SLICES_BOC_CTES_DELIVERY_CHAIN_TASK_MASTER_INDEX.md`
Expanded task source: `/Users/chris/Downloads/alphavest/ALPHAVEST_27_STRONG_SLICES_BOC_CTES_DELIVERY_CHAIN_TASK_MASTER.md`
Phase source: `EPIC-P3 - Phase 3: Evidence and Document Lifecycle Closure`
Safety authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

## Preflight

- `git status --short`: clean before changes.
- `git branch --show-current`: `full-workflow`.
- `git log -1 --oneline`: `76ffae6 feat: close av27 phase 2 client context`.
- `git diff --stat`: no output before changes.
- `cat package.json`: scripts verified; `guard:source`, `lint`, `typecheck`, `playwright`, DB and phase scripts present.
- Route registry inspected: `lib/route-registry.ts`.
- Target seams inspected: `app/api/documents/upload/route.ts`, `app/api/documents/route.ts`, `app/api/documents/review/route.ts`, `components/client-intake-screen.tsx`, `lib/document-upload-service.ts`, `lib/evidence-review-service.ts`, `lib/visibility-engine.ts`, Prisma `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `AuditEvent`.
- `pnpm guard:source`: PASS, 0 violations.

## Extracted Phase 3 Tickets

### AV27-P3-T01-A/S/I/Q - Client upload lifecycle hardening

Detailed description: Harden upload UI/API/service/DB/audit/reload lifecycle. A valid upload must create document, version, extraction, evidence and audit proof. Invalid file, role or scope must fail closed and deny/audit where required.
Execution: Existing upload lifecycle was present. This run preserved it and expanded proof around version metadata and client-safe upload response shape.
Status: Complete.

### AV27-P3-T02-A/S/I/Q - Document versioning and checksum proof

Detailed description: Prove document version model usage and display/reload behavior. A new version must be linked to its document; orphan or wrong-document versions must be denied.
Execution: Added version metadata to upload/list mapping, showed version count/number in upload and review UI, kept checksum proof internal, and added DB proof that orphan versions cannot be created.
Status: Complete.

### AV27-P3-T03-A/S/I/Q - Extraction review lifecycle

Detailed description: Review UI/API/service/state/audit lifecycle. Analyst review must update extraction/review state. Low-confidence or unreviewed extraction cannot unlock sufficiency.
Execution: Existing review service and API already separated mark-reviewed, clarification and compliance sufficiency actions. Browser and API proof now also show version proof in review context.
Status: Complete.

### AV27-P3-T04-A/S/I/Q - Evidence linking lifecycle

Detailed description: Link evidence to object, recommendation or decision. Linked evidence must appear in target context; wrong-object, stale or unlinked evidence must be ignored.
Execution: Existing evidence records link to document IDs, and workflow tests prove stale/unlinked/internal-only evidence does not satisfy gates. This run preserved and revalidated those gates.
Status: Complete.

### AV27-P3-T05-A/S/I/Q - Evidence sufficiency decision

Detailed description: Enforce sufficiency state with preconditions. Reviewed, linked, relevant evidence can mark sufficient; upload-only evidence cannot mark sufficient.
Execution: Existing compliance-only sufficiency checks were revalidated. Analyst upload/review cannot unlock sufficiency, and upload-created evidence remains review-pending.
Status: Complete.

### AV27-P3-T06-A/S/I/Q - Evidence client-safe summary projection

Detailed description: Expose only redacted/safe evidence projection. Client sees released/safe summary only; raw/internal/unreleased evidence remains hidden.
Execution: Sanitized upload response so raw checksum, storage key and internal evidence item IDs are not returned. Version number/count are allowed safe metadata; latest checksum remains forbidden and hidden in client projections.
Status: Complete.

## Changed Files

- `app/api/documents/upload/route.ts`
- `components/client-intake-screen.tsx`
- `lib/document-upload-service.ts`
- `lib/visibility-engine.ts`
- `tests/document-upload-api.spec.ts`
- `tests/document-upload-flow.spec.ts`
- `docs/00-current/av27-phase3/PHASE3_EXECUTION_REPORT.md`
- `artifacts/av27-phase3/document-upload-version-proof.png`
- `artifacts/av27-phase3/document-review-version-proof.png`

## Validation

- `pnpm guard:source`: PASS.
- `pnpm typecheck`: PASS.
- `pnpm lint`: PASS with 22 pre-existing warnings, 0 errors. One parallel run hit an ESLint `test-results` ENOENT race while Playwright was deleting the folder; sequential rerun passed.
- `pnpm playwright test tests/document-upload-api.spec.ts tests/evidence-review-api.spec.ts tests/workflow-gate.spec.ts tests/true-ux-client-projection.spec.ts --workers=1`: PASS, 42/42.
- `PLAYWRIGHT_PORT=3036 pnpm playwright test tests/document-upload-flow.spec.ts --workers=1`: PASS, 5/5.

## Safety Proof

- No new route created.
- No route reclassification.
- No schema migration.
- No screen/image/state-screen generation.
- Upload response no longer returns raw `storageKey`, `checksum`, `documentEvidenceItemId` or `auditEvidenceItemId`.
- Client-safe document projection allows `latestVersionNumber` and `versionCount`, but forbids `latestVersionChecksum`.
- Upload success still means extraction pending and review required; it does not imply sufficiency, release, export, advice or client visibility.
- Analyst review remains separate from compliance sufficiency acceptance.

## Screenshots

- `artifacts/av27-phase3/document-upload-version-proof.png`: upload status card with persisted file name, version metadata and internal-checksum wording.
- `artifacts/av27-phase3/document-review-version-proof.png`: extraction review card with the same version proof and sufficiency controls.

## Bold Cleanup Recommendations

- Remove fail-closed hidden placeholder rows from client document list responses and return only visible safe rows plus explicit `hiddenRowsDisclosed: false`. The current hidden placeholder objects are safe, but they preserve legacy table-shape thinking and complicate UI guards.
- Promote `DocumentVersion` from passive proof row to first-class read model with explicit current-version selection, version history and superseded-state tests. This would retire scattered fallback logic from `document.checksum`.
- Split upload response contracts into `internalUploadResult` and `clientUploadProjection` types so future code cannot accidentally spread service internals into API JSON.
- Replace old demo-role source-document exception with a named evidence-request projection policy. Family CFO upload visibility should be tied to an active evidence request, not just the role plus `UPLOADED` status.

## Method Compliance

- Engine mix applied: V2 execution discipline with V3 proof pressure.
- Facts: Phase 3 source required upload, versioning, extraction review, evidence linking, sufficiency and client-safe projection closure.
- Assumptions: No schema migration authorized; existing Prisma relations and current routes remain operative.
- Chosen move: close real lifecycle/projection gaps, avoid cosmetic copy-only substitutions, and validate with API, service and browser proof.
- Killed branch: exposing checksum in client-safe upload UI/API was rejected as a projection leak.
- Limitation: This closes Phase 3 lifecycle proof for current upload/review surfaces; it does not implement a full document version-history screen.
