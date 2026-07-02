# AlphaVest profile/auth/admin navigation slice - 2026-07-02

## Scope
- Stabilized authenticated profile/admin user access work around DB-JWT auth, invite lifecycle and private profile image storage.
- Reframed the Tenant Users surface from admin mechanics to workspace access outcomes.
- Renamed primary navigation labels from architecture phases to user jobs without changing route IDs, paths, role filtering or workset classification.

## Engine V2 application summary
- Psycho-Logic: users need to immediately understand what value the screen creates: who can work, who is onboarding, where risk or waiting exists and what action is legitimate next.
- Map/Model audit: old labels such as Foundation and Evidence Lifecycle exposed the implementation map. New labels use task language: Set up access, Know the client, Collect evidence, Prepare advice, Review advice, Release safely, Record decisions, Client view, Export package, Run operations.
- TRIZ tension resolved: improve user comprehension without weakening route/workset governance by changing labels and tests only, not route IDs or authorization logic.
- SIT closed world: reused existing navigation group model, route policy map, sidebar renderer, tests and screenshot proof path.
- Ethics/fairness: no dark patterns, no admin bypass language, no overclaim that invitation, upload, advisor review or export is complete before backend workflow state allows it.

## Changed files
- components/admin-tenant-setup-screen.tsx
- lib/navigation.ts
- lib/ux-route-policy.ts
- lib/process-universe-capture-model.ts
- tests/invite-user-drawer-lifecycle.spec.ts
- tests/state-copy-cleanup.spec.ts
- tests/navigation-shell.spec.ts
- tests/route-smoke.spec.ts
- reports/ALPHAVEST_PROFILE_AUTH_ADMIN_NAV_2026_07_02.md

## Proof artifacts
- artifacts/profile-auth-admin-acceptance/tenant-users-psychologic-nav-1400x900.png
- artifacts/profile-auth-admin-acceptance/tenant-users-psychologic-nav-1400x900.scan.json

## Validation run
- pnpm typecheck: passed
- pnpm exec playwright test tests/navigation-shell.spec.ts tests/route-smoke.spec.ts tests/state-copy-cleanup.spec.ts tests/invite-user-drawer-lifecycle.spec.ts --workers=1: 158 passed
- pnpm lint: passed with 0 errors and 35 existing warnings
- git diff --check: passed

## Acceptance notes
- Positive: Tenant Users now exposes workspace-access value and next safe action language.
- Positive: Primary navigation now uses outcome/job labels instead of implementation-phase labels.
- Positive: DB-JWT UI tests now use the real auth helper instead of the retired legacy demo cookie.
- Negative: No route IDs, route paths, workset classification, permission rules or workflow guards were changed.
- Negative: Screenshot/text scan found no visible internal markers such as data-testid, data-ux, proof, source truth, storageKey, route id, task id, debug or admin override.

## Remaining recommendation
- Next IA slice should update page headings and hub copy to match the new navigation verbs. Example: Tenant Users can become Workspace Access once route-title contracts are reviewed.

## Follow-up slice - account security sessions

### Added real session model
- Added `UserSession` / `user_sessions` with user, role, tenant, provider, status, IP/user-agent, created/last-seen/expires/revocation fields.
- MFA verification and invite acceptance now create DB-backed active sessions.
- Issued DB-JWTs carry `sid`; current-user resolution rejects revoked, expired or inactive sessions when `sid` is present.
- Profile readmodel returns active session summaries without exposing DB IDs or internal session keys in visible UI.

### Psycho-logical structure adjustment
- Moved account security above passive account details in the profile right rail.
- The page now surfaces the active protection context before session history: available password change first, other-session revocation only as future contextual action when another active session exists.
- This follows the action-architecture rule: available actions must be visible in their meaningful context; unavailable actions are explained product-natively and not rendered as fake controls.

### Additional proof artifacts
- artifacts/profile-auth-admin-acceptance/client-profile-security-action-first-1400x900.png
- artifacts/profile-auth-admin-acceptance/client-profile-security-action-first-1400x900.scan.json

### Additional validation
- pnpm db:validate: passed
- pnpm db:generate: passed
- pnpm exec prisma migrate deploy: passed, applied 20260702123000_user_sessions
- pnpm typecheck: passed
- pnpm exec playwright test tests/local-auth-provider.spec.ts tests/dbtf-tables-api.spec.ts --grep "requires a DB-user JWT before app routes render|saves and reloads the authenticated user's client profile form|stores profile image uploads through private object storage|rejects invalid profile edits" --workers=1: 4 passed
- pnpm exec playwright test tests/dbtf-tables-api.spec.ts --grep "saves and reloads the authenticated user's client profile form" --workers=1: 1 passed after structure move
- pnpm lint: passed with 0 errors and 35 existing warnings
- pnpm guard:source: passed
- git diff --check: passed

### Remaining UX note
- Account security is now visible at 1400x900 and avoids database UI smell. The password form begins in the first viewport, but the final submit button still sits low on the card at this density. Next profile-UX slice should tighten the account card layout so the complete password-change action is fully visible without relying on scroll.

## Follow-up slice - action-first account security layout

### Psycho-logical action architecture correction
- Moved the concrete password-change action above passive session history.
- Account security now shows the user's meaningful protection action first: `Change password` with `Update password` visible in the 1400x900 operating viewport.
- Active sessions remain available as account-security context, but do not displace the primary protection action.
- This implements the rule that page structure must decide which actions are available, contextual, unavailable, or absent; it is not just label cleanup.

### Additional proof artifacts
- artifacts/profile-auth-admin-acceptance/client-profile-security-password-visible-1400x900.png
- artifacts/profile-auth-admin-acceptance/client-profile-security-password-visible-1400x900.scan.json

### Additional validation
- pnpm typecheck: passed
- pnpm exec playwright test tests/dbtf-tables-api.spec.ts --grep "saves and reloads the authenticated user's client profile form" --workers=1: 1 passed
- Screenshot scan: no forbidden internal markers, no session/database UI smell, `Update password` visible inside 1400x900 viewport.
- pnpm lint: passed with 0 errors and 35 existing warnings
- git diff --check: passed

## Admin access decision UI slice - 2026-07-02

### Implemented change
- Converted the tenant-user administration surface from a database-style user/invite table into a product work surface for workspace access decisions.
- Added a compact access state row with current access counts and the next meaningful access message.
- Added an action-oriented work queue: bring someone in, finish onboarding, reduce access risk.
- Replaced the standalone invite column with a `Next step` decision column derived from user account state and invite lifecycle.
- Moved raw status into the user context and removed separate `Scope`/`Status` data-table columns from the visible operating surface.
- Restricted row actions by state:
  - Open invitation: `Refresh invite`, `Withdraw invite`.
  - Active access: `Pause`, `Lock`, `Remove access`.
  - Suspended/locked/archived access: `Restore` where applicable.
  - Removed/revoked access: no misleading active access action.
- Role assignment remains available where access still exists or onboarding is open; removed access tells the admin to invite again before assigning new access.

### Files changed in this slice
- `components/admin-tenant-setup-screen.tsx`
- `artifacts/profile-auth-admin-acceptance/tenant-users-access-decision-queue-1400x900.png`
- `artifacts/profile-auth-admin-acceptance/tenant-users-access-decision-queue-1400x900.scan.json`

### Validation
- `pnpm guard:source`: PASS.
- Moving baseline preflight captured branch `full-workflow`, latest commit `1ba63db fix(screencast): prove human-speed 25-step journeys`, package scripts, diff stat and dirty worktree state.
- `pnpm typecheck`: PASS.
- `mkdir -p test-results && pnpm lint`: PASS with 0 errors and 35 existing warnings.
- `pnpm exec playwright test tests/invite-user-drawer-lifecycle.spec.ts tests/state-copy-cleanup.spec.ts --workers=1`: PASS, 7 passed.

### Visual proof
- Screenshot: `artifacts/profile-auth-admin-acceptance/tenant-users-access-decision-queue-1400x900.png`.
- Scan: `artifacts/profile-auth-admin-acceptance/tenant-users-access-decision-queue-1400x900.scan.json`.
- Scan result: no forbidden visible internal markers, decision queue present, `Next step` column present, state-specific actions present, primary invite actions visible, no horizontal overflow, no primary page scroll at 1400x900.

### Acceptance result
- Positive: The admin access surface now leads from business state to next safe action instead of exposing a broad CRUD-style action set.
- Negative: This slice does not complete the overall profile/auth/admin goal; it covers the admin user/invite action architecture and its visual/test proof only.

## Auth visible-language cleanup slice - 2026-07-02

### Implemented change
- Removed visible provider/infrastructure language from the login and invite-onboarding surfaces.
- Replaced `DB user JWT`, `DB-JWT`, `DB-backed`, `Auth provider`, `local challenge`, `invite token` style copy with product-native access language.
- Login now presents `Workspace sign-in`, `Sign-in method`, and `Workspace account` while keeping the internal provider ID stable for API/session behavior.
- Invite onboarding now presents `Invitation status` and current-invitation language rather than database/token wording.
- Role confirmation now reports account/access activation without exposing database implementation terms.
- Removed an unused `normalizedEmail` variable from the provider login API route.

### Files changed in this slice
- `components/auth-onboarding-screen.tsx`
- `app/api/auth/provider-login/route.ts`
- `tests/state-copy-cleanup.spec.ts`
- `artifacts/profile-auth-admin-acceptance/auth-login-product-copy-1400x900.png`
- `artifacts/profile-auth-admin-acceptance/auth-login-product-copy-1400x900.scan.json`

### Validation
- `pnpm exec playwright test tests/state-copy-cleanup.spec.ts --workers=1`: PASS, 4 passed.
- `pnpm exec playwright test tests/local-auth-provider.spec.ts --grep "requires password|rejects an incorrect|blocks locked|creates a DB-backed invitation|rejects invitation acceptance|verifies MFA|requires a DB-user JWT" --workers=1`: PASS, 7 passed.
- `pnpm typecheck`: PASS.
- `mkdir -p test-results && pnpm lint`: PASS with 0 errors and 34 existing warnings.

### Visual proof
- Screenshot: `artifacts/profile-auth-admin-acceptance/auth-login-product-copy-1400x900.png`.
- Scan: `artifacts/profile-auth-admin-acceptance/auth-login-product-copy-1400x900.scan.json`.
- Scan result: no visible DB/JWT/provider/token/schema/migration/prisma implementation wording, workspace sign-in visible, product sign-in method visible, password rule visible, primary sign-in action visible, no horizontal overflow, no primary page scroll at 1400x900.

### Acceptance result
- Positive: Dummy-auth remains username/password/MFA/invite backed, but the operational UI now explains the user value and next action without internal provider mechanics.
- Negative: This slice does not by itself complete the full objective; final completion still requires a requirement-by-requirement audit across profile, admin, roles/scope, invite lifecycle and auth paths.

## Username-based demo login slice - 2026-07-02

### Implemented change
- Added first-class username login support to the local demo auth provider.
- `username` now resolves to the unique demo account email where the username is the part before `@`; full email remains accepted for compatibility.
- Demo password fallback remains deterministic and now explicitly follows the MVP rule: password equals username.
- Unknown or ambiguous usernames fail closed through the same non-leaking denied flow.
- Login UI now shows `Username` rather than `Email address` and posts `username` to `/api/auth/provider-login`.
- Updated process-universe login capture locators and provider-login bodies to use `Username` and `username`.

### Files changed in this slice
- `lib/auth/local-auth-provider-service.ts`
- `app/api/auth/provider-login/route.ts`
- `components/auth-onboarding-screen.tsx`
- `tests/local-auth-provider.spec.ts`
- `tests/state-copy-cleanup.spec.ts`
- `lib/process-universe-capture-model.ts`
- `artifacts/profile-auth-admin-acceptance/auth-login-product-copy-1400x900.png`
- `artifacts/profile-auth-admin-acceptance/auth-login-product-copy-1400x900.scan.json`

### Validation
- `pnpm guard:source`: PASS.
- `pnpm typecheck`: PASS.
- `mkdir -p test-results && pnpm lint`: PASS with 0 errors and 34 existing warnings.
- `pnpm exec playwright test tests/local-auth-provider.spec.ts --grep "requires password|accepts username|rejects an incorrect|blocks locked|creates a DB-backed invitation|rejects invitation acceptance|verifies MFA|requires a DB-user JWT" --workers=1`: PASS, 8 passed.
- `pnpm exec playwright test tests/state-copy-cleanup.spec.ts --workers=1`: PASS, 4 passed.

### Visual proof
- Screenshot: `artifacts/profile-auth-admin-acceptance/auth-login-product-copy-1400x900.png`.
- Scan: `artifacts/profile-auth-admin-acceptance/auth-login-product-copy-1400x900.scan.json`.
- Scan result: username field visible, email login label absent, product sign-in method visible, password rule visible, no DB/JWT/provider/token/schema/migration/prisma implementation wording, no horizontal overflow, no primary page scroll at 1400x900.

### Acceptance result
- Positive: The required username + password demo-login model is now represented in service behavior, UI, capture model and tests while preserving email compatibility for existing invite/session flows.
- Negative: This slice does not complete the full objective; final completion still requires full end-to-end requirement audit and any remaining scope/role acceptance proof.

## Final requirement audit - profile, roles, invites and demo login - 2026-07-02

### Requirement matrix

| Requirement | Status | Evidence |
| --- | --- | --- |
| User can manage own master/profile data, contact data, locale/region, timezone and notifications | PROVEN | `tests/dbtf-tables-api.spec.ts` profile save/reload path passed; `components/client-intake-screen.tsx` exposes the product-native profile controls. |
| User can manage own password | PROVEN | `tests/local-auth-provider.spec.ts` invitation activation and password-change path passed in previous focused validation; current auth/security suite verifies password-required and wrong-password fail paths. |
| User can manage profile image | PROVEN | `tests/dbtf-tables-api.spec.ts` profile image object-storage test passed; avatar API stores through private object storage and does not expose storage keys. |
| User sees security settings such as password and active sessions in the same area | PROVEN | Profile screenshot/scan `client-profile-security-password-visible-1400x900.*` proves password/security visibility; service returns active sessions. |
| Profile UI avoids internal process/proof/provider scaffolding | PROVEN | `tests/state-copy-cleanup.spec.ts` passed; profile screenshot scan has no forbidden markers. |
| Admin manages user operation lifecycle | PROVEN | `tests/local-auth-provider.spec.ts` passed for status activation, locking, restoring and revocation. |
| Admin manages invitations: create, withdraw, validity, one-time token lifecycle, start status and pre-fill | PROVEN | `tests/local-auth-provider.spec.ts` passed for invitation creation, acceptance, consent block, replay block, expired invite, refresh validity and revoke; `tests/invite-user-drawer-lifecycle.spec.ts` passed for UI create/pre-fill lifecycle. |
| Admin manages tenant/group dependencies only in allowed scope | PROVEN | `tests/local-auth-provider.spec.ts` passed for readmodel tenant scoping and POST action cross-tenant denial. |
| Admin UI presents governance actions, not database CRUD | PROVEN | Screenshot/scan `tenant-users-access-decision-queue-1400x900.*` proves decision queue, next-step column, state-specific actions, no internal markers, no overflow and no page scroll. |
| USER/ADMIN/SUPER_ADMIN MVP concept | PROVEN WITH SCOPE DESIGN | Exact literal `SUPER_ADMIN` is not introduced because the active enterprise role model already has platform-scoped `admin` and tenant/user roles. The implemented MVP semantics are: non-admin roles cannot administer users/invites; `client_success` can administer only assigned tenant scope; platform `admin` can administer across scope. This is proven by local-auth provider scope and permission tests. |
| Rights are action-based, not menu-based | PROVEN | Admin actions are enforced by API actions (`invite_user`, `set_user_status`, `update_user_assignment`, `refresh_user_invite`, `revoke_user_invite`) and UI exposes state-specific actions instead of permission menus. |
| Login requires username + password | PROVEN | `tests/local-auth-provider.spec.ts` passed for username + matching password; login UI screenshot/scan proves `Username` field and username-password rule. |
| Password validation uses MVP rule password equals username | PROVEN | `tests/local-auth-provider.spec.ts` passed for accepted username/password and rejected wrong password; service hashes username fallback as credential rule. |
| Missing/wrong password, locked user, invalid/expired invite token fail clearly, securely and without row leakage | PROVEN | `tests/auth-spine.spec.ts` and `tests/local-auth-provider.spec.ts` passed for unknown account, missing password, wrong password, locked user, invalid MFA, expired invite and replay/consent blocks with hiddenRowsDisclosed false. |
| Invitation/onboarding integrated into login process | PROVEN | `tests/local-auth-provider.spec.ts` passed for invited user login returning `invite_acceptance_required`, invite token acceptance, consent requirement and session/JWT creation after acceptance. |
| UI contains no internal process/gate/debug/provider terms in operational auth/profile/admin areas | PROVEN | `tests/state-copy-cleanup.spec.ts` passed; screenshot scans for profile, admin access and login show no forbidden visible markers. |

### Final validation bundle
- `pnpm guard:source`: PASS.
- `pnpm typecheck`: PASS.
- `mkdir -p test-results && pnpm lint`: PASS with 0 errors and 34 existing warnings.
- `git diff --check`: PASS.
- Focused broad acceptance run: `pnpm exec playwright test tests/auth-spine.spec.ts tests/local-auth-provider.spec.ts tests/invite-user-drawer-lifecycle.spec.ts tests/state-copy-cleanup.spec.ts tests/dbtf-tables-api.spec.ts --grep "lists the DB-user JWT provider|denies unknown DB users|issues a safe JWT|fails closed for missing|does not treat|requires a DB-user JWT|denies unknown email|requires password|accepts username|rejects an incorrect|blocks locked|creates a DB-backed invitation|rejects invitation acceptance|lets admin manage user status|verifies MFA|denies invitation creation|denies tenant-scoped admin actions|requires admin JWT|invite trigger|validation blocks|successful invite|invite drawer source|document upload state|client profile and family state|auth and invite onboarding copy|support and reference states|saves and reloads the authenticated user's client profile form|stores profile image uploads|rejects invalid profile edits" --workers=1`: PASS, 31 passed.

### Acceptance conclusion
- Objective is satisfied for the requested demo-login, profile, role/scope and invitation lifecycle run.
- No final financial/legal/tax advice behavior was added or weakened.
- Internal implementation language remains in code/test/provider identifiers where required, but is not visible in operational UI proof surfaces.
- Residual repo-wide warnings are pre-existing unused-symbol lint warnings outside this slice; lint exits with 0 errors.
