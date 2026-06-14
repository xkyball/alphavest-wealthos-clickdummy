import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import vm from "node:vm";

function loadV2Model() {
  const source = readFileSync(new URL("../lib/v2-model.ts", import.meta.url), "utf8");
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
      if (specifier === "./status") {
        return {};
      }
      throw new Error(`Unexpected require: ${specifier}`);
    }
  };
  vm.runInNewContext(transpiled, sandbox, { filename: "v2-model.js" });
  return sandbox.exports;
}

const model = loadV2Model();

test("all primary routes map to v2 route metadata and visual ids", () => {
  const routePaths = model.v2Routes.map((route) => route.path);

  for (const path of [
    "/mobile",
    "/mobile/upload",
    "/portal",
    "/wealth-map",
    "/actions",
    "/decisions",
    "/workbench",
    "/advisor-approval",
    "/compliance",
    "/governance",
    "/communication"
  ]) {
    assert.ok(routePaths.includes(path), `${path} is missing`);
    assert.ok(model.getV2Route(path).visualIds.length > 0, `${path} has no visual mapping`);
  }
});

test("advisor approval alone does not release advice to the client", () => {
  const visibility = model.evaluateClientVisibility({
    advisorApproval: true,
    complianceRelease: false,
    evidenceRecordExists: true,
    permissionCheck: true,
    clientVisibilityState: "blocked"
  });

  assert.equal(visibility.clientVisible, false);
  assert.equal(visibility.badge, "BLOCKED");
  assert.ok(visibility.missing.includes("complianceRelease"));
});

test("client visibility requires all release gates", () => {
  const visibility = model.evaluateClientVisibility({
    advisorApproval: true,
    complianceRelease: true,
    evidenceRecordExists: true,
    permissionCheck: true,
    clientVisibilityState: "released"
  });

  assert.equal(visibility.clientVisible, true);
  assert.equal(visibility.badge, "CLIENT");
});

test("sensitive permission changes require second confirmation", () => {
  const blocked = model.evaluatePermission({
    role: "Principal",
    action: "grant_external_access",
    objectSensitive: true,
    secondConfirmation: false
  });
  const allowed = model.evaluatePermission({
    role: "Principal",
    action: "grant_external_access",
    objectSensitive: true,
    secondConfirmation: true
  });

  assert.equal(blocked.allowed, false);
  assert.equal(blocked.reason, "second_confirmation_required");
  assert.equal(allowed.allowed, true);
});

test("restricted roles cannot grant external access", () => {
  const result = model.evaluatePermission({
    role: "External Advisor",
    action: "grant_external_access",
    objectSensitive: true,
    secondConfirmation: true
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "role_denied");
});

test("audit events contain evidence links", () => {
  const evidenceLink = model.createEvidenceLink("Decision Record", "decision-1");
  const event = model.createAuditEvent({
    actorRole: "Principal",
    action: "decision.submitted",
    objectType: "Decision Record",
    objectId: "decision-1",
    result: "created",
    evidenceLink
  });

  assert.equal(event.evidenceLink, "evidence://decision-record/decision-1");
  assert.equal(event.action, "decision.submitted");
});
