import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AuditResult,
  EvidenceStatus,
  ObjectType,
  PrismaClient,
} from "@prisma/client";
import { expect, test, type APIRequestContext } from "@playwright/test";

import { createActorSession } from "../lib/actor-session";
import { authJwtCookieName } from "../lib/auth/auth-jwt";
import { scfCriticalGateAuditContract } from "../lib/audit-service";

async function authHeaders(
  request: APIRequestContext,
  email = "cfo.morgan@example.demo",
  scope: { roleKey?: string; tenantSlug?: string } = {},
) {
  const password = email.split("@")[0] ?? "";
  const startResponse = await request.post("/api/auth/provider-login", {
    data: { email, password, providerId: "db-user-jwt", ...scope },
  });
  const startBody = await startResponse.json();

  expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);

  const mfaResponse = await request.post("/api/auth/mfa/verify", {
    data: { code: "123456", email, providerId: "db-user-jwt", ...scope },
  });
  const mfaBody = await mfaResponse.json();

  expect(mfaResponse.ok(), JSON.stringify(mfaBody)).toBe(true);
  expect(mfaBody.jwt).toBeTruthy();

  return { cookie: `${authJwtCookieName}=${mfaBody.jwt as string}` };
}

test.describe("document upload multipart API", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for document upload API tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("stores multipart document bytes, domain rows, extraction, evidence and audit", async ({ request }) => {
    const fileName = "scf-p04-upload-proof.pdf";
    const morganSession = createActorSession({ roleKey: "family_cfo", tenantSlug: "morgan" });
    const targetEntity = await prisma.entity.findFirstOrThrow({
      where: { clientTenantId: morganSession.tenant.id },
    });
    const exportCountBefore = await prisma.exportRequest.count({
      where: { clientTenantId: morganSession.tenant.id },
    });
    const response = await request.post("/api/documents/upload", {
      headers: await authHeaders(request, "cfo.morgan@example.demo"),
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nAlphaVest upload proof\n%%EOF"),
          mimeType: "application/pdf",
          name: fileName,
        },
        linkedObjectLabel: "Morgan Family Office",
        notes: "API proof upload",
        periodLabel: "Jun 2026",
        sensitivity: "CONFIDENTIAL",
        subType: "Monthly Statement",
        targetObjectId: targetEntity.id,
        targetObjectType: "ENTITY",
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.result.document.fileName).toBe(fileName);
    expect(body.result.document.evidenceRequestState).toBe("requested_upload_received");
    expect(body.result.document.targetObjectId).toBe(targetEntity.id);
    expect(body.result.document.targetObjectType).toBe("ENTITY");
    expect(body.result.versionId).toBeTruthy();
    expect(body.result.extractionId).toBeTruthy();
    expect(body.result.evidenceRecordId).toBeTruthy();
    expect(body.result.auditEventId).toBeTruthy();
    expect(body.result.document.latestVersionNumber).toBe(1);
    expect(body.result.document.versionCount).toBe(1);
    expect(body.result.document.securityScanLabel).toBe("Security scan complete");
    expect(body.result.document.securityScanStatus).toBe("PASSED");
    expect(body.result).not.toHaveProperty("auditEvidenceItemId");
    expect(body.result).not.toHaveProperty("documentEvidenceItemId");
    expect(body.result).not.toHaveProperty("evidenceRequestItemId");
    expect(body.result).not.toHaveProperty("storageKey");
    expect(body.result.document).not.toHaveProperty("checksum");
    expect(body.result.document).not.toHaveProperty("storageKey");
    expect(body.safety).toEqual({
      authority: "db-user-jwt",
      clientVisible: false,
      evidenceLifecycleStatus: "extraction_pending",
      evidenceRequestState: "requested_upload_received",
      evidenceStatus: "REVIEW_PENDING",
      releaseUnlocked: false,
      roleKey: "family_cfo",
      securityScanStatus: "PASSED",
      sufficiency: false,
      tenantSlug: "morgan",
      uploadStateLabel: "Upload complete - evidence review pending",
      uploadOnly: true,
    });
    expect(body.result.document.evidenceLifecycleStatus).toBe("extraction_pending");

    const document = await prisma.document.findUniqueOrThrow({
      include: {
        extractions: true,
        versions: true,
      },
      where: { id: body.result.document.id },
    });
    const evidenceRecord = await prisma.evidenceRecord.findUniqueOrThrow({
      include: { items: true },
      where: { id: body.result.evidenceRecordId },
    });
    const audit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: body.result.auditEventId },
    });

    expect(document.fileName).toBe(fileName);
    expect(document.fileSizeBytes).toBeGreaterThan(0);
    expect(document.storageKey).toContain("tenants/morgan/documents/");
    expect(document.versions).toHaveLength(1);
    expect(document.versions[0]?.documentId).toBe(document.id);
    expect(document.versions[0]?.checksum).toHaveLength(64);
    expect(document.versions[0]?.versionNumber).toBe(1);
    expect(document.extractions[0]?.extractionStatus).toBe("pending");
    expect(evidenceRecord.relatedObjectId).toBe(targetEntity.id);
    expect(evidenceRecord.relatedObjectType).toBe(ObjectType.ENTITY);
    expect(evidenceRecord.status).toBe(EvidenceStatus.CREATED);
    expect(evidenceRecord.visibilityStatus).toBe("INTERNAL_ONLY");
    expect(document.clientVisible).toBe(false);
    expect(document.status).toBe("UPLOADED");
    expect(evidenceRecord.items.map((item) => item.itemType).sort()).toEqual([
      "audit_event",
      "document",
      "evidence_request",
      "security_scan",
    ]);
    await expect(
      prisma.documentLink.findFirstOrThrow({
        where: {
          documentId: document.id,
          targetId: targetEntity.id,
          targetType: ObjectType.ENTITY,
        },
      }),
    ).resolves.toBeTruthy();
    expect(audit.result).toBe(AuditResult.SUCCESS);
    expect(audit.targetType).toBe(ObjectType.DOCUMENT);
    expect(audit.targetId).toBe(document.id);
    expect(audit.eventType).toBe("document.upload.created");
    expect(audit.nextState).toBe("UPLOADED");
    expect((audit.metadataJson as { auditContract?: string; criticalActionFamily?: string } | null)?.auditContract).toBe(
      scfCriticalGateAuditContract,
    );
    expect((audit.metadataJson as { auditContract?: string; criticalActionFamily?: string } | null)?.criticalActionFamily).toBe(
      "upload",
    );
    expect((audit.metadataJson as { securityScan?: { issueCount?: number; status?: string } } | null)?.securityScan).toMatchObject({
      issueCount: 0,
      status: "PASSED",
    });
    expect(JSON.stringify(audit.metadataJson)).not.toContain("absoluteDemoPath");
    expect(JSON.stringify(audit.metadataJson)).not.toContain("demoMode");
    expect(JSON.stringify(audit.metadataJson)).not.toContain("noRealAuth");
    expect(JSON.stringify(audit.metadataJson)).not.toContain("storageKey");
    expect(document.versions[0]?.changeReason).toBe("SCF-P04 real multipart upload.");
    expect(document.extractions[0]?.modelVersion).toBe("scf-p04-extraction-queue");
    expect(JSON.stringify(document.extractions[0]?.lowConfidenceFieldsJson)).toContain("securityScan");
    expect(JSON.stringify(document.extractions[0]?.lowConfidenceFieldsJson)).not.toContain("demo");
    expect(evidenceRecord.summary).toContain("controlled object storage");
    expect(evidenceRecord.summary).not.toContain("stored locally");

    const exportCountAfter = await prisma.exportRequest.count({
      where: { clientTenantId: morganSession.tenant.id },
    });

    expect(exportCountAfter).toBe(exportCountBefore);

    const morganCfoHeaders = await authHeaders(request, "cfo.morgan@example.demo");
    const morganPrincipalHeaders = await authHeaders(request, "principal.morgan@example.demo");
    const reload = await request.get("/api/documents?tenantSlug=summit&roleKey=admin", { headers: morganCfoHeaders });
    const reloadBody = await reload.json();
    const reloadedDocument = reloadBody.documents.find((item: { id: string }) => item.id === document.id);

    expect(reload.ok(), JSON.stringify(reloadBody)).toBe(true);
    expect(reloadBody.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
    expect(reloadedDocument?.fileName).toBe(fileName);
    expect(reloadedDocument?.latestVersionNumber).toBe(1);
    expect(reloadedDocument?.versionCount).toBe(1);
    expect(reloadedDocument?.securityScanStatus).toBe("PASSED");
    expect(reloadedDocument).not.toHaveProperty("storageKey");
    expect(reloadedDocument).not.toHaveProperty("latestVersionChecksum");
    expect(JSON.stringify(reloadBody)).not.toContain("tenants/morgan/documents/");
    expect(JSON.stringify(reloadBody)).not.toContain("document-object-storage");

    const uploaderClientReload = await request.get("/api/documents", { headers: morganCfoHeaders });
    const uploaderClientReloadBody = await uploaderClientReload.json();
    const uploaderClientDocument = uploaderClientReloadBody.documents.find((item: { id?: string }) => item.id === document.id);

    expect(uploaderClientReload.ok(), JSON.stringify(uploaderClientReloadBody)).toBe(true);
    expect(uploaderClientDocument?.visible).toBe(true);
    expect(uploaderClientDocument?.reasonCode).toBe("DEMO_CLIENT_SOURCE_DOCUMENT_PROJECTION");
    expect(uploaderClientDocument?.fileName).toBe(fileName);
    expect(uploaderClientDocument?.latestVersionNumber).toBe(1);
    expect(uploaderClientDocument?.versionCount).toBe(1);
    expect(uploaderClientDocument?.securityScanStatus).toBe("PASSED");
    expect(uploaderClientDocument).not.toHaveProperty("evidenceStatus");
    expect(uploaderClientDocument).not.toHaveProperty("evidenceVisibilityStatus");
    expect(uploaderClientDocument).not.toHaveProperty("sensitivity");
    expect(uploaderClientDocument).not.toHaveProperty("storageKey");
    expect(uploaderClientDocument).not.toHaveProperty("checksum");
    expect(uploaderClientDocument).not.toHaveProperty("latestVersionChecksum");

    const blockedClientReload = await request.get("/api/documents", { headers: morganPrincipalHeaders });
    const blockedClientReloadBody = await blockedClientReload.json();

    expect(blockedClientReload.ok(), JSON.stringify(blockedClientReloadBody)).toBe(true);
    expect(blockedClientReloadBody.documents[0]?.visible).toBe(false);
    expect(blockedClientReloadBody.documents[0]?.visibilityState).toBe("NO_AVAILABLE_CONTENT");
    expect(blockedClientReloadBody.documents[0]?.reasonCode).toBe("DEMO_CLIENT_DOCUMENT_FAIL_CLOSED");
    expect(blockedClientReloadBody.documents[0]).not.toHaveProperty("storageKey");
    expect(blockedClientReloadBody.documents[0]).not.toHaveProperty("checksum");

    await prisma.document.update({
      data: { clientVisible: true },
      where: { id: document.id },
    });
    await prisma.evidenceRecord.update({
      data: {
        status: EvidenceStatus.RELEASED,
        visibilityStatus: "CLIENT_VISIBLE",
      },
      where: { id: evidenceRecord.id },
    });

    const releasedClientReload = await request.get("/api/documents", { headers: morganPrincipalHeaders });
    const releasedClientReloadBody = await releasedClientReload.json();
    const releasedClientDocument = releasedClientReloadBody.documents.find(
      (item: { id?: string }) => item.id === document.id,
    );

    expect(releasedClientReload.ok(), JSON.stringify(releasedClientReloadBody)).toBe(true);
    expect(releasedClientDocument?.visible).toBe(true);
    expect(releasedClientDocument?.visibilityState).toBe("CLIENT_SAFE");
    expect(releasedClientDocument?.title).toBe(document.title);
    expect(releasedClientDocument?.documentType).toBe(document.documentType);
    expect(releasedClientDocument?.latestVersionNumber).toBe(1);
    expect(releasedClientDocument?.versionCount).toBe(1);
    expect(releasedClientDocument).not.toHaveProperty("storageKey");
    expect(releasedClientDocument).not.toHaveProperty("checksum");
    expect(releasedClientDocument).not.toHaveProperty("latestVersionChecksum");
    expect(releasedClientDocument).not.toHaveProperty("fileName");
  });

  test("generates safe thumbnail and preview derivatives for image uploads", async ({ request }) => {
    const fileName = "source-document-preview-proof.png";
    const morganSession = createActorSession({ roleKey: "family_cfo", tenantSlug: "morgan" });
    const targetEntity = await prisma.entity.findFirstOrThrow({
      where: { clientTenantId: morganSession.tenant.id },
    });
    const pngBytes = execFileSync("magick", ["-size", "16x16", "xc:#d8b45f", "png:-"]);

    const response = await request.post("/api/documents/upload", {
      headers: await authHeaders(request, "cfo.morgan@example.demo"),
      multipart: {
        documentType: "kyc_document",
        file: {
          buffer: pngBytes,
          mimeType: "image/png",
          name: fileName,
        },
        targetObjectId: targetEntity.id,
        targetObjectType: "ENTITY",
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.result.document.fileName).toBe(fileName);
    expect(body.result.document.thumbnailStatus).toBe("READY");
    expect(body.result.document.previewStatus).toBe("READY");
    expect(body.result.document.thumbnailUrl).toMatch(/^\/api\/documents\/derivatives\//);
    expect(body.result.document.previewUrl).toMatch(/^\/api\/documents\/derivatives\//);
    expect(body.result.document).not.toHaveProperty("storageKey");
    expect(body.result.document).not.toHaveProperty("checksum");

    const document = await prisma.document.findUniqueOrThrow({
      include: { derivatives: true },
      where: { id: body.result.document.id },
    });

    expect(document.derivatives).toHaveLength(2);
    expect(document.derivatives.map((derivative) => derivative.kind).sort()).toEqual(["preview", "thumbnail"]);
    expect(document.derivatives.every((derivative) => derivative.status === "READY")).toBe(true);
    expect(document.derivatives.every((derivative) => derivative.storageKey?.includes("/document-derivatives/"))).toBe(true);

    const thumbnailAuditCountBefore = await prisma.auditEvent.count({
      where: {
        eventType: "document.derivative.thumbnail.accessed",
        targetId: document.id,
      },
    });
    const morganCfoHeaders = await authHeaders(request, "cfo.morgan@example.demo");
    const morganPrincipalHeaders = await authHeaders(request, "principal.morgan@example.demo");
    const thumbnailResponse = await request.get(body.result.document.thumbnailUrl, { headers: morganCfoHeaders });

    expect(thumbnailResponse.ok(), await thumbnailResponse.text()).toBe(true);
    expect(thumbnailResponse.headers()["content-type"]).toBe("image/webp");
    const thumbnailAudit = await prisma.auditEvent.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: {
        eventType: "document.derivative.thumbnail.accessed",
        targetId: document.id,
      },
    });

    expect(await prisma.auditEvent.count({
      where: {
        eventType: "document.derivative.thumbnail.accessed",
        targetId: document.id,
      },
    })).toBe(thumbnailAuditCountBefore + 1);
    expect(thumbnailAudit.result).toBe(AuditResult.SUCCESS);
    expect(thumbnailAudit.targetType).toBe(ObjectType.DOCUMENT);
    expect(thumbnailAudit.metadataJson).toMatchObject({
      derivativeKind: "thumbnail",
      noStorageLocationDisclosed: true,
    });
    expect(JSON.stringify(thumbnailAudit.metadataJson)).not.toContain("storageKey");

    const accessAuditCountAfterSuccess = await prisma.auditEvent.count({
      where: {
        eventType: "document.derivative.thumbnail.accessed",
        targetId: document.id,
      },
    });
    const missingAuthThumbnailResponse = await request.get(body.result.document.thumbnailUrl, {
      headers: { cookie: "" },
    });
    const missingAuthThumbnailBody = await missingAuthThumbnailResponse.json();

    expect(missingAuthThumbnailResponse.status(), JSON.stringify(missingAuthThumbnailBody)).toBe(401);
    expect(missingAuthThumbnailBody.ok).toBe(false);
    expect(missingAuthThumbnailBody.reasonCode).toBe("PERMISSION_DENIED");
    expect(missingAuthThumbnailBody.safety).toMatchObject({
      authority: "db-user-jwt",
      failClosed: true,
      hiddenRowsDisclosed: false,
      noStorageLocationDisclosed: true,
      scoped: false,
    });
    expect(JSON.stringify(missingAuthThumbnailBody)).not.toContain("storageKey");
    expect(await prisma.auditEvent.count({
      where: {
        eventType: "document.derivative.thumbnail.accessed",
        targetId: document.id,
      },
    })).toBe(accessAuditCountAfterSuccess);

    const spoofedScopeThumbnailResponse = await request.get(
      `${body.result.document.thumbnailUrl}?tenantSlug=unknown&roleKey=pretend_role`,
      { headers: morganCfoHeaders },
    );

    expect(spoofedScopeThumbnailResponse.ok(), await spoofedScopeThumbnailResponse.text()).toBe(true);
    expect(spoofedScopeThumbnailResponse.headers()["content-type"]).toBe("image/webp");

    const deniedPreviewResponse = await request.get(body.result.document.previewUrl, { headers: morganPrincipalHeaders });
    const deniedPreviewBody = await deniedPreviewResponse.json();

    expect(deniedPreviewResponse.status(), JSON.stringify(deniedPreviewBody)).toBe(403);
    expect(deniedPreviewBody).not.toHaveProperty("storageKey");
    const deniedPreviewAudit = await prisma.auditEvent.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: {
        eventType: "document.derivative.preview.denied",
        targetId: document.id,
      },
    });

    expect(deniedPreviewAudit.result).toBe(AuditResult.DENIED);
    expect(deniedPreviewAudit.targetType).toBe(ObjectType.DOCUMENT);
    expect(deniedPreviewAudit.metadataJson).toMatchObject({
      derivativeKind: "preview",
      noStorageLocationDisclosed: true,
    });
    expect(JSON.stringify(deniedPreviewAudit.metadataJson)).not.toContain("storageKey");

    const clientReload = await request.get("/api/documents", { headers: morganCfoHeaders });
    const clientReloadBody = await clientReload.json();
    const clientDocument = clientReloadBody.documents.find((item: { id?: string }) => item.id === document.id);

    expect(clientDocument?.thumbnailUrl).toMatch(/^\/api\/documents\/derivatives\//);
    expect(clientDocument?.previewUrl).toMatch(/^\/api\/documents\/derivatives\//);
    expect(clientDocument).not.toHaveProperty("storageKey");
    expect(clientDocument).not.toHaveProperty("checksum");
  });

  test("generates content-derived derivatives for text-like non-raster uploads", async ({ request }) => {
    const fileName = "family-office-cap-table.csv";
    const morganSession = createActorSession({ roleKey: "family_cfo", tenantSlug: "morgan" });
    const targetEntity = await prisma.entity.findFirstOrThrow({
      where: { clientTenantId: morganSession.tenant.id },
    });

    const response = await request.post("/api/documents/upload", {
      headers: await authHeaders(request, "cfo.morgan@example.demo"),
      multipart: {
        documentType: "supporting_schedule",
        file: {
          buffer: Buffer.from("holder,share\nMorgan Family Office,100\n"),
          mimeType: "text/csv",
          name: fileName,
        },
        targetObjectId: targetEntity.id,
        targetObjectType: "ENTITY",
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.result.document.fileName).toBe(fileName);
    expect(body.result.document.thumbnailStatus).toBe("READY");
    expect(body.result.document.previewStatus).toBe("READY");
    expect(body.result.document.thumbnailUrl).toMatch(/^\/api\/documents\/derivatives\//);
    expect(body.result.document.previewUrl).toMatch(/^\/api\/documents\/derivatives\//);

    const document = await prisma.document.findUniqueOrThrow({
      include: { derivatives: true },
      where: { id: body.result.document.id },
    });

    expect(document.derivatives).toHaveLength(2);
    expect(document.derivatives.every((derivative) => derivative.status === "READY")).toBe(true);
    expect(document.derivatives.every((derivative) => derivative.mimeType === "image/webp")).toBe(true);
    expect(document.derivatives.every((derivative) => derivative.generationStrategy === "imagemagick_content_preview")).toBe(true);

    const previewResponse = await request.get(body.result.document.previewUrl, {
      headers: await authHeaders(request, "cfo.morgan@example.demo"),
    });

    expect(previewResponse.ok(), await previewResponse.text()).toBe(true);
    expect(previewResponse.headers()["content-type"]).toBe("image/webp");
  });

  test("denies orphan document versions and keeps version proof linked to its document", async ({ request }) => {
    const fileName = "stage3-version-link-proof.pdf";
    const response = await request.post("/api/documents/upload", {
      headers: await authHeaders(request, "cfo.morgan@example.demo"),
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nVersion link proof\n%%EOF"),
          mimeType: "application/pdf",
          name: fileName,
        },
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);

    const document = await prisma.document.findUniqueOrThrow({
      include: { versions: true },
      where: { id: body.result.document.id },
    });

    expect(document.versions).toHaveLength(1);
    expect(document.versions[0]?.documentId).toBe(document.id);
    expect(document.versions[0]?.checksum).toHaveLength(64);

    await expect(
      prisma.documentVersion.create({
        data: {
          checksum: "orphan-checksum",
          createdByUserId: document.uploadedByUserId,
          documentId: "00000000-0000-0000-0000-000000000000",
          storageKey: "demo/orphan/version.pdf",
          versionNumber: 1,
        },
      }),
    ).rejects.toThrow();

    const orphan = await prisma.documentVersion.findFirst({
      where: { storageKey: "demo/orphan/version.pdf" },
    });

    expect(orphan).toBeNull();
  });

  test("fails closed before multipart upload mutation when required audit persistence is unavailable", async ({ request }) => {
    const fileName = "stage6-audit-unavailable-upload.pdf";
    const morganSession = createActorSession({ roleKey: "family_cfo", tenantSlug: "morgan" });
    const documentCountBefore = await prisma.document.count({ where: { fileName } });
    const evidenceCountBefore = await prisma.evidenceRecord.count({
      where: {
        clientTenantId: morganSession.tenant.id,
        title: { contains: "stage6-audit-unavailable-upload" },
      },
    });
    const auditCountBefore = await prisma.auditEvent.count({
      where: { eventType: "document.upload.created" },
    });

    const response = await request.post("/api/documents/upload", {
      headers: await authHeaders(request, "cfo.morgan@example.demo"),
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nAudit unavailable\n%%EOF"),
          mimeType: "application/pdf",
          name: fileName,
        },
        simulateAuditPersistenceFailure: "true",
      },
    });
    const body = await response.json();
    const documentCountAfter = await prisma.document.count({ where: { fileName } });
    const evidenceCountAfter = await prisma.evidenceRecord.count({
      where: {
        clientTenantId: morganSession.tenant.id,
        title: { contains: "stage6-audit-unavailable-upload" },
      },
    });
    const auditCountAfter = await prisma.auditEvent.count({
      where: { eventType: "document.upload.created" },
    });

    expect(response.status(), JSON.stringify(body)).toBe(409);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.reasonCode).toBe("AUDIT_PERSISTENCE_UNAVAILABLE");
    expect(documentCountAfter).toBe(documentCountBefore);
    expect(evidenceCountAfter).toBe(evidenceCountBefore);
    expect(auditCountAfter).toBe(auditCountBefore);
  });

  test("reloads uploaded documents only for the active tenant", async ({ request }) => {
    const fileName = "scf-p04-summit-tenant-upload-proof.pdf";
    const summitSession = createActorSession({ roleKey: "family_cfo", tenantSlug: "summit" });
    const exportCountBefore = await prisma.exportRequest.count({
      where: { clientTenantId: summitSession.tenant.id },
    });
    const response = await request.post("/api/documents/upload", {
      headers: await authHeaders(request, "cfo.summit@example.demo"),
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nSummit tenant reload proof\n%%EOF"),
          mimeType: "application/pdf",
          name: fileName,
        },
        linkedObjectLabel: "Summit Ridge Capital",
        notes: "Tenant isolation API proof upload",
        periodLabel: "Jun 2026",
        sensitivity: "CONFIDENTIAL",
        subType: "Monthly Statement",
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.safety).toEqual({
      authority: "db-user-jwt",
      clientVisible: false,
      evidenceLifecycleStatus: "extraction_pending",
      evidenceRequestState: "requested_upload_received",
      evidenceStatus: "REVIEW_PENDING",
      releaseUnlocked: false,
      roleKey: "family_cfo",
      securityScanStatus: "PASSED",
      sufficiency: false,
      tenantSlug: "summit",
      uploadStateLabel: "Upload complete - evidence review pending",
      uploadOnly: true,
    });
    expect(body.result.document.evidenceLifecycleStatus).toBe("extraction_pending");

    const document = await prisma.document.findUniqueOrThrow({
      where: { id: body.result.document.id },
    });
    const evidenceRecord = await prisma.evidenceRecord.findUniqueOrThrow({
      where: { id: body.result.evidenceRecordId },
    });

    expect(document.clientTenantId).toBe(summitSession.tenant.id);
    expect(document.clientVisible).toBe(false);
    expect(document.storageKey).toContain("tenants/summit/documents/");
    expect(evidenceRecord.status).toBe(EvidenceStatus.CREATED);
    expect(evidenceRecord.relatedObjectId).toBe(document.id);
    expect(evidenceRecord.visibilityStatus).toBe("INTERNAL_ONLY");

    const summitReload = await request.get("/api/documents?tenantSlug=morgan&roleKey=analyst", {
      headers: await authHeaders(request, "cfo.summit@example.demo"),
    });
    const summitReloadBody = await summitReload.json();
    const summitDocument = summitReloadBody.documents.find((item: { id: string }) => item.id === document.id);

    expect(summitReload.ok(), JSON.stringify(summitReloadBody)).toBe(true);
    expect(summitReloadBody.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "summit",
    });
    expect(summitDocument?.fileName).toBe(fileName);

    const morganReload = await request.get("/api/documents", {
      headers: await authHeaders(request, "cfo.morgan@example.demo"),
    });
    const morganReloadBody = await morganReload.json();
    const leakedDocument = morganReloadBody.documents.find((item: { id: string }) => item.id === document.id);
    const exportCountAfter = await prisma.exportRequest.count({
      where: { clientTenantId: summitSession.tenant.id },
    });

    expect(morganReload.ok(), JSON.stringify(morganReloadBody)).toBe(true);
    expect(leakedDocument).toBeUndefined();
    expect(exportCountAfter).toBe(exportCountBefore);
  });

  test("requires DB-user JWT for document queries without falling back to URL scope", async ({ request }) => {
    const response = await request.get("/api/documents?tenantSlug=unknown&roleKey=analyst");
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.documents).toEqual([]);
    expect(body.reasonCode).toBe("PERMISSION_DENIED");
    expect(body.safety).toMatchObject({
      authority: "db-user-jwt",
      failClosed: true,
      hiddenRowsDisclosed: false,
      scoped: false,
      silentStateAdvance: false,
    });
  });

  test("ignores spoofed document query scope and derives role from JWT", async ({ request }) => {
    const headers = await authHeaders(request, "cfo.bennett@example.demo");
    const response = await request.get("/api/documents?tenantSlug=morgan&roleKey=pretend_role&source=all", { headers });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "bennett",
    });
    expect(JSON.stringify(body)).toContain("Bennett");
    expect(JSON.stringify(body)).not.toContain("Morgan");
  });

  test("requires DB-user JWT for upload requests without falling back to multipart scope", async ({ request }) => {
    const fileName = "missing-upload-jwt.pdf";
    const before = await prisma.document.count({ where: { fileName } });
    const response = await request.post("/api/documents/upload", {
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nInvalid metadata\n%%EOF"),
          mimeType: "application/pdf",
          name: fileName,
        },
        roleKey: "family_cfo",
        tenantSlug: "morgan",
      },
    });
    const body = await response.json();
    const after = await prisma.document.count({ where: { fileName } });

    expect(response.status(), JSON.stringify(body)).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.reasonCode).toBe("PERMISSION_DENIED");
    expect(body.safety).toMatchObject({
      authority: "db-user-jwt",
      failClosed: true,
      scoped: false,
    });
    expect(after).toBe(before);
  });

  test("ignores spoofed multipart upload scope and stores under the JWT tenant", async ({ request }) => {
    const fileName = "upload-scope-spoof-ignored.pdf";
    const response = await request.post("/api/documents/upload", {
      headers: await authHeaders(request, "cfo.morgan@example.demo"),
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nSpoof ignored\n%%EOF"),
          mimeType: "application/pdf",
          name: fileName,
        },
        roleKey: "admin",
        tenantSlug: "summit",
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });

    const document = await prisma.document.findUniqueOrThrow({
      where: { id: body.result.document.id },
    });

    expect(document.storageKey).toContain("tenants/morgan/documents/");
    expect(document.storageKey).not.toContain("tenants/summit/documents/");
  });

  test("rejects unsupported file types without creating a document row", async ({ request }) => {
    const fileName = "blocked-upload.exe";
    const before = await prisma.document.count({ where: { fileName } });
    const response = await request.post("/api/documents/upload", {
      headers: await authHeaders(request, "cfo.morgan@example.demo"),
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("not a document"),
          mimeType: "application/x-msdownload",
          name: fileName,
        },
      },
    });
    const body = await response.json();
    const after = await prisma.document.count({ where: { fileName } });

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.issues).toContain("supported_file_type_required");
    expect(after).toBe(before);
  });

  test("blocks supported uploads with unsafe payload signatures before storage or document mutation", async ({ request }) => {
    const fileName = "blocked-security-scan.pdf";
    const morganSession = createActorSession({ roleKey: "family_cfo", tenantSlug: "morgan" });
    const documentCountBefore = await prisma.document.count({ where: { fileName } });
    const evidenceCountBefore = await prisma.evidenceRecord.count({
      where: {
        clientTenantId: morganSession.tenant.id,
        title: { contains: "blocked-security-scan" },
      },
    });

    const response = await request.post("/api/documents/upload", {
      headers: await authHeaders(request, "cfo.morgan@example.demo"),
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from(
            "%PDF-1.4\nX5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*\n%%EOF",
          ),
          mimeType: "application/pdf",
          name: fileName,
        },
      },
    });
    const body = await response.json();
    const documentCountAfter = await prisma.document.count({ where: { fileName } });
    const evidenceCountAfter = await prisma.evidenceRecord.count({
      where: {
        clientTenantId: morganSession.tenant.id,
        title: { contains: "blocked-security-scan" },
      },
    });
    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: body.auditEventId } });

    expect(response.status(), JSON.stringify(body)).toBe(422);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.reasonCode).toBe("UPLOAD_SECURITY_SCAN_BLOCKED");
    expect(body.issues).toEqual(["malware_signature_detected"]);
    expect(body.safety).toMatchObject({
      failClosed: true,
      securityScanStatus: "BLOCKED",
      silentStateAdvance: false,
    });
    expect(documentCountAfter).toBe(documentCountBefore);
    expect(evidenceCountAfter).toBe(evidenceCountBefore);
    expect(audit.eventType).toBe("document.upload.security_scan_blocked");
    expect(audit.result).toBe(AuditResult.DENIED);
    expect(audit.targetType).toBe(ObjectType.DOCUMENT);
    expect((audit.metadataJson as { securityScan?: { issueCount?: number; status?: string } } | null)?.securityScan).toMatchObject({
      issueCount: 1,
      status: "BLOCKED",
    });
    expect(JSON.stringify(audit.metadataJson)).not.toContain("storageKey");
    expect(JSON.stringify(audit.metadataJson)).not.toContain("tenants/morgan/documents/");
  });

  test("rejects missing document type without creating evidence or release state", async ({ request }) => {
    const fileName = "missing-document-type-proof.pdf";
    const morganSession = createActorSession({ roleKey: "family_cfo", tenantSlug: "morgan" });
    const documentCountBefore = await prisma.document.count({ where: { fileName } });
    const evidenceCountBefore = await prisma.evidenceRecord.count({
      where: {
        clientTenantId: morganSession.tenant.id,
        title: { contains: "missing-document-type-proof" },
      },
    });
    const exportCountBefore = await prisma.exportRequest.count({
      where: { clientTenantId: morganSession.tenant.id },
    });

    const response = await request.post("/api/documents/upload", {
      headers: await authHeaders(request, "cfo.morgan@example.demo"),
      multipart: {
        file: {
          buffer: Buffer.from("%PDF-1.4\nMissing document type\n%%EOF"),
          mimeType: "application/pdf",
          name: fileName,
        },
      },
    });
    const body = await response.json();
    const documentCountAfter = await prisma.document.count({ where: { fileName } });
    const evidenceCountAfter = await prisma.evidenceRecord.count({
      where: {
        clientTenantId: morganSession.tenant.id,
        title: { contains: "missing-document-type-proof" },
      },
    });
    const exportCountAfter = await prisma.exportRequest.count({
      where: { clientTenantId: morganSession.tenant.id },
    });

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.issues).toContain("document_type_required");
    expect(documentCountAfter).toBe(documentCountBefore);
    expect(evidenceCountAfter).toBe(evidenceCountBefore);
    expect(exportCountAfter).toBe(exportCountBefore);
  });

  test("denies roles outside the document upload workspace policy and audits the denial", async ({ request }) => {
    const fileName = "denied-next-gen-upload.pdf";
    const response = await request.post("/api/documents/upload", {
      headers: await authHeaders(request, "nextgen.morgan@example.demo"),
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nDenied\n%%EOF"),
          mimeType: "application/pdf",
          name: fileName,
        },
      },
    });
    const body = await response.json();
    const documentCount = await prisma.document.count({ where: { fileName } });
    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: body.auditEventId } });

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(documentCount).toBe(0);
    expect(audit.result).toBe(AuditResult.DENIED);
    expect(audit.eventType).toBe("document.upload.denied");
    expect(JSON.stringify(audit.metadataJson)).not.toContain("demoMode");
    expect(JSON.stringify(audit.metadataJson)).not.toContain("noRealAuth");
    expect(JSON.stringify(audit.metadataJson)).not.toContain("storageKey");
  });
});
