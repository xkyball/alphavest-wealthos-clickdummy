import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { runCaptureQa } from "../scripts/capture-qa-contract";

function pngHeader(width: number, height: number) {
  const buffer = Buffer.alloc(24);
  Buffer.from("89504e470d0a1a0a", "hex").copy(buffer, 0);
  buffer.writeUInt32BE(13, 8);
  buffer.write("IHDR", 12, "ascii");
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
}

function makeTempArtifactRoot() {
  return mkdtempSync(path.join(tmpdir(), "alphavest-capture-qa-"));
}

test.describe("capture QA contract", () => {
  test("validates route capture naming and metadata without generating screens", () => {
    const tempRoot = makeTempArtifactRoot();
    const artifactRoot = path.join(tempRoot, "artifacts");
    const runDir = path.join(artifactRoot, "routes-and-modals", "fixture-run");
    mkdirSync(runDir, { recursive: true });
    writeFileSync(path.join(runDir, "001-route-login-base-base.png"), pngHeader(1440, 1000));
    writeFileSync(
      path.join(runDir, "index.json"),
      JSON.stringify(
        {
          items: [
            {
              captureVariant: {
                fileKind: "screen",
                isOverlay: false,
                lifecycleKind: "base",
              },
              pageId: "001",
              path: "routes-and-modals/fixture-run/001-route-login-base-base.png",
              proofEligibility: {
                status: "supporting_reference",
              },
              route: "/login",
              state: "base",
              status: "captured",
            },
          ],
        },
        null,
        2,
      ),
    );

    const result = runCaptureQa({
      failOnWarnings: false,
      inputRoot: artifactRoot,
      outputDir: path.join(tempRoot, "qa"),
    });

    expect(result.status).toBe("pass");
    expect(result.checkedCaptures).toBe(1);
    expect(result.warnings).toHaveLength(0);
    expect(JSON.parse(readFileSync(path.join(tempRoot, "qa", "capture-qa-report.json"), "utf8")).checkedCaptures).toBe(1);
  });

  test("reports duplicate state clusters and long-screen risk as warnings", () => {
    const tempRoot = makeTempArtifactRoot();
    const artifactRoot = path.join(tempRoot, "artifacts");
    const runDir = path.join(artifactRoot, "strict-visual-review", "fixture-run");
    mkdirSync(path.join(runDir, "desktop"), { recursive: true });
    writeFileSync(path.join(runDir, "desktop", "PAGE-001-login-base-desktop.png"), pngHeader(1440, 3400));
    writeFileSync(
      path.join(runDir, "strict-review-dom-metrics.json"),
      JSON.stringify(
        [
          {
            captureVariant: {
              fileKind: "screen",
              isOverlay: false,
              lifecycleKind: "base",
            },
            metrics: {
              document: {
                clientWidth: 1440,
                scrollHeight: 3400,
                scrollWidth: 1440,
              },
              viewport: {
                height: 1000,
                width: 1440,
              },
            },
            pageId: "001",
            route: "/login",
            screenshot: "desktop/PAGE-001-login-base-desktop.png",
            viewport: "desktop",
          },
          {
            captureVariant: {
              fileKind: "screen",
              isOverlay: false,
              lifecycleKind: "base",
            },
            metrics: {
              document: {
                clientWidth: 1440,
                scrollHeight: 1200,
                scrollWidth: 1440,
              },
              viewport: {
                height: 1000,
                width: 1440,
              },
            },
            pageId: "001",
            route: "/login",
            screenshot: "desktop/PAGE-001-login-base-desktop.png",
            viewport: "desktop",
          },
        ],
        null,
        2,
      ),
    );

    const result = runCaptureQa({
      failOnWarnings: false,
      inputRoot: artifactRoot,
      outputDir: path.join(tempRoot, "qa"),
    });

    expect(result.status).toBe("warning");
    expect(result.duplicateClusters).toHaveLength(1);
    expect(result.longScreenRisks.map((risk) => risk.rule)).toEqual(
      expect.arrayContaining(["long-screen.severe-height", "long-screen.scroll-burden"]),
    );
  });

  test("fails release QA when fresh release-candidate captures are required but absent", () => {
    const tempRoot = makeTempArtifactRoot();
    const artifactRoot = path.join(tempRoot, "artifacts", "release-candidate", "current");

    const result = runCaptureQa({
      failOnWarnings: true,
      inputRoot: artifactRoot,
      outputDir: path.join(tempRoot, "qa"),
      requireCaptures: true,
    });

    expect(result.status).toBe("fail");
    expect(result.checkedCaptures).toBe(0);
    expect(result.failures).toContainEqual(expect.objectContaining({
      rule: "release-candidate.required-captures",
    }));
  });
});
