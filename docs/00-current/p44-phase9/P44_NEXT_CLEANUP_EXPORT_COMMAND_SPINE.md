# P44 Next Cleanup - Export Command Spine

Generated: 2026-06-25

## Directive

`max`

Make `lib/export-workflow-command-service.ts` the single export command spine and retire/merge the older AV27, WP10 and export proof families behind it.

## Implemented Slice

- `lib/export-workflow-command-service.ts` now publishes the canonical export command spine contract:
  - canonical service: `lib/export-workflow-command-service.ts`
  - canonical API route: `/api/export-workflow`
  - command stages: `SET_SCOPE`, `VALIDATE_REDACTION`, `PREVIEW`, `APPROVE`, `GENERATE`, `DOWNLOAD`, `SHARE`
  - expected audit events: `export.workflow.*`
- AV27 payload proof, AV27 payload sweep, WP10 export UX prompt, WCL export safety, file export realism, Phase 8 certification and demo-workflow export compatibility are explicitly classified behind the command spine.
- `lib/p44-phase8-export-command-closure.ts` now attaches every Phase 8 ticket evidence row to the command spine, even where the changed target files are helper modules.
- `tests/export-command-spine-contract.spec.ts` fails if another export proof family becomes command authority or points away from `/api/export-workflow`.

## Authority Model

| Family | Authority |
| --- | --- |
| `EXPORT_WORKFLOW_COMMAND_SERVICE` | `COMMAND_SPINE` |
| `P44_PHASE8_EXPORT_CLOSURE` | `HELPER_ATTACHMENT` |
| `WP10_EXPORT_SCOPE_REDACTION_APPROVAL_UX` | `LEGACY_REFERENCE_ONLY` |
| `AV27_PHASE6_PAYLOAD_CONTRACT` | `HELPER_ATTACHMENT` |
| `AV27_PHASE7_PAYLOAD_SWEEP` | `HELPER_ATTACHMENT` |
| `WCL_EXPORT_SAFETY` | `HELPER_ATTACHMENT` |
| `FILE_EXPORT_REALISM` | `HELPER_ATTACHMENT` |
| `DEMO_WORKFLOW_EXPORT_COMPATIBILITY` | `COMPATIBILITY_ADAPTER` |

## Non-Goals

- No schema change.
- No UI change.
- No route behavior change.
- No removal of existing helper tests.

## Bold Recommendation

The next cut should remove export semantics from `/api/demo-workflow` entirely and leave it as a compatibility shell that delegates to `/api/export-workflow` or the typed command bus. Keeping export-shaped branches in the old mutation path is now the largest remaining place for duplicate export truth to reappear.
