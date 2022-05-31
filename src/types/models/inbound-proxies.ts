import type { Auditable } from './shared';

interface InboundProxy extends Auditable {
  id: string;
  key: string;
  tenantId: string;
  name: string;
  destinationUrl: string;
  requestReactorId: string;
}

type CreateInboundProxy = Pick<
  InboundProxy,
  'name' | 'destinationUrl' | 'requestReactorId'
>;

type UpdateInboundProxy = CreateInboundProxy;

export type { InboundProxy, CreateInboundProxy, UpdateInboundProxy };
