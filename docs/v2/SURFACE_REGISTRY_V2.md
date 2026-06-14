# Surface Registry v2

Date: 2026-06-14

## Purpose

This registry is the workspace contract for interpreting v2 visuals. The typed source of truth is `lib/surface-registry.ts`; this document mirrors the implementation rule for humans.

Every visual must be classified before implementation. A route existing in the click-dummy does not mean the visual should become a standalone page.

## Surface Types

| Type | Meaning | Navigation rule |
|---|---|---|
| `product_route` | Real client-facing product route or route state. | Direct route is allowed. |
| `internal_route` | Real internal workflow/admin route. | Direct route is allowed. |
| `focused_surface` | Drawer, modal, preview, release view, detail panel or escalation panel. | Open from workflow context; compatibility URLs redirect or render the focused shape only. |
| `reference_route` | Internal planning/reference/demo route. | Direct route allowed only when clearly labelled internal/reference. |
| `logic_only` | Reference board translated into helpers, state machines, docs or tests. | No app UI route. |

Default rule: visual types like `drawer`, `state_drawer`, `modal_state`, `drawer_panel`, `client_preview`, `desktop_page_with_drawer` and `escalation_state` are `focused_surface` unless a later implementation note explicitly overrides them.

## Registry Matrix

| Visuals | Surface classification | Parent route / key | Component / model | Direct navigation |
|---|---|---|---|---|
| V2-001 to V2-003 | `product_route` | `/mobile` | `MobileScreenV2` | Yes |
| V2-004 to V2-008 | `product_route` | `/mobile/upload` | `MobileUploadScreenV2` | Yes |
| V2-009 | `product_route` | `/mobile`, `/decisions` | `MobileScreenV2`, `DecisionsScreenV2` | Yes |
| V2-010 to V2-011 | `product_route` | `/portal` | `PortalScreenV2` | Yes |
| V2-012 | `logic_only` | `/portal -> /wealth-map?focus=gaps` | route-state handling | No |
| V2-013 | `product_route` | `/wealth-map` | `WealthMapScreenV2` | Yes |
| V2-014 | `focused_surface` | `drawer:wealth-map-trust-detail` | `WealthMapScreenV2` | No |
| V2-015 | `focused_surface` | `drawer:wealth-map-restricted-node` | `WealthMapScreenV2` | No |
| V2-016 | `focused_surface` | `panel:wealth-map-escalation` | `WealthMapScreenV2` | No |
| V2-017 | `product_route` | `/actions` | `ActionsScreenV2` | Yes |
| V2-018 | `focused_surface` | `drawer:action-detail` | `ActionsScreenV2` | No |
| V2-019 | `product_route` | `/actions` | `ActionsScreenV2` | Yes |
| V2-020 | `focused_surface` | `modal:decision-room` | `DecisionsScreenV2` | No standalone page; `/decisions` renders modal-style surface |
| V2-021 | `focused_surface` | `modal:decision-room-blocked` | `DecisionsScreenV2` | No standalone page; `/decisions?state=blocked` renders modal-style surface |
| V2-022 | `focused_surface` | `modal:decision-evidence-created` | `DecisionsScreenV2` | No standalone page; opens evidence preview in context |
| V2-023 | `focused_surface` | `overlay:evidence-preview` | `EvidencePreviewDrawer` | No; `/evidence` redirects to `/portal` |
| V2-024 | `focused_surface` | `overlay:evidence-preview-restricted` | `EvidencePreviewDrawer` | No; `/evidence` redirects to `/portal` |
| V2-025 | `focused_surface` | `overlay:evidence-missing-escalation` | `EvidencePreviewDrawer` | No; `/evidence` redirects to `/portal` |
| V2-026 to V2-027 | `internal_route` | `/signals` | `SignalsScreenV2` | Yes |
| V2-028 to V2-029 | `internal_route` | `/workbench` | `RuntimeWorkbenchScreen` | Yes |
| V2-030 | `focused_surface` | `panel:workbench-trigger-detail` | `RuntimeWorkbenchScreen` | No |
| V2-031 to V2-033 | `internal_route` | `/advisor-approval` | `AdvisorApprovalScreenV2` | Yes |
| V2-034 to V2-037 | `internal_route` | `/compliance` | `ComplianceConsoleScreenV2` | Yes |
| V2-038 | `internal_route` | `/governance` | `Phase7GovernanceScreen` | Yes |
| V2-039 | `focused_surface` | `drawer:governance-role-detail` | `Phase7GovernanceScreen` | No |
| V2-040 | `focused_surface` | `modal:governance-second-confirmation` | `Phase7GovernanceScreen` | No; `/governance?surface=second-confirmation` renders the focused modal state |
| V2-041 to V2-042 | `internal_route` | `/governance` | `Phase7GovernanceScreen` | Yes |
| V2-043 | `logic_only` | `logic:permissions` | `lib/permissions.ts` | No |
| V2-044 to V2-045 | `internal_route` | `/communication` | `Phase8CommunicationScreen` | Yes |
| V2-046 | `focused_surface` | `overlay:communication-client-preview` | `Phase8CommunicationScreen` | No |
| V2-047 | `internal_route` | `/communication` | `Phase8CommunicationScreen` | Yes |
| V2-048 to V2-050 | `reference_route` | `/service-blueprint`, `/journey` | `Phase8ServiceBlueprintScreen` | Yes, internal/reference only |
| V2-051 to V2-053 | `reference_route` | `/roadmap` | `Phase8RoadmapScreen` | Yes, planning/reference only |
| V2-054 | `logic_only` | `logic:status` | `lib/status.ts` | No |
| V2-055 | `logic_only` | `logic:state-machines` | `lib/state-machines.ts` | No |
| V2-056 | `logic_only` | `logic:evidence-audit` | `lib/evidence.ts`, `lib/audit.ts` | No |

## Guard Tokens

Focused surfaces must keep stable visual-region tokens in the implementation. These are not pixel or screenshot tests; they prevent a drawer/modal/preview from regressing into a generic full-page board.

Examples:

- V2-023: `Risk_Profile_Investor_Questionnaire.pdf`, `Audit Trail`, `Workflow status`, `Quick actions`.
- V2-024: `Private Credit Investment Memo`, `Preview unavailable`, `Request access`, `Denied - Restricted`.
- V2-025: `Release blocked - critical evidence missing`, `Missing Evidence Checklist`, `Process Status`, `Client Message`.
- V2-030: `Selected Trigger Detail`, `Analyst Notes`.
- V2-039/V2-040: `Role Detail`, `Second Confirmation Required`, `Confirm and apply change`.
- V2-046: `Client-visible message preview`, `Back to communication workflow`, blocked send copy.

## Required Tests

`tests/v2-surface-contracts.test.mjs` enforces:

- all V2 manifest IDs are registered exactly once;
- focused surfaces have a surface key, contextual entry point and token guard;
- workflow components do not link to focused compatibility routes such as `/evidence`;
- compatibility routes redirect to safe parent contexts;
- reference routes are marked `referenceOnly`;
- product/workflow route files do not import legacy board shells.
