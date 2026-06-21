import { NextResponse } from "next/server";

import { listDbtfFamilyMembers } from "@/lib/dbtf-table-service";
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
        error: "Family members are not available for this scope.",
        familyMembers: [],
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  try {
    const familyMembers = await listDbtfFamilyMembers(prismaClient(), tenantSlug, roleKey, {
      q: url.searchParams.get("q") ?? undefined,
      sort: url.searchParams.get("sort") ?? undefined,
    });

    return NextResponse.json({
      familyMembers,
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        returnedRows: familyMembers.length,
        roleKey,
        scoped: true,
        tenantSlug,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Family members are not available for this scope.",
        familyMembers: [],
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 500 },
    );
  }
}
