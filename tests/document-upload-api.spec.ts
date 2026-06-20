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

    const exportCountAfter = await prisma.exportRequest.count({
      where: { clientTenantId: morganSession.tenant.id },
    });

    expect(exportCountAfter).toBe(exportCountBefore);

    const reload = await request.get("/api/documents?tenantSlug=morgan");
    const reloadBody = await reload.json();
    const reloadedDocument = reloadBody.documents.find((item: { id: string }) => item.id === document.id);

    expect(reloadedDocument?.fileName).toBe(fileName);
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
    expect(documentCount).toBe(0);
    expect(audit.result).toBe(AuditResult.DENIED);
    expect(audit.eventType).toBe("document.upload.denied");
  });
});
