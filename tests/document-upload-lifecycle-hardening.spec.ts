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
  const password = input.email.split("@")[0] ?? "";
  const login = await request.post("/api/auth/provider-login", {
    data: {
      email: input.email,
      password,
      providerId: "db-user-jwt",
      roleKey: input.roleKey,
      tenantSlug: input.tenantSlug,
    },
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
}

test.describe("UXP3-006 document upload lifecycle hardening", () => {
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

  test("blocks upload until a source file is selected", async ({ page }) => {
    await page.goto("/documents/upload");

    const lifecycle = page.getByTestId("uxp3-document-upload-lifecycle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-file-required");
    await expect(lifecycle).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(page.getByTestId("real-upload-document")).toBeDisabled();
    await expect(page.getByTestId("document-upload-validation-state")).toContainText(
      "Source file required before upload can start.",
    );
  });

  test("keeps upload success scoped to pending review without release or export claims", async ({ page, request }) => {
    const fileName = "uxp3-006-upload-lifecycle-proof.pdf";

    await setDbUserSession(page, request, {
      email: "cfo.morgan@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("%PDF-1.4\nUXP3-006 lifecycle proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    const lifecycle = page.getByTestId("uxp3-document-upload-lifecycle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "valid-file-selected");
    await expect(page.getByTestId("real-upload-document")).toBeEnabled();
    await expect(page.getByTestId("document-upload-validation-state")).toContainText(
      "Ready to upload this source document for extraction review.",
    );

    await page.getByTestId("real-upload-document").click();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "success");
    await expect(page.getByText(`${fileName} uploaded for extraction review.`)).toBeVisible();
    await expect(page.getByText("Intake check: Security scan complete", { exact: true })).toBeVisible();
    await expect(page.getByText("Evidence request recorded; review pending.")).toBeVisible();
    await expect(page.getByText(/client accepted|released to client|export approved/i)).toHaveCount(0);
  });

  test("keeps blocked upload errors out of success lifecycle", async ({ page, request }) => {
    await setDbUserSession(page, request, {
      email: "cfo.morgan@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("unsupported payload"),
      mimeType: "application/x-msdownload",
      name: "uxp3-006-blocked-upload.exe",
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByTestId("uxp3-document-upload-lifecycle")).toHaveAttribute("data-ux-lifecycle-status", "error");
    await expect(page.getByText("Upload paused")).toBeVisible();
    await expect(page.getByText("supported_file_type_required").first()).toBeVisible();
    await expect(page.getByTestId("retry-upload-document")).toBeVisible();
    await expect(page.getByText(/^Upload complete$/)).toHaveCount(0);
  });

  test("keeps unsafe supported uploads blocked by the visible intake check", async ({ page, request }) => {
    await setDbUserSession(page, request, {
      email: "cfo.morgan@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from(
        "%PDF-1.4\nX5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*\n%%EOF",
      ),
      mimeType: "application/pdf",
      name: "uxp3-006-security-blocked.pdf",
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByTestId("uxp3-document-upload-lifecycle")).toHaveAttribute("data-ux-lifecycle-status", "error");
    await expect(page.getByText("Upload paused")).toBeVisible();
    await expect(page.getByTestId("uxp3-document-upload-lifecycle").getByText("Security scan blocked this file. Choose a different source document.").first()).toBeVisible();
    await expect(page.getByText(/^Upload complete$/)).toHaveCount(0);
  });
});
