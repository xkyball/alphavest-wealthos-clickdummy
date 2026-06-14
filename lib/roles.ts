export type Role =
  | "Principal"
  | "Spouse"
  | "Next Gen"
  | "Trustee"
  | "Family CFO"
  | "External Advisor"
  | "AlphaVest Analyst"
  | "Senior Advisor"
  | "Compliance Officer"
  | "Client Success"
  | "Admin / Operations"
  | "Security / Privacy Officer";

export type RoleType = "Primary" | "Family" | "Fiduciary" | "External" | "Internal" | "Compliance" | "Operations";

export type RoleDefinition = {
  role: Role;
  type: RoleType;
  scope: string;
  description: string;
  users: number;
  clientVisible: boolean;
  internalOnly: boolean;
};

export const roleDefinitions: RoleDefinition[] = [
  {
    role: "Principal",
    type: "Primary",
    scope: "Full family structure",
    description: "Primary account owner with family governance authority.",
    users: 1,
    clientVisible: true,
    internalOnly: false
  },
  {
    role: "Spouse",
    type: "Family",
    scope: "Family dashboard",
    description: "Family member with client-visible overview access.",
    users: 1,
    clientVisible: true,
    internalOnly: false
  },
  {
    role: "Next Gen",
    type: "Family",
    scope: "Scoped family view",
    description: "Restricted family role for selected entities and decisions.",
    users: 3,
    clientVisible: true,
    internalOnly: false
  },
  {
    role: "Trustee",
    type: "Fiduciary",
    scope: "Assigned trusts",
    description: "Fiduciary role with evidence access for assigned structures.",
    users: 2,
    clientVisible: true,
    internalOnly: false
  },
  {
    role: "Family CFO",
    type: "Fiduciary",
    scope: "Family office",
    description: "Financial oversight role for reporting and evidence review.",
    users: 4,
    clientVisible: true,
    internalOnly: false
  },
  {
    role: "External Advisor",
    type: "External",
    scope: "Explicitly assigned objects",
    description: "Outside professional with narrow, revocable access.",
    users: 2,
    clientVisible: false,
    internalOnly: true
  },
  {
    role: "AlphaVest Analyst",
    type: "Internal",
    scope: "Assigned client work",
    description: "Internal analyst for review points, evidence and notes.",
    users: 8,
    clientVisible: false,
    internalOnly: true
  },
  {
    role: "Senior Advisor",
    type: "Internal",
    scope: "Assigned advice workflows",
    description: "Advisor role that can approve for compliance review.",
    users: 5,
    clientVisible: false,
    internalOnly: true
  },
  {
    role: "Compliance Officer",
    type: "Compliance",
    scope: "Compliance queue and audit",
    description: "Compliance release, block and audit oversight.",
    users: 3,
    clientVisible: false,
    internalOnly: true
  },
  {
    role: "Client Success",
    type: "Operations",
    scope: "Client service tasks",
    description: "Operational support for intake and communication workflows.",
    users: 6,
    clientVisible: false,
    internalOnly: true
  },
  {
    role: "Admin / Operations",
    type: "Operations",
    scope: "Access administration",
    description: "Administrative permission management with policy checks.",
    users: 2,
    clientVisible: false,
    internalOnly: true
  },
  {
    role: "Security / Privacy Officer",
    type: "Compliance",
    scope: "Security and privacy audit",
    description: "Audit export and sensitive evidence oversight.",
    users: 1,
    clientVisible: false,
    internalOnly: true
  }
];

export function getRoleDefinition(role: Role) {
  return roleDefinitions.find((definition) => definition.role === role);
}
