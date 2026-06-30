import { NextResponse } from "next/server";
import { ObjectType, Sensitivity } from "@prisma/client";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  DocumentUploadAuditUnavailableError,
  DocumentUploadPermissionError,
  DocumentUploadValidationError,
  uploadDocument,
} from "@/lib/document-upload-service";
import { prismaClient } from "@/lib/prisma";
import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";

export const runtime = "nodejs";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function roleKey(value: string): ActorRoleKey | undefined {
  return actorRoles.some((role) => role.key === value) ? (value as ActorRoleKey) : undefined;
}

function tenantSlug(value: string): ActorTenantSlug | undefined {
  return actorTenants.some((tenant) => tenant.slug === value) ? (value as ActorTenantSlug) : undefined;
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
  const parsedRoleKey = roleKey(stringValue(formData, "roleKey"));
  const parsedTenantSlug = tenantSlug(stringValue(formData, "tenantSlug"));
  const metadataIssues = [
    ...(parsedRoleKey ? [] : ["valid_role_key_required"]),
    ...(parsedTenantSlug ? [] : ["valid_tenant_slug_required"]),
  ];

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

  if (metadataIssues.length > 0) {
    return failClosedJson(
      {
        error: "Invalid document upload.",
        issues: metadataIssues,
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const resolvedRoleKey = parsedRoleKey;
  const resolvedTenantSlug = parsedTenantSlug;
  if (!resolvedRoleKey || !resolvedTenantSlug) {
    return failClosedJson(
      {
        error: "Invalid document upload.",
        issues: metadataIssues,
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  try {
    const result = await uploadDocument(prismaClient(), {
      auditPersistenceAvailable: booleanValue(formData, "simulateAuditPersistenceFailure") ? false : undefined,
      documentType: stringValue(formData, "documentType"),
      file,
      linkedObjectLabel: stringValue(formData, "linkedObjectLabel"),
      notes: stringValue(formData, "notes"),
      periodLabel: stringValue(formData, "periodLabel"),
      roleKey: resolvedRoleKey,
      sensitivity: sensitivity(stringValue(formData, "sensitivity")),
      subType: stringValue(formData, "subType"),
      targetObjectId: stringValue(formData, "targetObjectId") || undefined,
      targetObjectType: targetObjectType(stringValue(formData, "targetObjectType")),
      tenantSlug: resolvedTenantSlug,
    });
    const safeDocumentResult = {
      documentType: result.document.documentType,
      evidenceLifecycleStatus: result.document.evidenceLifecycleStatus,
      evidenceRequestState: result.evidenceRequestState,
      fileName: result.document.fileName,
      fileSizeBytes: result.document.fileSizeBytes,
      id: result.document.id,
      latestVersionNumber: result.document.latestVersionNumber,
      status: result.document.status,
      targetObjectId: result.document.targetObjectId,
      targetObjectType: result.document.targetObjectType,
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

    return NextResponse.json({
      ok: true,
      result: safeResult,
      safety: {
        clientVisible: false,
        evidenceLifecycleStatus: result.document.evidenceLifecycleStatus,
        evidenceRequestState: result.evidenceRequestState,
        evidenceStatus: "REVIEW_PENDING",
        releaseUnlocked: false,
        sufficiency: false,
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
        },
        { status: 409 },
      );
    }

    return failClosedJson(
      {
        error: "Unable to upload document.",
        reasonCode: "SAFE_ERROR",
        retryAllowed: true,
      },
      { status: 500 },
    );
  }
}
