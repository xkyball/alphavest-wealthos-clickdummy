import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, EvidenceStatus, ObjectType, PrismaClient, RecommendationStatus, WorkflowStatus } from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  assertP44NoAutoAdviceForTrigger,
  certifyP44SignalWorkbenchExit,
  createP44ActionItemFromSignal,
  createP44SignalIntake,
  identifyP44EvidenceGapFromWorkbench,
  p44ActionItemUiState,
  P44Phase4ValidationError,
  triageP44WorkbenchAction,
  validateP44SignalForWorkflow,
} from "../lib/p44-phase4-signal-workbench";
import { stableId } from "../lib/stable-id";

const p44SignalKey = "external-liquidity-threshold";
const p44TriggerId = stableId(`p44:phase4:trigger:morgan:${p44SignalKey}`);
const p44InvalidTriggerId = stableId("p44:phase4:trigger:morgan:invalid-signal");
const northbridgeTriggerId = stableId("trigger:northbridge:liquidity");
const northbridgeRecommendationId = stableId("recommendation:northbridge:liquidity-review");

test.describe.configure({ mode: "serial" });

test.describe("P44 Phase 4 signal, workbench and evidence-gap certification", () => {
  let prisma: PrismaClient;
  let evidenceRecordId: string | null = null;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for P44 Phase 4 certification tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("P44-4-T01 creates scoped signal intake, queue state and audit without client-visible advice", async () => {
    const result = await createP44SignalIntake(prisma, {
      actorRoleKey: "analyst",
      confidenceScore: 91,
      description: "External custodian signal requires internal liquidity threshold review.",
      reason: "External custodian signal must be reviewed before any advisor or client action.",
      scope: "tenant",
      severity: "high",
      signalKey: p44SignalKey,
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
      triggerId: p44TriggerId,
    });

    const [trigger, queue, audit] = await Promise.all([
      prisma.trigger.findUniqueOrThrow({ where: { id: result.triggerId } }),
      prisma.queueItem.findUniqueOrThrow({ where: { id: result.queueItemId } }),
      prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } }),
    ]);

    expect(trigger.clientVisible).toBe(false);
    expect(queue.targetType).toBe(ObjectType.TRIGGER);
    expect(queue.targetId).toBe(trigger.id);
    expect(audit.eventType).toBe("p44.signal.intake.created");
    expect(audit.result).toBe(AuditResult.PENDING);
  });

  test("P44-4-T02 validates source, confidence, severity and scope before workflow state is created", async () => {
    expect(
      validateP44SignalForWorkflow({
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
      validateP44SignalForWorkflow({
        confidenceScore: 130,
        scope: "tenant",
        severity: "medium",
        source: "external_signal",
        title: "Invalid signal",
      }),
    ).toThrow(P44Phase4ValidationError);

    const invalidRows = await prisma.trigger.count({ where: { id: p44InvalidTriggerId } });
    expect(invalidRows).toBe(0);
  });

  test("P44-4-T03 triages the analyst workbench lifecycle with audit and no client visibility", async () => {
    const result = await triageP44WorkbenchAction(prisma, {
      action: "route_to_advisor",
      actorRoleKey: "analyst",
      reason: "Analyst reviewed the signal and routes it to advisor review without release.",
      tenantSlug: "morgan",
      triggerId: p44TriggerId,
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
    expect(audit.eventType).toBe("p44.workbench.route_to_advisor");
  });

  test("P44-4-T04 creates action items from signal/workbench without releasing advice", async () => {
    const result = await createP44ActionItemFromSignal(prisma, {
      actorRoleKey: "analyst",
      assignedRoleKey: "compliance_officer",
      reason: "Compliance must review the external signal before advisor wording can be used.",
      tenantSlug: "morgan",
      title: "Compliance review external liquidity signal",
      triggerId: p44TriggerId,
    });

    expect(result).toMatchObject({
      clientVisible: false,
      status: WorkflowStatus.NEW,
    });

    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } });
    expect(audit.targetType).toBe(ObjectType.ACTION_ITEM);
    expect(audit.eventType).toBe("p44.action_item.created_from_signal");
  });

  test("P44-4-T05 exposes action item lifecycle UI states without hiding blockers", async () => {
    expect(
      p44ActionItemUiState({
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
      p44ActionItemUiState({
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

  test("P44-4-T06 flags an evidence gap and converts it into an evidence request path", async () => {
    const result = await identifyP44EvidenceGapFromWorkbench(prisma, {
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

  test("P44-4-T07 proves evidence-gap routing creates request or blocked state but no client visibility", async () => {
    expect(evidenceRecordId).toBeTruthy();

    const proof = await assertP44NoAutoAdviceForTrigger(prisma, {
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

  test("P44-4-T08 keeps signal intake and triage internal until approval/release gates", async () => {
    await expect(
      createP44SignalIntake(prisma, {
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
    ).rejects.toThrow("P44 Phase 4 signal/workbench action is not permitted.");

    const proof = await assertP44NoAutoAdviceForTrigger(prisma, {
      tenantSlug: "morgan",
      triggerId: p44TriggerId,
    });

    expect(proof.safe).toBe(true);
    expect(proof.clientVisibleTrigger).toBe(false);
  });

  test("P44-4-T09 certifies Phase 4 exit with positive and negative proof coverage", () => {
    const certification = certifyP44SignalWorkbenchExit({
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
        "P44-4-T01-IMPL",
        "P44-4-T02-IMPL",
        "P44-4-T03-IMPL",
        "P44-4-T04-IMPL",
        "P44-4-T05-IMPL",
        "P44-4-T06-IMPL",
        "P44-4-T07-IMPL",
        "P44-4-T08-IMPL",
        "P44-4-T09-IMPL",
      ],
    });

    expect(certification).toEqual({
      missingProofs: [],
      missingTickets: [],
      phase: "PH4",
      ready: true,
    });
  });
});
