import { expect, test } from "@playwright/test";

import {
  uxStatusCommandAttributesFor,
  uxStatusCommandContractForLevel,
  uxStatusHierarchyLevelForComponentState,
  uxStatusHierarchyLevels,
} from "../lib/ux-status-command-hierarchy";

test.describe("EPIC-10 typed status and command hierarchy", () => {
  test("defines the approved status hierarchy levels", () => {
    expect([...uxStatusHierarchyLevels].sort()).toEqual([
      "attention",
      "blocking",
      "completed",
      "informational",
    ]);
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
      "data-ux-status-hierarchy-level": "blocking",
      "data-ux-status-missing-reason": "true",
      "data-ux-status-missing-recovery": "true",
      "data-ux-status-requires-reason": "true",
      "data-ux-status-requires-recovery": "true",
    });

    expect(uxStatusCommandAttributesFor({
      componentState: "validation",
      reason: "Missing evidence scope.",
      recoveryAction: "provide_evidence",
    })).toMatchObject({
      "data-ux-command-level": "recovery_command",
      "data-ux-status-hierarchy-level": "attention",
      "data-ux-status-missing-reason": "false",
      "data-ux-status-missing-recovery": "false",
      "data-ux-status-recovery-action": "provide_evidence",
    });
  });
});
