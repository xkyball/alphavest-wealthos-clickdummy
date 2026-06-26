# ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


**Generated:** 2026-06-20
**Mode:** Journey-first prioritization and first product build path. No implementation, no code change, no Codex tickets.
**Target repository:** `https://github.com/xkyball/alphavest-wealthos-clickdummy`
**Target branch:** `full-workflow`

---

## 1. Executive Decision

**Decision:** `MEGA_JOURNEY_PRIORITY_LOCK_ACCEPTED_WITH_MVP_PORTFOLIO_AND_BUILD_PATH`

AlphaVest should now be advanced **journey-first**, not screen-first and not by trying to flatten all 144 use cases into one undifferentiated backlog. The first product build path should prove a compact portfolio of critical mega-journeys that together demonstrate the product core: providerless but real user/tenant/role mapping, evidence-backed work, internal-only AI/rules drafting, human review, advisor approval, compliance release, fail-closed client visibility, non-bypassable governance, auditability and export redaction.

**Auth correction locked:** `Providerless Auth Stub` remains allowed, and the login/provider layer may technically return true. That does **not** mean anonymous demo mode. Real mapped users, tenant membership, roles, permissions, object scopes, payload visibility and admin processes are product scope and must be treated as first-path foundations.

| Question | Decision |
|---|---|
| MVP Core Mega-Journeys | `MJ-001`, `MJ-002`, `MJ-003`, `MJ-005`, `MJ-006`, `MJ-010` |
| MVP Support / Parallel Hardening | `MJ-012`; `MJ-011` after core user/object scope is stable |
| P1 Journeys | `MJ-008`, `MJ-009`, `MJ-011` if external advisor access is not needed for first proof |
| Hold / P2 / Future Candidates | `MJ-004`, `MJ-007` because they depend on held routes and unresolved KYC/suitability/committee scope |
| First Product Build Path | Start with `MJ-001` as the umbrella, but implement it through smaller proof slices from `MJ-002`, `MJ-003`, `MJ-010`, `MJ-006` and `MJ-005`. |
| Decisive Product Proof | A real mapped user in a tenant can move an evidence-backed internal draft through analyst review, advisor approval and compliance release into a client-safe released view, while admin/cross-tenant/export/advice-boundary bypasses fail and audit proof exists. |
| Codex Implementation Authorized? | **No.** This artefact locks priority and build path only. Codex needs a later requirements/backlog/handoff artefact. |

---

## 2. Source-of-Truth & Correction Log

| Rank | Source | Inspected? | Use | Limits | Decision Impact |
|---:|---|---|---|---|---|
| 1 | `ALPHAVEST_COMPLEX_USECASE_UNIVERSE_AND_TARGET_APP_THINKTHROUGH.md` | YES | Primary source for 144 use cases and 12 mega-journeys. | Contains a product rethink, not implementation authority. | Supplies mega-journey inventory and target product logic. |
| 2 | Live GitHub repo `xkyball/alphavest-wealthos-clickdummy`, branch `full-workflow` | YES | Current branch and top-level repo reality. | Direct live file traversal is limited; local repository checkout / pull of full-workflow used for deep checks. | Confirms `full-workflow` branch and core folders/files are target reality. |
| 3 | Local `local repository checkout / pull of target branch full-workflow` snapshot | YES | Deep route/API/schema/test inspection. | Snapshot must be refreshed before final implementation handoff. | Confirms 71 routes, 4 APIs, 42 models, 22 enums and 10 test specs in local source set. |
| 4 | Prior AlphaVest roadmap/safety/scope artefacts | YES | Route scope, safety gates, visual gaps and P0 proof discipline. | Do not override corrected auth decision or current repo reality. | Preserves no-overclaim, fail-closed and non-bypass rules. |
| 5 | `README.md` in repo | YES | Historical repo status and stack context. | Legacy exclusion sentence not accepted as target product rule. | Treated as status-only where contradicted by user correction. |
| 6 | `main` branch | NO as target | False-gap/legacy warning only. | Never target truth. | Prevents old false absence claims from driving priority. |

| Legacy Claim / Earlier Assumption | New Decision | Impact |
|---|---|---|
| README excluded real auth/user/provider etc. | `LEGACY_README_STATUS`; not target product rule. | Providerless auth may stay, but real user/tenant/role/admin logic becomes first-path product scope. |
| Providerless auth means anonymous demo session | Rejected. | Provider may always return true, but mapped user, tenant, role, object scope and payload visibility must become real product semantics. |
| Existing route/API/schema/test presence proves journey completeness | Rejected. | Presence is evidence only; lifecycle, permission, payload, audit and P0 proof remain required. |

---

## 3. Mega Journey Inventory

| Journey ID | Name | Original Scope Signal | Primary Actors | Core Trigger | Core Outcome | Current Reality Label | Safety Critical? | Main Route/API/Schema Touchpoints |
|---|---|---|---|---|---|---|---|---|
| MJ-001 | New Family Office onboarding to first client-safe decision | MVP Core candidate | Principal, Family CFO, Admin, Analyst, Advisor, Compliance | New tenant created | First released client-safe decision after providerless user mapping, evidence, advisor approval and compliance release | PARTIALLY_IMPLEMENTED | YES | Routes 001-020, 027-045; APIs deleted generic workflow route, /api/documents; Models ClientTenant, User, Role, Document, Recommendation, Decision |
| MJ-002 | Evidence missing to client upload to release | MVP Core candidate | Client, Analyst, Advisor, Compliance | Compliance blocks due missing evidence | Client evidence request, upload, verification and release-safe summary | PARTIALLY_IMPLEMENTED / STRONG_UPLOAD_SLICE | YES | Routes 027-030, 038-041, 019; APIs /api/documents/upload, /api/documents; Models Document, EvidenceRecord, ComplianceReview |
| MJ-003 | AI draft rejected and rebuilt with evidence | MVP Core candidate | System/AI, Analyst, Advisor | Low-confidence or unsupported internal draft | AI/rules draft remains internal, is rejected/rebuilt with evidence, then advisor-reviewed | PRODUCT_LOGIC_INFERRED / PARTIALLY_IMPLEMENTED | YES | Routes 033-037; API deleted generic workflow route; Models Trigger, Recommendation, DocumentExtraction |
| MJ-004 | High-risk recommendation to committee and dissent | Hold / P2 candidate | Advisor, Committee, Compliance | High-risk recommendation requires committee | Committee vote/dissent and evidence request before compliance action | HOLD_PENDING_DECISION | YES | Routes 036-040, 070-071; API deleted generic workflow route; Models Recommendation, Approval, ComplianceReview |
| MJ-005 | Export package with forbidden internal payload redaction | MVP Core late-stage candidate | Advisor, Compliance, Client | Client-safe package requested | Scoped, redacted, approved export package without internal leakage | PARTIALLY_IMPLEMENTED / SERVICE_PROOF_SLICE | YES | Routes 054-058; API deleted generic workflow route; Models ExportRequest, Decision, EvidenceRecord |
| MJ-006 | Cross-tenant access denied with audit proof | MVP Safety Spine | External Advisor, Security Admin | User tries unrelated tenant/object | Denied scoped access, audit event, no payload leak | PARTIALLY_IMPLEMENTED / STRONG_NEGATIVE_SLICE | YES | Routes 001, 018, 048-051; API deleted generic workflow route; Models UserRole, AccessRequest, AuditEvent |
| MJ-007 | Source-of-wealth concern blocks suitability recommendation | Hold / P2 candidate | Analyst, Compliance, Client | SoW/KYC risk appears | Suitability recommendation blocked until evidence/compliance conditions pass | HOLD_PENDING_DECISION | YES | Routes 064-067, 038-041; APIs deleted generic workflow route, /api/documents/upload; Models Document, ComplianceReview, Recommendation |
| MJ-008 | Rebalance monitoring produces internal review not automatic advice | P1 candidate | System, Analyst, Advisor | Monitoring signal due | Internal review trigger, no automatic client advice | PARTIALLY_IMPLEMENTED / P1_SCOPE | YES | Routes 068-069, 033-037; API /api/review-monitoring; Models ReviewSchedule, Trigger, Recommendation |
| MJ-009 | Client mobile request creates evidence-backed advisor workflow | P1 candidate | Client, Analyst, Advisor | Client asks via mobile | Client request creates internal evidence-backed workflow; released response only if advice passes gates | PARTIALLY_IMPLEMENTED / P1_COMMUNICATION_LAYER | YES | Routes 020, 027-030, 052; APIs /api/documents, deleted generic workflow route; Models Message, Document, Recommendation |
| MJ-010 | Admin role change cannot bypass compliance release | MVP Governance Spine | Admin, Compliance, Security | Admin grants broad role or modifies permissions | Role update may pass governance, but release remains denied without compliance gate | PARTIALLY_IMPLEMENTED / STRONG_RBAC_SLICE | YES | Routes 009, 010, 048-051, 040; API deleted generic workflow route; Models Role, Permission, UserRole, AuditEvent |
| MJ-011 | External advisor receives scoped document access only | MVP Support / P1 candidate | External Advisor, Client, Analyst | Guest needs one document | Providerless identity maps to user and object scope; no tenant-wide visibility | PARTIALLY_IMPLEMENTED / NEEDS_REAL_AUTH_MAPPING | YES | Routes 003, 018, 027, 028; API /api/documents; Models User, UserRole, Document |
| MJ-012 | Data-quality issue blocks release until resolved | MVP Support / Parallel candidate | Analyst, Ops, Advisor, Compliance | High severity data issue detected | Readiness blocked until issue resolved and audited | PARTIALLY_IMPLEMENTED / SERVICE_PROOF_SLICE | YES | Routes 034, 059, 060, 038-040; API deleted generic workflow route; Models DataQualityIssue, ComplianceReview, AuditEvent |

---

## 4. Journey Scoring Matrix

Scoring uses 0–5 per criterion with weights: Product Proof 5, Client Value 4, Trust/Safety 5, Implementation Leverage 4, Dependency Unblock 4, Narrative 3, Risk Reduction 5, Auth/User/Tenant Fit 4, Manageability 3, Future Value 3. Weighted max is 200. Final ranking then applies portfolio logic and hold/P1 penalties.

| Journey ID | Product Proof | Client Value | Trust/Safety | Implementation Leverage | Dependency Unblock | Narrative Power | Risk Reduction | Auth/User/Tenant Fit | Manageability | Future Value | Weighted Score | Notes |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| MJ-001 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | 5 | 3 | 5 | 180 | Highest foundation value but too broad to implement as one lump; use as umbrella path. |
| MJ-002 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 4 | 4 | 186 | Best pure MVP proof slice for evidence-to-release and client value. |
| MJ-003 | 5 | 3 | 5 | 4 | 4 | 4 | 5 | 2 | 4 | 5 | 166 | Critical to AI-internal-only and human review, but weaker auth/client value by itself. |
| MJ-004 | 4 | 3 | 5 | 2 | 3 | 5 | 5 | 2 | 2 | 5 | 146 | Powerful but held by committee routes 070-071 and unresolved governance depth. |
| MJ-005 | 5 | 4 | 5 | 4 | 4 | 4 | 5 | 2 | 4 | 4 | 167 | Export/redaction is essential trust proof; build late after release/evidence semantics exist. |
| MJ-006 | 4 | 2 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 4 | 177 | Strong negative safety proof; must be in MVP safety spine. |
| MJ-007 | 4 | 3 | 5 | 2 | 3 | 4 | 5 | 2 | 2 | 5 | 143 | Important future/P2 but held by KYC/SoW/suitability routes 064-067. |
| MJ-008 | 4 | 2 | 4 | 4 | 3 | 4 | 4 | 2 | 4 | 5 | 143 | Useful P1 review rhythm; must not imply automatic advice. |
| MJ-009 | 4 | 5 | 4 | 3 | 3 | 5 | 4 | 3 | 3 | 5 | 155 | Client value strong, but communication/mobile service layer is P1 after core release path. |
| MJ-010 | 5 | 2 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 179 | Essential admin non-bypass and role governance proof. |
| MJ-011 | 3 | 3 | 5 | 4 | 4 | 3 | 5 | 5 | 3 | 4 | 159 | Useful external collaboration; defer until internal identity/object scope is proven. |
| MJ-012 | 4 | 2 | 5 | 4 | 4 | 3 | 5 | 2 | 4 | 4 | 151 | Good parallel hardening; not first narrative unless data quality blocks are selected as MVP acceptance layer. |

| Journey ID | Raw Rank | Portfolio Adjustment | Final Rank | Reason |
|---|---:|---|---:|---|
| MJ-001 | 2 | Promoted to #1 despite MJ-002 raw lead because providerless user/tenant/role foundation must precede evidence/release proof. | 1 | Highest foundation value but too broad to implement as one lump; use as umbrella path. |
| MJ-002 | 1 | Kept as #2: best evidence/client/release slice, but depends on real user and tenant context. | 2 | Best pure MVP proof slice for evidence-to-release and client value. |
| MJ-003 | 6 | Promoted before export because no-unapproved-advice and AI internal-only are core product proof. | 3 | Critical to AI-internal-only and human review, but weaker auth/client value by itself. |
| MJ-010 | 3 | Promoted because admin non-bypass is a hard trust proof and directly tests real role mapping. | 4 | Essential admin non-bypass and role governance proof. |
| MJ-006 | 4 | Kept top safety spine; implemented after user/tenant/object scope semantics begin. | 5 | Strong negative safety proof; must be in MVP safety spine. |
| MJ-005 | 5 | Kept MVP late-stage because export/redaction is a core trust gate after release path. | 6 | Export/redaction is essential trust proof; build late after release/evidence semantics exist. |
| MJ-012 | 9 | Parallel support: high value, but first path should not start with ops/data-quality unless it blocks release acceptance. | 7 | Good parallel hardening; not first narrative unless data quality blocks are selected as MVP acceptance layer. |
| MJ-011 | 7 | Deferred to MVP support/P1 because external guest access compounds object-scope risk. | 8 | Useful external collaboration; defer until internal identity/object scope is proven. |
| MJ-009 | 8 | P1: client mobile/service layer after core evidence/release path; do not pull communication too early. | 9 | Client value strong, but communication/mobile service layer is P1 after core release path. |
| MJ-008 | 12 | P1: review monitoring is valuable but not first product proof and must not execute advice. | 10 | Useful P1 review rhythm; must not imply automatic advice. |
| MJ-004 | 10 | Penalized heavily due hold routes 070-071 and committee scope uncertainty. | 11 | Powerful but held by committee routes 070-071 and unresolved governance depth. |
| MJ-007 | 11 | Penalized due KYC/SoW/suitability hold routes and advice-risk depth. | 12 | Important future/P2 but held by KYC/SoW/suitability routes 064-067. |

---

## 5. Priority Decision Stack

| Priority Bucket | Journey IDs | Why | Build Timing |
|---|---|---|---|
| MVP Proof Spine | `MJ-001`, `MJ-002`, `MJ-003` | Proves the AlphaVest core from real user/tenant context through evidence, internal draft, human review, advisor approval and compliance release. | First |
| MVP Safety Spine | `MJ-006`, `MJ-010` | Proves cross-tenant denial, object scope, admin non-bypass, role governance and audit. | First / Parallel |
| MVP Client Value Spine | `MJ-002`, `MJ-001` | Shows client-facing value through evidence request/upload and released client-safe decision visibility. | First / Parallel |
| MVP Governance / Trust Spine | `MJ-005`, `MJ-010`, `MJ-006` | Export redaction, audit, role changes and no-leakage define trustworthiness. | Late First Path / Parallel |
| MVP Support / Parallel Hardening | `MJ-012`, possibly `MJ-011` | Data-quality blocks and guest scope are valuable, but should not destabilize first release path. | After first spine is stable |
| P1 Expansion | `MJ-008`, `MJ-009`, `MJ-011` | Review rhythm, mobile request and external advisor collaboration deepen product value after core safety proof. | After MVP proof |
| Hold Pending Decision | `MJ-004`, `MJ-007` | Committee, KYC/SoW, suitability and IPS depend on hold routes and heavier compliance/suitability decisions. | Blocked until unlocked |
| Future Platform | conditional extension of `MJ-004`, `MJ-007`, `MJ-008`, `MJ-011` | Future WealthOS platform extends into committee governance, KYC/suitability, external network and integrations. | Later |

---

## 6. Recommended MVP Journey Portfolio

### MVP-JP-01 — New Family Office onboarding to first client-safe decision

| Field | Value |
|---|---|
| Journey ID | MJ-001 |
| Priority | 1 |
| Why this is MVP | Umbrella journey that forces providerless-auth-with-real-user mapping, tenant setup, role assignment and first released decision. |
| Product Proof | End-to-end product spine: tenant → user → evidence → internal draft → approval → release → client-safe portal. |
| Client Value Proof | Client sees only released safe content; not internal draft or compliance notes. |
| Safety Proof | Real tenant/user/role admin, compliance release and fail-closed client visibility in one path. |
| Auth/User/Tenant Implication | Creates mapped user, role and tenant context before every other journey. |
| Evidence/Audit/Visibility Implication | Evidence intake, audit events, release-to-visibility boundary. |
| Routes | 001-020, 027-045 |
| APIs | deleted generic workflow route, /api/documents |
| Schema / Models | ClientTenant, User, Role, UserRole, Document, Recommendation, Approval, ComplianceReview, Decision, AuditEvent |
| Existing Test Slices | route-smoke, permission-engine, workflow-gate, typed-workflow-api, document-upload tests as slices |
| Missing Tests | real session/current-user mapping; route guard negatives; release happy path; client no-leakage; admin non-bypass within umbrella |
| Current Gaps | Do not implement all tenant/client/admin features at once; define the minimum proof path. |
| Must Not Overbuild | Do not implement all tenant/client/admin features at once; define the minimum proof path. |
| Acceptance Direction | One deterministic tenant with mapped roles can complete a safe release and see client-safe output only. |

### MVP-JP-02 — Evidence missing to client upload to release

| Field | Value |
|---|---|
| Journey ID | MJ-002 |
| Priority | 2 |
| Why this is MVP | Best first client-value slice and the strongest path from existing upload mechanics to product trust. |
| Product Proof | Proves upload is not sufficiency and evidence must be reviewed/linked before release. |
| Client Value Proof | Client sees evidence request, upload progress/result and later released summary only. |
| Safety Proof | Evidence insufficiency blocks release; upload success alone does not unlock anything. |
| Auth/User/Tenant Implication | User/tenant/object scope determines who may upload and view documents. |
| Evidence/Audit/Visibility Implication | Evidence review, audit of upload/review/request/release, visibility after release. |
| Routes | 027-030, 038-041, 019 |
| APIs | /api/documents/upload, /api/documents, deleted generic workflow route |
| Schema / Models | Document, DocumentVersion, DocumentExtraction, DocumentReview, DocumentLink, EvidenceRecord, EvidenceItem, ComplianceReview, AuditEvent |
| Existing Test Slices | document-upload-api, document-upload-flow, permission-engine, workflow-gate |
| Missing Tests | invalid file UI negatives; denied-role UI; evidence insufficiency; release blocked until accepted evidence; audit failure fail-closed |
| Current Gaps | Do not equate successful file upload with document verification or release readiness. |
| Must Not Overbuild | Do not equate successful file upload with document verification or release readiness. |
| Acceptance Direction | A missing-evidence compliance block can be resolved only after scoped upload, review and evidence sufficiency acceptance. |

### MVP-JP-03 — AI draft rejected and rebuilt with evidence

| Field | Value |
|---|---|
| Journey ID | MJ-003 |
| Priority | 3 |
| Why this is MVP | AI governance is differentiating, but must be safe and internal-only from day one. |
| Product Proof | Proves AlphaVest uses AI/rules as internal support, not autonomous advice. |
| Client Value Proof | Client value is indirect: safer, evidence-backed final output. |
| Safety Proof | AI draft never reaches client; unsupported claims are rejected and rebuilt with evidence. |
| Auth/User/Tenant Implication | Mapped analyst/advisor roles determine who can view/reject/rebuild drafts. |
| Evidence/Audit/Visibility Implication | AI draft rejection/rebuild must be auditable and linked to evidence/source material. |
| Routes | 033-037 |
| APIs | deleted generic workflow route; future candidate internal draft API only after requirements lock |
| Schema / Models | Trigger, Recommendation, RecommendationOption, DocumentExtraction, EvidenceRecord, AuditEvent |
| Existing Test Slices | typed-workflow-api, workflow-gate as partial slices |
| Missing Tests | AI draft redaction; unsupported-claim negative; advisor approval not release; client payload never includes internal draft |
| Current Gaps | Do not build production AI model integration; use internal draft state and source/evidence trace semantics first. |
| Must Not Overbuild | Do not build production AI model integration; use internal draft state and source/evidence trace semantics first. |
| Acceptance Direction | Unsupported AI/rules output can be rejected, rebuilt and reviewed without client exposure. |

### MVP-JP-04 — Admin role change cannot bypass compliance release

| Field | Value |
|---|---|
| Journey ID | MJ-010 |
| Priority | 4 |
| Why this is MVP | Real user/role admin is now product scope; this journey proves admin power is not a safety bypass. |
| Product Proof | Proves governance integrity: admin can configure access, not force advice release. |
| Client Value Proof | Client is protected from admin-driven unsafe visibility. |
| Safety Proof | Admin non-bypass, second confirmation, role assignment audit and release denial. |
| Auth/User/Tenant Implication | Core proof that providerless auth still has real user/tenant/role semantics. |
| Evidence/Audit/Visibility Implication | Role change and denied release attempt must be audited. |
| Routes | 009, 010, 048-051, 040 |
| APIs | deleted generic workflow route; future governance APIs after requirements lock |
| Schema / Models | Role, Permission, UserRole, RolePermission, AccessRequest, SecondConfirmation, AuditEvent, ComplianceReview |
| Existing Test Slices | permission-engine, typed-workflow-api as partial slices |
| Missing Tests | role assignment positive; self-approval negative; admin release bypass negative; stale/cached privilege negative |
| Current Gaps | Do not let admin UI imply unrestricted payload visibility. |
| Must Not Overbuild | Do not let admin UI imply unrestricted payload visibility. |
| Acceptance Direction | A privileged role change may succeed, but release remains blocked without advisor/compliance/evidence gates. |

### MVP-JP-05 — Cross-tenant access denied with audit proof

| Field | Value |
|---|---|
| Journey ID | MJ-006 |
| Priority | 5 |
| Why this is MVP | A WealthOS cannot be trusted if tenant/object leakage is possible. This is the cleanest negative proof. |
| Product Proof | Proves the isolation layer underlying every client/advisor/compliance journey. |
| Client Value Proof | Client value is trust: no unrelated data exposure. |
| Safety Proof | Cross-tenant/object access denied, safe feedback returned, audit event written, no payload leak. |
| Auth/User/Tenant Implication | User/tenant/object scope is required after providerless login. |
| Evidence/Audit/Visibility Implication | Denied access and no-payload-leak event must be auditable. |
| Routes | 001, 018, 048-051 |
| APIs | deleted generic workflow route; future current-user/access APIs after requirements lock |
| Schema / Models | User, UserRole, AccessRequest, AuditEvent, RolePermission |
| Existing Test Slices | permission-engine strong slice; route-smoke shell only |
| Missing Tests | route-shell denial; API payload no-leak; export/document/decision object-scope negatives |
| Current Gaps | Do not confuse route 200 smoke with authorized route access. |
| Must Not Overbuild | Do not confuse route 200 smoke with authorized route access. |
| Acceptance Direction | Unscoped or wrong-tenant actor receives safe denial and no sensitive payload. |

### MVP-JP-06 — Export package with forbidden internal payload redaction

| Field | Value |
|---|---|
| Journey ID | MJ-005 |
| Priority | 6 |
| Why this is MVP | Export is not the first click, but it is a core trust/output proof once release/evidence semantics exist. |
| Product Proof | Proves AlphaVest can package client-safe evidence/decision output without leaking internal content. |
| Client Value Proof | Client/advisor receives a scoped, redacted package only after approval. |
| Safety Proof | Export preview is not approval; approval is not download/share; internal payload is forbidden. |
| Auth/User/Tenant Implication | Export actor must be mapped and authorized by tenant/object/release state. |
| Evidence/Audit/Visibility Implication | Export scope, redaction, approval and download/share must be audited. |
| Routes | 054-058 |
| APIs | deleted generic workflow route; future export API contracts after requirements lock |
| Schema / Models | ExportRequest, Decision, EvidenceRecord, Document, AuditEvent |
| Existing Test Slices | file-export-realism service slice; permission-engine partial |
| Missing Tests | forbidden internal payload; no approval no download; redaction missing; audit failure blocks; client-safe manifest positive |
| Current Gaps | Do not build real binary/object storage first; metadata-only/package manifest can prove safety semantics. |
| Must Not Overbuild | Do not build real binary/object storage first; metadata-only/package manifest can prove safety semantics. |
| Acceptance Direction | Released decision/evidence can become a redacted export package without AI draft, internal rationale or compliance notes. |

---

## 7. Deprioritized / Deferred Journey Rationale

| Journey ID | Proposed Bucket | Why not first? | What would unlock it? | Risk if pulled forward too early |
|---|---|---|---|---|
| MJ-004 | HOLD / P2 | Depends on committee routes 070-071 and governance depth not needed for first proof. | Unlock committee route visual/state/safety scope, quorum/vote/dissent model, tests. | Creates heavy governance before basic release, evidence and role semantics are stable. |
| MJ-007 | HOLD / P2 | KYC/SoW/suitability routes 064-067 are held and advice-risk is high. | Separate KYC/suitability policy lock and evidence/suitability acceptance model. | May imply regulated suitability/advice logic before core advice boundary is proven. |
| MJ-008 | P1 | Review monitoring is valuable but not a first client-safe decision proof. | Core workflow and no-auto-advice tests completed; review cadence model accepted. | Could be mistaken as automatic rebalance advice/execution. |
| MJ-009 | P1 | Mobile request and communication layer are client-value multipliers, not first gate proof. | Client visibility, evidence request, advisor/compliance release and message visibility are stable. | Client communication may leak internal/advisory content too early. |
| MJ-011 | MVP_SUPPORT / P1 | External advisor scope is important but increases access complexity. | Real user mapping, object scope and guest denial matrix complete. | Guest access may accidentally become tenant-wide or bypass client/internal separation. |
| MJ-012 | MVP_SUPPORT / Parallel | Data quality is important but should first be attached to release blockers, not become primary narrative. | Core release path has data-quality block/unblock acceptance. | Product path could become ops-first and obscure core client/evidence/advice value. |

---

## 8. First Real Product Build Path

| Build Step | Journey Dependency | Product Capability | Why First | Required Reality | Acceptance Signal | Codex Later? |
|---:|---|---|---|---|---|---|
| 1 | MJ-001, MJ-010, MJ-006 | Providerless Auth Stub with real user / tenant / role mapping | Every journey depends on a real actor context; providerless cannot mean anonymous. | Current provider/session can remain stubbed, but current-user, tenant membership, role assignment and object scope must resolve from persisted/demo-seeded users. | A selected/mapped user has deterministic tenant, role, object scope and payload visibility; unknown user fails closed. | Yes, after requirements matrix. |
| 2 | MJ-001, MJ-010 | Tenant/user/role administration baseline | Admin/user management is now product scope and must support real authorization. | Tenant create/setup, user invite/assignment, role templates and second confirmation semantics mapped. | Admin can manage users/roles, but cannot grant release bypass or expand client payload visibility. | Yes. |
| 3 | MJ-002 | Evidence missing → client upload → verification path | This is the best client-value and evidence-control slice. | Upload mechanics, document listing, extraction/review and evidence link semantics must align. | Upload success is upload-only; release remains blocked until evidence review/sufficiency. | Yes. |
| 4 | MJ-003 | Internal draft / analyst review path | Proves AI/rules support without unapproved client advice. | Draft status, internal notes, unsupported-claim rejection and evidence linkage. | AI/rules draft never appears in client payload; unsupported claim can be rejected and rebuilt. | Yes. |
| 5 | MJ-001, MJ-003 | Advisor approval path | Human-reviewed promise depends on distinct advisor approval. | Advisor approval separate from compliance; can reject/request evidence. | Advisor approval succeeds without client visibility; release still pending compliance. | Yes. |
| 6 | MJ-001, MJ-002 | Compliance block/release path | Compliance release is the client-visibility control point. | Compliance review/block/request evidence/release states; release confirmation; audit. | Compliance can block or release; cannot skip advisor/evidence preconditions. | Yes. |
| 7 | MJ-001, MJ-006 | Client visibility fail-closed path | Client-facing value must be safe by default. | Portal/mobile projections derived from release/redaction rules. | Unreleased or internal content is hidden/redacted; client sees only released safe summary. | Yes. |
| 8 | MJ-001, MJ-010, MJ-006, MJ-002 | Decision record and audit trail path | Trust requires traceability through every gate. | AuditEvent coverage and decision record semantics for upload, review, approve, release, deny, export. | Critical actions write audit; if audit cannot persist, safety action is blocked or held. | Yes. |
| 9 | MJ-005 | Export/redaction path | Export is core trust/output proof, but comes after release semantics. | Metadata-only package or scoped export manifest first; no real object storage required yet. | Forbidden internal payload absent; preview/approval/download/share separated; audit written. | Yes, late first path. |
| 10 | All MVP portfolio journeys | P0 positive/negative proof path | No product claim should enter implementation without positive and negative acceptance. | Route/API/schema/test mapping from prior matrices. | P0 tests prove happy path plus no-leakage, non-bypass, evidence insufficiency, audit and export redaction negatives. | Yes, required. |

---

## 9. Journey Dependency Graph

| Dependency | Required Before | Why | Blocking Level |
|---|---|---|---|
| Providerless Auth Stub → Real User Mapping | all route/action/payload decisions | A provider returning true only proves entry; the app still needs actor identity. | P0_BLOCKER |
| Real User Mapping → Role / Tenant / Object Scope | RBAC, documents, workflows, exports, admin actions | Tenant/object scope determines what user may see/do. | P0_BLOCKER |
| Role / Tenant / Object Scope → RBAC / Payload Visibility | client portal, exports, document lists, release views | Route access is not payload visibility. | P0_BLOCKER |
| Evidence Intake → Evidence Review → Evidence Sufficiency | advisor approval, compliance release, export | Upload/document existence is not enough. | P0_BLOCKER |
| Internal Draft → Analyst Review → Advisor Approval | compliance release | AI/rules output must remain internal and human-reviewed. | P0_BLOCKER |
| Advisor Approval → Compliance Release | client visibility | Advisor approval does not release content to client. | P0_BLOCKER |
| Compliance Release → Client Visibility | portal/mobile/export/client package | Client sees only released/redacted/scoped content. | P0_BLOCKER |
| Decision Record → Audit Trail → Export Safety | export and review rhythm | Trust relies on traceable decision/evidence/audit package. | P0/P1_BLOCKER |
| Core identity/object scope → External advisor access | MJ-011 | Guest access compounds tenant/object leakage risk. | P1_BLOCKER |
| Core release/advice boundary → Committee/KYC/Suitability | MJ-004, MJ-007 | High-risk and regulated-adjacent journeys require heavier policy locks. | HOLD_BLOCKER |

---

## 10. Route / Screen / API / Schema / Test Implications

### 10.1 Route Implications

| Route | Related MVP Journey | Required Product Role | Current Status | Gap |
|---|---|---|---|---|
| 001-006 access/onboarding | MJ-001, MJ-006, MJ-011 | Providerless login/onboarding resolves real mapped user/tenant/role. | MVP_SUPPORT; visual/shell present. | Need current-user/session mapping, expired/unknown/denied states and audit where relevant. |
| 007-018 admin/tenant/governance setup | MJ-001, MJ-010, MJ-006 | Tenant/user/role administration and non-bypass controls. | MVP_SUPPORT; partial interactions. | Need real CRUD semantics or deterministic MVP mutations, second confirmation, denial and audit proof. |
| 019-020 client portal/mobile | MJ-001, MJ-002, MJ-009 | Client-safe released projection. | MVP; partial/static. | Need fail-closed payload projection and no-leakage tests. |
| 027-030 documents/evidence | MJ-002, MJ-011 | Upload, list, review and evidence request path. | MVP; strongest upload interaction. | Need sufficiency lifecycle, invalid/retry/denied UI, object scope and audit failure handling. |
| 033-037 signals/workbench/advisor | MJ-001, MJ-003, MJ-008 | Internal-only draft and human review. | MVP; typed workflow partial. | Need internal draft state, advisor not release, AI redaction and evidence linkage. |
| 038-042 compliance/release/audit | MJ-001, MJ-002, MJ-003, MJ-010 | Compliance release/block/evidence request; audit log. | MVP; typed workflow partial. | Need gate separation, block/release confirmations, audit persistence and negative tests. |
| 043-045 decisions | MJ-001, MJ-005 | Decision record and submitted state. | MVP; partial/visual. | Need immutable decision semantics and client-safe projection after release. |
| 048-051 governance/access/audit | MJ-006, MJ-010 | Access requests, role governance, audit history. | MVP; visual/partial. | Need real user/role/object scope, non-bypass and denial-audit proof. |
| 054-058 export | MJ-005 | Redacted client-safe export package. | MVP; service proof slice. | Need route/API-facing export contract, forbidden payload negatives and audit. |
| 064-067,069-071 hold routes | MJ-004, MJ-007 | Committee/KYC/Suitability/Rebalance detail. | HOLD_PENDING_DECISION. | No MVP implementation until scope/safety/visual/test unlock. |

### 10.2 API Implications

| API | Related MVP Journey | Current Role | Needed Contract | Gap |
|---|---|---|---|---|
| deleted generic workflow route | MJ-001, MJ-003, MJ-005, MJ-006, MJ-010 | Demo action transport and proof slices. | Action-level authorization, current-user mapping, idempotency, safe errors, audit result, no client release unless gate passes. | Not production persistence proof. |
| /api/documents | MJ-002, MJ-011 | Document list/reload. | Tenant/user/object filtered list; client-safe document projection; raw internal fields hidden. | Need redaction and denied/empty/error tests. |
| /api/documents/upload | MJ-002, MJ-011 | Strong upload mechanics. | Current user/tenant/object scope, file validation, duplicate/malicious/oversize/unsupported negatives, audit failure fail-closed. | Upload still not evidence sufficiency. |
| /api/review-monitoring | MJ-008, MJ-012 | Review monitoring snapshot. | Internal-only monitoring; no auto advice; role-scoped output. | P1 unless elevated. |
| Candidate providerless auth/current-user APIs | MJ-001, MJ-006, MJ-010, MJ-011 | Not current API baseline. | Session/current user, switch/mapping, user admin and role assignment contracts. | Needed for real user mapping, but not yet a Codex task here. |

### 10.3 Schema / Model Implications

| Model / Concept | Related MVP Journey | Current Status | Needed Product Semantics | Gap |
|---|---|---|---|---|
| User, UserProfile | MJ-001, MJ-006, MJ-010, MJ-011 | Existing full-workflow models. | Mapped actor identity after providerless stub; status, service account and tenant scope respected. | Need current-user/session semantics and admin UI/API decisions. |
| Role, Permission, UserRole, RolePermission | MJ-001, MJ-006, MJ-010 | Existing models and permission engine proof slices. | Route/action/object/payload permissions must be separate and auditable. | Need full route/action matrix and negative tests. |
| AccessRequest, SecondConfirmation | MJ-010, MJ-006 | Existing models. | Sensitive changes require workflow, reason, confirmation, expiry, segregation and audit. | Need concrete MVP sensitive-action list. |
| Document, DocumentVersion, DocumentExtraction, DocumentReview, DocumentLink | MJ-002, MJ-011 | Existing models and upload service. | Upload, versioning, extraction/review, linking and client-safe projection. | Need sufficiency states and file/object storage decision later. |
| EvidenceRecord, EvidenceItem | MJ-002, MJ-005 | Existing evidence concepts. | Evidence must be reviewed, linked, relevant, scoped and accepted. | Need sufficiency lifecycle and release dependency. |
| Trigger, Recommendation, RecommendationOption | MJ-003, MJ-001, MJ-008 | Existing workflow/advice models. | Internal draft, options, assumptions and client-safe summary split. | Need AI/rules draft semantics and redaction proof. |
| Approval, ComplianceReview, Decision | MJ-001, MJ-002, MJ-003, MJ-004 | Existing approval/compliance/decision models. | Advisor approval, compliance release/block and decision record are distinct. | Need end-to-end state transitions and audit proof. |
| AuditEvent | all MVP safety journeys | Existing model/service. | Critical actions append audit; failure blocks or holds safety action. | Need audit failure simulations/acceptance. |
| ExportRequest | MJ-005 | Existing export model/service slices. | Scope/redaction/approval/download/share separation. | Need route/API acceptance and forbidden payload negatives. |
| DataQualityIssue | MJ-012 | Existing model/service slice. | High severity issue can block readiness/release. | Decide whether first-path or parallel acceptance layer. |

### 10.4 Test Implications

| P0 Test Area | Related MVP Journey | Existing Proof Slice | Missing Positive Test | Missing Negative Test |
|---|---|---|---|---|
| Providerless auth not anonymous demo | MJ-001, MJ-006, MJ-010 | No complete test; demo session only. | Mapped user resolves tenant/role/object scope. | Unknown/unmapped user denied; wrong tenant hidden. |
| Evidence upload not sufficiency | MJ-002 | document-upload-api and document-upload-flow. | Upload + review + link + accepted evidence can unlock next step. | Upload success alone cannot release/export/client visibility. |
| AI draft internal-only | MJ-003 | typed-workflow/workflow-gate partial. | Internal draft can be rebuilt with evidence and advisor-reviewed. | Client/API/export never includes AI draft/internal rationale. |
| Advisor approval not release | MJ-001, MJ-003 | workflow-gate partial. | Advisor approval progresses to compliance pending. | Client visibility remains hidden until compliance release. |
| Compliance release | MJ-001, MJ-002 | workflow-gate/typed-workflow partial. | Compliance release after preconditions makes client-safe view available. | Missing evidence/advisor approval blocks release. |
| Cross-tenant/object scope | MJ-006, MJ-011 | permission-engine strong slice. | Scoped user can access own object. | Wrong tenant/object sees safe denial and no payload. |
| Admin non-bypass | MJ-010 | permission-engine partial. | Admin role changes obey governance process. | Admin cannot force release, visibility, evidence sufficiency or export. |
| Audit persistence/fail-closed | all MVP safety journeys | permission/demo slices write some audit rows. | Critical actions write audit with actor/role/target/result. | If audit cannot persist, safety action does not complete silently. |
| Export redaction | MJ-005 | file-export-realism service slice. | Approved scoped export contains released/redacted content only. | No internal rationale, AI draft, compliance notes, hidden evidence or unapproved data. |
| Hold-route block | MJ-004, MJ-007 | route-smoke/committee partial. | Held routes stay non-MVP. | No hold route silently becomes MVP implementation scope. |

---

## 11. Journey-to-Safety Gate Matrix

| Safety Gate | MVP Journeys That Prove It | P1/Future Journeys Depending On It | Current Proof | Missing Proof | Acceptance Direction |
|---|---|---|---|---|---|
| Providerless Auth Stub not equal anonymous demo | MJ-001, MJ-006, MJ-010 | MJ-011, MJ-009 | Demo role/tenant switching and user models exist. | Persisted/current user mapping and denial behavior. | Provider may return true, but app resolves a real user, role, tenant and object scope or denies. |
| User/Tenant/Role mapping | MJ-001, MJ-010, MJ-006 | all P1/Future | User/Role/UserRole schema exists; permission slices exist. | End-to-end route/API/current-user mapping. | Mapped user actions and payloads match role/tenant/object scope. |
| Cross-tenant isolation | MJ-006 | MJ-011, MJ-009, integrations | Permission-engine proof slices. | Route/API/export/document no-leak tests. | Wrong tenant/object returns safe denial and audit, no sensitive payload. |
| Object scoped permissions | MJ-006, MJ-010, MJ-011 support | MJ-007, MJ-004 | UserRole objectType/objectId exists. | Complete object/action matrix. | Route access, action permission and payload visibility remain separate. |
| No unapproved advice | MJ-001, MJ-003, MJ-002 | MJ-004, MJ-007, MJ-008, MJ-009 | Workflow-gate/demo slices. | Client payload/export no-leakage test. | Internal drafts/recommendations hidden until advisor + compliance + evidence gates pass. |
| AI draft internal-only | MJ-003 | MJ-008, future AI/integrations | Product contract; partial typed workflow. | Concrete AI draft field/source/redaction semantics. | AI/rules content never appears in client/API/export payload. |
| Advisor approval not release | MJ-001, MJ-003 | MJ-004, MJ-007 | Workflow-gate slices. | End-to-end route/API/client proof. | Advisor approval moves to compliance pending, not client visible. |
| Compliance release | MJ-001, MJ-002 | MJ-004, MJ-007, MJ-009 | Compliance routes/models exist. | Release happy path and blocked negatives. | Only compliance release creates client-safe visibility. |
| Upload not sufficiency | MJ-002 | MJ-011, MJ-009 | Strong upload tests. | UI/API release/export negatives. | Upload success message states upload-only; gates remain locked. |
| Evidence sufficiency | MJ-002 | MJ-005, MJ-007 | Evidence models/services exist. | Review/link/relevance/scope/acceptance lifecycle. | Sufficiency is explicit and audited before release/export. |
| Client visibility fail-closed | MJ-001, MJ-002, MJ-006 | all client/P1 journeys | Visibility engine exists. | Payload-level no-leakage tests. | Unknown/unreleased/unsafe payload hidden/redacted/denied. |
| Admin non-bypass | MJ-010 | all governance/admin journeys | Permission proof slices. | Sensitive action matrix and second confirmation tests. | Admin can configure, not bypass gates. |
| Audit persistence | MJ-002, MJ-006, MJ-010, MJ-005 | all journeys | Audit model/service and selected audit rows. | Audit failure fail-closed and complete critical actions. | Critical action creates immutable/append-only audit event or action holds. |
| Export redaction | MJ-005 | MJ-009, MJ-011, integrations | file-export service proof slice. | Route/API export payload tests. | Export contains only released, redacted, scoped content after approval. |
| Review monitoring not advice execution | none first-path; P1 `MJ-008` | MJ-008 | review-monitoring service/test slice. | P1 route/API/client boundary. | Monitoring can create internal review, never automatic client advice. |
| Committee approval not client release | none first-path; held `MJ-004` | MJ-004 | Committee route/test partial. | Hold unlock and compliance dependency. | Committee action cannot release without compliance release. |
| Suitability/IPS gate deferred or held | none first-path; held `MJ-007` | MJ-007 | Workflow-gate conceptual slices. | KYC/suitability scope lock and tests. | No suitability-dependent advice until route/safety/scope unlock. |

---

## 12. Product Decision Register

| Decision ID | Decision | Status | Why | Affected Journeys | Downstream Impact |
|---|---|---|---|---|---|
| PD-001 | Providerless Auth Stub with real mapped users/tenants/roles is target scope. | LOCKED | User correction overrides legacy README exclusion. | MJ-001, MJ-006, MJ-010, MJ-011, all journeys | Next artefact must define session/current-user/user-admin requirements. |
| PD-002 | MVP proof spine is journey portfolio, not one mega-journey. | LOCKED | No single journey proves product, safety, client value, admin, evidence, audit and export. | MJ-001, MJ-002, MJ-003, MJ-005, MJ-006, MJ-010 | Requirements matrix must structure work by selected MVP portfolio. |
| PD-003 | Export remains in MVP late-stage, not P1 by default. | LOCKED_WITH_SEQUENCE | Export/redaction is core trust proof, but depends on release/evidence semantics. | MJ-005 | Build after client-safe release semantics, before final MVP acceptance. |
| PD-004 | Committee review remains hold/P2. | LOCKED_FOR_NOW | Routes 070-071 and committee behaviour require scope/safety unlock. | MJ-004 | Do not include committee in first product build path. |
| PD-005 | KYC/SoW/Suitability/IPS remain hold/P2. | LOCKED_FOR_NOW | Routes 064-067 and advice/suitability semantics are too high-risk for first path. | MJ-007 | Separate future KYC/Suitability artefact required. |
| PD-006 | Mobile/communication is P1 expansion. | LOCKED_FOR_NOW | Client communication value is strong but can leak internal/advice content if premature. | MJ-009 | First prove released client-safe projection; then add mobile/communication workflow. |
| PD-007 | Data quality is parallel MVP support, not primary first narrative. | LOCKED_FOR_NOW | DataQualityIssue can strengthen release blocking but should not obscure core journey proof. | MJ-012 | Map as acceptance layer in requirements matrix if needed. |
| PD-008 | External advisor access is P1 unless needed as object-scope proof. | OPEN_CONDITIONAL | Useful but increases guest/object-scope risk. | MJ-011 | Can be pulled into MVP support only after user/object scope requirements are stable. |

---

## 13. Product Gap Register From Journey Priority

| Gap ID | Gap Type | Description | Affected Journeys | Severity | First Build Path Impact | Suggested Direction |
|---|---|---|---|---|---|---|
| GAP-001 | Auth/User/Tenant Gap | Providerless auth exists as concept/demo context, but real current-user/session/user-admin requirements are not locked. | MJ-001, MJ-006, MJ-010, MJ-011 | P0 | Blocks every real route/action/payload decision. | Define providerless auth and user-admin requirements first. |
| GAP-002 | Role/RBAC Gap | Role and permission models/services exist, but route/action/payload matrix needs first-path requirements. | MJ-006, MJ-010, all MVP | P0 | Cannot safely implement client visibility or export. | Map roles, actions, objects and payload visibility in requirements matrix. |
| GAP-003 | Evidence Gap | Upload mechanics are strong, but evidence sufficiency lifecycle is not fully specified end-to-end. | MJ-002, MJ-005 | P0 | Release/export could overclaim evidence. | Define evidence review/link/relevance/scope/acceptance states. |
| GAP-004 | AI/Internal Draft Gap | AI/rules draft is product logic, but field/source/redaction semantics need lock. | MJ-003 | P0 | No-unapproved-advice proof incomplete. | Define internal draft model/fields/runtime projection before implementation. |
| GAP-005 | Compliance Release Gap | Advisor and compliance gates exist conceptually, but release happy path and blocked negatives need journey acceptance. | MJ-001, MJ-002, MJ-003 | P0 | Client visibility cannot be trusted. | Define release preconditions and feedback states. |
| GAP-006 | Client Visibility Gap | Client-safe payload projection needs concrete route/API/export requirements. | MJ-001, MJ-002, MJ-005, MJ-006 | P0 | Client portal/export cannot be declared safe. | Define payload allowlist/redaction/hidden states and tests. |
| GAP-007 | Audit Gap | Audit service/model exists, but failure semantics and complete critical action coverage are not locked. | MJ-002, MJ-006, MJ-010, MJ-005 | P0 | Safety actions may complete without proof. | Add audit persistence/fail-closed acceptance to requirements matrix. |
| GAP-008 | Export Gap | Export service proof slices exist, but route/API/client-safe export contract is not fully first-path requirements. | MJ-005 | P0 late | MVP trust output incomplete if omitted. | Keep export late in first path and define metadata-only package acceptance before object storage. |
| GAP-009 | Hold Route Gap | Committee/KYC/suitability routes are registered but held/missing visual references and scope. | MJ-004, MJ-007 | HOLD | Could pull unstable regulated/governance scope into MVP. | Defer to dedicated hold-unlock artefact. |
| GAP-010 | Test Gap | Existing 10 specs are proof slices, not full P0 journey acceptance. | all MVP journeys | P0 | No journey can be called done. | Next matrix must map positive and negative tests by MVP journey. |
| GAP-011 | State/Interaction Gap | Many UI states/overlays are visual/partial; lifecycle and feedback need journey contracts. | MJ-001, MJ-002, MJ-005, MJ-010 | P0/P1 | User actions may look complete without being real. | Translate selected journeys into state/interaction acceptance. |
| GAP-012 | Ops Gap | Data quality/review monitoring are valuable but sequence is unclear. | MJ-008, MJ-012 | Medium | Could distract from first proof. | Keep as support/P1 unless selected as release-blocking acceptance. |

---

## 14. Recommended Next Artefact

**Recommended next artefact:**

```text
ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md
```

Purpose: translate the selected MVP Journey Portfolio (`MJ-001`, `MJ-002`, `MJ-003`, `MJ-005`, `MJ-006`, `MJ-010`, plus selected support from `MJ-012`/`MJ-011`) into concrete product requirements, acceptance criteria, route/API/schema/test mappings and later Codex-capable work packages.

Do **not** proceed directly to final Codex handoff, screen generation or schema migration. The next step must convert journey priority into precise requirements and acceptance, especially around providerless auth with real mapped users, evidence sufficiency, no-unapproved-advice, compliance release, audit, client visibility and export redaction.

---

## 15. QA Matrix

| QA Check | Pass / Fail | Evidence / Reason |
|---|---|---|
| 12 Mega-Journeys aufgenommen | PASS | All MJ-001 through MJ-012 are included in inventory and scoring. |
| Auth-Korrektur berücksichtigt | PASS | Providerless Auth Stub with real user/tenant/role/object scope is locked as product scope. |
| Veraltete README-Ausschlüsse nicht als Zielregel verwendet | PASS | Legacy exclusion sentence is explicitly reclassified as `LEGACY_README_STATUS`. |
| `full-workflow` als Zielbasis verwendet | PASS | Live branch and local full-workflow snapshot used; `main` blocked. |
| `main` nicht als Target Truth verwendet | PASS | No target task or priority is derived from `main`. |
| Score + Portfolio-Logik angewendet | PASS | Weighted scoring plus portfolio adjustment/penalties applied. |
| MVP/P1/Future/Hold sauber getrennt | PASS | MVP core, MVP support, P1 and hold/P2 buckets are explicitly separated. |
| Erster Produktbaupfad abgeleitet | PASS | 10-step first product build path created. |
| Safety Gates gemappt | PASS | 17 safety gates mapped to MVP and P1/future dependencies. |
| Route/API/Schema/Test-Implikationen enthalten | PASS | Dedicated route, API, schema and P0 test implications included. |
| Keine Implementierung erzeugt | PASS | No code or file changes were made. |
| Keine Codex-Tickets erzeugt | PASS | Build path is product path, not Codex tasks. |
| Keine Screens/Bilder generiert | PASS | No generation authorized. |
| Keine unsupported claims | PASS | Journey reality labels and no-overclaim rules preserved; route/API/schema/test presence not treated as readiness. |

---

## Appendix — ENGINE Execution Proof

| Phase | Engine Combination | Applied Result |
|---|---|---|
| Charter | ENGINE_v3 | Converted uploaded prompt into one concrete artefact: `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`. |
| Source Intake | ENGINE_v3 Rebase | Used the complex use-case universe, live `full-workflow` repo view and local full-workflow snapshot; blocked `main`. |
| Correction Rebase | ENGINE_v3 Claim Control | Reclassified outdated README auth/client-data exclusion as legacy status; locked providerless-real-user auth target. |
| Scoring | ENGINE_v3 Decision Matrix | Scored all 12 journeys with weighted criteria. |
| Portfolio Convergence | ENGINE_v3 Portfolio + ENGINE_v2 Product Thinking | Selected a balanced MVP portfolio instead of a raw top-score list. |
| Product Build Path | ENGINE_v2-B | Derived a staged first product path from the selected journey portfolio without creating implementation tasks. |
| Safety Proof | ENGINE_v3 Proof | Mapped core safety gates and missing proof obligations. |
| QA | ENGINE_v3 | Completed QA matrix with pass/fail evidence and stop-rule compliance. |