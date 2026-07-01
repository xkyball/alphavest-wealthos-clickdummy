import { NextResponse } from "next/server";

import {
  CurrentUserActorSessionError,
  resolveCurrentUserActorSession,
} from "@/lib/auth/current-user-actor-session";
import { getDbtfDashboardMetrics } from "@/lib/dbtf-form-service";
import { prismaClient } from "@/lib/prisma";

function metricsScopeFailure(status: number, error: string, reasonCode: string) {
  return NextResponse.json(
    {
      error,
      metrics: null,
      ok: false,
      reasonCode,
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        scoped: false,
      },
    },
    { status },
  );
}

export async function GET(request: Request) {
  try {
    const { session } = await resolveCurrentUserActorSession(prismaClient(), request);
    const metrics = await getDbtfDashboardMetrics(prismaClient(), session.tenant.slug, session.role.key);

    return NextResponse.json({
      metrics,
      ok: true,
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        roleKey: session.role.key,
        scoped: true,
        tenantSlug: session.tenant.slug,
      },
    });
  } catch (error) {
    if (error instanceof CurrentUserActorSessionError) {
      return metricsScopeFailure(error.status, error.message, error.reasonCode);
    }

    return metricsScopeFailure(500, "Dashboard metrics could not be loaded.", "DASHBOARD_METRICS_SCOPE_UNAVAILABLE");
  }
}
