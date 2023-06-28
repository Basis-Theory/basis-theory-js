import type {
  CreateReactor,
  UpdateReactor,
  Reactor,
  DataObject,
  ReactResponse,
  PatchReactor,
} from '@/types/models';
import type {
  Create,
  Delete,
  List,
  PaginatedQuery,
  Retrieve,
  Update,
  Patch,
  RequestOptions,
} from './shared';

interface ListReactorQuery extends PaginatedQuery {
  id?: string | string[];
  name?: string;
}

interface ReactRequest {
  args: DataObject;
  callbackUrl?: string;
  timeoutMs?: number;
}

interface Reactors
  extends Create<Reactor, CreateReactor>,
    Retrieve<Reactor>,
    Update<Reactor, UpdateReactor>,
    Patch<PatchReactor>,
    Delete,
    List<Reactor, ListReactorQuery> {
  react(
    reactorId: string,
    request: ReactRequest,
    options?: RequestOptions
  ): Promise<ReactResponse>;
}

export type { ListReactorQuery, Reactors, ReactRequest };
