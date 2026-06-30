import type { ActorRoleKey, ActorTenantSlug } from "@/lib/actor-session";
import type {
  ObjectType,
  PermissionAction,
  Sensitivity,
  UUID,
  VisibilityStatus,
} from "@/lib/domain-types";

export type ClientVisibilityProcessId =
  | "A-003"
  | "A-004"
  | "A-006"
  | "B-006"
  | "B-007"
  | "B-010"
  | "B-012"
  | "C-002"
  | "C-003"
  | "C-004"
  | "C-005"
  | "C-008"
  | "D-008"
  | "E-006"
  | "F-005"
  | "G-002"
  | "G-003"
  | "G-005"
  | "G-006"
  | "G-009"
  | "H-001"
  | "H-003"
  | "I-001"
  | "I-004"
  | "I-007"
  | "J-009"
  | "K-006";

export type ClientVisibilitySafetyFoundationTicketId =
  | "P1-T01"
  | "P1-T02"
  | "P1-T03"
  | "P1-T04"
  | "P1-T05";

export type ClientVisibilitySafetyProcessContract = {
  allowedRole: ActorRoleKey;
  deniedRole: ActorRoleKey;
  domain: string;
  objectId: UUID;
  objectType: ObjectType;
  permissionAction: PermissionAction;
  stage1Tickets: ClientVisibilitySafetyFoundationTicketId[];
  processId: ClientVisibilityProcessId;
  requiredScope: "TENANT" | "OBJECT" | "PAYLOAD";
  requiresAuditTrace: boolean;
  requiresCurrentUserMapping: boolean;
  sensitivity: Sensitivity;
  tenantSlug: ActorTenantSlug;
  visibilityStatus: VisibilityStatus;
};

export const clientVisibilitySelectedProcessIds: readonly ClientVisibilityProcessId[] = [
  "A-003",
  "A-004",
  "A-006",
  "B-006",
  "B-007",
  "B-010",
  "B-012",
  "C-002",
  "C-003",
  "C-004",
  "C-005",
  "C-008",
  "D-008",
  "E-006",
  "F-005",
  "G-002",
  "G-003",
  "G-005",
  "G-006",
  "G-009",
  "H-001",
  "H-003",
  "I-001",
  "I-004",
  "I-007",
  "J-009",
  "K-006",
] as const;

const objectId = (processId: ClientVisibilityProcessId) => `clientVisibility:${processId}:stage1-object`;

export const clientVisibilitySafetyProcessContracts = [
  {
    allowedRole: "principal",
    deniedRole: "external_advisor",
    domain: "A Client Context",
    objectId: objectId("A-003"),
    objectType: "TENANT",
    permissionAction: "EDIT",
    stage1Tickets: ["P1-T01", "P1-T05"],
    processId: "A-003",
    requiredScope: "TENANT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "CONFIDENTIAL",
    tenantSlug: "bennett",
    visibilityStatus: "CLIENT_VISIBLE",
  },
  {
    allowedRole: "family_cfo",
    deniedRole: "external_advisor",
    domain: "A Client Context",
    objectId: objectId("A-004"),
    objectType: "FAMILY_MEMBER",
    permissionAction: "EDIT",
    stage1Tickets: ["P1-T01", "P1-T05"],
    processId: "A-004",
    requiredScope: "TENANT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "CONFIDENTIAL",
    tenantSlug: "bennett",
    visibilityStatus: "CLIENT_VISIBLE",
  },
  {
    allowedRole: "family_cfo",
    deniedRole: "external_advisor",
    domain: "A Client Context",
    objectId: objectId("A-006"),
    objectType: "ENTITY",
    permissionAction: "EDIT",
    stage1Tickets: ["P1-T01", "P1-T05"],
    processId: "A-006",
    requiredScope: "TENANT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "CONFIDENTIAL",
    tenantSlug: "bennett",
    visibilityStatus: "CLIENT_VISIBLE",
  },
  {
    allowedRole: "security_officer",
    deniedRole: "client_success",
    domain: "B Identity / Access / Governance",
    objectId: objectId("B-006"),
    objectType: "PERMISSION",
    permissionAction: "ASSIGN",
    stage1Tickets: ["P1-T01", "P1-T04", "P1-T05"],
    processId: "B-006",
    requiredScope: "TENANT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "INTERNAL_ONLY",
  },
  {
    allowedRole: "compliance_officer",
    deniedRole: "external_advisor",
    domain: "B Identity / Access / Governance",
    objectId: objectId("B-007"),
    objectType: "DOCUMENT",
    permissionAction: "REVIEW",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
    processId: "B-007",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "INTERNAL_ONLY",
  },
  {
    allowedRole: "admin",
    deniedRole: "client_success",
    domain: "B Identity / Access / Governance",
    objectId: objectId("B-010"),
    objectType: "ROLE",
    permissionAction: "MANAGE",
    stage1Tickets: ["P1-T01", "P1-T03", "P1-T04", "P1-T05"],
    processId: "B-010",
    requiredScope: "TENANT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "INTERNAL_ONLY",
  },
  {
    allowedRole: "security_officer",
    deniedRole: "external_advisor",
    domain: "B Identity / Access / Governance",
    objectId: objectId("B-012"),
    objectType: "AUDIT_EVENT",
    permissionAction: "VIEW",
    stage1Tickets: ["P1-T01", "P1-T04", "P1-T05"],
    processId: "B-012",
    requiredScope: "PAYLOAD",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "INTERNAL_ONLY",
  },
  {
    allowedRole: "family_cfo",
    deniedRole: "next_gen",
    domain: "C Document / Evidence Intake",
    objectId: objectId("C-002"),
    objectType: "DOCUMENT",
    permissionAction: "UPLOAD",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
    processId: "C-002",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "CONFIDENTIAL",
    tenantSlug: "bennett",
    visibilityStatus: "CLIENT_VISIBLE",
  },
  {
    allowedRole: "analyst",
    deniedRole: "next_gen",
    domain: "C Document / Evidence Intake",
    objectId: objectId("C-003"),
    objectType: "DOCUMENT",
    permissionAction: "EDIT",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
    processId: "C-003",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "INTERNAL_ONLY",
  },
  {
    allowedRole: "analyst",
    deniedRole: "next_gen",
    domain: "C Document / Evidence Intake",
    objectId: objectId("C-004"),
    objectType: "DOCUMENT",
    permissionAction: "REVIEW",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
    processId: "C-004",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "INTERNAL_ONLY",
  },
  {
    allowedRole: "analyst",
    deniedRole: "next_gen",
    domain: "C Document / Evidence Intake",
    objectId: objectId("C-005"),
    objectType: "EVIDENCE_RECORD",
    permissionAction: "REVIEW",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
    processId: "C-005",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "INTERNAL_ONLY",
  },
  {
    allowedRole: "compliance_officer",
    deniedRole: "admin",
    domain: "C Document / Evidence Intake",
    objectId: objectId("C-008"),
    objectType: "EVIDENCE_RECORD",
    permissionAction: "APPROVE",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
    processId: "C-008",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "COMPLIANCE_VISIBLE",
  },
  {
    allowedRole: "client_success",
    deniedRole: "next_gen",
    domain: "D Analysis Readiness",
    objectId: objectId("D-008"),
    objectType: "DATA_QUALITY_ISSUE",
    permissionAction: "CREATE",
    stage1Tickets: ["P1-T01", "P1-T04", "P1-T05"],
    processId: "D-008",
    requiredScope: "TENANT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "CONFIDENTIAL",
    tenantSlug: "bennett",
    visibilityStatus: "INTERNAL_ONLY",
  },
  {
    allowedRole: "analyst",
    deniedRole: "admin",
    domain: "E Advice Drafting",
    objectId: objectId("E-006"),
    objectType: "RECOMMENDATION",
    permissionAction: "VIEW",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T05"],
    processId: "E-006",
    requiredScope: "PAYLOAD",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "INTERNAL_ONLY",
  },
  {
    allowedRole: "senior_wealth_advisor",
    deniedRole: "analyst",
    domain: "F Advisor Review",
    objectId: objectId("F-005"),
    objectType: "RECOMMENDATION",
    permissionAction: "APPROVE",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
    processId: "F-005",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "ADVISOR_VISIBLE",
  },
  {
    allowedRole: "compliance_officer",
    deniedRole: "admin",
    domain: "G Compliance Review / Release",
    objectId: objectId("G-002"),
    objectType: "RECOMMENDATION",
    permissionAction: "REVIEW",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
    processId: "G-002",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "COMPLIANCE_VISIBLE",
  },
  {
    allowedRole: "compliance_officer",
    deniedRole: "admin",
    domain: "G Compliance Review / Release",
    objectId: objectId("G-003"),
    objectType: "RECOMMENDATION",
    permissionAction: "BLOCK",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
    processId: "G-003",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "COMPLIANCE_VISIBLE",
  },
  {
    allowedRole: "compliance_officer",
    deniedRole: "admin",
    domain: "G Compliance Review / Release",
    objectId: objectId("G-005"),
    objectType: "RECOMMENDATION",
    permissionAction: "BLOCK",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
    processId: "G-005",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "COMPLIANCE_VISIBLE",
  },
  {
    allowedRole: "compliance_officer",
    deniedRole: "admin",
    domain: "G Compliance Review / Release",
    objectId: objectId("G-006"),
    objectType: "RECOMMENDATION",
    permissionAction: "RELEASE",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
    processId: "G-006",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "COMPLIANCE_VISIBLE",
  },
  {
    allowedRole: "principal",
    deniedRole: "external_advisor",
    domain: "G Compliance Review / Release",
    objectId: objectId("G-009"),
    objectType: "DECISION",
    permissionAction: "VIEW",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T05"],
    processId: "G-009",
    requiredScope: "PAYLOAD",
    requiresAuditTrace: false,
    requiresCurrentUserMapping: true,
    sensitivity: "CONFIDENTIAL",
    tenantSlug: "bennett",
    visibilityStatus: "CLIENT_VISIBLE",
  },
  {
    allowedRole: "principal",
    deniedRole: "external_advisor",
    domain: "H Client Portal / Visibility",
    objectId: objectId("H-001"),
    objectType: "DECISION",
    permissionAction: "VIEW",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T05"],
    processId: "H-001",
    requiredScope: "PAYLOAD",
    requiresAuditTrace: false,
    requiresCurrentUserMapping: true,
    sensitivity: "CONFIDENTIAL",
    tenantSlug: "bennett",
    visibilityStatus: "CLIENT_VISIBLE",
  },
  {
    allowedRole: "principal",
    deniedRole: "external_advisor",
    domain: "H Client Portal / Visibility",
    objectId: objectId("H-003"),
    objectType: "EVIDENCE_RECORD",
    permissionAction: "VIEW",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T05"],
    processId: "H-003",
    requiredScope: "PAYLOAD",
    requiresAuditTrace: false,
    requiresCurrentUserMapping: true,
    sensitivity: "CONFIDENTIAL",
    tenantSlug: "bennett",
    visibilityStatus: "CLIENT_VISIBLE",
  },
  {
    allowedRole: "principal",
    deniedRole: "external_advisor",
    domain: "I Decision Capture",
    objectId: objectId("I-001"),
    objectType: "DECISION",
    permissionAction: "APPROVE",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
    processId: "I-001",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "CONFIDENTIAL",
    tenantSlug: "bennett",
    visibilityStatus: "CLIENT_VISIBLE",
  },
  {
    allowedRole: "principal",
    deniedRole: "external_advisor",
    domain: "I Decision Capture",
    objectId: objectId("I-004"),
    objectType: "DECISION",
    permissionAction: "VIEW",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T05"],
    processId: "I-004",
    requiredScope: "PAYLOAD",
    requiresAuditTrace: false,
    requiresCurrentUserMapping: true,
    sensitivity: "CONFIDENTIAL",
    tenantSlug: "bennett",
    visibilityStatus: "CLIENT_VISIBLE",
  },
  {
    allowedRole: "compliance_officer",
    deniedRole: "external_advisor",
    domain: "I Decision Capture",
    objectId: objectId("I-007"),
    objectType: "AUDIT_EVENT",
    permissionAction: "VIEW",
    stage1Tickets: ["P1-T01", "P1-T04", "P1-T05"],
    processId: "I-007",
    requiredScope: "PAYLOAD",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "INTERNAL_ONLY",
  },
  {
    allowedRole: "compliance_officer",
    deniedRole: "admin",
    domain: "J Export / Redaction",
    objectId: objectId("J-009"),
    objectType: "EXPORT_REQUEST",
    permissionAction: "APPROVE",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
    processId: "J-009",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "REDACTED",
  },
  {
    allowedRole: "compliance_officer",
    deniedRole: "admin",
    domain: "K Release Operations",
    objectId: objectId("K-006"),
    objectType: "RECOMMENDATION",
    permissionAction: "BLOCK",
    stage1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
    processId: "K-006",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "COMPLIANCE_VISIBLE",
  },
] as const satisfies readonly ClientVisibilitySafetyProcessContract[];

export type ClientVisibilitySafetyCoverageReport = {
  duplicateProcessIds: ClientVisibilityProcessId[];
  missingProcessIds: ClientVisibilityProcessId[];
  processCount: number;
  ticketCoverage: Record<ClientVisibilitySafetyFoundationTicketId, ClientVisibilityProcessId[]>;
};

export function buildClientVisibilitySafetyCoverageReport(): ClientVisibilitySafetyCoverageReport {
  const processIds = clientVisibilitySafetyProcessContracts.map((contract) => contract.processId);
  const duplicateProcessIds = processIds.filter(
    (processId, index) => processIds.indexOf(processId) !== index,
  );
  const missingProcessIds = clientVisibilitySelectedProcessIds.filter((processId) => !processIds.includes(processId));
  const ticketCoverage: ClientVisibilitySafetyCoverageReport["ticketCoverage"] = {
    "P1-T01": [],
    "P1-T02": [],
    "P1-T03": [],
    "P1-T04": [],
    "P1-T05": [],
  };

  for (const contract of clientVisibilitySafetyProcessContracts) {
    for (const ticketId of contract.stage1Tickets) {
      ticketCoverage[ticketId].push(contract.processId);
    }
  }

  return {
    duplicateProcessIds,
    missingProcessIds,
    processCount: processIds.length,
    ticketCoverage,
  };
}
