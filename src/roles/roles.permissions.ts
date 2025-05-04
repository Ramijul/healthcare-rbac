import { UserRoles } from './roles.constants';
import { RoleConfig } from './roles.types';

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
