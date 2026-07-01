import type { PrismaClient } from "@prisma/client";

import { type ActorTenantSlug, actorTenants } from "@/lib/actor-session";
import { exportStatusUiTruthFor } from "@/lib/domain-types";

export type ExportWorkflowSnapshot = Awaited<ReturnType<typeof getExportWorkflowSnapshot>>;

const exportWorkflowUiTruth = {
  apiRoute: "/api/export-workflow",
  fallbackSeedData: false,
  noClientRelease: true,
  noDownstreamCompletion: true,
  readModel: "getExportWorkflowSnapshot",
  source: "DB_READMODEL",
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function arrayLength(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

function label(value: unknown) {
  return String(value)
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (match) => match.toUpperCase());
}

function protectionTone(state: "Blocked" | "Covered" | "Required" | "Ready") {
  if (state === "Blocked") return "red";
  if (state === "Required") return "gold";
  if (state === "Ready") return "blue";
  return "green";
}

export async function getExportWorkflowSnapshot(prisma: PrismaClient, tenantSlug: ActorTenantSlug) {
  const tenant = actorTenants.find((item) => item.slug === tenantSlug);

  if (!tenant) {
    return null;
  }

  const currentExport = await prisma.exportRequest.findFirst({
    include: {
      generatedFileDocument: { select: { fileName: true, fileSizeBytes: true, id: true, mimeType: true, title: true } },
    },
    orderBy: { updatedAt: "desc" },
    where: { clientTenantId: tenant.id },
  });

  if (!currentExport) {
    return {
      current: null,
      protection: {
        coveredAreas: 0,
        coveredFields: 0,
        inspectionStatus: "Blocked" as const,
        items: [],
        policyHighlights: [],
        reviewer: "Unavailable",
        restrictedCount: 0,
      },
      scopeItems: [],
      summary: {
        activeRequestCount: 0,
        blocked: 0,
        included: 0,
        invalidSelected: 0,
        limitedIncluded: 0,
        totalAvailable: 0,
      },
      timeline: [],
      uiTruth: exportWorkflowUiTruth,
    };
  }

  const scope = isRecord(currentExport.scopeJson) ? currentExport.scopeJson : {};
  const selectedObjects = Array.isArray(scope.selectedObjects)
    ? scope.selectedObjects
    : Array.isArray(scope.includes)
      ? scope.includes.map((item) => ({ id: `included-${String(item)}`, type: String(item) }))
      : [];
  const excludedObjects = Array.isArray(scope.excludedObjects)
    ? scope.excludedObjects
    : Array.isArray(scope.excludes)
      ? scope.excludes.map((item) => ({ id: `excluded-${String(item)}`, reason: "restricted", type: String(item) }))
      : [];
  const lifecycle = isRecord(scope.exportLifecycle) ? scope.exportLifecycle : {};
  const statusUiTruth = exportStatusUiTruthFor(currentExport.status);
  const redactionProfile = currentExport.redactionProfile || "client-visible";
  const redactionRequired = scope.redactionRequired === true || selectedObjects.length > 0 || currentExport.approvalRequired;
  const blockedItemIncluded = scope.blockedItemIncluded === true;
  const generatedFileReady = Boolean(currentExport.generatedFileDocumentId);
  const auditEvents = await prisma.auditEvent.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      actorRoleKey: true,
      createdAt: true,
      eventType: true,
      id: true,
      result: true,
    },
    where: { targetId: currentExport.id },
  });

  return {
    current: {
      approvalRequired: currentExport.approvalRequired,
      approved: Boolean(currentExport.approvedByUserId),
      binaryStatus: currentExport.generatedFileDocumentId ? "Metadata generated" : "Metadata-only pending",
      exportType: label(currentExport.exportType),
      expiresAt: currentExport.expiresAt?.toISOString() ?? null,
      fileName: currentExport.generatedFileDocument?.fileName ?? "Metadata manifest pending",
      generatedFileDocumentId: currentExport.generatedFileDocumentId,
      id: currentExport.id,
      lifecycleStage: typeof lifecycle.stage === "string" ? lifecycle.stage : statusUiTruth.lifecycleStage,
      noOverclaimDetail: statusUiTruth.noOverclaimDetail,
      realFileGenerated: scope.generatedFileIsMetadataOnly === true ? false : Boolean(currentExport.generatedFileDocumentId),
      redactionProfile,
      requestedAt: currentExport.createdAt.toISOString(),
      schemaStatus: statusUiTruth.schemaStatus,
      status: statusUiTruth.label,
      statusControls: {
        allowedNextActions: statusUiTruth.allowedNextActions,
        canApprove: statusUiTruth.canApprove,
        canDownload: statusUiTruth.canDownload,
        canGenerate: statusUiTruth.canGenerate,
      },
      tenant: tenant.displayName,
    },
    scopeItems: [
      ...selectedObjects.map((item, index) => ({
        access: "Allowed",
        id: isRecord(item) && typeof item.id === "string" ? item.id : `selected-${index}`,
        name: isRecord(item) && typeof item.type === "string" ? label(item.type) : `Selected object ${index + 1}`,
        selected: true,
        type: isRecord(item) && typeof item.type === "string" ? label(item.type) : "Object",
      })),
      ...excludedObjects.map((item, index) => ({
        access: isRecord(item) && typeof item.reason === "string" ? label(item.reason) : "Restricted",
        id: isRecord(item) && typeof item.id === "string" ? item.id : `excluded-${index}`,
        name: isRecord(item) && typeof item.type === "string" ? label(item.type) : `Excluded object ${index + 1}`,
        selected: false,
        type: isRecord(item) && typeof item.type === "string" ? label(item.type) : "Object",
      })),
    ],
    summary: {
      activeRequestCount: 1,
      blocked: excludedObjects.length,
      included: selectedObjects.length,
      invalidSelected: scope.blockedItemIncluded === true ? 1 : 0,
      limitedIncluded: redactionRequired ? 1 : 0,
      totalAvailable: selectedObjects.length + excludedObjects.length,
    },
    protection: {
      coveredAreas: [
        selectedObjects.length > 0 ? 1 : 0,
        redactionRequired ? 1 : 0,
        currentExport.approvalRequired ? 1 : 0,
        excludedObjects.length > 0 || !blockedItemIncluded ? 1 : 0,
      ].filter(Boolean).length,
      coveredFields: selectedObjects.length + excludedObjects.length + (redactionRequired ? 1 : 0),
      inspectionStatus: blockedItemIncluded ? "Blocked" : "Ready",
      items: [
        {
          count: selectedObjects.length,
          id: "content-selection",
          label: "Selected content",
          state: selectedObjects.length > 0 ? "Covered" : "Required",
          tone: protectionTone(selectedObjects.length > 0 ? "Covered" : "Required"),
        },
        {
          count: redactionRequired ? 1 : 0,
          id: "redaction-profile",
          label: "Protection profile",
          state: redactionRequired ? "Covered" : "Required",
          tone: protectionTone(redactionRequired ? "Covered" : "Required"),
        },
        {
          count: excludedObjects.length,
          id: "restricted-content",
          label: "Restricted content",
          state: blockedItemIncluded ? "Blocked" : "Covered",
          tone: protectionTone(blockedItemIncluded ? "Blocked" : "Covered"),
        },
        {
          count: currentExport.approvalRequired ? 1 : 0,
          id: "approval-boundary",
          label: "Approval boundary",
          state: currentExport.approvalRequired ? "Required" : "Covered",
          tone: protectionTone(currentExport.approvalRequired ? "Required" : "Covered"),
        },
      ],
      policyHighlights: [
        {
          detail: currentExport.expiresAt ? "Package has an expiry date." : "Expiry date is missing.",
          id: "retention-window",
          policy: "Retention window",
          state: currentExport.expiresAt ? "Pass" : "Warning",
          tone: currentExport.expiresAt ? "green" : "gold",
        },
        {
          detail: redactionProfile ? `Protection profile: ${label(redactionProfile)}.` : "Protection profile is missing.",
          id: "protection-profile",
          policy: "Protection profile",
          state: redactionProfile ? "Pass" : "Warning",
          tone: redactionProfile ? "green" : "gold",
        },
        {
          detail: blockedItemIncluded ? "Restricted content is still selected." : "Restricted content is excluded from the package.",
          id: "restricted-content-exclusion",
          policy: "Restricted content exclusion",
          state: blockedItemIncluded ? "Blocked" : "Pass",
          tone: blockedItemIncluded ? "red" : "green",
        },
        {
          detail: generatedFileReady ? "Package metadata is generated." : "Package generation remains a later action.",
          id: "generation-boundary",
          policy: "Generation boundary",
          state: generatedFileReady ? "Pass" : "Pending",
          tone: generatedFileReady ? "green" : "blue",
        },
      ],
      reviewer: currentExport.approvalRequired ? "Compliance" : "Operations",
      restrictedCount: blockedItemIncluded ? 1 : 0,
    },
    timeline: auditEvents.map((event) => {
      const result: "BLOCKED" | "PENDING" | "SUCCESS" =
        String(event.result) === "FAILURE" ? "BLOCKED" : String(event.result) === "PENDING" ? "PENDING" : "SUCCESS";

      return {
        actor: event.actorRoleKey ?? "system",
        id: event.id,
        result,
        sourceRef: event.id,
        sourceState: "source-backed" as const,
        timestamp: event.createdAt.toISOString().slice(0, 16).replace("T", " "),
        title: label(event.eventType),
      };
    }),
    rawCounts: {
      excludedObjects: arrayLength(scope.excludedObjects),
      selectedObjects: arrayLength(scope.selectedObjects),
    },
    uiTruth: exportWorkflowUiTruth,
  };
}
