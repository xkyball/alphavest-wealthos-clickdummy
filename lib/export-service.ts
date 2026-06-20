import type { DemoActor, DemoRole } from "@/lib/demo-session";
import type { ExportStatus, ObjectType, UUID } from "@/lib/domain-types";
import { permissionEngine } from "@/lib/permission-engine";

export type ExportGateDecision = {
  status: ExportStatus;
  allowedToGenerate: boolean;
  missing: string[];
  redactionProfile: string;
  auditRequired: boolean;
  reason: string;
};

export type ExportProjectionInput = {
  visible: boolean;
  payload: Record<string, unknown>;
  hiddenFields?: string[];
  reasonCode?: string;
};

export type ExportProjectionDecision = {
  allowed: boolean;
  missing: string[];
  payloadClassifications: ExportPayloadClassification[];
};

export type ExportPayloadClassification =
  | "CLIENT_SAFE_SUMMARY"
  | "RELEASED_EVIDENCE_SUMMARY"
  | "AI_DRAFT"
  | "INTERNAL_RATIONALE"
  | "COMPLIANCE_NOTES"
  | "UNRELEASED_EVIDENCE"
  | "UNRELEASED_RECOMMENDATION"
  | "HIDDEN_FIELD";

const forbiddenClientExportPayloads = new Set<ExportPayloadClassification>([
  "AI_DRAFT",
  "INTERNAL_RATIONALE",
  "COMPLIANCE_NOTES",
  "UNRELEASED_EVIDENCE",
  "UNRELEASED_RECOMMENDATION",
  "HIDDEN_FIELD",
]);

function forbiddenExportPayloads(payloadClassifications: ExportPayloadClassification[] = []) {
  return payloadClassifications.filter((classification) => forbiddenClientExportPayloads.has(classification));
}

function canUseClientProjectionForExport(projection: ExportProjectionInput): ExportProjectionDecision {
  const missing: string[] = [];
  const payloadClassifications: ExportPayloadClassification[] = [];
  const payloadKeys = Object.keys(projection.payload);

  if (!projection.visible) {
    missing.push("client_safe_projection_visible");
    payloadClassifications.push("UNRELEASED_RECOMMENDATION");
  }

  if (payloadKeys.length === 0) {
    missing.push("client_safe_payload");
    payloadClassifications.push("HIDDEN_FIELD");
  }

  for (const key of payloadKeys) {
    if (key === "clientSummary") {
      payloadClassifications.push("CLIENT_SAFE_SUMMARY");
      continue;
    }

    if (key === "title" || key === "documentType" || key === "status" || key === "uploadedAt") {
      payloadClassifications.push("RELEASED_EVIDENCE_SUMMARY");
      continue;
    }

    missing.push(`forbidden_projection_field:${key}`);
    payloadClassifications.push("HIDDEN_FIELD");
  }

  return {
    allowed: missing.length === 0 && forbiddenExportPayloads(payloadClassifications).length === 0,
    missing,
    payloadClassifications: [...new Set(payloadClassifications)],
  };
}

function canGenerateExport(input: {
  actor: DemoActor;
  role: DemoRole;
  platformTenantId: UUID;
  clientTenantId: UUID;
  targetType: ObjectType;
  targetId?: UUID;
  redactionProfile?: string;
  payloadClassifications?: ExportPayloadClassification[];
  approvalComplete?: boolean;
  auditPersistenceAvailable?: boolean;
  externalShare?: boolean;
}): ExportGateDecision {
  const permission = permissionEngine.can(
    input.actor,
    "EXPORT",
    {
      objectType: "EXPORT_REQUEST",
      objectId: input.targetId,
      clientTenantId: input.clientTenantId,
    },
    {
      platformTenantId: input.platformTenantId,
      clientTenantId: input.clientTenantId,
    },
    input.role
  );
  const missing: string[] = [];
  const redactionProfile = input.redactionProfile ?? "client-visible";

  if (!permission.allowed) {
    missing.push("permission");
  }

  if (!redactionProfile) {
    missing.push("redaction_profile");
  }

  if (input.externalShare && !input.approvalComplete) {
    missing.push("external_share_approval");
  }

  if (input.auditPersistenceAvailable === false) {
    missing.push("audit_persistence");
  }

  for (const classification of forbiddenExportPayloads(input.payloadClassifications)) {
    missing.push(`forbidden_payload:${classification}`);
  }

  return {
    status: missing.length > 0 ? "APPROVAL_REQUIRED" : "GENERATED",
    allowedToGenerate: missing.length === 0,
    missing,
    redactionProfile,
    auditRequired: true,
    reason:
      missing.length === 0
        ? "Demo export can be generated with audit and redaction metadata."
        : "Demo export remains gated until missing controls are complete.",
  };
}

export const exportService = {
  canGenerateExport,
  canUseClientProjectionForExport,
  forbiddenExportPayloads,
};
