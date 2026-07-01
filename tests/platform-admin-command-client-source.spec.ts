import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

test.describe("platform admin command client wiring", () => {
  test("keeps J10 admin controls off demo actions and posts sensitive saves only from confirmation", () => {
    const source = readFileSync("components/admin-tenant-setup-screen.tsx", "utf8");
    const commandClientSource = readFileSync("lib/platform-admin-command-client.ts", "utf8");

    expect(source).toContain('void runPlatformAdminCommand("j10.reviewPermission", "/admin/security");');
    expect(source).toContain('"j10.savePlatform"');
    expect(source).toContain('"j10.saveSecurity"');
    expect(source).toContain("async function handleConfirmAttempt()");
    expect(source).not.toContain('runScreencastDemoAction("j10.');
    expect(commandClientSource).not.toContain("readActorCommandScope");
    expect(commandClientSource).toContain("JSON.stringify({ actionId })");
  });
});
