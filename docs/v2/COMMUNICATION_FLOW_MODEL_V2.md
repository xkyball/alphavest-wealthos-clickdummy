# Communication Flow Model v2

## Purpose

The communication model decides when digital-only communication is enough and when the workflow must move to more human support.

## Routes

| Trigger | Route | Owner | Evidence |
|---|---|---|---|
| Routine review ready | Digital-only | Client Success | Communication Record |
| Missing source data | Request data | AlphaVest Analyst | Analyst Note |
| Judgement call required | Schedule call | Senior Advisor | Call Schedule |
| Family governance conflict | F2F workshop | Senior Advisor | Call Outcome |
| External specialist dependency | External specialist | Client Success | Analyst Note |

## Role Views

- Advisor view: sees recommendation route, call/workshop escalation and release readiness.
- Client Success view: can send only after required approvals, release, evidence and permission checks.
- Client view: sees only released wording and never backstage notes.

## Overlay Interpretation

The client-visible message preview is implemented as an overlay-style workflow surface over the internal communication context. This follows the same interpretation pattern as drawer/modal-style visuals elsewhere in the click-dummy: the route may be deep-linked, but the preview itself should behave like a focused release surface rather than a full standalone planning board.

## Gate

Advice-like communication cannot be sent to the client unless all checks pass:

- advisor approval;
- compliance release;
- evidence record;
- send permission;
- released visibility state.

The implementation uses the Phase 7 visibility and permission helpers rather than a separate communication-only rule.

## Evidence and Audit

Communication lifecycle events create or link evidence:

- `communication.sent`
- `call.scheduled`
- `call.completed`
- `note.added`
- `advice.approved`

The communication log is an internal operational view and evidence trail, not a decorative status board.
