import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import {
  AuditResult,
  DocumentStatus,
  EvidenceStatus,
  ObjectType,
  Prisma,
  type PrismaClient,
  Sensitivity,
  VisibilityStatus,
} from "@prisma/client";

import { requireActorSession, actorPlatformTenantId, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { requireActorContext } from "@/lib/control-layer/actor-context";
import { evaluateControlPermission } from "@/lib/control-layer/permission-decision";
import { resolveTenantObjectScope } from "@/lib/control-layer/scope-resolver";
import { activeDocumentStorageAdapter } from "@/lib/document-storage-adapter";
import {
  createDocumentPreviewDerivatives,
  publicDocumentDerivativeUrl,
} from "@/lib/document-preview-service";
import { auditService, AuditPersistenceRequiredError } from "@/lib/audit-service";
import {
  paginateDataSurfaceRows,
  sortDataSurfaceRows,
  type BackendDataSurfaceMeta,
  type DataSurfaceQuery,
} from "@/lib/data-surface-query-contract";
import { evidenceService, type EvidenceLifecycleStatus } from "@/lib/evidence-service";
import { stableId } from "@/lib/stable-id";
import { visibilityEngine } from "@/lib/visibility-engine";

const maxUploadSizeBytes = 50 * 1024 * 1024;
const supportedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/tiff",
]);
const supportedExtensions = new Set([".pdf", ".docx", ".xlsx", ".csv", ".png", ".jpg", ".jpeg", ".tif", ".tiff"]);
const uploadRoleAllowlist = new Set<ActorRoleKey>(["principal", "family_cfo", "external_advisor"]);

export type UploadedDocumentListItem = {
  id: string;
  clientTenantId: string;
  clientVisible: boolean;
  title: string;
  documentType: string;
  status: string;
  sensitivity: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  checksum: string;
  latestVersionChecksum: string;
  latestVersionNumber: number;
  latestReviewId: string | null;
  latestReviewStatus: string | null;
  storageKey: string;
  previewStatus: string;
  previewUrl: string | null;
  thumbnailStatus: string;
  thumbnailUrl: string | null;
  clientSafeSummary: string | null;
  targetObjectId: string | null;
  targetObjectType: string | null;
  uploadedAt: string;
  versionCount: number;
  evidenceRecordId: string | null;
  evidenceRequestState?: "requested_upload_received" | null;
  evidenceLifecycleStatus: EvidenceLifecycleStatus;
  evidenceStatus: string | null;
  evidenceVisibilityStatus: string | null;
  extractionStatus: string | null;
};

export type ProjectedUploadedDocumentListItem = {
  [key: string]: unknown;
  hiddenFields: string[];
  reason: string;
  reasonCode: string;
  visible: boolean;
  visibilityState: string;
};

type UploadedDocumentListOptions = {
  q?: string;
  sensitivity?: string;
  sort?: string;
  source?: "all" | "uploads";
  status?: string;
  type?: string;
};

export type UploadedDocumentSortKey = "documentType" | "evidenceLifecycleStatus" | "fileName" | "sensitivity" | "status" | "title" | "uploadedAt";

export type UploadedDocumentsPage = {
  documents: ProjectedUploadedDocumentListItem[];
  meta: BackendDataSurfaceMeta<UploadedDocumentSortKey>;
};

export type UploadDocumentInput = {
  auditPersistenceAvailable?: boolean;
  documentType: string;
  file: File;
  linkedObjectLabel?: string | null;
  notes?: string | null;
  periodLabel?: string | null;
  roleKey: ActorRoleKey;
  sensitivity?: Sensitivity;
  subType?: string | null;
  targetObjectId?: string | null;
  targetObjectType?: ObjectType | null;
  tenantSlug: ActorTenantSlug;
};

export class DocumentUploadValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super("Invalid document upload.");
  }
}

export class DocumentUploadPermissionError extends Error {
  constructor(public readonly reason: string, public readonly auditEventId: string) {
    super(reason);
  }
}

export class DocumentUploadAuditUnavailableError extends Error {
  constructor() {
    super("Required audit persistence is unavailable; upload was not applied.");
  }
}

function safeFileName(fileName: string) {
  const normalized = path.basename(fileName).replace(/[^a-zA-Z0-9._ -]/g, "_").trim();
  return normalized || "uploaded-document";
}

function documentTitle(fileName: string) {
  return safeFileName(fileName).replace(/\.[^.]+$/, "");
}

function validateUploadInput(input: UploadDocumentInput) {
  const issues: string[] = [];
  const fileName = safeFileName(input.file.name);
  const extension = path.extname(fileName).toLowerCase();

  if (!input.documentType.trim()) {
    issues.push("document_type_required");
  }

  if (input.file.size <= 0) {
    issues.push("positive_file_size_required");
  }

  if (input.file.size > maxUploadSizeBytes) {
    issues.push("file_size_exceeds_50mb");
  }

  if (fileName !== input.file.name || fileName.includes("..")) {
    issues.push("safe_file_name_required");
  }

  if (!supportedMimeTypes.has(input.file.type) || !supportedExtensions.has(extension)) {
    issues.push("supported_file_type_required");
  }

  if (Boolean(input.targetObjectId) !== Boolean(input.targetObjectType)) {
    issues.push("target_object_identity_required");
  }

  if (issues.length > 0) {
    throw new DocumentUploadValidationError(issues);
  }

  return fileName;
}

async function resolveEvidenceTarget(
  prisma: PrismaClient,
  clientTenantId: string,
  input: Pick<UploadDocumentInput, "targetObjectId" | "targetObjectType">,
) {
  if (!input.targetObjectId || !input.targetObjectType) {
    return null;
  }

  const targetObjectId = input.targetObjectId;
  const targetObjectType = input.targetObjectType;
  const target =
    targetObjectType === ObjectType.ENTITY
      ? await prisma.entity.findFirst({ select: { id: true, name: true }, where: { clientTenantId, id: targetObjectId } })
      : targetObjectType === ObjectType.FAMILY_MEMBER
        ? await prisma.familyMember.findFirst({ select: { displayName: true, id: true }, where: { clientTenantId, id: targetObjectId } })
        : targetObjectType === ObjectType.RELATIONSHIP
          ? await prisma.relationship.findFirst({ select: { id: true, relationshipType: true }, where: { clientTenantId, id: targetObjectId } })
          : targetObjectType === ObjectType.ASSET
            ? await prisma.asset.findFirst({ select: { id: true, name: true }, where: { clientTenantId, id: targetObjectId } })
            : targetObjectType === ObjectType.DOCUMENT
              ? await prisma.document.findFirst({ select: { id: true, title: true }, where: { clientTenantId, id: targetObjectId } })
              : null;

  if (!target) {
    throw new DocumentUploadValidationError(["target_object_not_available"]);
  }

  return {
    id: targetObjectId,
    label:
      "name" in target
        ? target.name
        : "displayName" in target
          ? target.displayName
          : "relationshipType" in target
            ? target.relationshipType
            : "title" in target
              ? target.title
              : targetObjectId,
    type: targetObjectType,
  };
}

function mapDocument(document: {
  checksum: string | null;
  clientTenantId: string;
  clientVisible: boolean;
  createdAt: Date;
  documentType: string;
  evidenceRecords?: Array<{ id: string }>;
  evidenceRelatedObjectId?: string | null;
  evidenceRelatedObjectType?: string | null;
  evidenceStatus?: string | null;
  evidenceVisibilityStatus?: string | null;
  extractions?: Array<{ extractionStatus: string }>;
  fileName: string | null;
  fileSizeBytes: number | null;
  id: string;
  derivatives?: Array<{
    height: number | null;
    id: string;
    kind: string;
    mimeType: string | null;
    status: string;
    width: number | null;
  }>;
  mimeType: string | null;
  reviews?: Array<{ clientVisibleSummary: string | null; id: string; status: string }>;
  sensitivity: Sensitivity;
  status: DocumentStatus;
  storageKey: string | null;
  title: string;
  versions?: Array<{ checksum: string | null; versionNumber: number }>;
}): UploadedDocumentListItem {
  const latestVersion = document.versions?.[0] ?? null;
  const thumbnailDerivative = document.derivatives?.find((derivative) => derivative.kind === "thumbnail") ?? null;
  const previewDerivative = document.derivatives?.find((derivative) => derivative.kind === "preview") ?? null;

  return {
    checksum: document.checksum ?? "",
    clientTenantId: document.clientTenantId,
    clientVisible: document.clientVisible,
    documentType: document.documentType,
    evidenceRecordId: document.evidenceRecords?.[0]?.id ?? null,
    evidenceLifecycleStatus: evidenceService.evidenceLifecycleStatusForDocument({
      documentStatus: document.status,
      evidenceStatus: document.evidenceStatus as EvidenceStatus | null,
      extractionStatus: document.extractions?.[0]?.extractionStatus ?? null,
    }),
    evidenceStatus: document.evidenceStatus ?? null,
    evidenceVisibilityStatus: document.evidenceVisibilityStatus ?? null,
    extractionStatus: document.extractions?.[0]?.extractionStatus ?? null,
    fileName: document.fileName ?? document.title,
    fileSizeBytes: document.fileSizeBytes ?? 0,
    id: document.id,
    latestVersionChecksum: latestVersion?.checksum ?? document.checksum ?? "",
    latestVersionNumber: latestVersion?.versionNumber ?? 1,
    latestReviewId: document.reviews?.[0]?.id ?? null,
    latestReviewStatus: document.reviews?.[0]?.status ?? null,
    mimeType: document.mimeType ?? "",
    previewStatus: previewDerivative?.status ?? "MISSING",
    previewUrl: previewDerivative?.status === "READY" ? publicDocumentDerivativeUrl(previewDerivative.id) : null,
    clientSafeSummary: document.reviews?.[0]?.clientVisibleSummary ?? null,
    sensitivity: document.sensitivity,
    status: document.status,
    storageKey: document.storageKey ?? "",
    targetObjectId: document.evidenceRelatedObjectId ?? null,
    targetObjectType: document.evidenceRelatedObjectType ?? null,
    thumbnailStatus: thumbnailDerivative?.status ?? "MISSING",
    thumbnailUrl: thumbnailDerivative?.status === "READY" ? publicDocumentDerivativeUrl(thumbnailDerivative.id) : null,
    title: document.title,
    uploadedAt: document.createdAt.toISOString(),
    versionCount: document.versions?.length ?? 0,
  };
}

function projectDocumentForRole(
  document: UploadedDocumentListItem,
  roleKey: ActorRoleKey,
  tenantSlug: ActorTenantSlug,
): ProjectedUploadedDocumentListItem {
  const session = requireActorSession({ roleKey, tenantSlug });
  const projection = visibilityEngine.projectDocumentPayload(
    session.actor,
    session.role,
    {
      ...document,
      sensitivity: document.sensitivity as Sensitivity,
    },
    actorPlatformTenantId,
    session.tenant.id,
  );

  return {
    ...projection.payload,
    hiddenFields: projection.hiddenFields,
    reason: projection.reason,
    reasonCode: projection.reasonCode,
    visible: projection.visible,
    visibilityState: projection.visibilityState,
  };
}

export async function uploadDocument(prisma: PrismaClient, input: UploadDocumentInput) {
  const tenantSlug = input.tenantSlug;
  const roleKey = input.roleKey;
  const sensitivity = input.sensitivity ?? Sensitivity.CONFIDENTIAL;
  const fileName = validateUploadInput(input);
  const actorContext = requireActorContext({ roleKey, tenantSlug });
  const session = actorContext.session;
  const clientTenantId = session.tenant.id;
  const evidenceTarget = await resolveEvidenceTarget(prisma, clientTenantId, input);
  const uploadAttemptId = stableId(`document-upload-attempt:${tenantSlug}:${roleKey}:${fileName}`);
  const uploadSubject = {
    clientTenantId,
    objectId: uploadAttemptId,
    objectType: "DOCUMENT" as const,
    sensitivity,
    visibilityStatus: "INTERNAL_ONLY" as const,
    workflowState: "AWAITING_INFO" as const,
  };
  const scopeResolution = resolveTenantObjectScope(actorContext, {
    allowedObjectIds: [uploadAttemptId],
    clientTenantId,
    objectId: uploadAttemptId,
    objectType: "DOCUMENT",
    requireObjectScope: true,
  });
  const permission = scopeResolution.allowed
    ? evaluateControlPermission({
        action: "UPLOAD",
        actorContext,
        objectScope: scopeResolution.objectScope,
        subject: uploadSubject,
      })
    : {
        allowed: false,
        demoMode: true as const,
        reason: scopeResolution.reason,
        reasonCode: scopeResolution.reasonCode,
        requiresAudit: true,
        requiresComplianceReview: false,
        requiresSecondConfirmation: true,
      };

  if (!permission.allowed || !uploadRoleAllowlist.has(roleKey)) {
    const reason = !uploadRoleAllowlist.has(roleKey)
      ? `${session.role.label} cannot upload source documents in the current workspace policy.`
      : permission.reason;
    try {
      auditService.assertCriticalAuditWritable({
        action: "UPLOAD",
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        auditPersistenceAvailable: input.auditPersistenceAvailable,
        clientTenantId,
        eventType: "document.upload.denied",
        nextState: DocumentStatus.EMPTY,
        platformTenantId: actorPlatformTenantId,
        previousState: DocumentStatus.EMPTY,
        reason,
        result: AuditResult.DENIED,
        targetId: uploadAttemptId,
        targetType: ObjectType.DOCUMENT,
      });
    } catch (error) {
      if (error instanceof AuditPersistenceRequiredError) {
        throw new DocumentUploadAuditUnavailableError();
      }

      throw error;
    }

    const audit = await prisma.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId,
        eventType: "document.upload.denied",
        metadataJson: {
          ...auditService.criticalAuditMetadata({
            action: "UPLOAD",
            actorRoleKey: session.role.key,
            actorUserId: session.actor.id,
            auditPersistenceAvailable: input.auditPersistenceAvailable,
            clientTenantId,
            eventType: "document.upload.denied",
            nextState: DocumentStatus.EMPTY,
            platformTenantId: actorPlatformTenantId,
            previousState: DocumentStatus.EMPTY,
            reason,
            result: AuditResult.DENIED,
            targetId: uploadAttemptId,
            targetType: ObjectType.DOCUMENT,
          }),
          demoMode: true,
          fileName,
          noRealAuth: true,
          permission,
          roleAllowlist: [...uploadRoleAllowlist],
          scopeResolution,
        },
        nextState: DocumentStatus.EMPTY,
        platformTenantId: actorPlatformTenantId,
        previousState: DocumentStatus.EMPTY,
        reason,
        result: AuditResult.DENIED,
        targetId: uploadAttemptId,
        targetType: ObjectType.DOCUMENT,
      },
    });

    throw new DocumentUploadPermissionError(reason, audit.id);
  }

  const arrayBuffer = await input.file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);
  const checksum = createHash("sha256").update(bytes).digest("hex");
  const uploadId = randomUUID();
  const storageKey = `demo/${tenantSlug}/documents/${uploadId}-${fileName}`;
  try {
    auditService.assertCriticalAuditWritable({
      action: "UPLOAD",
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      auditPersistenceAvailable: input.auditPersistenceAvailable,
      clientTenantId,
      eventType: "document.upload.created",
      nextState: DocumentStatus.UPLOADED,
      platformTenantId: actorPlatformTenantId,
      previousState: DocumentStatus.EMPTY,
      reason: "SCF-P04/P06 upload audit persistence must be available before document, evidence and extraction rows are created.",
      result: AuditResult.SUCCESS,
      targetId: uploadId,
      targetType: ObjectType.DOCUMENT,
    });
  } catch (error) {
    if (error instanceof AuditPersistenceRequiredError) {
      throw new DocumentUploadAuditUnavailableError();
    }

    throw error;
  }

  const storageAdapter = activeDocumentStorageAdapter();
  const storedObject = await storageAdapter.putObject({ bytes, contentType: input.file.type, fileName, storageKey });
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const document = await tx.document.create({
      data: {
        checksum,
        clientTenantId,
        clientVisible: false,
        documentType: input.documentType.trim(),
        fileName,
        fileSizeBytes: bytes.length,
        mimeType: input.file.type,
        sensitivity,
        source: "multipart_upload",
        status: DocumentStatus.UPLOADED,
        storageKey: storedObject.storageKey,
        title: documentTitle(fileName),
        uploadedByUserId: session.actor.id,
      },
    });
    const version = await tx.documentVersion.create({
      data: {
        changeReason: "SCF-P04 real multipart demo upload.",
        checksum,
        createdByUserId: session.actor.id,
        documentId: document.id,
        storageKey: storedObject.storageKey,
        versionNumber: 1,
      },
    });
    const derivatives = await createDocumentPreviewDerivatives(tx, {
      documentId: document.id,
      fileName,
      mimeType: input.file.type,
      originalBytes: bytes,
      originalStorageKey: storedObject.storageKey,
      tenantSlug,
      versionId: version.id,
    });
    const extraction = await tx.documentExtraction.create({
      data: {
        confidenceScore: new Prisma.Decimal("0.00"),
        documentId: document.id,
        extractedFieldsJson: {
          documentType: input.documentType.trim(),
          fileName,
          linkedObjectLabel: input.linkedObjectLabel ?? null,
          notes: input.notes ?? null,
          periodLabel: input.periodLabel ?? null,
          subType: input.subType ?? null,
          targetObjectId: evidenceTarget?.id ?? null,
          targetObjectType: evidenceTarget?.type ?? null,
        },
        extractionStatus: "pending",
        isClientVisible: false,
        lowConfidenceFieldsJson: {
          reason: "Awaiting deterministic demo extraction review.",
        },
        modelVersion: "scf-p04-demo-extraction-queue",
      },
    });
    const evidenceRecord = await tx.evidenceRecord.create({
      data: {
        clientTenantId,
        createdByUserId: session.actor.id,
        relatedObjectId: evidenceTarget?.id ?? document.id,
        relatedObjectType: evidenceTarget?.type ?? ObjectType.DOCUMENT,
        retentionPolicy: "document_upload_records_7y",
        status: EvidenceStatus.CREATED,
        summary: `Multipart upload received, stored locally and queued for extraction review. SHA-256 ${checksum}.`,
        title: `${document.title} upload evidence`,
        visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
      },
    });
    const evidenceRequestItem = await tx.evidenceItem.create({
      data: {
        evidenceRecordId: evidenceRecord.id,
        itemType: "evidence_request",
        sourceObjectId: document.id,
        sourceObjectType: ObjectType.DOCUMENT,
        title: `${document.title} evidence request`,
        visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
      },
    });
    const documentEvidenceItem = await tx.evidenceItem.create({
      data: {
        evidenceRecordId: evidenceRecord.id,
        hash: checksum,
        itemType: "document",
        sourceObjectId: document.id,
        sourceObjectType: ObjectType.DOCUMENT,
        title: `${fileName} stored object`,
        visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
      },
    });
    const evidenceRecordLink = await tx.documentLink.create({
      data: {
        createdByUserId: session.actor.id,
        documentId: document.id,
        relationship: "upload_evidence_record",
        targetId: evidenceRecord.id,
        targetType: ObjectType.EVIDENCE_RECORD,
      },
    });
    const targetObjectLink = evidenceTarget
      ? await tx.documentLink.create({
          data: {
            createdByUserId: session.actor.id,
            documentId: document.id,
            relationship: "evidence_target",
            targetId: evidenceTarget.id,
            targetType: evidenceTarget.type,
          },
        })
      : null;
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId,
        eventType: "document.upload.created",
        evidenceRecordId: evidenceRecord.id,
        metadataJson: {
          ...auditService.criticalAuditMetadata({
            action: "UPLOAD",
            actorRoleKey: session.role.key,
            actorUserId: session.actor.id,
            auditPersistenceAvailable: input.auditPersistenceAvailable,
            clientTenantId,
            eventType: "document.upload.created",
            nextState: DocumentStatus.UPLOADED,
            platformTenantId: actorPlatformTenantId,
            previousState: DocumentStatus.EMPTY,
            reason: "SCF-P04/P06 upload audit persistence confirmed before document, evidence and extraction rows were created.",
            result: AuditResult.SUCCESS,
            targetId: document.id,
            targetType: ObjectType.DOCUMENT,
          }),
          absoluteDemoPath: storedObject.absolutePath,
          checksum,
          demoMode: true,
          fileName,
          fileSizeBytes: bytes.length,
          mimeType: input.file.type,
          noRealAuth: true,
          permission,
          scopeResolution,
          storageKey: storedObject.storageKey,
          evidenceRequestItemId: evidenceRequestItem.id,
          evidenceRecordLinkId: evidenceRecordLink.id,
          targetObject: evidenceTarget,
          targetObjectLinkId: targetObjectLink?.id ?? null,
          versionId: version.id,
        },
        nextState: DocumentStatus.UPLOADED,
        platformTenantId: actorPlatformTenantId,
        previousState: DocumentStatus.EMPTY,
        reason: "SCF-P04 upload persisted document, version, extraction, evidence and audit rows without evidence sufficiency or client release.",
        result: AuditResult.SUCCESS,
        targetId: document.id,
        targetType: ObjectType.DOCUMENT,
      },
    });
    const auditEvidenceItem = await tx.evidenceItem.create({
      data: {
        evidenceRecordId: evidenceRecord.id,
        itemType: "audit_event",
        sourceObjectId: audit.id,
        sourceObjectType: ObjectType.AUDIT_EVENT,
        title: "Upload audit event",
        visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
      },
    });

    return {
      auditEventId: audit.id,
      auditEvidenceItemId: auditEvidenceItem.id,
      document: mapDocument({
        ...document,
        evidenceRecords: [{ id: evidenceRecord.id }],
        evidenceRelatedObjectId: evidenceRecord.relatedObjectId,
        evidenceRelatedObjectType: evidenceRecord.relatedObjectType,
        evidenceStatus: evidenceRecord.status,
        evidenceVisibilityStatus: evidenceRecord.visibilityStatus,
        extractions: [{ extractionStatus: extraction.extractionStatus }],
        derivatives,
        versions: [{ checksum: version.checksum, versionNumber: version.versionNumber }],
      }),
      documentEvidenceItemId: documentEvidenceItem.id,
      evidenceRecordId: evidenceRecord.id,
      evidenceRequestItemId: evidenceRequestItem.id,
      evidenceRequestState: "requested_upload_received" as const,
      targetObject: evidenceTarget,
      extractionId: extraction.id,
      storageKey: storedObject.storageKey,
      versionId: version.id,
      uploadedAt: now.toISOString(),
    };
  });
}

async function buildUploadedDocumentRows(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug = "morgan",
  roleKey: ActorRoleKey = "analyst",
  options: UploadedDocumentListOptions = {},
) {
  const session = requireActorSession({ roleKey, tenantSlug });
  const query = options.q?.trim();
  const documents = await prisma.document.findMany({
    include: {
      extractions: {
        orderBy: { createdAt: "desc" },
        select: { extractionStatus: true },
        take: 1,
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        select: { clientVisibleSummary: true, id: true, status: true },
        take: 1,
      },
      versions: {
        orderBy: { versionNumber: "desc" },
        select: { checksum: true, versionNumber: true },
      },
      derivatives: {
        orderBy: { createdAt: "desc" },
        select: { height: true, id: true, kind: true, mimeType: true, status: true, width: true },
        where: { kind: { in: ["thumbnail", "preview"] } },
      },
    },
    orderBy: { createdAt: "desc" },
    where: {
      clientTenantId: session.tenant.id,
      ...(options.source === "all" ? {} : { source: "multipart_upload" }),
      ...(query
        ? {
            OR: [
              { documentType: { contains: query, mode: "insensitive" } },
              { fileName: { contains: query, mode: "insensitive" } },
              { title: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(options.sensitivity && options.sensitivity !== "all" ? { sensitivity: options.sensitivity as Sensitivity } : {}),
      ...(options.status && options.status !== "all" ? { status: options.status as DocumentStatus } : {}),
      ...(options.type && options.type !== "all" ? { documentType: options.type } : {}),
    },
  });
  const evidenceRecordLinks = await prisma.documentLink.findMany({
    select: { documentId: true, targetId: true },
    where: {
      documentId: { in: documents.map((document) => document.id) },
      targetType: ObjectType.EVIDENCE_RECORD,
    },
  });
  const evidenceRecordIdByDocumentId = new Map(
    evidenceRecordLinks.map((link) => [link.documentId, link.targetId]),
  );
  const evidenceRecords = await prisma.evidenceRecord.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, relatedObjectId: true, relatedObjectType: true, status: true, visibilityStatus: true },
    where: {
      clientTenantId: session.tenant.id,
      OR: [
        {
          relatedObjectId: { in: documents.map((document) => document.id) },
          relatedObjectType: ObjectType.DOCUMENT,
        },
        {
          id: { in: [...evidenceRecordIdByDocumentId.values()] },
        },
      ],
    },
  });
  const evidenceRecordById = new Map(evidenceRecords.map((record) => [record.id, record]));
  const evidenceRecordByDocumentId = new Map(
    evidenceRecords
      .filter((record) => record.relatedObjectType === ObjectType.DOCUMENT)
      .map((record) => [record.relatedObjectId, record]),
  );

  return documents.map((document) => {
    const evidenceRecord =
      evidenceRecordById.get(evidenceRecordIdByDocumentId.get(document.id) ?? "") ??
      evidenceRecordByDocumentId.get(document.id) ??
      null;
    const mappedDocument = mapDocument({
      ...document,
      evidenceRecords: evidenceRecord ? [{ id: evidenceRecord.id }] : [],
      evidenceRelatedObjectId: evidenceRecord?.relatedObjectId ?? null,
      evidenceRelatedObjectType: evidenceRecord?.relatedObjectType ?? null,
      evidenceStatus: evidenceRecord?.status ?? null,
      evidenceVisibilityStatus: evidenceRecord?.visibilityStatus ?? null,
    });

    return projectDocumentForRole(mappedDocument, roleKey, tenantSlug);
  });
}

export async function listUploadedDocuments(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug = "morgan",
  roleKey: ActorRoleKey = "analyst",
  options: UploadedDocumentListOptions = {},
) {
  const projectedDocuments = await buildUploadedDocumentRows(prisma, tenantSlug, roleKey, options);
  if (options.sort === "name") {
    return [...projectedDocuments].sort((left, right) =>
      String(left.fileName ?? left.title ?? "").localeCompare(String(right.fileName ?? right.title ?? ""), "en", {
        numeric: true,
        sensitivity: "base",
      }),
    );
  }

  if (options.sort === "status") {
    return [...projectedDocuments].sort((left, right) =>
      String(left.status ?? "").localeCompare(String(right.status ?? ""), "en", { sensitivity: "base" }),
    );
  }

  return projectedDocuments;
}

export async function listUploadedDocumentsPage(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  query: DataSurfaceQuery<UploadedDocumentSortKey>,
  options: Omit<UploadedDocumentListOptions, "q" | "sort"> = {},
): Promise<UploadedDocumentsPage> {
  const rows = await buildUploadedDocumentRows(prisma, tenantSlug, roleKey, {
    ...options,
    q: query.q,
  });
  const sortedRows = sortDataSurfaceRows(rows, query, (row, sortKey) => row[sortKey]);
  const page = paginateDataSurfaceRows(sortedRows, query);

  return { documents: page.rows, meta: page.meta };
}

export const documentUploadLimits = {
  maxUploadSizeBytes,
  supportedExtensions: [...supportedExtensions],
  supportedMimeTypes: [...supportedMimeTypes],
};
