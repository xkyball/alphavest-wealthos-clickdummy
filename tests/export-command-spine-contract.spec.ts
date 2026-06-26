import { expect, test } from "@playwright/test";

import {
  certifyExportWorkflowCommandSpineContract,
  exportWorkflowCanonicalApiRoute,
  exportWorkflowCommandAuditEventTypes,
  exportWorkflowCommandIds,
  exportWorkflowCommandSpineContract,
  exportWorkflowCommandSpinePath,
} from "../lib/export-workflow-command-service";
import { p44Phase8ExpectedAuditEvents, p44Phase8TicketEvidence } from "../lib/p44-phase8-export-command-closure";

test.describe("export workflow command spine contract", () => {
  test("certifies one canonical export command authority", () => {
    const certification = certifyExportWorkflowCommandSpineContract();
    const commandFamilies = exportWorkflowCommandSpineContract.proofFamilies.filter(
      (family) => family.authority === "COMMAND_SPINE",
    );

    expect(certification.certification).toBe("EXPORT_COMMAND_SPINE_READY");
    expect(certification.missingProof).toEqual([]);
    expect(certification.canonicalCommandService).toBe(exportWorkflowCommandSpinePath);
    expect(certification.canonicalApiRoute).toBe(exportWorkflowCanonicalApiRoute);
    expect(commandFamilies).toHaveLength(1);
    expect(commandFamilies[0]).toMatchObject({
      canonicalApiRoute: "/api/export-workflow",
      canonicalCommandService: "lib/export-workflow-command-service.ts",
      familyId: "EXPORT_WORKFLOW_COMMAND_SERVICE",
    });
  });

  test("retires AV27, WP10 and export proof families behind the command spine", () => {
    const legacyFamilyIds = [
      "P44_PHASE8_EXPORT_CLOSURE",
      "WP10_EXPORT_SCOPE_REDACTION_APPROVAL_UX",
      "AV27_PHASE6_PAYLOAD_CONTRACT",
      "AV27_PHASE7_PAYLOAD_SWEEP",
      "WCL_EXPORT_SAFETY",
      "FILE_EXPORT_REALISM",
      "RETIRED_EXPORT_ADAPTER",
    ];
    const families = exportWorkflowCommandSpineContract.proofFamilies.filter((family) =>
      legacyFamilyIds.includes(family.familyId),
    );

    expect(exportWorkflowCommandSpineContract.legacyProofFamiliesRetired).toBe(true);
    expect(families.map((family) => family.familyId).sort()).toEqual([...legacyFamilyIds].sort());
    expect(families.every((family) => family.authority !== "COMMAND_SPINE")).toBe(true);
    expect(families.every((family) => family.canonicalCommandService === exportWorkflowCommandSpinePath)).toBe(true);
    expect(families.every((family) => family.canonicalApiRoute === exportWorkflowCanonicalApiRoute)).toBe(true);
  });

  test("keeps command stage and audit proof aligned with Phase 8 certification", () => {
    expect(exportWorkflowCommandIds).toEqual([
      "SET_SCOPE",
      "VALIDATE_REDACTION",
      "PREVIEW",
      "APPROVE",
      "GENERATE",
      "DOWNLOAD",
      "SHARE",
    ]);
    expect(exportWorkflowCommandAuditEventTypes).toEqual(p44Phase8ExpectedAuditEvents);
    expect(p44Phase8TicketEvidence).toHaveLength(16);
    expect(p44Phase8TicketEvidence.every((evidence) => evidence.commandSpine === exportWorkflowCommandSpinePath)).toBe(true);
    expect(p44Phase8TicketEvidence.find((evidence) => evidence.ticketId === "P44-8-T04-EXEC")).toMatchObject({
      commandSpine: exportWorkflowCommandSpinePath,
      targetFiles: ["lib/export-service.ts", "tests/p44-phase8-certification.spec.ts"],
    });
  });
});
