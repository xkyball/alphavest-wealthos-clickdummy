import { NextResponse } from "next/server";
import type { EvidenceStatus, Sensitivity } from "@prisma/client";

import { actorPlatformTenantId, actorRoles, actorTenants, requireActorSession, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { activeDocumentStorageAdapter } from "@/lib/document-storage-adapter";
import { prismaClient } from "@/lib/prisma";
import { visibilityEngine } from "@/lib/visibility-engine";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ derivativeId: string }>;
};

function roleKeyFromUrl(request: Request): ActorRoleKey {
  const value = new URL(request.url).searchParams.get("roleKey");

  return actorRoles.some((role) => role.key === value) ? (value as ActorRoleKey) : "analyst";
}

function tenantSlugFromUrl(request: Request): ActorTenantSlug {
  const value = new URL(request.url).searchParams.get("tenantSlug");

  return actorTenants.some((tenant) => tenant.slug === value) ? (value as ActorTenantSlug) : "morgan";
}

export async function GET(request: Request, context: RouteContext) {
  const { derivativeId } = await context.params;
  const roleKey = roleKeyFromUrl(request);
  const tenantSlug = tenantSlugFromUrl(request);
  const session = requireActorSession({ roleKey, tenantSlug });

  const derivative = await prismaClient().documentDerivative.findUnique({
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

  const evidenceLink = await prismaClient().documentLink.findFirst({
    select: { targetId: true },
    where: {
      documentId: derivative.documentId,
      targetType: "EVIDENCE_RECORD",
    },
  });
  const evidenceRecord = evidenceLink?.targetId
    ? await prismaClient().evidenceRecord.findUnique({
        select: { id: true, status: true, visibilityStatus: true },
        where: { id: evidenceLink.targetId },
      })
    : null;
  const projection = visibilityEngine.projectDocumentPayload(
    session.actor,
    session.role,
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
    session.tenant.id,
  );

  if (!projection.visible) {
    return failClosedJson(
      {
        error: "Document preview is not available for this role.",
        reasonCode: "PERMISSION_DENIED",
      },
      { status: 403 },
    );
  }

  const stored = await activeDocumentStorageAdapter().getObject({ storageKey: derivative.storageKey });

  const body = stored.bytes.buffer.slice(stored.bytes.byteOffset, stored.bytes.byteOffset + stored.bytes.byteLength) as ArrayBuffer;

  return new NextResponse(body, {
    headers: {
      "Cache-Control": "private, max-age=300",
      "Content-Type": derivative.mimeType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
