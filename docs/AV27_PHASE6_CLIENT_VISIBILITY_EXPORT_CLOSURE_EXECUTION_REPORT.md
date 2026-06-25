# AV27 Phase 6 Client Visibility, AI Internal-Only and Export Closure

Source:
`/Users/chris/Downloads/alphavest/ALPHAVEST_27_STRONG_SLICES_BOC_CTES_DELIVERY_CHAIN_TASK_MASTER_INDEX.md`

Execution date: 2026-06-25

## Preflight

- Target branch: `full-workflow`
- Baseline commit: `96c8d72 refactor: rename advisor approval workflow`
- Working tree before edits: clean
- `pnpm guard:source`: PASS
- True-UX boundary applied: no new route, no schema migration, no screen/image/state-screen generation, no client-visible internal payload, no export shortcut.

## Phase 6 Extract

Epic: `EPIC-P6 - Phase 6: Client Visibility, AI Internal-Only and Export Closure`

Purpose:
Close client visibility, AI internal-only and export payload boundaries after Phase 5 release/decision semantics, Phase 3 evidence lifecycle and Phase 1 safety controls.

Scope:
- Foundation tasks: `P6-T01`, `P6-T02`, `P6-T03`, `P6-T04`, `P6-T05`
- Child chain for each foundation item: Analysis, Specification, Implementation, QA
- Proof layers: route/UI action evidence, interaction lifecycle evidence, API/service execution evidence, DB/durable state transition evidence, workflow/gate semantics, safety proof and positive/negative test proof.

Out of scope:
- No blind schema replacement.
- No route-scope reclassification.
- No direct client-visible AI/rules draft.
- No export package from preview or forbidden payload.
- No false full-slice claim without QA evidence.

## Ticket Register And Execution

### P6-T01 - AI/rules draft internal-only redaction

Process IDs: `E-006`

Foundation required output:
Identify draft/internal fields and exclude them from client/API/export payloads.

Positive acceptance:
Internal users can see draft where allowed.

Negative acceptance:
Client/export/API never receives AI draft/internal rationale.

Child tickets:
- `AV27-P6-T01-A`: Analysis. Evidence found in `lib/visibility-engine.ts`, `lib/journeys/journey-api-service.ts`, `lib/export-service.ts`, `lib/export-workflow-command-service.ts`, and existing projection/export tests. Gap: forbidden payload fields were spread across services.
- `AV27-P6-T01-S`: Specification. Centralize the forbidden and allowed field contract; preserve internal-role visibility; fail closed for client/export/API.
- `AV27-P6-T01-I`: Implementation. Added `lib/av27-phase6-payload-contract.ts` and wired Visibility/Export services to it.
- `AV27-P6-T01-Q`: QA. `tests/av27-phase6-payload-sweep.spec.ts` proves internal draft visibility for internal roles and client/export exclusion for unsafe fields.

Status: Done.

### P6-T02 - Released client portal projection

Process IDs: `H-001`

Foundation required output:
Portal/mobile client-safe payload derivation.

Positive acceptance:
Released safe content appears.

Negative acceptance:
Unreleased/internal content is hidden or redacted.

Child tickets:
- `AV27-P6-T02-A`: Analysis. Existing client projection surfaces and tests already route through the visibility engine.
- `AV27-P6-T02-S`: Specification. Client payloads must be derived from released projection outputs only.
- `AV27-P6-T02-I`: Implementation. The P6 contract now backs allowed projection fields and forbidden fields.
- `AV27-P6-T02-Q`: QA. Existing True-UX client projection tests plus the AV27 P6 test prove released-only projection.

Status: Done.

### P6-T03 - Client-safe summary

Process IDs: `H-003`

Foundation required output:
Summary generated from released decision/evidence only.

Positive acceptance:
Client sees understandable safe summary.

Negative acceptance:
Summary cannot include compliance notes/internal drafts.

Child tickets:
- `AV27-P6-T03-A`: Analysis. `clientSummary` is the only summary field allowed into client/API/export payloads; `clientSummaryDraft`, internal rationale and compliance notes are forbidden.
- `AV27-P6-T03-S`: Specification. Client-safe summary is release-derived, not draft-derived.
- `AV27-P6-T03-I`: Implementation. The contract inspector accepts `clientSummary` and rejects draft/internal summary fields.
- `AV27-P6-T03-Q`: QA. Targeted P6 test validates safe and unsafe summary payloads.

Status: Done.

### P6-T04 - Forbidden payload exclusion in export

Process IDs: `J-009`

Foundation required output:
Export scan/redaction boundary across generated package.

Positive acceptance:
Export contains scoped, redacted, approved content.

Negative acceptance:
Forbidden internal payload fails generation or is excluded.

Child tickets:
- `AV27-P6-T04-A`: Analysis. Export validation existed but used a local classification list.
- `AV27-P6-T04-S`: Specification. Export payload inspection must use the same AV27 P6 field contract as client projection.
- `AV27-P6-T04-I`: Implementation. `lib/export-service.ts` and `lib/export-workflow-command-service.ts` now use the AV27 P6 contract and allowlist.
- `AV27-P6-T04-Q`: QA. Export safety, file export realism and export scope/redaction tests prove forbidden payload rejection.

Status: Done.

### P6-T05 - Payload sweep tests

Process IDs: `H/E/J cross-cutting`

Foundation required output:
API, UI and export payload test matrix.

Positive acceptance:
Allowed payloads included.

Negative acceptance:
AI draft, compliance notes, internal rationale and unreleased evidence absent everywhere.

Child tickets:
- `AV27-P6-T05-A`: Analysis. A cross-surface sweep was missing as one explicit AV27 Phase 6 matrix.
- `AV27-P6-T05-S`: Specification. The matrix must cover API, UI and export surfaces with one ordered ticket register.
- `AV27-P6-T05-I`: Implementation. Added `sweepAv27Phase6PayloadSurfaces` and `tests/av27-phase6-payload-sweep.spec.ts`.
- `AV27-P6-T05-Q`: QA. Full P6 payload sweep verifies allowed fields and forbidden fields across surfaces.

Status: Done.

## Changed Files

- `lib/av27-phase6-payload-contract.ts`
- `lib/visibility-engine.ts`
- `lib/export-service.ts`
- `lib/export-workflow-command-service.ts`
- `tests/av27-phase6-payload-sweep.spec.ts`
- `docs/AV27_PHASE6_CLIENT_VISIBILITY_EXPORT_CLOSURE_EXECUTION_REPORT.md`

## Proof

Targeted proof already run:
- `pnpm guard:source`
- `pnpm playwright test tests/av27-phase6-payload-sweep.spec.ts --workers=1`
- `pnpm playwright test tests/true-ux-client-projection.spec.ts tests/client-visibility-projection.spec.ts --workers=1`
- `pnpm playwright test tests/av27-phase6-payload-sweep.spec.ts --grep "AV27-P6-T03" --workers=1`
- `pnpm playwright test tests/export-safety.spec.ts tests/file-export-realism.spec.ts tests/true-ux-export-scope-redaction-approval.spec.ts --workers=1`
- `pnpm phase:check`

Final validation:
- `pnpm phase:check`: PASS
- Known residual output: existing lint warnings for unused symbols in unrelated pre-existing files and known Turbopack/NFT warnings around `lib/document-storage-adapter.ts`.

No UI code changed, so no screenshot proof is required for this execution slice.

## No-Generation And Safety

- No image generation.
- No state-screen generation.
- No screen asset generation.
- No schema migration.
- No route-scope change.
- No admin, advisor, compliance, evidence, visibility or export gate was weakened.
