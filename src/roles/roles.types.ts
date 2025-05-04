import { UserRoles } from './roles.constants';

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export type RoleConfig = Record<UserRole, { inherits: UserRole | null }>;
