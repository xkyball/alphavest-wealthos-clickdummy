import type { DemoRoleKey, DemoTenantSlug } from "@/lib/demo-session";
import type {
  ObjectType,
  PermissionAction,
  Sensitivity,
  UUID,
  VisibilityStatus,
} from "@/lib/domain-types";

export type Av27ProcessId =
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

export type Av27SafetyFoundationTicketId =
  | "P1-T01"
  | "P1-T02"
  | "P1-T03"
  | "P1-T04"
  | "P1-T05";

export type Av27SafetyProcessContract = {
  allowedRole: DemoRoleKey;
  deniedRole: DemoRoleKey;
  domain: string;
  objectId: UUID;
  objectType: ObjectType;
  permissionAction: PermissionAction;
  phase1Tickets: Av27SafetyFoundationTicketId[];
  processId: Av27ProcessId;
  requiredScope: "TENANT" | "OBJECT" | "PAYLOAD";
  requiresAuditTrace: boolean;
  requiresCurrentUserMapping: boolean;
  sensitivity: Sensitivity;
  tenantSlug: DemoTenantSlug;
  visibilityStatus: VisibilityStatus;
};

export const av27SelectedProcessIds: readonly Av27ProcessId[] = [
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

const objectId = (processId: Av27ProcessId) => `av27:${processId}:phase1-object`;

export const av27SafetyProcessContracts = [
  {
    allowedRole: "principal",
    deniedRole: "external_advisor",
    domain: "A Client Context",
    objectId: objectId("A-003"),
    objectType: "TENANT",
    permissionAction: "EDIT",
    phase1Tickets: ["P1-T01", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T03", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
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
    phase1Tickets: ["P1-T01", "P1-T02", "P1-T03", "P1-T04", "P1-T05"],
    processId: "K-006",
    requiredScope: "OBJECT",
    requiresAuditTrace: true,
    requiresCurrentUserMapping: true,
    sensitivity: "RESTRICTED",
    tenantSlug: "bennett",
    visibilityStatus: "COMPLIANCE_VISIBLE",
  },
] as const satisfies readonly Av27SafetyProcessContract[];

export type Av27SafetyCoverageReport = {
  duplicateProcessIds: Av27ProcessId[];
  missingProcessIds: Av27ProcessId[];
  processCount: number;
  ticketCoverage: Record<Av27SafetyFoundationTicketId, Av27ProcessId[]>;
};

export function buildAv27SafetyCoverageReport(): Av27SafetyCoverageReport {
  const processIds = av27SafetyProcessContracts.map((contract) => contract.processId);
  const duplicateProcessIds = processIds.filter(
    (processId, index) => processIds.indexOf(processId) !== index,
  );
  const missingProcessIds = av27SelectedProcessIds.filter((processId) => !processIds.includes(processId));
  const ticketCoverage: Av27SafetyCoverageReport["ticketCoverage"] = {
    "P1-T01": [],
    "P1-T02": [],
    "P1-T03": [],
    "P1-T04": [],
    "P1-T05": [],
  };

  for (const contract of av27SafetyProcessContracts) {
    for (const ticketId of contract.phase1Tickets) {
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
