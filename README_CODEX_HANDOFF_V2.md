# AlphaVest WealthOS — Codex Handoff v2

## Purpose

This package is the corrected **Prompt B output**. It is a copy-paste-ready handoff for Codex after the existing AlphaVest WealthOS implementation has completed Phase 1–3.

The next phase is **not** the old Phase 4. The new next phase is:

> **Phase 4 — UX Model Refactor and Visual Alignment**

Codex must audit the existing repository, read the v2 docs and visual references, create a delta analysis, create a refactor plan, and only then implement Phase 4 refactoring.

## Core product rule

> **No unapproved advice reaches the client.**

Recommendations, advice-like communications or decision outputs may only become client-visible after:

`Signal / Trigger → AI or Rules Draft → Analyst Review → Advisor Approval → Compliance Gate → Client Visibility → Decision Record → Evidence Vault → Review Rhythm`

## Critical correction

The generated visual images are **not all UI screens**.

Many visual boards include:

- implementable UI region(s), usually the central app frame, mobile frame, drawer, modal or table;
- developer handoff notes;
- metadata panels;
- workflow annotations;
- evidence/audit annotations;
- source-of-truth explanation panels;
- reference-only matrices or diagrams.

Codex must **not** blindly recreate each whole image as HTML/CSS. Codex must identify which parts represent actual application UI and which parts are specification/context.

This distinction is formalised in:

- `docs/v2/VISUAL_INTERPRETATION_RULES_V2.md`
- `docs/v2/VISUAL_ASSET_MANIFEST_V2.md`
- `docs/v2/SCREEN_SPECS_V2.md`

## How to use this package

1. Copy this handoff into the existing repo root.
2. Add v2 visual images under `public/reference/visuals_v2/...` using the manifest filenames.
3. Start Codex with `CODEX_PHASE_4_START_PROMPT.md`.
4. Review Codex's audit, delta analysis and refactor plan before allowing broader implementation.
5. Do not start Phase 5 until Phase 4 QA passes.
