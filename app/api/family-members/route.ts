import { NextResponse } from "next/server";

import { DbtfNotFoundError, DbtfPermissionError, DbtfValidationError, updateDbtfFamilyMember } from "@/lib/dbtf-form-service";
import { listDbtfFamilyMembersPage, type DbtfFamilyMemberSortKey } from "@/lib/dbtf-table-service";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import {
  CurrentUserActorSessionError,
  resolveCurrentUserActorSession,
} from "@/lib/auth/current-user-actor-session";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { prismaClient } from "@/lib/prisma";

const familyMemberSortKeys = ["governance", "name", "relationship", "role", "status", "taxResidency", "visibilityStatus", "year"] as const satisfies readonly DbtfFamilyMemberSortKey[];

function familyMemberScopeFailure(status: number, error: string, reasonCode: string) {
  return NextResponse.json(
    {
      error,
      familyMembers: [],
      mutated: false,
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
  const url = new URL(request.url);

  try {
    const { session } = await resolveCurrentUserActorSession(prismaClient(), request);
    const page = await listDbtfFamilyMembersPage(prismaClient(), session.tenant.slug, session.role.key, parseDataSurfaceQuery(url.searchParams, {
      allowedSortKeys: familyMemberSortKeys,
      defaultPageSize: 10,
      defaultSortKey: "name",
      maxPageSize: 25,
    }));

    return NextResponse.json({
      familyMembers: page.familyMembers,
      meta: page.meta,
      ok: true,
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        returnedRows: page.meta.returnedRows,
        roleKey: session.role.key,
        scoped: true,
        tenantSlug: session.tenant.slug,
        totalRows: page.meta.totalRows,
      },
    });
  } catch (error) {
    if (error instanceof CurrentUserActorSessionError) {
      return familyMemberScopeFailure(error.status, error.message, error.reasonCode);
    }

    return familyMemberScopeFailure(500, "Family members are not available for this scope.", "FAMILY_MEMBERS_SCOPE_UNAVAILABLE");
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  try {
    const { session } = await resolveCurrentUserActorSession(prismaClient(), request);
    const result = await updateDbtfFamilyMember(
      prismaClient(),
      session.tenant.slug,
      session.role.key,
      payload,
      session.tenant.slug,
    );
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prismaClient(), "family-members:update");

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
          familyMember: null,
          mutated: false,
          ok: false,
          reasonCode: error.reasonCode,
          safety: { authority: "db-user-jwt", hiddenRowsDisclosed: false, scoped: false },
        },
        { status: error.status },
      );
    }

    if (error instanceof DbtfValidationError) {
      return NextResponse.json(
        { error: "Invalid family member update.", issues: error.issues, mutated: false, ok: false },
        { status: 400 },
      );
    }

    if (error instanceof DbtfPermissionError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          error: "Family member update denied.",
          mutated: false,
          noClientRelease: true,
          ok: false,
          reason: error.reason,
        },
        { status: 403 },
      );
    }

    if (error instanceof DbtfNotFoundError) {
      return NextResponse.json({ error: error.message, mutated: false, ok: false }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Family member could not be saved.", mutated: false, ok: false },
      { status: 500 },
    );
  }
}
