import { NextResponse } from "next/server";
import { ObjectType } from "@prisma/client";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  EvidenceReviewInsufficientError,
  EvidenceReviewAuditUnavailableError,
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

function objectType(value: unknown): ObjectType | undefined {
  return typeof value === "string" && value in ObjectType
    ? ObjectType[value as keyof typeof ObjectType]
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
    return failClosedJson(
      {
        error: "Invalid evidence review request.",
        issues: ["json_body_required"],
        reasonCode: "INVALID_REQUEST",
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
    return failClosedJson(
      {
        error: "Invalid evidence review request.",
        issues: metadataIssues,
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const resolvedRoleKey = parsedRoleKey;
  const resolvedTenantSlug = parsedTenantSlug;
  const resolvedAction = parsedAction;
  if (!resolvedRoleKey || !resolvedTenantSlug || !resolvedAction) {
    return failClosedJson(
      {
        error: "Invalid evidence review request.",
        issues: metadataIssues,
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  try {
    const result = await reviewDocumentEvidence(prismaClient(), {
      action: resolvedAction,
      auditPersistenceAvailable: booleanValue(payload.simulateAuditPersistenceFailure) ? false : undefined,
      clientSafeAccepted: booleanValue(payload.clientSafeAccepted),
      currentAccepted: booleanValue(payload.currentAccepted),
      documentId,
      notes: typeof payload.notes === "string" ? payload.notes : undefined,
      relevanceAccepted: booleanValue(payload.relevanceAccepted),
      requiredObjectId: typeof payload.requiredObjectId === "string" ? payload.requiredObjectId : undefined,
      requiredObjectType: objectType(payload.requiredObjectType),
      roleKey: resolvedRoleKey,
      scopeAccepted: booleanValue(payload.scopeAccepted),
      tenantSlug: resolvedTenantSlug,
    });

    return NextResponse.json({ ok: true, result, safety: result.safety });
  } catch (error) {
    if (error instanceof EvidenceReviewValidationError) {
      return failClosedJson(
        {
          error: "Invalid evidence review request.",
          issues: error.issues,
          reasonCode: "INVALID_REQUEST",
        },
        { status: 400 },
      );
    }

    if (error instanceof EvidenceReviewNotFoundError) {
      return failClosedJson(
        {
          error: error.message,
          issues: ["document_not_found_for_tenant"],
          reasonCode: "SCOPE_DENIED",
        },
        { status: 404 },
      );
    }

    if (error instanceof EvidenceReviewPermissionError) {
      return failClosedJson(
        {
          auditEventId: error.auditEventId,
          error: "Evidence review denied.",
          reasonCode: "PERMISSION_DENIED",
          reason: error.reason,
        },
        { status: 403 },
      );
    }

    if (error instanceof EvidenceReviewInsufficientError) {
      return failClosedJson(
        {
          auditEventId: error.auditEventId,
          decision: error.decision,
          error: error.message,
          reasonCode: "SCOPE_DENIED",
        },
        { status: 409 },
      );
    }

    if (error instanceof EvidenceReviewAuditUnavailableError) {
      return failClosedJson(
        {
          auditPersistenceRequired: true,
          error: error.message,
          reasonCode: "AUDIT_PERSISTENCE_UNAVAILABLE",
        },
        { status: 409 },
      );
    }

    return failClosedJson(
      {
        error: "Unable to review evidence.",
        reasonCode: "SAFE_ERROR",
        retryAllowed: true,
      },
      { status: 500 },
    );
  }
}
