import { type BrowserContext } from "@playwright/test";

export type ScreencastProvisioningResult = {
  errors: string[];
  status: "passed" | "skipped";
  summary: Record<string, unknown>;
  warnings: string[];
};

export async function beforeJourney(input: {
  journeyId: string;
  outputDir: string;
}) {
  return {
    errors: [],
    status: "skipped",
    summary: {
      journeyId: input.journeyId,
      reason: "AlphaVest screencast uses existing seeded runtime fixtures for this contract.",
    },
    warnings: ["No database reset was performed by the screencast adapter."],
  } satisfies ScreencastProvisioningResult;
}

export async function setupBrowserContext(input: {
  baseUrl: string;
  context: BrowserContext;
}) {
  void input.baseUrl;
  void input.context;
}
