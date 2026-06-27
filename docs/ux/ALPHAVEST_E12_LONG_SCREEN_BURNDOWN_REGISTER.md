# AlphaVest E12 Long-Screen Burndown Register

Epic: E12 - Contract Fulfillment Ledger Gate
Ticket: E12-CAPTURE-QA-QUARANTINE-AND-LONG-SCREEN-BURNDOWN
Approval: `APPROVE_E12_CAPTURE_QA_QUARANTINE_AND_LONG_SCREEN_BURNDOWN`

## Decision

Legacy capture bundles are historical evidence only. They must not be metadata-patched, renamed or resized merely to make release QA pass.

Release truth starts at:

`artifacts/release-candidate/current`

The hard release report is written to:

`artifacts/capture-qa/release-current`

## Burndown Activation

Long-screen burndown tickets are created only from the current release-candidate capture QA report. Historical captures may inform diagnosis, but they do not create release-scope obligations by themselves.

## Ticket Families

| Ticket family | Trigger | Required fix |
| --- | --- | --- |
| `E12-LSB-SEVERE-HEIGHT` | `long-screen.severe-height` | Split the surface, introduce sticky summary/action rails, or reduce stacked content. |
| `E12-LSB-SCROLL-BURDEN` | `long-screen.scroll-burden` | Move secondary content behind tabs, drawers or route-level detail pages. |
| `E12-LSB-HORIZONTAL-OVERFLOW` | `long-screen.horizontal-overflow` | Fix responsive layout, table containment or non-wrapping content. |
| `E12-LSB-METADATA` | `metadata.*` release warning | Regenerate the capture through the E09-compliant capture pipeline. |

## Acceptance Rule

Each generated burndown ticket must include:

- route or page id.
- state label.
- screenshot path.
- QA rule.
- measured height, ratio or overflow evidence when available.
- owner surface.
- selected remediation path.
- follow-up test or capture command.

No product owner exception can turn an unfixed long-screen warning into a fulfilled UX contract. Exceptions may only defer release with explicit follow-up ownership.
