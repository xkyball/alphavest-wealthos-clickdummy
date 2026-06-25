import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  p44InternalDraftLegacyFallbackFlag,
  p44InternalDraftLegacyFallbackRemovalTicket,
} from "../lib/p44-phase5-ai-draft-governance";

function walkFiles(root: string): string[] {
  return readdirSync(root).flatMap((entry) => {
    const absolute = path.join(root, entry);
    if (statSync(absolute).isDirectory()) return walkFiles(absolute);
    return absolute.endsWith(".ts") || absolute.endsWith(".tsx") ? [absolute] : [];
  });
}

test.describe("internal draft governance spine", () => {
  test("declares first-class Prisma models and a temporary legacy fallback ticket", () => {
    const schema = readFileSync(path.join(process.cwd(), "prisma/schema.prisma"), "utf8");
    const migration = readFileSync(
      path.join(process.cwd(), "prisma/migrations/20260625143000_internal_draft_governance_spine/migration.sql"),
      "utf8",
    );

    for (const model of ["InternalDraft", "DraftClassification", "UnsupportedClaim", "DraftTrace"]) {
      expect(schema).toMatch(new RegExp(`^model ${model} \\{`, "m"));
    }
    expect(migration).toContain('CREATE TABLE "internal_drafts"');
    expect(migration).toContain('CREATE TABLE "draft_classifications"');
    expect(migration).toContain('CREATE TABLE "unsupported_claims"');
    expect(migration).toContain('CREATE TABLE "draft_traces"');
    expect(p44InternalDraftLegacyFallbackFlag).toBe("ALPHAVEST_INTERNAL_DRAFT_LEGACY_FALLBACK");
    expect(p44InternalDraftLegacyFallbackRemovalTicket.ticketId).toBe("P44-INTERNAL-DRAFT-LEGACY-FALLBACK-REMOVAL");
  });

  test("forbids production recommendation mutations from writing overloaded draft fields", () => {
    const productionFiles = [
      ...walkFiles(path.join(process.cwd(), "lib")),
      ...walkFiles(path.join(process.cwd(), "app")),
      path.join(process.cwd(), "prisma/seed.ts"),
    ];
    const mutationWritePattern =
      /(?:tx|prisma)\.recommendation\.(?:create|createMany|update|updateMany|upsert)\s*\([\s\S]{0,1800}?(?:assumptionsJson|clientSummaryDraft)\s*:/g;
    const offenders = productionFiles.flatMap((file) => {
      const relative = path.relative(process.cwd(), file);
      const text = readFileSync(file, "utf8");
      return [...text.matchAll(mutationWritePattern)].map((match) => `${relative}: ${match[0].split("\n")[0]}`);
    });

    expect(offenders).toEqual([]);
  });
});
