import type {
  Application,
  CreateApplication,
  UpdateApplication,
} from '@/types/models';
import type {
  Create,
  Delete,
  List,
  PaginatedQuery,
  RequestOptions,
  Retrieve,
  Update,
} from './shared';

interface ListApplicationsQuery extends PaginatedQuery {
  id?: string | string[];
}

interface Applications
  extends Create<Application, CreateApplication>,
    Retrieve<Application>,
    Update<Application, UpdateApplication>,
    Delete,
    List<Application, ListApplicationsQuery> {
  retrieveByKey(options?: RequestOptions): Promise<Application>;
  regenerateKey(id: string, options?: RequestOptions): Promise<Application>;
}

export type { Applications, ListApplicationsQuery };
