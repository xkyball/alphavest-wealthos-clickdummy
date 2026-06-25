import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { routeRegistryCount, routeWorksetIntegrity, type RouteScopeLabel } from "./route-registry";

export const phase0LockedRouteWorksetCounts: Record<RouteScopeLabel, number> = {
  MVP: 31,
  MVP_SUPPORT: 25,
  P1_AFTER_MVP: 5,
  REFERENCE_ONLY: 3,
  HOLD_PENDING_DECISION: 7,
};

export const phase0LockedApiRoutes = [
  "app/api/admin-tenants/route.ts",
  "app/api/audit-events/route.ts",
  "app/api/auth/dummy/route.ts",
  "app/api/auth/logout/route.ts",
  "app/api/auth/mfa/verify/route.ts",
  "app/api/auth/provider-login/route.ts",
  "app/api/auth/providers/route.ts",
  "app/api/current-user/route.ts",
  "app/api/dashboard-metrics/route.ts",
  "app/api/demo-workflow/route.ts",
  "app/api/documents/review/route.ts",
  "app/api/documents/route.ts",
  "app/api/documents/upload/route.ts",
  "app/api/entities/route.ts",
  "app/api/export-workflow/route.ts",
  "app/api/family-members/route.ts",
  "app/api/global-search/route.ts",
  "app/api/journeys/[id]/audit/route.ts",
  "app/api/journeys/[id]/client-projection/route.ts",
  "app/api/journeys/[id]/commands/route.ts",
  "app/api/journeys/[id]/evidence-sufficiency/route.ts",
  "app/api/journeys/[id]/route.ts",
  "app/api/journeys/route.ts",
  "app/api/ops-sla/route.ts",
  "app/api/profile/route.ts",
  "app/api/review-monitoring/route.ts",
] as const;

export const phase0LockedPrismaShape = {
  enumCount: 31,
  modelCount: 53,
} as const;

export const phase0P0GateLabels = [
  "client advice",
  "evidence",
  "export",
  "RBAC",
  "committee",
  "KYC",
  "rebalance",
  "client-safe",
  "audit",
  "advisor approval",
  "compliance release",
  "AI Draft",
  "admin",
] as const;

export const trueUxSourceHierarchyMarkers = [
  "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md",
  "TRUE_UX_IMPLEMENTATION_HANDOFF_APPROVED_WITH_CONSTRAINTS",
  "AUTHORIZED_ONLY_WITHIN_THIS_HANDOFF",
  "MANDATORY_BEFORE_ANY_CODE_CHANGE",
  "MUST_RECHECK_CURRENT_FULL_WORKFLOW_BEFORE_EXECUTION",
  "TRUE_UX_CODEX_TASK_PACK_APPLIED",
  "Never target truth",
] as const;

export const trueUxRequiredSupportArtifacts = [
  {
    path: "ALPHAVEST_TRUE_UX_CODEX_TASK_PACK.md",
    markers: ["TRUE_UX_CODEX_TASK_PACK_ACCEPTED_WITH_IMPLEMENTATION_HANDOFF_DEPENDENCY", "77 task-pack entries", "No task in this pack authorizes execution"],
  },
  {
    path: "ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md",
    markers: ["ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN", "Priority Flow Set", "Route Evolution"],
  },
  {
    path: "ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md",
    markers: ["ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX", "Route Evolution", "Screen Split"],
  },
  {
    path: "ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE_AND_ROUTE_EVOLUTION_POLICY.md",
    markers: ["ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE", "Product Owner", "AUTO_APPROVED_UNLESS_SAFETY_CONFLICT"],
  },
  {
    path: "ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN.md",
    markers: ["ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY", "Route Evolution", "ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md"],
  },
  {
    path: "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF_REPO_LOCAL_BUNDLE_MANIFEST.md",
    markers: ["REPO_LOCAL_ARTIFACT_BUNDLE_CREATED", "Included artefact count", "Codex Usage Instructions"],
  },
  {
    path: "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF_REPO_LOCAL_REFERENCE_REWRITE_REPORT.md",
    markers: ["REPO_LOCAL_REFERENCE_REWRITE_COMPLETED", "Manual Review Notes", "repo-local preflight requirements"],
  },
] as const;

export const trueUxEntrypointFiles = [
  "AGENTS.md",
  "CODEX_MASTER_TASK.md",
  "FINAL_CODEX_IMPLEMENTATION_HANDOFF.md",
  "README.md",
] as const;

export const trueUxTechnicalGuardScanFiles = [
  "AGENTS.md",
  "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md",
  "CODEX_MASTER_TASK.md",
  "FINAL_CODEX_IMPLEMENTATION_HANDOFF.md",
  "README.md",
] as const;

export const trueUxTechnicalGuardRequiredScripts = {
  "guard:source": "tsx scripts/source-target-guard.ts",
  "test:source-reality": "playwright test tests/source-reality-gate.spec.ts",
} as const;

export type TechnicalGuardRuleId =
  | "NO_MAIN_TARGET_TRUTH"
  | "NO_UNAUTHORIZED_SCREEN_ASSET_GENERATION"
  | "NO_BLIND_SCHEMA_OR_PATCH_REPLACEMENT"
  | "NO_SCOPE_ELEVATION_WITHOUT_POLICY";

export type TechnicalGuardViolation = {
  filePath: string;
  line: number;
  ruleId: TechnicalGuardRuleId | "MISSING_FILE" | "MISSING_MARKER" | "MISSING_SCRIPT";
  message: string;
  excerpt: string;
};

type TechnicalGuardRule = {
  id: TechnicalGuardRuleId;
  message: string;
  forbidden: RegExp[];
  allowedContext: RegExp;
};

export const trueUxTechnicalGuardRules: TechnicalGuardRule[] = [
  {
    id: "NO_MAIN_TARGET_TRUTH",
    message: "`main` may be referenced only as a false-gap warning, never as target truth or implementation source.",
    forbidden: [
      /\btarget\s+branch\s*:\s*`?main`?/i,
      /\btarget\s+codebase\s*:\s*.*\bmain\b/i,
      /\buse\s+(?:only\s+)?(?:the\s+)?`?main`?\s+as\s+(?:the\s+)?(?:target|target\s+truth|implementation\s+source|source\s+of\s+truth)/i,
      /\b`?main`?\s+(?:is|remains|must\s+be|should\s+be)\s+(?:the\s+)?(?:target|target\s+truth|target\s+branch|implementation\s+source|source\s+of\s+truth)/i,
      /\bderive\b.*\bfrom\b.*\b`?main`?\b/i,
    ],
    allowedContext:
      /(?:do\s+not\s+use\s+`?main`?|may\s+not\s+.*`?main`?.*(?:target|truth|source)|never\s+.*`?main`?.*(?:target|truth|source)|`?main`?.*(?:false[- ]gap|warning\s+only|never\s+target\s+truth)|no\s+`?main`?\s+target\s+truth|stop\s+if.*`?main`?)/i,
  },
  {
    id: "NO_UNAUTHORIZED_SCREEN_ASSET_GENERATION",
    message: "Screen, image, state-screen or visual asset generation is not authorized by the True UX handoff.",
    forbidden: [
      /\bgenerate\b.*\b(?:screen|screens|image|images|state-screen|state-screen\s+asset|visual\s+asset|visual\s+assets)\b/i,
      /\bcreate\b.*\b(?:screen\s+asset|screen\s+assets|state-screen\s+asset|state-screen\s+assets|generated\s+visual\s+asset)\b/i,
    ],
    allowedContext: /(?:do\s+not|must\s+not|must\s+not\s+do|may\s+not|codex\s+must\s+not\s+do|no\s+|not\s+authorized|forbidden|out\s+of\s+scope|stop\s+if|without)/i,
  },
  {
    id: "NO_BLIND_SCHEMA_OR_PATCH_REPLACEMENT",
    message: "Blind schema replacement or patch-schema adoption is forbidden without an explicit approved task.",
    forbidden: [/\bblind\s+schema\s+replacement\b/i, /\bpatch[- ]schema\b/i, /\breplace\b.*\bschema\b.*\bblindly\b/i],
    allowedContext:
      /(?:do\s+not|must\s+not|no\s+|not\s+authorized|forbidden|out\s+of\s+scope|stop\s+if|without|restricted|would\s+require\s+blind\s+schema\s+replacement)/i,
  },
  {
    id: "NO_SCOPE_ELEVATION_WITHOUT_POLICY",
    message: "P1, reference-only or hold routes may not be promoted into MVP without route-evolution policy support.",
    forbidden: [
      /\bpromote\b.*\b(?:P1|reference-only|hold)\b.*\b(?:MVP|primary|target)\b/i,
      /\belevate\b.*\b(?:P1|reference-only|hold)\b.*\b(?:MVP|primary|target)\b/i,
    ],
    allowedContext: /(?:do\s+not|must\s+not|no\s+|not\s+authorized|forbidden|out\s+of\s+scope|stop\s+if|without|policy|route\s+evolution)/i,
  },
];

export const oldSourceOfTruthPhrases = [
  "ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md remains the sole operative",
  "Use ALPHAVEST_UX_ROUTE_POLICY_MATRIX.md and ALPHAVEST_UX_REFACTORING_CODEX_TASK_MASTER.md as the active UX sources",
  "Current active workstream sources",
  "UX_IMPLEMENTATION_HANDOFF_MISSING_POLICY_OVERRIDDEN",
  "ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md is the operative",
  "ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md is the operative",
  "ALPHAVEST_E2E_JOURNEY_PROOF_25_CODEX_TASK_PACK.md is the operative",
] as const;

function walkFiles(currentPath: string, predicate: (fileName: string) => boolean, rootPath: string, matches: string[]) {
  for (const entry of readdirSync(currentPath, { withFileTypes: true })) {
    const absolutePath = path.join(currentPath, entry.name);

    if (entry.isDirectory()) {
      walkFiles(absolutePath, predicate, rootPath, matches);
      continue;
    }

    if (entry.isFile() && predicate(entry.name)) {
      matches.push(path.relative(rootPath, absolutePath).split(path.sep).join("/"));
    }
  }
}

export function listNamedFiles(relativeRoot: string, fileName: string, cwd = process.cwd()) {
  const rootPath = path.join(cwd, relativeRoot);
  const matches: string[] = [];
  walkFiles(rootPath, (entryName) => entryName === fileName, cwd, matches);

  return matches.sort();
}

export function listFilesBySuffix(relativeRoot: string, suffix: string, cwd = process.cwd()) {
  const rootPath = path.join(cwd, relativeRoot);
  const matches: string[] = [];
  walkFiles(rootPath, (entryName) => entryName.endsWith(suffix), cwd, matches);

  return matches.sort();
}

export function listApiRouteFiles(cwd = process.cwd()) {
  return listNamedFiles("app/api", "route.ts", cwd);
}

export function listSpecFiles(cwd = process.cwd()) {
  return listFilesBySuffix("tests", ".spec.ts", cwd);
}

export function readPrismaShape(cwd = process.cwd()) {
  const schema = readFileSync(path.join(cwd, "prisma/schema.prisma"), "utf8");

  return {
    enumCount: [...schema.matchAll(/^enum\s+(\w+)\s+\{/gm)].length,
    modelCount: [...schema.matchAll(/^model\s+(\w+)\s+\{/gm)].length,
  };
}

export function readTrueUxHandoff(cwd = process.cwd()) {
  return readFileSync(path.join(cwd, "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md"), "utf8");
}

export function readTrueUxSupportArtifactTexts(cwd = process.cwd()) {
  return trueUxRequiredSupportArtifacts.map((artifact) => {
    const absolutePath = path.join(cwd, artifact.path);

    return {
      exists: existsSync(absolutePath),
      markers: artifact.markers,
      path: artifact.path,
      text: existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "",
    };
  });
}

export function readTrueUxEntrypointTexts(cwd = process.cwd()) {
  return trueUxEntrypointFiles.map((entrypointPath) => {
    const absolutePath = path.join(cwd, entrypointPath);

    return {
      path: entrypointPath,
      text: readFileSync(absolutePath, "utf8"),
    };
  });
}

export function readTrueUxTechnicalGuardTargetTexts(cwd = process.cwd()) {
  return trueUxTechnicalGuardScanFiles.map((filePath) => {
    const absolutePath = path.join(cwd, filePath);

    return {
      exists: existsSync(absolutePath),
      path: filePath,
      text: existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "",
    };
  });
}

export function findTechnicalGuardViolationsForText(filePath: string, text: string) {
  const violations: TechnicalGuardViolation[] = [];
  const lines = text.split(/\r?\n/);

  lines.forEach((lineText, index) => {
    const contextText = [lines[index - 2] ?? "", lines[index - 1] ?? "", lineText].join(" ");

    for (const rule of trueUxTechnicalGuardRules) {
      const matchesForbiddenPattern = rule.forbidden.some((pattern) => pattern.test(lineText));

      if (matchesForbiddenPattern && !rule.allowedContext.test(contextText)) {
        violations.push({
          filePath,
          line: index + 1,
          ruleId: rule.id,
          message: rule.message,
          excerpt: lineText.trim(),
        });
      }
    }
  });

  return violations;
}

export function evaluateTrueUxTechnicalGuard(cwd = process.cwd()) {
  const violations: TechnicalGuardViolation[] = [];
  const targetTexts = readTrueUxTechnicalGuardTargetTexts(cwd);

  for (const target of targetTexts) {
    if (!target.exists) {
      violations.push({
        filePath: target.path,
        line: 0,
        ruleId: "MISSING_FILE",
        message: "True UX technical guard scan target is missing.",
        excerpt: target.path,
      });
      continue;
    }

    violations.push(...findTechnicalGuardViolationsForText(target.path, target.text));
  }

  const handoffText = targetTexts.find((target) => target.path === "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md")?.text ?? "";
  const agentsText = targetTexts.find((target) => target.path === "AGENTS.md")?.text ?? "";

  for (const [filePath, text] of [
    ["AGENTS.md", agentsText],
    ["ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md", handoffText],
  ] as const) {
    if (!text.includes("full-workflow")) {
      violations.push({
        filePath,
        line: 0,
        ruleId: "MISSING_MARKER",
        message: "Active guard file must preserve `full-workflow` as the target codebase marker.",
        excerpt: "full-workflow",
      });
    }

    if (!text.includes("ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md")) {
      violations.push({
        filePath,
        line: 0,
        ruleId: "MISSING_MARKER",
        message: "Active guard file must name the True UX implementation handoff.",
        excerpt: "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md",
      });
    }
  }

  const packageJsonPath = path.join(cwd, "package.json");
  const packageJsonText = readFileSync(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonText) as { scripts?: Record<string, string> };

  for (const [scriptName, expectedCommand] of Object.entries(trueUxTechnicalGuardRequiredScripts)) {
    if (packageJson.scripts?.[scriptName] !== expectedCommand) {
      violations.push({
        filePath: "package.json",
        line: 0,
        ruleId: "MISSING_SCRIPT",
        message: `Expected package script \`${scriptName}\` to run \`${expectedCommand}\`.`,
        excerpt: packageJson.scripts?.[scriptName] ?? "<missing>",
      });
    }
  }

  return {
    checkedFiles: targetTexts.map((target) => target.path),
    checkedScripts: Object.keys(trueUxTechnicalGuardRequiredScripts),
    violations,
  };
}

export function buildPhase0SourceRealitySnapshot(cwd = process.cwd()) {
  return {
    apiRouteFiles: listApiRouteFiles(cwd),
    p0GateLabels: phase0P0GateLabels,
    planText: readTrueUxHandoff(cwd),
    technicalGuard: evaluateTrueUxTechnicalGuard(cwd),
    trueUxEntrypoints: readTrueUxEntrypointTexts(cwd),
    trueUxSupportArtifacts: readTrueUxSupportArtifactTexts(cwd),
    prismaShape: readPrismaShape(cwd),
    routeRegistryCount,
    routeWorksetIntegrity,
    specFiles: listSpecFiles(cwd),
  };
}
