export const ResourceTypes = {
  PATIENT_RECORD: 'patient_record',
} as const;

export const ActionTypes = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
} as const;

export const UserRoles = {
  OWNER: 'owner',
  ADMIN: 'admin',
  VIEWER: 'viewer',
} as const;
