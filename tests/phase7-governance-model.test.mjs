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
        return loadTsModule("../lib/permissions.ts", { "./roles": loadTsModule("../lib/roles.ts") });
      }
      if (specifier === "./evidence") {
        return loadTsModule("../lib/evidence.ts", { "./roles": loadTsModule("../lib/roles.ts") });
      }
      if (specifier === "./audit") {
        return loadTsModule("../lib/audit.ts", {
          "./evidence": loadTsModule("../lib/evidence.ts", { "./roles": loadTsModule("../lib/roles.ts") }),
          "./roles": loadTsModule("../lib/roles.ts")
        });
      }
      if (specifier === "./visibility") {
        return loadTsModule("../lib/visibility.ts", {
          "./permissions": loadTsModule("../lib/permissions.ts", { "./roles": loadTsModule("../lib/roles.ts") })
        });
      }
      throw new Error(`Unexpected require: ${specifier}`);
    }
  };
  vm.runInNewContext(transpiled, sandbox, { filename: relativePath });
  cache.set(relativePath, sandbox.exports);
  return sandbox.exports;
}

const permissions = loadTsModule("../lib/permissions.ts", {
  "./roles": loadTsModule("../lib/roles.ts")
});
const visibility = loadTsModule("../lib/visibility.ts", {
  "./permissions": permissions
});
const evidence = loadTsModule("../lib/evidence.ts", {
  "./roles": loadTsModule("../lib/roles.ts")
});
const audit = loadTsModule("../lib/audit.ts", {
  "./evidence": evidence,
  "./roles": loadTsModule("../lib/roles.ts")
});
const stateMachines = loadTsModule("../lib/state-machines.ts");

test("permission helper allows and denies based on role object and action", () => {
  const allowed = permissions.evaluateAccessControl({
    role: "Principal",
    objectType: "permission",
    objectScope: "family",
    action: "manage_permissions",
    sensitivity: "standard",
    secondConfirmation: true,
    complianceReview: true
  });
  const denied = permissions.evaluateAccessControl({
    role: "External Advisor",
    objectType: "permission",
    objectScope: "family",
    action: "manage_permissions",
    sensitivity: "standard",
    secondConfirmation: true,
    complianceReview: true
  });

  assert.equal(allowed.allowed, true);
  assert.equal(denied.allowed, false);
  assert.equal(denied.blockedReason, "role_denied");
});

test("second confirmation is required for sensitive changes", () => {
  const result = permissions.evaluateAccessControl({
    role: "Principal",
    objectType: "permission",
    objectScope: "selected_accounts",
    action: "grant_external_access",
    sensitivity: "high_risk",
    secondConfirmation: false,
    complianceReview: true
  });

  assert.equal(result.allowed, false);
  assert.equal(result.secondConfirmationRequired, true);
  assert.equal(result.blockedReason, "second_confirmation_required");
});

test("advisor approval alone and compliance release without evidence cannot unlock client visibility", () => {
  const advisorOnly = visibility.canShowClientAdviceLikeOutput({
    advisorApproval: true,
    complianceRelease: false,
    evidenceRecord: true,
    permissionCheck: true,
    outputClassification: "recommendation",
    clientVisibilityState: "blocked"
  });
  const noEvidence = visibility.canShowClientAdviceLikeOutput({
    advisorApproval: true,
    complianceRelease: true,
    evidenceRecord: false,
    permissionCheck: true,
    outputClassification: "decision_pack",
    clientVisibilityState: "released"
  });

  assert.equal(advisorOnly.clientVisible, false);
  assert.ok(advisorOnly.missing.includes("complianceRelease"));
  assert.equal(noEvidence.clientVisible, false);
  assert.ok(noEvidence.missing.includes("evidenceRecordExists"));
});

test("permission denied blocks decision view", () => {
  const permission = permissions.evaluateAccessControl({
    role: "External Advisor",
    objectType: "decision",
    objectScope: "family",
    action: "create_decision",
    sensitivity: "standard",
    relationshipAllowed: false
  });

  assert.equal(permission.allowed, false);
  assert.equal(permission.blockedReason, "role_denied");
});

test("evidence and audit events are created for decisions and permission changes", () => {
  const decisionEvidence = evidence.evidenceForEvent("decision.submitted", {
    actorRole: "Principal",
    objectId: "trust-x-accepted"
  });
  const permissionAudit = audit.auditEventForAction({
    actorRole: "Principal",
    action: "access.changed",
    objectType: "Access Change Record",
    objectId: "access-772",
    result: "updated"
  });

  assert.equal(decisionEvidence.event, "decision.submitted");
  assert.equal(decisionEvidence.link, "evidence://decision-record/trust-x-accepted");
  assert.equal(permissionAudit.action, "access.changed");
  assert.equal(permissionAudit.evidenceLink, "evidence://access-change-record/access-772");
  assert.ok(permissionAudit.digitalSeal);
});

test("central state machine transitions reject invalid transitions", () => {
  const invalid = stateMachines.canTransition("recommendation", "draft", "client_visible", {
    advisorApproval: true,
    complianceRelease: true,
    evidenceRecordExists: true,
    permissionCheck: true
  });
  const gated = stateMachines.canTransition("communication", "released", "client_sent", {
    advisorApproval: true,
    complianceRelease: false,
    evidenceRecordExists: true,
    permissionCheck: true
  });

  assert.equal(invalid.allowed, false);
  assert.equal(invalid.reason, "invalid_transition");
  assert.equal(gated.allowed, false);
  assert.equal(gated.reason, "client_visibility_gate_failed");
});

test("/governance displays blocked state, second confirmation, role detail and audit access history", () => {
  const page = readFileSync(new URL("../app/governance/page.tsx", import.meta.url), "utf8");
  const source = readFileSync(new URL("../components/phase7-governance-screen.tsx", import.meta.url), "utf8");

  assert.match(page, /Phase7GovernanceScreen/);
  for (const token of [
    "Role Permission Matrix",
    "Role Detail",
    "Second Confirmation Required",
    "Permission Blocked",
    "Audit Access History",
    "access.changed",
    "access.blocked"
  ]) {
    assert.match(source, new RegExp(token));
  }
  assert.doesNotMatch(source, /ASSET ID/);
  assert.doesNotMatch(source, /DEV HANDOFF/);
});
