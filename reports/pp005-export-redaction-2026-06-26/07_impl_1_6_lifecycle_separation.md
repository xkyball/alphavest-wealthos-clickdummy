# PP005 IMPL-1.6 — Preview / Approval / Generation / Download-Share Lifecycle Separation

Status: COMPLETE_ZERO_DELTA_PRODUCT_CODE

## Ticket

Implement and verify that preview, approval, package generation, download and share remain separate gated export lifecycle states.

## Detailed Description

PP005 requires export lifecycle separation so that a redacted preview cannot be treated as approval, approval cannot be treated as package generation, generation cannot be treated as download/share and download/share cannot be treated as client acceptance. Share must require explicit share intent after controlled download.

## Execution

- Inspected `lib/export-workflow-command-service.ts`.
- Inspected `lib/domain-types.ts`.
- Inspected `lib/route-registry.ts`.
- Inspected `docs/00-current/ALPHAVEST_WP07_EXPORT_REDACTION_CLIENT_SAFE_PACKAGE_EXECUTION.md`.
- Verified that route `057` remains `/export/:id/approval` with title `Export Preview`; this is documented as acceptable Option A naming drift while semantics remain separated.
- No product-code change was required.

## Validation

Command:

```bash
pnpm playwright test tests/export-workflow-api.spec.ts tests/file-export-realism.spec.ts tests/phase8-export-workflow-api.spec.ts tests/p44-phase8-certification.spec.ts tests/true-ux-export-scope-redaction-approval.spec.ts --workers=1
```

Result:

- PASS: 43 passed.

Positive acceptance:

- Safe export can progress through separate scope, redaction, preview, approval, generation, download and share stages.
- Metadata-only package generation requires approval.
- Download requires generated state.
- Share requires downloaded state and explicit external-share controls.
- UI/service truth copy keeps preview, approval, generation, download and share separate.

Negative acceptance:

- Preview-only state cannot download/share.
- Approval without preview is denied.
- Generation cannot skip redaction preview and approval.
- Share before download is denied.
- Forbidden payload classifications fail before preview/package/download.

## Proof

- `tests/export-workflow-api.spec.ts`
- `tests/file-export-realism.spec.ts`
- `tests/phase8-export-workflow-api.spec.ts`
- `tests/p44-phase8-certification.spec.ts`
- `tests/true-ux-export-scope-redaction-approval.spec.ts`

## Deviations / Blockers

- No blocker.
- Route `057` literal path remains `/export/:id/approval`, not `/export/:id/preview`. This was not changed because Option A does not authorize route evolution and current semantics pass.

## Next Ticket

Proceed to PP005 IMPL-1.7 audit persistence and fail-closed export controls.
