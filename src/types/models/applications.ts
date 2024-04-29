import type { Auditable } from './shared';

const APPLICATION_TYPES = ['private', 'public', 'management'] as const;
const TRANSFORM_TYPES = ['mask', 'redact', 'reveal'] as const;

type ApplicationType = typeof APPLICATION_TYPES[number];
type TransformType = typeof TRANSFORM_TYPES[number];

interface Application extends Auditable {
  id: string;
  tenantId: string;
  name?: string;
  /**
   * @deprecated use `keys` instead.
   */
  key?: string;
  keys?: ApplicationKey[];
  type: ApplicationType;
  permissions?: string[];
  rules?: AccessRule[];
  expiresAt?: string;
}

interface AccessRule {
  description: string;
  priority: number;
  container?: string;
  transform: TransformType;
  permissions: string[];
  conditions?: Condition[];
}

type Condition = {
  attribute: string;
  operator: string;
  value: string;
};

type ApplicationKey = {
  id?: string;
  key?: string;
  createAt?: string;
  createdBy?: string;
};

type CreateApplication = Pick<
  Application,
  'name' | 'type' | 'permissions' | 'rules' | 'expiresAt'
> & { createKey?: boolean };

type UpdateApplication = Pick<Application, 'name' | 'permissions' | 'rules'>;

export type {
  Application,
  ApplicationKey,
  ApplicationType,
  CreateApplication,
  TransformType,
  UpdateApplication,
};
export { APPLICATION_TYPES, TRANSFORM_TYPES, AccessRule };
