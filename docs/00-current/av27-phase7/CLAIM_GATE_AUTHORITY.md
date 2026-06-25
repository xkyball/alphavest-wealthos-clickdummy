# AV27 Claim Gate Authority

Date: 2026-06-25
Status: `CODE_CANONICAL`

## Canonical Rule

`lib/av27-phase7-certification.ts` is the only canonical source for future AV27 Phase 7 status claims.

Reports may quote the gate result, but they may not promote a row, downgrade a blocker or invent completion language independently from the executable gate.

Future AV27 completion claims must pass:

```bash
pnpm test:av27:claims
```

## I-001 Promotion Lock

`I-001` remains `PARTIAL_WITH_REASON` until a real `DecisionCreationService` or equivalent service exists and is proven.

Promotion requires all of the following:

- Service/API implementation proof for decision creation from an allowed released context.
- Positive creation proof showing persisted actor, tenant, object context and audit event.
- Negative proof for unreleased draft context.
- Negative proof for missing-audit denial.
- Updated AV27 P0 matrix proof in `lib/av27-phase7-certification.ts`.

Report wording, claim-pack language or manually edited status tables are not sufficient promotion proof.

## Playwright Suite Separation

Use the no-server contract suite for service, matrix and policy proof:

```bash
pnpm test:av27:no-server
```

Use the server-required suite for API/UI proof:

```bash
pnpm test:av27:server
```

Do not mix `tests/av27-client-context-closure.spec.ts` or `tests/demo-workflow-api.spec.ts` into no-server AV27 commands. Those API suites require the Playwright web server, and the old mixed shape caused the previous `ECONNREFUSED` orchestration failure.
