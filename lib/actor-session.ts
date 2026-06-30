import {
  createDemoSession,
  currentActor as currentSeededActor,
  currentTenant as currentSeededTenant,
  defaultDemoSession,
  demoActors,
  demoPlatformTenantId,
  demoRoles,
  demoTenants,
  isDemoRoleKey,
  isDemoTenantSlug,
  requireDemoSession,
  resolveActorForRole,
  resolveDemoTenantMembership,
  resolveRole,
  resolveTenant,
  tryCreateDemoSession,
  type DemoActor,
  type DemoActorKey,
  type DemoRole,
  type DemoRoleKey,
  type DemoSession,
  type DemoSessionDraft,
  type DemoSessionIssue,
  type DemoSessionResolution,
  type DemoTenant,
  type DemoTenantMembership,
  type DemoTenantSlug,
} from "@/lib/demo-session";

export type ActorRoleKey = DemoRoleKey;
export type ActorTenantSlug = DemoTenantSlug;
export type ActorKey = DemoActorKey;
export type ActorRole = DemoRole;
export type ActorTenant = DemoTenant;
export type Actor = DemoActor;
export type ActorSession = DemoSession;
export type ActorTenantMembership = DemoTenantMembership;
export type ActorSessionDraft = DemoSessionDraft;
export type ActorSessionIssue = DemoSessionIssue;
export type ActorSessionResolution = DemoSessionResolution;

export const actorPlatformTenantId = demoPlatformTenantId;
export const actorRoles = demoRoles;
export const actorTenants = demoTenants;
export const actors = demoActors;
export const defaultActorSession = defaultDemoSession;

export const createActorSession = createDemoSession;
export const tryCreateActorSession = tryCreateDemoSession;
export const requireActorSession = requireDemoSession;
export const currentActor = currentSeededActor;
export const currentTenant = currentSeededTenant;
export const isActorRoleKey = isDemoRoleKey;
export const isActorTenantSlug = isDemoTenantSlug;
export const resolveActorTenant = resolveTenant;
export const resolveActorRole = resolveRole;
export const resolveActorForRoleKey = resolveActorForRole;
export const resolveActorTenantMembership = resolveDemoTenantMembership;
