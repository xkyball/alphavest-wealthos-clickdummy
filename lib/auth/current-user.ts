import { UserStatus, type Prisma, type PrismaClient } from "@prisma/client";

import { authJwtFromRequest, verifyAuthJwt, type AuthJwtClaims } from "@/lib/auth/auth-jwt";

const activeAssignmentStatuses = new Set(["active", "pending", "invited"]);

type LoadedUser = Prisma.UserGetPayload<{
  include: {
    userRoles: {
      include: {
        clientTenant: { select: { displayName: true; id: true } };
        role: { select: { id: true; key: true; name: true; scope: true } };
      };
      orderBy: { updatedAt: "desc" };
    };
  };
}>;

export type CurrentUserContext = {
  actor: {
    displayName: string;
    email: string;
    id: string;
    status: string;
  };
  auth: {
    expiresAt: string;
    provider: "db-user-jwt";
  };
  memberships: Array<{
    objectScope?: {
      objectId: string;
      objectType: string;
    };
    role: {
      id: string;
      key: string;
      name: string;
      scope: string;
    };
    status: string;
    tenant?: {
      displayName: string;
      id: string;
    };
    userRoleId: string;
    validUntil: string | null;
  }>;
  objectScopes: Array<{
    objectId: string;
    objectType: string;
    tenantId: string | null;
    userRoleId: string;
  }>;
  role?: {
    id: string;
    key: string;
    name: string;
    scope: string;
    userRoleId: string;
  };
  tenant?: {
    displayName: string;
    id: string;
  };
};

function primaryRoleAssignment(user: LoadedUser, claims: AuthJwtClaims) {
  const activeAssignments = user.userRoles.filter((assignment) => activeAssignmentStatuses.has(assignment.status));

  return (
    activeAssignments.find((assignment) => assignment.id === claims.userRoleId) ??
    activeAssignments.find((assignment) => assignment.role.key === claims.roleKey && assignment.clientTenantId === claims.tenantId) ??
    activeAssignments.find((assignment) => assignment.role.key === claims.roleKey && !claims.tenantId) ??
    activeAssignments[0]
  );
}

function safeContextForUser(user: LoadedUser, claims: AuthJwtClaims): CurrentUserContext {
  const assignment = primaryRoleAssignment(user, claims);
  const memberships = user.userRoles
    .filter((candidate) => activeAssignmentStatuses.has(candidate.status))
    .map((candidate) => ({
      ...(candidate.objectId && candidate.objectType
        ? {
            objectScope: {
              objectId: candidate.objectId,
              objectType: candidate.objectType,
            },
          }
        : {}),
      role: {
        id: candidate.role.id,
        key: candidate.role.key,
        name: candidate.role.name,
        scope: candidate.role.scope,
      },
      status: candidate.status,
      ...(candidate.clientTenant
        ? {
            tenant: {
              displayName: candidate.clientTenant.displayName,
              id: candidate.clientTenant.id,
            },
          }
        : {}),
      userRoleId: candidate.id,
      validUntil: candidate.validUntil?.toISOString() ?? null,
    }));
  const objectScopes = user.userRoles
    .filter((candidate) => activeAssignmentStatuses.has(candidate.status) && candidate.objectId && candidate.objectType)
    .map((candidate) => ({
      objectId: candidate.objectId as string,
      objectType: candidate.objectType as string,
      tenantId: candidate.clientTenantId,
      userRoleId: candidate.id,
    }));

  return {
    actor: {
      displayName: user.displayName,
      email: user.email,
      id: user.id,
      status: user.status,
    },
    auth: {
      expiresAt: new Date(claims.exp * 1000).toISOString(),
      provider: "db-user-jwt",
    },
    memberships,
    objectScopes,
    ...(assignment
      ? {
          role: {
            id: assignment.role.id,
            key: assignment.role.key,
            name: assignment.role.name,
            scope: assignment.role.scope,
            userRoleId: assignment.id,
          },
        }
      : {}),
    ...(assignment?.clientTenant
      ? {
          tenant: {
            displayName: assignment.clientTenant.displayName,
            id: assignment.clientTenant.id,
          },
        }
      : {}),
  };
}

export async function resolveCurrentUserFromToken(prisma: PrismaClient, token?: string | null) {
  const claims = verifyAuthJwt(token);
  const user = await prisma.user.findUnique({
    include: {
      userRoles: {
        include: {
          clientTenant: { select: { displayName: true, id: true } },
          role: { select: { id: true, key: true, name: true, scope: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
    where: { id: claims.sub },
  });

  if (!user || user.email !== claims.email) {
    throw new Error("Auth JWT user could not be resolved.");
  }

  if (user.status !== UserStatus.ACTIVE && user.status !== UserStatus.INVITED) {
    throw new Error("Auth JWT user is not active.");
  }

  return safeContextForUser(user, claims);
}

export async function resolveCurrentUserFromRequest(prisma: PrismaClient, request: Request) {
  return resolveCurrentUserFromToken(prisma, authJwtFromRequest(request));
}
