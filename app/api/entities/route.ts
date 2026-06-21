import { NextResponse } from "next/server";

import { listDbtfEntities } from "@/lib/dbtf-table-service";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { prismaClient } from "@/lib/prisma";

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

  try {
    const entities = await listDbtfEntities(prismaClient(), tenantSlug, roleKey, {
      jurisdiction: url.searchParams.get("jurisdiction") ?? undefined,
      q: url.searchParams.get("q") ?? undefined,
      risk: url.searchParams.get("risk") ?? undefined,
      sort: url.searchParams.get("sort") ?? undefined,
      type: url.searchParams.get("type") ?? undefined,
    });

    return NextResponse.json({
      entities,
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        returnedRows: entities.length,
        roleKey,
        scoped: true,
        tenantSlug,
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
