import { ActionType, ResourceType, UserRole } from './roles.constants';
import { Permission, ROLE_CONFIG } from './roles.permissions';

export function getAllPermissions(role: UserRole): Permission[] {
  const permissions: Permission[] = [];
  let currentRole: UserRole | null = role;

  while (currentRole) {
    permissions.push(...ROLE_CONFIG[currentRole].permissions);
    currentRole = ROLE_CONFIG[currentRole].inherits;
  }

  return permissions;
}

export function hasPermission(
  userRole: UserRole,
  required: { resource: ResourceType; action: ActionType },
): boolean {
  const userPermissions = getAllPermissions(userRole);

  return userPermissions.some(
    (perm) =>
      perm.resource === required.resource &&
      perm.actions.includes(required.action),
  );
}
