import { NextResponse } from "next/server";

import { DemoAuthProviderError, inviteDemoAuthUser } from "@/lib/demo/demo-auth-provider-service";
import { getAdminTenantSnapshot } from "@/lib/admin-tenant-readmodel-service";
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

  if (payload.action !== "invite_user") {
    return NextResponse.json(
      {
        error: "Unsupported admin tenant action.",
        ok: false,
        safety: { hiddenRowsDisclosed: false, noClientRelease: true, scoped: false },
      },
      { status: 400 },
    );
  }

  try {
    const result = await inviteDemoAuthUser(prismaClient(), payload);
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
