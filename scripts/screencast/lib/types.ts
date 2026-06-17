export type ScreencastSpeedProfileName = "human-demo" | "qa-fast";

export type ScreencastLocatorTarget = {
  role?: string;
  name?: string;
  selector?: string;
  text?: string;
  label?: string;
  placeholder?: string;
  testId?: string;
};

export type ScreencastInteraction =
  | {
      type: "none";
    }
  | {
      type: "click";
      required?: boolean;
    }
  | {
      type: "fill";
      value: string;
      clear?: boolean;
      submitWithEnter?: boolean;
      required?: boolean;
    }
  | {
      type: "select";
      value: string;
      required?: boolean;
    }
  | {
      type: "check";
      checked?: boolean;
      required?: boolean;
    }
  | {
      type: "press";
      key: string;
      required?: boolean;
    };

export type ScreencastStepNavigation = "goto" | "continue";

export type ScreencastStep = {
  step: number;
  id?: string;
  title?: string;
  role: string;
  roleKey?: string;
  tenant: string;
  tenantSlug?: string;
  route: string;
  screen: string;
  inputData: string[];
  action: string;
  target?: ScreencastLocatorTarget | string | null;
  interaction?: ScreencastInteraction;
  navigation?: ScreencastStepNavigation;
  dataRefs?: string[];
  caption: string;
  expectedVisibleText: string[];
  expectedStateChange: string;
  blockedActions: string[];
  clientVisibility: string;
  evidence: string;
  audit: string;
  qaAssertion: string;
  pauseMs: number;
  screenshotName: string;
  manualOrStatic: boolean;
  sourceProof: string[];
};

export type ScreencastJourney = {
  id: string;
  name: string;
  portfolioLayer?: "legacy" | "P0" | "P1" | "P2" | "P3";
  candidateId?: string;
  legacyJourneyIds?: string[];
  demoPriority?: "P0" | "P1" | "P2" | "P3";
  audienceFit?: string[];
  currentRealityLabel?: string;
  proofLevel?: "PL0" | "PL1" | "PL2" | "PL3" | "PL4" | "PL5" | "PL6";
  overclaimRisk?: string;
  caveat?: string;
  proofPath?: string[];
  captionShort?: string;
  captionLong?: string;
  presenterNotes?: string[];
  customerSendable?: boolean;
  fixtureId?: string;
  provisioning?: {
    mode: "database-fixture";
    fixtureId: string;
    resetStrategy: "base-seed";
    required: boolean;
    seedCommand: string;
    validates: string[];
  };
  primaryActor: string;
  additionalRoles: string[];
  tenant: string;
  startRoute: string;
  endState: string;
  demoSession: {
    mode: "demo";
    defaultRoleKey: string;
    defaultTenantSlug: string;
  };
  queryParams: Record<string, string>;
  preconditions: string[];
  demoData: string[];
  visibilityRules: string[];
  complianceRules: string[];
  evidenceExpectations: string[];
  auditExpectations: string[];
  riskNotes: string[];
  steps: ScreencastStep[];
};

export type ScreencastDefinitionFile = {
  schemaVersion: string;
  engineMode: string;
  outputRoot: string;
  sourcePlaybook: string;
  generatedFor: string;
  manifestId?: string;
  portfolioLayer?: "legacy" | "P0" | "P1" | "P2" | "P3";
  requiresPortfolioMetadata?: boolean;
  speedProfiles?: ScreencastSpeedProfileName[];
  journeys: ScreencastJourney[];
};

export type StepQaResult = {
  step: number;
  id: string;
  title: string;
  route: string;
  screen: string;
  action: string;
  target: string;
  caption: string;
  interaction: string;
  dataRefs: string[];
  status: "pass" | "warning" | "fail" | "manual_static";
  startedAt: string;
  endedAt: string;
  elapsedMs: number;
  screenshotPath?: string;
  clicked: boolean;
  clickFallback: boolean;
  interactionAttempted: boolean;
  interactionSucceeded: boolean;
  interactionFailed: boolean;
  interactionFallback: boolean;
  manualOrStatic: boolean;
  visibleText: string[];
  missingVisibleText: string[];
  warnings: string[];
};

export type JourneyProvisioningResult = {
  status: "skipped" | "passed" | "failed";
  fixtureId?: string;
  mode?: "database-fixture";
  resetStrategy?: "base-seed";
  command?: string;
  outputPath?: string;
  summary?: Record<string, unknown>;
  warnings: string[];
  errors: string[];
};

export type JourneyQaResult = {
  journeyId: string;
  journeyName: string;
  manifestPath?: string;
  portfolioLayer?: string;
  candidateId?: string;
  currentRealityLabel?: string;
  proofLevel?: string;
  caveat?: string;
  status: "passed" | "completed_with_warnings" | "failed" | "dry_run";
  baseUrl: string;
  runRoot: string;
  startedAt: string;
  finishedAt: string;
  elapsedMs: number;
  outputDir: string;
  provisioning?: JourneyProvisioningResult;
  rawVideoPath?: string;
  videoPath?: string;
  mp4Path?: string;
  captionsPath?: string;
  captionMode?: "burned-in" | "embedded-track" | "unavailable";
  runLogPath?: string;
  storyboardPath?: string;
  resolvedManifestPath?: string;
  tracePath?: string;
  screenshotsDir: string;
  steps: StepQaResult[];
  warnings: string[];
  errors: string[];
};

export type RunnerOptions = {
  baseUrl: string;
  manifestPath: string;
  dryRun: boolean;
  headed: boolean;
  strict: boolean;
  skipProvisioning: boolean;
  provisionOnly: boolean;
  speed: ScreencastSpeedProfileName;
  date?: string;
  journeyId?: string;
};
