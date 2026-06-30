import { NextResponse } from "next/server";

import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import {
  actionBoardPriorityFilters,
  actionBoardSortKeys,
  actionBoardStatusFilters,
  listActionBoardPage,
  type ActionBoardPriorityFilter,
  type ActionBoardStatusFilter,
} from "@/lib/action-board-readmodel-service";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { allowedDataSurfaceFilter, parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
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
  const issues = [
    ...(!tenantSlug ? ["valid_tenant_slug_required"] : []),
    ...(!roleKey ? ["valid_role_key_required"] : []),
  ];

  if (!tenantSlug || !roleKey) {
    return failClosedJson(
      {
        error: "Action board is not available for this scope.",
        issues,
        reasonCode: "INVALID_REQUEST",
        rows: [],
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

  try {
    const page = await listActionBoardPage(
      prismaClient(),
      tenantSlug,
      roleKey,
      parseDataSurfaceQuery(url.searchParams, {
        allowedSortKeys: actionBoardSortKeys,
        defaultPageSize: 4,
        defaultSortDirection: "asc",
        defaultSortKey: "dueDate",
        maxPageSize: 20,
      }),
      {
        priority: allowedDataSurfaceFilter(
          url.searchParams,
          "priority",
          actionBoardPriorityFilters,
          "all",
        ) as ActionBoardPriorityFilter,
        status: allowedDataSurfaceFilter(
          url.searchParams,
          "status",
          actionBoardStatusFilters,
          "all",
        ) as ActionBoardStatusFilter,
      },
    );

    return NextResponse.json({
      ...page,
      mutated: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        returnedRows: page.meta.returnedRows,
        roleKey,
        scope: "tenant-role-action-board",
        scoped: true,
        tenantSlug,
        totalRows: page.meta.totalRows,
      },
    });
  } catch {
    return failClosedJson(
      {
        error: "Action board could not be loaded.",
        reasonCode: "SAFE_ERROR",
        retryAllowed: true,
        rows: [],
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
