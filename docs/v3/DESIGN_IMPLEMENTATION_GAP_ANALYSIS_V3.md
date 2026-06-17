# Design Implementation Gap Analysis V3

Date: 2026-06-15

## Scope

This report records the AV-VISUAL-001 through AV-VISUAL-010 implementation pass. The goal was to move the current Next.js implementation closer to the clean page references while preserving a coherent AlphaVest design system and stable navigation geometry.

## Evidence Used

- Required project files: `AGENTS.md`, `CODEX_MASTER_TASK.md`, `docs/v3/CODEX_TASKS_DETAILED_V3.md`, `docs/v3/SCREEN_CATALOGUE_V3.md`, `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`, `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`, `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`, `docs/v3/DATA_MODEL_V3.md`, `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`.
- Visual reference directory: `public/reference/page_ui_v3/clean_pages/`.
- Runtime verification artifact: `artifacts/visual-qa/browser-dom-verification.json`.
- Contract verification artifact: `artifacts/visual-qa/visual-contract-result.json`.

## Implemented Gap Closures

| Task | Status | Evidence |
| --- | --- | --- |
| AV-VISUAL-001 Surface Background Contract | Implemented | Added shared `av-surface-*`, `av-shell-grid`, `av-topbar`, `av-page`, `av-page-wide` and graph-grid contracts in `app/globals.css`. |
| AV-VISUAL-002 Remove Spec/Demo Chrome | Implemented | Removed the visible Phase 05 implementation card from `components/sidebar.tsx`; live contract and DOM verification show no forbidden chrome leaks. |
| AV-VISUAL-003 Stable Unified Shell Geometry | Implemented | App, client, wealth, internal, governance and export/ops shells now share sidebar width/topbar/page-width variables. |
| AV-VISUAL-004 State-Specific Reference Routing | Implemented | Added `lib/visual-contract.ts` and `?state=` handling through the catch-all route; modal/drawer reference states are deterministic without visible demo toggles. |
| AV-VISUAL-005 Admin Pixel Pass | Implemented | Admin pages use the clean shell, no spec footer, and default second-confirmation modal state for PAGE-007/PAGE-010. |
| AV-VISUAL-006 Client Portal + Mobile Pixel Pass | Implemented | Client shell uses the shared surface; `/mobile` remains content-only and expands to the reference UI region without a decorative phone shell. |
| AV-VISUAL-007 Wealth Map Graph Composition | Implemented | Wealth graph uses the shared graph grid; node coordinates and node compactness were adjusted until DOM overlap count reached 0. |
| AV-VISUAL-008 Internal, Compliance, Decision Modal Fidelity | Implemented | Internal and governance shells now share stable shell geometry and surface background; modal widths/backdrops use the shared modal contract. |
| AV-VISUAL-009 Export/Ops Dense Data Screens | Implemented | Export/Ops shell uses shared geometry and removed the oversized sidebar policy card that was not part of the reference composition. |
| AV-VISUAL-010 Automated Visual QA Contract | Implemented | Added `pnpm visual:contract` covering all 63 routes/assets, state URLs and forbidden chrome terms. |

## Remaining Limitations

- The implementation is closer and contract-guarded, but not a full pixel-diff baseline.
- Browser screenshot capture through the in-app browser timed out on `Page.captureScreenshot`; DOM verification and route contract checks succeeded.
- Real persistence, production auth, production permission enforcement and full Playwright regression coverage remain deferred by the project phase model.

