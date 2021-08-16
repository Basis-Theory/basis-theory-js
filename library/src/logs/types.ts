import type { PaginatedQuery } from '../service';

export interface Log {
  tenantId: string;
  applicationId: string;
  entityType: string;
  entityId: string;
  operation: string;
  message: string;
  createdAt: string;
}

export interface LogQuery extends PaginatedQuery {
  entityType?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
}
