import type { PaginatedQuery } from '../service';

interface Log {
  tenantId: string;
  applicationId: string;
  entityType: string;
  entityId: string;
  operation: string;
  message: string;
  createdAt: string;
}

interface LogQuery extends PaginatedQuery {
  entityType?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
}

export { Log, LogQuery };
