# Platform Admin Command Migration

Date: 2026-06-26

## Ticket

Migrate J10 Platform/Security radically: do not stabilize the legacy demo path; build a typed `platform-admin` command surface and remove matching `runScreencastDemoAction` calls from Admin. Leave J01-J03 untouched until the Advice/Release-history migration is cut separately.

## Result

Status: implemented and validated.

## Changes

- Added `/api/platform-admin/actions`.
- Added explicit platform-admin action and command contract:
  - `j10.savePlatform` -> `PLATFORM_SAVE_SETTINGS`
  - `j10.viewAudit` -> `PLATFORM_VIEW_AUDIT`
  - `j10.reviewPermission` -> `PLATFORM_REVIEW_PERMISSION`
  - `j10.saveSecurity` -> `PLATFORM_SAVE_SECURITY`
- Added platform-admin client and workflow service.
- Removed J10 `runScreencastDemoAction` usage from `components/admin-tenant-setup-screen.tsx`.
- Reclassified J10 action IDs as moved typed product commands with canonical route `/api/platform-admin/actions`.
- Updated capture model context and capability drift gate so generated reports must include the typed platform-admin route.

## Acceptance

Positive acceptance target:

- J10 runs through `/api/platform-admin/actions`.
- `/api/demo-workflow` returns 410 for J10 with `PLATFORM_ADMIN_ACTIONS_MOVED`.
- Admin platform/security controls no longer call `runScreencastDemoAction`.
- Capture/report drift gates include `/api/platform-admin/actions`.

Negative acceptance target:

- Unsupported platform-admin action IDs fail closed without command execution.
- Platform-admin commands create no advice execution, no export approval and no client release.
- J01-J03 remain intentionally untouched.

## Deviations

The platform-admin service records typed audit-backed commands rather than mutating a new persistent platform-settings table. This matches current schema reality: prior J10 behavior had no real demo-workflow handler, and existing P44 platform/security functions are audit-backed configuration closures rather than broad product settings persistence. The typed route is now the canonical surface for these controls and can be deepened later if a real settings table is authorized.

## Screenshot

No screenshot is attached for this slice because no visible layout changed. Existing controls now call a typed command client.

## Validation

- `pnpm guard:source` - PASS before implementation.
- `pnpm typecheck` - PASS.
- `pnpm gate:capability-report` - PASS.
- `pnpm exec eslint app/api/platform-admin/actions/route.ts lib/platform-admin-action-contract.ts lib/platform-admin-command-client.ts lib/platform-admin-workflow-actions.ts lib/demo-workflow-action-registry.ts app/api/demo-workflow/route.ts components/admin-tenant-setup-screen.tsx tests/platform-admin-actions-api.spec.ts tests/platform-admin-command-client-source.spec.ts tests/demo-workflow-action-registry.spec.ts tests/demo-workflow-api.spec.ts tests/capture-screen-model-context.spec.ts lib/capture-screen-model-context.ts lib/capability-report-drift-gate.ts` - PASS with pre-existing Admin screen warnings only.
- `pnpm playwright test tests/platform-admin-actions-api.spec.ts tests/platform-admin-command-client-source.spec.ts tests/demo-workflow-action-registry.spec.ts tests/capture-screen-model-context.spec.ts tests/capability-report-drift-gate.spec.ts tests/demo-workflow-api.spec.ts --grep "platform admin|moves typed product command families|legacy demo workflow retires platform admin|normal screen capture model context|capability report drift gate"` - PASS.
- `git diff --check` - PASS.
- Hard source proof: no real `runScreencastDemoAction("j10...")`, `runJ10`, or `case "j10...` remains in Admin/demo-workflow sources; only the negative source assertion mentions the old string.
