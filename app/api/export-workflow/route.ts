import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import {
  executeExportWorkflowCommand,
  ExportWorkflowCommandError,
  parseExportWorkflowCommandRequest,
} from "@/lib/export-workflow-command-service";
import { getExportWorkflowSnapshot } from "@/lib/export-workflow-readmodel-service";
import { prismaClient } from "@/lib/prisma";

function tenantSlug(value: unknown): DemoTenantSlug | undefined {
  return typeof value === "string" && demoTenants.some((tenant) => tenant.slug === value)
    ? (value as DemoTenantSlug)
    : undefined;
}

function roleKey(value: unknown): DemoRoleKey | undefined {
  return typeof value === "string" && demoRoles.some((role) => role.key === value)
    ? (value as DemoRoleKey)
    : undefined;
}

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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsedTenantSlug = tenantSlug(url.searchParams.get("tenantSlug"));
  const parsedRoleKey = roleKey(url.searchParams.get("roleKey"));

  if (!parsedTenantSlug || !parsedRoleKey) {
    return failClosedJson(
      {
        error: "Export workflow is not available for this scope.",
        issues: [
          ...(!parsedTenantSlug ? ["valid_tenant_slug_required"] : []),
          ...(!parsedRoleKey ? ["valid_role_key_required"] : []),
        ],
        reasonCode: "INVALID_REQUEST",
        safety: {
          hiddenRowsDisclosed: false,
          noExportApproval: true,
          noExportDownload: true,
          scoped: false,
        },
        snapshot: null,
      },
      { status: 400 },
    );
  }

  try {
    const snapshot = await getExportWorkflowSnapshot(prismaClient(), parsedTenantSlug);

    return NextResponse.json({
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        roleKey: parsedRoleKey,
        scoped: true,
        tenantSlug: parsedTenantSlug,
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
    const result = await executeExportWorkflowCommand(prismaClient(), parsed.request);

    return NextResponse.json({
      ...result,
      ok: true,
      safety: {
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        noExportDownload: parsed.request.command !== "DOWNLOAD" && parsed.request.command !== "SHARE",
        scoped: true,
      },
    });
  } catch (error) {
    return commandErrorResponse(error);
  }
}
