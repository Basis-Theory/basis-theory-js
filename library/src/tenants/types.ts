interface Tenant {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
}

type UpdateTenantModel = Pick<Tenant, 'name'>;

interface TenantUsageReport {
  tokenReport: TokenReport;
}

interface TokenReport {
  enrichmentLimit?: number;
  freeEnrichedTokenLimit?: number;
  metricsByType: Record<string, TokenTypeMetrics>;
  numberOfEnrichedTokens: number;
  numberOfEnrichments: number;
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
