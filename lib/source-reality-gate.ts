import { readdirSync, readFileSync } from "node:fs";
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
  "app/api/demo-workflow/route.ts",
  "app/api/documents/review/route.ts",
  "app/api/documents/route.ts",
  "app/api/documents/upload/route.ts",
  "app/api/review-monitoring/route.ts",
] as const;

export const phase0LockedPrismaShape = {
  enumCount: 22,
  modelCount: 42,
} as const;

export const phase0P0GateLabels = [
  "providerless-not-anonymous",
  "tenant/object isolation",
  "route/action/object/payload separation",
  "AI Draft internal-only",
  "no unapproved advice",
  "advisor approval not release",
  "compliance release",
  "upload not sufficiency",
  "evidence sufficiency",
  "fail-closed client visibility",
  "admin non-bypass",
  "audit persistence",
  "export redaction",
  "no automatic advice execution",
  "do not silently enter mvp task scope",
] as const;

export const phase0SourceHierarchyMarkers = [
  "ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md",
  "MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF_APPROVED_WITH_CONSTRAINTS",
  "BP-00",
  "BP-11",
  "full-workflow",
  "`main` is false-gap only",
  "supersedes older phase plans, task definitions",
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

export function readFirstBuildHandoff(cwd = process.cwd()) {
  return readFileSync(path.join(cwd, "ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md"), "utf8");
}

export function buildPhase0SourceRealitySnapshot(cwd = process.cwd()) {
  return {
    apiRouteFiles: listApiRouteFiles(cwd),
    p0GateLabels: phase0P0GateLabels,
    planText: readFirstBuildHandoff(cwd),
    prismaShape: readPrismaShape(cwd),
    routeRegistryCount,
    routeWorksetIntegrity,
    specFiles: listSpecFiles(cwd),
  };
}
