# AlphaVest User Manual Context Integration Brief V3

Generated: 2026-06-17T00:00:00Z

## Integration Goal

Use the contextual narrative package to make the next AlphaVest user manual explain why each workflow exists, not only what the user clicks. The final manual should still be concise and task-led; context should appear close to the action it explains.

## Placement Rules

| Module | Placement | Length | Purpose |
| --- | --- | --- | --- |
| Context note | Before each task procedure | 2-4 sentences | Explain why the task appears here and what the user is trying to achieve. |
| Why this matters | Near screenshot or task metadata | 1-3 sentences | Connect the visible UI state to product purpose. |
| What this unlocks | After result | 2-4 bullets | Show downstream workflows enabled by correct completion. |
| Control rationale | Near gates, blocked states, release, audit, export, role, or redaction controls | 1-3 sentences | Explain what the control protects and what cannot be bypassed. |
| Demo boundary | Near implementation note | 1-2 sentences | Prevent demo behavior from being mistaken for production completion. |
| Reader takeaway | End of task | 1 sentence | Give the user the main mental model. |

## PDF Density Guidance

- Keep the first page of each task focused on task identity, role, context note, screenshot, and the first procedure steps.
- Put field rationale and blocked-state rationale on the second task page when space is tight.
- Use callouts sparingly: one context callout and one control/boundary callout are usually enough per task page.
- Move deeper source traceability and Engine method artifacts to QA appendices, not the user-facing manual.

## Manual Generation Input Order

1. Keep `docs/v3/user-manual-source/user-manual-source.v3.json` as the structural backbone.
2. Add `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json` as the explanation backbone.
3. Use `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.md` for editorial phrasing.
4. Preserve current screenshot metadata and live screenshot references.
5. Preserve all demo/prototype implementation caveats from `UI_REALITY_CHECK_V3.md` and the manual QA report.

## Specific Insertions

- **MT-001:** Insert the context note before the procedure, add a control rationale for MT-001-G1, add "What this unlocks" after the result, and end with the reader takeaway: A safe tenant workflow starts with a visible and reviewable platform policy baseline.
- **MT-002:** Insert the context note before the procedure, add a control rationale for MT-002-G1, add "What this unlocks" after the result, and end with the reader takeaway: Tenant setup is the point where AlphaVest makes client work isolated, owned, and ready for safe onboarding.
- **MT-003:** Insert the context note before the procedure, add a control rationale for MT-003-G1, add "What this unlocks" after the result, and end with the reader takeaway: Onboarding is where the user, tenant, consent, and role context become explicit before client work begins.
- **MT-004:** Insert the context note before the procedure, add a control rationale for MT-004-G1, add "What this unlocks" after the result, and end with the reader takeaway: Family context turns later workflow actions from isolated clicks into role-aware client decisions.
- **MT-005:** Insert the context note before the procedure, add a control rationale for MT-005-G1, add "What this unlocks" after the result, and end with the reader takeaway: Entity intake makes the client structure visible enough to review, but missing evidence must stay visible too.
- **MT-006:** Insert the context note before the procedure, add a control rationale for MT-006-G1, add "What this unlocks" after the result, and end with the reader takeaway: Documents become useful to AlphaVest only when they are scoped, reviewed, corrected, and linked to evidence.
- **MT-007:** Insert the context note before the procedure, add a control rationale for MT-007-G1, add "What this unlocks" after the result, and end with the reader takeaway: Signal review turns ambiguity into internal work without turning it into client advice.
- **MT-008:** Insert the context note before the procedure, add a control rationale for MT-008-G1, add "What this unlocks" after the result, and end with the reader takeaway: Advisor approval is human review, not client release.
- **MT-009:** Insert the context note before the procedure, add a control rationale for MT-009-G1, add "What this unlocks" after the result, and end with the reader takeaway: Compliance release is the client-visibility control point.
- **MT-010:** Insert the context note before the procedure, add a control rationale for MT-010-G1, add "What this unlocks" after the result, and end with the reader takeaway: Client decisions begin only after release and should end with traceable proof.
- **MT-011:** Insert the context note before the procedure, add a control rationale for MT-011-G1, add "What this unlocks" after the result, and end with the reader takeaway: Evidence can be shared only when scope, redaction, permission, approval, and audit all line up.
- **MT-012:** Insert the context note before the procedure, add a control rationale for MT-012-G1, add "What this unlocks" after the result, and end with the reader takeaway: Governance changes should be scoped, confirmed, and auditable before they affect sensitive work.
- **MT-013:** Insert the context note before the procedure, add a control rationale for MT-013-G1, add "What this unlocks" after the result, and end with the reader takeaway: The right communication path reduces risk and makes follow-up work traceable.
- **MT-014:** Insert the context note before the procedure, add a control rationale for MT-014-G1, add "What this unlocks" after the result, and end with the reader takeaway: Ops pages help AlphaVest run the system; they are not client-facing advice workflows.

## Avoid Bloat

Do not paste every step rationale into the final PDF verbatim. Use step rationales to improve procedure wording and add only the highest-value explanation near risky or confusing steps.

## Next Prompt Recommendation

Update or execute `prompts/USER_MANUAL_STATE_OF_ART_GENERATION_ENGINE_MIX.md` so it explicitly consumes this context package, then run `prompts/USER_MANUAL_PDF_PRODUCTION_ENGINE_MIX.md` after the manual is regenerated.
