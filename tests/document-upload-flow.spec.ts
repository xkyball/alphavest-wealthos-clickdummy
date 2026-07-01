import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

import { authJwtCookieName } from "../lib/auth/auth-jwt";

const actorSessionStorageKey = "alphavest.actorSession.v1";

async function setActorSession(page: Page, tenantSlug: string, roleKey: string) {
  await page.addInitScript(
    ([storageKey, tenant, role]) => {
      window.localStorage.setItem(storageKey, JSON.stringify({ roleKey: role, tenantSlug: tenant }));
    },
    [actorSessionStorageKey, tenantSlug, roleKey],
  );
  await page.evaluate(
    ([storageKey, tenant, role]) => {
      window.localStorage.setItem(storageKey, JSON.stringify({ roleKey: role, tenantSlug: tenant }));
    },
    [actorSessionStorageKey, tenantSlug, roleKey],
  ).catch(() => undefined);
}

async function setDbUserSession(
  page: Page,
  request: APIRequestContext,
  input: { email: string; roleKey: string; tenantSlug: string },
) {
  const login = await request.post("/api/auth/provider-login", {
    data: { email: input.email, providerId: "db-user-jwt", roleKey: input.roleKey, tenantSlug: input.tenantSlug },
  });
  const loginBody = await login.json();

  expect(login.ok(), JSON.stringify(loginBody)).toBe(true);

  const mfa = await request.post("/api/auth/mfa/verify", {
    data: { code: "123456", email: input.email, providerId: "db-user-jwt", roleKey: input.roleKey, tenantSlug: input.tenantSlug },
  });
  const mfaBody = await mfa.json();

  expect(mfa.ok(), JSON.stringify(mfaBody)).toBe(true);
  await page.context().addCookies([
    {
      httpOnly: true,
      name: authJwtCookieName,
      sameSite: "Lax",
      url: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100",
      value: mfaBody.jwt as string,
    },
  ]);
  await setActorSession(page, input.tenantSlug, input.roleKey);
}

async function setUploadFile(page: Page, input: { buffer: Buffer; mimeType: string; name: string }) {
  await page.waitForLoadState("networkidle");
  await expect(page.getByTestId("document-upload-target-object")).toBeVisible();
  await page.getByTestId("document-upload-file-input").setInputFiles(input);

  if (input.mimeType === "application/pdf") {
    await expect(page.getByTestId("document-upload-validation-state")).toContainText("Ready to upload");
    await expect(page.getByTestId("real-upload-document")).toBeEnabled();
  }
}

test.describe("document upload browser flow", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test.beforeEach(async ({ page, request }) => {
    await setDbUserSession(page, request, {
      email: "cfo.morgan@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
  });

  test("does not render seed fallback documents in the review queue", async ({ page, request }) => {
    await setDbUserSession(page, request, {
      email: "naledi.compliance@alphavest.demo",
      roleKey: "compliance_officer",
      tenantSlug: "bennett",
    });
    await page.goto("/documents/review-queue");

    await expect(page.getByTestId("s029-extraction-master-list")).toBeVisible();
    await expect(page.getByTestId("s029-extraction-real-filters")).toBeVisible();
    await expect(page.getByTestId("ux-filter-active-state")).toContainText("Extraction queue is current.");
    await expect(page.getByTestId("ux-data-table-pagination")).toHaveAttribute("data-ux-data-surface-source-truth", "backend_query_backed");
    await expect(page.getByText("Bennett Tax Residency Certificate 2026.pdf", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Source of Funds Addendum.pdf", { exact: true })).toHaveCount(0);
  });

  test("uploads a file through the picker and survives reload", async ({ page, request }) => {
    const fileName = "playwright-upload-reload-proof.pdf";

    await setDbUserSession(page, request, {
      email: "cfo.morgan@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("%PDF-1.4\nPlaywright reload proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} uploaded for extraction review.`)).toBeVisible();
    await expect(page.getByText(fileName, { exact: true })).toBeVisible();
    await expect(page.getByText("Version: v1 of 1 · source integrity retained", { exact: true })).toBeVisible();
    await expect(page.getByText("Intake check: Security scan complete", { exact: true })).toBeVisible();
    await expect(page.getByText("Lifecycle: Extraction Pending", { exact: true })).toBeVisible();
    await expect(page.getByText("Evidence request recorded; review pending.")).toBeVisible();

    await page.reload();
    await expect(page.getByText(fileName, { exact: true })).toBeVisible();
    await expect(page.getByText("Version: v1 of 1 · source integrity retained", { exact: true })).toBeVisible();
    await expect(page.getByText("Intake check: Security scan complete", { exact: true })).toBeVisible();

    await page.goto("/documents");
    await expect(page.locator("p:visible, span:visible, td:visible, article:visible", { hasText: fileName }).first()).toBeVisible();
    await expect(page.locator("span:visible", { hasText: "Scan complete" }).first()).toBeVisible();
  });

  test("shows generated preview actions for non-raster uploads", async ({ page, request }) => {
    const fileName = "playwright-upload-preview-card.csv";

    await setDbUserSession(page, request, {
      email: "cfo.morgan@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("asset,value\nOperating company,1200000\n"),
      mimeType: "text/csv",
      name: fileName,
    });

    await expect(page.getByTestId("document-upload-validation-state")).toContainText("Ready to upload");
    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} uploaded for extraction review.`)).toBeVisible();

    const latestCard = page.getByTestId("document-upload-latest-card");
    await expect(latestCard).toContainText(fileName);
    await expect(latestCard).toContainText("Preview generated");
    await expect(latestCard).toContainText("Intake check: Security scan complete");
    const previewLink = latestCard.getByRole("link", { name: "Open preview" });
    await expect(previewLink).toBeVisible();
    await expect(previewLink).toHaveAttribute("href", /\/api\/documents\/derivatives\//);

    await page.goto("/documents");
    const documentRow = page.locator("tr", { hasText: fileName }).first();
    await expect(documentRow).toBeVisible();
    await expect(documentRow.getByRole("link", { name: "Open preview" })).toBeVisible();
  });

  test("reloads persisted uploads from the selected tenant context", async ({ page, request }) => {
    const fileName = "playwright-summit-tenant-reload-proof.pdf";

    await setDbUserSession(page, request, {
      email: "cfo.summit@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "summit",
    });
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("%PDF-1.4\nPlaywright summit tenant proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} uploaded for extraction review.`)).toBeVisible();
    await expect(page.getByText(fileName, { exact: true })).toBeVisible();
    await expect(page.getByText("Version: v1 of 1 · source integrity retained", { exact: true })).toBeVisible();
    await expect(page.getByText("Intake check: Security scan complete", { exact: true })).toBeVisible();
    await expect(page.getByText("Lifecycle: Extraction Pending", { exact: true })).toBeVisible();
    await expect(page.getByText("Evidence request recorded; review pending.")).toBeVisible();

    await page.reload();
    await expect(page.getByText(fileName, { exact: true })).toBeVisible();
    await expect(page.getByText("Version: v1 of 1 · source integrity retained", { exact: true })).toBeVisible();
    await expect(page.getByText("Intake check: Security scan complete", { exact: true })).toBeVisible();

    await page.goto("/documents");
    await expect(page.locator("p:visible, span:visible, td:visible, article:visible", { hasText: fileName }).first()).toBeVisible();
    await expect(page.locator("td:visible", { hasText: "Summit Ridge Capital" }).first()).toBeVisible();

    await setDbUserSession(page, request, {
      email: "cfo.morgan@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
    await page.goto("/documents");
    await expect(page.locator("p:visible, span:visible, td:visible, article:visible", { hasText: fileName })).toHaveCount(0);
  });

  test("shows retry affordance after a blocked upload without creating sufficiency", async ({ page, request }) => {
    const fileName = "playwright-blocked-retry-proof.exe";

    await setDbUserSession(page, request, {
      email: "cfo.morgan@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("unsupported executable payload"),
      mimeType: "application/x-msdownload",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText("Upload paused")).toBeVisible();
    await expect(page.getByText("supported_file_type_required").first()).toBeVisible();
    await expect(page.getByTestId("retry-upload-document")).toBeVisible();
    await expect(page.getByText("Evidence request recorded; review pending.")).toHaveCount(0);
  });

  test("accepts scoped evidence from extraction review without client release", async ({ page, request }) => {
    const fileName = "playwright-stage3-evidence-review-proof.pdf";

    await setDbUserSession(page, request, {
      email: "cfo.morgan@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("%PDF-1.4\nPlaywright stage 3 review proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} uploaded for extraction review.`)).toBeVisible();

    await setDbUserSession(page, request, {
      email: "naledi.compliance@alphavest.demo",
      roleKey: "compliance_officer",
      tenantSlug: "morgan",
    });
    await page.goto("/documents/review-queue");
    await expect(page.getByTestId("s029-extraction-selected-detail")).toContainText(fileName);
    await expect(page.getByTestId("document-review-latest-card")).toContainText("Version: v1 of 1");
    await expect(page.getByTestId("document-review-latest-card")).toContainText("source integrity retained");

    await page.getByTestId("stage3-accept-sufficiency").click();
    await expect(page.getByText("Evidence accepted for this review check. Release, export and client visibility remain locked.")).toBeVisible();
    await expect(page.getByText("Lifecycle: Sufficient")).toBeVisible();
    await expect(page.getByText(/Evidence: Validated/)).toBeVisible();
    await expect(page.getByText(/Visibility: Redacted/)).toBeVisible();

    await page.getByRole("link", { name: "Open advisory queue" }).click();
    await expect(page).toHaveURL(/\/advisory\/review-queue$/);
    const reviewWorkLink = page.getByRole("link", { name: "Open review work" });
    await expect(reviewWorkLink).toHaveAttribute("href", /^\/advisory\/triggers\/[^/]+\/review$/);
    await reviewWorkLink.click();
    await expect(page).toHaveURL(/\/advisory\/triggers\/[^/]+\/review$/);
    await expect(page.getByRole("button", { name: "Route to advisor review" })).toBeVisible();
  });

  test("renders clarification as insufficient without client release", async ({ page, request }) => {
    const fileName = "playwright-stage3-clarification-proof.pdf";

    await setDbUserSession(page, request, {
      email: "cfo.morgan@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("%PDF-1.4\nPlaywright stage 3 clarification proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} uploaded for extraction review.`)).toBeVisible();

    await setDbUserSession(page, request, {
      email: "mira.analyst@alphavest.demo",
      roleKey: "analyst",
      tenantSlug: "morgan",
    });
    await page.goto("/documents/review-queue");
    await expect(page.getByTestId("s029-extraction-selected-detail")).toContainText(fileName);

    await page.getByTestId("stage3-request-clarification").click();
    await expect(page.getByText("Clarification requested. Evidence is insufficient and release, export and client visibility remain locked.")).toBeVisible();
    await expect(page.getByTestId("document-review-latest-card")).toContainText("Lifecycle: Insufficient");
  });
});
