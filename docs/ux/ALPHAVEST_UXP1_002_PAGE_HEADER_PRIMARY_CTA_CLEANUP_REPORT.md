# AlphaVest UXP1-002 Page Header / Primary CTA Cleanup Report

## 1. Analyse

UXP1-002 targets page-header and primary-CTA microcopy in `components/page-header.tsx` usage and the shared product guidance header/CTA support area.

The affected visible UI did not need to explain internal proof phases to product users. The cleanup target was the support copy around CTA state, accessibility state and density state:

- `Phase 8 CTA / state / recovery proof`
- `Exactly one primary CTA`
- `This state proof keeps downstream gates unresolved...`
- `No success overclaim`
- `Accessibility, keyboard and status proof`
- `Phase 10`
- `Phase 9`
- `Density hierarchy`
- `Safety retained`

The implementation also found a real CTA-state issue: locked P1/HOLD routes could still receive a primary action through the product-guidance fallback. That contradicted the UXP1-002 requirement that primary CTA labels describe real next actions only.

## 2. Umsetzungsplan

1. Keep the page job, current gate, blocked reason, recovery state and next action visible.
2. Replace proof/phase/manual labels with short task-oriented microcopy.
3. Preserve safety copy only where it describes current unresolved gates.
4. Remove the primary CTA fallback for locked P1/HOLD routes.
5. Record relocated explanation in the Phase 1 manual register.
6. Update focused validation so productive MVP/MVP_SUPPORT routes and locked P1/HOLD routes are asserted separately.

## 3. Artefakt

Changed product UI:

- `components/product-guidance-panel.tsx`
  - Uses only `guidance.ctaState.primaryAction` for the primary CTA.
  - Prevents locked routes from inheriting a fallback product primary CTA.
- `components/ui/state-panel.tsx`
  - Replaced visible CTA proof language with `Next action state`, `Next action`, `Blocked reason`, `Recovery` and `No downstream completion`.
- `components/ui/a11y-status.tsx`
  - Replaced Phase 10 proof labels with `Keyboard ready`, `Keyboard + status`, `Keyboard actions`, `Focus return`, `Status update` and `Page context`.
- `components/ui/card.tsx`
  - Replaced density proof labels with `Layout`, `Layout priority` and `Safety state`.

Updated relocation/manual artefact:

- `docs/ux/ALPHAVEST_UI_MANUAL_RELOCATED_CONTENT.md`
  - Added relocation rows for CTA/state proof copy, keyboard/status proof copy and density proof copy.

Updated validation contract:

- `tests/product-guidance-shell.spec.ts`
  - Aligned topbar expectations with the UXP1-001 functional context copy and corrected route workset labels.
- `tests/true-ux-cta-state.spec.ts`
  - Split productive Phase 8 CTA routes from locked P1/HOLD routes.
  - Asserted locked routes have no productive primary CTA or recovery action.

## 4. Validierung

Acceptance criteria:

- No long manual/proof/methodology explanation remains in the affected header/CTA support area.
- Functional labels remain clear for current gate, blocked reason, recovery and next action.
- Safety copy remains current-state-only and does not imply downstream gate completion.
- P1/HOLD routes are not promoted and do not receive productive primary CTAs.
- Relocated explanation is recorded in the manual register.

Validation run:

- `rg -n "Phase 8 CTA / state / recovery proof|Phase 9|Phase 10|Exactly one primary CTA|This state proof|No success overclaim|Accessibility, keyboard and status proof|Density hierarchy|Safety retained" components/page-header.tsx components/product-guidance-panel.tsx components/ui/state-panel.tsx components/ui/a11y-status.tsx components/ui/card.tsx app/page.tsx`
  - Result: no matches.
- `PLAYWRIGHT_PORT=3036 pnpm exec playwright test tests/product-guidance-shell.spec.ts tests/true-ux-cta-state.spec.ts tests/true-ux-a11y.spec.ts tests/true-ux-density.spec.ts --reporter=line`
  - Result: 27 passed.
- `pnpm lint`
  - Result: passed with 32 existing warnings.
- `pnpm exec playwright test tests/foundation-guardrails.spec.ts --reporter=line`
  - Result: 5 passed.
- `PLAYWRIGHT_PORT=3037 pnpm exec playwright test tests/route-smoke.spec.ts --reporter=line`
  - Result: 316 passed.

Validation policy note:

- Per user instruction after this phase, the full route-smoke suite should run again only after completion of `UXP1-010`. For `UXP1-003` through `UXP1-009`, use focused validation unless explicitly requested otherwise.

## 5. Offene Risiken

- Existing lint warnings remain outside UXP1-002 scope.
- Internal component/test identifiers still contain proof-oriented names for compatibility; visible product UI copy was cleaned.
- Broader Phase 1 content cleanup remains pending outside page-header/primary-CTA support.
- P1 and HOLD routes remain registered smoke routes only; they are not implementation unlocks or MVP proof.
