import type {
  Tenant,
  TenantUsageReport,
  UpdateTenant,
  CreateTenantInvitation,
  TenantInvitation,
  TenantMember,
} from '@basis-theory/basis-theory-elements-interfaces/models';
import type { RequestOptions } from '@basis-theory/basis-theory-elements-interfaces/sdk/services';
import type { PaginatedList } from '@basis-theory/basis-theory-elements-interfaces/sdk/services/shared';
import type {
  ListTenantInvitationsQuery,
  ListTenantMembersQuery,
} from '@basis-theory/basis-theory-elements-interfaces/sdk/services/tenants';
import { createRequestConfig, dataExtractor, getQueryParams } from '../common';
import { BasisTheoryService } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';

export const BasisTheoryTenants = new CrudBuilder(
  class BasisTheoryTenants extends BasisTheoryService {
    public retrieve(options?: RequestOptions): Promise<Tenant> {
      return this.client
        .get('/', createRequestConfig(options))
        .then(dataExtractor);
    }

    public update(
      model: UpdateTenant,
      options?: RequestOptions
    ): Promise<Tenant> {
      return this.client
        .put('/', model, createRequestConfig(options))
        .then(dataExtractor);
    }

    public async delete(options?: RequestOptions): Promise<void> {
      await this.client.delete('/', createRequestConfig(options));
    }

    public retrieveUsageReport(
      options?: RequestOptions
    ): Promise<TenantUsageReport> {
      return this.client
        .get('/reports/usage', createRequestConfig(options))
        .then(dataExtractor);
    }

    public createInvitation(
      model: CreateTenantInvitation,
      options?: RequestOptions
    ): Promise<TenantInvitation> {
      return this.client
        .post('/invitations', model, createRequestConfig(options))
        .then(dataExtractor);
    }

    public resendInvitation(
      invitationId: string,
      options?: RequestOptions
    ): Promise<TenantInvitation> {
      return this.client
        .post(
          `/invitations/${invitationId}/resend`,
          {},
          createRequestConfig(options)
        )
        .then(dataExtractor);
    }

    public listInvitations(
      query?: ListTenantInvitationsQuery,
      options?: RequestOptions
    ): Promise<PaginatedList<TenantInvitation>> {
      const url = `/invitations${getQueryParams(query)}`;

      return this.client
        .get(url, createRequestConfig(options))
        .then(dataExtractor);
    }

    public retrieveInvitation(
      invitationId: string,
      options?: RequestOptions
    ): Promise<TenantInvitation> {
      return this.client
        .get(`/invitations/${invitationId}`, createRequestConfig(options))
        .then(dataExtractor);
    }

    public async deleteInvitation(
      invitationId: string,
      options?: RequestOptions
    ): Promise<void> {
      await this.client.delete(
        `/invitations/${invitationId}`,
        createRequestConfig(options)
      );
    }

    public listMembers(
      query?: ListTenantMembersQuery,
      options?: RequestOptions
    ): Promise<PaginatedList<TenantMember>> {
      const url = `/members${getQueryParams(query)}`;

      return this.client
        .get(url, createRequestConfig(options))
        .then(dataExtractor);
    }

    public async deleteMember(
      memberId: string,
      options?: RequestOptions
    ): Promise<void> {
      await this.client.delete(
        `/members/${memberId}`,
        createRequestConfig(options)
      );
    }
  }
).build();

export type BasisTheoryTenants = InstanceType<typeof BasisTheoryTenants>;
