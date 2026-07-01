import { NextResponse } from "next/server";

import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { prismaClient } from "@/lib/prisma";
import { buildWealthMapReadModel } from "@/lib/wealth-map-readmodel-service";

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
  const actorTenantSlug = actorTenantSlugFromUrl(request);
  const tenantSlug = tenantSlugFromUrl(request);
  const roleKey = roleKeyFromUrl(request);
  const issues = [
    ...(!tenantSlug ? ["valid_tenant_slug_required"] : []),
    ...(!roleKey ? ["valid_role_key_required"] : []),
  ];

  if (!tenantSlug || !roleKey) {
    return failClosedJson(
      {
        error: "Wealth map is not available for this scope.",
        issues,
        ok: false,
        readModel: null,
        reasonCode: "INVALID_REQUEST",
        safety: {
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: false,
        },
      },
      { status: 400 },
    );
  }

  if (actorTenantSlug && actorTenantSlug !== tenantSlug) {
    return failClosedJson(
      {
        error: "Wealth map is not available for this actor scope.",
        ok: false,
        readModel: null,
        reasonCode: "SCOPE_DENIED",
        safety: {
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: false,
        },
      },
      { status: 403 },
    );
  }

  try {
    const readModel = await buildWealthMapReadModel(prismaClient(), tenantSlug, roleKey);

    return NextResponse.json({
      mutated: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: true,
      readModel,
      safety: {
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        returnedNodes: readModel.nodes.length,
        roleKey,
        scope: "tenant-role-wealth-map",
        scoped: true,
        tenantSlug,
      },
    });
  } catch {
    return failClosedJson(
      {
        error: "Wealth map could not be loaded.",
        ok: false,
        readModel: null,
        reasonCode: "SAFE_ERROR",
        retryAllowed: true,
        safety: {
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: false,
        },
      },
      { status: 500 },
    );
  }
}
