import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

test.describe("advice and release-history command client source", () => {
  test("keeps J02/J03 product-like controls off runScreencastDemoAction", () => {
    const clientSource = readFileSync("lib/advice-release-history-command-client.ts", "utf8");
    const contractSource = readFileSync("lib/advice-release-history-action-contract.ts", "utf8");
    const decisionsGovernanceSource = readFileSync("components/decisions-governance-screen.tsx", "utf8");
    const demoWorkflowSource = readFileSync("app/api/demo-workflow/route.ts", "utf8");

    expect(contractSource).toContain("/api/advice-release-history/actions");
    expect(clientSource).toContain("adviceReleaseHistoryCanonicalApiRoute");
    expect(clientSource).not.toContain("/api/demo-workflow");
    expect(decisionsGovernanceSource).toContain("runAdviceReleaseHistoryCommand");
    expect(decisionsGovernanceSource).not.toContain("runScreencastDemoAction");
    expect(demoWorkflowSource).not.toContain("j02.releaseClient");
    expect(demoWorkflowSource).not.toContain("j03.acceptOption");
  });
});
