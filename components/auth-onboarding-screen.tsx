"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Database,
  Eye,
  FileText,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Mail,
  Monitor,
  Phone,
  Scale,
  ShieldCheck,
  User,
  Users,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Modal, StatePanel, StatusChip, WizardStepper } from "@/components/ui";
import { WorksurfaceShell } from "@/components/worksurface-shell";
import {
  authSecurityFeatures,
  inviteSummary,
  invitedUser,
  isAuthOnboardingPageId,
  mfaSecurityEvents,
  onboardingStepsByPage,
  policyDocuments,
  roleBoundaries,
  type AuthIconName,
  type AuthOnboardingPageId
} from "@/lib/auth-onboarding-demo-data";
import { cn } from "@/lib/cn";
import { readDemoAuthStorage, writeDemoAuthStorage, type DemoAuthResponse, type DemoAuthStorage } from "@/lib/demo/demo-auth-client";

type AuthOnboardingScreenProps = {
  pageId: AuthOnboardingPageId;
};

type AuthProviderOption = {
  id: string;
  label: string;
  mode: string;
  mfa: string;
  productionIdp: boolean;
};

const fallbackAuthProviders: AuthProviderOption[] = [
  {
    id: "db-user-jwt",
    label: "DB user JWT",
    mode: "MVP_LOCAL_DB",
    mfa: "stub-123456",
    productionIdp: false,
  },
];

const iconMap: Record<AuthIconName, LucideIcon> = {
  audit: ClipboardCheck,
  building: Building2,
  check: CheckCircle2,
  database: Database,
  document: FileText,
  fingerprint: Fingerprint,
  key: KeyRound,
  lock: LockKeyhole,
  mail: Mail,
  monitor: Monitor,
  phone: Phone,
  scale: Scale,
  shield: ShieldCheck,
  user: User,
  users: Users
};

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-5 text-sm font-semibold text-alphavest-navy shadow-lg shadow-black/20 transition hover:bg-alphavest-gold-soft";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/50 px-5 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft";

const authWorksurfaceMeta: Record<AuthOnboardingPageId, { description: string; safetyNote: string; title: string; worksurfaceId: string }> = {
  "001": {
    description: "Authenticate a workspace user before any tenant, role or content access can be reached.",
    safetyNote: "Authentication grants only a local actor session. It does not approve advice, release client-visible content or expand tenant content access.",
    title: "Authentication login",
    worksurfaceId: "access-login",
  },
  "002": {
    description: "Complete the local MFA challenge before continuing into invite acceptance or workspace access.",
    safetyNote: "MFA completion confirms the local challenge only. Role assignment, tenant membership and downstream action authority remain separately controlled.",
    title: "Multi-factor authentication",
    worksurfaceId: "access-mfa",
  },
  "003": {
    description: "Accept the invitation and verify which tenant and role context will be activated.",
    safetyNote: "Invitation acceptance starts onboarding only. It does not bypass identity setup, consent, role confirmation or audit requirements.",
    title: "Invitation acceptance",
    worksurfaceId: "access-invite-acceptance",
  },
  "004": {
    description: "Capture identity details used to bind the invited user to a governed account.",
    safetyNote: "Identity setup remains an onboarding step. It does not grant elevated permissions or cross-tenant visibility.",
    title: "Identity setup",
    worksurfaceId: "access-identity-setup",
  },
  "005": {
    description: "Review privacy, consent and responsibility policies before activating workspace access.",
    safetyNote: "Consent records user acknowledgement only. It does not release client-facing advice or mark compliance review complete.",
    title: "Consent and privacy",
    worksurfaceId: "access-consent",
  },
  "006": {
    description: "Confirm role boundaries and activate the DB-backed access context.",
    safetyNote: "Role confirmation activates the assigned workspace role only. Sensitive actions still require their own permission, evidence and audit checks.",
    title: "Role confirmation",
    worksurfaceId: "access-role-confirmation",
  },
};

function AlphaVestMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", compact ? "justify-start" : "justify-center")}>
      <div className="grid size-12 place-items-center rounded-md border border-alphavest-gold/30 bg-alphavest-gold/10 font-display text-3xl font-bold text-alphavest-gold">
        A
      </div>
      <div>
        <div className="font-display text-4xl leading-none text-alphavest-ivory">AlphaVest</div>
        <div className="mt-1 text-xs font-semibold uppercase tracking-[0.42em] text-alphavest-gold-soft">WealthOS</div>
      </div>
    </div>
  );
}

function AuthCanvas({ children, compactHeader = false, supportPageId }: { children: React.ReactNode; compactHeader?: boolean; supportPageId?: AuthOnboardingPageId }) {
  const isSupportSurface = Boolean(supportPageId);
  const effectiveCompactHeader = compactHeader || isSupportSurface;

  return (
    <main className={cn("av-surface av-surface-auth relative overflow-hidden px-4 md:px-8", isSupportSurface ? "py-3" : "py-8")}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-55"
        style={{
          background:
            "radial-gradient(circle at 3rem 21rem, rgba(215,166,75,0.25), transparent 20rem), repeating-radial-gradient(ellipse at 0% 52%, rgba(215,166,75,0.14) 0 1px, transparent 2px 18px)"
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(90,167,216,0.14),transparent_30rem)]"
      />
      <div className="relative mx-auto max-w-[90rem]">
        <header className={cn(isSupportSurface ? "mb-3" : "mb-8", effectiveCompactHeader ? "flex justify-start" : "text-center")}>
          <AlphaVestMark compact={effectiveCompactHeader} />
          {!effectiveCompactHeader ? (
            <p className="mt-5 text-sm text-alphavest-muted md:text-base">
              Digital first. Human reviewed. Evidence backed.
            </p>
          ) : null}
        </header>
        {supportPageId ? (
          <WorksurfaceShell
            description={authWorksurfaceMeta[supportPageId].description}
            eyebrow="Access worksurface"
            primary={children}
            density="compact"
            routeId={supportPageId}
            safetyNote={authWorksurfaceMeta[supportPageId].safetyNote}
            statusItems={[{ label: "Access", tone: "blue", value: "Onboarding" }, { label: "Mode", tone: "gold", value: "Controlled" }]}
            title={authWorksurfaceMeta[supportPageId].title}
            worksurfaceId={authWorksurfaceMeta[supportPageId].worksurfaceId}
          />
        ) : children}
      </div>
    </main>
  );
}

function IconBadge({ icon, className }: { className?: string; icon: AuthIconName }) {
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-full border border-alphavest-gold/45 bg-alphavest-gold/10 text-alphavest-gold-soft",
        className
      )}
    >
      <Icon aria-hidden="true" className="size-5" />
    </div>
  );
}

function FieldShell({
  actionIcon,
  helper,
  icon,
  label,
  value
}: {
  actionIcon?: React.ReactNode;
  helper?: string;
  icon: AuthIconName;
  label: string;
  value: string;
}) {
  const Icon = iconMap[icon];

  return (
    <label className="block">
      <span className="text-sm font-semibold text-alphavest-ivory">{label}</span>
      <span className="mt-2 flex h-[var(--field-height)] items-center gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-4 text-sm text-alphavest-muted">
        <Icon aria-hidden="true" className="size-4 shrink-0 text-alphavest-gold-soft" />
        <input
          aria-label={label}
          className="min-w-0 flex-1 bg-transparent text-alphavest-ivory outline-none placeholder:text-alphavest-subtle"
          defaultValue={value}
          readOnly
        />
        {actionIcon}
      </span>
      {helper ? <span className="mt-2 block text-xs leading-5 text-alphavest-muted">{helper}</span> : null}
    </label>
  );
}

function SecurityPanel({ title = "Security and privacy" }: { title?: string }) {
  return (
    <Card className="h-fit p-6">
      <CardHeader className="flex flex-row items-center gap-4">
        <IconBadge icon="shield" />
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>Built into WealthOS</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {authSecurityFeatures.map((item) => (
          <div className="flex gap-4 border-b border-alphavest-border/50 pb-5 last:border-0 last:pb-0" key={item.title}>
            <IconBadge className="size-10 border-alphavest-border/70 bg-alphavest-navy/35" icon={item.icon} />
            <div>
              <h3 className="text-sm font-semibold text-alphavest-ivory">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-alphavest-muted">{item.detail}</p>
            </div>
          </div>
        ))}
        <StatePanel
          detail="Access remains restricted until identity and role checks pass."
          state="restricted"
          title="Access restricted"
        />
      </CardContent>
    </Card>
  );
}

function PageStepper({ pageId }: { pageId: AuthOnboardingPageId }) {
  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <WizardStepper steps={onboardingStepsByPage[pageId]} />
    </div>
  );
}

function LoginPage() {
  const [email, setEmail] = useState(invitedUser.email);
  const [providers, setProviders] = useState<AuthProviderOption[]>(fallbackAuthProviders);
  const [providerId, setProviderId] = useState(fallbackAuthProviders[0].id);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("Access check verifies users and role assignments before continuing.");

  useEffect(() => {
    let cancelled = false;

    async function loadProviders() {
      const response = await fetch("/api/auth/providers");
      const body = (await response.json()) as { providers?: AuthProviderOption[] };
      const nextProviders = body.providers?.length ? body.providers : fallbackAuthProviders;

      if (!cancelled) {
        setProviders(nextProviders);
        setProviderId(nextProviders[0].id);
      }
    }

    void loadProviders().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  async function startLogin() {
    setStatus("submitting");
    setMessage("Checking user access...");

    const response = await fetch("/api/auth/provider-login", {
      body: JSON.stringify({ email, providerId }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    const body = (await response.json()) as DemoAuthResponse;

    if (!response.ok || !body.ok || !body.nextStep) {
      setStatus("error");
      setMessage(body.safeMessage ?? body.error ?? "Access check could not continue this sign-in.");
      return;
    }

    writeDemoAuthStorage({
      email,
      inviteToken: body.user?.inviteToken,
      nextStep: body.nextStep,
      providerId,
    });
    setStatus("success");
    setMessage(body.nextStep === "mfa_required" ? "DB user found. DB-JWT MFA challenge created." : "Invitation found. Continue onboarding.");
    window.location.href = body.nextStep === "mfa_required" ? "/mfa" : "/onboarding/invite";
  }

  return (
    <AuthCanvas supportPageId="001">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <Card className="p-6 md:p-8">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Authentication Login</CardTitle>
                <CardDescription>Sign in to your account.</CardDescription>
              </div>
              <StatusChip label="Access pending" status="PENDING" />
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-alphavest-ivory">Email address</span>
              <span className="mt-2 flex h-[var(--field-height)] items-center gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-4 text-sm text-alphavest-muted">
                <Mail aria-hidden="true" className="size-4 shrink-0 text-alphavest-gold-soft" />
                <input
                  aria-label="Email address"
                  className="min-w-0 flex-1 bg-transparent text-alphavest-ivory outline-none placeholder:text-alphavest-subtle"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                />
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-alphavest-ivory">Auth provider</span>
              <span className="mt-2 flex h-[var(--field-height)] items-center gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-4 text-sm text-alphavest-muted">
                <Database aria-hidden="true" className="size-4 shrink-0 text-alphavest-gold-soft" />
                <select
                  aria-label="Auth provider"
                  className="min-w-0 flex-1 bg-transparent text-alphavest-ivory outline-none"
                  onChange={(event) => setProviderId(event.target.value)}
                  value={providerId}
                >
                  {providers.map((provider) => (
                    <option className="bg-alphavest-navy text-alphavest-ivory" key={provider.id} value={provider.id}>
                      {provider.label}
                    </option>
                  ))}
                </select>
              </span>
              <span className="mt-2 block text-xs text-alphavest-muted">
                MVP provider checks the user in the DB, uses MFA code 123456 and issues a permitted JWT.
              </span>
            </label>
            <FieldShell actionIcon={<Eye aria-hidden="true" className="size-4 text-alphavest-muted" />} icon="lock" label="Password" value="workspace-password" />
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-3 text-alphavest-muted">
                <span className="grid size-5 place-items-center rounded border border-alphavest-border bg-alphavest-navy/45" />
                Remember me
              </label>
              <span className="font-semibold text-alphavest-gold-soft">Forgot password?</span>
            </div>
            <button className={cn(primaryButtonClass, "w-full")} disabled={status === "submitting"} onClick={() => void startLogin()} type="button">
              <LockKeyhole aria-hidden="true" className="size-4" />
              {status === "submitting" ? "Checking access" : "Sign in"}
            </button>
            <StatePanel
              detail={message}
              state={status === "error" ? "blocked" : status === "success" ? "success" : "restricted"}
              title="Access check"
            />
            <div className="flex items-center gap-4 text-xs uppercase text-alphavest-subtle">
              <span className="h-px flex-1 bg-alphavest-border" />
              or
              <span className="h-px flex-1 bg-alphavest-border" />
            </div>
            <p className={cn(secondaryButtonClass, "w-full justify-between opacity-65")} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="SSO is not configured for this workspace." data-ux-interactive="false">
              <span className="flex items-center gap-2">
                <ShieldCheck aria-hidden="true" className="size-4 text-alphavest-gold-soft" />
                Sign in with SSO
              </span>
              <Badge>SAML 2.0</Badge>
            </p>
            <p className="text-center text-sm text-alphavest-muted">
              Need help? <span className="font-semibold text-alphavest-gold-soft">Contact your administrator.</span>
            </p>
          </CardContent>
        </Card>
        <SecurityPanel />
      </div>
    </AuthCanvas>
  );
}

function MfaPage() {
  const [email, setEmail] = useState(invitedUser.email);
  const [providerId, setProviderId] = useState(fallbackAuthProviders[0].id);
  const [code, setCode] = useState("123456");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("Use code 123456. Verification records an audit event and issues a scoped JWT.");

  useEffect(() => {
    queueMicrotask(() => {
      const stored = readDemoAuthStorage(invitedUser.email);
      setEmail(stored.email);
      setProviderId(stored.providerId ?? fallbackAuthProviders[0].id);
    });
  }, []);

  async function verifyMfa() {
    setStatus("submitting");
    const response = await fetch("/api/auth/mfa/verify", {
      body: JSON.stringify({ code, email, providerId }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    const body = (await response.json()) as DemoAuthResponse;

    if (!response.ok || !body.ok) {
      setStatus("error");
      setMessage(body.error ?? "MFA verification failed.");
      return;
    }

    setStatus("success");
    setMessage("MFA verified. DB-JWT session context has been issued from DB role and tenant scope.");
    window.location.href = "/client/home";
  }

  return (
    <AuthCanvas compactHeader supportPageId="002">
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.35fr_0.95fr]">
        <aside className="hidden rounded-md border border-alphavest-border/40 bg-alphavest-charcoal/35 p-5 text-sm text-alphavest-muted lg:block">
          <h2 className="font-display text-2xl text-alphavest-ivory">Welcome back</h2>
          <p className="mt-2">Your wealth. Your future. Our technology.</p>
          <div className="mt-8 space-y-4">
            {["Overview", "Holdings", "Performance", "Documents", "Settings"].map((item, index) => (
              <div className={cn("flex items-center gap-3", index === 0 && "text-alphavest-gold-soft")} key={item}>
                <span className="size-2 rounded-full bg-current" />
                {item}
              </div>
            ))}
          </div>
        </aside>

        <Card className="mx-auto w-full max-w-[40rem] border-alphavest-gold/30 p-6 shadow-2xl shadow-black/35">
          <CardHeader className="text-center">
            <AlphaVestMark compact={false} />
            <CardTitle className="mt-5">Multi-Factor Authentication</CardTitle>
            <CardDescription>Verify it is you to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3">
              <div className="flex items-center gap-3">
                <IconBadge className="size-9 border-alphavest-border" icon="monitor" />
                <div>
                  <p className="text-xs text-alphavest-muted">Your device</p>
                  <p className="text-sm font-semibold text-alphavest-ivory">{invitedUser.mfaDevice} · macOS</p>
                </div>
              </div>
              <Badge tone="green">This device</Badge>
            </div>
            <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/40">
              <div className="grid grid-cols-2 border-b border-alphavest-border text-sm">
                <span className="border-r border-alphavest-border bg-alphavest-panel-soft/60 px-4 py-3 text-left font-semibold text-alphavest-ivory opacity-80">
                  Authenticator app
                </span>
                <span className="px-4 py-3 text-left text-alphavest-muted opacity-60">Security key</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-alphavest-gold-soft">Open your authenticator app and enter the 6-digit code.</p>
                <input
                  aria-label="MFA code"
                  className="mt-4 h-12 w-full rounded-md border border-alphavest-border bg-alphavest-navy/50 px-4 text-center text-lg tracking-[0.3em] text-alphavest-ivory outline-none focus:border-alphavest-gold"
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(event) => setCode(event.target.value)}
                  value={code}
                />
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm text-alphavest-muted">
              <span className="grid size-5 place-items-center rounded border border-alphavest-border bg-alphavest-navy/45" />
              Trust this device for 30 days
            </label>
            <button className={cn(primaryButtonClass, "w-full")} disabled={status === "submitting"} onClick={() => void verifyMfa()} type="button">
              <LockKeyhole aria-hidden="true" className="size-4" />
              {status === "submitting" ? "Verifying" : "Verify"}
            </button>
            <StatePanel
              detail={message}
              state={status === "error" ? "blocked" : status === "success" ? "success" : "restricted"}
              title={`MFA for ${email}`}
            />
            <p className={cn(secondaryButtonClass, "w-full justify-between opacity-65")} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Push notification is not configured for this workspace." data-ux-interactive="false">
              <span>Send push notification</span>
              <ChevronRight aria-hidden="true" className="size-4" />
            </p>
            <div className="flex items-center justify-between text-sm text-alphavest-muted">
              <Link href="/login">Back to sign in</Link>
              <span>Sign out</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hidden h-fit p-6 lg:block">
          <CardHeader>
            <CardTitle className="text-xl">Security notifications</CardTitle>
            <CardDescription>Protected by WealthOS Security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mfaSecurityEvents.map((event) => (
              <div className="flex items-start justify-between gap-4 border-b border-alphavest-border/50 pb-4 last:border-0 last:pb-0" key={event.title}>
                <div>
                  <p className="text-sm font-semibold text-alphavest-ivory">{event.title}</p>
                  <p className="mt-1 text-sm text-alphavest-muted">{event.detail}</p>
                </div>
                <span className="text-xs text-alphavest-subtle">{event.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AuthCanvas>
  );
}

function InvitePage() {
  const [storedInvite, setStoredInvite] = useState<DemoAuthStorage>({ email: invitedUser.email });

  useEffect(() => {
    queueMicrotask(() => {
      setStoredInvite(readDemoAuthStorage(invitedUser.email));
    });
  }, []);

  return (
    <AuthCanvas supportPageId="003">
      <PageStepper pageId="003" />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="p-6 md:p-8">
          <CardHeader className="flex flex-row items-start gap-4">
            <IconBadge icon="mail" />
            <div>
              <CardTitle>Invitation Acceptance</CardTitle>
              <CardDescription>You have been invited to join a secure AlphaVest WealthOS workspace.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {inviteSummary.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <div className="grid gap-3 border-b border-alphavest-border/50 py-3 text-sm md:grid-cols-[2rem_9rem_1fr_auto]" key={item.label}>
                  <div className="grid size-9 place-items-center rounded-md border border-alphavest-border bg-alphavest-navy/35 text-alphavest-gold-soft">
                    <Icon aria-hidden="true" className="size-4" />
                  </div>
                  <span className="text-alphavest-muted">{item.label}</span>
                  <span className="font-semibold text-alphavest-ivory">
                    {item.value} {item.detail ? <span className="ml-2 font-normal text-alphavest-subtle">{item.detail}</span> : null}
                  </span>
                  {item.badge ? <Badge tone="gold">{item.badge}</Badge> : null}
                </div>
              );
            })}
            <Link className={cn(primaryButtonClass, "w-full justify-between")} href="/onboarding/identity">
              <span className="flex items-center gap-2">
                <LockKeyhole aria-hidden="true" className="size-4" />
                Continue secure setup
              </span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <p className={cn(secondaryButtonClass, "w-full opacity-65")} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Invitation decline is not configured for this workspace." data-ux-interactive="false">Decline invitation</p>
            <p className="text-center text-sm leading-6 text-alphavest-muted">
              Accepting starts the secure account setup review and prepares an audit event.
            </p>
          </CardContent>
        </Card>
        <Card className="h-fit p-6">
          <CardHeader className="flex flex-row gap-4">
            <IconBadge icon="shield" />
            <div>
              <CardTitle className="text-xl">Secure by design</CardTitle>
              <CardDescription>Your access is permitted before any workspace data is shown.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatePanel
              detail={storedInvite.inviteToken ? `${storedInvite.email} has a DB-backed invite token ready for acceptance.` : `${storedInvite.email} can continue only after a valid DB invite is present.`}
              state={storedInvite.inviteToken ? "success" : "restricted"}
              title="DB invitation context"
            />
            {["Verify your identity", "Set up your account", "Access your workspace"].map((item, index) => (
              <div className="flex gap-3" key={item}>
                <div className="grid size-7 shrink-0 place-items-center rounded-full border border-alphavest-border text-xs text-alphavest-ivory">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-alphavest-ivory">{item}</p>
                  <p className="mt-1 text-sm text-alphavest-muted">
                    {index === 0 ? "We confirm it is really you." : index === 1 ? "Create a password and enable MFA." : "Sign in with your assigned role."}
                  </p>
                </div>
              </div>
            ))}
            <StatePanel detail="Expired or already-used invitations cannot continue." state="restricted" title="Invitation unavailable" />
          </CardContent>
        </Card>
      </div>
    </AuthCanvas>
  );
}

function IdentityPage() {
  return (
    <AuthCanvas compactHeader supportPageId="004">
      <PageStepper pageId="004" />
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.4fr_0.75fr]">
        <Card className="p-6 md:p-8">
          <CardHeader className="flex flex-row gap-4">
            <IconBadge icon="user" />
            <div>
              <CardTitle>Identity Setup</CardTitle>
              <CardDescription>Create your secure WealthOS account.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <FieldShell icon="user" label="Full name" value={invitedUser.fullName} />
            <FieldShell helper="Email verified" icon="mail" label="Email address" value={invitedUser.email} />
            <FieldShell actionIcon={<Eye aria-hidden="true" className="size-4 text-alphavest-muted" />} helper="Use 12+ characters with letters, numbers and symbols." icon="lock" label="Password" value="create-strong-password" />
            <FieldShell actionIcon={<Eye aria-hidden="true" className="size-4 text-alphavest-muted" />} icon="lock" label="Confirm password" value="create-strong-password" />
            <div className="md:col-span-2">
              <FieldShell helper="Optional profile data is stored separately from account credentials." icon="phone" label="Phone number" value={invitedUser.phone} />
            </div>
            <p className={cn(secondaryButtonClass, "justify-between opacity-65 md:col-span-2")} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Identity document upload is not configured for this workspace." data-ux-interactive="false">
              <span className="flex items-center gap-2">
                <ShieldCheck aria-hidden="true" className="size-4 text-alphavest-gold-soft" />
                Set up with Single Sign-On
              </span>
              <Badge>SAML 2.0</Badge>
            </p>
            <StatePanel
              className="md:col-span-2"
              detail="Only account security and onboarding fields are collected at this stage."
              state="restricted"
              title="Data minimisation"
            />
          </CardContent>
        </Card>
        <SecurityPanel title="Your security matters" />
        <div className="flex justify-between gap-3 lg:col-span-2">
          <Link className={secondaryButtonClass} href="/onboarding/invite">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </Link>
          <Link className={cn(primaryButtonClass, "min-w-64")} href="/onboarding/consent">
            Continue
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </AuthCanvas>
  );
}

function ConsentPage() {
  const [policyOpen, setPolicyOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(policyDocuments[0]);
  const primaryPolicy = policyDocuments[0];
  const policyLifecycleCopy =
    "Review-only policy modal. Closing this modal does not accept terms, store consent records, create audit events or change role access.";

  return (
    <AuthCanvas compactHeader supportPageId="005">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="p-6 md:p-8">
          <CardHeader>
            <CardTitle>Consent and Privacy</CardTitle>
            <CardDescription>Please review and acknowledge the policies below to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {policyDocuments.map((policy) => (
              <button
                className="flex w-full flex-col gap-4 rounded-md border border-alphavest-border bg-alphavest-charcoal/40 p-4 text-left transition hover:border-alphavest-gold/50 sm:flex-row sm:items-center"
                data-ux-lifecycle-trigger="policy-review-modal"
                data-ux-lifecycle-result="opens-review-only-policy-modal"
                key={policy.title}
                onClick={() => {
                  setSelectedPolicy(policy);
                  setPolicyOpen(true);
                }}
                type="button"
              >
                <span className="flex w-full items-start gap-4 sm:min-w-0 sm:flex-1">
                  <IconBadge icon={policy.icon} />
                  <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-alphavest-ivory">{policy.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-alphavest-muted">{policy.detail}</span>
                  </span>
                </span>
                <span className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                  <Badge>{policy.version}</Badge>
                  <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-alphavest-gold-soft" />
                </span>
              </button>
            ))}
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-5">
              <label className="flex gap-3 text-sm leading-6 text-alphavest-ivory">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded border border-alphavest-border bg-alphavest-charcoal/50" />
                I have read, understood and agree to the Privacy Notice, Terms of Use and Data Use Consent.
              </label>
              <p className="mt-3 text-sm text-alphavest-muted">Required acknowledgements are stored as consent records.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-[0.55fr_1fr]">
              <p className={cn(secondaryButtonClass, "opacity-65")} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Policy download is not configured for this workspace." data-ux-interactive="false">
                <X aria-hidden="true" className="size-4 text-alphavest-gold-soft" />
                Decline and sign out
              </p>
              <Link className={cn(primaryButtonClass, "justify-center")} href="/onboarding/role-confirmation">
                <LockKeyhole aria-hidden="true" className="size-4" />
                Continue
              </Link>
            </div>
            <p className="text-sm text-alphavest-muted">Your data is protected in accordance with POPIA-aligned controls.</p>
          </CardContent>
        </Card>

        <Card className="h-fit p-6">
          <CardHeader className="flex flex-row gap-4">
            <IconBadge icon={primaryPolicy.icon} />
            <div>
              <CardTitle className="text-xl">{primaryPolicy.title}</CardTitle>
              <CardDescription>{primaryPolicy.version}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-alphavest-muted">{primaryPolicy.detail}</p>
            <div className="mt-5 rounded-md border border-alphavest-border bg-alphavest-navy/35 p-5">
              <h3 className="text-sm font-semibold text-alphavest-ivory">Key points</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-alphavest-muted">
                {primaryPolicy.keyPoints.map((point) => (
                  <li className="flex gap-2" key={point}>
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-alphavest-gold" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={cn(primaryButtonClass, "mt-5 w-full")}
              data-ux-lifecycle-trigger="policy-review-modal"
              data-ux-lifecycle-result="opens-review-only-policy-modal"
              onClick={() => {
                setSelectedPolicy(primaryPolicy);
                setPolicyOpen(true);
              }}
              type="button"
            >
              Review policy
            </button>
          </CardContent>
        </Card>
      </div>

      <Modal
        context={<StatePanel detail={policyLifecycleCopy} state="restricted" title="Review-only policy lifecycle" />}
        description={`${selectedPolicy.version} · Policy acknowledgement review`}
        footer={
          <button className={primaryButtonClass} onClick={() => setPolicyOpen(false)} type="button">
            Close policy review
          </button>
        }
        onClose={() => setPolicyOpen(false)}
        open={policyOpen}
        title={selectedPolicy.title}
      >
        <div className="space-y-4 text-sm leading-6 text-alphavest-muted" data-testid="uxp3-consent-policy-modal">
          <p>
            {selectedPolicy.detail}
          </p>
          <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/40 p-4">
            <h3 className="font-semibold text-alphavest-ivory">Key points</h3>
            <ul className="mt-3 space-y-2">
              {selectedPolicy.keyPoints.map((point) => (
                <li className="flex gap-2" key={point}>
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-alphavest-green" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <dl className="grid gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-alphavest-subtle">Document</dt>
              <dd className="mt-1 text-alphavest-ivory">{selectedPolicy.title}</dd>
            </div>
            <div>
              <dt className="text-xs text-alphavest-subtle">Version</dt>
              <dd className="mt-1 text-alphavest-ivory">{selectedPolicy.version}</dd>
            </div>
            <div>
              <dt className="text-xs text-alphavest-subtle">Lifecycle</dt>
              <dd className="mt-1 text-alphavest-ivory">Review only</dd>
            </div>
          </dl>
        </div>
      </Modal>
    </AuthCanvas>
  );
}

function RoleConfirmationPage() {
  const allowed = roleBoundaries.filter((item) => item.allowed);
  const denied = roleBoundaries.filter((item) => !item.allowed);
  const [invite, setInvite] = useState<DemoAuthStorage>({ email: invitedUser.email });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("Role acceptance activates pending user roles and records consent plus audit.");
  const scopes: Array<{ icon: AuthIconName; label: string; value: string }> = [
    { icon: "building", label: "Organization", value: invitedUser.tenant },
    { icon: "users", label: "Team", value: invitedUser.team }
  ];

  useEffect(() => {
    queueMicrotask(() => {
      setInvite(readDemoAuthStorage(invitedUser.email));
    });
  }, []);

  async function acceptInvite() {
    setStatus("submitting");
    const response = await fetch("/api/auth/dummy", {
      body: JSON.stringify({
        action: "accept_invite",
        consentAccepted: true,
        email: invite.email,
        token: invite.inviteToken,
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    const body = (await response.json()) as DemoAuthResponse;

    if (!response.ok || !body.ok) {
      setStatus("error");
      setMessage(body.error ?? "Invitation could not be accepted.");
      return;
    }

    setStatus("success");
    setMessage("Invitation accepted. User, role assignment, consent and audit state are now active in the DB.");
    window.location.href = "/client/home";
  }

  return (
    <AuthCanvas compactHeader supportPageId="006">
      <PageStepper pageId="006" />
      <Card className="mx-auto max-w-7xl p-6 md:p-8">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle>Role Confirmation</CardTitle>
              <CardDescription>Please review your role, permissions and access within the organization.</CardDescription>
            </div>
            <StatusChip label="Pending review" status="PENDING" />
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[1.05fr_1fr_0.9fr]">
          <Card className="border-alphavest-border/80 p-5">
            <CardHeader className="border-0 pb-0">
              <p className="text-sm font-semibold text-alphavest-ivory">Your role</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                <IconBadge className="size-20" icon="user" />
                <div>
                  <h2 className="font-display text-3xl text-alphavest-ivory">{invitedUser.role}</h2>
                  <p className="mt-2 font-semibold text-alphavest-gold-soft">{invitedUser.roleLevel}</p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-6 text-alphavest-muted">You were invited to join as an {invitedUser.role}.</p>
              <StatePanel
                className="mt-5"
                detail="This role is designed for analysis and reporting within defined boundaries."
                state="restricted"
                title="Permitted access"
              />
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-alphavest-border/80 p-5">
              <CardHeader className="border-0 pb-0">
                <p className="text-sm font-semibold text-alphavest-ivory">What you can do</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {allowed.map((item) => (
                  <div className="flex items-center justify-between gap-3 border-b border-alphavest-border/45 pb-3 last:border-0 last:pb-0" key={item.label}>
                    <span className="text-sm text-alphavest-muted">{item.label}</span>
                    <CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-alphavest-border/80 p-5">
              <CardHeader className="border-0 pb-0">
                <p className="text-sm font-semibold text-alphavest-ivory">Your access</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {scopes.map((scope) => {
                  const Icon = iconMap[scope.icon];
                  return (
                    <div className="flex items-center justify-between gap-4 border-b border-alphavest-border/45 pb-3 last:border-0 last:pb-0" key={scope.label}>
                      <span className="flex items-center gap-3 text-sm text-alphavest-muted">
                        <Icon aria-hidden="true" className="size-4 text-alphavest-gold-soft" />
                        {scope.label}
                      </span>
                      <span className="text-sm font-semibold text-alphavest-ivory">{scope.value}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="border-alphavest-border/80 p-5">
              <CardHeader className="border-0 pb-0">
                <p className="text-sm font-semibold text-alphavest-ivory">What you cannot do</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {denied.map((item) => (
                  <div className="flex items-center gap-3 border-b border-alphavest-border/45 pb-3 last:border-0 last:pb-0" key={item.label}>
                    <X aria-hidden="true" className="size-4 shrink-0 text-alphavest-subtle" />
                    <span className="text-sm text-alphavest-muted">{item.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4">
              <label className="flex gap-3 text-sm leading-6 text-alphavest-ivory">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded border border-alphavest-border bg-alphavest-charcoal/50" />
                I have read and understood the role limitations and will use access responsibly.
              </label>
            </div>
            <StatePanel
              detail={message}
              state={status === "error" ? "blocked" : status === "success" ? "success" : "restricted"}
              title="DB-backed activation"
            />
          </div>

          <div className="flex justify-between gap-3 border-t border-alphavest-border/60 pt-5 lg:col-span-3">
            <Link className={secondaryButtonClass} href="/onboarding/consent">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back
            </Link>
            <button className={cn(primaryButtonClass, "min-w-64")} disabled={status === "submitting"} onClick={() => void acceptInvite()} type="button">
              <LockKeyhole aria-hidden="true" className="size-4" />
              {status === "submitting" ? "Activating access" : "Confirm and continue"}
            </button>
          </div>
        </CardContent>
      </Card>
    </AuthCanvas>
  );
}

export function AuthOnboardingScreen({ pageId }: AuthOnboardingScreenProps) {
  if (!isAuthOnboardingPageId(pageId)) {
    return null;
  }

  if (pageId === "001") {
    return <LoginPage />;
  }

  if (pageId === "002") {
    return <MfaPage />;
  }

  if (pageId === "003") {
    return <InvitePage />;
  }

  if (pageId === "004") {
    return <IdentityPage />;
  }

  if (pageId === "005") {
    return <ConsentPage />;
  }

  return <RoleConfirmationPage />;
}
