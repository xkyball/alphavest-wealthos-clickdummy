# IMPL-1.4 - Forbidden Internal Payload Dictionary & Redaction Map

Generated: 2026-06-26

Task: `IMPL-1.4 Forbidden Internal Payload Dictionary & Redaction Map`

Status: `COMPLETE`

## Subtask Status

| Subtask | Status | Output |
|---|---|---|
| `IMPL-1.4.1 Classify internal-only draft/rationale/assumption/confidence fields` | Complete | `lib/pp003-advice-boundary-contract.ts` now contains a PP003 field classification register. |
| `IMPL-1.4.2 Map forbidden payloads to client/API/export surfaces` | Complete | Same module now contains the surface redaction matrix and payload surface inspector. |

## Implementation Summary

Added one code-level PP003 contract instead of another report-only list:

- `Pp003AdviceBoundaryClass`
- `Pp003Surface`
- `pp003FieldClassificationRegister`
- `classifyPp003AdviceBoundaryField`
- `pp003SurfaceRedactionMatrix`
- `pp003SurfaceRuleForField`
- `inspectPp003PayloadSurface`

The register classifies AI drafts, internal rationale, internal assumptions, unsupported claims, compliance notes, audit details, internal evidence details, unreleased recommendations, technical fields and client-safe candidates. Unknown PP003-adjacent fields return `REQUIRES_DECISION`.

## Surface Behaviour

| Surface | Behaviour |
|---|---|
| `internal_workbench` | Allows known internal-only fields as internal-only. Blocks unknown fields. |
| `client_portal_mobile` | Allows client-safe candidates only; hides/redacts internal fields. |
| `client_api` | Allows client-safe candidates only; hides/redacts internal fields. |
| `decision_projection` | Allows client-safe candidates; hides draft/rationale/compliance fields; redacts audit/evidence internals. |
| `export_candidate` | Allows client-safe candidates only; blocks internal fields. |
| `demo_workflow_response` | Allows safety signal `noClientRelease`; hides internal fields. |

## Validation

| Command | Result |
|---|---|
| `pnpm playwright test tests/pp003-advice-boundary-contract.spec.ts --workers=1` | PASS, 6 passed |
| `pnpm playwright test tests/pp001-payload-visibility-contract.spec.ts tests/internal-draft-governance-spine.spec.ts tests/pp003-advice-boundary-contract.spec.ts --workers=1` | PASS, 10 passed |
| `pnpm typecheck` | PASS |
| `pnpm db:validate` | PASS |
| `pnpm guard:source` | PASS, 0 violations |

## Notes

- No Prisma schema change.
- No route change.
- No UI change.
- No screenshot required.
- No production AI, PP004 release or PP005 export implementation was introduced.
