import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";

const workflowActions = [
  "j02.requestEvidence",
  "j02.confirmRequestEvidence",
  "j02.blockRelease",
  "j02.releaseClient",
  "j03.requestMoreInformation",
  "j03.deferDecision",
  "j03.rejectDecision",
  "j03.acceptOption",
  "j03.viewEvidenceRecord",
  "j03.downloadEvidence",
  "j04.portalUpload",
  "j04.openUploadDocument",
  "j04.uploadDocument",
  "j04.confirmFinalize",
  "j04.viewDetails",
  "j05.createEntity",
  "j05.continueEntity",
  "j05.editEntity",
  "j05.viewDetails",
  "j05.markReady",
  "j05.requestInfo",
  "j06.newTenant",
  "j06.continueTenant",
  "j06.assignTeam",
  "j06.openInvitation",
  "j06.sendInvitation",
  "j07.inviteUser",
  "j07.sendInvitation",
  "j07.saveRoleChanges",
  "j07.approveAccess",
  "j07.exportAudit",
  "j08.selectDataExtract",
  "j08.clearScope",
  "j08.confirmApproval",
  "j08.downloadExport",
  "j08.shareExport",
  "j09.portalUpload",
  "j09.submitProfile",
  "j09.addMember",
  "j09.saveFamilyChanges",
  "j09.openFamilyMap",
  "j09.addRelationship",
  "j12.requestKycEvidence",
  "j12.completeKycReview",
  "j12.escalateSourceOfWealth",
  "j12.linkSourceEvidence",
  "j13.requestSuitabilityEvidence",
  "j13.markSuitabilityReviewed",
  "j14.requestIpsMandateChanges",
  "j14.linkIpsEvidence",
];

test.describe("demo workflow API", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("implemented journey actions return successful mutation responses", async ({ request }) => {
    for (const actionId of workflowActions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.actionId).toBe(actionId);
      expect(body.result).toBeTruthy();
    }
  });

  test("rejects malformed action payloads with validation issues", async ({ request }) => {
    const invalidPayloads = [{}, { actionId: 42 }, { actionId: "releaseClient" }];

    for (const payload of invalidPayloads) {
      const response = await request.post("/api/demo-workflow", {
        data: payload,
      });
      const body = await response.json();

      expect(response.status(), JSON.stringify(body)).toBe(400);
      expect(body.error).toBe("Invalid demo workflow request.");
      expect(body.issues?.[0]?.field).toBe("actionId");
      expect(body.issues?.[0]?.code).toBe("invalid_action_id");
      expect(body.mutated).toBe(false);
      expect(body.noClientRelease).toBe(true);
      expect(body.ok).toBe(false);
    }
  });

  test("malformed JSON body fails closed without mutation or client release", async ({ request }) => {
    const response = await request.post("/api/demo-workflow", {
      data: "[",
      headers: {
        "content-type": "application/json",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.error).toBe("Invalid demo workflow request.");
    expect(body.issues?.[0]?.code).toBe("invalid_body");
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.ok).toBe(false);
  });

  test("Phase B J12 KYC workflow actions return evidence and audit boundaries", async ({ request }) => {
    const actions = [
      "j12.requestKycEvidence",
      "j12.completeKycReview",
      "j12.escalateSourceOfWealth",
      "j12.linkSourceEvidence",
    ];

    for (const actionId of actions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.result.auditRows).toBe(1);
      expect(body.result.evidenceRecordId).toBeTruthy();
      expect(body.result.evidenceItemId).toBeTruthy();
      expect(body.result.clientVisible).toBe(false);
    }
  });

  test("Phase C J13/J14 Suitability and IPS actions keep advice visibility blocked", async ({ request }) => {
    const actions = [
      "j13.requestSuitabilityEvidence",
      "j13.markSuitabilityReviewed",
      "j14.requestIpsMandateChanges",
      "j14.linkIpsEvidence",
    ];

    for (const actionId of actions) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.result.auditRows).toBe(1);
      expect(body.result.evidenceRecordId).toBeTruthy();
      expect(body.result.evidenceItemId).toBeTruthy();
      expect(body.result.clientVisible).toBe(false);
      expect(body.result.gateName).toBe("NO_UNAPPROVED_ADVICE");
      expect(body.result.gatePassed).toBe(false);
      expect(body.result.gateMissing).toContain("compliance_release");
      expect(body.result.gateMissing).toContain("ips_mandate_acknowledged");
    }
  });
});
