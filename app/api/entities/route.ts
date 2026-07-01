import { NextResponse } from "next/server";

import { DbtfPermissionError, DbtfValidationError, saveDbtfEntityWizard } from "@/lib/dbtf-form-service";
import { getDbtfEntityDetail, listDbtfEntitiesPage, type DbtfEntitySortKey } from "@/lib/dbtf-table-service";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { prismaClient } from "@/lib/prisma";

const entitySortKeys = ["jurisdiction", "missingDocs", "name", "ownership", "risk", "status", "type", "visibilityStatus"] as const satisfies readonly DbtfEntitySortKey[];

function tenantSlugFromUrl(request: Request): ActorTenantSlug | undefined {
  const value = new URL(request.url).searchParams.get("tenantSlug");

  return actorTenants.some((tenant) => tenant.slug === value) ? (value as ActorTenantSlug) : undefined;
}

function actorTenantSlugFromUrl(request: Request): ActorTenantSlug | undefined {
  const value = new URL(request.url).searchParams.get("actorTenantSlug");

  return actorTenants.some((tenant) => tenant.slug === value) ? (value as ActorTenantSlug) : undefined;
}

function roleKeyFromUrl(request: Request): ActorRoleKey | undefined {
  const value = new URL(request.url).searchParams.get("roleKey");

  return actorRoles.some((role) => role.key === value) ? (value as ActorRoleKey) : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const actorTenantSlug = actorTenantSlugFromUrl(request);
  const tenantSlug = tenantSlugFromUrl(request);
  const roleKey = roleKeyFromUrl(request);

  if (!tenantSlug || !roleKey) {
    return NextResponse.json(
      {
        entities: [],
        error: "Entities are not available for this scope.",
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  if (actorTenantSlug && actorTenantSlug !== tenantSlug) {
    return NextResponse.json(
      {
        entities: [],
        error: "Entities are not available for this actor scope.",
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 403 },
    );
  }

  try {
    const targetId = url.searchParams.get("targetId")?.trim();

    if (targetId) {
      const entity = await getDbtfEntityDetail(prismaClient(), tenantSlug, roleKey, targetId);

      if (!entity) {
        return NextResponse.json(
          {
            entity: null,
            error: "Entity is not available for this scope.",
            ok: false,
            safety: {
              hiddenRowsDisclosed: false,
              roleKey,
              scoped: true,
              tenantSlug,
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
          hiddenRowsDisclosed: false,
          returnedRows: 1,
          roleKey,
          scoped: true,
          tenantSlug,
          totalRows: 1,
        },
      });
    }

    const page = await listDbtfEntitiesPage(prismaClient(), tenantSlug, roleKey, parseDataSurfaceQuery(url.searchParams, {
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
        hiddenRowsDisclosed: false,
        returnedRows: page.meta.returnedRows,
        roleKey,
        scoped: true,
        tenantSlug,
        totalRows: page.meta.totalRows,
      },
    });
  } catch {
    return NextResponse.json(
      {
        entities: [],
        error: "Entities are not available for this scope.",
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const parsedActorTenantSlug = tenantSlugFromValue(payload.actorTenantSlug);
  const parsedRoleKey = roleKeyFromValue(payload.roleKey);
  const parsedTenantSlug = tenantSlugFromValue(payload.tenantSlug);
  const mode = payload.action === "submit" ? "submit" : "save_draft";

  if (!parsedTenantSlug || !parsedRoleKey) {
    return NextResponse.json(
      {
        entity: null,
        error: "Entity wizard is not available for this scope.",
        mutated: false,
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  try {
    const result = await saveDbtfEntityWizard(
      prismaClient(),
      parsedTenantSlug,
      parsedRoleKey,
      payload,
      mode,
      parsedActorTenantSlug,
    );
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prismaClient(), `entities:${mode}`);

    return NextResponse.json({ ok: true, result, safety: { noClientRelease: true, scoped: true }, searchIndex });
  } catch (error) {
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

function tenantSlugFromValue(value: unknown): ActorTenantSlug | undefined {
  return typeof value === "string" && actorTenants.some((tenant) => tenant.slug === value)
    ? (value as ActorTenantSlug)
    : undefined;
}

function roleKeyFromValue(value: unknown): ActorRoleKey | undefined {
  return typeof value === "string" && actorRoles.some((role) => role.key === value)
    ? (value as ActorRoleKey)
    : undefined;
}
