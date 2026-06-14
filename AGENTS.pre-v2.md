# AGENTS.md — AlphaVest WealthOS Codex Instructions

You are building a browser-presentable click-dummy for **AlphaVest Digital Wealth Assurance Platform / AlphaVest WealthOS**.

## Absolute Context Rule
Before implementing anything, read these files in this order:

1. `docs/ALPHAVEST_WEALTHOS_KB.md`
2. `docs/WIREFRAME_MANIFEST.md`
3. `docs/SCREEN_SPECS.md`
4. `docs/FUNCTIONAL_SCOPE.md`
5. `docs/QUALITY_GATES.md`
6. `public/reference/wireframes/*.png`
7. `public/reference/key-visuals/*.png`

Treat these as the product source of truth. Do not invent a different product. Do not simplify away the human-backed workflow logic.

## Visual Source-of-Truth Rule
The 16 PNG wireframes in `public/reference/wireframes/` are not decoration. They are the visual source of truth. Recreate their layout language in HTML/CSS/React as closely as practical:

- dark navy / midnight background
- champagne-gold outlines and typography
- ivory primary text
- thin rounded panels
- dense but readable wireframe boards
- subtle world-map motif
- workflow badges
- right-side annotation panels
- bottom workflow / legend strips
- app-shell navigation where shown
- mock phone frames where shown
- dashboard tables, cards, matrices, timelines and gate logic

Do not replace the design with a generic SaaS template.

## Regulatory/Product Safety Rule
This is a product prototype only. It must not generate or imply actual financial, tax, legal, insurance, residency, citizenship or investment advice.

Always preserve these messages across the demo:

- `Demo only. Not legal, tax, investment, insurance, residency or citizenship advice.`
- `Triggers are review points, not final advice.`
- `No unapproved advice reaches the client.`
- `Digital first. Human reviewed. Evidence backed.`
- `Evidence replaces assumption.`

## Human Workflow Rule
Every sensitive client-facing recommendation must visibly pass through:

`[AI-DRAFT] -> [ANALYST] -> [ADVISOR] -> [COMPLIANCE] -> [CLIENT] -> [EVIDENCE] -> [REVIEW]`

Client visibility remains blocked until advisor approval and compliance review are both complete.

## Implementation Preference
Use the simplest robust implementation that produces a credible click-dummy:

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Prisma + Postgres if needed for seeded mock data
- Docker Compose
- Playwright smoke tests

If a technical choice would slow completion, implement with static seeded data first and document the tradeoff.

## Acceptance Standard
The prototype is acceptable only if it renders all 16 boards/routes, uses the supplied wireframes and KB, implements the core click flows, and passes or documents smoke tests.
