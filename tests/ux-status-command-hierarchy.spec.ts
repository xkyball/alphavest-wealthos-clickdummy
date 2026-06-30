import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

import {
  uxConfirmationAttributesFor,
  uxConfirmationScopes,
  uxConfirmationStates,
  uxStatusCommandAttributesFor,
  uxStatusCommandContractForLevel,
  uxStatusHierarchyLevelForComponentState,
  uxStatusHierarchyLevels,
  uxStatusPrimitiveContractId,
  uxStatusPrimitiveFamilies,
} from "../lib/ux-status-command-hierarchy";

const repoRoot = process.cwd();

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

test.describe("DOMAIN-10 typed status and command hierarchy", () => {
  test("defines the approved status hierarchy levels", () => {
    expect([...uxStatusHierarchyLevels].sort()).toEqual([
      "attention",
      "blocking",
      "completed",
      "informational",
    ]);
    expect(uxStatusPrimitiveContractId).toBe("domain_05_status_action_blocker_confirmation");
    expect(uxStatusPrimitiveFamilies).toEqual([
      "status",
      "action",
      "blocker",
      "confirmation",
    ]);
    expect(uxConfirmationStates).toContain("validation_failed");
    expect(uxConfirmationScopes).toContain("compliance_release");
    expect(uxConfirmationScopes).toContain("export_download");
  });

  test("requires reason and recovery action for blocking and attention states", () => {
    for (const level of ["attention", "blocking"] as const) {
      const contract = uxStatusCommandContractForLevel(level);

      expect(contract.requiresReason, `${level} reason`).toBe(true);
      expect(contract.requiresRecoveryAction, `${level} recovery`).toBe(true);
      expect(contract.noOverclaimRule, `${level} no-overclaim`).toContain("must not");
    }

    expect(uxStatusCommandContractForLevel("completed").requiresReason).toBe(false);
    expect(uxStatusCommandContractForLevel("informational").commandLevel).toBe("status_only");
  });

  test("maps component states into command hierarchy without route-local meanings", () => {
    expect(uxStatusHierarchyLevelForComponentState("blocked")).toBe("blocking");
    expect(uxStatusHierarchyLevelForComponentState("restricted")).toBe("blocking");
    expect(uxStatusHierarchyLevelForComponentState("validation")).toBe("attention");
    expect(uxStatusHierarchyLevelForComponentState("export-redaction")).toBe("attention");
    expect(uxStatusHierarchyLevelForComponentState("loading")).toBe("informational");
    expect(uxStatusHierarchyLevelForComponentState("success")).toBe("completed");
  });

  test("flags missing blocker reason and recovery metadata", () => {
    expect(uxStatusCommandAttributesFor({ componentState: "blocked" })).toMatchObject({
      "data-ux-command-level": "blocked_command",
      "data-ux-status-primitive-contract": "domain_05_status_action_blocker_confirmation",
      "data-ux-status-primitive-family": "blocker",
      "data-ux-status-hierarchy-level": "blocking",
      "data-ux-status-missing-reason": "true",
      "data-ux-status-missing-recovery": "true",
      "data-ux-status-requires-reason": "true",
      "data-ux-status-requires-recovery": "true",
    });

    expect(uxStatusCommandAttributesFor({
      componentState: "validation",
      primitiveFamily: "action",
      reason: "Missing evidence scope.",
      recoveryAction: "provide_evidence",
    })).toMatchObject({
      "data-ux-command-level": "recovery_command",
      "data-ux-status-primitive-family": "action",
      "data-ux-status-hierarchy-level": "attention",
      "data-ux-status-missing-reason": "false",
      "data-ux-status-missing-recovery": "false",
      "data-ux-status-recovery-action": "provide_evidence",
    });
  });

  test("projects confirmation primitive attributes without downstream overclaim", () => {
    expect(uxConfirmationAttributesFor({
      actionMeaning: "release",
      scope: "compliance_release",
      state: "ready",
    })).toMatchObject({
      "data-ux-action-meaning": "release",
      "data-ux-confirmation-no-overclaim": "true",
      "data-ux-confirmation-requires-audit": "true",
      "data-ux-confirmation-scope": "compliance_release",
      "data-ux-confirmation-state": "ready",
      "data-ux-no-overclaim": "true",
      "data-ux-status-primitive-contract": "domain_05_status_action_blocker_confirmation",
      "data-ux-status-primitive-family": "confirmation",
    });
  });

  test("marks S039 compliance decision room as the DOMAIN-05 representative primitive consumer", () => {
    const source = readSource("components", "internal-workflow-screen.tsx");

    expect(source).toContain('data-testid="s039-domain05-primitive-consumer"');
    expect(source).toContain('data-ux-domain05-target-screen="S039"');
    expect(source).toContain("uxStatusCommandAttributesFor");
    expect(source).toContain('primitiveFamily: "blocker"');
    expect(source).toContain('recoveryAction: "review_policy"');
    expect(source).toContain("uxConfirmationAttributesFor");
    expect(source).toContain('scope: "compliance_release"');
    expect(source).toContain('data-testid="uxp3-compliance-sensitive-action-lifecycle"');
    expect(source).toContain("Confirmation is valid. Submit can persist the audited compliance action while release remains separately gated.");
  });

  test("locks DOMAIN-05 no-overclaim rules and required runtime attributes to the machine-readable contract", () => {
    const contract = JSON.parse(readSource(
      "docs",
      "00-current",
      "ALPHAVEST_STATUS_ACTION_BLOCKER_CONFIRMATION_PRIMITIVES_CONTRACT.json",
    )) as {
      forbiddenUsage: Record<"action" | "blocker" | "confirmation" | "status", string[]>;
      primitiveFamilies: string[];
      runtimeAttributeRequirements: Record<"action" | "blocker" | "confirmation" | "status", string[]>;
    };
    const forbiddenClaims = [
      ...contract.forbiddenUsage.status,
      ...contract.forbiddenUsage.action,
      ...contract.forbiddenUsage.blocker,
      ...contract.forbiddenUsage.confirmation,
    ].join(" ");
    const blockingAttributes = uxStatusCommandAttributesFor({
      actionMeaning: "release",
      componentState: "blocked",
      primitiveFamily: "blocker",
      reason: "Release evidence is incomplete.",
      recoveryAction: "provide_evidence",
    });
    const confirmationAttributes = uxConfirmationAttributesFor({
      actionMeaning: "release",
      scope: "compliance_release",
      state: "validation_failed",
    });

    expect(contract.primitiveFamilies).toEqual(["status", "action", "blocker", "confirmation"]);
    expect(forbiddenClaims).toContain("release");
    expect(forbiddenClaims).toContain("export");
    expect(forbiddenClaims).toContain("evidence sufficiency");
    expect(forbiddenClaims).toContain("permission mutation");
    expect(forbiddenClaims).toContain("screenshots alone");
    for (const attribute of contract.runtimeAttributeRequirements.status) {
      expect(blockingAttributes).toHaveProperty(attribute);
    }
    for (const attribute of contract.runtimeAttributeRequirements.blocker) {
      expect(blockingAttributes).toHaveProperty(attribute);
    }
    for (const attribute of contract.runtimeAttributeRequirements.confirmation) {
      expect(confirmationAttributes).toHaveProperty(attribute);
    }
    expect(blockingAttributes["data-ux-status-missing-reason"]).toBe("false");
    expect(blockingAttributes["data-ux-status-missing-recovery"]).toBe("false");
    expect(confirmationAttributes["data-ux-confirmation-no-overclaim"]).toBe("true");
  });
});
