import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

test.describe("platform admin command client wiring", () => {
  test("keeps J10 admin controls off runScreencastDemoAction and sensitive saves behind confirmation", () => {
    const source = readFileSync("components/admin-tenant-setup-screen.tsx", "utf8");

    expect(source).toContain('void runPlatformAdminCommand("j10.reviewPermission", "/admin/security");');
    expect(source).not.toContain('void runPlatformAdminCommand("j10.savePlatform");');
    expect(source).not.toContain('void runPlatformAdminCommand("j10.saveSecurity");');
    expect(source).not.toContain('runScreencastDemoAction("j10.');
  });
});
