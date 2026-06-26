import { expect, test } from "@playwright/test";

import {
  validateCapabilityReportDrift,
  validateCapabilityReportDriftFromInputs,
} from "../lib/capability-report-drift-gate";

test.describe("capability report drift gate", () => {
  test("accepts the current report set against capture model context truth", () => {
    const result = validateCapabilityReportDrift();

    expect(result).toMatchObject({
      schemaModels: 53,
      status: "PASS",
      violations: [],
    });
    expect(result.requiredCapabilityStatuses).toEqual(
      expect.arrayContaining([
        "API_BACKED_PARTIAL",
        "BLOCKED_UI_SAFETY_STATE",
        "READMODEL_ONLY",
        "SERVICE_BACKED_INTERNAL",
        "STRONG_VERTICAL_CANDIDATE",
        "UI_ONLY_STATIC",
      ]),
    );
  });

  test("rejects stale generated claims before they become report truth", () => {
    const result = validateCapabilityReportDriftFromInputs([
      {
        path: "generated-capability-report.md",
        text: [
          "# Generated Capability Report",
          "",
          "AlphaVest has 49 models and every flow is complete.",
          "",
          "| Capability | Status |",
          "| --- | --- |",
          "| Export | `COMPLETE_VERTICAL_SLICE` |",
        ].join("\n"),
      },
    ]);

    expect(result.status).toBe("FAIL");
    expect(result.violations.map((violation) => violation.ruleId)).toEqual(
      expect.arrayContaining([
        "STALE_49_MODEL_CLAIM",
        "COMPLETE_VERTICAL_SLICE_OVERCLAIM",
        "MISSING_REQUIRED_CURRENT_TRUTH",
      ]),
    );
  });
});
