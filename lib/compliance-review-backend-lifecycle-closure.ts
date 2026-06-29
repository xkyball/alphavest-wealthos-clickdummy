import {
  AuditResult,
  ObjectType,
  ProcessInstanceStatus,
  ProcessObjectLinkRole,
  ProcessStepStatus,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";

import {
  complianceReviewReleaseContractId,
  type ComplianceReviewReleaseProcessId,
} from "@/lib/compliance-review-release-contract";
import { demoPlatformTenantId, requireDemoSession, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { requireProcessDefinition } from "@/lib/process-runtime/process-registry";
import { transitionProcess, type ProcessRuntime } from "@/lib/process-runtime/process-state-machine";
import { stableId } from "@/lib/stable-id";

export const complianceReviewBackendLifecycleTicketId = "DOMAIN-G-BACKEND-LIFECYCLE-01";

export const complianceReviewBackendLifecycleProcessIds = [
  "BP-058",
  "BP-059",
  "BP-060",
  "BP-061",
  "BP-062",
  "BP-063",
  "BP-064",
  "BP-066",
] as const satisfies readonly ComplianceReviewReleaseProcessId[];

export const complianceReviewBackendLifecycleGapStepIds = complianceReviewBackendLifecycleProcessIds.flatMap(
  (processId) => [`${processId}-S01`, `${processId}-S03`, `${processId}-S04`] as const,
);

type ComplianceReviewLifecycleProcessId = (typeof complianceReviewBackendLifecycleProcessIds)[number];
type ComplianceReviewLifecycleGapStepId = (typeof complianceReviewBackendLifecycleGapStepIds)[number];

type ComplianceReviewLifecycleInstance = Prisma.ProcessInstanceGetPayload<{
  include: {
    processDefinition: true;
    steps: { orderBy: { sequence: "asc" } };
  };
}>;

export class ComplianceReviewBackendLifecycleError extends Error {
  constructor(
    message: string,
    public readonly reasonCode: string,
  ) {
    super(message);
    this.name = "ComplianceReviewBackendLifecycleError";
  }
}

function requireReason(reason: string) {
  if (reason.trim().length < 12) {
    throw new ComplianceReviewBackendLifecycleError(
      "Compliance review backend lifecycle closure requires a meaningful reason.",
      "reason_required",
    );
  }
}

function lifecycleProcessInstanceId(input: { processId: ComplianceReviewLifecycleProcessId; runKey: string }) {
  return stableId(`compliance-review-backend-lifecycle:${input.runKey}:${input.processId}`);
}

function lifecycleObjectLinkId(input: {
  objectId: string;
  objectType: ObjectType;
  processId: ComplianceReviewLifecycleProcessId;
  runKey: string;
}) {
  return stableId(
    `compliance-review-backend-lifecycle-link:${input.runKey}:${input.processId}:${input.objectType}:${input.objectId}`,
  );
}

function lifecycleRuntimeFromInstance(instance: ComplianceReviewLifecycleInstance): ProcessRuntime {
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
    processId: ComplianceReviewLifecycleProcessId;
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
    throw new ComplianceReviewBackendLifecycleError(
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
        complianceReviewBackendLifecycleClosure: true,
        contractId: complianceReviewReleaseContractId,
        processRuntimeBackbone: true,
        runKey: input.runKey,
        ticketId: complianceReviewBackendLifecycleTicketId,
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
        complianceReviewBackendLifecycleClosure: true,
        decisionPoint: step.decisionPoint,
        processRuntimeBackbone: true,
        runKey: input.runKey,
        ticketId: complianceReviewBackendLifecycleTicketId,
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
        complianceReviewBackendLifecycleClosure: true,
        processId: input.processId,
        processRuntimeBackbone: true,
        runKey: input.runKey,
        ticketId: complianceReviewBackendLifecycleTicketId,
      },
      objectId: input.recommendationId,
      objectType: ObjectType.RECOMMENDATION,
      processInstanceId: instance.id,
      title: "Compliance review backend lifecycle target",
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

export async function closeComplianceReviewBackendLifecycle(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    auditPersistenceAvailable?: boolean;
    complianceReviewId: string;
    reason: string;
    runKey: string;
    tenantSlug: DemoTenantSlug;
  },
) {
  requireReason(input.reason);
  if (input.auditPersistenceAvailable === false) {
    throw new ComplianceReviewBackendLifecycleError(
      "Audit persistence unavailable; compliance review lifecycle mutation blocked.",
      "compliance_review_backend_lifecycle_audit_failed_closed",
    );
  }

  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });

  return prisma.$transaction(async (tx) => {
    const complianceReview = await tx.complianceReview.findUniqueOrThrow({
      where: { id: input.complianceReviewId },
    });
    if (complianceReview.clientTenantId !== session.tenant.id) {
      throw new ComplianceReviewBackendLifecycleError(
        "Compliance review lifecycle target is outside the active tenant scope.",
        "tenant_scope_denied",
      );
    }
    if (complianceReview.targetType !== ObjectType.RECOMMENDATION) {
      throw new ComplianceReviewBackendLifecycleError(
        "Compliance review backend lifecycle currently supports recommendation-scoped release reviews only.",
        "target_type_not_supported",
      );
    }

    const recommendation = await tx.recommendation.findUniqueOrThrow({ where: { id: complianceReview.targetId } });
    if (recommendation.clientTenantId !== session.tenant.id) {
      throw new ComplianceReviewBackendLifecycleError(
        "Compliance review recommendation target is outside the active tenant scope.",
        "tenant_scope_denied",
      );
    }

    const stepClosures: Array<{
      auditEventId: string;
      fromStepId: string;
      processId: ComplianceReviewLifecycleProcessId;
      processInstanceId: string;
      toStepId: string | null;
    }> = [];

    for (const processId of complianceReviewBackendLifecycleProcessIds) {
      const instance = await ensureLifecycleInstance(tx, {
        clientTenantId: complianceReview.clientTenantId,
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
            clientTenantId: complianceReview.clientTenantId,
            eventType: "compliance_review.backend_lifecycle.step.completed",
            metadataJson: {
              command: "COMPLETE_STEP",
              complianceReviewBackendLifecycleClosure: true,
              complianceReviewId: complianceReview.id,
              contractId: complianceReviewReleaseContractId,
              fromStepId: activeStep.stepId,
              processId,
              processRuntimeBackbone: true,
              recommendationId: recommendation.id,
              runKey: input.runKey,
              ticketId: complianceReviewBackendLifecycleTicketId,
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
              complianceReviewBackendLifecycleClosure: true,
              complianceReviewId: complianceReview.id,
              contractId: complianceReviewReleaseContractId,
              processRuntimeBackbone: true,
              recommendationId: recommendation.id,
              runKey: input.runKey,
              ticketId: complianceReviewBackendLifecycleTicketId,
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
    const closedGapStepIds = complianceReviewBackendLifecycleGapStepIds.filter((stepId) =>
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
      closedGapStepIds: closedGapStepIds as ComplianceReviewLifecycleGapStepId[],
      commandRunCount: stepClosures.length,
      completedProcessIds: processInstances
        .filter((instance) => instance.status === ProcessInstanceStatus.COMPLETED)
        .map((instance) => instance.processDefinition.processId as ComplianceReviewLifecycleProcessId)
        .sort(),
      completedStepIds,
      complianceReviewStatus: complianceReview.status,
      contractId: complianceReviewReleaseContractId,
      processInstanceIds: processInstances.map((instance) => instance.id),
      processStatusById: Object.fromEntries(
        processInstances.map((instance) => [instance.processDefinition.processId, instance.status]),
      ) as Record<ComplianceReviewLifecycleProcessId, ProcessInstanceStatus>,
      recommendationClientVisible: recommendation.clientVisible,
      runKey: input.runKey,
      ticketId: complianceReviewBackendLifecycleTicketId,
    };
  });
}
