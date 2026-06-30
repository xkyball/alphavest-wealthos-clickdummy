import { BadgeCheck, FileWarning, LockKeyhole, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SeedMetric = {
  label: string;
  value: string;
  detail: string;
  tone: "gold" | "green" | "blue" | "red";
};

export type SeedGate = {
  label: string;
  status: "Ready" | "Pending" | "Deferred";
  detail: string;
};

export type SeedPrinciple = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const seedContext = {
  actorName: "Naledi Mokoena",
  actorInitials: "NM",
  role: "Compliance Officer",
  tenant: "Bennett Family Office",
  sessionLabel: "Local session"
};

export const seedMetrics: SeedMetric[] = [
  {
    label: "Seed tenants",
    value: "4",
    detail: "Seeded tenant contexts are available for fast switching.",
    tone: "gold"
  },
  {
    label: "Client visibility",
    value: "0",
    detail: "No unreleased recommendation is allowed through the gate.",
    tone: "green"
  },
  {
    label: "Major roles",
    value: "11",
    detail: "Seeded roles cover client, advisor, compliance and platform work.",
    tone: "blue"
  },
  {
    label: "Real auth",
    value: "Off",
    detail: "Authentication remains deferred by the implementation sequence.",
    tone: "red"
  }
];

export const seedGates: SeedGate[] = [
  {
    label: "Advisor review",
    status: "Ready",
    detail: "Advisor approval is represented in the central workflow gate."
  },
  {
    label: "Compliance release",
    status: "Ready",
    detail: "Compliance release is required before client visibility."
  },
  {
    label: "Evidence record",
    status: "Ready",
    detail: "Evidence service stubs create draft records for later persistence."
  },
  {
    label: "Audit event",
    status: "Ready",
    detail: "Audit service stubs preview sensitive action events."
  }
];

export const seedPrinciples: SeedPrinciple[] = [
  {
    title: "Human reviewed",
    description: "Advisor review is tracked, but client release still requires compliance and evidence.",
    icon: BadgeCheck
  },
  {
    title: "Evidence backed",
    description: "Evidence stubs are ready for later workflow persistence.",
    icon: ShieldCheck
  },
  {
    title: "Sensitive by default",
    description: "Seed context carries actor, role, tenant, sensitivity and visibility state.",
    icon: LockKeyhole
  },
  {
    title: "Clean UI",
    description: "Role and tenant controls are real app UI, not spec metadata.",
    icon: FileWarning
  }
];
