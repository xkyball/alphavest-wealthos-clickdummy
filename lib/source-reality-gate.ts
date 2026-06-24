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
  "app/api/ops-sla/route.ts",
  "app/api/profile/route.ts",
  "app/api/review-monitoring/route.ts",
] as const;

export const phase0LockedPrismaShape = {
  enumCount: 26,
  modelCount: 48,
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

export function buildPhase0SourceRealitySnapshot(cwd = process.cwd()) {
  return {
    apiRouteFiles: listApiRouteFiles(cwd),
    p0GateLabels: phase0P0GateLabels,
    planText: readTrueUxHandoff(cwd),
    trueUxEntrypoints: readTrueUxEntrypointTexts(cwd),
    trueUxSupportArtifacts: readTrueUxSupportArtifactTexts(cwd),
    prismaShape: readPrismaShape(cwd),
    routeRegistryCount,
    routeWorksetIntegrity,
    specFiles: listSpecFiles(cwd),
  };
}
