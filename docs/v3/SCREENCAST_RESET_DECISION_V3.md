# Screencast Reset Decision V3

Status: `NEW_SYSTEM_SCREENCASTS_ONLY`

The retired Jxx/portfolio screencast manifests are no longer active product proof. New recordings must be generated from the Wave 0-2 Journey Spine and must not preserve old `/api/demo-workflow` compatibility just to keep historical videos runnable.

## Active Authority

- Manifest: `docs/v3/journeys.screencast.new-system.json`
- Generator: `scripts/screencast/generate-new-system-manifest.ts`
- Product source: `lib/journeys/journey-registry.ts`
- Runtime APIs: `app/api/journeys/**`
- Export lifecycle: `app/api/export-workflow/route.ts`

## Retired

- `docs/v3/journeys.screencast.v3.json`
- `docs/v3/journeys.screencast.p0.v3.json`
- `docs/v3/journeys.screencast.p1.v3.json`
- `docs/v3/journeys.screencast.p2.v3.json`
- `docs/v3/DEMO_JOURNEY_LEGACY_TO_PORTFOLIO_MAP_V3.json`
- `docs/v3/DEMO_JOURNEY_OPPORTUNITY_BACKLOG_V3.json`
- `scripts/screencast/generate-portfolio-manifests.ts`
- `scripts/screencast/lib/journey-fixtures.ts`

## Rule

Screencasts are downstream evidence of the current system. They cannot define API truth, keep fake actions alive, or force legacy route compatibility.
