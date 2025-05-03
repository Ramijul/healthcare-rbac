import { ResourceTypes, ActionTypes, UserRoles } from './roles.constants';

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];

export type ActionType = (typeof ActionTypes)[keyof typeof ActionTypes];

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];
