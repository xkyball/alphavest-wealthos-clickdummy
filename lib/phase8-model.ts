import { auditEventForAction } from "./audit";
import { evidenceForEvent } from "./evidence";
import { evaluateAccessControl, type PermissionDecision } from "./permissions";
import type { Role } from "./roles";
import { canTransition, type WorkflowState } from "./state-machines";
import { canShowClientAdviceLikeOutput } from "./visibility";

export type CommunicationRoleView = "advisor" | "client-success" | "client";

export type CommunicationRoute =
  | "digital-only"
  | "request-data"
  | "schedule-call"
  | "f2f-workshop"
  | "external-specialist";

export type CommunicationTrigger = {
  id: string;
  label: string;
  signal: string;
  complexity: "low" | "medium" | "high";
  sensitivity: "standard" | "sensitive" | "restricted";
  defaultRoute: CommunicationRoute;
  ownerRole: Role;
  evidenceEvent:
    | "communication.sent"
    | "call.scheduled"
    | "call.completed"
    | "note.added";
};

export type CommunicationApprovalState = {
  advisorApproval: boolean;
  complianceRelease: boolean;
  evidenceRecordExists: boolean;
  permissionCheck: boolean | PermissionDecision;
  clientVisibilityState: "draft" | "blocked" | "released";
};

export const communicationTriggers: CommunicationTrigger[] = [
  {
    id: "routine-review",
    label: "Routine review ready",
    signal: "Q2 pack is complete and contains information-only wording.",
    complexity: "low",
    sensitivity: "standard",
    defaultRoute: "digital-only",
    ownerRole: "Client Success",
    evidenceEvent: "communication.sent"
  },
  {
    id: "missing-source",
    label: "Missing source data",
    signal: "Document confidence or source evidence is incomplete.",
    complexity: "medium",
    sensitivity: "sensitive",
    defaultRoute: "request-data",
    ownerRole: "AlphaVest Analyst",
    evidenceEvent: "note.added"
  },
  {
    id: "judgement-call",
    label: "Judgement call required",
    signal: "The client must understand trade-offs before any next step.",
    complexity: "medium",
    sensitivity: "sensitive",
    defaultRoute: "schedule-call",
    ownerRole: "Senior Advisor",
    evidenceEvent: "call.scheduled"
  },
  {
    id: "family-conflict",
    label: "Family governance conflict",
    signal: "Several family roles are affected by the proposed decision.",
    complexity: "high",
    sensitivity: "restricted",
    defaultRoute: "f2f-workshop",
    ownerRole: "Senior Advisor",
    evidenceEvent: "call.completed"
  },
  {
    id: "tax-legal-specialist",
    label: "External specialist dependency",
    signal: "Tax or legal advice is required before AlphaVest can proceed.",
    complexity: "high",
    sensitivity: "restricted",
    defaultRoute: "external-specialist",
    ownerRole: "Client Success",
    evidenceEvent: "note.added"
  }
];

export const communicationRouteLabels: Record<CommunicationRoute, string> = {
  "digital-only": "Digital-only",
  "request-data": "Request data",
  "schedule-call": "Schedule call",
  "f2f-workshop": "F2F workshop",
  "external-specialist": "External specialist"
};

export function selectCommunicationRoute(trigger: CommunicationTrigger) {
  return trigger.defaultRoute;
}

export function permissionForCommunicationSend(role: Role, released: boolean) {
  return evaluateAccessControl({
    role,
    objectType: "communication",
    objectScope: "assigned",
    action: "send_client_message",
    sensitivity: "sensitive",
    clientVisible: false,
    secondConfirmation: true,
    complianceReview: released,
    relationshipAllowed: true
  });
}

export function evaluateCommunicationRelease(state: CommunicationApprovalState) {
  return canShowClientAdviceLikeOutput({
    advisorApproval: state.advisorApproval,
    complianceRelease: state.complianceRelease,
    evidenceRecord: state.evidenceRecordExists,
    permissionCheck: state.permissionCheck,
    outputClassification: "communication",
    clientVisibilityState: state.clientVisibilityState
  });
}

export function communicationSendTransition(state: CommunicationApprovalState) {
  return canTransition("communication", "released", "client_sent", {
    advisorApproval: state.advisorApproval,
    complianceRelease: state.complianceRelease,
    evidenceRecordExists: state.evidenceRecordExists,
    permissionCheck:
      typeof state.permissionCheck === "boolean"
        ? state.permissionCheck
        : state.permissionCheck.allowed
  });
}

export function communicationLifecycleEvents(trigger: CommunicationTrigger) {
  const communicationEvidence = evidenceForEvent(trigger.evidenceEvent, {
    actorRole: trigger.ownerRole,
    objectId: `comm-${trigger.id}`
  });
  const communicationAudit = auditEventForAction({
    actorRole: trigger.ownerRole,
    action: trigger.evidenceEvent,
    objectType: communicationEvidence.objectType,
    objectId: `comm-${trigger.id}`,
    result: trigger.defaultRoute === "digital-only" ? "created" : "updated"
  });

  return [
    {
      time: "09:10",
      event: "communication.drafted",
      actor: "AlphaVest Analyst",
      visibility: "Internal-only",
      evidence: "Communication Record"
    },
    {
      time: "09:22",
      event: "advice.approved",
      actor: "Senior Advisor",
      visibility: "Internal-only",
      evidence: "Approval Record"
    },
    {
      time: "09:35",
      event: trigger.evidenceEvent,
      actor: trigger.ownerRole,
      visibility: communicationEvidence.visibility,
      evidence: communicationAudit.evidenceLink
    }
  ];
}

export const serviceBlueprintStages = [
  "Platform Access",
  "Digital Intake",
  "Wealth Visibility",
  "Trigger Detection",
  "Draft Recommendation",
  "Advisor Approval",
  "Compliance Release",
  "Client Decision",
  "Evidence Preservation",
  "Review Rhythm"
] as const;

export const serviceBlueprintLanes = [
  {
    lane: "Customer actions",
    examples: ["Upload source records", "Review released message", "Record decision"]
  },
  {
    lane: "Frontstage digital UI",
    examples: ["Client dashboard", "Decision room", "Evidence vault"]
  },
  {
    lane: "Backstage AlphaVest actions",
    examples: ["Analyst review", "Advisor sign-off", "Compliance release"]
  },
  {
    lane: "Support processes",
    examples: ["Permission checks", "State transitions", "Audit sealing"]
  },
  {
    lane: "Evidence",
    examples: ["Document record", "Approval record", "Communication log"]
  }
] as const;

export const evidenceChain = [
  "Source document",
  "Extraction record",
  "Analyst note",
  "Recommendation draft",
  "Advisor approval",
  "Compliance release",
  "Client communication",
  "Decision record",
  "Locked evidence"
] as const;

export const escalationLoops = [
  {
    trigger: "Missing evidence",
    returnTo: "Digital Intake",
    owner: "AlphaVest Analyst"
  },
  {
    trigger: "Client concern",
    returnTo: "Advisor Approval",
    owner: "Senior Advisor"
  },
  {
    trigger: "Compliance block",
    returnTo: "Draft Recommendation",
    owner: "Compliance Officer"
  },
  {
    trigger: "External specialist needed",
    returnTo: "Support Processes",
    owner: "Client Success"
  }
] as const;

export const roadmapColumns = [
  {
    title: "MVP",
    tone: "success",
    items: [
      "Client dashboard and mobile upload",
      "Action board and decision room",
      "Evidence vault and audit mapping",
      "Internal review, advisor approval and compliance release",
      "Communication routing and service blueprint reference"
    ]
  },
  {
    title: "Phase 2",
    tone: "warning",
    items: [
      "Deeper CRM and document-system integration",
      "Expanded external specialist coordination",
      "Configurable family-governance workflows",
      "Operational reporting and SLA dashboards"
    ]
  },
  {
    title: "Future",
    tone: "info",
    items: [
      "Advanced AI assistance under human review",
      "Multi-family operating model",
      "Jurisdiction-aware automation",
      "Partner ecosystem extensions"
    ]
  }
] as const;

export const blockedFeatures = [
  {
    feature: "Autonomous advice",
    reason: "Advice-like output must remain human reviewed and compliance released.",
    dependency: "Advisor and compliance gates"
  },
  {
    feature: "Direct client release from draft",
    reason: "Draft and analyst-reviewed content cannot become client visible.",
    dependency: "No-unapproved-advice gate"
  },
  {
    feature: "External specialist self-serve access",
    reason: "Sensitive data sharing needs scoped permission and audit.",
    dependency: "Second confirmation and access model"
  },
  {
    feature: "Unverified data automation",
    reason: "Evidence replaces assumption; low confidence must block or return.",
    dependency: "Evidence validation flow"
  }
] as const;

export const roadmapDependencies = [
  ["Source data", "Evidence record"],
  ["Evidence record", "Analyst review"],
  ["Analyst review", "Advisor approval"],
  ["Advisor approval", "Compliance release"],
  ["Compliance release", "Client visibility"],
  ["Client visibility", "Decision / communication log"]
] as const;

export function isReferenceRoute(path: "/service-blueprint" | "/journey" | "/roadmap") {
  return path === "/service-blueprint" || path === "/journey" || path === "/roadmap";
}
