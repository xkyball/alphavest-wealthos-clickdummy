# Product Disabled Reasons Wave 4 Report

Date: 2026-07-01

## Scope

Wave 4 replaced generic implementation-blocker language on active Export/Ops surfaces with product-native disabled reasons. The slice keeps Process Universe terms out of operational UI and preserves controlled actions as non-interactive unless a real workflow event opens them.

Changed surfaces:

- `/export/new`: fixed navigation collapse reason now describes the workspace boundary.
- `/ops`: queue creation now explains that queue rows originate from service events or SLA breaches.
- `/ops/sla/demo`: escalation creation now explains that escalation requires a selected SLA breach with owner and due date.
- Communication/call-trigger source labels in the shared component were also normalized, but those URLs did not render the changed product surface during visual proof and are not claimed as screenshot acceptance.

## Method Notes

- Psycho-Logic: blocked controls now answer why the user cannot act in product terms instead of exposing an implementation gap.
- TRIZ: the UI can remain honestly blocked without weakening safety or pretending workflow commands exist.
- SIT/SCAMPER: reused the existing blocked-control primitive and substituted only the reason and visible action label.
- Harvard/BATNA: smallest acceptable alternative was source-only cleanup; rejected as acceptance proof where routes did not render the surface.
- Engine V3 adversarial check: routes must be visually proven or classified as source hygiene, not UI completion.

## Validation

Positive:

- `pnpm guard:source` passed.
- `pnpm typecheck` passed.
- `pnpm exec eslint components/communication-export-ops-screen.tsx components/internal-workflow-screen.tsx tests/advisor-review-approval-ui.spec.ts tests/route-smoke.spec.ts` passed with warnings only.
- `pnpm playwright test tests/advisor-review-approval-ui.spec.ts --workers=1` passed.
- `pnpm playwright test tests/route-smoke.spec.ts -g "product-native disabled control reasons" --workers=1` passed.
- `pnpm build` passed.
- Screenshot metrics passed for `/export/new`, `/ops`, and `/ops/sla/demo` at `1400x900` and `390x844`: no horizontal overflow, no generic typed-workflow disabled reason, non-interactive blocked control remained on route after click dispatch.

Negative / residual:

- Full `pnpm lint` remains blocked by unrelated existing errors in `client-intake-screen.tsx`, `decisions-governance-screen.tsx`, and `wealth-actions-screen.tsx`.
- Additional occurrences of `Blocked until a typed workflow command is implemented.` remain outside this Wave 4 surface family and should be handled in later slices.
- Communication source labels were normalized, but `/communication/demo/context` and `/communication/call-trigger` did not render those changed controls in the current route state; no UI acceptance is claimed for them.

## Proof Artefacts

- Desktop contact sheet: `artifacts/screenshots/product-disabled-reasons-wave4/desktop-contact-sheet.png`
- Metrics JSON: `artifacts/screenshots/product-disabled-reasons-wave4/metrics.json`

Screenshot artefacts are intentionally not part of the commit scope unless explicitly requested.
