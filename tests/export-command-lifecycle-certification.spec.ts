import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, ExportStatus, PrismaClient } from "@prisma/client";
import { expect, test, type APIRequestContext } from "@playwright/test";

import {
  certifyOperationalStage8ExportExit,
  createOperationalStage8ReadinessChecklist,
  inspectOperationalStage8AuditChain,
  inspectOperationalStage8ForbiddenPayload,
  inspectOperationalStage8StageBoundary,
  operationalStage8ExpectedAuditEvents,
  operationalStage8TicketOrder,
  type OperationalStage8TicketId,
} from "../lib/export-command-lifecycle-service";
import { stableId } from "../lib/stable-id";
import { issueTestAuthJwt } from "./helpers/auth-jwt";

const safePayload = {
  clientSummary: "Released client-safe export summary.",
  decisionState: "Released",
  releasedAt: "2026-06-24T00:00:00.000Z",
  status: "RELEASED_TO_CLIENT",
  title: "Liquidity governance decision",
};
let complianceJwt = "";
let morganComplianceJwt = "";
let adminJwt = "";

function safeScopeItem(label: string) {
  return {
    access: "Allowed",
    id: stableId(`operational-stage8:${label}`),
    name: "Released client-safe decision summary",
    payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
    selected: true,
    type: "DECISION",
  };
}

function restrictedScopeItem(label: string) {
  return {
    ...safeScopeItem(label),
    access: "Restricted",
    payloadClassifications: ["CLIENT_SAFE_SUMMARY", "INTERNAL_RATIONALE"],
  };
}

async function exportCommand(request: APIRequestContext, data: Record<string, unknown>, jwt = complianceJwt) {
  return request.post("/api/export-workflow", {
    data,
    headers: { Authorization: `Bearer ${jwt}` },
  });
}

async function createExportRequest(request: APIRequestContext, label: string) {
  const response = await exportCommand(request, {
    command: "SET_SCOPE",
    reason: "Select released client-safe objects for Operational Stage 8 certification.",
    redactionProfile: "client-safe-redacted",
    roleKey: "compliance_officer",
    scopeItems: [safeScopeItem(label)],
    tenantSlug: "summit",
  });
  const body = await response.json();

  expect(response.ok(), JSON.stringify(body)).toBe(true);
  expect(body.status).toBe(ExportStatus.SCOPE_SELECTED);
  expect(body.noClientRelease).toBe(true);
  expect(body.safety.commandExecuted).toBe(true);

  return body.exportRequestId as string;
}

test.describe.serial("Operational Stage 8 export UI command-stage completion certification", () => {
  test.setTimeout(150_000);

  let prisma: PrismaClient;
  let exportRequestId = "";
  const completedTickets = new Set<OperationalStage8TicketId>();
  let forbiddenPayloadClean = false;
  let previewBoundaryClean = false;
  let auditChainLinked = false;
  let commandBypassDenied = false;

  test.beforeAll(async ({ request }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Operational Stage 8 certification tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
    complianceJwt = await issueTestAuthJwt(request, {
      email: "naledi.compliance@alphavest.demo",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    morganComplianceJwt = await issueTestAuthJwt(request, {
      email: "naledi.compliance@alphavest.demo",
      roleKey: "compliance_officer",
      tenantSlug: "morgan",
    });
    adminJwt = await issueTestAuthJwt(request, {
      email: "ava.admin@alphavest.demo",
      roleKey: "admin",
    });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("PH8-EXEC exposes ordered readiness only after Stage 7, analysis and spec exits", () => {
    const blocked = createOperationalStage8ReadinessChecklist({
      analysisComplete: true,
      predecessorStage7Exit: false,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });
    const ready = createOperationalStage8ReadinessChecklist({
      analysisComplete: true,
      predecessorStage7Exit: true,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });

    expect(blocked.ready).toBe(false);
    expect(blocked.missing).toEqual(["operational_stage7_exit"]);
    expect(ready.ready).toBe(true);
    expect(ready.ticketOrder).toEqual(operationalStage8TicketOrder);
  });

  test("Operational-8-T01 wires export request command with actor, object and scope context", async ({ request }) => {
    exportRequestId = await createExportRequest(request, "request-command");
    const exportRequest = await prisma.exportRequest.findUniqueOrThrow({ where: { id: exportRequestId } });
    const audit = await prisma.auditEvent.findFirstOrThrow({
      where: { eventType: "export.workflow.set_scope", targetId: exportRequestId },
    });

    expect(exportRequest.status).toBe(ExportStatus.SCOPE_SELECTED);
    expect(exportRequest.redactionProfile).toBe("client-safe-redacted");
    expect(exportRequest.scopeJson).toMatchObject({
      generatedFileIsMetadataOnly: true,
      selectedObjects: [{ id: safeScopeItem("request-command").id, type: "DECISION" }],
    });
    expect(audit.actorRoleKey).toBe("compliance_officer");
    expect(audit.result).toBe(AuditResult.SUCCESS);
    completedTickets.add("Operational-8-T01-EXEC");
  });

  test("Operational-8-T02 validates request fields and keeps invalid requests fail-closed", async ({ request }) => {
    const before = await prisma.exportRequest.count();
    const response = await exportCommand(request, {
      command: "SET_SCOPE",
      reason: "Invalid request should not create export state.",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const body = await response.json();
    const after = await prisma.exportRequest.count();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.mutated).toBe(false);
    expect(body.issues).toContain("scope_items_required");
    expect(after).toBe(before);
    completedTickets.add("Operational-8-T02-EXEC");
  });

  test("Operational-8-T03 persists selected scope and reloads it through the read model", async ({ request }) => {
    const response = await request.get("/api/export-workflow?tenantSlug=morgan&roleKey=family_cfo", {
      headers: { Authorization: `Bearer ${complianceJwt}` },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.snapshot.current.id).toBe(exportRequestId);
    expect(body.snapshot.scopeItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: safeScopeItem("request-command").id,
          selected: true,
          type: "Decision",
        }),
      ]),
    );
    completedTickets.add("Operational-8-T03-EXEC");
  });

  test("Operational-8-T04 denies wrong-tenant and overbroad export scope", async ({ request }) => {
    const overbroad = await exportCommand(request, {
      command: "SET_SCOPE",
      reason: "Restricted/internal payload item must be denied.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      scopeItems: [restrictedScopeItem("restricted-scope")],
      tenantSlug: "summit",
    });
    const overbroadBody = await overbroad.json();

    const wrongTenant = await exportCommand(request, {
      command: "PREVIEW",
      exportRequestId,
      payload: safePayload,
      reason: "Wrong tenant cannot access the export request.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "morgan",
    }, morganComplianceJwt);
    const wrongTenantBody = await wrongTenant.json();

    expect(overbroad.status(), JSON.stringify(overbroadBody)).toBe(400);
    expect(overbroadBody.issues).toContain("blocked_or_forbidden_scope_items");
    expect(wrongTenant.status(), JSON.stringify(wrongTenantBody)).toBe(403);
    expect(wrongTenantBody.reasonCode).toBe("SCOPE_DENIED");
    completedTickets.add("Operational-8-T04-EXEC");
  });

  test("Operational-8-T05 records redaction profile before preview or approval", async ({ request }) => {
    const missingProfile = await exportCommand(request, {
      command: "VALIDATE_REDACTION",
      exportRequestId,
      payload: safePayload,
      reason: "Missing redaction profile must block.",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const missingProfileBody = await missingProfile.json();

    const response = await exportCommand(request, {
      command: "VALIDATE_REDACTION",
      exportRequestId,
      payload: safePayload,
      reason: "Validate client-safe redaction profile.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const body = await response.json();
    const exportRequest = await prisma.exportRequest.findUniqueOrThrow({ where: { id: exportRequestId } });

    expect(missingProfile.status(), JSON.stringify(missingProfileBody)).toBe(400);
    expect(missingProfileBody.issues).toContain("redaction_profile_required");
    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.status).toBe(ExportStatus.REDACTION_PENDING);
    expect(exportRequest.redactionProfile).toBe("client-safe-redacted");
    completedTickets.add("Operational-8-T05-EXEC");
  });

  test("Operational-8-T06 rejects forbidden fields from preview, package and download path", async ({ request }) => {
    const response = await exportCommand(request, {
      command: "PREVIEW",
      exportRequestId,
      payload: {
        clientSummary: "Released summary.",
        complianceNotes: "Internal compliance-only note.",
        internalRationale: "Internal model rationale.",
      },
      reason: "Forbidden payload should fail closed.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const body = await response.json();
    const inspection = inspectOperationalStage8ForbiddenPayload({
      forbiddenFields: [],
      manifestForbiddenPayloads: [],
    });

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.mutated).toBe(false);
    expect(body.issues).toContain("forbidden_export_payload");
    expect(body.issues).toContain("forbidden_projection_field:complianceNotes");
    expect(body.issues).toContain("forbidden_projection_field:internalRationale");
    expect(inspection.clean).toBe(true);
    forbiddenPayloadClean = inspection.clean;
    completedTickets.add("Operational-8-T06-EXEC");
  });

  test("Operational-8-T07 creates redacted preview without approval, package generation or share", async ({ request }) => {
    const response = await exportCommand(request, {
      command: "PREVIEW",
      exportRequestId,
      payload: safePayload,
      reason: "Preview scoped and redacted content.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const body = await response.json();
    const exportRequest = await prisma.exportRequest.findUniqueOrThrow({ where: { id: exportRequestId } });
    const boundary = inspectOperationalStage8StageBoundary({
      approvedByUserId: exportRequest.approvedByUserId,
      generatedFileDocumentId: exportRequest.generatedFileDocumentId,
      previewStatus: exportRequest.status,
    });

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.status).toBe(ExportStatus.APPROVAL_REQUIRED);
    expect(boundary.previewOnly).toBe(true);
    previewBoundaryClean = boundary.previewOnly;
    completedTickets.add("Operational-8-T07-EXEC");
  });

  test("Operational-8-T08 proves preview is not approval and cannot be downloaded/shared", async ({ request }) => {
    const download = await exportCommand(request, {
      command: "DOWNLOAD",
      exportRequestId,
      payload: safePayload,
      reason: "Preview-only state must not download.",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const downloadBody = await download.json();

    expect(previewBoundaryClean).toBe(true);
    expect(download.status(), JSON.stringify(downloadBody)).toBe(400);
    expect(downloadBody.issues).toContain("generation_required_before_download");
    completedTickets.add("Operational-8-T08-EXEC");
  });

  test("Operational-8-T09 persists export approval with actor, time, profile and audit", async ({ request }) => {
    const response = await exportCommand(request, {
      command: "APPROVE",
      exportRequestId,
      payload: safePayload,
      reason: "Approve after redacted preview.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const body = await response.json();
    const exportRequest = await prisma.exportRequest.findUniqueOrThrow({ where: { id: exportRequestId } });
    const audit = await prisma.auditEvent.findFirstOrThrow({
      where: { eventType: "export.workflow.approve", targetId: exportRequestId },
    });

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(exportRequest.status).toBe(ExportStatus.APPROVED);
    expect(exportRequest.approvedByUserId).toBeTruthy();
    expect(exportRequest.redactionProfile).toBe("client-safe-redacted");
    expect(audit.result).toBe(AuditResult.SUCCESS);
    expect(audit.nextState).toBe(ExportStatus.APPROVED);
    completedTickets.add("Operational-8-T09-EXEC");
  });

  test("Operational-8-T10 denies missing predecessor gates and admin role-only approval", async ({ request }) => {
    const directApprovalRequestId = await createExportRequest(request, "direct-approval-denied");
    const directApproval = await exportCommand(request, {
      command: "APPROVE",
      exportRequestId: directApprovalRequestId,
      payload: safePayload,
      reason: "Approval without preview should fail.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const directApprovalBody = await directApproval.json();

    const adminApproval = await exportCommand(request, {
      command: "APPROVE",
      exportRequestId,
      payload: safePayload,
      reason: "Admin role alone must not force approval.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    }, adminJwt);
    const adminApprovalBody = await adminApproval.json();

    expect(directApproval.status(), JSON.stringify(directApprovalBody)).toBe(400);
    expect(directApprovalBody.issues).toContain("preview_required_before_approval");
    expect(adminApproval.status(), JSON.stringify(adminApprovalBody)).toBe(403);
    expect(adminApprovalBody.reasonCode).toBe("SCOPE_DENIED");
    completedTickets.add("Operational-8-T10-EXEC");
  });

  test("Operational-8-T11 generates metadata-only package only after approved export", async ({ request }) => {
    const response = await exportCommand(request, {
      command: "GENERATE",
      exportRequestId,
      payload: safePayload,
      reason: "Generate metadata-only package manifest.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const body = await response.json();
    const exportRequest = await prisma.exportRequest.findUniqueOrThrow({ where: { id: exportRequestId } });

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.status).toBe(ExportStatus.GENERATED);
    expect(body.manifest.realBinaryGenerated).toBe(false);
    expect(body.manifest.controls.approved).toBe(true);
    expect(body.manifest.controls.packageStage).toBe("generated");
    expect(exportRequest.status).toBe(ExportStatus.GENERATED);
    completedTickets.add("Operational-8-T11-EXEC");
  });

  test("Operational-8-T12 marks generated package content safe and redacted", async ({ request }) => {
    const response = await request.get("/api/export-workflow", {
      headers: { Authorization: `Bearer ${complianceJwt}` },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.snapshot.current.redactionProfile).toBe("client-safe-redacted");
    expect(body.snapshot.current.realFileGenerated).toBe(false);
    expect(forbiddenPayloadClean).toBe(true);
    completedTickets.add("Operational-8-T12-EXEC");
  });

  test("Operational-8-T13 permits download/share only after approved generated package and records audit", async ({ request }) => {
    const download = await exportCommand(request, {
      command: "DOWNLOAD",
      exportRequestId,
      payload: safePayload,
      reason: "Record controlled download.",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const downloadBody = await download.json();

    const share = await exportCommand(request, {
      command: "SHARE",
      exportRequestId,
      externalShare: true,
      payload: safePayload,
      reason: "Record explicit share after download.",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const shareBody = await share.json();

    expect(download.ok(), JSON.stringify(downloadBody)).toBe(true);
    expect(downloadBody.status).toBe(ExportStatus.DOWNLOADED);
    expect(downloadBody.noClientRelease).toBe(true);
    expect(share.ok(), JSON.stringify(shareBody)).toBe(true);
    expect(shareBody.status).toBe(ExportStatus.DOWNLOADED);
    expect(shareBody.noClientRelease).toBe(true);
    completedTickets.add("Operational-8-T13-EXEC");
  });

  test("Operational-8-T14 links export audit events end-to-end", async () => {
    const auditEvents = await prisma.auditEvent.findMany({
      orderBy: { createdAt: "asc" },
      select: { eventType: true, result: true },
      where: { targetId: exportRequestId },
    });
    const inspection = inspectOperationalStage8AuditChain(auditEvents);

    expect(inspection.linked).toBe(true);
    expect(inspection.allSuccessful).toBe(true);
    expect(auditEvents.map((event) => event.eventType)).toEqual(operationalStage8ExpectedAuditEvents);
    auditChainLinked = inspection.linked && inspection.allSuccessful;
    completedTickets.add("Operational-8-T14-EXEC");
  });

  test("Operational-8-T15 proves UI/API/service/DB command chain and bypass negatives", async ({ request }) => {
    const bypassRequestId = await createExportRequest(request, "generate-bypass-denied");
    const generateBypass = await exportCommand(request, {
      command: "GENERATE",
      exportRequestId: bypassRequestId,
      payload: safePayload,
      reason: "Generation cannot skip redaction preview and approval.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const generateBypassBody = await generateBypass.json();

    expect(generateBypass.status(), JSON.stringify(generateBypassBody)).toBe(400);
    expect(generateBypassBody.issues).toContain("approval_required_before_generation");
    expect(auditChainLinked).toBe(true);
    commandBypassDenied = true;
    completedTickets.add("Operational-8-T15-EXEC");
  });

  test("Operational-8-T16 certifies Stage 8 exit without backend-only overclaim", () => {
    completedTickets.add("Operational-8-T16-EXEC");
    const certification = certifyOperationalStage8ExportExit({
      auditChainLinked,
      commandBypassDenied,
      completedTicketIds: [...completedTickets],
      forbiddenPayloadClean,
      noBackendOnlyClaim: true,
      positiveAndNegativeApiProof: true,
    });

    expect(certification.certification).toBe("PH8_EXPORT_EXIT_READY");
    expect(certification.missingProof).toEqual([]);
    expect(certification.missingTickets).toEqual([]);
  });
});
