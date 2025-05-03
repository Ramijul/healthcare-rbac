export const ResourceType = {
  PATIENT_RECORD: 'patient_record',
} as const;

export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

export const ActionType = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export const UserRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  VIEWER: 'viewer',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
