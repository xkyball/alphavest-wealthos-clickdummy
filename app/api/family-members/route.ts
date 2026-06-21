import { NextResponse } from "next/server";

import { DbtfNotFoundError, DbtfPermissionError, DbtfValidationError, updateDbtfFamilyMember } from "@/lib/dbtf-form-service";
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

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
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
    const result = await updateDbtfFamilyMember(prismaClient(), parsedTenantSlug, parsedRoleKey, payload);

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

function tenantSlugFromUrlLike(value: unknown): DemoTenantSlug | undefined {
  return typeof value === "string" && demoTenants.some((tenant) => tenant.slug === value)
    ? (value as DemoTenantSlug)
    : undefined;
}

function roleKeyFromUrlLike(value: unknown): DemoRoleKey | undefined {
  return typeof value === "string" && demoRoles.some((role) => role.key === value)
    ? (value as DemoRoleKey)
    : undefined;
}
