import type { Log } from '@/interfaces/models';
import type { List, PaginatedQuery } from './shared';

interface ListLogQuery extends PaginatedQuery {
  entityType?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
}

type Logs = List<Log, ListLogQuery>;

export type { ListLogQuery, Logs };
