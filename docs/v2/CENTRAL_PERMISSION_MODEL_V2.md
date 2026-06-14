# Central Permission Model v2

## Files

- `lib/roles.ts`
- `lib/permissions.ts`
- `lib/access-control.ts`

## Model

The central permission model evaluates:

- role;
- object type;
- object scope;
- action;
- sensitivity;
- client-visible vs internal-only state;
- second confirmation requirement;
- compliance review requirement;
- blocked reason.

## Primary Helper

```ts
evaluateAccessControl(context)
```

The helper returns a structured decision with `allowed`, `blockedReason`, confirmation and compliance flags, visibility flags and notes.

## Sensitive Actions

Sensitive actions include:

- `approve_advice`
- `release_to_client`
- `manage_permissions`
- `view_restricted_evidence`
- `export_audit_logs`
- `grant_external_access`
- `send_client_message`

Sensitive or high-risk changes require second confirmation and create audit/evidence outputs in the demo model.

## Current Limitation

This remains a click-dummy model. It is centralized and testable but not connected to real identity, policy, persistence or server-side enforcement.
