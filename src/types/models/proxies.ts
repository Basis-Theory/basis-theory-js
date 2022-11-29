import type { Application } from './applications';
import type { Auditable } from './shared';

interface Proxy extends Auditable {
  id: string;
  key: string;
  tenantId: string;
  name: string;
  destinationUrl: string;
  requestReactorId?: string;
  responseReactorId?: string;
  requestTransform?: ProxyTransform;
  responseTransform?: ProxyTransform;
  applicationId?: string;
  configuration?: Record<string, string>;
  requireAuth?: boolean;
}

interface ProxyTransform {
  code: string;
}

type CreateProxy = Pick<
  Proxy,
  | 'name'
  | 'destinationUrl'
  | 'requestReactorId'
  | 'responseReactorId'
  | 'requestTransform'
  | 'responseTransform'
  | 'configuration'
  | 'requireAuth'
> & {
  application?: Pick<Application, 'id'>;
};

type UpdateProxy = CreateProxy;

export type { Proxy, CreateProxy, UpdateProxy };
