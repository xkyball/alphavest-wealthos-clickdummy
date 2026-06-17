# Demo Journey Universe Audit Prompt V3

Date: 2026-06-16

Purpose: stronger follow-up prompt for a complete AlphaVest demo/use-case analysis. The existing `J01-J10` screencast set must be treated as a curated seed set, not as proof that the demo universe is complete.

## Why This Prompt Exists

Current evidence shows the earlier demo strategy can undercount the product surface:

- `docs/v3/journeys.screencast.v3.json` currently contains exactly 10 journeys and 73 steps.
- Those journeys touch 49 of 63 registered routes after dynamic `:id` matching.
- 14 registered routes are not covered by the current screencast routes: `/login`, `/mfa`, `/onboarding/identity`, `/onboarding/consent`, `/onboarding/role-confirmation`, `/mobile`, `/evidence`, `/communication`, `/communication/call-trigger`, `/ops/queues`, `/ops/sla`, `/service-blueprint`, `/roadmap`, `/states`.
- Pageflow coverage is uneven: `PF-H Communication and Escalation` is 0/2 and `PF-J Operations and Monitoring` is 0/5 in the current screencast set.
- Workflow coverage is uneven: `UF-13 Communication escalation` is 0/2 and `UF-14 Ops monitoring and QA` is 0/5; `UF-03 User onboarding and consent` is only 1/6.
- `USER_JOURNEY_PLAYBOOK_V3.md` describes 14 user workflows and lists non-selected candidates; it therefore should be used as a longlist source, not only as a Top-10 source.
- Route coverage is not workflow coverage. Screencast route presence is not mutation proof. Seed data is not UI mutation proof.

## Copy-Paste Prompt

```text
Max

Arbeite im Repo:
`/Users/chris/projects/alphavest-wealthos-clickdummy`

Nutze `ENGINE_MIX_V2_V3`.

Ziel der Engine-Mischung:
- V3 liefert Evidence Intake, Source Discipline, Proof Paths, Branch Debate, Weak-Branch-Kill, Adversarial QA und Learning Log.
- V2 liefert kreative Demo-Dramaturgie, Use-Case-Design, Journey-Architektur, Psycho-Logic, Reframing, TRIZ, SIT, Morphological Analysis, SCAMPER, Harvard/BATNA, MESOs und Measurement Plan.
- Repo-`AGENTS.md` bleibt für alle Projektregeln autoritativ.

Mission:
Führe eine vollständige AlphaVest Demo-Journey-Universe-Analyse durch. Behandle die bestehenden `J01-J10` ausdrücklich nur als kuratierte Seed-Journeys, nicht als vollständige Demo-Landkarte.

Die zentrale Frage lautet:
Brauchen wir wirklich nur die vorhandenen 10 Journeys, oder müssen zusätzlich 10, 20, 50 oder sogar 100 weitere Journeys/Micro-Journeys/Screencasts definiert werden, bevor AlphaVest bestmöglich, ehrlich und risikoarm demonstriert werden kann?

Arbeitsmodus:
Analyse only. Keine Produkt-UI ändern, keine Code-Implementierung, keine Schemaänderung, keine Seed-Änderung. Du darfst neue Analyse-/Planungsartefakte unter `docs/v3/` erstellen, wenn sie zur Aufgabe passen.

Vor dem Analysieren lesen:
1. `AGENTS.md`
2. `CODEX_MASTER_TASK.md`
3. `docs/v3/CODEX_TASKS_DETAILED_V3.md`
4. `docs/v3/SCREEN_CATALOGUE_V3.md`
5. `docs/v3/SCREEN_TO_TASK_MATRIX_V3.md`
6. `docs/v3/PAGE_SPECS_V3.md`
7. `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
8. `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
9. `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
10. `docs/v3/USERFLOW_DEFINITIONS_V3.md`
11. `docs/v3/WORKFLOW_DEFINITIONS_V3.md`
12. `docs/v3/DATA_MODEL_V3.md`
13. `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
14. `docs/v3/USER_JOURNEY_PLAYBOOK_V3.md`
15. `docs/v3/journeys.screencast.v3.json`
16. `docs/v3/SCREENCAST_AUTOMATION_PLAN_V3.md`
17. `docs/v3/SCREENCAST_RUNBOOK_V3.md`
18. `docs/v3/DUMMY_DATA_AND_SEED_STRATEGY_V3.md`
19. `docs/v3/WORKFLOW_PAGEFLOW_CODE_GAP_ANALYSIS_V3.md`
20. `docs/v3/IMPLEMENTATION_QA_REPORT.md`
21. `docs/v3/FINAL_HANDOFF_REPORT.md`
22. `docs/v3/DEMO_STRATEGY_AND_USE_CASE_ANALYSIS_V3.md` as prior analysis to audit, not as source of truth.
23. `docs/v3/DEMO_CAPTION_METADATA_V3.json` as prior caption model to audit, not as complete coverage.
24. `lib/route-registry.ts`
25. `lib/route-smoke-list.ts`
26. `scripts/screencast/lib/journey-fixtures.ts`
27. `scripts/screencast/lib/runner.ts`
28. `scripts/screencast/seed-journey.ts`
29. `app/api/demo-workflow/route.ts`
30. `lib/demo-workflow-validation.ts`
31. `lib/demo-workflow-mutation.ts`
32. `lib/workflow-gate.ts`
33. `lib/permission-engine.ts`
34. `lib/visibility-engine.ts`
35. `lib/evidence-service.ts`
36. `lib/audit-service.ts`
37. `lib/export-service.ts`
38. `lib/export-package-service.ts`
39. relevante `lib/*-demo-data.ts`
40. `prisma/schema.prisma`
41. `prisma/seed.ts`
42. relevante Tests, besonders `tests/demo-workflow-api.spec.ts`, `tests/route-smoke.spec.ts`, `tests/permission-engine.spec.ts`, `tests/file-export-realism.spec.ts`

Wichtige Produktregeln:
- Digital first.
- Human reviewed.
- Evidence backed.
- No unapproved advice reaches the client.
- Advisor approval alone is not enough.
- Compliance release controls client visibility.
- Evidence is created by default for important actions.
- Sensitive actions create audit events.
- Demo-data-first; keine echten Kundendaten.
- Real auth ist nicht Ziel dieser Analyse.
- Clean UI: keine Spec Panels, Route Labels, Annotation Rails oder Dev Notes als App-UI.

Pflicht-Audit:
1. Inventarisiere alle 63 Registry-Routen mit pageId, route, title, navigationGroup, pageflowId, userWorkflowId, visualMode, roleFamily, objectType, permissionAction und clientVisibilitySensitive.
2. Inventarisiere alle Pageflows `PF-A` bis `PF-J`, alle User Workflows `UF-01` bis `UF-14` und alle Workflow-Familien `W-01` bis `W-14`.
3. Inventarisiere alle bestehenden Screencast-Journeys `J01-J10`, inklusive Steps, Routes, interactions, navigation mode, fixtures, expectedMutations, formInputs und seedCommand.
4. Errechne Abdeckung:
   - Routenabdeckung durch `J01-J10`.
   - Pageflow-Abdeckung.
   - Userflow-Abdeckung.
   - Workflow-Familien-Abdeckung.
   - Rolle/Mandant-Abdeckung.
   - Data-object-lifecycle-Abdeckung.
   - Positive Path vs Negative/Blocked Path.
   - Mutation Proof vs Route-Hop vs Static UI vs Generic Audit Fallback.
5. Identifiziere alle Routen, Screen-States, Userflows und Workflow-Familien, die nicht oder nur oberflächlich abgedeckt sind.
6. Prüfe explizit, ob `PF-H Communication and Escalation`, `PF-J Operations and Monitoring`, `UF-03 User onboarding and consent`, `/mobile`, `/evidence`, Auth/MFA/Consent, Ops/SLA und Reference/Internal surfaces eigene Journeys, Appendix-Screencasts oder nur interne QA-Artefakte brauchen.
7. Prüfe, ob bestehende `J01-J10` zu grob sind und in getrennte Micro-Journeys aufgeteilt werden sollten, z.B.:
   - Compliance release vs compliance block vs request evidence.
   - Client accept vs defer vs reject vs request information.
   - Export approval vs export denied vs export download vs share link expiry.
   - Advisor approve vs revise/request data/escalate.
   - Document upload success vs unsupported file vs low-confidence extraction.
   - Governance invite vs role change vs access request approval vs denial.
   - Cross-tenant denied access and permission denial.
8. Prüfe, ob es Demo-Story-Wert hat, neue Journeys für "negative proof" anzulegen: Dinge, die bewusst nicht erlaubt sind.
9. Prüfe, ob es Demo-Story-Wert hat, neue Journeys für Operations/Investor/Compliance-Deep-Dive anzulegen, selbst wenn sie nicht in der 5-Minuten-Demo vorkommen.
10. Entscheide nicht vorschnell für "100". Leite aus Evidence und Demo-Zielgruppen ab, welche Anzahl sinnvoll ist.

Reifegrad-Skala:
- E0 planned only
- E1 visual reference
- E2 static UI
- E3 navigable UI
- E4 demo-state executable
- E5 persisted executable
- E6 governed executable

Journey-Typen:
- Macro Journey: mehrere Pageflows, executive demo geeignet.
- Standard Journey: ein User Workflow mit klarer Rolle, Daten, Gate und Proof.
- Micro Journey: eine kritische State-Transition oder ein negativer Pfad.
- Appendix Journey: QA-/Investor-/Compliance-Beweis, nicht Teil der Hauptdemo.
- No-Screencast Artifact: besser als Tabelle, Diagramm, Runbook oder QA-Report statt Video.

Erstelle eine Journey Opportunity Map:
Für jeden Kandidaten:
- candidateId
- candidateType
- sourceRoutes
- pageflowIds
- userWorkflowIds
- workflowFamilyIds
- primaryRole
- secondaryRoles
- tenant
- dataObjects
- stateBefore
- stateAfter
- permissionAction
- blockedActions
- evidenceCreated
- auditEvent
- clientVisibilityImpact
- currentImplementationMaturity
- currentProofPath
- demoValue
- riskValue
- audienceFit
- screencastNeed
- recommendedPriority
- reasonToInclude
- reasonToExclude
- relationToExistingJ01J10

Entscheide über ein Portfolio:
- P0 Primary Narrative: maximal 8-12 Journeys/Micro-Journeys für die stärkste Live-Demo.
- P1 Trust Proof Pack: zusätzliche 10-20 Journeys für Compliance, Investor und Ops-Due-Diligence.
- P2 Edge/Negative Pack: zusätzliche negative, blocked, denied, deferred, rejected und cross-tenant Journeys.
- P3 Exhaustive Coverage Pack: nur wenn wirklich nötig; Route-/State-/Permission-Coverage, nicht automatisch Screencast.

Beantworte explizit:
1. War die bisherige `J01-J10`-basierte Demoanalyse unvollständig?
2. Wenn ja, worin genau?
3. Müssen wirklich 100 weitere Screencasts erstellt werden?
4. Falls nein: Welche kleinere, bessere Anzahl und Struktur ist sinnvoll?
5. Falls ja: Welche 100 wären das, und warum sind sie nicht nur redundante Permutationen?
6. Welche bestehenden Journeys sollten gesplittet, umbenannt, ergänzt oder herabgestuft werden?
7. Welche Journeys sind stark genug für Video?
8. Welche Journeys gehören nur in Docs, QA oder Appendix?
9. Welche Daten/Seed-/Fixture-Erweiterungen wären vor neuen Screencasts nötig?
10. Welche Claims darf die Demo weiterhin nicht machen?

Output-Artefakte erstellen:
1. `docs/v3/DEMO_JOURNEY_UNIVERSE_AUDIT_V3.md`
2. `docs/v3/DEMO_JOURNEY_OPPORTUNITY_BACKLOG_V3.json`
3. `docs/v3/DEMO_SCREENCAST_EXPANSION_RECOMMENDATION_V3.md`
4. Optional: `docs/v3/DEMO_CAPTION_METADATA_EXPANDED_DRAFT_V3.json`, aber nur als Draft, wenn der Journey-Backlog stabil genug ist.

Pflichtstruktur in `DEMO_JOURNEY_UNIVERSE_AUDIT_V3.md`:
- Executive Verdict
- Facts / Assumptions / Interpretations / Recommended Moves
- V3 Mission Card
- Evidence Intake
- Coverage Audit
- Existing J01-J10 Critique
- Route / Pageflow / Userflow / Workflow Gap Map
- Journey Opportunity Map
- Candidate Prioritization
- Do We Need 100 Screencasts?
- Recommended Journey Portfolio
- P0 Primary Narrative
- P1 Trust Proof Pack
- P2 Edge / Negative Pack
- P3 Exhaustive Coverage Pack
- Data / Fixture / Seed Requirements
- Caption / Metadata Expansion Requirements
- Overclaim Register
- Adversarial QA
- Proof Paths
- Learning Log
- Method Compliance Checklist

Methodenpflicht:
Wende sichtbar an:
- V3 Mission Card, Evidence Intake, Problem Architecture, Branch Debate, Adversarial QA, Weak-Branch-Kill, Proof Paths, Learning Log.
- V2 Double Diamond.
- Psycho-Logic + Map/Model.
- Reframing Matrix.
- TRIZ.
- SIT Closed World.
- Morphological Analysis / Zwicky Box + CCA.
- SCAMPER.
- Harvard / BATNA.
- MESOs.
- Measurement Plan.
- Ethics & Fairness.

Qualitätsgrenzen:
- Keine erfundenen Produktfähigkeiten.
- Keine erfundenen Kundendaten.
- Keine Compliance-Claims ohne Proof Path.
- Route coverage ist nicht Workflow coverage.
- Screen coverage ist nicht State coverage.
- Seed data ist nicht UI mutation proof.
- API handler ist nicht automatisch UI-executed proof.
- Generic audit fallback ist nicht dasselbe wie fachliche Workflow-Persistenz.
- Demo muss überzeugend, aber ehrlich sein.
```
