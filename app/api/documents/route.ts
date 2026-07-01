import { NextResponse } from "next/server";

import { CurrentUserActorSessionError, resolveCurrentUserActorSession } from "@/lib/auth/current-user-actor-session";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import { listUploadedDocumentsPage, type UploadedDocumentSortKey } from "@/lib/document-upload-service";
import { prismaClient } from "@/lib/prisma";

const documentSortKeys = ["documentType", "evidenceLifecycleStatus", "fileName", "sensitivity", "status", "title", "uploadedAt"] as const satisfies readonly UploadedDocumentSortKey[];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const prisma = prismaClient();

  try {
    const { session } = await resolveCurrentUserActorSession(prisma, request);
    const tenantSlug = session.tenant.slug;
    const roleKey = session.role.key;
    const page = await listUploadedDocumentsPage(prisma, tenantSlug, roleKey, parseDataSurfaceQuery(url.searchParams, {
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
        authority: "db-user-jwt",
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
  } catch (error) {
    if (error instanceof CurrentUserActorSessionError) {
      return failClosedJson(
        {
          documents: [],
          error: "Documents are not available for this user.",
          reasonCode: error.status === 401 ? "PERMISSION_DENIED" : "SCOPE_DENIED",
          safety: {
            authority: "db-user-jwt",
            hiddenRowsDisclosed: false,
            releaseUnlocked: false,
            scoped: false,
          },
        },
        { status: error.status },
      );
    }

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
