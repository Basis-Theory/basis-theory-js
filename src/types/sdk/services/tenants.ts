import type {
  CreateTenantInvitation,
  Tenant,
  TenantInvitation,
  TenantMember,
  TenantUsageReport,
  UpdateTenant,
} from '@/types/models';
import type { PaginatedList, RequestOptions } from './shared';
import { PaginatedQuery } from './shared';

interface ListTenantInvitationsQuery extends PaginatedQuery {
  status?: 'PENDING' | 'EXPIRED';
}

interface ListTenantMembersQuery extends PaginatedQuery {
  userId?: string | string[];
}

interface Tenants {
  retrieve(options?: RequestOptions): Promise<Tenant>;
  update(model: UpdateTenant, options?: RequestOptions): Promise<Tenant>;
  delete(options?: RequestOptions): Promise<void>;
  retrieveUsageReport(options?: RequestOptions): Promise<TenantUsageReport>;

  createInvitation(
    model: CreateTenantInvitation,
    options?: RequestOptions
  ): Promise<TenantInvitation>;
  resendInvitation(
    invitationId: string,
    options?: RequestOptions
  ): Promise<TenantInvitation>;
  listInvitations(
    query?: ListTenantInvitationsQuery,
    options?: RequestOptions
  ): Promise<PaginatedList<TenantInvitation>>;
  retrieveInvitation(
    invitationId: string,
    options?: RequestOptions
  ): Promise<TenantInvitation>;
  deleteInvitation(
    invitationId: string,
    options?: RequestOptions
  ): Promise<void>;

  listMembers(
    query?: ListTenantMembersQuery,
    options?: RequestOptions
  ): Promise<PaginatedList<TenantMember>>;
  deleteMember(memberId: string, options?: RequestOptions): Promise<void>;
}

export type { Tenants, ListTenantInvitationsQuery, ListTenantMembersQuery };
