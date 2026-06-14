import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const presentationRoute = "../app/presentation/page.tsx";
const workbenchRoute = "../app/workbench/page.tsx";
const runtimeScreens = "../components/runtime-command-screens.tsx";

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
