import { expect, test } from "@playwright/test";

test.describe("AlphaVest product guidance shell", () => {
  test("topbar exposes controlled tenant and role scenario context without clickdummy wording", async ({ page }) => {
    await page.goto("/portal");

    const topbar = page.getByRole("banner");
    await expect(topbar.getByText("Tenant context")).toBeVisible();
    await expect(topbar.getByText("Scenario role")).toBeVisible();
    await expect(topbar.getByText("Controlled scenario context; production auth is not claimed")).toBeVisible();
    await expect(topbar.getByLabel("Tenant context")).toBeVisible();
    await expect(topbar.getByLabel("Role context")).toBeVisible();
    await expect(topbar.getByText(/clickdummy|prototype|screen catalogue/i)).toHaveCount(0);
  });

  test("workbench guidance explains purpose and next controlled step", async ({ page }) => {
    await page.goto("/workbench");

    const guidance = page.getByRole("region", { name: "Product workflow guidance" });
    await expect(guidance.getByRole("heading", { name: "Workflow guidance" })).toBeVisible();
    await expect(guidance.getByText("Workbench", { exact: true })).toBeVisible();
    await expect(guidance.getByText("Advisory workflow")).toBeVisible();
    await expect(guidance.getByText("Internal draft only. Advisor approval and compliance release are separate downstream gates.")).toBeVisible();
    await expect(guidance.getByRole("link", { name: "Send to advisor review" })).toHaveAttribute("href", "/advisor-approval");
    await expect(guidance.getByRole("link", { name: "Open compliance queue" })).toHaveAttribute("href", "/compliance");
  });

  test("document upload guidance keeps upload separate from evidence sufficiency", async ({ page }) => {
    await page.goto("/documents/upload");

    const guidance = page.getByRole("region", { name: "Product workflow guidance" });
    await expect(guidance.getByRole("heading", { name: "Workflow guidance" })).toBeVisible();
    await expect(guidance.getByText("Document upload", { exact: true })).toBeVisible();
    await expect(guidance.getByText("Upload is not evidence sufficiency. Human review, scope, currentness and linkage still have to pass.")).toBeVisible();
    await expect(guidance.getByRole("link", { name: "Review extraction" })).toHaveAttribute("href", "/documents/extraction-review");
    await expect(guidance.getByText(/release now|client visibility unlocked|evidence sufficiency complete/i)).toHaveCount(0);
  });

  test("client portal guidance communicates client-safe released visibility", async ({ page }) => {
    await page.goto("/portal");

    const guidance = page.getByRole("region", { name: "Product workflow guidance" });
    await expect(guidance.getByRole("heading", { name: "Workflow guidance" })).toBeVisible();
    await expect(guidance.getByText("Client portal", { exact: true })).toBeVisible();
    await expect(guidance.getByText("Client-facing view: only released, client-safe content should be visible here.")).toBeVisible();
    await expect(guidance.getByRole("link", { name: "Upload evidence source" })).toHaveAttribute("href", "/documents/upload");
  });

  test("compliance and export guidance preserve release, redaction and approval boundaries", async ({ page }) => {
    await page.goto("/compliance");

    let guidance = page.getByRole("region", { name: "Product workflow guidance" });
    await expect(guidance.getByText("Compliance release controls client visibility. Missing evidence or audit blocks release.")).toBeVisible();
    await expect(guidance.getByRole("link", { name: "Open compliance review" })).toHaveAttribute("href", "/compliance/demo/review");

    await page.goto("/export/new");
    guidance = page.getByRole("region", { name: "Product workflow guidance" });
    await expect(guidance.getByText("Export requires scope, redaction and approval. Preview is not approval or client acceptance.")).toBeVisible();
    await expect(guidance.getByRole("link", { name: "Select export scope" })).toHaveAttribute("href", "/export/demo/scope");
  });

  test("P1 reference and held routes are labelled as orientation instead of MVP-complete work", async ({ page }) => {
    await page.goto("/communication");
    await expect(page.getByRole("region", { name: "Product workflow guidance" }).getByText("P1 / later", { exact: true })).toBeVisible();
    await expect(page.getByRole("region", { name: "Product workflow guidance" }).getByText("not part of the current MVP workflow")).toBeVisible();

    await page.goto("/service-blueprint");
    await expect(page.getByRole("region", { name: "Product workflow guidance" }).getByText("Reference only: internal orientation surface, not product workflow proof.")).toBeVisible();

    await page.goto("/committee/reviews");
    await expect(page.getByRole("region", { name: "Product workflow guidance" }).getByText("Held / not MVP: requires scope and safety unlock before product workflow use.")).toBeVisible();
  });
});
