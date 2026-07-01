import { NextResponse } from "next/server";

import { actorRoles, actorTenants, tryCreateActorSession, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { normalizeGlobalSearchQuery, searchGlobalDb } from "@/lib/global-search-service";
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
  const parsedActorTenantSlug = tenantSlug(url.searchParams.get("actorTenantSlug"));
  const parsedTenantSlug = tenantSlug(url.searchParams.get("tenantSlug"));
  const parsedRoleKey = roleKey(url.searchParams.get("roleKey"));
  const query = normalizeGlobalSearchQuery(url.searchParams.get("q"));

  if (!parsedTenantSlug || !parsedRoleKey) {
    return NextResponse.json(
      {
        error: "Global search is not available for this scope.",
        ok: false,
        results: [],
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 400 },
    );
  }

  if (parsedActorTenantSlug && parsedActorTenantSlug !== parsedTenantSlug) {
    return NextResponse.json(
      {
        error: "Global search is not available for this actor scope.",
        ok: false,
        results: [],
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 403 },
    );
  }

  const sessionResolution = tryCreateActorSession({
    roleKey: parsedRoleKey,
    tenantSlug: parsedTenantSlug,
  });

  if (!sessionResolution.ok) {
    return NextResponse.json(
      {
        error: "Global search is not available for this actor context.",
        ok: false,
        results: [],
        safety: {
          hiddenRowsDisclosed: false,
          issues: sessionResolution.issues,
          scoped: false,
        },
      },
      { status: 403 },
    );
  }

  const { session } = sessionResolution;

  if (query.length < 2) {
    return NextResponse.json({
      ok: true,
      query,
      results: [],
      sourceTruth: "full_text_search_index",
      safety: {
        actorTenantSlug: parsedActorTenantSlug ?? session.tenant.slug,
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        roleKey: session.role.key,
        scoped: true,
        tenantSlug: session.tenant.slug,
      },
    });
  }

  try {
    const results = await searchGlobalDb(prismaClient(), session, query);

    return NextResponse.json({
      ok: true,
      query,
      results,
      sourceTruth: "full_text_search_index",
      safety: {
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        actorTenantSlug: parsedActorTenantSlug ?? session.tenant.slug,
        returnedRows: results.length,
        roleKey: session.role.key,
        scoped: true,
        tenantSlug: session.tenant.slug,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Global search could not be loaded.",
        ok: false,
        results: [],
        safety: { hiddenRowsDisclosed: false, scoped: false },
      },
      { status: 500 },
    );
  }
}
