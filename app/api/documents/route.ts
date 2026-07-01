import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import { listUploadedDocumentsPage, type UploadedDocumentSortKey } from "@/lib/document-upload-service";
import { prismaClient } from "@/lib/prisma";
import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";

const documentSortKeys = ["documentType", "evidenceLifecycleStatus", "fileName", "sensitivity", "status", "title", "uploadedAt"] as const satisfies readonly UploadedDocumentSortKey[];

function tenantSlugFromUrl(request: Request): ActorTenantSlug | undefined {
  const value = new URL(request.url).searchParams.get("tenantSlug");

  return actorTenants.some((tenant) => tenant.slug === value) ? (value as ActorTenantSlug) : undefined;
}

function roleKeyFromUrl(request: Request): ActorRoleKey | undefined {
  const value = new URL(request.url).searchParams.get("roleKey");

  return actorRoles.some((role) => role.key === value) ? (value as ActorRoleKey) : undefined;
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
    const page = await listUploadedDocumentsPage(prismaClient(), tenantSlug, roleKey, parseDataSurfaceQuery(url.searchParams, {
      allowedSortKeys: documentSortKeys,
      defaultPageSize: 10,
      defaultSortDirection: "desc",
      defaultSortKey: "uploadedAt",
      maxPageSize: 25,
    }), {
      sensitivity: url.searchParams.get("sensitivity") ?? undefined,
      source: url.searchParams.get("source") === "all" ? "all" : "uploads",
      status: url.searchParams.get("status") ?? undefined,
      type: url.searchParams.get("type") ?? undefined,
    });

    return NextResponse.json({
      documents: page.documents,
      meta: page.meta,
      mutated: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: true,
      sourceTruth: "document_readmodel_db",
      safety: {
        hiddenRowsDisclosed: false,
        releaseUnlocked: false,
        returnedRows: page.meta.returnedRows,
        roleKey,
        scope: "tenant-role-document-list",
        scoped: true,
        tenantSlug,
        totalRows: page.meta.totalRows,
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
