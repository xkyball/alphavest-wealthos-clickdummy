# P44 Next Cleanup - Internal Draft Governance Spine

Generated: 2026-06-25

## Directive

`max`

Stop overloading `Recommendation.assumptionsJson` and `Recommendation.clientSummaryDraft` for internal draft governance. Replace them with first-class `InternalDraft`, `DraftClassification`, `UnsupportedClaim` and `DraftTrace` models.

## Implemented Breaking Slice

- Added first-class Prisma models and migration:
  - `InternalDraft`
  - `DraftClassification`
  - `UnsupportedClaim`
  - `DraftTrace`
- Migrated P44 Phase 5 internal draft creation, classification, unsupported-claim capture, reject, rebuild and trace mapping to the new models.
- Stopped demo seed and P44 Phase 6/7 command modules from writing internal draft governance into `Recommendation.assumptionsJson` / `Recommendation.clientSummaryDraft`.
- Added production mutation guard: `tests/internal-draft-governance-spine.spec.ts` fails if production recommendation mutations write either overloaded field again.
- Removed the legacy read fallback. Runtime and tests now require the canonical `InternalDraft` / `DraftClassification` / `UnsupportedClaim` / `DraftTrace` spine.

## Fallback Removal Status

Status: `REMOVED_IN_FAVOR_OF_CANONICAL_INTERNAL_DRAFT_SPINE`

- no production mutation writes `Recommendation.assumptionsJson` for draft governance;
- no production mutation writes `Recommendation.clientSummaryDraft` for draft governance;
- demo/runtime data uses equivalent rows in `internal_drafts`, `draft_classifications`, `unsupported_claims` and `draft_traces`;
- client/export projection tests pass without an env-flag compatibility path.

## Bold Recommendation

Delete the old columns in a later explicit destructive migration once all client-release summary needs have a named first-class home. Keeping the columns as "just in case" fields will recreate the same ambiguity under a nicer name.
