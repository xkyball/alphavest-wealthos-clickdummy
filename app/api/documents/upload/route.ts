import { NextResponse } from "next/server";
import { Sensitivity } from "@prisma/client";

import {
  DocumentUploadPermissionError,
  DocumentUploadValidationError,
  uploadDocument,
} from "@/lib/document-upload-service";
import { prismaClient } from "@/lib/prisma";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";

export const runtime = "nodejs";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function roleKey(value: string): DemoRoleKey | undefined {
  return demoRoles.some((role) => role.key === value) ? (value as DemoRoleKey) : undefined;
}

function tenantSlug(value: string): DemoTenantSlug | undefined {
  return demoTenants.some((tenant) => tenant.slug === value) ? (value as DemoTenantSlug) : undefined;
}

function sensitivity(value: string): Sensitivity {
  if (value in Sensitivity) {
    return Sensitivity[value as keyof typeof Sensitivity];
  }

  return Sensitivity.CONFIDENTIAL;
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid multipart upload request.",
        issues: ["multipart_form_data_required"],
        mutated: false,
        noClientRelease: true,
        ok: false,
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
    return NextResponse.json(
      {
        error: "Invalid document upload.",
        issues: ["file_required"],
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 400 },
    );
  }

  if (metadataIssues.length > 0) {
    return NextResponse.json(
      {
        error: "Invalid document upload.",
        issues: metadataIssues,
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 400 },
    );
  }

  const resolvedRoleKey = parsedRoleKey;
  const resolvedTenantSlug = parsedTenantSlug;
  if (!resolvedRoleKey || !resolvedTenantSlug) {
    return NextResponse.json(
      {
        error: "Invalid document upload.",
        issues: metadataIssues,
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 400 },
    );
  }

  try {
    const result = await uploadDocument(prismaClient(), {
      documentType: stringValue(formData, "documentType"),
      file,
      linkedObjectLabel: stringValue(formData, "linkedObjectLabel"),
      notes: stringValue(formData, "notes"),
      periodLabel: stringValue(formData, "periodLabel"),
      roleKey: resolvedRoleKey,
      sensitivity: sensitivity(stringValue(formData, "sensitivity")),
      subType: stringValue(formData, "subType"),
      tenantSlug: resolvedTenantSlug,
    });

    return NextResponse.json({
      ok: true,
      result,
      safety: {
        clientVisible: false,
        evidenceStatus: "REVIEW_PENDING",
        releaseUnlocked: false,
        sufficiency: false,
        uploadOnly: true,
      },
    });
  } catch (error) {
    if (error instanceof DocumentUploadValidationError) {
      return NextResponse.json(
        {
          error: "Invalid document upload.",
          issues: error.issues,
          mutated: false,
          noClientRelease: true,
          ok: false,
        },
        { status: 400 },
      );
    }

    if (error instanceof DocumentUploadPermissionError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          error: "Document upload denied.",
          mutated: false,
          noClientRelease: true,
          ok: false,
          reason: error.reason,
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to upload document.",
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 500 },
    );
  }
}
