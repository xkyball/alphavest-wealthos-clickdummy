import type { DemoActor, DemoRole } from "@/lib/demo-session";
import type { ExportStatus, ObjectType, UUID } from "@/lib/domain-types";
import { permissionEngine } from "@/lib/permission-engine";
import type { DataQualityGate } from "@/lib/data-quality-service";
import {
  av27Phase6AllowedExportPayloadFields,
  av27Phase6PayloadFieldClassifications,
  inspectAv27Phase6ClientPayload,
  type Av27Phase6PayloadClassification,
} from "@/lib/av27-phase6-payload-contract";

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

export type ExportPayloadInspection = {
  clean: boolean;
  forbiddenFields: string[];
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
  stage: "draft" | "preview" | "approved" | "generated" | "downloaded" | "shared";
  allowedNextActions: Array<"preview" | "approve" | "generate" | "download" | "share">;
  missing: string[];
};

export type ExportPayloadClassification = Av27Phase6PayloadClassification;

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

function inspectClientExportPayload(payload: Record<string, unknown>): ExportPayloadInspection {
  const inspection = inspectAv27Phase6ClientPayload(payload, { surface: "export" });

  return {
    clean: inspection.clean && forbiddenExportPayloads(inspection.payloadClassifications).length === 0,
    forbiddenFields: inspection.forbiddenFields,
    missing: inspection.missing,
    payloadClassifications: inspection.payloadClassifications,
  };
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
  const stage =
    input.shared ? "shared" :
    input.downloaded ? "downloaded" :
    input.generated ? "generated" :
    input.approved ? "approved" :
    input.previewed ? "preview" :
    "draft";
  const allowedNextActions: ExportStepSeparationDecision["allowedNextActions"] = [];

  if (!input.previewed) missing.push("preview_required_before_approval");
  if (!input.approved) missing.push("approval_required_before_generation");
  if (!input.generated) missing.push("generation_required_before_download");
  if (!input.downloaded) missing.push("download_required_before_share");

  if (!input.previewed) allowedNextActions.push("preview");
  if (canApprove && !input.approved) allowedNextActions.push("approve");
  if (canGenerate && !input.generated) allowedNextActions.push("generate");
  if (canDownload && !input.downloaded) allowedNextActions.push("download");
  if (canShare && !input.shared) allowedNextActions.push("share");

  return {
    canApprove,
    canDownload,
    canGenerate,
    canShare,
    stage,
    allowedNextActions,
    missing,
  };
}

function canUseClientProjectionForExport(projection: ExportProjectionInput): ExportProjectionDecision {
  const missing: string[] = [];
  const inspection = inspectClientExportPayload(projection.payload);

  if (!projection.visible) {
    missing.push("client_safe_projection_visible");
    inspection.payloadClassifications.push("UNRELEASED_RECOMMENDATION");
  }

  missing.push(...inspection.missing);

  return {
    allowed: missing.length === 0 && forbiddenExportPayloads(inspection.payloadClassifications).length === 0,
    missing,
    payloadClassifications: [...new Set(inspection.payloadClassifications)],
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
      ...(input.targetId
        ? {
            objectScope: {
              clientTenantId: input.clientTenantId,
              objectIds: [input.targetId],
              objectType: "EXPORT_REQUEST" as const,
            },
          }
        : {}),
    },
    input.role
  );
  const missing: string[] = [];
  const redactionProfile = input.redactionProfile?.trim() ?? "";

  if (!permission.allowed) {
    missing.push("permission");
  }

  if (!redactionProfile) {
    missing.push("redaction_profile");
  }

  if (!input.approvalComplete) {
    missing.push("approval");
  }

  if (input.externalShare && !input.approvalComplete) {
    missing.push("external_share_approval");
  }

  if (!input.targetId) {
    missing.push("selected_export_request");
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
  av27AllowedExportPayloadFields: [...av27Phase6AllowedExportPayloadFields],
  av27PayloadFieldClassifications: av27Phase6PayloadFieldClassifications,
  evaluateExportScope,
  evaluateExportStepSeparation,
  canGenerateExport,
  canUseClientProjectionForExport,
  forbiddenExportPayloads,
  inspectClientExportPayload,
};
