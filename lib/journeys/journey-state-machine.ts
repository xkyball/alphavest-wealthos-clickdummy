import type { JourneyDefinition, JourneyStepDefinition } from "./journey-registry";
import { assertJourneyCanStart, requireJourneyDefinition } from "./journey-registry";

export type JourneyInstanceStatus = "CREATED" | "ACTIVE" | "BLOCKED" | "COMPLETED" | "CANCELLED";
export type JourneyStepStatus = "LOCKED" | "READY" | "ACTIVE" | "BLOCKED" | "COMPLETED" | "SKIPPED";
export type JourneyCommandKey = "START" | "COMPLETE_STEP" | "BLOCK" | "RESUME" | "CANCEL";

export type JourneyActorContext = {
  roleKey: string;
  userId?: string;
  permissions: string[];
};

export type JourneyStepRuntime = JourneyStepDefinition & {
  blockerCode?: string;
  blockerReason?: string;
  completedAt?: string;
  startedAt?: string;
  status: JourneyStepStatus;
};

export type JourneyRuntime = {
  blockerCode?: string;
  blockerReason?: string;
  completedAt?: string;
  currentStageKey?: string;
  currentStepKey?: string;
  definition: JourneyDefinition;
  journeyKey: string;
  startedAt?: string;
  status: JourneyInstanceStatus;
  steps: JourneyStepRuntime[];
};

export type JourneyTransitionInput = {
  actor: JourneyActorContext;
  command: JourneyCommandKey;
  fromStepKey?: string;
  journey: JourneyRuntime;
  reason?: string;
  toStepKey?: string;
};

export type JourneyTransitionResult = {
  auditRequired: boolean;
  fromStepKey?: string;
  journey: JourneyRuntime;
  nextAction: JourneyNextAction;
  toStepKey?: string;
};

export type JourneyNextAction = {
  actorRoleKey?: string;
  blockerCode?: string;
  detail: string;
  stepKey?: string;
  type: "START" | "COMPLETE_STEP" | "RESOLVE_BLOCKER" | "DONE" | "CANCELLED";
};

function nowIso() {
  return new Date().toISOString();
}

function requireCommandPermission(actor: JourneyActorContext, command: JourneyCommandKey) {
  const requiredPermission = `journey.${command.toLowerCase()}`;

  if (!actor.permissions.includes(requiredPermission) && !actor.permissions.includes("journey.manage")) {
    throw new Error(`Actor role ${actor.roleKey} lacks ${requiredPermission}.`);
  }
}

function cloneJourney(journey: JourneyRuntime): JourneyRuntime {
  return {
    ...journey,
    definition: journey.definition,
    steps: journey.steps.map((step) => ({ ...step })),
  };
}

function firstExecutableStep(steps: JourneyStepRuntime[]) {
  return steps.find((step) => step.status !== "COMPLETED" && step.status !== "SKIPPED");
}

function stepByKey(steps: JourneyStepRuntime[], stepKey: string) {
  return steps.find((step) => step.key === stepKey);
}

function unlockNextStep(steps: JourneyStepRuntime[], completedStep: JourneyStepRuntime) {
  const next = steps.find((step) => step.sortOrder > completedStep.sortOrder && step.status === "LOCKED");

  if (next) {
    next.status = "READY";
  }

  return next;
}

function assertNoGateSkip(journey: JourneyRuntime, stepKey: string) {
  const target = stepByKey(journey.steps, stepKey);

  if (!target) {
    throw new Error(`Invalid journey step ${stepKey}.`);
  }

  const earlierOpenStep = journey.steps
    .filter((step) => step.sortOrder < target.sortOrder)
    .find((step) => !["COMPLETED", "SKIPPED"].includes(step.status));

  if (earlierOpenStep) {
    throw new Error(`Cannot transition ${stepKey} before ${earlierOpenStep.key} is completed.`);
  }

  return target;
}

function assertActorCanAdvanceStep(actor: JourneyActorContext, step: JourneyStepRuntime) {
  if (step.actorRoleKey !== actor.roleKey && !actor.permissions.includes("journey.manage")) {
    throw new Error(`Actor role ${actor.roleKey} cannot advance ${step.key}; expected ${step.actorRoleKey}.`);
  }
}

export function createJourneyRuntime(journeyKey: string): JourneyRuntime {
  const definition = assertJourneyCanStart(journeyKey);
  const [firstStep, ...restSteps] = definition.steps;

  return {
    definition,
    journeyKey,
    status: "CREATED",
    steps: [
      {
        ...firstStep,
        status: "READY",
      },
      ...restSteps.map((step) => ({
        ...step,
        status: "LOCKED" as const,
      })),
    ],
  };
}

export function calculateJourneyNextAction(journey: JourneyRuntime): JourneyNextAction {
  if (journey.status === "CANCELLED") {
    return {
      detail: "Work item was cancelled.",
      type: "CANCELLED",
    };
  }

  if (journey.status === "COMPLETED") {
    return {
      detail: "Work item is complete.",
      type: "DONE",
    };
  }

  if (journey.status === "BLOCKED") {
    return {
      blockerCode: journey.blockerCode,
      detail: journey.blockerReason ?? "Work item is blocked and requires remediation before it can continue.",
      stepKey: journey.currentStepKey,
      type: "RESOLVE_BLOCKER",
    };
  }

  const step = firstExecutableStep(journey.steps);

  if (!step) {
    return {
      detail: "Work item is complete.",
      type: "DONE",
    };
  }

  return {
    actorRoleKey: step.actorRoleKey,
    detail: journey.status === "CREATED" ? "Start work at the first ready step." : `Complete ${step.title}.`,
    stepKey: step.key,
    type: journey.status === "CREATED" ? "START" : "COMPLETE_STEP",
  };
}

export function transitionJourney(input: JourneyTransitionInput): JourneyTransitionResult {
  const definition = requireJourneyDefinition(input.journey.journeyKey);

  if (definition.status !== "ACTIVE") {
    throw new Error(`${definition.journeyKey} cannot transition while ${definition.status}.`);
  }

  requireCommandPermission(input.actor, input.command);

  const journey = cloneJourney(input.journey);
  const auditRequired = input.command !== "RESUME" || journey.steps.some((step) => step.requiresAudit);
  const timestamp = nowIso();

  if (input.command === "START") {
    if (journey.status !== "CREATED") {
      throw new Error(`Cannot start journey while ${journey.status}.`);
    }

    const step = firstExecutableStep(journey.steps);
    if (!step) {
      throw new Error("Cannot start a journey with no executable steps.");
    }

    assertActorCanAdvanceStep(input.actor, step);
    step.status = "ACTIVE";
    step.startedAt = timestamp;
    journey.status = "ACTIVE";
    journey.currentStepKey = step.key;
    journey.currentStageKey = step.stageKey;
    journey.startedAt = timestamp;

    return {
      auditRequired,
      fromStepKey: input.fromStepKey,
      journey,
      nextAction: calculateJourneyNextAction(journey),
      toStepKey: step.key,
    };
  }

  if (input.command === "COMPLETE_STEP") {
    if (journey.status !== "ACTIVE") {
      throw new Error(`Cannot complete a step while journey is ${journey.status}.`);
    }

    const targetStepKey = input.fromStepKey ?? journey.currentStepKey;
    if (!targetStepKey) {
      throw new Error("A current step is required to complete a journey step.");
    }

    const step = assertNoGateSkip(journey, targetStepKey);

    if (!["ACTIVE", "READY"].includes(step.status)) {
      throw new Error(`Cannot complete ${step.key} while it is ${step.status}.`);
    }

    assertActorCanAdvanceStep(input.actor, step);
    step.status = "COMPLETED";
    step.completedAt = timestamp;

    const next = unlockNextStep(journey.steps, step);

    if (next) {
      next.status = "ACTIVE";
      next.startedAt = timestamp;
      journey.currentStepKey = next.key;
      journey.currentStageKey = next.stageKey;
    } else {
      journey.status = "COMPLETED";
      journey.currentStepKey = undefined;
      journey.currentStageKey = undefined;
      journey.completedAt = timestamp;
    }

    return {
      auditRequired,
      fromStepKey: step.key,
      journey,
      nextAction: calculateJourneyNextAction(journey),
      toStepKey: next?.key,
    };
  }

  if (input.command === "BLOCK") {
    if (!input.reason) {
      throw new Error("A blocker reason is required.");
    }

    const step = input.fromStepKey ? assertNoGateSkip(journey, input.fromStepKey) : undefined;
    if (step) {
      step.status = "BLOCKED";
      step.blockerCode = "JOURNEY_BLOCKED";
      step.blockerReason = input.reason;
    }

    journey.status = "BLOCKED";
    journey.blockerCode = "JOURNEY_BLOCKED";
    journey.blockerReason = input.reason;
    journey.currentStepKey = step?.key ?? journey.currentStepKey;
    journey.currentStageKey = step?.stageKey ?? journey.currentStageKey;

    return {
      auditRequired: true,
      fromStepKey: step?.key,
      journey,
      nextAction: calculateJourneyNextAction(journey),
      toStepKey: undefined,
    };
  }

  if (input.command === "RESUME") {
    if (journey.status !== "BLOCKED") {
      throw new Error(`Cannot resume journey while ${journey.status}.`);
    }

    const step = journey.currentStepKey ? stepByKey(journey.steps, journey.currentStepKey) : firstExecutableStep(journey.steps);
    if (!step) {
      throw new Error("Cannot resume journey without a current or next step.");
    }

    step.status = step.status === "COMPLETED" ? "COMPLETED" : "ACTIVE";
    step.blockerCode = undefined;
    step.blockerReason = undefined;
    journey.status = "ACTIVE";
    journey.blockerCode = undefined;
    journey.blockerReason = undefined;
    journey.currentStepKey = step.key;
    journey.currentStageKey = step.stageKey;

    return {
      auditRequired,
      fromStepKey: input.fromStepKey,
      journey,
      nextAction: calculateJourneyNextAction(journey),
      toStepKey: step.key,
    };
  }

  if (input.command === "CANCEL") {
    journey.status = "CANCELLED";
    journey.currentStepKey = undefined;
    journey.currentStageKey = undefined;

    return {
      auditRequired: true,
      fromStepKey: input.fromStepKey,
      journey,
      nextAction: calculateJourneyNextAction(journey),
      toStepKey: undefined,
    };
  }

  throw new Error("Unsupported journey command.");
}
