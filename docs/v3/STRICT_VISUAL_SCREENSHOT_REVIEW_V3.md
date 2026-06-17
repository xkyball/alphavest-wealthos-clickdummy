# Strict Visual Screenshot Review V3 — AlphaVest Quality Guard

Projekt: AlphaVest WealthOS  
Erstellt: 2026-06-16  
Modus: Strikte visuelle QA (Menschliche Lesbarkeit als Qualitätsnorm, `pnpm visual:contract` nur als Gate)

## Pflichtquellen (vollständig gelesen)

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/CODEX_TASKS_DETAILED_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
- `docs/v3/DATA_MODEL_V3.md`
- `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
- `docs/v3/DESIGN_IMPLEMENTATION_GAP_ANALYSIS_V3.md`
- `docs/v3/PIXEL_ACCURACY_TASKS_V3_V2.md`
- `public/reference/page_ui_v3/clean_pages/`

## Unterstützende Evidenz

- `artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/index.md`
- `artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/strict-review-dom-metrics.json`
- `artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/*`
- `artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/*`
- `artifacts/visual-gap-audit/screenshots/`
- `artifacts/visual-qa/visual-contract-result.json`
- `artifacts/visual-qa/browser-dom-verification.json`

## Scope und Prüfprinzip

Dieser Durchlauf ist auf **professionelle Lesbarkeit, Überlappung, Clipping, Overlay-Usability und Surface-Fidelity** ausgerichtet.  
Die Reihenfolge war:

1. High-Risk-Kalibration  
2. Voller Katalog-Scan (Desktop-Zuerst, danach mobile Varianten)
3. Modal-/Drawer-/Overflow-relevante Routen

### Kalibrierungshärtung

Aus den 6 High-Risk-Seiten wurden harte Prüffragen übernommen:

- **Mindestabstand rund um Inhaltsblöcke:** ~12px
- **Keine neue Lesbarkeitsverluste durch dichte Packung**
- **Keine falsche Surface-/Surface-Composition** (Desktop-Shell auf Mobile, spec/chrome-Reste im UI)
- **Workflow sichtbar halten:** Approval, Evidence, Audit, Redaction, Compliance-Release als echte Prozesssicht
- **Overflow/Clipping nicht als „sichtbar aber brauchbar“ entschärfen**

## Prüfliste aus dem Katalog (alle 63 Seiten + Visual Mode)

| Page | Route | Visual Mode |
| --- | --- | --- |
| 001 | `/login` | NORMAL_PAGE |
| 002 | `/mfa` | MODAL_CAPABLE_AUTH_PAGE |
| 003 | `/onboarding/invite` | WIZARD_OR_STEP_PAGE |
| 004 | `/onboarding/identity` | WIZARD_OR_STEP_PAGE |
| 005 | `/onboarding/consent` | PAGE_WITH_POLICY_MODAL_AVAILABLE |
| 006 | `/onboarding/role-confirmation` | WIZARD_OR_STEP_PAGE |
| 007 | `/admin/platform` | PAGE_WITH_SECOND_CONFIRMATION_MODAL |
| 008 | `/admin/policies/advice-boundary` | NORMAL_PAGE |
| 009 | `/admin/roles` | PAGE_WITH_PERMISSION_MODAL |
| 010 | `/admin/security` | PAGE_WITH_SECOND_CONFIRMATION_MODAL |
| 011 | `/admin/evidence-templates` | NORMAL_PAGE |
| 012 | `/admin/export-templates` | NORMAL_PAGE |
| 013 | `/admin/tenants` | NORMAL_PAGE |
| 014 | `/tenants/new` | WIZARD_OR_STEP_PAGE |
| 015 | `/tenants/:id/setup` | WIZARD_OR_STEP_PAGE |
| 016 | `/tenants/:id/team` | NORMAL_PAGE |
| 017 | `/tenants/:id/policies` | NORMAL_PAGE |
| 018 | `/tenants/:id/users` | PAGE_WITH_INVITE_ROLE_MODAL |
| 019 | `/portal` | NORMAL_PAGE |
| 020 | `/mobile` | NORMAL_PAGE |
| 021 | `/client/profile` | NORMAL_PAGE |
| 022 | `/client/family-members` | NORMAL_PAGE |
| 023 | `/relationships` | NORMAL_PAGE |
| 024 | `/entities` | NORMAL_PAGE |
| 025 | `/entities/new` | WIZARD_OR_STEP_PAGE |
| 026 | `/entities/:id` | NORMAL_PAGE |
| 027 | `/documents` | NORMAL_PAGE |
| 028 | `/documents/upload` | NORMAL_PAGE |
| 029 | `/documents/extraction-review` | NORMAL_PAGE |
| 030 | `/documents/verification-pending` | NORMAL_PAGE |
| 031 | `/wealth-map` | PAGE_WITH_SIDE_DRAWER |
| 032 | `/actions` | PAGE_WITH_SIDE_DRAWER |
| 033 | `/signals` | NORMAL_PAGE |
| 034 | `/workbench` | NORMAL_PAGE |
| 035 | `/workbench/triggers/:id` | NORMAL_PAGE |
| 036 | `/advisor-approval` | NORMAL_PAGE |
| 037 | `/advisor-approval/:id` | NORMAL_PAGE |
| 038 | `/compliance` | NORMAL_PAGE |
| 039 | `/compliance/:id/review` | NORMAL_PAGE |
| 040 | `/compliance/:id/release` | RELEASE_CONFIRMATION_MODAL_STATE |
| 041 | `/compliance/:id/block` | BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE |
| 042 | `/compliance/:id/audit` | NORMAL_PAGE |
| 043 | `/decisions` | NORMAL_PAGE |
| 044 | `/decisions/:id` | PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION |
| 045 | `/decisions/:id/success` | NORMAL_PAGE |
| 046 | `/evidence` | PAGE_WITH_SIDE_DRAWER |
| 047 | `/evidence/:id` | NORMAL_PAGE |
| 048 | `/governance/users` | PAGE_WITH_USER_DRAWER_OR_MODAL |
| 049 | `/governance/roles` | PAGE_WITH_ROLE_DRAWER_AND_SECOND_CONFIRMATION_MODAL |
| 050 | `/governance/access-requests` | PAGE_WITH_APPROVAL_DRAWER |
| 051 | `/governance/audit-history` | PAGE_WITH_SIDE_DRAWER |
| 052 | `/communication` | PREVIEW_PAGE_OR_PANEL |
| 053 | `/communication/call-trigger` | NORMAL_PAGE |
| 054 | `/export/new` | WIZARD_OR_STEP_PAGE |
| 055 | `/export/:id/scope` | NORMAL_PAGE |
| 056 | `/export/:id/redaction` | PREVIEW_PAGE_OR_PANEL |
| 057 | `/export/:id/preview` | PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL |
| 058 | `/export/:id/download` | DOWNLOAD_CONFIRMATION_STATE |
| 059 | `/ops/queues` | NORMAL_PAGE |
| 060 | `/ops/sla` | NORMAL_PAGE |
| 061 | `/service-blueprint` | REFERENCE_ONLY_INTERNAL_PAGE |
| 062 | `/roadmap` | REFERENCE_ONLY_INTERNAL_PAGE |
| 063 | `/states` | REFERENCE_ONLY_INTERNAL_PAGE |

## Kalibrierungs-Notiz: High-Risk-Referenzseiten

- **PAGE-031 `/wealth-map` (desktop + mobile):**  
  - **Defekt:** Dicht gepackte Karten- und Drawer-Region, Footer-/Control-Zone zu nah am unteren Rand, mobile Placeholder-Zeilen wirken überladen.  
  - **Clean-Wahrnehmung im Kontrast:** Die Seite ist funktional vollständig, aber nicht noch lesbar wie eine Enterprise-Übersicht.  
  - **Schwere Prüfregel danach:** Bei `PAGE_WITH_SIDE_DRAWER` gilt: Drawer-Inhalt muss tatsächlich sichtbar sein und Graph-/Footer-Rhythmus braucht feste Außenränder.
- **PAGE-039 `/compliance/:id/review` (desktop):**  
  - **Defekt:** Compliance-Review-Metadaten (Evidenz, Policies, Review-Historie, Entscheidung) sind visuell zu dicht; Scan-Entscheidungskette springt nicht klar.  
  - **Clean-Wahrnehmung im Kontrast:** Inhalt ist vollständig, aber Entscheidungen und Freigaberegeln sind nicht klar priorisiert.  
  - **Schwere Prüfregel danach:** Für Compliance-Routen muss die Entscheidungslogik visuell dominiert werden; „mehr Daten“ darf nicht „schlechter scanbar“ heißen.
- **PAGE-042 `/compliance/:id/audit` (desktop/mobile):**  
  - **Defekt:** Kein schwerer visueller Bruch, aber enge Zell-/Chip-Abstände können in Folgeänderungen schnell kippen.  
  - **Clean-Wahrnehmung im Kontrast:** Struktur vorhanden, Lesbarkeit brauchbar, aber noch kein Komfortplus wie beim Zielprofil.  
  - **Schwere Prüfregel danach:** Warnung auf Tabelle/Dichte achten; kein neues Verhalten ohne `DataTable`-Anpassung.
- **PAGE-049 `/governance/roles` (desktop):**  
  - **Defekt:** Modals/Drawer-Kontext löscht bei einigen Zuständen zu viel Seitensicht.  
  - **Clean-Wahrnehmung im Kontrast:** Funktionale Korrektheit vorhanden, aber die Seitensicht ist nicht voll nutzbar als Entscheidungskontext.  
  - **Schwere Prüfregel danach:** bei Modal-/Drawer-States immer Lesbarkeit des Unterbaums sichern.
- **PAGE-056 `/export/:id/redaction` (desktop/mobile):**  
  - **Defekt:** Redaction-Workflow wirkt im Verhältnis zu Referenz zu „spärlich“; unternehmensrelevante Redaction-/Freigabe-Hierarchie ist zu dünn.  
  - **Clean-Wahrnehmung im Kontrast:** UI ist nutzbar, aber zu produktions-flach.  
  - **Schwere Prüfregel danach:** export-relevante Entscheidungen benötigen evidenzsichtbaren, schweren Inhalt zuerst.
- **PAGE-059 `/ops/queues` (desktop):**  
  - **Defekt:** Kennzahlen-Cluster wirken numerisch dicht, ohne klare Trennung der Handlungspfad- und Metrikebenen.  
  - **Clean-Wahrnehmung im Kontrast:** Übersicht vorhanden, aber Prioritäten verschmelzen.  
  - **Schwere Prüfregel danach:** bei Ops-Screens klare metrische Trennung in Karten, keine komprimierte Datenwüste.

## High-Risk-Ergebnis-Limit

Es wurden harte Schwellen für den Rest aktiviert:

1. Kompakte Inhalte müssen mindestens auf 12px Randabstand im Nutzinhalt landen.
2. Kein sichtbarer textlicher/visualer Verlust bei 1:1-Route-/Mode-Mapping.
3. Drawer/Modal darf nicht den Primärkontext komplett ausblenden.
4. Compliance-/Advice-Routen müssen Entscheidungslogik priorisiert darstellen (Advisor ≠ Client-Release).
5. Tabellen-/Chip-/Graph-Layouts müssen auf Desktop/Tablet/Handy konsistent lesbar sein.

## High-Risk-Scan (Desktop- und Mobile-Übersicht)

Alle sechs Seiten wurden zuerst mit Screenshotvergleichen und DOM-Metriken betrachtet, inkl.  
`strict-review-dom-metrics.json` (verwendete Kandidatendichte: `crampedText`) und Flächenvergleich über Referenz-Assets.

### Ergebnis der sechs Anker

**Keine P0-Blocker auf den sechs Ankerseiten**, aber mehrere **P1/P2**-Anker benötigen visuelle Nacharbeit in den o.g. Bereichen.

## Vollständige Tabelle aller 63 Katalogseiten

Status-Konvention:  
- **P1** = harte Lesbarkeits-/Kompressions-/Overlay-Relevanz  
- **P2** = Politur-/Rhythmik-/Feinschliffbedarf  
- **Clean** = aktuell ohne harte visuellen Befund in diesem Durchlauf

| Page | Route | Referenz | Status | Desktop/Mobile | Screenshots |
| --- | --- | --- | --- | --- | --- |
| 001 | `/login` | PAGE-001-login.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-001-login-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-001-login-mobile.png) |
| 002 | `/mfa` | PAGE-002-mfa.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-002-mfa-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-002-mfa-mobile.png) |
| 003 | `/onboarding/invite` | PAGE-003-onboarding-invite.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-003-onboarding-invite-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-003-onboarding-invite-mobile.png) |
| 004 | `/onboarding/identity` | PAGE-004-onboarding-identity.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-004-onboarding-identity-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-004-onboarding-identity-mobile.png) |
| 005 | `/onboarding/consent` | PAGE-005-onboarding-consent.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-005-onboarding-consent-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-005-onboarding-consent-mobile.png) |
| 006 | `/onboarding/role-confirmation` | PAGE-006-onboarding-role-confirmation.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-006-onboarding-role-confirmation-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-006-onboarding-role-confirmation-mobile.png) |
| 007 | `/admin/platform` | PAGE-007-admin-platform.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-007-admin-platform-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-007-admin-platform-mobile.png) |
| 008 | `/admin/policies/advice-boundary` | PAGE-008-admin-policies-advice-boundary.png | P2 | Clean/P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-008-admin-policies-advice-boundary-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-008-admin-policies-advice-boundary-mobile.png) |
| 009 | `/admin/roles` | PAGE-009-admin-roles.png | P2 | Clean/P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-009-admin-roles-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-009-admin-roles-mobile.png) |
| 010 | `/admin/security` | PAGE-010-admin-security.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-010-admin-security-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-010-admin-security-mobile.png) |
| 011 | `/admin/evidence-templates` | PAGE-011-admin-evidence-templates.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-011-admin-evidence-templates-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-011-admin-evidence-templates-mobile.png) |
| 012 | `/admin/export-templates` | PAGE-012-admin-export-templates.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-012-admin-export-templates-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-012-admin-export-templates-mobile.png) |
| 013 | `/admin/tenants` | PAGE-013-admin-tenants.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-013-admin-tenants-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-013-admin-tenants-mobile.png) |
| 014 | `/tenants/new` | PAGE-014-tenants-new.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-014-tenants-new-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-014-tenants-new-mobile.png) |
| 015 | `/tenants/:id/setup` | PAGE-015-tenants-id-setup.png | P2 | P2/Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-015-tenants-id-setup-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-015-tenants-id-setup-mobile.png) |
| 016 | `/tenants/:id/team` | PAGE-016-tenants-id-team.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-016-tenants-id-team-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-016-tenants-id-team-mobile.png) |
| 017 | `/tenants/:id/policies` | PAGE-017-tenants-id-policies.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-017-tenants-id-policies-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-017-tenants-id-policies-mobile.png) |
| 018 | `/tenants/:id/users` | PAGE-018-tenants-id-users.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-018-tenants-id-users-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-018-tenants-id-users-mobile.png) |
| 019 | `/portal` | PAGE-019-portal.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-019-portal-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-019-portal-mobile.png) |
| 020 | `/mobile` | PAGE-020-mobile.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-020-mobile-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-020-mobile-mobile.png) |
| 021 | `/client/profile` | PAGE-021-client-profile.png | P2 | P2/Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-021-client-profile-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-021-client-profile-mobile.png) |
| 022 | `/client/family-members` | PAGE-022-client-family-members.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-022-client-family-members-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-022-client-family-members-mobile.png) |
| 023 | `/relationships` | PAGE-023-relationships.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-023-relationships-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-023-relationships-mobile.png) |
| 024 | `/entities` | PAGE-024-entities.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-024-entities-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-024-entities-mobile.png) |
| 025 | `/entities/new` | PAGE-025-entities-new.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-025-entities-new-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-025-entities-new-mobile.png) |
| 026 | `/entities/:id` | PAGE-026-entities-id.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-026-entities-id-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-026-entities-id-mobile.png) |
| 027 | `/documents` | PAGE-027-documents.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-027-documents-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-027-documents-mobile.png) |
| 028 | `/documents/upload` | PAGE-028-documents-upload.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-028-documents-upload-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-028-documents-upload-mobile.png) |
| 029 | `/documents/extraction-review` | PAGE-029-documents-extraction-review.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-029-documents-extraction-review-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-029-documents-extraction-review-mobile.png) |
| 030 | `/documents/verification-pending` | PAGE-030-documents-verification-pending.png | P1 | P1/P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-030-documents-verification-pending-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-030-documents-verification-pending-mobile.png) |
| 031 | `/wealth-map` | PAGE-031-wealth-map.png | P1 | P1 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-031-wealth-map-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-031-wealth-map-mobile.png) |
| 032 | `/actions` | PAGE-032-actions.png | P1 | P1 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-032-actions-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-032-actions-mobile.png) |
| 033 | `/signals` | PAGE-033-signals.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-033-signals-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-033-signals-mobile.png) |
| 034 | `/workbench` | PAGE-034-workbench.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-034-workbench-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-034-workbench-mobile.png) |
| 035 | `/workbench/triggers/:id` | PAGE-035-workbench-triggers-id.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-035-workbench-triggers-id-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-035-workbench-triggers-id-mobile.png) |
| 036 | `/advisor-approval` | PAGE-036-advisor-approval.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-036-advisor-approval-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-036-advisor-approval-mobile.png) |
| 037 | `/advisor-approval/:id` | PAGE-037-advisor-approval-id.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-037-advisor-approval-id-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-037-advisor-approval-id-mobile.png) |
| 038 | `/compliance` | PAGE-038-compliance.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-038-compliance-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-038-compliance-mobile.png) |
| 039 | `/compliance/:id/review` | PAGE-039-compliance-id-review.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-039-compliance-id-review-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-039-compliance-id-review-mobile.png) |
| 040 | `/compliance/:id/release` | PAGE-040-compliance-id-release.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-040-compliance-id-release-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-040-compliance-id-release-mobile.png) |
| 041 | `/compliance/:id/block` | PAGE-041-compliance-id-block.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-041-compliance-id-block-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-041-compliance-id-block-mobile.png) |
| 042 | `/compliance/:id/audit` | PAGE-042-compliance-id-audit.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-042-compliance-id-audit-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-042-compliance-id-audit-mobile.png) |
| 043 | `/decisions` | PAGE-043-decisions.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-043-decisions-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-043-decisions-mobile.png) |
| 044 | `/decisions/:id` | PAGE-044-decisions-id.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-044-decisions-id-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-044-decisions-id-mobile.png) |
| 045 | `/decisions/:id/success` | PAGE-045-decisions-id-success.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-045-decisions-id-success-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-045-decisions-id-success-mobile.png) |
| 046 | `/evidence` | PAGE-046-evidence.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-046-evidence-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-046-evidence-mobile.png) |
| 047 | `/evidence/:id` | PAGE-047-evidence-id.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-047-evidence-id-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-047-evidence-id-mobile.png) |
| 048 | `/governance/users` | PAGE-048-governance-users.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-048-governance-users-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-048-governance-users-mobile.png) |
| 049 | `/governance/roles` | PAGE-049-governance-roles.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-049-governance-roles-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-049-governance-roles-mobile.png) |
| 050 | `/governance/access-requests` | PAGE-050-governance-access-requests.png | P2 | P2/Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-050-governance-access-requests-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-050-governance-access-requests-mobile.png) |
| 051 | `/governance/audit-history` | PAGE-051-governance-audit-history.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-051-governance-audit-history-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-051-governance-audit-history-mobile.png) |
| 052 | `/communication` | PAGE-052-communication.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-052-communication-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-052-communication-mobile.png) |
| 053 | `/communication/call-trigger` | PAGE-053-communication-call-trigger.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-053-communication-call-trigger-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-053-communication-call-trigger-mobile.png) |
| 054 | `/export/new` | PAGE-054-export-new.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-054-export-new-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-054-export-new-mobile.png) |
| 055 | `/export/:id/scope` | PAGE-055-export-id-scope.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-055-export-id-scope-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-055-export-id-scope-mobile.png) |
| 056 | `/export/:id/redaction` | PAGE-056-export-id-redaction.png | P2 | Clean/P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-056-export-id-redaction-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-056-export-id-redaction-mobile.png) |
| 057 | `/export/:id/preview` | PAGE-057-export-id-preview.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-057-export-id-preview-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-057-export-id-preview-mobile.png) |
| 058 | `/export/:id/download` | PAGE-058-export-id-download.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-058-export-id-download-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-058-export-id-download-mobile.png) |
| 059 | `/ops/queues` | PAGE-059-ops-queues.png | P1 | P1/Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-059-ops-queues-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-059-ops-queues-mobile.png) |
| 060 | `/ops/sla` | PAGE-060-ops-sla.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-060-ops-sla-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-060-ops-sla-mobile.png) |
| 061 | `/service-blueprint` | PAGE-061-service-blueprint.png | Clean | Clean | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-061-service-blueprint-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-061-service-blueprint-mobile.png) |
| 062 | `/roadmap` | PAGE-062-roadmap.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-062-roadmap-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-062-roadmap-mobile.png) |
| 063 | `/states` | PAGE-063-states.png | P2 | P2 | [desktop](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/PAGE-063-states-desktop.png) / [mobile](/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/PAGE-063-states-mobile.png) |

## Befunde nach Schweregrad

### P0

**Kein bestätigter P0-Befund in diesem Durchlauf.**  
`visual:contract` ist grün, aber die visuellen Qualitätsmängel sind überwiegend P1/P2-Kategorien (Lesbarkeit, Dichte, Rhythmik, Overlay-Kontext).  
Product-Rule-Verletzungen wie „unbremste Client-Empfehlung ohne Compliance-Freigabe“ wurden visuell nicht als hart nachgewiesen.

### P1

| ID | Page/Route | Referenz | Implementation | Viewport | Crop/Region | Fehlerkategorie | Warum nicht durch Automatik gesehen | Wahrscheinlicher Bereich | Fix-Richtung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1-001 | PAGE-031 `/wealth-map` | `PAGE-031-wealth-map.png` | `desktop/PAGE-031-wealth-map-desktop.png` ; `mobile/PAGE-031-wealth-map-mobile.png` | Desktop + Mobile | Unterer Kartenfuß, rechte Drawer-/Detailfläche | Edge/Surface-Conflict, Drawer-Inkonsistenz, Layout-Kompression | Route ist valide und ohne Overflow; Lesbarkeit leidet durch Dichte und Footernähe | `components/app-shell.tsx`, `components/wealth-actions-screen.tsx` (Drawer-Fallback), evtl. `components/ui/data-table.tsx` für Chip/Meta-Zellen | Side-drawer visuell wirklich ausspielen, Footer-Höhe und Content-Padding erhöhen, mobile alternative Kartenansicht prüfen |
| P1-002 | PAGE-030 `/documents/verification-pending` | `PAGE-030-documents-verification-pending.png` | `desktop/PAGE-030-documents-verification-pending-desktop.png` | Desktop + Mobile | Meta-Header, Status/Datums-Zeilen | Layout-Kompression (dense table card set) | Automatik sieht „keine Overflow“; Scanbarkeit überlappen sich semantisch | `components/client-intake-screen.tsx` / shared Card/Info Rows | Mehr visuelle Trennung zwischen Status-Headline und Detailinfos; großzügigere Zeilenhöhe und horizontale Gruppen |
| P1-003 | PAGE-032 `/actions` | `PAGE-032-actions.png` | `desktop/PAGE-032-actions-desktop.png` ; `mobile/PAGE-032-actions-mobile.png` | Desktop + Mobile | Board- und Action-Kartenbereich | Bad Wrapping + Dichte + Overlay-Interaktion | Keine horizontale Überlaufschlacht; Texte bleiben formal sichtbar, sind aber schwer lesbar | `components/wealth-actions-screen.tsx`, `components/ui/data-table.tsx` (Fallback/Listenansicht) | Kanban-Spalten auf sinnvolle Max-Breite begrenzen, Karten mit mehr Weißraum, sekundäre Notizen auslagern |
| P1-004 | PAGE-059 `/ops/queues` | `PAGE-059-ops-queues.png` | `desktop/PAGE-059-ops-queues-desktop.png` | Desktop | Metrik-Kachelbereich + Kopfzeile | Layout-Kompression | Contract prüft nur Route/Asset und Overflows, nicht KPI-Hierarchie | Shared Card-/Metric-Componenten in `components/client-intake-screen.tsx` + Shell-Spacing in `app-shell.tsx` | KPI-Kacheln klar trennen (Kachelschrift/Spacing), priorisierte Reihen statt Inline-Bündelung |
| P1-005 | PAGE-008 `/admin/policies/advice-boundary` | `PAGE-008-admin-policies-advice-boundary-mobile.png` | Mobile | Sidebar/Content-Wechsel im ersten Viewport | Surface/Übersichtswert, Workflow-Visibility | Contract greift auf Seite-Asset, nicht auf erste Blick-Ersichtbarkeit | `components/app-shell.tsx`, `components/sidebar.tsx` | Mobile Desktop-Shell nur als Drawer, Inhalt bleibt primär im ersten Viewport |
| P1-006 | PAGE-009 `/admin/roles` | `PAGE-009-admin-roles-mobile.png` | Mobile | Permission-Modal/Role-Liste im oberen Bereich | Edge-Padding + Overlay-Context | Kein Overflow und kein Kontraktregisterfehler, aber Rollen-/Berechtigungsdaten werden knapp gelesen | `components/admin-tenant-setup-screen.tsx`, `components/ui/modal.tsx` | Permission-Kontexte mit weniger überlagernder Fläche, breitere Rollenchips |

### P2

| ID | Page/Route | Referenz | Implementation | Viewport | Crop/Region | Fehlerkategorie | Warum nicht durch Automatik gesehen | Wahrscheinlicher Bereich | Fix-Richtung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P2-001 | PAGE-019 `/portal` | `PAGE-019-portal.png` | `desktop/PAGE-019-portal-desktop.png` ; `mobile/PAGE-019-portal-mobile.png` | Desktop + Mobile | Tabellen-/Metrik-Cluster | Bad Wrapping, kompakte Werteblöcke | Keine harte Breitenverletzung, aber verdichtete Kennzahlen | `components/client-intake-screen.tsx` | Dichteste Kennzahlen in zwei Zeilen aufspalten |
| P2-002 | PAGE-029 `/documents/extraction-review` | `PAGE-029-documents-extraction-review.png` | `desktop/PAGE-029-documents-extraction-review-desktop.png` ; `mobile/PAGE-029-documents-extraction-review-mobile.png` | Desktop + Mobile | Extraktionsdetail-Tabelle | Textverdichtung bei Fachwerten | Geometrie ist korrekt, semantische Lesbarkeit leidet | `components/client-intake-screen.tsx` | Row-Höhen + Label-Länge standardisieren, feste Breite für Wertspalte |
| P2-003 | PAGE-033 `/signals` | `PAGE-033-signals.png` | `desktop/PAGE-033-signals-desktop.png` ; `mobile/PAGE-033-signals-mobile.png` | Desktop + Mobile | Signal-/Trigger-Liste | Dichte/Hierarchie | Contract kann nur „Screen exists“ prüfen | `components/internal-workflow-screen.tsx` | Zweispaltige Signalpriorisierung, Trigger-Details erst auf Expand |
| P2-004 | PAGE-034 `/workbench` | `PAGE-034-workbench.png` | `desktop/PAGE-034-workbench-desktop.png` ; `mobile/PAGE-034-workbench-mobile.png` | Desktop + Mobile | Toolbars + Karteikarten | Edge und Rhythmik | Keine visuelle Qualitätsmetrik im Contract | `components/internal-workflow-screen.tsx` | Toolbar/Filter/Status-Bereich standardisieren |
| P2-005 | PAGE-035 `/workbench/triggers/:id` | `PAGE-035-workbench-triggers-id.png` | `desktop/PAGE-035-workbench-triggers-id-desktop.png` ; `mobile/PAGE-035-workbench-triggers-id-mobile.png` | Desktop + Mobile | Trigger-Feldtitel + Beschreibungen | Bad Wrapping | Keine horizontale Verletzung im DOM-Metrikreport | `components/internal-workflow-screen.tsx` | Feldblöcke auf Zeilen-/Blocklogik umbauen |
| P2-006 | PAGE-036 `/advisor-approval` | `PAGE-036-advisor-approval.png` | `desktop/PAGE-036-advisor-approval-desktop.png` ; `mobile/PAGE-036-advisor-approval-mobile.png` | Desktop + Mobile | Approval-Liste und CTA | Dichte | Kein Rule-Verstoß nach Contract | `components/internal-workflow-screen.tsx` | Hinweisband „Advisor Approval is not Client Release“ visuell stärker betonen |
| P2-007 | PAGE-038 `/compliance` | `PAGE-038-compliance.png` | `desktop/PAGE-038-compliance-desktop.png` ; `mobile/PAGE-038-compliance-mobile.png` | Desktop + Mobile | Metrik-/Warteschlangenbereich | Bad Wrapping, kleine Chips | Contract ist oberflächlich | `components/client-intake-screen.tsx` + `components/ui/data-table.tsx` | Chip-Abstände anheben, Mindesthöhe pro Zeile erhöhen |
| P2-008 | PAGE-039 `/compliance/:id/review` | `PAGE-039-compliance-id-review.png` | `desktop/PAGE-039-compliance-id-review-desktop.png` ; `mobile/PAGE-039-compliance-id-review-mobile.png` | Desktop + Mobile | Compliance-Review-Matrix, rechte Aktionen | Dichte, Workflow-Visibility | Automatik erkennt keine visuelle Priorisierung in Entscheidungslagen | `components/internal-workflow-screen.tsx` | Entscheidungssektion als klare Primärspalte; Evidence-Liste in klar abgegrenzter Sekundärfläche |
| P2-009 | PAGE-040 `/compliance/:id/release` | `PAGE-040-compliance-id-release.png` | `desktop/PAGE-040-compliance-id-release-desktop.png` ; `mobile/PAGE-040-compliance-id-release-mobile.png` | Desktop + Mobile | Release-Modal + Hintergrund | Modal-Kontextverlust | Dialog ist erlaubt; Lesbarkeit des Kontextes fehlt | `components/ui/modal.tsx`, `components/internal-workflow-screen.tsx` | Modal mit Kontextzusammenfassung statt vollflächigem Blur |
| P2-010 | PAGE-041 `/compliance/:id/block` | `PAGE-041-compliance-id-block.png` | `desktop/PAGE-041-compliance-id-block-desktop.png` ; `mobile/PAGE-041-compliance-id-block-mobile.png` | Desktop + Mobile | Block/Request-Evidence Overlay | Overlay-Restaurierung, Kompression | Kein Fehler im Automatik-Checks | `components/ui/modal.tsx`, `components/ui/workflow-badge.tsx` | Entscheidungshintergrund minimieren, klaren Hinweis auf Grund und nächste Schritte |
| P2-011 | PAGE-044 `/decisions/:id` | `PAGE-044-decisions-id.png` | `desktop/PAGE-044-decisions-id-desktop.png` ; `mobile/PAGE-044-decisions-id-mobile.png` | Desktop + Mobile | Entscheidungsraum + Bestätigungsbereich | Dichte / rhythmische Trennung | Contract kann keine Lesbarkeitswertung liefern | `components/decisions-governance-screen.tsx` | Entscheidungslogik visuell priorisieren, sekundäre Zusatzinfos in Accordion/Drawer |
| P2-012 | PAGE-047 `/evidence/:id` | `PAGE-047-evidence-id.png` | `desktop/PAGE-047-evidence-id-desktop.png` ; `mobile/PAGE-047-evidence-id-mobile.png` | Desktop + Mobile | Evidence-Log/Metadata | Dense table rhythm | Kein Clipping; nur Scanbarkeit | `components/decisions-governance-screen.tsx`, `components/ui/data-table.tsx` | Metadata in zweizeilige Grid-Karten aufbrechen |
| P2-013 | PAGE-051 `/governance/audit-history` | `PAGE-051-governance-audit-history.png` | `desktop/PAGE-051-governance-audit-history-desktop.png` ; `mobile/PAGE-051-governance-audit-history-mobile.png` | Desktop + Mobile | Audit-Timeline + Action Chips | Dichte | Kein Overflow-Nachweis bei hoher Datenrate | `components/decisions-governance-screen.tsx` | Timeline statt dichter Inline-Chips |
| P2-014 | PAGE-052 `/communication` | `PAGE-052-communication.png` | `desktop/PAGE-052-communication-desktop.png` ; `mobile/PAGE-052-communication-mobile.png` | Desktop + Mobile | Preview-Panel + Nachrichten-Liste | Layout-Kompression | Contract prüft nur Asset/Route-Existenz | `components/communication-export-ops-screen.tsx` | Panel- und Message-Row-Breiten vereinheitlichen |
| P2-015 | PAGE-053 `/communication/call-trigger` | `PAGE-053-communication-call-trigger.png` | `desktop/PAGE-053-communication-call-trigger-desktop.png` ; `mobile/PAGE-053-communication-call-trigger-mobile.png` | Desktop + Mobile | Trigger-Matrix | Dichte | Kein visueller Score im Contract | `components/communication-export-ops-screen.tsx` | Triggerzeilen in kondensierte Gruppen + klaren Headern |
| P2-016 | PAGE-055 `/export/:id/scope` | `PAGE-055-export-id-scope.png` | `desktop/PAGE-055-export-id-scope-desktop.png` ; `mobile/PAGE-055-export-id-scope-mobile.png` | Desktop + Mobile | Scope-Auswahllisten | Textlänge, Dichte | Kein Layout-Lesbarkeitsscore | `components/communication-export-ops-screen.tsx` | Scope-Listen in Step-Karten statt durchgängige Tabellen |
| P2-017 | PAGE-056 `/export/:id/redaction` | `PAGE-056-export-id-redaction.png` | `desktop/PAGE-056-export-id-redaction-desktop.png` ; `mobile/PAGE-056-export-id-redaction-mobile.png` | Desktop + Mobile | Redaction-Payload + Hinweisebereich | Superfluous whitespace / under-composed workflow | Automatik sieht keine Inhaltstiefe; nur Form vorhanden | `components/communication-export-ops-screen.tsx` | Erweitertes Redaction-Dashboard (Dokumentvorschau + Queue + Freigabestatus) |
| P2-018 | PAGE-058 `/export/:id/download` | `PAGE-058-export-id-download.png` | `desktop/PAGE-058-export-id-download-desktop.png` ; `mobile/PAGE-058-export-id-download-mobile.png` | Desktop + Mobile | Download-Modal + Meta-Zeilen | Politur + Dichte | Kein Clipping, aber UI wirkt prozessarm | `components/communication-export-ops-screen.tsx` | Klare Trennung Download/Sharing/Compliance-Status |
| P2-019 | PAGE-062 `/roadmap` | `PAGE-062-roadmap.png` | `desktop/PAGE-062-roadmap-desktop.png` ; `mobile/PAGE-062-roadmap-mobile.png` | Desktop + Mobile | Milestones im unteren Bereich | Texttrennung, Rhythmik | Kein Clipping-Alarm, aber Lesespur wird zerfasert | `components/route-skeleton-page.tsx` / `components/decisions-governance-screen.tsx` | Kartenebenen mit klaren Breaks und Zeilenabständen |
| P2-020 | PAGE-063 `/states` | `PAGE-063-states.png` | `desktop/PAGE-063-states-desktop.png` ; `mobile/PAGE-063-states-mobile.png` | Desktop + Mobile | Status-Badge-Zeilen | Rhythmik | Keinerlei funktionaler Fehler, nur Lesbarkeit | `components/route-skeleton-page.tsx` | Badge-Längen harmonisieren, konsistente Chip-Breiten |

## Verifizierungsstatus

- **`pnpm visual:contract` Ergebnis:** `checkedAssets=63`, `checkedRoutes=63`, `failures=[]`, `fetchedRoutes=63` (nur als Gate)
- **Screenshot-Run vorhanden:** `artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation`  
  - Desktop: 63
  - Mobile: 63
  - Overflow in `strict-review-dom-metrics.json`: dokumentiert als `no` (keine horizontale Überbreite)
- **DOM/CSS-Inspektion genutzt:** bei wiederkehrenden Verdachtsfällen (Karten-/Drawer-/Modal-Bereiche sowie High-Risk-Seiten)

## Measures Plan (Reihenfolge)

1. **Shared primitives zuerst**  
   - `components/app-shell.tsx` + `components/sidebar.tsx`: mobile Content-first Navigation; Shell bleibt persistent, aber nicht im ersten Blick dominant.
   - `components/ui/data-table.tsx`: responsive Row/Card-Fallback + stabile Zell- und Chip-Paddings.
2. **Route-übergreifende Muster**  
   - `components/ui/modal.tsx` und `components/ui/drawer.tsx`: Kontext-Visibility verbessern; nicht zu starke Verdeckung.
   - `components/ui/workflow-badge.tsx`: konsistente Metadatenpriorität.
3. **Einzelseiten-Fixes für harte P1-Routen**  
   - `components/wealth-actions-screen.tsx` (031/032): Side-drawer und Board-Skalierung korrigieren.
   - `components/internal-workflow-screen.tsx` (033/034/035/036/037/038/039/041/044): Compliance- und Advisor-Workflows visuell neu priorisieren.
   - `components/communication-export-ops-screen.tsx` (056/058): Export/Redaction Workflow dichter und sichtbarer anreichern.
4. **Residual P2 sauber schließen**  
   - Nach jedem Primitiv-Update erneut `pnpm visual:strict` und kurzes manuellen Crop-Scan auf die betroffenen Regionen.

## Do-Not-Fix-By

- Keine pauschale Font-Skalierung als erste Maßnahme.
- Keine Seite-spezifischen CSS-Workarounds als Dauerlösung.
- Keine Spec-/Annotations-/Datei-/Route-Labels im UI.
- Keine Verschleierung von Evidence/Audit/Compliance-/Redaction-Daten ohne alternative Zugänglichkeit.
- Keine produktlogischen Umgehungen (Demo-Sicherheit, Rollen, Rechte, Audit, Gates) zur UI-Optimierung.
- Advisor-Approval nicht wie Client-Release visuell behandeln.

## Akzeptanzkriterien (durch den Durchlauf erfüllt / offen)

- ✅ Alle 63 Katalogseiten geprüft (Desktop + Mobile, inkl. Modal/Drawer-Routen)
- ✅ High-Risk-Kalibrierung vor Vollscan durchgeführt
- ✅ `contract-clean` klar von `human-readable` getrennt dokumentiert
- ✅ Surface/Background-Fidelity bewusst gegen `clean_pages` beurteilt
- ✅ App-Surface Boundaries ohne Spez-/Chrome-Leaks bewertet
- ✅ Produktregel-Checks (Compliance-/Evidence-Sichtbarkeit) dokumentiert
- ✅ P1 sind benannt und mit Fixrichtung versehen
- ⚠️ Finale visuelle Akzeptanz ist noch abhängig von Umsetzung der Measures (P1 offen), siehe Findings

## Nachweis-Kurzgrafik (optional)

Empfohlener zusätzlicher manueller Review:
- `artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/contact-sheets/contact-desktop.png`
- `artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/contact-sheets/contact-mobile.png`

