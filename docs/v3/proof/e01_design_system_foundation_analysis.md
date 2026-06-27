# E01 Design-System Foundation Analysis

Date: 2026-06-27

## Ticket

`E01-A1` - Inventory current UI primitives and token usage.

## Source And Boundary

- Upload: `/tmp/codex-remote-attachments/019f0884-6dd5-7652-a2e1-ffb8b2b20574/E5F26AEB-4053-43F1-B60E-D555B7A91323/1-ALPHAVEST_OVERARCHING_UX_BOC_IMPLEMENTATION_TASK_ARCHITECTURE_CTES_v2.md`
- Extracted epic: `E01 - Design-System Implementation Foundation`
- Repo authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- E00 rule: `docs/ux/ALPHAVEST_E00_IMPLEMENTATION_FIRST_RULES.md`
- E00 decision: `APPROVE_E00_OPTION_A_PROOF_REVIEWER_MODE_DEFAULT`
- Baseline commit: `9f39f52 docs: close e00 proof mode decision`
- Source guard: `pnpm guard:source` - PASS, 0 violations

This ticket is analysis-only. It does not authorize route-specific redesign, product scope expansion, new routes, generated visual assets, schema/API work or proof/debug scaffolding in default operational UI.

## Moving Baseline Preflight

| Check | Result |
| --- | --- |
| `git status --short` | Clean before E01 edits |
| `git branch --show-current` | `full-workflow` |
| `git log -1 --oneline` | `9f39f52 docs: close e00 proof mode decision` |
| `git diff --stat` | No pre-existing diff before E01 edits |
| `package.json` | Scripts verified, including `guard:source`, `typecheck`, `lint`, `test:route-smoke`, `test:source-reality`, `test:playwright`, `visual:capture-routes` and `phase:check` |
| Route registry | `lib/route-registry.ts` exists and remains authoritative for route scope |
| Test inventory | `tests/` includes True-UX density/a11y/shared primitive, lifecycle, data-surface and route-smoke coverage |

## Extracted E01 Chain

| Order | Ticket | Type | Current Handling |
| --- | --- | --- | --- |
| 1 | `E01-A1` | Analysis / Research / Spike | Executed in this report |
| 2 | `E01-S1` | Specification / Design / Acceptance Criteria | Enabled by this report |
| 3 | `E01-I1` | Implementation | Blocked until `E01-S1` |
| 4 | `E01-I2` | Implementation | Blocked until `E01-S1` |
| 5 | `E01-I3` | Implementation | Blocked until `E01-S1` |
| 6 | `E01-Q1` | QA / Validation / Review | Blocked until implementation |

## Current Shared Primitive Inventory

| Area | Current Files | Current Reality |
| --- | --- | --- |
| Global tokens and shared classes | `app/globals.css` | Defines AlphaVest color tokens, font tokens and a small set of layout variables, but lacks explicit E01 density, text-role, radius, focus and status-semantic token families. |
| Status/badge primitives | `components/ui/badge.tsx`, `components/ui/status-chip.tsx`, `components/ui/workflow-badge.tsx` | Static badges are reusable and non-interactive. Status/workflow badges use icons plus labels, but their semantic family/severity metadata is local to each component rather than projected from one design-system contract. |
| State primitive | `components/ui/state-panel.tsx` | Already projects E04 lifecycle state metadata through `lib/ux-lifecycle-state-contract.ts`. It needs E01 design-system styling/semantic attributes so state panels can share density and status treatment with badges. |
| Accessibility status | `components/ui/a11y-status.tsx` | Provides sr-only keyboard/status proof. It is useful but should remain proof/support metadata, not default visual proof scaffolding. |
| Layout primitives | `components/ui/card.tsx`, `components/ui/metric-card.tsx`, `components/page-header.tsx`, `components/app-shell.tsx` | Cards and headers use local Tailwind class stacks and global CSS variables. They need shared design-system variables rather than route-specific spacing overrides. |
| Data and work surfaces | `components/ui/data-table.tsx`, `components/ui/filter-bar.tsx`, `components/ui/master-detail-surface.tsx`, `components/ui/kanban.tsx` | E06/E07-style typed contracts already exist for data-surface density and metadata. E01 should not duplicate them; it should supply lower-level visual tokens and primitive semantics. |
| Export surface | `components/ui/index.ts` | Exports most shared primitives, but misses `a11y-status` and `disabled-control-reason`, and does not expose a central E01 design-system contract. |

## Existing Token Coverage

Current `app/globals.css` covers:

- AlphaVest color palette.
- `--font-sans` and `--font-display`.
- shell width and topbar height.
- page max widths.
- card radius/padding.
- table row heights.
- field, modal, drawer, chip and button dimensions.
- basic panel/card/surface classes.

Missing or under-specified token groups:

- Named density modes for compact/default/comfortable surfaces.
- Named text roles for eyebrow, heading, body, metadata and caption text.
- Non-color status semantic tokens for info/success/warning/critical/neutral families.
- Shared focus ring and selected/active treatment.
- State panel padding/gap variables aligned to badge/table/card density.
- Stable runtime attributes that identify E01 primitive family, density and semantic status.

## Test Reality

Current relevant tests:

- `tests/true-ux-density.spec.ts` validates route-level density metadata and representative runtime density.
- `tests/true-ux-a11y.spec.ts` validates keyboard/status support and absence of visible proof panels.
- `tests/true-ux-shared-primitives.spec.ts` validates modal/drawer/table/action/state primitive source contracts.
- `tests/ux-lifecycle-state-contract.spec.ts` validates StatePanel state taxonomy and metadata.
- `tests/ux-data-surface-contract.spec.ts` validates data-surface density and row-action metadata.
- `tests/route-smoke.spec.ts` validates route-level density and registered route behavior.

Gap: there is no focused E01 design-system foundation test that verifies global token presence, primitive export stability, non-color semantic status attributes and shared primitive adoption.

## Gap Classification

| Gap | Category | Recommended Handling |
| --- | --- | --- |
| No E01 design-system contract file | Component API / test gap | Add a narrow `lib/ux-design-system-foundation.ts` for density, text roles and semantic status metadata. |
| Global CSS has dimensions but not named E01 density/text/status variables | Token gap | Add explicit CSS variables and utility classes in `app/globals.css`; avoid route-specific CSS. |
| Badge/status/workflow/state styling metadata is component-local | Primitive gap | Project E01 semantic status attributes/classes through shared primitives. |
| `components/ui/index.ts` omits support primitives and no E01 contract exports exist | Component API gap | Normalize exports for all reusable primitives touched by E01. |
| No focused E01 tests | Test gap | Add `tests/ux-design-system-foundation.spec.ts` with source-level contract and primitive checks. |

## Proposed Implementation Split

| Ticket | CTES | Scope |
| --- | ---: | --- |
| `E01-I1` | 9 | Add E01 density/text/status token contract and global CSS variables/utilities. |
| `E01-I2` | 9 | Wire Badge, StatusChip, WorkflowBadge and StatePanel to E01 semantic status/density primitives with non-color attributes. |
| `E01-I3` | 7 | Normalize UI exports for touched design-system primitives and add focused E01 source tests. |

## Bold Cleanup Recommendation

Take the canonical-contract path. Do not patch individual route screens and do not preserve local status/tone vocabularies as equal truth. Add one narrow E01 foundation contract, make primitives project from it, and let later E02-E09 layers consume this foundation instead of re-inventing visual tokens.

## E01-A1 Acceptance Review

| Requirement | Result |
| --- | --- |
| Relevant components and token files identified | PASS |
| Token gaps categorized | PASS |
| Primitive/API/test gaps categorized | PASS |
| Implementation split proposed | PASS |

## Ticket Result

`E01-A1` is complete. `E01-S1` is enabled.
