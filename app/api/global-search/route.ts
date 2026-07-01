import { NextResponse } from "next/server";

import { resolveCurrentUserFromRequest, type CurrentUserContext } from "@/lib/auth/current-user";
import { actorRoles, actorTenants, isActorRoleKey, tryCreateActorSession, type ActorSession, type ActorTenantSlug } from "@/lib/actor-session";
import { normalizeGlobalSearchQuery, searchGlobalDb } from "@/lib/global-search-service";
import { prismaClient } from "@/lib/prisma";

type SearchContextResolution =
  | {
      ok: true;
      session: ActorSession;
    }
  | {
      error: string;
      ok: false;
      reasonCode: "CURRENT_USER_REQUIRED" | "SEARCH_CONTEXT_DENIED" | "SEARCH_CONTEXT_INVALID";
      status: 400 | 401 | 403;
    };

function failClosedSearchResponse(input: {
  error: string;
  reasonCode: string;
  status: 400 | 401 | 403 | 500;
}) {
  return NextResponse.json(
    {
      error: input.error,
      ok: false,
      reasonCode: input.reasonCode,
      results: [],
      safety: {
        failClosed: true,
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        scoped: false,
      },
      sourceTruth: "full_text_search_index",
    },
    { status: input.status },
  );
}

function tenantSlugForId(id?: string | null): ActorTenantSlug | undefined {
  return actorTenants.find((tenant) => tenant.id === id)?.slug;
}

function resolveSearchActorSession(currentUser: CurrentUserContext): SearchContextResolution {
  const roleKey = currentUser.role?.key;
  if (!isActorRoleKey(roleKey)) {
    return {
      error: "Global search is not available for this role context.",
      ok: false,
      reasonCode: "SEARCH_CONTEXT_DENIED",
      status: 403,
    };
  }

  const role = actorRoles.find((candidate) => candidate.key === roleKey);
  const activeMembership = currentUser.memberships.find((membership) => membership.userRoleId === currentUser.role?.userRoleId);
  if (!role || !activeMembership) {
    return {
      error: "Global search is not available for this actor context.",
      ok: false,
      reasonCode: "SEARCH_CONTEXT_DENIED",
      status: 403,
    };
  }

  let tenantSlug = tenantSlugForId(currentUser.tenant?.id);

  if (role.scope === "PLATFORM") {
    tenantSlug = tenantSlug ?? actorTenants[0]?.slug;
  } else {
    tenantSlug = tenantSlugForId(activeMembership.tenant?.id);

    if (!tenantSlug) {
      return {
        error: "Global search is not available for this tenant context.",
        ok: false,
        reasonCode: "SEARCH_CONTEXT_DENIED",
        status: 403,
      };
    }
  }

  if (!tenantSlug) {
    return {
      error: "Global search is not available for this tenant context.",
      ok: false,
      reasonCode: "SEARCH_CONTEXT_DENIED",
      status: 403,
    };
  }

  const sessionResolution = tryCreateActorSession({ roleKey, tenantSlug });
  if (!sessionResolution.ok) {
    return {
      error: "Global search is not available for this mapped context.",
      ok: false,
      reasonCode: "SEARCH_CONTEXT_DENIED",
      status: 403,
    };
  }

  if (sessionResolution.session.actor.id !== currentUser.actor.id) {
    return {
      error: "Global search is not available for this actor identity.",
      ok: false,
      reasonCode: "SEARCH_CONTEXT_DENIED",
      status: 403,
    };
  }

  return {
    ok: true,
    session: sessionResolution.session,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = normalizeGlobalSearchQuery(url.searchParams.get("q"));
  const prisma = prismaClient();

  let currentUser: CurrentUserContext;
  try {
    currentUser = await resolveCurrentUserFromRequest(prisma, request);
  } catch {
    return failClosedSearchResponse({
      error: "Global search requires an authenticated user context.",
      reasonCode: "CURRENT_USER_REQUIRED",
      status: 401,
    });
  }

  const sessionResolution = resolveSearchActorSession(currentUser);
  if (!sessionResolution.ok) {
    return failClosedSearchResponse(sessionResolution);
  }

  const { session } = sessionResolution;

  if (query.length < 2) {
    return NextResponse.json({
      ok: true,
      query,
      results: [],
      sourceTruth: "full_text_search_index",
      safety: {
        actorId: session.actor.id,
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        roleKey: session.role.key,
        scoped: true,
        tenantSlug: session.tenant.slug,
      },
    });
  }

  try {
    const results = await searchGlobalDb(prisma, session, query);

    return NextResponse.json({
      ok: true,
      query,
      results,
      sourceTruth: "full_text_search_index",
      safety: {
        actorId: session.actor.id,
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        returnedRows: results.length,
        roleKey: session.role.key,
        scoped: true,
        tenantSlug: session.tenant.slug,
      },
    });
  } catch {
    return failClosedSearchResponse({
      error: "Global search could not be loaded.",
      reasonCode: "SEARCH_UNAVAILABLE",
      status: 500,
    });
  }
}
