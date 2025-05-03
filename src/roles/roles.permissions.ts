import { ActionType, ResourceType, UserRole } from './roles.constants';

export type Permission = {
  resource: ResourceType;
  actions: ActionType[];
};

export type RoleConfig = Record<
  UserRole,
  { inherits: UserRole | null; permissions: Permission[] }
>;

export const ROLE_CONFIG: RoleConfig = {
  [UserRole.OWNER]: {
    inherits: UserRole.ADMIN,
    permissions: [
      {
        resource: ResourceType.PATIENT_RECORD,
        actions: [ActionType.DELETE],
      },
    ],
  },
  [UserRole.ADMIN]: {
    inherits: UserRole.VIEWER,
    permissions: [
      {
        resource: ResourceType.PATIENT_RECORD,
        actions: [ActionType.EDIT, ActionType.CREATE],
      },
    ],
  },
  [UserRole.VIEWER]: {
    inherits: null,
    permissions: [
      {
        resource: ResourceType.PATIENT_RECORD,
        actions: [ActionType.VIEW],
      },
    ],
  },
};
