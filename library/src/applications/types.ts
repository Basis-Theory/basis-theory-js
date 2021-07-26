import type { PaginatedQuery } from '../service';

export const APPLICATION_TYPES = [
  'server_to_server',
  'public',
  'elements',
  'management',
] as const;

export type ApplicationType = typeof APPLICATION_TYPES[number];

export interface Application {
  id: string;
  tenantId: string;
  name: string;
  key?: string;
  type: ApplicationType;
  permissions: string[];
  createdAt: string;
  modifiedAt: string;
}

export type CreateApplicationModel = Pick<Application, 'name' | 'type'> &
  Partial<Pick<Application, 'permissions'>>;

export type UpdateApplicationModel = Partial<
  Pick<Application, 'name' | 'permissions'>
>;

export interface ApplicationQuery extends PaginatedQuery {
  id?: string | string[];
}
