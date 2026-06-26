# IMPL-1.5 - Redaction and Forbidden Payload Enforcement & Tests

Generated: 2026-06-26

Status: `COMPLETE_ZERO_DELTA_PRODUCT_CODE`

Source ticket: `IMPL-1.5`

## Task

Implement or harden redaction enforcement so forbidden internal payloads are excluded or redacted from export preview and package generation.

## Execution Result

No product-code change was needed.

The current repository already satisfies the IMPL-1.5 contract through:

- `lib/av27-phase6-payload-contract.ts` defining the forbidden payload dictionary;
- `lib/export-service.ts` classifying AI draft, internal rationale, compliance notes, unreleased evidence, unreleased recommendation and hidden fields as forbidden export payloads;
- `lib/export-workflow-command-service.ts` applying payload inspection before preview, approval and generation;
- `lib/export-package-service.ts` blocking forbidden package classifications;
- UI/source assertions showing export is a client-safe projection rather than raw data.

## Subtasks

| Subtask | Status | Evidence |
| --- | --- | --- |
| 1.5.1 Forbidden internal payload dictionary enforcement | `ALREADY_PRESENT_VERIFIED` | `av27Phase6PayloadFieldClassifications`, `inspectAv27Phase6ClientPayload`, `exportService.inspectClientExportPayload`, command-spine validation. |
| 1.5.2 Redaction leakage negative tests | `ALREADY_PRESENT_VERIFIED` | Export safety, True-UX export boundary and AV27 payload sweep tests pass. |

## Tests Run

```bash
pnpm playwright test tests/export-safety.spec.ts tests/true-ux-export-scope-redaction-approval.spec.ts tests/av27-phase6-payload-contract.spec.ts --workers=1
```

Result:

- PASS, 7 passed.
- Note: `tests/av27-phase6-payload-contract.spec.ts` is not present in this checkout; Playwright ran the matching available export safety and True-UX export tests.

Corrected payload sweep command:

```bash
pnpm playwright test tests/av27-phase6-payload-sweep.spec.ts --workers=1
```

Result:

- PASS, 5 passed.

Covered proof:

- export generation requires scope, redaction, approval, audit and package controls;
- forbidden internal payload and preview-only generation are blocked;
- omitted redaction profile blocks generation;
- forbidden projection fields and package classifications are blocked;
- AI/rules drafts remain internal across client and export payloads;
- only released client-safe recommendation/decision payloads are projected;
- forbidden internal payloads are excluded from export surfaces.

## Acceptance Check

| Acceptance | Result |
| --- | --- |
| Forbidden internal payloads excluded/redacted in preview/package data | PASS |
| Tests assert payload content, not only UI labels | PASS |
| Redaction failure blocks export | PASS |
| Success messages do not imply unverified redaction | PASS |

## Residual Risk

Current PP-005 first wave remains metadata-only package proof. Real binary package generation, storage retention, content inspection and download semantics remain out of scope unless a later decision authorizes them.

## Result

`IMPL-1.5_COMPLETE`

Next ticket in uploaded order: `IMPL-1.6`.
