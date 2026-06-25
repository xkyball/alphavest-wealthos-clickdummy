import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import { routeToSmokePath, screenRoutes } from "../lib/route-registry";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: demoAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

const worksurfaceRoutes = [
  { pageId: "019", worksurface: "client-context-home" },
  { pageId: "027", worksurface: "evidence-document-hub" },
  { pageId: "028", worksurface: "evidence-upload-intake" },
  { pageId: "029", worksurface: "evidence-extraction-review" },
  { pageId: "030", worksurface: "evidence-verification-pending" },
  { pageId: "031", worksurface: "client-context-wealth-map" },
  { pageId: "032", worksurface: "client-context-actions" },
  { pageId: "033", worksurface: "internal-workbench-signals" },
  { pageId: "034", worksurface: "internal-workbench-queue" },
  { pageId: "035", worksurface: "internal-workbench-trigger-review" },
  { pageId: "036", worksurface: "advisor-review-queue" },
  { pageId: "037", worksurface: "advisor-review-detail" },
  { pageId: "038", worksurface: "compliance-release-queue" },
  { pageId: "039", worksurface: "compliance-release-decision-room" },
  { pageId: "040", worksurface: "compliance-release-confirmation" },
  { pageId: "041", worksurface: "compliance-release-block" },
  { pageId: "042", worksurface: "compliance-release-audit" },
  { pageId: "043", worksurface: "decision-record-list" },
  { pageId: "044", worksurface: "decision-record-room" },
  { pageId: "045", worksurface: "decision-record-success" },
  { pageId: "046", worksurface: "evidence-vault" },
  { pageId: "047", worksurface: "evidence-record-detail" },
  { pageId: "048", worksurface: "governance-safety-users" },
  { pageId: "049", worksurface: "governance-safety-roles" },
  { pageId: "050", worksurface: "governance-safety-access-requests" },
] as const;

test.describe("WP02 worksurface shell", () => {
  test("centralizes the shared worksurface renderer and route adoption", () => {
    const root = process.cwd();
    const shell = readFileSync(join(root, "components/worksurface-shell.tsx"), "utf8");
    const client = readFileSync(join(root, "components/client-intake-screen.tsx"), "utf8");
    const wealth = readFileSync(join(root, "components/wealth-actions-screen.tsx"), "utf8");
    const governance = readFileSync(join(root, "components/decisions-governance-screen.tsx"), "utf8");
    const internal = readFileSync(join(root, "components/internal-workflow-screen.tsx"), "utf8");
    const exportOps = readFileSync(join(root, "components/communication-export-ops-screen.tsx"), "utf8");

    expect(shell).toContain("export function WorksurfaceShell");
    expect(shell).toContain('data-testid="wp02-worksurface-shell"');
    expect(client).toContain('from "@/components/worksurface-shell"');
    expect(wealth).toContain('from "@/components/worksurface-shell"');
    expect(governance).toContain('from "@/components/worksurface-shell"');
    expect(internal).toContain('from "@/components/worksurface-shell"');
    expect(exportOps).toContain('from "@/components/worksurface-shell"');
    expect(exportOps).toContain('routeId="051"');
    expect(exportOps).toContain('worksurfaceId="governance-safety-audit-history"');
  });

  for (const route of worksurfaceRoutes) {
    test(`${route.pageId} uses the WP02 worksurface shell`, async ({ page }) => {
      const registeredRoute = screenRoutes.find((candidate) => candidate.pageId === route.pageId);

      expect(registeredRoute, `${route.pageId} is registered`).toBeTruthy();
      await authenticate(page);
      await page.goto(routeToSmokePath(registeredRoute!.route));

      const shell = page.getByTestId("wp02-worksurface-shell");
      await expect(shell).toHaveCount(1);
      await expect(shell).toHaveAttribute("data-wp02-route-id", route.pageId);
      await expect(shell).toHaveAttribute("data-wp02-worksurface", route.worksurface);
      await expect(page.getByTestId("wp02-worksurface-safety-boundary")).toBeVisible();
    });
  }
});
