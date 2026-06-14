# Phase 7.5 Workflow Runtime Plan

Date: 2026-06-14

## Why This Exists

Phase 4 through Phase 7 created visual screens, central permissions, state machines, evidence helpers and audit helpers. The missing layer was a shared runtime that makes clicks on one screen change what the next screen shows.

This phase introduces that runtime so future tasks understand that the click-dummy now has a single demo workflow story.

## Runtime Architecture

| Layer | Files | Purpose |
|---|---|---|
| Demo domain and transitions | `lib/demo-runtime.ts` | Owns seeded workflow objects and applies workflow transitions through the central state machine. |
| Store | `lib/demo-store.ts` | Reads/writes the demo session through Postgres when `DATABASE_URL` exists, otherwise uses a Node in-memory fallback. |
| API | `app/api/demo/session/route.ts`, `app/api/demo/transition/route.ts` | Lets client screens load/reset the demo session and submit workflow actions. |
| Client hook | `components/use-demo-session.ts` | Shared hook for Phase 4-7 screens. |
| Seed script | `scripts/seed-demo-runtime.mjs` | Creates the `demo_sessions` table and resets the persistent demo session. |

## Canonical Demo Story

Primary object:

```text
Trust X beneficiary update recommendation
```

Happy path:

1. `/workbench` shows the review item in `recommendation / needs_review`.
2. `/advisor-approval` triggers `advisor.approve`.
3. `/compliance` triggers `compliance.release`.
4. `/mobile` and `/decisions` now show the client-visible decision pack.
5. `/decisions` triggers `client.submit_decision`.
6. Evidence preview opens contextually from workflow routes and shows runtime evidence/audit records created by previous clicks; `/evidence` is not used as a standalone navigation target.

Related paths:

- `/mobile/upload` can confirm extraction for the Trust X deed document.
- `/governance` can confirm a sensitive access change and advance the access request.
- `/communication` can send a released message through the communication workflow.

## Persistence

Docker Compose already includes Postgres. The app now uses `DATABASE_URL` if present:

```text
postgresql://alphavest:alphavest@postgres:5432/alphavest_wealthos
```

Local host seed:

```bash
npm run demo:seed
```

When Postgres is unavailable, the runtime falls back to an in-memory session so `npm run build` and local dev without Compose still work.

## Future Task Guidance

New screens should not create isolated `useState` workflows when the state belongs to the product journey. Instead:

1. Add or extend a workflow object in `lib/demo-runtime.ts`.
2. Add a typed transition action.
3. Validate the transition through `canTransition()`.
4. Emit evidence and audit events.
5. Read the resulting session through `useDemoSession()`.

Reference visuals should continue to inform runtime state, permissions, evidence and audit rather than becoming decorative UI.
