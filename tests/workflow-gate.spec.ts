import { expect, test } from "@playwright/test";

import {
  advisorOnlyCommitteeCandidate,
  committeeApprovedCandidate,
} from "../lib/committee-review-demo-data";
import {
  releasableSuitabilityIpsCandidate,
  suitabilityGateCandidate,
} from "../lib/suitability-ips-demo-data";
import { canPassHighRiskCommitteeGate, canReleaseAdviceWithSuitabilityIps } from "../lib/workflow-gate";

test.describe("Suitability and IPS advice visibility gate", () => {
  test("blocks advice-like client visibility when suitability and IPS prerequisites are incomplete", () => {
    const gate = canReleaseAdviceWithSuitabilityIps(suitabilityGateCandidate);

    expect(gate.gateName).toBe("NO_UNAPPROVED_ADVICE");
    expect(gate.passed).toBe(false);
    expect(gate.blockedReason).toBe("No unapproved advice reaches the client.");
    expect(gate.missing).toContain("recommendation_released_to_client");
    expect(gate.missing).toContain("compliance_release");
    expect(gate.missing).toContain("suitability_profile_complete");
    expect(gate.missing).toContain("risk_profile_complete");
    expect(gate.missing).toContain("investment_objectives_complete");
    expect(gate.missing).toContain("ips_mandate_acknowledged");
    expect(gate.missing).toContain("mandate_evidence_record");
    expect(gate.missing).toContain("client_acknowledgement");
  });

  test("passes only when release, evidence, suitability, IPS acknowledgement and permission gates align", () => {
    const gate = canReleaseAdviceWithSuitabilityIps(releasableSuitabilityIpsCandidate);

    expect(gate.passed).toBe(true);
    expect(gate.missing).toEqual([]);
    expect(gate.blockedReason).toBeUndefined();
  });
});

test.describe("Committee peer review gate", () => {
  test("blocks high-risk advice when only advisor approval is complete", () => {
    const gate = canPassHighRiskCommitteeGate(advisorOnlyCommitteeCandidate);

    expect(gate.gateName).toBe("NO_UNAPPROVED_ADVICE");
    expect(gate.passed).toBe(false);
    expect(gate.blockedReason).toBe("High-risk advice needs committee review before downstream release.");
    expect(gate.missing).not.toContain("advisor_approval");
    expect(gate.missing).toContain("committee_approval");
    expect(gate.missing).toContain("committee_dissent_resolved");
  });

  test("passes after high-risk committee approval, resolved dissent, evidence and permission align", () => {
    const gate = canPassHighRiskCommitteeGate(committeeApprovedCandidate);

    expect(gate.passed).toBe(true);
    expect(gate.missing).toEqual([]);
    expect(gate.blockedReason).toBeUndefined();
  });
});
