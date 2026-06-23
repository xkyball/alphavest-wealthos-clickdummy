# V1.0 Pilot Runbook

Status: PILOT_SUPPORT_READY_FOR_DEMO_DATA_ONLY
Date: 2026-06-23
Authority: ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md

## Support Path

| Severity | Examples | Owner | Response |
|---|---|---|---|
| P1 | audit persistence unavailable, export failure, release gate failure, suspected internal-payload leak | Compliance + Ops | Stop pilot action path, preserve evidence, open incident note, no client release. |
| P2 | denied action spike, wrong-role or wrong-tenant access attempt, route scope confusion | Security + Support | Triage actor/role/tenant/correlation id, confirm no mutation, update support note. |
| P3 | upload validation failure, demo data mismatch, non-blocking UI feedback issue | Support | Capture validation reason and reproduction steps, keep workflow blocked if safety state is unclear. |

## Critical Monitoring Signals

| Signal | Required safe fields | Forbidden log content |
|---|---|---|
| denied action | actor, role, action, target type, decision reason, correlation id | raw payload, document bytes, AI draft, internal rationale |
| upload failure | tenant slug, document type, validation reason, role, correlation id | document bytes, extracted text, full sensitive filename |
| audit failure | gate name, target type, result, reason code, correlation id | raw payload, internal rationale, client notes |
| export failure | export request id, redaction profile, payload classification result, correlation id | unredacted export, AI draft, internal rationale |
| release attempt | recommendation id, previous state, next state, gate result, correlation id | AI draft, internal rationale, compliance notes |

## Incident Response

1. Classify severity.
2. Freeze the affected action path.
3. Preserve audit events, request ids, correlation ids and visible safe error envelopes.
4. Confirm whether any mutation, export, client visibility or advice execution occurred.
5. If safety state is unclear, treat it as blocked and do not release to client.
6. Communicate only client-safe status externally: received, investigating, blocked, resolved.
7. Record final result as allowed, denied, blocked, rolled back or false alarm.

## Data Separation Rules

- Seed and demo records are synthetic only.
- No real client data may be entered unless a later written approval changes the source of truth.
- Closed pilot demo data must use demo labels and cannot be described as production records.
- Exports remain metadata/demo packages unless release and redaction gates pass.

## Evidence Preservation

Preserve:

- commit id and branch
- env mode
- command outputs
- audit event ids
- request/correlation ids
- visible safe error envelope
- affected route id and route scope

Do not preserve:

- raw document bytes in logs
- unredacted exports in support notes
- AI draft or internal rationale text in external communication
- real client data in demo incident records

