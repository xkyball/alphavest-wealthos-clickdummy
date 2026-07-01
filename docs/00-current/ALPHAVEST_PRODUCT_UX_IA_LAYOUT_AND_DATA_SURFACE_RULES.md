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

## UI/UX/IA Homogenization Rules

- `Homogenization` replaces the earlier loose `harmonization` wording for future AlphaVest UI/UX/IA work. If older prompts, reports or tests say harmonization, interpret that as this stricter homogenization rule.
- Homogenization means one product grammar, not merely similar-looking screens. The app must feel like a single operating system across navigation, page structure, components, feedback, density, copy, interaction lifecycle and proof expectations.
- The scope is UI, UX and IA. This rule does not rename or replace workflow/service/DB truth; those layers remain the implementation authority behind visible product state.
- Preserve the AlphaVest look and feel as the binding style frame: dark operational shell, gold emphasis, disciplined density, precise status language, sharp surfaces and business-first copy.
- Rework navigation, page structure, component composition and interaction flow whenever that is the honest path to a normal, usable product experience.
- Same-intent screens must converge on the same reusable templates, components, spacing, status vocabulary, action grammar and feedback behavior.
- Do not preserve one-off layouts, dead-end proof routes, inconsistent card/table rhythms, isolated button patterns or page-specific visual drift just because an old test or capture expected them.
- Every major workstream should have a recognizable rhythm: hub or queue, object detail, decision/action area, context/history, next step and return path.
- Visual homogenization must be backed by real product state. Do not use decorative filler, proof panels, BP IDs, capture metadata or static success copy to make screens look aligned.
- Screenshot review should evaluate consistency across screen families, not only whether each individual screen passes. A screen can be functionally correct and still fail if it breaks the product grammar.

## IA Homogenization Rules

- IA is homogeneous when the same user job has the same structural pattern everywhere: entry point, queue or hub, selected object, detail/decision surface, allowed action, blocked reason, history/audit, next step and return path.
- Navigation must use one stable workstream grammar. Role-aware filtering may hide or show lanes, but it must not change the meaning, order, density or active-state behavior of the navigation model.
- Page headers must follow one context grammar: current workspace, selected tenant/client/object where relevant, job state, visibility mode and next action. They must not become route explainers.
- Breadcrumbs, back links and next-step links must be predictable. No productive route may behave like a proof endpoint or dead end when a user has a natural next job.
- Hubs, queues, detail pages, decision rooms, upload/review flows, exports, admin settings and audit/history surfaces must use their canonical templates instead of page-local composition.
- Reference, hold and non-productive routes stay outside the primary operating flow. They may remain registered, but they must not compete with real workstream IA.

## Component And Feedback Homogenization Rules

- Infoboxes, state boxes and blockers must use a finite shared taxonomy: object context, decision context, blocker/recovery, activity/history, inline help and client-safe notice. Each type needs consistent iconography, severity, density, placement and copy tone.
- Use transient overlays or toasts for short-lived action feedback such as upload accepted, upload failed, save complete, retry needed or background processing started. These overlays should auto-dismiss when the state is not a durable product fact.
- Persistent outcomes must also be reflected in service-backed read models, history, audit, evidence or queue state. A toast alone is never completion proof.
- Sensitive actions use modal typed confirmation. Context expansion uses drawers or disclosure sections. Routine save/upload feedback uses inline state plus transient overlay where useful.
- Upload flows should expose consistent progress, preview/thumbnail availability, validation errors and retry affordances without forcing the user to inspect the raw document unless needed.
- Tables, cards and list-like surfaces must share the same search/filter/sort/pagination grammar, loading and empty states, row actions and detail handoff behavior.
- Tests and captures should assert the homogeneous contract: correct template, consistent action zone, visible state, no internal metadata, no route-only endpoint, and screenshot evidence where UI proof is claimed.

## Engine V2/V3 Implications For Homogenization

- Psycho-Logic: users trust the product when the next useful action is obvious, the same visual patterns mean the same thing everywhere, and blocked states explain recovery without blame or internal jargon.
- Map/Model: Process Universe, route registry, capture ledger and UI are different maps. The UI must use the user-work map while workflow/service/DB/audit layers preserve process truth underneath.
- Double Diamond: discover current variants, define the canonical grammar, develop shared templates and feedback primitives, then deliver screenshot/API/service proof that the grammar holds across workstreams.
- TRIZ: AlphaVest needs rich workflow truth without visual clutter. Resolve the contradiction with shared templates, progressive disclosure, drawers, state boxes and transient overlays rather than explainer boards.
- SIT Closed World: reuse the existing shell, page templates, action zones, drawers, modals, data tables, workflow services, read models and capture proof before inventing new surfaces.
- V3 evidence-first rule: no homogenization claim is accepted without proof. For UI work, that means tests plus screenshots or capture evidence at the target viewport, with gaps reported honestly.
- Weak branch to kill: making screens "look closer" by adding more cards, labels or documentation panels. Strong branch: fewer patterns, stricter shared grammar, real product state, clear next action.

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

## Tooling And Proof Infrastructure Rules

- Codex may add project dependencies, local tools, scripts and Docker Compose services when they materially improve end-to-end implementation, visual verification, OCR/pixel evidence, search/indexing, data realism, accessibility, performance or regression safety.
- Codex may also install or configure local system tools that support the implementation process itself, such as inspection, browser automation, image analysis, OCR, database, search, performance, accessibility, debugging or reporting utilities.
- Tool additions must be wired like product infrastructure: documented purpose, deterministic local setup, script entry point, health check where applicable, and tests or proof artifacts that consume the tool.
- Local implementation tools do not need to become product dependencies unless the app or CI depends on them, but their use should be explainable, reproducible enough for the task, and tied to a concrete implementation or proof gap.
- Prefer proven tooling for specialized work instead of hand-rolling brittle substitutes: image comparison, OCR, accessibility checks, search indexing, large-table performance, data generation and workflow verification.
- Do not add tools only because they are interesting. A new dependency must close a concrete implementation/proof gap and have an owner surface or command that uses it.
- Docker Compose may be extended for services such as search, OCR/proof helpers or supporting infrastructure, but the app must remain reproducible with clear seed/rebuild commands.

## Codex Communication Rules

- Keep progress updates short and operational: current slice, important decision, real progress, blocker or validation result.
- Do not narrate every small command, intermediate observation or implementation detail unless it changes direction, exposes risk or proves an acceptance point.
- Surface decisions explicitly: what was chosen, why it matters, and what it changes for the app or implementation path.
- Prefer compact bullets for status. Save detail for final summaries, code references, blockers, tradeoffs and proof evidence.
- Avoid chatty filler. The user needs signal, not a stream of activity noise.

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
