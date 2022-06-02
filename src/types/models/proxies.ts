import type { Auditable } from './shared';

interface Proxy extends Auditable {
  id: string;
  key: string;
  tenantId: string;
  name: string;
  destinationUrl: string;
  requestReactorId: string;
}

type CreateProxy = Pick<Proxy, 'name' | 'destinationUrl' | 'requestReactorId'>;

type UpdateProxy = CreateProxy;

export type { Proxy, CreateProxy, UpdateProxy };
