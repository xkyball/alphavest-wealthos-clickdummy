import { NextResponse } from "next/server";

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
