import { buildRunRoot, findJourney, loadDefinitions, parseRunnerOptions, runJourney, writeRunIndex } from "@/scripts/screencast/lib/runner";

async function main() {
  const options = parseRunnerOptions(process.argv.slice(2));
  const definitions = await loadDefinitions(options.manifestPath);

  if (!options.journeyId) {
    throw new Error("Missing journey id. Example: pnpm screencast:journey -- MJ-001");
  }

  const journey = findJourney(definitions, options.journeyId);

  if (!journey) {
    throw new Error(`Unknown journey id ${options.journeyId}. Available: ${definitions.journeys.map((item) => item.id).join(", ")}`);
  }

  const runRoot = buildRunRoot(options);
  const result = await runJourney(journey, options, runRoot);
  await writeRunIndex(runRoot, [result]);
  console.log(
    JSON.stringify(
      {
        journeyId: result.journeyId,
        status: result.status,
        manifestPath: result.manifestPath,
        portfolioLayer: result.portfolioLayer,
        candidateId: result.candidateId,
        runRoot: result.runRoot,
        outputDir: result.outputDir,
        rawVideoPath: result.rawVideoPath,
        mp4Path: result.mp4Path,
        captionsPath: result.captionsPath,
        captionMode: result.captionMode,
      },
      null,
      2
    )
  );
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
