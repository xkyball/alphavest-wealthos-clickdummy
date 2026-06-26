# PP005 QA-1.10 — Integrated Validation

Status: COMPLETE

## Ticket

Run integrated PP005 validation across export scope, redaction, lifecycle, audit, UI wording, canonical API directness and repository-wide finish gates.

## Detailed Description

PP005 QA must prove that the approved Option A implementation is client-safe, fail-closed, command-spine direct and lifecycle-separated. It must also distinguish PP005 acceptance from adjacent baseline warnings or unrelated harness failures.

## Execution

- Re-ran the mandatory source guard.
- Ran the integrated PP005 Playwright suite.
- Ran the broad phase finish gate.
- No product-code change was required.
- No screenshot was produced because this QA ticket made no UI implementation change.

## Validation

Source guard:

```bash
pnpm guard:source
```

Result:

- PASS: 0 violations.

Integrated PP005 suite:

```bash
pnpm playwright test tests/export-command-spine-contract.spec.ts tests/export-safety.spec.ts tests/file-export-realism.spec.ts tests/export-workflow-api.spec.ts tests/phase8-export-workflow-api.spec.ts tests/true-ux-export-scope-redaction-approval.spec.ts tests/true-ux-api-service-ui-truth.spec.ts tests/true-ux-no-overclaim-copy.spec.ts --workers=1
```

Result:

- PASS: 37 passed.

Broad finish gate:

```bash
pnpm phase:check
```

Result:

- PASS.
- `typecheck`: passed.
- `lint`: passed with 22 warnings.
- `db:validate`: passed.
- `build`: passed.

## Positive Acceptance

- Canonical export command spine is `/api/export-workflow` plus `lib/export-workflow-command-service.ts`.
- Export scope and package generation require object scope, redaction, approval, audit and safe package controls.
- Forbidden internal payload classifications fail closed.
- Preview, approval, generation, download and share remain separate.
- Audit persistence is required before generation and state-changing command proof is linked.
- Demo workflow export action is retired and points to `/api/export-workflow`.
- UI wording remains no-overclaim and client-safe.

## Negative Acceptance

- Preview cannot approve/download/share.
- Missing redaction profile blocks generation.
- Missing approval blocks generation/download/share.
- Audit persistence unavailable blocks package generation.
- Share before download is denied.
- Legacy demo export approval simulation returns `410` and does not mutate.
- Invalid export workflow scope returns a fail-closed envelope.

## Baseline Warnings

`pnpm phase:check` passed with warnings only:

- 22 existing ESLint unused-symbol warnings across UI and capture modules.
- Next/Turbopack build warnings about broad dynamic filesystem tracing in `lib/document-storage-adapter.ts`.
- Custom Babel configuration removal warning.

## Deviations / Blockers

- No PP005 blocker.
- Adjacent diagnostic failure remains documented in IMPL-1.8: two broader `confirmation-lifecycle.spec.ts` cases timed out waiting for `/api/demo-workflow`. PP005-specific suites passed.

## Next Ticket

Proceed to PP005 DECISION-1.11 closure.
