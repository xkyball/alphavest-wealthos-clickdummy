import { NextResponse } from "next/server";

import { DbtfPermissionError, DbtfValidationError, saveDbtfEntityWizard } from "@/lib/dbtf-form-service";
import { getDbtfEntityDetail, listDbtfEntitiesPage, type DbtfEntitySortKey } from "@/lib/dbtf-table-service";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import {
  CurrentUserActorSessionError,
  resolveCurrentUserActorSession,
} from "@/lib/auth/current-user-actor-session";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { prismaClient } from "@/lib/prisma";

const entitySortKeys = ["jurisdiction", "missingDocs", "name", "ownership", "risk", "status", "type", "visibilityStatus"] as const satisfies readonly DbtfEntitySortKey[];

function entityScopeFailure(status: number, error: string, reasonCode: string) {
  return NextResponse.json(
    {
      entities: [],
      error,
      mutated: false,
      ok: false,
      reasonCode,
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
    const targetId = url.searchParams.get("targetId")?.trim();

    if (targetId) {
      const entity = await getDbtfEntityDetail(prismaClient(), session.tenant.slug, session.role.key, targetId);

      if (!entity) {
        return NextResponse.json(
          {
            entity: null,
            error: "Entity is not available for this scope.",
            ok: false,
            safety: {
              authority: "db-user-jwt",
              hiddenRowsDisclosed: false,
              roleKey: session.role.key,
              scoped: true,
              tenantSlug: session.tenant.slug,
            },
          },
          { status: 404 },
        );
      }

      return NextResponse.json({
        entity,
        meta: {
          page: 1,
          pageSize: 1,
          query: targetId,
          returnedRows: 1,
          sortDirection: "asc",
          sortKey: "name",
          sourceTruth: "backend_query_backed",
          totalPages: 1,
          totalRows: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        ok: true,
        safety: {
          authority: "db-user-jwt",
          hiddenRowsDisclosed: false,
          returnedRows: 1,
          roleKey: session.role.key,
          scoped: true,
          tenantSlug: session.tenant.slug,
          totalRows: 1,
        },
      });
    }

    const page = await listDbtfEntitiesPage(prismaClient(), session.tenant.slug, session.role.key, parseDataSurfaceQuery(url.searchParams, {
      allowedSortKeys: entitySortKeys,
      defaultPageSize: 10,
      defaultSortKey: "name",
      maxPageSize: 25,
    }), {
      jurisdiction: url.searchParams.get("jurisdiction") ?? undefined,
      risk: url.searchParams.get("risk") ?? undefined,
      type: url.searchParams.get("type") ?? undefined,
    });

    return NextResponse.json({
      entities: page.entities,
      facets: page.facets,
      meta: page.meta,
      ok: true,
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
      return entityScopeFailure(error.status, error.message, error.reasonCode);
    }

    return entityScopeFailure(500, "Entities are not available for this scope.", "ENTITIES_SCOPE_UNAVAILABLE");
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const mode = payload.action === "submit" ? "submit" : "save_draft";

  try {
    const { session } = await resolveCurrentUserActorSession(prismaClient(), request);
    const result = await saveDbtfEntityWizard(
      prismaClient(),
      session.tenant.slug,
      session.role.key,
      payload,
      mode,
      session.tenant.slug,
    );
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prismaClient(), `entities:${mode}`);

    return NextResponse.json({
      ok: true,
      result,
      safety: {
        authority: "db-user-jwt",
        noClientRelease: true,
        scoped: true,
      },
      searchIndex,
    });
  } catch (error) {
    if (error instanceof CurrentUserActorSessionError) {
      return NextResponse.json(
        {
          entity: null,
          error: error.message,
          mutated: false,
          ok: false,
          reasonCode: error.reasonCode,
          safety: { authority: "db-user-jwt", hiddenRowsDisclosed: false, scoped: false },
        },
        { status: error.status },
      );
    }

    if (error instanceof DbtfValidationError) {
      return NextResponse.json(
        { error: "Invalid entity wizard submission.", issues: error.issues, mutated: false, ok: false },
        { status: 400 },
      );
    }

    if (error instanceof DbtfPermissionError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          error: "Entity wizard submission denied.",
          mutated: false,
          noClientRelease: true,
          ok: false,
          reason: error.reason,
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Entity wizard submission could not be saved.", mutated: false, ok: false },
      { status: 500 },
    );
  }
}
