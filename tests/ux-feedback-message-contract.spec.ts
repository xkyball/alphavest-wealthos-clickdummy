import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { noOverclaimCopy, noOverclaimForbiddenSuccessPattern } from "../lib/no-overclaim-copy";
import {
  uxFeedbackAttributesFor,
  uxFeedbackCopyForBoundary,
  uxFeedbackIntents,
  uxFeedbackSubjectContractFor,
  uxFeedbackSubjects,
} from "../lib/ux-feedback-message-contract";

test.describe("E06 canonical feedback message contract", () => {
  test("defines the approved feedback intents and subjects", () => {
    expect(uxFeedbackIntents).toEqual([
      "status",
      "pending",
      "validation",
      "blocked",
      "denied",
      "fail_closed",
      "retry",
      "success",
    ]);

    expect(uxFeedbackSubjects).toEqual([
      "upload",
      "evidence_review",
      "evidence_sufficiency",
      "advisor_approval",
      "compliance_release",
      "client_visibility",
      "client_acceptance",
      "audit_persistence",
      "permission_scope",
      "export_scope",
      "export_redaction",
      "export_approval",
      "export_generation",
      "download",
      "share",
      "generic_action",
    ]);
  });

  test("maps high-risk feedback subjects to no-overclaim boundaries", () => {
    expect(uxFeedbackSubjectContractFor("upload")).toMatchObject({
      boundary: "uploadOnly",
      downstreamForbidden: expect.stringContaining("evidence sufficiency"),
      stateFamily: "validation",
    });
    expect(uxFeedbackSubjectContractFor("advisor_approval")).toMatchObject({
      actionMeaning: "approve",
      boundary: "advisorApprovalNotRelease",
      downstreamForbidden: expect.stringContaining("compliance release"),
    });
    expect(uxFeedbackSubjectContractFor("compliance_release")).toMatchObject({
      actionMeaning: "release",
      boundary: "complianceReleaseNotClientAcceptance",
      downstreamForbidden: expect.stringContaining("client acceptance"),
    });
    expect(uxFeedbackSubjectContractFor("export_approval")).toMatchObject({
      actionMeaning: "export_approval",
      boundary: "exportApprovalNotDownload",
      downstreamForbidden: expect.stringContaining("download"),
    });
    expect(uxFeedbackSubjectContractFor("download")).toMatchObject({
      actionMeaning: "download",
      boundary: "downloadNotClientAcceptance",
      downstreamForbidden: expect.stringContaining("client acceptance"),
    });
  });

  test("projects runtime feedback attributes from the canonical contract", () => {
    expect(uxFeedbackAttributesFor({
      actionMeaning: "release",
      intent: "success",
      placement: "modal_status",
      subject: "compliance_release",
    })).toMatchObject({
      "data-ux-feedback-action-meaning": "release",
      "data-ux-feedback-audience": "operational_internal",
      "data-ux-feedback-boundary": "complianceReleaseNotClientAcceptance",
      "data-ux-feedback-downstream-forbidden": "export, download, share and client acceptance",
      "data-ux-feedback-intent": "success",
      "data-ux-feedback-placement": "modal_status",
      "data-ux-feedback-state-family": "restricted",
      "data-ux-feedback-subject": "compliance_release",
      "data-ux-no-overclaim": "true",
    });

    expect(uxFeedbackAttributesFor({
      intent: "validation",
      placement: "page_state",
      subject: "upload",
    })).toMatchObject({
      "data-ux-feedback-boundary": "uploadOnly",
      "data-ux-feedback-downstream-forbidden": "evidence sufficiency, release, export, client visibility and client acceptance",
      "data-ux-feedback-intent": "validation",
      "data-ux-feedback-state-family": "validation",
      "data-ux-feedback-subject": "upload",
    });
  });

  test("reuses the canonical no-overclaim copy without forbidden success claims", () => {
    expect(uxFeedbackCopyForBoundary("uploadOnly")).toBe(noOverclaimCopy.uploadOnly);
    expect(uxFeedbackCopyForBoundary("exportApprovalNotDownload")).toBe(noOverclaimCopy.exportApprovalNotDownload);

    for (const subject of uxFeedbackSubjects) {
      const copy = uxFeedbackCopyForBoundary(uxFeedbackSubjectContractFor(subject).boundary);

      expect(copy).not.toMatch(noOverclaimForbiddenSuccessPattern);
    }
  });

  test("StatePanel and representative surfaces project E06 feedback metadata", () => {
    const statePanelSource = readFileSync("components/ui/state-panel.tsx", "utf8");
    const uploadSource = readFileSync("components/client-intake-screen.tsx", "utf8");
    const complianceSource = readFileSync("components/internal-workflow-screen.tsx", "utf8");
    const exportSource = readFileSync("components/communication-export-ops-screen.tsx", "utf8");

    expect(statePanelSource).toContain("uxFeedbackAttributesFor");
    expect(statePanelSource).toContain("feedback?: UxFeedbackProjectionInput");
    expect(statePanelSource).toContain("{...feedbackAttributes}");
    expect(readFileSync("components/ui/validation-feedback.tsx", "utf8")).toContain("NoOverclaimFeedback");

    expect(uploadSource).toContain('subject: "upload"');
    expect(complianceSource).toContain('subject: "compliance_release"');
    expect(exportSource).toContain('subject: "export_approval"');
    expect(exportSource).toContain('subject: "download"');
    expect(exportSource).toContain('subject: "share"');
  });
});
