import { NextResponse } from "next/server";

import { DemoAuthProviderError, inviteDemoAuthUser } from "@/lib/demo/demo-auth-provider-service";
import { getAdminTenantSnapshot } from "@/lib/admin-tenant-readmodel-service";
import {
  assignP44TeamMember,
  createP44ClientTenant,
  createP44PolicyVersion,
  P44Phase2PermissionError,
  P44Phase2ValidationError,
  requireP44EffectivePolicy,
  updateP44PlatformSetting,
  updateP44SecurityConfiguration,
} from "@/lib/p44-phase2-admin-foundation";
import { prismaClient } from "@/lib/prisma";

export async function GET() {
  try {
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

    if (error instanceof P44Phase2ValidationError) {
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

    if (error instanceof P44Phase2PermissionError) {
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
      return createP44ClientTenant(prisma, payload);
    case "update_platform_setting":
      return updateP44PlatformSetting(prisma, payload);
    case "update_security_configuration":
      return updateP44SecurityConfiguration(prisma, payload);
    case "create_policy_version":
      return createP44PolicyVersion(prisma, payload);
    case "require_effective_policy":
      return requireP44EffectivePolicy(prisma, payload);
    case "assign_team_member":
      return assignP44TeamMember(prisma, payload);
    default:
      throw new P44Phase2ValidationError(["unsupported_admin_tenant_action"]);
  }
}
