"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getBoardRoute } from "@/lib/routes";
import {
  BottomWorkflowStrip,
  cn,
  DashboardTable,
  Drawer,
  GlassPanel,
  HumanReviewFlow,
  MetricCard,
  MiniWorldMap,
  PageHeader,
  RightAnnotationPanel,
  StatusChip,
  WireframePhone,
  WorkflowBadge
} from "./ui";

type ScreenRoute =
  | "/presentation"
  | "/mobile"
  | "/mobile/upload"
  | "/portal"
  | "/wealth-map"
  | "/actions"
  | "/signals"
  | "/decisions"
  | "/evidence";

const fullFlow = [
  "AI-DRAFT",
  "ANALYST",
  "ADVISOR",
  "COMPLIANCE",
  "CLIENT",
  "EVIDENCE",
  "REVIEW"
] as const;

const reviewSteps = fullFlow.map((badge, index) => ({
  badge,
  title:
    [
      "Draft prepared",
      "Context reviewed",
      "Advisor approved",
      "Boundary checked",
      "Client-visible",
      "Record linked",
      "Review scheduled"
    ][index] ?? badge,
  complete: index < 6
}));

function Phase3Board({
  route,
  children,
  side,
  footer
}: {
  route: ScreenRoute;
  children: ReactNode;
  side?: ReactNode;
  footer?: ReactNode;
}) {
  const board = getBoardRoute(route);

  if (!board) {
    return null;
  }

  return (
    <article className="relative overflow-hidden px-4 py-6 md:px-8">
      <div className="pointer-events-none absolute right-0 top-0 h-52 w-2/3 opacity-35">
        <div className="world-motif h-full w-full" />
      </div>
      <div className="relative mx-auto max-w-[104rem]">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-av-line pb-4">
          <div className="flex items-center gap-3 text-av-goldBright">
            <div className="grid size-10 place-items-center rounded-lg border border-av-gold text-xs font-semibold">
              AV
            </div>
            <p className="text-sm md:text-base">
              AlphaVest WealthOS — Wireframe System
            </p>
          </div>
          <p className="font-display text-5xl text-av-goldBright">
            {board.number}
          </p>
        </div>

        <PageHeader
          kicker={`Phase 3 client-facing screen / ${board.surface}`}
          title={`Board ${Number(board.number)} — ${board.title}`}
          subtitle={board.subtitle}
        />

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="grid gap-5">{children}</div>
          <aside className="grid content-start gap-5">
            {side ?? (
              <RightAnnotationPanel
                coreAction={board.annotations.coreAction}
                outcome={board.annotations.outcome}
                systemReaction={board.annotations.systemReaction}
                userRole={board.annotations.userRole}
              />
            )}
            <GlassPanel title="Safety Boundary">
              <div className="grid gap-3 text-sm text-av-muted">
                <p>Demo only. Not legal, tax, investment, insurance, residency or citizenship advice.</p>
                <p>No unapproved advice reaches the client.</p>
                <p>Digital first. Human reviewed. Evidence backed.</p>
                <p>Evidence replaces assumption.</p>
              </div>
            </GlassPanel>
          </aside>
        </div>

        <div className="mt-5">
          {footer ?? (
            <BottomWorkflowStrip
              badges={board.workflow}
              message="Secure by design. End-to-end encryption. Region-aware. Privacy by choice. Always auditable."
            />
          )}
        </div>
      </div>
    </article>
  );
}

function TinyPanel({
  title,
  children,
  className
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-av-line bg-av-midnight/45 p-3",
        className
      )}
    >
      <p className="font-display text-lg leading-tight text-av-goldBright">
        {title}
      </p>
      <div className="mt-2 text-sm text-av-muted">{children}</div>
    </div>
  );
}

function RowButton({
  children,
  onClick,
  href,
  active
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  active?: boolean;
}) {
  const classes = cn(
    "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition",
    active
      ? "border-av-gold bg-av-gold/15 text-av-ivory shadow-glow"
      : "border-av-line/60 bg-av-midnight/45 text-av-muted hover:border-av-gold hover:text-av-ivory"
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
        <span className="text-av-goldBright">→</span>
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type="button">
      {children}
      <span className="text-av-goldBright">›</span>
    </button>
  );
}

export function PresentationScreen() {
  const surfaces = [
    ["Mobile App", "Daily next steps, uploads, decisions and alerts.", "/mobile"],
    ["Client Web Portal", "Deeper visibility across structure, evidence and actions.", "/portal"],
    ["Consultant Workbench", "Internal review surface reserved for Phase 4.", "/workbench"],
    ["Compliance Console", "Release controls reserved for Phase 4.", "/compliance"]
  ];

  return (
    <Phase3Board route="/presentation">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <GlassPanel className="min-h-[28rem]" title="AlphaVest WealthOS">
          <div className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
            <WireframePhone>
              <p className="font-display text-2xl text-av-goldBright">
                Good morning,
                <br />
                Family Steward
              </p>
              <div className="mt-4 grid gap-2">
                <RowButton href="/mobile">Advisor-approved recommendation ready</RowButton>
                <RowButton href="/mobile/upload">Upload document</RowButton>
                <RowButton href="/portal">Open family dashboard</RowButton>
              </div>
            </WireframePhone>
            <div className="grid gap-4">
              <h2 className="font-display text-4xl text-av-ivory">
                Your global family wealth, visible and decision-ready.
              </h2>
              <p className="max-w-3xl text-av-muted">
                A secure command center that maps structure, identifies next
                steps, coordinates advisors and documents every major decision.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {surfaces.map(([title, detail, href]) => (
                  <Link
                    className="rounded-lg border border-av-line bg-av-panel/60 p-4 transition hover:border-av-gold hover:bg-av-gold/10"
                    href={href}
                    key={title}
                  >
                    <p className="font-display text-xl text-av-goldBright">
                      {title}
                    </p>
                    <p className="mt-2 text-sm text-av-muted">{detail}</p>
                  </Link>
                ))}
              </div>
              <Link
                className="inline-flex w-fit rounded-lg border border-av-gold bg-av-gold px-5 py-3 text-sm font-semibold text-av-midnight transition hover:bg-av-goldBright"
                href="/mobile"
              >
                Start Click-Dummy
              </Link>
            </div>
          </div>
        </GlassPanel>
        <GlassPanel title="Advice Boundary">
          <p className="font-display text-2xl text-av-goldBright">
            No unapproved advice reaches the client.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {fullFlow.map((badge) => (
              <WorkflowBadge key={badge} label={badge} />
            ))}
          </div>
        </GlassPanel>
      </div>

      <GlassPanel title="Shared WealthOS Core">
        <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
          {[
            "Family Profile",
            "Global Wealth Map",
            "Document Vault",
            "Action Board",
            "Signal Engine",
            "Decision Room",
            "Evidence Vault",
            "Audit Trail"
          ].map((item) => (
            <TinyPanel key={item} title={item}>
              Digital first. Human reviewed.
            </TinyPanel>
          ))}
        </div>
      </GlassPanel>
    </Phase3Board>
  );
}

export function MobileScreen() {
  const actions = [
    ["3 documents missing", "Provide documents to stay on track.", "/mobile/upload", "warning"],
    ["2 decisions awaiting review", "Review and confirm when ready.", "/decisions", "warning"],
    ["Insurance review due", "Review policy and coverage.", "/actions", "success"],
    ["Advisor-approved recommendation ready", "Tap to preview recommendation.", "/decisions", "success"],
    ["Upload document", "Securely add a document.", "/mobile/upload", "info"],
    ["Approve adviser access", "Grant or review access.", "/governance", "review"]
  ] as const;

  return (
    <Phase3Board
      route="/mobile"
      side={
        <>
          <RightAnnotationPanel
            coreAction="Tap advisor-approved recommendation ready."
            outcome="Clear next action, no unnecessary meeting."
            systemReaction="Opens the Decision Room only after advisor and compliance gates are satisfied."
            userRole="Principal / Family Member"
          />
          <GlassPanel title="Background Workflow">
            <HumanReviewFlow steps={[...reviewSteps]} />
          </GlassPanel>
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[17rem_minmax(0,1fr)_22rem]">
        <GlassPanel title="Data Objects">
          <div className="grid gap-3">
            {[
              "Client profile",
              "Open actions",
              "Trigger status",
              "Recommendation status",
              "Evidence link",
              "Permission state"
            ].map((item) => (
              <TinyPanel key={item} title={item}>
                Key input connected to the daily action card stack.
              </TinyPanel>
            ))}
          </div>
        </GlassPanel>
        <WireframePhone className="max-w-[24rem]">
          <p className="font-display text-2xl text-av-goldBright">
            Good morning,
            <br />
            Family Steward
          </p>
          <p className="mt-4 text-av-goldBright">Next step today</p>
          <div className="mt-3 grid gap-2">
            {actions.map(([title, detail, href, tone]) => (
              <Link
                className="flex items-center justify-between rounded-lg border border-av-line bg-av-midnight/55 px-3 py-2 transition hover:border-av-gold hover:bg-av-gold/10"
                href={href}
                key={title}
              >
                <span>
                  <span className="block text-sm text-av-ivory">{title}</span>
                  <span className="block text-xs text-av-muted">{detail}</span>
                </span>
                <StatusChip tone={tone}>{tone === "success" ? "Ready" : "Open"}</StatusChip>
              </Link>
            ))}
          </div>
        </WireframePhone>
        <div className="grid gap-5">
          <GlassPanel title="Core Action">
            <p className="text-sm text-av-muted">
              User taps on “Advisor-approved recommendation ready”.
            </p>
            <Link
              className="mt-4 inline-flex rounded-lg border border-av-gold px-4 py-2 text-sm text-av-goldBright"
              href="/decisions"
            >
              Open recommendation preview
            </Link>
          </GlassPanel>
          <GlassPanel title="Compliance Note">
            <p className="text-sm text-av-muted">
              Only human-approved recommendations are client-visible.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <WorkflowBadge label="ADVISOR" />
              <WorkflowBadge label="COMPLIANCE" />
              <WorkflowBadge label="CLIENT" />
            </div>
          </GlassPanel>
        </div>
      </div>
    </Phase3Board>
  );
}

export function MobileUploadScreen() {
  const [step, setStep] = useState<"upload" | "extract" | "pending">("upload");
  const [docType, setDocType] = useState("Trust deed");
  const [blocked, setBlocked] = useState(false);
  const documentTypes = [
    "Trust deed",
    "Passport",
    "Insurance policy",
    "Portfolio statement",
    "Company register",
    "Tax document",
    "Other"
  ];

  return (
    <Phase3Board
      route="/mobile/upload"
      side={
        <>
          <RightAnnotationPanel
            coreAction="Upload document via camera, files or secure import."
            outcome="Verified document linked to the right context and ready for use."
            systemReaction="Classify document, extract key data and route for review."
            userRole="Client, Family Principal or Advisor"
          />
          <GlassPanel title="Escalation Logic">
            <label className="flex items-center justify-between gap-3 text-sm text-av-muted">
              Conflict or low confidence
              <input
                checked={blocked}
                className="size-4 accent-av-gold"
                onChange={(event) => setBlocked(event.target.checked)}
                type="checkbox"
              />
            </label>
            {blocked ? (
              <p className="mt-3 rounded border border-av-danger/70 bg-av-danger/10 p-3 text-sm text-av-danger">
                [BLOCKED] Recommendation cannot be generated until conflicting document data is verified.
              </p>
            ) : null}
          </GlassPanel>
        </>
      }
      footer={
        <BottomWorkflowStrip
          badges={["CLIENT", "AUTO", "AI-DRAFT", "ANALYST", "ADVISOR", "EVIDENCE", "BLOCKED"]}
          message="Secure by design. Document visibility follows role-based access and privacy controls."
        />
      }
    >
      <div className="grid gap-5 xl:grid-cols-3">
        <WireframePhone className={step === "upload" ? "shadow-glow" : ""}>
          <p className="font-display text-xl text-av-goldBright">1 Upload document</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {["Camera", "Files", "Secure import"].map((item) => (
              <button
                className="rounded-lg border border-av-line bg-av-panel/60 p-3 text-av-muted"
                key={item}
                onClick={() => setStep("extract")}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            {documentTypes.map((type) => (
              <RowButton
                active={docType === type}
                key={type}
                onClick={() => {
                  setDocType(type);
                  setStep("extract");
                }}
              >
                {type}
              </RowButton>
            ))}
          </div>
        </WireframePhone>

        <WireframePhone className={step === "extract" ? "shadow-glow" : ""}>
          <p className="font-display text-xl text-av-goldBright">2 Extracted information</p>
          <div className="mt-4 grid gap-2">
            {[
              ["Document type", docType],
              ["Entity", "Greenridge Family Trust"],
              ["Jurisdiction", "Singapore"],
              ["Expiry date", "12 May 2030"],
              ["Related asset", "SGD Portfolio"],
              ["Related decision", "Trust Review"],
              ["Confidence score", blocked ? "61%" : "92%"]
            ].map(([label, value]) => (
              <div
                className="flex justify-between gap-3 rounded border border-av-line/60 bg-av-midnight/45 px-3 py-2 text-xs"
                key={label}
              >
                <span className="text-av-muted">{label}</span>
                <span className="text-av-ivory">{value}</span>
              </div>
            ))}
          </div>
          <button
            className="mt-4 w-full rounded-lg border border-av-gold bg-av-gold px-4 py-2 text-sm font-semibold text-av-midnight"
            onClick={() => setStep("pending")}
            type="button"
          >
            Confirm & continue
          </button>
        </WireframePhone>

        <WireframePhone className={step === "pending" ? "shadow-glow" : ""}>
          <p className="font-display text-xl text-av-goldBright">3 Verification pending</p>
          <div className="mt-4 grid gap-4">
            {[
              ["Uploaded", "Today, 09:41", true],
              ["AI-extracted", "Today, 09:42", true],
              ["Analyst review pending", "ETA: Within 1 business day", false],
              [blocked ? "Needs clarification" : "Approved / Needs clarification", blocked ? "Blocked by low confidence" : "Pending review outcome", false]
            ].map(([title, detail, done]) => (
              <div className="flex gap-3" key={title as string}>
                <span className={cn("mt-1 size-3 rounded-full", done ? "bg-av-success" : blocked ? "bg-av-danger" : "bg-av-warning")} />
                <span>
                  <span className="block text-sm text-av-ivory">{title}</span>
                  <span className="block text-xs text-av-muted">{detail}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded border border-av-line p-3 text-xs text-av-muted">
            We’ll notify you when the review is complete or if clarification is needed.
          </p>
        </WireframePhone>
      </div>
    </Phase3Board>
  );
}

export function PortalScreen() {
  return (
    <Phase3Board
      route="/portal"
      side={
        <RightAnnotationPanel
          coreAction="Click Structure completeness: 72% to explore gaps."
          outcome="User gains clarity and can take targeted action to improve visibility."
          systemReaction="Opens Global Wealth Map highlighting structural and documentation gaps."
          userRole="Principal / Family CFO / Authorized Family Member"
        />
      }
      footer={
        <BottomWorkflowStrip
          badges={["AUTO", "ANALYST", "CLIENT", "COMPLIANCE", "REVIEW"]}
          message="This dashboard is for informational purposes only. It reflects data visibility and readiness, not legal, tax, or investment advice."
        />
      }
    >
      <GlassPanel title="Client Web Portal Dashboard">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-av-line/60 bg-av-midnight/45 px-4 py-3">
          <p className="text-av-muted">Good morning, Alex. Here’s your global family office overview.</p>
          <StatusChip tone="info">Last updated: 8:42 AM, May 10, 2025</StatusChip>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Link href="/wealth-map?highlight=gaps">
            <MetricCard detail="Moderate gaps" label="Structure completeness" value="72%" />
          </Link>
          <MetricCard detail="2 high / 3 standard" label="Open Actions" tone="danger" value="5" />
          <MetricCard detail="1 high / 1 standard" label="Pending Decisions" tone="warning" value="2" />
          <MetricCard detail="2 critical / 3 standard" label="Missing Documents" tone="danger" value="5" />
          <MetricCard detail="1 high / 2 standard" label="Upcoming Reviews" tone="info" value="3" />
        </div>
      </GlassPanel>

      <div className="grid gap-5 xl:grid-cols-2">
        <GlassPanel title="Advisor Messages">
          <DashboardTable
            columns={["Message", "Advisor", "When"]}
            rows={[
              ["Welcome to your dashboard", "Your advisory team", "8:15 AM"],
              ["Document request: Insurance review", "Sarah Chen", "Yesterday"],
              ["Upcoming review: Q2 Governance", "James Patel", "May 8"]
            ]}
          />
        </GlassPanel>
        <GlassPanel title="Trigger Feed (Recent)">
          <DashboardTable
            columns={["Priority", "Trigger", "When"]}
            rows={[
              ["High", "Protection gap detected: umbrella limit below target", "8:32 AM"],
              ["Medium", "Entity document expiring in 45 days", "Yesterday"],
              ["Low", "Bank account opened", "May 8"]
            ]}
          />
        </GlassPanel>
        <GlassPanel title="Evidence Status">
          <div className="grid gap-3 md:grid-cols-[10rem_minmax(0,1fr)]">
            <div className="grid aspect-square place-items-center rounded-full border-[14px] border-av-success/70 text-center">
              <span className="font-display text-3xl text-av-goldBright">68%</span>
              <span className="sr-only">verified</span>
            </div>
            <div className="grid gap-2 text-sm">
              {["Verified 312", "Unverified 128", "Missing 45", "Total 485"].map((item) => (
                <p className="rounded border border-av-line/50 px-3 py-2 text-av-muted" key={item}>{item}</p>
              ))}
            </div>
          </div>
        </GlassPanel>
        <GlassPanel title="Family Governance Status">
          <DashboardTable
            columns={["Area", "Status"]}
            rows={[
              ["Family Council", "Active"],
              ["Decision Rights Matrix", "Complete"],
              ["Family Constitution", "In Review"],
              ["Advisor Access", "Complete"],
              ["Annual Review", "Pending"]
            ]}
          />
        </GlassPanel>
      </div>
    </Phase3Board>
  );
}

export function WealthMapScreen({
  initialHighlight
}: {
  initialHighlight?: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(initialHighlight === "gaps");
  const [filter, setFilter] = useState("All");
  const nodes = [
    ["Portfolios", "$245.3M", "left-[17%] top-[18%]"],
    ["Real Estate", "$68.2M", "left-[8%] top-[43%]"],
    ["Insurance", "$35.4M", "left-[22%] top-[66%]"],
    ["Family Members", "6", "left-[43%] top-[10%]"],
    ["Trust X", "BVI", "left-[45%] top-[42%]"],
    ["Companies", "8 Entities", "left-[68%] top-[25%]"],
    ["Liquidity", "$22.7M", "left-[82%] top-[45%]"],
    ["Mobility / Residency", "5 Programs", "left-[70%] top-[62%]"],
    ["Documents", "128 Files", "left-[55%] top-[75%]"],
    ["Decisions", "23 Active", "left-[38%] top-[82%]"],
    ["External Advisors", "9 Advisors", "left-[29%] top-[77%]"]
  ];

  return (
    <Phase3Board
      route="/wealth-map"
      side={
        <>
          <RightAnnotationPanel
            coreAction="Click Trust X to view details and related connections."
            outcome="Understand structure and take action with confidence."
            systemReaction="Displays entity drawer with linked data, alerts and actions."
            userRole="Principal / Advisor / Family Office Operator"
          />
          <GlassPanel title="Escalations">
            <p className="text-sm text-av-muted">[CALL] Advisor clarification call recommended if structure is contradictory or outdated.</p>
            <p className="mt-3 text-sm text-av-muted">[F2F] Family governance workshop may be required for succession or beneficiary conflict.</p>
          </GlassPanel>
        </>
      }
    >
      <GlassPanel title="View & Filter">
        <div className="flex flex-wrap gap-2">
          {["All", "Entities", "Assets", "Documents", "Advisors", "Jurisdictions", "Decisions", "Risk & Focus"].map((item) => (
            <button
              className={cn(
                "rounded-lg border px-4 py-2 text-sm",
                filter === item ? "border-av-gold bg-av-gold text-av-midnight" : "border-av-line text-av-muted"
              )}
              key={item}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </GlassPanel>
      <div className="grid gap-5 xl:grid-cols-[15rem_minmax(0,1fr)_21rem]">
        <GlassPanel title="Jurisdictions">
          <div className="grid gap-2 text-sm text-av-muted">
            {["United States", "United Kingdom", "Switzerland", "Singapore", "United Arab Emirates", "Hong Kong", "Canada", "Australia", "+ 12 more"].map((item) => (
              <p className="rounded border border-av-line/40 px-3 py-2" key={item}>{item}</p>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel className="min-h-[38rem]" title="Global Wealth Map">
          <div className="relative h-[34rem] overflow-hidden rounded-lg border border-av-line bg-av-midnight/60">
            <div className="absolute inset-0 world-motif opacity-30" />
            {nodes.map(([label, value, position]) => (
              <button
                className={cn(
                  "absolute grid min-h-20 w-28 place-items-center rounded-full border bg-av-panel/90 p-3 text-center text-xs transition hover:border-av-gold",
                  position,
                  label === "Trust X" ? "border-av-gold text-av-goldBright shadow-glow" : "border-av-line text-av-muted",
                  initialHighlight === "gaps" && ["Trust X", "Documents", "Decisions"].includes(label) ? "ring-2 ring-av-danger/70" : ""
                )}
                key={label}
                onClick={() => label === "Trust X" && setDrawerOpen(true)}
                type="button"
              >
                <span className="block font-semibold text-av-ivory">{label}</span>
                <span>{value}</span>
              </button>
            ))}
          </div>
        </GlassPanel>
        {drawerOpen ? (
          <Drawer title="Trust X">
            <DashboardTable
              columns={["Field", "Detail"]}
              rows={[
                ["Jurisdiction", "British Virgin Islands"],
                ["Linked assets", "$112.6M / 6 assets"],
                ["Trustees", "Alpha Trustees Ltd. / Individual Co-Trustee"],
                ["Beneficiaries", "Family Members (4)"],
                ["Missing documents", "2 items"],
                ["Upcoming review", "31 Jul 2025 / 17 days"],
                ["Related decisions", "3 decisions"]
              ]}
            />
          </Drawer>
        ) : (
          <GlassPanel title="Entity Drawer">
            <p className="text-sm text-av-muted">Click Trust X to open linked assets, trustees, missing documents and related decisions.</p>
          </GlassPanel>
        )}
      </div>
    </Phase3Board>
  );
}

export function ActionsScreen() {
  const [selected, setSelected] = useState("Upload updated trust deed");
  const columns = {
    "To Review": ["Upload updated trust deed", "Review insurance cover"],
    "Awaiting Documents": ["Confirm beneficial owner", "Approve adviser access"],
    "Advisor Reviewing": ["Review liquidity requirement", "Evaluate mobility decision point"],
    "Ready for Decision": ["Read advisor-approved recommendation", "Approve trustee change"],
    Approved: ["Update investment mandate", "Document sign-off"],
    Deferred: ["Add new asset class", "Tax strategy review"]
  };

  return (
    <Phase3Board route="/actions">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <GlassPanel title="Action Board">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            {Object.entries(columns).map(([column, cards]) => (
              <div className="rounded-lg border border-av-line bg-av-midnight/40 p-2" key={column}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-display text-lg text-av-goldBright">{column}</p>
                  <StatusChip tone="info">{cards.length}</StatusChip>
                </div>
                <div className="grid gap-2">
                  {cards.map((card) => {
                    const href = card === "Read advisor-approved recommendation" ? "/decisions" : undefined;
                    return (
                      <button
                        className={cn(
                          "rounded-lg border p-3 text-left text-xs transition",
                          selected === card ? "border-av-gold bg-av-gold/15" : "border-av-line/60 bg-av-panel/50 hover:border-av-gold"
                        )}
                        key={card}
                        onClick={() => setSelected(card)}
                        type="button"
                      >
                        <span className="block text-sm text-av-ivory">{card}</span>
                        <span className="mt-2 block text-av-muted">Priority: {card.includes("recommendation") ? "High" : "Medium"}</span>
                        <span className="block text-av-muted">Due: 31 Jul 2025</span>
                        <span className="block text-av-muted">Owner: Family Office Operator</span>
                        <span className="mt-2 flex flex-wrap gap-1">
                          <WorkflowBadge label={card.includes("recommendation") ? "ADVISOR" : "ANALYST"} />
                          <WorkflowBadge label="EVIDENCE" />
                        </span>
                        {href ? (
                          <Link className="mt-3 inline-flex text-av-goldBright" href={href}>
                            Read advisor-approved recommendation →
                          </Link>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
        <Drawer title={selected}>
          <div className="grid gap-3">
            <p>Related asset/entity: Alpha Family Trust</p>
            <p>Human review stage: Advisor approved where applicable.</p>
            <p>Evidence status: Complete or partial depending on source documents.</p>
            {selected === "Read advisor-approved recommendation" ? (
              <Link className="rounded-lg border border-av-gold px-4 py-2 text-center text-av-goldBright" href="/decisions">
                Open Decision Room
              </Link>
            ) : null}
          </div>
        </Drawer>
      </div>
    </Phase3Board>
  );
}

export function SignalsScreen() {
  const sources = [
    "Markets",
    "Currencies",
    "Tax / Regulatory Updates",
    "Portfolio Changes",
    "Insurance Expiry",
    "Document Gaps",
    "Life Events",
    "Mobility Events",
    "Succession Milestones",
    "Advisor Input",
    "Client Input"
  ];
  const outputs = [
    "Review required",
    "Protection gap",
    "Liquidity action needed",
    "Mobility decision point",
    "Portfolio exposure review",
    "Document missing",
    "Advisor input required",
    "Compliance review required"
  ];
  const map: Record<string, string[]> = {
    Markets: ["Review required", "Portfolio exposure review"],
    "Insurance Expiry": ["Protection gap", "Advisor input required"],
    "Document Gaps": ["Document missing", "Compliance review required"],
    "Mobility Events": ["Mobility decision point", "Compliance review required"],
    "Client Input": ["Advisor input required", "Review required"]
  };
  const [selected, setSelected] = useState("Document Gaps");
  const highlighted = map[selected] ?? ["Review required"];

  return (
    <Phase3Board
      route="/signals"
      side={
        <GlassPanel title="Client-Visible Boundary">
          <p className="font-display text-2xl text-av-goldBright">
            Triggers are review points, not final advice.
          </p>
          <p className="mt-3 text-sm text-av-muted">
            Clients see only approved actions or neutral review notices. No system logic, confidence scores or internal notes are exposed.
          </p>
        </GlassPanel>
      }
      footer={
        <BottomWorkflowStrip
          badges={["AUTO", "AI-DRAFT", "ANALYST", "ADVISOR", "COMPLIANCE", "CLIENT"]}
          message="Always reviewable. Never auto-executed."
        />
      }
    >
      <div className="grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)_20rem]">
        <GlassPanel title="Signal Sources">
          <div className="grid gap-2">
            {sources.map((source) => (
              <RowButton
                active={source === selected}
                key={source}
                onClick={() => setSelected(source)}
              >
                {source}
              </RowButton>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel title="Engine & Processing Layer">
          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-4">
              {["Ingest & Normalize", "Enrich & Correlate", "Classify & Prioritize", "Score & Route"].map((item) => (
                <TinyPanel key={item} title={item}>Evidence-backed logic.</TinyPanel>
              ))}
            </div>
            <div className="grid place-items-center rounded-lg border border-av-gold bg-av-gold/10 p-10 text-center">
              <p className="font-display text-3xl text-av-goldBright">AlphaVest Signal Engine</p>
              <p className="mt-2 text-sm text-av-muted">Contextual intelligence plus rules, guarded by human oversight.</p>
            </div>
            <p className="rounded-lg border border-av-line bg-av-midnight/50 p-4 text-center font-display text-2xl text-av-goldBright">
              Triggers are review points, not final advice.
            </p>
          </div>
        </GlassPanel>
        <GlassPanel title="Trigger Outputs">
          <div className="grid gap-2">
            {outputs.map((output) => (
              <div
                className={cn(
                  "rounded-lg border px-3 py-3 text-sm",
                  highlighted.includes(output)
                    ? "border-av-gold bg-av-gold/15 text-av-ivory shadow-glow"
                    : "border-av-line/60 bg-av-midnight/45 text-av-muted"
                )}
                key={output}
              >
                {output}
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </Phase3Board>
  );
}

export function DecisionsScreen() {
  const [decision, setDecision] = useState<"Proposed" | "Accepted" | "Deferred" | "Rejected">("Proposed");
  const auditMessage = useMemo(() => {
    if (decision === "Proposed") {
      return "Awaiting client decision. Advisor and compliance gates are complete.";
    }
    return `You clicked ${decision.toUpperCase()}. System reaction: audit note and Evidence Record updated.`;
  }, [decision]);

  return (
    <Phase3Board
      route="/decisions"
      side={
        <>
          <RightAnnotationPanel
            coreAction="Accept, Defer or Reject an advisor-approved recommendation."
            outcome="Decision recorded with audit trail and family notified when relevant."
            systemReaction="Approval logged and Evidence Record updated."
            userRole="Principal / Family Council / Advisor"
          />
          <GlassPanel title="Background Workflow">
            <HumanReviewFlow steps={[...reviewSteps]} />
          </GlassPanel>
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[17rem_minmax(0,1fr)_22rem]">
        <GlassPanel title="Decision Title">
          <p className="font-display text-2xl text-av-goldBright">
            Approve Real Estate Diversification Strategy
          </p>
          <p className="mt-3 text-sm text-av-muted">
            Approve allocation to a diversified real estate strategy to enhance income stability and inflation resilience.
          </p>
          <DashboardTable
            columns={["Field", "Value"]}
            rows={[
              ["Proposed by", "AlphaVest Analyst"],
              ["Date proposed", "31 July 2025"],
              ["Impact", "High"],
              ["Required approvals", "2 of 3 family members"]
            ]}
          />
        </GlassPanel>
        <div className="grid gap-5">
          <GlassPanel
            title="Decision Status"
            actions={<StatusChip tone={decision === "Rejected" ? "danger" : decision === "Deferred" ? "warning" : decision === "Accepted" ? "success" : "info"}>{decision}</StatusChip>}
          >
            <div className="grid gap-3 md:grid-cols-5">
              {["Proposed", "Under Review", "Awaiting Family", decision === "Accepted" ? "Approved" : decision, "Recorded"].map((step, index) => (
                <TinyPanel key={`${step}-${index}`} title={step}>
                  31 Jul
                </TinyPanel>
              ))}
            </div>
          </GlassPanel>
          <GlassPanel title="Your Decision">
            <p className="text-sm text-av-muted">
              By choosing, you confirm this decision is in the best interest of the family and in line with governance.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                ["Accepted", "ACCEPT", "success"],
                ["Deferred", "DEFER", "warning"],
                ["Rejected", "REJECT", "danger"]
              ].map(([value, label, tone]) => (
                <button
                  className={cn(
                    "rounded-lg border px-4 py-3 font-semibold",
                    decision === value ? "border-av-gold bg-av-gold text-av-midnight" : "border-av-line text-av-ivory"
                  )}
                  key={value}
                  onClick={() => setDecision(value as typeof decision)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-4 rounded-lg border border-av-line bg-av-midnight/45 p-3 text-sm text-av-muted">
              {auditMessage}
            </p>
          </GlassPanel>
          <div className="grid gap-3 md:grid-cols-5">
            {["Current Situation", "Why This Matters", "Options", "Assumptions", "Risks"].map((item) => (
              <TinyPanel key={item} title={item}>View details →</TinyPanel>
            ))}
          </div>
        </div>
        <GlassPanel title="Family Approvals">
          <DashboardTable
            columns={["Member", "Status"]}
            rows={[
              ["Family Steward (You)", decision === "Proposed" ? "Pending" : decision],
              ["Co-Steward", "Accepted"],
              ["Next Gen 1", "Pending"]
            ]}
          />
          <div className="mt-4 grid gap-3">
            <TinyPanel title="External Specialist Input">Real estate specialist contributed on 31 Jul 2025.</TinyPanel>
            <TinyPanel title="Advisor Comments">Risk and return profile appropriate. Recommend approval.</TinyPanel>
            <TinyPanel title="Documents">Strategy Brief.pdf, Financial Model.xlsx, Market Analysis.pdf</TinyPanel>
          </div>
        </GlassPanel>
      </div>
    </Phase3Board>
  );
}

export function EvidenceScreen() {
  const [selected, setSelected] = useState("Policy Overview.pdf");
  const records = [
    "Policy Overview.pdf",
    "Advisor Memo.pdf",
    "Client Approval.pdf",
    "Risk Assessment.pdf",
    "Premium Comparison.xlsx"
  ];
  const auditRows = [
    "System linked to decision",
    "Emily Steward client approved",
    "Alex Johnson advisor signed",
    "Document uploaded",
    "Record created"
  ];

  return (
    <Phase3Board
      route="/evidence"
      side={
        <>
          <RightAnnotationPanel
            coreAction="Upload, review or approve evidence."
            outcome="Immutable record supports confident, accountable decisions."
            systemReaction="Validate, link and lock evidence to decision."
            userRole="Client / Advisor / Compliance"
          />
          <GlassPanel title="Evidence replaces assumption.">
            <p className="text-sm text-av-muted">
              Every decision, document and communication is recorded, versioned and reviewable.
            </p>
          </GlassPanel>
        </>
      }
      footer={
        <BottomWorkflowStrip
          badges={["AUTO", "ANALYST", "ADVISOR", "COMPLIANCE", "EVIDENCE"]}
          message="Document uploaded → Advisor reviewed → Client approved → Linked to decision → Next review."
        />
      }
    >
      <div className="grid gap-5 xl:grid-cols-[20rem_20rem_minmax(0,1fr)]">
        <GlassPanel title="1. Source Documents">
          <div className="grid gap-2">
            {records.map((record) => (
              <RowButton
                active={selected === record}
                key={record}
                onClick={() => setSelected(record)}
              >
                {record}
              </RowButton>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel title="2. Decision Records">
          <DashboardTable
            columns={["Decision", "Status"]}
            rows={[
              ["Insurance review accepted", "Active"],
              ["Investment policy update", "Active"],
              ["Tax strategy update", "Active"],
              ["Trust structure established", "Active"],
              ["Estate plan review", "Active"]
            ]}
          />
        </GlassPanel>
        <GlassPanel title="3. Evidence Record (Selected)">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <DashboardTable
              columns={["Field", "Value"]}
              rows={[
                ["Selected item", selected],
                ["Decision", "Insurance review accepted"],
                ["Basis", "Current policy and family risk objective"],
                ["Advisor", "Senior Wealth Advisor"],
                ["Compliance", "Checked"],
                ["Client", "Approved"],
                ["Review date", "12 months"],
                ["Status", "Active"],
                ["Record ID", "EVR-2025-05-19-0012"]
              ]}
            />
            <div className="grid gap-3">
              <TinyPanel title="4. Advisor Sign-off">Signed by Alex Johnson, 19 May 2025 09:45.</TinyPanel>
              <TinyPanel title="5. Client Approval">Approved by Emily Steward, e-signature captured.</TinyPanel>
              <TinyPanel title="6. Review Dates">Next review 19 May 2026, reminder 30 days before.</TinyPanel>
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_16rem_16rem_16rem]">
        <GlassPanel title="7. Audit Trail">
          <div className="grid gap-2">
            {auditRows.map((row) => (
              <RowButton
                active={selected === row}
                key={row}
                onClick={() => setSelected(row)}
              >
                {row}
              </RowButton>
            ))}
          </div>
        </GlassPanel>
        <TinyPanel title="8. Related Entities">Steward Family, Policy, Risk Profile.</TinyPanel>
        <TinyPanel title="9. Related Actions">Link to risk assessment, policy and follow-up task.</TinyPanel>
        <TinyPanel title="10. Version History">v3.0 linked to decision, v2.0 client approval.</TinyPanel>
      </div>

      <GlassPanel title="Evidence Lifecycle Timeline">
        <div className="grid gap-3 md:grid-cols-5">
          {[
            "Document uploaded",
            "Advisor reviewed",
            "Client approved",
            "Linked to decision",
            "Next review"
          ].map((item, index) => (
            <TinyPanel key={item} title={`${index + 1}. ${item}`}>
              <WorkflowBadge label={index === 2 ? "CLIENT" : index === 4 ? "REVIEW" : "EVIDENCE"} />
            </TinyPanel>
          ))}
        </div>
      </GlassPanel>
    </Phase3Board>
  );
}
