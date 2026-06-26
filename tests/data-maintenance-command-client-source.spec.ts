import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

test.describe("data maintenance command client wiring", () => {
  test("keeps J04/J05/J09 product-like controls off runScreencastDemoAction", () => {
    const clientIntakeSource = readFileSync("components/client-intake-screen.tsx", "utf8");
    const wealthActionsSource = readFileSync("components/wealth-actions-screen.tsx", "utf8");

    expect(clientIntakeSource).toContain('void runDataMaintenanceCommand("j04.openUploadDocument", "/documents/upload");');
    expect(clientIntakeSource).toContain('void runDataMaintenanceCommand("j04.uploadDocument", "/documents/review-queue");');
    expect(clientIntakeSource).toContain('void runDataMaintenanceCommand("j05.createEntity", "/entities/new");');
    expect(clientIntakeSource).toContain('void runDataMaintenanceCommand("j09.addRelationship");');
    expect(wealthActionsSource).toContain('void runDataMaintenanceCommand("j05.viewDetails", "/actions?state=drawer");');
    expect(wealthActionsSource).toContain('void runDataMaintenanceCommand("j05.requestInfo");');

    expect(clientIntakeSource).not.toContain("runScreencastDemoAction");
    expect(wealthActionsSource).not.toContain("runScreencastDemoAction");
  });
});
