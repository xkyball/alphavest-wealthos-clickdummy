# V2 No-Unapproved-Advice Test Report

Date: 2026-06-14

## Gate Rule

Advice-like client output is blocked unless all checks pass:

```text
advisor approval
compliance release
evidence record
permission check
released visibility state
```

## Covered Negative Cases

| Missing requirement | Expected result | Covered |
|---|---|---|
| Advisor approval | blocked | Yes |
| Compliance release | blocked | Yes |
| Evidence record | blocked | Yes |
| Permission check | blocked | Yes |
| Released visibility state | blocked | Yes |
| Analyst release attempt | role denied | Yes |
| Advisor approval alone | blocked | Yes |
| Communication send without release | blocked | Yes |

## Covered Positive Case

When advisor approval, compliance release, evidence, permission and released state are all true, the helper returns `clientVisible: true` and the workflow badge is `[CLIENT]`.

## Test Evidence

Tests are in:

- `tests/phase5-client-model.test.mjs`
- `tests/phase7-governance-model.test.mjs`
- `tests/phase8-communication-planning.test.mjs`
- `tests/phase9-final-handoff.test.mjs`

Commands passed:

- `npm test`
- `npm run test:e2e`

