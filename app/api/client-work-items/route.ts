import { NextResponse } from "next/server";

import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { getClientHomeWorkReadModel } from "@/lib/client-work-items-service";
import { prismaClient } from "@/lib/prisma";

function tenantSlug(value: unknown): ActorTenantSlug | undefined {
  return typeof value === "string" && actorTenants.some((tenant) => tenant.slug === value)
    ? (value as ActorTenantSlug)
    : undefined;
}

function roleKey(value: unknown): ActorRoleKey | undefined {
  return typeof value === "string" && actorRoles.some((role) => role.key === value)
    ? (value as ActorRoleKey)
    : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsedTenantSlug = tenantSlug(url.searchParams.get("tenantSlug"));
  const parsedRoleKey = roleKey(url.searchParams.get("roleKey"));

  if (!parsedTenantSlug || !parsedRoleKey) {
    return NextResponse.json(
      {
        activities: [],
        error: "Client work items are not available for this scope.",
        ok: false,
        openWork: [],
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  try {
    const readModel = await getClientHomeWorkReadModel(prismaClient(), parsedTenantSlug, parsedRoleKey);

    return NextResponse.json({
      ...readModel,
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        returnedActivityRows: readModel.activities.length,
        returnedOpenWorkRows: readModel.openWork.length,
        roleKey: parsedRoleKey,
        scoped: true,
        tenantSlug: parsedTenantSlug,
      },
    });
  } catch {
    return NextResponse.json(
      {
        activities: [],
        error: "Client work items could not be loaded.",
        ok: false,
        openWork: [],
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 500 },
    );
  }
}
