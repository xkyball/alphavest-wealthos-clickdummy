import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { listDbtfAuditEvents } from "@/lib/dbtf-table-service";
import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { prismaClient } from "@/lib/prisma";

function tenantSlugFromUrl(request: Request): ActorTenantSlug | undefined {
  const value = new URL(request.url).searchParams.get("tenantSlug");

  return actorTenants.some((tenant) => tenant.slug === value) ? (value as ActorTenantSlug) : undefined;
}

function roleKeyFromUrl(request: Request): ActorRoleKey | undefined {
  const value = new URL(request.url).searchParams.get("roleKey");

  return actorRoles.some((role) => role.key === value) ? (value as ActorRoleKey) : undefined;
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
