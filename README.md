# AlphaVest WealthOS Click-Dummy

Phase 1 foundation for the **AlphaVest Digital Wealth Assurance Platform / AlphaVest WealthOS** browser prototype.

The current build establishes the Next.js App Router app, AlphaVest design tokens, all 16 route skeletons, global safety disclaimers, reference-board thumbnails, Docker setup and progress/QA documentation. Detailed screen content and click interactions are intentionally deferred to later phases.

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

Postgres is provisioned for the intended platform foundation, but Phase 1 uses static mock data so database complexity does not block the browser prototype.

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

## Phase 1 Scope

Implemented:

- Next.js App Router and TypeScript configuration
- Tailwind CSS and AlphaVest design tokens
- Shared app shell and board skeleton layout
- Route skeletons for all 16 boards
- Global disclaimer banner
- Mock route metadata and seeded object context
- Dockerfile and Docker Compose setup
- `.env.example`
- Progress and QA report documents

Deferred to later phases:

- Detailed per-board screen composition
- Local React state interactions
- Playwright smoke tests
- Prisma schema and seeded Postgres data
- Wireframe-by-wireframe visual polish pass

## Available Checks

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

See `docs/IMPLEMENTATION_QA_REPORT.md` for the current check results and quality-gate status.
