import { expect, test } from "@playwright/test";
import {
  processFirstUxContractForPageId,
  processFirstUxCriticalPageIds,
  processFirstUxRouteContracts,
} from "../lib/process-first-ux-contract";
import { screenRoutes } from "../lib/route-registry";

const routeByPageId = new Map(screenRoutes.map((route) => [route.pageId, route.route]));

test.describe("process-first UX route contract", () => {
  test("covers the first critical long-screen and process-gate pages", () => {
    expect(processFirstUxCriticalPageIds).toEqual([
      "032",
      "037",
      "039",
      "046",
      "047",
      "048",
      "050",
      "051",
      "054",
      "055",
      "056",
      "057",
      "058",
    ]);
  });

  test("keeps contract routes aligned to the central route registry", () => {
    for (const contract of processFirstUxRouteContracts) {
      expect(routeByPageId.get(contract.pageId), contract.pageId).toBe(contract.route);
    }
  });

  test("maps export redaction and approval to P0 export process gates", () => {
    const redaction = processFirstUxContractForPageId("056");
    const approval = processFirstUxContractForPageId("057");

    for (const contract of [redaction, approval]) {
      expect(contract.pageFamily).toBe("export_step");
      expect(contract.domainIds).toEqual(expect.arrayContaining(["DOMAIN-J", "DOMAIN-H", "DOMAIN-I"]));
      expect(contract.businessProcessIds).toEqual(expect.arrayContaining(["BP-082", "BP-087"]));
      expect(contract.acceptanceIds).toEqual(["ACC-008"]);
      expect(contract.gateIds).toEqual(["P0_EXPORT_REDACTION_GATE"]);
    }

    expect(redaction.forbiddenOverclaims).toEqual(expect.arrayContaining(["redaction_as_approval", "internal_payload_in_client_export"]));
    expect(approval.forbiddenOverclaims).toEqual(expect.arrayContaining(["approval_as_download", "approval_as_client_acceptance"]));
  });

  test("maps advisor and compliance decision rooms to release-safe P0 process gates", () => {
    const advisor = processFirstUxContractForPageId("037");
    const compliance = processFirstUxContractForPageId("039");

    expect(advisor.pageFamily).toBe("advisor_review");
    expect(advisor.domainIds).toEqual(expect.arrayContaining(["DOMAIN-F", "DOMAIN-I"]));
    expect(advisor.acceptanceIds).toEqual(["ACC-004"]);
    expect(advisor.gateIds).toEqual(["P0_ADVISOR_APPROVAL_NOT_RELEASE_GATE"]);
    expect(advisor.forbiddenOverclaims).toEqual(expect.arrayContaining(["compliance_release", "client_visibility"]));

    expect(compliance.pageFamily).toBe("compliance_decision_room");
    expect(compliance.domainIds).toEqual(expect.arrayContaining(["DOMAIN-G", "DOMAIN-H", "DOMAIN-I"]));
    expect(compliance.acceptanceIds).toEqual(["ACC-005", "ACC-006", "ACC-007"]);
    expect(compliance.gateIds).toEqual(expect.arrayContaining(["P0_COMPLIANCE_RELEASE_GATE", "P0_CLIENT_VISIBILITY_GATE", "P0_AUDIT_PERSISTENCE_GATE"]));
    expect(compliance.forbiddenOverclaims).toEqual(expect.arrayContaining(["advisor_approval_as_release", "client_visibility_without_compliance_release"]));
  });

  test("does not allow empty process, gate or overclaim fields", () => {
    for (const contract of processFirstUxRouteContracts) {
      expect(contract.primaryProcessJob.trim(), contract.pageId).not.toBe("");
      expect(contract.nextPermittedAction.trim(), contract.pageId).not.toBe("");
      expect(contract.domainIds.length, contract.pageId).toBeGreaterThan(0);
      expect(contract.businessProcessIds.length, contract.pageId).toBeGreaterThan(0);
      expect(contract.acceptanceIds.length, contract.pageId).toBeGreaterThan(0);
      expect(contract.gateIds.length, contract.pageId).toBeGreaterThan(0);
      expect(contract.forbiddenOverclaims.length, contract.pageId).toBeGreaterThan(0);
    }
  });
});
