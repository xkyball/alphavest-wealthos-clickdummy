import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { noOverclaimForbiddenSuccessPattern } from "../lib/no-overclaim-copy";
import {
  uxFeedbackSuccessMessageForSubject,
  uxFeedbackSubjects,
} from "../lib/ux-feedback-message-contract";

test.describe("E06 action-specific success messaging", () => {
  test("provides contract-backed success copy for high-risk subjects", () => {
    expect(uxFeedbackSuccessMessageForSubject("upload")).toContain("pending internal evidence only");
    expect(uxFeedbackSuccessMessageForSubject("upload")).toContain("evidence sufficiency, release, export and client visibility remain locked");
    expect(uxFeedbackSuccessMessageForSubject("compliance_release")).toContain("Compliance release persisted for this reviewed package only");
    expect(uxFeedbackSuccessMessageForSubject("export_approval")).toContain("generation, download, share, client acceptance and advice release remain separate");
    expect(uxFeedbackSuccessMessageForSubject("download")).toContain("secure share, client acceptance and advice release remain separate");
    expect(uxFeedbackSuccessMessageForSubject("evidence_review")).toContain("evidence sufficiency, release and client visibility remain separate");

    expect(uxFeedbackSuccessMessageForSubject("download", { auditEventId: "audit-123" })).toContain("Audit recorded: audit-123.");

    for (const subject of uxFeedbackSubjects) {
      expect(uxFeedbackSuccessMessageForSubject(subject)).not.toMatch(noOverclaimForbiddenSuccessPattern);
    }
  });

  test("routes shared defaults and representative workflow success states through the E06 helper", () => {
    const guardedActionSource = readFileSync("components/ui/guarded-action-button.tsx", "utf8");
    const uploadSource = readFileSync("components/client-intake-screen.tsx", "utf8");
    const complianceSource = readFileSync("components/internal-workflow-screen.tsx", "utf8");
    const exportSource = readFileSync("components/communication-export-ops-screen.tsx", "utf8");

    expect(guardedActionSource).toContain('successLabel = uxFeedbackSuccessMessageForSubject("generic_action")');
    expect(uploadSource).toContain('uxFeedbackSuccessMessageForSubject("upload")');
    expect(complianceSource).toContain('uxFeedbackSuccessMessageForSubject("compliance_release"');
    expect(complianceSource).toContain('uxFeedbackSuccessMessageForSubject("evidence_review"');
    expect(exportSource).toContain('uxFeedbackSuccessMessageForSubject("export_approval"');
    expect(exportSource).toContain('uxFeedbackSuccessMessageForSubject("download"');

    expect(complianceSource).not.toContain('"Action persisted."');
    expect(guardedActionSource).not.toContain("Downstream gates remain separate unless explicitly stated");
  });
});
