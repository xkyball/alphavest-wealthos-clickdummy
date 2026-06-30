import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, DocumentStatus, EvidenceStatus, ObjectType, PrismaClient, VisibilityStatus } from "@prisma/client";
import { expect, test, type APIRequestContext } from "@playwright/test";

async function uploadProofDocument(request: APIRequestContext, fileName: string) {
  const entityResponse = await request.get("/api/entities?tenantSlug=morgan&roleKey=family_cfo");
  const entityBody = await entityResponse.json();
  const target = entityBody.entities[0] as { id: string; name: string };

  expect(entityResponse.ok(), JSON.stringify(entityBody)).toBe(true);
  expect(target.id).toBeTruthy();

  const response = await request.post("/api/documents/upload", {
    multipart: {
      documentType: "financial_statement",
      file: {
        buffer: Buffer.from("%PDF-1.4\nAlphaVest stage 3 evidence review proof\n%%EOF"),
        mimeType: "application/pdf",
        name: fileName,
      },
      linkedObjectLabel: "Morgan Family Office",
      notes: "Stage 3 evidence review proof upload",
      periodLabel: "Jun 2026",
      roleKey: "family_cfo",
      sensitivity: "CONFIDENTIAL",
      subType: "Monthly Statement",
      targetObjectId: target.id,
      targetObjectType: "ENTITY",
      tenantSlug: "morgan",
    },
  });
  const body = await response.json();

  expect(response.ok(), JSON.stringify(body)).toBe(true);
  expect(body.safety).toEqual({
    clientVisible: false,
    evidenceLifecycleStatus: "extraction_pending",
    evidenceRequestState: "requested_upload_received",
    evidenceStatus: "REVIEW_PENDING",
    releaseUnlocked: false,
    sufficiency: false,
    uploadStateLabel: "Upload complete - evidence review pending",
    uploadOnly: true,
  });

  return body.result as {
    document: { id: string; fileName: string; targetObjectId: string; targetObjectType: string };
    evidenceRecordId: string;
  };
}

test.describe("Stage 3 evidence review and sufficiency API", () => {
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
    const upload = await uploadProofDocument(request, "stage3-link-only-review-proof.pdf");
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
      evidenceLifecycleStatus: "linked",
      evidenceSufficiency: false,
      exportUnlocked: false,
      gateSupport: false,
      noClientRelease: true,
      releaseUnlocked: false,
      uploadOnly: false,
    });
    expect(body.result.documentStatus).toBe(DocumentStatus.VERIFIED);
    expect(body.result.evidenceLifecycleStatus).toBe("linked");
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

  test("marks clarification requests as insufficient without release or export unlock", async ({ request }) => {
    const upload = await uploadProofDocument(request, "stage3-clarification-insufficient-proof.pdf");
    const response = await request.post("/api/documents/review", {
      data: {
        action: "request_clarification",
        documentId: upload.document.id,
        notes: "The uploaded statement lacks the account holder and period scope needed for evidence review.",
        roleKey: "analyst",
        tenantSlug: "morgan",
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.safety).toMatchObject({
      clientVisible: false,
      evidenceLifecycleStatus: "insufficient",
      evidenceSufficiency: false,
      exportUnlocked: false,
      gateSupport: false,
      noClientRelease: true,
      releaseUnlocked: false,
    });
    expect(body.result.documentStatus).toBe(DocumentStatus.NEEDS_CLARIFICATION);
    expect(body.result.evidenceLifecycleStatus).toBe("insufficient");

    const document = await prisma.document.findUniqueOrThrow({
      include: { extractions: true },
      where: { id: upload.document.id },
    });
    const audit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: body.result.auditEventId },
    });

    expect(document.status).toBe(DocumentStatus.NEEDS_CLARIFICATION);
    expect(document.clientVisible).toBe(false);
    expect(document.extractions[0]?.extractionStatus).toBe("needs_clarification");
    expect(audit.eventType).toBe("document.evidence_review.clarification_requested");
    expect(audit.result).toBe(AuditResult.SUCCESS);
  });

  test("fails closed before evidence review mutation when audit persistence is unavailable", async ({ request }) => {
    const upload = await uploadProofDocument(request, "stage3-audit-unavailable-review-proof.pdf");
    const auditCountBefore = await prisma.auditEvent.count({
      where: { eventType: "document.evidence_review.linked" },
    });
    const response = await request.post("/api/documents/review", {
      data: {
        action: "mark_reviewed",
        documentId: upload.document.id,
        notes: "Audit persistence failure should block review state advance.",
        roleKey: "analyst",
        simulateAuditPersistenceFailure: true,
        tenantSlug: "morgan",
      },
    });
    const body = await response.json();
    const auditCountAfter = await prisma.auditEvent.count({
      where: { eventType: "document.evidence_review.linked" },
    });
    const document = await prisma.document.findUniqueOrThrow({
      where: { id: upload.document.id },
    });
    const evidence = await prisma.evidenceRecord.findUniqueOrThrow({
      where: { id: upload.evidenceRecordId },
    });

    expect(response.status(), JSON.stringify(body)).toBe(409);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.reasonCode).toBe("AUDIT_PERSISTENCE_UNAVAILABLE");
    expect(body.auditPersistenceRequired).toBe(true);
    expect(body.safety).toMatchObject({
      failClosed: true,
      silentStateAdvance: false,
    });
    expect(document.status).toBe(DocumentStatus.UPLOADED);
    expect(document.clientVisible).toBe(false);
    expect(evidence.status).toBe(EvidenceStatus.CREATED);
    expect(auditCountAfter).toBe(auditCountBefore);
  });

  test("lets compliance accept reviewed scoped evidence without releasing client visibility", async ({ request }) => {
    const upload = await uploadProofDocument(request, "stage3-compliance-sufficiency-proof.pdf");
    const response = await request.post("/api/documents/review", {
      data: {
        action: "accept_sufficiency",
        clientSafeAccepted: true,
        currentAccepted: true,
        documentId: upload.document.id,
        notes: "Compliance accepted current, scoped, relevant and client-safe evidence for this gate.",
        relevanceAccepted: true,
        requiredObjectId: upload.document.targetObjectId,
        requiredObjectType: upload.document.targetObjectType,
        roleKey: "compliance_officer",
        scopeAccepted: true,
        tenantSlug: "morgan",
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.safety.evidenceSufficiency).toBe(true);
    expect(body.safety.evidenceLifecycleStatus).toBe("sufficient");
    expect(body.safety.noClientRelease).toBe(true);
    expect(body.safety.releaseUnlocked).toBe(false);
    expect(body.result.evidenceLifecycleStatus).toBe("sufficient");
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

    const readModelResponse = await request.get(
      `/api/documents?tenantSlug=morgan&roleKey=compliance_officer&q=${encodeURIComponent(upload.document.fileName)}`,
    );
    const readModelBody = await readModelResponse.json();
    const readModelDocument = readModelBody.documents.find((item: { id?: string }) => item.id === upload.document.id);

    expect(readModelResponse.ok(), JSON.stringify(readModelBody)).toBe(true);
    expect(readModelDocument.latestReviewStatus).toBe("APPROVED");
    expect(readModelDocument.clientSafeSummary).toBe("Document evidence reviewed and accepted for scoped gate support.");
    expect(readModelDocument.targetObjectId).toBe(upload.document.targetObjectId);
    expect(readModelDocument.targetObjectType).toBe(upload.document.targetObjectType);
  });

  test("denies analyst evidence sufficiency acceptance and leaves upload-created evidence insufficient", async ({ request }) => {
    const upload = await uploadProofDocument(request, "stage3-analyst-denied-sufficiency-proof.pdf");
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
    expect(body.safety).toMatchObject({
      failClosed: true,
      silentStateAdvance: false,
    });

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

  test("blocks wrong-scope sufficiency acceptance without mutating document or evidence state", async ({ request }) => {
    const upload = await uploadProofDocument(request, "stage3-wrong-scope-sufficiency-proof.pdf");
    const response = await request.post("/api/documents/review", {
      data: {
        action: "accept_sufficiency",
        clientSafeAccepted: true,
        currentAccepted: true,
        documentId: upload.document.id,
        notes: "Compliance attempted to accept this evidence for a different scoped object.",
        relevanceAccepted: true,
        requiredObjectId: "96705b67-40b2-5fb8-aa69-a3f2c106025e",
        roleKey: "compliance_officer",
        scopeAccepted: true,
        tenantSlug: "morgan",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(409);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.safety).toMatchObject({
      failClosed: true,
      silentStateAdvance: false,
    });
    expect(body.decision.sufficient).toBe(false);
    expect(body.decision.missing).toContain("evidence_object_id_scope");

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
    expect(evidence.visibilityStatus).toBe(VisibilityStatus.INTERNAL_ONLY);
    expect(audit.eventType).toBe("document.evidence_sufficiency.blocked");
    expect(audit.result).toBe(AuditResult.BLOCKED);
  });
});
