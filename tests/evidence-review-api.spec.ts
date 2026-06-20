import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, DocumentStatus, EvidenceStatus, ObjectType, PrismaClient, VisibilityStatus } from "@prisma/client";
import { expect, test, type APIRequestContext } from "@playwright/test";

async function uploadProofDocument(request: APIRequestContext, fileName: string) {
  const response = await request.post("/api/documents/upload", {
    multipart: {
      documentType: "financial_statement",
      file: {
        buffer: Buffer.from("%PDF-1.4\nAlphaVest phase 3 evidence review proof\n%%EOF"),
        mimeType: "application/pdf",
        name: fileName,
      },
      linkedObjectLabel: "Morgan Family Office",
      notes: "Phase 3 evidence review proof upload",
      periodLabel: "Jun 2026",
      roleKey: "family_cfo",
      sensitivity: "CONFIDENTIAL",
      subType: "Monthly Statement",
      tenantSlug: "morgan",
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

  return body.result as {
    document: { id: string; fileName: string };
    evidenceRecordId: string;
  };
}

test.describe("Phase 3 evidence review and sufficiency API", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for evidence review API tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("keeps analyst review/link separate from evidence sufficiency and client release", async ({ request }) => {
    const upload = await uploadProofDocument(request, "phase3-link-only-review-proof.pdf");
    const response = await request.post("/api/documents/review", {
      data: {
        action: "mark_reviewed",
        documentId: upload.document.id,
        notes: "Analyst completed extraction review, but compliance acceptance is still required.",
        roleKey: "analyst",
        tenantSlug: "morgan",
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.safety).toEqual({
      clientVisible: false,
      evidenceSufficiency: false,
      exportUnlocked: false,
      gateSupport: false,
      noClientRelease: true,
      releaseUnlocked: false,
      uploadOnly: false,
    });
    expect(body.result.documentStatus).toBe(DocumentStatus.VERIFIED);
    expect(body.result.evidenceStatus).toBe(EvidenceStatus.LINKED);

    const evidence = await prisma.evidenceRecord.findUniqueOrThrow({
      where: { id: upload.evidenceRecordId },
    });
    const document = await prisma.document.findUniqueOrThrow({
      where: { id: upload.document.id },
    });

    expect(document.status).toBe(DocumentStatus.VERIFIED);
    expect(document.clientVisible).toBe(false);
    expect(evidence.status).toBe(EvidenceStatus.LINKED);
    expect(evidence.visibilityStatus).toBe(VisibilityStatus.INTERNAL_ONLY);
  });

  test("lets compliance accept reviewed scoped evidence without releasing client visibility", async ({ request }) => {
    const upload = await uploadProofDocument(request, "phase3-compliance-sufficiency-proof.pdf");
    const response = await request.post("/api/documents/review", {
      data: {
        action: "accept_sufficiency",
        clientSafeAccepted: true,
        currentAccepted: true,
        documentId: upload.document.id,
        notes: "Compliance accepted current, scoped, relevant and client-safe evidence for this gate.",
        relevanceAccepted: true,
        roleKey: "compliance_officer",
        scopeAccepted: true,
        tenantSlug: "morgan",
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.safety.evidenceSufficiency).toBe(true);
    expect(body.safety.noClientRelease).toBe(true);
    expect(body.safety.releaseUnlocked).toBe(false);
    expect(body.result.sufficiencyDecision).toMatchObject({
      exportImpact: "EXPORT_ALLOWED_FOR_SCOPED_GATE",
      label: "EVIDENCE_SUFFICIENT",
      missing: [],
      releaseImpact: "RELEASE_ALLOWED_FOR_SCOPED_GATE",
      sufficient: true,
    });

    const document = await prisma.document.findUniqueOrThrow({
      where: { id: upload.document.id },
    });
    const evidence = await prisma.evidenceRecord.findUniqueOrThrow({
      include: { items: true },
      where: { id: upload.evidenceRecordId },
    });
    const audit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: body.result.auditEventId },
    });
    const link = await prisma.documentLink.findUniqueOrThrow({
      where: { id: body.result.documentLinkId },
    });

    expect(document.status).toBe(DocumentStatus.LINKED_TO_EVIDENCE);
    expect(document.clientVisible).toBe(false);
    expect(evidence.status).toBe(EvidenceStatus.VALIDATED);
    expect(evidence.visibilityStatus).toBe(VisibilityStatus.REDACTED);
    expect(evidence.items.some((item) => item.itemType === "evidence_sufficiency_review")).toBe(true);
    expect(link.targetType).toBe(ObjectType.EVIDENCE_RECORD);
    expect(audit.eventType).toBe("document.evidence_sufficiency.accepted");
    expect(audit.result).toBe(AuditResult.SUCCESS);
    expect(audit.targetType).toBe(ObjectType.EVIDENCE_RECORD);
  });

  test("denies analyst evidence sufficiency acceptance and leaves upload-created evidence insufficient", async ({ request }) => {
    const upload = await uploadProofDocument(request, "phase3-analyst-denied-sufficiency-proof.pdf");
    const response = await request.post("/api/documents/review", {
      data: {
        action: "accept_sufficiency",
        clientSafeAccepted: true,
        currentAccepted: true,
        documentId: upload.document.id,
        notes: "Analyst should not be able to force sufficiency.",
        relevanceAccepted: true,
        roleKey: "analyst",
        scopeAccepted: true,
        tenantSlug: "morgan",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.auditEventId).toBeTruthy();

    const evidence = await prisma.evidenceRecord.findUniqueOrThrow({
      where: { id: upload.evidenceRecordId },
    });
    const document = await prisma.document.findUniqueOrThrow({
      where: { id: upload.document.id },
    });
    const audit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: body.auditEventId },
    });

    expect(document.status).toBe(DocumentStatus.UPLOADED);
    expect(document.clientVisible).toBe(false);
    expect(evidence.status).toBe(EvidenceStatus.CREATED);
    expect(audit.eventType).toBe("document.evidence_review.denied");
    expect(audit.result).toBe(AuditResult.DENIED);
  });
});
