import { UserRoles, ResourceTypes, ActionTypes } from './roles.constants';
import { ActionType, ResourceType, UserRole } from './roles.types';

// export type Permission = {
//   resource: ResourceType;
//   actions: ActionType[];
// };

export type RoleConfig = Record<UserRole, { inherits: UserRole | null }>;

// apply role inheritance
export const ROLE_CONFIG: RoleConfig = {
  [UserRoles.OWNER]: {
    inherits: UserRoles.ADMIN,
  },
  [UserRoles.ADMIN]: {
    inherits: UserRoles.VIEWER,
  },
  [UserRoles.VIEWER]: {
    inherits: null,
  },
};
