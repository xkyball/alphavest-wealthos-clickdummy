# V0.96 WP-02 Page-Type and Density Report

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Companion task source: `/Users/chris/Downloads/ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md`

Status: `ACCEPTED_WITH_PROOF`

Date: 2026-06-23

## Scope

WP-02 asked for a consistent page-type and density model across touched V0.96 UI surfaces. This slice confirms and hardens the existing model instead of redesigning visible pages.

No routes were created, no held/reference/P1 routes were promoted, no visual assets were added, and no client-facing internal workbench density was introduced.

## Classification

Initial WP-00 classification: `PARTIAL`

Post-slice classification: `ALREADY_PRESENT_WITH_TARGETED_HARDENING`

Reason: the app already had `D1` through `D4` density contracts, page-type contracts, product guidance, support-density strips, workbench triads and route-smoke proof. WP-02 needed a V0.96-specific alias layer so older task wording such as `/workbench`, `/portal` and `DECISION_ROOM` maps to the current route registry without changing route truth.

## Changed Files

| File | Change |
| --- | --- |
| `lib/v0-96-ux-density-contract.ts` | Added a V0.96 adapter that maps target route labels and page-type aliases onto the existing route, page-type and density contracts. |
| `tests/true-ux-density.spec.ts` | Added WP-02 regression tests for touched V0.96 surfaces, long-page density targets, client projection calmness, reference guards and hold guards. |
| `V0_96_WP02_PAGE_TYPE_DENSITY_REPORT.md` | Added this execution report. |

## Inspected Files

- `components/ux-hub-page.tsx`
- `components/ux-dense-operations-panel.tsx`
- `components/ux-detail-standard-panel.tsx`
- `components/ux-support-density-strip.tsx`
- `components/ux-secondary-context-tabs.tsx`
- `components/ux-complexity-priority-panel.tsx`
- `components/ui/card.tsx`
- `components/ui/data-table.tsx`
- `components/page-header.tsx`
- `components/product-guidance-panel.tsx`
- `lib/ux-density.ts`
- `lib/ux-content-hierarchy.ts`
- `lib/ux-hub.ts`
- `lib/ux-page-contract.ts`
- `lib/ux-route-policy.ts`
- `lib/route-registry.ts`
- `tests/true-ux-density.spec.ts`
- `tests/true-ux-cta-state.spec.ts`
- `tests/route-smoke.spec.ts`

## Acceptance Results

| Criterion | Result |
| --- | --- |
| Touched V0.96 pages have assigned page type and density tier | `PASS` through `v096TouchedDensityContracts` |
| Above-the-fold content exposes page job, status/gate and next action | `PASS_EXISTING` through `ProductGuidancePanel` and density tests |
| Long-page targets stay in controlled density patterns | `PASS` |
| Sparse pages are not padded with decorative copy | `PASS_EXISTING` through support-density strip gating |
| Client projection remains calm and not internal-workbench dense | `PASS` for `/portal` -> `/client/home` -> `D1` |
| Reference and held routes stay outside productive density targets | `PASS` |

## V0.96 Mapping Notes

| V0.96 label | Current route truth | V0.96 page type | Density |
| --- | --- | --- | --- |
| `/portal` | `/client/home` | `CLIENT_PROJECTION` | `D1` |
| `/documents` | `/documents` | `WORKBENCH_QUEUE` | `D2` |
| `/workbench` | `/advisory/review-queue` | `WORKBENCH_QUEUE` | `D2` |
| `/workbench/triggers/:id` | `/advisory/triggers/:id/review` | `DETAIL_REVIEW` | `D4` |
| `/advisor-approval/:id` | `/advisor/reviews/:id` | `DETAIL_REVIEW` | `D4` |
| `/compliance/:id/review` | `/compliance/reviews/:id/decision-room` | `DECISION_ROOM` | `D4` |
| `/compliance/:id/audit` | `/compliance/reviews/:id/audit` | `DETAIL_REVIEW` | `D3` |
| `/export/:id/scope` | `/export/:id/scope` | `WORKBENCH_QUEUE` | `D3` |
| `/export/:id/redaction` | `/export/:id/redaction` | `WORKBENCH_QUEUE` | `D3` |
| `/export/:id/preview` | `/export/:id/approval` | `DECISION_ROOM` | `D4` |

## Proof

Focused proof for this slice:

- `pnpm exec playwright test tests/true-ux-density.spec.ts`
- `pnpm exec playwright test tests/true-ux-cta-state.spec.ts`
- `pnpm test:route-smoke`

Static safety proof:

- `pnpm typecheck`
- `pnpm lint`

## Screenshots

No screenshot was required for WP-02 because this slice adds route-contract proof only and does not change visible layout. Screenshot proof should resume for WPs that alter visible page content.

## Deviations

- V0.96 route labels such as `/workbench`, `/advisor-approval/:id`, `/portal` and `/export/:id/preview` are legacy labels. The new adapter records their current route-registry equivalents without changing route truth.
- The repo's operative page-type vocabulary remains `Hub`, `Workbench`, `Detail`, `Modal`, `Reference`, `P1` and `Hold`; V0.96 aliases are compatibility labels for WP proof only.

## Next Recommended Work Package

Proceed to `WP-03 — Evidence Workbench + Sufficiency UX`.
