import { NextResponse } from "next/server";

import {
  CurrentUserActorSessionError,
  resolveCurrentUserActorSession,
} from "@/lib/auth/current-user-actor-session";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  executeExportWorkflowCommand,
  ExportWorkflowCommandError,
  parseExportWorkflowCommandRequest,
} from "@/lib/export-workflow-command-service";
import { getExportWorkflowSnapshot } from "@/lib/export-workflow-readmodel-service";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { prismaClient } from "@/lib/prisma";

async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

function commandErrorResponse(error: unknown) {
  const normalized =
    error instanceof ExportWorkflowCommandError
      ? error
      : new ExportWorkflowCommandError("Export workflow command failed closed.", 500, "SAFE_ERROR");

  return failClosedJson(
    {
      error: normalized.message,
      issues: normalized.issues,
      reasonCode: normalized.reasonCode,
      safety: {
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        noExportApproval: true,
        noExportDownload: true,
        scoped: normalized.reasonCode !== "SCOPE_DENIED",
      },
    },
    { status: normalized.status },
    );
}

async function resolveExportActor(prisma: ReturnType<typeof prismaClient>, request: Request) {
  const actorSession = await resolveCurrentUserActorSession(prisma, request).catch((error) => {
    if (error instanceof CurrentUserActorSessionError) {
      return error;
    }

    throw error;
  });

  return actorSession;
}

function currentUserErrorResponse(error: CurrentUserActorSessionError) {
  return failClosedJson(
    {
      error: "Export workflow is not available for this user.",
      reasonCode: error.status === 401 ? "PERMISSION_DENIED" : "SCOPE_DENIED",
      safety: {
        authority: "db-user-jwt",
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        noExportApproval: true,
        noExportDownload: true,
        scoped: false,
      },
    },
    { status: error.status },
  );
}

export async function GET(request: Request) {
  const prisma = prismaClient();
  const actorSession = await resolveExportActor(prisma, request);

  if (actorSession instanceof CurrentUserActorSessionError) {
    return currentUserErrorResponse(actorSession);
  }

  try {
    const snapshot = await getExportWorkflowSnapshot(prisma, actorSession.session.tenant.slug);

    return NextResponse.json({
      ok: true,
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        roleKey: actorSession.session.role.key,
        scoped: true,
        tenantSlug: actorSession.session.tenant.slug,
      },
      snapshot,
    });
  } catch {
    return failClosedJson(
      {
        error: "Export workflow snapshot could not be loaded.",
        reasonCode: "SAFE_ERROR",
        retryAllowed: true,
        safety: {
          hiddenRowsDisclosed: false,
          noExportApproval: true,
          noExportDownload: true,
          scoped: false,
        },
        snapshot: null,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  const actorSession = await resolveExportActor(prisma, request);

  if (actorSession instanceof CurrentUserActorSessionError) {
    return currentUserErrorResponse(actorSession);
  }

  const parsed = parseExportWorkflowCommandRequest(await parseJson(request));

  if (!parsed.ok) {
    return failClosedJson(
      {
        error: "Export workflow command request is invalid.",
        issues: parsed.issues,
        reasonCode: "INVALID_REQUEST",
        safety: {
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noExportApproval: true,
          noExportDownload: true,
          scoped: false,
        },
      },
      { status: 400 },
    );
  }

  try {
    const commandRequest = {
      ...parsed.request,
      roleKey: actorSession.session.role.key,
      tenantSlug: actorSession.session.tenant.slug,
    };
    const result = await executeExportWorkflowCommand(prisma, commandRequest);
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prisma, `export-workflow:${commandRequest.command}`);

    return NextResponse.json({
      ...result,
      ok: true,
      searchIndex,
      safety: {
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        noExportDownload: commandRequest.command !== "DOWNLOAD" && commandRequest.command !== "SHARE",
        roleKey: actorSession.session.role.key,
        scoped: true,
        tenantSlug: actorSession.session.tenant.slug,
      },
    });
  } catch (error) {
    return commandErrorResponse(error);
  }
}
