import type {
  Tenant,
  TenantUsageReport,
  UpdateTenant,
} from '@basis-theory/basis-theory-elements-interfaces/models';
import type { RequestOptions } from '@basis-theory/basis-theory-elements-interfaces/sdk/services';
import { createRequestConfig, dataExtractor } from '../common';
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
  }
).build();

export type BasisTheoryTenants = InstanceType<typeof BasisTheoryTenants>;
