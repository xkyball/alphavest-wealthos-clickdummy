import { NextResponse } from "next/server";

import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { allowedDataSurfaceFilter, parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import {
  decisionRecordSortKeys,
  decisionRecordStatusFilters,
  listDecisionRecordPage,
  type DecisionRecordStatusFilter,
} from "@/lib/decision-record-readmodel-service";
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
        error: "Decision records are not available for this scope.",
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
    const page = await listDecisionRecordPage(
      prismaClient(),
      tenantSlug,
      roleKey,
      parseDataSurfaceQuery(url.searchParams, {
        allowedSortKeys: decisionRecordSortKeys,
        defaultPageSize: 4,
        defaultSortDirection: "desc",
        defaultSortKey: "updatedAt",
        maxPageSize: 20,
      }),
      {
        status: allowedDataSurfaceFilter(
          url.searchParams,
          "status",
          decisionRecordStatusFilters,
          "all",
        ) as DecisionRecordStatusFilter,
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
        scope: "tenant-role-decision-record-list",
        scoped: true,
        tenantSlug,
        totalRows: page.meta.totalRows,
      },
    });
  } catch {
    return failClosedJson(
      {
        error: "Decision records could not be loaded.",
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
