import { BasisTheoryService } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type { CreateProxy, UpdateProxy, Proxy } from '@/types/models';
import type { ListProxyQuery } from '@/types/sdk';

export const BasisTheoryProxies = new CrudBuilder(
  class BasisTheoryProxies extends BasisTheoryService {}
)
  .create<Proxy, CreateProxy>()
  .retrieve<Proxy>()
  .update<Proxy, UpdateProxy>()
  .delete()
  .list<Proxy, ListProxyQuery>()
  .build();
