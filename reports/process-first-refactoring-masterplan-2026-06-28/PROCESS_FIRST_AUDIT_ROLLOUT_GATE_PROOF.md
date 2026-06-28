# Process-First Audit Rollout Gate Proof

Date: 2026-06-28
Slice: Audit-Rollout Gate before further UI work
Decision: Retire legacy capture QA and strict visual capture as release evidence; make operational screenshot audit the release gate.

## Ticket Execution

1. Retired legacy capture gates.
   - Deleted `scripts/capture-qa-contract.ts`.
   - Deleted `scripts/strict-visual-capture.ts`.
   - Deleted `tests/capture-qa-contract.spec.ts`.
   - Removed `visual:capture-qa`, `visual:capture-qa:release` and `visual:strict` from `package.json`.

2. Kept route/modal capture generation outside the rollout.
   - `scripts/capture-routes-and-modals.ts` remains a capture generator.
   - The script no longer imports or runs the deleted capture QA contract.

3. Promoted operational screenshot audit to release evidence.
   - `release:contract-check` now runs `pnpm visual:audit-operational`.
   - `lib/contract-fulfillment-gate.ts` now fails when legacy capture QA or strict visual capture fragments reappear.
   - `lib/ux-contract-ledger.ts` now records `operational_visual_audit` / `screenshot_audit` as the proof family.

4. Updated stale route-smoke contracts uncovered by the release gate.
   - `/advisory/review-queue` now asserts the process-first worksurface and queue contract instead of the old `Consultant Workbench` H2 string.
   - `/export/demo/redaction` remains D3 table-first, but the route-smoke contract now accepts the intentional absence of fake D3 filter controls.
   - `/export/demo/redaction` now asserts the current blocker copy `Preview inspection must pass before approval can be recorded.` instead of the retired `Approval blocked until preview`.

5. Restored the registered DSF-004 debt marker through a canonical control.
   - `components/decisions-governance-screen.tsx` now uses `FilterBar` for the evidence workbench disabled-static filter surface.
   - The temporary exception remains explicit through `data-ux-e10-filter-exception-id="DSF-004"` until E10-I2 migration closes it.

## Validation

- `pnpm exec tsc --noEmit --pretty false` passed.
- `pnpm exec playwright test tests/e10-register-reconciliation.spec.ts --workers=1 --reporter=line` passed: 6/6.
- `pnpm exec playwright test tests/route-smoke.spec.ts -g "renders product context|056 /export/demo/redaction applies D3|/export/demo/redaction keeps export lifecycle" --workers=1 --reporter=line` passed: 3/3.
- `pnpm release:contract-check` passed:
  - `pnpm guard:source`
  - `pnpm test:contract-fulfillment`
  - focused ledger / E09 / E10 / E11 / E06 Playwright block: 34/34
  - `pnpm test:route-smoke`: 180/180
  - `pnpm visual:audit-operational`: 4/4

## Screenshot Proof

Operational visual audit screenshots were captured at 1400x900:

- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/audited-1400x900/advisor-reviews.png`
- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/audited-1400x900/compliance-reviews.png`
- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/audited-1400x900/export-redaction.png`
- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/audited-1400x900/governance-access-request.png`

## Result

Legacy capture QA is retired, the release contract is now operational-screenshot-audit backed, and stale route-smoke checks no longer force retired internal workflow copy back into the UI.
