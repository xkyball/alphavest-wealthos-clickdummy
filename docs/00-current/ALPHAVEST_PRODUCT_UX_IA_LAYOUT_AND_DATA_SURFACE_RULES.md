# AlphaVest Product UX, IA, Layout And Data Surface Rules

This file records product-level UX rules for the AlphaVest completion goal. It does not replace the True-UX handoff; it clarifies how production-ready IA, layout and data surfaces should be interpreted when tests or older proof contracts are too narrow.

## Core Rule

AlphaVest is a workflow-backed wealth operations product, not a collection of proof screens. Process Universe coverage remains the backbone, but the operational IA must be shaped around user workstreams, object state, queues, decisions and safe handoffs.

## User Value Prioritization

- Use ENGINE_v2 Psycho-Logic + Map/Model as a product prioritization lens: the UI should foreground what helps the user or client make the next legitimate, confident, low-risk move.
- Rational logic asks what is true in the system: workflow state, evidence, decision authority, permissions, audit trail, deadlines and blocked conditions.
- Psycho-logic asks what the user needs to feel oriented and safe: trust, control, clarity, reduced fear of doing the wrong thing, visible status, recoverability and a fair path forward.
- Map/model logic asks whether the current screen is the right map for the user's job. If a Process-Universe map, route registry map or capture ledger map conflicts with the user's actual work, the product screen must be redesigned around the work while preserving service, workflow and audit truth underneath.
- Prioritize surfaces that reduce client/user uncertainty first: queues with clear ownership, decision rooms with evidence and safety boundaries, client-safe visibility, export/redaction controls, blocked-state explanations and audit/history.
- Do not lead with internal completeness, process choreography or technical proof. Lead with object context, risk, evidence, next action and why an action is blocked or allowed.
- A screen fails product usefulness when it is technically correct but leaves the user asking: What am I looking at? What changed? What should I do next? What happens if I do it? Can I recover?

## IA Rules

- IA is the product structure; navigation is only the visible wayfinding layer. Do not let old route groups or BP order become the user journey.
- Main navigation should group work by user jobs: Client Context, Evidence Lifecycle, Analyst Workbench, Advisor Review, Compliance Release, Decision Record, Client Visibility, Export & Delivery and Operations/Governance support lanes.
- Each major flow needs an entry point, queue/workbench, object detail, action boundary, history/audit path and a meaningful return path.
- Global search should route to product objects and work items, not proof fixtures or internal process IDs.
- Product labels must use business language. No visible BP IDs, proof IDs, route IDs, capture metadata or implementation scaffolding.

## Layout Rules

- Keep the AlphaVest visual design: dark WealthOS shell, gold emphasis, restrained typography, sharp operational density and shared component grammar.
- UI may be substantially restructured when needed for real workflows. Existing tests should be updated when they freeze proof-screen layouts instead of production UX.
- Primary work must fit the task, not an artificial proof viewport. A no-scroll 1400x900 layout is preferred for focused decision screens, but longer pages are allowed when the task genuinely requires more content.
- Use progressive disclosure for secondary or long detail: drawers for context, accordions/disclosure sections for optional evidence or audit detail, modals only for sensitive confirmations.
- Maintain clear visual hierarchy with scale, contrast, grouping, proximity and consistent action placement. Avoid oversized banners, proof strips, badge clouds and decorative filler.

## Harmonization Rules

- AlphaVest must feel like one coherent product, not a set of assembled proof screens. Harmonization is an acceptance criterion for all UI and pageflow work.
- Preserve the AlphaVest look and feel as the binding style frame: dark operational shell, gold emphasis, disciplined density, precise status language, sharp surfaces and business-first copy.
- Rework navigation, page structure, component composition and interaction flow whenever that is the honest path to a normal, usable product experience.
- Same-intent screens must converge on the same reusable templates, components, spacing, status vocabulary, action grammar and feedback behavior.
- Do not preserve one-off layouts, dead-end proof routes, inconsistent card/table rhythms, isolated button patterns or page-specific visual drift just because an old test or capture expected them.
- Every major workstream should have a recognizable rhythm: hub or queue, object detail, decision/action area, context/history, next step and return path.
- Visual harmonization must be backed by real product state. Do not use decorative filler, proof panels, BP IDs, capture metadata or static success copy to make screens look aligned.
- Screenshot review should evaluate consistency across screen families, not only whether each individual screen passes. A screen can be functionally correct and still fail if it breaks the product grammar.

## Data Surface Rules

- Every substantial table or list-like dataset must support realistic volume.
- Required controls for data-heavy surfaces: search or query, filters, sorting, pagination or equivalent chunking, empty/error/loading states, row/detail access and clear row actions.
- Pagination is required when datasets can grow beyond a single useful viewport. Virtualization or lazy loading is acceptable where appropriate.
- Cards/lists may replace tables only when they still provide comparable finding, filtering, scanning and detail access.
- Dense layouts are allowed when users need to scan, compare or act on many records.

## Full-Text Search And Index Rules

- AlphaVest should introduce a shared full-text search layer for global search and high-value object searches instead of scattering ad hoc string filters across individual screens.
- The search layer should maintain an indexed document per searchable product object or work item, with stable references back to the canonical object: object type, object ID, tenant, workflow/process instance when applicable, route target, visibility scope, status and last indexed timestamp.
- Global search results must route to real product objects and work items, never proof fixtures, demo-only paths, process IDs or capture artifacts.
- Search indexing must be service-layer and DB-backed. Search documents may be stored in PostgreSQL full-text columns/indexes or in a dedicated search service added through dependencies and Docker Compose when the product need justifies it.
- Search results must enforce the same tenant, role, permission and client-visibility boundaries as the underlying object. A search hit must not reveal hidden internal payloads, unreleased advice, compliance notes or forbidden evidence.
- Index updates must be triggered by the same workflow/service actions that mutate business objects, with a rebuild command for deterministic local/demo refresh.
- Full-text search may support screen-level list searches when it produces better relevance than ordinary table filters, but it must not replace structured filters, sorting, pagination or exact status/workflow queries.
- If a new search dependency is introduced, Docker Compose, seed/rebuild scripts, health checks and tests must be updated with the same end-to-end standard as the application service.

## Workflow And Persistence Rules

- Business objects must be workflow-backed: recommendations, compliance reviews, evidence records, decisions, exports, client visibility states, advisor reviews and governance decisions need service-layer actions, DB persistence, process/workflow state, history/audit and product UI projection.
- Helper objects such as users, roles, permissions, tenants, templates and configuration do not need to be primary workflow objects, but create/update/approve/deny/revoke/version actions must be audit-backed and connected to governance/workflow boundaries when they affect process behavior.
- Do not count static UI, seed-only fixtures, un-audited CRUD rows, route fixtures, DOM-only assertions or screenshot-only proof as complete implementation.

## Reference Basis

- Nielsen Norman Group: Information Architecture distinguishes product structure from navigation and emphasizes wayfinding and taxonomies.
- Nielsen Norman Group: Visual hierarchy should guide attention through contrast, scale, grouping and placement.
- Nielsen Norman Group: Complex applications require support for users' real workflows, context, error prevention and efficient interaction.
- Material Design 3: Adaptive layout and density should respond to screen size, task and information volume; high-density layouts are appropriate for scanning/comparison tasks.
- Baymard research direction: search/filtering and product-finding patterns matter when item sets become large.
