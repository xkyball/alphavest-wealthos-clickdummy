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
  { pageId: "001", worksurface: "access-login" },
  { pageId: "002", worksurface: "access-mfa" },
  { pageId: "003", worksurface: "access-invite-acceptance" },
  { pageId: "004", worksurface: "access-identity-setup" },
  { pageId: "005", worksurface: "access-consent" },
  { pageId: "006", worksurface: "access-role-confirmation" },
  { pageId: "007", worksurface: "platform-settings" },
  { pageId: "008", worksurface: "platform-advice-boundary" },
  { pageId: "009", worksurface: "platform-role-templates" },
  { pageId: "010", worksurface: "platform-security" },
  { pageId: "011", worksurface: "platform-evidence-templates" },
  { pageId: "012", worksurface: "platform-export-templates" },
  { pageId: "013", worksurface: "tenant-list" },
  { pageId: "014", worksurface: "tenant-create" },
  { pageId: "015", worksurface: "tenant-setup-dashboard" },
  { pageId: "016", worksurface: "tenant-team-assignment" },
  { pageId: "017", worksurface: "tenant-policies" },
  { pageId: "018", worksurface: "tenant-users" },
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
  { pageId: "054", worksurface: "export-redaction-start" },
  { pageId: "055", worksurface: "export-redaction-scope" },
  { pageId: "056", worksurface: "export-redaction-redaction" },
  { pageId: "057", worksurface: "export-redaction-approval" },
  { pageId: "058", worksurface: "export-redaction-download" },
] as const;

test.describe("WP02 worksurface shell", () => {
  test("centralizes the shared worksurface renderer and route adoption", () => {
    const root = process.cwd();
    const shell = readFileSync(join(root, "components/worksurface-shell.tsx"), "utf8");
    const auth = readFileSync(join(root, "components/auth-onboarding-screen.tsx"), "utf8");
    const adminTenant = readFileSync(join(root, "components/admin-tenant-setup-screen.tsx"), "utf8");
    const client = readFileSync(join(root, "components/client-intake-screen.tsx"), "utf8");
    const wealth = readFileSync(join(root, "components/wealth-actions-screen.tsx"), "utf8");
    const governance = readFileSync(join(root, "components/decisions-governance-screen.tsx"), "utf8");
    const internal = readFileSync(join(root, "components/internal-workflow-screen.tsx"), "utf8");
    const exportOps = readFileSync(join(root, "components/communication-export-ops-screen.tsx"), "utf8");

    expect(shell).toContain("export function WorksurfaceShell");
    expect(shell).toContain('data-testid="wp02-worksurface-shell"');
    expect(shell).toContain('xl:grid-cols-[minmax(0,1fr)_24rem]');
    expect(shell).toContain("xl:sticky xl:top-24 xl:self-start");
    expect(shell).toContain("type WorksurfaceChildrenPolicy");
    expect(shell).toContain("defaultChildrenPolicyForTemplate");
    expect(shell).toContain('data-ux-unbounded-children="false"');
    expect(shell).toContain("data-ux-page-job");
    expect(shell).toContain("data-ux-active-step");
    expect(shell).toContain("data-ux-classified-children");
    expect(shell).toContain("data-ux-long-screen-exception");
    expect(shell).not.toContain("{primary}\n          {secondary}\n          {children}");
    expect(auth).toContain('from "@/components/worksurface-shell"');
    expect(adminTenant).toContain('from "@/components/worksurface-shell"');
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
      if (route.pageId !== "001") {
        await authenticate(page);
      }
      await page.goto(routeToSmokePath(registeredRoute!.route));

      const shell = page.getByTestId("wp02-worksurface-shell");
      await expect(shell).toHaveCount(1);
      await expect(shell).toHaveAttribute("data-wp02-route-id", route.pageId);
      await expect(shell).toHaveAttribute("data-wp02-worksurface", route.worksurface);
      await expect(shell).toHaveAttribute("data-ux-page-job", /^(audit_reference|client_summary|decision_room|queue|queue_detail|stepper)$/);
      await expect(shell).toHaveAttribute("data-ux-active-step", /^(approval|audit|blocked|confirmation|decision|download|intake|overview|redaction|review|scope|triage)$/);
      await expect(shell).toHaveAttribute("data-ux-unbounded-children", "false");
      await expect(page.getByTestId("wp02-worksurface-safety-boundary")).toBeVisible();
    });
  }
});
