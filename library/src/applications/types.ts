import type { PaginatedQuery } from '../service';

const APPLICATION_TYPES = [
  'server_to_server',
  'public',
  'elements',
  'management',
] as const;

type ApplicationType = typeof APPLICATION_TYPES[number];

interface Application {
  id: string;
  tenantId: string;
  name: string;
  key?: string;
  type: ApplicationType;
  permissions: string[];
  createdAt: string;
  modifiedAt: string;
}

type CreateApplicationModel = Pick<Application, 'name' | 'type'> &
  Partial<Pick<Application, 'permissions'>>;

type UpdateApplicationModel = Partial<
  Pick<Application, 'name' | 'permissions'>
>;

interface ApplicationQuery extends PaginatedQuery {
  id?: string | string[];
}

export {
  APPLICATION_TYPES,
  ApplicationType,
  Application,
  CreateApplicationModel,
  UpdateApplicationModel,
  ApplicationQuery,
};
