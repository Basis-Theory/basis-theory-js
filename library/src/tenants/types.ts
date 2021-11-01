import type { Auditable } from '../types';

interface Tenant extends Auditable {
  id: string;
  ownerId: string;
  name: string;
}

type UpdateTenantModel = Pick<Tenant, 'name'>;

interface TenantUsageReport {
  tokenReport: TokenReport;
}

interface TokenReport {
  metricsByType: Record<string, TokenTypeMetrics>;
  monthlyActiveTokens: number;
}

interface TokenTypeMetrics {
  count: number;
  lastCreatedAt?: string;
}

export type {
  Tenant,
  UpdateTenantModel,
  TenantUsageReport,
  TokenReport,
  TokenTypeMetrics,
};
