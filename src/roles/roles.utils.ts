import { ROLE_CONFIG } from './roles.permissions';
import { UserRole } from './roles.types';

/**
 * Get all roles the user has inheritted along with the assigned role
 *
 * @param role
 * @returns
 */
export function getAllAssignableRoles(role: UserRole): UserRole[] {
  const roles: UserRole[] = [role];
  let currentRole: UserRole | null = role;

  while (currentRole) {
    const inherittedRole = ROLE_CONFIG[currentRole].inherits;
    if (inherittedRole) roles.push(inherittedRole);

    currentRole = ROLE_CONFIG[currentRole].inherits;
  }

  return roles;
}

/**
 * Check if the user inherently has the required role
 *
 * @param userRole
 * @param required
 * @returns
 */
export function hasPermission(userRole: UserRole, required: UserRole): boolean {
  const assignedRoles = getAllAssignableRoles(userRole);

  return assignedRoles.includes(required);
}
