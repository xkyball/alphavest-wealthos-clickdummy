import "dotenv/config";

import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { processRuntimeDefinitions, processRuntimeIntegrity } from "../lib/process-runtime/process-registry";
import { createProcessRuntime, transitionProcess } from "../lib/process-runtime/process-state-machine";

const schema = readFileSync(path.join(process.cwd(), "prisma/schema.prisma"), "utf8");

function schemaBlock(kind: "enum" | "model", name: string) {
  const match = schema.match(new RegExp(`${kind} ${name} \\{([\\s\\S]*?)\\n\\}`));
  if (!match) throw new Error(`Missing ${kind} ${name}`);
  return match[1];
}

test.describe("Process Runtime Backbone", () => {
  test("promotes the P0 process matrix to the canonical runtime registry", () => {
    const integrity = processRuntimeIntegrity();

    expect(integrity.sourceArtifact).toBe("docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json");
    expect(integrity.totalDefinitions).toBe(84);
    expect(integrity.totalStepCount).toBe(438);
    expect(processRuntimeDefinitions.every((definition) => definition.processId.startsWith("BP-"))).toBe(true);
    expect(processRuntimeDefinitions.flatMap((definition) => definition.steps).every((step) => step.stepId.startsWith("BP-"))).toBe(true);
  });

  test("runs process state transitions with explicit status and step history semantics", () => {
    const runtime = createProcessRuntime("BP-024");

    expect(runtime.status).toBe("CREATED");
    expect(runtime.currentStepId).toBe("BP-024-S01");
    expect(runtime.steps[0]?.status).toBe("READY");

    const started = transitionProcess({
      actor: { permissions: ["process.start"], roleKey: "client_success" },
      command: "START",
      process: runtime,
    }).process;

    expect(started.status).toBe("ACTIVE");
    expect(started.steps[0]?.status).toBe("ACTIVE");

    const completed = transitionProcess({
      actor: { permissions: ["process.complete_step"], roleKey: "client_success" },
      command: "COMPLETE_STEP",
      process: started,
    }).process;

    expect(completed.status).toBe("ACTIVE");
    expect(completed.steps[0]?.status).toBe("COMPLETED");
    expect(completed.steps[1]?.status).toBe("ACTIVE");

    const blocked = transitionProcess({
      actor: { permissions: ["process.block"], roleKey: "analyst" },
      command: "BLOCK",
      process: completed,
      reason: "Evidence scope mismatch.",
    }).process;

    expect(blocked.status).toBe("BLOCKED");
    expect(blocked.blockerReason).toBe("Evidence scope mismatch.");
    expect(blocked.steps[1]?.status).toBe("BLOCKED");
  });

  test("schema exposes process definitions, instances, command history and process-backed sufficiency", () => {
    expect(schemaBlock("model", "ProcessDefinition")).toContain("processId");
    expect(schemaBlock("model", "ProcessInstance")).toContain("currentStepId");
    expect(schemaBlock("model", "ProcessStepInstance")).toContain("processInstanceId");
    expect(schemaBlock("model", "ProcessCommandRun")).toContain("previousState");
    expect(schemaBlock("model", "ProcessCommandRun")).toContain("nextState");
    expect(schemaBlock("model", "EvidenceSufficiencyDecision")).toContain("processInstanceId");
    expect(schemaBlock("enum", "ObjectType")).toContain("PROCESS");
    expect(schemaBlock("enum", "ObjectType")).toContain("PROCESS_STEP");
  });
});
