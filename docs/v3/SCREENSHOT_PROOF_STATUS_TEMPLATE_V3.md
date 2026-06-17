# AlphaVest Screenshot-Proof Status Template V3

Status: Phase A preparation artifact.  
Scope: Required status format for future visual implementation proof.

## Purpose

Screenshot proof is a visual evidence artifact from the running AlphaVest app after implementation. It is separate from:

- `pnpm build`,
- route smoke,
- Playwright DOM or click success,
- ImageGen output,
- reference catalogue assets.

DOM success is not design acceptance.

## Status Values

| Screenshot-Proof Status | Meaning | Allowed claim |
| --- | --- | --- |
| `not required` | Ticket has no UI or visual-reference implementation scope. | No screenshot proof needed for this ticket. |
| `not captured` | Screenshot proof is required but has not been attempted. | No visual acceptance claim. |
| `captured` | Running app screenshot exists for the implemented route/state. | Screenshot proof exists, but rubric may still be pending. |
| `captured with issues` | Screenshot exists but shows a known visual, state or capture issue. | Proof exists with explicit gap labels. |
| `blocked` | Capture could not complete after controlled attempts. | Proof is blocked; record blocker and fallback evidence. |
| `stale` | Screenshot predates relevant implementation changes. | Do not use for current acceptance. |

## Copy Template

```markdown
# Screenshot-Proof Status - [TICKET_ID] - [SCREEN_OR_ROUTE]

Date:
Route:
State(s):
Role/tenant/context:
Base URL:
Viewport(s):

## Screenshot Proof

| Artifact | Path | Status | Notes |
| --- | --- | --- | --- |
| Reference app screenshot before ImageGen | | not captured | Required before ImageGen tickets. |
| Implemented route screenshot | | not captured | Required for visual acceptance. |
| Mobile screenshot | | not required | Required when mobile state is in scope. |
| Desktop screenshot | | not required | Required when desktop state is in scope. |

## Capture Attempts

| Attempt | Command/tool | Result | Notes |
| --- | --- | --- | --- |
| 1 | | not captured | |

## Technical Checks Are Separate

| Check | Status | Notes |
| --- | --- | --- |
| Typecheck/lint/build | not verified | |
| Route smoke/Playwright | not verified | |
| Human Visual Review Rubric | not reviewed | |

## Completion Labels

| Item | Completion Status Label | Reason |
| --- | --- | --- |
| Screenshot proof | not verified | |
```

## Blocker Handling

If capture fails, mark `blocked`, record the attempts and keep any DOM or route evidence as supporting evidence only. Do not convert DOM evidence into design acceptance.
