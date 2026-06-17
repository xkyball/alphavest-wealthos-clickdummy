import "dotenv/config";

import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getJourneyFixture, getJourneyFixtureById, type JourneyFixtureRef } from "@/scripts/screencast/lib/journey-fixtures";

type SeedOptions = {
  journeyId?: string;
  fixtureId?: string;
  output?: string;
  reset: boolean;
  dryRun: boolean;
};

function parseArgs(args: string[]): SeedOptions {
  const positional = args.filter((arg) => !arg.startsWith("--"));
  const outputArg = args.find((arg) => arg.startsWith("--output="));
  const fixtureArg = args.find((arg) => arg.startsWith("--fixture="));

  return {
    journeyId: positional[0]?.toUpperCase(),
    fixtureId: fixtureArg?.split("=")[1],
    output: outputArg?.split("=")[1],
    reset: !args.includes("--no-reset"),
    dryRun: args.includes("--dry-run"),
  };
}

function runCommand(command: string, args: string[]) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(`Command failed: ${command} ${args.join(" ")}\n${stdout}\n${stderr}`));
    });
  });
}

function prismaForDatabaseUrl() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for screencast journey provisioning.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

async function existsForRef(prisma: PrismaClient, ref: JourneyFixtureRef) {
  switch (ref.type) {
    case "tenant":
      return Boolean(await prisma.clientTenant.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "user":
      return Boolean(await prisma.user.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "trigger":
      return Boolean(await prisma.trigger.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "actionItem":
      return Boolean(await prisma.actionItem.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "recommendation":
      return Boolean(await prisma.recommendation.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "approval":
      return Boolean(await prisma.approval.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "complianceReview":
      return Boolean(await prisma.complianceReview.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "decision":
      return Boolean(await prisma.decision.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "evidenceRecord":
      return Boolean(await prisma.evidenceRecord.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "document":
      return Boolean(await prisma.document.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "exportRequest":
      return Boolean(await prisma.exportRequest.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "accessRequest":
      return Boolean(await prisma.accessRequest.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "policyDefinition":
      return Boolean(await prisma.policyDefinition.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "entity":
      return Boolean(await prisma.entity.findUnique({ where: { id: ref.id }, select: { id: true } }));
  }
}

async function validateFixture(prisma: PrismaClient, refs: JourneyFixtureRef[]) {
  const checked: Array<JourneyFixtureRef & { exists: boolean }> = [];
  for (const ref of refs) {
    checked.push({ ...ref, exists: await existsForRef(prisma, ref) });
  }
  return checked;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const fixture = options.fixtureId
    ? getJourneyFixtureById(options.fixtureId)
    : options.journeyId
      ? getJourneyFixture(options.journeyId)
      : undefined;

  if (!fixture) {
    throw new Error(
      `Unknown screencast fixture. Pass a journey id or --fixture. Received journey=${options.journeyId ?? "-"} fixture=${options.fixtureId ?? "-"}`
    );
  }

  const startedAt = new Date().toISOString();
  const seedCommand = "pnpm db:seed";
  const resetOutput = options.reset && !options.dryRun ? await runCommand("pnpm", ["db:seed"]) : undefined;
  const prisma = options.dryRun ? undefined : prismaForDatabaseUrl();
  const checkedRefs = prisma ? await validateFixture(prisma, fixture.refs) : fixture.refs.map((ref) => ({ ...ref, exists: true }));
  await prisma?.$disconnect();

  const missingRefs = checkedRefs.filter((ref) => !ref.exists);
  const result = {
    status: missingRefs.length > 0 ? "failed" : "passed",
    startedAt,
    finishedAt: new Date().toISOString(),
    journeyId: fixture.journeyId,
    fixtureId: fixture.fixtureId,
    tenantSlug: fixture.tenantSlug,
    seedScenario: fixture.seedScenario,
    resetStrategy: fixture.resetStrategy,
    seedCommand,
    resetExecuted: options.reset && !options.dryRun,
    dryRun: options.dryRun,
    refs: checkedRefs,
    formInputs: fixture.formInputs,
    clickPath: fixture.clickPath,
    expectedMutations: fixture.expectedMutations,
    seedStdout: resetOutput?.stdout.trim(),
    seedStderr: resetOutput?.stderr.trim(),
    errors: missingRefs.map((ref) => `Missing ${ref.type} ${ref.key} (${ref.id})`),
  };

  if (options.output) {
    await mkdir(path.dirname(options.output), { recursive: true });
    await writeFile(options.output, `${JSON.stringify(result, null, 2)}\n`);
  }

  console.log(JSON.stringify(result, null, 2));

  if (missingRefs.length > 0) process.exit(1);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
