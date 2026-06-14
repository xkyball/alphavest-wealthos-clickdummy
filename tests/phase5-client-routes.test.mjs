import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const routeImports = {
  "/mobile": ["../app/mobile/page.tsx", "MobileScreenV2"],
  "/mobile/upload": ["../app/mobile/upload/page.tsx", "MobileUploadScreenV2"],
  "/portal": ["../app/portal/page.tsx", "PortalScreenV2"],
  "/wealth-map": ["../app/wealth-map/page.tsx", "WealthMapScreenV2"],
  "/actions": ["../app/actions/page.tsx", "ActionsScreenV2"],
  "/decisions": ["../app/decisions/page.tsx", "DecisionsScreenV2"],
  "/evidence": ["../app/evidence/page.tsx", "EvidenceScreenV2"]
};

test("Phase 5 routes use rebuilt client experience screens", () => {
  for (const [route, [file, component]] of Object.entries(routeImports)) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");

    assert.match(source, new RegExp(component), `${route} does not use ${component}`);
    assert.doesNotMatch(source, /phase3-client-screens/, `${route} still imports the Phase 3 board screen`);
  }
});

test("Phase 5 client component implements the expected user-facing regions", () => {
  const source = readFileSync(new URL("../components/phase5-client-screens.tsx", import.meta.url), "utf8");

  for (const token of [
    "MobileAppSurface",
    "Structure Graph",
    "Kanban",
    "Digital Decision Room",
    "Evidence Vault",
    "Drawer"
  ]) {
    assert.match(source, new RegExp(token));
  }
});

test("mobile routes render only mobile screen content, not a phone frame or visual-board controls", () => {
  const source = readFileSync(new URL("../components/phase5-client-screens.tsx", import.meta.url), "utf8");
  const appShell = readFileSync(new URL("../components/app-shell.tsx", import.meta.url), "utf8");
  const agents = readFileSync(new URL("../AGENTS.md", import.meta.url), "utf8");

  assert.doesNotMatch(source, /WireframePhone/);
  assert.doesNotMatch(source, new RegExp("Phase 5 / V2-"));
  assert.match(source, /useSearchParams/);
  assert.match(appShell, /isMobileAppRoute/);
  assert.match(agents, /For mobile visuals, implement only the content that appears inside the phone screen/);
});
