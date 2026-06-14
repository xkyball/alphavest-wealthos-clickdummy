import type { WorkflowBadge } from "./status";

export type V2RouteType =
  | "client"
  | "internal"
  | "governance"
  | "communication"
  | "reference"
  | "planning";

export type V2Route = {
  path: string;
  label: string;
  title: string;
  domain: string;
  primaryUser: string;
  userGoal: string;
  priority: "P0" | "P1" | "P2";
  type: V2RouteType;
  visualIds: string[];
  screenSpec: string;
  referenceOnly?: boolean;
};

export const v2Routes = [
  {
    path: "/presentation",
    label: "Overview",
    title: "AlphaVest WealthOS",
    domain: "Demo entry",
    primaryUser: "Presenter",
    userGoal: "Start the v2 click-dummy from a safe product overview.",
    priority: "P1",
    type: "reference",
    visualIds: [],
    screenSpec: "Demo entry route retained from Phase 1-3."
  },
  {
    path: "/mobile",
    label: "Mobile",
    title: "Mobile Home",
    domain: "Client mobile",
    primaryUser: "Family Principal",
    userGoal: "Know what requires attention today.",
    priority: "P0",
    type: "client",
    visualIds: ["V2-001", "V2-002", "V2-003", "V2-009"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/mobile"
  },
  {
    path: "/mobile/upload",
    label: "Upload",
    title: "Mobile Document Upload",
    domain: "Client intake",
    primaryUser: "Client / Advisor",
    userGoal: "Upload and verify documents with review-backed extraction.",
    priority: "P0",
    type: "client",
    visualIds: ["V2-004", "V2-005", "V2-006", "V2-007", "V2-008"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/mobile/upload"
  },
  {
    path: "/portal",
    label: "Portal",
    title: "Client Dashboard",
    domain: "Client web",
    primaryUser: "Principal / Family CFO",
    userGoal: "See readiness, open actions and next steps.",
    priority: "P0",
    type: "client",
    visualIds: ["V2-010", "V2-011", "V2-012"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/portal"
  },
  {
    path: "/wealth-map",
    label: "Wealth Map",
    title: "Live Wealth Map",
    domain: "Client structure",
    primaryUser: "Principal / Advisor",
    userGoal: "Understand connected entities, assets, documents and decisions.",
    priority: "P0",
    type: "client",
    visualIds: ["V2-013", "V2-014", "V2-015", "V2-016"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/wealth-map"
  },
  {
    path: "/actions",
    label: "Actions",
    title: "Action Board",
    domain: "Client workflow",
    primaryUser: "Client / Family Office Operator",
    userGoal: "Review prioritized actions and blocked evidence states.",
    priority: "P0",
    type: "client",
    visualIds: ["V2-017", "V2-018", "V2-019"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/actions"
  },
  {
    path: "/signals",
    label: "Signals",
    title: "Signal / Trigger Review",
    domain: "Internal review",
    primaryUser: "AlphaVest Analyst",
    userGoal: "Classify triggers as review points, not advice.",
    priority: "P1",
    type: "internal",
    visualIds: ["V2-026", "V2-027"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/workbench-signals"
  },
  {
    path: "/decisions",
    label: "Decisions",
    title: "Digital Decision Room",
    domain: "Client decision",
    primaryUser: "Principal / Family Council",
    userGoal: "Decide only on approved, released and evidenced recommendations.",
    priority: "P0",
    type: "client",
    visualIds: ["V2-020", "V2-021", "V2-022"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/decisions"
  },
  {
    path: "overlay:evidence-preview",
    label: "Evidence Preview",
    title: "Evidence Vault Preview",
    domain: "Evidence and audit",
    primaryUser: "Client / Advisor / Compliance",
    userGoal: "Inspect evidence, restrictions and audit-linked records without leaving the active workflow.",
    priority: "P0",
    type: "client",
    visualIds: ["V2-023", "V2-024", "V2-025"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/evidence-preview-overlay"
  },
  {
    path: "/workbench",
    label: "Workbench",
    title: "Consultant Workbench",
    domain: "Internal operations",
    primaryUser: "AlphaVest Analyst / Client Success",
    userGoal: "Manage review queues and publish readiness without bypassing gates.",
    priority: "P0",
    type: "internal",
    visualIds: ["V2-028", "V2-029", "V2-030"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/workbench"
  },
  {
    path: "/advisor-approval",
    label: "Advisor",
    title: "Advisor Approval",
    domain: "Advisor review",
    primaryUser: "Senior Advisor",
    userGoal: "Approve, revise, request data or escalate before compliance release.",
    priority: "P0",
    type: "internal",
    visualIds: ["V2-031", "V2-032", "V2-033"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/advisor-approval"
  },
  {
    path: "/compliance",
    label: "Compliance",
    title: "Compliance Console",
    domain: "Advice boundary",
    primaryUser: "Compliance Officer",
    userGoal: "Release or block advice-like outputs using evidence and policy gates.",
    priority: "P0",
    type: "internal",
    visualIds: ["V2-034", "V2-035", "V2-036", "V2-037"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/compliance"
  },
  {
    path: "/governance",
    label: "Governance",
    title: "Role / Permission Management",
    domain: "Governance",
    primaryUser: "Principal / Admin / Compliance",
    userGoal: "Manage access with second confirmation and audit history.",
    priority: "P0",
    type: "governance",
    visualIds: ["V2-038", "V2-039", "V2-040", "V2-041", "V2-042", "V2-043"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/governance"
  },
  {
    path: "/communication",
    label: "Comms",
    title: "Communication / Call Trigger",
    domain: "Communication",
    primaryUser: "Client / Advisor / Analyst",
    userGoal: "Route messages to digital, call or workshop paths with release gates.",
    priority: "P1",
    type: "communication",
    visualIds: ["V2-044", "V2-045", "V2-046", "V2-047"],
    screenSpec: "docs/v2/SCREEN_SPECS_V2.md#/communication"
  },
  {
    path: "/service-blueprint",
    label: "Blueprint",
    title: "Service Blueprint",
    domain: "Internal reference",
    primaryUser: "AlphaVest delivery team",
    userGoal: "Understand the service stages, evidence chain and escalation returns.",
    priority: "P1",
    type: "reference",
    visualIds: ["V2-048", "V2-049", "V2-050"],
    screenSpec: "docs/v2/SERVICE_BLUEPRINT_V2.md",
    referenceOnly: true
  },
  {
    path: "/journey",
    label: "Blueprint",
    title: "Service Blueprint",
    domain: "Internal reference",
    primaryUser: "AlphaVest delivery team",
    userGoal: "Understand the service stages, evidence chain and escalation returns.",
    priority: "P1",
    type: "reference",
    visualIds: ["V2-048", "V2-049", "V2-050"],
    screenSpec: "docs/v2/SERVICE_BLUEPRINT_V2.md",
    referenceOnly: true
  },
  {
    path: "/roadmap",
    label: "Scope",
    title: "MVP Scope Control",
    domain: "Planning",
    primaryUser: "AlphaVest leadership / Delivery team",
    userGoal: "Keep MVP scope separate from future features and dependencies.",
    priority: "P2",
    type: "planning",
    visualIds: ["V2-051", "V2-052", "V2-053", "V2-054", "V2-055", "V2-056"],
    screenSpec: "docs/v2/PHASE_MODEL_V2.md",
    referenceOnly: true
  }
] as const satisfies readonly V2Route[];

export type V2RoutePath = (typeof v2Routes)[number]["path"];

export function getV2Route(path: string) {
  return v2Routes.find((route) => route.path === path);
}

export const workflowBadges: WorkflowBadge[] = [
  "AUTO",
  "AI-DRAFT",
  "ANALYST",
  "ADVISOR",
  "COMPLIANCE",
  "CLIENT",
  "CALL",
  "F2F",
  "EVIDENCE",
  "BLOCKED",
  "REVIEW"
];

export type Role =
  | "Principal"
  | "Spouse"
  | "Next Gen"
  | "Trustee"
  | "Family CFO"
  | "External Advisor"
  | "AlphaVest Analyst"
  | "Senior Advisor"
  | "Compliance Officer"
  | "Client Success"
  | "Admin / Operations"
  | "Security / Privacy Officer";

export type PermissionAction =
  | "view_client_dashboard"
  | "view_restricted_evidence"
  | "approve_advice"
  | "release_to_client"
  | "manage_permissions"
  | "grant_external_access"
  | "export_audit_logs"
  | "send_client_message";

export const sensitivePermissionActions: PermissionAction[] = [
  "view_restricted_evidence",
  "approve_advice",
  "release_to_client",
  "manage_permissions",
  "grant_external_access",
  "export_audit_logs",
  "send_client_message"
];

const rolePermissions: Record<Role, PermissionAction[]> = {
  Principal: [
    "view_client_dashboard",
    "view_restricted_evidence",
    "manage_permissions",
    "grant_external_access"
  ],
  Spouse: ["view_client_dashboard"],
  "Next Gen": ["view_client_dashboard"],
  Trustee: ["view_client_dashboard", "view_restricted_evidence"],
  "Family CFO": ["view_client_dashboard", "view_restricted_evidence"],
  "External Advisor": ["view_client_dashboard"],
  "AlphaVest Analyst": ["view_client_dashboard"],
  "Senior Advisor": [
    "view_client_dashboard",
    "view_restricted_evidence",
    "approve_advice",
    "send_client_message"
  ],
  "Compliance Officer": [
    "view_client_dashboard",
    "view_restricted_evidence",
    "release_to_client",
    "export_audit_logs",
    "send_client_message"
  ],
  "Client Success": ["view_client_dashboard"],
  "Admin / Operations": ["view_client_dashboard", "manage_permissions"],
  "Security / Privacy Officer": [
    "view_client_dashboard",
    "view_restricted_evidence",
    "export_audit_logs"
  ]
};

export type PermissionContext = {
  role: Role;
  action: PermissionAction;
  objectSensitive?: boolean;
  secondConfirmation?: boolean;
  relationshipAllowed?: boolean;
};

export function requiresSecondConfirmation(action: PermissionAction) {
  return sensitivePermissionActions.includes(action);
}

export function evaluatePermission(context: PermissionContext) {
  const allowedByRole = rolePermissions[context.role].includes(context.action);
  const relationshipAllowed = context.relationshipAllowed ?? true;
  const needsSecondConfirmation =
    (context.objectSensitive || requiresSecondConfirmation(context.action)) &&
    !context.secondConfirmation;
  const allowed = allowedByRole && relationshipAllowed && !needsSecondConfirmation;

  return {
    allowed,
    allowedByRole,
    relationshipAllowed,
    needsSecondConfirmation,
    reason: allowed
      ? "allowed"
      : !allowedByRole
        ? "role_denied"
        : !relationshipAllowed
          ? "relationship_denied"
          : "second_confirmation_required"
  } as const;
}

export type ReleaseState = {
  advisorApproval: boolean;
  complianceRelease: boolean;
  evidenceRecordExists: boolean;
  permissionCheck: boolean;
  clientVisibilityState: "draft" | "blocked" | "released";
};

export function evaluateClientVisibility(state: ReleaseState) {
  const checks = {
    advisorApproval: state.advisorApproval,
    complianceRelease: state.complianceRelease,
    evidenceRecordExists: state.evidenceRecordExists,
    permissionCheck: state.permissionCheck,
    releasedState: state.clientVisibilityState === "released"
  };
  const missing = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([key]) => key);

  return {
    clientVisible: missing.length === 0,
    missing,
    badge: missing.length === 0 ? "CLIENT" : "BLOCKED"
  } as const;
}

export type RecommendationState =
  | "draft"
  | "needs_review"
  | "advisor_approved"
  | "compliance_pending"
  | "released"
  | "client_visible"
  | "deferred"
  | "rejected"
  | "completed";

export function canTransitionRecommendation(
  from: RecommendationState,
  to: RecommendationState,
  release: ReleaseState
) {
  if (to === "client_visible") {
    return evaluateClientVisibility(release).clientVisible;
  }

  const blockedDirectClientStates: RecommendationState[] = [
    "draft",
    "needs_review",
    "advisor_approved",
    "compliance_pending"
  ];

  if (blockedDirectClientStates.includes(from) && to === "released") {
    return release.complianceRelease && release.evidenceRecordExists;
  }

  return true;
}

export type EvidenceObjectType =
  | "Document File"
  | "Extraction Record"
  | "Analyst Note"
  | "Recommendation Draft"
  | "Approval Record"
  | "Compliance Release Record"
  | "Decision Record"
  | "Communication Record"
  | "Access Change Record"
  | "Call Schedule";

export type AuditEvent = {
  timestamp: string;
  actorRole: Role;
  action: string;
  objectType: EvidenceObjectType;
  objectId: string;
  result: "created" | "updated" | "blocked" | "released" | "viewed";
  evidenceLink: string;
};

export function createAuditEvent(input: Omit<AuditEvent, "timestamp">) {
  return {
    timestamp: "2026-06-14T00:00:00.000Z",
    ...input
  } satisfies AuditEvent;
}

export function createEvidenceLink(objectType: EvidenceObjectType, objectId: string) {
  return `evidence://${objectType.toLowerCase().replaceAll(" ", "-")}/${objectId}`;
}
