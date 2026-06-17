import { buildRunRoot, loadDefinitions, parseRunnerOptions, runJourney, writeRunIndex } from "@/scripts/screencast/lib/runner";

async function main() {
  const options = parseRunnerOptions(process.argv.slice(2));
  const definitions = await loadDefinitions(options.manifestPath);
  const runRoot = buildRunRoot(options);
  const fullResults = [];

  for (const journey of definitions.journeys) {
    const result = await runJourney(journey, { ...options, journeyId: journey.id }, runRoot);
    fullResults.push(result);
  }

  await writeRunIndex(runRoot, fullResults);

  const summary = {
    checked: fullResults.length,
    runRoot,
    manifestPath: options.manifestPath,
    generatedAt: new Date().toISOString(),
    results: fullResults.map((result) => ({
      journeyId: result.journeyId,
      portfolioLayer: result.portfolioLayer,
      candidateId: result.candidateId,
      status: result.status,
      outputDir: result.outputDir,
      rawVideoPath: result.rawVideoPath,
      mp4Path: result.mp4Path,
      captionsPath: result.captionsPath,
      captionMode: result.captionMode,
      warnings: result.warnings.length,
      errors: result.errors.length,
    })),
  };

  console.log(JSON.stringify(summary, null, 2));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
