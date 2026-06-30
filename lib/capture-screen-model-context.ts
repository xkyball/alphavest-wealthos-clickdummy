import {
  navigationGroupLabels,
  routeImplementationAccessDecision,
  type NavigationGroupKey,
  type ScreenRoute,
} from "@/lib/route-registry";
import {
  uxOperatingModelForRoute,
  type UxOperatingAudience,
  type UxOperatingMode,
  type UxProofPosture,
} from "@/lib/ux-operating-model";

export type CaptureCapabilityStatus =
  | "STRONG_VERTICAL_CANDIDATE"
  | "API_BACKED_PARTIAL"
  | "SERVICE_BACKED_INTERNAL"
  | "READMODEL_ONLY"
  | "UI_ONLY_STATIC"
  | "BLOCKED_UI_SAFETY_STATE";

export type CaptureScreenModelContext = {
  auditBaseline: typeof captureScreenModelAuditBaseline;
  capability: {
    apiEvidence: string[];
    guardEvidence: string[];
    proofPosture: string;
    serviceEvidence: string[];
    status: CaptureCapabilityStatus;
  };
  modelFamilies: string[];
  models: string[];
  route: {
    navigationGroup: NavigationGroupKey;
    navigationGroupLabel: string;
    objectType: ScreenRoute["objectType"];
    pageId: string;
    path: string;
    permissionAction: ScreenRoute["permissionAction"];
    routeScope: ReturnType<typeof routeImplementationAccessDecision>["routeScope"];
    title: string;
    visualMode: ScreenRoute["visualMode"];
    workflow: string;
  };
  uxOperatingModel: {
    audience: UxOperatingAudience;
    mode: UxOperatingMode;
    noOverclaimRule: string;
    productiveUxEligible: boolean;
    proofPosture: UxProofPosture;
  };
  warnings: string[];
};

export const captureScreenModelAuditBaseline = {
  capabilityReport:
    "reports/boc-ctes-lokaler-code-capability-audit-2026-06-26/05_capability_reality_report.md",
  codebaseInventory:
    "reports/boc-ctes-lokaler-code-capability-audit-2026-06-26/02_codebase_inventory.md",
  registeredRoutes: 71,
  schemaEnums: 31,
  schemaModels: 53,
  stance:
    "Conservative capture metadata: never promote a screenshot to COMPLETE_VERTICAL_SLICE proof without current-run UI/API/service/DB/guard evidence.",
} as const;

const sharedAuditModels = ["AuditEvent"];
const sharedSafetyModels = ["Role", "Permission", "UserRole", "RolePermission", "AccessRequest", "SecondConfirmation"];

type ContextTemplate = Omit<CaptureScreenModelContext, "auditBaseline" | "route" | "uxOperatingModel">;

const groupTemplates: Record<NavigationGroupKey, ContextTemplate> = {
  access: {
    capability: {
      apiEvidence: ["app/api/auth/**/route.ts", "app/api/current-user/route.ts"],
      guardEvidence: ["Demo auth posture only; no real-auth hardening claim."],
      proofPosture: "API-backed demo/provider posture; capture must not imply production authentication.",
      serviceEvidence: ["lib/demo/demo-auth-provider-service.ts", "lib/auth/current-user.ts"],
      status: "API_BACKED_PARTIAL",
    },
    modelFamilies: ["tenant-user-rbac"],
    models: ["User", "UserProfile", "ConsentRecord", ...sharedSafetyModels, ...sharedAuditModels],
    warnings: ["Demo session/auth screens are not real authentication proof."],
  },
  platform: {
    capability: {
      apiEvidence: ["app/api/admin-tenants/route.ts", "app/api/platform-admin/actions/route.ts", "app/api/tenant-governance/actions/route.ts"],
      guardEvidence: ["Permission and audit boundaries require focused runtime proof per action."],
      proofPosture: "Admin/platform setup is partially API-backed; J10 platform/security actions use typed platform-admin commands.",
      serviceEvidence: ["lib/admin-tenant-governance-service.ts", "lib/admin-tenant-readmodel-service.ts", "lib/platform-admin-workflow-actions.ts", "lib/tenant-governance-workflow-actions.ts"],
      status: "API_BACKED_PARTIAL",
    },
    modelFamilies: ["tenant-user-rbac", "policy-export-evidence"],
    models: ["PlatformTenant", "PolicyDefinition", "ClientTenant", ...sharedSafetyModels, "EvidenceRecord", "ExportRequest", ...sharedAuditModels],
    warnings: ["Platform screenshots are setup proof, not policy-change completion proof; J10 uses typed platform-admin commands."],
  },
  tenant_setup: {
    capability: {
      apiEvidence: ["app/api/admin-tenants/route.ts", "app/api/tenant-governance/actions/route.ts"],
      guardEvidence: ["Auth, permission and validation responses are partial proof only."],
      proofPosture: "Tenant setup has typed tenant-governance command evidence, but capture remains partial until focused runtime proof runs.",
      serviceEvidence: ["lib/admin-tenant-governance-service.ts", "lib/demo/demo-auth-provider-service.ts", "lib/tenant-governance-command-client.ts", "lib/tenant-governance-workflow-actions.ts"],
      status: "API_BACKED_PARTIAL",
    },
    modelFamilies: ["tenant-user-rbac"],
    models: ["ClientTenant", "User", "UserProfile", "Role", "UserRole", "PolicyDefinition", ...sharedAuditModels],
    warnings: ["Tenant screenshots do not prove every admin mutation path; J06 uses typed tenant-governance commands."],
  },
  client_workspace: {
    capability: {
      apiEvidence: [
        "app/api/profile/route.ts",
        "app/api/family-members/route.ts",
        "app/api/entities/route.ts",
        "app/api/documents/**/route.ts",
        "app/api/data-maintenance/actions/route.ts",
      ],
      guardEvidence: ["Tenant/object permission checks; upload/review safety branches; typed J04/J05/J09 data-maintenance action allow-list."],
      proofPosture: "Strong candidate for profile, family, entity, document and evidence flows; J04/J05/J09 use typed data-maintenance commands while full DB/browser suites still decide completion.",
      serviceEvidence: ["lib/dbtf-form-service.ts", "lib/dbtf-table-service.ts", "lib/document-upload-service.ts", "lib/evidence-review-service.ts", "lib/data-maintenance-workflow-actions.ts"],
      status: "STRONG_VERTICAL_CANDIDATE",
    },
    modelFamilies: ["client-wealth-objects", "documents-evidence"],
    models: [
      "UserProfile",
      "FamilyMember",
      "Relationship",
      "ClientObjective",
      "Entity",
      "EntityParticipant",
      "Asset",
      "Document",
      "DocumentVersion",
      "DocumentExtraction",
      "DocumentReview",
      "DocumentLink",
      "EvidenceRecord",
      "EvidenceItem",
      "EvidenceSufficiencyDecision",
      ...sharedAuditModels,
    ],
    warnings: ["Schema breadth does not prove every field is editable; J04/J05/J09 use typed data-maintenance commands."],
  },
  wealth_actions: {
    capability: {
      apiEvidence: ["app/api/data-maintenance/actions/route.ts"],
      guardEvidence: ["Typed J05 action allow-list; no-advice/no-client-release safety envelope."],
      proofPosture: "Wealth/action entity-maintenance controls use typed data-maintenance commands; this is still partial until focused browser/DB suites prove each process.",
      serviceEvidence: ["lib/data-maintenance-command-client.ts", "lib/data-maintenance-workflow-actions.ts"],
      status: "API_BACKED_PARTIAL",
    },
    modelFamilies: ["client-wealth-objects", "advisory-recommendation-draft"],
    models: ["Entity", "EntityParticipant", "Asset", "Trigger", "ActionItem", "Recommendation", "EvidenceItem", ...sharedAuditModels],
    warnings: ["J05 wealth/action maintenance uses typed data-maintenance commands; advice/release-history actions use their own typed boundary."],
  },
  advisory_workflow: {
    capability: {
      apiEvidence: ["app/api/processes/[id]/commands/route.ts", "app/api/recommendation-review-workflow/route.ts", "app/api/advice-release-history/actions/route.ts"],
      guardEvidence: ["Advisor approval is not compliance release; client-visible AI draft remains forbidden; J02/J03 use typed advice-release-history commands."],
      proofPosture: "Internal service-backed workflow with typed advisor-review and advice/release-history command boundaries; product proof no longer has a generic demo command route.",
      serviceEvidence: [
        "lib/advice-release-history-command-client.ts",
        "lib/advice-release-history-workflow-actions.ts",
        "lib/process-runtime/process-runtime-service.ts",
        "lib/suitability-process-command-client.ts",
        "lib/typed-workflow-command-bus.ts",
        "lib/internal-draft-governance-spine.ts",
      ],
      status: "SERVICE_BACKED_INTERNAL",
    },
    modelFamilies: ["advisory-recommendation-draft", "audit-safety"],
    models: [
      "Trigger",
      "ActionItem",
      "Recommendation",
      "InternalDraft",
      "DraftClassification",
      "UnsupportedClaim",
      "DraftTrace",
      "RecommendationOption",
      "Approval",
      "ComplianceReview",
      "Decision",
      "DecisionParticipant",
      "EvidenceRecord",
      ...sharedAuditModels,
    ],
    warnings: ["J01/J02/J03 advice and advisor-review actions use typed commands; J12/J13/J14 use process runtime commands."],
  },
  decisions_evidence: {
    capability: {
      apiEvidence: ["app/api/audit-events/route.ts", "app/api/documents/review/route.ts", "app/api/processes/[id]/commands/route.ts", "app/api/tenant-governance/actions/route.ts", "app/api/advice-release-history/actions/route.ts"],
      guardEvidence: ["Permission engine, visibility engine, workflow gate and typed J02/J03 command evidence required for safety-sensitive states."],
      proofPosture: "Decision/evidence surfaces are service-backed internally; J03 decision/evidence actions use typed advice-release-history commands while client projection remains fail-closed.",
      serviceEvidence: ["lib/visibility-engine.ts", "lib/workflow-gate.ts", "lib/audit-service.ts", "lib/evidence-review-service.ts", "lib/tenant-governance-workflow-actions.ts", "lib/advice-release-history-workflow-actions.ts"],
      status: "SERVICE_BACKED_INTERNAL",
    },
    modelFamilies: ["documents-evidence", "advisory-recommendation-draft", "tenant-user-rbac"],
    models: ["EvidenceRecord", "EvidenceItem", "EvidenceSufficiencyDecision", "Decision", "DecisionParticipant", "DocumentReview", ...sharedSafetyModels, ...sharedAuditModels],
    warnings: ["Evidence screenshots are not release proof without no-leakage and gate proof; J07 uses tenant-governance typed commands and J03 evidence commands use advice-release-history typed commands."],
  },
  communication: {
    capability: {
      apiEvidence: ["app/api/global-search/route.ts"],
      guardEvidence: ["Support/context flows must not become release or advice shortcuts."],
      proofPosture: "Communication is currently read/context-oriented unless paired with focused handler proof.",
      serviceEvidence: ["lib/global-search-service.ts"],
      status: "READMODEL_ONLY",
    },
    modelFamilies: ["communication"],
    models: ["MessageThread", "Message", "CallEvent", ...sharedAuditModels],
    warnings: ["Communication capture proves context visibility, not advice/release action."],
  },
  export: {
    capability: {
      apiEvidence: ["app/api/export-workflow/route.ts", "app/api/tenant-governance/actions/route.ts"],
      guardEvidence: ["Export safety guards; direct approval/download UI/API truth tests from the audit baseline."],
      proofPosture: "Strong export command-spine candidate; full lifecycle DB/browser proof still controls completion claims.",
      serviceEvidence: ["lib/export-workflow-command-service.ts", "lib/export-workflow-readmodel-service.ts", "lib/tenant-governance-workflow-actions.ts"],
      status: "STRONG_VERTICAL_CANDIDATE",
    },
    modelFamilies: ["audit-monitoring-communication-export", "documents-evidence"],
    models: ["ExportRequest", "Document", "DocumentVersion", "EvidenceItem", ...sharedAuditModels],
    warnings: ["Export preview is not approval/download; J07 audit export control uses typed tenant-governance commands and remaining J08 demo paths stay separate."],
  },
  operations: {
    capability: {
      apiEvidence: ["app/api/review-monitoring/route.ts", "app/api/review-monitoring/actions/route.ts", "app/api/ops-sla/route.ts"],
      guardEvidence: ["Monitoring creates internal review work only; no auto rebalance instruction."],
      proofPosture: "Operations screens are API/readmodel-backed partials, with reference-only pages demoted below.",
      serviceEvidence: ["lib/review-monitoring-service.ts", "lib/ops-sla-readmodel-service.ts", "lib/data-quality-service.ts"],
      status: "API_BACKED_PARTIAL",
    },
    modelFamilies: ["audit-monitoring-communication-export"],
    models: ["ReviewSchedule", "QueueItem", "DataQualityIssue", ...sharedAuditModels],
    warnings: ["Ops capture is not proof of automated action execution."],
  },
  reference: {
    capability: {
      apiEvidence: [],
      guardEvidence: ["Reference routes stay outside productive operations navigation and audit coverage."],
      proofPosture: "Reference-only screens are catalogue/debug context; capture must not be promoted to operational capability proof.",
      serviceEvidence: [],
      status: "UI_ONLY_STATIC",
    },
    modelFamilies: ["reference-only"],
    models: [],
    warnings: ["Reference capture is not product workflow proof and must not be treated as an operations surface."],
  },
};

function withoutDuplicates(items: string[]) {
  return Array.from(new Set(items));
}

function safetyBlockedStatus(route: ScreenRoute, current: CaptureCapabilityStatus): CaptureCapabilityStatus {
  if (
    route.visualMode === "BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE" ||
    route.visualMode === "RELEASE_CONFIRMATION_MODAL_STATE" ||
    route.visualMode === "DOWNLOAD_CONFIRMATION_STATE"
  ) {
    return "BLOCKED_UI_SAFETY_STATE";
  }
  return current;
}

export function captureModelContextForRoute(route: ScreenRoute): CaptureScreenModelContext {
  const accessDecision = routeImplementationAccessDecision(route);
  const operatingModel = uxOperatingModelForRoute(route);
  const template = groupTemplates[route.navigationGroup];
  const referenceOnly = accessDecision.routeScope === "REFERENCE_ONLY";
  const holdPending = accessDecision.routeScope === "HOLD_PENDING_DECISION";
  const deferred = accessDecision.routeScope === "P1_AFTER_MVP";
  const status = referenceOnly
    ? "UI_ONLY_STATIC"
    : holdPending
      ? "BLOCKED_UI_SAFETY_STATE"
      : safetyBlockedStatus(route, template.capability.status);

  const warnings = [
    ...template.warnings,
    ...(referenceOnly ? ["Reference-only route: capture is visual/context proof only."] : []),
    ...(holdPending ? ["Hold-pending route: do not promote as product capability without unlock decision."] : []),
    ...(deferred ? ["Deferred route: capture is registered context only and not MVP product proof."] : []),
    ...(captureScreenModelAuditBaseline.schemaModels === 53 ? [] : ["Schema model count drift detected; rerun schema alignment before using capture metadata."]),
  ];

  return {
    auditBaseline: captureScreenModelAuditBaseline,
    capability: {
      ...template.capability,
      status,
    },
    modelFamilies: withoutDuplicates(template.modelFamilies),
    models: withoutDuplicates(template.models),
    route: {
      navigationGroup: route.navigationGroup,
      navigationGroupLabel: navigationGroupLabels[route.navigationGroup],
      objectType: route.objectType,
      pageId: route.pageId,
      path: route.route,
      permissionAction: route.permissionAction,
      routeScope: accessDecision.routeScope,
      title: route.title,
      visualMode: route.visualMode,
      workflow: route.workflowName,
    },
    uxOperatingModel: {
      audience: operatingModel.audience,
      mode: operatingModel.mode,
      noOverclaimRule: operatingModel.noOverclaimRule,
      productiveUxEligible: operatingModel.productiveUxEligible,
      proofPosture: operatingModel.proofPosture,
    },
    warnings,
  };
}
