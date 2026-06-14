# Permission Matrix v2

## Principles

- Use RBAC as baseline: user → role → permissions.
- Add object/context constraints: family, entity, document, decision, sensitivity, relationship, ownership, client visibility.
- Client-side hiding is not sufficient.
- All permission-sensitive routes must use central permission helpers.
- Sensitive permission changes require second confirmation and audit events.

## Roles

Client-side:

- Principal
- Spouse
- Next Gen
- Trustee
- Family CFO
- External Advisor

AlphaVest-side:

- AlphaVest Analyst
- Senior Advisor
- Compliance Officer
- Client Success
- Admin / Operations
- Security / Privacy Officer

## Sensitive permissions

Sensitive permissions include:

- Approve Advice
- Release to Client
- Manage Permissions
- View Restricted Evidence
- Export Audit Logs
- Grant External Access

Sensitive permissions require:

- second confirmation;
- audit event;
- evidence record or change record;
- optional human/compliance review depending on context.

## No-unapproved-advice release check

Client-visible recommendation/advice-like content requires:

```ts
advisorApproval === true
complianceRelease === true
evidenceRecordExists === true
permissionCheck === true
clientVisibilityState === 'released'
```

If any item fails, the UI must show a blocked state and the service/helper must deny client visibility.
