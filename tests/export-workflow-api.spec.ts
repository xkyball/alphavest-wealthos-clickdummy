import "dotenv/config";

import { execFileSync } from "node:child_process";

import { PrismaPg } from "@prisma/adapter-pg";
import { ObjectType, PrismaClient, WorkflowStatus } from "@prisma/client";
import { expect, test, type APIRequestContext } from "@playwright/test";

import { demoTenants } from "../lib/demo-session";
import { stableId } from "../lib/stable-id";

const summitTenant = demoTenants.find((tenant) => tenant.slug === "summit");
const safePayload = {
  clientSummary: "Released client-safe export summary.",
  decisionState: "Released",
  releasedAt: "2026-06-24T00:00:00.000Z",
  status: "RELEASED_TO_CLIENT",
  title: "Liquidity governance decision",
};

function safeScopeItem(label: string) {
  return {
    access: "Allowed",
    id: stableId(`export-workflow:${label}`),
    name: "Released client-safe decision summary",
    payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
    selected: true,
    type: "DECISION",
  };
}

async function exportCommand(request: APIRequestContext, data: Record<string, unknown>) {
  return request.post("/api/export-workflow", { data });
}

async function createExportRequest(request: APIRequestContext, label: string) {
  const response = await exportCommand(request, {
    command: "SET_SCOPE",
    reason: "Select client-safe released objects for export proof.",
    redactionProfile: "client-safe-redacted",
    roleKey: "compliance_officer",
    scopeItems: [safeScopeItem(label)],
    tenantSlug: "summit",
  });
  const body = await response.json();

  expect(response.ok(), JSON.stringify(body)).toBe(true);
  expect(body.status).toBe("SCOPE_SELECTED");
  expect(body.noClientRelease).toBe(true);

  return body.exportRequestId as string;
}

test.describe.serial("Epic 6 export workflow API", () => {
  let prisma: PrismaClient | undefined;

  test.beforeEach(() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Epic 6 export workflow API tests.");
    }

    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterEach(async () => {
    await prisma?.$disconnect();
    prisma = undefined;
  });

  test("separates scope, redaction, preview, approval, generation, download and share", async ({ request }) => {
    const exportRequestId = await createExportRequest(request, "positive-lifecycle");
    const payload = {
      clientSummary: "Released client-safe export summary.",
      decisionState: "Released",
      releasedAt: "2026-06-24T00:00:00.000Z",
      status: "RELEASED_TO_CLIENT",
      title: "Liquidity governance decision",
    };

    const redaction = await exportCommand(request, {
      command: "VALIDATE_REDACTION",
      exportRequestId,
      payload,
      reason: "Validate allowlisted fields only.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    expect(redaction.ok(), await redaction.text()).toBe(true);

    const preview = await exportCommand(request, {
      command: "PREVIEW",
      exportRequestId,
      payload,
      reason: "Preview client-safe export package.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const previewBody = await preview.json();
    expect(preview.ok(), JSON.stringify(previewBody)).toBe(true);
    expect(previewBody.status).toBe("APPROVAL_REQUIRED");

    const afterPreview = await prisma?.exportRequest.findUnique({ where: { id: exportRequestId } });
    expect(afterPreview?.approvedByUserId).toBeNull();
    expect(afterPreview?.generatedFileDocumentId).toBeNull();

    const generateBeforeApproval = await exportCommand(request, {
      command: "GENERATE",
      exportRequestId,
      payload,
      reason: "Generation must remain blocked before approval.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const generateBeforeApprovalBody = await generateBeforeApproval.json();
    expect(generateBeforeApproval.status(), JSON.stringify(generateBeforeApprovalBody)).toBe(400);
    expect(generateBeforeApprovalBody.issues).toContain("approval_required_before_generation");

    const approval = await exportCommand(request, {
      command: "APPROVE",
      exportRequestId,
      payload,
      reason: "Compliance approval after preview.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const approvalBody = await approval.json();
    expect(approval.ok(), JSON.stringify(approvalBody)).toBe(true);
    expect(approvalBody.status).toBe("APPROVED");
    expect(approvalBody.noRealBinaryStorage).toBe(true);

    const generated = await exportCommand(request, {
      command: "GENERATE",
      exportRequestId,
      payload,
      reason: "Generate metadata-only manifest.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const generatedBody = await generated.json();
    expect(generated.ok(), JSON.stringify(generatedBody)).toBe(true);
    expect(generatedBody.status).toBe("GENERATED");
    expect(generatedBody.manifest.realBinaryGenerated).toBe(false);

    const download = await exportCommand(request, {
      command: "DOWNLOAD",
      exportRequestId,
      payload,
      reason: "Record controlled download event.",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const downloadBody = await download.json();
    expect(download.ok(), JSON.stringify(downloadBody)).toBe(true);
    expect(downloadBody.status).toBe("DOWNLOADED");

    const share = await exportCommand(request, {
      command: "SHARE",
      exportRequestId,
      externalShare: true,
      payload,
      reason: "Record explicit share after download.",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const shareBody = await share.json();
    expect(share.ok(), JSON.stringify(shareBody)).toBe(true);
    expect(shareBody.status).toBe("DOWNLOADED");

    const auditEvents = await prisma?.auditEvent.findMany({
      orderBy: { createdAt: "asc" },
      where: { targetId: exportRequestId },
    });
    expect(auditEvents?.map((event) => event.eventType)).toEqual([
      "export.workflow.set_scope",
      "export.workflow.validate_redaction",
      "export.workflow.preview",
      "export.workflow.approve",
      "export.workflow.generate",
      "export.workflow.download",
      "export.workflow.share",
    ]);

    const snapshot = await request.get("/api/export-workflow?tenantSlug=summit&roleKey=compliance_officer");
    const snapshotBody = await snapshot.json();
    expect(snapshot.ok(), JSON.stringify(snapshotBody)).toBe(true);
    expect(snapshotBody.snapshot.current.realFileGenerated).toBe(false);
    expect(snapshotBody.snapshot.current.noOverclaimDetail).toContain("client acceptance");
  });

  test("blocks forbidden internal payload fields before preview or approval", async ({ request }) => {
    const exportRequestId = await createExportRequest(request, "forbidden-payload");
    const redaction = await exportCommand(request, {
      command: "VALIDATE_REDACTION",
      exportRequestId,
      payload: safePayload,
      reason: "Validate redaction before unsafe preview attempt.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });

    expect(redaction.ok(), await redaction.text()).toBe(true);

    const response = await exportCommand(request, {
      command: "PREVIEW",
      exportRequestId,
      payload: {
        clientSummary: "Released summary.",
        complianceNotes: "Internal compliance-only note.",
        internalRationale: "Model rationale.",
      },
      reason: "Unsafe preview should fail closed.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.mutated).toBe(false);
    expect(body.issues).toContain("forbidden_export_payload");
    expect(body.issues).toContain("forbidden_projection_field:complianceNotes");
    expect(body.issues).toContain("forbidden_projection_field:internalRationale");
  });

  test("blocks export approval while high-severity data quality is active", async ({ request }) => {
    if (!prisma || !summitTenant) throw new Error("Summit test context is missing.");
    const exportRequestId = await createExportRequest(request, "data-quality-blocker");
    const redaction = await exportCommand(request, {
      command: "VALIDATE_REDACTION",
      exportRequestId,
      payload: safePayload,
      reason: "Validate redaction before approval blocker proof.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    expect(redaction.ok(), await redaction.text()).toBe(true);

    const preview = await exportCommand(request, {
      command: "PREVIEW",
      exportRequestId,
      payload: safePayload,
      reason: "Preview before approval blocker proof.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    expect(preview.ok(), await preview.text()).toBe(true);

    await prisma.dataQualityIssue.create({
      data: {
        clientTenantId: summitTenant.id,
        description: "Critical ownership source mismatch blocks export.",
        issueType: "ownership_conflict",
        severity: "critical",
        status: WorkflowStatus.IN_REVIEW,
        targetId: exportRequestId,
        targetType: ObjectType.EXPORT_REQUEST,
      },
    });

    const response = await exportCommand(request, {
      command: "APPROVE",
      exportRequestId,
      payload: { clientSummary: "Released client-safe export summary." },
      reason: "Data quality should block approval.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(409);
    expect(body.mutated).toBe(false);
    expect(body.issues).toContain("data_quality_release_ready");
    expect(body.issues).toContain("high_severity_data_quality_issues");
  });

  test("keeps conditional external advisor export scope inactive and object-scoped", async ({ request }) => {
    const response = await exportCommand(request, {
      command: "SET_SCOPE",
      reason: "Broad export scope is not activated without process-backed approval.",
      redactionProfile: "client-safe-redacted",
      roleKey: "external_advisor",
      scopeItems: [safeScopeItem("external-advisor-denied")],
      tenantSlug: "summit",
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.mutated).toBe(false);
    expect(body.issues).toContain("export_role_denied");
  });
});
