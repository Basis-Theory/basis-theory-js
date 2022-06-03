import type { Auditable } from './shared';

interface Proxy extends Auditable {
  id: string;
  key: string;
  tenantId: string;
  name: string;
  destinationUrl: string;
  requestReactorId: string;
  requireAuth?: boolean;
}

type CreateProxy = Pick<
  Proxy,
  'name' | 'destinationUrl' | 'requestReactorId' | 'requireAuth'
>;

type UpdateProxy = CreateProxy;

export type { Proxy, CreateProxy, UpdateProxy };
