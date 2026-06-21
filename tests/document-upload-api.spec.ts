import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AuditResult,
  EvidenceStatus,
  ObjectType,
  PrismaClient,
} from "@prisma/client";
import { expect, test } from "@playwright/test";

import { createDemoSession } from "../lib/demo-session";

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
    const fileName = "phase-p1-upload-proof.pdf";
    const morganSession = createDemoSession({ roleKey: "family_cfo", tenantSlug: "morgan" });
    const exportCountBefore = await prisma.exportRequest.count({
      where: { clientTenantId: morganSession.tenant.id },
    });
    const response = await request.post("/api/documents/upload", {
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
        roleKey: "family_cfo",
        sensitivity: "CONFIDENTIAL",
        subType: "Monthly Statement",
        tenantSlug: "morgan",
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.result.document.fileName).toBe(fileName);
    expect(body.result.versionId).toBeTruthy();
    expect(body.result.extractionId).toBeTruthy();
    expect(body.result.evidenceRecordId).toBeTruthy();
    expect(body.result.auditEventId).toBeTruthy();
    expect(body.safety).toEqual({
      clientVisible: false,
      evidenceStatus: "REVIEW_PENDING",
      releaseUnlocked: false,
      sufficiency: false,
      uploadOnly: true,
    });

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
    expect(document.storageKey).toContain("demo/morgan/documents/");
    expect(document.versions).toHaveLength(1);
    expect(document.extractions[0]?.extractionStatus).toBe("pending");
    expect(evidenceRecord.relatedObjectId).toBe(document.id);
    expect(evidenceRecord.status).toBe(EvidenceStatus.CREATED);
    expect(evidenceRecord.visibilityStatus).toBe("INTERNAL_ONLY");
    expect(document.clientVisible).toBe(false);
    expect(document.status).toBe("UPLOADED");
    expect(evidenceRecord.items.map((item) => item.itemType).sort()).toEqual(["audit_event", "document"]);
    expect(audit.result).toBe(AuditResult.SUCCESS);
    expect(audit.targetType).toBe(ObjectType.DOCUMENT);
    expect(audit.targetId).toBe(document.id);
    expect(audit.eventType).toBe("document.upload.created");
    expect(audit.nextState).toBe("UPLOADED");
    expect((audit.metadataJson as { auditContract?: string; criticalActionFamily?: string } | null)?.auditContract).toBe(
      "FIRST_BUILD_PHASE_6_BP09",
    );
    expect((audit.metadataJson as { auditContract?: string; criticalActionFamily?: string } | null)?.criticalActionFamily).toBe(
      "upload",
    );

    const exportCountAfter = await prisma.exportRequest.count({
      where: { clientTenantId: morganSession.tenant.id },
    });

    expect(exportCountAfter).toBe(exportCountBefore);

    const reload = await request.get("/api/documents?tenantSlug=morgan&roleKey=analyst");
    const reloadBody = await reload.json();
    const reloadedDocument = reloadBody.documents.find((item: { id: string }) => item.id === document.id);

    expect(reloadedDocument?.fileName).toBe(fileName);

    const uploaderClientReload = await request.get("/api/documents?tenantSlug=morgan&roleKey=family_cfo");
    const uploaderClientReloadBody = await uploaderClientReload.json();
    const uploaderClientDocument = uploaderClientReloadBody.documents.find((item: { id?: string }) => item.id === document.id);

    expect(uploaderClientReload.ok(), JSON.stringify(uploaderClientReloadBody)).toBe(true);
    expect(uploaderClientDocument?.visible).toBe(true);
    expect(uploaderClientDocument?.reasonCode).toBe("DEMO_CLIENT_SOURCE_DOCUMENT_PROJECTION");
    expect(uploaderClientDocument?.fileName).toBe(fileName);
    expect(uploaderClientDocument).not.toHaveProperty("evidenceStatus");
    expect(uploaderClientDocument).not.toHaveProperty("evidenceVisibilityStatus");
    expect(uploaderClientDocument).not.toHaveProperty("storageKey");
    expect(uploaderClientDocument).not.toHaveProperty("checksum");

    const blockedClientReload = await request.get("/api/documents?tenantSlug=morgan&roleKey=principal");
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

    const releasedClientReload = await request.get("/api/documents?tenantSlug=morgan&roleKey=principal");
    const releasedClientReloadBody = await releasedClientReload.json();
    const releasedClientDocument = releasedClientReloadBody.documents.find(
      (item: { id?: string }) => item.id === document.id,
    );

    expect(releasedClientReload.ok(), JSON.stringify(releasedClientReloadBody)).toBe(true);
    expect(releasedClientDocument?.visible).toBe(true);
    expect(releasedClientDocument?.visibilityState).toBe("CLIENT_SAFE");
    expect(releasedClientDocument?.title).toBe(document.title);
    expect(releasedClientDocument?.documentType).toBe(document.documentType);
    expect(releasedClientDocument).not.toHaveProperty("storageKey");
    expect(releasedClientDocument).not.toHaveProperty("checksum");
    expect(releasedClientDocument).not.toHaveProperty("fileName");
  });

  test("fails closed before multipart upload mutation when required audit persistence is unavailable", async ({ request }) => {
    const fileName = "phase6-audit-unavailable-upload.pdf";
    const morganSession = createDemoSession({ roleKey: "family_cfo", tenantSlug: "morgan" });
    const documentCountBefore = await prisma.document.count({ where: { fileName } });
    const evidenceCountBefore = await prisma.evidenceRecord.count({
      where: {
        clientTenantId: morganSession.tenant.id,
        title: { contains: "phase6-audit-unavailable-upload" },
      },
    });
    const auditCountBefore = await prisma.auditEvent.count({
      where: { eventType: "document.upload.created" },
    });

    const response = await request.post("/api/documents/upload", {
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nAudit unavailable\n%%EOF"),
          mimeType: "application/pdf",
          name: fileName,
        },
        roleKey: "family_cfo",
        simulateAuditPersistenceFailure: "true",
        tenantSlug: "morgan",
      },
    });
    const body = await response.json();
    const documentCountAfter = await prisma.document.count({ where: { fileName } });
    const evidenceCountAfter = await prisma.evidenceRecord.count({
      where: {
        clientTenantId: morganSession.tenant.id,
        title: { contains: "phase6-audit-unavailable-upload" },
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
    const fileName = "phase-p1-summit-tenant-upload-proof.pdf";
    const summitSession = createDemoSession({ roleKey: "family_cfo", tenantSlug: "summit" });
    const exportCountBefore = await prisma.exportRequest.count({
      where: { clientTenantId: summitSession.tenant.id },
    });
    const response = await request.post("/api/documents/upload", {
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
        roleKey: "family_cfo",
        sensitivity: "CONFIDENTIAL",
        subType: "Monthly Statement",
        tenantSlug: "summit",
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.safety).toEqual({
      clientVisible: false,
      evidenceStatus: "REVIEW_PENDING",
      releaseUnlocked: false,
      sufficiency: false,
      uploadOnly: true,
    });

    const document = await prisma.document.findUniqueOrThrow({
      where: { id: body.result.document.id },
    });
    const evidenceRecord = await prisma.evidenceRecord.findUniqueOrThrow({
      where: { id: body.result.evidenceRecordId },
    });

    expect(document.clientTenantId).toBe(summitSession.tenant.id);
    expect(document.clientVisible).toBe(false);
    expect(document.storageKey).toContain("demo/summit/documents/");
    expect(evidenceRecord.status).toBe(EvidenceStatus.CREATED);
    expect(evidenceRecord.relatedObjectId).toBe(document.id);
    expect(evidenceRecord.visibilityStatus).toBe("INTERNAL_ONLY");

    const summitReload = await request.get("/api/documents?tenantSlug=summit&roleKey=analyst");
    const summitReloadBody = await summitReload.json();
    const summitDocument = summitReloadBody.documents.find((item: { id: string }) => item.id === document.id);

    expect(summitReload.ok(), JSON.stringify(summitReloadBody)).toBe(true);
    expect(summitDocument?.fileName).toBe(fileName);

    const morganReload = await request.get("/api/documents?tenantSlug=morgan&roleKey=analyst");
    const morganReloadBody = await morganReload.json();
    const leakedDocument = morganReloadBody.documents.find((item: { id: string }) => item.id === document.id);
    const exportCountAfter = await prisma.exportRequest.count({
      where: { clientTenantId: summitSession.tenant.id },
    });

    expect(morganReload.ok(), JSON.stringify(morganReloadBody)).toBe(true);
    expect(leakedDocument).toBeUndefined();
    expect(exportCountAfter).toBe(exportCountBefore);
  });

  test("rejects invalid document tenant queries without falling back to another tenant", async ({ request }) => {
    const response = await request.get("/api/documents?tenantSlug=unknown&roleKey=analyst");
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.documents).toEqual([]);
    expect(body.issues).toContain("valid_tenant_slug_required");
  });

  test("rejects document queries without an explicit mapped role", async ({ request }) => {
    const missingRole = await request.get("/api/documents?tenantSlug=morgan");
    const missingRoleBody = await missingRole.json();

    expect(missingRole.status(), JSON.stringify(missingRoleBody)).toBe(400);
    expect(missingRoleBody.ok).toBe(false);
    expect(missingRoleBody.documents).toEqual([]);
    expect(missingRoleBody.issues).toEqual(["valid_role_key_required"]);

    const invalidRole = await request.get("/api/documents?tenantSlug=morgan&roleKey=pretend_role");
    const invalidRoleBody = await invalidRole.json();

    expect(invalidRole.status(), JSON.stringify(invalidRoleBody)).toBe(400);
    expect(invalidRoleBody.ok).toBe(false);
    expect(invalidRoleBody.documents).toEqual([]);
    expect(invalidRoleBody.issues).toEqual(["valid_role_key_required"]);
  });

  test("rejects upload requests with invalid role or tenant metadata", async ({ request }) => {
    const response = await request.post("/api/documents/upload", {
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nInvalid metadata\n%%EOF"),
          mimeType: "application/pdf",
          name: "invalid-metadata.pdf",
        },
        roleKey: "pretend_role",
        tenantSlug: "unknown",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.issues).toEqual(["valid_role_key_required", "valid_tenant_slug_required"]);
  });

  test("rejects unsupported file types without creating a document row", async ({ request }) => {
    const fileName = "blocked-upload.exe";
    const before = await prisma.document.count({ where: { fileName } });
    const response = await request.post("/api/documents/upload", {
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("not a document"),
          mimeType: "application/x-msdownload",
          name: fileName,
        },
        roleKey: "family_cfo",
        tenantSlug: "morgan",
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

  test("denies roles outside the document upload demo policy and audits the denial", async ({ request }) => {
    const fileName = "denied-next-gen-upload.pdf";
    const response = await request.post("/api/documents/upload", {
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nDenied\n%%EOF"),
          mimeType: "application/pdf",
          name: fileName,
        },
        roleKey: "next_gen",
        tenantSlug: "morgan",
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
  });
});
