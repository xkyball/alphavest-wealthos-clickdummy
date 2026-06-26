# P44 Next Cleanup - ReleaseSpine Command Surface

Generated: 2026-06-25

## Directive

`max`

Collapse the scattered compliance release checks into one typed `ReleaseSpine` command surface.

Advisor, compliance, rationale, evidence sufficiency, data quality and export should feed one canonical release-precondition object instead of re-deriving release readiness in separate modules.

## Implemented First Slice

Added a pure typed release spine:

- `lib/release-spine-command-surface.ts`
- `tests/release-spine-command-surface.spec.ts`

This first slice does not change routes, schema or existing mutation behavior. It creates a canonical typed precondition object and proves that existing advisor, evidence, rationale, audit, compliance, data-quality and export blockers can feed the same release spine.

## Canonical Object

The release spine now produces `CanonicalReleasePreconditions` with:

- `advisorApproved`
- `evidenceSufficient`
- `evidenceMissing`
- `permissionAllowed`
- `rationaleCaptured`
- `payloadReady`
- `redactionReady`
- `auditPersistenceAvailable`
- `dataQualityReady`
- `exportApprovalComplete`
- `exportRedactionReady`
- `exportTargetSelected`
- `exportPayloadClean`
- `canRelease`
- `canExportAfterRelease`
- `missing`

## Why This Matters

Before this cleanup, release readiness was re-derived across several places:

- `workflowGate.canPassComplianceReleaseGate`
- `evaluateP44ComplianceReleasePreconditions`
- `exportService.canGenerateExport`
- `runAdvisorApprovalWorkflowMutation`
- `deleted generic workflow route`
- journey and UI guard helpers

That fragmentation lets old safety debt hide in tiny semantic differences. One module might check advisor approval and evidence, another might check audit persistence, another might check export redaction, while each caller believes it has the release truth.

## Next Migration Ticket

`P44-RELEASE-SPINE-02`

Promote `ReleaseSpine` from pure typed surface to canonical release-readiness dependency.

### Scope

- Make Phase 7 compliance release call `ReleaseSpine` for release preconditions.
- Make workflow gate compliance release delegate to `ReleaseSpine` or share its canonical object.
- Make export readiness consume `canExportAfterRelease` plus export-stage-specific checks.
- Make `deleted generic workflow route` return the canonical `releasePreconditions` object rather than its private shape.
- Keep advisor review commands unable to set `canRelease` by themselves.

### Acceptance

- No module re-derives release readiness from raw booleans when a `CanonicalReleasePreconditions` object is available.
- Advisor approval is necessary but not sufficient.
- Evidence sufficiency, rationale, permission, audit persistence, data quality, redaction and payload safety all feed one `missing` list.
- Export readiness is derived from release readiness plus explicit export stage checks.
- Existing Phase 7, Phase 8 and Phase 9 certification tests keep passing.

### Negative Acceptance

- No advisor command can return `canRelease=true` unless the ReleaseSpine object also passes.
- No export command can infer readiness from generic workflow state.
- No compliance route can report ready if the canonical object contains missing preconditions.
- No compatibility adapter may define its own release-precondition shape after migration.

## Bold Recommendation

Make `ReleaseSpine` the only place that names release readiness.

Do not keep `ReleaseSpine` as a helper while old modules keep their own parallel truth. The end state should be: advisor/compliance/rationale/evidence/data-quality/export feed `ReleaseSpine`; UI/API/export surfaces read its canonical result; Phase 9 certification blocks any optimistic release label that bypasses it.
