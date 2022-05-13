import type { Auditable } from './shared';

const APPLICATION_TYPES = [
  'server_to_server',
  'public',
  'elements',
  'management',
] as const;

type ApplicationType = typeof APPLICATION_TYPES[number];

interface Application extends Auditable {
  id: string;
  tenantId: string;
  name: string;
  key?: string;
  type: ApplicationType;
  permissions: string[];
}

type CreateApplication = Pick<Application, 'name' | 'type'> &
  Partial<Pick<Application, 'permissions'>>;

type UpdateApplication = Partial<Pick<Application, 'name' | 'permissions'>>;

export type {
  ApplicationType,
  Application,
  CreateApplication,
  UpdateApplication,
};
export { APPLICATION_TYPES };
