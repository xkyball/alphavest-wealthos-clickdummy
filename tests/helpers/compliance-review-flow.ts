import { expect, type Page } from "@playwright/test";

type ComplianceReviewSurface = "decision-room" | "release" | "block" | "audit";

export async function openComplianceReviewDetail(
  page: Page,
  surface: ComplianceReviewSurface = "decision-room",
  query = "",
) {
  await page.goto("/compliance/reviews");
  await page.getByTestId("ux-interaction-compliance-search").fill("Northbridge");

  const table = page.getByTestId("ux-data-table").first();
  await expect(table).toContainText("Northbridge Family Office");
  await expect(table).not.toContainText("Morgan Family Office");
  await table.getByTestId("ux-data-table-row-action").first().click();
  await expect(page).toHaveURL(/\/compliance\/reviews\/[0-9a-f-]{36}\/decision-room$/);

  const match = page.url().match(/\/compliance\/reviews\/([0-9a-f-]{36})\/decision-room$/);
  expect(match?.[1]).toBeTruthy();
  const reviewId = match![1];

  if (surface !== "decision-room" || query) {
    await page.goto(`/compliance/reviews/${reviewId}/${surface}${query}`);
  }

  return reviewId;
}
