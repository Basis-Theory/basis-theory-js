import type {
  CreateInboundProxy,
  InboundProxy,
  UpdateInboundProxy,
} from '@/types/models/inbound-proxies';
import type {
  Create,
  Delete,
  List,
  PaginatedQuery,
  Retrieve,
  Update,
} from '@/types/sdk';

interface ListInboundProxyQuery extends PaginatedQuery {
  id?: string | string[];
  name?: string;
}

interface InboundProxies
  extends Create<InboundProxy, CreateInboundProxy>,
    Retrieve<InboundProxy>,
    Update<InboundProxy, UpdateInboundProxy>,
    Delete,
    List<InboundProxy, ListInboundProxyQuery> {}

export type { InboundProxies, ListInboundProxyQuery };
