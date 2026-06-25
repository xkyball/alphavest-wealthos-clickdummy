# AV27 Phase 7 - Route / Action / Object / Payload Negative Suite

Date: 2026-06-25
Ticket chain: `AV27-P7-T02-A`, `AV27-P7-T02-S`, `AV27-P7-T02-I`, `AV27-P7-T02-Q`

## Ticket Status

| Ticket | Status | Result |
| --- | --- | --- |
| `AV27-P7-T02-A` | Done | Inspected Phase 1 safety tests, Phase 2 context tests, Phase 3 upload/gate tests, Phase 4 data-quality tests, Phase 5 workflow tests and Phase 6 payload tests. |
| `AV27-P7-T02-S` | Done | Locked six mandatory negative families: cross-tenant, wrong-role, wrong-object, no-audit, upload-only-not-sufficient and advisor-not-release. |
| `AV27-P7-T02-I` | Done | Implemented the negative-suite register in `lib/av27-phase7-certification.ts`. |
| `AV27-P7-T02-Q` | Done | `tests/av27-phase7-certification.spec.ts` verifies all six families and representative process coverage. |

## Negative Families

| Scenario | Negative assertion | Representative processes | Existing proof |
| --- | --- | --- | --- |
| `cross_tenant` | Cross-tenant actor cannot read, mutate, release or export target payload. | `A-003`, `A-004`, `B-007`, `G-006` | `tests/av27-safety-foundation.spec.ts`, `tests/av27-client-context-closure.spec.ts` |
| `wrong_role` | Wrong role is denied for protected action and receives no authority expansion from route visibility. | `B-006`, `B-010`, `G-005`, `J-009` | `tests/av27-safety-foundation.spec.ts`, `tests/demo-workflow-api.spec.ts` |
| `wrong_object` | Wrong object scope fails closed and cannot satisfy workflow or payload gate. | `A-004`, `C-005`, `G-002`, `K-006` | `tests/av27-safety-foundation.spec.ts`, `tests/workflow-gate.spec.ts` |
| `no_audit` | Critical action cannot complete silently when durable audit is unavailable. | `B-012`, `G-006`, `I-007` | `tests/audit-fail-closed.spec.ts`, `tests/demo-workflow-api.spec.ts`, `tests/data-quality-service.spec.ts` |
| `upload_only_not_sufficient` | Upload-only evidence cannot mark sufficiency, release, export, advice or client visibility. | `C-002`, `C-004`, `C-008`, `G-002` | `tests/document-upload-api.spec.ts`, `tests/workflow-gate.spec.ts` |
| `advisor_not_release` | Advisor approval moves to compliance-pending only and cannot create client release. | `F-005`, `G-006`, `G-009`, `I-004` | `tests/workflow-gate.spec.ts`, `tests/demo-workflow-api.spec.ts` |

## Boundaries

This ticket does not create new product behavior. It certifies that route visibility, action permission, object scope and payload projection are separate proof layers. A route being reachable is never enough to infer payload permission or action authority.

