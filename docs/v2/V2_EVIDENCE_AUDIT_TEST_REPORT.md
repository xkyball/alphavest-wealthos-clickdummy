# V2 Evidence Audit Test Report

Date: 2026-06-14

## Central Helpers

Evidence and audit logic is centralized in:

- `lib/evidence.ts`
- `lib/audit.ts`
- `lib/demo-events.ts`
- `lib/demo-runtime.ts`

## Covered Events

| Product action | Evidence/audit event | Covered |
|---|---|---|
| Document uploaded | `document.uploaded` | Yes |
| Extraction confirmed | `extraction.confirmed` | Yes |
| Advisor approved | `advice.approved` | Yes |
| Compliance released | `compliance.released` | Yes |
| Compliance blocked | `compliance.blocked` | Yes |
| Client decision submitted | `decision.submitted` | Yes |
| Permission/access changed | `access.changed` | Yes |
| Communication sent | `communication.sent` | Yes |
| Call scheduled | `call.scheduled` | Yes |

## Audit Attributes

Demo audit events include:

- timestamp;
- actor ID;
- actor role;
- source IP;
- device;
- action;
- object type;
- object ID;
- correlation ID;
- result;
- evidence link;
- digital seal placeholder.

## Limitations

Audit immutability is represented as deterministic demo data. There is no WORM store, cryptographic timestamping, production checksum/seal service or external evidence vault integration.

