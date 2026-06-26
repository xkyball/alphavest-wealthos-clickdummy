import type { JourneyDefinition, JourneyEvidenceRequirementDefinition } from "./journey-registry";
import { assertJourneyCanStart, requireJourneyDefinition } from "./journey-registry";
import {
  calculateJourneyNextAction,
  createJourneyRuntime,
  transitionJourney,
  type JourneyActorContext,
  type JourneyNextAction,
  type JourneyRuntime,
  type JourneyStepRuntime,
  type JourneyTransitionResult,
} from "./journey-state-machine";

export type JourneyObjectLinkProjection = {
  linkRole: "PRIMARY_CONTEXT" | "SUPPORTING_EVIDENCE" | "RECOMMENDATION" | "DECISION" | "EXPORT" | "AUDIT_REFERENCE";
  objectId: string;
  objectType: string;
  title?: string;
};

export type JourneyProjectionInput = {
  journey: JourneyRuntime;
  objectLinks?: JourneyObjectLinkProjection[];
};

export type InternalJourneyProjection = {
  actorRoleKeys: string[];
  blockerCode?: string;
  blockerReason?: string;
  currentStageKey?: string;
  currentStepKey?: string;
  definitionStatus: JourneyDefinition["status"];
  evidenceRequirements: JourneyEvidenceRequirementDefinition[];
  holdReason?: string;
  journeyKey: string;
  nextAction: JourneyNextAction;
  objectLinks: JourneyObjectLinkProjection[];
  status: JourneyRuntime["status"];
  steps: JourneyStepRuntime[];
  title: string;
};

export type ClientJourneyProjection = {
  currentStageKey?: string;
  currentStepTitle?: string;
  journeyKey: string;
  nextAction: {
    detail: string;
    type: "CLIENT_SAFE_STATUS" | "DONE" | "BLOCKED";
  };
  releasedSummary?: string;
  status: "IN_PROGRESS" | "BLOCKED" | "COMPLETE" | "NOT_AVAILABLE";
  title: string;
};

export function createJourneyStartPlan(journeyKey: string) {
  const definition = assertJourneyCanStart(journeyKey);
  const runtime = createJourneyRuntime(journeyKey);

  return {
    definition,
    nextAction: calculateJourneyNextAction(runtime),
    runtime,
  };
}

export function runJourneyCommand(input: {
  actor: JourneyActorContext;
  command: Parameters<typeof transitionJourney>[0]["command"];
  fromStepKey?: string;
  journey: JourneyRuntime;
  reason?: string;
  toStepKey?: string;
}): JourneyTransitionResult {
  return transitionJourney(input);
}

export function buildInternalJourneyProjection(input: JourneyProjectionInput): InternalJourneyProjection {
  const definition = requireJourneyDefinition(input.journey.journeyKey);

  return {
    actorRoleKeys: definition.actorRoleKeys,
    blockerCode: input.journey.blockerCode,
    blockerReason: input.journey.blockerReason,
    currentStageKey: input.journey.currentStageKey,
    currentStepKey: input.journey.currentStepKey,
    definitionStatus: definition.status,
    evidenceRequirements: definition.evidenceRequirements,
    holdReason: definition.holdReason,
    journeyKey: definition.journeyKey,
    nextAction: calculateJourneyNextAction(input.journey),
    objectLinks: input.objectLinks ?? [],
    status: input.journey.status,
    steps: input.journey.steps,
    title: definition.title,
  };
}

export function buildClientJourneyProjection(input: JourneyProjectionInput): ClientJourneyProjection {
  const definition = requireJourneyDefinition(input.journey.journeyKey);

  if (definition.status !== "ACTIVE") {
    return {
      journeyKey: definition.journeyKey,
      nextAction: {
        detail: "This work item is not available to clients.",
        type: "CLIENT_SAFE_STATUS",
      },
      status: "NOT_AVAILABLE",
      title: definition.title,
    };
  }

  if (input.journey.status === "COMPLETED") {
    return {
      journeyKey: definition.journeyKey,
      nextAction: {
        detail: input.journey.clientSafeSummary ?? "The work item is complete.",
        type: "DONE",
      },
      ...(input.journey.clientSafeSummary ? { releasedSummary: input.journey.clientSafeSummary } : {}),
      status: "COMPLETE",
      title: definition.title,
    };
  }

  if (input.journey.status === "BLOCKED") {
    return {
      currentStageKey: input.journey.currentStageKey,
      currentStepTitle: input.journey.steps.find((step) => step.key === input.journey.currentStepKey)?.title,
      journeyKey: definition.journeyKey,
      nextAction: {
        detail: "The AlphaVest team is reviewing this work item before any client-visible action.",
        type: "BLOCKED",
      },
      status: "BLOCKED",
      title: definition.title,
    };
  }

  const currentStep = input.journey.steps.find((step) => step.key === input.journey.currentStepKey);

  return {
    currentStageKey: input.journey.currentStageKey,
    currentStepTitle: currentStep?.clientVisible ? currentStep.title : undefined,
    journeyKey: definition.journeyKey,
    nextAction: {
      detail: "AlphaVest is progressing this work item through internal review gates.",
      type: "CLIENT_SAFE_STATUS",
    },
    status: "IN_PROGRESS",
    title: definition.title,
  };
}

export function calculateJourneyBlockers(journey: JourneyRuntime) {
  if (journey.status !== "BLOCKED") {
    return [];
  }

  return [
    {
      blockerCode: journey.blockerCode ?? "JOURNEY_BLOCKED",
      blockerReason: journey.blockerReason ?? "Work item is blocked.",
      stepKey: journey.currentStepKey,
    },
  ];
}
