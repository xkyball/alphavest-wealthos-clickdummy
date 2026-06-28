import { requireProcessDefinition, type ProcessCommandKey, type ProcessDefinition, type ProcessInstanceStatus, type ProcessStepStatus } from "./process-registry";

export type ProcessActorContext = {
  permissions: string[];
  roleKey: string;
};

export type ProcessStepRuntime = {
  actor: string | null;
  blockerCode?: string;
  blockerReason?: string;
  sequence: number;
  status: ProcessStepStatus;
  stepId: string;
  stepLabel: string;
};

export type ProcessRuntime = {
  blockerCode?: string;
  blockerReason?: string;
  clientSafeSummary?: string;
  currentStepId?: string;
  definition: ProcessDefinition;
  processId: string;
  status: ProcessInstanceStatus;
  steps: ProcessStepRuntime[];
};

export type ProcessTransitionInput = {
  actor: ProcessActorContext;
  command: ProcessCommandKey;
  fromStepId?: string;
  process: ProcessRuntime;
  reason?: string;
};

const commandPermissions: Record<ProcessCommandKey, string> = {
  BLOCK: "process.block",
  CANCEL: "process.cancel",
  COMPLETE_STEP: "process.complete_step",
  START: "process.start",
};

function requirePermission(actor: ProcessActorContext, command: ProcessCommandKey) {
  const permission = commandPermissions[command];
  if (!actor.permissions.includes(permission) && !actor.permissions.includes("process.manage")) {
    throw new Error(`${actor.roleKey} lacks ${permission}.`);
  }
}

function firstRunnableStep(steps: ProcessStepRuntime[]) {
  return steps.find((step) => step.status === "READY" || step.status === "ACTIVE");
}

function expectedRoleForStep(step: ProcessStepRuntime) {
  if (!step.actor) return null;
  const normalized = step.actor.toLowerCase();
  if (normalized.includes("client")) return "client_success";
  if (normalized.includes("advisor")) return "senior_wealth_advisor";
  if (normalized.includes("compliance")) return "compliance_officer";
  if (normalized.includes("analyst") || normalized.includes("consultant") || normalized.includes("system")) return "analyst";
  if (normalized.includes("admin")) return "platform_admin";
  return null;
}

function assertActorCanRunStep(actor: ProcessActorContext, step: ProcessStepRuntime) {
  const expectedRole = expectedRoleForStep(step);
  if (expectedRole && actor.roleKey !== expectedRole && !actor.permissions.includes("process.manage")) {
    throw new Error(`${step.stepId} expected ${expectedRole}; received ${actor.roleKey}.`);
  }
}

export function createProcessRuntime(processId: string): ProcessRuntime {
  const definition = requireProcessDefinition(processId);
  const firstStepId = definition.steps[0]?.stepId;

  return {
    currentStepId: firstStepId,
    definition,
    processId: definition.processId,
    status: "CREATED",
    steps: definition.steps.map((step, index) => ({
      actor: step.actor,
      sequence: step.sequence,
      status: index === 0 ? "READY" : "LOCKED",
      stepId: step.stepId,
      stepLabel: step.stepLabel,
    })),
  };
}

export function transitionProcess(input: ProcessTransitionInput) {
  requirePermission(input.actor, input.command);

  if (input.command === "START") {
    if (input.process.status !== "CREATED") throw new Error(`${input.process.processId} is already started.`);
    const current = firstRunnableStep(input.process.steps);
    if (!current) throw new Error(`${input.process.processId} has no runnable step.`);

    return {
      process: {
        ...input.process,
        currentStepId: current.stepId,
        status: "ACTIVE" as ProcessInstanceStatus,
        steps: input.process.steps.map((step) => (step.stepId === current.stepId ? { ...step, status: "ACTIVE" as ProcessStepStatus } : step)),
      },
    };
  }

  if (input.command === "BLOCK") {
    const currentStepId = input.fromStepId ?? input.process.currentStepId;
    if (!currentStepId) throw new Error(`${input.process.processId} has no current step to block.`);
    if (!input.reason) throw new Error("Blocking a process requires a reason.");

    return {
      process: {
        ...input.process,
        blockerCode: "PROCESS_BLOCKED",
        blockerReason: input.reason,
        status: "BLOCKED" as ProcessInstanceStatus,
        steps: input.process.steps.map((step) =>
          step.stepId === currentStepId
            ? {
                ...step,
                blockerCode: "PROCESS_BLOCKED",
                blockerReason: input.reason,
                status: "BLOCKED" as ProcessStepStatus,
              }
            : step,
        ),
      },
    };
  }

  if (input.command === "CANCEL") {
    if (!input.reason) throw new Error("Cancelling a process requires a reason.");
    return {
      process: {
        ...input.process,
        blockerCode: "PROCESS_CANCELLED",
        blockerReason: input.reason,
        currentStepId: undefined,
        status: "CANCELLED" as ProcessInstanceStatus,
      },
    };
  }

  const currentStepId = input.fromStepId ?? input.process.currentStepId;
  const current = input.process.steps.find((step) => step.stepId === currentStepId);
  if (!current) throw new Error(`${input.process.processId} has no current step.`);
  if (current.status !== "ACTIVE") throw new Error(`${current.stepId} must be active before it can be completed.`);
  assertActorCanRunStep(input.actor, current);

  const next = input.process.steps.find((step) => step.sequence > current.sequence);

  return {
    process: {
      ...input.process,
      currentStepId: next?.stepId,
      status: next ? ("ACTIVE" as ProcessInstanceStatus) : ("COMPLETED" as ProcessInstanceStatus),
      steps: input.process.steps.map((step) => {
        if (step.stepId === current.stepId) return { ...step, status: "COMPLETED" as ProcessStepStatus };
        if (next && step.stepId === next.stepId) return { ...step, status: "ACTIVE" as ProcessStepStatus };
        return step;
      }),
    },
  };
}
