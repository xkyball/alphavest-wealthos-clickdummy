import { NextResponse } from "next/server";
import { ObjectType, Sensitivity } from "@prisma/client";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  CurrentUserActorSessionError,
  resolveCurrentUserActorSession,
} from "@/lib/auth/current-user-actor-session";
import {
  DocumentUploadAuditUnavailableError,
  DocumentUploadPermissionError,
  DocumentUploadSecurityScanBlockedError,
  DocumentUploadValidationError,
  uploadDocument,
} from "@/lib/document-upload-service";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { prismaClient } from "@/lib/prisma";

export const runtime = "nodejs";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function sensitivity(value: string): Sensitivity {
  if (value in Sensitivity) {
    return Sensitivity[value as keyof typeof Sensitivity];
  }

  return Sensitivity.CONFIDENTIAL;
}

function targetObjectType(value: string): ObjectType | undefined {
  if (value in ObjectType) {
    return ObjectType[value as keyof typeof ObjectType];
  }

  return undefined;
}

function booleanValue(formData: FormData, key: string) {
  return stringValue(formData, key).toLowerCase() === "true";
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  const actorSession = await resolveCurrentUserActorSession(prisma, request).catch((error) => {
    if (error instanceof CurrentUserActorSessionError) {
      return error;
    }

    throw error;
  });

  if (actorSession instanceof CurrentUserActorSessionError) {
    return failClosedJson(
      {
        error: "Document upload is not available for this user.",
        reasonCode: actorSession.status === 401 ? "PERMISSION_DENIED" : "SCOPE_DENIED",
        safety: {
          authority: "db-user-jwt",
          failClosed: true,
          releaseUnlocked: false,
          scoped: false,
        },
      },
      { status: actorSession.status },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return failClosedJson(
      {
        error: "Invalid multipart upload request.",
        issues: ["multipart_form_data_required"],
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return failClosedJson(
      {
        error: "Invalid document upload.",
        issues: ["file_required"],
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const resolvedRoleKey = actorSession.session.role.key;
  const resolvedTenantSlug = actorSession.session.tenant.slug;
  const authoritySafety = {
    authority: "db-user-jwt",
    releaseUnlocked: false,
    roleKey: resolvedRoleKey,
    scoped: true,
    tenantSlug: resolvedTenantSlug,
  };

  try {
    const result = await uploadDocument(prisma, {
      actorSession: actorSession.session,
      auditPersistenceAvailable: booleanValue(formData, "simulateAuditPersistenceFailure") ? false : undefined,
      documentType: stringValue(formData, "documentType"),
      file,
      linkedObjectLabel: stringValue(formData, "linkedObjectLabel"),
      notes: stringValue(formData, "notes"),
      periodLabel: stringValue(formData, "periodLabel"),
      sensitivity: sensitivity(stringValue(formData, "sensitivity")),
      subType: stringValue(formData, "subType"),
      targetObjectId: stringValue(formData, "targetObjectId") || undefined,
      targetObjectType: targetObjectType(stringValue(formData, "targetObjectType")),
    });
    const safeDocumentResult = {
      documentType: result.document.documentType,
      evidenceLifecycleStatus: result.document.evidenceLifecycleStatus,
      evidenceRequestState: result.evidenceRequestState,
      fileName: result.document.fileName,
      fileSizeBytes: result.document.fileSizeBytes,
      id: result.document.id,
      latestVersionNumber: result.document.latestVersionNumber,
      previewStatus: result.document.previewStatus,
      previewUrl: result.document.previewUrl,
      securityScanLabel: result.document.securityScanLabel,
      securityScanStatus: result.document.securityScanStatus,
      status: result.document.status,
      targetObjectId: result.document.targetObjectId,
      targetObjectType: result.document.targetObjectType,
      thumbnailStatus: result.document.thumbnailStatus,
      thumbnailUrl: result.document.thumbnailUrl,
      title: result.document.title,
      uploadedAt: result.document.uploadedAt,
      versionCount: result.document.versionCount,
    };
    const safeResult = {
      auditEventId: result.auditEventId,
      document: safeDocumentResult,
      evidenceRecordId: result.evidenceRecordId,
      extractionId: result.extractionId,
      uploadedAt: result.uploadedAt,
      versionId: result.versionId,
    };
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prisma, "documents:upload");

    return NextResponse.json({
      ok: true,
      result: safeResult,
      searchIndex,
      safety: {
        authority: "db-user-jwt",
        clientVisible: false,
        evidenceLifecycleStatus: result.document.evidenceLifecycleStatus,
        evidenceRequestState: result.evidenceRequestState,
        evidenceStatus: "REVIEW_PENDING",
        releaseUnlocked: false,
        roleKey: resolvedRoleKey,
        securityScanStatus: result.document.securityScanStatus,
        sufficiency: false,
        tenantSlug: resolvedTenantSlug,
        uploadStateLabel: "Upload complete - evidence review pending",
        uploadOnly: true,
      },
    });
  } catch (error) {
    if (error instanceof DocumentUploadValidationError) {
      return failClosedJson(
        {
          error: "Invalid document upload.",
          issues: error.issues,
          reasonCode: "INVALID_REQUEST",
          safety: authoritySafety,
        },
        { status: 400 },
      );
    }

    if (error instanceof DocumentUploadPermissionError) {
      return failClosedJson(
        {
          auditEventId: error.auditEventId,
          error: "Document upload denied.",
          reasonCode: "PERMISSION_DENIED",
          reason: error.reason,
          safety: authoritySafety,
        },
        { status: 403 },
      );
    }

    if (error instanceof DocumentUploadAuditUnavailableError) {
      return failClosedJson(
        {
          auditPersistenceRequired: true,
          error: error.message,
          reasonCode: "AUDIT_PERSISTENCE_UNAVAILABLE",
          safety: authoritySafety,
        },
        { status: 409 },
      );
    }

    if (error instanceof DocumentUploadSecurityScanBlockedError) {
      return failClosedJson(
        {
          auditEventId: error.auditEventId,
          error: error.message,
          issues: error.issues,
          reasonCode: "UPLOAD_SECURITY_SCAN_BLOCKED",
          safety: {
            ...authoritySafety,
            securityScanStatus: "BLOCKED",
          },
        },
        { status: 422 },
      );
    }

    return failClosedJson(
      {
        error: "Unable to upload document.",
        reasonCode: "SAFE_ERROR",
        retryAllowed: true,
        safety: authoritySafety,
      },
      { status: 500 },
    );
  }
}
