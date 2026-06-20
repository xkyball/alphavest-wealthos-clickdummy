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
import { localDocumentStorageAdapter } from "@/lib/document-storage-adapter";
import { permissionEngine } from "@/lib/permission-engine";
import { stableId } from "@/lib/stable-id";

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
  extractionStatus: string | null;
};

export type UploadDocumentInput = {
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
  createdAt: Date;
  documentType: string;
  evidenceRecords?: Array<{ id: string }>;
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
    documentType: document.documentType,
    evidenceRecordId: document.evidenceRecords?.[0]?.id ?? null,
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

export async function uploadDocument(prisma: PrismaClient, input: UploadDocumentInput) {
  const tenantSlug = input.tenantSlug;
  const roleKey = input.roleKey;
  const sensitivity = input.sensitivity ?? Sensitivity.CONFIDENTIAL;
  const fileName = validateUploadInput(input);
  const session = requireDemoSession({ roleKey, tenantSlug });
  const clientTenantId = session.tenant.id;
  const uploadAttemptId = stableId(`document-upload-attempt:${tenantSlug}:${roleKey}:${fileName}`);
  const permission = permissionEngine.can(
    session.actor,
    "UPLOAD",
    {
      clientTenantId,
      objectId: uploadAttemptId,
      objectType: "DOCUMENT",
      sensitivity,
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "AWAITING_INFO",
    },
    {
      clientTenantId,
      platformTenantId: demoPlatformTenantId,
      workflowState: "AWAITING_INFO",
    },
    session.role,
  );

  if (!permission.allowed || !uploadRoleAllowlist.has(roleKey)) {
    const reason = !uploadRoleAllowlist.has(roleKey)
      ? `${session.role.label} cannot upload source documents in the current demo policy.`
      : permission.reason;
    const audit = await prisma.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId,
        eventType: "document.upload.denied",
        metadataJson: {
          demoMode: true,
          fileName,
          noRealAuth: true,
          permission,
          roleAllowlist: [...uploadRoleAllowlist],
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
        changeReason: "Phase P1 real multipart demo upload.",
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
        modelVersion: "phase-p1-demo-extraction-queue",
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
          absoluteDemoPath: storedObject.absolutePath,
          checksum,
          demoMode: true,
          fileName,
          fileSizeBytes: bytes.length,
          mimeType: input.file.type,
          noRealAuth: true,
          permission,
          storageKey: storedObject.storageKey,
          versionId: version.id,
        },
        nextState: DocumentStatus.UPLOADED,
        platformTenantId: demoPlatformTenantId,
        previousState: DocumentStatus.EMPTY,
        reason: "Phase P1 real multipart demo upload persisted document, version, extraction, evidence and audit rows.",
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

export async function listUploadedDocuments(prisma: PrismaClient, tenantSlug: DemoTenantSlug = "morgan") {
  const session = requireDemoSession({ roleKey: "family_cfo", tenantSlug });
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
      source: "multipart_upload",
    },
  });
  const evidenceRecords = await prisma.evidenceRecord.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, relatedObjectId: true },
    where: {
      clientTenantId: session.tenant.id,
      relatedObjectId: { in: documents.map((document) => document.id) },
      relatedObjectType: ObjectType.DOCUMENT,
    },
  });
  const evidenceRecordByDocumentId = new Map(
    evidenceRecords.map((record) => [record.relatedObjectId, record.id]),
  );

  return documents.map((document) =>
    mapDocument({
      ...document,
      evidenceRecords: evidenceRecordByDocumentId.has(document.id)
        ? [{ id: evidenceRecordByDocumentId.get(document.id) ?? "" }]
        : [],
    }),
  );
}

export const documentUploadLimits = {
  maxUploadSizeBytes,
  supportedExtensions: [...supportedExtensions],
  supportedMimeTypes: [...supportedMimeTypes],
};
