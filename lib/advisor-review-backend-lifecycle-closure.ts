import {
  AuditResult,
  ObjectType,
  ProcessInstanceStatus,
  ProcessObjectLinkRole,
  ProcessStepStatus,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";

import { advisorReviewApprovalContractId, type AdvisorReviewProcessId } from "@/lib/advisor-review-approval-contract";
import { demoPlatformTenantId, requireDemoSession, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { requireProcessDefinition } from "@/lib/process-runtime/process-registry";
import { transitionProcess, type ProcessRuntime } from "@/lib/process-runtime/process-state-machine";
import { stableId } from "@/lib/stable-id";

export const advisorReviewBackendLifecycleTicketId = "EPIC-10-BACKEND-LIFECYCLE-01";

export const advisorReviewBackendLifecycleProcessIds = [
  "BP-050",
  "BP-051",
  "BP-052",
  "BP-053",
  "BP-054",
  "BP-055",
] as const satisfies readonly AdvisorReviewProcessId[];

export const advisorReviewBackendLifecycleGapStepIds = advisorReviewBackendLifecycleProcessIds.flatMap(
  (processId) => [`${processId}-S02`, `${processId}-S03`, `${processId}-S04`] as const,
);

type AdvisorReviewLifecycleProcessId = (typeof advisorReviewBackendLifecycleProcessIds)[number];
type AdvisorReviewLifecycleGapStepId = (typeof advisorReviewBackendLifecycleGapStepIds)[number];

type AdvisorReviewLifecycleInstance = Prisma.ProcessInstanceGetPayload<{
  include: {
    processDefinition: true;
    steps: { orderBy: { sequence: "asc" } };
  };
}>;

export class AdvisorReviewBackendLifecycleError extends Error {
  constructor(
    message: string,
    public readonly reasonCode: string,
  ) {
    super(message);
    this.name = "AdvisorReviewBackendLifecycleError";
  }
}

function requireReason(reason: string) {
  if (reason.trim().length < 12) {
    throw new AdvisorReviewBackendLifecycleError(
      "Advisor review backend lifecycle closure requires a meaningful reason.",
      "reason_required",
    );
  }
}

function lifecycleProcessInstanceId(input: { processId: AdvisorReviewLifecycleProcessId; runKey: string }) {
  return stableId(`advisor-review-backend-lifecycle:${input.runKey}:${input.processId}`);
}

function lifecycleObjectLinkId(input: {
  objectId: string;
  objectType: ObjectType;
  processId: AdvisorReviewLifecycleProcessId;
  runKey: string;
}) {
  return stableId(
    `advisor-review-backend-lifecycle-link:${input.runKey}:${input.processId}:${input.objectType}:${input.objectId}`,
  );
}

function lifecycleRuntimeFromInstance(instance: AdvisorReviewLifecycleInstance): ProcessRuntime {
  return {
    blockerCode: instance.blockerCode ?? undefined,
    blockerReason: instance.blockerReason ?? undefined,
    currentStepId: instance.currentStepId ?? undefined,
    definition: requireProcessDefinition(instance.processDefinition.processId),
    processId: instance.processDefinition.processId,
    status: instance.status as ProcessRuntime["status"],
    steps: instance.steps.map((step) => ({
      actor: step.actor,
      blockerCode: step.blockerCode ?? undefined,
      blockerReason: step.blockerReason ?? undefined,
      sequence: step.sequence,
      status: step.status as ProcessRuntime["steps"][number]["status"],
      stepId: step.stepId,
      stepLabel: step.stepLabel,
    })),
  };
}

async function ensureLifecycleInstance(
  tx: Prisma.TransactionClient,
  input: {
    clientTenantId: string;
    ownerUserId: string | null;
    processId: AdvisorReviewLifecycleProcessId;
    recommendationId: string;
    runKey: string;
  },
) {
  const existing = await tx.processObjectLink.findFirst({
    include: {
      processInstance: {
        include: {
          processDefinition: true,
          steps: { orderBy: { sequence: "asc" } },
        },
      },
    },
    where: {
      objectId: input.recommendationId,
      objectType: ObjectType.RECOMMENDATION,
      processInstance: {
        processDefinition: { processId: input.processId },
      },
    },
  });

  if (existing?.processInstance) return existing.processInstance;

  const definition = requireProcessDefinition(input.processId);
  const persistedDefinition = await tx.processDefinition.findUnique({
    where: { processId: input.processId },
  });
  if (!persistedDefinition) {
    throw new AdvisorReviewBackendLifecycleError(
      `${input.processId} is missing from persisted process definitions.`,
      "process_definition_missing",
    );
  }

  const firstStep = definition.steps[0];
  const instance = await tx.processInstance.create({
    data: {
      clientTenantId: input.clientTenantId,
      currentSequence: firstStep?.sequence ?? null,
      currentStepId: firstStep?.stepId ?? null,
      id: lifecycleProcessInstanceId({ processId: input.processId, runKey: input.runKey }),
      metadataJson: {
        advisorReviewBackendLifecycleClosure: true,
        contractId: advisorReviewApprovalContractId,
        processRuntimeBackbone: true,
        runKey: input.runKey,
        ticketId: advisorReviewBackendLifecycleTicketId,
      },
      ownerUserId: input.ownerUserId,
      processDefinitionId: persistedDefinition.id,
      startedAt: new Date(),
      status: ProcessInstanceStatus.ACTIVE,
    },
    include: {
      processDefinition: true,
      steps: { orderBy: { sequence: "asc" } },
    },
  });

  await tx.processStepInstance.createMany({
    data: definition.steps.map((step, index) => ({
      actor: step.actor,
      metadataJson: {
        acceptanceState: step.acceptanceState,
        action: step.action,
        advisorReviewBackendLifecycleClosure: true,
        decisionPoint: step.decisionPoint,
        processRuntimeBackbone: true,
        runKey: input.runKey,
        ticketId: advisorReviewBackendLifecycleTicketId,
      },
      processInstanceId: instance.id,
      sequence: step.sequence,
      startedAt: index === 0 ? new Date() : null,
      status: index === 0 ? ProcessStepStatus.ACTIVE : ProcessStepStatus.LOCKED,
      stepId: step.stepId,
      stepLabel: step.stepLabel,
    })),
  });

  await tx.processObjectLink.create({
    data: {
      id: lifecycleObjectLinkId({
        objectId: input.recommendationId,
        objectType: ObjectType.RECOMMENDATION,
        processId: input.processId,
        runKey: input.runKey,
      }),
      linkRole: ProcessObjectLinkRole.RECOMMENDATION,
      metadataJson: {
        advisorReviewBackendLifecycleClosure: true,
        processId: input.processId,
        processRuntimeBackbone: true,
        runKey: input.runKey,
        ticketId: advisorReviewBackendLifecycleTicketId,
      },
      objectId: input.recommendationId,
      objectType: ObjectType.RECOMMENDATION,
      processInstanceId: instance.id,
      title: "Advisor review backend lifecycle target",
    },
  });

  return tx.processInstance.findUniqueOrThrow({
    include: {
      processDefinition: true,
      steps: { orderBy: { sequence: "asc" } },
    },
    where: { id: instance.id },
  });
}

export async function closeAdvisorReviewBackendLifecycle(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    auditPersistenceAvailable?: boolean;
    reason: string;
    recommendationId: string;
    runKey: string;
    tenantSlug: DemoTenantSlug;
  },
) {
  requireReason(input.reason);
  if (input.auditPersistenceAvailable === false) {
    throw new AdvisorReviewBackendLifecycleError(
      "Audit persistence unavailable; advisor review lifecycle mutation blocked.",
      "advisor_review_backend_lifecycle_audit_failed_closed",
    );
  }

  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });

  return prisma.$transaction(async (tx) => {
    const recommendation = await tx.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });
    if (recommendation.clientTenantId !== session.tenant.id) {
      throw new AdvisorReviewBackendLifecycleError(
        "Advisor review lifecycle target is outside the active tenant scope.",
        "tenant_scope_denied",
      );
    }

    const stepClosures: Array<{
      auditEventId: string;
      fromStepId: string;
      processId: AdvisorReviewLifecycleProcessId;
      processInstanceId: string;
      toStepId: string | null;
    }> = [];

    for (const processId of advisorReviewBackendLifecycleProcessIds) {
      const instance = await ensureLifecycleInstance(tx, {
        clientTenantId: recommendation.clientTenantId,
        ownerUserId: session.actor.id,
        processId,
        recommendationId: recommendation.id,
        runKey: input.runKey,
      });
      let runtime = lifecycleRuntimeFromInstance(instance);

      while (runtime.steps.some((step) => step.status === "ACTIVE")) {
        const activeStep = runtime.steps.find((step) => step.status === "ACTIVE");
        if (!activeStep) break;

        const previousRuntime = runtime;
        const transitionedRuntime = transitionProcess({
          actor: {
            permissions: ["process.manage"],
            roleKey: input.actorRoleKey,
          },
          command: "COMPLETE_STEP",
          fromStepId: activeStep.stepId,
          process: previousRuntime,
          reason: input.reason,
        }).process;
        const nextStep = transitionedRuntime.currentStepId
          ? transitionedRuntime.steps.find((step) => step.stepId === transitionedRuntime.currentStepId)
          : undefined;
        const audit = await tx.auditEvent.create({
          data: {
            actorRoleKey: session.role.key,
            actorUserId: session.actor.id,
            clientTenantId: recommendation.clientTenantId,
            eventType: "advisor_review.backend_lifecycle.step.completed",
            metadataJson: {
              advisorReviewBackendLifecycleClosure: true,
              command: "COMPLETE_STEP",
              contractId: advisorReviewApprovalContractId,
              fromStepId: activeStep.stepId,
              processId,
              processRuntimeBackbone: true,
              recommendationId: recommendation.id,
              runKey: input.runKey,
              ticketId: advisorReviewBackendLifecycleTicketId,
              toStepId: transitionedRuntime.currentStepId ?? null,
            },
            nextState: transitionedRuntime.status,
            platformTenantId: demoPlatformTenantId,
            previousState: previousRuntime.status,
            reason: input.reason,
            result: AuditResult.SUCCESS,
            targetId: instance.id,
            targetType: ObjectType.PROCESS,
          },
        });

        await tx.processInstance.update({
          data: {
            blockerCode: transitionedRuntime.blockerCode ?? null,
            blockerReason: transitionedRuntime.blockerReason ?? null,
            completedAt: transitionedRuntime.status === ProcessInstanceStatus.COMPLETED ? new Date() : null,
            currentSequence: nextStep?.sequence ?? null,
            currentStepId: transitionedRuntime.currentStepId ?? null,
            status: transitionedRuntime.status as ProcessInstanceStatus,
          },
          where: { id: instance.id },
        });

        for (const step of transitionedRuntime.steps) {
          const previousStep = previousRuntime.steps.find((candidate) => candidate.stepId === step.stepId);
          if (!previousStep || previousStep.status === step.status) continue;

          await tx.processStepInstance.update({
            data: {
              blockerCode: step.blockerCode ?? null,
              blockerReason: step.blockerReason ?? null,
              completedAt: step.status === ProcessStepStatus.COMPLETED ? new Date() : null,
              startedAt:
                step.status === ProcessStepStatus.ACTIVE && previousStep.status !== ProcessStepStatus.ACTIVE
                  ? new Date()
                  : undefined,
              status: step.status as ProcessStepStatus,
            },
            where: {
              processInstanceId_stepId: {
                processInstanceId: instance.id,
                stepId: step.stepId,
              },
            },
          });
        }

        await tx.processCommandRun.create({
          data: {
            actorRoleKey: session.role.key,
            actorUserId: session.actor.id,
            auditEventId: audit.id,
            commandKey: "COMPLETE_STEP",
            fromStepId: activeStep.stepId,
            metadataJson: {
              advisorReviewBackendLifecycleClosure: true,
              contractId: advisorReviewApprovalContractId,
              processRuntimeBackbone: true,
              recommendationId: recommendation.id,
              runKey: input.runKey,
              ticketId: advisorReviewBackendLifecycleTicketId,
            },
            nextState: transitionedRuntime.status,
            previousState: previousRuntime.status,
            processInstanceId: instance.id,
            reason: input.reason,
            result: AuditResult.SUCCESS,
            toStepId: transitionedRuntime.currentStepId ?? null,
          },
        });

        stepClosures.push({
          auditEventId: audit.id,
          fromStepId: activeStep.stepId,
          processId,
          processInstanceId: instance.id,
          toStepId: transitionedRuntime.currentStepId ?? null,
        });
        runtime = transitionedRuntime;
      }
    }

    const completedStepIds = stepClosures.map((closure) => closure.fromStepId);
    const closedGapStepIds = advisorReviewBackendLifecycleGapStepIds.filter((stepId) =>
      completedStepIds.includes(stepId),
    );
    const processInstances = await tx.processInstance.findMany({
      include: {
        processDefinition: true,
        steps: { orderBy: { sequence: "asc" } },
      },
      where: {
        id: { in: [...new Set(stepClosures.map((closure) => closure.processInstanceId))] },
      },
    });

    return {
      auditEventIds: stepClosures.map((closure) => closure.auditEventId),
      closedGapStepIds,
      commandRunCount: stepClosures.length,
      completedProcessIds: processInstances
        .filter((instance) => instance.status === ProcessInstanceStatus.COMPLETED)
        .map((instance) => instance.processDefinition.processId as AdvisorReviewLifecycleProcessId)
        .sort(),
      completedStepIds,
      contractId: advisorReviewApprovalContractId,
      processInstanceIds: processInstances.map((instance) => instance.id),
      processStatusById: Object.fromEntries(
        processInstances.map((instance) => [instance.processDefinition.processId, instance.status]),
      ) as Record<AdvisorReviewLifecycleProcessId, ProcessInstanceStatus>,
      recommendationClientVisible: recommendation.clientVisible,
      runKey: input.runKey,
      ticketId: advisorReviewBackendLifecycleTicketId,
    };
  });
}
