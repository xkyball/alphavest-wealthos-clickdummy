# Quality Gates — AlphaVest WealthOS Click-Dummy

Codex must run these checks before considering the implementation complete.

## Gate 1 — Context Ingestion
- [ ] `AGENTS.md` exists and was followed.
- [ ] `docs/ALPHAVEST_WEALTHOS_KB.md` exists.
- [ ] `docs/WIREFRAME_MANIFEST.md` exists.
- [ ] `docs/SCREEN_SPECS.md` exists.
- [ ] `docs/FUNCTIONAL_SCOPE.md` exists.
- [ ] All 16 wireframe images exist in `public/reference/wireframes/`.
- [ ] Key visual references exist in `public/reference/key-visuals/`.

## Gate 2 — Visual Fidelity
Each route must visually echo its source board:

- [ ] Same board title and number.
- [ ] Dark navy / champagne-gold / ivory visual language.
- [ ] Right-side annotation panels where applicable.
- [ ] Bottom workflow / legend strip where applicable.
- [ ] Workflow badges visible.
- [ ] No generic SaaS or Bootstrap-like replacement.
- [ ] Screens are HTML/CSS/React, not only static PNG backgrounds.

## Gate 3 — Route Coverage
- [ ] `/presentation`
- [ ] `/mobile`
- [ ] `/mobile/upload`
- [ ] `/portal`
- [ ] `/wealth-map`
- [ ] `/actions`
- [ ] `/signals`
- [ ] `/decisions`
- [ ] `/evidence`
- [ ] `/workbench`
- [ ] `/advisor-approval`
- [ ] `/compliance`
- [ ] `/governance`
- [ ] `/communication`
- [ ] `/journey`
- [ ] `/roadmap`

## Gate 4 — Core Interactions
- [ ] Start Click-Dummy works.
- [ ] Mobile action cards route correctly.
- [ ] Upload flow changes state.
- [ ] Portal score routes to wealth map.
- [ ] Trust X drawer opens.
- [ ] Decision accept/defer/reject changes state.
- [ ] Workbench publish gate is disabled until complete.
- [ ] Advisor approval sets next gate to compliance.
- [ ] Compliance can block and approve mock outputs.
- [ ] Governance sensitive permission requires confirmation.
- [ ] Communication scenarios highlight digital/call/F2F path.

## Gate 5 — Product Safety
- [ ] Demo disclaimer visible globally.
- [ ] `No unapproved advice reaches the client.` visible in relevant screens.
- [ ] `Triggers are review points, not final advice.` visible in Signal Engine.
- [ ] Recommendations are not client-visible until advisor + compliance gates complete.
- [ ] No real API integrations.
- [ ] No real advice generated.
- [ ] No secrets or real client data.

## Gate 6 — Technical Quality
- [ ] TypeScript build passes.
- [ ] Lint passes or documented warnings are minor.
- [ ] `docker compose up --build` works.
- [ ] App loads at `http://localhost:3000`.
- [ ] Playwright smoke tests exist and pass or failures are documented.
- [ ] README contains setup and demo path.

## Gate 7 — Presentation Quality
- [ ] Works at 1440px+ desktop width.
- [ ] Text is readable enough for live browser presentation.
- [ ] Navigation is clear.
- [ ] Demo path is documented.
- [ ] It looks like a premium AlphaVest product prototype, not a wireframe dump.
