import type { CreateProxy, Proxy, UpdateProxy } from '@/types/models/proxies';
import type {
  Create,
  Delete,
  List,
  PaginatedQuery,
  Retrieve,
  Update,
} from '@/types/sdk';

interface ListProxyQuery extends PaginatedQuery {
  id?: string | string[];
  name?: string;
}

interface Proxies
  extends Create<Proxy, CreateProxy>,
    Retrieve<Proxy>,
    Update<Proxy, UpdateProxy>,
    Delete,
    List<Proxy, ListProxyQuery> {}

export type { Proxies, ListProxyQuery };
