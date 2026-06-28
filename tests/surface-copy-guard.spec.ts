import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const repoRoot = process.cwd();

const appSurfaceFiles = [
  "components/client-intake-screen.tsx",
  "components/committee-review-screen.tsx",
  "components/communication-export-ops-screen.tsx",
  "components/decisions-governance-screen.tsx",
  "components/internal-workflow-screen.tsx",
  "components/kyc-aml-workflow-screen.tsx",
  "components/review-monitoring-screen.tsx",
  "components/suitability-ips-screen.tsx",
  "components/wealth-actions-screen.tsx",
];

function readRepoFile(path: string) {
  return readFileSync(join(repoRoot, path), "utf8");
}

test.describe("surface copy guard", () => {
  test("keeps implementation task ids out of visible app copy", () => {
    for (const file of appSurfaceFiles) {
      const source = readRepoFile(file);

      expect(source, file).not.toMatch(/<Badge[^>]*>\{taskId\}<\/Badge>/);
      expect(source, file).not.toMatch(/UX-WORKBENCH-\d{3}:/);
      expect(source, file).not.toContain("Phase 6 decision room safety recheck");
      expect(source, file).not.toContain(">Detail state<");
      expect(source, file).not.toContain(">Handoff readiness<");
      expect(source, file).not.toContain(">Handoff guard<");
      expect(source, file).not.toMatch(/<Badge[^>]*>(?:WP-?\d+|EPIC-\d+|DOMAIN-[A-Z]|S\d{3}|UX-[A-Z0-9-]+-\d{3}|Contract-backed)<\/Badge>/);
      expect(source, file).not.toMatch(/<Badge[^>]*>\{screenId\}<\/Badge>/);
      expect(source, file).not.toMatch(/<Badge[^>]*>Handoff<\/Badge>/);
      expect(source, file).not.toMatch(/eyebrow="(?:WP\d+|Phase [A-Z]|EPIC-\d+|UX-)[^"]*"/);
      expect(source, file).not.toMatch(/WP\d+ layout only/);
    }
  });

  test("keeps the clean UI rule anchored in source docs and route smoke", () => {
    const agents = readRepoFile("AGENTS.md");
    const handbook = readRepoFile("docs/v3/ALPHAVEST_SURFACE_COPY_HANDBOOK_RULE.md");
    const routeSmoke = readRepoFile("tests/route-smoke.spec.ts");

    expect(agents).toContain("Do not implement spec panels, route labels, filenames, annotation rails, dev notes, callout legends or explanatory documentation as app UI.");
    expect(handbook).toContain("route IDs, route labels, filenames or task IDs");
    expect(routeSmoke).toContain("not.toContainText(/UX-WORKBENCH-\\d{3}/)");
    expect(routeSmoke).toContain("not.toContainText(/UX-(DETAIL|PAGE-SPLIT)-\\d{3}/)");
  });
});
