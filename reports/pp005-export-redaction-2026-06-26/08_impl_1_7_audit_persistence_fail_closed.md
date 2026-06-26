# PP005 IMPL-1.7 — Audit Persistence And Fail-Closed Export Controls

Status: COMPLETE_ZERO_DELTA_PRODUCT_CODE

## Ticket

Verify fail-closed UI/API feedback and audit event persistence for export scope, redaction, approval, download and share.

## Detailed Description

PP005 requires sensitive export actions to fail closed unless the correct scope, role/action/object/payload gates and audit persistence are present. Export workflow errors must not leak hidden rows or imply approval/download. Audit events must persist for state-changing export commands.

## Execution

- Inspected `app/api/export-workflow/route.ts`.
- Inspected `lib/export-workflow-command-service.ts`.
- Inspected `lib/export-service.ts`.
- Inspected audit and fail-closed coverage in:
  - `tests/file-export-realism.spec.ts`
  - `tests/phase8-export-workflow-api.spec.ts`
  - `tests/p44-phase8-certification.spec.ts`
- No product-code change was required.

## Validation

Initial diagnostic command:

```bash
pnpm playwright test tests/file-export-realism.spec.ts tests/phase8-export-workflow-api.spec.ts tests/p44-phase8-certification.spec.ts --grep "audit|fail-closed|invalid|records|links|persistence" --workers=1
```

Diagnostic result:

- FAIL: the filtered P44 selection skipped predecessor tests that initialize ordered fixture state, leaving `exportRequestId` empty.
- Classification: test-harness selection issue, not product failure.

Authoritative ordered command:

```bash
pnpm playwright test tests/file-export-realism.spec.ts tests/phase8-export-workflow-api.spec.ts tests/p44-phase8-certification.spec.ts --workers=1
```

Result:

- PASS: 35 passed.

Positive acceptance:

- Export command audit events persist with actor, role, previous state and next state.
- Approval, download and share audit events are linked end-to-end.
- Service read model is declared as API truth instead of demo fallback proof.
- Share before download is blocked and share after controlled download is permitted and audited.

Negative acceptance:

- Invalid export command requests fail closed.
- Invalid read-model scope returns a fail-closed API envelope.
- Audit persistence unavailable blocks package generation.
- Admin role alone cannot force approval.
- Legacy demo workflow export approval simulation remains retired.

## Proof

- `app/api/export-workflow/route.ts`
- `lib/export-workflow-command-service.ts`
- `lib/export-service.ts`
- `tests/file-export-realism.spec.ts`
- `tests/phase8-export-workflow-api.spec.ts`
- `tests/p44-phase8-certification.spec.ts`

## Deviations / Blockers

- No product blocker.
- Test maintainability note: `tests/p44-phase8-certification.spec.ts` contains ordered shared fixture state. A future cleanup should split fixture setup from test order so filtered P44 runs are reliable.

## Next Ticket

Proceed to PP005 IMPL-1.8 UX feedback and no-overclaim wording.
