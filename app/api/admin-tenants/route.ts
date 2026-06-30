import { NextResponse } from "next/server";

import { DemoAuthProviderError, inviteDemoAuthUser } from "@/lib/demo/demo-auth-provider-service";
import {
  getAdminTenantSnapshot,
  listAdminTenantRowsPage,
  listAdminTenantUserRowsPage,
  type AdminTenantSortKey,
  type AdminTenantUserSortKey,
} from "@/lib/admin-tenant-readmodel-service";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import {
  assignOperationalTeamMember,
  createOperationalClientTenant,
  createOperationalPolicyVersion,
  OperationalStage2PermissionError,
  OperationalStage2ValidationError,
  requireOperationalEffectivePolicy,
  updateOperationalPlatformSetting,
  updateOperationalSecurityConfiguration,
} from "@/lib/admin-tenant-governance-service";
import { prismaClient } from "@/lib/prisma";

const adminTenantSortKeys = ["activePolicies", "activeUsers", "jurisdiction", "name", "onboarding", "owner", "readiness", "status", "tier"] as const satisfies readonly AdminTenantSortKey[];
const adminTenantUserSortKeys = ["invite", "name", "role", "scope", "status"] as const satisfies readonly AdminTenantUserSortKey[];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const surface = url.searchParams.get("surface");

    if (surface === "tenants") {
      const page = await listAdminTenantRowsPage(prismaClient(), parseDataSurfaceQuery(url.searchParams, {
        allowedSortKeys: adminTenantSortKeys,
        defaultPageSize: 10,
        defaultSortKey: "name",
        maxPageSize: 25,
      }), {
        status: url.searchParams.get("status") ?? undefined,
      });

      return NextResponse.json({
        meta: page.meta,
        ok: true,
        safety: {
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          returnedRows: page.meta.returnedRows,
          scoped: true,
          totalRows: page.meta.totalRows,
        },
        tenantRows: page.tenantRows,
      });
    }

    if (surface === "users") {
      const page = await listAdminTenantUserRowsPage(prismaClient(), parseDataSurfaceQuery(url.searchParams, {
        allowedSortKeys: adminTenantUserSortKeys,
        defaultPageSize: 10,
        defaultSortKey: "name",
        maxPageSize: 25,
      }), {
        status: url.searchParams.get("status") ?? undefined,
      });

      return NextResponse.json({
        meta: page.meta,
        ok: true,
        safety: {
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          returnedRows: page.meta.returnedRows,
          scoped: true,
          totalRows: page.meta.totalRows,
        },
        userRows: page.userRows,
      });
    }

    const snapshot = await getAdminTenantSnapshot(prismaClient());

    return NextResponse.json({
      ok: true,
      safety: { hiddenRowsDisclosed: false, noClientRelease: true, scoped: true },
      snapshot,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Admin tenant snapshot could not be loaded.",
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
        snapshot: null,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  try {
    const prisma = prismaClient();
    const result = await handleAdminTenantAction(prisma, payload);
    const snapshot = await getAdminTenantSnapshot(prismaClient());

    return NextResponse.json({
      ok: true,
      result,
      safety: {
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        productionAuthClaim: false,
        scoped: true,
      },
      snapshot,
    });
  } catch (error) {
    if (error instanceof DemoAuthProviderError) {
      return NextResponse.json(
        {
          error: error.message,
          ok: false,
          reasonCode: error.reasonCode,
          safety: {
            hiddenRowsDisclosed: false,
            noClientRelease: true,
            productionAuthClaim: false,
            scoped: false,
          },
        },
        { status: error.status },
      );
    }

    if (error instanceof OperationalStage2ValidationError) {
      return NextResponse.json(
        {
          error: "Admin tenant action failed validation.",
          issues: error.issues,
          ok: false,
          safety: { hiddenRowsDisclosed: false, noClientRelease: true, scoped: false },
        },
        { status: 400 },
      );
    }

    if (error instanceof OperationalStage2PermissionError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          error: error.message,
          ok: false,
          reasonCode: error.reasonCode,
          safety: { hiddenRowsDisclosed: false, noClientRelease: true, scoped: false },
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        error: "Invitation could not be created.",
        ok: false,
        safety: {
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
          scoped: false,
        },
      },
      { status: 500 },
    );
  }
}

async function handleAdminTenantAction(prisma: ReturnType<typeof prismaClient>, payload: Record<string, unknown>) {
  switch (payload.action) {
    case "invite_user":
      return inviteDemoAuthUser(prisma, payload);
    case "create_tenant":
      return createOperationalClientTenant(prisma, payload);
    case "update_platform_setting":
      return updateOperationalPlatformSetting(prisma, payload);
    case "update_security_configuration":
      return updateOperationalSecurityConfiguration(prisma, payload);
    case "create_policy_version":
      return createOperationalPolicyVersion(prisma, payload);
    case "require_effective_policy":
      return requireOperationalEffectivePolicy(prisma, payload);
    case "assign_team_member":
      return assignOperationalTeamMember(prisma, payload);
    default:
      throw new OperationalStage2ValidationError(["unsupported_admin_tenant_action"]);
  }
}
