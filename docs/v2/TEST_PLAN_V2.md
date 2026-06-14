# Test Plan v2

## Phase 4 minimum tests

### Route smoke tests

Verify that all existing routes still load after refactor.

### Visual inventory mapping tests

Verify that every implemented route references a v2 screen spec and at least one v2 visual asset in documentation or code comments/tests.

### Permission tests

- Principal can see full client-visible home/actions/evidence where allowed.
- Next Gen / restricted role cannot see restricted entities/evidence.
- External Advisor cannot receive broad sensitive access without confirmation.
- Sensitive permission changes require second confirmation.
- Permission blocked state appears on denied action.

### No-unapproved-advice tests

- AI draft is not client-visible.
- Analyst review is not client-visible.
- Advisor approval alone is still not client-visible.
- Compliance release + evidence + permission check required before client visibility.

### Evidence/audit tests

- Upload action emits document upload event.
- Decision submitted emits decision event and evidence link.
- Compliance release/block emits compliance event.
- Permission change emits access audit event.

### State tests

- loading/empty/error/blocked states render correctly for P0 routes.
- publish readiness disabled state blocks publish.
- compliance pending state blocks client visibility.

## Recommended tools

- Existing project test framework if configured.
- Playwright for route and interaction smoke tests.
- Unit tests for permission/state/evidence helpers.
