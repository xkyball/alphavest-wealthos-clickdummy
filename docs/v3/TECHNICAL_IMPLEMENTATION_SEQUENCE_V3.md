# Technical Implementation Sequence V3

## Strategic order

Do not begin with real authentication or production security. The correct order is:

```text
Repository setup
→ Next/Tailwind foundation
→ Docker/Postgres/Prisma
→ data model + seed data
→ design system + app shell
→ demo session role/tenant switchers
→ route skeletons
→ shared UI components
→ page groups
→ workflow logic
→ tests
→ security activation
→ hardening
```

## Phase overview

| Phase | Name | Goal |
|---:|---|---|
| 00 | Repository and project setup | Prepare the linked repo and development baseline. |
| 01 | Next/Tailwind foundation | Create the app shell and AlphaVest design tokens. |
| 02 | Docker/Postgres/Prisma | Create local database and ORM foundation. |
| 03 | Data model and seeds | Implement schema and demo data. |
| 04 | Demo session and domain service stubs | Role/tenant switching without real auth. |
| 05 | All route skeletons | Create all 63 routes and placeholder pages. |
| 06 | Shared UI library | Build reusable design-system components. |
| 07 | Auth and onboarding UI | Pages 001–006 without real auth dependency. |
| 08 | Admin/platform/tenant setup | Pages 007–018. |
| 09 | Client/profile/entity/document intake | Pages 019–030. |
| 10 | Wealth map and action board | Pages 031–032. |
| 11 | Internal workflows and compliance | Pages 033–040. |
| 12 | Decisions, evidence and governance | Pages 041–050. |
| 13 | Communication, export, ops, reference | Pages 051–063. |
| 14 | Workflow lifecycle integration | Connect data transitions and gates. |
| 15 | Testing baseline | Unit, smoke and E2E core flows. |
| 16 | Role-aware permissions and tenant isolation | Activate demo security gradually. |
| 17 | API/data quality and validation | Repository layer, service layer and validation. |
| 18 | File/export realism | Mock-to-real progression for files and exports. |
| 19 | Hardening and handoff | Accessibility, QA, docs, final report. |

## Security deferral rule

Security must be architecturally present early but not block development:

- implement `permissionEngine.can()` early,
- implement `currentActor()` and `currentTenant()` early,
- implement Role Switcher and Tenant Switcher early,
- initially return permissive/demo results,
- turn on role-aware and tenant-scoped behavior in later phases.

## Dummy-data-first rule

Every page must have meaningful demo data from seed scripts. Do not build blank pages that require manual data entry to become useful.
