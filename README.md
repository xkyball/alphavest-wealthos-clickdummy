# AlphaVest WealthOS Click-Dummy

AlphaVest WealthOS is a v2 browser prototype for a digital wealth assurance workflow.

The current repository is complete through **Phase 9: QA, Tests, Documentation and Demo Handoff**. It is a demo-ready click-dummy/prototype, not a production platform.

## Product Guardrails

- Digital first.
- Human reviewed.
- Evidence backed.
- Triggers are review points, not advice.
- Advisor approval alone is not enough.
- Compliance release controls client visibility.
- Evidence is created by default.
- Sensitive actions create audit events.
- No unapproved advice reaches the client.

## Visual Reference Rule

The v2 visuals are implementation references, not 1:1 UI screenshots. Only the actual app screen area, drawer, modal, table, mobile content, kanban board, form, graph or workflow interface region becomes product UI.

Annotations, legends, dev notes, metadata, backstage workflows, audit hints, permission notes and state examples are translated into helpers, route state, tests, documentation, mock contracts, state machines, permission rules and evidence/audit mapping.

## Local Setup

Install dependencies:

```bash
npm install
```

Start the local app:

```bash
npm run dev
```

Open:

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

Postgres is used by the demo runtime when `DATABASE_URL` is present. Without Postgres, the app falls back to an in-memory demo session so local development and builds still work.

Seed/reset the persistent demo session from the host:

```bash
npm run demo:seed
```

## Available Commands

```bash
npm run dev
npm run typecheck
npm test
npm run test:e2e
npm run lint
npm run build
npm run start
```

Phase 9 check status:

- `npm test`: passed, 64 tests
- `npm run test:e2e`: passed, 17 tests
- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed

## Route List

Primary demo routes:

- `/presentation`
- `/mobile`
- `/mobile/upload`
- `/portal`
- `/wealth-map`
- `/actions`
- `/signals`
- `/decisions`
- `/workbench`
- `/advisor-approval`
- `/compliance`
- `/governance`
- `/communication`
- `/service-blueprint`
- `/journey`
- `/roadmap`

Compatibility route:

- `/evidence` redirects to `/portal`; evidence preview is a contextual overlay, not a standalone product route.

Optional/reference routes not implemented as pages:

- `/states`
- `/permissions/reference`
- `/evidence/audit-map`

Their visuals are treated as logic-only inputs for status, permission, state-machine and evidence/audit helpers.

## Demo Path

1. `/presentation` - operating command center and shared runtime state.
2. `/mobile` - mobile home and next step today.
3. `/mobile/upload` - document selection and extraction review.
4. `/portal` - client dashboard and readiness score.
5. `/wealth-map?focus=gaps` - wealth graph and Trust X drawer.
6. `/actions` - action board and missing-evidence blocker.
7. `/decisions?state=blocked` - permission blocked decision room.
8. `/workbench` - internal queue and publish readiness gate.
9. `/advisor-approval` - advisor review and approval.
10. `/compliance` - release or block with evidence/audit output.
11. `/decisions` - submit decision and open evidence preview.
12. `/governance` - permission matrix, role drawer and second confirmation.
13. `/communication?surface=client-preview` - gated communication preview.
14. `/service-blueprint` - internal swimlane/evidence/escalation reference.
15. `/roadmap` - MVP, Phase 2, Future and dependency view.

See `docs/v2/V2_DEMO_SCRIPT.md` for the full talk track.

## What Is Mocked

- Client, family, role, workflow and evidence data.
- Document upload and extraction.
- Advisor approval, compliance release and communication send.
- Audit events and evidence links.
- Digital seal/checksum values.
- Optional Postgres demo persistence.

## Not Production Ready

- No real identity provider.
- No production authorization middleware.
- No real advice, KYC, CRM, document, portfolio, calendar or messaging integration.
- No immutable WORM audit storage.
- No production evidence vault.
- No Playwright browser suite is installed.

## Safety Notes

This prototype must not be used to provide legal, tax, investment, insurance, residency or citizenship advice. It demonstrates the product workflow and safety model only.

Advice-like client output requires:

```text
advisor approval
compliance release
evidence record
permission check
released visibility state
```

If any requirement is missing, the system must keep the content blocked.

## Handoff Documents

- `docs/v2/PHASE_9_QA_REPORT.md`
- `docs/v2/V2_IMPLEMENTATION_SUMMARY.md`
- `docs/v2/V2_ROUTE_COVERAGE_REPORT.md`
- `docs/v2/V2_STATE_COVERAGE_REPORT.md`
- `docs/v2/V2_PERMISSION_TEST_REPORT.md`
- `docs/v2/V2_NO_UNAPPROVED_ADVICE_TEST_REPORT.md`
- `docs/v2/V2_EVIDENCE_AUDIT_TEST_REPORT.md`
- `docs/v2/V2_VISUAL_REFERENCE_COVERAGE_REPORT.md`
- `docs/v2/V2_DEMO_SCRIPT.md`
- `docs/v2/V2_KNOWN_LIMITATIONS.md`
