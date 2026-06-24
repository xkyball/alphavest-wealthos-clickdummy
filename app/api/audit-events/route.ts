import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { listDbtfAuditEvents } from "@/lib/dbtf-table-service";
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
    return failClosedJson(
      {
        auditEvents: [],
        error: "Audit events are not available for this scope.",
        issues: [
          ...(!tenantSlug ? ["valid_tenant_slug_required"] : []),
          ...(!roleKey ? ["valid_role_key_required"] : []),
        ],
        reasonCode: "INVALID_REQUEST",
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  try {
    const auditEvents = await listDbtfAuditEvents(prismaClient(), tenantSlug, roleKey, {
      q: url.searchParams.get("q") ?? undefined,
      result: url.searchParams.get("result") ?? undefined,
    });

    return NextResponse.json({
      auditEvents,
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        returnedRows: auditEvents.length,
        roleKey,
        scoped: true,
        tenantSlug,
      },
    });
  } catch {
    return failClosedJson(
      {
        auditEvents: [],
        error: "Audit events are not available for this scope.",
        reasonCode: "SAFE_ERROR",
        retryAllowed: true,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 500 },
    );
  }
}
