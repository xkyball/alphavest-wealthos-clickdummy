import { expect, test } from "@playwright/test";

import { createActorSession } from "../lib/actor-session";
import {
  buildDomainHReleasedDecisionReadModel,
  domainHReleasedDecisionPayload,
  domainHReleasedProjectionStepContracts,
  domainHUnreleasedDecisionPayload,
} from "../lib/domain-h-released-projection-contract";

const forbiddenClientFields = [
  "aiDraft",
  "assumptionsJson",
  "auditActor",
  "auditEventId",
  "auditMetadata",
  "auditReason",
  "complianceNotes",
  "evidenceRecordId",
  "internalRationale",
];

test.describe("DOMAIN-H released projection contract", () => {
  test("covers all client visibility process steps without relying on UI proof panels", () => {
    expect(domainHReleasedProjectionStepContracts.map((contract) => contract.stepId)).toEqual([
      "BP-067-S01",
      "BP-067-S02",
      "BP-067-S03",
      "BP-068-S01",
      "BP-068-S02",
      "BP-068-S03",
      "BP-069-S01",
      "BP-069-S02",
      "BP-069-S03",
    ]);

    for (const contract of domainHReleasedProjectionStepContracts) {
      expect(contract.requiredScreens.length, contract.stepId).toBeGreaterThan(0);
      expect(contract.serviceBoundary, contract.stepId).toMatch(/visibilityEngine|readmodel|adapter/i);
      expect(contract.positiveAcceptance, contract.stepId).toMatch(/client-safe|released|hidden|communicated|mobile|safe projection/i);
      expect(contract.negativeAcceptance, contract.stepId).toMatch(/unreleased|internal|forbidden|fail-closed|wrong-scope|export/i);
    }
  });

  test("builds a released client-safe UI model from the visibility engine only", () => {
    const readModel = buildDomainHReleasedDecisionReadModel({
      ...domainHReleasedDecisionPayload,
      auditActor: "compliance_officer",
      auditEventId: "audit:bennett:domain-h-release",
      auditMetadata: { internal: true },
      auditReason: "Internal release rationale.",
    });

    expect(readModel.contractId).toBe("DOMAIN_H_RELEASED_PROJECTION_CONTRACT");
    expect(readModel.ui.state).toBe("released");
    expect(readModel.ui.nextActionEnabled).toBe(true);
    expect(readModel.ui.summary).toBe("Reviewed governance update available for client view.");
    expect(readModel.payloadKeys).toEqual(["clientSummary", "decisionState", "id", "releasedAt", "title"]);
    expect(readModel.proof.forbiddenFieldsPresent).toEqual([]);
    expect(readModel.hiddenFields).toEqual(expect.arrayContaining(forbiddenClientFields));

    for (const field of forbiddenClientFields) {
      expect(readModel.payloadKeys).not.toContain(field);
    }
  });

  test("fails closed for unreleased or wrong-scope decisions and disables next action", () => {
    const unreleased = buildDomainHReleasedDecisionReadModel(domainHUnreleasedDecisionPayload);
    const wrongTenant = createActorSession({ roleKey: "principal", tenantSlug: "morgan" });
    const wrongScope = buildDomainHReleasedDecisionReadModel(domainHReleasedDecisionPayload, wrongTenant);

    for (const readModel of [unreleased, wrongScope]) {
      expect(readModel.ui.nextActionEnabled).toBe(false);
      expect(readModel.ui.summary).toBe("This update is still being reviewed.");
      expect(readModel.payloadKeys).toEqual([]);
      expect(readModel.proof.forbiddenFieldsPresent).toEqual([]);
      expect(readModel.hiddenFields).toEqual(expect.arrayContaining(["clientSummary", "internalRationale", "complianceNotes"]));
    }
  });
});
