import { NextResponse } from "next/server";

import {
  CurrentUserActorSessionError,
  resolveCurrentUserActorSession,
} from "@/lib/auth/current-user-actor-session";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import { listDbtfRelationshipsPage, type DbtfRelationshipSortKey } from "@/lib/dbtf-table-service";
import { prismaClient } from "@/lib/prisma";

const relationshipSortKeys = ["confidence", "from", "readiness", "relationship", "status", "to", "type"] as const satisfies readonly DbtfRelationshipSortKey[];

function relationshipScopeFailure(status: number, error: string, reasonCode: string) {
  return NextResponse.json(
    {
      error,
      mutated: false,
      ok: false,
      reasonCode,
      relationships: [],
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        scoped: false,
      },
    },
    { status },
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  try {
    const { session } = await resolveCurrentUserActorSession(prismaClient(), request);
    const page = await listDbtfRelationshipsPage(prismaClient(), session.tenant.slug, session.role.key, parseDataSurfaceQuery(url.searchParams, {
      allowedSortKeys: relationshipSortKeys,
      defaultPageSize: 10,
      defaultSortKey: "from",
      maxPageSize: 25,
    }));

    return NextResponse.json({
      meta: page.meta,
      ok: true,
      relationships: page.relationships,
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        returnedRows: page.meta.returnedRows,
        roleKey: session.role.key,
        scoped: true,
        tenantSlug: session.tenant.slug,
        totalRows: page.meta.totalRows,
      },
    });
  } catch (error) {
    if (error instanceof CurrentUserActorSessionError) {
      return relationshipScopeFailure(error.status, error.message, error.reasonCode);
    }

    return relationshipScopeFailure(500, "Relationships are not available for this scope.", "RELATIONSHIPS_SCOPE_UNAVAILABLE");
  }
}
