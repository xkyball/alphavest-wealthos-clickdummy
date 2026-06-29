import { NextResponse } from "next/server";

import { DbtfPermissionError, DbtfValidationError, saveDbtfEntityWizard } from "@/lib/dbtf-form-service";
import { listDbtfEntitiesPage, type DbtfEntitySortKey } from "@/lib/dbtf-table-service";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { prismaClient } from "@/lib/prisma";

const entitySortKeys = ["jurisdiction", "missingDocs", "name", "ownership", "risk", "status", "type", "visibilityStatus"] as const satisfies readonly DbtfEntitySortKey[];

function tenantSlugFromUrl(request: Request): DemoTenantSlug | undefined {
  const value = new URL(request.url).searchParams.get("tenantSlug");

  return demoTenants.some((tenant) => tenant.slug === value) ? (value as DemoTenantSlug) : undefined;
}

function actorTenantSlugFromUrl(request: Request): DemoTenantSlug | undefined {
  const value = new URL(request.url).searchParams.get("actorTenantSlug");

  return demoTenants.some((tenant) => tenant.slug === value) ? (value as DemoTenantSlug) : undefined;
}

function roleKeyFromUrl(request: Request): DemoRoleKey | undefined {
  const value = new URL(request.url).searchParams.get("roleKey");

  return demoRoles.some((role) => role.key === value) ? (value as DemoRoleKey) : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const actorTenantSlug = actorTenantSlugFromUrl(request);
  const tenantSlug = tenantSlugFromUrl(request);
  const roleKey = roleKeyFromUrl(request);

  if (!tenantSlug || !roleKey) {
    return NextResponse.json(
      {
        entities: [],
        error: "Entities are not available for this scope.",
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  if (actorTenantSlug && actorTenantSlug !== tenantSlug) {
    return NextResponse.json(
      {
        entities: [],
        error: "Entities are not available for this actor scope.",
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 403 },
    );
  }

  try {
    const page = await listDbtfEntitiesPage(prismaClient(), tenantSlug, roleKey, parseDataSurfaceQuery(url.searchParams, {
      allowedSortKeys: entitySortKeys,
      defaultPageSize: 10,
      defaultSortKey: "name",
      maxPageSize: 25,
    }), {
      jurisdiction: url.searchParams.get("jurisdiction") ?? undefined,
      risk: url.searchParams.get("risk") ?? undefined,
      type: url.searchParams.get("type") ?? undefined,
    });

    return NextResponse.json({
      entities: page.entities,
      facets: page.facets,
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
        entities: [],
        error: "Entities are not available for this scope.",
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const parsedActorTenantSlug = tenantSlugFromValue(payload.actorTenantSlug);
  const parsedRoleKey = roleKeyFromValue(payload.roleKey);
  const parsedTenantSlug = tenantSlugFromValue(payload.tenantSlug);
  const mode = payload.action === "submit" ? "submit" : "save_draft";

  if (!parsedTenantSlug || !parsedRoleKey) {
    return NextResponse.json(
      {
        entity: null,
        error: "Entity wizard is not available for this scope.",
        mutated: false,
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  try {
    const result = await saveDbtfEntityWizard(
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
        { error: "Invalid entity wizard submission.", issues: error.issues, mutated: false, ok: false },
        { status: 400 },
      );
    }

    if (error instanceof DbtfPermissionError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          error: "Entity wizard submission denied.",
          mutated: false,
          noClientRelease: true,
          ok: false,
          reason: error.reason,
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Entity wizard submission could not be saved.", mutated: false, ok: false },
      { status: 500 },
    );
  }
}

function tenantSlugFromValue(value: unknown): DemoTenantSlug | undefined {
  return typeof value === "string" && demoTenants.some((tenant) => tenant.slug === value)
    ? (value as DemoTenantSlug)
    : undefined;
}

function roleKeyFromValue(value: unknown): DemoRoleKey | undefined {
  return typeof value === "string" && demoRoles.some((role) => role.key === value)
    ? (value as DemoRoleKey)
    : undefined;
}
