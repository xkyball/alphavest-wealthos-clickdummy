import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { activeJourneyDefinitions } from "../lib/journeys/journey-registry";

const root = process.cwd();
const retiredPaths = [
  "docs/v3/journeys.screencast.v3.json",
  "docs/v3/journeys.screencast.p0.v3.json",
  "docs/v3/journeys.screencast.p1.v3.json",
  "docs/v3/journeys.screencast.p2.v3.json",
  "docs/v3/DEMO_JOURNEY_LEGACY_TO_PORTFOLIO_MAP_V3.json",
  "docs/v3/DEMO_JOURNEY_OPPORTUNITY_BACKLOG_V3.json",
  "lib/screencast-demo-client.ts",
  "scripts/screencast/generate-portfolio-manifests.ts",
  "scripts/screencast/lib/journey-fixtures.ts",
];

function readJson(relativePath: string) {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8")) as {
    journeys?: Array<{ id?: string; proofPath?: string[]; sourceProof?: string[]; steps?: Array<Record<string, unknown>> }>;
    manifestId?: string;
    sourcePlaybook?: string;
  };
}

test.describe("new-system screencast contract", () => {
  test("keeps active screencasts on the Journey Spine instead of retired Jxx demo workflow manifests", () => {
    const manifest = readJson("docs/v3/journeys.screencast.new-system.json");
    const serialized = JSON.stringify(manifest);

    expect(manifest.manifestId).toBe("journeys.screencast.new-system");
    expect(manifest.sourcePlaybook).toBe("lib/journeys/journey-registry.ts");
    expect(manifest.journeys?.map((journey) => journey.id)).toEqual([
      ...activeJourneyDefinitions.map((definition) => definition.journeyKey),
      "MJ-HOLD-LOCKS",
    ]);
    expect(serialized).not.toMatch(/\bJ\d{2}\b/);
    expect(serialized).not.toContain("fixture-j");
    expect(serialized).not.toContain("/api/demo-workflow");
    expect(serialized).toContain("/api/journeys/[id]/commands/route.ts");
  });

  test("removes retired screencast compatibility sources from the active repo", () => {
    for (const relativePath of retiredPaths) {
      expect(existsSync(path.join(root, relativePath)), relativePath).toBe(false);
    }
  });

  test("package scripts route screencast execution through the new-system manifest only", () => {
    const packageJson = readJson("package.json") as { scripts: Record<string, string> };
    const screencastScripts = Object.entries(packageJson.scripts).filter(([name]) => name.startsWith("screencast:"));
    const serializedScripts = JSON.stringify(Object.fromEntries(screencastScripts));

    expect(packageJson.scripts["screencast:all"]).toContain("docs/v3/journeys.screencast.new-system.json");
    expect(packageJson.scripts["screencast:dry-run"]).toContain("docs/v3/journeys.screencast.new-system.json");
    expect(packageJson.scripts["screencast:generate"]).toBe("tsx scripts/screencast/generate-new-system-manifest.ts");
    expect(serializedScripts).not.toMatch(/screencast:p[0-9]/);
    expect(serializedScripts).not.toContain("generate-portfolio-manifests");
    expect(serializedScripts).not.toContain("seed-journey");
    expect(serializedScripts).not.toContain("journeys.screencast.p");
  });
});
