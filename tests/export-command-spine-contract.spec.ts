import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import {
  certifyExportWorkflowCommandSpineContract,
  exportWorkflowCanonicalApiRoute,
  exportWorkflowCommandAuditEventTypes,
  exportWorkflowCommandIds,
  exportWorkflowCommandSpineContract,
  exportWorkflowCommandSpinePath,
} from "../lib/export-workflow-command-service";
import { operationalStage8ExpectedAuditEvents, operationalStage8TicketEvidence } from "../lib/export-command-lifecycle-service";

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

  test("retires CLIENT_VISIBILITY, WORKFLOW10 and export proof families behind the command spine", () => {
    const legacyFamilyIds = [
      "Operational_PHASE8_EXPORT_CLOSURE",
      "WORKFLOW10_EXPORT_SCOPE_REDACTION_APPROVAL_UX",
      "CLIENT_VISIBILITY_PHASE6_PAYLOAD_CONTRACT",
      "CLIENT_VISIBILITY_PHASE7_PAYLOAD_SWEEP",
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

  test("keeps command stage and audit proof aligned with Stage 8 certification", () => {
    expect(exportWorkflowCommandIds).toEqual([
      "SET_SCOPE",
      "VALIDATE_REDACTION",
      "PREVIEW",
      "APPROVE",
      "GENERATE",
      "DOWNLOAD",
      "SHARE",
    ]);
    expect(exportWorkflowCommandAuditEventTypes).toEqual(operationalStage8ExpectedAuditEvents);
    expect(operationalStage8TicketEvidence).toHaveLength(16);
    expect(operationalStage8TicketEvidence.every((evidence) => evidence.commandSpine === exportWorkflowCommandSpinePath)).toBe(true);
    expect(operationalStage8TicketEvidence.find((evidence) => evidence.ticketId === "Operational-8-T04-EXEC")).toMatchObject({
      commandSpine: exportWorkflowCommandSpinePath,
      targetFiles: ["lib/export-service.ts", "tests/export-command-lifecycle-certification.spec.ts"],
    });
  });

  test("keeps the export API authority bound to the db-user JWT actor session", () => {
    const routeSource = readFileSync("app/api/export-workflow/route.ts", "utf8");
    const apiProofSource = readFileSync("tests/export-workflow-api.spec.ts", "utf8");

    expect(routeSource).toContain("resolveCurrentUserActorSession");
    expect(routeSource).toContain('authority: "db-user-jwt"');
    expect(apiProofSource).toContain("Family CFO JWT must not be elevated by a spoofed compliance body");
    expect(apiProofSource).toContain("/api/export-workflow?tenantSlug=morgan&roleKey=family_cfo");
  });
});
