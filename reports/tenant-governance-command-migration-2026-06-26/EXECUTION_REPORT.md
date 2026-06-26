# Tenant Governance Command Migration

Date: 2026-06-26

## Ticket

Migrate J06/J07 radically before J01-J03: build a typed tenant-governance command surface for tenant, user, role and governance actions, then remove the matching `runScreencastDemoAction` usage from Admin, Governance and Export-Ops screens.

## Result

Status: implemented and validated.

## Changes

- Added `/api/tenant-governance/actions` as the typed command endpoint for:
  - `j06.newTenant`
  - `j06.continueTenant`
  - `j06.assignTeam`
  - `j06.openInvitation`
  - `j06.sendInvitation`
  - `j07.inviteUser`
  - `j07.sendInvitation`
  - `j07.saveRoleChanges`
  - `j07.approveAccess`
  - `j07.exportAudit`
- Added `lib/tenant-governance-workflow-actions.ts` with explicit command IDs and a no-client-release response envelope.
- Added `lib/tenant-governance-command-client.ts`.
- Removed J06/J07 handlers and switch cases from `/api/demo-workflow`.
- Reclassified J06/J07 action IDs as moved typed product commands with canonical route `/api/tenant-governance/actions`.
- Replaced J06/J07 `runScreencastDemoAction` calls in:
  - `components/admin-tenant-setup-screen.tsx`
  - `components/decisions-governance-screen.tsx`
  - `components/communication-export-ops-screen.tsx`
- Updated capture model context and capability drift gate to include the new typed route.

## Acceptance

Positive acceptance target:

- J06/J07 run through `/api/tenant-governance/actions`.
- `/api/demo-workflow` returns 410 for J06/J07 with `TENANT_GOVERNANCE_ACTIONS_MOVED`.
- Admin/Governance/Export-Ops have no J06/J07 `runScreencastDemoAction` calls.
- Capture/report drift gates include `/api/tenant-governance/actions`.

Negative acceptance target:

- Unsupported tenant-governance action IDs fail closed without command execution.
- No advice execution or client release is created by tenant-governance commands.
- J01-J03 remain intentionally untouched for the later Advice/Release-history migration.

## Deviations

The typed command service still reuses `runDemoWorkflowMutation` for the existing permission/audit transaction spine. This avoids inventing a second audit writer in this slice, while the public API and UI client are now tenant-governance typed instead of demo-workflow typed. A future hardening slice can rename or split the lower-level transaction helper once the remaining demo-only families are migrated.

## Screenshot

No screenshot is attached for this slice because no visual layout or UI state changed. The changed UI files only swap command clients behind existing controls.

## Validation

- `pnpm guard:source` - PASS before implementation.
- `pnpm typecheck` - PASS.
- `pnpm gate:capability-report` - PASS.
- `pnpm exec eslint app/api/tenant-governance/actions/route.ts lib/tenant-governance-action-contract.ts lib/tenant-governance-workflow-actions.ts lib/tenant-governance-command-client.ts lib/admin-tenant-readmodel-service.ts lib/demo-workflow-action-registry.ts lib/capability-report-drift-gate.ts lib/capture-screen-model-context.ts app/api/demo-workflow/route.ts tests/tenant-governance-actions-api.spec.ts tests/demo-workflow-api.spec.ts tests/demo-workflow-action-registry.spec.ts tests/capture-screen-model-context.spec.ts tests/dbtf-tables-api.spec.ts tests/invite-user-drawer-lifecycle.spec.ts` - PASS.
- `pnpm playwright test tests/tenant-governance-actions-api.spec.ts` - PASS.
- `pnpm playwright test tests/demo-workflow-action-registry.spec.ts tests/capture-screen-model-context.spec.ts tests/capability-report-drift-gate.spec.ts tests/demo-workflow-api.spec.ts --grep "moves typed product command families|legacy demo workflow retires tenant governance|legacy demo workflow retires Phase B/C|keeps executable demo workflow|blocks unregistered|normal screen capture model context|capability report drift gate"` - PASS.
- `pnpm playwright test tests/dbtf-tables-api.spec.ts --grep "surfaces J06 tenant wizard mutations"` - PASS.
- `pnpm playwright test tests/invite-user-drawer-lifecycle.spec.ts --grep "invite drawer source"` - PASS.
- `rg -n "runScreencastDemoAction\\(\\\"j06\\.|runScreencastDemoAction\\(\\\"j07\\.|runJ06|runJ07|case \\\"j06\\.|case \\\"j07\\." app/api/demo-workflow/route.ts components tests lib/demo-workflow-action-registry.ts || true` - PASS with no matches.
- `git diff --check` - PASS.
