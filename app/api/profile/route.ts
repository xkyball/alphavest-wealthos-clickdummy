import { NextResponse } from "next/server";

import {
  DbtfNotFoundError,
  DbtfPermissionError,
  DbtfValidationError,
  getDbtfClientProfile,
  saveDbtfClientProfile,
} from "@/lib/dbtf-form-service";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { prismaClient } from "@/lib/prisma";

function roleKey(value: unknown): DemoRoleKey | undefined {
  return typeof value === "string" && demoRoles.some((role) => role.key === value)
    ? (value as DemoRoleKey)
    : undefined;
}

function tenantSlug(value: unknown): DemoTenantSlug | undefined {
  return typeof value === "string" && demoTenants.some((tenant) => tenant.slug === value)
    ? (value as DemoTenantSlug)
    : undefined;
}

function queryContext(request: Request) {
  const url = new URL(request.url);

  return {
    actorTenantSlug: tenantSlug(url.searchParams.get("actorTenantSlug")),
    roleKey: roleKey(url.searchParams.get("roleKey")),
    tenantSlug: tenantSlug(url.searchParams.get("tenantSlug")),
  };
}

function invalidScope() {
  return NextResponse.json(
    {
      error: "Client profile is not available for this scope.",
      mutated: false,
      ok: false,
      profile: null,
      safety: { hiddenRowsDisclosed: false, scoped: false },
    },
    { status: 400 },
  );
}

export async function GET(request: Request) {
  const context = queryContext(request);

  if (!context.tenantSlug || !context.roleKey) {
    return invalidScope();
  }

  try {
    const profile = await getDbtfClientProfile(
      prismaClient(),
      context.tenantSlug,
      context.roleKey,
      context.actorTenantSlug,
    );

    return NextResponse.json({
      ok: true,
      profile,
      safety: {
        hiddenRowsDisclosed: false,
        roleKey: context.roleKey,
        scoped: true,
        tenantSlug: context.tenantSlug,
      },
    });
  } catch (error) {
    if (error instanceof DbtfPermissionError) {
      return NextResponse.json(
        {
          error: "Client profile is not available for this actor scope.",
          mutated: false,
          ok: false,
          profile: null,
          reason: error.reason,
          safety: { hiddenRowsDisclosed: false, scoped: false },
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof DbtfNotFoundError ? error.message : "Client profile could not be loaded.",
        ok: false,
        profile: null,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: error instanceof DbtfNotFoundError ? 404 : 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const parsedRoleKey = roleKey(payload.roleKey);
  const parsedTenantSlug = tenantSlug(payload.tenantSlug);
  const parsedActorTenantSlug = tenantSlug(payload.actorTenantSlug);
  const mode = payload.action === "submit_review" ? "submit_review" : "save_draft";

  if (!parsedTenantSlug || !parsedRoleKey) {
    return invalidScope();
  }

  try {
    const result = await saveDbtfClientProfile(
      prismaClient(),
      parsedTenantSlug,
      parsedRoleKey,
      payload,
      mode,
      parsedActorTenantSlug,
    );

    return NextResponse.json({ ok: true, result, safety: { noClientRelease: true, scoped: true } });
  } catch (error) {
    if (error instanceof DbtfValidationError) {
      return NextResponse.json(
        { error: "Invalid client profile.", issues: error.issues, mutated: false, ok: false },
        { status: 400 },
      );
    }

    if (error instanceof DbtfPermissionError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          error: "Client profile update denied.",
          mutated: false,
          noClientRelease: true,
          ok: false,
          reason: error.reason,
        },
        { status: 403 },
      );
    }

    if (error instanceof DbtfNotFoundError) {
      return NextResponse.json(
        { error: error.message, mutated: false, ok: false },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Client profile could not be saved.", mutated: false, ok: false },
      { status: 500 },
    );
  }
}
