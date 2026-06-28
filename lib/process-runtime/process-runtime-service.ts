import { AuditResult, ObjectType, ProcessInstanceStatus, ProcessStepStatus, type Prisma, type PrismaClient } from "@prisma/client";

import type { CurrentUserContext } from "@/lib/auth/current-user";
import type { FailClosedReasonCode } from "@/lib/control-layer/error-envelope";
import { requireProcessDefinition, type ProcessCommandKey } from "@/lib/process-runtime/process-registry";
import { transitionProcess, type ProcessRuntime } from "@/lib/process-runtime/process-state-machine";

type ProcessInstanceWithGraph = Prisma.ProcessInstanceGetPayload<{
  include: {
    commandRuns: { orderBy: { createdAt: "asc" } };
    objectLinks: true;
    processDefinition: true;
    steps: { orderBy: { sequence: "asc" } };
  };
}>;

export class ProcessRuntimeError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
    public readonly code = "PROCESS_RUNTIME_ERROR",
    public readonly issues: string[] = [],
  ) {
    super(message);
    this.name = "ProcessRuntimeError";
  }
}

function failClosedReasonCode(code: string): FailClosedReasonCode {
  if (
    code === "AUDIT_PERSISTENCE_UNAVAILABLE" ||
    code === "DATABASE_URL_REQUIRED" ||
    code === "INVALID_REQUEST" ||
    code === "PERMISSION_DENIED" ||
    code === "SAFE_ERROR" ||
    code === "SCOPE_DENIED"
  ) {
    return code;
  }

  return "SAFE_ERROR";
}

function requireRole(currentUser: CurrentUserContext) {
  if (!currentUser.role?.key) {
    throw new ProcessRuntimeError("Process runtime requires an actor role.", 403, "PERMISSION_DENIED", ["role_required"]);
  }
  return currentUser.role.key;
}

function scopedTenantId(currentUser: CurrentUserContext, requestedClientTenantId?: string) {
  if (currentUser.tenant) {
    if (requestedClientTenantId && requestedClientTenantId !== currentUser.tenant.id) {
      throw new ProcessRuntimeError("Process runtime is tenant scoped.", 403, "PERMISSION_DENIED", ["tenant_scope_denied"]);
    }
    return currentUser.tenant.id;
  }

  if (!requestedClientTenantId) {
    throw new ProcessRuntimeError("Process runtime requires a client tenant.", 400, "INVALID_REQUEST", ["client_tenant_required"]);
  }

  return requestedClientTenantId;
}

async function permissionKeysForCurrentRole(prisma: PrismaClient, currentUser: CurrentUserContext) {
  const roleId = currentUser.role?.id;
  if (!roleId) return [];

  const rolePermissions = await prisma.rolePermission.findMany({
    include: {
      permission: {
        select: { key: true },
      },
    },
    where: {
      effect: "allow",
      roleId,
    },
  });

  return rolePermissions.map((rolePermission) => rolePermission.permission.key);
}

function requireProcessViewPermission(permissionKeys: string[]) {
  if (!permissionKeys.includes("process.view") && !permissionKeys.includes("process.manage")) {
    throw new ProcessRuntimeError("Process runtime is not visible for this role.", 403, "PERMISSION_DENIED", [
      "process_view_denied",
    ]);
  }
}

function requireProcessManagePermission(permissionKeys: string[]) {
  if (!permissionKeys.includes("process.manage")) {
    throw new ProcessRuntimeError("Process command is not permitted for this role.", 403, "PERMISSION_DENIED", [
      "process_command_denied",
    ]);
  }
}

function projectProcess(instance: ProcessInstanceWithGraph) {
  return {
    blockerCode: instance.blockerCode,
    blockerReason: instance.blockerReason,
    clientTenantId: instance.clientTenantId,
    commandHistory: instance.commandRuns.map((run) => ({
      actorRoleKey: run.actorRoleKey,
      commandKey: run.commandKey,
      createdAt: run.createdAt.toISOString(),
      fromStepId: run.fromStepId,
      id: run.id,
      nextState: run.nextState,
      previousState: run.previousState,
      result: run.result,
      toStepId: run.toStepId,
    })),
    currentSequence: instance.currentSequence,
    currentStepId: instance.currentStepId,
    id: instance.id,
    processId: instance.processDefinition.processId,
    processName: instance.processDefinition.processName,
    status: instance.status,
    steps: instance.steps.map((step) => ({
      actor: step.actor,
      blockerCode: step.blockerCode,
      blockerReason: step.blockerReason,
      sequence: step.sequence,
      status: step.status,
      stepId: step.stepId,
      stepLabel: step.stepLabel,
    })),
  };
}

function runtimeFromInstance(instance: ProcessInstanceWithGraph): ProcessRuntime {
  const definition = requireProcessDefinition(instance.processDefinition.processId);

  return {
    blockerCode: instance.blockerCode ?? undefined,
    blockerReason: instance.blockerReason ?? undefined,
    currentStepId: instance.currentStepId ?? undefined,
    definition,
    processId: definition.processId,
    status: instance.status,
    steps: instance.steps.map((step) => ({
      actor: step.actor,
      blockerCode: step.blockerCode ?? undefined,
      blockerReason: step.blockerReason ?? undefined,
      sequence: step.sequence,
      status: step.status,
      stepId: step.stepId,
      stepLabel: step.stepLabel,
    })),
  };
}

function auditEventTypeForCommand(command: ProcessCommandKey) {
  const eventTypes: Record<ProcessCommandKey, string> = {
    BLOCK: "process.blocked",
    CANCEL: "process.cancelled",
    COMPLETE_STEP: "process.step.completed",
    START: "process.started",
  };

  return eventTypes[command];
}

function auditResultForCommand(command: ProcessCommandKey) {
  return command === "BLOCK" ? AuditResult.BLOCKED : AuditResult.SUCCESS;
}

function assertKnownProcessCommand(command: string): asserts command is ProcessCommandKey {
  if (command !== "START" && command !== "COMPLETE_STEP" && command !== "BLOCK" && command !== "CANCEL") {
    throw new ProcessRuntimeError("Process command is not supported.", 400, "INVALID_REQUEST", [
      "process_command_unsupported",
    ]);
  }
}

async function loadScopedProcessInstance(prisma: PrismaClient, currentUser: CurrentUserContext, processInstanceId: string) {
  const instance = await prisma.processInstance.findUnique({
    include: {
      commandRuns: { orderBy: { createdAt: "asc" } },
      objectLinks: true,
      processDefinition: true,
      steps: { orderBy: { sequence: "asc" } },
    },
    where: { id: processInstanceId },
  });

  if (!instance) {
    throw new ProcessRuntimeError("Process instance was not found.", 404, "NOT_FOUND", ["process_instance_missing"]);
  }

  if (currentUser.tenant && instance.clientTenantId !== currentUser.tenant.id) {
    throw new ProcessRuntimeError("Process instance is outside the active tenant scope.", 403, "PERMISSION_DENIED", [
      "tenant_scope_denied",
    ]);
  }

  return instance;
}

export async function listProcessesForCurrentUser(prisma: PrismaClient, currentUser: CurrentUserContext) {
  requireRole(currentUser);
  requireProcessViewPermission(await permissionKeysForCurrentRole(prisma, currentUser));

  const instances = await prisma.processInstance.findMany({
    include: {
      commandRuns: { orderBy: { createdAt: "asc" } },
      objectLinks: true,
      processDefinition: true,
      steps: { orderBy: { sequence: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
    where: currentUser.tenant ? { clientTenantId: currentUser.tenant.id } : undefined,
  });

  return {
    currentUser: {
      roleKey: currentUser.role?.key,
      tenantId: currentUser.tenant?.id,
    },
    processes: instances.map(projectProcess),
  };
}

export async function createProcessForCurrentUser(
  prisma: PrismaClient,
  currentUser: CurrentUserContext,
  input: { clientTenantId?: string; processId: string },
) {
  const roleKey = requireRole(currentUser);
  const permissionKeys = await permissionKeysForCurrentRole(prisma, currentUser);
  requireProcessManagePermission(permissionKeys);

  const definition = requireProcessDefinition(input.processId);
  if (definition.status !== "ACTIVE") {
    throw new ProcessRuntimeError("Process is not executable yet.", 403, "PERMISSION_DENIED", ["process_not_executable"]);
  }

  const clientTenantId = scopedTenantId(currentUser, input.clientTenantId);
  const dbDefinition = await prisma.processDefinition.findUnique({ where: { processId: definition.processId } });
  if (!dbDefinition) {
    throw new ProcessRuntimeError("Process definition is missing from persistence.", 500, "SAFE_ERROR", [
      "process_definition_missing",
    ]);
  }

  const firstStep = definition.steps[0];
  const created = await prisma.$transaction(async (tx) => {
    const instance = await tx.processInstance.create({
      data: {
        clientTenantId,
        currentSequence: firstStep?.sequence ?? null,
        currentStepId: firstStep?.stepId ?? null,
        metadataJson: {
          createdFromApi: true,
          processRuntimeBackbone: true,
        },
        ownerUserId: currentUser.actor.id,
        processDefinitionId: dbDefinition.id,
        startedAt: new Date(),
        status: ProcessInstanceStatus.ACTIVE,
      },
    });

    await tx.processStepInstance.createMany({
      data: definition.steps.map((step, index) => ({
        actor: step.actor,
        metadataJson: {
          acceptanceState: step.acceptanceState,
          action: step.action,
          decisionPoint: step.decisionPoint,
          processRuntimeBackbone: true,
        },
        processInstanceId: instance.id,
        sequence: step.sequence,
        startedAt: index === 0 ? new Date() : null,
        status: index === 0 ? ProcessStepStatus.ACTIVE : ProcessStepStatus.LOCKED,
        stepId: step.stepId,
        stepLabel: step.stepLabel,
      })),
    });

    await tx.processCommandRun.create({
      data: {
        actorRoleKey: roleKey,
        actorUserId: currentUser.actor.id,
        commandKey: "START",
        metadataJson: { processRuntimeBackbone: true },
        nextState: ProcessInstanceStatus.ACTIVE,
        previousState: ProcessInstanceStatus.CREATED,
        processInstanceId: instance.id,
        result: AuditResult.SUCCESS,
        toStepId: firstStep?.stepId ?? null,
      },
    });

    return instance;
  });

  return getProcessDetailForCurrentUser(prisma, currentUser, created.id);
}

export async function getProcessDetailForCurrentUser(
  prisma: PrismaClient,
  currentUser: CurrentUserContext,
  processInstanceId: string,
) {
  requireRole(currentUser);
  requireProcessViewPermission(await permissionKeysForCurrentRole(prisma, currentUser));

  const instance = await loadScopedProcessInstance(prisma, currentUser, processInstanceId);
  return projectProcess(instance);
}

export async function executeProcessCommandForCurrentUser(
  prisma: PrismaClient,
  currentUser: CurrentUserContext,
  input: {
    auditPersistenceAvailable?: boolean;
    command: ProcessCommandKey;
    fromStepId?: string;
    processInstanceId: string;
    reason?: string;
  },
) {
  const roleKey = requireRole(currentUser);
  const permissionKeys = await permissionKeysForCurrentRole(prisma, currentUser);
  requireProcessManagePermission(permissionKeys);

  if ((input.command === "BLOCK" || input.command === "CANCEL") && !input.reason) {
    throw new ProcessRuntimeError("Process command requires a reason.", 400, "INVALID_REQUEST", ["reason_required"]);
  }

  const platformTenant = await prisma.platformTenant.findFirst({ select: { id: true }, orderBy: { createdAt: "asc" } });
  if (!platformTenant) throw new ProcessRuntimeError("Platform tenant is missing.", 500, "SAFE_ERROR", ["platform_missing"]);

  const instance = await loadScopedProcessInstance(prisma, currentUser, input.processInstanceId);
  const previousProcess = runtimeFromInstance(instance);
  const transitionedProcess = (() => {
    try {
      return transitionProcess({
        actor: {
          permissions: permissionKeys,
          roleKey,
        },
        command: input.command,
        fromStepId: input.fromStepId,
        process: previousProcess,
        reason: input.reason,
      }).process;
    } catch (error) {
      throw new ProcessRuntimeError(error instanceof Error ? error.message : "Process transition failed.", 400, "INVALID_REQUEST", [
        "process_transition_denied",
      ]);
    }
  })();

  const result = await prisma.$transaction(async (tx) => {
    if (input.auditPersistenceAvailable === false) {
      throw new ProcessRuntimeError("Audit persistence unavailable; process mutation blocked.", 503, "SAFE_ERROR", [
        "AUDIT_PERSISTENCE_UNAVAILABLE",
      ]);
    }

    const currentStep = transitionedProcess.currentStepId
      ? transitionedProcess.steps.find((step) => step.stepId === transitionedProcess.currentStepId)
      : undefined;
    const auditResult = auditResultForCommand(input.command);
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: roleKey,
        actorUserId: currentUser.actor.id,
        clientTenantId: instance.clientTenantId,
        eventType: auditEventTypeForCommand(input.command),
        metadataJson: {
          command: input.command,
          fromStepId: input.fromStepId ?? instance.currentStepId,
          processId: instance.processDefinition.processId,
          processRuntimeBackbone: true,
          toStepId: transitionedProcess.currentStepId ?? null,
        },
        nextState: transitionedProcess.status,
        platformTenantId: platformTenant.id,
        previousState: instance.status,
        reason: input.reason ?? null,
        result: auditResult,
        targetId: instance.id,
        targetType: ObjectType.PROCESS,
      },
    });

    await tx.processInstance.update({
      data: {
        blockerCode: transitionedProcess.blockerCode ?? null,
        blockerReason: transitionedProcess.blockerReason ?? null,
        completedAt: transitionedProcess.status === ProcessInstanceStatus.COMPLETED ? new Date() : null,
        currentSequence: currentStep?.sequence ?? null,
        currentStepId: transitionedProcess.currentStepId ?? null,
        startedAt: input.command === "START" ? new Date() : undefined,
        status: transitionedProcess.status,
      },
      where: { id: instance.id },
    });

    for (const step of transitionedProcess.steps) {
      const previousStep = instance.steps.find((candidate) => candidate.stepId === step.stepId);
      if (!previousStep || previousStep.status === step.status) {
        if (
          previousStep &&
          (previousStep.blockerCode !== (step.blockerCode ?? null) || previousStep.blockerReason !== (step.blockerReason ?? null))
        ) {
          await tx.processStepInstance.update({
            data: {
              blockerCode: step.blockerCode ?? null,
              blockerReason: step.blockerReason ?? null,
            },
            where: {
              processInstanceId_stepId: {
                processInstanceId: instance.id,
                stepId: step.stepId,
              },
            },
          });
        }
        continue;
      }

      await tx.processStepInstance.update({
        data: {
          blockerCode: step.blockerCode ?? null,
          blockerReason: step.blockerReason ?? null,
          completedAt: step.status === ProcessStepStatus.COMPLETED ? new Date() : null,
          startedAt:
            step.status === ProcessStepStatus.ACTIVE && previousStep.status !== ProcessStepStatus.ACTIVE ? new Date() : undefined,
          status: step.status,
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
        actorRoleKey: roleKey,
        actorUserId: currentUser.actor.id,
        auditEventId: audit.id,
        commandKey: input.command,
        fromStepId: input.fromStepId ?? instance.currentStepId,
        metadataJson: { processRuntimeBackbone: true },
        nextState: transitionedProcess.status,
        previousState: instance.status,
        processInstanceId: instance.id,
        reason: input.reason ?? null,
        result: auditResult,
        toStepId: transitionedProcess.currentStepId ?? null,
      },
    });

    return audit.id;
  });

  return {
    auditEventId: result,
    detail: await getProcessDetailForCurrentUser(prisma, currentUser, instance.id),
    mutated: true,
  };
}

export async function blockProcessForCurrentUser(
  prisma: PrismaClient,
  currentUser: CurrentUserContext,
  input: { auditPersistenceAvailable?: boolean; processInstanceId: string; reason: string },
) {
  return executeProcessCommandForCurrentUser(prisma, currentUser, {
    auditPersistenceAvailable: input.auditPersistenceAvailable,
    command: "BLOCK",
    processInstanceId: input.processInstanceId,
    reason: input.reason,
  });
}

export function parseProcessCommand(command: string) {
  assertKnownProcessCommand(command);
  return command;
}

export function normalizeProcessRuntimeError(error: unknown): {
  body: { error: FailClosedReasonCode; issues: string[]; message: string };
  status: number;
} {
  if (error instanceof ProcessRuntimeError) {
    const code = failClosedReasonCode(error.code);

    return {
      body: { error: code, issues: error.issues, message: error.message },
      status: error.status,
    };
  }

  if (error instanceof Error && error.message.startsWith("Auth JWT")) {
    return {
      body: {
        error: "PERMISSION_DENIED",
        issues: ["auth_jwt_required"],
        message: "Process runtime requires a valid current-user JWT.",
      },
      status: 401,
    };
  }

  return {
    body: { error: "SAFE_ERROR", issues: ["process_runtime_unavailable"], message: "Process runtime request failed." },
    status: 500,
  };
}
