import { NextResponse } from "next/server";

import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import { listDbtfRelationshipsPage, type DbtfRelationshipSortKey } from "@/lib/dbtf-table-service";
import { prismaClient } from "@/lib/prisma";

const relationshipSortKeys = ["confidence", "from", "readiness", "relationship", "status", "to", "type"] as const satisfies readonly DbtfRelationshipSortKey[];

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
        error: "Relationships are not available for this scope.",
        ok: false,
        relationships: [],
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  if (actorTenantSlug && actorTenantSlug !== tenantSlug) {
    return NextResponse.json(
      {
        error: "Relationships are not available for this actor scope.",
        ok: false,
        relationships: [],
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 403 },
    );
  }

  try {
    const page = await listDbtfRelationshipsPage(prismaClient(), tenantSlug, roleKey, parseDataSurfaceQuery(url.searchParams, {
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
        error: "Relationships are not available for this scope.",
        ok: false,
        relationships: [],
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 500 },
    );
  }
}
