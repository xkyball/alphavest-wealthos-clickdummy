import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
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

function collectPageSources(baseDir) {
  const entries = readdirSync(baseDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "api") {
      continue;
    }

    const full = join(baseDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectPageSources(full));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (entry.name === "page.tsx") {
      files.push(full);
    }
  }

  return files;
}

function collectPageSourceText() {
  return collectPageSources("app").map((file) => readFileSync(file, "utf8")).join("\n");
}

function assertNoLegacyRouteImports(sourceText, label) {
  const legacyImports = [
    /phase3-client-screens/, 
    /phase4-v2-screens/,
    /Phase3Board/,
    /V2ScreenShell/
  ];

  for (const pattern of legacyImports) {
    assert.ok(
      !pattern.test(sourceText),
      `${label} still imports legacy board/surface scaffolding: ${pattern.toString()}`
    );
  }
}

function source(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

const componentSources = {
  ActionsScreenV2: source("../components/phase5-client-screens.tsx"),
  InternalAdvisorApprovalScreen: source("../components/phase6-internal-screens.tsx"),
  InternalComplianceScreen: source("../components/phase6-internal-screens.tsx"),
  InternalSignalsScreen: source("../components/phase6-internal-screens.tsx"),
  MobileScreenV2: source("../components/phase5-client-screens.tsx"),
  MobileUploadScreenV2: source("../components/phase5-client-screens.tsx"),
  PortalScreenV2: source("../components/phase5-client-screens.tsx"),
  DecisionsScreenV2: source("../components/phase5-client-screens.tsx"),
  EvidenceScreenV2: source("../components/phase5-client-screens.tsx"),
  EvidencePreviewDrawer: source("../components/phase5-client-screens.tsx"),
  WealthMapScreenV2: source("../components/phase5-client-screens.tsx"),
  RuntimeWorkbenchScreen: source("../components/runtime-command-screens.tsx"),
  InternalSignalsScreen: source("../components/phase6-internal-screens.tsx"),
  Phase7GovernanceScreen: source("../components/phase7-governance-screen.tsx"),
  Phase8CommunicationScreen: source("../components/phase8-screens.tsx"),
  Phase8ServiceBlueprintScreen: source("../components/phase8-screens.tsx"),
  Phase8RoadmapScreen: source("../components/phase8-screens.tsx")
};

function getFunctionSource(sourceText, functionName) {
  const marker = `export function ${functionName}`;
  const start = sourceText.indexOf(marker);
  if (start < 0) {
    return "";
  }

  const markers = [...sourceText.matchAll(/export function [A-Za-z0-9_]+/g)].map((match) => match.index ?? -1);
  const next = markers.find((index) => index > start);
  const end = next === undefined ? sourceText.length : next;

  return sourceText.slice(start, end);
}

function hasComponentDefinition(sourceText, componentName) {
  const pattern = new RegExp(
    `export\\s+(?:const|function|class)\\s+${componentName.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}`,
    "s"
  );
  return pattern.test(sourceText);
}

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

test("focused surface overlays are not hard-opened by default", () => {
  for (const entry of registry.filter((item) => item.surfaceType === "focused_surface")) {
    const implementationSource = componentSources[entry.component];

    assert.ok(
      implementationSource,
      `${entry.visualId} (${entry.component}) has no mapped component source`
    );

    const componentSource = getFunctionSource(implementationSource, entry.component);
    const openBindings = [...componentSource.matchAll(/open=\{([a-zA-Z_$][\w$]*)\}/g)];
    for (const [, binding] of openBindings) {
      const openStatePattern = new RegExp(
        `const\\s*\\[\\s*${binding}\\s*,\\s*set[\\w$]*\\s*\\]\\s*=\\s*useState\\(true\\)`,
        "s"
      );

      assert.ok(
        !openStatePattern.test(componentSource),
        `${entry.visualId} (${entry.component}) should not default open overlays to true`
      );
    }
  }
});

test("product and workflow route files do not import legacy board shells", () => {
  assertNoLegacyRouteImports(collectPageSourceText(), "app/page.tsx files");
});

test("surface registry component references are resolvable exports", () => {
  for (const entry of registry) {
    if (entry.surfaceType === "logic_only") {
      continue;
    }

    const implementationSource = componentSources[entry.component];
    assert.ok(implementationSource, `${entry.visualId} references unknown component ${entry.component}`);
    assert.ok(
      hasComponentDefinition(implementationSource, entry.component),
      `${entry.visualId} component ${entry.component} not found in mapped source`
    );
  }
});
