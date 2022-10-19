import type { Auditable } from './shared';

const APPLICATION_TYPES = ['private', 'public', 'management'] as const;
const TRANSFORM_TYPES = ['mask', 'redact', 'reveal'] as const;

type ApplicationType = typeof APPLICATION_TYPES[number];
type TransformType = typeof TRANSFORM_TYPES[number];

interface Application extends Auditable {
  id: string;
  tenantId: string;
  name: string;
  key?: string;
  type: ApplicationType;
  permissions?: string[];
  rules?: AccessRule[];
}

interface AccessRule {
  description: string;
  priority: number;
  container: string;
  transform: TransformType;
  permissions: string[];
}

type CreateApplication = Pick<Application, 'name' | 'type'> &
  Partial<Pick<Application, 'permissions' | 'rules'>>;

type UpdateApplication = Partial<
  Pick<Application, 'name' | 'permissions' | 'rules'>
>;

export type {
  ApplicationType,
  Application,
  CreateApplication,
  TransformType,
  UpdateApplication,
};
export { APPLICATION_TYPES, TRANSFORM_TYPES };
