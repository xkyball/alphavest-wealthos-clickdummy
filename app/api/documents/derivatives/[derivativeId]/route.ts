import { NextResponse } from "next/server";
import { AuditResult, ObjectType, type EvidenceStatus, type Sensitivity } from "@prisma/client";

import { actorPlatformTenantId } from "@/lib/actor-session";
import { CurrentUserActorSessionError, resolveCurrentUserActorSession } from "@/lib/auth/current-user-actor-session";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { activeDocumentStorageAdapter } from "@/lib/document-storage-adapter";
import { prismaClient } from "@/lib/prisma";
import { visibilityEngine } from "@/lib/visibility-engine";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ derivativeId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { derivativeId } = await context.params;
  const prisma = prismaClient();
  const session = await resolveCurrentUserActorSession(prisma, request).catch((error) => {
    if (error instanceof CurrentUserActorSessionError) {
      return error;
    }

    throw error;
  });

  if (session instanceof CurrentUserActorSessionError) {
    return failClosedJson(
      {
        error: "Document preview is not available for this user.",
        reasonCode: session.status === 401 ? "PERMISSION_DENIED" : "SCOPE_DENIED",
        safety: {
          authority: "db-user-jwt",
          hiddenRowsDisclosed: false,
          noStorageLocationDisclosed: true,
          scoped: false,
        },
      },
      { status: session.status },
    );
  }

  const { session: actorSession } = session;

  const derivative = await prisma.documentDerivative.findUnique({
    include: {
      document: true,
    },
    where: { id: derivativeId },
  });

  if (!derivative || derivative.status !== "READY" || !derivative.storageKey || !derivative.mimeType) {
    return failClosedJson(
      {
        error: "Document preview is not available.",
        reasonCode: "SAFE_ERROR",
      },
      { status: 404 },
    );
  }

  const evidenceLink = await prisma.documentLink.findFirst({
    select: { targetId: true },
    where: {
      documentId: derivative.documentId,
      targetType: ObjectType.EVIDENCE_RECORD,
    },
  });
  const evidenceRecord = evidenceLink?.targetId
    ? await prisma.evidenceRecord.findUnique({
        select: { id: true, status: true, visibilityStatus: true },
        where: { id: evidenceLink.targetId },
      })
    : null;
  const projection = visibilityEngine.projectDocumentPayload(
    actorSession.actor,
    actorSession.role,
    {
      clientTenantId: derivative.document.clientTenantId,
      clientVisible: derivative.document.clientVisible,
      documentType: derivative.document.documentType,
      evidenceRecordId: evidenceRecord?.id ?? null,
      evidenceStatus: evidenceRecord?.status as EvidenceStatus | null,
      evidenceVisibilityStatus: evidenceRecord?.visibilityStatus ?? null,
      fileName: derivative.document.fileName,
      fileSizeBytes: derivative.document.fileSizeBytes,
      id: derivative.document.id,
      mimeType: derivative.document.mimeType,
      previewStatus: derivative.kind === "preview" ? derivative.status : null,
      previewUrl: derivative.kind === "preview" ? new URL(request.url).pathname : null,
      sensitivity: derivative.document.sensitivity as Sensitivity,
      status: derivative.document.status,
      thumbnailStatus: derivative.kind === "thumbnail" ? derivative.status : null,
      thumbnailUrl: derivative.kind === "thumbnail" ? new URL(request.url).pathname : null,
      title: derivative.document.title,
      uploadedAt: derivative.document.createdAt.toISOString(),
    },
    actorPlatformTenantId,
    actorSession.tenant.id,
  );

  if (!projection.visible) {
    await prisma.auditEvent.create({
      data: {
        actorRoleKey: actorSession.role.key,
        actorUserId: actorSession.actor.id,
        clientTenantId: derivative.document.clientTenantId,
        eventType: `document.derivative.${derivative.kind}.denied`,
        evidenceRecordId: evidenceRecord?.id ?? null,
        metadataJson: {
          derivativeId,
          derivativeKind: derivative.kind,
          hiddenFields: projection.hiddenFields,
          noStorageLocationDisclosed: true,
          projectionReasonCode: projection.reasonCode,
          visibilityState: projection.visibilityState,
        },
        nextState: projection.visibilityState,
        platformTenantId: actorPlatformTenantId,
        previousState: derivative.document.status,
        reason: projection.reason,
        result: AuditResult.DENIED,
        targetId: derivative.documentId,
        targetType: ObjectType.DOCUMENT,
      },
    });

    return failClosedJson(
      {
        error: "Document preview is not available for this role.",
        reasonCode: "PERMISSION_DENIED",
      },
      { status: 403 },
    );
  }

  const stored = await activeDocumentStorageAdapter().getObject({ storageKey: derivative.storageKey });

  await prisma.auditEvent.create({
    data: {
      actorRoleKey: actorSession.role.key,
      actorUserId: actorSession.actor.id,
      clientTenantId: derivative.document.clientTenantId,
      eventType: `document.derivative.${derivative.kind}.accessed`,
      evidenceRecordId: evidenceRecord?.id ?? null,
      metadataJson: {
        derivativeId,
        derivativeKind: derivative.kind,
        mimeType: derivative.mimeType,
        noStorageLocationDisclosed: true,
        projectionReasonCode: projection.reasonCode,
        visibilityState: projection.visibilityState,
      },
      nextState: projection.visibilityState,
      platformTenantId: actorPlatformTenantId,
      previousState: derivative.document.status,
      reason: projection.reason,
      result: AuditResult.SUCCESS,
      targetId: derivative.documentId,
      targetType: ObjectType.DOCUMENT,
    },
  });

  const body = stored.bytes.buffer.slice(stored.bytes.byteOffset, stored.bytes.byteOffset + stored.bytes.byteLength) as ArrayBuffer;

  return new NextResponse(body, {
    headers: {
      "Cache-Control": "private, max-age=300",
      "Content-Type": derivative.mimeType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
