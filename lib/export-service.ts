import type { DemoActor, DemoRole } from "@/lib/demo-session";
import type { ExportStatus, ObjectType, UUID } from "@/lib/domain-types";
import { permissionEngine } from "@/lib/permission-engine";
import type { DataQualityGate } from "@/lib/data-quality-service";

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

export type ExportScopeAccess = "Allowed" | "Limited" | "Restricted" | "Not permitted";

export type ExportScopeCandidate = {
  id: UUID;
  access: ExportScopeAccess;
  name: string;
  selected: boolean;
  type: string;
  payloadClassifications?: ExportPayloadClassification[];
};

export type ExportScopeDecision = {
  allowedSelectedCount: number;
  blockedItems: Array<{
    id: UUID;
    name: string;
    reason: string;
  }>;
  includedItems: ExportScopeCandidate[];
  missing: string[];
  valid: boolean;
};

export type ExportStepSeparationInput = {
  approved: boolean;
  downloaded: boolean;
  generated: boolean;
  previewed: boolean;
  shared: boolean;
};

export type ExportStepSeparationDecision = {
  canApprove: boolean;
  canDownload: boolean;
  canGenerate: boolean;
  canShare: boolean;
  missing: string[];
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

function evaluateExportScope(items: ExportScopeCandidate[]): ExportScopeDecision {
  const missing: string[] = [];
  const selected = items.filter((item) => item.selected);
  const blockedItems: ExportScopeDecision["blockedItems"] = [];
  const includedItems: ExportScopeCandidate[] = [];

  for (const item of selected) {
    const forbidden = forbiddenExportPayloads(item.payloadClassifications);

    if (item.access === "Restricted" || item.access === "Not permitted") {
      blockedItems.push({
        id: item.id,
        name: item.name,
        reason: item.access === "Restricted" ? "restricted_object" : "not_permitted",
      });
      continue;
    }

    if (forbidden.length > 0) {
      blockedItems.push({
        id: item.id,
        name: item.name,
        reason: `forbidden_payload:${forbidden.join(",")}`,
      });
      continue;
    }

    includedItems.push(item);
  }

  if (selected.length === 0) {
    missing.push("selected_export_objects");
  }

  if (blockedItems.length > 0) {
    missing.push("blocked_or_forbidden_scope_items");
  }

  return {
    allowedSelectedCount: includedItems.length,
    blockedItems,
    includedItems,
    missing,
    valid: missing.length === 0,
  };
}

function evaluateExportStepSeparation(input: ExportStepSeparationInput): ExportStepSeparationDecision {
  const missing: string[] = [];
  const canApprove = input.previewed;
  const canGenerate = canApprove && input.approved;
  const canDownload = canGenerate && input.generated;
  const canShare = canDownload && input.downloaded;

  if (!input.previewed) missing.push("preview_required_before_approval");
  if (!input.approved) missing.push("approval_required_before_generation");
  if (!input.generated) missing.push("generation_required_before_download");
  if (!input.downloaded) missing.push("download_required_before_share");

  return {
    canApprove,
    canDownload,
    canGenerate,
    canShare,
    missing,
  };
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
  dataQualityGate?: DataQualityGate;
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

  if (input.dataQualityGate && !input.dataQualityGate.passed) {
    missing.push(input.dataQualityGate.gateName.toLowerCase());
    missing.push(...input.dataQualityGate.missing);
  }

  for (const classification of forbiddenExportPayloads(input.payloadClassifications)) {
    missing.push(`forbidden_payload:${classification}`);
  }

  const uniqueMissing = [...new Set(missing)];

  return {
    status: uniqueMissing.length > 0 ? "APPROVAL_REQUIRED" : "GENERATED",
    allowedToGenerate: uniqueMissing.length === 0,
    missing: uniqueMissing,
    redactionProfile,
    auditRequired: true,
    reason:
      uniqueMissing.length === 0
        ? "Demo export can be generated with audit and redaction metadata."
        : "Demo export remains gated until missing controls are complete.",
  };
}

export const exportService = {
  evaluateExportScope,
  evaluateExportStepSeparation,
  canGenerateExport,
  canUseClientProjectionForExport,
  forbiddenExportPayloads,
};
