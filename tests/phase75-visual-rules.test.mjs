import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const presentationRoute = "../app/presentation/page.tsx";
const workbenchRoute = "../app/workbench/page.tsx";
const runtimeScreens = "../components/runtime-command-screens.tsx";
const internalScreens = "../components/phase6-internal-screens.tsx";

test("presentation and workbench use app surfaces, not visual-board components", () => {
  const presentation = readFileSync(new URL(presentationRoute, import.meta.url), "utf8");
  const workbench = readFileSync(new URL(workbenchRoute, import.meta.url), "utf8");

  assert.match(presentation, /RuntimePresentationScreen/);
  assert.match(workbench, /RuntimeWorkbenchScreen/);

  for (const source of [presentation, workbench]) {
    assert.doesNotMatch(source, /phase3-client-screens/);
    assert.doesNotMatch(source, /phase4-v2-screens/);
    assert.doesNotMatch(source, /import \{ PresentationScreen \}/);
    assert.doesNotMatch(source, /<PresentationScreen/);
    assert.doesNotMatch(source, /WorkbenchV2Screen/);
  }
});

test("runtime command screens do not render board chrome or reference metadata", () => {
  const source = readFileSync(new URL(runtimeScreens, import.meta.url), "utf8");

  for (const forbidden of [
    /PageHeader/,
    /Phase3Board/,
    /V2ScreenShell/,
    /RightAnnotationPanel/,
    /BottomWorkflowStrip/,
    /Wireframe System/,
    /Board /,
    /V2-/,
    /visualIds/,
    /spec\.domain/,
    /spec\.priority/,
    /GateSummary/
  ]) {
    assert.doesNotMatch(source, forbidden);
  }

  assert.match(source, /useDemoSession/);
  assert.match(source, /Advice Visibility Gate/);
  assert.match(source, /Priority Work Queue/);
});

test("implemented internal workflow routes use app surfaces, not legacy board shells", () => {
  const routeFiles = [
    "../app/signals/page.tsx",
    "../app/advisor-approval/page.tsx",
    "../app/compliance/page.tsx"
  ];
  const source = readFileSync(new URL(internalScreens, import.meta.url), "utf8");

  for (const file of routeFiles) {
    const route = readFileSync(new URL(file, import.meta.url), "utf8");

    assert.match(route, /phase6-internal-screens/);
    assert.doesNotMatch(route, /phase3-client-screens/);
    assert.doesNotMatch(route, /phase4-v2-screens/);
  }

  for (const forbidden of [
    /Phase3Board/,
    /V2ScreenShell/,
    /PageHeader/,
    /RightAnnotationPanel/,
    /BottomWorkflowStrip/,
    /WireframePhone/,
    /visualIds/
  ]) {
    assert.doesNotMatch(source, forbidden);
  }

  assert.match(source, /Signal and trigger review/);
  assert.match(source, /Advisor approval/);
  assert.match(source, /Compliance console/);
});
