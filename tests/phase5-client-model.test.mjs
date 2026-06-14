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
      if (specifier === "./status") {
        return {};
      }
      throw new Error(`Unexpected require: ${specifier}`);
    }
  };
  vm.runInNewContext(transpiled, sandbox, { filename: relativePath });
  return sandbox.exports;
}

const v2Model = loadTsModule("../lib/v2-model.ts");
const phase5 = loadTsModule("../lib/phase5-client-model.ts", {
  "./v2-model": v2Model
});

test("/mobile recommendation blocked state cannot expose advice-like content", () => {
  assert.equal(phase5.canShowAdviceLikeContent(phase5.blockedRecommendation), false);
  assert.deepEqual(Array.from(phase5.blockedDecisionRelease.missing), [
    "complianceRelease",
    "releasedState"
  ]);
});

test("/mobile released state requires advisor, compliance, evidence and permission gates", () => {
  assert.equal(phase5.canShowAdviceLikeContent(phase5.releasedRecommendation), true);
  assert.equal(phase5.decisionRelease.badge, "CLIENT");
});

test("/mobile/upload supports select, extraction review, verification pending, low confidence and retry states", () => {
  const source = readFileSync(new URL("../components/phase5-client-screens.tsx", import.meta.url), "utf8");

  for (const token of [
    "Select document type",
    "Extraction review",
    "Verification pending",
    "Low confidence extraction blocked submission",
    "Upload error",
    "Route to analyst review"
  ]) {
    assert.match(source, new RegExp(token));
  }
});

test("low confidence upload blocks submission through analyst review copy and blocked badge", () => {
  const source = readFileSync(new URL("../components/phase5-client-screens.tsx", import.meta.url), "utf8");

  assert.match(source, /Confidence is 61%/);
  assert.match(source, /WorkflowBadge label="BLOCKED"/);
  assert.match(source, /href="\/workbench"/);
});

test("/portal readiness score routes to wealth map focused gaps", () => {
  const source = readFileSync(new URL("../components/phase5-client-screens.tsx", import.meta.url), "utf8");

  assert.match(source, /href="\/wealth-map\?focus=gaps"/);
  assert.match(source, /Visibility score is not advice/);
});

test("/wealth-map restricted node hides sensitive fields for restricted roles", () => {
  const access = phase5.sensitiveNodeAccess("Next Gen");

  assert.equal(access.allowed, false);
  assert.equal(access.reason, "role_denied");
});

test("/actions contains detail drawer and blocked missing evidence state", () => {
  const blockedAction = phase5.clientActions.find((action) => action.status === "Blocked");

  assert.equal(blockedAction.evidenceStatus, "Missing");
  assert.equal(blockedAction.title, "Upload updated trust deed");
});

test("/decisions blocks missing permission and creates evidence/audit after submission", () => {
  const permission = phase5.decisionPermission("External Advisor");
  const audit = phase5.decisionSubmissionAudit("accepted");

  assert.equal(permission.allowed, false);
  assert.equal(permission.reason, "relationship_denied");
  assert.equal(audit.action, "decision.submitted");
  assert.match(audit.evidenceLink, /^evidence:\/\/decision-record\/trust-x-accepted$/);
});

test("/evidence preview respects restricted state and exposes missing evidence escalation data", () => {
  const restricted = phase5.evidenceRecords.find((record) => record.restricted);
  const missing = phase5.evidenceRecords.find((record) => record.status === "Missing");
  const denied = phase5.evidenceAccess(restricted, "Next Gen");

  assert.equal(denied.allowed, false);
  assert.equal(restricted.visibility, "Internal Only");
  assert.equal(missing.status, "Missing");
});
