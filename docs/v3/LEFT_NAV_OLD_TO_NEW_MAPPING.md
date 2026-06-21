# AlphaVest Left Navigation Old-to-New Mapping

Date: 2026-06-21

This document maps older task language and previous sidebar groups to the current
task-oriented left navigation. Use it when an older prompt, task, test note or
handoff refers to the former route-catalogue navigation.

The route registry remains the source of truth for route IDs, route paths and
worksets. This mapping is only for sidebar presentation and active-parent
orientation.

## How to Use This Mapping

1. Translate the old task wording into the current sidebar target before editing
   navigation, shell layout or tests.
2. Keep direct routes direct. If an older task names a detail, success, block,
   review or held route, use the route itself and only use this document to
   decide the expected active parent.
3. Use `lib/route-registry.ts` for route IDs, paths, worksets and route state.
   Use `lib/navigation.ts` plus this document for global sidebar presentation.
4. Do not restore historical group labels, route-catalogue labels, spec panels,
   filename labels or annotation rails as product UI.
5. When a legacy route family has its own sidebar or topbar, preserve that route
   family's identity while keeping the main content structure aligned with the
   shared guidance/product-content pattern.

## Current Navigation Rule

- Do not reintroduce raw route-catalogue groups into the sidebar.
- Do not promote detail, success, P1, reference-only or held routes into core
  MVP navigation.
- If an older task names a detail or state route, navigate to the route directly
  but expect the sidebar to highlight its current parent entry.
- If a task needs route IDs, use `lib/route-registry.ts`; if it needs visible
  sidebar placement, use `lib/navigation.ts` and this mapping.

## Current Shell Behavior

The current product navigation is intentionally not a one-to-one copy of the
old route catalogue.

| Shell / route family | Current behavior | Task interpretation |
| --- | --- | --- |
| Global `AppShell` pages | Use the current task-oriented left navigation from `lib/navigation.ts`. | Old group names should be translated through this mapping before expectations are written. |
| Legacy product shell families | May keep a family-specific sidebar or topbar to preserve route context. | Do not treat family-specific chrome as permission to reintroduce the old global route catalogue. |
| Main product area | Uses the shared guidance/product-content structure where implemented. | Guidance is shell context; the product page below remains the work surface. |
| Desktop and tablet | Guidance appears before the product content. | Tests can assert guidance before page work surface where the shared shell applies. |
| Mobile | Product content appears first and guidance follows below it. | Mobile tests should not expect guidance to precede the route content. |
| Decisions/Governance legacy sidebar | Uses a primary-navigation landmark and active-parent state for folded route families. | Historical `Decisions & Governance` wording maps to the visible active parent, not to a restored catalogue. |

## Former Group to Current Group Mapping

| Former group / older wording | Current sidebar group | Current intent |
| --- | --- | --- |
| `Route catalogue`, `route-catalogue`, `old left nav` | Current task-oriented sidebar | Historical navigation vocabulary only; translate before implementation. |
| `Access & Setup`, `access` | `Setup` | Demo-local onboarding and identity setup, visually secondary. |
| `Platform & Tenant`, `platform`, `tenant_setup` | `Setup` plus selected `Governance` entries | Operational setup is secondary; advice boundary and security sit under governance. |
| `Client Workspace`, `client_workspace`, `wealth_actions` | `Home` and `Client & Evidence` | Client context, documents, evidence, relationships, entities, wealth map and actions. |
| `Advisory Workflow`, `advisory_workflow` | `Advisory Work` and `Compliance & Release` | Signals, workbench, advisor approval, compliance review and release controls. |
| `Decisions & Governance`, `decisions_evidence`, `operations` | `Decisions & Audit` and `Governance` | Decision work, evidence/audit orientation, users, roles and access requests. |
| `Export Control`, `export` | `Export` | Export creation, scope, redaction, preview and download/share. |
| `Communication`, `P1`, `Later` | Not shown in core sidebar | Deferred/P1 routes remain direct-route/exclusion-shell only. |
| `Reference` | Not shown in core sidebar | Reference-only routes remain direct-route/exclusion-shell only. |
| `Held`, `KYC`, `Suitability`, `IPS`, `Committee` | Not shown in core sidebar | Held routes remain direct-route/exclusion-shell only. |

## Old Label Aliases

Use this table when older tickets use short labels without page IDs.

| Older label / alias | Current target |
| --- | --- |
| `Home`, `Portal`, `Client dashboard` | `Home` -> `Client portal` |
| `Mobile home`, `Mobile portal` | `Home` -> `Mobile client view` |
| `Client`, `Client profile`, `Wealth map`, `Family`, `Entities`, `Actions` | `Client & Evidence` -> `Client profile` |
| `Documents`, `Document list`, `Client files` | `Client & Evidence` -> `Document library` |
| `Upload`, `Intake`, `Extraction`, `Verification pending` | `Client & Evidence` -> `Evidence intake` |
| `Evidence`, `Evidence record`, `Vault` | `Client & Evidence` -> `Evidence vault` |
| `Signal`, `Signals`, `Signal review` | `Advisory Work` -> `Signal review` |
| `Workbench`, `Trigger`, `Trigger detail` | `Advisory Work` -> `Workbench` |
| `Advisor approval`, `Approval queue`, `Approval detail` | `Advisory Work` -> `Advisor approval` |
| `Compliance queue` | `Compliance & Release` -> `Compliance queue` |
| `Compliance review`, `Review detail` | `Compliance & Release` -> `Compliance review` |
| `Release`, `Block`, `Request evidence`, `Compliance audit` | `Compliance & Release` -> `Release controls` |
| `Decision list` | `Decisions & Audit` -> `Decision list` |
| `Decision room`, `Decision submitted`, `Submission success` | `Decisions & Audit` -> `Decision room` |
| `Users`, `Governance users` | `Governance` -> `Governance users` |
| `Roles`, `Role management` | `Governance` -> `Roles` |
| `Access requests` | `Governance` -> `Access requests` |
| `Access audit`, `Audit history` | `Decisions & Audit` -> `Audit history` |
| `Create export`, `New export` | `Export` -> `New export` |
| `Export scope` | `Export` -> `Scope selection` |
| `Export redaction` | `Export` -> `Redaction` |
| `Export preview` | `Export` -> `Preview` |
| `Export download`, `Share export` | `Export` -> `Download / share` |
| `Ops`, `Monitoring`, `SLA`, `Escalation`, `Communication centre` | Direct-route/P1 only, not core sidebar |
| `KYC`, `AML`, `Source of wealth`, `Suitability`, `IPS`, `Committee review` | Held/direct-route only, not core sidebar |

## Page ID to Current Sidebar Parent

| Page IDs | Old route/task wording | Current sidebar parent | Sidebar tier |
| --- | --- | --- | --- |
| `001`, `002`, `003`, `004`, `005`, `006` | Login, MFA, invite, identity, consent, role confirmation | `Setup` -> `User onboarding` | Secondary |
| `007` | Platform settings | `Setup` -> `Platform settings` | Secondary |
| `008` | Advice boundary policy | `Governance` -> `Advice boundary` | Secondary |
| `009` | Global role templates | `Setup` -> `Role templates` | Secondary |
| `010` | Security configuration | `Governance` -> `Security` | Secondary |
| `011` | Evidence templates | `Setup` -> `Evidence templates` | Secondary |
| `012` | Export templates / redaction policy | `Setup` -> `Export templates` | Secondary |
| `013`, `014` | Tenant list, create tenant | `Setup` -> `Tenant directory` | Secondary |
| `015`, `016`, `017`, `018` | Tenant setup, team, policies, users | `Setup` -> `Tenant setup` | Secondary |
| `019` | Client portal / dashboard | `Home` -> `Client portal` | Primary |
| `020` | Mobile home | `Home` -> `Mobile client view` | Secondary |
| `021`, `022`, `023`, `024`, `025`, `026`, `031`, `032` | Client profile, family members, relationships, entities, wealth map, actions | `Client & Evidence` -> `Client profile` | Primary |
| `027` | Documents list | `Client & Evidence` -> `Document library` | Primary |
| `028`, `029`, `030` | Document upload, extraction review, verification pending | `Client & Evidence` -> `Evidence intake` | Primary |
| `033` | Signal review | `Advisory Work` -> `Signal review` | Primary |
| `034`, `035` | Consultant workbench, trigger detail | `Advisory Work` -> `Workbench` | Primary |
| `036`, `037` | Advisor approval queue/detail | `Advisory Work` -> `Advisor approval` | Primary |
| `038` | Compliance queue | `Compliance & Release` -> `Compliance queue` | Primary |
| `039` | Compliance review detail | `Compliance & Release` -> `Compliance review` | Primary |
| `040`, `041`, `042` | Release, block/request evidence, compliance audit | `Compliance & Release` -> `Release controls` | Primary |
| `043` | Decision list | `Decisions & Audit` -> `Decision list` | Primary |
| `044`, `045` | Decision room, decision submitted | `Decisions & Audit` -> `Decision room` | Primary |
| `046`, `047` | Evidence vault, evidence record detail | `Client & Evidence` -> `Evidence vault` | Primary |
| `048` | Governance users | `Governance` -> `Governance users` | Primary |
| `049` | Role management | `Governance` -> `Roles` | Primary |
| `050` | Access requests | `Governance` -> `Access requests` | Primary |
| `051` | Access audit history | `Decisions & Audit` -> `Audit history` | Primary |
| `052`, `053` | Communication centre, call trigger matrix | Not shown in core sidebar | P1/deferred |
| `054` | Create export | `Export` -> `New export` | Primary |
| `055` | Export scope selection | `Export` -> `Scope selection` | Primary |
| `056` | Export redaction | `Export` -> `Redaction` | Primary |
| `057` | Export preview | `Export` -> `Preview` | Primary |
| `058` | Export download/share | `Export` -> `Download / share` | Primary |
| `059`, `060` | Ops queues, SLA and escalation | Not shown in core sidebar | P1/deferred |
| `061`, `062`, `063` | Service blueprint, roadmap, state/badge reference | Not shown in core sidebar | Reference-only |
| `064`, `065`, `066`, `067`, `069`, `070`, `071` | KYC, source of wealth, suitability, IPS, rebalance, committee review | Not shown in core sidebar | Held |
| `068` | Review calendar | Not shown in core sidebar | P1/deferred |

## Common Translation Examples

| Older task says | Use this current navigation target |
| --- | --- |
| "Open Client Workspace -> Documents" | `Client & Evidence` -> `Document library` |
| "Open Client Workspace -> Upload Document" | `Client & Evidence` -> `Evidence intake` |
| "Open Advisory Workflow -> Trigger Detail" | Direct route `/workbench/triggers/demo`; sidebar parent is `Advisory Work` -> `Workbench`. |
| "Open Advisor Approval Detail" | Direct route `/advisor-approval/demo`; sidebar parent is `Advisory Work` -> `Advisor approval`. |
| "Open Compliance Block" | Direct route `/compliance/demo/block`; sidebar parent is `Compliance & Release` -> `Release controls` where global shell applies. |
| "Open Decision Submitted" | Direct route `/decisions/demo/success`; sidebar parent is `Decisions & Audit` -> `Decision room`. |
| "Open Evidence Record Detail" | Direct route `/evidence/demo`; sidebar parent is `Client & Evidence` -> `Evidence vault`. |
| "Open Tenant Users" | Direct route `/tenants/demo/users`; sidebar parent is `Setup` -> `Tenant setup`. |
| "Open Platform & Tenant -> Advice Boundary" | `Governance` -> `Advice boundary`. |
| "Open Platform & Tenant -> Security" | `Governance` -> `Security`. |

## Detail and State Route Parent Rules

| Route family / example | Expected parent in current navigation language |
| --- | --- |
| `/workbench/triggers/demo` | `Advisory Work` -> `Workbench` |
| `/advisor-approval/demo` | `Advisory Work` -> `Advisor approval` |
| `/compliance/demo/review` | `Compliance & Release` -> `Compliance review` |
| `/compliance/demo/release` | `Compliance & Release` -> `Release controls` |
| `/compliance/demo/block` | `Compliance & Release` -> `Release controls` |
| `/compliance/demo/audit` | `Compliance & Release` -> `Release controls` in workflow language; `Decisions & Audit` -> `Audit history` when the task is audit-history oriented. |
| `/decisions/demo` | `Decisions & Audit` -> `Decision room` |
| `/decisions/demo/success` | `Decisions & Audit` -> `Decision room` |
| `/evidence/demo` | `Client & Evidence` -> `Evidence vault` |
| `/exports/demo/scope` | `Export` -> `Scope selection` |
| `/exports/demo/redaction` | `Export` -> `Redaction` |
| `/exports/demo/preview` | `Export` -> `Preview` |
| `/exports/demo/download` | `Export` -> `Download / share` |
| `/tenants/demo/users` | `Setup` -> `Tenant setup` |

## Maintenance Notes

- Update this document whenever `navigationDefinitions` in `lib/navigation.ts`
  changes.
- Keep this document aligned with `tests/navigation-shell.spec.ts` when adding
  or changing navigation guidance tests.
- Do not use this mapping to modify route worksets. Route scope remains locked
  in `lib/route-registry.ts`.
- Keep this document referenced from `AGENTS.md` so historical tasks translate
  old navigation language before implementation begins.
