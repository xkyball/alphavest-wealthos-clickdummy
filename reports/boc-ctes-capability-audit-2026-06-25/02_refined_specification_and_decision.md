# Refined Specification and Decision Note

Generated: 2026-06-25

Task status:
- SPEC-1: FINISHED
- DECISION-1: APPLIED WITHOUT STOP

## Generated Inputs Used

| Input | Role |
| --- | --- |
| `00_blueprint_task_register.md` | Extracted task/dependency/DoD/stop-rule contract. |
| `01_executed_analysis_result.md` | Current repo evidence and classification basis. |

No earlier accepted BOC/CTES process-chain artefact was found in the repository. No unrelated legacy planning document was used as specification authority.

## Applied Decision

The blueprint asks for human approval of target codebase, report format, detail depth and completeness definition. This run did not stop because the thread already supplied target repo/source-scope constraints and requested execution. The clean default below is reversible and keeps legacy debt out of the report.

Decision:
- Target: current repository `/Users/chris/projects/alphavest-wealthos-clickdummy`
- Branch/snapshot: current `full-workflow` worktree at baseline commit `c24972d`
- Format: Markdown report package in `reports/boc-ctes-capability-audit-2026-06-25/`
- Detail depth: technical audit plus executive summary
- Evidence model: code/test/config/git evidence only, plus generated artefacts in this chain
- Complete vertical slice label requires all six evidence classes: UI action/input, API or service handler, DB persistence or durable state transition, workflow/output effect, security/validation/audit behavior, and test/proof coverage

Aggressive recommendation applied:
- Prefer strict evidence labels over flattering broad completeness claims.
- Mark demo/static/reference surfaces as partial or UI-only unless code proves mutation and state propagation.
- Treat metadata-only export as an honest bounded implementation, not as binary export completion.
- Generate follow-up backlog only after this report is accepted.

## Report Taxonomy

| Label | Meaning |
| --- | --- |
| COMPLETE_VERTICAL_SLICE | UI/action plus API/service plus DB/state plus workflow/output plus guard/audit plus test proof are all evidenced. |
| PARTIAL_VERTICAL_SLICE | More than one layer is implemented, but at least one required completeness layer is missing, static, untested or unverified. |
| BACKEND_VERTICAL_SLICE | API/service/DB/guard/test evidence exists, but UI command integration was not proven. |
| UI_ONLY_OR_STATIC | Visible UI exists, but mutation/persistence/workflow proof is absent or intentionally held. |
| BACKEND_ONLY_READMODEL | DB-backed read or projection exists but no user-editing workflow is proven. |
| TESTED_GUARD | The main implemented value is safety, denial, no-leakage, validation or audit behavior. |
| UNPROVEN | Surface exists or is named, but current process did not collect enough evidence. |

## Evidence Requirements

Every capability row must include:
- Code path evidence.
- Input evidence.
- Output/state evidence.
- Security/validation/audit evidence.
- Test/proof evidence or explicit proof gap.
- Residual risk.

## QA Requirements

Minimum validation for this report:
- Source guard: `pnpm guard:source`
- Prisma/schema validation: `pnpm db:validate`
- Focused tests matching core audited slices:
  - `pnpm test:source-reality`
  - `pnpm test:document-upload-api`
  - `pnpm exec playwright test tests/dbtf-tables-api.spec.ts --workers=1`
  - `pnpm exec playwright test tests/journey-api.spec.ts --workers=1`
  - `pnpm exec playwright test tests/export-workflow-api.spec.ts --workers=1`
  - `pnpm test:permissions`

Full validation is stronger but not required for the first audit package because the blueprint asks for report execution, not release certification.

## Implementation Boundaries

- Product-code delta is expected to be zero.
- Do not change schema, migrations, UI routes or tests to improve the report.
- Do not use screenshots as proof of persistence unless paired with API/DB/test evidence.
- Do not create follow-up implementation tasks as product work until DECISION-2 acceptance.
- Do not import unrelated legacy docs as truth.

## Stop Rules for Later Reruns

- Stop if a requested completeness claim cannot be evidenced.
- Stop if newer human decision contradicts this decision note.
- Stop if a code path is materially changed during validation by someone else and affects conclusions.
- Stop if focused validation fails in a way that invalidates a COMPLETE_VERTICAL_SLICE claim.
