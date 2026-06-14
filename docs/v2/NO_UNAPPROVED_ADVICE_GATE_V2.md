# No-Unapproved-Advice Gate v2

## File

- `lib/visibility.ts`

## Primary Helper

```ts
canShowClientAdviceLikeOutput({
  advisorApproval,
  complianceRelease,
  evidenceRecord,
  permissionCheck,
  outputClassification,
  clientVisibilityState
})
```

## Required Conditions

The gate returns `clientVisible: true` only when:

- advisor approval is complete;
- compliance release is complete;
- an evidence record exists;
- the permission check passes;
- client visibility state is `released`.

If any condition is missing, the helper returns `clientVisible: false`, a `BLOCKED` badge and the missing checks.

## Current Usage

Phase 5 decision/client helpers now use this central helper. Phase 7 governance uses central permission and event helpers to prevent permission styling from becoming the source of truth.
