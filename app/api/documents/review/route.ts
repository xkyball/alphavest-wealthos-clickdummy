import { NextResponse } from "next/server";

import {
  EvidenceReviewInsufficientError,
  EvidenceReviewNotFoundError,
  EvidenceReviewPermissionError,
  EvidenceReviewValidationError,
  type EvidenceReviewAction,
  reviewDocumentEvidence,
} from "@/lib/evidence-review-service";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { prismaClient } from "@/lib/prisma";

export const runtime = "nodejs";

function roleKey(value: unknown): DemoRoleKey | undefined {
  return typeof value === "string" && demoRoles.some((role) => role.key === value)
    ? (value as DemoRoleKey)
    : undefined;
}

function tenantSlug(value: unknown): DemoTenantSlug | undefined {
  return typeof value === "string" && demoTenants.some((tenant) => tenant.slug === value)
    ? (value as DemoTenantSlug)
    : undefined;
}

function action(value: unknown): EvidenceReviewAction | undefined {
  return value === "mark_reviewed" || value === "request_clarification" || value === "accept_sufficiency"
    ? value
    : undefined;
}

function booleanValue(value: unknown) {
  return value === true;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid evidence review request.",
        issues: ["json_body_required"],
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 400 },
    );
  }

  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const parsedRoleKey = roleKey(payload.roleKey);
  const parsedTenantSlug = tenantSlug(payload.tenantSlug);
  const parsedAction = action(payload.action);
  const documentId = typeof payload.documentId === "string" ? payload.documentId : "";
  const metadataIssues = [
    ...(parsedRoleKey ? [] : ["valid_role_key_required"]),
    ...(parsedTenantSlug ? [] : ["valid_tenant_slug_required"]),
    ...(parsedAction ? [] : ["valid_evidence_review_action_required"]),
  ];

  if (metadataIssues.length > 0) {
    return NextResponse.json(
      {
        error: "Invalid evidence review request.",
        issues: metadataIssues,
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 400 },
    );
  }

  const resolvedRoleKey = parsedRoleKey;
  const resolvedTenantSlug = parsedTenantSlug;
  const resolvedAction = parsedAction;
  if (!resolvedRoleKey || !resolvedTenantSlug || !resolvedAction) {
    return NextResponse.json(
      {
        error: "Invalid evidence review request.",
        issues: metadataIssues,
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 400 },
    );
  }

  try {
    const result = await reviewDocumentEvidence(prismaClient(), {
      action: resolvedAction,
      clientSafeAccepted: booleanValue(payload.clientSafeAccepted),
      currentAccepted: booleanValue(payload.currentAccepted),
      documentId,
      notes: typeof payload.notes === "string" ? payload.notes : undefined,
      relevanceAccepted: booleanValue(payload.relevanceAccepted),
      requiredObjectId: typeof payload.requiredObjectId === "string" ? payload.requiredObjectId : undefined,
      roleKey: resolvedRoleKey,
      scopeAccepted: booleanValue(payload.scopeAccepted),
      tenantSlug: resolvedTenantSlug,
    });

    return NextResponse.json({ ok: true, result, safety: result.safety });
  } catch (error) {
    if (error instanceof EvidenceReviewValidationError) {
      return NextResponse.json(
        {
          error: "Invalid evidence review request.",
          issues: error.issues,
          mutated: false,
          noClientRelease: true,
          ok: false,
        },
        { status: 400 },
      );
    }

    if (error instanceof EvidenceReviewNotFoundError) {
      return NextResponse.json(
        {
          error: error.message,
          issues: ["document_not_found_for_tenant"],
          mutated: false,
          noClientRelease: true,
          ok: false,
        },
        { status: 404 },
      );
    }

    if (error instanceof EvidenceReviewPermissionError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          error: "Evidence review denied.",
          mutated: false,
          noClientRelease: true,
          ok: false,
          reason: error.reason,
        },
        { status: 403 },
      );
    }

    if (error instanceof EvidenceReviewInsufficientError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          decision: error.decision,
          error: error.message,
          mutated: false,
          noClientRelease: true,
          ok: false,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to review evidence.",
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 500 },
    );
  }
}
