# Operator Instructions v2

## 1. Copy files

Copy this handoff package into the existing AlphaVest WealthOS repository root.

## 2. Add visual images

Place generated images under:

```text
public/reference/visuals_v2/client/
public/reference/visuals_v2/internal/
public/reference/visuals_v2/governance/
public/reference/visuals_v2/communication/
public/reference/visuals_v2/service-blueprint/
public/reference/visuals_v2/planning/
public/reference/visuals_v2/states/
```

Use names from `docs/v2/VISUAL_ASSET_MANIFEST_V2.md`.

## 3. Preserve old references

Place old board-level visuals here if available:

```text
public/reference/wireframes_v2_boards/
```

Place older historical references here if available:

```text
public/reference/wireframes_v1/
```

## 4. Start Codex Phase 4

Use `CODEX_PHASE_4_START_PROMPT.md`.

Do not ask Codex to start Phase 5 until Phase 4 QA passes.

## 5. Review first outputs

Codex must first produce:

```text
docs/v2/EXISTING_PHASE_1_3_AUDIT.md
docs/v2/DELTA_ANALYSIS_V2.md
docs/v2/REFACTOR_PLAN_V2.md
```

Review these before allowing major refactor work.

## 6. Phase 4 pass criteria

- Existing implementation audited.
- Visual interpretation rules applied.
- Delta analysis identifies old board-based screens.
- Refactor plan preserves useful code.
- Permission/state/evidence gates centralised or clearly planned.
- No-unapproved-advice tests exist or exact TODOs are documented.
- Build/lint/tests run or failures are documented.
