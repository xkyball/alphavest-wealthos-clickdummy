# V2 Visual Reference Coverage Report

Date: 2026-06-14

## Asset Inventory

All 56 v2 visual PNG files listed in `docs/v2/VISUAL_ASSET_MANIFEST_V2.md` are present in `public/reference/visuals_v2/`.

| Folder | IDs | Status |
|---|---|---|
| `client` | V2-001 to V2-025 | Present and registered |
| `internal` | V2-026 to V2-037 | Present and registered |
| `governance` | V2-038 to V2-042 | Present and registered |
| `states` | V2-043, V2-054 to V2-056 | Present and registered |
| `communication` | V2-044 to V2-047 | Present and registered |
| `service-blueprint` | V2-048 to V2-050 | Present and registered |
| `planning` | V2-051 to V2-053 | Present and registered |

## Interpretation Coverage

The visual interpretation rule is enforced through:

- `AGENTS.md`;
- `docs/v2/VISUAL_INTERPRETATION_RULES_V2.md`;
- `lib/surface-registry.ts`;
- `docs/v2/SURFACE_REGISTRY_V2.md`;
- `tests/v2-surface-contracts.test.mjs`;
- `tests/phase9-final-handoff.test.mjs`.

## Surface Decisions

Product routes:

- client mobile/upload/dashboard/map/actions;
- decision room as modal-style workflow;
- internal signals/workbench/advisor/compliance/governance/communication.

Focused surfaces:

- wealth map drawers;
- action detail drawer;
- evidence preview/restricted/missing overlays;
- governance role drawer and second confirmation modal;
- communication client preview overlay.

Reference/logic-only inputs:

- permission matrix reference;
- service blueprint/evidence chain/escalation boards;
- roadmap/dependency boards;
- state chip and state-machine references;
- evidence/audit mapping reference.

## Known Gaps

No pixel-perfect screenshot comparison is included. Current coverage is source, registry, model and route smoke coverage.

