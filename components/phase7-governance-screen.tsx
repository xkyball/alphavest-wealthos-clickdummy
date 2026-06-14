"use client";

import { useMemo, useState } from "react";
import { auditEventForAction } from "@/lib/audit";
import { evidenceForEvent } from "@/lib/evidence";
import {
  evaluateAccessControl,
  rolePermissions,
  type PermissionAction
} from "@/lib/permissions";
import { getRoleDefinition, roleDefinitions, type Role } from "@/lib/roles";
import {
  cn,
  DashboardTable,
  Drawer,
  GlassPanel,
  Modal,
  StatusChip,
  WorkflowBadge
} from "./ui";
import { findDemoWorkflow, useDemoSession } from "./use-demo-session";

const matrixActions: Array<{ action: PermissionAction; label: string }> = [
  { action: "view_entities", label: "View Entities" },
  { action: "view_documents", label: "View Documents" },
  { action: "upload_documents", label: "Upload Documents" },
  { action: "create_decision", label: "Create Decision" },
  { action: "review_recommendation", label: "Review Recommendation" },
  { action: "approve_advice", label: "Approve Advice" },
  { action: "release_to_client", label: "Release to Client" },
  { action: "manage_permissions", label: "Manage Permissions" },
  { action: "view_restricted_evidence", label: "Restricted Evidence" },
  { action: "export_audit_logs", label: "Audit History" }
];

const auditRows = [
  ["2026-06-14 09:14 UTC", "Principal", "External Advisor", "access.blocked", "Missing second confirmation", "High"],
  ["2026-06-14 09:22 UTC", "Principal", "External Advisor", "access.changed", "Second confirmation complete", "Medium"],
  ["2026-06-13 16:40 UTC", "Compliance Officer", "Senior Advisor", "permission.reviewed", "Release role checked", "Medium"],
  ["2026-06-13 12:05 UTC", "Admin / Operations", "Next Gen", "access.changed", "Scoped evidence view", "Low"]
];

function permissionCell(role: Role, action: PermissionAction) {
  const allowed = rolePermissions[role].includes(action);
  const sensitive = ["approve_advice", "release_to_client", "manage_permissions", "view_restricted_evidence", "export_audit_logs"].includes(action);

  if (!allowed) {
    return <span className="text-av-danger">Denied</span>;
  }

  if (sensitive) {
    return <span className="text-av-warning">Conditional</span>;
  }

  return <span className="text-av-success">Allowed</span>;
}

function PermissionMatrixTable({ selectedRole, onSelectRole }: { selectedRole: Role; onSelectRole: (role: Role) => void }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-av-line">
      <table className="min-w-[64rem] w-full border-collapse text-left text-xs">
        <thead className="bg-av-panelSoft text-av-goldBright">
          <tr>
            <th className="sticky left-0 z-10 border-b border-av-line bg-av-panelSoft px-3 py-3">Role</th>
            {matrixActions.map((item) => (
              <th className="border-b border-av-line px-3 py-3" key={item.action}>
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roleDefinitions.slice(0, 9).map((definition) => (
            <tr
              className={cn(
                "odd:bg-white/[0.02]",
                selectedRole === definition.role && "bg-av-gold/10"
              )}
              key={definition.role}
            >
              <td className="sticky left-0 z-10 border-b border-av-line/50 bg-av-panel px-3 py-3">
                <button
                  className="text-left text-av-ivory hover:text-av-goldBright"
                  onClick={() => onSelectRole(definition.role)}
                  type="button"
                >
                  <span className="block font-semibold">{definition.role}</span>
                  <span className="text-[0.68rem] text-av-muted">{definition.type}</span>
                </button>
              </td>
              {matrixActions.map((item) => (
                <td className="border-b border-av-line/50 px-3 py-3" key={`${definition.role}-${item.action}`}>
                  {permissionCell(definition.role, item.action)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleDetailDrawer({ role, permissionReason }: { role: Role; permissionReason: string }) {
  const definition = getRoleDefinition(role) ?? roleDefinitions[0];
  const effectivePermissions = rolePermissions[role];
  const sensitivePermissions = effectivePermissions.filter((permission) =>
    ["approve_advice", "release_to_client", "manage_permissions", "view_restricted_evidence", "export_audit_logs", "grant_external_access"].includes(permission)
  );

  return (
    <Drawer title="Role Detail">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-av-ivory">{definition.role}</p>
          <p className="mt-1 text-xs text-av-muted">{definition.description}</p>
        </div>
        <StatusChip tone={definition.internalOnly ? "review" : "success"}>
          {definition.internalOnly ? "Internal Only" : "Client Visible"}
        </StatusChip>
      </div>

      <div className="mt-4 grid gap-2 text-xs">
        {[
          ["Type", definition.type],
          ["Scope", definition.scope],
          ["Users", String(definition.users)],
          ["Current access decision", permissionReason]
        ].map(([label, value]) => (
          <div className="flex justify-between gap-3 rounded border border-av-line/50 bg-av-midnight/45 px-3 py-2" key={label}>
            <span className="text-av-muted">{label}</span>
            <span className="text-right text-av-ivory">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase text-av-goldBright">Sensitive permissions</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {sensitivePermissions.length > 0 ? (
            sensitivePermissions.map((permission) => (
              <StatusChip key={permission} tone="warning">{permission.replaceAll("_", " ")}</StatusChip>
            ))
          ) : (
            <StatusChip tone="neutral">None</StatusChip>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-av-warning/60 bg-av-warning/10 p-3 text-xs text-av-muted">
        Sensitive changes require second confirmation, policy review where applicable, evidence creation and an immutable audit event.
      </div>
    </Drawer>
  );
}

function SecondConfirmationModal({ allowed, onConfirm }: { allowed: boolean; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-av-midnight/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl">
        <Modal title="Second Confirmation Required">
          <div className="rounded-lg border border-av-warning/60 bg-av-warning/10 p-3">
            You are granting sensitive access that can affect client data, reports or system security.
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded border border-av-line/60 p-3">
              <p className="font-semibold text-av-ivory">Change summary</p>
              <p className="mt-1 text-xs">Release to Client for selected accounts.</p>
            </div>
            <div className="rounded border border-av-line/60 p-3">
              <p className="font-semibold text-av-ivory">Affected role</p>
              <p className="mt-1 text-xs">External Advisor</p>
            </div>
            <div className="rounded border border-av-line/60 p-3">
              <p className="font-semibold text-av-ivory">Why sensitive</p>
              <p className="mt-1 text-xs">May expose client reports externally.</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-av-muted">
            Confirmation phrase: GRANT RELEASE TO CLIENT
          </p>
          <button
            className="mt-4 w-full rounded-lg border border-av-gold bg-av-gold px-4 py-3 text-sm font-semibold text-av-midnight"
            disabled={allowed}
            onClick={onConfirm}
            type="button"
          >
            Confirm and apply change
          </button>
        </Modal>
      </div>
    </div>
  );
}

export function Phase7GovernanceScreen({
  initialSurface
}: {
  initialSurface?: "second-confirmation";
}) {
  const [selectedRole, setSelectedRole] = useState<Role>("External Advisor");
  const [confirmed, setConfirmed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(initialSurface === "second-confirmation");
  const [showBlocked, setShowBlocked] = useState(true);
  const { snapshot, transition, error } = useDemoSession();
  const accessWorkflow = findDemoWorkflow(snapshot, "wf-external-advisor-access");

  const decision = evaluateAccessControl({
    role: selectedRole,
    objectType: "permission",
    objectScope: selectedRole === "External Advisor" ? "selected_accounts" : "family",
    action: selectedRole === "External Advisor" ? "release_to_client" : "manage_permissions",
    sensitivity: "high_risk",
    clientVisible: false,
    internalOnly: true,
    secondConfirmation: confirmed || accessWorkflow?.state === "access_granted",
    complianceReview: selectedRole !== "External Advisor" || confirmed || accessWorkflow?.state === "access_granted",
    relationshipAllowed: selectedRole !== "Next Gen"
  });
  const evidence = useMemo(
    () =>
      evidenceForEvent(decision.allowed || accessWorkflow?.state === "access_granted" ? "access.changed" : "access.blocked", {
        actorRole: "Principal",
        objectId: "access-772"
      }),
    [decision.allowed, accessWorkflow?.state]
  );
  const audit = useMemo(
    () =>
      auditEventForAction({
        actorRole: "Principal",
        action: decision.allowed || accessWorkflow?.state === "access_granted" ? "access.changed" : "access.blocked",
        objectType: "Access Change Record",
        objectId: "access-772",
        result: decision.allowed || accessWorkflow?.state === "access_granted" ? "updated" : "blocked"
      }),
    [decision.allowed, accessWorkflow?.state]
  );

  return (
    <main className="min-h-screen bg-av-midnight px-4 py-6 text-av-ivory md:px-8">
      <div className="mx-auto grid max-w-[104rem] gap-5">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-av-line pb-4">
          <div>
            <p className="text-sm uppercase text-av-goldBright">Security and Access</p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-av-ivory">Roles and Permissions</h1>
            <p className="mt-2 max-w-3xl text-sm text-av-muted">
              Manage role authority, sensitive permission changes, access evidence and audit history.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted" type="button">New Role</button>
            <button className="rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted" type="button">Export Matrix</button>
            <button className="rounded-lg border border-av-gold bg-av-gold px-4 py-2 text-sm font-semibold text-av-midnight" type="button">
              Save Changes
            </button>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_25rem]">
          <div className="grid gap-5">
            <GlassPanel title="Role Permission Matrix">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <StatusChip tone="success">Allowed</StatusChip>
                  <StatusChip tone="danger">Denied</StatusChip>
                  <StatusChip tone="warning">Conditional</StatusChip>
                  <StatusChip tone="review">Sensitive</StatusChip>
                </div>
                <p className="text-xs text-av-muted">Showing {roleDefinitions.slice(0, 9).length} roles</p>
              </div>
              <PermissionMatrixTable selectedRole={selectedRole} onSelectRole={setSelectedRole} />
            </GlassPanel>

            {showBlocked && !decision.allowed ? (
              <GlassPanel
                actions={
                  <button
                    className="rounded border border-av-line px-3 py-1 text-xs text-av-muted"
                    onClick={() => setShowBlocked(false)}
                    type="button"
                  >
                    Dismiss
                  </button>
                }
                title={decision.secondConfirmationRequired ? "Second Confirmation Required" : "Permission Blocked"}
              >
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_18rem]">
                  <div>
                    <WorkflowBadge label="BLOCKED" />
                    <p className="mt-3 text-sm text-av-ivory">
                      This access change cannot be applied until the central permission decision passes.
                    </p>
                    <p className="mt-2 text-sm text-av-muted">Reason: {decision.blockedReason}.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {decision.notes.map((note) => (
                        <StatusChip key={note} tone="warning">{note}</StatusChip>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <button
                      className="rounded-lg border border-av-gold px-4 py-2 text-sm text-av-goldBright"
                      onClick={() => setShowConfirmation(true)}
                      type="button"
                    >
                      Confirm sensitive change
                    </button>
                    <button className="rounded-lg border border-av-danger px-4 py-2 text-sm text-av-danger" type="button">
                      Request approval
                    </button>
                  </div>
                </div>
              </GlassPanel>
            ) : null}

            <GlassPanel title="Audit Access History">
              <DashboardTable
                columns={["Timestamp", "Actor", "Target role", "Action", "Reason", "Severity"]}
                rows={auditRows}
              />
            </GlassPanel>
          </div>

          <div className="grid content-start gap-5">
            <RoleDetailDrawer role={selectedRole} permissionReason={decision.blockedReason} />
            <GlassPanel title="Permission Decision">
              <div className="grid gap-2 text-xs">
                {[
                  ["Role", selectedRole],
                  ["Action", selectedRole === "External Advisor" ? "release_to_client" : "manage_permissions"],
                  ["Runtime workflow", accessWorkflow ? `${accessWorkflow.workflow} / ${accessWorkflow.state}` : "Loading"],
                  ["Second confirmation", confirmed || accessWorkflow?.state === "access_granted" ? "Complete" : "Required"],
                  ["Compliance review", decision.complianceReviewRequired ? "Required" : "Satisfied"],
                  ["Result", decision.allowed ? "Allowed" : "Blocked"]
                ].map(([label, value]) => (
                  <div className="flex justify-between gap-3 rounded border border-av-line/50 bg-av-midnight/45 px-3 py-2" key={label}>
                    <span className="text-av-muted">{label}</span>
                    <span className="text-right text-av-ivory">{value}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
            <GlassPanel title="Evidence and Audit Output">
              <div className="grid gap-2 text-xs text-av-muted">
                <p>Evidence: {evidence.link}</p>
                <p>Audit action: {audit.action}</p>
                <p>Audit result: {audit.result}</p>
                <p>Digital seal: {audit.digitalSeal}</p>
                {error ? <p className="text-av-danger">{error}</p> : null}
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>

      {showConfirmation ? (
        <SecondConfirmationModal
          allowed={decision.allowed}
          onConfirm={async () => {
            setConfirmed(true);
            await transition({
              action: "access.confirm_sensitive_change",
              actorRole: "Principal"
            });
            setShowConfirmation(false);
            setShowBlocked(false);
          }}
        />
      ) : null}
    </main>
  );
}
