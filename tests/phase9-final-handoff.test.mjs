import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import vm from "node:vm";

const cache = new Map();

function source(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function loadTsModule(relativePath, dependencies = {}) {
  if (cache.has(relativePath)) {
    return cache.get(relativePath);
  }

  const moduleSource = source(relativePath);
  const transpiled = ts.transpileModule(moduleSource, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    }
  }).outputText;
  const sandbox = {
    exports: {},
    structuredClone,
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
      if (specifier === "./status") {
        return {};
      }
      throw new Error(`Unexpected require: ${specifier}`);
    }
  };
  vm.runInNewContext(transpiled, sandbox, { filename: relativePath });
  cache.set(relativePath, sandbox.exports);
  return sandbox.exports;
}

const audit = loadTsModule("../lib/audit.ts");
const evidence = loadTsModule("../lib/evidence.ts");
const permissions = loadTsModule("../lib/permissions.ts");
const runtime = loadTsModule("../lib/demo-runtime.ts");
const stateMachines = loadTsModule("../lib/state-machines.ts");
const visibility = loadTsModule("../lib/visibility.ts");
const phase5 = loadTsModule("../lib/phase5-client-model.ts");
const phase8 = loadTsModule("../lib/phase8-model.ts");
const surface = loadTsModule("../lib/surface-registry.ts");
const v2Model = loadTsModule("../lib/v2-model.ts");

const routeFiles = {
  "/mobile": ["../app/mobile/page.tsx", "MobileScreenV2"],
  "/mobile/upload": ["../app/mobile/upload/page.tsx", "MobileUploadScreenV2"],
  "/portal": ["../app/portal/page.tsx", "PortalScreenV2"],
  "/wealth-map": ["../app/wealth-map/page.tsx", "WealthMapScreenV2"],
  "/actions": ["../app/actions/page.tsx", "ActionsScreenV2"],
  "/signals": ["../app/signals/page.tsx", "InternalSignalsScreen"],
  "/decisions": ["../app/decisions/page.tsx", "DecisionsScreenV2"],
  "/workbench": ["../app/workbench/page.tsx", "RuntimeWorkbenchScreen"],
  "/advisor-approval": ["../app/advisor-approval/page.tsx", "InternalAdvisorApprovalScreen"],
  "/compliance": ["../app/compliance/page.tsx", "InternalComplianceScreen"],
  "/governance": ["../app/governance/page.tsx", "Phase7GovernanceScreen"],
  "/communication": ["../app/communication/page.tsx", "Phase8CommunicationScreen"],
  "/service-blueprint": ["../app/service-blueprint/page.tsx", "Phase8ServiceBlueprintScreen"],
  "/journey": ["../app/journey/page.tsx", "Phase8ServiceBlueprintScreen"],
  "/roadmap": ["../app/roadmap/page.tsx", "Phase8RoadmapScreen"]
};

test("Phase 9 route smoke coverage includes every required v2 route", () => {
  for (const [route, [file, expectedToken]] of Object.entries(routeFiles)) {
    const routeSource = source(file);
    const metadata = v2Model.getV2Route(route);

    assert.ok(metadata, `${route} is missing v2 route metadata`);
    assert.match(routeSource, new RegExp(expectedToken), `${route} does not render ${expectedToken}`);
    assert.ok(metadata.visualIds.length > 0, `${route} has no visual reference ids`);
  }

  const evidenceRoute = source("../app/evidence/page.tsx");
  assert.match(evidenceRoute, /redirect\("\/portal"\)/);
  assert.equal(v2Model.getV2Route("/evidence"), undefined);
  assert.ok(v2Model.getV2Route("overlay:evidence-preview"));
});

test("Phase 9 visual reference coverage confirms all manifest assets exist", () => {
  const manifest = source("../docs/v2/VISUAL_ASSET_MANIFEST_V2.md");
  const rows = [...manifest.matchAll(/\| (V2-\d{3}) \| [^|]+ \| ([^|]+\.png) \|/g)].map((match) => ({
    id: match[1],
    file: match[2].trim()
  }));
  const registryIds = new Set(surface.surfaceRegistry.map((entry) => entry.visualId));

  assert.equal(rows.length, 56);
  for (const row of rows) {
    const assetUrl = new URL(`../public/reference/visuals_v2/${row.file}`, import.meta.url);
    assert.equal(existsSync(assetUrl), true, `${row.id} asset is missing at ${row.file}`);
    assert.equal(registryIds.has(row.id), true, `${row.id} is missing from the surface registry`);
  }
});

test("Phase 9 client experience source covers required states and interactions", () => {
  const clientSource = source("../components/phase5-client-screens.tsx");

  for (const token of [
    "Recommendation blocked",
    "Select document type",
    "Extraction review",
    "Verification pending",
    "Upload error",
    "href=\"/wealth-map?focus=gaps\"",
    "Structure Graph",
    "Sensitive fields are hidden",
    "Kanban",
    "Mini workflow",
    "Family decision request",
    "Decision room is blocked",
    "A decision record has been created",
    "Evidence Vault",
    "Preview unavailable",
    "Release blocked - critical evidence missing"
  ]) {
    assert.match(clientSource, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Phase 9 internal workflow source covers publish, approval and compliance gates", () => {
  const internalSource = source("../components/phase6-internal-screens.tsx");
  const workbenchSource = source("../components/runtime-command-screens.tsx");

  for (const token of [
    "Trigger review only",
    "Client-Visible Boundary",
    "Approval does not release content to the client",
    "Release or block advice-like output",
    "compliance.released",
    "compliance.blocked"
  ]) {
    assert.match(internalSource, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(workbenchSource, /keep publish disabled/);
  assert.match(workbenchSource, /Preview evidence/);
});

test("Phase 9 governance, communication and reference routes expose expected handoff regions", () => {
  const governanceSource = source("../components/phase7-governance-screen.tsx");
  const phase8Source = source("../components/phase8-screens.tsx");

  for (const token of [
    "Role Permission Matrix",
    "Role Detail",
    "Second Confirmation Required",
    "Permission Blocked",
    "Audit Access History"
  ]) {
    assert.match(governanceSource, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const token of [
    "Communication Decision Tree",
    "Call Trigger Matrix",
    "Client-Visible Message Preview",
    "Evidence and Communication Log",
    "Full Swimlane View",
    "Evidence Chain",
    "Escalation / Returns View",
    "MVP and future scope",
    "Blocked / Not-MVP-Ready Features",
    "Dependency Flow"
  ]) {
    assert.match(phase8Source, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Phase 9 permission and no-unapproved-advice gates reject every missing release requirement", () => {
  const base = {
    advisorApproval: true,
    complianceRelease: true,
    evidenceRecord: true,
    permissionCheck: true,
    outputClassification: "recommendation",
    clientVisibilityState: "released"
  };
  const cases = [
    ["advisorApproval", { advisorApproval: false }],
    ["complianceRelease", { complianceRelease: false }],
    ["evidenceRecordExists", { evidenceRecord: false }],
    ["permissionCheck", { permissionCheck: false }],
    ["releasedState", { clientVisibilityState: "blocked" }]
  ];

  for (const [missingKey, override] of cases) {
    const result = visibility.canShowClientAdviceLikeOutput({
      ...base,
      ...override
    });

    assert.equal(result.clientVisible, false, `${missingKey} should block client visibility`);
    assert.ok(result.missing.includes(missingKey), `${missingKey} missing reason not reported`);
  }

  const advisorOnly = visibility.canShowClientAdviceLikeOutput({
    ...base,
    complianceRelease: false,
    clientVisibilityState: "blocked"
  });
  const analystPermission = permissions.evaluateAccessControl({
    role: "AlphaVest Analyst",
    objectType: "recommendation",
    objectScope: "internal_queue",
    action: "release_to_client",
    sensitivity: "sensitive",
    secondConfirmation: true,
    complianceReview: true
  });

  assert.equal(advisorOnly.clientVisible, false);
  assert.equal(analystPermission.allowed, false);
  assert.equal(analystPermission.blockedReason, "role_denied");
});

test("Phase 9 state machines block invalid client visibility transitions", () => {
  assert.equal(
    stateMachines.canTransition("recommendation", "draft", "client_visible", {
      advisorApproval: true,
      complianceRelease: true,
      evidenceRecordExists: true,
      permissionCheck: true
    }).allowed,
    false
  );
  assert.equal(
    stateMachines.canTransition("communication", "released", "client_sent", {
      advisorApproval: true,
      complianceRelease: false,
      evidenceRecordExists: true,
      permissionCheck: true
    }).reason,
    "client_visibility_gate_failed"
  );
});

test("Phase 9 evidence and audit events exist for the demo handoff lifecycle", () => {
  let snapshot = runtime.createInitialDemoSession();
  assert.ok(snapshot.evidenceRecords.some((record) => record.event === "document.uploaded"));
  assert.ok(snapshot.auditEvents.some((event) => event.action === "document.uploaded"));

  snapshot = runtime.applyDemoTransition(snapshot, {
    action: "document.confirm_extraction",
    actorRole: "AlphaVest Analyst"
  });
  snapshot = runtime.applyDemoTransition(snapshot, {
    action: "advisor.approve",
    actorRole: "Senior Advisor"
  });
  snapshot = runtime.applyDemoTransition(snapshot, {
    action: "compliance.release",
    actorRole: "Compliance Officer"
  });
  snapshot = runtime.applyDemoTransition(snapshot, {
    action: "client.submit_decision",
    actorRole: "Principal",
    choice: "accepted"
  });
  snapshot = runtime.applyDemoTransition(snapshot, {
    action: "access.confirm_sensitive_change",
    actorRole: "Principal"
  });
  snapshot = runtime.applyDemoTransition(snapshot, {
    action: "communication.send",
    actorRole: "Client Success"
  });

  for (const eventName of [
    "extraction.confirmed",
    "advice.approved",
    "compliance.released",
    "decision.submitted",
    "access.changed",
    "communication.sent"
  ]) {
    assert.ok(snapshot.evidenceRecords.some((record) => record.event === eventName), `${eventName} evidence missing`);
    assert.ok(snapshot.auditEvents.some((event) => event.action === eventName), `${eventName} audit missing`);
  }

  const blocked = runtime.applyDemoTransition(runtime.createInitialDemoSession(), {
    action: "compliance.block",
    actorRole: "Compliance Officer"
  });
  assert.ok(blocked.evidenceRecords.some((record) => record.event === "compliance.blocked"));
  assert.ok(blocked.auditEvents.some((event) => event.action === "compliance.blocked"));
});

test("Phase 9 model helpers cover direct evidence, audit, client and communication scenarios", () => {
  const communicationTrigger = phase8.communicationTriggers.find((trigger) => trigger.id === "judgement-call");
  const communicationRelease = phase8.evaluateCommunicationRelease({
    advisorApproval: true,
    complianceRelease: false,
    evidenceRecordExists: true,
    permissionCheck: true,
    clientVisibilityState: "blocked"
  });
  const evidenceRecord = evidence.evidenceForEvent("call.scheduled", {
    actorRole: "Senior Advisor",
    objectId: "call-trust-x"
  });
  const auditEvent = audit.auditEventForAction({
    actorRole: "Senior Advisor",
    action: "call.scheduled",
    objectType: "Call Schedule",
    objectId: "call-trust-x",
    result: "created"
  });

  assert.equal(phase5.canShowAdviceLikeContent(phase5.blockedRecommendation), false);
  assert.equal(phase5.canShowAdviceLikeContent(phase5.releasedRecommendation), true);
  assert.equal(phase8.selectCommunicationRoute(communicationTrigger), "schedule-call");
  assert.equal(communicationRelease.clientVisible, false);
  assert.equal(evidenceRecord.link, "evidence://call-schedule/call-trust-x");
  assert.equal(auditEvent.evidenceLink, "evidence://call-schedule/call-trust-x");
});
