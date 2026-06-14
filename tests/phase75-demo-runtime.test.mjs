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
    structuredClone,
    require(specifier) {
      if (dependencies[specifier]) {
        return dependencies[specifier];
      }
      if (specifier === "./roles") {
        return loadTsModule("../lib/roles.ts");
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
      if (specifier === "./permissions") {
        return loadTsModule("../lib/permissions.ts", {
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

const runtime = loadTsModule("../lib/demo-runtime.ts");

function workflow(snapshot, id) {
  return snapshot.workflows.find((item) => item.id === id);
}

test("Phase 7.5 runtime carries advisor approval through compliance release to client visibility", () => {
  let snapshot = runtime.createInitialDemoSession();

  assert.equal(runtime.getAdviceVisibility(snapshot).clientVisible, false);

  snapshot = runtime.applyDemoTransition(snapshot, {
    action: "advisor.approve",
    actorRole: "Senior Advisor"
  });
  assert.equal(workflow(snapshot, "wf-trust-x-recommendation").state, "advisor_approved");
  assert.equal(runtime.getAdviceVisibility(snapshot).clientVisible, false);

  snapshot = runtime.applyDemoTransition(snapshot, {
    action: "compliance.release",
    actorRole: "Compliance Officer"
  });
  assert.equal(workflow(snapshot, "wf-trust-x-recommendation").state, "released");
  assert.equal(runtime.getAdviceVisibility(snapshot).clientVisible, true);

  snapshot = runtime.applyDemoTransition(snapshot, {
    action: "client.submit_decision",
    actorRole: "Principal",
    choice: "accepted"
  });
  assert.equal(workflow(snapshot, "wf-beneficiary-decision").state, "finalized");
  assert.equal(snapshot.evidenceRecords[0].event, "decision.submitted");
  assert.equal(snapshot.auditEvents[0].action, "decision.submitted");
});

test("Phase 7.5 runtime blocks client decision before compliance release", () => {
  const snapshot = runtime.applyDemoTransition(runtime.createInitialDemoSession(), {
    action: "advisor.approve",
    actorRole: "Senior Advisor"
  });

  assert.throws(
    () =>
      runtime.applyDemoTransition(snapshot, {
        action: "client.submit_decision",
        actorRole: "Principal",
        choice: "accepted"
      }),
    /Decision submission blocked/
  );
});

test("Phase 7.5 runtime creates access-change evidence after second confirmation", () => {
  const snapshot = runtime.applyDemoTransition(runtime.createInitialDemoSession(), {
    action: "access.confirm_sensitive_change",
    actorRole: "Principal"
  });

  assert.equal(workflow(snapshot, "wf-external-advisor-access").state, "access_granted");
  assert.equal(snapshot.evidenceRecords[0].event, "access.changed");
  assert.equal(snapshot.auditEvents[0].action, "access.changed");
});

test("Phase 7.5 documentation tells future tasks how to use the runtime", () => {
  const doc = readFileSync(new URL("../docs/v2/PHASE_7_5_WORKFLOW_RUNTIME_PLAN.md", import.meta.url), "utf8");

  assert.match(doc, /Canonical Demo Story/);
  assert.match(doc, /Future Task Guidance/);
  assert.match(doc, /useDemoSession/);
});
