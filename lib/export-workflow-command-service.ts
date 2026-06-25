import {
  AuditResult,
  ExportStatus,
  ObjectType,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";

import { dataQualityService } from "@/lib/data-quality-service";
import { demoPlatformTenantId, type DemoRoleKey, type DemoTenantSlug, createDemoSession, demoTenants } from "@/lib/demo-session";
import { av27Phase6AllowedExportPayloadFields, isAv27Phase6PayloadClassification } from "@/lib/av27-phase6-payload-contract";
import { exportPackageService } from "@/lib/export-package-service";
import { exportService, type ExportPayloadClassification, type ExportScopeCandidate } from "@/lib/export-service";
import { fileMetadataService } from "@/lib/file-metadata-service";
import { stableId } from "@/lib/stable-id";

export const exportRedactionAllowlist = av27Phase6AllowedExportPayloadFields;

export const exportWorkflowCommandIds = [
  "SET_SCOPE",
  "VALIDATE_REDACTION",
  "PREVIEW",
  "APPROVE",
  "GENERATE",
  "DOWNLOAD",
  "SHARE",
] as const;

export type ExportWorkflowCommandId = (typeof exportWorkflowCommandIds)[number];

export const exportWorkflowCommandSpinePath = "lib/export-workflow-command-service.ts" as const;
export const exportWorkflowCanonicalApiRoute = "/api/export-workflow" as const;
export const exportWorkflowCommandAuditEventTypes = exportWorkflowCommandIds.map(
  (command) => `export.workflow.${command.toLowerCase()}`,
);

export type ExportWorkflowProofFamilyAuthority =
  | "COMMAND_SPINE"
  | "HELPER_ATTACHMENT"
  | "LEGACY_REFERENCE_ONLY"
  | "COMPATIBILITY_ADAPTER";

export type ExportWorkflowProofFamilyId =
  | "EXPORT_WORKFLOW_COMMAND_SERVICE"
  | "P44_PHASE8_EXPORT_CLOSURE"
  | "WP10_EXPORT_SCOPE_REDACTION_APPROVAL_UX"
  | "AV27_PHASE6_PAYLOAD_CONTRACT"
  | "AV27_PHASE7_PAYLOAD_SWEEP"
  | "WCL_EXPORT_SAFETY"
  | "FILE_EXPORT_REALISM"
  | "DEMO_WORKFLOW_EXPORT_COMPATIBILITY";

export type ExportWorkflowProofFamily = {
  familyId: ExportWorkflowProofFamilyId;
  authority: ExportWorkflowProofFamilyAuthority;
  canonicalApiRoute: typeof exportWorkflowCanonicalApiRoute;
  canonicalCommandService: typeof exportWorkflowCommandSpinePath;
  helperFiles: readonly string[];
  proofFiles: readonly string[];
  rule: string;
};

export type ExportWorkflowCommandSpineContract = {
  canonicalApiRoute: typeof exportWorkflowCanonicalApiRoute;
  canonicalCommandService: typeof exportWorkflowCommandSpinePath;
  commandIds: readonly ExportWorkflowCommandId[];
  expectedAuditEvents: readonly string[];
  legacyProofFamiliesRetired: boolean;
  proofFamilies: readonly ExportWorkflowProofFamily[];
};

export const exportWorkflowCommandSpineContract = {
  canonicalApiRoute: exportWorkflowCanonicalApiRoute,
  canonicalCommandService: exportWorkflowCommandSpinePath,
  commandIds: exportWorkflowCommandIds,
  expectedAuditEvents: exportWorkflowCommandAuditEventTypes,
  legacyProofFamiliesRetired: true,
  proofFamilies: [
    {
      authority: "COMMAND_SPINE",
      canonicalApiRoute: exportWorkflowCanonicalApiRoute,
      canonicalCommandService: exportWorkflowCommandSpinePath,
      familyId: "EXPORT_WORKFLOW_COMMAND_SERVICE",
      helperFiles: ["lib/export-service.ts", "lib/export-package-service.ts", "lib/file-metadata-service.ts"],
      proofFiles: ["tests/export-workflow-api.spec.ts", "tests/p44-phase8-certification.spec.ts"],
      rule: "All export state mutations, stage progression and audit event semantics enter through this command service.",
    },
    {
      authority: "HELPER_ATTACHMENT",
      canonicalApiRoute: exportWorkflowCanonicalApiRoute,
      canonicalCommandService: exportWorkflowCommandSpinePath,
      familyId: "P44_PHASE8_EXPORT_CLOSURE",
      helperFiles: ["lib/p44-phase8-export-command-closure.ts"],
      proofFiles: ["tests/p44-phase8-certification.spec.ts"],
      rule: "Phase 8 is certification evidence for the command spine, not a second export command authority.",
    },
    {
      authority: "LEGACY_REFERENCE_ONLY",
      canonicalApiRoute: exportWorkflowCanonicalApiRoute,
      canonicalCommandService: exportWorkflowCommandSpinePath,
      familyId: "WP10_EXPORT_SCOPE_REDACTION_APPROVAL_UX",
      helperFiles: ["docs/v0-96/uploads/ALPHAVEST_V0_96_WP10_EXPORT_SCOPE_REDACTION_APPROVAL_UX_DEEP_TASK_DESCRIPTION.md"],
      proofFiles: ["tests/export-workflow-api.spec.ts", "tests/phase8-export-workflow-api.spec.ts"],
      rule: "WP10 describes the legacy export UX intent; implementation authority is retired into the command spine.",
    },
    {
      authority: "HELPER_ATTACHMENT",
      canonicalApiRoute: exportWorkflowCanonicalApiRoute,
      canonicalCommandService: exportWorkflowCommandSpinePath,
      familyId: "AV27_PHASE6_PAYLOAD_CONTRACT",
      helperFiles: ["lib/av27-phase6-payload-contract.ts", "lib/export-service.ts"],
      proofFiles: ["tests/av27-phase6-payload-contract.spec.ts", "tests/export-safety.spec.ts"],
      rule: "AV27 payload classification supplies redaction vocabulary only; it cannot advance export workflow state.",
    },
    {
      authority: "HELPER_ATTACHMENT",
      canonicalApiRoute: exportWorkflowCanonicalApiRoute,
      canonicalCommandService: exportWorkflowCommandSpinePath,
      familyId: "AV27_PHASE7_PAYLOAD_SWEEP",
      helperFiles: ["lib/av27-phase7-certification.ts"],
      proofFiles: ["tests/av27-phase7-certification.spec.ts"],
      rule: "AV27 Phase 7 payload sweep is negative proof attached to the export command spine.",
    },
    {
      authority: "HELPER_ATTACHMENT",
      canonicalApiRoute: exportWorkflowCanonicalApiRoute,
      canonicalCommandService: exportWorkflowCommandSpinePath,
      familyId: "WCL_EXPORT_SAFETY",
      helperFiles: ["lib/control-layer/export-safety.ts", "lib/export-service.ts"],
      proofFiles: ["tests/export-safety.spec.ts"],
      rule: "Control-layer export safety is a gate helper and must not expose an alternate export action surface.",
    },
    {
      authority: "HELPER_ATTACHMENT",
      canonicalApiRoute: exportWorkflowCanonicalApiRoute,
      canonicalCommandService: exportWorkflowCommandSpinePath,
      familyId: "FILE_EXPORT_REALISM",
      helperFiles: ["lib/export-package-service.ts", "lib/file-metadata-service.ts", "lib/export-service.ts"],
      proofFiles: ["tests/file-export-realism.spec.ts"],
      rule: "Package and file realism prove generated metadata shape only after the command spine permits generation.",
    },
    {
      authority: "COMPATIBILITY_ADAPTER",
      canonicalApiRoute: exportWorkflowCanonicalApiRoute,
      canonicalCommandService: exportWorkflowCommandSpinePath,
      familyId: "DEMO_WORKFLOW_EXPORT_COMPATIBILITY",
      helperFiles: ["app/api/demo-workflow/route.ts", "lib/demo-workflow-mutation.ts"],
      proofFiles: ["tests/demo-workflow-api.spec.ts", "tests/phase8-export-workflow-api.spec.ts"],
      rule: "Demo workflow export branches are compatibility only and must not become new export command truth.",
    },
  ],
} as const satisfies ExportWorkflowCommandSpineContract;

export function certifyExportWorkflowCommandSpineContract(
  contract: ExportWorkflowCommandSpineContract = exportWorkflowCommandSpineContract,
) {
  const commandSpineFamilies = contract.proofFamilies.filter((family) => family.authority === "COMMAND_SPINE");
  const retiredFamilies = contract.proofFamilies.filter((family) => family.authority !== "COMMAND_SPINE");
  const expectedAuditEvents = contract.commandIds.map((command) => `export.workflow.${command.toLowerCase()}`);
  const missingProof: string[] = [];

  if (contract.canonicalCommandService !== exportWorkflowCommandSpinePath) missingProof.push("canonical_command_service");
  if (contract.canonicalApiRoute !== exportWorkflowCanonicalApiRoute) missingProof.push("canonical_api_route");
  if (!contract.legacyProofFamiliesRetired) missingProof.push("legacy_proof_families_retired_flag");
  if (commandSpineFamilies.length !== 1 || commandSpineFamilies[0]?.familyId !== "EXPORT_WORKFLOW_COMMAND_SERVICE") {
    missingProof.push("single_export_command_spine");
  }
  if (retiredFamilies.some((family) => family.canonicalCommandService !== exportWorkflowCommandSpinePath)) {
    missingProof.push("retired_family_canonical_service");
  }
  if (retiredFamilies.some((family) => family.canonicalApiRoute !== exportWorkflowCanonicalApiRoute)) {
    missingProof.push("retired_family_canonical_route");
  }
  if (expectedAuditEvents.join("|") !== contract.expectedAuditEvents.join("|")) {
    missingProof.push("command_audit_event_alignment");
  }

  return {
    canonicalApiRoute: contract.canonicalApiRoute,
    canonicalCommandService: contract.canonicalCommandService,
    certification: missingProof.length === 0 ? "EXPORT_COMMAND_SPINE_READY" : "EXPORT_COMMAND_SPINE_BLOCKED",
    commandAuthorityFamilyIds: commandSpineFamilies.map((family) => family.familyId),
    legacyProofFamiliesRetired: contract.legacyProofFamiliesRetired,
    missingProof,
    retiredFamilyIds: retiredFamilies.map((family) => family.familyId),
  };
}

export type ExportWorkflowCommandRequest = {
  command: ExportWorkflowCommandId;
  exportRequestId?: string;
  externalShare?: boolean;
  payload?: Record<string, unknown>;
  reason?: string;
  redactionProfile?: string;
  scopeItems?: ExportScopeCandidate[];
  tenantSlug: DemoTenantSlug;
  roleKey: DemoRoleKey;
};

type ExportWorkflowCommandInput = ExportWorkflowCommandRequest & {
  requestId: string;
};

export class ExportWorkflowCommandError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly reasonCode: "INVALID_REQUEST" | "PERMISSION_DENIED" | "SAFE_ERROR" | "SCOPE_DENIED",
    readonly issues: string[] = [],
  ) {
    super(message);
  }
}

const exportWorkflowOperationalRoles = new Set<DemoRoleKey>(["principal", "family_cfo", "compliance_officer"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function inputJsonObject(value: Prisma.JsonValue | null | undefined): Prisma.InputJsonObject {
  return isRecord(value) ? (value as Prisma.InputJsonObject) : {};
}

function inputJsonRecord(value: unknown): Prisma.InputJsonObject {
  return isRecord(value) ? (value as Prisma.InputJsonObject) : {};
}

function isExportWorkflowCommandId(value: unknown): value is ExportWorkflowCommandId {
  return typeof value === "string" && exportWorkflowCommandIds.some((command) => command === value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function booleanValue(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function parseScopeItems(value: unknown): ExportScopeCandidate[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return undefined;

  return value
    .filter(isRecord)
    .map((item, index) => ({
      access: item.access === "Allowed" || item.access === "Limited" || item.access === "Restricted" || item.access === "Not permitted"
        ? item.access
        : "Restricted",
      id: typeof item.id === "string" ? item.id : `scope-item-${index}`,
      name: typeof item.name === "string" ? item.name : `Scope item ${index + 1}`,
      payloadClassifications: Array.isArray(item.payloadClassifications)
        ? item.payloadClassifications.filter((classification): classification is ExportPayloadClassification =>
            isAv27Phase6PayloadClassification(classification)
          )
        : undefined,
      selected: item.selected === true,
      type: typeof item.type === "string" ? item.type : "Object",
    }));
}

export function parseExportWorkflowCommandRequest(body: unknown):
  | { ok: true; request: ExportWorkflowCommandRequest }
  | { ok: false; issues: string[] } {
  if (!isRecord(body)) {
    return { ok: false, issues: ["valid_json_object_required"] };
  }

  const issues = [
    ...(!isExportWorkflowCommandId(body.command) ? ["valid_export_command_required"] : []),
    ...(!stringValue(body.tenantSlug) ? ["tenant_slug_required"] : []),
    ...(!stringValue(body.roleKey) ? ["role_key_required"] : []),
  ];
  const scopeItems = parseScopeItems(body.scopeItems);

  if (body.scopeItems !== undefined && !scopeItems) issues.push("scope_items_must_be_array");
  if (body.payload !== undefined && !isRecord(body.payload)) issues.push("payload_must_be_object");
  if (body.externalShare !== undefined && typeof body.externalShare !== "boolean") issues.push("external_share_must_be_boolean");
  if (body.command === "SET_SCOPE" && (!scopeItems || scopeItems.length === 0)) issues.push("scope_items_required");
  if (["VALIDATE_REDACTION", "PREVIEW", "APPROVE", "GENERATE"].includes(String(body.command)) && !stringValue(body.exportRequestId)) {
    issues.push("export_request_id_required");
  }
  if (["VALIDATE_REDACTION", "PREVIEW", "APPROVE", "GENERATE"].includes(String(body.command)) && !stringValue(body.redactionProfile)) {
    issues.push("redaction_profile_required");
  }
  if (["DOWNLOAD", "SHARE"].includes(String(body.command)) && !stringValue(body.exportRequestId)) {
    issues.push("export_request_id_required");
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    request: {
      command: body.command as ExportWorkflowCommandId,
      ...(booleanValue(body.externalShare) !== undefined ? { externalShare: booleanValue(body.externalShare) } : {}),
      ...(isRecord(body.payload) ? { payload: body.payload } : {}),
      ...(scopeItems ? { scopeItems } : {}),
      ...(stringValue(body.exportRequestId) ? { exportRequestId: stringValue(body.exportRequestId) } : {}),
      ...(stringValue(body.reason) ? { reason: stringValue(body.reason) } : {}),
      ...(stringValue(body.redactionProfile) ? { redactionProfile: stringValue(body.redactionProfile) } : {}),
      roleKey: body.roleKey as DemoRoleKey,
      tenantSlug: body.tenantSlug as DemoTenantSlug,
    },
  };
}

function requireDemoTenant(tenantSlug: DemoTenantSlug) {
  const tenant = demoTenants.find((candidate) => candidate.slug === tenantSlug);
  if (!tenant) {
    throw new ExportWorkflowCommandError("Export workflow tenant is not available.", 400, "INVALID_REQUEST", [
      "valid_tenant_slug_required",
    ]);
  }

  return tenant;
}

function requireExportWorkflowRole(roleKey: DemoRoleKey, command: ExportWorkflowCommandId) {
  if (!exportWorkflowOperationalRoles.has(roleKey)) {
    throw new ExportWorkflowCommandError("Export command is not permitted for this role.", 403, "PERMISSION_DENIED", [
      "export_role_denied",
      `${command.toLowerCase()}_requires_export_operational_role`,
    ]);
  }
}

async function loadExportRequest(prisma: PrismaClient, input: ExportWorkflowCommandInput) {
  const tenant = requireDemoTenant(input.tenantSlug);
  const exportRequest = await prisma.exportRequest.findFirst({
    where: {
      clientTenantId: tenant.id,
      id: input.exportRequestId,
    },
  });

  if (!exportRequest) {
    throw new ExportWorkflowCommandError("Export request is not available in this scope.", 403, "SCOPE_DENIED", [
      "export_request_scope_denied",
    ]);
  }

  return { exportRequest, tenant };
}

async function writeExportAudit(
  tx: Prisma.TransactionClient,
  input: ExportWorkflowCommandInput & {
    clientTenantId: string;
    exportRequestId: string;
    metadataJson?: Prisma.InputJsonObject;
    nextState?: string;
    previousState?: string;
    result: AuditResult;
  },
) {
  return tx.auditEvent.create({
    data: {
      actorRoleKey: input.roleKey,
      clientTenantId: input.clientTenantId,
      eventType: `export.workflow.${input.command.toLowerCase()}`,
      metadataJson: {
        exportWorkflowCommand: input.command,
        noClientRelease: true,
        noRealBinaryStorage: true,
        ...(input.metadataJson ?? {}),
      },
      nextState: input.nextState ?? null,
      platformTenantId: demoPlatformTenantId,
      previousState: input.previousState ?? null,
      reason: input.reason ?? "Export workflow command executed through scoped API.",
      result: input.result,
      targetId: input.exportRequestId,
      targetType: ObjectType.EXPORT_REQUEST,
    },
  });
}

function permissionGate(input: ExportWorkflowCommandInput & { clientTenantId: string; exportRequestId: string }) {
  const session = createDemoSession({ roleKey: input.roleKey, tenantSlug: input.tenantSlug });
  const permission = exportService.canGenerateExport({
    actor: session.actor,
    approvalComplete: input.command === "GENERATE" || input.command === "DOWNLOAD" || input.command === "SHARE",
    auditPersistenceAvailable: true,
    clientTenantId: input.clientTenantId,
    externalShare: input.externalShare === true,
    platformTenantId: demoPlatformTenantId,
    redactionProfile: input.redactionProfile ?? "client-safe-redacted",
    role: session.role,
    targetId: input.exportRequestId,
    targetType: "EXPORT_REQUEST",
  });

  if (permission.missing.includes("permission") || permission.missing.some((missing) => missing.startsWith("forbidden_payload"))) {
    throw new ExportWorkflowCommandError("Export command is not permitted for this role or payload.", 403, "PERMISSION_DENIED", [
      ...permission.missing,
    ]);
  }
}

function requireExportStatus(
  currentStatus: ExportStatus,
  allowedStatuses: ExportStatus[],
  issue: string,
  message: string,
) {
  if (!allowedStatuses.includes(currentStatus)) {
    throw new ExportWorkflowCommandError(message, 400, "INVALID_REQUEST", [issue]);
  }
}

function validateRedactionPayload(input: ExportWorkflowCommandInput) {
  const inspection = exportService.inspectClientExportPayload(input.payload ?? { clientSummary: "Client-safe export preview." });
  const hiddenDisallowedFields = inspection.forbiddenFields.filter((field) => !exportRedactionAllowlist.includes(field as never));

  if (!inspection.clean || hiddenDisallowedFields.length > 0) {
    throw new ExportWorkflowCommandError("Export payload contains forbidden internal or unreleased fields.", 400, "INVALID_REQUEST", [
      "forbidden_export_payload",
      ...inspection.missing,
    ]);
  }

  return inspection;
}

async function buildDataQualityGate(prisma: PrismaClient, clientTenantId: string, exportRequestId: string) {
  const snapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
    clientTenantId,
    targetId: exportRequestId,
    targetType: ObjectType.EXPORT_REQUEST,
  });

  return dataQualityService.evaluateDataQualityReleaseGate(snapshot);
}

export async function executeExportWorkflowCommand(prisma: PrismaClient, request: ExportWorkflowCommandRequest) {
  const input: ExportWorkflowCommandInput = {
    ...request,
    requestId: request.exportRequestId ?? stableId(`export-command:${request.tenantSlug}:${Date.now()}`),
  };

  requireExportWorkflowRole(input.roleKey, input.command);

  if (input.command === "SET_SCOPE") {
    const tenant = requireDemoTenant(input.tenantSlug);
    const scopeDecision = exportService.evaluateExportScope(input.scopeItems ?? []);

    if (!scopeDecision.valid) {
      throw new ExportWorkflowCommandError("Export scope contains blocked or forbidden objects.", 400, "INVALID_REQUEST", [
        ...scopeDecision.missing,
      ]);
    }

    const created = await prisma.$transaction(async (tx) => {
      const exportRequest = await tx.exportRequest.create({
        data: {
          approvalRequired: true,
          clientTenantId: tenant.id,
          exportType: "EVIDENCE_PACKAGE",
          redactionProfile: input.redactionProfile ?? "client-safe-redacted",
          requestedByUserId: stableId(`user:${input.tenantSlug}:principal`),
          scopeJson: {
            exportLifecycle: { stage: "scope", scopedAt: new Date().toISOString() },
            generatedFileIsMetadataOnly: true,
            redactionAllowlist: [...exportRedactionAllowlist],
            selectedObjects: scopeDecision.includedItems.map((item) => ({
              id: item.id,
              type: item.type,
            })),
          } as Prisma.InputJsonObject,
          status: ExportStatus.SCOPE_SELECTED,
        },
      });

      const audit = await writeExportAudit(tx, {
        ...input,
        clientTenantId: tenant.id,
        exportRequestId: exportRequest.id,
        metadataJson: { allowedSelectedCount: scopeDecision.allowedSelectedCount },
        nextState: ExportStatus.SCOPE_SELECTED,
        result: AuditResult.SUCCESS,
      });

      return { audit, exportRequest };
    });

    return {
      auditEventId: created.audit.id,
      exportRequestId: created.exportRequest.id,
      mutated: true,
      noClientRelease: true,
      noRealBinaryStorage: true,
      status: created.exportRequest.status,
    };
  }

  const { exportRequest, tenant } = await loadExportRequest(prisma, input);
  permissionGate({ ...input, clientTenantId: tenant.id, exportRequestId: exportRequest.id });

  if (input.command === "VALIDATE_REDACTION" || input.command === "PREVIEW") {
    if (input.command === "VALIDATE_REDACTION") {
      requireExportStatus(
        exportRequest.status,
        [ExportStatus.SCOPE_SELECTED, ExportStatus.REDACTION_PENDING],
        "scope_required_before_redaction",
        "Export redaction requires a selected scope first.",
      );
    }
    if (input.command === "PREVIEW") {
      requireExportStatus(
        exportRequest.status,
        [ExportStatus.REDACTION_PENDING],
        "redaction_required_before_preview",
        "Export preview requires redaction validation first.",
      );
    }

    const inspection = validateRedactionPayload(input);
    const nextStatus = input.command === "PREVIEW" ? ExportStatus.APPROVAL_REQUIRED : ExportStatus.REDACTION_PENDING;
    const currentScope = inputJsonObject(exportRequest.scopeJson);

    const updated = await prisma.$transaction(async (tx) => {
      const record = await tx.exportRequest.update({
        data: {
          redactionProfile: input.redactionProfile ?? exportRequest.redactionProfile,
          scopeJson: {
            ...currentScope,
            exportLifecycle: {
              ...inputJsonRecord(currentScope.exportLifecycle),
              stage: input.command === "PREVIEW" ? "preview" : "redaction",
            },
            payloadClassifications: inspection.payloadClassifications,
            redactionAllowlist: [...exportRedactionAllowlist],
          } as Prisma.InputJsonObject,
          status: nextStatus,
        },
        where: { id: exportRequest.id },
      });
      const audit = await writeExportAudit(tx, {
        ...input,
        clientTenantId: tenant.id,
        exportRequestId: exportRequest.id,
        metadataJson: {
          forbiddenFields: inspection.forbiddenFields,
          payloadClassifications: inspection.payloadClassifications,
        },
        nextState: nextStatus,
        previousState: exportRequest.status,
        result: AuditResult.SUCCESS,
      });

      return { audit, record };
    });

    return {
      auditEventId: updated.audit.id,
      exportRequestId: updated.record.id,
      mutated: true,
      noClientRelease: true,
      noRealBinaryStorage: true,
      status: updated.record.status,
    };
  }

  if (input.command === "APPROVE" || input.command === "GENERATE" || input.command === "DOWNLOAD" || input.command === "SHARE") {
    const inspection = validateRedactionPayload(input);
    const dataQualityGate = await buildDataQualityGate(prisma, tenant.id, exportRequest.id);

    if (!dataQualityGate.passed) {
      await prisma.$transaction((tx) =>
        writeExportAudit(tx, {
          ...input,
          clientTenantId: tenant.id,
          exportRequestId: exportRequest.id,
          metadataJson: { dataQualityMissing: dataQualityGate.missing },
          nextState: exportRequest.status,
          previousState: exportRequest.status,
          result: AuditResult.BLOCKED,
        }),
      );
      throw new ExportWorkflowCommandError("Export command is blocked by data quality.", 409, "INVALID_REQUEST", [
        dataQualityGate.gateName.toLowerCase(),
        ...dataQualityGate.missing,
      ]);
    }

    const currentScope = inputJsonObject(exportRequest.scopeJson);
    const lifecyclePatch: Record<string, unknown> = {};
    let nextStatus = exportRequest.status;

    if (input.command === "APPROVE") {
      requireExportStatus(
        exportRequest.status,
        [ExportStatus.APPROVAL_REQUIRED],
        "preview_required_before_approval",
        "Export approval requires a redacted preview first.",
      );
      nextStatus = ExportStatus.APPROVED;
      lifecyclePatch.stage = "approved";
      lifecyclePatch.approvedAt = new Date().toISOString();
    }

    if (input.command === "GENERATE") {
      requireExportStatus(
        exportRequest.status,
        [ExportStatus.APPROVED],
        "approval_required_before_generation",
        "Export generation requires approval first.",
      );
      if (!exportRequest.approvedByUserId) {
        throw new ExportWorkflowCommandError("Export generation requires approval first.", 400, "INVALID_REQUEST", [
          "approval_required_before_generation",
        ]);
      }
      nextStatus = ExportStatus.GENERATED;
      lifecyclePatch.stage = "generated";
      lifecyclePatch.generatedAt = new Date().toISOString();
    }

    if (input.command === "DOWNLOAD") {
      if (exportRequest.status !== ExportStatus.GENERATED) {
        throw new ExportWorkflowCommandError("Export download requires generated package metadata first.", 400, "INVALID_REQUEST", [
          "generation_required_before_download",
        ]);
      }
      nextStatus = ExportStatus.DOWNLOADED;
      lifecyclePatch.stage = "downloaded";
      lifecyclePatch.downloadedAt = new Date().toISOString();
    }

    if (input.command === "SHARE") {
      if (exportRequest.status !== ExportStatus.DOWNLOADED || input.externalShare !== true) {
        throw new ExportWorkflowCommandError("Export share requires a downloaded package and explicit external share flag.", 400, "INVALID_REQUEST", [
          "download_required_before_share",
          "external_share_required",
        ]);
      }
      nextStatus = ExportStatus.DOWNLOADED;
      lifecyclePatch.stage = "shared";
      lifecyclePatch.sharedAt = new Date().toISOString();
    }

    const packageStage = lifecyclePatch.stage === "shared" ? "shared" : lifecyclePatch.stage === "downloaded" ? "downloaded" : "generated";
    const file = fileMetadataService.prepareDemoFileMetadata({
      category: "exports",
      checksumSeed: `${tenant.slug}:${exportRequest.id}:${input.command}`,
      fileName: `EXP-${tenant.slug}-${exportRequest.id.slice(0, 8)}-redacted.zip`,
      fileSizeBytes: 512000,
      mimeType: "application/zip",
      tenantSlug: tenant.slug,
    });
    const packageResult = exportPackageService.buildExportPackageManifest({
      approvalRequired: true,
      approved: input.command === "APPROVE" || Boolean(exportRequest.approvedByUserId),
      auditPersistenceAvailable: true,
      expiresAt: exportRequest.expiresAt ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      exportRequestId: exportRequest.id,
      externalShare: input.externalShare === true,
      file,
      packageStage: packageStage as never,
      payloadClassifications: inspection.payloadClassifications,
      redactionProfile: input.redactionProfile ?? exportRequest.redactionProfile,
      selectedObjectCount: Array.isArray((currentScope as Record<string, unknown>).selectedObjects)
        ? ((currentScope as Record<string, unknown>).selectedObjects as unknown[]).length
        : 1,
      tenantSlug: tenant.slug,
      watermark: true,
    });

    if (!packageResult.valid) {
      throw new ExportWorkflowCommandError("Export package manifest failed safety validation.", 400, "INVALID_REQUEST", packageResult.issues);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const record = await tx.exportRequest.update({
        data: {
          ...(input.command === "APPROVE" ? { approvedByUserId: stableId("user:compliance") } : {}),
          redactionProfile: input.redactionProfile ?? exportRequest.redactionProfile,
          scopeJson: {
            ...currentScope,
            exportLifecycle: {
              ...inputJsonRecord(currentScope.exportLifecycle),
              ...lifecyclePatch,
            },
            generatedFileIsMetadataOnly: true,
            manifest: packageResult.manifest,
            payloadClassifications: inspection.payloadClassifications,
            redactionAllowlist: [...exportRedactionAllowlist],
          } as Prisma.InputJsonObject,
          status: nextStatus,
        },
        where: { id: exportRequest.id },
      });
      const audit = await writeExportAudit(tx, {
        ...input,
        clientTenantId: tenant.id,
        exportRequestId: exportRequest.id,
        metadataJson: {
          lifecycleStage: lifecyclePatch.stage ?? "approved",
          manifestVersion: packageResult.manifest.manifestVersion,
          payloadClassifications: inspection.payloadClassifications,
        },
        nextState: nextStatus,
        previousState: exportRequest.status,
        result: AuditResult.SUCCESS,
      });

      return { audit, record };
    });

    return {
      auditEventId: updated.audit.id,
      exportRequestId: updated.record.id,
      manifest: packageResult.manifest,
      mutated: true,
      noClientRelease: true,
      noRealBinaryStorage: true,
      status: updated.record.status,
    };
  }

  throw new ExportWorkflowCommandError("Export command is not implemented.", 400, "INVALID_REQUEST", [
    "export_command_handler_missing",
  ]);
}
