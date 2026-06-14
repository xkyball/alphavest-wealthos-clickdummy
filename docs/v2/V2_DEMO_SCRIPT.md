# V2 Demo Script

Date: 2026-06-14

## Setup

Run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The root route redirects to `/presentation`.

## Demo Path

1. Start at `/presentation`.
   - Show the operating command center and shared runtime state.
   - Explain: digital first, human reviewed, evidence backed.

2. Open `/mobile`.
   - Show the mobile home and next step today.
   - Use `/mobile?state=blocked` to show that recommendations are blocked before compliance release.

3. Open `/mobile/upload`.
   - Show document type selection.
   - Use `/mobile/upload?state=extract` for extraction review.
   - Use `/mobile/upload?state=low` for low-confidence blocked.
   - Use `/mobile/upload?state=pending` for verification pending.

4. Open `/portal`.
   - Show the client dashboard, readiness score, actions, missing documents and governance status.
   - Click/readiness score path points to `/wealth-map?focus=gaps`.

5. Open `/wealth-map?focus=gaps`.
   - Show the structure graph and Trust X detail drawer.
   - Select restricted context to explain hidden sensitive fields.
   - Point out trustee/beneficiary escalation context.

6. Open `/actions`.
   - Show the kanban action board.
   - Select the blocked trust deed action and explain missing evidence.

7. Open `/decisions?state=blocked`.
   - Show the decision room blocked by permission/gate context.
   - Explain that no advice-like detail is visible until release gates pass.

8. Open `/workbench`.
   - Show the internal queue and publish disabled state.
   - Open evidence preview from context.

9. Open `/advisor-approval`.
   - Click or explain "Approve for compliance".
   - Highlight that advisor approval alone does not release client content.

10. Open `/compliance`.
    - Show release controls.
    - Demonstrate release or block/request evidence.
    - Explain compliance as the final client-visibility control.

11. Return to `/decisions`.
    - After release, submit Accept/Defer/Reject.
    - Show the evidence-created state and evidence preview overlay.

12. Open `/governance`.
    - Show role permission matrix.
    - Open role detail.
    - Trigger second confirmation with `/governance?surface=second-confirmation`.
    - Explain audit access history.

13. Open `/communication`.
    - Show decision tree and call trigger matrix.
    - Open `/communication?surface=client-preview`.
    - Explain gated send and communication evidence log.

14. Open `/service-blueprint`.
    - Show swimlanes, evidence chain and escalation/returns as internal reference.

15. Open `/roadmap`.
    - Show MVP, Phase 2, Future, blocked features and dependency flow.

## Core Talk Track

- Triggers are review points, not advice.
- Advisor approval alone is not enough.
- Compliance gate controls client visibility.
- Evidence is created by default.
- Sensitive actions create audit events.
- Visual boards are interpreted into app surfaces, logic, tests and documentation.

