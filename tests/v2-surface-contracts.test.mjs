import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import vm from "node:vm";

function loadTsModule(relativePath, dependencies = {}) {
  const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    }
  }).outputText;
  const sandbox = {
    exports: {},
    require(specifier) {
      if (dependencies[specifier]) {
        return dependencies[specifier];
      }
      throw new Error(`Unexpected require: ${specifier}`);
    }
  };
  vm.runInNewContext(transpiled, sandbox, { filename: relativePath });
  return sandbox.exports;
}

const surface = loadTsModule("../lib/surface-registry.ts");
const v2Model = loadTsModule("../lib/v2-model.ts", { "./status": {} });
const registry = surface.surfaceRegistry;

function source(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

const componentSources = {
  ActionsScreenV2: source("../components/phase5-client-screens.tsx"),
  DecisionsScreenV2: source("../components/phase5-client-screens.tsx"),
  EvidencePreviewDrawer: source("../components/phase5-client-screens.tsx"),
  WealthMapScreenV2: source("../components/phase5-client-screens.tsx"),
  RuntimeWorkbenchScreen: source("../components/runtime-command-screens.tsx"),
  Phase7GovernanceScreen: source("../components/phase7-governance-screen.tsx"),
  Phase8CommunicationScreen: source("../components/phase8-screens.tsx")
};

test("surface registry covers every V2 visual asset exactly once", () => {
  const manifest = source("../docs/v2/VISUAL_ASSET_MANIFEST_V2.md");
  const manifestIds = [...manifest.matchAll(/\| (V2-\d{3}) \|/g)].map((match) => match[1]);
  const registryIds = registry.map((entry) => entry.visualId);

  assert.equal(registryIds.length, manifestIds.length);
  assert.deepEqual([...new Set(registryIds)].sort(), [...new Set(manifestIds)].sort());
  assert.equal(new Set(registryIds).size, registryIds.length);
});

test("focused surfaces use surface keys and cannot become standalone product routes", () => {
  const focused = registry.filter((entry) => entry.surfaceType === "focused_surface");

  assert.ok(focused.length >= 12);
  for (const entry of focused) {
    assert.ok(entry.surfaceKey, `${entry.visualId} is missing a surface key`);
    assert.equal(entry.directNavigationAllowed, false, `${entry.visualId} allows direct standalone navigation`);
    assert.ok(entry.entryPoints.length > 0, `${entry.visualId} has no contextual entry point`);
    assert.ok(entry.regionTokens.length > 0, `${entry.visualId} has no visual-region token guard`);
  }
});

test("route metadata is backed by the surface registry and reference routes are marked", () => {
  const registryIds = new Set(registry.map((entry) => entry.visualId));

  for (const route of v2Model.v2Routes) {
    for (const visualId of route.visualIds) {
      assert.ok(registryIds.has(visualId), `${route.path} references unregistered ${visualId}`);
    }
  }

  for (const path of ["/service-blueprint", "/journey", "/roadmap"]) {
    const route = v2Model.getV2Route(path);

    assert.ok(route, `${path} is missing from v2 route metadata`);
    assert.equal(route.referenceOnly, true, `${path} is not marked referenceOnly`);
  }

  assert.equal(v2Model.getV2Route("/evidence"), undefined);
  assert.ok(v2Model.getV2Route("overlay:evidence-preview"));
});

test("focused surface compatibility URLs redirect to safe parent contexts", () => {
  const compatibilityEntries = registry.filter((entry) => entry.compatibilityRoute);

  assert.ok(compatibilityEntries.some((entry) => entry.compatibilityRoute === "/evidence"));
  for (const entry of compatibilityEntries) {
    assert.ok(entry.compatibilityRedirect, `${entry.visualId} has no compatibility redirect`);

    if (entry.compatibilityRoute === "/evidence") {
      const routeSource = source("../app/evidence/page.tsx");

      assert.match(routeSource, /redirect\("\/portal"\)/);
      assert.equal(entry.compatibilityRedirect, "/portal");
    }
  }
});

test("workflow components do not link to focused surface compatibility routes", () => {
  const workflowSources = [
    source("../components/phase5-client-screens.tsx"),
    source("../components/runtime-command-screens.tsx"),
    source("../components/phase6-internal-screens.tsx"),
    source("../components/phase7-governance-screen.tsx"),
    source("../components/phase8-screens.tsx")
  ].join("\n");

  assert.doesNotMatch(workflowSources, /href="\/evidence"/);
});

test("focused surfaces include their required visual-region tokens", () => {
  for (const entry of registry.filter((item) => item.surfaceType === "focused_surface")) {
    const implementationSource = componentSources[entry.component];

    assert.ok(implementationSource, `${entry.visualId} has no mapped component source`);
    for (const token of entry.regionTokens) {
      assert.match(
        implementationSource,
        new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
        `${entry.visualId} missing token: ${token}`
      );
    }
  }
});

test("product and workflow route files do not import legacy board shells", () => {
  const appRouteSources = [
    "../app/mobile/page.tsx",
    "../app/mobile/upload/page.tsx",
    "../app/portal/page.tsx",
    "../app/wealth-map/page.tsx",
    "../app/actions/page.tsx",
    "../app/decisions/page.tsx",
    "../app/signals/page.tsx",
    "../app/workbench/page.tsx",
    "../app/advisor-approval/page.tsx",
    "../app/compliance/page.tsx",
    "../app/governance/page.tsx",
    "../app/communication/page.tsx"
  ].map(source).join("\n");

  assert.doesNotMatch(appRouteSources, /phase3-client-screens/);
  assert.doesNotMatch(appRouteSources, /phase4-v2-screens/);
  assert.doesNotMatch(appRouteSources, /Phase3Board/);
  assert.doesNotMatch(appRouteSources, /V2ScreenShell/);
});
