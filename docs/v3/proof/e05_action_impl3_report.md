# E05 IMPL-E05-3 Action Separation Report

## Ticket

`IMPL-E05-3` - Separate approval, release, block, evidence request, export and download actions.

## Source

- Upload: `/Users/chris/Downloads/alphavest/ALPHAVEST_OVERARCHING_UX_BOC_TICKET_ARCHITECTURE_CTES.md`
- Epic: `E05 - Action hierarchy and CTA normalization`
- Approved gate: `APPROVE_E05_CANONICAL_ACTION_HIERARCHY_CONTRACT`

## Implementation

- Projected canonical E05 action metadata onto compliance decision controls in `components/internal-workflow-screen.tsx`.
- Separated compliance meanings:
  - `request_evidence` for evidence request.
  - `block` for keep-blocked action.
  - `release` for release-blocked status and final release modal action.
- Projected canonical E05 action metadata onto export preview and download controls in `components/communication-export-ops-screen.tsx`.
- Separated export meanings:
  - `export_approval` for approval trigger and approval modal submit.
  - `download` for download trigger and download modal submit.
  - `share` for the disabled secure-share control.
- Preserved existing lifecycle attributes while adding the canonical action hierarchy attributes from `lib/ux-action-hierarchy-contract.ts`.

## Proof

- Added `tests/e05-action-separation.spec.ts` to assert runtime separation across compliance release, evidence request, block, export approval, download and share actions.
- Verified high-risk workflow actions no longer rely on ambiguous primary/secondary CTA semantics alone.
- Verified blocked and disabled actions expose canonical availability and disabled reason attributes.

## Validation

- `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3020 ./node_modules/.bin/playwright test tests/e05-action-separation.spec.ts` - PASS, 2 passed.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 ./node_modules/.bin/playwright test tests/ux-action-hierarchy-contract.spec.ts` - PASS, 5 passed.
- `./node_modules/.bin/tsc --noEmit` - PASS.
- `./node_modules/.bin/tsx scripts/source-target-guard.ts` - PASS.

## Notes

- No new visual layout was introduced in this ticket; no screenshot was warranted for `IMPL-E05-3`.
- A broad export lifecycle run was intentionally not used as the acceptance gate for this ticket after pnpm generated an approve-builds placeholder file during that path. The focused E05 runtime test exercises the affected controls without that setup side effect.
