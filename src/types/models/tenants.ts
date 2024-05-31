import type { Auditable } from './shared';

interface Tenant extends Auditable {
  id: string;
  ownerId: string;
  name: string;
  settings?: Record<string, string>;
}

type UpdateTenant = Pick<Tenant, 'name' | 'settings'>;

interface TenantUsageReport {
  tokenReport: TokenReport;
}

interface TokenReport {
  totalTokens: number;
  includedMonthlyActiveTokens: number;
  monthlyActiveTokens: number;
}

interface TokenTypeMetrics {
  count: number;
  lastCreatedAt?: string;
}

interface TenantInvitation extends Auditable {
  id: string;
  tenantId: string;
  email: string;
  status: string;
  expiresAt: string;
}

type CreateTenantInvitation = Pick<TenantInvitation, 'email'>;

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

interface TenantMember extends Auditable {
  id: string;
  tenantId: string;
  user: User;
  role: string;
}

export type {
  Tenant,
  UpdateTenant,
  TenantUsageReport,
  TokenReport,
  TokenTypeMetrics,
  TenantInvitation,
  CreateTenantInvitation,
  TenantMember,
  User,
};
