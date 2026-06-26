import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

test.describe("advice and release-history command client source", () => {
  test("keeps J02/J03 product-like controls off runScreencastDemoAction", () => {
    const clientSource = readFileSync("lib/advice-release-history-command-client.ts", "utf8");
    const contractSource = readFileSync("lib/advice-release-history-action-contract.ts", "utf8");
    const decisionsGovernanceSource = readFileSync("components/decisions-governance-screen.tsx", "utf8");

    expect(contractSource).toContain("/api/advice-release-history/actions");
    expect(clientSource).toContain("adviceReleaseHistoryCanonicalApiRoute");
    expect(decisionsGovernanceSource).toContain("runAdviceReleaseHistoryCommand");
    expect(decisionsGovernanceSource).not.toContain("runScreencastDemoAction");
  });
});
