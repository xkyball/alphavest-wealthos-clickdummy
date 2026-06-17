# AlphaVest Human Visual Review Rubric Result Template V3

Status: Phase A preparation artifact.  
Scope: Required result format after future UI implementation and screenshot proof.

Alias term for reports and searches: Human Visual Review Rubric Ergebnis.

## Use

Copy this file to the screen artifact folder as `human-visual-review.md` after the implemented route has screenshot proof.

Category status values:

```text
pass | minor issue | major issue | blocked | not reviewed
```

Final status values:

```text
accepted | accepted with minor issues | needs visual refactor | blocked | not reviewed
```

## Copy Template

```markdown
# Human Visual Review - [TICKET_ID] - [SCREEN_OR_ROUTE]

Date:
Reviewer:
Route:
State(s):
Role/tenant/context:
Implementation screenshot:
Reference screenshot:
ImageGen visual:
Completion Status Label:

## Rubric Scores

| Category | Status | Evidence / notes | Required follow-up |
| --- | --- | --- | --- |
| Product-native feel | not reviewed | | |
| Visual hierarchy | not reviewed | | |
| Spacing and alignment | not reviewed | | |
| State completeness | not reviewed | | |
| Reference fidelity | not reviewed | | |
| Data realism | not reviewed | | |
| Accessibility and semantics | not reviewed | | |

## Final Human Judgment

| Question | Answer |
| --- | --- |
| Would a product owner believe this is an intentional product screen? | not reviewed |
| Would a user understand what to do in the first few seconds? | not reviewed |
| Does it avoid visible AI/spec/debug artifacts? | not reviewed |
| Does the screenshot support the claim being made? | not reviewed |
| Are any unreviewed states clearly listed? | not reviewed |
| Is the result good enough to demo to a human stakeholder? | not reviewed |

Final status: not reviewed

## Explicit Gaps

| Gap | Completion Status Label | Owner/next step |
| --- | --- | --- |
| | not verified | |
```

## No-Overclaim Rule

A screen is not `visually reviewed` unless this rubric has a final status other than `not reviewed` and every unresolved category has an explicit Completion Status Label.
