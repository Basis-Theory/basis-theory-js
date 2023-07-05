import type { Application } from './applications';
import type { Auditable } from './shared';
import type { Nullable } from './util';

interface Proxy extends Auditable {
  id: string;
  key: string;
  tenantId: string;
  name: string;
  destinationUrl: string;
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
  | 'requestTransform'
  | 'responseTransform'
  | 'configuration'
  | 'requireAuth'
> & {
  application?: Pick<Application, 'id'>;
};

type UpdateProxy = CreateProxy;
type PatchProxy =
  | Partial<UpdateProxy>
  | {
      configuration?: Nullable<UpdateProxy['configuration']>;
    };

export type { Proxy, CreateProxy, UpdateProxy, PatchProxy };
