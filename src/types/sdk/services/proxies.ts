import type {
  CreateProxy,
  PatchProxy,
  Proxy,
  UpdateProxy,
} from '@/types/models/proxies';
import type {
  Create,
  Delete,
  List,
  PaginatedQuery,
  Retrieve,
  Update,
  Patch,
} from '@/types/sdk';

interface ListProxyQuery extends PaginatedQuery {
  id?: string | string[];
  name?: string;
}

interface Proxies
  extends Create<Proxy, CreateProxy>,
    Retrieve<Proxy>,
    Update<Proxy, UpdateProxy>,
    Patch<PatchProxy>,
    Delete,
    List<Proxy, ListProxyQuery> {}

export type { Proxies, ListProxyQuery };
