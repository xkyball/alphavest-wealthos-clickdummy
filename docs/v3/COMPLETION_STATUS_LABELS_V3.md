# AlphaVest Completion Status Labels V3

Status: Phase A preparation artifact.  
Scope: Approved labels for future workflow, visual, screenshot and proof reporting.

## Required Labels

| Label | Meaning | Allowed claim | Forbidden claim |
| --- | --- | --- | --- |
| `implemented` | The scoped code or documentation change exists. | The artifact or behavior was added. | It is visually accepted or screenshot-proven. |
| `partially implemented` | Some scoped work exists, but required items remain. | A bounded subset is done. | The whole ticket is complete. |
| `visually reviewed` | Human Visual Review Rubric result exists for the relevant implemented screenshot. | Human visual review was performed with recorded result. | Screenshot proof or all states are complete unless separately recorded. |
| `screenshot-proven` | Running app screenshot proof exists for the relevant route/state and is current. | Screenshot proof exists for named state and viewport. | Human visual acceptance exists unless rubric also says so. |
| `not verified` | Work or claim has not been checked yet. | Verification remains open. | Passed, accepted or proven. |
| `not scanned` | Source, state, route or artifact has not been inspected. | Scan coverage is incomplete. | Absence of issue. |
| `blocked` | Work or proof cannot proceed under current constraints. | A blocker exists and needs resolution. | Failure of the product behavior unless proven. |

## Recommended Use

Use labels at the smallest meaningful surface:

- route,
- component,
- state,
- screenshot proof,
- rubric review,
- accessibility/semantic review,
- evidence/audit/persistence proof,
- whole ticket.

## Label Composition

A future visual implementation ticket can be:

```text
implemented + screenshot-proven + visually reviewed
```

only when each claim has its own evidence. A technical test pass never implies `visually reviewed` or `screenshot-proven`.

## Reporting Fields

Every phase report that touches UI, ImageGen or visual proof must list:

- implementation-maps created,
- ImageGen artifact folders,
- reference app screenshots,
- generated mockups,
- screenshot proof artifacts,
- Human Visual Review Rubric results,
- unresolved `not verified`, `not scanned` or `blocked` items.
