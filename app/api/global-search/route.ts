import { NextResponse } from "next/server";

import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { normalizeGlobalSearchQuery, searchGlobalDb } from "@/lib/global-search-service";
import { prismaClient } from "@/lib/prisma";

function tenantSlug(value: unknown): DemoTenantSlug | undefined {
  return typeof value === "string" && demoTenants.some((tenant) => tenant.slug === value)
    ? (value as DemoTenantSlug)
    : undefined;
}

function roleKey(value: unknown): DemoRoleKey | undefined {
  return typeof value === "string" && demoRoles.some((role) => role.key === value)
    ? (value as DemoRoleKey)
    : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsedTenantSlug = tenantSlug(url.searchParams.get("tenantSlug"));
  const parsedRoleKey = roleKey(url.searchParams.get("roleKey"));
  const query = normalizeGlobalSearchQuery(url.searchParams.get("q"));

  if (!parsedTenantSlug || !parsedRoleKey) {
    return NextResponse.json(
      {
        error: "Global search is not available for this scope.",
        ok: false,
        results: [],
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  if (query.length < 2) {
    return NextResponse.json({
      ok: true,
      query,
      results: [],
      safety: { hiddenRowsDisclosed: false, noClientRelease: true, roleKey: parsedRoleKey, scoped: true, tenantSlug: parsedTenantSlug },
    });
  }

  try {
    const results = await searchGlobalDb(prismaClient(), parsedTenantSlug, parsedRoleKey, query);

    return NextResponse.json({
      ok: true,
      query,
      results,
      safety: {
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        returnedRows: results.length,
        roleKey: parsedRoleKey,
        scoped: true,
        tenantSlug: parsedTenantSlug,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Global search could not be loaded.",
        ok: false,
        results: [],
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 500 },
    );
  }
}
