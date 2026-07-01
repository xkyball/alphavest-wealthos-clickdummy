import { NextResponse } from "next/server";

import {
  DbtfNotFoundError,
  DbtfPermissionError,
  DbtfValidationError,
  getDbtfClientProfile,
  saveDbtfClientProfile,
} from "@/lib/dbtf-form-service";
import {
  CurrentUserActorSessionError,
  resolveCurrentUserActorSession,
} from "@/lib/auth/current-user-actor-session";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { prismaClient } from "@/lib/prisma";

function profileScopeFailure(status: number, error: string, reasonCode: string) {
  return NextResponse.json(
    {
      error,
      mutated: false,
      ok: false,
      profile: null,
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
    const profile = await getDbtfClientProfile(
      prismaClient(),
      session.tenant.slug,
      session.role.key,
      session.tenant.slug,
    );

    return NextResponse.json({
      ok: true,
      profile,
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        roleKey: session.role.key,
        scoped: true,
        tenantSlug: session.tenant.slug,
      },
    });
  } catch (error) {
    if (error instanceof CurrentUserActorSessionError) {
      return profileScopeFailure(error.status, error.message, error.reasonCode);
    }

    if (error instanceof DbtfPermissionError) {
      return NextResponse.json(
        {
          error: "Client profile is not available for this actor scope.",
          mutated: false,
          ok: false,
          profile: null,
          reason: error.reason,
          safety: { authority: "db-user-jwt", hiddenRowsDisclosed: false, scoped: false },
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof DbtfNotFoundError ? error.message : "Client profile could not be loaded.",
        ok: false,
        profile: null,
        safety: { authority: "db-user-jwt", hiddenRowsDisclosed: false, scoped: false },
      },
      { status: error instanceof DbtfNotFoundError ? 404 : 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const mode = payload.action === "submit_review" ? "submit_review" : "save_draft";

  try {
    const { session } = await resolveCurrentUserActorSession(prismaClient(), request);
    const result = await saveDbtfClientProfile(
      prismaClient(),
      session.tenant.slug,
      session.role.key,
      payload,
      mode,
      session.tenant.slug,
    );
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prismaClient(), `profile:${mode}`);

    return NextResponse.json({
      ok: true,
      result,
      safety: {
        authority: "db-user-jwt",
        noClientRelease: true,
        scoped: true,
      },
      searchIndex,
    });
  } catch (error) {
    if (error instanceof CurrentUserActorSessionError) {
      return NextResponse.json(
        {
          error: error.message,
          mutated: false,
          ok: false,
          profile: null,
          reasonCode: error.reasonCode,
          safety: { authority: "db-user-jwt", hiddenRowsDisclosed: false, scoped: false },
        },
        { status: error.status },
      );
    }

    if (error instanceof DbtfValidationError) {
      return NextResponse.json(
        { error: "Invalid client profile.", issues: error.issues, mutated: false, ok: false },
        { status: 400 },
      );
    }

    if (error instanceof DbtfPermissionError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          error: "Client profile update denied.",
          mutated: false,
          noClientRelease: true,
          ok: false,
          reason: error.reason,
        },
        { status: 403 },
      );
    }

    if (error instanceof DbtfNotFoundError) {
      return NextResponse.json(
        { error: error.message, mutated: false, ok: false },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Client profile could not be saved.", mutated: false, ok: false },
      { status: 500 },
    );
  }
}
