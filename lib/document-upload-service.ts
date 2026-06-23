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

import { requireDemoSession, demoPlatformTenantId, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { requireActorContext } from "@/lib/control-layer/actor-context";
import { evaluateControlPermission } from "@/lib/control-layer/permission-decision";
import { resolveTenantObjectScope } from "@/lib/control-layer/scope-resolver";
import { localDocumentStorageAdapter } from "@/lib/document-storage-adapter";
import { auditService, AuditPersistenceRequiredError } from "@/lib/audit-service";
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
const uploadRoleAllowlist = new Set<DemoRoleKey>(["principal", "family_cfo", "external_advisor"]);

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
  storageKey: string;
  uploadedAt: string;
  evidenceRecordId: string | null;
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

export type UploadDocumentInput = {
  auditPersistenceAvailable?: boolean;
  documentType: string;
  file: File;
  linkedObjectLabel?: string | null;
  notes?: string | null;
  periodLabel?: string | null;
  roleKey: DemoRoleKey;
  sensitivity?: Sensitivity;
  subType?: string | null;
  tenantSlug: DemoTenantSlug;
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

  if (issues.length > 0) {
    throw new DocumentUploadValidationError(issues);
  }

  return fileName;
}

function mapDocument(document: {
  checksum: string | null;
  clientTenantId: string;
  clientVisible: boolean;
  createdAt: Date;
  documentType: string;
  evidenceRecords?: Array<{ id: string }>;
  evidenceStatus?: string | null;
  evidenceVisibilityStatus?: string | null;
  extractions?: Array<{ extractionStatus: string }>;
  fileName: string | null;
  fileSizeBytes: number | null;
  id: string;
  mimeType: string | null;
  sensitivity: Sensitivity;
  status: DocumentStatus;
  storageKey: string | null;
  title: string;
}): UploadedDocumentListItem {
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
    mimeType: document.mimeType ?? "",
    sensitivity: document.sensitivity,
    status: document.status,
    storageKey: document.storageKey ?? "",
    title: document.title,
    uploadedAt: document.createdAt.toISOString(),
  };
}

function projectDocumentForRole(
  document: UploadedDocumentListItem,
  roleKey: DemoRoleKey,
  tenantSlug: DemoTenantSlug,
): ProjectedUploadedDocumentListItem {
  const session = requireDemoSession({ roleKey, tenantSlug });
  const projection = visibilityEngine.projectDocumentPayload(
    session.actor,
    session.role,
    {
      ...document,
      sensitivity: document.sensitivity as Sensitivity,
    },
    demoPlatformTenantId,
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
      ? `${session.role.label} cannot upload source documents in the current demo policy.`
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
        platformTenantId: demoPlatformTenantId,
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
            platformTenantId: demoPlatformTenantId,
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
        platformTenantId: demoPlatformTenantId,
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
      platformTenantId: demoPlatformTenantId,
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

  const storedObject = await localDocumentStorageAdapter.putObject({ bytes, fileName, storageKey });
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
        relatedObjectId: document.id,
        relatedObjectType: ObjectType.DOCUMENT,
        retentionPolicy: "document_upload_records_7y",
        status: EvidenceStatus.CREATED,
        summary: `Multipart upload received, stored locally and queued for extraction review. SHA-256 ${checksum}.`,
        title: `${document.title} upload evidence`,
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
            platformTenantId: demoPlatformTenantId,
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
          versionId: version.id,
        },
        nextState: DocumentStatus.UPLOADED,
        platformTenantId: demoPlatformTenantId,
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
        evidenceStatus: evidenceRecord.status,
        evidenceVisibilityStatus: evidenceRecord.visibilityStatus,
        extractions: [{ extractionStatus: extraction.extractionStatus }],
      }),
      documentEvidenceItemId: documentEvidenceItem.id,
      evidenceRecordId: evidenceRecord.id,
      extractionId: extraction.id,
      storageKey: storedObject.storageKey,
      versionId: version.id,
      uploadedAt: now.toISOString(),
    };
  });
}

export async function listUploadedDocuments(
  prisma: PrismaClient,
  tenantSlug: DemoTenantSlug = "morgan",
  roleKey: DemoRoleKey = "analyst",
  options: UploadedDocumentListOptions = {},
) {
  const session = requireDemoSession({ roleKey, tenantSlug });
  const query = options.q?.trim();
  const documents = await prisma.document.findMany({
    include: {
      extractions: {
        orderBy: { createdAt: "desc" },
        select: { extractionStatus: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 12,
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
  const evidenceRecords = await prisma.evidenceRecord.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, relatedObjectId: true, status: true, visibilityStatus: true },
    where: {
      clientTenantId: session.tenant.id,
      relatedObjectId: { in: documents.map((document) => document.id) },
      relatedObjectType: ObjectType.DOCUMENT,
    },
  });
  const evidenceRecordByDocumentId = new Map(
    evidenceRecords.map((record) => [record.relatedObjectId, record]),
  );

  const projectedDocuments = documents.map((document) => {
    const mappedDocument = mapDocument({
      ...document,
      evidenceRecords: evidenceRecordByDocumentId.has(document.id)
        ? [{ id: evidenceRecordByDocumentId.get(document.id)?.id ?? "" }]
        : [],
      evidenceStatus: evidenceRecordByDocumentId.get(document.id)?.status ?? null,
      evidenceVisibilityStatus: evidenceRecordByDocumentId.get(document.id)?.visibilityStatus ?? null,
    });

    return projectDocumentForRole(mappedDocument, roleKey, tenantSlug);
  });

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

export const documentUploadLimits = {
  maxUploadSizeBytes,
  supportedExtensions: [...supportedExtensions],
  supportedMimeTypes: [...supportedMimeTypes],
};
