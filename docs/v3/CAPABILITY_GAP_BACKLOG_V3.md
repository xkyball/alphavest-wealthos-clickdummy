# Capability Gap Backlog V3

Date: 2026-06-17

This backlog turns the capability truth audit into implementation slices. It is intentionally ordered by trust risk: visible interactions that imply operational behavior come first.

## P0 - Must Fix Before Claiming Operational Demo

| ID | Gap | Evidence | Solution Slice | Acceptance Proof |
|---|---|---|---|---|
| GAP-001 | Real document upload is missing | Upload UI posts JSON `j04.uploadDocument`; API uses `request.json()`; file/export tests assert metadata-only realism | Build `DocumentUploadForm`, `POST /api/documents/upload`, storage adapter, document/version/extraction/audit persistence | Playwright or API test uploads a real PDF and verifies DB rows plus stored object |
| GAP-002 | Visible form fields are often static/read-only | Client, tenant, governance, export, and communication screens use static field components | Convert top masks to controlled forms initialized from DB seed data | Edit values, save, reload, and assert changed values |
| GAP-003 | Demo actions mutate fixed seeded data without user payload | `triggerDemoWorkflow` posts only `actionId` | Add typed payload APIs/services while preserving actionId journey harness | Tests submit arbitrary valid payloads and verify target rows |
| GAP-004 | Export package is metadata-only | `realBinaryGenerated: false` in export manifest | Generate a demo ZIP/PDF/CSV package through storage adapter and signed download route | Download returns binary artifact and audited manifest |
| GAP-005 | Governance confirmations are not operational | Confirmation phrase UI is read-only/empty in critical drawers | Add editable confirmation phrase validation and denied-attempt audit | Wrong phrase denies mutation; right phrase persists role/access change |
| GAP-006 | Communication send/call flows are static | Message send button has no domain persistence path | Add message draft/send and call record services | Sent message/call note rows visible after reload |
| GAP-007 | Tenant setup cannot be maintained as real data | Create tenant/team/invite fields are static fixture values | Persist tenant payloads, invitations, team assignments, activation gates | New tenant can be created, incomplete activation blocked, complete activation succeeds |
| GAP-008 | Evidence/download/share behavior is not binary-backed | Evidence actions are fixture/generic without object ACL proof | Add evidence file/link upload, signed download, share approval state | Evidence item downloads stored object and logs access |

## P1 - Expand Workflow Fidelity

| ID | Gap | Solution Slice | Acceptance Proof |
|---|---|---|---|
| GAP-009 | Client/family/entity/asset maintenance is not generalized | Build profile/family/entity/asset services and forms | Arbitrary household data can be created/updated/deleted in demo DB |
| GAP-010 | Recommendation/advisor/compliance notes are not payloaded | Add typed review note/action service | Advisor/compliance decisions persist rationale and checklist |
| GAP-011 | Data quality queue is mostly visual | Create data quality issue service and queue transitions | Issue assignment and closure update queue counts |
| GAP-012 | Ops monitoring is not data-driven | Derive ops dashboards from workflow/data quality/review tables | Dashboard changes after underlying workflow transitions |
| GAP-013 | Route detail coverage is incomplete | Add real detail/review pages only after services exist | Planned detail routes resolve to DB-backed screens |
| GAP-014 | Permission context is demo-session only | Bind API calls to demo actor/tenant consistently and test denials | Cross-tenant and role-denied actions fail without mutation |

## P2 - Hardening

| ID | Gap | Solution Slice | Acceptance Proof |
|---|---|---|---|
| GAP-015 | File scanning/OCR are deterministic placeholders | Add async job interface with deterministic demo worker | Upload transitions from pending to extracted with job logs |
| GAP-016 | Bulk actions are absent | Add selected-row actions for ops/evidence/export queues | Bulk operation updates selected rows only |
| GAP-017 | Policy changes do not version gate behavior | Implement policy versioning and gate lookup | Gate results reference active policy version |
| GAP-018 | Audit/evidence coverage is inconsistent across static actions | Require audit wrapper for all sensitive payload services | Tests assert audit event for each sensitive action |

## Recommended Implementation Order

1. `GAP-001` Real document upload vertical slice.
2. `GAP-002` + `GAP-003` Convert top visible forms to payloaded saves.
3. `GAP-004` Export binary generation.
4. `GAP-005` Governance confirmation and access changes.
5. `GAP-006` Communication message/call persistence.
6. `GAP-007` Tenant setup maintenance.

## First Implementation Prompt

Use Max. Implement `GAP-001` as a narrow vertical slice. Keep the demo journey harness intact, but add a real document upload path: browser file input plus drag/drop, multipart API, local demo storage adapter, document/version/extraction/audit/evidence persistence, UI reload from DB, and tests proving upload, rejection, and persisted reload. Do not introduce real auth or real client data. Update the Phase and QA reports with files changed, tests run, and remaining limitations.

