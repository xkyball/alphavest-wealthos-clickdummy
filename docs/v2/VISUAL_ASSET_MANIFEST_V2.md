# Visual Asset Manifest v2

## Important

Visuals contain both UI and annotations. Codex must apply `VISUAL_INTERPRETATION_RULES_V2.md` before implementing.

## Asset manifest

| ID | Name | Target file | Route | Source | Type | State | Priority | Codex usage |
|---|---|---|---|---|---|---|---|---|
| V2-001 | Mobile Home — Default | client/V2-001-mobile-home-default.png | /mobile | Board 1 | mobile_screen | default | P0 | Implement mobile landing default priority action state. |
| V2-002 | Mobile Home — Recommendation Blocked | client/V2-002-mobile-home-recommendation-blocked.png | /mobile | Board 1 | mobile_state | blocked_compliance_pending | P0 | Implement blocked recommendation card and visibility helper. |
| V2-003 | Mobile Home — Empty / All Caught Up | client/V2-003-mobile-home-empty.png | /mobile | Board 1 | mobile_state | empty | P1 | Implement empty action state. |
| V2-004 | Mobile Upload — Select Document Type | client/V2-004-mobile-upload-select-type.png | /mobile/upload | Board 2 | mobile_screen | select_type | P0 | Implement upload start state. |
| V2-005 | Mobile Upload — Extraction Review | client/V2-005-mobile-upload-extraction-review.png | /mobile/upload | Board 2 | mobile_screen | extraction_review | P0 | Implement extraction review state. |
| V2-006 | Mobile Upload — Low Confidence Blocked | client/V2-006-mobile-upload-low-confidence-blocked.png | /mobile/upload | Board 2 | mobile_state | low_confidence_blocked | P0 | Implement low confidence blocked state. |
| V2-007 | Mobile Upload — Verification Pending | client/V2-007-mobile-upload-verification-pending.png | /mobile/upload | Board 2 | mobile_screen | verification_pending | P0 | Implement verification pending confirmation. |
| V2-008 | Mobile Upload — Error / Retry | client/V2-008-mobile-upload-error-retry.png | /mobile/upload | Board 2 | mobile_state | upload_error_retry | P1 | Implement upload error and retry. |
| V2-009 | Mobile Decision Notification / Ready for Review | client/V2-009-mobile-decision-notification.png | /mobile,/decisions | Boards 1,7 | mobile_screen | ready_for_review | P1 | Implement mobile decision notification / deep link. |
| V2-010 | Client Web Dashboard — Default | client/V2-010-client-dashboard-default.png | /portal | Board 3 | desktop_page | default | P0 | Implement dashboard default. |
| V2-011 | Client Dashboard — Loading / Error / Permission States | client/V2-011-client-dashboard-states.png | /portal | Board 3 | state_board | loading_error_permission_blocked | P1 | Implement dashboard core states. |
| V2-012 | Client Dashboard → Wealth Map Click Path | client/V2-012-dashboard-to-wealth-map-click-path.png | /portal → /wealth-map | Boards 3,4 | wireflow | navigation_transition | P0 | Implement route transition and gap context. |
| V2-013 | Live Wealth Map — Default Graph | client/V2-013-wealth-map-default-graph.png | /wealth-map | Board 4 | desktop_page | default_graph | P0 | Implement map page default graph. |
| V2-014 | Live Wealth Map — Trust X Detail Drawer | client/V2-014-wealth-map-trust-detail-drawer.png | /wealth-map | Board 4 | drawer | selected_trust | P0 | Implement selected trust drawer. |
| V2-015 | Live Wealth Map — Permission-Restricted Node | client/V2-015-wealth-map-permission-restricted-node.png | /wealth-map | Board 4 | state_drawer | permission_restricted | P0 | Implement restricted node and access request. |
| V2-016 | Live Wealth Map — Trustee / Beneficiary Escalation | client/V2-016-wealth-map-trustee-beneficiary-escalation.png | /wealth-map | Board 4 | escalation_state | trustee_beneficiary_conflict | P1 | Implement escalation state reference if in scope. |
| V2-017 | Action Board — Default Kanban | client/V2-017-action-board-default-kanban.png | /actions | Board 5 | desktop_page | default_kanban | P0 | Implement kanban action board. |
| V2-018 | Action Board — Action Detail Drawer | client/V2-018-action-board-detail-drawer.png | /actions | Board 5 | drawer | selected_action | P0 | Implement action detail drawer. |
| V2-019 | Action Board — Blocked / Missing Evidence State | client/V2-019-action-board-blocked-missing-evidence.png | /actions | Board 5 | state | blocked_missing_evidence | P0 | Implement blocked missing evidence action state. |
| V2-020 | Digital Decision Room — Ready to Decide | client/V2-020-decision-room-ready-to-decide.png | /decisions | Board 7 | desktop_page | ready_to_decide | P0 | Implement decision room ready state. |
| V2-021 | Digital Decision Room — Missing Permission Blocked | client/V2-021-decision-room-missing-permission-blocked.png | /decisions | Board 7 | state | missing_permission_blocked | P0 | Implement decision permission blocked state. |
| V2-022 | Digital Decision Room — Decision Submitted / Evidence Created | client/V2-022-decision-room-evidence-created.png | /decisions | Boards 7,8 | state | submitted_evidence_created | P0 | Implement decision submitted and evidence created state. |
| V2-023 | Evidence Vault — Default List + Preview Drawer | client/V2-023-evidence-vault-default-preview-drawer.png | overlay:evidence-preview | Board 8 | desktop_page_with_drawer | default_preview | P0 | Implement evidence preview focused overlay from workflow context. |
| V2-024 | Evidence Vault — Permission Restricted | client/V2-024-evidence-vault-permission-restricted.png | overlay:evidence-preview-restricted | Board 8 | state | permission_restricted | P0 | Implement evidence permission restricted state in the preview overlay. |
| V2-025 | Evidence Vault — Missing Evidence Escalation | client/V2-025-evidence-vault-missing-evidence-escalation.png | overlay:evidence-missing-escalation | Boards 8,11 | escalation_state | missing_evidence | P1 | Implement missing evidence escalation if scoped. |
| V2-026 | Signal / Trigger Review — Internal Default | internal/V2-026-trigger-review-internal-default.png | /signals | Board 6 | internal_page | default_review | P1 | Implement trigger review default internal page. |
| V2-027 | Signal / Trigger Review — Low Confidence / Escalated | internal/V2-027-trigger-review-low-confidence-escalated.png | /signals | Board 6 | state | low_confidence_escalated | P1 | Implement low confidence escalation state. |
| V2-028 | Consultant Workbench — Default Queue Overview | internal/V2-028-workbench-default-queue-overview.png | /workbench | Board 9 | internal_page | default_queue | P0 | Implement workbench queue overview. |
| V2-029 | Consultant Workbench — Publish Readiness Disabled | internal/V2-029-workbench-publish-readiness-disabled.png | /workbench | Board 9 | state | publish_disabled | P0 | Implement publish readiness disabled gate. |
| V2-030 | Consultant Workbench — Trigger Detail / Analyst Notes | internal/V2-030-workbench-trigger-detail-analyst-notes.png | /workbench | Boards 9,6 | drawer_panel | trigger_detail | P1 | Implement trigger detail / analyst notes drawer/panel. |
| V2-031 | Advisor Approval — Default Review | internal/V2-031-advisor-approval-default-review.png | /advisor-approval | Board 10 | internal_page | default_review | P0 | Implement advisor approval default review. |
| V2-032 | Advisor Approval — Escalate to Call | internal/V2-032-advisor-approval-escalate-to-call.png | /advisor-approval | Boards 10,13 | state | escalate_to_call | P1 | Implement call escalation state. |
| V2-033 | Advisor Approval — Advisor Approved but Compliance Pending | internal/V2-033-advisor-approval-compliance-pending.png | /advisor-approval | Boards 10,11 | state | compliance_pending | P0 | Implement advisor-approved compliance-pending gate state. |
| V2-034 | Compliance Console — Default Queue | internal/V2-034-compliance-console-default-queue.png | /compliance | Board 11 | internal_page | default_queue | P0 | Implement compliance queue default. |
| V2-035 | Compliance Console — Release to Client | internal/V2-035-compliance-console-release-to-client.png | /compliance | Board 11 | state_action | release_to_client | P0 | Implement compliance release-to-client state. |
| V2-036 | Compliance Console — Block Release / Request Evidence | internal/V2-036-compliance-console-block-release-request-evidence.png | /compliance | Board 11 | state_action | block_release_request_evidence | P0 | Implement compliance block/request-evidence state. |
| V2-037 | Compliance Console — Audit Trail / Exception Log | internal/V2-037-compliance-console-audit-exception-log.png | /compliance | Board 11 | panel | audit_exception | P1 | Implement compliance audit/exception panel or reference route. |
| V2-038 | Role / Permission Management — Matrix View | governance/V2-038-role-permission-matrix-view.png | /governance | Board 12 | admin_page | matrix_default | P0 | Implement role permission matrix. |
| V2-039 | Role / Permission Management — Role Detail Drawer | governance/V2-039-role-detail-drawer.png | /governance | Board 12 | drawer | selected_role | P0 | Implement role detail drawer. |
| V2-040 | Role / Permission Management — Second Confirmation Required | governance/V2-040-second-confirmation-required.png | /governance | Board 12 | modal_state | second_confirmation | P0 | Implement second confirmation modal. |
| V2-041 | Role / Permission Management — Permission Blocked | governance/V2-041-permission-blocked-state.png | /governance | Board 12 | state | permission_blocked | P0 | Implement permission blocked state. |
| V2-042 | Role / Permission Management — Audit Access History | governance/V2-042-audit-access-history.png | /governance | Board 12 | panel | audit_history | P1 | Implement audit history panel or view. |
| V2-043 | Permission Matrix Reference Board | states/V2-043-permission-matrix-reference.png | logic:permissions | Board 12 | reference_board | reference | P1 | REFERENCE ONLY: derive logic; do not implement as app UI unless explicitly requested. |
| V2-044 | Client Communication — Decision Tree | communication/V2-044-communication-decision-tree.png | /communication | Board 13 | wireflow | default_decision_tree | P1 | Implement communication decision tree. |
| V2-045 | Client Communication — Call Trigger Matrix | communication/V2-045-call-trigger-matrix.png | /communication | Board 13 | matrix | call_trigger | P1 | Implement or document call trigger matrix. |
| V2-046 | Client Communication — Client-visible Message Preview | communication/V2-046-client-visible-message-preview.png | /communication | Board 13 | client_preview | message_preview | P1 | Implement client-visible message preview with gated send. |
| V2-047 | Client Communication — Evidence & Communication Log | communication/V2-047-evidence-communication-log.png | /communication | Board 13 | panel | evidence_log | P1 | Implement evidence/communication log. |
| V2-048 | End-to-End Service Blueprint — Full Swimlane View | service-blueprint/V2-048-full-swimlane-view.png | /service-blueprint | Board 14 | service_blueprint | full_swimlane | P1 | REFERENCE/INFO: use for workflow logic and docs; not a normal UI screen. |
| V2-049 | End-to-End Service Blueprint — Evidence Chain View | service-blueprint/V2-049-evidence-chain-view.png | /service-blueprint | Board 14 | evidence_chain | evidence_chain | P1 | REFERENCE/INFO: derive evidence chain logic; not normal client UI. |
| V2-050 | End-to-End Service Blueprint — Escalation / Returns View | service-blueprint/V2-050-escalation-returns-view.png | /service-blueprint | Board 14 | escalation_blueprint | escalation_returns | P1 | REFERENCE/INFO: derive escalation logic; not normal client UI. |
| V2-051 | MVP vs Future Scope — Roadmap Board | planning/V2-051-mvp-future-roadmap-board.png | /roadmap | Board 15 | planning_board | roadmap_default | P2 | REFERENCE/INFO: use for scope/phases; not product UI unless roadmap route exists. |
| V2-052 | MVP vs Future Scope — Blocked / Not MVP Ready Features | planning/V2-052-blocked-not-mvp-ready-features.png | /roadmap | Board 15 | planning_state | blocked_future_items | P2 | REFERENCE/INFO: use for scope control and feature flags. |
| V2-053 | MVP vs Future Scope — Dependency Flow | planning/V2-053-mvp-future-dependency-flow.png | /roadmap | Board 15 | dependency_flow | roadmap_dependency | P2 | REFERENCE/INFO: use for sequencing and dependencies. |
| V2-054 | Global State Chip / Workflow Badge Reference Board | states/V2-054-global-state-chip-workflow-badge-reference.png | logic:status | All | reference_board | global_reference | P1 | REFERENCE ONLY: implement token system/components, not full board UI. |
| V2-055 | State Machine Reference Board | states/V2-055-state-machine-reference.png | logic:state-machines | All | state_machine | reference | P1 | REFERENCE ONLY: implement state machines/logic, not full board UI. |
| V2-056 | Evidence / Audit Mapping Reference Board | states/V2-056-evidence-audit-mapping-reference.png | logic:evidence-audit | Boards 7,8,11,14 | mapping_visual | reference | P1 | REFERENCE ONLY: implement evidence/audit model, not full board UI. |

## Target folder structure

```text
public/reference/visuals_v2/client/
public/reference/visuals_v2/internal/
public/reference/visuals_v2/governance/
public/reference/visuals_v2/communication/
public/reference/visuals_v2/service-blueprint/
public/reference/visuals_v2/planning/
public/reference/visuals_v2/states/
```
