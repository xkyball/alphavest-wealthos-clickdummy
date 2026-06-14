# Central State Machine Model v2

## Files

- `lib/state-machines.ts`
- `lib/workflow-status.ts`
- `lib/status-labels.ts`

## Workflows

The model defines transitions for:

- recommendation;
- document;
- action;
- permission/access request;
- communication;
- evidence record;
- decision record;
- call escalation.

## Primary Helper

```ts
canTransition(workflow, from, to, guard)
```

The helper rejects structurally invalid transitions and blocks client-visible/client-sent transitions when advisor approval, compliance release, evidence or permission checks are missing.

## Client Visibility Rule

State transitions cannot expose advice-like output through `client_visible` or `client_sent` unless all required guard fields pass.

## Runtime Usage Added In Phase 7.5

The state machine is now used by `lib/demo-runtime.ts` to drive the shared click-dummy session. Future screens should add typed demo transitions there rather than creating isolated local `useState` workflows for product-state changes.
