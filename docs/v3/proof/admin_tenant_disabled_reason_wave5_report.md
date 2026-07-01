# Admin Tenant Disabled Reason Wave 5 Report

Date: 2026-07-01

## Scope

Wave 5 hardened the admin tenant directory as a role- and tenant-scoped product surface. The visible CSV export boundary no longer exposes an implementation blocker and the related tenant-user table now projects backend pagination metadata instead of hiding the DB-backed data-surface proof.

Changed surfaces:

- `/admin/tenants`: CSV export control now says `CSV export unavailable` and explains that export requires an approved audit export request plus selected tenant scope.
- `/tenants/demo/users`: tenant-user table now uses backend pagination metadata and full returned rows instead of local slicing with no pagination footer.

## Method Notes

- Psycho-Logic: platform admins need a legitimate reason why a sensitive tenant export is unavailable, not a hint that the workflow is unfinished.
- TRIZ: keep export blocked while improving trust and clarity.
- SIT Closed World: reused the existing blocked-control and `DataTable` pagination primitives.
- SCAMPER: substituted implementation language, adapted the tenant directory pagination pattern, eliminated local row slicing.
- Harvard/BATNA: no new export workflow was invented; the fair alternative is an explicitly approved audit-export request.
- V3 adversarial check: `/admin/tenants` is accepted as the primary visual proof; `/tenants/demo/users` is accepted for backend-pagination truth but remains a longer scrolling access page.

## Validation

Positive:

- `pnpm guard:source` passed.
- `pnpm typecheck` passed.
- `pnpm exec eslint components/admin-tenant-setup-screen.tsx tests/disabled-control-a11y-messaging.spec.ts` passed with two existing warnings.
- `pnpm playwright test tests/disabled-control-a11y-messaging.spec.ts -g "disabled table row actions" --workers=1` passed.
- `pnpm playwright test tests/filter-affordance-pruning.spec.ts -g "tenant filters" --workers=1` passed.
- `pnpm playwright test tests/sort-affordance-pruning.spec.ts -g "tenant table sort" --workers=1` passed.
- `pnpm playwright test tests/e11-backend-data-surface-truth.spec.ts -g "admin tenant surfaces" --workers=1` passed.
- `pnpm build` passed.
- Screenshot metrics for `/admin/tenants` at `1400x900` and `390x844`: no horizontal overflow, no generic typed-workflow disabled reason, CSV boundary visible and non-interactive, backend pagination present.

Negative / residual:

- Full `pnpm lint` remains blocked by unrelated existing errors in `client-intake-screen.tsx`, `decisions-governance-screen.tsx`, and `wealth-actions-screen.tsx`.
- `/tenants/demo/users` now exposes backend pagination but remains a vertically long access-management page at `1400x900`; it is not claimed as a no-scroll primary task proof in this wave.
- Additional `Blocked until a typed workflow command is implemented.` occurrences remain outside this Admin Tenant slice.

## Proof Artefacts

- Desktop contact sheet: `artifacts/screenshots/admin-tenant-disabled-reason-wave5/desktop-contact-sheet.png`
- Metrics JSON: `artifacts/screenshots/admin-tenant-disabled-reason-wave5/metrics.json`

Screenshot artefacts are intentionally not part of the commit scope unless explicitly requested.
