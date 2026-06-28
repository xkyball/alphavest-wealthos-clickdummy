import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { writeUxQaSignoffReport } from "../scripts/ux-qa-signoff-report";

test.describe("UX QA sign-off report", () => {
  test("covers the completed E01-E08 systemic UX themes", () => {
    const tempRoot = mkdtempSync(path.join(tmpdir(), "alphavest-ux-signoff-"));
    const outputPath = path.join(tempRoot, "signoff.md");
    const report = writeUxQaSignoffReport(outputPath);
    const markdown = readFileSync(outputPath, "utf8");

    expect(report.items.map((item) => item.epic)).toEqual(["E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08"]);
    expect(markdown).toContain("E09 Operational Screenshot Audit Sign-Off Checklist");
    expect(markdown).toContain("proof/reviewer metadata");
    expect(markdown).toContain("pnpm visual:audit-operational");
    expect(markdown).toContain("retired");
  });
});
