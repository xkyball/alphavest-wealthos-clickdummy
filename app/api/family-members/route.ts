import { NextResponse } from "next/server";

import { DbtfNotFoundError, DbtfPermissionError, DbtfValidationError, updateDbtfFamilyMember } from "@/lib/dbtf-form-service";
import { listDbtfFamilyMembersPage, type DbtfFamilyMemberSortKey } from "@/lib/dbtf-table-service";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { prismaClient } from "@/lib/prisma";

const familyMemberSortKeys = ["governance", "name", "relationship", "role", "status", "taxResidency", "visibilityStatus", "year"] as const satisfies readonly DbtfFamilyMemberSortKey[];

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
        error: "Family members are not available for this scope.",
        familyMembers: [],
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  if (actorTenantSlug && actorTenantSlug !== tenantSlug) {
    return NextResponse.json(
      {
        error: "Family members are not available for this actor scope.",
        familyMembers: [],
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 403 },
    );
  }

  try {
    const page = await listDbtfFamilyMembersPage(prismaClient(), tenantSlug, roleKey, parseDataSurfaceQuery(url.searchParams, {
      allowedSortKeys: familyMemberSortKeys,
      defaultPageSize: 10,
      defaultSortKey: "name",
      maxPageSize: 25,
    }));

    return NextResponse.json({
      familyMembers: page.familyMembers,
      meta: page.meta,
      ok: true,
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
        error: "Family members are not available for this scope.",
        familyMembers: [],
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const parsedActorTenantSlug = tenantSlugFromUrlLike(payload.actorTenantSlug);
  const parsedRoleKey = roleKeyFromUrlLike(payload.roleKey);
  const parsedTenantSlug = tenantSlugFromUrlLike(payload.tenantSlug);

  if (!parsedTenantSlug || !parsedRoleKey) {
    return NextResponse.json(
      {
        error: "Family member update is not available for this scope.",
        familyMember: null,
        mutated: false,
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  try {
    const result = await updateDbtfFamilyMember(
      prismaClient(),
      parsedTenantSlug,
      parsedRoleKey,
      payload,
      parsedActorTenantSlug,
    );

    return NextResponse.json({ ok: true, result, safety: { noClientRelease: true, scoped: true } });
  } catch (error) {
    if (error instanceof DbtfValidationError) {
      return NextResponse.json(
        { error: "Invalid family member update.", issues: error.issues, mutated: false, ok: false },
        { status: 400 },
      );
    }

    if (error instanceof DbtfPermissionError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          error: "Family member update denied.",
          mutated: false,
          noClientRelease: true,
          ok: false,
          reason: error.reason,
        },
        { status: 403 },
      );
    }

    if (error instanceof DbtfNotFoundError) {
      return NextResponse.json({ error: error.message, mutated: false, ok: false }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Family member could not be saved.", mutated: false, ok: false },
      { status: 500 },
    );
  }
}

function tenantSlugFromUrlLike(value: unknown): ActorTenantSlug | undefined {
  return typeof value === "string" && actorTenants.some((tenant) => tenant.slug === value)
    ? (value as ActorTenantSlug)
    : undefined;
}

function roleKeyFromUrlLike(value: unknown): ActorRoleKey | undefined {
  return typeof value === "string" && actorRoles.some((role) => role.key === value)
    ? (value as ActorRoleKey)
    : undefined;
}
