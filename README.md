# AlphaVest WealthOS Click-Dummy

Phase 7.5 workflow-runtime click-dummy for the **AlphaVest Digital Wealth Assurance Platform / AlphaVest WealthOS** browser prototype.

The current build includes the v2 route surfaces from Phases 4-7 plus a shared demo workflow runtime. Key clicks now update one canonical demo session so later screens can reflect the same recommendation, compliance, decision, evidence, audit and access state.

## Product Guardrails

- Demo only. Not legal, tax, investment, insurance, residency or citizenship advice.
- Triggers are review points, not final advice.
- No unapproved advice reaches the client.
- Digital first. Human reviewed. Evidence backed.
- Evidence replaces assumption.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the local app:

   ```bash
   npm run dev
   ```

3. Open:

   ```text
   http://localhost:3000
   ```

The root route redirects to `/presentation`.

## Docker Setup

```bash
docker compose up --build
```

The compose stack includes:

- `web` on `http://localhost:3000`
- `postgres` on port `5432`

Postgres is used by the Phase 7.5 demo runtime when `DATABASE_URL` is present. Without Postgres, the app falls back to an in-memory demo session so build and simple local dev still work.

Seed/reset the persistent demo session from the host:

```bash
npm run demo:seed
```

The canonical runtime path is:

```text
/workbench -> /advisor-approval -> /compliance -> /decisions -> /evidence
```

See `docs/v2/PHASE_7_5_WORKFLOW_RUNTIME_PLAN.md`.

## Demo Route List

- `/presentation`
- `/mobile`
- `/mobile/upload`
- `/portal`
- `/wealth-map`
- `/actions`
- `/signals`
- `/decisions`
- `/evidence`
- `/workbench`
- `/advisor-approval`
- `/compliance`
- `/governance`
- `/communication`
- `/journey`
- `/roadmap`

## Current Scope

Implemented:

- Next.js App Router and TypeScript configuration
- Tailwind CSS and AlphaVest design tokens
- Client, internal workflow, governance and reference route surfaces
- Reusable component library for the AlphaVest wireframe system
- Central roles, permissions, state machines, evidence/audit helpers and no-unapproved-advice gate
- Phase 7.5 demo workflow runtime with API transitions
- Optional Postgres persistence through Docker Compose
- Seed/reset script for the persistent demo session
- Runtime tests for advisor approval, compliance release, client decision, access changes and evidence/audit events

Deferred to later phases:

- Real identity, KYC, CRM, document and advice APIs
- Production authorization enforcement
- WORM audit storage
- Full Playwright browser automation

## Available Checks

```bash
npm run typecheck
npm test
npm run lint
npm run build
npm run test:e2e
npm run start
```

See `docs/IMPLEMENTATION_QA_REPORT.md` for the current check results and quality-gate status.
