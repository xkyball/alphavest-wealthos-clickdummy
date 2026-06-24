import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { listUploadedDocuments } from "@/lib/document-upload-service";
import { prismaClient } from "@/lib/prisma";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";

function tenantSlugFromUrl(request: Request): DemoTenantSlug | undefined {
  const value = new URL(request.url).searchParams.get("tenantSlug");

  return demoTenants.some((tenant) => tenant.slug === value) ? (value as DemoTenantSlug) : undefined;
}

function roleKeyFromUrl(request: Request): DemoRoleKey | undefined {
  const value = new URL(request.url).searchParams.get("roleKey");

  return demoRoles.some((role) => role.key === value) ? (value as DemoRoleKey) : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantSlug = tenantSlugFromUrl(request);
  const roleKey = roleKeyFromUrl(request);
  const issues = [
    ...(!tenantSlug ? ["valid_tenant_slug_required"] : []),
    ...(!roleKey ? ["valid_role_key_required"] : []),
  ];

  if (!tenantSlug || !roleKey) {
    return failClosedJson(
      {
        documents: [],
        error: "Documents are not available for this scope.",
        issues,
        reasonCode: "INVALID_REQUEST",
        safety: {
          hiddenRowsDisclosed: false,
          releaseUnlocked: false,
          scoped: false,
        },
      },
      { status: 400 },
    );
  }

  try {
    const documents = await listUploadedDocuments(prismaClient(), tenantSlug, roleKey, {
      q: url.searchParams.get("q") ?? undefined,
      sensitivity: url.searchParams.get("sensitivity") ?? undefined,
      sort: url.searchParams.get("sort") ?? undefined,
      source: url.searchParams.get("source") === "all" ? "all" : "uploads",
      status: url.searchParams.get("status") ?? undefined,
      type: url.searchParams.get("type") ?? undefined,
    });

    return NextResponse.json({
      documents,
      mutated: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        releaseUnlocked: false,
        returnedRows: documents.length,
        roleKey,
        scope: "tenant-role-document-list",
        scoped: true,
        tenantSlug,
      },
    });
  } catch {
    return failClosedJson(
      {
        documents: [],
        error: "Documents are not available for this scope.",
        reasonCode: "SAFE_ERROR",
        retryAllowed: true,
        safety: {
          hiddenRowsDisclosed: false,
          releaseUnlocked: false,
          scoped: false,
        },
      },
      { status: 500 },
    );
  }
}
