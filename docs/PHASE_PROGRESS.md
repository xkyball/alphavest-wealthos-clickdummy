# Phase Progress

## Current Phase

**Phase 3 — Client-Facing Screens**

Status: **Implemented**

## Context Ingestion

Completed before implementation:

- `AGENTS.md`
- `docs/ALPHAVEST_WEALTHOS_KB.md`
- `docs/WIREFRAME_MANIFEST.md`
- `docs/SCREEN_SPECS.md`
- `docs/FUNCTIONAL_SCOPE.md`
- `docs/QUALITY_GATES.md`
- `CODEX_TASK_MASTER.md`
- All 16 wireframes in `public/reference/wireframes/`
- 3 key visuals in `public/reference/key-visuals/`

## Phase 1 Deliverables

- Next.js App Router scaffold
- TypeScript configuration
- Tailwind configuration
- AlphaVest CSS variables and Tailwind design tokens
- Shared app shell navigation
- Global demo disclaimer
- Shared board skeleton layout
- Route skeletons for all 16 required routes
- Board route metadata linked to the supplied PNG references
- Static mock family/object context
- Dockerfile
- `docker-compose.yml` with web and Postgres services
- README setup instructions
- QA report document

## Phase 2 Deliverables

- Premium AlphaVest UI primitives and board shell.
- Shared dark navy, champagne-gold and ivory visual system.
- Reusable components for phone frames, metrics, workflow badges, gates, evidence timelines, permission matrices, annotation panels and workflow strips.
- Route skeleton coverage for all 16 required boards.

## Phase 3 Deliverables

Implemented route-specific client-facing boards:

- `/presentation` — product ecosystem story, four surfaces, shared services, advice boundary and `Start Click-Dummy` entry to `/mobile`.
- `/mobile` — mobile home with six next-step action cards and routes to decisions, upload, actions and governance.
- `/mobile/upload` — three-phone upload flow with document type selection, extracted fields, `Confirm & continue`, verification pending state and low-confidence `[BLOCKED]` toggle.
- `/portal` — client dashboard with structure completeness, open actions, pending decisions, missing documents, upcoming reviews, messages, trigger feed, evidence and governance status.
- `/wealth-map` — interactive graph-style map, filters, `Trust X` click drawer, highlighted gap mode from `/wealth-map?highlight=gaps`, escalation notes.
- `/actions` — kanban-style action board with workflow columns, card detail drawer and recommendation route to `/decisions`.
- `/signals` — selectable signal sources that highlight related trigger outputs and preserve the client-visible/internal-only boundary.
- `/decisions` — decision room with Accept, Defer and Reject state updates plus visible audit/evidence notice.
- `/evidence` — evidence vault with source documents, decision records, selected evidence details, sign-off, approval, audit expansion and lifecycle timeline.

## Intentional Boundaries

The following remain intentionally deferred after Phase 3:

- Full implementation of `/workbench`, `/advisor-approval`, `/compliance`, `/governance`, `/communication`, `/journey` and `/roadmap`.
- Phase 4 internal approval, compliance, governance, communication, journey and roadmap interactions.
- Prisma schema and database persistence.
- Full Playwright test suite.
- Full `docker compose up --build` runtime smoke.
- Real integrations, advice generation, KYC/FICA checks, POPIA automation, e-signatures or document encryption.

## Static Data Tradeoff

Phase 3 continues to use static mock data and lightweight React state. This keeps the click-dummy browser-presentable and avoids introducing database complexity before all routes are visually and behaviorally complete.

## Checks

Run during Phase 3:

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed.
- Local HTTP route smoke on `http://localhost:3002` for `/presentation`, `/mobile`, `/mobile/upload`, `/portal`, `/wealth-map?highlight=gaps`, `/actions`, `/signals`, `/decisions` and `/evidence` — passed.

Additional checks are tracked in `docs/IMPLEMENTATION_QA_REPORT.md`.

## Next Recommended Phase

Phase 4 should implement the human workflow and internal operating screens:

- `/workbench`
- `/advisor-approval`
- `/compliance`
- `/governance`
- `/communication`
- `/journey`
- `/roadmap`

It should preserve the same workflow rule: client visibility remains blocked until advisor approval and compliance review are both complete.
