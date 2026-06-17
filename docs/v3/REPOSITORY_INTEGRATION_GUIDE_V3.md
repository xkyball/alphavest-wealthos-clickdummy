# Repository Integration Guide V3

## Manual precondition
You provide a local folder that is already linked to your repository.

## Integration steps

1. Create a new branch.

```bash
git checkout -b alphavest-v3-technical-implementation
```

2. Unzip this handoff pack outside the repo.

3. Copy the contents into the repository root.

```bash
rsync -av AlphaVest_WealthOS_Codex_Handoff_V3_TECHNICAL_IMPLEMENTATION/ <YOUR_REPO>/
```

4. If the repository already has `AGENTS.md`, do not blindly overwrite. Merge the V3 rules into it.

```bash
cp <YOUR_REPO>/AGENTS.md <YOUR_REPO>/AGENTS.before-v3.md 2>/dev/null || true
```

5. Verify visual assets are present.

```bash
find public/reference/page_ui_v3/clean_pages -type f -name 'PAGE-*.png' | sort | wc -l
```

Expected: 63.

6. Start Codex with `CODEX_START_PHASE_MASTER_PROMPT.md`.

7. Use Phase 00 first for repo intake and setup.

## Do not

- Do not ask Codex to implement all phases at once.
- Do not allow Codex to replace the design system per screen.
- Do not start with production auth.
- Do not build against real client data.
- Do not treat the generated UI images as exact pixel contracts.

## Review after each phase

Check:

- changed files,
- route coverage,
- visual consistency,
- build/lint/test output,
- phase report,
- unresolved TODOs.
