import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import vm from "node:vm";

const cache = new Map();

function loadTsModule(relativePath, dependencies = {}) {
  if (cache.has(relativePath)) {
    return cache.get(relativePath);
  }

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
      if (specifier === "./roles") {
        return loadTsModule("../lib/roles.ts");
      }
      if (specifier === "./permissions") {
        return loadTsModule("../lib/permissions.ts", {
          "./roles": loadTsModule("../lib/roles.ts")
        });
      }
      if (specifier === "./evidence") {
        return loadTsModule("../lib/evidence.ts", {
          "./roles": loadTsModule("../lib/roles.ts")
        });
      }
      if (specifier === "./audit") {
        return loadTsModule("../lib/audit.ts", {
          "./evidence": loadTsModule("../lib/evidence.ts", {
            "./roles": loadTsModule("../lib/roles.ts")
          }),
          "./roles": loadTsModule("../lib/roles.ts")
        });
      }
      if (specifier === "./state-machines") {
        return loadTsModule("../lib/state-machines.ts");
      }
      if (specifier === "./visibility") {
        return loadTsModule("../lib/visibility.ts", {
          "./permissions": loadTsModule("../lib/permissions.ts", {
            "./roles": loadTsModule("../lib/roles.ts")
          })
        });
      }
      throw new Error(`Unexpected require: ${specifier}`);
    }
  };
  vm.runInNewContext(transpiled, sandbox, { filename: relativePath });
  cache.set(relativePath, sandbox.exports);
  return sandbox.exports;
}

const phase8 = loadTsModule("../lib/phase8-model.ts");

test("/communication uses Phase 8 communication screen and loads decision tree", () => {
  const page = readFileSync(new URL("../app/communication/page.tsx", import.meta.url), "utf8");
  const source = readFileSync(new URL("../components/phase8-screens.tsx", import.meta.url), "utf8");

  assert.match(page, /Phase8CommunicationScreen/);
  assert.match(source, /Communication Decision Tree/);
  assert.match(source, /Call Trigger Matrix/);
  assert.match(source, /Client-Visible Message Preview/);
  assert.match(source, /fixed inset-0 z-40/);
  assert.match(source, /Back to communication workflow/);
  assert.match(source, /Evidence and Communication Log/);
});

test("selecting a trigger path updates recommendation route", () => {
  const workshop = phase8.communicationTriggers.find(
    (trigger) => trigger.id === "family-conflict"
  );
  const specialist = phase8.communicationTriggers.find(
    (trigger) => trigger.id === "tax-legal-specialist"
  );

  assert.equal(phase8.selectCommunicationRoute(workshop), "f2f-workshop");
  assert.equal(phase8.selectCommunicationRoute(specialist), "external-specialist");
});

test("message preview remains blocked until required approvals complete", () => {
  const blockedPermission = phase8.permissionForCommunicationSend(
    "Client Success",
    false
  );
  const blocked = phase8.evaluateCommunicationRelease({
    advisorApproval: true,
    complianceRelease: false,
    evidenceRecordExists: true,
    permissionCheck: blockedPermission,
    clientVisibilityState: "blocked"
  });
  const allowedPermission = phase8.permissionForCommunicationSend(
    "Client Success",
    true
  );
  const released = phase8.evaluateCommunicationRelease({
    advisorApproval: true,
    complianceRelease: true,
    evidenceRecordExists: true,
    permissionCheck: allowedPermission,
    clientVisibilityState: "released"
  });

  assert.equal(blocked.clientVisible, false);
  assert.ok(blocked.missing.includes("complianceRelease"));
  assert.equal(released.clientVisible, true);
});

test("communication evidence log displays event history", () => {
  const trigger = phase8.communicationTriggers[2];
  const events = phase8.communicationLifecycleEvents(trigger);

  assert.ok(events.some((event) => event.event === "communication.drafted"));
  assert.ok(events.some((event) => event.event === "advice.approved"));
  assert.ok(events.some((event) => event.event === "call.scheduled"));
  assert.ok(events.some((event) => event.evidence.includes("evidence://")));
});

test("/service-blueprint loads swimlane, evidence chain and escalation reference views", () => {
  const page = readFileSync(new URL("../app/service-blueprint/page.tsx", import.meta.url), "utf8");
  const journey = readFileSync(new URL("../app/journey/page.tsx", import.meta.url), "utf8");
  const source = readFileSync(new URL("../components/phase8-screens.tsx", import.meta.url), "utf8");

  assert.match(page, /Phase8ServiceBlueprintScreen/);
  assert.match(journey, /Phase8ServiceBlueprintScreen/);
  assert.match(source, /Full Swimlane View/);
  assert.match(source, /Evidence Chain/);
  assert.match(source, /Escalation \/ Returns View/);
});

test("/roadmap loads MVP Phase 2 Future columns, blocked features and dependency flow", () => {
  const page = readFileSync(new URL("../app/roadmap/page.tsx", import.meta.url), "utf8");
  const source = readFileSync(new URL("../components/phase8-screens.tsx", import.meta.url), "utf8");

  assert.match(page, /Phase8RoadmapScreen/);
  assert.match(source, /MVP and future scope/);
  assert.match(source, /Blocked \/ Not-MVP-Ready Features/);
  assert.match(source, /Dependency Flow/);
  assert.equal(
    JSON.stringify(phase8.roadmapColumns.map((column) => column.title)),
    JSON.stringify(["MVP", "Phase 2", "Future"])
  );
  assert.ok(phase8.blockedFeatures.length >= 4);
  assert.ok(phase8.roadmapDependencies.length >= 5);
});

test("reference screens are marked internal reference", () => {
  assert.equal(phase8.isReferenceRoute("/service-blueprint"), true);
  assert.equal(phase8.isReferenceRoute("/journey"), true);
  assert.equal(phase8.isReferenceRoute("/roadmap"), true);

  const source = readFileSync(new URL("../components/phase8-screens.tsx", import.meta.url), "utf8");

  assert.match(source, /Internal \/ reference/);
  assert.match(source, /Not client-facing/);
  assert.doesNotMatch(source, /DEV HANDOFF/);
  assert.doesNotMatch(source, /ASSET ID/);
});
