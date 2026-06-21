import { NextResponse } from "next/server";

import { getDbtfDashboardMetrics } from "@/lib/dbtf-form-service";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
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

  if (!parsedTenantSlug || !parsedRoleKey) {
    return NextResponse.json(
      {
        error: "Dashboard metrics are not available for this scope.",
        metrics: null,
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  try {
    const metrics = await getDbtfDashboardMetrics(prismaClient(), parsedTenantSlug, parsedRoleKey);

    return NextResponse.json({
      metrics,
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        roleKey: parsedRoleKey,
        scoped: true,
        tenantSlug: parsedTenantSlug,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Dashboard metrics could not be loaded.",
        metrics: null,
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 500 },
    );
  }
}
