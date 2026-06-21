import { NextResponse } from "next/server";

import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { getOpsSlaSnapshot } from "@/lib/ops-sla-readmodel-service";
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
  const asOfParam = url.searchParams.get("asOf");
  const asOf = asOfParam ? new Date(asOfParam) : new Date();

  if (!parsedTenantSlug || !parsedRoleKey || Number.isNaN(asOf.getTime())) {
    return NextResponse.json(
      {
        error: "Ops/SLA metrics are not available for this scope.",
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
        snapshot: null,
      },
      { status: 400 },
    );
  }

  try {
    const snapshot = await getOpsSlaSnapshot(prismaClient(), parsedTenantSlug, asOf);

    return NextResponse.json({
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        roleKey: parsedRoleKey,
        scoped: true,
        tenantSlug: parsedTenantSlug,
      },
      snapshot,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Ops/SLA metrics could not be loaded.",
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
        snapshot: null,
      },
      { status: 500 },
    );
  }
}
