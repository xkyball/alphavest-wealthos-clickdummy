# E09 Capture QA Sign-Off Checklist

Generated: 2026-06-27T15:25:37.124Z
Status: ready-for-human-signoff

This checklist is a repeatable human sign-off companion for capture QA. It does not replace product/design approval and it does not authorize new scope.

| Epic | Sign-off question | Acceptance signal | Evidence |
| --- | --- | --- | --- |
| E01 | Does the screen use the canonical operating/design-system model instead of local one-off semantics? | Shared UX contracts are present and tests cover operating mode/design-system projection. | docs/ux/ALPHAVEST_E01_UX_OPERATING_MODEL_SPEC.md (present)<br>docs/ux/ALPHAVEST_E01_DESIGN_SYSTEM_FOUNDATION_SPEC.md (present)<br>tests/ux-operating-model.spec.ts (present)<br>tests/ux-design-system-foundation.spec.ts (present) |
| E02 | Does the page avoid monster-screen composition and use the approved template discipline? | Page template family, density band and section structure are declared through shared primitives. | docs/ux/ALPHAVEST_E02_PAGE_TEMPLATE_SYSTEM_SPEC.md (present)<br>tests/ux-page-template-system.spec.ts (present)<br>tests/ux-page-template-adoption.spec.ts (present) |
| E03 | Can a user complete the task without route IDs, proof tags or capture/debug language leaking into the workflow? | Proof/debug/reviewer metadata is absent from default operational/client UI and present only in reviewer/capture artifacts. | docs/ux/ALPHAVEST_E03_OPERATIONAL_PROOF_SEPARATION_SPEC.md (present)<br>tests/ux-proof-reviewer-mode.spec.ts (present)<br>tests/product-guidance-shell.spec.ts (present) |
| E04 | Are base and overlay states mechanically distinguishable in UI attributes and capture metadata? | Base, modal, drawer and confirmation states expose canonical lifecycle/capture metadata. | docs/ux/ALPHAVEST_E04_STATE_MODAL_DRAWER_LIFECYCLE_SPEC.md (present)<br>tests/ux-lifecycle-state-contract.spec.ts (present)<br>tests/capture-routes-and-modals-contract.spec.ts (present) |
| E05 | Are primary/destructive/blocked/recovery actions explicit and truthfully reflected in feedback? | Actions have clear hierarchy, guarded states and no-overclaim feedback. | docs/ux/ALPHAVEST_E05_ACTION_HIERARCHY_SPEC.md (present)<br>docs/ux/ALPHAVEST_E05_ACTION_FEEDBACK_IMPLEMENTATION_SPEC.md (present)<br>tests/ux-action-hierarchy-contract.spec.ts (present)<br>tests/true-ux-cta-state.spec.ts (present) |
| E06 | Can a reviewer distinguish real filter/sort/master-detail behavior from decorative controls? | Data surfaces expose filters, sorting, sticky context and master-detail behavior through shared contracts. | docs/ux/ALPHAVEST_E06_DATA_SURFACE_MASTER_DETAIL_SPEC.md (present)<br>docs/ux/ALPHAVEST_E06_FEEDBACK_MESSAGING_SPEC.md (present)<br>tests/ux-data-surface-contract.spec.ts (present)<br>tests/ux-filter-sticky-surface.spec.ts (present) |
| E07 | Does client-visible output prove release/redaction boundaries instead of relying on copy promises? | Client-safe surfaces fail closed and do not leak internal rationale, drafts or unreleased evidence. | docs/ux/ALPHAVEST_E07_CLIENT_INTERNAL_SEPARATION_SPEC.md (present)<br>tests/ux-client-safe-ui-boundary.spec.ts (present)<br>tests/true-ux-client-projection.spec.ts (present) |
| E08 | Can the screen be scanned, focused and status-reviewed without color-only meaning or cramped text? | Density, focus, selected/active states and semantic status hierarchy are visible and test-covered. | docs/ux/ALPHAVEST_E08_VISUAL_DENSITY_ACCESSIBILITY_SPEC.md (present)<br>tests/true-ux-a11y.spec.ts (present)<br>tests/true-ux-density.spec.ts (present) |

## Capture QA Gate

- Run `pnpm visual:capture-qa` or `tsx scripts/capture-qa-contract.ts` against the relevant artifact root before release-style visual review.
- Treat duplicate-state clusters and long-screen risks as review blockers until a human explicitly accepts them or opens cleanup tickets.
- Keep proof/reviewer metadata in reports and reviewer surfaces, not default operational UI.
