import { BasisTheoryService } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type {
  CreateInboundProxy,
  UpdateInboundProxy,
  InboundProxy,
} from '@/types/models';
import type { ListInboundProxyQuery } from '@/types/sdk';

export const BasisTheoryInboundProxies = new CrudBuilder(
  class BasisTheoryInboundProxies extends BasisTheoryService {}
)
  .create<InboundProxy, CreateInboundProxy>()
  .retrieve<InboundProxy>()
  .update<InboundProxy, UpdateInboundProxy>()
  .delete()
  .list<InboundProxy, ListInboundProxyQuery>()
  .build();
