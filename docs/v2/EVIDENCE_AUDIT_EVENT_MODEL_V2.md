# Evidence and Audit Event Model v2

## Files

- `lib/evidence.ts`
- `lib/audit.ts`
- `lib/demo-events.ts`

## Evidence Events

The model supports:

- document upload;
- extraction confirmed;
- analyst note;
- advisor approval;
- compliance release/block;
- client viewed;
- client decision;
- communication sent;
- access changed/blocked;
- call scheduled/completed.

## Audit Event Attributes

Audit events include:

- UTC timestamp;
- actor ID;
- actor role;
- source IP/device;
- action;
- object type and ID;
- correlation ID;
- result;
- evidence link;
- digital seal.

## Demo Behavior

Events are deterministic for testability. Real persistence, WORM storage and immutable ledger behavior remain out of scope for the click-dummy.
