import type { ApplicationType } from '../applications';

export const PERMISSION_TYPES = [
  'tenant:read',
  'tenant:update',
  'tenant:delete',
  'application:read',
  'application:create',
  'application:update',
  'application:create',
  'reactor:read',
  'reactor:create',
  'reactor:update',
  'reactor:delete',
  'log:read',
  'token:read',
  'token:create',
  'token:delete',
  'token:decrypt',
  'card:read',
  'card:create',
  'card:update',
  'card:delete',
  'bank:read',
  'bank:create',
  'bank:update',
  'bank:delete',
  'bank:decrypt',
] as const;

export type PermissionType = typeof PERMISSION_TYPES[number];

export interface Permission {
  type: PermissionType;
  description: string;
  applicationTypes: ApplicationType[];
}
