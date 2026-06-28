import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  pilotBuyerPersonas,
  pilotCommercialBoundaries,
  pilotDemoProcessSpine,
  pilotSuccessMetrics,
} from "../lib/pilot-gtm-proof";

function readWorkspaceText(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test.describe("V1.0 pilot GTM proof package", () => {
  test("defines target buyers and exclusion criteria without mass-market or GA positioning", () => {
    expect(pilotBuyerPersonas.map((persona) => persona.key)).toEqual([
      "family_office_principal_cfo",
      "advisor_operator",
      "compliance_risk_owner",
      "trust_led_buyer",
    ]);

    for (const persona of pilotBuyerPersonas) {
      expect(persona.qualifiesWhen).toBeTruthy();
      expect(persona.excludesWhen).toBeTruthy();
    }

    expect(pilotCommercialBoundaries.allowedOffer).toBe("controlled_paid_design_partner_pilot");
    expect(pilotCommercialBoundaries.excludedClaims).toEqual(
      expect.arrayContaining(["mass_market_ga", "regulated_production_ready", "autonomous_financial_legal_tax_advice"]),
    );
  });

  test("keeps the demo narrative on the approved MVP process spine and not P1/Hold promises", () => {
    expect(pilotDemoProcessSpine.map((process) => process.key)).toEqual([
      "BP-001",
      "BP-024",
      "BP-046",
      "BP-020",
      "BP-017",
      "BP-088",
    ]);
    expect(pilotDemoProcessSpine.map((process) => process.key)).not.toEqual(
      expect.arrayContaining(["BP-070", "BP-071"]),
    );

    expect(pilotDemoProcessSpine.find((process) => process.key === "BP-046")?.proof).toContain("internal-only");
    expect(pilotDemoProcessSpine.find((process) => process.key === "BP-020")?.proof).toContain("cannot force");
    expect(pilotDemoProcessSpine.find((process) => process.key === "BP-088")?.proof).toContain("redaction");
  });

  test("documents GTM pack and scorecard with safety-compatible limits", () => {
    const gtmPack = readWorkspaceText("docs/V1_0_PILOT_GTM_PACK.md");
    const scorecard = readWorkspaceText("docs/V1_0_PILOT_SCORECARD.md");

    expect(gtmPack).toContain("Family Office Principal/CFO");
    expect(gtmPack).toContain("Trust-led buyer");
    expect(gtmPack).toContain("controlled paid design-partner pilot");
    expect(gtmPack).toContain("Forbidden positioning");
    expect(gtmPack).toContain("P1 and Hold processes are not live promises");
    expect(gtmPack).toContain("autonomous financial/legal/tax advice");

    expect(scorecard).toContain("Buyer confidence");
    expect(scorecard).toContain("No leakage");
    expect(scorecard).toContain("Evidence completeness");
    expect(scorecard).toContain("Review time");
    expect(scorecard).toContain("Gate clarity");
    expect(scorecard).toContain("Support incidents");
    expect(scorecard).toContain("Feedback issues");
    expect(scorecard).toContain("Do not convert P1/Hold requests into live promises");
  });

  test("scores pilot outcomes using measurable gates instead of screenshots or applause", () => {
    expect(pilotSuccessMetrics.map((metric) => metric.key)).toEqual([
      "buyer_confidence",
      "no_leakage",
      "evidence_completeness",
      "review_time",
      "gate_clarity",
      "support_incidents",
      "feedback_issues",
    ]);

    expect(pilotSuccessMetrics.find((metric) => metric.key === "no_leakage")?.target).toContain("zero client-visible");
    expect(pilotSuccessMetrics.find((metric) => metric.key === "gate_clarity")?.target).toContain(
      "advisor approval",
    );
    expect(pilotSuccessMetrics.find((metric) => metric.key === "feedback_issues")?.target).toContain(
      "safety blocker",
    );
  });
});
