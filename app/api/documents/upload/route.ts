import { NextResponse } from "next/server";
import { Sensitivity } from "@prisma/client";

import {
  DocumentUploadPermissionError,
  DocumentUploadValidationError,
  uploadDocument,
} from "@/lib/document-upload-service";
import { prismaClient } from "@/lib/prisma";
import type { DemoRoleKey, DemoTenantSlug } from "@/lib/demo-session";

export const runtime = "nodejs";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function roleKey(value: string): DemoRoleKey | undefined {
  const allowed = new Set<DemoRoleKey>([
    "admin",
    "analyst",
    "client_success",
    "compliance_officer",
    "external_advisor",
    "family_cfo",
    "next_gen",
    "principal",
    "security_officer",
    "senior_wealth_advisor",
    "trustee",
  ]);

  return allowed.has(value as DemoRoleKey) ? (value as DemoRoleKey) : undefined;
}

function tenantSlug(value: string): DemoTenantSlug | undefined {
  const allowed = new Set<DemoTenantSlug>(["bennett", "morgan", "northbridge", "summit"]);

  return allowed.has(value as DemoTenantSlug) ? (value as DemoTenantSlug) : undefined;
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
      { error: "Invalid multipart upload request.", issues: ["multipart_form_data_required"] },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Invalid document upload.", issues: ["file_required"] },
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
      roleKey: roleKey(stringValue(formData, "roleKey")),
      sensitivity: sensitivity(stringValue(formData, "sensitivity")),
      subType: stringValue(formData, "subType"),
      tenantSlug: tenantSlug(stringValue(formData, "tenantSlug")),
    });

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof DocumentUploadValidationError) {
      return NextResponse.json(
        { error: "Invalid document upload.", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof DocumentUploadPermissionError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          error: "Document upload denied.",
          reason: error.reason,
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload document." },
      { status: 500 },
    );
  }
}
