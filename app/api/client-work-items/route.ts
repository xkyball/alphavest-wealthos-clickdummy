import { NextResponse } from "next/server";

import {
  CurrentUserActorSessionError,
  resolveCurrentUserActorSession,
} from "@/lib/auth/current-user-actor-session";
import { getClientHomeWorkReadModel } from "@/lib/client-work-items-service";
import { prismaClient } from "@/lib/prisma";

function workItemsScopeFailure(status: number, error: string, reasonCode: string) {
  return NextResponse.json(
    {
      activities: [],
      error,
      ok: false,
      openWork: [],
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
    const readModel = await getClientHomeWorkReadModel(prismaClient(), session.tenant.slug, session.role.key);

    return NextResponse.json({
      ...readModel,
      ok: true,
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        returnedActivityRows: readModel.activities.length,
        returnedOpenWorkRows: readModel.openWork.length,
        roleKey: session.role.key,
        scoped: true,
        tenantSlug: session.tenant.slug,
      },
    });
  } catch (error) {
    if (error instanceof CurrentUserActorSessionError) {
      return workItemsScopeFailure(error.status, error.message, error.reasonCode);
    }

    return workItemsScopeFailure(500, "Client work items could not be loaded.", "CLIENT_WORK_ITEMS_SCOPE_UNAVAILABLE");
  }
}
