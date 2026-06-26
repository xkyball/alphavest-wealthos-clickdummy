# Data Maintenance Command Migration

Date: 2026-06-26
Branch: `full-workflow`

## Scope

Migrate J04 document maintenance, J05 entity/action maintenance and J09 profile/family/relationship maintenance from `/api/demo-workflow` and `runScreencastDemoAction` into a typed data-maintenance command surface.

## Result

- Added `/api/data-maintenance/actions` as the canonical typed command route for J04/J05/J09.
- Added `lib/data-maintenance-action-contract.ts`, `lib/data-maintenance-command-client.ts` and `lib/data-maintenance-workflow-actions.ts`.
- Rewired Client Intake and Wealth Actions controls to `runDataMaintenanceCommand`.
- Reclassified J04/J05/J09 in the demo-workflow registry as moved typed product commands.
- Removed the old J04/J05/J09 handler branches and switch cases from `/api/demo-workflow`.
- Updated capture model context and report drift gates to include `/api/data-maintenance/actions`.

## Safety Boundary

J04/J05/J09 commands remain no-advice and no-client-release. `/api/demo-workflow` returns fail-closed `410` responses for those action IDs and points to `/api/data-maintenance/actions`.

J02/J03 remain intentionally unmigrated until the Advice/Release-History boundary is cut separately.

## Proof

```text
pnpm guard:source
pnpm db:validate
pnpm typecheck
pnpm gate:capability-report
pnpm exec playwright test tests/data-maintenance-actions-api.spec.ts tests/data-maintenance-command-client-source.spec.ts tests/demo-workflow-action-registry.spec.ts tests/demo-workflow-api.spec.ts tests/capture-screen-model-context.spec.ts tests/capability-report-drift-gate.spec.ts --workers=1
pnpm exec playwright test tests/export-approval-lifecycle.spec.ts tests/export-download-confirmation-lifecycle.spec.ts tests/invite-user-drawer-lifecycle.spec.ts tests/role-drawer-confirmation-lifecycle.spec.ts tests/access-request-drawer-lifecycle.spec.ts tests/tenant-governance-actions-api.spec.ts tests/platform-admin-actions-api.spec.ts tests/platform-admin-command-client-source.spec.ts tests/platform-admin-browser-runtime.spec.ts --workers=1
```

Result: PASS.

## Next Recommendation

Do not stabilize J02/J03 on `/api/demo-workflow`. Cut Advice/Release-History into a typed command surface first, then migrate those remaining product-like actions and retire their screencast client calls.
