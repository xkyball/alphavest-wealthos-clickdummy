import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  pilotCriticalEventControlFor,
  pilotCriticalEventControls,
  pilotEnvironmentBoundaries,
} from "../lib/pilot-operational-readiness";

function readWorkspaceText(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test.describe("V1.0 pilot operational readiness", () => {
  test("locks local and container environments to demo data by default", () => {
    const envExample = readWorkspaceText(".env.example");
    const dockerCompose = readWorkspaceText("docker-compose.yml");
    const dockerfile = readWorkspaceText("Dockerfile");

    for (const source of [envExample, dockerCompose, dockerfile]) {
      expect(source).toContain("ALPHAVEST_DATA_MODE");
      expect(source).toContain("ALPHAVEST_REAL_CLIENT_DATA_ALLOWED");
    }

    expect(envExample).toContain("ALPHAVEST_DATA_MODE=demo");
    expect(envExample).toContain("ALPHAVEST_REAL_CLIENT_DATA_ALLOWED=false");
    expect(envExample).toContain("ALPHAVEST_PILOT_RELEASE_STAGE=local_demo");
    expect(dockerCompose).toContain("ALPHAVEST_PILOT_RELEASE_STAGE: ${ALPHAVEST_PILOT_RELEASE_STAGE:-docker_demo}");
    expect(dockerfile).toContain("ENV ALPHAVEST_DATA_MODE=demo");
  });

  test("keeps the seed path demo-only and blocked for production-like data modes", () => {
    const seed = readWorkspaceText("prisma/seed.ts");

    expect(seed).toContain("ALPHAVEST_REAL_CLIENT_DATA_ALLOWED");
    expect(seed).toContain("ALPHAVEST_DATA_MODE");
    expect(seed).toContain("Phase 03 seed is demo-only");
    expect(seed).toContain("ALPHAVEST_ALLOW_DEMO_SEED_OUTSIDE_DEMO");
    expect(seed).toContain('appEnv === "production"');
  });

  test("documents release, rollback and support paths without GA or real-data claims", () => {
    const releaseRunbook = readWorkspaceText("docs/V1_0_RELEASE_RUNBOOK.md");
    const pilotRunbook = readWorkspaceText("docs/V1_0_PILOT_RUNBOOK.md");

    expect(releaseRunbook).toContain("Build And Deploy Checklist");
    expect(releaseRunbook).toContain("Rollback");
    expect(releaseRunbook).toContain("Go / No-Go");
    expect(releaseRunbook).toContain("This is not GA.");
    expect(releaseRunbook).toContain("ALPHAVEST_REAL_CLIENT_DATA_ALLOWED=false");

    expect(pilotRunbook).toContain("Support Path");
    expect(pilotRunbook).toContain("Critical Monitoring Signals");
    expect(pilotRunbook).toContain("Incident Response");
    expect(pilotRunbook).toContain("Evidence Preservation");
    expect(pilotRunbook).toContain("No real client data may be entered");
  });

  test("defines critical monitoring signals without sensitive payload logging", () => {
    expect(pilotEnvironmentBoundaries).toEqual({
      allowedDataMode: "demo",
      productionClaim: "not_ga_not_production_ready",
      realClientDataAllowed: false,
      releaseStages: ["local_demo", "docker_demo", "closed_pilot_demo"],
    });
    expect(pilotCriticalEventControls.map((control) => control.key)).toEqual([
      "DENIED_ACTION",
      "UPLOAD_FAILURE",
      "AUDIT_FAILURE",
      "EXPORT_FAILURE",
      "RELEASE_ATTEMPT",
    ]);

    for (const control of pilotCriticalEventControls) {
      expect(control.safeSignal).toContain("correlation id");
      expect(control.mustNotLog).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/rawPayload|documentBytes|internalRationale|aiDraft|unredactedExport|extractedText/),
        ]),
      );
    }

    expect(pilotCriticalEventControlFor("AUDIT_FAILURE")).toMatchObject({
      owner: "ops",
      severity: "P1",
    });
    expect(pilotCriticalEventControlFor("RELEASE_ATTEMPT")).toMatchObject({
      owner: "compliance",
      severity: "P1",
    });
  });
});
