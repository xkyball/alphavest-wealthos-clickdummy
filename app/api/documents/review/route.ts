import { NextResponse } from "next/server";
import { ObjectType } from "@prisma/client";

import {
  CurrentUserActorSessionError,
  resolveCurrentUserActorSession,
} from "@/lib/auth/current-user-actor-session";
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
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { prismaClient } from "@/lib/prisma";

export const runtime = "nodejs";

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
  const prisma = prismaClient();
  const actorSession = await resolveCurrentUserActorSession(prisma, request).catch((error) => {
    if (error instanceof CurrentUserActorSessionError) {
      return error;
    }

    throw error;
  });

  if (actorSession instanceof CurrentUserActorSessionError) {
    return failClosedJson(
      {
        error: "Evidence review is not available for this user.",
        reasonCode: actorSession.status === 401 ? "PERMISSION_DENIED" : "SCOPE_DENIED",
        safety: {
          authority: "db-user-jwt",
          releaseUnlocked: false,
          scoped: false,
        },
      },
      { status: actorSession.status },
    );
  }

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
  const parsedAction = action(payload.action);
  const documentId = typeof payload.documentId === "string" ? payload.documentId : "";
  const metadataIssues = parsedAction ? [] : ["valid_evidence_review_action_required"];

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

  const resolvedAction = parsedAction;
  if (!resolvedAction) {
    return failClosedJson(
      {
        error: "Invalid evidence review request.",
        issues: metadataIssues,
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const resolvedRoleKey = actorSession.session.role.key;
  const resolvedTenantSlug = actorSession.session.tenant.slug;
  const authoritySafety = {
    authority: "db-user-jwt",
    releaseUnlocked: false,
    roleKey: resolvedRoleKey,
    scoped: true,
    tenantSlug: resolvedTenantSlug,
  };

  try {
    const result = await reviewDocumentEvidence(prisma, {
      action: resolvedAction,
      actorUserId: actorSession.currentUser.actor.id,
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
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prisma, `documents:review:${resolvedAction}`);

    return NextResponse.json({ ok: true, result, safety: { ...result.safety, ...authoritySafety }, searchIndex });
  } catch (error) {
    if (error instanceof EvidenceReviewValidationError) {
      return failClosedJson(
        {
          error: "Invalid evidence review request.",
          issues: error.issues,
          reasonCode: "INVALID_REQUEST",
          safety: authoritySafety,
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
          safety: { ...authoritySafety, scoped: false },
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
          safety: { ...authoritySafety, scoped: false },
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
          safety: authoritySafety,
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
          safety: authoritySafety,
        },
        { status: 409 },
      );
    }

    return failClosedJson(
      {
        error: "Unable to review evidence.",
        reasonCode: "SAFE_ERROR",
        retryAllowed: true,
        safety: authoritySafety,
      },
      { status: 500 },
    );
  }
}
