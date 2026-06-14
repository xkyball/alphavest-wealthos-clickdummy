export type SurfaceType =
  | "product_route"
  | "internal_route"
  | "focused_surface"
  | "reference_route"
  | "logic_only";

export type SurfaceHelper =
  | "permission"
  | "evidence"
  | "audit"
  | "state"
  | "releaseGate";

export type SurfaceRegistryEntry = {
  visualId: `V2-${string}`;
  file: string;
  visualType: string;
  surfaceType: SurfaceType;
  parentRoute: string;
  surfaceKey?: string;
  component: string;
  directNavigationAllowed: boolean;
  compatibilityRoute?: string;
  compatibilityRedirect?: string;
  entryPoints: string[];
  guardTests: string[];
  helpers: SurfaceHelper[];
  regionTokens: string[];
};

const baseGuardTests = ["tests/v2-surface-contracts.test.mjs"];

function entry(
  item: Omit<SurfaceRegistryEntry, "guardTests"> & {
    guardTests?: string[];
  }
): SurfaceRegistryEntry {
  return {
    ...item,
    guardTests: item.guardTests ?? baseGuardTests
  };
}

export const surfaceRegistry = [
  entry({
    visualId: "V2-001",
    file: "client/V2-001-mobile-home-default.png",
    visualType: "mobile_screen",
    surfaceType: "product_route",
    parentRoute: "/mobile",
    component: "MobileScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/mobile"],
    helpers: ["permission", "evidence", "releaseGate"],
    regionTokens: ["Next Step Today", "Recommendation blocked"]
  }),
  entry({
    visualId: "V2-002",
    file: "client/V2-002-mobile-home-recommendation-blocked.png",
    visualType: "mobile_state",
    surfaceType: "product_route",
    parentRoute: "/mobile",
    component: "MobileScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/mobile?state=blocked"],
    helpers: ["permission", "evidence", "releaseGate"],
    regionTokens: ["Recommendation blocked"]
  }),
  entry({
    visualId: "V2-003",
    file: "client/V2-003-mobile-home-empty.png",
    visualType: "mobile_state",
    surfaceType: "product_route",
    parentRoute: "/mobile",
    component: "MobileScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/mobile?state=empty"],
    helpers: ["state"],
    regionTokens: ["All caught up"]
  }),
  entry({
    visualId: "V2-004",
    file: "client/V2-004-mobile-upload-select-type.png",
    visualType: "mobile_screen",
    surfaceType: "product_route",
    parentRoute: "/mobile/upload",
    component: "MobileUploadScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/mobile/upload"],
    helpers: ["evidence", "audit", "state"],
    regionTokens: ["Select document type"]
  }),
  entry({
    visualId: "V2-005",
    file: "client/V2-005-mobile-upload-extraction-review.png",
    visualType: "mobile_screen",
    surfaceType: "product_route",
    parentRoute: "/mobile/upload",
    component: "MobileUploadScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/mobile/upload?state=extraction"],
    helpers: ["evidence", "audit", "state"],
    regionTokens: ["Extracted information"]
  }),
  entry({
    visualId: "V2-006",
    file: "client/V2-006-mobile-upload-low-confidence-blocked.png",
    visualType: "mobile_state",
    surfaceType: "product_route",
    parentRoute: "/mobile/upload",
    component: "MobileUploadScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/mobile/upload?state=low"],
    helpers: ["evidence", "audit", "state"],
    regionTokens: ["Low confidence"]
  }),
  entry({
    visualId: "V2-007",
    file: "client/V2-007-mobile-upload-verification-pending.png",
    visualType: "mobile_screen",
    surfaceType: "product_route",
    parentRoute: "/mobile/upload",
    component: "MobileUploadScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/mobile/upload?state=pending"],
    helpers: ["evidence", "audit", "state"],
    regionTokens: ["Verification pending"]
  }),
  entry({
    visualId: "V2-008",
    file: "client/V2-008-mobile-upload-error-retry.png",
    visualType: "mobile_state",
    surfaceType: "product_route",
    parentRoute: "/mobile/upload",
    component: "MobileUploadScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/mobile/upload?state=retry"],
    helpers: ["state"],
    regionTokens: ["Retry upload"]
  }),
  entry({
    visualId: "V2-009",
    file: "client/V2-009-mobile-decision-notification.png",
    visualType: "mobile_screen",
    surfaceType: "product_route",
    parentRoute: "/mobile",
    component: "MobileScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/mobile?state=decision", "/decisions"],
    helpers: ["permission", "evidence", "releaseGate"],
    regionTokens: ["Decision notification"]
  }),
  entry({
    visualId: "V2-010",
    file: "client/V2-010-client-dashboard-default.png",
    visualType: "desktop_page",
    surfaceType: "product_route",
    parentRoute: "/portal",
    component: "PortalScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/portal"],
    helpers: ["permission", "evidence", "releaseGate"],
    regionTokens: ["Overview", "Visibility score is not advice"]
  }),
  entry({
    visualId: "V2-011",
    file: "client/V2-011-client-dashboard-states.png",
    visualType: "state_board",
    surfaceType: "product_route",
    parentRoute: "/portal",
    component: "PortalScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/portal?state=loading", "/portal?state=blocked"],
    helpers: ["permission", "state"],
    regionTokens: ["Permission blocked"]
  }),
  entry({
    visualId: "V2-012",
    file: "client/V2-012-dashboard-to-wealth-map-click-path.png",
    visualType: "wireflow",
    surfaceType: "logic_only",
    parentRoute: "/portal",
    component: "PortalScreenV2",
    directNavigationAllowed: false,
    entryPoints: ["/portal -> /wealth-map?focus=gaps"],
    helpers: ["state"],
    regionTokens: []
  }),
  entry({
    visualId: "V2-013",
    file: "client/V2-013-wealth-map-default-graph.png",
    visualType: "desktop_page",
    surfaceType: "product_route",
    parentRoute: "/wealth-map",
    component: "WealthMapScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/wealth-map"],
    helpers: ["permission", "evidence", "audit"],
    regionTokens: ["Live Wealth Map", "Relationship context"]
  }),
  entry({
    visualId: "V2-014",
    file: "client/V2-014-wealth-map-trust-detail-drawer.png",
    visualType: "drawer",
    surfaceType: "focused_surface",
    parentRoute: "/wealth-map",
    surfaceKey: "drawer:wealth-map-trust-detail",
    component: "WealthMapScreenV2",
    directNavigationAllowed: false,
    entryPoints: ["/wealth-map node click", "/wealth-map?focus=gaps"],
    helpers: ["permission", "evidence", "audit"],
    regionTokens: ["Trust X", "Evidence"]
  }),
  entry({
    visualId: "V2-015",
    file: "client/V2-015-wealth-map-permission-restricted-node.png",
    visualType: "state_drawer",
    surfaceType: "focused_surface",
    parentRoute: "/wealth-map",
    surfaceKey: "drawer:wealth-map-restricted-node",
    component: "WealthMapScreenV2",
    directNavigationAllowed: false,
    entryPoints: ["/wealth-map restricted node click"],
    helpers: ["permission", "audit"],
    regionTokens: ["restricted relationship", "Sensitive fields are hidden"]
  }),
  entry({
    visualId: "V2-016",
    file: "client/V2-016-wealth-map-trustee-beneficiary-escalation.png",
    visualType: "escalation_state",
    surfaceType: "focused_surface",
    parentRoute: "/wealth-map",
    surfaceKey: "panel:wealth-map-escalation",
    component: "WealthMapScreenV2",
    directNavigationAllowed: false,
    entryPoints: ["/wealth-map?focus=gaps"],
    helpers: ["state", "audit"],
    regionTokens: ["Trustee / beneficiary escalation"]
  }),
  entry({
    visualId: "V2-017",
    file: "client/V2-017-action-board-default-kanban.png",
    visualType: "desktop_page",
    surfaceType: "product_route",
    parentRoute: "/actions",
    component: "ActionsScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/actions"],
    helpers: ["evidence", "state"],
    regionTokens: ["Action Board", "Kanban"]
  }),
  entry({
    visualId: "V2-018",
    file: "client/V2-018-action-board-detail-drawer.png",
    visualType: "drawer",
    surfaceType: "focused_surface",
    parentRoute: "/actions",
    surfaceKey: "drawer:action-detail",
    component: "ActionsScreenV2",
    directNavigationAllowed: false,
    entryPoints: ["/actions card click"],
    helpers: ["evidence", "audit", "state"],
    regionTokens: ["Mini workflow", "Owner"]
  }),
  entry({
    visualId: "V2-019",
    file: "client/V2-019-action-board-blocked-missing-evidence.png",
    visualType: "state",
    surfaceType: "product_route",
    parentRoute: "/actions",
    component: "ActionsScreenV2",
    directNavigationAllowed: true,
    entryPoints: ["/actions"],
    helpers: ["evidence", "state", "releaseGate"],
    regionTokens: ["Missing evidence", "Blocked"]
  }),
  entry({
    visualId: "V2-020",
    file: "client/V2-020-decision-room-ready-to-decide.png",
    visualType: "desktop_page",
    surfaceType: "focused_surface",
    parentRoute: "/decisions",
    surfaceKey: "modal:decision-room",
    component: "DecisionsScreenV2",
    directNavigationAllowed: false,
    entryPoints: ["/decisions", "/actions ready decision"],
    helpers: ["permission", "evidence", "audit", "releaseGate"],
    regionTokens: ["Family decision request", "Accept", "Defer", "Reject"]
  }),
  entry({
    visualId: "V2-021",
    file: "client/V2-021-decision-room-missing-permission-blocked.png",
    visualType: "state",
    surfaceType: "focused_surface",
    parentRoute: "/decisions",
    surfaceKey: "modal:decision-room-blocked",
    component: "DecisionsScreenV2",
    directNavigationAllowed: false,
    entryPoints: ["/decisions?state=blocked"],
    helpers: ["permission", "releaseGate"],
    regionTokens: ["Decision room is blocked"]
  }),
  entry({
    visualId: "V2-022",
    file: "client/V2-022-decision-room-evidence-created.png",
    visualType: "state",
    surfaceType: "focused_surface",
    parentRoute: "/decisions",
    surfaceKey: "modal:decision-evidence-created",
    component: "DecisionsScreenV2",
    directNavigationAllowed: false,
    entryPoints: ["/decisions submit decision"],
    helpers: ["evidence", "audit"],
    regionTokens: ["Evidence created", "Open evidence preview"]
  }),
  entry({
    visualId: "V2-023",
    file: "client/V2-023-evidence-vault-default-preview-drawer.png",
    visualType: "desktop_page_with_drawer",
    surfaceType: "focused_surface",
    parentRoute: "/portal",
    surfaceKey: "overlay:evidence-preview",
    component: "EvidencePreviewDrawer",
    directNavigationAllowed: false,
    compatibilityRoute: "/evidence",
    compatibilityRedirect: "/portal",
    entryPoints: ["workbench Preview evidence", "decisions Open evidence preview"],
    helpers: ["permission", "evidence", "audit", "state"],
    regionTokens: ["Risk_Profile_Investor_Questionnaire.pdf", "Audit Trail", "Version History", "Workflow status", "Quick actions"]
  }),
  entry({
    visualId: "V2-024",
    file: "client/V2-024-evidence-vault-permission-restricted.png",
    visualType: "state",
    surfaceType: "focused_surface",
    parentRoute: "/portal",
    surfaceKey: "overlay:evidence-preview-restricted",
    component: "EvidencePreviewDrawer",
    directNavigationAllowed: false,
    compatibilityRoute: "/evidence",
    compatibilityRedirect: "/portal",
    entryPoints: ["restricted evidence record click"],
    helpers: ["permission", "evidence", "audit"],
    regionTokens: ["Private Credit Investment Memo", "Preview unavailable", "Request access", "Denied - Restricted"]
  }),
  entry({
    visualId: "V2-025",
    file: "client/V2-025-evidence-vault-missing-evidence-escalation.png",
    visualType: "escalation_state",
    surfaceType: "focused_surface",
    parentRoute: "/portal",
    surfaceKey: "overlay:evidence-missing-escalation",
    component: "EvidencePreviewDrawer",
    directNavigationAllowed: false,
    compatibilityRoute: "/evidence",
    compatibilityRedirect: "/portal",
    entryPoints: ["missing evidence action", "workbench blocked evidence"],
    helpers: ["evidence", "audit", "state", "releaseGate"],
    regionTokens: ["Release blocked - critical evidence missing", "Missing Evidence Checklist", "Process Status", "Client Message"]
  }),
  entry({
    visualId: "V2-026",
    file: "internal/V2-026-trigger-review-internal-default.png",
    visualType: "internal_page",
    surfaceType: "internal_route",
    parentRoute: "/signals",
    component: "InternalSignalsScreen",
    directNavigationAllowed: true,
    entryPoints: ["/signals"],
    helpers: ["state", "audit"],
    regionTokens: ["Signal and trigger review"]
  }),
  entry({
    visualId: "V2-027",
    file: "internal/V2-027-trigger-review-low-confidence-escalated.png",
    visualType: "state",
    surfaceType: "internal_route",
    parentRoute: "/signals",
    component: "InternalSignalsScreen",
    directNavigationAllowed: true,
    entryPoints: ["/signals"],
    helpers: ["state"],
    regionTokens: ["Low confidence"]
  }),
  entry({
    visualId: "V2-028",
    file: "internal/V2-028-workbench-default-queue-overview.png",
    visualType: "internal_page",
    surfaceType: "internal_route",
    parentRoute: "/workbench",
    component: "RuntimeWorkbenchScreen",
    directNavigationAllowed: true,
    entryPoints: ["/workbench"],
    helpers: ["permission", "evidence", "audit", "state", "releaseGate"],
    regionTokens: ["Priority Work Queue", "Advice Visibility Gate"]
  }),
  entry({
    visualId: "V2-029",
    file: "internal/V2-029-workbench-publish-readiness-disabled.png",
    visualType: "state",
    surfaceType: "internal_route",
    parentRoute: "/workbench",
    component: "RuntimeWorkbenchScreen",
    directNavigationAllowed: true,
    entryPoints: ["/workbench"],
    helpers: ["permission", "evidence", "releaseGate"],
    regionTokens: ["Advice-like output remains blocked"]
  }),
  entry({
    visualId: "V2-030",
    file: "internal/V2-030-workbench-trigger-detail-analyst-notes.png",
    visualType: "drawer_panel",
    surfaceType: "focused_surface",
    parentRoute: "/workbench",
    surfaceKey: "panel:workbench-trigger-detail",
    component: "RuntimeWorkbenchScreen",
    directNavigationAllowed: false,
    entryPoints: ["/workbench queue selection"],
    helpers: ["evidence", "audit", "state", "releaseGate"],
    regionTokens: ["Selected Trigger Detail", "Analyst Notes"]
  }),
  entry({
    visualId: "V2-031",
    file: "internal/V2-031-advisor-approval-default-review.png",
    visualType: "internal_page",
    surfaceType: "internal_route",
    parentRoute: "/advisor-approval",
    component: "InternalAdvisorApprovalScreen",
    directNavigationAllowed: true,
    entryPoints: ["/advisor-approval"],
    helpers: ["evidence", "audit", "state", "releaseGate"],
    regionTokens: ["Advisor approval"]
  }),
  entry({
    visualId: "V2-032",
    file: "internal/V2-032-advisor-approval-escalate-to-call.png",
    visualType: "state",
    surfaceType: "internal_route",
    parentRoute: "/advisor-approval",
    component: "InternalAdvisorApprovalScreen",
    directNavigationAllowed: true,
    entryPoints: ["/advisor-approval"],
    helpers: ["state"],
    regionTokens: ["Escalate to call"]
  }),
  entry({
    visualId: "V2-033",
    file: "internal/V2-033-advisor-approval-compliance-pending.png",
    visualType: "state",
    surfaceType: "internal_route",
    parentRoute: "/advisor-approval",
    component: "InternalAdvisorApprovalScreen",
    directNavigationAllowed: true,
    entryPoints: ["/advisor-approval"],
    helpers: ["releaseGate", "state"],
    regionTokens: ["Compliance pending"]
  }),
  entry({
    visualId: "V2-034",
    file: "internal/V2-034-compliance-console-default-queue.png",
    visualType: "internal_page",
    surfaceType: "internal_route",
    parentRoute: "/compliance",
    component: "InternalComplianceScreen",
    directNavigationAllowed: true,
    entryPoints: ["/compliance"],
    helpers: ["permission", "evidence", "audit", "releaseGate"],
    regionTokens: ["Compliance console"]
  }),
  entry({
    visualId: "V2-035",
    file: "internal/V2-035-compliance-console-release-to-client.png",
    visualType: "state_action",
    surfaceType: "internal_route",
    parentRoute: "/compliance",
    component: "InternalComplianceScreen",
    directNavigationAllowed: true,
    entryPoints: ["/compliance release action"],
    helpers: ["evidence", "audit", "releaseGate"],
    regionTokens: ["Release to client"]
  }),
  entry({
    visualId: "V2-036",
    file: "internal/V2-036-compliance-console-block-release-request-evidence.png",
    visualType: "state_action",
    surfaceType: "internal_route",
    parentRoute: "/compliance",
    component: "InternalComplianceScreen",
    directNavigationAllowed: true,
    entryPoints: ["/compliance block action"],
    helpers: ["evidence", "audit", "releaseGate"],
    regionTokens: ["Block / request evidence"]
  }),
  entry({
    visualId: "V2-037",
    file: "internal/V2-037-compliance-console-audit-exception-log.png",
    visualType: "panel",
    surfaceType: "internal_route",
    parentRoute: "/compliance",
    component: "InternalComplianceScreen",
    directNavigationAllowed: true,
    entryPoints: ["/compliance"],
    helpers: ["audit", "evidence"],
    regionTokens: ["Audit"]
  }),
  entry({
    visualId: "V2-038",
    file: "governance/V2-038-role-permission-matrix-view.png",
    visualType: "admin_page",
    surfaceType: "internal_route",
    parentRoute: "/governance",
    component: "Phase7GovernanceScreen",
    directNavigationAllowed: true,
    entryPoints: ["/governance"],
    helpers: ["permission", "audit"],
    regionTokens: ["Role", "Restricted Evidence"]
  }),
  entry({
    visualId: "V2-039",
    file: "governance/V2-039-role-detail-drawer.png",
    visualType: "drawer",
    surfaceType: "focused_surface",
    parentRoute: "/governance",
    surfaceKey: "drawer:governance-role-detail",
    component: "Phase7GovernanceScreen",
    directNavigationAllowed: false,
    entryPoints: ["/governance role selection"],
    helpers: ["permission", "audit"],
    regionTokens: ["Role Detail", "Sensitive permissions", "Current access decision"]
  }),
  entry({
    visualId: "V2-040",
    file: "governance/V2-040-second-confirmation-required.png",
    visualType: "modal_state",
    surfaceType: "focused_surface",
    parentRoute: "/governance",
    surfaceKey: "modal:governance-second-confirmation",
    component: "Phase7GovernanceScreen",
    directNavigationAllowed: false,
    entryPoints: ["/governance Grant sensitive access", "/governance?surface=second-confirmation"],
    helpers: ["permission", "audit", "evidence"],
    regionTokens: ["Second Confirmation Required", "Confirm and apply change", "GRANT RELEASE TO CLIENT"]
  }),
  entry({
    visualId: "V2-041",
    file: "governance/V2-041-permission-blocked-state.png",
    visualType: "state",
    surfaceType: "internal_route",
    parentRoute: "/governance",
    component: "Phase7GovernanceScreen",
    directNavigationAllowed: true,
    entryPoints: ["/governance"],
    helpers: ["permission", "audit"],
    regionTokens: ["Permission blocked"]
  }),
  entry({
    visualId: "V2-042",
    file: "governance/V2-042-audit-access-history.png",
    visualType: "panel",
    surfaceType: "internal_route",
    parentRoute: "/governance",
    component: "Phase7GovernanceScreen",
    directNavigationAllowed: true,
    entryPoints: ["/governance"],
    helpers: ["audit", "evidence"],
    regionTokens: ["Audit Access History"]
  }),
  entry({
    visualId: "V2-043",
    file: "states/V2-043-permission-matrix-reference.png",
    visualType: "reference_board",
    surfaceType: "logic_only",
    parentRoute: "logic:permissions",
    component: "lib/permissions.ts",
    directNavigationAllowed: false,
    entryPoints: ["permission model tests"],
    helpers: ["permission"],
    regionTokens: []
  }),
  entry({
    visualId: "V2-044",
    file: "communication/V2-044-communication-decision-tree.png",
    visualType: "wireflow",
    surfaceType: "internal_route",
    parentRoute: "/communication",
    component: "Phase8CommunicationScreen",
    directNavigationAllowed: true,
    entryPoints: ["/communication"],
    helpers: ["state", "evidence", "audit"],
    regionTokens: ["Communication Decision Tree"]
  }),
  entry({
    visualId: "V2-045",
    file: "communication/V2-045-call-trigger-matrix.png",
    visualType: "matrix",
    surfaceType: "internal_route",
    parentRoute: "/communication",
    component: "Phase8CommunicationScreen",
    directNavigationAllowed: true,
    entryPoints: ["/communication"],
    helpers: ["state"],
    regionTokens: ["Call Trigger Matrix"]
  }),
  entry({
    visualId: "V2-046",
    file: "communication/V2-046-client-visible-message-preview.png",
    visualType: "client_preview",
    surfaceType: "focused_surface",
    parentRoute: "/communication",
    surfaceKey: "overlay:communication-client-preview",
    component: "Phase8CommunicationScreen",
    directNavigationAllowed: false,
    entryPoints: [
      "/communication Open client preview overlay",
      "/communication?surface=client-preview"
    ],
    helpers: ["permission", "evidence", "audit", "releaseGate"],
    regionTokens: [
      "Communications Hub",
      "Message Preview",
      "Market Update & Your Portfolio",
      "Contextual Summary",
      "Approval & Compliance Status",
      "Important Disclosures",
      "Linked Recommendation / Next Step",
      "Send to Client is disabled",
      "Back to communication workflow"
    ]
  }),
  entry({
    visualId: "V2-047",
    file: "communication/V2-047-evidence-communication-log.png",
    visualType: "panel",
    surfaceType: "internal_route",
    parentRoute: "/communication",
    component: "Phase8CommunicationScreen",
    directNavigationAllowed: true,
    entryPoints: ["/communication"],
    helpers: ["evidence", "audit"],
    regionTokens: ["Evidence and Communication Log"]
  }),
  entry({
    visualId: "V2-048",
    file: "service-blueprint/V2-048-full-swimlane-view.png",
    visualType: "service_blueprint",
    surfaceType: "reference_route",
    parentRoute: "/service-blueprint",
    component: "Phase8ServiceBlueprintScreen",
    directNavigationAllowed: true,
    entryPoints: ["/service-blueprint", "/journey"],
    helpers: ["evidence", "audit", "state"],
    regionTokens: ["Full Swimlane View"]
  }),
  entry({
    visualId: "V2-049",
    file: "service-blueprint/V2-049-evidence-chain-view.png",
    visualType: "evidence_chain",
    surfaceType: "reference_route",
    parentRoute: "/service-blueprint",
    component: "Phase8ServiceBlueprintScreen",
    directNavigationAllowed: true,
    entryPoints: ["/service-blueprint", "/journey"],
    helpers: ["evidence", "audit"],
    regionTokens: ["Evidence Chain"]
  }),
  entry({
    visualId: "V2-050",
    file: "service-blueprint/V2-050-escalation-returns-view.png",
    visualType: "escalation_blueprint",
    surfaceType: "reference_route",
    parentRoute: "/service-blueprint",
    component: "Phase8ServiceBlueprintScreen",
    directNavigationAllowed: true,
    entryPoints: ["/service-blueprint", "/journey"],
    helpers: ["state", "audit"],
    regionTokens: ["Escalation / Returns View"]
  }),
  entry({
    visualId: "V2-051",
    file: "planning/V2-051-mvp-future-roadmap-board.png",
    visualType: "planning_board",
    surfaceType: "reference_route",
    parentRoute: "/roadmap",
    component: "Phase8RoadmapScreen",
    directNavigationAllowed: true,
    entryPoints: ["/roadmap"],
    helpers: ["state"],
    regionTokens: ["MVP and future scope"]
  }),
  entry({
    visualId: "V2-052",
    file: "planning/V2-052-blocked-not-mvp-ready-features.png",
    visualType: "planning_state",
    surfaceType: "reference_route",
    parentRoute: "/roadmap",
    component: "Phase8RoadmapScreen",
    directNavigationAllowed: true,
    entryPoints: ["/roadmap"],
    helpers: ["state"],
    regionTokens: ["Blocked / Not-MVP-Ready Features"]
  }),
  entry({
    visualId: "V2-053",
    file: "planning/V2-053-mvp-future-dependency-flow.png",
    visualType: "dependency_flow",
    surfaceType: "reference_route",
    parentRoute: "/roadmap",
    component: "Phase8RoadmapScreen",
    directNavigationAllowed: true,
    entryPoints: ["/roadmap"],
    helpers: ["state"],
    regionTokens: ["Dependency Flow"]
  }),
  entry({
    visualId: "V2-054",
    file: "states/V2-054-global-state-chip-workflow-badge-reference.png",
    visualType: "reference_board",
    surfaceType: "logic_only",
    parentRoute: "logic:status",
    component: "lib/status.ts",
    directNavigationAllowed: false,
    entryPoints: ["status component tests"],
    helpers: ["state"],
    regionTokens: []
  }),
  entry({
    visualId: "V2-055",
    file: "states/V2-055-state-machine-reference.png",
    visualType: "state_machine",
    surfaceType: "logic_only",
    parentRoute: "logic:state-machines",
    component: "lib/state-machines.ts",
    directNavigationAllowed: false,
    entryPoints: ["state machine tests"],
    helpers: ["state"],
    regionTokens: []
  }),
  entry({
    visualId: "V2-056",
    file: "states/V2-056-evidence-audit-mapping-reference.png",
    visualType: "mapping_visual",
    surfaceType: "logic_only",
    parentRoute: "logic:evidence-audit",
    component: "lib/evidence.ts + lib/audit.ts",
    directNavigationAllowed: false,
    entryPoints: ["evidence/audit model tests"],
    helpers: ["evidence", "audit"],
    regionTokens: []
  })
] as const satisfies readonly SurfaceRegistryEntry[];

export const focusedSurfaceTypes = [
  "drawer",
  "modal",
  "preview",
  "client_preview",
  "state_drawer",
  "modal_state",
  "drawer_panel",
  "escalation_state",
  "desktop_page_with_drawer"
] as const;

export function getSurfaceByVisualId(visualId: string) {
  return surfaceRegistry.find((entry) => entry.visualId === visualId);
}

export function getFocusedSurfaces() {
  return surfaceRegistry.filter((entry) => entry.surfaceType === "focused_surface");
}

export function getReferenceSurfaces() {
  return surfaceRegistry.filter((entry) => entry.surfaceType === "reference_route");
}
