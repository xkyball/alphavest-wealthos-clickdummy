import { expect, test } from "@playwright/test";

import { routeSmokeList } from "../lib/route-registry";

test.describe("registered route smoke", () => {
  for (const route of routeSmokeList) {
    test(`${route.pageId} ${route.path}`, async ({ request }) => {
      const response = await request.get(route.path);
      expect(response.status(), `${route.pageId} ${route.path}`).toBe(200);

      const body = await response.text();
      expect(body).toContain(route.expectedHeading);
    });
  }

  test("unknown catalogue route returns hardened not-found surface", async ({ request }) => {
    const response = await request.get("/not-a-catalogue-route");
    expect([200, 404]).toContain(response.status());

    const body = await response.text();
    expect(body).toContain("Route unavailable");
  });
});

test.describe("mobile route identity", () => {
  const shellRegressionPages = new Set(["008", "011", "012", "013", "014", "015", "016", "017"]);

  for (const route of routeSmokeList.filter((item) => shellRegressionPages.has(item.pageId))) {
    test(`${route.pageId} ${route.path} shows route content before mobile navigation`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route.path);

      const heading = page.getByRole("heading", { name: route.expectedHeading }).first();
      await expect(heading).toBeVisible();

      const box = await heading.boundingBox();
      expect(box?.y, `${route.pageId} heading should be in the first mobile viewport`).toBeLessThan(420);
    });
  }
});
