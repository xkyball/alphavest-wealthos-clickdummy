# SCREEN_GENERATION_BRIEF_IF_NEEDED.md

Status: `NO_SCREEN_GENERATION_FOR_FIRST_BUILD_PHASE_0`

Phase 0 does not authorize screen generation, state-screen image generation,
ImageGen replacement work or visual asset replacement.

## Stop Rule

If a First Build task appears to require any of the following, stop and report
instead of generating:

- new screen images
- state-screen image sets
- visual replacement assets
- generated mockups
- regenerated page-level design references

## Allowed Phase 0 Work

- Preserve the existing visual references as historical design context.
- Record that UI/reference presence is not behavior proof.
- Keep `public/reference/page_ui_v3/clean_pages/` unchanged.

## Forbidden Phase 0 Work

- Do not create new visual assets.
- Do not update screenshots or generated images.
- Do not treat design reference presence as P0 acceptance.
