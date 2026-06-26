throw new Error(
  [
    "Legacy Jxx screencast journey seeding has been retired.",
    "New screencasts must be generated from lib/journeys/journey-registry.ts and provisioned through the app seed/Journey APIs.",
    "Run pnpm screencast:generate, then pnpm screencast:dry-run.",
  ].join(" "),
);
