import { NextResponse } from "next/server";

import { listUploadedDocuments } from "@/lib/document-upload-service";
import { prismaClient } from "@/lib/prisma";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";

function tenantSlugFromUrl(request: Request): DemoTenantSlug | undefined {
  const value = new URL(request.url).searchParams.get("tenantSlug");

  return demoTenants.some((tenant) => tenant.slug === value) ? (value as DemoTenantSlug) : undefined;
}

function roleKeyFromUrl(request: Request): DemoRoleKey {
  const value = new URL(request.url).searchParams.get("roleKey");

  return demoRoles.some((role) => role.key === value) ? (value as DemoRoleKey) : "analyst";
}

export async function GET(request: Request) {
  const tenantSlug = tenantSlugFromUrl(request);
  if (!tenantSlug) {
    return NextResponse.json(
      {
        documents: [],
        error: "Documents are not available for this scope.",
        issues: ["valid_tenant_slug_required"],
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 400 },
    );
  }

  try {
    const documents = await listUploadedDocuments(prismaClient(), tenantSlug, roleKeyFromUrl(request));

    return NextResponse.json({ documents, ok: true });
  } catch {
    return NextResponse.json(
      {
        documents: [],
        error: "Documents are not available for this scope.",
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 500 },
    );
  }
}
