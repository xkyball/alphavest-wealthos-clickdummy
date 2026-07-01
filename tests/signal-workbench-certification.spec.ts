import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, EvidenceStatus, ObjectType, PrismaClient, RecommendationStatus, WorkflowStatus } from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  assertOperationalNoAutoAdviceForTrigger,
  certifyOperationalSignalWorkbenchExit,
  createOperationalActionItemFromSignal,
  createOperationalSignalIntake,
  identifyOperationalEvidenceGapFromWorkbench,
  operationalActionItemUiState,
  OperationalStage4ValidationError,
  triageOperationalWorkbenchAction,
  validateOperationalSignalForWorkflow,
} from "../lib/signal-workbench-service";
import { stableId } from "../lib/stable-id";

const operationalSignalKey = "external-liquidity-threshold";
const operationalTriggerId = stableId(`operational:stage4:trigger:morgan:${operationalSignalKey}`);
const operationalInvalidTriggerId = stableId("operational:stage4:trigger:morgan:invalid-signal");
const northbridgeTriggerId = stableId("trigger:northbridge:liquidity");
const northbridgeRecommendationId = stableId("recommendation:northbridge:liquidity-review");

test.describe.configure({ mode: "serial" });

test.describe("Operational Stage 4 signal, workbench and evidence-gap certification", () => {
  let prisma: PrismaClient;
  let evidenceRecordId: string | null = null;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Operational Stage 4 certification tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("Operational-4-T01 creates scoped signal intake, queue state and audit without client-visible advice", async () => {
    const result = await createOperationalSignalIntake(prisma, {
      actorRoleKey: "analyst",
      confidenceScore: 91,
      description: "External custodian signal requires internal liquidity threshold review.",
      reason: "External custodian signal must be reviewed before any advisor or client action.",
      scope: "tenant",
      severity: "high",
      signalKey: operationalSignalKey,
      source: "external_signal",
      tenantSlug: "morgan",
      title: "External liquidity threshold signal",
      triggerType: "liquidity_review",
    });

    expect(result).toMatchObject({
      clientVisible: false,
      noAutonomousAdvice: true,
      queueStatus: WorkflowStatus.NEW,
      status: WorkflowStatus.NEW,
      triggerId: operationalTriggerId,
    });

    const [trigger, queue, audit] = await Promise.all([
      prisma.trigger.findUniqueOrThrow({ where: { id: result.triggerId } }),
      prisma.queueItem.findUniqueOrThrow({ where: { id: result.queueItemId } }),
      prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } }),
    ]);

    expect(trigger.clientVisible).toBe(false);
    expect(queue.targetType).toBe(ObjectType.TRIGGER);
    expect(queue.targetId).toBe(trigger.id);
    expect(audit.eventType).toBe("operational.signal.intake.created");
    expect(audit.result).toBe(AuditResult.PENDING);
  });

  test("Operational-4-T02 validates source, confidence, severity and scope before workflow state is created", async () => {
    expect(
      validateOperationalSignalForWorkflow({
        confidenceScore: 77,
        scope: "tenant",
        severity: "medium",
        source: "internal_monitoring",
        title: "Internal trigger validation",
      }),
    ).toEqual({
      accepted: true,
      state: "validated_for_internal_workflow",
    });

    expect(() =>
      validateOperationalSignalForWorkflow({
        confidenceScore: 130,
        scope: "tenant",
        severity: "medium",
        source: "external_signal",
        title: "Invalid signal",
      }),
    ).toThrow(OperationalStage4ValidationError);

    const invalidRows = await prisma.trigger.count({ where: { id: operationalInvalidTriggerId } });
    expect(invalidRows).toBe(0);
  });

  test("Operational-4-T03 triages the analyst workbench lifecycle with audit and no client visibility", async () => {
    const result = await triageOperationalWorkbenchAction(prisma, {
      action: "route_to_advisor",
      actorRoleKey: "analyst",
      reason: "Analyst reviewed the signal and routes it to advisor review without release.",
      tenantSlug: "morgan",
      triggerId: operationalTriggerId,
    });

    expect(result).toMatchObject({
      actionStatus: WorkflowStatus.ADVISOR_REVIEW,
      clientVisible: false,
      noClientRelease: true,
      triggerStatus: WorkflowStatus.ADVISOR_REVIEW,
    });

    const [action, audit] = await Promise.all([
      prisma.actionItem.findUniqueOrThrow({ where: { id: result.actionItemId } }),
      prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } }),
    ]);

    expect(action.clientVisible).toBe(false);
    expect(action.assignedRoleKey).toBe("senior_wealth_advisor");
    expect(audit.eventType).toBe("operational.workbench.route_to_advisor");
  });

  test("Operational-4-T04 creates action items from signal/workbench without releasing advice", async () => {
    const result = await createOperationalActionItemFromSignal(prisma, {
      actorRoleKey: "analyst",
      assignedRoleKey: "compliance_officer",
      reason: "Compliance must review the external signal before advisor wording can be used.",
      tenantSlug: "morgan",
      title: "Compliance review external liquidity signal",
      triggerId: operationalTriggerId,
    });

    expect(result).toMatchObject({
      clientVisible: false,
      status: WorkflowStatus.NEW,
    });

    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } });
    expect(audit.targetType).toBe(ObjectType.ACTION_ITEM);
    expect(audit.eventType).toBe("operational.action_item.created_from_signal");
  });

  test("Operational-4-T05 exposes action item lifecycle UI states without hiding blockers", async () => {
    expect(
      operationalActionItemUiState({
        clientVisible: false,
        evidenceStatus: EvidenceStatus.PLACEHOLDER,
        status: WorkflowStatus.AWAITING_INFO,
      }),
    ).toEqual({
      clientSafe: true,
      primaryState: "awaiting_info",
      recoveryRequired: true,
    });

    expect(
      operationalActionItemUiState({
        blockedReason: "Missing source-of-funds evidence",
        clientVisible: false,
        status: WorkflowStatus.IN_REVIEW,
      }),
    ).toMatchObject({
      clientSafe: true,
      primaryState: "blocked",
      recoveryRequired: true,
    });
  });

  test("Operational-4-T06 flags an evidence gap and converts it into an evidence request path", async () => {
    const result = await identifyOperationalEvidenceGapFromWorkbench(prisma, {
      actorRoleKey: "analyst",
      gapReason: "Beneficial-owner evidence is missing for the rebalance trigger review.",
      tenantSlug: "northbridge",
      triggerId: northbridgeTriggerId,
    });

    evidenceRecordId = result.evidenceRecordId;

    expect(result).toMatchObject({
      clientVisible: false,
      requestState: "evidence_request_created",
      triggerStatus: WorkflowStatus.AWAITING_INFO,
    });
    expect(evidenceRecordId).toBeTruthy();

    const [recommendation, evidence] = await Promise.all([
      prisma.recommendation.findUniqueOrThrow({ where: { id: northbridgeRecommendationId } }),
      prisma.evidenceRecord.findUniqueOrThrow({ where: { id: evidenceRecordId ?? "" } }),
    ]);

    expect(recommendation.clientVisible).toBe(false);
    expect(recommendation.status).toBe(RecommendationStatus.MORE_DATA_REQUESTED);
    expect(evidence.status).toBe(EvidenceStatus.PLACEHOLDER);
  });

  test("Operational-4-T07 proves evidence-gap routing creates request or blocked state but no client visibility", async () => {
    expect(evidenceRecordId).toBeTruthy();

    const proof = await assertOperationalNoAutoAdviceForTrigger(prisma, {
      tenantSlug: "northbridge",
      triggerId: northbridgeTriggerId,
    });

    expect(proof).toMatchObject({
      autonomousAdviceCreated: false,
      clientVisibleActionItems: 0,
      clientVisibleRecommendations: 0,
      clientVisibleTrigger: false,
      safe: true,
    });
  });

  test("Operational-4-T08 keeps signal intake and triage internal until approval/release gates", async () => {
    await expect(
      createOperationalSignalIntake(prisma, {
        actorRoleKey: "principal",
        confidenceScore: 80,
        description: "Client role must not create internal workflow signal state.",
        reason: "Client role attempts to create internal signal workflow.",
        scope: "tenant",
        severity: "high",
        signalKey: "client-denied",
        source: "external_signal",
        tenantSlug: "morgan",
        title: "Client denied signal",
        triggerType: "liquidity_review",
      }),
    ).rejects.toThrow("Operational Stage 4 signal/workbench action is not permitted.");

    const proof = await assertOperationalNoAutoAdviceForTrigger(prisma, {
      tenantSlug: "morgan",
      triggerId: operationalTriggerId,
    });

    expect(proof.safe).toBe(true);
    expect(proof.clientVisibleTrigger).toBe(false);
  });

  test("Operational-4-T09 certifies Stage 4 exit with positive and negative proof coverage", () => {
    const certification = certifyOperationalSignalWorkbenchExit({
      negativeProofs: [
        "signal_not_client_advice",
        "invalid_signal_rejected",
        "triage_internal_only",
        "action_item_internal_only",
        "gap_flag_not_sufficiency",
        "gap_request_no_visibility",
        "no_autonomous_advice",
      ],
      readyProcessIds: ["D-001", "D-005", "D-006", "D-007"],
      ticketIds: [
        "Operational-4-T01-IMPL",
        "Operational-4-T02-IMPL",
        "Operational-4-T03-IMPL",
        "Operational-4-T04-IMPL",
        "Operational-4-T05-IMPL",
        "Operational-4-T06-IMPL",
        "Operational-4-T07-IMPL",
        "Operational-4-T08-IMPL",
        "Operational-4-T09-IMPL",
      ],
    });

    expect(certification).toEqual({
      missingProofs: [],
      missingTickets: [],
      stage: "PH4",
      ready: true,
    });
  });
});
