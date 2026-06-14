# Screen State Inventory v2

## Global states

Every route that loads data should have:

- default;
- loading;
- empty;
- error;
- blocked / permission restricted where relevant.

## Business states

Use consistent chips/components for:

- Draft
- Processing
- Needs Review
- Advisor Approved
- Compliance Pending
- Client Visible
- Completed
- Deferred
- Blocked
- Error
- Loading
- Active
- Inactive
- Sensitive
- Internal Only

## Workflow badges

Use exactly:

`[AUTO] [AI-DRAFT] [ANALYST] [ADVISOR] [COMPLIANCE] [CLIENT] [CALL] [F2F] [EVIDENCE] [BLOCKED] [REVIEW]`

## Critical blocked states

- Recommendation blocked before compliance release.
- Upload blocked due to low extraction confidence.
- Action blocked due to missing evidence.
- Decision room blocked due to missing permission.
- Evidence record restricted.
- Workbench publish disabled.
- Advisor-approved but compliance-pending.
- Compliance block / request evidence.
- Permission blocked by policy / missing authority.
- Second confirmation required.

## Client visibility states

Client-visible status must derive from permission + approval + compliance + evidence state. Never infer client visibility from component styling alone.
