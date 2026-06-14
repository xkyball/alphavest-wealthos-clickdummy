# Screen Specs v2

## General screen schema

For every route/screen/state, capture:

```text
Screen ID:
Route:
Primary user:
User goal:
Entry point:
Actual UI region from visual:
Do-not-render annotation regions:
Primary action:
Secondary actions:
Key UI zones:
State(s):
Permission logic:
Client-visible vs internal-only:
Backstage workflow:
Human review step:
Compliance step:
Evidence created:
Audit event:
Empty/loading/error/blocked states:
Navigation relationship:
Dev handoff notes:
Tests:
```

## Route specs

### `/mobile`

Source: V2-001, V2-002, V2-003, V2-009.

Implement mobile home cards, priority actions, bottom nav, recommendation blocked state and decision notification. Do not render board metadata or dev note panels.

### `/mobile/upload`

Source: V2-004 to V2-008.

Implement stepper: select type → extraction review → pending/blocked/error. Low confidence blocks submit and routes to analyst review.

### `/portal`

Source: V2-010 to V2-012.

Implement dashboard cards, readiness score, open actions, pending decisions, missing documents, evidence/governance status, and Wealth Map click path. Include “Visibility score is not advice” if client-facing copy requires it.

### `/wealth-map`

Source: V2-013 to V2-016.

Implement graph, filters, detail drawer, permission restricted node and conflict escalation state.

### `/actions`

Source: V2-017 to V2-019.

Implement kanban, action detail drawer and blocked/missing evidence state.

### `/decisions`

Source: V2-020 to V2-022.

Implement Decision Room ready/blocked/success states. Accept/Defer/Reject must create decision and audit events.

### Evidence preview overlay

Source: V2-023 to V2-025.

Implement the Evidence Vault preview drawer, restricted record and missing evidence escalation as contextual workflow surfaces. `/evidence` is a redirect fallback, not a standalone product page. Evidence is not a visual flourish; it must be represented in data state.

### `/workbench`, `/signals`, `/advisor-approval`, `/compliance`

Source: V2-026 to V2-037.

Implement internal-only workflows. These can contain more operational detail than client screens, but still should not include visual board metadata.

### `/governance`

Source: V2-038 to V2-042.

Implement matrix, role drawer, second confirmation modal, permission blocked state and audit history. Permissions must use central helper logic and tests.

### `/communication`

Source: V2-044 to V2-047.

Implement decision tree/matrix/message preview/log. Client-visible message send must be disabled until advisor approval and compliance release are complete.

### Reference boards

Source: V2-043, V2-048 to V2-056.

Reference only unless operator requests internal docs routes. Extract logic, state machines, badge tokens, evidence/audit mapping, dependency and scope rules.
