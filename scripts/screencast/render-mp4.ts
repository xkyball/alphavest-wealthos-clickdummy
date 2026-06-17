import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { renderMp4WithCaptions } from "@/scripts/screencast/lib/runner";

const root = process.cwd();
const outputRoot = path.join(root, "artifacts", "screencasts");
const requestedJourney = process.argv
  .slice(2)
  .filter((arg) => arg !== "--")
  .find((arg) => !arg.startsWith("--"))
  ?.toUpperCase();

function latestRunRoot() {
  const runsRoot = path.join(outputRoot, "runs");
  if (!existsSync(runsRoot)) return undefined;
  const entries = readdirSync(runsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const latest = entries.at(-1);
  return latest ? path.join(runsRoot, latest) : undefined;
}

async function renderJourney(runRoot: string, journeyId: string) {
  const journeyDir = path.join(runRoot, journeyId);
  const source = path.join(journeyDir, "raw-video.webm");
  const captions = path.join(journeyDir, "captions.srt");
  const target = path.join(journeyDir, "journey.mp4");

  if (!existsSync(source)) {
    return { journeyId, status: "skipped", reason: `Missing ${source}` };
  }
  if (!existsSync(captions)) {
    return { journeyId, status: "failed", reason: `Missing ${captions}` };
  }

  const captionMode = await renderMp4WithCaptions(source, captions, target);
  return { journeyId, status: "rendered", target, captionMode };
}

async function main() {
  const runRoot = latestRunRoot();
  if (!runRoot) {
    throw new Error("No screencast run found under artifacts/screencasts/runs.");
  }

  const journeyIds = requestedJourney
    ? [requestedJourney]
    : readdirSync(runRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();

  const results = [];
  for (const journeyId of journeyIds) {
    results.push(await renderJourney(runRoot, journeyId));
  }

  console.log(JSON.stringify({ checked: results.length, runRoot, results }, null, 2));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
