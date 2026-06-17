# Pixel Accuracy Tasks V3/V2

Date: 2026-06-15

## Completed AV-VISUAL Tasks

| ID | Severity | Result |
| --- | --- | --- |
| AV-VISUAL-001 | P0 | Shared surface/background classes and layout constants implemented. |
| AV-VISUAL-002 | P0 | Spec/demo chrome removed from visible shell UI and guarded by contract. |
| AV-VISUAL-003 | P1 | Shell geometry normalized through shared sidebar/topbar/page variables. |
| AV-VISUAL-004 | P1 | `visualMode` now drives deterministic `?state=` reference states. |
| AV-VISUAL-005 | P1 | Admin confirmation-modal composition and shell chrome improved. |
| AV-VISUAL-006 | P1 | Client and mobile surfaces normalized; mobile remains content-only. |
| AV-VISUAL-007 | P1 | Wealth-map graph composition adjusted; node overlap check is 0. |
| AV-VISUAL-008 | P1 | Internal/compliance/decision modal surfaces aligned to shared modal contract. |
| AV-VISUAL-009 | P2 | Export/Ops shell simplified and aligned with dense reference composition. |
| AV-VISUAL-010 | P1 | `scripts/visual-qa-contract.ts` and `pnpm visual:contract` added. |

## Acceptance Criteria Covered

- Correct UI boundary: guarded by source contract and route/state mapping.
- Correct background: shared surface classes applied by screen family.
- No spec/annotation chrome: `pnpm visual:contract` and browser DOM matrix check forbidden terms.
- Pixel-near composition: improved high-impact admin modal, mobile, wealth graph and export/ops shell composition.
- Stable navigation: shared `--sidebar-width`, `--topbar-height`, `--page-max-width` and shell grid.
- Responsive behavior: mobile content-only route preserved; shell layout remains grid-based at desktop.
- Central reuse: surface, state and visual contract logic centralized.

## Follow-Up Candidates

- Add a real Playwright visual screenshot runner once Playwright is installed in the repo.
- Add crop-aware pixel comparison for clean reference images.
- Expand DOM geometry checks from representative routes to all 63 catalogue pages.

