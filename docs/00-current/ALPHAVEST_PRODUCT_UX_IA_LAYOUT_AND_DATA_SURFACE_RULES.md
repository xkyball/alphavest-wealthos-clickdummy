# AlphaVest Product UX, IA, Layout And Data Surface Rules

This file records product-level UX rules for the AlphaVest completion goal. It does not replace the True-UX handoff; it clarifies how production-ready IA, layout and data surfaces should be interpreted when tests or older proof contracts are too narrow.

## Core Rule

AlphaVest is a workflow-backed wealth operations product, not a collection of proof screens. Process Universe coverage remains the backbone, but the operational IA must be shaped around user workstreams, object state, queues, decisions and safe handoffs.

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

## Data Surface Rules

- Every substantial table or list-like dataset must support realistic volume.
- Required controls for data-heavy surfaces: search or query, filters, sorting, pagination or equivalent chunking, empty/error/loading states, row/detail access and clear row actions.
- Pagination is required when datasets can grow beyond a single useful viewport. Virtualization or lazy loading is acceptable where appropriate.
- Cards/lists may replace tables only when they still provide comparable finding, filtering, scanning and detail access.
- Dense layouts are allowed when users need to scan, compare or act on many records.

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
